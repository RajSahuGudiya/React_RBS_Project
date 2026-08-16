import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Loader from '../components/common/Loader';
import PermissionGuard from '../components/security/PermissionGuard';
import { useAuth } from '../context/AuthContext';
import { useCache } from '../context/CacheContext';
import { PERMISSIONS } from '../utils/constants';
import { getErrorMessage } from '../api/axiosConfig';

/**
 * Dashboard page with summary cards and quick actions
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const { getDashboardSummary } = useCache();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSummary = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary(forceRefresh);
      setSummary(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load dashboard data'));
    } finally {
      setLoading(false);
    }
  }, [getDashboardSummary]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const cards = [
    {
      title: 'Total Users',
      value: summary?.totalUsers ?? '-',
      icon: 'bi-people',
      color: 'primary',
    },
    {
      title: 'Active Users',
      value: summary?.activeUsers ?? '-',
      icon: 'bi-person-check',
      color: 'success',
    },
    {
      title: 'Total Roles',
      value: summary?.totalRoles ?? '-',
      icon: 'bi-shield-check',
      color: 'info',
    },
    {
      title: 'Total Permissions',
      value: summary?.totalPermissions ?? '-',
      icon: 'bi-key',
      color: 'warning',
    },
    {
      title: 'Recent Logins',
      value: summary?.recentLoginCount ?? '-',
      icon: 'bi-box-arrow-in-right',
      color: 'secondary',
    },
    {
      title: 'Pending Actions',
      value: summary?.pendingSecurityActions ?? '-',
      icon: 'bi-exclamation-triangle',
      color: 'danger',
    },
  ];

  return (
    <AppLayout
      pageTitle="Dashboard"
      breadcrumb={[{ label: 'Dashboard' }]}
    >
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-1">
                Welcome, {user?.username}!
              </h5>
              <p className="text-muted mb-0">
                Role: {(user?.roles || []).join(', ') || 'No role assigned'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning">
          {error}
          <button className="btn btn-sm btn-outline-warning ms-2" onClick={() => loadSummary(true)}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <Loader fullScreen text="Loading dashboard..." />
      ) : (
        <>
          <div className="row g-3 mb-4">
            {cards.map((card) => (
              <div key={card.title} className="col-sm-6 col-lg-4 col-xl-2">
                <div className="card dashboard-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted small mb-1">{card.title}</p>
                        <h3 className="mb-0">{card.value}</h3>
                      </div>
                      <div className={`dashboard-card-icon bg-${card.color} bg-opacity-10 text-${card.color}`}>
                        <i className={`bi ${card.icon}`}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Recently Updated</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => loadSummary(true)}>
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
                <div className="card-body">
                  {summary?.recentUpdates?.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {summary.recentUpdates.map((item, index) => (
                        <li key={index} className="list-group-item px-0">
                          <div className="d-flex justify-content-between">
                            <span>{item.description || item.name}</span>
                            <small className="text-muted">{item.updatedAt || item.date}</small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted mb-0">No recent updates available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">Quick Actions</div>
                <div className="card-body d-grid gap-2">
                  <PermissionGuard permission={PERMISSIONS.USER_CREATE}>
                    <Link to="/users" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-person-plus me-1"></i> Add User
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard permission={PERMISSIONS.ROLE_CREATE}>
                    <Link to="/roles" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-shield-plus me-1"></i> Add Role
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard permission={PERMISSIONS.PERMISSION_CREATE}>
                    <Link to="/permissions" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-key me-1"></i> Add Permission
                    </Link>
                  </PermissionGuard>
                  <PermissionGuard permission={PERMISSIONS.AUDIT_VIEW}>
                    <Link to="/audit-logs" className="btn btn-outline-secondary btn-sm">
                      <i className="bi bi-journal-text me-1"></i> View Audit Logs
                    </Link>
                  </PermissionGuard>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
