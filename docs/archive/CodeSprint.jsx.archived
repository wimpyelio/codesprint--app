import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import AuthModal from "../components/AuthModal.jsx";
import DashboardScreen from "../components/DashboardScreen.jsx";
import LeaderboardScreen from "../components/LeaderboardScreen.jsx";
import { projectsService } from "../services/projectsService.js";
import { progressService } from "../services/progressService.js";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#0a0c0a",
  surface: "#0f120f",
  border: "#1e2e1e",
  borderBright: "#2a4a2a",
  green: "#4ade80",
  greenDim: "#22c55e",
  greenFaint: "#166534",
  amber: "#fbbf24",
  red: "#f87171",
  blue: "#60a5fa",
  purple: "#c084fc",
  white: "#e2e8e2",
  muted: "#4a6e4a",
  font: "'Courier New', 'Lucida Console', monospace",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "directory-cleaner",
    name: "Directory Cleaner",
    tier: "beginner",
    concepts: ["os", "shutil", "pathlib"],
    hours: "1-2",
    xp: 100,
    tests: 6,
  },
  {
    id: "cli-journal",
    name: "Personal CLI Journal",
    tier: "beginner",
    concepts: ["file I/O", "datetime", "argparse"],
    hours: "1-2",
    xp: 100,
    tests: 5,
  },
  {
    id: "password-gen",
    name: "Password Generator",
    tier: "beginner",
    concepts: ["secrets", "string", "functions"],
    hours: "0.5-1",
    xp: 100,
    tests: 4,
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker (CSV)",
    tier: "beginner",
    concepts: ["csv", "dicts", "math"],
    hours: "1-2",
    xp: 100,
    tests: 7,
  },
  {
    id: "countdown-timer",
    name: "Countdown Timer",
    tier: "beginner",
    concepts: ["time", "sys.stdout", "ANSI"],
    hours: "1",
    xp: 100,
    tests: 4,
  },
  {
    id: "word-frequency",
    name: "Word Frequency Analyzer",
    tier: "beginner",
    concepts: ["collections.Counter", "re"],
    hours: "1",
    xp: 100,
    tests: 5,
  },
  {
    id: "hn-reader",
    name: "Hacker News CLI Reader",
    tier: "intermediate",
    concepts: ["httpx", "JSON", "async", "pagination", "rich"],
    hours: "2-4",
    xp: 250,
    tests: 8,
  },
  {
    id: "pomodoro",
    name: "Pomodoro Engine + Stats",
    tier: "intermediate",
    concepts: ["classes", "sqlite3", "rich", "timers"],
    hours: "2-4",
    xp: 250,
    tests: 9,
  },
  {
    id: "weather-dash",
    name: "Weather Dashboard",
    tier: "intermediate",
    concepts: ["async httpx", "typer", "error handling"],
    hours: "2-4",
    xp: 250,
    tests: 7,
  },
  {
    id: "github-analyzer",
    name: "GitHub Repo Analyzer",
    tier: "intermediate",
    concepts: ["GitHub API", "OAuth", "rate limiting"],
    hours: "3-4",
    xp: 250,
    tests: 10,
  },
  {
    id: "finance-api",
    name: "Personal Finance REST API",
    tier: "advanced",
    concepts: ["FastAPI", "Pydantic", "async I/O"],
    hours: "4-6",
    xp: 500,
    tests: 12,
  },
  {
    id: "async-scraper",
    name: "Async Web Scraper",
    tier: "advanced",
    concepts: ["asyncio", "aiohttp", "semaphores"],
    hours: "4-6",
    xp: 500,
    tests: 11,
  },
  {
    id: "cli-agent",
    name: "Autonomous CLI Agent",
    tier: "advanced",
    concepts: ["subprocess", "state machine", "async"],
    hours: "5-6",
    xp: 500,
    tests: 14,
  },
  {
    id: "boss1",
    name: "BOSS 1: CLI Automation Suite",
    tier: "boss",
    concepts: ["All Beginner concepts unified"],
    hours: "4-8",
    xp: 1000,
    tests: 20,
  },
];

const RANKS = [
  { name: "Curious", min: 0, color: T.muted },
  { name: "Tinkerer", min: 300, color: T.greenDim },
  { name: "Apprentice", min: 800, color: T.green },
  { name: "Journeyman", min: 2000, color: T.amber },
  { name: "Craftsperson", min: 5000, color: T.blue },
  { name: "Architect", min: 10000, color: T.purple },
  { name: "Maestro", min: 25000, color: "#f9a8d4" },
];

const QUOTES = [
  "The noblest pleasure is the joy of understanding. — Leonardo da Vinci",
  "Simplicity is the ultimate sophistication. — Leonardo da Vinci",
  "Real artists ship. — Steve Jobs",
  "Stay hungry, stay foolish. — Steve Jobs",
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "Programs must be written for people to read. — Harold Abelson",
];

const BADGES = [
  {
    id: "first-blood",
    name: "First Blood",
    icon: "⚔",
    desc: "Complete your first project",
    rarity: "Common",
  },
  {
    id: "file-whisperer",
    name: "File Whisperer",
    icon: "📂",
    desc: "Master File I/O milestone",
    rarity: "Common",
  },
  {
    id: "pure-runner",
    name: "Pure Runner",
    icon: "◇",
    desc: "5 projects, zero hints used",
    rarity: "Rare",
  },
  {
    id: "davinci-pen",
    name: "Da Vinci's Pen",
    icon: "✒",
    desc: "Write 10 Da Vinci Sketches",
    rarity: "Uncommon",
  },
];

function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.min) rank = r;
    else break;
  }
  return rank;
}

function getNextRank(xp) {
  for (const r of RANKS) {
    if (r.min > xp) return r;
  }
  return null;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Box = ({ title, children, style = {} }) => (
  <div
    style={{
      border: `1px solid ${T.borderBright}`,
      padding: "0 12px 12px",
      marginBottom: 12,
      ...style,
    }}
  >
    {title && (
      <div style={{ marginTop: -10, marginBottom: 8 }}>
        <span
          style={{
            background: T.bg,
            padding: "0 6px",
            color: T.green,
            fontSize: 11,
            fontFamily: T.font,
            letterSpacing: 2,
          }}
        >
          {title}
        </span>
      </div>
    )}
    {children}
  </div>
);

const Line = ({ children, color = T.white, dim = false, style = {} }) => (
  <div
    style={{
      fontFamily: T.font,
      fontSize: 13,
      color: dim ? T.muted : color,
      lineHeight: "1.7",
      ...style,
    }}
  >
    {children}
  </div>
);

const Key = ({ k }) => (
  <span
    style={{
      display: "inline-block",
      border: `1px solid ${T.borderBright}`,
      borderRadius: 3,
      padding: "0 5px",
      fontSize: 11,
      color: T.amber,
      fontFamily: T.font,
      marginRight: 2,
      background: T.surface,
    }}
  >
    {k}
  </span>
);

const TierBadge = ({ tier }) => {
  const colors = {
    beginner: T.greenDim,
    intermediate: T.amber,
    advanced: T.red,
    boss: T.purple,
  };
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: T.font,
        padding: "1px 6px",
        border: `1px solid ${colors[tier] || T.muted}`,
        color: colors[tier] || T.muted,
        borderRadius: 2,
        marginLeft: 6,
      }}
    >
      {tier.toUpperCase()}
    </span>
  );
};

const ProgressBar = ({ value, max, width = 24, color = T.green }) => {
  const pct = Math.round((value / max) * width);
  const filled = "█".repeat(pct);
  const empty = "░".repeat(width - pct);
  return (
    <span style={{ fontFamily: T.font, color }}>
      {filled}
      <span style={{ color: T.greenFaint }}>{empty}</span>
      <span style={{ color: T.muted, marginLeft: 6 }}>
        {Math.round((value / max) * 100)}%
      </span>
    </span>
  );
};

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function MainMenu({
  state,
  onNav,
  user,
  isAuthenticated,
  onShowAuth,
  onLogout,
  availableProjects,
}) {
  const rank = getRank(state.xp);
  const nextRank = getNextRank(state.xp);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          border: `1px solid ${T.borderBright}`,
          padding: "10px 16px",
          marginBottom: 16,
          background: `linear-gradient(135deg, ${T.surface} 0%, #0d160d 100%)`,
          boxShadow: `0 0 20px ${T.greenFaint}44`,
        }}
      >
        <div
          style={{
            fontFamily: T.font,
            fontSize: 15,
            color: T.green,
            letterSpacing: 8,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          C O D E S P R I N T
        </div>
        <div
          style={{
            fontFamily: T.font,
            fontSize: 11,
            color: T.muted,
            textAlign: "center",
            letterSpacing: 3,
          }}
        >
          Python Mastery Workshop · v0.1.0
        </div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <span style={{ fontFamily: T.font, fontSize: 12, color: rank.color }}>
            ⬟ {rank.name}
          </span>
          <span style={{ fontFamily: T.font, fontSize: 12, color: T.amber }}>
            ✦ {state.xp.toLocaleString()} XP
          </span>
          <span style={{ fontFamily: T.font, fontSize: 12, color: T.muted }}>
            {state.completed.length} projects · {state.streak}d streak
          </span>
        </div>
        {nextRank && (
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <span style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>
              {nextRank.name} in {(nextRank.min - state.xp).toLocaleString()} XP
              ·{" "}
            </span>
            <ProgressBar
              value={state.xp - getRank(state.xp).min}
              max={nextRank.min - getRank(state.xp).min}
              width={20}
            />
          </div>
        )}
      </div>

      {/* Menu Items */}
      {[
        {
          key: "1",
          label: "Start a Project",
          sub: `${availableProjects.filter((p) => !state.completed.includes(p.id?.toString())).length} available`,
          action: "projects",
        },
        {
          key: "2",
          label: "Your Dashboard",
          sub: "View progress & stats",
          action: "dashboard",
        },
        {
          key: "3",
          label: "Global Leaderboard",
          sub: "Compete worldwide",
          action: "leaderboard",
        },
        {
          key: "4",
          label: "Achievements",
          sub: `${state.badges.length} badge${state.badges.length !== 1 ? "s" : ""} earned`,
          action: "achievements",
        },
        {
          key: "5",
          label: "Community Hall",
          sub: "14 new submissions",
          action: "community",
        },
        ...(isAuthenticated
          ? [
              {
                key: "6",
                label: `Logout (${user?.username})`,
                sub: "Sign out of your account",
                action: "logout",
              },
            ]
          : [
              {
                key: "6",
                label: "Login/Register",
                sub: "Connect to save progress",
                action: "auth",
              },
            ]),
      ].map((item) => (
        <div
          key={item.key}
          onClick={() => {
            if (item.action === "auth") {
              onShowAuth();
            } else if (item.action === "logout") {
              onLogout();
            } else {
              onNav(item.action);
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 14px",
            marginBottom: 4,
            cursor: "pointer",
            border: `1px solid transparent`,
            borderRadius: 2,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = T.borderBright;
            e.currentTarget.style.background = T.surface;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span
            style={{
              fontFamily: T.font,
              color: T.amber,
              fontSize: 13,
              width: 28,
            }}
          >
            [{item.key}]
          </span>
          <span
            style={{
              fontFamily: T.font,
              color: T.white,
              fontSize: 13,
              flex: 1,
            }}
          >
            {item.label}
          </span>
          <span style={{ fontFamily: T.font, color: T.muted, fontSize: 12 }}>
            ─ {item.sub}
          </span>
        </div>
      ))}

      <div
        style={{
          marginTop: 16,
          borderTop: `1px solid ${T.border}`,
          paddingTop: 10,
        }}
      >
        <Line color={T.muted} style={{ fontSize: 11, textAlign: "center" }}>
          Click a menu item or press <Key k="1" />–<Key k="6" /> to navigate ·{" "}
          <Key k="q" /> quit
        </Line>
      </div>
    </div>
  );
}

function ProjectList({ state, projects, onSelect, onBack }) {
  const [filter, setFilter] = useState("all");
  const tiers = ["all", "beginner", "intermediate", "advanced", "boss"];
  const colors = {
    beginner: T.greenDim,
    intermediate: T.amber,
    advanced: T.red,
    boss: T.purple,
  };

  const visible = projects.filter((p) => filter === "all" || p.tier === filter);
  const isLocked = (p) => {
    const getTierCount = (tier) =>
      state.completed.filter(
        (id) => projects.find((x) => x.id.toString() === id)?.tier === tier,
      ).length;

    if (p.tier === "intermediate") return getTierCount("beginner") < 5;
    if (p.tier === "advanced") return getTierCount("intermediate") < 5;
    if (p.tier === "boss") return getTierCount("beginner") < 3;
    return false;
  };

  return (
    <div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}
      >
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              fontFamily: T.font,
              fontSize: 11,
              padding: "3px 10px",
              cursor: "pointer",
              background: filter === t ? colors[t] || T.green : T.surface,
              color: filter === t ? T.bg : colors[t] || T.muted,
              border: `1px solid ${filter === t ? colors[t] || T.green : T.border}`,
              borderRadius: 2,
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
        {visible.map((p) => {
          const done = state.completed.includes(p.id);
          const locked = !done && isLocked(p);
          const inProg = state.inProgress?.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => !locked && onSelect(p)}
              style={{
                padding: "8px 12px",
                marginBottom: 4,
                cursor: locked ? "not-allowed" : "pointer",
                border: `1px solid ${inProg ? T.green : done ? T.greenFaint : T.border}`,
                opacity: locked ? 0.4 : 1,
                borderRadius: 2,
                background: inProg ? "#0a1a0a" : "transparent",
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) =>
                !locked && (e.currentTarget.style.borderColor = T.borderBright)
              }
              onMouseLeave={(e) =>
                !locked &&
                (e.currentTarget.style.borderColor = inProg
                  ? T.green
                  : done
                    ? T.greenFaint
                    : T.border)
              }
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: T.font,
                    fontSize: 12,
                    color: done ? T.greenDim : T.white,
                    flex: 1,
                  }}
                >
                  {done ? "✓ " : inProg ? "▶ " : locked ? "🔒 " : "  "}
                  {p.name}
                </span>
                <TierBadge tier={p.tier} />
                <span
                  style={{
                    fontFamily: T.font,
                    fontSize: 11,
                    color: T.amber,
                    marginLeft: 8,
                  }}
                >
                  +{p.xp}xp
                </span>
              </div>
              <div style={{ marginTop: 3 }}>
                {p.concepts.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    style={{
                      fontFamily: T.font,
                      fontSize: 10,
                      color: T.muted,
                      marginRight: 8,
                      borderBottom: `1px dotted ${T.border}`,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: T.font,
            fontSize: 12,
            padding: "4px 14px",
            cursor: "pointer",
            background: "transparent",
            color: T.muted,
            border: `1px solid ${T.border}`,
            borderRadius: 2,
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

function ActiveProject({ project, state, onComplete, onBack, onDaVinci }) {
  const [testsPassing, setTestsPassing] = useState(
    state.inProgress?.id === project.id ? state.inProgress.tests || 0 : 0,
  );
  const [running, setRunning] = useState(false);
  const [hints, setHints] = useState(0);
  const [log, setLog] = useState([]);

  const total = project.tests;
  const pct = Math.round((testsPassing / total) * 100);

  const runTests = useCallback(() => {
    setRunning(true);
    setLog([]);
    const toPass = Math.min(
      testsPassing + Math.floor(Math.random() * 3) + 1,
      total,
    );

    let i = 0;
    const msgs = [
      `pytest ${project.id}/tests/ -v`,
      `collecting ... ${total} items`,
      ...Array.from(
        { length: toPass },
        (_, n) => `  PASSED tests/test_${project.id}.py::test_${n + 1}`,
      ),
      ...Array.from(
        { length: total - toPass },
        (_, n) =>
          `  FAILED tests/test_${project.id}.py::test_${toPass + n + 1}`,
      ),
      `${toPass} passed, ${total - toPass} failed in 0.${Math.floor(Math.random() * 9) + 1}s`,
    ];

    const interval = setInterval(() => {
      if (i < msgs.length) {
        setLog((prev) => [...prev, msgs[i]]);
        i++;
      } else {
        setTestsPassing(toPass);
        setRunning(false);
        if (toPass === total) setTimeout(() => onComplete(project, hints), 800);
        clearInterval(interval);
      }
    }, 80);
  }, [testsPassing, total, project, hints, onComplete]);

  const useHint = () => {
    if (state.xp < 50) return;
    setHints((h) => h + 1);
    setLog((prev) => [
      ...prev,
      `💡 hint: check the ${project.concepts[hints % project.concepts.length]} docs`,
    ]);
  };

  return (
    <div>
      <Box title="ACTIVE PROJECT">
        <Line color={T.green} style={{ fontSize: 14, marginBottom: 4 }}>
          {project.name} <TierBadge tier={project.tier} />
        </Line>
        <Line dim style={{ fontSize: 11, marginBottom: 8 }}>
          Concepts: {project.concepts.join(" · ")}
        </Line>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>
            Tests: {testsPassing}/{total}
          </span>
          <ProgressBar
            value={testsPassing}
            max={total}
            width={28}
            color={pct === 100 ? T.green : T.amber}
          />
        </div>
      </Box>

      {/* Test log */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          padding: "8px 12px",
          minHeight: 120,
          maxHeight: 160,
          overflowY: "auto",
          marginBottom: 12,
          fontFamily: T.font,
          fontSize: 11,
        }}
      >
        {log.length === 0 && (
          <span style={{ color: T.muted }}>$ press [r] to run tests</span>
        )}
        {log.map((l, i) => (
          <div
            key={i}
            style={{
              color: l.includes("PASSED")
                ? T.greenDim
                : l.includes("FAILED")
                  ? T.red
                  : l.includes("hint")
                    ? T.amber
                    : T.muted,
              lineHeight: "1.6",
            }}
          >
            {l}
          </div>
        ))}
        {running && <div style={{ color: T.green }}>⣾ running...</div>}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { k: "r", label: "Run tests", action: runTests, disabled: running },
          {
            k: "h",
            label: `Hint (−50 XP)`,
            action: useHint,
            disabled: state.xp < 50,
          },
          { k: "d", label: "Da Vinci Mode", action: onDaVinci },
          { k: "b", label: "← Back", action: onBack },
        ].map((btn) => (
          <button
            key={btn.k}
            onClick={btn.disabled ? undefined : btn.action}
            style={{
              fontFamily: T.font,
              fontSize: 12,
              padding: "5px 14px",
              cursor: btn.disabled ? "not-allowed" : "pointer",
              background: "transparent",
              color: btn.disabled ? T.muted : T.white,
              border: `1px solid ${btn.disabled ? T.border : T.borderBright}`,
              borderRadius: 2,
              opacity: btn.disabled ? 0.5 : 1,
            }}
          >
            <Key k={btn.k} /> {btn.label}
          </button>
        ))}
      </div>

      {hints > 0 && (
        <Line dim style={{ marginTop: 8, fontSize: 11 }}>
          Hints used: {hints} · XP penalty: −{hints * 50}
        </Line>
      )}
    </div>
  );
}

function DaVinciMode({ project, onSave, onBack }) {
  const [what, setWhat] = useState("");
  const [how, setHow] = useState("");
  const [unknown, setUnknown] = useState("");
  const canSave = what.trim().length > 5;

  const textStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${T.border}`,
    color: T.green,
    fontFamily: T.font,
    fontSize: 12,
    padding: "6px 0",
    outline: "none",
    resize: "none",
    marginTop: 4,
    lineHeight: "1.6",
  };

  return (
    <div>
      <div
        style={{
          border: `1px solid ${T.borderBright}`,
          padding: "12px 16px",
          marginBottom: 12,
          boxShadow: `inset 0 0 30px ${T.greenFaint}22`,
        }}
      >
        <Line
          color={T.green}
          style={{ fontSize: 13, letterSpacing: 3, marginBottom: 12 }}
        >
          ✒ DA VINCI SKETCH: {project.name.toUpperCase()}
        </Line>

        {[
          {
            label: "What problem am I solving?",
            val: what,
            set: setWhat,
            rows: 2,
          },
          { label: "How will I approach it?", val: how, set: setHow, rows: 3 },
          {
            label: "What do I NOT know yet?",
            val: unknown,
            set: setUnknown,
            rows: 2,
          },
        ].map((field) => (
          <div key={field.label} style={{ marginBottom: 14 }}>
            <Line dim style={{ fontSize: 11, marginBottom: 2 }}>
              ▸ {field.label}
            </Line>
            <textarea
              value={field.val}
              onChange={(e) => field.set(e.target.value)}
              rows={field.rows}
              placeholder="> start typing..."
              style={{ ...textStyle, "::placeholder": { color: T.muted } }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => canSave && onSave({ what, how, unknown })}
          disabled={!canSave}
          style={{
            fontFamily: T.font,
            fontSize: 12,
            padding: "6px 18px",
            cursor: canSave ? "pointer" : "not-allowed",
            background: canSave ? T.greenFaint : "transparent",
            color: canSave ? T.green : T.muted,
            border: `1px solid ${canSave ? T.greenDim : T.border}`,
            borderRadius: 2,
            opacity: canSave ? 1 : 0.5,
          }}
        >
          ↵ Save sketch (+15 XP) and begin coding
        </button>
        <button
          onClick={onBack}
          style={{
            fontFamily: T.font,
            fontSize: 12,
            padding: "6px 14px",
            cursor: "pointer",
            background: "transparent",
            color: T.muted,
            border: `1px solid ${T.border}`,
            borderRadius: 2,
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

function EurekaScreen({ project, hints, rank, onContinue }) {
  const [show, setShow] = useState(false);
  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
  );
  const bonus = hints === 0 ? 50 : 0;
  const earned = project.xp + bonus;

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div
      style={{
        transition: "opacity 0.4s",
        opacity: show ? 1 : 0,
      }}
    >
      <div
        style={{
          border: `2px solid ${T.green}`,
          padding: "20px 24px",
          background: `radial-gradient(ellipse at center, #0a1e0a 0%, ${T.bg} 70%)`,
          boxShadow: `0 0 40px ${T.greenFaint}66, inset 0 0 40px ${T.greenFaint}22`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: T.font,
            fontSize: 18,
            color: T.green,
            letterSpacing: 8,
            marginBottom: 8,
            textShadow: `0 0 20px ${T.green}`,
          }}
        >
          ✦ E U R E K A ✦
        </div>
        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
            padding: "12px 0",
            margin: "12px 0",
          }}
        >
          <Line color={T.white} style={{ fontSize: 14, marginBottom: 6 }}>
            Project complete:{" "}
            <span style={{ color: T.green }}>{project.name}</span>
          </Line>
          <Line dim style={{ fontSize: 12 }}>
            Hints used: {hints} {hints === 0 ? "· ✦ Pure Run!" : ""}
          </Line>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Line
            color={T.muted}
            style={{ fontSize: 11, marginBottom: 6, letterSpacing: 2 }}
          >
            CONCEPTS MASTERED
          </Line>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {project.concepts.map((c) => (
              <span
                key={c}
                style={{
                  fontFamily: T.font,
                  fontSize: 11,
                  color: T.greenDim,
                  border: `1px solid ${T.greenFaint}`,
                  padding: "2px 8px",
                  borderRadius: 2,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div style={{ margin: "12px 0" }}>
          <Line color={T.amber} style={{ fontSize: 14, marginBottom: 4 }}>
            +{earned} XP gained
            {bonus > 0 ? ` (${project.xp} base + ${bonus} Pure Run)` : ""}
          </Line>
          <Line color={T.green} style={{ fontSize: 12 }}>
            Current rank:{" "}
            <span style={{ color: rank.color }}>⬟ {rank.name}</span>
          </Line>
        </div>

        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            paddingTop: 12,
            marginTop: 12,
          }}
        >
          <Line
            color={T.muted}
            style={{ fontSize: 11, fontStyle: "italic", lineHeight: "1.8" }}
          >
            '{quote.split("—")[0].trim()}'
            <span
              style={{
                color: T.muted,
                display: "block",
                fontSize: 10,
                marginTop: 2,
              }}
            >
              — {quote.split("—")[1]?.trim()}
            </span>
          </Line>
        </div>

        <button
          onClick={onContinue}
          style={{
            marginTop: 16,
            fontFamily: T.font,
            fontSize: 12,
            padding: "7px 24px",
            cursor: "pointer",
            background: T.greenFaint,
            color: T.green,
            border: `1px solid ${T.greenDim}`,
            borderRadius: 2,
          }}
        >
          ↵ Continue
        </button>
      </div>
    </div>
  );
}

function Roadmap({ onBack }) {
  const milestones = [
    {
      id: "foundations",
      label: "Foundations",
      pct: 100,
      concepts: ["variables", "functions", "loops", "conditions"],
    },
    {
      id: "file-io",
      label: "File I/O",
      pct: 100,
      concepts: ["csv", "json", "pathlib", "open/read/write"],
    },
    {
      id: "oop",
      label: "OOP & Classes",
      pct: 60,
      concepts: ["classes", "dataclasses", "inheritance", "dunder methods"],
    },
    {
      id: "apis",
      label: "APIs & HTTP",
      pct: 30,
      concepts: ["httpx", "requests", "JSON", "OAuth"],
    },
    {
      id: "async",
      label: "Async & Concurrency",
      pct: 0,
      concepts: ["asyncio", "await", "threading", "semaphores"],
    },
    {
      id: "databases",
      label: "Databases",
      pct: 0,
      concepts: ["sqlite3", "queries", "schema", "migrations"],
    },
  ];

  return (
    <div>
      <Line
        color={T.green}
        style={{ fontSize: 13, letterSpacing: 2, marginBottom: 16 }}
      >
        ROADMAP PROGRESS
      </Line>
      {milestones.map((m) => (
        <div key={m.id} style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily: T.font,
                fontSize: 12,
                color:
                  m.pct === 100 ? T.greenDim : m.pct > 0 ? T.amber : T.muted,
              }}
            >
              {m.pct === 100 ? "✓" : m.pct > 0 ? "▶" : "○"} {m.label}
            </span>
            <span style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>
              {m.pct}%
            </span>
          </div>
          <ProgressBar
            value={m.pct}
            max={100}
            width={32}
            color={m.pct === 100 ? T.greenDim : T.amber}
          />
          <div style={{ marginTop: 4 }}>
            {m.concepts.map((c) => (
              <span
                key={c}
                style={{
                  fontFamily: T.font,
                  fontSize: 10,
                  color: T.muted,
                  marginRight: 10,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={onBack}
        style={{
          marginTop: 8,
          fontFamily: T.font,
          fontSize: 12,
          padding: "4px 14px",
          cursor: "pointer",
          background: "transparent",
          color: T.muted,
          border: `1px solid ${T.border}`,
          borderRadius: 2,
        }}
      >
        ← Back
      </button>
    </div>
  );
}

function Achievements({ state, onBack }) {
  const rank = getRank(state.xp);
  return (
    <div>
      <Line
        color={T.green}
        style={{ fontSize: 13, letterSpacing: 2, marginBottom: 16 }}
      >
        ACHIEVEMENTS
      </Line>
      <Box title="RANK">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: T.font, fontSize: 28, color: rank.color }}>
            ⬟
          </span>
          <div>
            <Line color={rank.color} style={{ fontSize: 16 }}>
              {rank.name}
            </Line>
            <Line dim style={{ fontSize: 11 }}>
              {state.xp.toLocaleString()} XP · {state.completed.length} projects
              · {state.streak}d streak
            </Line>
          </div>
        </div>
      </Box>
      <Box title="BADGES">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {BADGES.map((b) => {
            const has = state.badges.includes(b.id);
            return (
              <div
                key={b.id}
                style={{
                  padding: "8px 10px",
                  border: `1px solid ${has ? T.borderBright : T.border}`,
                  opacity: has ? 1 : 0.35,
                  borderRadius: 2,
                }}
              >
                <div
                  style={{ fontFamily: T.font, fontSize: 18, marginBottom: 4 }}
                >
                  {b.icon}
                </div>
                <Line color={has ? T.white : T.muted} style={{ fontSize: 12 }}>
                  {b.name}
                </Line>
                <Line dim style={{ fontSize: 10 }}>
                  {b.desc}
                </Line>
                <span
                  style={{
                    fontFamily: T.font,
                    fontSize: 9,
                    color: T.muted,
                    letterSpacing: 1,
                  }}
                >
                  {b.rarity.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </Box>
      <button
        onClick={onBack}
        style={{
          fontFamily: T.font,
          fontSize: 12,
          padding: "4px 14px",
          cursor: "pointer",
          background: "transparent",
          color: T.muted,
          border: `1px solid ${T.border}`,
          borderRadius: 2,
        }}
      >
        ← Back
      </button>
    </div>
  );
}

function Community({ onBack }) {
  const submissions = [
    {
      name: "Smart Git Commit Suggester",
      author: "rustam_k",
      tier: "intermediate",
      completions: 47,
      votes: 89,
    },
    {
      name: "CLI Budget Tracker Pro",
      author: "maya_dev",
      tier: "beginner",
      completions: 134,
      votes: 201,
    },
    {
      name: "Terminal Markdown Viewer",
      author: "aleksei_p",
      tier: "intermediate",
      completions: 23,
      votes: 56,
    },
    {
      name: "Log Diff Analyzer",
      author: "priya_m",
      tier: "advanced",
      completions: 12,
      votes: 38,
    },
  ];
  return (
    <div>
      <Line
        color={T.green}
        style={{ fontSize: 13, letterSpacing: 2, marginBottom: 16 }}
      >
        COMMUNITY HALL
      </Line>
      <Box title="HALL OF FAME">
        {submissions.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "7px 0",
              borderBottom:
                i < submissions.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <span
              style={{
                fontFamily: T.font,
                fontSize: 13,
                color: T.amber,
                width: 28,
              }}
            >
              #{i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <Line style={{ fontSize: 12 }}>
                {s.name} <TierBadge tier={s.tier} />
              </Line>
              <Line dim style={{ fontSize: 10 }}>
                by {s.author} · {s.completions} completions · {s.votes} votes
              </Line>
            </div>
          </div>
        ))}
      </Box>
      <Box title="GUILDS">
        {[
          { name: "Automation Guild", emoji: "⚙", members: 1247 },
          { name: "Data Alchemists", emoji: "⚗", members: 892 },
          { name: "Game Dev Guild", emoji: "🎮", members: 634 },
          { name: "Async Architects", emoji: "⚡", members: 421 },
        ].map((g) => (
          <div
            key={g.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 0",
            }}
          >
            <Line style={{ fontSize: 12 }}>
              {g.emoji} {g.name}
            </Line>
            <Line dim style={{ fontSize: 11 }}>
              {g.members} members
            </Line>
          </div>
        ))}
      </Box>
      <button
        onClick={onBack}
        style={{
          fontFamily: T.font,
          fontSize: 12,
          padding: "4px 14px",
          cursor: "pointer",
          background: "transparent",
          color: T.muted,
          border: `1px solid ${T.border}`,
          borderRadius: 2,
        }}
      >
        ← Back
      </button>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function CodeSprint() {
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const [screen, setScreen] = useState("menu");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [state, setState] = useState({
    xp: 847,
    streak: 5,
    completed: ["directory-cleaner", "cli-journal"],
    badges: ["first-blood", "file-whisperer"],
    inProgress: { id: "hn-reader", tests: 3, sketch: true },
  });
  const [activeProject, setActiveProject] = useState(null);
  const [eurekaData, setEurekaData] = useState(null);

  const [availableProjects, setAvailableProjects] = useState(PROJECTS);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!isAuthenticated || !user) return;
      try {
        const userProjects = await projectsService.getUserProjects(user.id);
        if (userProjects && userProjects.length > 0) {
          setAvailableProjects(
            userProjects.map((p) => ({
              id: p.id.toString(),
              name: p.title || p.name,
              tier: p.difficulty || p.tier,
              concepts: p.concepts || [],
              hours: p.hours || "2-4",
              xp: p.xp_reward || p.xp || 100,
              tests: p.test_cases?.length || p.tests || 5,
              is_completed: p.is_completed || false,
              ...p,
            })),
          );
        }
      } catch (err) {
        console.error("Could not load user projects:", err);
      }
    };

    fetchUserProjects();
  }, [isAuthenticated, user]);

  const nav = (s) => setScreen(s);

  const handleSelectProject = (p) => {
    setActiveProject(p);
    setState((prev) => ({
      ...prev,
      inProgress: {
        id: p.id,
        tests: prev.inProgress?.id === p.id ? prev.inProgress.tests : 0,
        sketch: false,
      },
    }));
    setScreen("project");
  };

  const handleComplete = async (project, hints) => {
    const bonus = hints === 0 ? 50 : 0;
    const xpGain = project.xp + bonus - hints * 50;
    const newXp = state.xp + Math.max(xpGain, 0);
    const newCompleted = [...new Set([...state.completed, project.id])];
    const newBadges = [...state.badges];
    if (newCompleted.length === 1 && !newBadges.includes("first-blood"))
      newBadges.push("first-blood");

    // Persist completion to backend using progress service
    if (isAuthenticated) {
      try {
        await progressService.completeProject(project.id, {
          hints_used: hints,
          xp_gained: Math.max(xpGain, 0),
          completed_at: new Date().toISOString(),
        });
        await refreshUser();
      } catch (err) {
        console.error("Project completion persistence failed:", err);
      }
    }

    setState((prev) => ({
      ...prev,
      xp: newXp,
      completed: newCompleted,
      badges: newBadges,
      inProgress: null,
    }));
    setEurekaData({ project, hints, xp: newXp });
    setScreen("eureka");
  };

  const handleDaVinci = () => {
    setScreen("davinci");
  };

  const handleSketchSave = () => {
    setState((prev) => ({
      ...prev,
      xp: prev.xp + 15,
      inProgress: prev.inProgress
        ? { ...prev.inProgress, sketch: true }
        : prev.inProgress,
    }));
    setScreen("project");
  };

  // Scanline overlay
  const scanlineStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
    pointerEvents: "none",
    borderRadius: 8,
  };

  const titles = {
    menu: "CODESPRINT",
    projects: "SELECT PROJECT",
    project: activeProject?.name?.toUpperCase(),
    davinci: "DA VINCI MODE",
    dashboard: "YOUR DASHBOARD",
    leaderboard: "GLOBAL LEADERBOARD",
    roadmap: "ROADMAP",
    achievements: "ACHIEVEMENTS",
    community: "COMMUNITY",
    eureka: "EUREKA",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: T.font,
      }}
    >
      {/* CRT-like scanlines on page bg */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, #0d180d 0%, #050805 100%)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 620,
          position: "relative",
          zIndex: 1,
          background: T.bg,
          border: `1px solid ${T.borderBright}`,
          borderRadius: 8,
          padding: 20,
          boxShadow: `0 0 60px ${T.greenFaint}33, 0 0 120px ${T.greenFaint}11`,
        }}
      >
        {/* Scanlines */}
        <div style={scanlineStyle} />

        {/* Status bar */}
        {screen !== "menu" && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span
              style={{
                fontFamily: T.font,
                fontSize: 11,
                color: T.muted,
                letterSpacing: 2,
              }}
            >
              CODESPRINT › {titles[screen] || screen.toUpperCase()}
            </span>
            <div style={{ display: "flex", gap: 16 }}>
              <span
                style={{ fontFamily: T.font, fontSize: 11, color: T.amber }}
              >
                ✦ {state.xp} XP
              </span>
              <span
                style={{
                  fontFamily: T.font,
                  fontSize: 11,
                  color: getRank(state.xp).color,
                }}
              >
                {getRank(state.xp).name}
              </span>
            </div>
          </div>
        )}

        {/* Screens */}
        {screen === "menu" && (
          <MainMenu
            state={state}
            onNav={nav}
            user={user}
            isAuthenticated={isAuthenticated}
            onShowAuth={() => setShowAuthModal(true)}
            onLogout={logout}
            availableProjects={availableProjects}
          />
        )}
        {screen === "projects" && (
          <ProjectList
            state={state}
            projects={availableProjects}
            onSelect={handleSelectProject}
            onBack={() => nav("menu")}
          />
        )}
        {screen === "dashboard" && isAuthenticated && (
          <DashboardScreen onBack={() => nav("menu")} />
        )}
        {screen === "leaderboard" && (
          <LeaderboardScreen onBack={() => nav("menu")} />
        )}
        {screen === "project" && activeProject && (
          <ActiveProject
            project={activeProject}
            state={state}
            onComplete={handleComplete}
            onBack={() => nav("projects")}
            onDaVinci={handleDaVinci}
          />
        )}
        {screen === "davinci" && activeProject && (
          <DaVinciMode
            project={activeProject}
            onSave={handleSketchSave}
            onBack={() => nav("project")}
          />
        )}
        {screen === "eureka" && eurekaData && (
          <EurekaScreen
            project={eurekaData.project}
            hints={eurekaData.hints}
            xp={eurekaData.xp}
            rank={getRank(eurekaData.xp)}
            onContinue={() => nav("menu")}
          />
        )}
        {screen === "roadmap" && (
          <Roadmap state={state} onBack={() => nav("menu")} />
        )}
        {screen === "achievements" && (
          <Achievements state={state} onBack={() => nav("menu")} />
        )}
        {screen === "community" && <Community onBack={() => nav("menu")} />}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  );
}
