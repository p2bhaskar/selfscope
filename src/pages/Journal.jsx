// src/pages/Journal.jsx
import { useState } from "react";

const MOODS = ["✨ Inspired", "😌 Calm", "🔥 Focused", "😤 Frustrated", "🌧 Low", "🎯 Driven"];
const TAGS = ["💭 Thought", "🌅 Morning", "🌙 Reflection", "📌 Note", "💡 Idea"];
const TAG_COLORS = { Morning: "", Thought: "teal", Reflection: "rose", Note: "", Idea: "teal" };

export default function Journal({ data, showToast }) {
  const { journal, addJournal, deleteJournal } = data;

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tag, setTag] = useState("💭 Thought");
  const [mood, setMood] = useState("");
  const [tab, setTab] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = () => {
    if (!text.trim()) {
      showToast("Please write something first", "error");
      return;
    }
    const cleanTag = tag.replace(/^[^ ]+ /, ""); // strip emoji prefix
    addJournal({ title: title.trim(), text: text.trim(), tag: cleanTag, mood });
    setTitle("");
    setText("");
    setMood("");
    showToast("Entry saved ✦");
  };

  const handleClear = () => {
    setTitle("");
    setText("");
    setMood("");
  };

  const filtered = tab === "all"
    ? journal
    : journal.filter((e) => e.tag.toLowerCase() === tab);

  const formatDate = (iso) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div>
      {/* Compose */}
      <div className="journal-compose">
        <div className="section-heading">New Entry</div>
        <div className="journal-input-row">
          <input
            className="input-field"
            placeholder="Entry title (optional)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="input-field"
            style={{ maxWidth: 160 }}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {TAGS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <textarea
          className="input-field"
          placeholder="What's on your mind? Write freely — this is your space..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="section-heading">MOOD TAG</div>
        <div className="mood-row">
          {MOODS.map((m) => (
            <div
              key={m}
              className={`mood-chip ${mood === m ? "selected" : ""}`}
              onClick={() => setMood(mood === m ? "" : m)}
            >
              {m}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-ghost" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Entry →</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        {["all", "thought", "morning", "reflection", "note", "idea"].map((t) => (
          <div
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {/* Entry List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✦</div>
          <div className="empty-text">No entries here yet</div>
          <div className="empty-sub">Start writing above to capture your thoughts</div>
        </div>
      ) : (
        <div className="entry-list">
          {filtered.map((e) => {
            const color = TAG_COLORS[e.tag] || "";
            return (
              <div className={`entry-item ${color}`} key={e.id}>
                <div className="entry-meta">
                  <div className="entry-time">
                    {new Date(e.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" · "}{formatDate(e.date)}
                    {e.mood && <span style={{ marginLeft: 8, color: "var(--gold)" }}>{e.mood}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="entry-tag">{e.tag}</div>
                    <button
                      className="delete-btn"
                      onClick={() => setConfirmDelete(e.id)}
                      title="Delete entry"
                    >✕</button>
                  </div>
                </div>
                {e.title && <div className="entry-title">{e.title}</div>}
                <div className="entry-text">{e.text}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title" style={{ fontSize: 16 }}>Delete this entry?</div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>This action cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteJournal(confirmDelete);
                  setConfirmDelete(null);
                  showToast("Entry deleted");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
