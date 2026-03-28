import React from "react";
import Leaderboard from "./Leaderboard.jsx";

/**
 * LeaderboardScreen - Wrapper component that integrates Leaderboard into CodeSprint
 * Provides back navigation and proper layout handling
 */
export default function LeaderboardScreen({ onBack }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Leaderboard renders full-width within CodeSprint container */}
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
          ← Back to Menu
        </button>
      </div>
      <Leaderboard />
    </div>
  );
}
