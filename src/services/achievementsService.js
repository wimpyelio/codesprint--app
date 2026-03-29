/**
 * Achievements Service
 * Handles badge and achievement API calls
 */

const API_BASE = "http://localhost:8000/api";

export const achievementsService = {
  /**
   * Get all possible achievements
   */
  getAllAchievements: async () => {
    const response = await fetch(`${API_BASE}/achievements/`);
    if (!response.ok) throw new Error("Failed to fetch achievements catalog");
    return response.json();
  },

  /**
   * Get current user's earned achievements
   */
  getUserAchievements: async () => {
    const response = await fetch(`${API_BASE}/achievements/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch user achievements");
    return response.json();
  },

  /**
   * Get progress toward all achievements
   * Includes % complete for each milestone
   */
  getAchievementProgress: async () => {
    const response = await fetch(`${API_BASE}/achievements/progress`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok)
      throw new Error("Failed to fetch achievement progress");
    return response.json();
  },
};
