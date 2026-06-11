import { apiFetch } from './api';

export const productService = {
  getAll: () => {
    return apiFetch('/products');
  },

  getById: (id: string) => {
    return apiFetch(`/products/${id}`);
  },

  getCategories: () => {
    return apiFetch('/categories');
  },
  
  create: (productData: any) => {
    return apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  update: (id: string, productData: any) => {
    return apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }
};
