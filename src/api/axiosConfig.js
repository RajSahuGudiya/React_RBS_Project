import axios from 'axios';
import { isReadLocalJsonFileEnabled } from './apiDataSource';
import localApiClient from './localApiClient';
import {
  getAccessToken,
  getTokenType,
  clearAuthData,
  isTokenValid,
} from '../utils/authUtils';

/**
 * Centralized Axios configuration for REST API communication
 * Base URL comes from environment variable for easy backend integration
 */
const remoteApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios request interceptor - attaches JWT token to every request
 */
remoteApiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && isTokenValid()) {
      const tokenType = getTokenType();
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Axios response interceptor - handles global error responses
 * 401: Token expired or invalid - redirect to login
 * 403: Forbidden - access denied
 * Network errors: clean user-friendly messages
 */
remoteApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // JWT token expired or missing - clear auth and redirect to login
          clearAuthData();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          error.userMessage = 'Session expired. Please login again.';
          break;
        case 403:
          error.userMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          error.userMessage = response.data?.message || 'Resource not found.';
          break;
        case 409:
          error.userMessage = response.data?.message || 'Duplicate entry. Record already exists.';
          break;
        case 422:
          error.userMessage = response.data?.message || 'Validation error. Please check your input.';
          break;
        case 500:
          error.userMessage = 'Server error. Please try again later.';
          break;
        default:
          error.userMessage = response.data?.message || 'An unexpected error occurred.';
      }
    } else if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timed out. Please try again.';
    } else if (!navigator.onLine) {
      error.userMessage = 'No internet connection. Please check your network.';
    } else {
      error.userMessage = 'Unable to reach the server. Please ensure the backend is running.';
    }

    return Promise.reject(error);
  }
);

const apiClient = isReadLocalJsonFileEnabled() ? localApiClient : remoteApiClient;

export default apiClient;

/**
 * Extract error message for display in UI
 */
export const getErrorMessage = (error, fallback = 'An error occurred') => {
  return error?.userMessage || error?.response?.data?.message || error?.message || fallback;
};

/**
 * Build query string from filter params object
 */
export const buildQueryParams = (params = {}) => {
  const cleaned = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
  return cleaned;
};
