import { apiCall } from "./apiService.js";

export const statsService = {
  getMyStats: async () => apiCall("/stats/me/stats"),
  getPublicStats: async (userId) => apiCall(`/stats/${userId}/public-stats`),
  getProgressByDifficulty: async () => apiCall("/stats/progress/by-difficulty"),
  getMyBadges: async () => apiCall("/stats/badges/my-badges"),
};
