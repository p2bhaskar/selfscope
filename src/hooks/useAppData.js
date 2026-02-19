import { useState, useEffect, useCallback } from "react";

// ─── UUID generator (no lib needed) ──────────────────────────────────────────
export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed", e);
  }
}

// ─── Default seed data (shown on first launch) ────────────────────────────────
const SEED_JOURNAL = [
  {
    id: uuid(),
    title: "First entry",
    text: "Woke up feeling sharp. Meditation went well, 15 minutes. Goals feel clear today.",
    tag: "Morning",
    mood: "🔥 Focused",
    date: new Date().toISOString(),
  },
  {
    id: uuid(),
    title: "DSA realization",
    text: "Realized I need to restructure my DSA prep — focus on graphs this week before moving on.",
    tag: "Thought",
    mood: "🎯 Driven",
    date: new Date(Date.now() - 86400000).toISOString(),
  },
];

const SEED_EXPENSES = [
  { id: uuid(), name: "Zomato Order", icon: "🍔", category: "Food & Dining", amount: 348, note: "", date: new Date().toISOString() },
  { id: uuid(), name: "Notion Pro", icon: "📚", category: "Subscriptions", amount: 165, note: "", date: new Date().toISOString() },
  { id: uuid(), name: "Bus Pass", icon: "🚌", category: "Transport", amount: 80, note: "", date: new Date(Date.now() - 86400000).toISOString() },
];

const SEED_MORNING = [
  {
    id: uuid(),
    wakeTime: "06:30",
    sleepQuality: "Good",
    sleepDuration: "7h 30m",
    intentions: ["Review DSA problems", "Gym session", "Read 30 mins"],
    date: new Date().toISOString(),
  },
];

const SEED_GOALS = [
  {
    id: uuid(),
    label: "ACADEMIC",
    title: "DSA Mastery — Interview Ready",
    desc: "Complete 300 LeetCode problems, cover all major topics, ready for FAANG-level interviews.",
    progress: 62,
    deadline: "2025-04-15",
    accent: "#c9a84c",
    milestones: [
      { id: uuid(), label: "Arrays & Strings", done: true },
      { id: uuid(), label: "Trees & Graphs", done: true },
      { id: uuid(), label: "Dynamic Programming", done: false },
      { id: uuid(), label: "Mock Interview x5", done: false },
    ],
  },
  {
    id: uuid(),
    label: "PROFESSIONAL",
    title: "Build & Ship SaaS MVP",
    desc: "Design, develop, and launch a minimal viable product. Acquire first 10 paying users.",
    progress: 38,
    deadline: "2025-06-30",
    accent: "#3ecfb2",
    milestones: [
      { id: uuid(), label: "Wireframes & Design", done: true },
      { id: uuid(), label: "Core Backend API", done: true },
      { id: uuid(), label: "Frontend Alpha", done: false },
      { id: uuid(), label: "Beta Testing", done: false },
    ],
  },
];

const SEED_PREFS = {
  name: "Aryan",
  currency: "₹",
  wakeGoal: "06:00",
  monthlyBudget: 10000,
};

// ─── Main Hook ────────────────────────────────────────────────────────────────
export function useAppData() {
  const [journal, setJournalRaw] = useState(() => load("ss_journal", SEED_JOURNAL));
  const [expenses, setExpensesRaw] = useState(() => load("ss_expenses", SEED_EXPENSES));
  const [morning, setMorningRaw] = useState(() => load("ss_morning", SEED_MORNING));
  const [goals, setGoalsRaw] = useState(() => load("ss_goals", SEED_GOALS));
  const [prefs, setPrefsRaw] = useState(() => load("ss_prefs", SEED_PREFS));

  // Auto-persist on every change
  useEffect(() => { save("ss_journal", journal); }, [journal]);
  useEffect(() => { save("ss_expenses", expenses); }, [expenses]);
  useEffect(() => { save("ss_morning", morning); }, [morning]);
  useEffect(() => { save("ss_goals", goals); }, [goals]);
  useEffect(() => { save("ss_prefs", prefs); }, [prefs]);

  // ── JOURNAL ──────────────────────────────────────────────────────────────
  const addJournal = useCallback((entry) => {
    const newEntry = { ...entry, id: uuid(), date: new Date().toISOString() };
    setJournalRaw((prev) => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const deleteJournal = useCallback((id) => {
    setJournalRaw((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ── EXPENSES ─────────────────────────────────────────────────────────────
  const addExpense = useCallback((expense) => {
    const ICONS = {
      "Food & Dining": "🍔",
      "Transport": "🚌",
      "Education": "📚",
      "Entertainment": "🎮",
      "Groceries": "🛒",
      "Utilities": "💡",
      "Health": "💊",
      "Subscriptions": "📱",
      "Other": "💰",
    };
    const newExpense = {
      ...expense,
      id: uuid(),
      icon: ICONS[expense.category] || "💰",
      date: expense.date || new Date().toISOString(),
    };
    setExpensesRaw((prev) => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpensesRaw((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ── MORNING LOG ───────────────────────────────────────────────────────────
  const addMorning = useCallback((log) => {
    const newLog = { ...log, id: uuid(), date: new Date().toISOString() };
    setMorningRaw((prev) => [newLog, ...prev]);
    return newLog;
  }, []);

  const deleteMorning = useCallback((id) => {
    setMorningRaw((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ── GOALS ─────────────────────────────────────────────────────────────────
  const addGoal = useCallback((goal) => {
    const newGoal = {
      ...goal,
      id: uuid(),
      progress: 0,
      milestones: (goal.milestones || []).map((m) => ({ ...m, id: uuid(), done: false })),
    };
    setGoalsRaw((prev) => [...prev, newGoal]);
    return newGoal;
  }, []);

  const updateGoalProgress = useCallback((id, progress) => {
    setGoalsRaw((prev) =>
      prev.map((g) => (g.id === id ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g))
    );
  }, []);

  const toggleMilestone = useCallback((goalId, milestoneId) => {
    setGoalsRaw((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              milestones: g.milestones.map((m) =>
                m.id === milestoneId ? { ...m, done: !m.done } : m
              ),
            }
          : g
      )
    );
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoalsRaw((prev) => prev.filter((g) => g.id !== id));
  }, []);

  // ── PREFS ─────────────────────────────────────────────────────────────────
  const updatePrefs = useCallback((updates) => {
    setPrefsRaw((prev) => ({ ...prev, ...updates }));
  }, []);

  // ── DERIVED ANALYTICS ────────────────────────────────────────────────────
  const analytics = useCallback(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Monthly spend
    const monthlyExpenses = expenses.filter((e) => new Date(e.date) >= monthStart);
    const totalMonthlySpend = monthlyExpenses.reduce((s, e) => s + Number(e.amount), 0);

    // Spend by category
    const byCategory = {};
    monthlyExpenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
    });

    // Wake streak
    const sorted = [...morning].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    for (const log of sorted) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const diff = (checkDate - logDate) / 86400000;
      if (diff <= 1) {
        streak++;
        checkDate = logDate;
      } else break;
    }

    // Goals on track
    const onTrack = goals.filter((g) => {
      const daysLeft = (new Date(g.deadline) - now) / 86400000;
      return daysLeft > 0 && g.progress >= 30;
    }).length;

    return { totalMonthlySpend, byCategory, wakeStreak: streak, onTrack, totalGoals: goals.length };
  }, [expenses, morning, goals]);

  return {
    // Data
    journal, expenses, morning, goals, prefs,
    // Journal
    addJournal, deleteJournal,
    // Expenses
    addExpense, deleteExpense,
    // Morning
    addMorning, deleteMorning,
    // Goals
    addGoal, updateGoalProgress, toggleMilestone, deleteGoal,
    // Prefs
    updatePrefs,
    // Analytics
    analytics,
  };
}
