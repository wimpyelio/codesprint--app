import React, { useState, useEffect } from "react";
import { achievementsService } from "../services/achievementsService";
import "./Achievements.css";

export default function Achievements() {
  const [allAchievements, setAllAchievements] = useState({});
  const [userAchievements, setUserAchievements] = useState([]);
  const [achievementProgress, setAchievementProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const [allAch, userAch, progress] = await Promise.all([
          achievementsService.getAllAchievements(),
          achievementsService.getUserAchievements(),
          achievementsService.getAchievementProgress(),
        ]);

        setAllAchievements(allAch);
        setUserAchievements(userAch);
        setAchievementProgress(progress);
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
      <div className="achievements-container">
        <div className="loading">Loading achievements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="achievements-container">
        <div className="error">Error loading achievements: {error}</div>
      </div>
    );
  }

  const earnedBadgeNames = new Set(userAchievements.map((a) => a.badge_name));

  const categories = {
    all: "All Achievements",
    completion: "Completion Milestones",
    xp: "XP Rewards",
    level: "Level Goals",
    special: "Special Achievements",
  };

  const getCategoryByTrigger = (trigger) => {
    if (trigger === "completion_count") return "completion";
    if (trigger === "xp") return "xp";
    if (trigger === "level") return "level";
    return "special";
  };

  const getFilteredAchievements = () => {
    if (selectedCategory === "all") {
      return Object.entries(allAchievements);
    }

    return Object.entries(allAchievements).filter(
      ([name, data]) => getCategoryByTrigger(data.trigger) === selectedCategory
    );
  };

  const filteredAchievements = getFilteredAchievements();
  const earnedCount = userAchievements.length;
  const totalCount = Object.keys(allAchievements).length;
  const completionPercentage = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>🏅 Achievements</h1>
        <p className="subtitle">Unlock badges by completing milestones</p>
      </div>

      {/* Progress Summary */}
      <div className="progress-summary">
        <div className="progress-stat">
          <div className="stat-number">{earnedCount}</div>
          <div className="stat-label">Earned</div>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <small>{completionPercentage}% Complete</small>
        </div>
        <div className="progress-stat">
          <div className="stat-number">{totalCount}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            className={`category-button ${selectedCategory === key ? "active" : ""}`}
            onClick={() => setSelectedCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map(([badgeName, achievement]) => {
            const isEarned = earnedBadgeNames.has(badgeName);
            const progress = achievementProgress[badgeName] || {};

            return (
              <div
                key={badgeName}
                className={`achievement-card ${isEarned ? "earned" : "locked"}`}
              >
                <div className="achievement-header">
                  <div className="badge-icon">{achievement.icon}</div>
                  {isEarned && <div className="earned-badge">✓</div>}
                </div>

                <div className="achievement-content">
                  <h3>{badgeName.replace(/_/g, " ")}</h3>

                  {!isEarned && progress.progress !== undefined && (
                    <div className="progress-mini">
                      <div className="progress-bar-mini">
                        <div
                          className="progress-fill-mini"
                          style={{ width: `${progress.progress}%` }}
                        ></div>
                      </div>
                      <small>{progress.progress}%</small>
                    </div>
                  )}

                  <p className="trigger-info">
                    {achievement.trigger === "completion_count" &&
                      `Complete ${achievement.target_value} projects`}
                    {achievement.trigger === "xp" &&
                      `Earn ${achievement.target_value} XP`}
                    {achievement.trigger === "level" &&
                      `Reach level ${achievement.target_value}`}
                    {achievement.trigger === "manual" && `Special achievement`}
                  </p>

                  {isEarned && userAchievements.find((a) => a.badge_name === badgeName) && (
                    <small className="earned-date">
                      Earned on{" "}
                      {new Date(
                        userAchievements.find((a) => a.badge_name === badgeName)
                          .earned_at
                      ).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-achievements">
            <p>No achievements in this category yet</p>
          </div>
        )}
      </div>

      {/* Motivational Section */}
      <div className="motivation-section">
        <h2>🎯 Next Milestones</h2>
        <div className="next-milestones">
          {Object.entries(achievementProgress)
            .filter(([name, data]) => !data.earned && data.progress > 0)
            .sort((a, b) => b[1].progress - a[1].progress)
            .slice(0, 3)
            .map(([name, data]) => (
              <div key={name} className="milestone">
                <div className="milestone-icon">{data.icon}</div>
                <div className="milestone-info">
                  <strong>{name.replace(/_/g, " ")}</strong>
                  <div className="milestone-bar">
                    <div
                      className="milestone-fill"
                      style={{ width: `${data.progress}%` }}
                    ></div>
                  </div>
                  <small>{data.progress}% - Keep going! 🚀</small>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
