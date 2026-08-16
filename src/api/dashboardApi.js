import apiClient from './axiosConfig';

/**
 * Dashboard API service
 */
export const dashboardApi = {
  getSummary: () => apiClient.get('/dashboard/summary'),
};

export default dashboardApi;
