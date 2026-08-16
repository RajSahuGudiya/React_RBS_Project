import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

/**
 * Access Denied page - shown when user lacks required permission
 */
const AccessDenied = () => {
  return (
    <AppLayout pageTitle="Access Denied">
      <div className="access-denied-container">
        <div className="text-center">
          <i className="bi bi-shield-x display-1 text-danger"></i>
          <h2 className="mt-3">Access Denied</h2>
          <p className="text-muted mb-4">
            You do not have permission to access this page or perform this action.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            <i className="bi bi-house me-1"></i>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default AccessDenied;
