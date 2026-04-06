import { useState, useMemo, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Food","Transport","Shopping","Health","Entertainment","Utilities","Salary","Freelance","Investment","Other"];
const CATEGORY_COLORS = {
  Food:"#f97316",Transport:"#3b82f6",Shopping:"#a855f7",Health:"#22c55e",
  Entertainment:"#ec4899",Utilities:"#eab308",Salary:"#10b981",
  Freelance:"#06b6d4",Investment:"#8b5cf6",Other:"#94a3b8"
};
const CATEGORY_ICONS = {
  Food:"🍔",Transport:"🚌",Shopping:"🛍️",Health:"💊",Entertainment:"🎬",
  Utilities:"💡",Salary:"💼",Freelance:"💻",Investment:"📈",Other:"📦"
};

const generateTransactions = () => {
  const base = [
    {id:1,date:"2024-06-01",desc:"Monthly Salary",amount:85000,category:"Salary",type:"income"},
    {id:2,date:"2024-06-02",desc:"Big Basket Groceries",amount:3200,category:"Food",type:"expense"},
    {id:3,date:"2024-06-03",desc:"Uber Cab",amount:450,category:"Transport",type:"expense"},
    {id:4,date:"2024-06-04",desc:"Netflix Subscription",amount:649,category:"Entertainment",type:"expense"},
    {id:5,date:"2024-06-05",desc:"Electricity Bill",amount:2100,category:"Utilities",type:"expense"},
    {id:6,date:"2024-06-06",desc:"Freelance Project",amount:22000,category:"Freelance",type:"income"},
    {id:7,date:"2024-06-08",desc:"Zomato Order",amount:780,category:"Food",type:"expense"},
    {id:8,date:"2024-06-09",desc:"Amazon Shopping",amount:5600,category:"Shopping",type:"expense"},
    {id:9,date:"2024-06-10",desc:"Gym Membership",amount:2000,category:"Health",type:"expense"},
    {id:10,date:"2024-06-11",desc:"Mutual Fund SIP",amount:10000,category:"Investment",type:"expense"},
    {id:11,date:"2024-06-12",desc:"Swiggy Dinner",amount:620,category:"Food",type:"expense"},
    {id:12,date:"2024-06-14",desc:"Rapido Bike",amount:120,category:"Transport",type:"expense"},
    {id:13,date:"2024-06-15",desc:"Dividend Income",amount:3400,category:"Investment",type:"income"},
    {id:14,date:"2024-06-16",desc:"Pharmacy",amount:890,category:"Health",type:"expense"},
    {id:15,date:"2024-06-17",desc:"Internet Bill",amount:999,category:"Utilities",type:"expense"},
    {id:16,date:"2024-06-18",desc:"Movie Tickets",amount:700,category:"Entertainment",type:"expense"},
    {id:17,date:"2024-06-19",desc:"Myntra Clothes",amount:3800,category:"Shopping",type:"expense"},
    {id:18,date:"2024-06-20",desc:"Consulting Fee",amount:15000,category:"Freelance",type:"income"},
    {id:19,date:"2024-06-22",desc:"Restaurant Dinner",amount:2200,category:"Food",type:"expense"},
    {id:20,date:"2024-06-23",desc:"Metro Card Recharge",amount:500,category:"Transport",type:"expense"},
    {id:21,date:"2024-05-01",desc:"Monthly Salary",amount:85000,category:"Salary",type:"income"},
    {id:22,date:"2024-05-03",desc:"Grocery Shopping",amount:2800,category:"Food",type:"expense"},
    {id:23,date:"2024-05-05",desc:"Cab Rides",amount:1200,category:"Transport",type:"expense"},
    {id:24,date:"2024-05-07",desc:"Freelance Work",amount:18000,category:"Freelance",type:"income"},
    {id:25,date:"2024-05-09",desc:"Water Bill",amount:600,category:"Utilities",type:"expense"},
    {id:26,date:"2024-05-12",desc:"Doctor Visit",amount:1500,category:"Health",type:"expense"},
    {id:27,date:"2024-05-15",desc:"Online Course",amount:2999,category:"Entertainment",type:"expense"},
    {id:28,date:"2024-05-18",desc:"Clothes Shopping",amount:4200,category:"Shopping",type:"expense"},
    {id:29,date:"2024-05-20",desc:"Mutual Fund SIP",amount:10000,category:"Investment",type:"expense"},
    {id:30,date:"2024-04-01",desc:"Monthly Salary",amount:85000,category:"Salary",type:"income"},
    {id:31,date:"2024-04-04",desc:"Food Delivery",amount:1800,category:"Food",type:"expense"},
    {id:32,date:"2024-04-06",desc:"Fuel",amount:2500,category:"Transport",type:"expense"},
    {id:33,date:"2024-04-10",desc:"Freelance Project",amount:25000,category:"Freelance",type:"income"},
    {id:34,date:"2024-04-14",desc:"Shopping Mall",amount:6800,category:"Shopping",type:"expense"},
    {id:35,date:"2024-04-18",desc:"Mutual Fund SIP",amount:10000,category:"Investment",type:"expense"},
    {id:36,date:"2024-04-22",desc:"Electricity",amount:1900,category:"Utilities",type:"expense"},
    {id:37,date:"2024-04-25",desc:"Medicines",amount:450,category:"Health",type:"expense"},
  ];
  return base;
};

// ─── SPARKLINE COMPONENT ─────────────────────────────────────────────────────
const Sparkline = ({ data, color, height = 40 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ` + pts + ` ${w},${h}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
const DonutChart = ({ data, size = 180 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div style={{color:"var(--text-muted)",textAlign:"center",padding:"40px 0"}}>No data</div>;
  let cumulative = 0;
  const r = 70, cx = size/2, cy = size/2;
  const segments = data.map(d => {
    const pct = d.value / total;
    const start = cumulative * 2 * Math.PI - Math.PI/2;
    cumulative += pct;
    const end = cumulative * 2 * Math.PI - Math.PI/2;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    return { ...d, path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, pct };
  });
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="var(--card-bg)" />
      {segments.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity="0.9">
          <title>{s.label}: ₹{s.value.toLocaleString("en-IN")} ({(s.pct*100).toFixed(1)}%)</title>
        </path>
      ))}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--bg)" />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="11" fill="var(--text-muted)">Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">
        ₹{(total/1000).toFixed(0)}k
      </text>
    </svg>
  );
};

// ─── BAR CHART ───────────────────────────────────────────────────────────────
const BarChart = ({ months }) => {
  const maxIncome = Math.max(...months.map(m => m.income));
  const maxExpense = Math.max(...months.map(m => m.expense));
  const maxVal = Math.max(maxIncome, maxExpense) || 1;
  const barH = 140;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: barH + 30, padding: "0 4px" }}>
      {months.map((m, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: barH }}>
            <div style={{ width: "100%", minWidth: 8, background: "var(--accent-green)", borderRadius: "3px 3px 0 0", height: `${(m.income/maxVal)*barH}px`, transition: "height 0.6s cubic-bezier(.4,2,.6,1)" }} title={`Income: ₹${m.income.toLocaleString("en-IN")}`} />
            <div style={{ width: "100%", minWidth: 8, background: "var(--accent-red)", borderRadius: "3px 3px 0 0", height: `${(m.expense/maxVal)*barH}px`, transition: "height 0.6s cubic-bezier(.4,2,.6,1) 0.1s" }} title={`Expense: ₹${m.expense.toLocaleString("en-IN")}`} />
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: 4 }}>{m.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── LINE CHART ──────────────────────────────────────────────────────────────
const LineChart = ({ data, color = "#6366f1" }) => {
  const w = 600, h = 120;
  const max = Math.max(...data.map(d => d.balance));
  const min = Math.min(...data.map(d => d.balance));
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (w - 40) + 20;
    const y = h - 20 - ((d.balance - min) / range) * (h - 40);
    return { x, y, ...d };
  });
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `M ${pts[0].x} ${h - 20} ` + pts.map(p => `L ${p.x} ${p.y}`).join(" ") + ` L ${pts[pts.length-1].x} ${h - 20} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1="20" x2={w-20} y1={20 + t*(h-40)} y2={20 + t*(h-40)} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      <path d={areaD} fill="url(#lineGrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.filter((_, i) => i % Math.ceil(pts.length/6) === 0 || i === pts.length-1).map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill={color} stroke="var(--bg)" strokeWidth="2" />
          <text x={p.x} y={h - 4} textAnchor="middle" fontSize="9" fill="var(--text-muted)">{p.label}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── MODAL ───────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"var(--card-bg)",borderRadius:"16px",padding:"28px",width:"100%",maxWidth:"480px",border:"1px solid var(--border)",boxShadow:"0 24px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px" }}>
          <h3 style={{ margin:0,fontSize:"16px",fontWeight:700,color:"var(--text)" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",width:32,height:32,cursor:"pointer",fontSize:16,color:"var(--text-muted)",display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function FinanceDashboard() {
  const [dark, setDark] = useState(true);
  const [role, setRole] = useState("admin");
  const [tab, setTab] = useState("dashboard");
  const [transactions, setTransactions] = useState(generateTransactions());
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [newTx, setNewTx] = useState({ desc:"", amount:"", category:"Food", type:"expense", date: new Date().toISOString().split("T")[0] });
  const [toast, setToast] = useState(null);
  const nextId = useRef(transactions.length + 1);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Derived ──
  const totalIncome = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance = totalIncome - totalExpense;

  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      if (t.type === "income") months[m].income += t.amount;
      else months[m].expense += t.amount;
    });
    return Object.entries(months).sort().map(([k, v]) => ({
      label: new Date(k + "-01").toLocaleString("default", { month: "short" }),
      ...v
    }));
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const cats = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  const topCategory = categoryBreakdown[0];
  const balanceTrend = useMemo(() => {
    const days = {};
    let running = 0;
    [...transactions].sort((a,b) => a.date.localeCompare(b.date)).forEach(t => {
      running += t.type === "income" ? t.amount : -t.amount;
      days[t.date] = running;
    });
    return Object.entries(days).map(([date, balance]) => ({ label: date.slice(5), balance }));
  }, [transactions]);

  // ── Filter & sort ──
  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (filterCat !== "all") list = list.filter(t => t.category === filterCat);
    list.sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (sortBy === "amount") { av = a.amount; bv = b.amount; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [transactions, search, filterType, filterCat, sortBy, sortDir]);

  const handleAdd = () => {
    if (!newTx.desc || !newTx.amount) return showToast("Please fill all fields", "error");
    const tx = { ...newTx, id: nextId.current++, amount: parseFloat(newTx.amount) };
    setTransactions(prev => [tx, ...prev]);
    setNewTx({ desc:"", amount:"", category:"Food", type:"expense", date: new Date().toISOString().split("T")[0] });
    setShowAddModal(false);
    showToast("Transaction added ✓");
  };

  const handleEdit = () => {
    setTransactions(prev => prev.map(t => t.id === editTx.id ? { ...editTx, amount: parseFloat(editTx.amount) } : t));
    setEditTx(null);
    showToast("Transaction updated ✓");
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast("Transaction deleted");
  };

  const exportCSV = () => {
    const rows = [["Date","Description","Category","Type","Amount"], ...transactions.map(t => [t.date,t.desc,t.category,t.type,t.amount])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "transactions.csv";
    a.click();
    showToast("CSV exported ✓");
  };

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("desc"); }
  };

  // ─── CSS VARS ─────────────────────────────────────────────────────────────
  const theme = dark ? {
    "--bg": "#0a0a0f",
    "--card-bg": "#12121a",
    "--card-hover": "#1a1a26",
    "--border": "#1e1e2e",
    "--text": "#f0f0ff",
    "--text-muted": "#6b7099",
    "--accent": "#818cf8",
    "--accent-green": "#34d399",
    "--accent-red": "#f87171",
    "--accent-yellow": "#fbbf24",
  } : {
    "--bg": "#f4f4f8",
    "--card-bg": "#ffffff",
    "--card-hover": "#f9f9ff",
    "--border": "#e2e2ef",
    "--text": "#1a1a2e",
    "--text-muted": "#7070a0",
    "--accent": "#6366f1",
    "--accent-green": "#059669",
    "--accent-red": "#dc2626",
    "--accent-yellow": "#d97706",
  };

  const s = {
    app: { fontFamily:"'DM Sans', 'Segoe UI', sans-serif", background:"var(--bg)", color:"var(--text)", minHeight:"100vh", ...theme, transition:"background 0.3s, color 0.3s" },
    sidebar: { width:220, background:"var(--card-bg)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", padding:"20px 0", position:"fixed", top:0, left:0, bottom:0, zIndex:100 },
    main: { marginLeft:220, padding:"28px 28px 28px 28px", minHeight:"100vh", "@media(max-width:768px)": { marginLeft:0 } },
    card: { background:"var(--card-bg)", border:"1px solid var(--border)", borderRadius:"14px", padding:"20px", transition:"background 0.2s" },
    badge: (type) => ({ display:"inline-block", padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:600, background: type==="income" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)", color: type==="income" ? "var(--accent-green)" : "var(--accent-red)" }),
    btn: (variant="primary") => ({
      padding: variant==="sm" ? "6px 14px" : "10px 20px",
      borderRadius: 9,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: variant==="sm" ? 12 : 13,
      transition: "opacity 0.15s, transform 0.1s",
      background: variant==="primary" ? "var(--accent)" : variant==="danger" ? "rgba(248,113,113,0.15)" : "var(--bg)",
      color: variant==="primary" ? "#fff" : variant==="danger" ? "var(--accent-red)" : "var(--text-muted)",
      border: variant==="outline" ? "1px solid var(--border)" : "none",
    }),
    input: { background:"var(--bg)", border:"1px solid var(--border)", borderRadius:9, padding:"9px 13px", color:"var(--text)", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" },
    label: { fontSize:11, fontWeight:600, color:"var(--text-muted)", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" },
  };

  const navItems = [
    { id:"dashboard", icon:"◈", label:"Dashboard" },
    { id:"transactions", icon:"⊞", label:"Transactions" },
    { id:"insights", icon:"◎", label:"Insights" },
  ];

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={{ padding:"0 20px 20px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>₹</div>
            <div>
              <div style={{ fontWeight:800, fontSize:14, color:"var(--text)" }}>FinTrack</div>
              <div style={{ fontSize:10, color:"var(--text-muted)" }}>Personal Finance</div>
            </div>
          </div>
        </div>

        <nav style={{ padding:"16px 12px", flex:1 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer", background: tab===n.id ? "var(--accent)" : "transparent", color: tab===n.id ? "#fff" : "var(--text-muted)", fontWeight: tab===n.id ? 700 : 500, fontSize:13, marginBottom:4, transition:"all 0.15s", textAlign:"left" }}>
              <span style={{ fontSize:14 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>

        <div style={{ padding:"16px 12px", borderTop:"1px solid var(--border)" }}>
          {/* Role Selector */}
          <label style={{ ...s.label, marginBottom:6 }}>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ ...s.input, marginBottom:12 }}>
            <option value="admin">👑 Admin</option>
            <option value="viewer">👁 Viewer</option>
          </select>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:"var(--text-muted)" }}>Dark Mode</span>
            <button onClick={() => setDark(d => !d)} style={{ width:40, height:22, borderRadius:11, border:"none", cursor:"pointer", background: dark ? "var(--accent)" : "var(--border)", position:"relative", transition:"background 0.2s" }}>
              <span style={{ position:"absolute", top:3, left: dark?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <h1 style={{ margin:0, fontSize:22, fontWeight:800 }}>
              {tab === "dashboard" ? "Overview" : tab === "transactions" ? "Transactions" : "Insights"}
            </h1>
            <p style={{ margin:"2px 0 0", fontSize:12, color:"var(--text-muted)" }}>
              {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {role === "admin" && tab === "transactions" && (
              <>
                <button style={s.btn("outline")} onClick={exportCSV}>↓ Export CSV</button>
                <button style={s.btn("primary")} onClick={() => setShowAddModal(true)}>+ Add Transaction</button>
              </>
            )}
            {role !== "admin" && <span style={{ ...s.badge("expense"), padding:"6px 12px" }}>Viewer Mode</span>}
          </div>
        </div>

        {/* ─── DASHBOARD TAB ──────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <>
            {/* Summary Cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
              {[
                { label:"Total Balance", value: balance, color:"var(--accent)", icon:"◈", trend: balanceTrend.map(d=>d.balance) },
                { label:"Total Income", value: totalIncome, color:"var(--accent-green)", icon:"↑", trend: monthlyData.map(m=>m.income) },
                { label:"Total Expenses", value: totalExpense, color:"var(--accent-red)", icon:"↓", trend: monthlyData.map(m=>m.expense) },
              ].map((c, i) => (
                <div key={i} style={s.card}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{c.label}</div>
                      <div style={{ fontSize:26, fontWeight:800, color:c.color, letterSpacing:"-0.5px" }}>
                        ₹{c.value.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div style={{ width:40, height:40, borderRadius:10, background: c.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:c.color }}>{c.icon}</div>
                  </div>
                  <div style={{ marginTop:16 }}>
                    <Sparkline data={c.trend} color={c.color} />
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:16, marginBottom:24 }}>
              {/* Balance Trend */}
              <div style={s.card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14 }}>Balance Trend</div>
                    <div style={{ fontSize:11, color:"var(--text-muted)" }}>Running balance over time</div>
                  </div>
                </div>
                <LineChart data={balanceTrend} color="var(--accent)" />
              </div>

              {/* Donut */}
              <div style={s.card}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Spending Breakdown</div>
                <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:16 }}>By category</div>
                <div style={{ display:"flex", alignItems:"center", gap:16, justifyContent:"center" }}>
                  <DonutChart data={categoryBreakdown.slice(0,6)} size={180} />
                  <div style={{ flex:1 }}>
                    {categoryBreakdown.slice(0,5).map((c, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:c.color }} />
                          <span style={{ fontSize:11, color:"var(--text-muted)" }}>{c.label}</span>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700 }}>₹{(c.value/1000).toFixed(1)}k</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Bar Chart */}
            <div style={s.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>Monthly Overview</div>
                  <div style={{ fontSize:11, color:"var(--text-muted)" }}>Income vs Expenses per month</div>
                </div>
                <div style={{ display:"flex", gap:14 }}>
                  {[{color:"var(--accent-green)",label:"Income"},{color:"var(--accent-red)",label:"Expense"}].map((l,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"var(--text-muted)" }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:l.color }} />{l.label}
                    </div>
                  ))}
                </div>
              </div>
              <BarChart months={monthlyData} />
            </div>
          </>
        )}

        {/* ─── TRANSACTIONS TAB ───────────────────────────────────────────── */}
        {tab === "transactions" && (
          <>
            {/* Filters */}
            <div style={{ ...s.card, marginBottom:16, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
              <input placeholder="🔍  Search transactions..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...s.input, width:220, flex:"0 0 220px" }} />
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...s.input, width:130 }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...s.input, width:140 }}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span style={{ fontSize:11, color:"var(--text-muted)", marginLeft:"auto" }}>{filtered.length} transactions</span>
            </div>

            {/* Table */}
            <div style={{ ...s.card, padding:0, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid var(--border)" }}>
                    {[{k:"date",l:"Date"},{k:"desc",l:"Description"},{k:"category",l:"Category"},{k:"type",l:"Type"},{k:"amount",l:"Amount"}].map(col => (
                      <th key={col.k} onClick={() => toggleSort(col.k)} style={{ padding:"14px 18px", textAlign:"left", fontWeight:700, fontSize:11, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", cursor:"pointer", userSelect:"none", whiteSpace:"nowrap" }}>
                        {col.l} {sortBy===col.k ? (sortDir==="asc"?"↑":"↓") : ""}
                      </th>
                    ))}
                    {role === "admin" && <th style={{ padding:"14px 18px", fontWeight:700, fontSize:11, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={role==="admin"?6:5} style={{ textAlign:"center", padding:"48px", color:"var(--text-muted)" }}>No transactions found</td></tr>
                  ) : filtered.map(t => (
                    <tr key={t.id} style={{ borderBottom:"1px solid var(--border)", transition:"background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background="var(--card-hover)"}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"13px 18px", color:"var(--text-muted)", fontSize:12 }}>{t.date}</td>
                      <td style={{ padding:"13px 18px", fontWeight:500 }}>{t.desc}</td>
                      <td style={{ padding:"13px 18px" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
                          <span>{CATEGORY_ICONS[t.category]}</span>
                          <span style={{ color:"var(--text-muted)" }}>{t.category}</span>
                        </span>
                      </td>
                      <td style={{ padding:"13px 18px" }}><span style={s.badge(t.type)}>{t.type}</span></td>
                      <td style={{ padding:"13px 18px", fontWeight:700, color: t.type==="income" ? "var(--accent-green)" : "var(--accent-red)" }}>
                        {t.type==="income"?"+":"-"}₹{t.amount.toLocaleString("en-IN")}
                      </td>
                      {role === "admin" && (
                        <td style={{ padding:"13px 18px" }}>
                          <div style={{ display:"flex", gap:8 }}>
                            <button style={s.btn("outline")} onClick={() => setEditTx({...t})}
                              onMouseEnter={e => e.currentTarget.style.opacity="0.7"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>Edit</button>
                            <button style={s.btn("danger")} onClick={() => handleDelete(t.id)}
                              onMouseEnter={e => e.currentTarget.style.opacity="0.7"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>Del</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ─── INSIGHTS TAB ───────────────────────────────────────────────── */}
        {tab === "insights" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:24 }}>
              {/* Top Spender */}
              <div style={{ ...s.card, borderLeft:"3px solid var(--accent-red)" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Highest Spending Category</div>
                {topCategory ? (
                  <>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                      <span style={{ fontSize:32 }}>{CATEGORY_ICONS[topCategory.label]}</span>
                      <div>
                        <div style={{ fontSize:20, fontWeight:800 }}>{topCategory.label}</div>
                        <div style={{ fontSize:22, fontWeight:800, color:"var(--accent-red)" }}>₹{topCategory.value.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:12, color:"var(--text-muted)" }}>
                      {((topCategory.value / totalExpense) * 100).toFixed(1)}% of total expenses
                    </div>
                  </>
                ) : <div style={{ color:"var(--text-muted)" }}>No expenses yet</div>}
              </div>

              {/* Savings Rate */}
              <div style={{ ...s.card, borderLeft:"3px solid var(--accent-green)" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Savings Rate</div>
                <div style={{ fontSize:32, fontWeight:800, color:"var(--accent-green)" }}>
                  {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%
                </div>
                <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:4 }}>
                  Saved ₹{Math.max(0, balance).toLocaleString("en-IN")} of ₹{totalIncome.toLocaleString("en-IN")} income
                </div>
                <div style={{ marginTop:12, height:6, background:"var(--border)", borderRadius:99 }}>
                  <div style={{ height:"100%", borderRadius:99, background:"var(--accent-green)", width:`${Math.min(100, totalIncome > 0 ? ((totalIncome - totalExpense)/totalIncome)*100 : 0)}%`, transition:"width 1s" }} />
                </div>
              </div>

              {/* Monthly Comparison */}
              <div style={{ ...s.card, borderLeft:"3px solid var(--accent)" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:12 }}>Monthly Comparison</div>
                {monthlyData.length >= 2 ? (() => {
                  const curr = monthlyData[monthlyData.length - 1];
                  const prev = monthlyData[monthlyData.length - 2];
                  const expDiff = curr.expense - prev.expense;
                  const pct = prev.expense > 0 ? ((expDiff / prev.expense) * 100).toFixed(1) : 0;
                  return (
                    <>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                        <div><div style={{ fontSize:11, color:"var(--text-muted)" }}>{prev.label}</div><div style={{ fontSize:18, fontWeight:700, color:"var(--accent-red)" }}>₹{prev.expense.toLocaleString("en-IN")}</div></div>
                        <div style={{ alignSelf:"center", fontSize:20 }}>→</div>
                        <div><div style={{ fontSize:11, color:"var(--text-muted)" }}>{curr.label}</div><div style={{ fontSize:18, fontWeight:700, color:"var(--accent-red)" }}>₹{curr.expense.toLocaleString("en-IN")}</div></div>
                      </div>
                      <div style={{ padding:"8px 12px", borderRadius:8, background: expDiff > 0 ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)", color: expDiff > 0 ? "var(--accent-red)" : "var(--accent-green)", fontSize:12, fontWeight:600 }}>
                        {expDiff > 0 ? "↑" : "↓"} Expenses {expDiff > 0 ? "increased" : "decreased"} by {Math.abs(pct)}% vs last month
                      </div>
                    </>
                  );
                })() : <div style={{ color:"var(--text-muted)", fontSize:12 }}>Need at least 2 months of data</div>}
              </div>

              {/* Avg Daily Spend */}
              <div style={{ ...s.card, borderLeft:"3px solid var(--accent-yellow)" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Daily Average Spend</div>
                <div style={{ fontSize:32, fontWeight:800, color:"var(--accent-yellow)" }}>
                  ₹{(totalExpense / Math.max(1, new Set(transactions.filter(t=>t.type==="expense").map(t=>t.date)).size)).toFixed(0)}
                </div>
                <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:4 }}>per day with expenses</div>
              </div>
            </div>

            {/* Category Detail */}
            <div style={s.card}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Spending by Category</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {categoryBreakdown.map((c, i) => (
                  <div key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <span style={{ fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
                        <span>{CATEGORY_ICONS[c.label]}</span> {c.label}
                      </span>
                      <span style={{ fontWeight:700, fontSize:13 }}>₹{c.value.toLocaleString("en-IN")} <span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:400 }}>({((c.value/totalExpense)*100).toFixed(1)}%)</span></span>
                    </div>
                    <div style={{ height:7, background:"var(--border)", borderRadius:99 }}>
                      <div style={{ height:"100%", borderRadius:99, background:c.color, width:`${(c.value/categoryBreakdown[0].value)*100}%`, transition:"width 1s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* ─── ADD MODAL ──────────────────────────────────────────────────────── */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction">
        {[
          { label:"Description", field:"desc", type:"text", placeholder:"e.g. Grocery Shopping" },
          { label:"Amount (₹)", field:"amount", type:"number", placeholder:"0.00" },
          { label:"Date", field:"date", type:"date" },
        ].map(f => (
          <div key={f.field} style={{ marginBottom:14 }}>
            <label style={s.label}>{f.label}</label>
            <input type={f.type} placeholder={f.placeholder} value={newTx[f.field]} onChange={e => setNewTx(p => ({...p, [f.field]: e.target.value}))} style={s.input} />
          </div>
        ))}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          <div>
            <label style={s.label}>Category</label>
            <select value={newTx.category} onChange={e => setNewTx(p => ({...p, category: e.target.value}))} style={s.input}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Type</label>
            <select value={newTx.type} onChange={e => setNewTx(p => ({...p, type: e.target.value}))} style={s.input}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={s.btn("outline")} onClick={() => setShowAddModal(false)}>Cancel</button>
          <button style={s.btn("primary")} onClick={handleAdd}>Add Transaction</button>
        </div>
      </Modal>

      {/* ─── EDIT MODAL ─────────────────────────────────────────────────────── */}
      <Modal open={!!editTx} onClose={() => setEditTx(null)} title="Edit Transaction">
        {editTx && (
          <>
            {[
              { label:"Description", field:"desc", type:"text" },
              { label:"Amount (₹)", field:"amount", type:"number" },
              { label:"Date", field:"date", type:"date" },
            ].map(f => (
              <div key={f.field} style={{ marginBottom:14 }}>
                <label style={s.label}>{f.label}</label>
                <input type={f.type} value={editTx[f.field]} onChange={e => setEditTx(p => ({...p, [f.field]: e.target.value}))} style={s.input} />
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              <div>
                <label style={s.label}>Category</label>
                <select value={editTx.category} onChange={e => setEditTx(p => ({...p, category: e.target.value}))} style={s.input}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Type</label>
                <select value={editTx.type} onChange={e => setEditTx(p => ({...p, type: e.target.value}))} style={s.input}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button style={s.btn("outline")} onClick={() => setEditTx(null)}>Cancel</button>
              <button style={s.btn("primary")} onClick={handleEdit}>Save Changes</button>
            </div>
          </>
        )}
      </Modal>

      {/* ─── TOAST ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, background: toast.type==="error" ? "var(--accent-red)" : "var(--accent-green)", color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:13, fontWeight:600, boxShadow:"0 8px 24px rgba(0,0,0,0.3)", zIndex:2000, animation:"slideIn 0.3s ease" }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        select option { background: var(--card-bg, #12121a); }
        @keyframes slideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 768px) {
          aside { width: 100% !important; position: relative !important; height: auto !important; flex-direction: row !important; }
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
