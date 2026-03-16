import axios from 'axios';

const isDev = window.location.hostname === 'localhost';

const api = axios.create({
  baseURL: isDev ? 'http://localhost:8000' : '',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nyaya_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nyaya_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const auth = {
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/api/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  register: (data) => api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
};

export const cases = {
  getAll: () => api.get('/api/cases/'),
  get: (id) => api.get(`/api/cases/${id}`),
  create: (data) => api.post('/api/cases/', data),
  update: (id, data) => api.put(`/api/cases/${id}`, data),
};

export const bail = {
  generate: (data) => api.post('/api/bail/generate', data),
  getByCase: (caseId) => api.get(`/api/bail/${caseId}`),
  updateStatus: (id, status) => api.patch(`/api/bail/${id}/status`, { status }),
  getDefaultGrounds: () => api.get('/api/bail/grounds/defaults'),
};

export const lawyers = {
  find: (params) => api.get('/api/lawyers/', { params }),
  getLegalAidInfo: (district) => api.get('/api/lawyers/legal-aid-info', { params: { district } }),
};

export const hearings = {
  getByCase: (caseId) => api.get(`/api/hearings/${caseId}`),
  upcoming: () => api.get('/api/hearings/upcoming/all'),
  create: (data) => api.post('/api/hearings/', data),
};

export const chat = {
  send: (data) => api.post('/api/chat/', data),
  history: (caseId) => api.get(`/api/chat/history/${caseId}`),
};

export default api;
