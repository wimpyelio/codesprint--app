import { apiCall } from "./apiService.js";

export const achievementsService = {
  getAllAchievements: async () =>
    apiCall("/achievements/", { includeAuth: false }),
  getUserAchievements: async () => apiCall("/achievements/user"),
  getAchievementProgress: async () => apiCall("/achievements/progress"),
};
