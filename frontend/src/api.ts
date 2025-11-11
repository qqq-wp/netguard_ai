// frontend/src/api.ts
const API_URL = 'http://localhost:8000';

export const api = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem('netguard_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('netguard_token');
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  return response.json();
};