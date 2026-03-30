/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────── */
export const C = {
  bg: "#050508",
  surface: "#09090f",
  surfaceAlt: "#0d0d16",
  border: "rgba(0,229,255,0.10)",
  borderMid: "rgba(0,229,255,0.22)",
  borderHot: "rgba(0,229,255,0.50)",
  cyan: "#00e5ff",
  cyanDim: "#00b8cc",
  cyanFaint: "rgba(0,229,255,0.06)",
  amber: "#ffb300",
  amberDim: "#cc8f00",
  amberFaint: "rgba(255,179,0,0.08)",
  coral: "#ff4060",
  coralFaint: "rgba(255,64,96,0.08)",
  violet: "#9f7aea",
  jade: "#10b981",
  white: "#e8eaf0",
  muted: "#4a5080",
  mutedMid: "#6b7299",
  mono: "'Courier New', 'Lucida Console', monospace",
  sans: "'Courier New', monospace",
};

export const GUILD_COLORS = {
  "Async Architects": C.cyan,
  "Data Alchemists": C.violet,
  "Automation Guild": C.amber,
  "Game Dev Guild": C.jade,
};

export const rarityColor = {
  Common: C.mutedMid,
  Uncommon: C.jade,
  Rare: C.cyan,
  Epic: C.violet,
  Legendary: C.amber,
};

export const tierMap = {
  beginner: C.jade,
  intermediate: C.amber,
  advanced: C.coral,
  boss: C.violet,
};

export const rankBadgeMap = {
  Curious: { c: C.muted, sym: "○" },
  Tinkerer: { c: C.jade, sym: "▷" },
  Apprentice: { c: C.cyan, sym: "◇" },
  Journeyman: { c: C.amber, sym: "◈" },
  Craftsperson: { c: C.violet, sym: "◈" },
  Architect: { c: C.coral, sym: "⬡" },
  Maestro: { c: "#f9a8d4", sym: "⬟" },
};

export const positionStyle = (pos) => {
  if (pos === 1) return { color: C.amber, text: "#1" };
  if (pos === 2) return { color: "#94a3b8", text: "#2" };
  if (pos === 3) return { color: "#b45309", text: "#3" };
  return { color: C.muted, text: `#${pos}` };
};
