import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/security/ProtectedRoute';
import { PERMISSIONS } from '../utils/constants';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import RolesPage from '../pages/roles/RolesPage';
import PermissionsPage from '../pages/permissions/PermissionsPage';
import MenusPage from '../pages/menus/MenusPage';
import AuditLogsPage from '../pages/auditLogs/AuditLogsPage';
import SettingsPage from '../pages/SettingsPage';
import AccessDenied from '../pages/AccessDenied';
import NotFound from '../pages/NotFound';

/**
 * Application routes with permission-based protection
 * Route protection ensures users cannot access pages without required permissions
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes with permission checks */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute permission={PERMISSIONS.DASHBOARD_VIEW}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute permission={PERMISSIONS.USER_VIEW}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <ProtectedRoute permission={PERMISSIONS.ROLE_VIEW}>
            <RolesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/permissions"
        element={
          <ProtectedRoute permission={PERMISSIONS.PERMISSION_VIEW}>
            <PermissionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menus"
        element={
          <ProtectedRoute permission={PERMISSIONS.MENU_VIEW}>
            <MenusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute permission={PERMISSIONS.AUDIT_VIEW}>
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute permission={PERMISSIONS.SETTINGS_VIEW}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Access denied and not found */}
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
