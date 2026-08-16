import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isTokenValid } from '../../utils/authUtils';
import Loader from '../common/Loader';

/**
 * Protected route wrapper - redirects to login if JWT token is missing or expired
 */
const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, isLoading, checkPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen text="Checking authentication..." />;
  }

  // Route protection: redirect to login if not authenticated or token expired
  if (!isAuthenticated || !isTokenValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Permission check: redirect to access denied if user lacks required permission
  if (permission && !checkPermission(permission)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
