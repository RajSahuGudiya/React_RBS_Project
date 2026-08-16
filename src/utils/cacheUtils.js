import { DEFAULT_CACHE_TTL } from './constants';

/**
 * Lightweight frontend cache utility
 * Reduces repeated API calls for lookup data (roles, permissions, menus)
 */

const cacheStore = new Map();

/**
 * Store data in cache with optional TTL
 */
export const setCache = (key, data, ttl = DEFAULT_CACHE_TTL) => {
  cacheStore.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
};

/**
 * Retrieve cached data if not expired
 */
export const getCache = (key) => {
  const entry = cacheStore.get(key);
  if (!entry) return null;

  if (Date.now() >= entry.expiry) {
    cacheStore.delete(key);
    return null;
  }

  return entry.data;
};

/**
 * Check if cache entry exists and is valid
 */
export const isCacheValid = (key) => getCache(key) !== null;

/**
 * Clear a specific cache entry - used after save/update/delete operations
 */
export const clearCache = (key) => {
  cacheStore.delete(key);
};

/**
 * Clear multiple cache entries at once
 */
export const clearCaches = (keys = []) => {
  keys.forEach((key) => cacheStore.delete(key));
};

/**
 * Clear all cached data (e.g., on logout)
 */
export const clearAllCache = () => {
  cacheStore.clear();
};

/**
 * Get cached data or fetch from API and store in cache
 */
export const getOrFetch = async (key, fetchFn, ttl = DEFAULT_CACHE_TTL) => {
  const cached = getCache(key);
  if (cached !== null) return cached;

  const data = await fetchFn();
  setCache(key, data, ttl);
  return data;
};
