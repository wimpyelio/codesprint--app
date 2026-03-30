import { apiCall } from "./apiService.js";

export const leaderboardService = {
  getGlobalLeaderboard: async (limit = 100, offset = 0) =>
    apiCall(`/leaderboard/global?limit=${limit}&offset=${offset}`, {
      includeAuth: false,
    }),
  getFriendsLeaderboard: async (userId, limit = 50) =>
    apiCall(`/leaderboard/friends/${userId}?limit=${limit}`),
  getWeeklyLeaderboard: async () =>
    apiCall("/leaderboard/weekly", { includeAuth: false }),
  getStreakLeaderboard: async () =>
    apiCall("/leaderboard/streak", { includeAuth: false }),
};
