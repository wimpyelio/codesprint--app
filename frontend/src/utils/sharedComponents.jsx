import { useState, useEffect } from "react";
import { C, rankBadgeMap, positionStyle } from "./designTokens";

/* ─── ANIMATED XP COUNTER ─────────────────────────────────────────────────── */
export function AnimatedXP({ value }) {
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

/* ─── TEXT COMPONENTS ────────────────────────────────────────────────────── */
export const Mono = ({
  children,
  color = C.white,
  size = 12,
  style = {},
  ...rest
}) => (
  <span
    style={{ fontFamily: C.mono, fontSize: size, color, ...style }}
    {...rest}
  >
    {children}
  </span>
);

export const Label = ({ children, style = {} }) => (
  <div
    style={{
      fontFamily: C.mono,
      fontSize: 10,
      color: C.muted,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Divider = () => (
  <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
);

/* ─── PILL COMPONENTS ────────────────────────────────────────────────────── */
export const TierPill = ({ tier }) => {
  const tierLower = String(tier).toLowerCase();
  const tierColors = {
    beginner: C.jade,
    intermediate: C.amber,
    advanced: C.coral,
    boss: C.violet,
  };
  const c = tierColors[tierLower] || C.muted;
  return (
    <span
      style={{
        fontFamily: C.mono,
        fontSize: 9,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: c,
        border: `1px solid ${c}44`,
        padding: "1px 6px",
        borderRadius: 2,
      }}
    >
      {tierLower}
    </span>
  );
};

export const RarityBadge = ({ rarity }) => {
  const rarityColor = {
    Common: C.mutedMid,
    Uncommon: C.jade,
    Rare: C.cyan,
    Epic: C.violet,
    Legendary: C.amber,
  };
  const c = rarityColor[rarity] || C.muted;
  return (
    <span
      style={{
        fontFamily: C.mono,
        fontSize: 9,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: c,
        border: `1px solid ${c}44`,
        padding: "1px 6px",
        borderRadius: 2,
      }}
    >
      {rarity}
    </span>
  );
};

/* ─── STAT CARD ──────────────────────────────────────────────────────────── */
export const StatCard = ({
  label,
  value,
  sub,
  accent = C.cyan,
  animated = false,
}) => (
  <div
    style={{
      background: C.surfaceAlt,
      border: `1px solid ${C.border}`,
      padding: "14px 16px",
      flex: 1,
      minWidth: 0,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 3,
        height: "100%",
        background: accent,
      }}
    />
    <Label style={{ marginBottom: 6 }}>{label}</Label>
    <div
      style={{
        fontFamily: C.mono,
        fontSize: 22,
        color: accent,
        fontWeight: "bold",
        lineHeight: 1,
      }}
    >
      {animated ? (
        <AnimatedXP value={typeof value === "number" ? value : 0} />
      ) : (
        value
      )}
    </div>
    {sub && (
      <Mono
        color={C.muted}
        size={10}
        style={{ marginTop: 4, display: "block" }}
      >
        {sub}
      </Mono>
    )}
  </div>
);

/* ─── XP BAR ─────────────────────────────────────────────────────────────── */
export function XPBar({ current, min, max, color = C.cyan }) {
  const pct = Math.round(((current - min) / (max - min)) * 100);
  return (
    <div
      style={{
        position: "relative",
        height: 4,
        background: C.border,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: 2,
          boxShadow: `0 0 6px ${color}88`,
          transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

/* ─── RANK BADGE ─────────────────────────────────────────────────────────── */
export function RankBadge({ rank }) {
  const rankInfo = rankBadgeMap[rank] || { c: C.muted, sym: "○" };
  return (
    <span style={{ color: rankInfo.c, fontFamily: C.mono, fontSize: 13 }}>
      {rankInfo.sym} {rank}
    </span>
  );
}

/* ─── POSITION INDICATOR ─────────────────────────────────────────────────── */
export function PositionBadge({ pos }) {
  const style = positionStyle(pos);
  return (
    <Mono
      size={13}
      color={style.color}
      style={{ fontWeight: pos <= 3 ? "bold" : "normal" }}
    >
      {style.text}
    </Mono>
  );
}
