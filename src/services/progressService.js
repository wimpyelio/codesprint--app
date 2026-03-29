import { apiCall } from "./api.js";

export const progressService = {
  getMyProgress: async () => {
    return await apiCall("/progress/");
  },

  startProject: async (projectId) => {
    return await apiCall(`/progress/${projectId}/start`, {
      method: "POST",
    });
  },

  completeProject: async (projectId, progressPayload) => {
    return await apiCall(`/progress/${projectId}/complete`, {
      method: "POST",
      body: JSON.stringify(progressPayload),
    });
  },
};
