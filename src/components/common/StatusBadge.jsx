import React from 'react';

/**
 * Status badge component for Active/Inactive states
 */
const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || '').toUpperCase();
  const isActive = normalizedStatus === 'ACTIVE';

  return (
    <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
      {isActive ? 'Active' : normalizedStatus === 'INACTIVE' ? 'Inactive' : status}
    </span>
  );
};

export default StatusBadge;
