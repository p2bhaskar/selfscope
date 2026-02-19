// src/utils/sheetsConfig.js
// ─────────────────────────────────────────────────────────────────────────────
// Central config for all Google Sheets tab names and column schemas.
// Edit SPREADSHEET_ID and CLIENT_ID here or via .env variables.
// ─────────────────────────────────────────────────────────────────────────────

export const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || "";

// OAuth scopes — read + write Google Sheets only
export const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// ── Tab names (must match your actual sheet tab names exactly) ───────────────
export const TABS = {
  JOURNAL:  "journal",
  EXPENSES: "expenses",
  GOALS:    "goals",
  MORNING:  "morning_log",
  SETTINGS: "settings",
};

// ── Column schemas — order matters (maps to spreadsheet columns A, B, C …) ──
// Each array defines the JS key names in column order.

export const COLS = {
  [TABS.JOURNAL]: [
    "id", "date", "title", "tag", "mood", "text",
  ],
  [TABS.EXPENSES]: [
    "id", "date", "name", "category", "amount", "icon", "note",
  ],
  [TABS.GOALS]: [
    "id", "label", "title", "desc", "progress", "deadline", "accent", "milestones",
  ],
  [TABS.MORNING]: [
    "id", "date", "wakeTime", "sleepQuality", "sleepDuration", "intentions",
  ],
  [TABS.SETTINGS]: ["key", "value"],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a row array → JS object using the column schema for that tab */
export function rowToObject(tab, row) {
  const keys = COLS[tab];
  const obj = {};
  keys.forEach((key, i) => {
    const raw = row[i] ?? "";
    // Parse JSON fields
    if (key === "milestones" || key === "intentions") {
      try { obj[key] = JSON.parse(raw); } catch { obj[key] = []; }
    } else if (key === "amount" || key === "progress") {
      obj[key] = Number(raw) || 0;
    } else {
      obj[key] = raw;
    }
  });
  return obj;
}

/** Convert a JS object → row array using the column schema for that tab */
export function objectToRow(tab, obj) {
  return COLS[tab].map((key) => {
    const val = obj[key] ?? "";
    if (key === "milestones" || key === "intentions") {
      return JSON.stringify(val);
    }
    return String(val);
  });
}

/** Range string for reading all rows in a tab */
export function tabRange(tab) {
  return `${tab}!A:${columnLetter(COLS[tab].length)}`;
}

function columnLetter(n) {
  // 1→A, 26→Z, 27→AA …
  let result = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    n = Math.floor((n - 1) / 26);
  }
  return result;
}

/** Row range for a specific 1-based row index */
export function rowRange(tab, rowIndex) {
  const last = columnLetter(COLS[tab].length);
  return `${tab}!A${rowIndex}:${last}${rowIndex}`;
}