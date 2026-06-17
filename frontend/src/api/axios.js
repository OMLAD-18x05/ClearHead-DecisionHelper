import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: '', // Empty base URL because Vite server proxy handles forwarding to http://localhost:3000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clearhead_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login if session expires
      localStorage.removeItem('clearhead_token');
      localStorage.removeItem('clearhead_user');
      
      // Only redirect if we are not already on the landing, login, or register page
      const publicPaths = ['/', '/login', '/register'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
