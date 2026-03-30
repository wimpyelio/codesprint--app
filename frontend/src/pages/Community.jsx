import React, { useState, useEffect } from "react";
import { C } from "../utils/designTokens";
import { Mono, Label, Divider, TierPill } from "../utils/sharedComponents";

const FEED = [
  {
    time: "2m",
    handle: "priya_m",
    event: "completed",
    detail: "Async Web Scraper",
    xp: "+500 XP",
    color: C.jade,
  },
  {
    time: "5m",
    handle: "axel_codes",
    event: "earned",
    detail: "Concurrency Wizard badge",
    xp: "",
    color: C.violet,
  },
  {
    time: "9m",
    handle: "rustam_k",
    event: "completed",
    detail: "GitHub Repo Analyzer",
    xp: "+250 XP",
    color: C.jade,
  },
  {
    time: "14m",
    handle: "lena_x",
    event: "joined",
    detail: "Automation Guild",
    xp: "",
    color: C.amber,
  },
  {
    time: "18m",
    handle: "dev_user",
    event: "completed",
    detail: "Weather Dashboard",
    xp: "+250 XP",
    color: C.cyan,
  },
  {
    time: "22m",
    handle: "maya_dev",
    event: "earned",
    detail: "Pure Runner badge",
    xp: "",
    color: C.violet,
  },
];

const HALL_OF_FAME = [
  {
    rank: 1,
    name: "CLI Budget Tracker Pro",
    author: "maya_dev",
    tier: "beginner",
    completions: 134,
    votes: 201,
  },
  {
    rank: 2,
    name: "Smart Git Commit Suggester",
    author: "rustam_k",
    tier: "intermediate",
    completions: 47,
    votes: 89,
  },
  {
    rank: 3,
    name: "Terminal Markdown Viewer",
    author: "aleksei_p",
    tier: "intermediate",
    completions: 23,
    votes: 56,
  },
  {
    rank: 4,
    name: "Log Diff Analyzer",
    author: "priya_m",
    tier: "advanced",
    completions: 12,
    votes: 38,
  },
];

const GUILDS = [
  {
    name: "Async Architects",
    icon: "⚡",
    color: C.cyan,
    xp: 48200,
    members: 421,
  },
  {
    name: "Data Alchemists",
    icon: "⚗",
    color: C.violet,
    xp: 42800,
    members: 892,
  },
  {
    name: "Automation Guild",
    icon: "⚙",
    color: C.amber,
    xp: 38600,
    members: 1247,
  },
  { name: "Game Dev Guild", icon: "◈", color: C.jade, xp: 21400, members: 634 },
];

export default function Community() {
  const [feedItems] = useState(FEED);
  const [challengeSeconds, setChallengeSeconds] = useState(58340);

  useEffect(() => {
    const t = setInterval(
      () => setChallengeSeconds((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(challengeSeconds / 3600);
  const m = Math.floor((challengeSeconds % 3600) / 60);
  const s = challengeSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
    >
      {/* Weekly challenge banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.surfaceAlt}, #0d0a18)`,
          border: `1px solid ${C.violet}44`,
          padding: "16px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -30,
            top: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.violet}18 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 6,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: 9,
                  color: C.violet,
                  border: `1px solid ${C.violet}55`,
                  padding: "1px 8px",
                  borderRadius: 2,
                  letterSpacing: "0.1em",
                }}
              >
                WEEKLY CHALLENGE
              </span>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.amber }}>
                ⚡ Async Architects
              </span>
            </div>
            <Mono
              size={15}
              color={C.white}
              style={{ display: "block", marginBottom: 4 }}
            >
              Build a CLI tool that saves you real time this week
            </Mono>
            <Mono size={11} color={C.muted}>
              Open-ended · Judged by completions + community votes · 3
              submissions so far
            </Mono>
          </div>
          <div style={{ textAlign: "right" }}>
            <Label style={{ marginBottom: 4 }}>Time Remaining</Label>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: 20,
                color: C.coral,
                letterSpacing: "0.1em",
              }}
            >
              {pad(h)}:{pad(m)}:{pad(s)}
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: feed + top submissions */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Live activity feed */}
        <div
          style={{
            flex: 1,
            minWidth: 260,
            background: C.surfaceAlt,
            border: `1px solid ${C.border}`,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Label>Live Activity</Label>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.jade,
                boxShadow: `0 0 6px ${C.jade}`,
              }}
            />
          </div>
          {feedItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "7px 0",
                borderBottom:
                  i < feedItems.length - 1 ? `1px solid ${C.border}` : "none",
                alignItems: "flex-start",
              }}
            >
              <Mono
                size={10}
                color={C.muted}
                style={{ width: 22, flexShrink: 0, marginTop: 1 }}
              >
                {item.time}
              </Mono>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{ fontFamily: C.mono, fontSize: 11, color: C.cyan }}
                >
                  {item.handle}
                </span>
                <span
                  style={{ fontFamily: C.mono, fontSize: 11, color: C.muted }}
                >
                  {" "}
                  {item.event}{" "}
                </span>
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 11,
                    color: item.color,
                  }}
                >
                  {item.detail}
                </span>
                {item.xp && (
                  <span
                    style={{
                      fontFamily: C.mono,
                      fontSize: 10,
                      color: C.amber,
                      marginLeft: 6,
                    }}
                  >
                    {item.xp}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Hall of Fame */}
        <div
          style={{
            flex: 1,
            minWidth: 220,
            background: C.surfaceAlt,
            border: `1px solid ${C.border}`,
            padding: "14px 16px",
          }}
        >
          <Label style={{ marginBottom: 10 }}>Hall of Fame</Label>
          {HALL_OF_FAME.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                gap: 10,
                padding: "8px 0",
                borderBottom: item.rank < 4 ? `1px solid ${C.border}` : "none",
              }}
            >
              <Mono
                size={13}
                color={item.rank <= 3 ? C.amber : C.muted}
                style={{ width: 20, flexShrink: 0 }}
              >
                {item.rank <= 3
                  ? ["①", "②", "③"][item.rank - 1]
                  : `#${item.rank}`}
              </Mono>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Mono
                    size={12}
                    color={C.white}
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 160,
                    }}
                  >
                    {item.name}
                  </Mono>
                  <TierPill tier={item.tier} />
                </div>
                <Mono
                  size={10}
                  color={C.muted}
                  style={{ display: "block", marginTop: 2 }}
                >
                  {item.author} · {item.completions} completions · {item.votes}{" "}
                  votes
                </Mono>
              </div>
            </div>
          ))}

          <Divider />
          <Label style={{ marginBottom: 10 }}>Guild Standings</Label>
          {GUILDS.map((g, i) => (
            <div
              key={g.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 0",
                borderBottom:
                  i < GUILDS.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mono size={13} color={g.color}>
                  {g.icon}
                </Mono>
                <Mono size={11} color={C.white}>
                  {g.name}
                </Mono>
              </div>
              <Mono size={11} color={C.muted}>
                {g.xp.toLocaleString()} XP
              </Mono>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
