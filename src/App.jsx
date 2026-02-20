// // src/App.jsx — SelfScope Phase 2: Full local state + localStorage
// import { useState } from "react";
// import { useAppData } from "./hooks/useAppData";
// import { useToast, Toast } from "./components/Toast";
// import { style } from "./styles";
// import Dashboard from "./pages/Dashboard";
// import Journal from "./pages/Journal";
// import MorningLog from "./pages/MorningLog";
// import Expenses from "./pages/Expenses";
// import Goals from "./pages/Goals";
// import Analytics from "./pages/Analytics";
// import Settings from "./pages/Settings";

// const NAV = [
//   { id: "dashboard", label: "Dashboard", icon: "⌂", group: "OVERVIEW" },
//   { id: "journal",   label: "Journal",   icon: "✦", group: "OVERVIEW" },
//   { id: "morning",   label: "Morning Log",icon: "◐", group: "TRACKING" },
//   { id: "expenses",  label: "Expenses",  icon: "◈", group: "TRACKING" },
//   { id: "goals",     label: "Goals",     icon: "◎", group: "PLANNING" },
//   { id: "analytics", label: "Analytics", icon: "⧖", group: "INSIGHTS" },
//   { id: "settings",  label: "Settings",  icon: "⊙", group: "SYSTEM" },
// ];

// const PAGE_META = {
//   dashboard: ["Dashboard", "Your life at a glance"],
//   journal:   ["Journal", "Thoughts, ideas & reflections"],
//   morning:   ["Morning Log", "Wake tracker & daily intentions"],
//   expenses:  ["Expenses", "Track every rupee"],
//   goals:     ["Goals", "Set targets. Track progress. Achieve."],
//   analytics: ["Analytics", "Patterns, trends & insights"],
//   settings:  ["Settings", "Preferences & data management"],
// };

// const PAGES = { Dashboard, Journal, MorningLog, Expenses, Goals, Analytics, Settings };
// const PAGE_IDS = { dashboard: "Dashboard", journal: "Journal", morning: "MorningLog", expenses: "Expenses", goals: "Goals", analytics: "Analytics", settings: "Settings" };

// export default function App() {
//   const [page, setPage] = useState("dashboard");
//   const data = useAppData();
//   const { toast, showToast } = useToast();

//   const now = new Date();
//   const groups = [...new Set(NAV.map((n) => n.group))];
//   const [title, subtitle] = PAGE_META[page];
//   const PageComp = PAGES[PAGE_IDS[page]];

//   return (
//     <>
//       <style>{style}</style>
//       <div className="app">
//         {/* Sidebar */}
//         <aside className="sidebar">
//           <div className="sidebar-logo">
//             <div className="logo-title">SelfScope</div>
//             <div className="logo-sub">Personal Life OS</div>
//           </div>
//           <div className="sidebar-date">
//             <div className="sidebar-date-day">{now.getDate()}</div>
//             <div className="sidebar-date-rest">
//               {now.toLocaleString("default", { weekday: "long" })},{" "}
//               {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
//             </div>
//           </div>
//           <nav className="sidebar-nav">
//             {groups.map((g) => (
//               <div key={g}>
//                 <div className="nav-section-label">{g}</div>
//                 {NAV.filter((n) => n.group === g).map((n) => (
//                   <div
//                     key={n.id}
//                     className={`nav-item ${page === n.id ? "active" : ""}`}
//                     onClick={() => setPage(n.id)}
//                   >
//                     <span className="nav-icon">{n.icon}</span>
//                     {n.label}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </nav>
//           <div className="sidebar-footer">
//             <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--dim)", textAlign: "center", marginBottom: 10, letterSpacing: 1 }}>
//               PHASE 2 · LOCAL STORAGE
//             </div>
//             <button
//               className="sync-btn"
//               onClick={() => { showToast("Google Sheets sync coming in Phase 3!"); }}
//             >
//               ⟳ &nbsp;SYNC WITH SHEETS
//             </button>
//           </div>
//         </aside>

//         {/* Main */}
//         <div className="main">
//           <div className="topbar">
//             <div>
//               <div className="page-title">{title}</div>
//               <div className="page-subtitle">{subtitle}</div>
//             </div>
//             <div className="topbar-actions">
//               {page === "journal"   && <button className="btn btn-primary" onClick={() => document.querySelector("textarea")?.focus()}>+ New Entry</button>}
//               {page === "expenses"  && <button className="btn btn-primary" onClick={() => { setPage("expenses"); }}>+ Add Expense</button>}
//               {page === "goals"     && <button className="btn btn-primary" onClick={() => document.querySelector(".btn-primary[style*='border-radius: 50%']")?.click()}>+ New Goal</button>}
//               {page === "morning"   && <button className="btn btn-primary" onClick={() => document.querySelector("input[type='time']")?.focus()}>+ Log Today</button>}
//               <button className="btn btn-ghost" onClick={() => setPage("settings")}>⊙ Settings</button>
//             </div>
//           </div>

//           <div className="content">
//             <PageComp data={data} showToast={showToast} />
//           </div>
//         </div>

//         <Toast toast={toast} />
//       </div>
//     </>
//   );
// }


//App phase 3: Google Sheets sync + cloud storage, using the same local state structure as phase 2 for seamless integration. See src/hooks/useSyncedData.js for the syncing logic, and src/utils/sheetsConfig.js for the Sheets configuration and data mapping.



// src/App.jsx — SelfScope Phase 3: Google Sheets sync
// import { useState } from "react";
// import { useSyncedData } from "./hooks/useSyncedData";
// import { useToast, Toast } from "./components/Toast";
// import { style } from "./styles";
// import Dashboard from "./pages/Dashboard";
// import Journal from "./pages/Journal";
// import MorningLog from "./pages/MorningLog";
// import Expenses from "./pages/Expenses";
// import Goals from "./pages/Goals";
// import Analytics from "./pages/Analytics";
// import Settings from "./pages/Settings";

// const NAV = [
//   { id: "dashboard", label: "Dashboard", icon: "⌂", group: "OVERVIEW" },
//   { id: "journal",   label: "Journal",   icon: "✦", group: "OVERVIEW" },
//   { id: "morning",   label: "Morning Log",icon: "◐", group: "TRACKING" },
//   { id: "expenses",  label: "Expenses",  icon: "◈", group: "TRACKING" },
//   { id: "goals",     label: "Goals",     icon: "◎", group: "PLANNING" },
//   { id: "analytics", label: "Analytics", icon: "⧖", group: "INSIGHTS" },
//   { id: "settings",  label: "Settings",  icon: "⊙", group: "SYSTEM" },
// ];

// const PAGE_META = {
//   dashboard: ["Dashboard", "Your life at a glance"],
//   journal:   ["Journal", "Thoughts, ideas & reflections"],
//   morning:   ["Morning Log", "Wake tracker & daily intentions"],
//   expenses:  ["Expenses", "Track every rupee"],
//   goals:     ["Goals", "Set targets. Track progress. Achieve."],
//   analytics: ["Analytics", "Patterns, trends & insights"],
//   settings:  ["Settings", "Preferences & data management"],
// };

// const PAGES = { Dashboard, Journal, MorningLog, Expenses, Goals, Analytics, Settings };
// const PAGE_IDS = { dashboard: "Dashboard", journal: "Journal", morning: "MorningLog", expenses: "Expenses", goals: "Goals", analytics: "Analytics", settings: "Settings" };

// export default function App() {
//   const [page, setPage] = useState("dashboard");
//   const data = useSyncedData();
//   const { toast, showToast } = useToast();

//   const now = new Date();
//   const groups = [...new Set(NAV.map((n) => n.group))];
//   const [title, subtitle] = PAGE_META[page];
//   const PageComp = PAGES[PAGE_IDS[page]];

//   return (
//     <>
//       <style>{style}</style>
//       <div className="app">
//         {/* Sidebar */}
//         <aside className="sidebar">
//           <div className="sidebar-logo">
//             <div className="logo-title">SelfScope</div>
//             <div className="logo-sub">Personal Life OS</div>
//           </div>
//           <div className="sidebar-date">
//             <div className="sidebar-date-day">{now.getDate()}</div>
//             <div className="sidebar-date-rest">
//               {now.toLocaleString("default", { weekday: "long" })},{" "}
//               {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
//             </div>
//           </div>
//           <nav className="sidebar-nav">
//             {groups.map((g) => (
//               <div key={g}>
//                 <div className="nav-section-label">{g}</div>
//                 {NAV.filter((n) => n.group === g).map((n) => (
//                   <div
//                     key={n.id}
//                     className={`nav-item ${page === n.id ? "active" : ""}`}
//                     onClick={() => setPage(n.id)}
//                   >
//                     <span className="nav-icon">{n.icon}</span>
//                     {n.label}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </nav>
//           <div className="sidebar-footer">
//             <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--dim)", textAlign: "center", marginBottom: 10, letterSpacing: 1 }}>
//               {data.sheets?.isConnected ? "PHASE 3 · SHEETS SYNCED" : "PHASE 3 · LOCAL ONLY"}
//             </div>
//             <button
//               className="sync-btn"
//               style={data.sheets?.isConnected ? { borderColor: "var(--teal)", color: "var(--teal)" } : {}}
//               onClick={() => {
//                 if (!data.sheets?.isConnected) {
//                   setPage("settings");
//                   showToast("Connect Google Sheets in Settings →");
//                 } else {
//                   data.sheets.pullFromSheets();
//                   showToast("Syncing with Sheets…");
//                 }
//               }}
//             >
//               {data.sheets?.isLoading ? "⟳ Syncing…" : data.sheets?.isConnected ? "⟳ SYNC NOW" : "⟳ CONNECT SHEETS"}
//             </button>
//           </div>
//         </aside>

//         {/* Main */}
//         <div className="main">
//           <div className="topbar">
//             <div>
//               <div className="page-title">{title}</div>
//               <div className="page-subtitle">{subtitle}</div>
//             </div>
//             <div className="topbar-actions">
//               {page === "journal"   && <button className="btn btn-primary" onClick={() => document.querySelector("textarea")?.focus()}>+ New Entry</button>}
//               {page === "expenses"  && <button className="btn btn-primary" onClick={() => { setPage("expenses"); }}>+ Add Expense</button>}
//               {page === "goals"     && <button className="btn btn-primary" onClick={() => document.querySelector(".btn-primary[style*='border-radius: 50%']")?.click()}>+ New Goal</button>}
//               {page === "morning"   && <button className="btn btn-primary" onClick={() => document.querySelector("input[type='time']")?.focus()}>+ Log Today</button>}
//               <button className="btn btn-ghost" onClick={() => setPage("settings")}>⊙ Settings</button>
//             </div>
//           </div>

//           <div className="content">
//             <PageComp data={data} showToast={showToast} />
//           </div>
//         </div>

//         <Toast toast={toast} />
//       </div>
//     </>
//   );
// }




// implementing PWA features in src/App-pwa.jsx, such as service worker registration for offline support and faster load times. The core app structure and syncing logic with Google Sheets remains the same as in src/App.jsx, ensuring a seamless user experience whether online or offline.

// src/App.jsx — SelfScope Phase 3: Google Sheets sync
import { useState } from "react";
import { useSyncedData } from "./hooks/useSyncedData";
import { useToast, Toast } from "./components/Toast";
import { style, mobileStyle } from "./styles";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import MorningLog from "./pages/MorningLog";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⌂", group: "OVERVIEW" },
  { id: "journal",   label: "Journal",   icon: "✦", group: "OVERVIEW" },
  { id: "morning",   label: "Morning Log",icon: "◐", group: "TRACKING" },
  { id: "expenses",  label: "Expenses",  icon: "◈", group: "TRACKING" },
  { id: "goals",     label: "Goals",     icon: "◎", group: "PLANNING" },
  { id: "analytics", label: "Analytics", icon: "⧖", group: "INSIGHTS" },
  { id: "settings",  label: "Settings",  icon: "⊙", group: "SYSTEM" },
];

const PAGE_META = {
  dashboard: ["Dashboard", "Your life at a glance"],
  journal:   ["Journal", "Thoughts, ideas & reflections"],
  morning:   ["Morning Log", "Wake tracker & daily intentions"],
  expenses:  ["Expenses", "Track every rupee"],
  goals:     ["Goals", "Set targets. Track progress. Achieve."],
  analytics: ["Analytics", "Patterns, trends & insights"],
  settings:  ["Settings", "Preferences & data management"],
};

const PAGES = { Dashboard, Journal, MorningLog, Expenses, Goals, Analytics, Settings };
const PAGE_IDS = { dashboard: "Dashboard", journal: "Journal", morning: "MorningLog", expenses: "Expenses", goals: "Goals", analytics: "Analytics", settings: "Settings" };

export default function App() {
  const [page, setPage] = useState("dashboard");
  const data = useSyncedData();
  const { toast, showToast } = useToast();

  const now = new Date();
  const groups = [...new Set(NAV.map((n) => n.group))];
  const [title, subtitle] = PAGE_META[page];
  const PageComp = PAGES[PAGE_IDS[page]];

  return (
    <>
      <style>{style}{mobileStyle}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-title">SelfScope</div>
            <div className="logo-sub">Personal Life OS</div>
          </div>
          <div className="sidebar-date">
            <div className="sidebar-date-day">{now.getDate()}</div>
            <div className="sidebar-date-rest">
              {now.toLocaleString("default", { weekday: "long" })},{" "}
              {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
            </div>
          </div>
          <nav className="sidebar-nav">
            {groups.map((g) => (
              <div key={g}>
                <div className="nav-section-label">{g}</div>
                {NAV.filter((n) => n.group === g).map((n) => (
                  <div
                    key={n.id}
                    className={`nav-item ${page === n.id ? "active" : ""}`}
                    onClick={() => setPage(n.id)}
                  >
                    <span className="nav-icon">{n.icon}</span>
                    {n.label}
                  </div>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--dim)", textAlign: "center", marginBottom: 10, letterSpacing: 1 }}>
              {data.sheets?.isConnected ? "PHASE 3 · SHEETS SYNCED" : "PHASE 3 · LOCAL ONLY"}
            </div>
            <button
              className="sync-btn"
              style={data.sheets?.isConnected ? { borderColor: "var(--teal)", color: "var(--teal)" } : {}}
              onClick={() => {
                if (!data.sheets?.isConnected) {
                  setPage("settings");
                  showToast("Connect Google Sheets in Settings →");
                } else {
                  data.sheets.pullFromSheets();
                  showToast("Syncing with Sheets…");
                }
              }}
            >
              {data.sheets?.isLoading ? "⟳ Syncing…" : data.sheets?.isConnected ? "⟳ SYNC NOW" : "⟳ CONNECT SHEETS"}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="page-title">{title}</div>
              <div className="page-subtitle">{subtitle}</div>
            </div>
            <div className="topbar-actions">
              {page === "journal"   && <button className="btn btn-primary" onClick={() => document.querySelector("textarea")?.focus()}>+ New Entry</button>}
              {page === "expenses"  && <button className="btn btn-primary" onClick={() => { setPage("expenses"); }}>+ Add Expense</button>}
              {page === "goals"     && <button className="btn btn-primary" onClick={() => document.querySelector(".btn-primary[style*='border-radius: 50%']")?.click()}>+ New Goal</button>}
              {page === "morning"   && <button className="btn btn-primary" onClick={() => document.querySelector("input[type='time']")?.focus()}>+ Log Today</button>}
              <button className="btn btn-ghost" onClick={() => setPage("settings")}>⊙ Settings</button>
            </div>
          </div>

          <div className="content">
            <PageComp data={data} showToast={showToast} />
          </div>
        </div>

        <Toast toast={toast} />

        {/* Mobile Bottom Nav */}
        <nav className="bottom-nav">
          {[
            { id: "dashboard", icon: "⌂", label: "Home" },
            { id: "journal",   icon: "✦", label: "Journal" },
            { id: "expenses",  icon: "◈", label: "Expenses" },
            { id: "goals",     icon: "◎", label: "Goals" },
            { id: "settings",  icon: "⊙", label: "More" },
          ].map((n) => (
            <div
              key={n.id}
              className={`bottom-nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span className="bottom-nav-icon">{n.icon}</span>
              <span className="bottom-nav-label">{n.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}