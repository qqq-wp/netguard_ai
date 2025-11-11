import axios from 'axios';

// Безопасное получение переменной окружения
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцепторы для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const scanApi = {
  getScanTasks: () => api.get('/scan-tasks/'),
  createScanTask: (data: any) => api.post('/scan-tasks/', data),
  getScanNetworks: () => api.get('/scan-networks/'),
};

export const assetsApi = {
  getAssets: () => api.get('/assets/'),
  getAsset: (id: number) => api.get(`/assets/${id}`),
};