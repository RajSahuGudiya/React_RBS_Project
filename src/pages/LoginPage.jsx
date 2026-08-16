import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm, hasErrors } from '../utils/validators';
import { isTokenValid } from '../utils/authUtils';
import { APP_NAME } from '../utils/constants';
import Loader from '../components/common/Loader';

/**
 * Login page - authenticates user and stores JWT token
 */
const LoginPage = () => {
  const { login, isAuthenticated, isLoading, loginError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in with valid token
  if (isAuthenticated && isTokenValid()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const result = await login(formData);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="login-page">
        <Loader text="Loading..." />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="card login-card">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <i className="bi bi-shield-lock display-4 text-primary"></i>
            <h2 className="login-logo mt-2">{APP_NAME}</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>

          {loginError && (
            <div className="alert alert-danger py-2" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label required">
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username or email"
                autoComplete="username"
                disabled={submitting}
              />
              {errors.username && <div className="form-error">{errors.username}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label required">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={submitting}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
