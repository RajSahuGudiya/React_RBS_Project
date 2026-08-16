/**
 * Application-wide constants for RBS Management System
 */

export const APP_NAME = 'Role Based Security Frontend';

export const TOKEN_KEY = 'rbs_access_token';
export const TOKEN_TYPE_KEY = 'rbs_token_type';
export const TOKEN_EXPIRY_KEY = 'rbs_token_expiry';
export const USER_KEY = 'rbs_user';

/** Default cache TTL in milliseconds (5 minutes) */
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/** Dashboard cache TTL (2 minutes) */
export const DASHBOARD_CACHE_TTL = 2 * 60 * 1000;

/** Permission codes used for route and UI authorization */
export const PERMISSIONS = {
  USER_VIEW: 'USER_VIEW',
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  ROLE_VIEW: 'ROLE_VIEW',
  ROLE_CREATE: 'ROLE_CREATE',
  ROLE_UPDATE: 'ROLE_UPDATE',
  ROLE_DELETE: 'ROLE_DELETE',
  PERMISSION_VIEW: 'PERMISSION_VIEW',
  PERMISSION_CREATE: 'PERMISSION_CREATE',
  PERMISSION_UPDATE: 'PERMISSION_UPDATE',
  PERMISSION_DELETE: 'PERMISSION_DELETE',
  MENU_VIEW: 'MENU_VIEW',
  MENU_CREATE: 'MENU_CREATE',
  MENU_UPDATE: 'MENU_UPDATE',
  MENU_DELETE: 'MENU_DELETE',
  AUDIT_VIEW: 'AUDIT_VIEW',
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
  SETTINGS_VIEW: 'SETTINGS_VIEW',
};

/** Route to permission mapping for protected routes */
export const ROUTE_PERMISSIONS = {
  '/dashboard': PERMISSIONS.DASHBOARD_VIEW,
  '/users': PERMISSIONS.USER_VIEW,
  '/roles': PERMISSIONS.ROLE_VIEW,
  '/permissions': PERMISSIONS.PERMISSION_VIEW,
  '/menus': PERMISSIONS.MENU_VIEW,
  '/audit-logs': PERMISSIONS.AUDIT_VIEW,
  '/settings': PERMISSIONS.SETTINGS_VIEW,
};

/** User status options */
export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

/** System role that cannot be deleted */
export const SYSTEM_ROLE_ADMIN = 'ADMIN';

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/** Debounce delay for search inputs (ms) */
export const SEARCH_DEBOUNCE_MS = 400;

/** Cache keys for frontend caching */
export const CACHE_KEYS = {
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  MENUS: 'menus',
  MY_MENUS: 'myMenus',
  USER_PROFILE: 'userProfile',
  DASHBOARD: 'dashboard',
};
