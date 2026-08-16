import apiClient, { buildQueryParams } from './axiosConfig';

/**
 * Audit Logs API service
 */
export const auditLogApi = {
  getAll: (params = {}) =>
    apiClient.get('/audit-logs', { params: buildQueryParams(params) }),
};

export default auditLogApi;
