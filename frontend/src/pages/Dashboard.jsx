import React, { useState, useEffect } from "react";
import { statsService } from "../services/statsService";
import { achievementsService } from "../services/achievementsService";
import { projectsService } from "../services/projectsService";
import { C } from "../utils/designTokens";
import {
  Mono,
  Label,
  StatCard,
  XPBar,
  RankBadge,
  AnimatedXP,
  TierPill,
  Divider,
} from "../utils/sharedComponents";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, achievementsData, projectsData] = await Promise.all([
          statsService.getMyStats(),
          achievementsService.getUserAchievements(),
          projectsService.getRecentProjects(),
        ]);
        setStats(statsData);
        setAchievements(achievementsData);
        setRecentProjects(projectsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Mono color={C.muted} size={14}>
          Loading your stats...
        </Mono>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Mono color={C.coral} size={14}>
          Error loading dashboard: {error}
        </Mono>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Mono color={C.muted} size={14}>
          No stats available
        </Mono>
      </div>
    );
  }

  const rankXp = stats.xp_for_current_rank || 0;
  const nextXp = stats.xp_for_next_rank || rankXp + 1000;
  const currentXp = stats.total_xp || 0;
  const xpProgress = Math.round(
    ((currentXp - rankXp) / (nextXp - rankXp)) * 100,
  );

  const difficultyBreakdown = [
    {
      tier: "Beginner",
      count: stats.beginner_completed || 0,
      color: C.jade,
    },
    {
      tier: "Intermediate",
      count: stats.intermediate_completed || 0,
      color: C.amber,
    },
    {
      tier: "Advanced",
      count: stats.advanced_completed || 0,
      color: C.coral,
    },
  ];

  const totalProjects =
    difficultyBreakdown.reduce((sum, d) => sum + d.count, 0) || 1;
  const diffPercents = difficultyBreakdown.map((d) => ({
    ...d,
    pct: Math.round((d.count / totalProjects) * 100),
  }));

  return (
    <div
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
    >
      {/* Hero rank card */}
      <div
        style={{
          background: C.surfaceAlt,
          border: `1px solid ${C.borderMid}`,
          padding: "20px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.cyan}0a 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <Label style={{ marginBottom: 6 }}>Current Rank</Label>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: 26,
                color: C.amber,
                letterSpacing: "0.05em",
              }}
            >
              ◈ {stats?.rank || "Apprentice"}
            </div>
            <Mono
              size={11}
              color={C.muted}
              style={{ display: "block", marginTop: 4 }}
            >
              Guild:{" "}
              <span style={{ color: C.cyan }}>
                {stats?.guild_name || "Unguilded"}
              </span>
            </Mono>
          </div>
          <div style={{ textAlign: "right" }}>
            <Label style={{ marginBottom: 6 }}>Total XP</Label>
            <div style={{ fontFamily: C.mono, fontSize: 28, color: C.cyan }}>
              <AnimatedXP value={currentXp} />
            </div>
            <Mono
              size={10}
              color={C.muted}
              style={{ display: "block", marginTop: 4 }}
            >
              Level {stats?.current_level || 1} · {stats?.rank_position || "—"}{" "}
              global
            </Mono>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Mono size={10} color={C.muted}>
              {stats?.rank || "Apprentice"} · {rankXp.toLocaleString()} XP
            </Mono>
            <Mono size={10} color={C.muted}>
              Next · {nextXp.toLocaleString()} XP
            </Mono>
          </div>
          <XPBar current={currentXp} min={rankXp} max={nextXp} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Mono size={10} color={C.cyan}>
              {xpProgress}% to next rank
            </Mono>
            <Mono size={10} color={C.muted}>
              {Math.max(0, nextXp - currentXp).toLocaleString()} XP remaining
            </Mono>
          </div>
        </div>
      </div>

      {/* Stat cards row */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard
          label="Projects Completed"
          value={stats?.projects_completed || 0}
          sub={`of ${stats?.total_projects || 30} available`}
          accent={C.cyan}
        />
        <StatCard
          label="Current Streak"
          value={`${stats?.current_streak || 0}d`}
          sub={`Best: ${stats?.best_streak || 0}d`}
          accent={C.amber}
        />
        <StatCard
          label="Badges Earned"
          value={achievements?.length || 0}
          sub={`of ${stats?.total_badges || 14} total`}
          accent={C.violet}
        />
        <StatCard
          label="Accuracy"
          value={`${Math.round(stats?.accuracy_percent || 0)}%`}
          sub={`Hints used: ${stats?.total_hints_used || 0}`}
          accent={C.jade}
        />
      </div>

      {/* Two-column: recent + difficulty */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Recent completions */}
        <div
          style={{
            flex: 2,
            minWidth: 260,
            background: C.surfaceAlt,
            border: `1px solid ${C.border}`,
            padding: "14px 16px",
          }}
        >
          <Label style={{ marginBottom: 10 }}>Recent Completions</Label>
          {recentProjects.length > 0 ? (
            recentProjects.slice(0, 5).map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom:
                    i < Math.min(5, recentProjects.length) - 1
                      ? `1px solid ${C.border}`
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background:
                      !r.hints_used || r.hints_used === 0
                        ? `${C.jade}15`
                        : C.surfaceAlt,
                    border: `1px solid ${
                      !r.hints_used || r.hints_used === 0 ? C.jade : C.border
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                >
                  <Mono
                    size={11}
                    color={
                      !r.hints_used || r.hints_used === 0 ? C.jade : C.muted
                    }
                  >
                    ✓
                  </Mono>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Mono
                    size={12}
                    color={C.white}
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.project_name}
                  </Mono>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <TierPill tier={r.tier} />
                    {!r.hints_used && (
                      <Mono size={9} color={C.jade}>
                        ◇ Pure Run
                      </Mono>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <Mono size={12} color={C.amber} style={{ display: "block" }}>
                    +{r.xp_earned || 0}
                  </Mono>
                  <Mono size={10} color={C.muted}>
                    {r.completed_days_ago || "today"}
                  </Mono>
                </div>
              </div>
            ))
          ) : (
            <Mono size={11} color={C.muted}>
              No recent projects yet
            </Mono>
          )}
        </div>

        {/* Difficulty + weekly XP */}
        <div
          style={{
            flex: 1,
            minWidth: 180,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              padding: "14px 16px",
            }}
          >
            <Label style={{ marginBottom: 12 }}>By Difficulty</Label>
            {diffPercents.map((d) => (
              <div key={d.tier} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <TierPill tier={d.tier.toLowerCase()} />
                  <Mono size={11} color={d.color}>
                    {d.count} projects
                  </Mono>
                </div>
                <div
                  style={{
                    height: 3,
                    background: C.border,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${d.pct}%`,
                      background: d.color,
                      boxShadow: `0 0 4px ${d.color}88`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              padding: "14px 16px",
            }}
          >
            <Label style={{ marginBottom: 10 }}>This Week</Label>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: 24,
                color: C.cyan,
              }}
            >
              {stats?.weekly_xp || 0}
            </div>
            <Mono
              size={10}
              color={C.jade}
              style={{ display: "block", marginTop: 4 }}
            >
              ▲ +{Math.round(stats?.weekly_xp_change || 0)}% vs last week
            </Mono>
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Label>Projects</Label>
                <Mono size={14} color={C.white}>
                  {stats?.projects_this_week || 0}
                </Mono>
              </div>
              <div style={{ textAlign: "right" }}>
                <Label>Hints Used</Label>
                <Mono size={14} color={C.coral}>
                  {stats?.hints_this_week || 0}
                </Mono>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
