import axios from 'axios';

// Konfigurasi baseURL sesuai backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handling error secara global (opsional)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Misalnya redirect ke login jika 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; 
      // Redirect ini lebih baik dihandle di komponen atau route untuk menghindari efek samping murni pada axios
    }
    return Promise.reject(error);
  }
);

export default api;
