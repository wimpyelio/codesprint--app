import React, { useState, useEffect } from "react";
import { leaderboardService } from "../services/leaderboardService";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("global");

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

        setLeaderboard(data);
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
      <div className="leaderboard-container">
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error">Error loading leaderboard: {error}</div>
      </div>
    );
  }

  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Global Leaderboard</h1>
        <p className="subtitle">Compete with learners worldwide</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "global" ? "active" : ""}`}
          onClick={() => setActiveTab("global")}
        >
          🌍 All Time
        </button>
        <button
          className={`tab-button ${activeTab === "weekly" ? "active" : ""}`}
          onClick={() => setActiveTab("weekly")}
        >
          📅 This Week
        </button>
        <button
          className={`tab-button ${activeTab === "streak" ? "active" : ""}`}
          onClick={() => setActiveTab("streak")}
        >
          🔥 Streak
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-table">
        <div className="table-header">
          <div className="col-rank">Rank</div>
          <div className="col-user">User</div>
          <div className="col-level">Level</div>
          <div className="col-xp">XP</div>
          <div className="col-projects">Projects</div>
          <div className="col-hints">Avg Hints</div>
        </div>

        <div className="table-body">
          {leaderboard.length > 0 ? (
            leaderboard.map((user, idx) => (
              <div
                key={user.id}
                className={`table-row ${[1, 2, 3].includes(user.rank) ? "top-rank" : ""}`}
              >
                <div className="col-rank medal">
                  <span className="medal-emoji">{getMedalEmoji(user.rank)}</span>
                </div>
                <div className="col-user">
                  <div className="user-info">
                    <div className="user-name">
                      {user.username || user.email.split("@")[0]}
                    </div>
                    <small className="user-title">{user.full_name}</small>
                  </div>
                </div>
                <div className="col-level">
                  <span className="level-badge">Lv {user.level}</span>
                </div>
                <div className="col-xp">
                  <strong>{user.xp}</strong>
                </div>
                <div className="col-projects">
                  <span>{user.completion_count}</span>
                </div>
                <div className="col-hints">
                  <span>{user.average_hints.toFixed(1)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No users found</div>
          )}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="leaderboard-footer">
        <div className="footer-stat">
          <span className="stat-label">Total Players:</span>
          <span className="stat-value">{leaderboard.length}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Top XP:</span>
          <span className="stat-value">
            {leaderboard.length > 0 ? leaderboard[0].xp : 0}
          </span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Avg XP:</span>
          <span className="stat-value">
            {leaderboard.length > 0
              ? Math.round(
                  leaderboard.reduce((sum, u) => sum + u.xp, 0) /
                    leaderboard.length
                )
              : 0}
          </span>
        </div>
      </div>
    </div>
  );
}
