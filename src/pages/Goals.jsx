// src/pages/Goals.jsx
import { useState } from "react";
import { uuid } from "../hooks/useAppData";

const ACCENTS = ["#c9a84c", "#3ecfb2", "#e05c7a", "#9b72cf", "#4c9ac9"];
const LABELS = ["ACADEMIC", "PROFESSIONAL", "FITNESS", "PERSONAL", "HEALTH", "CREATIVE", "FINANCIAL"];

export default function Goals({ data, showToast }) {
  const { goals, addGoal, updateGoalProgress, toggleMilestone, deleteGoal } = data;

  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editProgress, setEditProgress] = useState({}); // goalId -> temp value

  // New goal form state
  const [form, setForm] = useState({
    label: "ACADEMIC",
    title: "",
    desc: "",
    deadline: "",
    accent: "#c9a84c",
    milestones: ["", "", ""],
  });

  const handleAdd = () => {
    if (!form.title.trim()) { showToast("Goal title required", "error"); return; }
    if (!form.deadline) { showToast("Please set a deadline", "error"); return; }
    addGoal({
      ...form,
      milestones: form.milestones
        .filter((m) => m.trim())
        .map((label) => ({ id: uuid(), label, done: false })),
    });
    setShowModal(false);
    setForm({ label: "ACADEMIC", title: "", desc: "", deadline: "", accent: "#c9a84c", milestones: ["", "", ""] });
    showToast("Goal added ◎");
  };

  const handleProgressBlur = (goalId) => {
    const val = editProgress[goalId];
    if (val !== undefined) {
      updateGoalProgress(goalId, Number(val));
      setEditProgress((p) => { const n = { ...p }; delete n[goalId]; return n; });
    }
  };

  const getDaysLeft = (deadline) => {
    const d = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    return d;
  };

  return (
    <div>
      {goals.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-icon">◎</div>
          <div className="empty-text">No goals yet</div>
          <div className="empty-sub" style={{ marginBottom: 20 }}>Set your first goal and start tracking progress</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add First Goal</button>
        </div>
      ) : (
        <div className="goals-full">
          {goals.map((g) => {
            const daysLeft = getDaysLeft(g.deadline);
            const doneCount = g.milestones.filter((m) => m.done).length;
            const currentProgress = editProgress[g.id] !== undefined ? editProgress[g.id] : g.progress;

            return (
              <div className="goal-card" key={g.id} style={{ borderTop: `3px solid ${g.accent}` }}>
                <div className="goal-card-label">{g.label}</div>
                <div className="goal-card-title">{g.title}</div>
                {g.desc && <div className="goal-card-desc">{g.desc}</div>}

                {/* Progress */}
                <div className="big-progress">
                  <div className="big-progress-header">
                    <div className="big-progress-label">Overall Progress</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input
                        className="progress-input"
                        type="number"
                        min="0"
                        max="100"
                        value={currentProgress}
                        onChange={(e) => setEditProgress((p) => ({ ...p, [g.id]: e.target.value }))}
                        onBlur={() => handleProgressBlur(g.id)}
                        onKeyDown={(e) => e.key === "Enter" && handleProgressBlur(g.id)}
                        title="Click to edit progress %"
                        style={{ color: g.accent }}
                      />
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: g.accent }}>%</span>
                    </div>
                  </div>
                  <div className="big-progress-bar">
                    <div
                      className="big-progress-fill"
                      style={{
                        width: `${g.progress}%`,
                        background: `linear-gradient(90deg, ${g.accent}, ${g.accent}cc)`,
                      }}
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div style={{ display: "flex", gap: 16, marginBottom: 14, fontSize: 12 }}>
                  <span style={{ color: "var(--muted)" }}>
                    🗓{" "}
                    <span style={{ color: g.accent }}>
                      {new Date(g.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </span>
                  <span style={{ color: daysLeft < 0 ? "var(--rose)" : daysLeft < 14 ? "var(--gold)" : "var(--muted)" }}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                  </span>
                </div>

                {/* Milestones */}
                {g.milestones.length > 0 && (
                  <div className="milestones">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="section-heading">MILESTONES</div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--muted)" }}>
                        {doneCount}/{g.milestones.length}
                      </span>
                    </div>
                    {g.milestones.map((m) => (
                      <div
                        className="milestone-item"
                        key={m.id}
                        onClick={() => toggleMilestone(g.id, m.id)}
                        title="Click to toggle"
                      >
                        <div className={`ms-dot ${m.done ? "ms-done" : "ms-pending"}`} />
                        <span style={{
                          color: m.done ? "var(--teal)" : "var(--muted)",
                          textDecoration: m.done ? "line-through" : "none",
                        }}>
                          {m.label}
                        </span>
                        {m.done && <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--teal)" }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ flex: 1, fontSize: 12 }}
                    onClick={() => setConfirmDelete(g.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: 12, background: g.accent }}
                    onClick={() => {
                      const val = window.prompt("Set progress % (0–100):", g.progress);
                      if (val !== null) updateGoalProgress(g.id, Number(val));
                    }}
                  >
                    Update %
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">New Goal</div>

            <div style={{ marginBottom: 12 }}>
              <div className="section-heading">CATEGORY</div>
              <select
                className="input-field"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              >
                {LABELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div className="section-heading">GOAL TITLE</div>
              <input
                className="input-field"
                placeholder="e.g. Read 12 books this year"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <div className="section-heading">DESCRIPTION (OPTIONAL)</div>
              <textarea
                className="input-field"
                style={{ minHeight: 60 }}
                placeholder="Why this goal matters..."
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <div className="section-heading">DEADLINE</div>
              <input
                className="input-field"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <div className="section-heading">ACCENT COLOR</div>
              <div style={{ display: "flex", gap: 8 }}>
                {ACCENTS.map((a) => (
                  <div
                    key={a}
                    onClick={() => setForm({ ...form, accent: a })}
                    style={{
                      width: 28, height: 28, borderRadius: "50%", background: a, cursor: "pointer",
                      border: form.accent === a ? "2px solid white" : "2px solid transparent",
                      transition: "transform 0.2s",
                      transform: form.accent === a ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div className="section-heading">MILESTONES (OPTIONAL)</div>
              {form.milestones.map((m, i) => (
                <input
                  key={i}
                  className="input-field"
                  style={{ marginBottom: 8 }}
                  placeholder={`Milestone ${i + 1}...`}
                  value={m}
                  onChange={(e) => {
                    const updated = [...form.milestones];
                    updated[i] = e.target.value;
                    setForm({ ...form, milestones: updated });
                  }}
                />
              ))}
              <button
                className="btn btn-ghost"
                style={{ fontSize: 11 }}
                onClick={() => setForm({ ...form, milestones: [...form.milestones, ""] })}
              >
                + Add Milestone
              </button>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Save Goal →</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ fontSize: 16 }}>Delete this goal?</div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>All milestones will be lost.</p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteGoal(confirmDelete);
                  setConfirmDelete(null);
                  showToast("Goal deleted");
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* FAB when goals exist */}
      {goals.length > 0 && (
        <button
          className="btn btn-primary"
          style={{
            position: "fixed", bottom: 32, right: 32,
            borderRadius: "50%", width: 52, height: 52,
            fontSize: 24, padding: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
          }}
          onClick={() => setShowModal(true)}
          title="Add new goal"
        >
          +
        </button>
      )}
    </div>
  );
}
