// src/pages/Dashboard.jsx
export default function Dashboard({ data }) {
  const { journal, expenses, morning, goals, prefs, analytics } = data;
  const stats = analytics();

  // Last 7 days wake data
  const last7 = (() => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const log = morning.find((m) => {
        const md = new Date(m.date);
        md.setHours(0, 0, 0, 0);
        return md.getTime() === d.getTime();
      });
      const dayLabel = days[d.getDay()];
      if (log) {
        const [h] = log.wakeTime.split(":").map(Number);
        result.push({
          day: dayLabel,
          time: log.wakeTime,
          type: h < 7 ? "early" : h < 9 ? "mid" : "late",
        });
      } else {
        result.push({ day: dayLabel, time: "—", type: "empty" });
      }
    }
    return result;
  })();

  // Last 7 days expenses bar chart
  const last7Spend = (() => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toDateString();
      const total = expenses
        .filter((e) => new Date(e.date).toDateString() === dayStr)
        .reduce((s, e) => s + Number(e.amount), 0);
      result.push({ label: days[d.getDay()], v: total });
    }
    return result;
  })();

  const maxSpend = Math.max(...last7Spend.map((b) => b.v), 1);

  // Format currency
  const cur = prefs.currency || "₹";
  const fmt = (n) => n >= 1000 ? `${cur}${(n / 1000).toFixed(1)}k` : `${cur}${n}`;

  return (
    <div>
      {/* Stats Row */}
      <div className="stats-grid">
        {[
          {
            label: "WAKE STREAK",
            val: `${stats.wakeStreak}`,
            note: stats.wakeStreak >= 3 ? `▲ ${stats.wakeStreak} days strong` : "Keep going!",
            accent: "#3ecfb2",
            pos: stats.wakeStreak >= 3,
          },
          {
            label: "JOURNAL ENTRIES",
            val: `${journal.length}`,
            note: `${journal.filter((e) => new Date(e.date) > new Date(Date.now() - 7 * 86400000)).length} this week`,
            accent: "#c9a84c",
            pos: true,
          },
          {
            label: "SPEND THIS MONTH",
            val: fmt(stats.totalMonthlySpend),
            note: prefs.monthlyBudget
              ? `${cur}${prefs.monthlyBudget - stats.totalMonthlySpend >= 0 ? prefs.monthlyBudget - stats.totalMonthlySpend : 0} remaining`
              : "No budget set",
            accent: "#e05c7a",
            pos: stats.totalMonthlySpend <= (prefs.monthlyBudget || Infinity),
          },
          {
            label: "GOALS ON TRACK",
            val: `${stats.onTrack}/${stats.totalGoals}`,
            note: stats.onTrack === stats.totalGoals ? "All goals active!" : `${stats.totalGoals - stats.onTrack} need attention`,
            accent: "#c9a84c",
            pos: stats.onTrack === stats.totalGoals,
          },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ "--accent": s.accent }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.val}</div>
            <div className={`stat-note ${s.pos ? "positive" : "negative"}`}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Spend</div>
            <div className="card-badge badge-rose">LAST 7 DAYS</div>
          </div>
          {last7Spend.every((b) => b.v === 0) ? (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              <div className="empty-icon">📊</div>
              <div className="empty-sub">No expenses logged yet</div>
            </div>
          ) : (
            <div className="mini-chart">
              {last7Spend.map((b, i) => (
                <div className="bar-wrap" key={i}>
                  <div
                    className="bar"
                    style={{
                      height: `${Math.max((b.v / maxSpend) * 64, b.v > 0 ? 8 : 0)}px`,
                      background: b.v === Math.max(...last7Spend.map((x) => x.v)) && b.v > 0 ? "#e05c7a" : "#1e2540",
                    }}
                    title={`${cur}${b.v}`}
                  />
                  <div className="bar-label">{b.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Wake Log</div>
            <div className="card-badge badge-teal">LAST 7 DAYS</div>
          </div>
          <div className="wake-tracker">
            {last7.map((w, i) => (
              <div className="wake-day" key={i}>
                <div className={`wake-dot ${w.type}`} title={w.time}>
                  {w.time === "—" ? "—" : w.time.split(":")[0]}
                </div>
                <div className="wake-day-label">{w.day}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[["early", "#3ecfb2", "before 7am"], ["mid", "#c9a84c", "7–9am"], ["late", "#e05c7a", "after 9am"]].map(
              ([cls, col, lbl]) => (
                <div key={cls} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--muted)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
                  {lbl}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-row">
        {/* Recent Journal */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Journal</div>
            <div className="card-badge badge-gold">LATEST</div>
          </div>
          {journal.length === 0 ? (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              <div className="empty-icon">✦</div>
              <div className="empty-sub">No entries yet</div>
            </div>
          ) : (
            <div className="entry-list">
              {journal.slice(0, 2).map((e, i) => {
                const tagColor = e.tag === "Reflection" ? "rose" : e.tag === "Thought" ? "teal" : "";
                return (
                  <div className={`entry-item ${tagColor}`} key={i}>
                    <div className="entry-meta">
                      <div className="entry-time">
                        {new Date(e.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                        {new Date(e.date).toDateString() === new Date().toDateString() ? "Today" : "Yesterday"}
                      </div>
                      <div className="entry-tag">{e.tag}</div>
                    </div>
                    {e.title && <div className="entry-title">{e.title}</div>}
                    <div className="entry-text">{e.text.slice(0, 80)}{e.text.length > 80 ? "..." : ""}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Goal Progress</div>
            <div className="card-badge badge-gold">ACTIVE</div>
          </div>
          {goals.length === 0 ? (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              <div className="empty-icon">◎</div>
              <div className="empty-sub">No goals set yet</div>
            </div>
          ) : (
            goals.slice(0, 3).map((g, i) => (
              <div className="goal-item" key={i}>
                <div className="goal-header">
                  <div className="goal-name">{g.title.split("—")[0].trim()}</div>
                  <div className="goal-pct">{g.progress}%</div>
                </div>
                <div className="goal-bar-bg">
                  <div className="goal-bar-fill" style={{ width: `${g.progress}%`, background: g.accent }} />
                </div>
                <div className="goal-deadline">
                  Due {new Date(g.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Today's Expenses */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Today's Expenses</div>
            <div className="card-badge badge-rose">TODAY</div>
          </div>
          {(() => {
            const todayExp = expenses.filter(
              (e) => new Date(e.date).toDateString() === new Date().toDateString()
            );
            return todayExp.length === 0 ? (
              <div className="empty-state" style={{ padding: "20px 0" }}>
                <div className="empty-icon">◈</div>
                <div className="empty-sub">No expenses today</div>
              </div>
            ) : (
              <div className="expense-list">
                {todayExp.slice(0, 3).map((e, i) => (
                  <div className="expense-item" key={i}>
                    <div className="expense-left">
                      <div className="expense-icon" style={{ background: "rgba(224,92,122,0.15)" }}>{e.icon}</div>
                      <div>
                        <div className="expense-name">{e.name}</div>
                        <div className="expense-cat">{e.category}</div>
                      </div>
                    </div>
                    <div className="expense-amount">{cur}{e.amount}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
