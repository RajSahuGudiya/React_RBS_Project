import apiClient, { buildQueryParams } from './axiosConfig';

/**
 * Permission Management API service
 */
export const permissionApi = {
  getAll: (params = {}) =>
    apiClient.get('/permissions', { params: buildQueryParams(params) }),
  getById: (id) => apiClient.get(`/permissions/${id}`),
  create: (data) => apiClient.post('/permissions', data),
  update: (id, data) => apiClient.put(`/permissions/${id}`, data),
  delete: (id) => apiClient.delete(`/permissions/${id}`),
};

export default permissionApi;
