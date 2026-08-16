import React from 'react';
import StatusBadge from '../../components/common/StatusBadge';

/**
 * User details view component
 */
const UserDetails = ({ user, onClose }) => {
  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || '-';

  return (
    <div>
      <div className="details-grid mb-4">
        <div className="detail-item">
          <label>User ID</label>
          <span>{user.id}</span>
        </div>
        <div className="detail-item">
          <label>Username</label>
          <span>{user.username}</span>
        </div>
        <div className="detail-item">
          <label>Email</label>
          <span>{user.email}</span>
        </div>
        <div className="detail-item">
          <label>Full Name</label>
          <span>{fullName}</span>
        </div>
        <div className="detail-item">
          <label>Status</label>
          <span><StatusBadge status={user.status} /></span>
        </div>
        <div className="detail-item">
          <label>Created Date</label>
          <span>{user.createdDate || user.createdAt || '-'}</span>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Assigned Roles</label>
        <div>
          {(user.roles || []).length > 0 ? (
            user.roles.map((role, index) => (
              <span key={index} className="badge bg-primary me-1 mb-1">
                {typeof role === 'object' ? role.roleName || role.roleCode : role}
              </span>
            ))
          ) : (
            <span className="text-muted">No roles assigned</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
