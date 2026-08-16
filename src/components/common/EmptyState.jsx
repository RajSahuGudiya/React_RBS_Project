import React from 'react';

/**
 * Empty state component when table has no data
 */
const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No Data Found',
  message = 'There are no records to display.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon} display-4 text-muted`}></i>
      <h5 className="mt-3 text-muted">{title}</h5>
      <p className="text-muted mb-3">{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
