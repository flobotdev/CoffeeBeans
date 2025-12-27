const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// API functions
export const getAllBeans = () => apiCall('/beans');

export const getBeansOfTheDay = () => apiCall('/beans/botd');

export const searchBeans = (query) => apiCall(`/beans/search?q=${encodeURIComponent(query)}`);

export const getBeanById = (id) => apiCall(`/beans/${id}`);

export const addBean = (beanData) => apiCall('/beans', {
  method: 'POST',
  body: JSON.stringify(beanData),
});

export const updateBean = (id, beanData) => apiCall(`/beans/${id}`, {
  method: 'PUT',
  body: JSON.stringify(beanData),
});

export const deleteBean = (id) => apiCall(`/beans/${id}`, {
  method: 'DELETE',
});

export const healthCheck = () => apiCall('/health');