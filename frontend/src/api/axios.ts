import axios from 'axios';

const getApiUrl = () => {
  if (typeof window !== 'undefined' && (window as any).ELECTRON_API_URL) {
    return (window as any).ELECTRON_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.origin.includes('http')) {
    const port = window.location.port;
    if (['5173', '5174', '3000'].includes(port)) {
      return import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
    }
    return `${window.location.origin}/api`;
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('/login') &&
      !window.location.pathname.includes('/register')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
