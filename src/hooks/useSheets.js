// src/hooks/useSheets.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom hook that wraps all Google Sheets API v4 operations.
// Uses Google Identity Services (GIS) for OAuth 2.0.
// Token is stored in memory only (never localStorage) for security.
//
// INTERFACE EXPOSED:
//   isConnected   boolean     — OAuth token is active
//   isLoading     boolean     — any network request in flight
//   error         string|null — last error message
//   syncStatus    object      — per-tab last-sync info
//   connect()                 — trigger Google OAuth popup
//   disconnect()              — revoke token + sign out
//   fetchTab(tab)             — read all rows from a tab → [{...}, ...]
//   appendRow(tab, obj)       — append one row to tab
//   updateRow(tab, rowIndex, obj) — overwrite specific row (1-based index)
//   deleteRow(tab, rowIndex)  — clear specific row
//   batchFetchAll()           — fetch journal, expenses, goals, morning in parallel
//   saveSettings(kvPairs)     — write key-value pairs to settings tab
//   loadSettings()            — read settings tab → {key: value}
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from "react";
import { CLIENT_ID, SPREADSHEET_ID, SCOPES, TABS, rowToObject, objectToRow, tabRange, rowRange } from "../utils/sheetsConfig";

const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

export function useSheets() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [syncStatus, setSyncStatus] = useState({});

  // Token stored in ref — never persisted to localStorage
  const tokenRef    = useRef(null);
  const clientRef   = useRef(null); // GIS token client

  // ── Internal: authenticated fetch ─────────────────────────────────────────
  const apiFetch = useCallback(async (url, options = {}) => {
    if (!tokenRef.current) throw new Error("Not authenticated");
    const res = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${tokenRef.current}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error?.message || `HTTP ${res.status}`);
    }
    return res.json();
  }, []);

  // ── Load GIS library dynamically ──────────────────────────────────────────
  const loadGIS = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) { resolve(); return; }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
      document.head.appendChild(script);
    });
  }, []);

  // ── Connect — triggers OAuth popup ────────────────────────────────────────
  const connect = useCallback(async () => {
    if (!CLIENT_ID) {
      setError("VITE_GOOGLE_CLIENT_ID is not set in your .env file");
      return;
    }
    if (!SPREADSHEET_ID) {
      setError("VITE_SPREADSHEET_ID is not set in your .env file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loadGIS();
      await new Promise((resolve, reject) => {
        clientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            if (tokenResponse.error) {
              reject(new Error(tokenResponse.error));
              return;
            }
            tokenRef.current = tokenResponse.access_token;
            setIsConnected(true);

            // Auto-refresh before token expires (GIS tokens last 1hr)
            const expiresIn = (tokenResponse.expires_in || 3600) - 60;
            setTimeout(() => {
              clientRef.current?.requestAccessToken({ prompt: "" });
            }, expiresIn * 1000);

            resolve();
          },
          error_callback: (err) => reject(new Error(err.type || "OAuth failed")),
        });
        clientRef.current.requestAccessToken({ prompt: "consent" });
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadGIS]);

  // ── Disconnect ─────────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    if (tokenRef.current && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(tokenRef.current);
    }
    tokenRef.current = null;
    setIsConnected(false);
    setSyncStatus({});
  }, []);

  // ── Ensure the spreadsheet has the right tabs with headers ────────────────
  const ensureSheetStructure = useCallback(async () => {
    // Get existing sheets
    const meta = await apiFetch(`${SHEETS_BASE}/${SPREADSHEET_ID}?fields=sheets.properties.title`);
    const existing = meta.sheets.map((s) => s.properties.title);

    const tabHeaders = {
      [TABS.JOURNAL]:  ["id", "date", "title", "tag", "mood", "text"],
      [TABS.EXPENSES]: ["id", "date", "name", "category", "amount", "icon", "note"],
      [TABS.GOALS]:    ["id", "label", "title", "desc", "progress", "deadline", "accent", "milestones"],
      [TABS.MORNING]:  ["id", "date", "wakeTime", "sleepQuality", "sleepDuration", "intentions"],
      [TABS.SETTINGS]: ["key", "value"],
    };

    const sheetsToCreate = Object.keys(tabHeaders).filter((t) => !existing.includes(t));

    if (sheetsToCreate.length > 0) {
      // Batch create missing sheets
      await apiFetch(`${SHEETS_BASE}/${SPREADSHEET_ID}:batchUpdate`, {
        method: "POST",
        body: JSON.stringify({
          requests: sheetsToCreate.map((title) => ({
            addSheet: { properties: { title } },
          })),
        }),
      });

      // Write headers to new sheets
      await apiFetch(
        `${SHEETS_BASE}/${SPREADSHEET_ID}/values:batchUpdate`,
        {
          method: "POST",
          body: JSON.stringify({
            valueInputOption: "RAW",
            data: sheetsToCreate.map((tab) => ({
              range: `${tab}!A1`,
              values: [tabHeaders[tab]],
            })),
          }),
        }
      );
    }
  }, [apiFetch]);

  // ── fetchTab — reads all data rows (skips header row 1) ───────────────────
  const fetchTab = useCallback(async (tab) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${SHEETS_BASE}/${SPREADSHEET_ID}/values/${tabRange(tab)}`;
      const data = await apiFetch(url);
      const rows = data.values || [];
      // Skip header row (index 0), map remaining rows to objects
      const objects = rows.slice(1)
        .filter((row) => row[0]) // skip empty rows
        .map((row) => rowToObject(tab, row));
      setSyncStatus((prev) => ({ ...prev, [tab]: new Date().toISOString() }));
      return objects;
    } catch (err) {
      setError(`Failed to load ${tab}: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch]);

  // ── appendRow — adds one new row to the end of a tab ──────────────────────
  const appendRow = useCallback(async (tab, obj) => {
    setError(null);
    try {
      const row = objectToRow(tab, obj);
      await apiFetch(
        `${SHEETS_BASE}/${SPREADSHEET_ID}/values/${tab}!A:A:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
        {
          method: "POST",
          body: JSON.stringify({ values: [row] }),
        }
      );
    } catch (err) {
      setError(`Failed to save to ${tab}: ${err.message}`);
      throw err;
    }
  }, [apiFetch]);

  // ── updateRow — overwrites a specific row (1-based; row 1 = header) ───────
  const updateRow = useCallback(async (tab, rowIndex, obj) => {
    setError(null);
    try {
      const row = objectToRow(tab, obj);
      await apiFetch(
        `${SHEETS_BASE}/${SPREADSHEET_ID}/values/${rowRange(tab, rowIndex)}?valueInputOption=RAW`,
        {
          method: "PUT",
          body: JSON.stringify({ values: [row] }),
        }
      );
    } catch (err) {
      setError(`Failed to update ${tab} row ${rowIndex}: ${err.message}`);
      throw err;
    }
  }, [apiFetch]);

  // ── deleteRow — clears a row's content (leaves empty row, avoids row-index drift) ──
  const deleteRow = useCallback(async (tab, rowIndex) => {
    setError(null);
    try {
      await apiFetch(
        `${SHEETS_BASE}/${SPREADSHEET_ID}/values:batchClear`,
        {
          method: "POST",
          body: JSON.stringify({ ranges: [rowRange(tab, rowIndex)] }),
        }
      );
    } catch (err) {
      setError(`Failed to delete from ${tab}: ${err.message}`);
      throw err;
    }
  }, [apiFetch]);

  // ── batchFetchAll — parallel fetch of all data tabs ───────────────────────
  const batchFetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [journal, expenses, goals, morning] = await Promise.all([
        fetchTab(TABS.JOURNAL),
        fetchTab(TABS.EXPENSES),
        fetchTab(TABS.GOALS),
        fetchTab(TABS.MORNING),
      ]);
      return { journal, expenses, goals, morning };
    } catch (err) {
      setError(`Sync failed: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTab]);

  // ── saveSettings — writes key-value pairs to settings tab ─────────────────
  const saveSettings = useCallback(async (kvPairs) => {
    setError(null);
    try {
      const rows = Object.entries(kvPairs).map(([k, v]) => [k, String(v)]);
      // Clear existing settings then rewrite
      await apiFetch(
        `${SHEETS_BASE}/${SPREADSHEET_ID}/values:batchClear`,
        { method: "POST", body: JSON.stringify({ ranges: [`${TABS.SETTINGS}!A2:B1000`] }) }
      );
      if (rows.length > 0) {
        await apiFetch(
          `${SHEETS_BASE}/${SPREADSHEET_ID}/values/${TABS.SETTINGS}!A2?valueInputOption=RAW`,
          { method: "PUT", body: JSON.stringify({ values: rows }) }
        );
      }
    } catch (err) {
      setError(`Failed to save settings: ${err.message}`);
      throw err;
    }
  }, [apiFetch]);

  // ── loadSettings — reads settings tab → {key: value} ─────────────────────
  const loadSettings = useCallback(async () => {
    try {
      const rows = await fetchTab(TABS.SETTINGS);
      const result = {};
      rows.forEach((row) => { if (row.key) result[row.key] = row.value; });
      return result;
    } catch {
      return {};
    }
  }, [fetchTab]);

  return {
    // State
    isConnected, isLoading, error, syncStatus,
    // Auth
    connect, disconnect, ensureSheetStructure,
    // Data ops
    fetchTab, appendRow, updateRow, deleteRow,
    batchFetchAll, saveSettings, loadSettings,
    // Tab constants (convenience)
    TABS,
  };
}