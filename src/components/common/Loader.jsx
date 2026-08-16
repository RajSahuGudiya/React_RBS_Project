import React from 'react';

/**
 * Loading spinner component
 */
const Loader = ({ size = 'md', text = 'Loading...', fullScreen = false, className = '' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';

  const content = (
    <div className={`text-center ${className}`}>
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <p className="text-muted mt-2 mb-0 small">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
