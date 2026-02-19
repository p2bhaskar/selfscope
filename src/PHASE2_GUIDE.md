# SelfScope — Phase 2 Integration Guide

## What's built in this phase
- Full local state for all 6 modules (Journal, Expenses, Morning Log, Goals, Analytics, Dashboard)
- localStorage persistence — nothing is lost on refresh
- Real CRUD: add, delete, filter on every page
- Analytics derived from your real data (not hardcoded)
- Toast notifications for all actions
- Modal confirmations for destructive deletes
- JSON export/backup in Settings

---

## File Structure

```
src/
├── App.jsx                  ← Main shell (sidebar, routing, topbar)
├── styles.js                ← All CSS in one place
├── hooks/
│   └── useAppData.js        ← All state + localStorage + actions
├── components/
│   └── Toast.jsx            ← Notification component
└── pages/
    ├── Dashboard.jsx        ← Live stats from real data
    ├── Journal.jsx          ← Add/delete/filter entries
    ├── MorningLog.jsx       ← Log wake + 28-day visual
    ├── Expenses.jsx         ← Add/delete/view by category
    ├── Goals.jsx            ← Add goals, toggle milestones, update %
    ├── Analytics.jsx        ← Real charts + auto insights
    └── Settings.jsx         ← Prefs, data stats, export, danger zone
```

---

## How to drop these files into your project

1. Replace `src/App.jsx` with the new one
2. Add all new files to their respective folders (create `pages/`, `hooks/`, `components/` dirs inside `src/`)
3. Delete the old `src/main.jsx` content if it imports differently — it should just be:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

4. Run `npm run dev` — everything should work immediately

---

## Key behaviours

| Feature | How it works |
|---|---|
| Seed data | Shows on first launch, disappears once you clear via Settings |
| localStorage keys | `ss_journal`, `ss_expenses`, `ss_morning`, `ss_goals`, `ss_prefs` |
| Data export | Settings → Export JSON Backup → downloads a `.json` file |
| Delete confirmation | Every delete shows a modal — no accidental data loss |
| Goal progress | Click the % number on a goal card to edit it inline |
| Milestone toggle | Click any milestone row to mark done/undone |

---

## What's NOT yet in Phase 2 (coming in Phase 3)
- Google Sheets sync (the Sync button shows a "coming soon" toast)
- Import from JSON backup
- Cross-device access

---

## Phase 3 preview
- Google OAuth + GIS library
- `useSheets.js` hook — wraps all Sheets API v4 calls
- All data writes go to Sheets after local state update
- First load fetches from Sheets as source of truth
