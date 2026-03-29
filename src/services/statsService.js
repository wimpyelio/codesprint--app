/**
 * Stats Service
 * Handles user statistics and analytics API calls
 */

const API_BASE = "http://localhost:8000/api";

export const statsService = {
  /**
   * Get current user's comprehensive statistics
   */
  getMyStats: async () => {
    const response = await fetch(`${API_BASE}/stats/me/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch user stats");
    return response.json();
  },

  /**
   * Get public profile stats for another user
   * @param {number} userId - User ID
   */
  getPublicStats: async (userId) => {
    const response = await fetch(`${API_BASE}/stats/${userId}/public-stats`);
    if (!response.ok) throw new Error("Failed to fetch public stats");
    return response.json();
  },

  /**
   * Get completion breakdown by project difficulty
   */
  getProgressByDifficulty: async () => {
    const response = await fetch(
      `${API_BASE}/stats/progress/by-difficulty`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok)
      throw new Error("Failed to fetch progress by difficulty");
    return response.json();
  },

  /**
   * Get user's earned badges
   */
  getMyBadges: async () => {
    const response = await fetch(`${API_BASE}/stats/badges/my-badges`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch badges");
    return response.json();
  },
};
