import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';
import { isReadLocalJsonFileEnabled } from '../api/apiDataSource';
import {
  saveAuthData,
  clearAuthData,
  getStoredUser,
  isTokenValid,
  updateStoredUser,
} from '../utils/authUtils';
import { clearAllCache } from '../utils/cacheUtils';
import { hasPermission } from '../utils/permissionUtils';
import { PERMISSIONS } from '../utils/constants';

const AuthContext = createContext(null);
const IS_DEVELOPER_MODE =
  process.env.REACT_APP_DEVELOPER_MODE === 'true' && !isReadLocalJsonFileEnabled();
const DEVELOPER_USERNAME = 'admin';
const DEVELOPER_PASSWORD = 'admin123';

const createDeveloperLoginResponse = () => ({
  accessToken: 'developer-mode-token',
  tokenType: 'Bearer',
  expiresIn: 8 * 60 * 60,
  user: {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    roles: ['ADMIN'],
    permissions: Object.values(PERMISSIONS),
  },
});

/**
 * Authentication Context Provider
 * Manages JWT token, user details, roles, and permissions state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const initAuth = () => {
      if (isTokenValid()) {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  /**
   * Login user - uses local developer credentials only when developer mode is enabled.
   * In normal mode this calls the backend login API and stores the JWT response.
   */
  const login = useCallback(async (credentials) => {
    setLoginError(null);
    setIsLoading(true);
    try {
      let data;

      if (IS_DEVELOPER_MODE) {
        const username = credentials.username?.trim();
        if (username !== DEVELOPER_USERNAME || credentials.password !== DEVELOPER_PASSWORD) {
          throw new Error('Invalid developer mode credentials');
        }
        data = createDeveloperLoginResponse();
      } else {
        const response = await authApi.login(credentials);
        data = response.data;
      }

      // Store JWT token and user details in localStorage
      saveAuthData(data);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.userMessage ||
        'Invalid username or password';
      setLoginError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user - clears token, user data, and cache
   */
  const logout = useCallback(async () => {
    try {
      if (!IS_DEVELOPER_MODE) {
        await authApi.logout();
      }
    } catch {
      // Continue logout even if API call fails
    } finally {
      clearAuthData();
      clearAllCache();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    updateStoredUser(userData);
  }, []);

  /**
   * Permission check helper for UI rendering
   */
  const checkPermission = useCallback(
    (permission) => hasPermission(user?.permissions, permission, user?.roles),
    [user]
  );

  const checkAnyPermission = useCallback(
    (permissions) => {
      if (!permissions?.length) return true;
      return permissions.some((p) => hasPermission(user?.permissions, p, user?.roles));
    },
    [user]
  );

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginError,
    login,
    logout,
    updateUser,
    checkPermission,
    checkAnyPermission,
    permissions: user?.permissions || [],
    roles: user?.roles || [],
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
