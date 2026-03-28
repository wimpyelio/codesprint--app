import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { statsService } from "../services/statsService";
import { achievementsService } from "../services/achievementsService";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, achievementsData] = await Promise.all([
          statsService.getMyStats(),
          achievementsService.getUserAchievements(),
        ]);
        setStats(statsData);
        setAchievements(achievementsData);
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
      <div className="dashboard-container">
        <div className="loading">Loading your stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">Error loading dashboard: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-container">
        <div className="error">No stats available</div>
      </div>
    );
  }

  // Calculate XP progress to next level
  const xpProgress = (stats.xp_to_next_level / 1000) * 100;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👤 Your Progress</h1>
        <p className="welcome-text">Welcome back, {user?.username}!</p>
      </div>

      {/* XP and Level Stats */}
      <div className="stats-grid">
        <div className="stat-card level-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Level</h3>
            <div className="stat-value">{stats.current_level}</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${100 - xpProgress}%` }}
              ></div>
            </div>
            <small>
              {stats.total_xp} / {stats.next_level_xp} XP
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Total XP</h3>
            <div className="stat-value">{stats.total_xp}</div>
            <small>Earned from projects</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Projects Done</h3>
            <div className="stat-value">
              {stats.projects_completed}/{stats.projects_total}
            </div>
            <small>{Math.round(stats.completion_rate)}% completion rate</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>Badges</h3>
            <div className="stat-value">{stats.badges_earned}</div>
            <small>Achievements unlocked</small>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h2>📊 Performance</h2>
        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Avg Hints Used:</span>
            <span className="metric-value">
              {stats.average_hints_per_project.toFixed(1)}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Current Streak:</span>
            <span className="metric-value">{stats.current_streak} days 🔥</span>
          </div>
          <div className="metric">
            <span className="metric-label">Last Completed:</span>
            <span className="metric-value">
              {stats.last_completed_date
                ? new Date(stats.last_completed_date).toLocaleDateString()
                : "Not started"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Completions */}
      {stats.recent_completions && stats.recent_completions.length > 0 && (
        <div className="recent-section">
          <h2>🎮 Recent Completions</h2>
          <div className="recent-list">
            {stats.recent_completions.map((completion, idx) => (
              <div key={idx} className="recent-item">
                <div className="recent-info">
                  <span className="project-id">
                    Project #{completion.project_id}
                  </span>
                  <span className="completion-date">
                    {new Date(completion.completed_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="recent-stats">
                  <span className="xp-earned">+{completion.xp_earned} XP</span>
                  <span className="hints-used">
                    {completion.hints_used} hints
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="achievements-section">
          <h2>🏅 Achievements Unlocked</h2>
          <div className="badges-container">
            {achievements.map((badge, idx) => (
              <div key={idx} className="badge-item" title={badge.badge_name}>
                <div className="badge-icon">{badge.badge_icon}</div>
                <small>{badge.badge_name.replace(/_/g, " ")}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="no-achievements">
          <p>🎯 Complete projects to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}
