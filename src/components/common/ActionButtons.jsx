import React from 'react';
import PermissionGuard from '../security/PermissionGuard';

/**
 * Reusable action buttons with permission-based rendering
 */
const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  viewPermission,
  editPermission,
  deletePermission,
  showView = true,
  showEdit = true,
  showDelete = true,
  disableDelete = false,
  deleteTooltip,
  extraActions = [],
}) => {
  return (
    <div className="table-actions">
      {showView && onView && (
        <PermissionGuard permission={viewPermission}>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={onView}
            title="View"
          >
            <i className="bi bi-eye"></i>
          </button>
        </PermissionGuard>
      )}

      {showEdit && onEdit && (
        <PermissionGuard permission={editPermission}>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onEdit}
            title="Edit"
          >
            <i className="bi bi-pencil"></i>
          </button>
        </PermissionGuard>
      )}

      {showDelete && onDelete && !disableDelete && (
        <PermissionGuard permission={deletePermission}>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={onDelete}
            title={deleteTooltip || 'Delete'}
          >
            <i className="bi bi-trash"></i>
          </button>
        </PermissionGuard>
      )}

      {extraActions.map((action, index) => (
        <PermissionGuard key={index} permission={action.permission}>
          <button
            className={`btn btn-outline-${action.variant || 'info'} btn-sm`}
            onClick={action.onClick}
            title={action.title}
            disabled={action.disabled}
          >
            {action.icon ? <i className={`bi ${action.icon}`}></i> : action.label}
          </button>
        </PermissionGuard>
      ))}
    </div>
  );
};

export default ActionButtons;
