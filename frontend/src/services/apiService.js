const DEFAULT_API_BASE_URL = "http://localhost:8000/api";

const getApiBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const getAuthToken = () => localStorage.getItem("token");

const buildHeaders = (includeAuth = true, extraHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const parseResponse = async (response) => {
  const isJson = response.headers
    .get("content-type")
    ?.toLowerCase()
    .includes("application/json");
  if (!isJson) {
    return null;
  }
  return response.json();
};

export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    headers: buildHeaders(options.includeAuth !== false, options.headers),
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const message =
      payload?.detail || `Request failed (${response.status} ${response.statusText})`;
    throw new Error(message);
  }

  return payload;
};

export const API_BASE_URL = getApiBaseUrl();
