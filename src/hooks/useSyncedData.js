// src/hooks/useSyncedData.js
// ─────────────────────────────────────────────────────────────────────────────
// Bridges useAppData (Phase 2 local state) with useSheets (Phase 3 cloud sync).
//
// Strategy: Write-through cache
//   1. Every write → update local state instantly (optimistic UI)
//   2. Every write → fire-and-forget push to Sheets
//   3. On first connect → pull from Sheets (source of truth), overwrite local
//
// Row-index tracking: We maintain a rowIndexMap so we know the Sheets row
// number for each record ID. This enables updateRow and deleteRow.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from "react";
import { useAppData, uuid } from "./useAppData";
import { useSheets }  from "./useSheets";
import { TABS } from "../utils/sheetsConfig";

export function useSyncedData() {
  const local  = useAppData();
  const sheets = useSheets();

  // Maps tab → { [id]: rowIndex }  (row 2 = first data row, header is row 1)
  const rowMapRef = useRef({ [TABS.JOURNAL]: {}, [TABS.EXPENSES]: {}, [TABS.GOALS]: {}, [TABS.MORNING]: {} });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync]   = useState(null);

  // ── Build row index map from fetched array ─────────────────────────────────
  const buildRowMap = (tab, items) => {
    const map = {};
    items.forEach((item, i) => {
      if (item.id) map[item.id] = i + 2; // +2 because row 1 is header
    });
    rowMapRef.current[tab] = map;
  };

  // ── Pull from Sheets → overwrite local state ───────────────────────────────
  const pullFromSheets = useCallback(async () => {
    setIsSyncing(true);
    try {
      await sheets.ensureSheetStructure();
      const remote = await sheets.batchFetchAll();
      if (!remote) return;

      // Build row index maps
      Object.entries(remote).forEach(([tab, items]) => {
        const tabKey = tab === "journal" ? TABS.JOURNAL
                     : tab === "expenses" ? TABS.EXPENSES
                     : tab === "goals"    ? TABS.GOALS
                     : TABS.MORNING;
        buildRowMap(tabKey, items);
      });

      // Overwrite local state with remote data
      // We do this by directly calling the internal setters via a trick:
      // useAppData exposes setters via the hook state — we reload from localStorage
      // by writing remote data there, then triggering a reload.
      if (remote.journal.length > 0)  localStorage.setItem("ss_journal",  JSON.stringify(remote.journal));
      if (remote.expenses.length > 0) localStorage.setItem("ss_expenses", JSON.stringify(remote.expenses));
      if (remote.goals.length > 0)    localStorage.setItem("ss_goals",    JSON.stringify(remote.goals));
      if (remote.morning.length > 0)  localStorage.setItem("ss_morning",  JSON.stringify(remote.morning));

      // Load remote settings into prefs
      const remotePrefs = await sheets.loadSettings();
      if (Object.keys(remotePrefs).length > 0) {
        local.updatePrefs(remotePrefs);
      }

      setLastSync(new Date());
      // Reload page to re-hydrate local state from updated localStorage
      window.location.reload();
    } finally {
      setIsSyncing(false);
    }
  }, [sheets, local]);

//   // ── Push all local data to Sheets (full overwrite) ─────────────────────────
//   const pushAllToSheets = useCallback(async () => {
//     setIsSyncing(true);
//     try {
//       await sheets.ensureSheetStructure();
//       // Push each tab sequentially
//       const pushTab = async (tab, items) => {
//         // Clear data rows first
//         await sheets.apiFetch?.(`https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_SPREADSHEET_ID}/values:batchClear`, {
//           method: "POST",
//           body: JSON.stringify({ ranges: [`${tab}!A2:Z10000`] }),
//         }).catch(() => {}); // ignore if clears fail
//         // Re-append all items
//         for (const item of items) {
//           await sheets.appendRow(tab, item);
//         }
//         buildRowMap(tab, items);
//       };
//       await Promise.all([
//         pushTab(TABS.JOURNAL,  local.journal),
//         pushTab(TABS.EXPENSES, local.expenses),
//         pushTab(TABS.GOALS,    local.goals),
//         pushTab(TABS.MORNING,  local.morning),
//       ]);
//       // Push settings
//       await sheets.saveSettings(local.prefs);
//       setLastSync(new Date());
//     } finally {
//       setIsSyncing(false);
//     }
//   }, [sheets, local]);


const pushAllToSheets = useCallback(async () => {
  setIsSyncing(true);
  try {
    await sheets.ensureSheetStructure();

    const pushTab = async (tab, items) => {
      // Clear data rows first
      await sheets.deleteRow(tab, "A2:Z10000");
      // Append all items one by one
      for (const item of items) {
        await sheets.appendRow(tab, item);
      }
      buildRowMap(tab, items);
    };

    await pushTab(TABS.JOURNAL,  local.journal);
    await pushTab(TABS.EXPENSES, local.expenses);
    await pushTab(TABS.GOALS,    local.goals);
    await pushTab(TABS.MORNING,  local.morning);
    await sheets.saveSettings(local.prefs);
    setLastSync(new Date());
  } finally {
    setIsSyncing(false);
  }
}, [sheets, local]);

  // ── Synced write helpers ───────────────────────────────────────────────────
  // Each returns the new item and silently pushes to Sheets if connected.

  const addJournal = useCallback(async (entry) => {
    const newItem = local.addJournal(entry);
    if (sheets.isConnected) {
      sheets.appendRow(TABS.JOURNAL, newItem).catch(console.warn);
    }
    return newItem;
  }, [local, sheets]);

  const deleteJournal = useCallback(async (id) => {
    const rowIndex = rowMapRef.current[TABS.JOURNAL][id];
    local.deleteJournal(id);
    if (sheets.isConnected && rowIndex) {
      sheets.deleteRow(TABS.JOURNAL, rowIndex).catch(console.warn);
    }
  }, [local, sheets]);

  const addExpense = useCallback(async (expense) => {
    const newItem = local.addExpense(expense);
    if (sheets.isConnected) {
      sheets.appendRow(TABS.EXPENSES, newItem).catch(console.warn);
    }
    return newItem;
  }, [local, sheets]);

  const deleteExpense = useCallback(async (id) => {
    const rowIndex = rowMapRef.current[TABS.EXPENSES][id];
    local.deleteExpense(id);
    if (sheets.isConnected && rowIndex) {
      sheets.deleteRow(TABS.EXPENSES, rowIndex).catch(console.warn);
    }
  }, [local, sheets]);

  const addMorning = useCallback(async (log) => {
    const newItem = local.addMorning(log);
    if (sheets.isConnected) {
      sheets.appendRow(TABS.MORNING, newItem).catch(console.warn);
    }
    return newItem;
  }, [local, sheets]);

  const deleteMorning = useCallback(async (id) => {
    const rowIndex = rowMapRef.current[TABS.MORNING][id];
    local.deleteMorning(id);
    if (sheets.isConnected && rowIndex) {
      sheets.deleteRow(TABS.MORNING, rowIndex).catch(console.warn);
    }
  }, [local, sheets]);

  const addGoal = useCallback(async (goal) => {
    const newItem = local.addGoal(goal);
    if (sheets.isConnected) {
      sheets.appendRow(TABS.GOALS, newItem).catch(console.warn);
    }
    return newItem;
  }, [local, sheets]);

  const updateGoalProgress = useCallback(async (id, progress) => {
    local.updateGoalProgress(id, progress);
    if (sheets.isConnected) {
      const rowIndex = rowMapRef.current[TABS.GOALS][id];
      const updatedGoal = local.goals.find((g) => g.id === id);
      if (rowIndex && updatedGoal) {
        sheets.updateRow(TABS.GOALS, rowIndex, { ...updatedGoal, progress }).catch(console.warn);
      }
    }
  }, [local, sheets]);

  const toggleMilestone = useCallback(async (goalId, milestoneId) => {
    local.toggleMilestone(goalId, milestoneId);
    if (sheets.isConnected) {
      const rowIndex = rowMapRef.current[TABS.GOALS][goalId];
      const goal = local.goals.find((g) => g.id === goalId);
      if (rowIndex && goal) {
        const updatedMilestones = goal.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        );
        sheets.updateRow(TABS.GOALS, rowIndex, { ...goal, milestones: updatedMilestones }).catch(console.warn);
      }
    }
  }, [local, sheets]);

  const deleteGoal = useCallback(async (id) => {
    const rowIndex = rowMapRef.current[TABS.GOALS][id];
    local.deleteGoal(id);
    if (sheets.isConnected && rowIndex) {
      sheets.deleteRow(TABS.GOALS, rowIndex).catch(console.warn);
    }
  }, [local, sheets]);

  const updatePrefs = useCallback(async (updates) => {
    local.updatePrefs(updates);
    if (sheets.isConnected) {
      sheets.saveSettings({ ...local.prefs, ...updates }).catch(console.warn);
    }
  }, [local, sheets]);

  return {
    // ── Local data (always available) ──────────────────────────────────────
    journal:  local.journal,
    expenses: local.expenses,
    morning:  local.morning,
    goals:    local.goals,
    prefs:    local.prefs,
    analytics: local.analytics,

    // ── Synced write ops ───────────────────────────────────────────────────
    addJournal, deleteJournal,
    addExpense, deleteExpense,
    addMorning, deleteMorning,
    addGoal, updateGoalProgress, toggleMilestone, deleteGoal,
    updatePrefs,

    // ── Sheets state ───────────────────────────────────────────────────────
    sheets: {
      isConnected: sheets.isConnected,
      isLoading:   sheets.isLoading || isSyncing,
      error:       sheets.error,
      lastSync,
      syncStatus:  sheets.syncStatus,
      connect:     sheets.connect,
      disconnect:  sheets.disconnect,
      pullFromSheets,
      pushAllToSheets,
    },
  };
}