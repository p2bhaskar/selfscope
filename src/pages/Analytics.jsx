// src/pages/Analytics.jsx

const CAT_COLORS = {
  "Food & Dining": "#e05c7a",
  "Transport": "#3ecfb2",
  "Education": "#c9a84c",
  "Entertainment": "#9b72cf",
  "Groceries": "#3ecfb2",
  "Utilities": "#c9a84c",
  "Health": "#4c9ac9",
  "Subscriptions": "#c9a84c",
  "Other": "#6b7280",
};

export default function Analytics({ data }) {
  const { expenses, morning, goals, journal, prefs } = data;
  const cur = prefs.currency || "₹";

  // Last 7 days spend per day
  const last7Spend = (() => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toDateString();
      const total = expenses
        .filter((e) => new Date(e.date).toDateString() === dayStr)
        .reduce((s, e) => s + Number(e.amount), 0);
      return { label: days[d.getDay()], v: total, date: d };
    });
  })();
  const maxSpend = Math.max(...last7Spend.map((b) => b.v), 1);

  // Category breakdown
  const byCategory = {};
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
  });
  const totalSpend = Object.values(byCategory).reduce((s, v) => s + v, 0);
  const topCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Build donut gradient
  const donutGradient = (() => {
    if (topCats.length === 0) return "var(--dim)";
    let pct = 0;
    const parts = topCats.map(([cat, val]) => {
      const share = totalSpend > 0 ? (val / totalSpend) * 100 : 0;
      const part = `${CAT_COLORS[cat] || "#6b7280"} ${pct}% ${pct + share}%`;
      pct += share;
      return part;
    });
    if (pct < 100) parts.push(`var(--dim) ${pct}% 100%`);
    return `conic-gradient(${parts.join(", ")})`;
  })();

  // Mood distribution from journal
  const moodCount = {};
  journal.forEach((e) => {
    if (e.mood) moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
  });
  const topMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Wake time trend (last 14 days)
  const wakeTrend = (() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      d.setHours(0, 0, 0, 0);
      const log = morning.find((m) => {
        const md = new Date(m.date);
        md.setHours(0, 0, 0, 0);
        return md.getTime() === d.getTime();
      });
      const [h, min] = log ? log.wakeTime.split(":").map(Number) : [null, null];
      return {
        label: d.getDate(),
        minutes: log ? h * 60 + min : null,
        type: log ? (h < 7 ? "early" : h < 9 ? "mid" : "late") : "empty",
      };
    });
  })();
  const wakeGoalMin = (() => {
    const [h, m] = (prefs.wakeGoal || "06:00").split(":").map(Number);
    return h * 60 + m;
  })();

  // AI-like insights
  const insights = (() => {
    const result = [];

    // Spend insight
    const weekdayAvg = last7Spend.filter((_, i) => i < 5).reduce((s, d) => s + d.v, 0) / 5 || 0;
    const weekendAvg = last7Spend.filter((_, i) => i >= 5).reduce((s, d) => s + d.v, 0) / 2 || 0;
    if (weekendAvg > weekdayAvg * 1.5 && weekendAvg > 0) {
      result.push({
        icon: "📈",
        title: "Spending Spike on Weekends",
        body: `Your weekend spend (avg ${cur}${Math.round(weekendAvg)}) is ${Math.round(weekendAvg / Math.max(weekdayAvg, 1))}x your weekday average. Consider setting a weekend cap.`,
      });
    }

    // Top spending category
    if (topCats.length > 0) {
      const [topCat, topVal] = topCats[0];
      result.push({
        icon: "💡",
        title: `Top Spend: ${topCat}`,
        body: `${topCat} accounts for ${totalSpend > 0 ? Math.round((topVal / totalSpend) * 100) : 0}% of your total spending (${cur}${topVal}).`,
      });
    }

    // Wake insight
    const earlyCount = morning.filter((m) => parseInt(m.wakeTime) < 7).length;
    if (morning.length >= 3) {
      result.push({
        icon: "⏰",
        title: "Wake Consistency",
        body: `You've woken before 7 AM on ${earlyCount} of your ${morning.length} logged days. ${earlyCount / morning.length > 0.6 ? "Great consistency!" : "Keep pushing for earlier starts."}`,
      });
    }

    // Goal insight
    const overdueGoals = goals.filter((g) => new Date(g.deadline) < new Date() && g.progress < 100);
    if (overdueGoals.length > 0) {
      result.push({
        icon: "🎯",
        title: "Goals Need Attention",
        body: `${overdueGoals.length} goal${overdueGoals.length > 1 ? "s are" : " is"} past deadline: ${overdueGoals.map((g) => g.title.split("—")[0].trim()).join(", ")}.`,
      });
    } else if (goals.length > 0) {
      result.push({
        icon: "🎯",
        title: "Goals on Track",
        body: `All ${goals.length} active goals are within their deadlines. Avg progress: ${Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)}%.`,
      });
    }

    if (result.length === 0) {
      result.push({
        icon: "🌱",
        title: "Keep Logging",
        body: "Add more journal entries, expenses, and morning logs to unlock personalized insights.",
      });
    }

    return result;
  })();

  return (
    <div>
      {/* Expense Trend */}
      <div className="analytics-full">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Expense Trend — Last 7 Days</div>
            <div className="card-badge badge-rose">DAILY</div>
          </div>
          {last7Spend.every((b) => b.v === 0) ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <div className="empty-icon">📊</div>
              <div className="empty-sub">Log some expenses to see your trend</div>
            </div>
          ) : (
            <div className="big-chart">
              {last7Spend.map((b, i) => (
                <div className="bar-wrap" key={i} style={{ height: "100%", justifyContent: "flex-end" }}>
                  <div
                    className="bar"
                    style={{
                      height: `${b.v > 0 ? Math.max((b.v / maxSpend) * 120, 8) : 0}px`,
                      background: b.v === Math.max(...last7Spend.map((x) => x.v)) && b.v > 0 ? "var(--rose)" : "#1e2540",
                      position: "relative",
                    }}
                  >
                    {b.v > 0 && (
                      <div style={{
                        position: "absolute", bottom: "100%", left: "50%",
                        transform: "translateX(-50%)",
                        fontFamily: "'DM Mono', monospace", fontSize: 10,
                        color: "var(--muted)", marginBottom: 4, whiteSpace: "nowrap",
                      }}>
                        {cur}{b.v}
                      </div>
                    )}
                  </div>
                  <div className="bar-label">{b.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="analytics-grid">
        {/* Category Donut */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Spend by Category</div>
            <div className="card-badge badge-rose">ALL TIME</div>
          </div>
          {totalSpend === 0 ? (
            <div className="empty-state" style={{ padding: "16px 0" }}>
              <div className="empty-sub">No expenses logged</div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
              <div className="donut-chart" style={{ background: donutGradient }}>
                <div className="donut-inner">
                  <div className="donut-total">{cur}{totalSpend >= 1000 ? `${(totalSpend / 1000).toFixed(1)}k` : totalSpend}</div>
                  <div className="donut-label">TOTAL</div>
                </div>
              </div>
              <div className="legend">
                {topCats.map(([cat, val]) => (
                  <div key={cat} className="legend-item">
                    <div className="legend-dot" style={{ background: CAT_COLORS[cat] || "#6b7280" }} />
                    <span>{cat.split(" ")[0]}</span>
                    <span style={{ color: CAT_COLORS[cat] || "#6b7280", fontFamily: "'DM Mono', monospace", marginLeft: "auto", fontSize: 11 }}>
                      {totalSpend > 0 ? Math.round((val / totalSpend) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Goal Progress */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Goal Achievement</div>
            <div className="card-badge badge-gold">ALL GOALS</div>
          </div>
          {goals.length === 0 ? (
            <div className="empty-state" style={{ padding: "16px 0" }}>
              <div className="empty-sub">No goals set yet</div>
            </div>
          ) : (
            goals.map((g) => (
              <div key={g.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{g.label}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: g.accent }}>{g.progress}%</span>
                </div>
                <div className="goal-bar-bg">
                  <div className="goal-bar-fill" style={{ width: `${g.progress}%`, background: g.accent }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Wake Trend */}
      {morning.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <div className="card-title">Wake Time — Last 14 Days</div>
            <div className="card-badge badge-teal">TREND</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {wakeTrend.map((d, i) => {
              if (d.minutes === null) {
                return (
                  <div className="bar-wrap" key={i}>
                    <div style={{ height: 4, width: "100%", background: "var(--border)", borderRadius: 2 }} />
                    <div className="bar-label">{d.label}</div>
                  </div>
                );
              }
              // Invert: earlier = taller bar (min=4am=240min, max=10am=600min)
              const height = Math.max(((600 - d.minutes) / 360) * 64, 4);
              const color = d.type === "early" ? "var(--teal)" : d.type === "mid" ? "var(--gold)" : "var(--rose)";
              return (
                <div className="bar-wrap" key={i}>
                  <div className="bar" style={{ height, background: color }} title={`${Math.floor(d.minutes / 60)}:${(d.minutes % 60).toString().padStart(2, "0")}`} />
                  <div className="bar-label">{d.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
            Taller bar = earlier wake. Goal: <span style={{ color: "var(--gold)" }}>{prefs.wakeGoal || "06:00"}</span>
          </div>
        </div>
      )}

      {/* Mood Distribution */}
      {topMoods.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <div className="card-title">Mood Distribution</div>
            <div className="card-badge badge-gold">FROM JOURNAL</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {topMoods.map(([mood, count]) => (
              <div key={mood} style={{
                padding: "8px 14px",
                background: "var(--surface2)",
                borderRadius: 20,
                fontSize: 13,
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                {mood}
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--gold)" }}>×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Insights</div>
          <div className="card-badge badge-teal">AUTO-GENERATED</div>
        </div>
        {insights.map((ins, i) => (
          <div className="insight-card" key={i}>
            <div className="insight-title">{ins.icon} {ins.title}</div>
            <div className="insight-body">{ins.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
