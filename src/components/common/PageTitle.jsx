import React from 'react';

/**
 * Page title with optional breadcrumb
 */
const PageTitle = ({ title, subtitle, breadcrumb = [] }) => {
  return (
    <div className="mb-4">
      {breadcrumb.length > 0 && (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb breadcrumb-nav">
            {breadcrumb.map((item, index) => (
              <li
                key={index}
                className={`breadcrumb-item ${index === breadcrumb.length - 1 ? 'active' : ''}`}
              >
                {item.path && index < breadcrumb.length - 1 ? (
                  <a href={item.path}>{item.label}</a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h4 className="mb-1">{title}</h4>
      {subtitle && <p className="text-muted mb-0 small">{subtitle}</p>}
    </div>
  );
};

export default PageTitle;
