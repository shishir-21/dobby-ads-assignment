import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL;
if (baseURL && !baseURL.endsWith('/api')) {
  baseURL += '/api';
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
