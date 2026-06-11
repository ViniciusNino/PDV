import { apiFetch } from './api';

export const stockSectorService = {
  getAll: () => {
    return apiFetch('/stocksectors');
  },

  create: (name: string, description: string) => {
    return apiFetch('/stocksectors', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
  },

  update: (id: string, name: string, description: string) => {
    return apiFetch(`/stocksectors/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description })
    });
  },

  delete: (id: string) => {
    return apiFetch(`/stocksectors/${id}`, {
      method: 'DELETE'
    });
  }
};
