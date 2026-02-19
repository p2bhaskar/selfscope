// // src/pages/Settings.jsx
// import { useState } from "react";

// export default function Settings({ data, showToast }) {
//   const { prefs, updatePrefs, journal, expenses, morning, goals } = data;

//   const [form, setForm] = useState({ ...prefs });
//   const [showClearConfirm, setShowClearConfirm] = useState(null);

//   const handleSave = () => {
//     updatePrefs(form);
//     showToast("Preferences saved ⊙");
//   };

//   const clearAll = (key) => {
//     const keys = { journal: "ss_journal", expenses: "ss_expenses", morning: "ss_morning", goals: "ss_goals" };
//     localStorage.removeItem(keys[key]);
//     window.location.reload();
//   };

//   const exportData = () => {
//     const payload = {
//       exportedAt: new Date().toISOString(),
//       journal,
//       expenses,
//       morning,
//       goals,
//       prefs,
//     };
//     const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `selfscope-backup-${new Date().toISOString().split("T")[0]}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//     showToast("Data exported");
//   };

//   return (
//     <div>
//       {/* Preferences */}
//       <div className="card" style={{ marginBottom: 16 }}>
//         <div className="card-header">
//           <div className="card-title">Preferences</div>
//           <div className="card-badge badge-gold">PERSONAL</div>
//         </div>

//         {[
//           { label: "YOUR NAME", key: "name", placeholder: "Your name" },
//           { label: "DEFAULT CURRENCY", key: "currency", placeholder: "₹" },
//           { label: "WAKE GOAL (TARGET TIME)", key: "wakeGoal", placeholder: "06:00", type: "time" },
//           { label: "MONTHLY BUDGET CAP", key: "monthlyBudget", placeholder: "10000", type: "number" },
//         ].map(({ label, key, placeholder, type }) => (
//           <div key={key} style={{ marginBottom: 12 }}>
//             <div className="section-heading">{label}</div>
//             <input
//               className="input-field"
//               type={type || "text"}
//               placeholder={placeholder}
//               value={form[key] || ""}
//               onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
//             />
//           </div>
//         ))}

//         <button className="btn btn-primary" onClick={handleSave}>Save Preferences →</button>
//       </div>

//       {/* Data Summary */}
//       <div className="card" style={{ marginBottom: 16 }}>
//         <div className="card-header">
//           <div className="card-title">Your Data</div>
//           <div className="card-badge badge-teal">LOCAL</div>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
//           {[
//             { label: "Journal Entries", count: journal.length, icon: "✦" },
//             { label: "Expenses", count: expenses.length, icon: "◈" },
//             { label: "Morning Logs", count: morning.length, icon: "◐" },
//             { label: "Goals", count: goals.length, icon: "◎" },
//           ].map(({ label, count, icon }) => (
//             <div key={label} style={{
//               padding: "14px",
//               background: "var(--surface2)",
//               borderRadius: 8,
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//             }}>
//               <span style={{ fontSize: 20 }}>{icon}</span>
//               <div>
//                 <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--text)", lineHeight: 1 }}>{count}</div>
//                 <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{label}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div style={{ display: "flex", gap: 10 }}>
//           <button className="btn btn-ghost" style={{ flex: 1 }} onClick={exportData}>
//             ↓ Export JSON Backup
//           </button>
//         </div>
//       </div>

//       {/* Google Sheets — Future */}
//       <div className="card" style={{ marginBottom: 16 }}>
//         <div className="card-header">
//           <div className="card-title">Google Sheets Integration</div>
//           <div className="card-badge" style={{ background: "rgba(107,114,128,0.15)", color: "var(--muted)" }}>
//             PHASE 3
//           </div>
//         </div>
//         <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 14 }}>
//           In Phase 3, SelfScope will sync all your data to a personal Google Sheet — giving you cloud backup,
//           cross-device access, and full data ownership. All configuration will appear here.
//         </div>
//         <div style={{
//           padding: "12px 16px",
//           background: "rgba(62,207,178,0.07)",
//           border: "1px solid rgba(62,207,178,0.2)",
//           borderRadius: 8,
//           fontSize: 12,
//           color: "var(--teal)",
//           fontFamily: "'DM Mono', monospace",
//         }}>
//           ◐ &nbsp;Coming in Phase 3 — Google OAuth + Sheets API v4
//         </div>
//       </div>

//       {/* Danger Zone */}
//       <div className="card" style={{ borderColor: "rgba(224,92,122,0.3)" }}>
//         <div className="card-header">
//           <div className="card-title" style={{ color: "var(--rose)" }}>Danger Zone</div>
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {[
//             { label: "Clear Journal", key: "journal", desc: `Delete all ${journal.length} journal entries` },
//             { label: "Clear Expenses", key: "expenses", desc: `Delete all ${expenses.length} expenses` },
//             { label: "Clear Morning Logs", key: "morning", desc: `Delete all ${morning.length} morning logs` },
//             { label: "Clear Goals", key: "goals", desc: `Delete all ${goals.length} goals` },
//           ].map(({ label, key, desc }) => (
//             <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--surface2)", borderRadius: 8 }}>
//               <div>
//                 <div style={{ fontSize: 13, color: "var(--text)" }}>{label}</div>
//                 <div style={{ fontSize: 11, color: "var(--muted)" }}>{desc}</div>
//               </div>
//               <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => setShowClearConfirm(key)}>
//                 Clear
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Confirm Clear Modal */}
//       {showClearConfirm && (
//         <div className="modal-overlay" onClick={() => setShowClearConfirm(null)}>
//           <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
//             <div className="modal-title" style={{ fontSize: 16, color: "var(--rose)" }}>
//               Clear {showClearConfirm}?
//             </div>
//             <p style={{ fontSize: 13, color: "var(--muted)" }}>
//               This will permanently delete all {showClearConfirm} data. The page will reload.
//             </p>
//             <div className="modal-footer">
//               <button className="btn btn-ghost" onClick={() => setShowClearConfirm(null)}>Cancel</button>
//               <button className="btn btn-danger" onClick={() => clearAll(showClearConfirm)}>Yes, Clear</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// Note: This page is currently a placeholder for future settings related to Google Sheets integration (Phase 3).

// src/pages/Settings.jsx — Phase 3 version with Google Sheets panel
import { useState } from "react";
import SheetsPanel from "../components/SheetsPanel";

export default function Settings({ data, showToast }) {
 const { prefs, updatePrefs, journal, expenses, morning, goals, sheets } = data;

  const [form, setForm] = useState({ ...prefs });
  const [showClearConfirm, setShowClearConfirm] = useState(null);

  const handleSave = () => {
    updatePrefs(form);
    showToast("Preferences saved ⊙");
  };

  const clearAll = (key) => {
    const keys = { journal: "ss_journal", expenses: "ss_expenses", morning: "ss_morning", goals: "ss_goals" };
    localStorage.removeItem(keys[key]);
    window.location.reload();
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      journal,
      expenses,
      morning,
      goals,
      prefs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selfscope-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported");
  };

  return (
    <div>
      {/* Preferences */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="card-title">Preferences</div>
          <div className="card-badge badge-gold">PERSONAL</div>
        </div>

        {[
          { label: "YOUR NAME", key: "name", placeholder: "Your name" },
          { label: "DEFAULT CURRENCY", key: "currency", placeholder: "₹" },
          { label: "WAKE GOAL (TARGET TIME)", key: "wakeGoal", placeholder: "06:00", type: "time" },
          { label: "MONTHLY BUDGET CAP", key: "monthlyBudget", placeholder: "10000", type: "number" },
        ].map(({ label, key, placeholder, type }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div className="section-heading">{label}</div>
            <input
              className="input-field"
              type={type || "text"}
              placeholder={placeholder}
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
            />
          </div>
        ))}

        <button className="btn btn-primary" onClick={handleSave}>Save Preferences →</button>
      </div>

      {/* Data Summary */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="card-title">Your Data</div>
          <div className="card-badge badge-teal">LOCAL</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Journal Entries", count: journal.length, icon: "✦" },
            { label: "Expenses", count: expenses.length, icon: "◈" },
            { label: "Morning Logs", count: morning.length, icon: "◐" },
            { label: "Goals", count: goals.length, icon: "◎" },
          ].map(({ label, count, icon }) => (
            <div key={label} style={{
              padding: "14px",
              background: "var(--surface2)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--text)", lineHeight: 1 }}>{count}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={exportData}>
            ↓ Export JSON Backup
          </button>
        </div>
      </div>

      {/* Google Sheets */}
      <SheetsPanel sheetsState={sheets} showToast={showToast} />

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: "rgba(224,92,122,0.3)" }}>
        <div className="card-header">
          <div className="card-title" style={{ color: "var(--rose)" }}>Danger Zone</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Clear Journal", key: "journal", desc: `Delete all ${journal.length} journal entries` },
            { label: "Clear Expenses", key: "expenses", desc: `Delete all ${expenses.length} expenses` },
            { label: "Clear Morning Logs", key: "morning", desc: `Delete all ${morning.length} morning logs` },
            { label: "Clear Goals", key: "goals", desc: `Delete all ${goals.length} goals` },
          ].map(({ label, key, desc }) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--surface2)", borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text)" }}>{label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{desc}</div>
              </div>
              <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => setShowClearConfirm(key)}>
                Clear
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Clear Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ fontSize: 16, color: "var(--rose)" }}>
              Clear {showClearConfirm}?
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              This will permanently delete all {showClearConfirm} data. The page will reload.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowClearConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => clearAll(showClearConfirm)}>Yes, Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
