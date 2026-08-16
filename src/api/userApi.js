import apiClient, { buildQueryParams } from './axiosConfig';

/**
 * User Management API service
 */
export const userApi = {
  getAll: (params = {}) => apiClient.get('/users', { params: buildQueryParams(params) }),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
  updateStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status }),
  assignRoles: (id, roleIds) => apiClient.post(`/users/${id}/roles`, { roleIds }),
};

export default userApi;
