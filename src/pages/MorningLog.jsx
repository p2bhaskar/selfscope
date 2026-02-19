// src/pages/MorningLog.jsx
import { useState } from "react";

export default function MorningLog({ data, showToast }) {
  const { morning, addMorning, deleteMorning, prefs } = data;

  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepQuality, setSleepQuality] = useState("Good");
  const [sleepDuration, setSleepDuration] = useState("");
  const [intentions, setIntentions] = useState(["", "", ""]);

  const todayLogged = morning.some(
    (m) => new Date(m.date).toDateString() === new Date().toDateString()
  );

  const handleLog = () => {
    if (!wakeTime) { showToast("Please set a wake time", "error"); return; }
    addMorning({
      wakeTime,
      sleepQuality,
      sleepDuration,
      intentions: intentions.filter((i) => i.trim()),
    });
    setIntentions(["", "", ""]);
    setSleepDuration("");
    showToast("Morning logged ◐");
  };

  // Build month chart — last 28 days
  const last28 = (() => {
    const result = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const log = morning.find((m) => {
        const md = new Date(m.date);
        md.setHours(0, 0, 0, 0);
        return md.getTime() === d.getTime();
      });
      result.push({ day: d.getDate(), log });
    }
    return result;
  })();

  const wakeType = (time) => {
    if (!time) return "empty";
    const [h] = time.split(":").map(Number);
    return h < 7 ? "early" : h < 9 ? "mid" : "late";
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div>
      {/* Log Form */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="card-title">
            Log Today's Wake
            {todayLogged && (
              <span style={{ fontSize: 12, color: "var(--teal)", marginLeft: 10, fontFamily: "'DM Mono', monospace" }}>
                ✓ Already logged today
              </span>
            )}
          </div>
          <div className="card-badge badge-teal">QUICK LOG</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <div className="section-heading">WAKE TIME</div>
            <input
              type="time"
              className="input-field"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            />
          </div>
          <div>
            <div className="section-heading">SLEEP QUALITY</div>
            <select
              className="input-field"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(e.target.value)}
            >
              {["Excellent", "Good", "Average", "Poor"].map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="section-heading">SLEEP DURATION</div>
            <input
              className="input-field"
              placeholder="e.g. 7h 30m"
              value={sleepDuration}
              onChange={(e) => setSleepDuration(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div className="section-heading">MORNING INTENTIONS (3 things to do today)</div>
          {intentions.map((val, i) => (
            <input
              key={i}
              className="input-field"
              style={{ marginBottom: 8 }}
              placeholder={`Intention ${i + 1}...`}
              value={val}
              onChange={(e) => {
                const updated = [...intentions];
                updated[i] = e.target.value;
                setIntentions(updated);
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={handleLog}>
            Log Morning →
          </button>
        </div>
      </div>

      {/* 28-day visual */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="card-title">Wake Consistency — Last 28 Days</div>
          <div className="card-badge badge-teal">
            {new Date().toLocaleString("default", { month: "long", year: "numeric" }).toUpperCase()}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 6 }}>
          {last28.map((d, i) => {
            const type = d.log ? wakeType(d.log.wakeTime) : "empty";
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  className={`wake-dot ${type}`}
                  style={{ width: 24, height: 24, fontSize: 9 }}
                  title={d.log ? `${d.log.wakeTime} — ${d.log.sleepQuality}` : "Not logged"}
                >
                  {d.log ? d.log.wakeTime.split(":")[0] : "—"}
                </div>
                <div className="wake-day-label" style={{ marginTop: 2 }}>{d.day}</div>
              </div>
            );
          })}
        </div>
        {morning.length > 0 && (() => {
          const avg = morning.reduce((s, m) => {
            const [h, min] = m.wakeTime.split(":").map(Number);
            return s + h * 60 + min;
          }, 0) / morning.length;
          const avgH = Math.floor(avg / 60);
          const avgM = Math.round(avg % 60).toString().padStart(2, "0");
          const goal = prefs.wakeGoal || "06:00";
          return (
            <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)", display: "flex", gap: 20 }}>
              <span>Avg: <span style={{ color: "var(--teal)" }}>{avgH}:{avgM} AM</span></span>
              <span>Goal: <span style={{ color: "var(--gold)" }}>{goal}</span></span>
              <span>Total logs: <span style={{ color: "var(--text)" }}>{morning.length}</span></span>
            </div>
          );
        })()}
      </div>

      {/* Log History */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Log History</div>
          <div className="card-badge badge-gold">{morning.length} ENTRIES</div>
        </div>
        {morning.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◐</div>
            <div className="empty-text">No mornings logged yet</div>
            <div className="empty-sub">Start your streak above</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {morning.slice(0, 10).map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "var(--surface2)",
                  borderRadius: 8,
                  borderLeft: `3px solid ${wakeType(m.wakeTime) === "early" ? "var(--teal)" : wakeType(m.wakeTime) === "mid" ? "var(--gold)" : "var(--rose)"}`,
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                      {m.wakeTime}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{formatDate(m.date)}</span>
                    <span
                      className="card-badge"
                      style={{
                        background: m.sleepQuality === "Excellent" ? "rgba(62,207,178,0.12)" : m.sleepQuality === "Poor" ? "rgba(224,92,122,0.12)" : "rgba(201,168,76,0.12)",
                        color: m.sleepQuality === "Excellent" ? "var(--teal)" : m.sleepQuality === "Poor" ? "var(--rose)" : "var(--gold)",
                        padding: "2px 8px",
                      }}
                    >
                      {m.sleepQuality}
                    </span>
                    {m.sleepDuration && (
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{m.sleepDuration}</span>
                    )}
                  </div>
                  {m.intentions?.length > 0 && (
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      {m.intentions.map((int, i) => (
                        <span key={i} style={{ marginRight: 12 }}>• {int}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button className="delete-btn" onClick={() => deleteMorning(m.id)} title="Delete">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
