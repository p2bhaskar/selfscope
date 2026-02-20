// export const style = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');

//   * { box-sizing: border-box; margin: 0; padding: 0; }

//   :root {
//     --bg: #0a0c12;
//     --surface: #111520;
//     --surface2: #161b2e;
//     --border: #1e2540;
//     --gold: #c9a84c;
//     --gold-light: #f0cc6e;
//     --teal: #3ecfb2;
//     --rose: #e05c7a;
//     --text: #e8e4d9;
//     --muted: #6b7280;
//     --dim: #3a4055;
//   }

//   .app { font-family: 'Lato', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; overflow: hidden; }

//   .sidebar { width: 220px; min-width: 220px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 0; position: relative; z-index: 10; }
//   .sidebar-logo { padding: 28px 24px 24px; border-bottom: 1px solid var(--border); }
//   .logo-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); letter-spacing: -0.5px; line-height: 1; }
//   .logo-sub { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
//   .sidebar-date { padding: 16px 24px; border-bottom: 1px solid var(--border); }
//   .sidebar-date-day { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: var(--text); line-height: 1; }
//   .sidebar-date-rest { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 1px; margin-top: 4px; }
//   .sidebar-nav { flex: 1; padding: 16px 0; overflow-y: auto; }
//   .nav-section-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--dim); letter-spacing: 2px; text-transform: uppercase; padding: 12px 24px 6px; }
//   .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 24px; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; font-size: 14px; color: var(--muted); font-weight: 400; }
//   .nav-item:hover { color: var(--text); background: var(--surface2); border-left-color: var(--dim); }
//   .nav-item.active { color: var(--gold); background: rgba(201, 168, 76, 0.07); border-left-color: var(--gold); font-weight: 700; }
//   .nav-icon { font-size: 16px; width: 20px; text-align: center; }
//   .sidebar-footer { padding: 16px 24px; border-top: 1px solid var(--border); }
//   .sync-btn { width: 100%; padding: 10px; background: transparent; border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer; letter-spacing: 1px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
//   .sync-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201, 168, 76, 0.05); }

//   .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
//   .topbar { padding: 20px 36px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--surface); }
//   .page-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--text); }
//   .page-subtitle { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); margin-top: 2px; letter-spacing: 0.5px; }
//   .topbar-actions { display: flex; gap: 10px; align-items: center; }
//   .btn { padding: 9px 18px; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; font-family: 'Lato', sans-serif; }
//   .btn-primary { background: var(--gold); color: #0a0c12; border: none; }
//   .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
//   .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--muted); }
//   .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
//   .btn-danger { background: transparent; border: 1px solid var(--rose); color: var(--rose); }
//   .btn-danger:hover { background: rgba(224,92,122,0.1); }

//   .content { flex: 1; overflow-y: auto; padding: 32px 36px; }

//   .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
//   .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; position: relative; overflow: hidden; transition: transform 0.2s, border-color 0.2s; }
//   .stat-card:hover { transform: translateY(-2px); border-color: var(--dim); }
//   .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent, var(--gold)); }
//   .stat-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; }
//   .stat-value { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: var(--text); margin: 6px 0 4px; line-height: 1; }
//   .stat-note { font-size: 12px; color: var(--muted); }
//   .stat-note.positive { color: var(--teal); }
//   .stat-note.negative { color: var(--rose); }

//   .dashboard-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }
//   .dashboard-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

//   .card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
//   .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
//   .card-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--text); }
//   .card-badge { font-family: 'DM Mono', monospace; font-size: 10px; padding: 3px 8px; border-radius: 20px; letter-spacing: 1px; }
//   .badge-gold { background: rgba(201,168,76,0.15); color: var(--gold); }
//   .badge-teal { background: rgba(62,207,178,0.12); color: var(--teal); }
//   .badge-rose { background: rgba(224,92,122,0.12); color: var(--rose); }

//   .mini-chart { display: flex; align-items: flex-end; gap: 6px; height: 80px; padding-top: 8px; }
//   .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
//   .bar { width: 100%; border-radius: 3px 3px 0 0; transition: height 0.4s ease; min-height: 4px; }
//   .bar-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 0.5px; }

//   .entry-list { display: flex; flex-direction: column; gap: 10px; }
//   .entry-item { padding: 14px; background: var(--surface2); border-radius: 8px; border-left: 3px solid var(--gold); transition: all 0.2s; position: relative; }
//   .entry-item.teal { border-left-color: var(--teal); }
//   .entry-item.rose { border-left-color: var(--rose); }
//   .entry-meta { display: flex; justify-content: space-between; margin-bottom: 6px; }
//   .entry-time { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); }
//   .entry-tag { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; }
//   .entry-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
//   .entry-text { font-size: 13px; color: var(--text); line-height: 1.5; opacity: 0.85; }

//   .goal-item { margin-bottom: 14px; }
//   .goal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
//   .goal-name { font-size: 13px; font-weight: 700; color: var(--text); }
//   .goal-pct { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--gold); }
//   .goal-bar-bg { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
//   .goal-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
//   .goal-deadline { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); margin-top: 4px; }

//   .wake-tracker { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
//   .wake-day { text-align: center; }
//   .wake-dot { width: 28px; height: 28px; border-radius: 50%; margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; }
//   .wake-dot.early { background: rgba(62,207,178,0.2); color: var(--teal); border: 1px solid var(--teal); }
//   .wake-dot.mid { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid var(--gold); }
//   .wake-dot.late { background: rgba(224,92,122,0.15); color: var(--rose); border: 1px solid var(--rose); }
//   .wake-dot.empty { background: var(--surface2); color: var(--dim); border: 1px solid var(--border); }
//   .wake-day-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 0.5px; }

//   .expense-list { display: flex; flex-direction: column; gap: 8px; }
//   .expense-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--surface2); border-radius: 8px; transition: all 0.2s; }
//   .expense-item:hover { background: #1d2340; }
//   .expense-left { display: flex; align-items: center; gap: 12px; }
//   .expense-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
//   .expense-name { font-size: 13px; font-weight: 700; color: var(--text); }
//   .expense-cat { font-size: 11px; color: var(--muted); }
//   .expense-amount { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; color: var(--rose); }

//   .journal-compose { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 24px; margin-bottom: 24px; }
//   .journal-input-row { display: flex; gap: 12px; margin-bottom: 14px; }
//   .input-field { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: var(--text); font-family: 'Lato', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s; }
//   .input-field:focus { border-color: var(--gold); }
//   .input-field::placeholder { color: var(--dim); }
//   textarea.input-field { resize: vertical; min-height: 80px; width: 100%; display: block; margin-bottom: 12px; }
//   .mood-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
//   .mood-chip { padding: 6px 14px; border-radius: 20px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 12px; cursor: pointer; transition: all 0.2s; }
//   .mood-chip:hover, .mood-chip.selected { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.08); }

//   .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
//   .analytics-full { margin-bottom: 16px; }
//   .big-chart { display: flex; align-items: flex-end; gap: 12px; height: 140px; padding-top: 16px; }
//   .donut-chart { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
//   .donut-inner { width: 60px; height: 60px; border-radius: 50%; background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; }
//   .donut-total { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; color: var(--text); line-height: 1; }
//   .donut-label { font-family: 'DM Mono', monospace; font-size: 8px; color: var(--muted); margin-top: 2px; }
//   .legend { display: flex; flex-direction: column; gap: 8px; margin-left: 16px; justify-content: center; }
//   .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
//   .legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
//   .insight-card { background: var(--surface2); border-radius: 8px; padding: 14px; border-left: 3px solid var(--teal); margin-bottom: 10px; }
//   .insight-title { font-size: 13px; font-weight: 700; color: var(--teal); margin-bottom: 4px; }
//   .insight-body { font-size: 12px; color: var(--muted); line-height: 1.5; }

//   .goals-full { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//   .goal-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; position: relative; overflow: hidden; transition: transform 0.2s; }
//   .goal-card:hover { transform: translateY(-2px); }
//   .goal-card-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
//   .goal-card-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
//   .goal-card-desc { font-size: 12px; color: var(--muted); margin-bottom: 16px; line-height: 1.5; }
//   .big-progress { margin-bottom: 14px; }
//   .big-progress-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
//   .big-progress-label { font-size: 12px; color: var(--muted); }
//   .big-progress-pct { font-family: 'DM Mono', monospace; font-size: 14px; color: var(--gold); font-weight: 500; }
//   .big-progress-bar { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
//   .big-progress-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
//   .milestones { margin-top: 14px; border-top: 1px solid var(--border); padding-top: 14px; }
//   .milestone-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 12px; color: var(--muted); cursor: pointer; transition: color 0.2s; }
//   .milestone-item:hover { color: var(--text); }
//   .ms-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
//   .ms-done { background: var(--teal); }
//   .ms-pending { background: var(--dim); }

//   .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
//   .tab { padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; color: var(--muted); border-bottom: 2px solid transparent; transition: all 0.2s; letter-spacing: 0.3px; }
//   .tab.active { color: var(--gold); border-bottom-color: var(--gold); }
//   .tab:hover:not(.active) { color: var(--text); }

//   .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; }
//   .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 28px; width: 480px; max-width: 90vw; max-height: 90vh; overflow-y: auto; }
//   .modal-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 20px; }
//   .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }

//   .toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface); border: 1px solid var(--teal); border-radius: 10px; padding: 12px 20px; font-size: 13px; color: var(--teal); z-index: 2000; animation: slideUp 0.3s ease; font-family: 'DM Mono', monospace; letter-spacing: 0.5px; }
//   .toast.error { border-color: var(--rose); color: var(--rose); }

//   .delete-btn { background: none; border: none; color: var(--dim); cursor: pointer; font-size: 14px; padding: 4px 8px; border-radius: 4px; transition: color 0.2s; }
//   .delete-btn:hover { color: var(--rose); }

//   .empty-state { text-align: center; padding: 40px 32px; color: var(--muted); }
//   .empty-icon { font-size: 36px; margin-bottom: 10px; }
//   .empty-text { font-size: 14px; margin-bottom: 6px; color: var(--text); }
//   .empty-sub { font-size: 12px; }

//   .section-heading { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
//   select.input-field { cursor: pointer; }
//   .progress-input { width: 64px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; color: var(--gold); font-family: 'DM Mono', monospace; font-size: 13px; text-align: center; outline: none; }
//   .progress-input:focus { border-color: var(--gold); }

//   @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//   @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

//   ::-webkit-scrollbar { width: 4px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }
//   ::-webkit-scrollbar-thumb:hover { background: var(--muted); }
// `;





//implementing pwa specific styles here to avoid bloating the main stylesheet with print media queries and such

export const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c12;
    --surface: #111520;
    --surface2: #161b2e;
    --border: #1e2540;
    --gold: #c9a84c;
    --gold-light: #f0cc6e;
    --teal: #3ecfb2;
    --rose: #e05c7a;
    --text: #e8e4d9;
    --muted: #6b7280;
    --dim: #3a4055;
  }

  .app { font-family: 'Lato', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; overflow: hidden; }

  .sidebar { width: 220px; min-width: 220px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 0; position: relative; z-index: 10; }
  .sidebar-logo { padding: 28px 24px 24px; border-bottom: 1px solid var(--border); }
  .logo-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); letter-spacing: -0.5px; line-height: 1; }
  .logo-sub { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
  .sidebar-date { padding: 16px 24px; border-bottom: 1px solid var(--border); }
  .sidebar-date-day { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: var(--text); line-height: 1; }
  .sidebar-date-rest { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 1px; margin-top: 4px; }
  .sidebar-nav { flex: 1; padding: 16px 0; overflow-y: auto; }
  .nav-section-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--dim); letter-spacing: 2px; text-transform: uppercase; padding: 12px 24px 6px; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 24px; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; font-size: 14px; color: var(--muted); font-weight: 400; }
  .nav-item:hover { color: var(--text); background: var(--surface2); border-left-color: var(--dim); }
  .nav-item.active { color: var(--gold); background: rgba(201, 168, 76, 0.07); border-left-color: var(--gold); font-weight: 700; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-footer { padding: 16px 24px; border-top: 1px solid var(--border); }
  .sync-btn { width: 100%; padding: 10px; background: transparent; border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer; letter-spacing: 1px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .sync-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201, 168, 76, 0.05); }

  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
  .topbar { padding: 20px 36px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--surface); }
  .page-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--text); }
  .page-subtitle { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); margin-top: 2px; letter-spacing: 0.5px; }
  .topbar-actions { display: flex; gap: 10px; align-items: center; }
  .btn { padding: 9px 18px; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; font-family: 'Lato', sans-serif; }
  .btn-primary { background: var(--gold); color: #0a0c12; border: none; }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
  .btn-danger { background: transparent; border: 1px solid var(--rose); color: var(--rose); }
  .btn-danger:hover { background: rgba(224,92,122,0.1); }

  .content { flex: 1; overflow-y: auto; padding: 32px 36px; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; position: relative; overflow: hidden; transition: transform 0.2s, border-color 0.2s; }
  .stat-card:hover { transform: translateY(-2px); border-color: var(--dim); }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent, var(--gold)); }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: var(--text); margin: 6px 0 4px; line-height: 1; }
  .stat-note { font-size: 12px; color: var(--muted); }
  .stat-note.positive { color: var(--teal); }
  .stat-note.negative { color: var(--rose); }

  .dashboard-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }
  .dashboard-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .card-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--text); }
  .card-badge { font-family: 'DM Mono', monospace; font-size: 10px; padding: 3px 8px; border-radius: 20px; letter-spacing: 1px; }
  .badge-gold { background: rgba(201,168,76,0.15); color: var(--gold); }
  .badge-teal { background: rgba(62,207,178,0.12); color: var(--teal); }
  .badge-rose { background: rgba(224,92,122,0.12); color: var(--rose); }

  .mini-chart { display: flex; align-items: flex-end; gap: 6px; height: 80px; padding-top: 8px; }
  .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
  .bar { width: 100%; border-radius: 3px 3px 0 0; transition: height 0.4s ease; min-height: 4px; }
  .bar-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 0.5px; }

  .entry-list { display: flex; flex-direction: column; gap: 10px; }
  .entry-item { padding: 14px; background: var(--surface2); border-radius: 8px; border-left: 3px solid var(--gold); transition: all 0.2s; position: relative; }
  .entry-item.teal { border-left-color: var(--teal); }
  .entry-item.rose { border-left-color: var(--rose); }
  .entry-meta { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .entry-time { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); }
  .entry-tag { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; }
  .entry-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .entry-text { font-size: 13px; color: var(--text); line-height: 1.5; opacity: 0.85; }

  .goal-item { margin-bottom: 14px; }
  .goal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .goal-name { font-size: 13px; font-weight: 700; color: var(--text); }
  .goal-pct { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--gold); }
  .goal-bar-bg { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
  .goal-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
  .goal-deadline { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); margin-top: 4px; }

  .wake-tracker { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
  .wake-day { text-align: center; }
  .wake-dot { width: 28px; height: 28px; border-radius: 50%; margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; }
  .wake-dot.early { background: rgba(62,207,178,0.2); color: var(--teal); border: 1px solid var(--teal); }
  .wake-dot.mid { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid var(--gold); }
  .wake-dot.late { background: rgba(224,92,122,0.15); color: var(--rose); border: 1px solid var(--rose); }
  .wake-dot.empty { background: var(--surface2); color: var(--dim); border: 1px solid var(--border); }
  .wake-day-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 0.5px; }

  .expense-list { display: flex; flex-direction: column; gap: 8px; }
  .expense-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--surface2); border-radius: 8px; transition: all 0.2s; }
  .expense-item:hover { background: #1d2340; }
  .expense-left { display: flex; align-items: center; gap: 12px; }
  .expense-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .expense-name { font-size: 13px; font-weight: 700; color: var(--text); }
  .expense-cat { font-size: 11px; color: var(--muted); }
  .expense-amount { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; color: var(--rose); }

  .journal-compose { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 24px; margin-bottom: 24px; }
  .journal-input-row { display: flex; gap: 12px; margin-bottom: 14px; }
  .input-field { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: var(--text); font-family: 'Lato', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s; }
  .input-field:focus { border-color: var(--gold); }
  .input-field::placeholder { color: var(--dim); }
  textarea.input-field { resize: vertical; min-height: 80px; width: 100%; display: block; margin-bottom: 12px; }
  .mood-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
  .mood-chip { padding: 6px 14px; border-radius: 20px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .mood-chip:hover, .mood-chip.selected { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.08); }

  .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .analytics-full { margin-bottom: 16px; }
  .big-chart { display: flex; align-items: flex-end; gap: 12px; height: 140px; padding-top: 16px; }
  .donut-chart { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
  .donut-inner { width: 60px; height: 60px; border-radius: 50%; background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .donut-total { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; color: var(--text); line-height: 1; }
  .donut-label { font-family: 'DM Mono', monospace; font-size: 8px; color: var(--muted); margin-top: 2px; }
  .legend { display: flex; flex-direction: column; gap: 8px; margin-left: 16px; justify-content: center; }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
  .legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
  .insight-card { background: var(--surface2); border-radius: 8px; padding: 14px; border-left: 3px solid var(--teal); margin-bottom: 10px; }
  .insight-title { font-size: 13px; font-weight: 700; color: var(--teal); margin-bottom: 4px; }
  .insight-body { font-size: 12px; color: var(--muted); line-height: 1.5; }

  .goals-full { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .goal-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; position: relative; overflow: hidden; transition: transform 0.2s; }
  .goal-card:hover { transform: translateY(-2px); }
  .goal-card-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  .goal-card-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .goal-card-desc { font-size: 12px; color: var(--muted); margin-bottom: 16px; line-height: 1.5; }
  .big-progress { margin-bottom: 14px; }
  .big-progress-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .big-progress-label { font-size: 12px; color: var(--muted); }
  .big-progress-pct { font-family: 'DM Mono', monospace; font-size: 14px; color: var(--gold); font-weight: 500; }
  .big-progress-bar { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .big-progress-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .milestones { margin-top: 14px; border-top: 1px solid var(--border); padding-top: 14px; }
  .milestone-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 12px; color: var(--muted); cursor: pointer; transition: color 0.2s; }
  .milestone-item:hover { color: var(--text); }
  .ms-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ms-done { background: var(--teal); }
  .ms-pending { background: var(--dim); }

  .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
  .tab { padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; color: var(--muted); border-bottom: 2px solid transparent; transition: all 0.2s; letter-spacing: 0.3px; }
  .tab.active { color: var(--gold); border-bottom-color: var(--gold); }
  .tab:hover:not(.active) { color: var(--text); }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 28px; width: 480px; max-width: 90vw; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 20px; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }

  .toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface); border: 1px solid var(--teal); border-radius: 10px; padding: 12px 20px; font-size: 13px; color: var(--teal); z-index: 2000; animation: slideUp 0.3s ease; font-family: 'DM Mono', monospace; letter-spacing: 0.5px; }
  .toast.error { border-color: var(--rose); color: var(--rose); }

  .delete-btn { background: none; border: none; color: var(--dim); cursor: pointer; font-size: 14px; padding: 4px 8px; border-radius: 4px; transition: color 0.2s; }
  .delete-btn:hover { color: var(--rose); }

  .empty-state { text-align: center; padding: 40px 32px; color: var(--muted); }
  .empty-icon { font-size: 36px; margin-bottom: 10px; }
  .empty-text { font-size: 14px; margin-bottom: 6px; color: var(--text); }
  .empty-sub { font-size: 12px; }

  .section-heading { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  select.input-field { cursor: pointer; }
  .progress-input { width: 64px; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; color: var(--gold); font-family: 'DM Mono', monospace; font-size: 13px; text-align: center; outline: none; }
  .progress-input:focus { border-color: var(--gold); }

  @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--muted); }

  /* ── MOBILE RESPONSIVE ───────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .app { flex-direction: column; }

    /* Hide desktop sidebar on mobile */
    .sidebar { display: none; }

    /* Main takes full width */
    .main { width: 100vw; padding-bottom: 72px; }

    /* Topbar compact */
    .topbar { padding: 14px 16px; }
    .page-title { font-size: 20px; }
    .page-subtitle { display: none; }
    .topbar-actions .btn-ghost { display: none; }

    /* Content padding */
    .content { padding: 16px; }

    /* Stats grid — 2 cols on mobile */
    .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .stat-value { font-size: 24px; }

    /* Dashboard grids stack */
    .dashboard-grid { grid-template-columns: 1fr; }
    .dashboard-row { grid-template-columns: 1fr; }
    .analytics-grid { grid-template-columns: 1fr; }
    .goals-full { grid-template-columns: 1fr; }

    /* Cards */
    .card { padding: 14px; }

    /* Modals full screen on mobile */
    .modal { width: 100vw; max-width: 100vw; margin: 0; border-radius: 16px 16px 0 0; position: fixed; bottom: 0; left: 0; max-height: 90vh; }
    .modal-overlay { align-items: flex-end; }

    /* Journal compose */
    .journal-input-row { flex-direction: column; }

    /* Expense grid */
    .expense-item { padding: 10px; }

    /* Bottom nav bar */
    .bottom-nav {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 64px;
      background: var(--surface);
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 100;
      padding-bottom: env(safe-area-inset-bottom);
    }

    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 6px 12px;
      cursor: pointer;
      color: var(--muted);
      transition: color 0.2s;
      min-width: 44px;
    }

    .bottom-nav-item.active { color: var(--gold); }
    .bottom-nav-icon { font-size: 20px; line-height: 1; }
    .bottom-nav-label { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
  }

  /* Desktop — hide bottom nav */
  @media (min-width: 769px) {
    .bottom-nav { display: none; }
  }

  /* Safe area for notched phones */
  @supports (padding-top: env(safe-area-inset-top)) {
    .topbar { padding-top: max(14px, env(safe-area-inset-top)); }
  }
`;

// Appended mobile styles for PWA
export const mobileStyle = `
  @media (max-width: 768px) {
    .app { flex-direction: column; }

    .sidebar {
      width: 100%;
      min-width: unset;
      border-right: none;
      border-bottom: 1px solid var(--border);
      flex-direction: row;
      align-items: center;
      padding: 0;
      height: 56px;
      overflow-x: auto;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: var(--surface);
    }

    .sidebar-logo, .sidebar-date, .sidebar-footer { display: none; }

    .sidebar-nav {
      display: flex;
      flex-direction: row;
      padding: 0;
      overflow-x: auto;
      width: 100%;
      justify-content: space-around;
    }

    .nav-section-label { display: none; }

    .nav-item {
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 12px;
      border-left: none;
      border-top: 3px solid transparent;
      font-size: 10px;
      min-width: 56px;
      white-space: nowrap;
    }

    .nav-item.active {
      border-left: none;
      border-top-color: var(--gold);
      background: rgba(201, 168, 76, 0.07);
    }

    .nav-icon { font-size: 18px; width: auto; }

    .main {
      padding-bottom: 56px;
    }

    .topbar {
      padding: 14px 16px;
    }

    .page-title { font-size: 20px; }
    .page-subtitle { display: none; }

    .topbar-actions .btn-ghost { display: none; }
    .btn { padding: 8px 14px; font-size: 12px; }

    .content { padding: 16px; }

    .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .stat-value { font-size: 24px; }

    .dashboard-grid { grid-template-columns: 1fr; }
    .dashboard-row { grid-template-columns: 1fr; }

    .analytics-grid { grid-template-columns: 1fr; }
    .goals-full { grid-template-columns: 1fr; }

    .journal-input-row { flex-direction: column; }
    .journal-input-row .input-field:last-child { max-width: 100% !important; }

    .modal { width: 95vw; padding: 20px; }

    .card { padding: 16px; }
    .card-title { font-size: 14px; }

    .tabs { overflow-x: auto; }
    .tab { white-space: nowrap; padding: 10px 14px; font-size: 12px; }

    .toast { bottom: 72px; right: 12px; left: 12px; text-align: center; }
  }

  @media (max-width: 400px) {
    .stats-grid { grid-template-columns: 1fr; }
    .nav-item { font-size: 9px; padding: 8px 8px; min-width: 44px; }
  }
`;