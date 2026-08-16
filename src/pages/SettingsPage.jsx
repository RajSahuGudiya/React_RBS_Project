import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';

/**
 * Settings page placeholder
 */
const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <AppLayout
      pageTitle="Settings"
      breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Settings' }]}
    >
      <div className="card">
        <div className="card-header">Application Settings</div>
        <div className="card-body">
          <p className="text-muted">
            Settings module is ready for backend integration. Configure application preferences here.
          </p>
          <div className="details-grid">
            <div className="detail-item">
              <label>Logged-in User</label>
              <span>{user?.username}</span>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <span>{user?.email}</span>
            </div>
            <div className="detail-item">
              <label>API Base URL</label>
              <span>{process.env.REACT_APP_API_BASE_URL}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
