// src/pages/Expenses.jsx
import { useState } from "react";

const CATEGORIES = [
  { label: "🍔 Food & Dining", key: "Food & Dining" },
  { label: "🚌 Transport", key: "Transport" },
  { label: "📚 Education", key: "Education" },
  { label: "🎮 Entertainment", key: "Entertainment" },
  { label: "🛒 Groceries", key: "Groceries" },
  { label: "💡 Utilities", key: "Utilities" },
  { label: "💊 Health", key: "Health" },
  { label: "📱 Subscriptions", key: "Subscriptions" },
  { label: "💰 Other", key: "Other" },
];

const CAT_COLORS = {
  "Food & Dining": "#e05c7a",
  "Transport": "#3ecfb2",
  "Education": "#c9a84c",
  "Entertainment": "#9b72cf",
  "Groceries": "#3ecfb2",
  "Utilities": "#c9a84c",
  "Health": "#3ecfb2",
  "Subscriptions": "#c9a84c",
  "Other": "#6b7280",
};

export default function Expenses({ data, showToast }) {
  const { expenses, addExpense, deleteExpense, prefs } = data;
  const cur = prefs.currency || "₹";

  const [tab, setTab] = useState("log");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = () => {
    if (!name.trim()) { showToast("Please enter an item name", "error"); return; }
    if (!amount || isNaN(amount) || Number(amount) <= 0) { showToast("Enter a valid amount", "error"); return; }
    addExpense({ name: name.trim(), amount: Number(amount), category, note, date: new Date(date).toISOString() });
    setName("");
    setAmount("");
    setNote("");
    showToast(`${cur}${amount} added`);
  };

  // Group by category for the categories tab
  const byCategory = {};
  expenses.forEach((e) => {
    if (!byCategory[e.category]) byCategory[e.category] = { total: 0, count: 0 };
    byCategory[e.category].total += Number(e.amount);
    byCategory[e.category].count++;
  });
  const totalAll = expenses.reduce((s, e) => s + Number(e.amount), 0);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div>
      <div className="tabs">
        {["log", "history", "categories"].map((t) => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {/* LOG TAB */}
      {tab === "log" && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <div className="card-title">Add Expense</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <div className="section-heading">ITEM NAME</div>
              <input
                className="input-field"
                placeholder="What did you spend on?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div>
              <div className="section-heading">AMOUNT ({cur})</div>
              <input
                className="input-field"
                placeholder="0"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div>
              <div className="section-heading">CATEGORY</div>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <div className="section-heading">DATE</div>
              <input
                className="input-field"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div className="section-heading">NOTE (OPTIONAL)</div>
            <input
              className="input-field"
              placeholder="Any context..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={handleAdd}>Add Expense →</button>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {(tab === "log" || tab === "history") && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">All Transactions</div>
            <div className="card-badge badge-rose">{expenses.length} ENTRIES</div>
          </div>
          {expenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <div className="empty-text">No expenses yet</div>
              <div className="empty-sub">Log your first expense above</div>
            </div>
          ) : (
            <div className="expense-list">
              {expenses.map((e) => (
                <div className="expense-item" key={e.id}>
                  <div className="expense-left">
                    <div
                      className="expense-icon"
                      style={{ background: `${CAT_COLORS[e.category] || "#6b7280"}20` }}
                    >
                      {e.icon}
                    </div>
                    <div>
                      <div className="expense-name">{e.name}</div>
                      <div className="expense-cat">
                        {e.category} · {formatDate(e.date)}
                        {e.note && <span style={{ marginLeft: 6, color: "var(--dim)" }}>· {e.note}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="expense-amount">{cur}{e.amount}</div>
                    <button
                      className="delete-btn"
                      onClick={() => setConfirmDelete(e.id)}
                      title="Delete"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {expenses.length > 0 && (
            <div style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
            }}>
              <span style={{ color: "var(--muted)" }}>Total logged</span>
              <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--rose)", fontWeight: 600 }}>
                {cur}{totalAll.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {tab === "categories" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Spend by Category</div>
            <div className="card-badge badge-rose">ALL TIME</div>
          </div>
          {Object.keys(byCategory).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <div className="empty-text">No expenses logged yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(byCategory)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([cat, { total, count }]) => {
                  const pct = totalAll > 0 ? Math.round((total / totalAll) * 100) : 0;
                  const color = CAT_COLORS[cat] || "#6b7280";
                  const catObj = CATEGORIES.find((c) => c.key === cat);
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                        <div style={{ fontSize: 13, color: "var(--text)" }}>
                          {catObj ? catObj.label : cat}
                          <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>{count} items</span>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color }}>
                            {pct}%
                          </span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--rose)" }}>
                            {cur}{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="goal-bar-bg">
                        <div className="goal-bar-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              <div style={{
                marginTop: 8,
                paddingTop: 14,
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
              }}>
                <span style={{ color: "var(--muted)" }}>Grand Total</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--rose)", fontWeight: 600 }}>
                  {cur}{totalAll.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ fontSize: 16 }}>Delete this expense?</div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>This cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteExpense(confirmDelete);
                  setConfirmDelete(null);
                  showToast("Expense deleted");
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
