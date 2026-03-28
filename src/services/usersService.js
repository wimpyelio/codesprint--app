import { apiCall } from './api.js';

// Users API calls
export const usersService = {
  // Get user profile
  getUserProfile: async (userId) => {
    return await apiCall(`/users/${userId}`);
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    return await apiCall('/users/me');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await apiCall('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Get user achievements
  getUserAchievements: async (userId) => {
    return await apiCall(`/users/${userId}/achievements`);
  },

  // Add achievement to user
  addAchievement: async (userId, achievementData) => {
    return await apiCall(`/users/${userId}/achievements`, {
      method: 'POST',
      body: JSON.stringify(achievementData),
    });
  },

  // Get user statistics
  getUserStats: async (userId) => {
    return await apiCall(`/users/${userId}/stats`);
  },

  // Get user's projects
  getUserProjects: async (userId) => {
    return await apiCall(`/users/${userId}/projects`);
  },
};