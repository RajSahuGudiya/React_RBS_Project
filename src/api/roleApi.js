import apiClient, { buildQueryParams } from './axiosConfig';

/**
 * Role Management API service
 */
export const roleApi = {
  getAll: (params = {}) => apiClient.get('/roles', { params: buildQueryParams(params) }),
  getById: (id) => apiClient.get(`/roles/${id}`),
  create: (data) => apiClient.post('/roles', data),
  update: (id, data) => apiClient.put(`/roles/${id}`, data),
  delete: (id) => apiClient.delete(`/roles/${id}`),
  getPermissions: (id) => apiClient.get(`/roles/${id}/permissions`),
  assignPermissions: (id, permissionIds) =>
    apiClient.post(`/roles/${id}/permissions`, { permissionIds }),
};

export default roleApi;
