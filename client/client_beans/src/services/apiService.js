const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

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

// API functions
export const getAllBeans = () => apiCall("/beans");

export const getBeansOfTheDay = () => apiCall("/beans/botd", {}, true);

export const searchBeans = (query) =>
  apiCall(`/beans/search?q=${encodeURIComponent(query)}`);

export const getBeanById = (id) => apiCall(`/beans/${id}`);

export const healthCheck = () => apiCall("/health");
