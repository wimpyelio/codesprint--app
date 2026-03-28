import { apiCall } from './api.js';

// Authentication API calls
export const authService = {
  // Register a new user
  register: async (userData) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false, // No auth needed for registration
    });
  },

  // Login user
  login: async (credentials) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false, // No auth needed for login
    });

    // Store token in localStorage
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
    }

    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token; // Return true if token exists
  },

  // Get current user profile
  getCurrentUser: async () => {
    return await apiCall('/users/me');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await apiCall('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};