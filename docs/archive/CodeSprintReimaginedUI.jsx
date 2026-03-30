import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────── */
const C = {
  bg:          "#050508",
  surface:     "#09090f",
  surfaceAlt:  "#0d0d16",
  border:      "rgba(0,229,255,0.10)",
  borderMid:   "rgba(0,229,255,0.22)",
  borderHot:   "rgba(0,229,255,0.50)",
  cyan:        "#00e5ff",
  cyanDim:     "#00b8cc",
  cyanFaint:   "rgba(0,229,255,0.06)",
  amber:       "#ffb300",
  amberDim:    "#cc8f00",
  amberFaint:  "rgba(255,179,0,0.08)",
  coral:       "#ff4060",
  coralFaint:  "rgba(255,64,96,0.08)",
  violet:      "#9f7aea",
  jade:        "#10b981",
  white:       "#e8eaf0",
  muted:       "#4a5080",
  mutedMid:    "#6b7299",
  mono:        "'Courier New', 'Lucida Console', monospace",
  sans:        "'Courier New', monospace",
};

/* ─── MOCK DATA ──────────────────────────────────────────────────────────── */
const ME = { handle: "kira_dev", xp: 2340, rank: "Journeyman", rankXp: 2000, nextRank: "Craftsperson", nextXp: 5000, streak: 12, completed: 14, guild: "Async Architects", badges: ["first-blood","file-whisperer","pure-runner","davinci-pen","api-alchemist"] };

const GLOBAL_LB = [
  { pos:1,  handle:"axel_codes",   xp:18420, rank:"Architect",    projects:38, streak:31, guild:"Async Architects",  badge:"⬡" },
  { pos:2,  handle:"priya_m",      xp:14200, rank:"Craftsperson",  projects:29, streak:22, guild:"Data Alchemists",   badge:"◈" },
  { pos:3,  handle:"rustam_k",     xp:11880, rank:"Craftsperson",  projects:26, streak:18, guild:"Automation Guild",  badge:"◈" },
  { pos:4,  handle:"maya_dev",     xp:8750,  rank:"Craftsperson",  projects:21, streak:9,  guild:"Game Dev Guild",    badge:"◈" },
  { pos:5,  handle:"aleksei_p",    xp:6400,  rank:"Craftsperson",  projects:18, streak:14, guild:"Data Alchemists",   badge:"◈" },
  { pos:6,  handle:"kira_dev",     xp:2340,  rank:"Journeyman",    projects:14, streak:12, guild:"Async Architects",  badge:"◇", isMe:true },
  { pos:7,  handle:"lena_x",       xp:2100,  rank:"Journeyman",    projects:12, streak:7,  guild:"Automation Guild",  badge:"◇" },
  { pos:8,  handle:"omari_dev",    xp:1900,  rank:"Apprentice",    projects:10, streak:5,  guild:"Game Dev Guild",    badge:"▷" },
  { pos:9,  handle:"sasha_build",  xp:1650,  rank:"Apprentice",    projects:9,  streak:3,  guild:"Async Architects",  badge:"▷" },
  { pos:10, handle:"dev_nihao",    xp:1400,  rank:"Apprentice",    projects:8,  streak:6,  guild:"Data Alchemists",   badge:"▷" },
];

const WEEKLY_LB = [
  { pos:1, handle:"priya_m",     xp:920, projects:4, streak:22, guild:"Data Alchemists" },
  { pos:2, handle:"kira_dev",    xp:750, projects:3, streak:12, guild:"Async Architects", isMe:true },
  { pos:3, handle:"aleksei_p",   xp:600, projects:3, streak:14, guild:"Data Alchemists" },
  { pos:4, handle:"lena_x",      xp:500, projects:2, streak:7,  guild:"Automation Guild" },
  { pos:5, handle:"rustam_k",    xp:450, projects:2, streak:18, guild:"Automation Guild" },
  { pos:6, handle:"dev_nihao",   xp:400, projects:2, streak:6,  guild:"Data Alchemists" },
  { pos:7, handle:"omari_dev",   xp:350, projects:1, streak:5,  guild:"Game Dev Guild" },
];

const STREAK_LB = [
  { pos:1, handle:"axel_codes", streak:31, guild:"Async Architects" },
  { pos:2, handle:"rustam_k",   streak:22, guild:"Automation Guild" },
  { pos:3, handle:"priya_m",    streak:22, guild:"Data Alchemists" },
  { pos:4, handle:"aleksei_p",  streak:18, guild:"Data Alchemists" },
  { pos:5, handle:"kira_dev",   streak:12, guild:"Async Architects", isMe:true },
  { pos:6, handle:"maya_dev",   streak:9,  guild:"Game Dev Guild" },
  { pos:7, handle:"lena_x",     streak:7,  guild:"Automation Guild" },
];

const GUILDS = [
  { name:"Async Architects",  xp:48200, members:421,  color:C.cyan,   icon:"⚡" },
  { name:"Data Alchemists",   xp:42800, members:892,  color:C.violet, icon:"⚗" },
  { name:"Automation Guild",  xp:38600, members:1247, color:C.amber,  icon:"⚙" },
  { name:"Game Dev Guild",    xp:21400, members:634,  color:C.jade,   icon:"◈" },
];

const FEED = [
  { time:"2m",  handle:"priya_m",    event:"completed",  detail:"Async Web Scraper",           xp:"+500 XP", color:C.jade },
  { time:"5m",  handle:"axel_codes", event:"earned",     detail:"Concurrency Wizard badge",    xp:"",        color:C.violet },
  { time:"9m",  handle:"rustam_k",   event:"completed",  detail:"GitHub Repo Analyzer",        xp:"+250 XP", color:C.jade },
  { time:"14m", handle:"lena_x",     event:"joined",     detail:"Automation Guild",            xp:"",        color:C.amber },
  { time:"18m", handle:"kira_dev",   event:"completed",  detail:"Weather Dashboard",           xp:"+250 XP", color:C.cyan  },
  { time:"22m", handle:"maya_dev",   event:"earned",     detail:"Pure Runner badge",           xp:"",        color:C.violet },
  { time:"31m", handle:"dev_nihao",  event:"completed",  detail:"Password Generator",          xp:"+100 XP", color:C.jade },
  { time:"44m", handle:"omari_dev",  event:"streak",     detail:"5-day streak milestone",      xp:"+20% XP", color:C.amber },
];

const BADGES_ALL = [
  { id:"first-blood",    name:"First Blood",         icon:"⚔", rarity:"Common",    desc:"Complete your first project",          cat:"Milestone" },
  { id:"file-whisperer", name:"File Whisperer",      icon:"⊡", rarity:"Common",    desc:"Master the File I/O milestone",        cat:"Milestone" },
  { id:"object-arch",    name:"Object Architect",    icon:"◈", rarity:"Uncommon",  desc:"Complete 5 OOP-heavy projects",         cat:"Milestone" },
  { id:"api-alchemist",  name:"API Alchemist",       icon:"⚗", rarity:"Uncommon",  desc:"Consume 5 real-world APIs",            cat:"Milestone" },
  { id:"concurrency",    name:"Concurrency Wizard",  icon:"⚡", rarity:"Rare",      desc:"Build 3 async/concurrent projects",     cat:"Milestone" },
  { id:"python-sage",    name:"Python Sage",         icon:"⬟", rarity:"Legendary", desc:"Complete all 30 core projects",         cat:"Milestone" },
  { id:"pure-runner",    name:"Pure Runner",         icon:"◇", rarity:"Rare",      desc:"5 projects with zero hints",            cat:"Craft"     },
  { id:"davinci-pen",    name:"Da Vinci's Pen",      icon:"✒", rarity:"Uncommon",  desc:"Write 10 Da Vinci Sketches",            cat:"Craft"     },
  { id:"test-whisperer", name:"Test Whisperer",      icon:"✓", rarity:"Rare",      desc:"Pass all tests on first try",           cat:"Craft"     },
  { id:"workshop",       name:"Workshop Contributor",icon:"⊕", rarity:"Uncommon",  desc:"Merge first community project PR",      cat:"Community" },
  { id:"guild-master",   name:"Guild Master",        icon:"⬡", rarity:"Rare",      desc:"Lead a guild to weekly challenge win",  cat:"Community" },
  { id:"master-builder", name:"Master Builder",      icon:"▣", rarity:"Epic",      desc:"Contribute 5 community projects",       cat:"Community" },
  { id:"on-a-roll",      name:"On a Roll",           icon:"▶", rarity:"Common",    desc:"7-day completion streak",               cat:"Streak"    },
  { id:"renpace",        name:"Renaissance Pace",    icon:"⬢", rarity:"Epic",      desc:"30-day completion streak",              cat:"Streak"    },
];

const RECENT = [
  { name:"Weather Dashboard",      tier:"intermediate", xp:250, date:"2d ago",  hintsUsed:0 },
  { name:"Hacker News CLI Reader", tier:"intermediate", xp:300, date:"4d ago",  hintsUsed:0 },
  { name:"Pomodoro Engine + Stats",tier:"intermediate", xp:250, date:"6d ago",  hintsUsed:1 },
  { name:"Port Scanner",           tier:"intermediate", xp:250, date:"9d ago",  hintsUsed:0 },
  { name:"GitHub Repo Analyzer",   tier:"intermediate", xp:250, date:"12d ago", hintsUsed:2 },
];

const DIFF_BREAKDOWN = [
  { tier:"Beginner",     count:6,  pct:43, color:C.jade },
  { tier:"Intermediate", count:8,  pct:57, color:C.amber },
  { tier:"Advanced",     count:0,  pct:0,  color:C.coral },
];

/* ─── UTILS ──────────────────────────────────────────────────────────────── */
const rarityColor = { Common:C.mutedMid, Uncommon:C.jade, Rare:C.cyan, Epic:C.violet, Legendary:C.amber };

function AnimatedXP({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 1200;
    const from = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display.toLocaleString()}</>;
}

/* ─── SHARED COMPONENTS ──────────────────────────────────────────────────── */

const Mono = ({ children, color = C.white, size = 12, style = {}, ...rest }) => (
  <span style={{ fontFamily: C.mono, fontSize: size, color, ...style }} {...rest}>{children}</span>
);

const Label = ({ children, style = {} }) => (
  <div style={{ fontFamily: C.mono, fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", ...style }}>{children}</div>
);

const Divider = () => (
  <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
);

const TierPill = ({ tier }) => {
  const map = { beginner:C.jade, intermediate:C.amber, advanced:C.coral, boss:C.violet };
  const c = map[tier] || C.muted;
  return (
    <span style={{
      fontFamily: C.mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
      color: c, border: `1px solid ${c}44`, padding: "1px 6px", borderRadius: 2,
    }}>{tier}</span>
  );
};

const StatCard = ({ label, value, sub, accent = C.cyan, animated = false }) => (
  <div style={{
    background: C.surfaceAlt, border: `1px solid ${C.border}`,
    padding: "14px 16px", flex: 1, minWidth: 0,
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: accent }} />
    <Label style={{ marginBottom: 6 }}>{label}</Label>
    <div style={{ fontFamily: C.mono, fontSize: 22, color: accent, fontWeight: "bold", lineHeight: 1 }}>
      {animated ? <AnimatedXP value={typeof value === "number" ? value : 0} /> : value}
    </div>
    {sub && <Mono color={C.muted} size={10} style={{ marginTop: 4, display: "block" }}>{sub}</Mono>}
  </div>
);

function XPBar({ current, min, max, color = C.cyan }) {
  const pct = Math.round(((current - min) / (max - min)) * 100);
  return (
    <div style={{ position: "relative", height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, height: "100%",
        width: `${pct}%`, background: color, borderRadius: 2,
        boxShadow: `0 0 6px ${color}88`,
        transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
      }} />
    </div>
  );
}

function RankBadge({ rank }) {
  const map = {
    Curious:     { c: C.muted,   sym: "○" },
    Tinkerer:    { c: C.jade,    sym: "▷" },
    Apprentice:  { c: C.cyan,    sym: "◇" },
    Journeyman:  { c: C.amber,   sym: "◈" },
    Craftsperson:{ c: C.violet,  sym: "◈" },
    Architect:   { c: C.coral,   sym: "⬡" },
    Maestro:     { c: "#f9a8d4", sym: "⬟" },
  };
  const { c, sym } = map[rank] || { c: C.muted, sym: "○" };
  return <span style={{ color: c, fontFamily: C.mono, fontSize: 13 }}>{sym} {rank}</span>;
}

/* ─── NAV BAR ─────────────────────────────────────────────────────────────── */
function NavBar({ screen, setScreen }) {
  const tabs = [
    { id: "dashboard",    label: "Dashboard"  },
    { id: "leaderboard",  label: "Leaderboard" },
    { id: "achievements", label: "Achievements" },
    { id: "community",    label: "Community" },
  ];
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
      background: C.surface,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, background: C.cyan, display: "flex",
          alignItems: "center", justifyContent: "center", borderRadius: 4,
        }}>
          <span style={{ fontFamily: C.mono, fontSize: 13, color: C.bg, fontWeight: "bold" }}>CS</span>
        </div>
        <Mono size={14} color={C.white} style={{ letterSpacing: "0.15em" }}>CODESPRINT</Mono>
        <span style={{
          fontFamily: C.mono, fontSize: 9, color: C.cyan,
          border: `1px solid ${C.cyan}44`, padding: "1px 6px", borderRadius: 2,
        }}>v1.0</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setScreen(t.id)} style={{
            fontFamily: C.mono, fontSize: 11, padding: "5px 14px",
            background: screen === t.id ? `${C.cyan}15` : "transparent",
            color: screen === t.id ? C.cyan : C.muted,
            border: screen === t.id ? `1px solid ${C.cyan}44` : "1px solid transparent",
            borderRadius: 3, cursor: "pointer", transition: "all 0.15s",
            letterSpacing: "0.05em",
          }}>{t.label}</button>
        ))}
      </div>

      {/* User pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "5px 12px", border: `1px solid ${C.borderMid}`, borderRadius: 3,
        background: C.surfaceAlt,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.cyan}44, ${C.violet}44)`,
          border: `1px solid ${C.borderMid}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Mono size={9} color={C.cyan}>KD</Mono>
        </div>
        <Mono size={11} color={C.white}>{ME.handle}</Mono>
        <span style={{ width: 1, height: 14, background: C.border }} />
        <Mono size={11} color={C.amber}>{ME.xp.toLocaleString()} XP</Mono>
        <Mono size={11} color={C.muted}>·</Mono>
        <RankBadge rank={ME.rank} />
      </div>
    </div>
  );
}

/* ─── DASHBOARD SCREEN ──────────────────────────────────────────────────── */
function Dashboard() {
  const xpProgress = Math.round(((ME.xp - ME.rankXp) / (ME.nextXp - ME.rankXp)) * 100);

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Hero rank card */}
      <div style={{
        background: C.surfaceAlt, border: `1px solid ${C.borderMid}`,
        padding: "20px 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -20, top: -20,
          width: 160, height: 160, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyan}0a 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <Label style={{ marginBottom: 6 }}>Current Rank</Label>
            <div style={{ fontFamily: C.mono, fontSize: 26, color: C.amber, letterSpacing: "0.05em" }}>
              ◈ {ME.rank}
            </div>
            <Mono size={11} color={C.muted} style={{ display: "block", marginTop: 4 }}>
              Guild: <span style={{ color: C.cyan }}>{ME.guild}</span>
            </Mono>
          </div>
          <div style={{ textAlign: "right" }}>
            <Label style={{ marginBottom: 6 }}>Total XP</Label>
            <div style={{ fontFamily: C.mono, fontSize: 28, color: C.cyan }}>
              <AnimatedXP value={ME.xp} />
            </div>
            <Mono size={10} color={C.muted} style={{ display: "block", marginTop: 4 }}>
              #{6} global · #{2} this week
            </Mono>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <Mono size={10} color={C.muted}>{ME.rank} · {ME.rankXp.toLocaleString()} XP</Mono>
            <Mono size={10} color={C.muted}>{ME.nextRank} · {ME.nextXp.toLocaleString()} XP</Mono>
          </div>
          <XPBar current={ME.xp} min={ME.rankXp} max={ME.nextXp} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <Mono size={10} color={C.cyan}>{xpProgress}% to {ME.nextRank}</Mono>
            <Mono size={10} color={C.muted}>{(ME.nextXp - ME.xp).toLocaleString()} XP remaining</Mono>
          </div>
        </div>
      </div>

      {/* Stat cards row */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard label="Projects Completed" value={ME.completed} sub="14 of 30 core" accent={C.cyan} />
        <StatCard label="Current Streak" value={`${ME.streak}d`} sub="Best: 18d" accent={C.amber} />
        <StatCard label="Badges Earned" value={ME.badges.length} sub={`of ${BADGES_ALL.length} total`} accent={C.violet} />
        <StatCard label="Guild Rank" value="#2" sub="Async Architects" accent={C.jade} />
      </div>

      {/* Two-column: recent + difficulty */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* Recent completions */}
        <div style={{ flex: 2, minWidth: 260, background: C.surfaceAlt, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
          <Label style={{ marginBottom: 10 }}>Recent Completions</Label>
          {RECENT.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0",
              borderBottom: i < RECENT.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                width: 28, height: 28, background: r.hintsUsed === 0 ? `${C.jade}15` : C.surfaceAlt,
                border: `1px solid ${r.hintsUsed === 0 ? C.jade : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, flexShrink: 0,
              }}>
                <Mono size={11} color={r.hintsUsed === 0 ? C.jade : C.muted}>✓</Mono>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Mono size={12} color={C.white} style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.name}
                </Mono>
                <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                  <TierPill tier={r.tier} />
                  {r.hintsUsed === 0 && <Mono size={9} color={C.jade}>◇ Pure Run</Mono>}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <Mono size={12} color={C.amber} style={{ display: "block" }}>+{r.xp}</Mono>
                <Mono size={10} color={C.muted}>{r.date}</Mono>
              </div>
            </div>
          ))}
        </div>

        {/* Difficulty + weekly XP */}
        <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
            <Label style={{ marginBottom: 12 }}>By Difficulty</Label>
            {DIFF_BREAKDOWN.map(d => (
              <div key={d.tier} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <TierPill tier={d.tier.toLowerCase()} />
                  <Mono size={11} color={d.color}>{d.count} projects</Mono>
                </div>
                <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.pct}%`, background: d.color, boxShadow: `0 0 4px ${d.color}88` }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
            <Label style={{ marginBottom: 10 }}>This Week</Label>
            <div style={{ fontFamily: C.mono, fontSize: 24, color: C.cyan }}>750</div>
            <Mono size={10} color={C.jade} style={{ display: "block", marginTop: 4 }}>▲ +12% vs last week</Mono>
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><Label>Projects</Label><Mono size={14} color={C.white}>3</Mono></div>
              <div style={{ textAlign: "right" }}><Label>Hints Used</Label><Mono size={14} color={C.coral}>1</Mono></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LEADERBOARD SCREEN ────────────────────────────────────────────────── */
function Leaderboard() {
  const [tab, setTab] = useState("global");
  const [guildFilter, setGuildFilter] = useState(null);
  const [hovered, setHovered] = useState(null);

  const data = tab === "global" ? GLOBAL_LB : tab === "weekly" ? WEEKLY_LB : STREAK_LB;
  const filtered = guildFilter ? data.filter(r => r.guild === guildFilter) : data;

  const posStyle = (pos) => {
    if (pos === 1) return { color: C.amber, text: "#1" };
    if (pos === 2) return { color: "#94a3b8", text: "#2" };
    if (pos === 3) return { color: "#b45309", text: "#3" };
    return { color: C.muted, text: `#${pos}` };
  };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Tabs + filter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["global","weekly","streak"].map(t => (
            <button key={t} onClick={() => { setTab(t); setGuildFilter(null); }} style={{
              fontFamily: C.mono, fontSize: 11, padding: "5px 14px", cursor: "pointer",
              background: tab === t ? `${C.cyan}18` : C.surfaceAlt,
              color: tab === t ? C.cyan : C.muted,
              border: `1px solid ${tab === t ? C.borderMid : C.border}`, borderRadius: 3,
              letterSpacing: "0.06em", textTransform: "capitalize",
            }}>{t === "global" ? "⬡ Global" : t === "weekly" ? "◈ Weekly" : "▷ Streak"}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => setGuildFilter(null)} style={{
            fontFamily: C.mono, fontSize: 10, padding: "3px 10px", cursor: "pointer",
            background: !guildFilter ? `${C.amber}18` : "transparent",
            color: !guildFilter ? C.amber : C.muted,
            border: `1px solid ${!guildFilter ? C.amberDim : C.border}`, borderRadius: 2,
          }}>All Guilds</button>
          {GUILDS.map(g => (
            <button key={g.name} onClick={() => setGuildFilter(g.name === guildFilter ? null : g.name)} style={{
              fontFamily: C.mono, fontSize: 10, padding: "3px 10px", cursor: "pointer",
              background: guildFilter === g.name ? `${g.color}18` : "transparent",
              color: guildFilter === g.name ? g.color : C.muted,
              border: `1px solid ${guildFilter === g.name ? g.color + "66" : C.border}`, borderRadius: 2,
            }}>{g.icon}</button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr 90px 70px 60px 60px",
        gap: 8, padding: "6px 14px",
        borderBottom: `1px solid ${C.borderMid}`,
      }}>
        {["#","Handle", tab === "streak" ? "Streak" : "XP", "Rank", "Projects", "Guild"].map(h => (
          <Label key={h}>{h}</Label>
        ))}
      </div>

      {/* Rows */}
      {filtered.map((row) => {
        const ps = posStyle(row.pos);
        const isMe = row.isMe;
        const isHov = hovered === row.handle;
        return (
          <div
            key={row.handle}
            onMouseEnter={() => setHovered(row.handle)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr 90px 70px 60px 60px",
              gap: 8, padding: "10px 14px",
              background: isMe ? `${C.cyan}08` : isHov ? C.surfaceAlt : "transparent",
              border: `1px solid ${isMe ? C.borderMid : isHov ? C.border : "transparent"}`,
              borderRadius: 2, cursor: "default", transition: "all 0.12s",
              position: "relative",
            }}
          >
            {isMe && (
              <div style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 2, height: "70%", background: C.cyan, borderRadius: 1,
              }} />
            )}
            {/* Pos */}
            <Mono size={13} color={ps.color} style={{ fontWeight: row.pos <= 3 ? "bold" : "normal" }}>
              {ps.text}
            </Mono>
            {/* Handle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {row.badge && <Mono size={11} color={ps.color}>{row.badge}</Mono>}
              <Mono size={13} color={isMe ? C.cyan : C.white}>{row.handle}</Mono>
              {isMe && <span style={{ fontFamily: C.mono, fontSize: 9, color: C.cyan, border: `1px solid ${C.cyan}44`, padding: "0 4px", borderRadius: 2 }}>you</span>}
            </div>
            {/* XP or streak */}
            <Mono size={13} color={tab === "streak" ? C.jade : C.amber}>
              {tab === "streak" ? `${row.streak}d` : row.xp?.toLocaleString()}
            </Mono>
            {/* Rank */}
            <Mono size={11} color={C.mutedMid}>{row.rank || "—"}</Mono>
            {/* Projects */}
            <Mono size={12} color={C.mutedMid}>{row.projects || "—"}</Mono>
            {/* Guild tag */}
            <Mono size={10} color={GUILDS.find(g => g.name === row.guild)?.color || C.muted} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {GUILDS.find(g => g.name === row.guild)?.icon || ""} {row.guild?.split(" ")[0]}
            </Mono>
          </div>
        );
      })}

      {/* Guild standings */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 4 }}>
        <Label style={{ marginBottom: 12 }}>Guild XP Standings</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {GUILDS.map((g, i) => (
            <div key={g.name} style={{
              flex: 1, minWidth: 120,
              background: C.surfaceAlt, border: `1px solid ${ME.guild === g.name ? g.color + "44" : C.border}`,
              padding: "10px 14px", borderRadius: 2,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <Mono size={14} color={g.color}>{g.icon}</Mono>
                <Mono size={11} color={C.muted}>#{i+1}</Mono>
              </div>
              <Mono size={10} color={C.white} style={{ display: "block", marginBottom: 4 }}>{g.name}</Mono>
              <Mono size={13} color={g.color} style={{ display: "block" }}>{g.xp.toLocaleString()} XP</Mono>
              <Mono size={10} color={C.muted} style={{ display: "block", marginTop: 2 }}>{g.members.toLocaleString()} members</Mono>
              {ME.guild === g.name && (
                <span style={{ fontFamily: C.mono, fontSize: 9, color: g.color, border: `1px solid ${g.color}44`, padding: "1px 5px", borderRadius: 2, display: "inline-block", marginTop: 4 }}>Your Guild</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ACHIEVEMENTS SCREEN ───────────────────────────────────────────────── */
function Achievements() {
  const [catFilter, setCatFilter] = useState("All");
  const cats = ["All", "Milestone", "Craft", "Community", "Streak"];

  const filtered = catFilter === "All" ? BADGES_ALL : BADGES_ALL.filter(b => b.cat === catFilter);
  const earned = ME.badges;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Progress summary */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard label="Badges Earned" value={earned.length} sub={`of ${BADGES_ALL.length} total`} accent={C.violet} />
        <StatCard label="Completion" value={`${Math.round((earned.length / BADGES_ALL.length) * 100)}%`} sub="badge catalog" accent={C.cyan} />
        <StatCard label="Rarest Earned" value="Rare" sub="Pure Runner" accent={C.amber} />
      </div>

      {/* Catalog filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            fontFamily: C.mono, fontSize: 10, padding: "4px 12px", cursor: "pointer",
            background: catFilter === c ? `${C.violet}18` : "transparent",
            color: catFilter === c ? C.violet : C.muted,
            border: `1px solid ${catFilter === c ? C.violet + "55" : C.border}`, borderRadius: 2,
          }}>{c}</button>
        ))}
      </div>

      {/* Badge grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 10 }}>
        {filtered.map(b => {
          const has = earned.includes(b.id);
          const rc = rarityColor[b.rarity];
          return (
            <div key={b.id} style={{
              background: has ? C.surfaceAlt : C.surface,
              border: `1px solid ${has ? rc + "44" : C.border}`,
              padding: "14px 14px", borderRadius: 2,
              opacity: has ? 1 : 0.45,
              position: "relative", overflow: "hidden",
              transition: "all 0.15s",
            }}>
              {has && (
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: 0, height: 0,
                  borderLeft: "24px solid transparent",
                  borderTop: `24px solid ${rc}44`,
                }} />
              )}
              <div style={{ fontFamily: C.mono, fontSize: 22, marginBottom: 8, color: has ? rc : C.muted }}>{b.icon}</div>
              <Mono size={12} color={has ? C.white : C.muted} style={{ display: "block", marginBottom: 3, fontWeight: "bold" }}>{b.name}</Mono>
              <Mono size={10} color={C.muted} style={{ display: "block", marginBottom: 8, lineHeight: 1.5 }}>{b.desc}</Mono>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: C.mono, fontSize: 9, color: rc, letterSpacing: "0.1em", textTransform: "uppercase" }}>{b.rarity}</span>
                <span style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{b.cat}</span>
              </div>
              {has && (
                <div style={{ marginTop: 6, height: 2, background: rc, borderRadius: 1, boxShadow: `0 0 4px ${rc}` }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── COMMUNITY HALL SCREEN ─────────────────────────────────────────────── */
function Community() {
  const [feedItems] = useState(FEED);
  const [challengeSeconds, setChallengeSeconds] = useState(58340);

  useEffect(() => {
    const t = setInterval(() => setChallengeSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(challengeSeconds / 3600);
  const m = Math.floor((challengeSeconds % 3600) / 60);
  const s = challengeSeconds % 60;
  const pad = n => String(n).padStart(2, "0");

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Weekly challenge banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.surfaceAlt}, #0d0a18)`,
        border: `1px solid ${C.violet}44`, padding: "16px 20px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${C.violet}18 0%, transparent 70%)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.violet, border: `1px solid ${C.violet}55`, padding: "1px 8px", borderRadius: 2, letterSpacing: "0.1em" }}>WEEKLY CHALLENGE</span>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.amber }}>⚡ Async Architects</span>
            </div>
            <Mono size={15} color={C.white} style={{ display: "block", marginBottom: 4 }}>
              Build a CLI tool that saves you real time this week
            </Mono>
            <Mono size={11} color={C.muted}>Open-ended · Judged by completions + community votes · 3 submissions so far</Mono>
          </div>
          <div style={{ textAlign: "right" }}>
            <Label style={{ marginBottom: 4 }}>Time Remaining</Label>
            <div style={{ fontFamily: C.mono, fontSize: 20, color: C.coral, letterSpacing: "0.1em" }}>
              {pad(h)}:{pad(m)}:{pad(s)}
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: feed + top submissions */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* Live activity feed */}
        <div style={{ flex: 1, minWidth: 260, background: C.surfaceAlt, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Label>Live Activity</Label>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.jade, boxShadow: `0 0 6px ${C.jade}` }} />
          </div>
          {feedItems.map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, padding: "7px 0",
              borderBottom: i < feedItems.length - 1 ? `1px solid ${C.border}` : "none",
              alignItems: "flex-start",
            }}>
              <Mono size={10} color={C.muted} style={{ width: 22, flexShrink: 0, marginTop: 1 }}>{item.time}</Mono>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.cyan }}>{item.handle}</span>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted }}> {item.event} </span>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: item.color }}>{item.detail}</span>
                {item.xp && <span style={{ fontFamily: C.mono, fontSize: 10, color: C.amber, marginLeft: 6 }}>{item.xp}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Hall of Fame */}
        <div style={{ flex: 1, minWidth: 220, background: C.surfaceAlt, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
          <Label style={{ marginBottom: 10 }}>Hall of Fame</Label>
          {[
            { rank:1, name:"CLI Budget Tracker Pro",        author:"maya_dev",  tier:"beginner",     completions:134, votes:201 },
            { rank:2, name:"Smart Git Commit Suggester",    author:"rustam_k",  tier:"intermediate", completions:47,  votes:89  },
            { rank:3, name:"Terminal Markdown Viewer",      author:"aleksei_p", tier:"intermediate", completions:23,  votes:56  },
            { rank:4, name:"Log Diff Analyzer",             author:"priya_m",   tier:"advanced",     completions:12,  votes:38  },
          ].map(item => (
            <div key={item.name} style={{
              display: "flex", gap: 10, padding: "8px 0",
              borderBottom: item.rank < 4 ? `1px solid ${C.border}` : "none",
            }}>
              <Mono size={13} color={item.rank <= 3 ? C.amber : C.muted} style={{ width: 20, flexShrink: 0 }}>
                {item.rank <= 3 ? ["①","②","③"][item.rank-1] : `#${item.rank}`}
              </Mono>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <Mono size={12} color={C.white} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{item.name}</Mono>
                  <TierPill tier={item.tier} />
                </div>
                <Mono size={10} color={C.muted} style={{ display: "block", marginTop: 2 }}>
                  {item.author} · {item.completions} completions · {item.votes} votes
                </Mono>
              </div>
            </div>
          ))}

          <Divider />
          <Label style={{ marginBottom: 10 }}>Guild Standings</Label>
          {GUILDS.map((g, i) => (
            <div key={g.name} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "5px 0",
              borderBottom: i < GUILDS.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mono size={13} color={g.color}>{g.icon}</Mono>
                <Mono size={11} color={ME.guild === g.name ? g.color : C.white}>{g.name}</Mono>
                {ME.guild === g.name && <Mono size={9} color={g.color}>← you</Mono>}
              </div>
              <Mono size={11} color={C.muted}>{g.xp.toLocaleString()} XP</Mono>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("dashboard");

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: C.mono,
    }}>
      <NavBar screen={screen} setScreen={setScreen} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {screen === "dashboard"    && <Dashboard />}
        {screen === "leaderboard"  && <Leaderboard />}
        {screen === "achievements" && <Achievements />}
        {screen === "community"    && <Community />}
      </div>
    </div>
  );
}
