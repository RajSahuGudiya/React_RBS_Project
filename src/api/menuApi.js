import apiClient from './axiosConfig';

/**
 * Menu Access Management API service
 */
export const menuApi = {
  getAll: () => apiClient.get('/menus'),
  getMyMenus: () => apiClient.get('/menus/my-menus'),
  getById: (id) => apiClient.get(`/menus/${id}`),
  create: (data) => apiClient.post('/menus', data),
  update: (id, data) => apiClient.put(`/menus/${id}`, data),
  delete: (id) => apiClient.delete(`/menus/${id}`),
};

export default menuApi;
