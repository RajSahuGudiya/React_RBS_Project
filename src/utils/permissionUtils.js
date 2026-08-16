/**
 * Permission-based UI rendering utilities
 * Used to show/hide menus and enable/disable action buttons
 */

const ADMIN_ROLE = 'ADMIN';

const normalizeList = (values) => {
  if (!values) return [];
  return Array.isArray(values) ? values : [values];
};

const isAdmin = (userRoles) => normalizeList(userRoles).includes(ADMIN_ROLE);

/**
 * Check if user has a specific permission
 */
export const hasPermission = (userPermissions, permission, userRoles = []) => {
  if (!permission) return true;
  if (isAdmin(userRoles)) return true;
  return normalizeList(userPermissions).includes(permission);
};

/**
 * Check if user has any of the given permissions
 */
export const hasAnyPermission = (userPermissions, permissions = [], userRoles = []) => {
  if (isAdmin(userRoles)) return true;
  if (!permissions.length) return true;
  return permissions.some((p) => hasPermission(userPermissions, p, userRoles));
};

/**
 * Check if user has all of the given permissions
 */
export const hasAllPermissions = (userPermissions, permissions = [], userRoles = []) => {
  if (isAdmin(userRoles)) return true;
  if (!permissions.length) return true;
  return permissions.every((p) => hasPermission(userPermissions, p, userRoles));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (userRoles, role) => {
  if (!role) return false;
  return normalizeList(userRoles).includes(role);
};

/**
 * Check if user has any of the given roles
 */
export const hasAnyRole = (userRoles, roles = []) => {
  if (!roles.length) return true;
  return roles.some((r) => hasRole(userRoles, r));
};

/**
 * Filter menu items based on user permissions
 */
export const filterMenusByPermission = (menus, userPermissions, userRoles = []) => {
  if (!menus) return [];
  return menus.filter((menu) => {
    if (!menu.permissionCode) return true;
    return hasPermission(userPermissions, menu.permissionCode, userRoles);
  });
};

export const hasAdminRole = isAdmin;
