import PropTypes from "prop-types";

import Leaderboard from "../pages/Leaderboard.jsx";

export default function LeaderboardScreen({ onBack }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "12px",
            padding: "6px 14px",
            cursor: "pointer",
            background: "transparent",
            color: "#4ade80",
            border: "1px solid #2a4a2a",
            borderRadius: "2px",
            marginBottom: "1rem",
          }}
        >
          Back to Menu
        </button>
      </div>
      <Leaderboard />
    </div>
  );
}

LeaderboardScreen.propTypes = {
  onBack: PropTypes.func.isRequired,
};
