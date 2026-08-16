import {
  TOKEN_KEY,
  TOKEN_TYPE_KEY,
  TOKEN_EXPIRY_KEY,
  USER_KEY,
} from './constants';

/**
 * JWT token handling utilities
 * Stores and retrieves token data from localStorage for session persistence
 */

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);

export const getTokenType = () => localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';

export const getTokenExpiry = () => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

export const getStoredUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

/**
 * Persist login response data including JWT and user details
 */
export const saveAuthData = (loginResponse) => {
  const { accessToken, tokenType, expiresIn, user } = loginResponse;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_TYPE_KEY, tokenType || 'Bearer');
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Calculate expiry timestamp from expiresIn (seconds)
  if (expiresIn) {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if JWT token exists and has not expired
 */
export const isTokenValid = () => {
  const token = getAccessToken();
  if (!token) return false;

  const expiry = getTokenExpiry();
  if (expiry && Date.now() >= expiry) {
    return false;
  }

  return true;
};

export const getAuthHeader = () => {
  const token = getAccessToken();
  const tokenType = getTokenType();
  if (!token) return {};
  return { Authorization: `${tokenType} ${token}` };
};

export const updateStoredUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
