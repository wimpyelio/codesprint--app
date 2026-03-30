import PropTypes from "prop-types";

import { useAuth } from "../contexts/AuthContext";
import { C } from "../utils/designTokens";
import { Mono, RankBadge } from "../utils/sharedComponents";

export default function NavBar({ screen, setScreen, userStats }) {
  const { user } = useAuth();
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "achievements", label: "Achievements" },
    { id: "community", label: "Community" },
  ];

  const getInitials = (username) =>
    username
      ? username
          .split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  const userRank = userStats?.rank || "Apprentice";
  const userXP = userStats?.total_xp || 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            background: C.cyan,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
        >
          <span
            style={{
              fontFamily: C.mono,
              fontSize: 13,
              color: C.bg,
              fontWeight: "bold",
            }}
          >
            CS
          </span>
        </div>
        <Mono size={14} color={C.white} style={{ letterSpacing: "0.15em" }}>
          CODESPRINT
        </Mono>
        <span
          style={{
            fontFamily: C.mono,
            fontSize: 9,
            color: C.cyan,
            border: `1px solid ${C.cyan}44`,
            padding: "1px 6px",
            borderRadius: 2,
          }}
        >
          v2.0
        </span>
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            style={{
              fontFamily: C.mono,
              fontSize: 11,
              padding: "5px 14px",
              background: screen === tab.id ? `${C.cyan}15` : "transparent",
              color: screen === tab.id ? C.cyan : C.muted,
              border:
                screen === tab.id
                  ? `1px solid ${C.cyan}44`
                  : "1px solid transparent",
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.05em",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "5px 12px",
          border: `1px solid ${C.borderMid}`,
          borderRadius: 3,
          background: C.surfaceAlt,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.cyan}44, ${C.violet}44)`,
            border: `1px solid ${C.borderMid}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mono size={9} color={C.cyan}>
            {getInitials(user?.username)}
          </Mono>
        </div>
        <Mono size={11} color={C.white}>
          {user?.username || "Guest"}
        </Mono>
        <span style={{ width: 1, height: 14, background: C.border }} />
        <Mono size={11} color={C.amber}>
          {userXP.toLocaleString()} XP
        </Mono>
        <Mono size={11} color={C.muted}>
          |
        </Mono>
        <RankBadge rank={userRank} />
      </div>
    </div>
  );
}

NavBar.propTypes = {
  screen: PropTypes.string.isRequired,
  setScreen: PropTypes.func.isRequired,
  userStats: PropTypes.shape({
    rank: PropTypes.string,
    total_xp: PropTypes.number,
  }),
};

NavBar.defaultProps = {
  userStats: null,
};
