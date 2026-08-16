import React from 'react';
import Loader from './Loader';
import EmptyState from './EmptyState';

/**
 * Reusable data table component
 */
const DataTable = ({ columns, data, loading, emptyMessage, emptyIcon, onEmptyAction, emptyActionLabel }) => {
  if (loading) {
    return <Loader fullScreen text="Loading data..." />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title="No Data Found"
        message={emptyMessage || 'There are no records to display.'}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="data-table-wrapper">
      <table className="table table-hover data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
