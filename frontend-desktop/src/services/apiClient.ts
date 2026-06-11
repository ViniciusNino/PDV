import { apiFetch } from './api';

/**
 * Cliente HTTP genérico da aplicação.
 * Encapsula a lógica do fetch, injeção de token e tratamento de erros.
 */
export const apiClient = {
  /**
   * Realiza uma requisição GET.
   * @param endpoint O endpoint da API (ex: '/products')
   */
  async get<T = any>(endpoint: string): Promise<T> {
    return apiFetch(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Realiza uma requisição POST.
   * @param endpoint O endpoint da API (ex: '/products')
   * @param data Os dados a serem enviados no corpo da requisição
   */
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return apiFetch(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Realiza uma requisição PUT.
   * @param endpoint O endpoint da API (ex: '/products/1')
   * @param data Os dados a serem enviados no corpo da requisição
   */
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return apiFetch(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Realiza uma requisição DELETE.
   * @param endpoint O endpoint da API (ex: '/products/1')
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    return apiFetch(endpoint, {
      method: 'DELETE',
    });
  }
};
