const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper function to get auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(
        `API call failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API call error:", error);
    return null;
  }
}

// Authentication API functions
export const register = async (userData) => {
  const response = await apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  // Store token if registration successful
  if (response.token) {
    localStorage.setItem("authToken", response.token);
  }

  return response;
};

export const login = async (credentials) => {
  const response = await apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Store token if login successful
  if (response.token) {
    localStorage.setItem("authToken", response.token);
  }

  return response;
};

export const logout = async () => {
  const response = await apiCall("/auth/logout", {
    method: "POST",
  });

  // Remove token from localStorage
  localStorage.removeItem("authToken");

  return response;
};

export const getProfile = () => apiCall("/auth/profile");

// API functions
export const getAllBeans = () => apiCall("/beans");

export const getBeansOfTheDay = () => apiCall("/beans/botd", {}, true);

export const searchBeans = (query) =>
  apiCall(`/beans/search?q=${encodeURIComponent(query)}`);

export const getBeanById = (id) => apiCall(`/beans/${id}`);

export const addBean = (beanData) =>
  apiCall("/beans", {
    method: "POST",
    body: JSON.stringify(beanData),
  });

export const updateBean = (id, beanData) =>
  apiCall(`/beans/${id}`, {
    method: "PUT",
    body: JSON.stringify(beanData),
  });

export const deleteBean = (id) =>
  apiCall(`/beans/${id}`, {
    method: "DELETE",
  });

export const healthCheck = () => apiCall("/health");
