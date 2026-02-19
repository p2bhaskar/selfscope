import { useState, useEffect, useReducer, createContext, useContext, useCallback, useMemo } from 'react';

// -------------------- Toast Context --------------------
const ToastContext = createContext();
let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} role="alert">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// -------------------- Global State (Reducer) --------------------
const initialState = {
  journal: [
    { id: 1, date: "Feb 18, 2026", time: "07:12 AM", mood: "😊", text: "Woke up feeling refreshed. Had a clear mind, decided to tackle the ML assignment first thing.", tags: ["morning", "productive"] },
    { id: 2, date: "Feb 17, 2026", time: "11:30 PM", mood: "😔", text: "Stressed about the upcoming DSA exam. Need to revise recursion and dynamic programming.", tags: ["stress", "academic"] },
    { id: 3, date: "Feb 17, 2026", time: "02:45 PM", mood: "🔥", text: "Just completed my first full-stack mini project. Feels great!", tags: ["achievement", "coding"] },
  ],
  expenses: [
    { id: 1, name: "Lunch - Canteen", cat: "Food", amount: 85, date: "Today", color: "#fc5c7d" },
    { id: 2, name: "Data Pack Recharge", cat: "Utilities", amount: 249, date: "Today", color: "#7c5cfc" },
    { id: 3, name: "Books - DSA", cat: "Education", amount: 450, date: "Feb 17", color: "#5cf4c4" },
    { id: 4, name: "Snacks", cat: "Food", amount: 60, date: "Feb 17", color: "#fc5c7d" },
    { id: 5, name: "Auto Rickshaw", cat: "Transport", amount: 40, date: "Feb 16", color: "#fcb45c" },
  ],
  goals: [
    { id: 1, title: "Complete DSA Course", cat: "Academic", progress: 65, deadline: "Mar 15, 2026", status: "on-track", color: "#7c5cfc" },
    { id: 2, title: "Build Portfolio Website", cat: "Professional", progress: 30, deadline: "Apr 1, 2026", status: "behind", color: "#fc5c7d" },
    { id: 3, title: "Read 10 Research Papers", cat: "Academic", progress: 40, deadline: "May 30, 2026", status: "on-track", color: "#5cf4c4" },
    { id: 4, title: "Get AWS Cloud Cert", cat: "Professional", progress: 10, deadline: "Jun 15, 2026", status: "not-started", color: "#fcb45c" },
  ],
  tasks: [
    { id: 1, text: "Submit ML assignment", deadline: "Feb 20", done: false, priority: "high" },
    { id: 2, text: "Review Recursion chapter", deadline: "Feb 19", done: true, priority: "high" },
    { id: 3, text: "Attend DBMS lecture", deadline: "Today", done: false, priority: "medium" },
    { id: 4, text: "Update GitHub portfolio", deadline: "Feb 25", done: false, priority: "low" },
    { id: 5, text: "Email professor for project feedback", deadline: "Feb 21", done: true, priority: "medium" },
  ],
  settings: {
    name: 'Aryan',
    budget: 8000,
    wakeTarget: '06:00',
    sleepTarget: '23:00',
    sheetId: '',
  },
};

const LOAD_STATE = 'LOAD_STATE';
const ADD_JOURNAL = 'ADD_JOURNAL';
const ADD_EXPENSE = 'ADD_EXPENSE';
const ADD_GOAL = 'ADD_GOAL';
const UPDATE_GOAL = 'UPDATE_GOAL';
const TOGGLE_TASK = 'TOGGLE_TASK';
const ADD_TASK = 'ADD_TASK';
const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
// etc. Add more actions as needed

function appReducer(state, action) {
  switch (action.type) {
    case LOAD_STATE:
      return { ...state, ...action.payload };
    case ADD_JOURNAL:
      return { ...state, journal: [action.payload, ...state.journal] };
    case ADD_EXPENSE:
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case ADD_GOAL:
      return { ...state, goals: [...state.goals, action.payload] };
    case UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g),
      };
    case TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload ? { ...t, done: !t.done } : t),
      };
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

const StateContext = createContext();

function StateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selfscope');
    if (saved) {
      try {
        dispatch({ type: LOAD_STATE, payload: JSON.parse(saved) });
      } catch (e) {}
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('selfscope', JSON.stringify(state));
  }, [state]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

function useAppState() {
  return useContext(StateContext);
}

// -------------------- Reusable Components --------------------
function StatCard({ label, value, sub, icon, color = 'purple' }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      <div className="stat-icon" aria-hidden="true">{icon}</div>
    </div>
  );
}

function ProgressBar({ progress, color, height = 6 }) {
  return (
    <div className="progress-bar" style={{ height }}>
      <div className="progress-fill" style={{ width: `${progress}%`, background: color }} />
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && onClose()} aria-modal="true" role="dialog">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DonutChart({ segments, size = 120, thickness = 22 }) {
  const r = (size / 2) - thickness / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const arcs = segments.map(seg => {
    const dash = (seg.pct / 100) * circ;
    const arc = { ...seg, dash, gap: circ - dash, offset };
    offset += dash;
    return arc;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {arcs.map((a, i) => (
        <circle key={i} cx={size/2} cy={size/2} r={r}
          fill="none" stroke={a.color} strokeWidth={thickness}
          strokeDasharray={`${a.dash} ${a.gap}`}
          strokeDashoffset={-a.offset}
          strokeLinecap="round" />
      ))}
    </svg>
  );
}

function MiniBarChart({ data, color = "#7c5cfc" }) {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div className="chart-wrap">
      {data.map((d, i) => (
        <div className="chart-bar-col" key={i}>
          <div className="chart-val">{typeof d.val === 'number' ? d.val.toFixed(1) : d.val}</div>
          <div className="chart-bar" style={{ height: `${(d.val/max)*90}%`, background: color, opacity: i === data.length-1 ? 1 : 0.4 }} />
          <div className="chart-label">{d.month}</div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {actionLabel && <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

// -------------------- Pages --------------------
function DashboardPage({ setPage }) {
  const { state, dispatch } = useAppState();
  const toast = useToast();
  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const tasks = state.tasks;
  const doneTasks = tasks.filter(t => t.done).length;
  const totalExpensesToday = state.expenses.filter(e => e.date === 'Today').reduce((s, e) => s + e.amount, 0);
  const totalGoals = state.goals.length;
  const behindGoals = state.goals.filter(g => g.status === 'behind').length;

  const toggleTask = useCallback(id => {
    dispatch({ type: TOGGLE_TASK, payload: id });
  }, [dispatch]);

  const recentJournal = state.journal.slice(0, 2);
  const recentGoals = state.goals.slice(0, 3);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {state.settings.name} 👋</div>
        <div className="page-subtitle">{today} — Here's your life at a glance</div>
      </div>

      <div className="grid-4" style={{marginBottom:20}}>
        <StatCard label="Wake Time" value="06:45" sub="2h 15m ahead" icon="⏰" color="purple" />
        <StatCard label="Today's Spend" value={`₹${totalExpensesToday}`} sub={`Budget: ₹${state.settings.budget - totalExpensesToday} left`} icon="💸" color="pink" />
        <StatCard label="Tasks Done" value={`${doneTasks}/${tasks.length}`} sub="Keep going!" icon="✅" color="green" />
        <StatCard label="Goals Active" value={totalGoals} sub={`${behindGoals} behind`} icon="🎯" color="yellow" />
      </div>

      <div className="grid-2" style={{marginBottom:16}}>
        <div className="card">
          <div className="section-row">
            <div className="card-title">Today's Tasks</div>
            <button className="btn btn-ghost" style={{fontSize:11,padding:'5px 10px'}} onClick={() => setPage('tasks')}>View All →</button>
          </div>
          {tasks.filter(t => !t.done).length === 0 ? (
            <EmptyState message="All tasks completed! 🎉" actionLabel="Add Task" onAction={() => setPage('tasks')} />
          ) : (
            tasks.filter(t => !t.done).slice(0, 4).map(t => (
              <div key={t.id} className="task-item">
                <div className={`task-check ${t.done ? 'done' : ''}`} onClick={() => toggleTask(t.id)} role="checkbox" aria-checked={t.done} tabIndex={0} onKeyPress={e => e.key === 'Enter' && toggleTask(t.id)}>
                  {t.done ? '✓' : ''}
                </div>
                <div className={`task-text ${t.done ? 'done' : ''}`}>{t.text}</div>
                <div className="task-deadline">{t.deadline}</div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-title">Sleep & Wake Log</div>
          <div className="time-log-grid">
            <div className="time-log-box">
              <div className="time-log-icon">🌙</div>
              <div className="time-log-label">Sleep Time</div>
              <div className="time-log-time">11:30 PM</div>
            </div>
            <div className="time-log-box">
              <div className="time-log-icon">☀️</div>
              <div className="time-log-label">Wake Time</div>
              <div className="time-log-time">06:45 AM</div>
            </div>
          </div>
          <div style={{marginTop:14}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text2)', marginBottom:6}}>
              <span>Sleep Quality</span><span style={{color:'var(--accent3)'}}>7h 15m · Good</span>
            </div>
            <ProgressBar progress={72} color="var(--accent3)" />
          </div>
          <button className="btn btn-primary" style={{marginTop:14, width:'100%', justifyContent:'center'}} onClick={() => setPage('journal')}>
            + Log Today's Wake Time
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-row">
            <div className="card-title">Recent Thoughts</div>
            <button className="btn btn-ghost" style={{fontSize:11,padding:'5px 10px'}} onClick={() => setPage('journal')}>Open Journal →</button>
          </div>
          {recentJournal.length === 0 ? (
            <EmptyState message="No journal entries yet." actionLabel="Write First" onAction={() => setPage('journal')} />
          ) : (
            recentJournal.map(j => (
              <div key={j.id} className="timeline-item">
                <div>
                  <div className="timeline-dot" style={{background:'var(--accent)', marginTop:6}} />
                </div>
                <div>
                  <div style={{fontSize:13, color:'var(--text)', lineHeight:1.5}}>{j.mood} {j.text.slice(0,80)}...</div>
                  <div className="timeline-time">{j.date} · {j.time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="section-row">
            <div className="card-title">Goal Progress</div>
            <button className="btn btn-ghost" style={{fontSize:11,padding:'5px 10px'}} onClick={() => setPage('goals')}>All Goals →</button>
          </div>
          {recentGoals.length === 0 ? (
            <EmptyState message="No goals set yet." actionLabel="Create Goal" onAction={() => setPage('goals')} />
          ) : (
            recentGoals.map(g => (
              <div key={g.id} style={{marginBottom:14}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
                  <span style={{fontSize:13}}>{g.title}</span>
                  <span style={{fontSize:12, color:'var(--text2)'}}>{g.progress}%</span>
                </div>
                <ProgressBar progress={g.progress} color={g.color} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function JournalPage() {
  const { state, dispatch } = useAppState();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mood: '😊', text: '', wakeTime: '', sleepTime: '' });
  const [selectedMood, setSelectedMood] = useState('😊');
  const moods = ['😊','😔','🔥','😴','😤','🤔','😌','🎉'];

  const addEntry = () => {
    if (!form.text.trim()) {
      toast('Please write something.', 'error');
      return;
    }
    const now = new Date();
    const entry = {
      id: Date.now(),
      date: now.toLocaleDateString('en-IN',{month:'short',day:'numeric',year:'numeric'}),
      time: now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
      mood: selectedMood,
      text: form.text,
      tags: form.text.toLowerCase().includes('work') ? ['work'] : ['personal']
    };
    dispatch({ type: ADD_JOURNAL, payload: entry });
    setShowForm(false);
    setForm({ mood: '😊', text: '', wakeTime: '', sleepTime: '' });
    toast('Journal entry saved!', 'success');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Daily Journal</div>
        <div className="page-subtitle">Your thoughts, moods, sleep — all in one place</div>
      </div>

      <div className="grid-2" style={{marginBottom:20}}>
        <div className="card">
          <div className="card-title">Log Today's Entry</div>
          <div style={{marginBottom:14}}>
            <div className="input-label">How are you feeling?</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {moods.map(m => (
                <button key={m} className={`mood-btn ${selectedMood===m?'selected':''}`} onClick={() => setSelectedMood(m)} aria-pressed={selectedMood===m}>{m}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="journal-text">Thoughts / Notes</label>
            <textarea id="journal-text" className="input" placeholder="What's on your mind today?" value={form.text} onChange={e => setForm({...form, text:e.target.value})} />
          </div>
          <div className="grid-2" style={{gap:10, marginBottom:14}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="input-label" htmlFor="wake-time">Wake Time</label>
              <input id="wake-time" type="time" className="input" value={form.wakeTime} onChange={e => setForm({...form, wakeTime:e.target.value})} />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="input-label" htmlFor="sleep-time">Sleep Time (prev night)</label>
              <input id="sleep-time" type="time" className="input" value={form.sleepTime} onChange={e => setForm({...form, sleepTime:e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={addEntry} style={{width:'100%', justifyContent:'center'}}>
            Save Entry
          </button>
        </div>

        <div className="card">
          <div className="card-title">This Week's Mood</div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:8}}>
            {['M','T','W','T','F','S','S'].map((d,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <div style={{fontSize:18}}>{['😊','🔥','😔','😌','🔥','😴','😊'][i]}</div>
                <div style={{fontSize:11,color:'var(--text3)'}}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16}}>
            <div className="card-title" style={{marginBottom:10}}>Sleep This Week</div>
            <div className="chart-wrap">
              {[7.5,6,8,7,6.5,9,7].map((h,i) => (
                <div className="chart-bar-col" key={i}>
                  <div className="chart-val">{h}h</div>
                  <div className="chart-bar" style={{height:`${(h/10)*100}%`, background: h>=7?'var(--accent3)':'var(--accent2)', opacity: i===6?1:0.5}} />
                  <div className="chart-label">{['M','T','W','T','F','S','S'][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Journal Entries</div>
        {state.journal.length === 0 ? (
          <EmptyState message="Your journal is empty. Start writing!" actionLabel="Write First Entry" onAction={() => setShowForm(true)} />
        ) : (
          state.journal.map(e => (
            <div key={e.id} className="timeline-item">
              <div>
                <div style={{fontSize:22}}>{e.mood}</div>
              </div>
              <div style={{flex:1}}>
                <div className="timeline-text">{e.text}</div>
                <div className="timeline-time">{e.date} · {e.time}</div>
                <div style={{marginTop:6, display:'flex', gap:6}}>
                  {e.tags.map(t => (
                    <span key={t} className="badge badge-purple">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ExpensesPage() {
  const { state, dispatch } = useAppState();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', cat:'Food', amount:'' });
  const [errors, setErrors] = useState({});
  const cats = ['Food','Education','Transport','Utilities','Entertainment','Other'];
  const catColors = { Food:'#fc5c7d', Education:'#5cf4c4', Transport:'#fcb45c', Utilities:'#7c5cfc', Entertainment:'#fc5c7d', Other:'#8888a8' };

  const total = state.expenses.reduce((s,e) => s + e.amount, 0);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Required';
    if (!form.amount) err.amount = 'Required';
    else if (isNaN(form.amount) || Number(form.amount) <= 0) err.amount = 'Enter a valid amount';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const addExpense = () => {
    if (!validate()) return;
    const expense = {
      id: Date.now(),
      name: form.name,
      cat: form.cat,
      amount: Number(form.amount),
      date: 'Today',
      color: catColors[form.cat]
    };
    dispatch({ type: ADD_EXPENSE, payload: expense });
    setShowModal(false);
    setForm({ name:'', cat:'Food', amount:'' });
    setErrors({});
    toast('Expense added!', 'success');
  };

  // Monthly data for chart (simplified from real expenses)
  const monthlyData = [
    { month: "Sep", val: 3200 }, { month: "Oct", val: 4100 }, { month: "Nov", val: 2800 },
    { month: "Dec", val: 5200 }, { month: "Jan", val: 3900 }, { month: "Feb", val: total },
  ];

  const expenseCats = useMemo(() => {
    const catMap = {};
    state.expenses.forEach(e => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount; });
    const totalAmount = Object.values(catMap).reduce((a,b) => a+b, 0);
    return Object.entries(catMap).map(([cat, amt]) => ({
      cat,
      pct: totalAmount ? Math.round((amt / totalAmount) * 100) : 0,
      color: catColors[cat] || '#8888a8'
    })).sort((a,b) => b.pct - a.pct);
  }, [state.expenses]);

  return (
    <div className="page">
      <div className="page-header">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <div className="page-title">Expenses</div>
            <div className="page-subtitle">Track every rupee you spend</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} aria-label="Add expense">+ Add Expense</button>
        </div>
      </div>

      <div className="grid-4" style={{marginBottom:20}}>
        <StatCard label="This Month" value={`₹${total.toLocaleString('en-IN')}`} sub={`Budget: ₹${state.settings.budget}`} icon="💳" color="purple" />
        <StatCard label="Today" value={`₹${state.expenses.filter(e => e.date === 'Today').reduce((s,e) => s+e.amount,0)}`} sub="Below avg" icon="📅" color="pink" />
        <StatCard label="Saved" value={`₹${Math.max(0, state.settings.budget - total)}`} sub="vs budget" icon="🏦" color="green" />
        <StatCard label="Top Category" value={expenseCats[0]?.cat || '—'} sub={`${expenseCats[0]?.pct || 0}% of spend`} icon="🍕" color="yellow" />
      </div>

      <div className="grid-2" style={{marginBottom:16}}>
        <div className="card">
          <div className="card-title">Monthly Trend</div>
          <MiniBarChart data={monthlyData} color="var(--accent)" />
        </div>
        <div className="card">
          <div className="card-title">Category Breakdown</div>
          <div style={{display:'flex', alignItems:'center', gap:20, flexWrap:'wrap'}}>
            <div className="donut-wrap" style={{flexShrink:0}}>
              <DonutChart segments={expenseCats.length ? expenseCats : [{pct:100, color:'#2a2a38'}]} />
              <div className="donut-center">
                <div className="donut-val">₹{(total/1000).toFixed(1)}k</div>
                <div className="donut-lbl">total</div>
              </div>
            </div>
            <div style={{flex:1, minWidth:150}}>
              {expenseCats.length === 0 ? (
                <EmptyState message="No expenses yet." />
              ) : (
                expenseCats.map(c => (
                  <div key={c.cat} className="analytics-bar-row" style={{marginBottom:8}}>
                    <div className="analytics-bar-label">{c.cat}</div>
                    <div className="analytics-bar-track">
                      <div className="analytics-bar-fill" style={{width:`${c.pct}%`, background:c.color}} />
                    </div>
                    <div className="analytics-bar-val">{c.pct}%</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Transactions</div>
        {state.expenses.length === 0 ? (
          <EmptyState message="No transactions yet." actionLabel="Add First" onAction={() => setShowModal(true)} />
        ) : (
          state.expenses.map(e => (
            <div key={e.id} className="expense-row">
              <div style={{display:'flex', alignItems:'center'}}>
                <div className="expense-cat-dot" style={{background:e.color}} />
                <div>
                  <div className="expense-name">{e.name}</div>
                  <div className="expense-sub">{e.cat} · {e.date}</div>
                </div>
              </div>
              <div className="expense-amount" style={{color:e.color}}>- ₹{e.amount}</div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <Modal title="Add Expense" onClose={() => { setShowModal(false); setErrors({}); }}>
          <div className="form-group">
            <label className="input-label" htmlFor="expense-name">What did you spend on?</label>
            <input id="expense-name" className="input" placeholder="e.g. Lunch at canteen" value={form.name} onChange={e => setForm({...form, name:e.target.value})} aria-invalid={!!errors.name} />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          <div className="grid-2" style={{gap:12}}>
            <div className="form-group">
              <label className="input-label" htmlFor="expense-cat">Category</label>
              <select id="expense-cat" className="input" value={form.cat} onChange={e => setForm({...form, cat:e.target.value})}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="expense-amount">Amount (₹)</label>
              <input id="expense-amount" type="number" className="input" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} aria-invalid={!!errors.amount} />
              {errors.amount && <div className="error-text">{errors.amount}</div>}
            </div>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="btn btn-primary" style={{flex:1, justifyContent:'center'}} onClick={addExpense}>Save Expense</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function GoalsPage() {
  const { state, dispatch } = useAppState();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', cat:'Academic', deadline:'', progress:0 });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = 'Required';
    if (!form.deadline) err.deadline = 'Required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const addGoal = () => {
    if (!validate()) return;
    const goal = {
      id: Date.now(),
      title: form.title,
      cat: form.cat,
      deadline: form.deadline,
      progress: Number(form.progress),
      status: form.progress === 0 ? 'not-started' : 'on-track',
      color: form.cat === 'Academic' ? '#7c5cfc' : '#fc5c7d'
    };
    dispatch({ type: ADD_GOAL, payload: goal });
    setShowModal(false);
    setForm({ title:'', cat:'Academic', deadline:'', progress:0 });
    setErrors({});
    toast('Goal created!', 'success');
  };

  const totalGoals = state.goals.length;
  const avgProgress = totalGoals ? Math.round(state.goals.reduce((s,g)=>s+g.progress,0)/totalGoals) : 0;
  const behindCount = state.goals.filter(g => g.status === 'behind').length;

  return (
    <div className="page">
      <div className="page-header">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <div className="page-title">Goals & Milestones</div>
            <div className="page-subtitle">Set intentions, track progress, achieve everything</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Goal</button>
        </div>
      </div>

      <div className="grid-3" style={{marginBottom:20}}>
        <StatCard label="Total Goals" value={totalGoals} sub="Across categories" icon="🎯" color="purple" />
        <StatCard label="Avg Progress" value={`${avgProgress}%`} sub="Keep pushing" icon="📈" color="green" />
        <StatCard label="Needs Attention" value={behindCount} sub="Behind schedule" icon="⚠️" color="pink" />
      </div>

      <div style={{marginBottom:16}}>
        {state.goals.length === 0 ? (
          <EmptyState message="No goals yet. Set your first goal!" actionLabel="Create Goal" onAction={() => setShowModal(true)} />
        ) : (
          state.goals.map(g => (
            <div key={g.id} className="goal-card">
              <div className="goal-header">
                <div style={{flex:1}}>
                  <div className="goal-title">{g.title}</div>
                  <div style={{marginTop:6}}>
                    <span className="badge" style={{background: g.cat==='Academic'?'rgba(124,92,252,0.15)':'rgba(92,244,196,0.12)', color: g.cat==='Academic'?'var(--accent)':'var(--accent3)'}}>{g.cat}</span>
                    {' '}
                    <span className="badge" style={{background: g.status==='behind'?'rgba(252,92,125,0.12)':'rgba(92,244,196,0.1)', color: g.status==='behind'?'var(--accent2)':'var(--accent3)'}}>
                      {g.status === 'behind' ? '⚠️ Behind' : g.status === 'on-track' ? '✓ On Track' : '○ Not Started'}
                    </span>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:g.color}}>{g.progress}%</div>
                  <div style={{fontSize:11, color:'var(--text3)'}}>complete</div>
                </div>
              </div>
              <ProgressBar progress={g.progress} color={g.color} height={8} />
              <div className="goal-meta">
                <div className="goal-meta-item">📅 Deadline: {g.deadline}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <Modal title="New Goal" onClose={() => { setShowModal(false); setErrors({}); }}>
          <div className="form-group">
            <label className="input-label" htmlFor="goal-title">Goal Title</label>
            <input id="goal-title" className="input" placeholder="e.g. Complete ML Course" value={form.title} onChange={e => setForm({...form, title:e.target.value})} aria-invalid={!!errors.title} />
            {errors.title && <div className="error-text">{errors.title}</div>}
          </div>
          <div className="grid-2" style={{gap:12}}>
            <div className="form-group">
              <label className="input-label" htmlFor="goal-cat">Category</label>
              <select id="goal-cat" className="input" value={form.cat} onChange={e => setForm({...form, cat:e.target.value})}>
                <option>Academic</option><option>Professional</option><option>Health</option><option>Personal</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="goal-deadline">Deadline</label>
              <input id="goal-deadline" type="date" className="input" value={form.deadline} onChange={e => setForm({...form, deadline:e.target.value})} aria-invalid={!!errors.deadline} />
              {errors.deadline && <div className="error-text">{errors.deadline}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="goal-progress">Starting Progress: {form.progress}%</label>
            <input id="goal-progress" type="range" min="0" max="100" value={form.progress} onChange={e => setForm({...form, progress:e.target.value})} style={{width:'100%', accentColor:'var(--accent)'}} />
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="btn btn-primary" style={{flex:1, justifyContent:'center'}} onClick={addGoal}>Create Goal</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TasksPage() {
  const { state, dispatch } = useAppState();
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ text:'', deadline:'', priority:'medium' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.text.trim()) err.text = 'Required';
    if (!form.deadline) err.deadline = 'Required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const addTask = () => {
    if (!validate()) return;
    const task = { id: Date.now(), ...form, done: false };
    dispatch({ type: ADD_TASK, payload: task });
    setShowModal(false);
    setForm({ text:'', deadline:'', priority:'medium' });
    setErrors({});
    toast('Task added!', 'success');
  };

  const toggleTask = useCallback(id => {
    dispatch({ type: TOGGLE_TASK, payload: id });
  }, [dispatch]);

  const filtered = filter === 'all' ? state.tasks : filter === 'done' ? state.tasks.filter(t=>t.done) : state.tasks.filter(t=>!t.done);
  const priorities = { high: 'var(--accent2)', medium: 'var(--accent4)', low: 'var(--accent3)' };

  const doneCount = state.tasks.filter(t => t.done).length;
  const pendingCount = state.tasks.length - doneCount;
  const completionRate = state.tasks.length ? Math.round((doneCount / state.tasks.length) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <div className="page-title">Tasks & Deadlines</div>
            <div className="page-subtitle">Never miss what matters</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
        </div>
      </div>

      <div className="grid-3" style={{marginBottom:20}}>
        <StatCard label="Completed" value={doneCount} sub={`of ${state.tasks.length} tasks`} icon="✅" color="green" />
        <StatCard label="Pending" value={pendingCount} sub="need attention" icon="⏳" color="pink" />
        <StatCard label="Completion Rate" value={`${completionRate}%`} sub="this week" icon="📊" color="yellow" />
      </div>

      <div className="card">
        <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
          {['all','pending','done'].map(f => (
            <span key={f} className={`chip ${filter===f?'active':''}`} onClick={() => setFilter(f)} role="button" tabIndex={0} onKeyPress={e => e.key==='Enter' && setFilter(f)} style={{textTransform:'capitalize'}}>{f}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <EmptyState message="No tasks in this view." actionLabel={filter==='all'?"Add Task":`Show all`} onAction={() => filter!=='all'?setFilter('all'):setShowModal(true)} />
        ) : (
          filtered.map(t => (
            <div key={t.id} className="task-item">
              <div className={`task-check ${t.done?'done':''}`} onClick={() => toggleTask(t.id)} role="checkbox" aria-checked={t.done} tabIndex={0} onKeyPress={e => e.key==='Enter' && toggleTask(t.id)}>
                {t.done?'✓':''}
              </div>
              <div style={{flex:1}}>
                <div className={`task-text ${t.done?'done':''}`}>{t.text}</div>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <span style={{width:8, height:8, borderRadius:'50%', background:priorities[t.priority], display:'inline-block'}} />
                <div className="task-deadline">{t.deadline}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <Modal title="New Task" onClose={() => { setShowModal(false); setErrors({}); }}>
          <div className="form-group">
            <label className="input-label" htmlFor="task-text">Task</label>
            <input id="task-text" className="input" placeholder="What needs to be done?" value={form.text} onChange={e => setForm({...form, text:e.target.value})} aria-invalid={!!errors.text} />
            {errors.text && <div className="error-text">{errors.text}</div>}
          </div>
          <div className="grid-2" style={{gap:12}}>
            <div className="form-group">
              <label className="input-label" htmlFor="task-priority">Priority</label>
              <select id="task-priority" className="input" value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="task-deadline">Deadline</label>
              <input id="task-deadline" type="date" className="input" value={form.deadline} onChange={e => setForm({...form, deadline:e.target.value})} aria-invalid={!!errors.deadline} />
              {errors.deadline && <div className="error-text">{errors.deadline}</div>}
            </div>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="btn btn-primary" style={{flex:1, justifyContent:'center'}} onClick={addTask}>Add Task</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AnalyticsPage() {
  const { state } = useAppState();

  // Compute expense categories from actual data
  const catMap = {};
  state.expenses.forEach(e => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount; });
  const totalExpenseAmount = Object.values(catMap).reduce((a,b) => a+b, 0);
  const expenseCats = Object.entries(catMap).map(([cat, amt]) => ({
    cat,
    pct: totalExpenseAmount ? Math.round((amt / totalExpenseAmount) * 100) : 0,
    color: e => e.cat === 'Food' ? '#fc5c7d' : e.cat === 'Education' ? '#5cf4c4' : e.cat === 'Transport' ? '#fcb45c' : e.cat === 'Utilities' ? '#7c5cfc' : '#8888a8'
  })).sort((a,b) => b.pct - a.pct);

  const monthlyExpenses = [
    { month: "Sep", val: 3200 }, { month: "Oct", val: 4100 }, { month: "Nov", val: 2800 },
    { month: "Dec", val: 5200 }, { month: "Jan", val: 3900 }, { month: "Feb", val: totalExpenseAmount },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Analytics & Insights</div>
        <div className="page-subtitle">Patterns, trends, and self-awareness at a glance</div>
      </div>

      <div style={{marginBottom:8}}>
        <div className="section-title">💸 Expense Intelligence</div>
      </div>
      <div className="grid-2" style={{marginBottom:16}}>
        <div className="card">
          <div className="card-title">6-Month Spending</div>
          <MiniBarChart data={monthlyExpenses} color="var(--accent)" />
          <div className="insight-box">
            💡 <strong>Insight:</strong> Your December spend (₹5.2k) was 85% higher than usual. Likely festival/travel expenses.
          </div>
        </div>
        <div className="card">
          <div className="card-title">Category Distribution</div>
          <div style={{display:'flex', alignItems:'center', gap:20, flexWrap:'wrap'}}>
            <div className="donut-wrap" style={{flexShrink:0}}>
              <DonutChart segments={expenseCats.length ? expenseCats : [{pct:100, color:'#2a2a38'}]} />
              <div className="donut-center"><div className="donut-val">₹{(totalExpenseAmount/1000).toFixed(1)}k</div><div className="donut-lbl">total</div></div>
            </div>
            <div style={{flex:1, minWidth:150}} className="analytics-bar-wrap">
              {expenseCats.length === 0 ? (
                <EmptyState message="No expense data yet." />
              ) : (
                expenseCats.map(c => (
                  <div key={c.cat} className="analytics-bar-row">
                    <div className="analytics-bar-label">{c.cat}</div>
                    <div className="analytics-bar-track"><div className="analytics-bar-fill" style={{width:`${c.pct}%`, background:c.color}} /></div>
                    <div className="analytics-bar-val">{c.pct}%</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{marginBottom:8}}>
        <div className="section-title">🎯 Goal Performance</div>
      </div>
      <div className="grid-2" style={{marginBottom:16}}>
        <div className="card">
          <div className="card-title">Achievement Rate by Category</div>
          <div style={{display:'flex', gap:20, marginTop:8, flexWrap:'wrap'}}>
            {['Academic','Professional','Health'].map(cat => {
              const goals = state.goals.filter(g => g.cat === cat);
              const avg = goals.length ? Math.round(goals.reduce((s,g) => s+g.progress,0) / goals.length) : 0;
              const color = cat === 'Academic' ? 'var(--accent)' : cat === 'Professional' ? 'var(--accent3)' : 'var(--accent4)';
              return (
                <div key={cat} style={{flex:1, textAlign:'center', minWidth:80}}>
                  <div className="donut-wrap" style={{margin:'0 auto'}}>
                    <DonutChart segments={[{pct:avg, color},{pct:100-avg, color:'#1a1a24'}]} size={90} thickness={14} />
                    <div className="donut-center"><div style={{fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800}}>{avg}%</div></div>
                  </div>
                  <div style={{fontSize:12, color:'var(--text2)', marginTop:8}}>{cat}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Goals — Progress Overview</div>
          <div className="analytics-bar-wrap">
            {state.goals.length === 0 ? (
              <EmptyState message="No goals yet." />
            ) : (
              state.goals.map(g => (
                <div key={g.id} className="analytics-bar-row">
                  <div className="analytics-bar-label" style={{fontSize:11, width:100}}>{g.title.slice(0,12)}…</div>
                  <div className="analytics-bar-track"><div className="analytics-bar-fill" style={{width:`${g.progress}%`, background:g.color}} /></div>
                  <div className="analytics-bar-val">{g.progress}%</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{marginBottom:8}}>
        <div className="section-title">😴 Sleep & Productivity</div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Sleep Duration — Last 7 Days</div>
          <MiniBarChart data={[{month:'M',val:7.5},{month:'T',val:6},{month:'W',val:8},{month:'T',val:7},{month:'F',val:6.5},{month:'S',val:9},{month:'S',val:7}].map(d=>({...d, val:d.val*100}))} color="var(--accent3)" />
        </div>
        <div className="card">
          <div className="card-title">Productivity Correlation</div>
          <div style={{padding:'16px 0'}}>
            {[
              { label: 'Tasks Done on 7h+ sleep', pct: 82, color: 'var(--accent3)' },
              { label: 'Tasks Done on <6h sleep', pct: 41, color: 'var(--accent2)' },
              { label: 'Journal entries/day (avg)', pct: 60, color: 'var(--accent)' },
            ].map(r => (
              <div key={r.label} style={{marginBottom:14}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text2)', marginBottom:4}}>
                  <span>{r.label}</span><span style={{color:r.color}}>{r.pct}%</span>
                </div>
                <ProgressBar progress={r.pct} color={r.color} height={8} />
              </div>
            ))}
          </div>
          <div className="insight-box">
            💡 <strong>Insight:</strong> You complete 2x more tasks when you sleep ≥ 7 hours.
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { state, dispatch } = useAppState();
  const toast = useToast();
  const [form, setForm] = useState(state.settings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = () => {
    dispatch({ type: UPDATE_SETTINGS, payload: form });
    setSaved(true);
    toast('Settings saved!', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-subtitle">Personalize your SelfScope experience</div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-title">Profile</div>
            <div className="form-group">
              <label className="input-label" htmlFor="name">Your Name</label>
              <input id="name" name="name" className="input" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="budget">Monthly Expense Budget (₹)</label>
              <input id="budget" name="budget" type="number" className="input" value={form.budget} onChange={handleChange} />
            </div>
          </div>

          <div className="card" style={{marginBottom:16}}>
            <div className="card-title">Sleep Goals</div>
            <div className="grid-2" style={{gap:12}}>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="input-label" htmlFor="wakeTarget">Target Wake Time</label>
                <input id="wakeTarget" name="wakeTarget" type="time" className="input" value={form.wakeTarget} onChange={handleChange} />
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="input-label" htmlFor="sleepTarget">Target Sleep Time</label>
                <input id="sleepTarget" name="sleepTarget" type="time" className="input" value={form.sleepTarget} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">🔗 Google Sheets Integration</div>
            <div style={{fontSize:13, color:'var(--text2)', marginBottom:12, lineHeight:1.6}}>
              Connect a Google Sheet as your data backend. All entries will sync automatically via Google Sheets API.
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="sheetId">Google Spreadsheet ID</label>
              <input id="sheetId" name="sheetId" className="input" placeholder="Paste your Spreadsheet ID here" value={form.sheetId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="apiKey">API Key</label>
              <input id="apiKey" type="password" className="input" placeholder="Google Sheets API Key" />
            </div>
            <div className="info-note">
              📝 Sheet tabs expected: <code>journal, expenses, goals, tasks, sleep</code>
            </div>
            <button className="btn btn-ghost" style={{width:'100%', justifyContent:'center'}}>Test Connection</button>
          </div>
        </div>

        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-title">Data & Export</div>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              <button className="btn btn-ghost" style={{justifyContent:'flex-start'}}>📊 Export All Data as CSV</button>
              <button className="btn btn-ghost" style={{justifyContent:'flex-start'}}>🔄 Sync to Google Sheets Now</button>
              <button className="btn btn-ghost" style={{justifyContent:'flex-start'}}>📥 Import from Google Sheets</button>
              <button className="btn btn-danger" style={{justifyContent:'flex-start', marginTop:8}}>🗑️ Clear All Local Data</button>
            </div>
          </div>

          <div className="card" style={{marginBottom:16}}>
            <div className="card-title">GitHub Pages Deployment</div>
            <div style={{fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:12}}>
              This app is designed to run on GitHub Pages. Connect your Google Sheet and deploy with <code>gh-pages</code>.
            </div>
            <div className="code-block">
              npm run build<br/>npm run deploy
            </div>
          </div>

          <div className="card">
            <div className="card-title">App Info</div>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              {[['App Version','1.1.0'],['Data Backend','LocalStorage + Google Sheets'],['Last Sync','Just now'],['Hosting','GitHub Pages']].map(([k,v]) => (
                <div key={k} style={{display:'flex', justifyContent:'space-between', fontSize:13}}>
                  <span style={{color:'var(--text2)'}}>{k}</span>
                  <span style={{color:'var(--accent)'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:20, display:'flex', justifyContent:'flex-end', gap:10}}>
        <button className="btn btn-ghost">Discard Changes</button>
        <button className="btn btn-primary" onClick={save}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

// -------------------- Navigation & App --------------------
const navItems = [
  { id:'dashboard', label:'Dashboard', icon:'⊞', section:'main' },
  { id:'journal', label:'Journal', icon:'📓', section:'main' },
  { id:'expenses', label:'Expenses', icon:'💸', section:'main' },
  { id:'goals', label:'Goals', icon:'🎯', section:'main' },
  { id:'tasks', label:'Tasks', icon:'✓', section:'main' },
  { id:'analytics', label:'Analytics', icon:'📊', section:'insights' },
  { id:'settings', label:'Settings', icon:'⚙', section:'config' },
];

function App() {
  const [page, setPage] = useState('dashboard');
  const now = new Date();
  const sections = ['main', 'insights', 'config'];
  const sectionLabels = { main:'Core', insights:'Insights', config:'System' };

  const pages = {
    dashboard: <DashboardPage setPage={setPage} />,
    journal: <JournalPage />,
    expenses: <ExpensesPage />,
    goals: <GoalsPage />,
    tasks: <TasksPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  };

  return (
    <StateProvider>
      <ToastProvider>
        <style>{globalStyles}</style>
        <div className="app">
          <aside className="sidebar" aria-label="Main navigation">
            <div className="logo">
              <div className="logo-title">SelfScope</div>
              <div className="logo-sub">Personal OS</div>
            </div>

            {sections.map(sec => {
              const items = navItems.filter(n => n.section === sec);
              if (!items.length) return null;
              return (
                <div key={sec} className="nav-section">
                  <div className="nav-label">{sectionLabels[sec]}</div>
                  {items.map(n => (
                    <div
                      key={n.id}
                      className={`nav-item ${page===n.id?'active':''}`}
                      onClick={() => setPage(n.id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={e => e.key==='Enter' && setPage(n.id)}
                      aria-current={page===n.id ? 'page' : undefined}
                    >
                      <span className="icon" aria-hidden="true">{n.icon}</span>
                      {n.label}
                    </div>
                  ))}
                </div>
              );
            })}

            <div className="sidebar-bottom">
              <div className="avatar-row">
                <div className="avatar" aria-hidden="true">A</div>
                <div>
                  <div className="avatar-name">Aryan</div>
                  <div className="avatar-role">Student · B.Tech CSE</div>
                </div>
              </div>
            </div>
          </aside>

          <main className="main" id="main-content">
            <header className="topbar">
              <div className="topbar-greeting">
                {navItems.find(n=>n.id===page)?.icon} <strong>{navItems.find(n=>n.id===page)?.label}</strong>
              </div>
              <div className="topbar-date">
                {now.toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' })}
              </div>
            </header>
            {pages[page]}
          </main>
        </div>
      </ToastProvider>
    </StateProvider>
  );
}

// -------------------- Global Styles (enhanced) --------------------
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: #2a2a38;
    --accent: #7c5cfc;
    --accent2: #fc5c7d;
    --accent3: #5cf4c4;
    --accent4: #fcb45c;
    --text: #e8e8f0;
    --text2: #8888a8;
    --text3: #4a4a6a;
    --r: 14px;
  }

  body { 
    background: var(--bg); 
    color: var(--text); 
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 220px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    flex-shrink: 0;
    position: relative;
    z-index: 10;
  }

  .logo {
    padding: 0 20px 28px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }

  .logo-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .logo-sub { font-size: 11px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }

  .nav-section { padding: 0 12px; margin-bottom: 8px; }
  .nav-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 2px; padding: 0 8px; margin-bottom: 6px; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 10px;
    cursor: pointer; transition: all 0.15s;
    font-size: 14px; font-weight: 400; color: var(--text2);
    margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(124,92,252,0.15); color: var(--accent); }
  .nav-item .icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-bottom {
    margin-top: auto;
    padding: 16px 20px;
    border-top: 1px solid var(--border);
  }
  .avatar-row { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; font-family:'Syne',sans-serif; }
  .avatar-name { font-size: 13px; font-weight: 500; }
  .avatar-role { font-size: 11px; color: var(--text2); }

  /* MAIN */
  .main { flex: 1; overflow-y: auto; background: var(--bg); }
  .page { padding: 32px 36px; max-width: 1100px; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

  .page-header { margin-bottom: 28px; }
  .page-title { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .page-subtitle { color: var(--text2); font-size: 14px; margin-top: 4px; }

  /* CARDS */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 20px;
  }
  .card-title { font-size: 13px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; font-family: 'Syne', sans-serif; }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  /* STAT CARD */
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .stat-card.purple::before { background: linear-gradient(90deg, var(--accent), transparent); }
  .stat-card.pink::before { background: linear-gradient(90deg, var(--accent2), transparent); }
  .stat-card.green::before { background: linear-gradient(90deg, var(--accent3), transparent); }
  .stat-card.yellow::before { background: linear-gradient(90deg, var(--accent4), transparent); }

  .stat-label { font-size: 12px; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .stat-sub { font-size: 12px; color: var(--text3); margin-top: 4px; }
  .stat-icon { font-size: 28px; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); opacity: 0.15; }

  /* BUTTON */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 8px;
    font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #9070ff; transform: translateY(-1px); }
  .btn-ghost { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { color: var(--text); border-color: var(--accent); }
  .btn-danger { background: rgba(252,92,125,0.15); color: var(--accent2); border: 1px solid rgba(252,92,125,0.3); }

  /* INPUT */
  .input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 14px; color: var(--text);
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.15s;
  }
  .input:focus { border-color: var(--accent); }
  .input::placeholder { color: var(--text3); }
  textarea.input { resize: vertical; min-height: 100px; }
  .input-label { font-size: 12px; color: var(--text2); margin-bottom: 6px; display: block; }

  /* FORM GROUP */
  .form-group { margin-bottom: 16px; }

  /* TIMELINE ITEM */
  .timeline-item {
    display: flex; gap: 14px; padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .timeline-item:last-child { border-bottom: none; }
  .timeline-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink:0; }
  .timeline-time { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .timeline-text { font-size: 14px; line-height: 1.5; }
  .timeline-tag { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 20px; margin-top: 4px; }

  /* PROGRESS BAR */
  .progress-bar { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; margin-top: 8px; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  /* GOAL CARD */
  .goal-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 18px;
    margin-bottom: 12px;
    transition: border-color 0.15s;
  }
  .goal-card:hover { border-color: var(--accent); }
  .goal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .goal-title { font-size: 15px; font-weight: 600; }
  .goal-cat { font-size: 11px; padding: 3px 10px; border-radius: 20px; }
  .goal-meta { display: flex; gap: 16px; margin-top: 10px; }
  .goal-meta-item { font-size: 12px; color: var(--text2); }

  /* EXPENSE */
  .expense-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .expense-row:last-child { border-bottom: none; }
  .expense-cat-dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 10px; flex-shrink:0; }
  .expense-name { font-size: 14px; }
  .expense-sub { font-size: 12px; color: var(--text3); }
  .expense-amount { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }

  /* CHART BAR */
  .chart-wrap { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding-top: 8px; }
  .chart-bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end; }
  .chart-bar { width: 100%; border-radius: 4px 4px 0 0; transition: height 0.5s ease; min-height: 4px; }
  .chart-label { font-size: 10px; color: var(--text3); margin-top: 6px; }
  .chart-val { font-size: 10px; color: var(--text2); margin-bottom: 3px; }

  /* DONUT CHART SIMPLE */
  .donut-wrap { position: relative; width: 120px; height: 120px; }
  .donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
  .donut-val { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; }
  .donut-lbl { font-size: 10px; color: var(--text2); }

  /* TASK */
  .task-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .task-item:last-child { border-bottom: none; }
  .task-check {
    width: 20px; height: 20px; border-radius: 6px;
    border: 2px solid var(--border); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s;
  }
  .task-check.done { background: var(--accent3); border-color: var(--accent3); color: #000; font-size: 11px; }
  .task-text { font-size: 14px; flex: 1; }
  .task-text.done { text-decoration: line-through; color: var(--text3); }
  .task-deadline { font-size: 11px; color: var(--accent2); }

  /* BADGE */
  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
  .badge-purple { background: rgba(124,92,252,0.15); color: var(--accent); }
  .badge-green { background: rgba(92,244,196,0.12); color: var(--accent3); }
  .badge-yellow { background: rgba(252,180,92,0.12); color: var(--accent4); }
  .badge-pink { background: rgba(252,92,125,0.12); color: var(--accent2); }

  /* MOOD */
  .mood-btn {
    font-size: 24px; cursor: pointer; padding: 8px;
    border-radius: 8px; border: 2px solid transparent;
    transition: all 0.15s; background: var(--surface2);
  }
  .mood-btn:hover { border-color: var(--accent); transform: scale(1.1); }
  .mood-btn.selected { border-color: var(--accent); background: rgba(124,92,252,0.2); }

  /* ANALYTICS BLOCKS */
  .analytics-bar-wrap { display: flex; flex-direction: column; gap: 10px; }
  .analytics-bar-row { display: flex; align-items: center; gap: 10px; }
  .analytics-bar-label { font-size: 12px; color: var(--text2); width: 80px; flex-shrink:0; }
  .analytics-bar-track { flex: 1; height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .analytics-bar-fill { height: 100%; border-radius: 4px; }
  .analytics-bar-val { font-size: 12px; color: var(--text2); width: 40px; text-align:right; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; width: 480px; max-width: 90vw;
    max-height: 90vh; overflow-y: auto;
  }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .modal-title { font-size: 18px; font-weight: 700; }
  .modal-close { cursor: pointer; color: var(--text2); font-size: 20px; background: none; border: none; }

  /* TOP BAR */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 36px; border-bottom: 1px solid var(--border);
    background: var(--surface); position: sticky; top: 0; z-index: 5;
  }
  .topbar-greeting { font-size: 13px; color: var(--text2); }
  .topbar-date { font-size: 13px; color: var(--text3); }

  .section-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }

  .chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; padding: 4px 10px; border-radius: 20px;
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text2); cursor: pointer; transition: all 0.15s;
  }
  .chip:hover, .chip.active { border-color: var(--accent); color: var(--accent); background: rgba(124,92,252,0.1); }

  /* WAKE/SLEEP LOG */
  .time-log-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .time-log-box {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 16px; text-align: center;
  }
  .time-log-icon { font-size: 28px; margin-bottom: 6px; }
  .time-log-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
  .time-log-time { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--text); margin-top: 4px; }

  /* TOAST */
  .toast-container {
    position: fixed; bottom: 20px; right: 20px; z-index: 200;
    display: flex; flex-direction: column; gap: 8px;
  }
  .toast {
    background: var(--surface); border-left: 4px solid var(--accent);
    padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    font-size: 14px; color: var(--text); border: 1px solid var(--border);
    animation: slideIn 0.2s;
  }
  .toast-success { border-left-color: var(--accent3); }
  .toast-error { border-left-color: var(--accent2); }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 32px 16px; color: var(--text2); font-size: 14px; }
  .empty-state p { margin-bottom: 12px; }

  /* ERROR TEXT */
  .error-text { font-size: 12px; color: var(--accent2); margin-top: 4px; }

  /* INSIGHT BOX */
  .insight-box {
    margin-top: 12px; padding: 10px 14px; background: rgba(124,92,252,0.08); border-radius: 8px;
    font-size: 13px; color: var(--text2);
  }
  .insight-box strong { color: var(--text); }

  /* INFO NOTE */
  .info-note {
    font-size: 12px; color: var(--text3); padding: 8px 12px; background: var(--surface2); border-radius: 8px; margin-bottom: 12px;
  }
  .code-block {
    font-size: 12px; color: var(--text3); padding: 10px 12px; background: var(--surface2); border-radius: 8px; font-family: monospace; line-height: 1.8;
  }

  /* FOCUS VISIBLE */
  *:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .sidebar { width: 60px; overflow: hidden; }
    .sidebar .nav-item span:not(.icon) { display: none; }
    .sidebar .logo-title, .sidebar .logo-sub, .sidebar .avatar-name, .sidebar .avatar-role { display: none; }
    .sidebar-bottom { padding: 16px 0; display: flex; justify-content: center; }
    .avatar-row { justify-content: center; }
    .main .page { padding: 24px 16px; }
    .grid-4 { grid-template-columns: 1fr 1fr; }
    .grid-2 { grid-template-columns: 1fr; }
  }
`;

export default App;