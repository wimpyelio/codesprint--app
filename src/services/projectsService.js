import { apiCall } from './api.js';

// Projects API calls
export const projectsService = {
  // Get all projects
  getAllProjects: async (skip = 0, limit = 10) => {
    return await apiCall(`/projects/?skip=${skip}&limit=${limit}`);
  },

  // Get a specific project
  getProject: async (projectId) => {
    return await apiCall(`/projects/${projectId}`);
  },

  // Create a new project
  createProject: async (projectData) => {
    return await apiCall('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // Update a project
  updateProject: async (projectId, projectData) => {
    return await apiCall(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  // Delete a project
  deleteProject: async (projectId) => {
    return await apiCall(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  },

  // Add test case to project
  addTestCase: async (projectId, testCaseData) => {
    return await apiCall(`/projects/${projectId}/test-cases`, {
      method: 'POST',
      body: JSON.stringify(testCaseData),
    });
  },

  // Get user's projects
  getUserProjects: async (userId) => {
    return await apiCall(`/users/${userId}/projects`);
  },
};