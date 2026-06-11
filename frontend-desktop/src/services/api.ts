export const API_BASE_URL = 'http://localhost:5121/api';

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Erro desconhecido');
    throw new Error(errorText || `Erro HTTP: ${response.status}`);
  }

  // Se não houver corpo (ex: 204 No Content), não tenta fazer o parse JSON
  if (response.status === 204) {
    return null;
  }

  return response.json();
};
