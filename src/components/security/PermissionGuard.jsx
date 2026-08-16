import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Permission-based UI rendering component
 * Shows children only if user has the required permission
 * Optionally renders fallback content or disables wrapped element
 */
const PermissionGuard = ({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
  disableOnly = false,
}) => {
  const { checkPermission, checkAnyPermission } = useAuth();

  let hasAccess = true;

  if (permission) {
    hasAccess = checkPermission(permission);
  } else if (permissions?.length) {
    hasAccess = requireAll
      ? permissions.every((p) => checkPermission(p))
      : checkAnyPermission(permissions);
  }

  if (!hasAccess) {
    if (disableOnly && React.isValidElement(children)) {
      return React.cloneElement(children, { disabled: true, title: 'Permission denied' });
    }
    return fallback;
  }

  return children;
};

export default PermissionGuard;
