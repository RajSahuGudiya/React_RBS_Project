import React, { createContext, useContext, useCallback } from 'react';
import {
  getCache,
  setCache,
  clearCache,
  clearCaches,
  getOrFetch,
  clearAllCache,
} from '../utils/cacheUtils';
import { CACHE_KEYS, DASHBOARD_CACHE_TTL } from '../utils/constants';
import roleApi from '../api/roleApi';
import permissionApi from '../api/permissionApi';
import menuApi from '../api/menuApi';
import dashboardApi from '../api/dashboardApi';

const CacheContext = createContext(null);

/**
 * Frontend caching context
 * Reduces repeated API calls for lookup data and dashboard summary
 */
export const CacheProvider = ({ children }) => {
  /**
   * Get roles from cache or fetch from API
   */
  const getRoles = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) clearCache(CACHE_KEYS.ROLES);
    return getOrFetch(CACHE_KEYS.ROLES, async () => {
      const response = await roleApi.getAll({ size: 1000 });
      return response.data?.content || response.data || [];
    });
  }, []);

  /**
   * Get permissions from cache or fetch from API
   */
  const getPermissions = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) clearCache(CACHE_KEYS.PERMISSIONS);
    return getOrFetch(CACHE_KEYS.PERMISSIONS, async () => {
      const response = await permissionApi.getAll({ size: 1000 });
      return response.data?.content || response.data || [];
    });
  }, []);

  /**
   * Get all menus from cache or fetch from API
   */
  const getMenus = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) clearCache(CACHE_KEYS.MENUS);
    return getOrFetch(CACHE_KEYS.MENUS, async () => {
      const response = await menuApi.getAll();
      return response.data?.content || response.data || [];
    });
  }, []);

  /**
   * Get logged-in user's menus from cache or fetch from API
   */
  const getMyMenus = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) clearCache(CACHE_KEYS.MY_MENUS);
    return getOrFetch(CACHE_KEYS.MY_MENUS, async () => {
      const response = await menuApi.getMyMenus();
      return response.data?.content || response.data || [];
    });
  }, []);

  /**
   * Get dashboard summary with short cache duration
   */
  const getDashboardSummary = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) clearCache(CACHE_KEYS.DASHBOARD);
    return getOrFetch(
      CACHE_KEYS.DASHBOARD,
      async () => {
        const response = await dashboardApi.getSummary();
        return response.data;
      },
      DASHBOARD_CACHE_TTL
    );
  }, []);

  /**
   * Clear cache after save/update/delete operations
   */
  const invalidateRolesCache = useCallback(() => {
    clearCache(CACHE_KEYS.ROLES);
  }, []);

  const invalidatePermissionsCache = useCallback(() => {
    clearCache(CACHE_KEYS.PERMISSIONS);
  }, []);

  const invalidateMenusCache = useCallback(() => {
    clearCaches([CACHE_KEYS.MENUS, CACHE_KEYS.MY_MENUS]);
  }, []);

  const invalidateUsersCache = useCallback(() => {
    clearCaches([CACHE_KEYS.MY_MENUS, CACHE_KEYS.DASHBOARD]);
  }, []);

  const invalidateDashboardCache = useCallback(() => {
    clearCache(CACHE_KEYS.DASHBOARD);
  }, []);

  const invalidateAllCache = useCallback(() => {
    clearAllCache();
  }, []);

  const value = {
    getRoles,
    getPermissions,
    getMenus,
    getMyMenus,
    getDashboardSummary,
    invalidateRolesCache,
    invalidatePermissionsCache,
    invalidateMenusCache,
    invalidateUsersCache,
    invalidateDashboardCache,
    invalidateAllCache,
    getCache,
    setCache,
    clearCache,
  };

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

export default CacheContext;
