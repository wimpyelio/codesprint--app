/**
 * Leaderboard Service
 * Handles all leaderboard and ranking API calls
 */

const API_BASE = "http://localhost:8000/api";

export const leaderboardService = {
  /**
   * Get global leaderboard sorted by XP
   * @param {number} limit - Max results (default 100)
   * @param {number} offset - Pagination offset
   */
  getGlobalLeaderboard: async (limit = 100, offset = 0) => {
    const response = await fetch(
      `${API_BASE}/leaderboard/global?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) throw new Error("Failed to fetch global leaderboard");
    return response.json();
  },

  /**
   * Get leaderboard with user's nearby ranks
   * @param {number} userId - User ID
   * @param {number} limit - Results per page
   */
  getFriendsLeaderboard: async (userId, limit = 50) => {
    const response = await fetch(
      `${API_BASE}/leaderboard/friends/${userId}?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch friends leaderboard");
    return response.json();
  },

  /**
   * Get weekly XP leaderboard
   */
  getWeeklyLeaderboard: async () => {
    const response = await fetch(`${API_BASE}/leaderboard/weekly`);
    if (!response.ok) throw new Error("Failed to fetch weekly leaderboard");
    return response.json();
  },

  /**
   * Get streak-based leaderboard (placeholder)
   */
  getStreakLeaderboard: async () => {
    const response = await fetch(`${API_BASE}/leaderboard/streak`);
    if (!response.ok) throw new Error("Failed to fetch streak leaderboard");
    return response.json();
  },
};
