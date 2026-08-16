import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page
 */
const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <h1 className="display-1 text-muted">404</h1>
        <h2>Page Not Found</h2>
        <p className="text-muted mb-4">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="btn btn-primary">
          <i className="bi bi-house me-1"></i>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
