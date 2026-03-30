import React, { useState, useEffect } from "react";
import { achievementsService } from "../services/achievementsService";
import { C } from "../utils/designTokens";
import { Mono, Label, StatCard, RarityBadge } from "../utils/sharedComponents";

export default function Achievements() {
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catFilter, setCatFilter] = useState("All");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const [allAch, userAch] = await Promise.all([
          achievementsService.getAllAchievements(),
          achievementsService.getUserAchievements(),
        ]);

        setAllAchievements(
          Array.isArray(allAch) ? allAch : Object.values(allAch || {}),
        );
        setUserAchievements(userAch || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Mono color={C.muted} size={14}>
          Loading achievements...
        </Mono>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Mono color={C.coral} size={14}>
          Error loading achievements: {error}
        </Mono>
      </div>
    );
  }

  const cats = ["All", "Milestone", "Craft", "Community", "Streak"];
  const earnedSet = new Set(userAchievements.map((a) => a.badge_id || a.id));

  const filtered =
    catFilter === "All"
      ? allAchievements
      : allAchievements.filter((b) => b.category === catFilter);

  const earned = userAchievements.length;
  const total = allAchievements.length;

  const rarityColor = {
    Common: C.mutedMid,
    Uncommon: C.jade,
    Rare: C.cyan,
    Epic: C.violet,
    Legendary: C.amber,
  };

  return (
    <div
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
    >
      {/* Progress summary */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard
          label="Badges Earned"
          value={earned}
          sub={`of ${total} total`}
          accent={C.violet}
        />
        <StatCard
          label="Completion"
          value={`${Math.round((earned / Math.max(total, 1)) * 100)}%`}
          sub="badge catalog"
          accent={C.cyan}
        />
        <StatCard
          label="Rarest Earned"
          value="Rare"
          sub="Pure Runner"
          accent={C.amber}
        />
      </div>

      {/* Catalog filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            style={{
              fontFamily: C.mono,
              fontSize: 10,
              padding: "4px 12px",
              cursor: "pointer",
              background: catFilter === c ? `${C.violet}18` : "transparent",
              color: catFilter === c ? C.violet : C.muted,
              border: `1px solid ${
                catFilter === c ? C.violet + "55" : C.border
              }`,
              borderRadius: 2,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))",
          gap: 10,
        }}
      >
        {filtered.map((b) => {
          const has = earnedSet.has(b.id || b.badge_id);
          const rc = rarityColor[b.rarity] || C.muted;
          return (
            <div
              key={b.id || b.badge_id}
              style={{
                background: has ? C.surfaceAlt : C.surface,
                border: `1px solid ${has ? rc + "44" : C.border}`,
                padding: "14px 14px",
                borderRadius: 2,
                opacity: has ? 1 : 0.45,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.15s",
              }}
            >
              {has && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    borderLeft: "24px solid transparent",
                    borderTop: `24px solid ${rc}44`,
                  }}
                />
              )}
              <div
                style={{
                  fontFamily: C.mono,
                  fontSize: 22,
                  marginBottom: 8,
                  color: has ? rc : C.muted,
                }}
              >
                {b.icon}
              </div>
              <Mono
                size={12}
                color={has ? C.white : C.muted}
                style={{
                  display: "block",
                  marginBottom: 3,
                  fontWeight: "bold",
                }}
              >
                {b.name}
              </Mono>
              <Mono
                size={10}
                color={C.muted}
                style={{ display: "block", marginBottom: 8, lineHeight: 1.5 }}
              >
                {b.description}
              </Mono>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 9,
                    color: rc,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {b.rarity}
                </span>
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 9,
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {b.category}
                </span>
              </div>
              {has && (
                <div
                  style={{
                    marginTop: 6,
                    height: 2,
                    background: rc,
                    borderRadius: 1,
                    boxShadow: `0 0 4px ${rc}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
