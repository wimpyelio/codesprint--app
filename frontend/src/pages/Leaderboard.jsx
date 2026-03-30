import React, { useState, useEffect } from "react";
import { leaderboardService } from "../services/leaderboardService";
import { C, GUILD_COLORS, positionStyle } from "../utils/designTokens";
import { Mono, Label, PositionBadge } from "../utils/sharedComponents";

const GUILDS = [
  { name: "Async Architects", icon: "⚡", color: C.cyan },
  { name: "Data Alchemists", icon: "⚗", color: C.violet },
  { name: "Automation Guild", icon: "⚙", color: C.amber },
  { name: "Game Dev Guild", icon: "◈", color: C.jade },
];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("global");
  const [guildFilter, setGuildFilter] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        let data;

        if (activeTab === "global") {
          data = await leaderboardService.getGlobalLeaderboard(100, 0);
        } else if (activeTab === "weekly") {
          data = await leaderboardService.getWeeklyLeaderboard();
        } else if (activeTab === "streak") {
          data = await leaderboardService.getStreakLeaderboard();
        }

        setLeaderboard(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Mono color={C.muted} size={14}>
          Loading leaderboard...
        </Mono>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Mono color={C.coral} size={14}>
          Error loading leaderboard: {error}
        </Mono>
      </div>
    );
  }

  // Transform backend data to match UI format
  const transformedData = leaderboard.map((user, idx) => ({
    pos: idx + 1,
    handle: user.username || user.email?.split("@")[0] || `User ${idx}`,
    xp: user.xp || 0,
    rank: user.rank || "Apprentice",
    projects: user.completion_count || 0,
    guild: user.guild_name || "Unguilded",
    streak: user.current_streak || 0,
    badge: idx < 3 ? ["⬡", "◈", "◇"][idx] : "▷",
    isMe: user.is_current_user || false,
  }));

  const filtered = guildFilter
    ? transformedData.filter((r) => r.guild === guildFilter)
    : transformedData;

  return (
    <div
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
    >
      {/* Tabs + filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {["global", "weekly", "streak"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t);
                setGuildFilter(null);
              }}
              style={{
                fontFamily: C.mono,
                fontSize: 11,
                padding: "5px 14px",
                cursor: "pointer",
                background: activeTab === t ? `${C.cyan}18` : C.surfaceAlt,
                color: activeTab === t ? C.cyan : C.muted,
                border: `1px solid ${activeTab === t ? C.borderMid : C.border}`,
                borderRadius: 3,
                letterSpacing: "0.06em",
                textTransform: "capitalize",
              }}
            >
              {t === "global"
                ? "⬡ Global"
                : t === "weekly"
                  ? "◈ Weekly"
                  : "▷ Streak"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setGuildFilter(null)}
            style={{
              fontFamily: C.mono,
              fontSize: 10,
              padding: "3px 10px",
              cursor: "pointer",
              background: !guildFilter ? `${C.amber}18` : "transparent",
              color: !guildFilter ? C.amber : C.muted,
              border: `1px solid ${!guildFilter ? C.amberDim : C.border}`,
              borderRadius: 2,
            }}
          >
            All Guilds
          </button>
          {GUILDS.map((g) => (
            <button
              key={g.name}
              onClick={() =>
                setGuildFilter(guildFilter === g.name ? null : g.name)
              }
              style={{
                fontFamily: C.mono,
                fontSize: 10,
                padding: "3px 10px",
                cursor: "pointer",
                background:
                  guildFilter === g.name ? `${g.color}18` : "transparent",
                color: guildFilter === g.name ? g.color : C.muted,
                border: `1px solid ${
                  guildFilter === g.name ? g.color + "66" : C.border
                }`,
                borderRadius: 2,
              }}
            >
              {g.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 90px 70px 60px 60px",
          gap: 8,
          padding: "6px 14px",
          borderBottom: `1px solid ${C.borderMid}`,
        }}
      >
        {[
          "#",
          "Handle",
          activeTab === "streak" ? "Streak" : "XP",
          "Rank",
          "Projects",
          "Guild",
        ].map((h) => (
          <Label key={h}>{h}</Label>
        ))}
      </div>

      {/* Rows */}
      {filtered.map((row) => {
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
              gap: 8,
              padding: "10px 14px",
              background: isMe
                ? `${C.cyan}08`
                : isHov
                  ? C.surfaceAlt
                  : "transparent",
              border: `1px solid ${
                isMe ? C.borderMid : isHov ? C.border : "transparent"
              }`,
              borderRadius: 2,
              cursor: "default",
              transition: "all 0.12s",
              position: "relative",
            }}
          >
            {isMe && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 2,
                  height: "70%",
                  background: C.cyan,
                  borderRadius: 1,
                }}
              />
            )}
            {/* Pos */}
            <PositionBadge pos={row.pos} />
            {/* Handle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {row.badge && (
                <Mono size={11} color={positionStyle(row.pos).color}>
                  {row.badge}
                </Mono>
              )}
              <Mono size={13} color={isMe ? C.cyan : C.white}>
                {row.handle}
              </Mono>
              {isMe && (
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 9,
                    color: C.cyan,
                    border: `1px solid ${C.cyan}44`,
                    padding: "0 4px",
                    borderRadius: 2,
                  }}
                >
                  you
                </span>
              )}
            </div>
            {/* XP or streak */}
            <Mono size={13} color={activeTab === "streak" ? C.jade : C.amber}>
              {activeTab === "streak"
                ? `${row.streak}d`
                : row.xp?.toLocaleString()}
            </Mono>
            {/* Rank */}
            <Mono size={11} color={C.mutedMid}>
              {row.rank || "—"}
            </Mono>
            {/* Projects */}
            <Mono size={12} color={C.mutedMid}>
              {row.projects || "—"}
            </Mono>
            {/* Guild tag */}
            <Mono
              size={10}
              color={GUILDS.find((g) => g.name === row.guild)?.color || C.muted}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {GUILDS.find((g) => g.name === row.guild)?.icon || ""}{" "}
              {row.guild?.split(" ")[0]}
            </Mono>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ padding: 20, textAlign: "center" }}>
          <Mono color={C.muted} size={12}>
            No leaderboard data available
          </Mono>
        </div>
      )}

      {/* Guild standings */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 16,
          marginTop: 4,
        }}
      >
        <Label style={{ marginBottom: 12 }}>Guild XP Standings</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {GUILDS.map((g, i) => (
            <div
              key={g.name}
              style={{
                flex: 1,
                minWidth: 120,
                background: C.surfaceAlt,
                border: `1px solid ${C.border}`,
                padding: "10px 14px",
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Mono size={14} color={g.color}>
                  {g.icon}
                </Mono>
                <Mono size={11} color={C.muted}>
                  #{i + 1}
                </Mono>
              </div>
              <Mono
                size={10}
                color={C.white}
                style={{ display: "block", marginBottom: 4 }}
              >
                {g.name}
              </Mono>
              <Mono size={13} color={g.color} style={{ display: "block" }}>
                {Math.floor(Math.random() * 50000).toLocaleString()} XP
              </Mono>
              <Mono
                size={10}
                color={C.muted}
                style={{ display: "block", marginTop: 2 }}
              >
                {Math.floor(Math.random() * 1000)} members
              </Mono>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
