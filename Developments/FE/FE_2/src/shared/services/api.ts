import axios from 'axios';
import { useAuthStore } from '../../app/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Decide which token to use based on URL or state.
    // For simplicity, we can inject whichever token exists, prioritizing staff token for staff routes
    const { parentToken, staffToken } = useAuthStore.getState();
    const token = config.url?.includes('/staff') || config.url?.includes('/receptionist') || config.url?.includes('/doctor') ? staffToken : parentToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic to redirect or clear store could be here
      console.warn('Unauthorized - 401');
    }
    return Promise.reject(error);
  }
);

export default api;
