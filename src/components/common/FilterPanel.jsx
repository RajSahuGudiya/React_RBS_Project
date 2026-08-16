import React from 'react';

/**
 * Filter panel wrapper for table filters
 */
const FilterPanel = ({ children, onApply, onClear, showActions = true }) => {
  return (
    <div className="filter-panel">
      <div className="row g-3">{children}</div>
      {showActions && (
        <div className="d-flex gap-2 mt-3">
          {onApply && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onApply}>
              <i className="bi bi-funnel me-1"></i>
              Apply Filter
            </button>
          )}
          {onClear && (
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClear}>
              <i className="bi bi-x-circle me-1"></i>
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
