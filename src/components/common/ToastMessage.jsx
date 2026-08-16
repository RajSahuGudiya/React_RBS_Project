import React, { useEffect } from 'react';

/**
 * Toast notification component for success/error messages
 */
const ToastMessage = ({ show, message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const bgClass = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
  }[type] || 'bg-success';

  const icon = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
  }[type] || 'bi-check-circle-fill';

  return (
    <div className="toast-container">
      <div className={`toast show align-items-center text-white ${bgClass} border-0`} role="alert">
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center gap-2">
            <i className={`bi ${icon}`}></i>
            {message}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
