import React from 'react';

/**
 * Multi-select checkbox component for roles and permissions assignment
 */
const MultiSelect = ({
  label,
  name,
  options = [],
  selectedValues = [],
  onChange,
  error,
  required = false,
  valueKey = 'id',
  labelKey = 'name',
  codeKey,
  disabled = false,
}) => {
  const handleToggle = (value) => {
    if (disabled) return;
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange({ target: { name, value: newValues } });
  };

  const getLabel = (option) => {
    if (typeof option === 'object') {
      if (codeKey && option[codeKey]) {
        return `${option[codeKey]} - ${option[labelKey]}`;
      }
      return option[labelKey] || option.name || option.roleName || option.permissionName;
    }
    return option;
  };

  const getValue = (option) => {
    return typeof option === 'object' ? option[valueKey] : option;
  };

  return (
    <div className="mb-3">
      {label && (
        <label className={`form-label ${required ? 'required' : ''}`}>{label}</label>
      )}
      <div className={`multi-select-container ${error ? 'border-danger' : ''}`}>
        {options.length === 0 ? (
          <p className="text-muted small mb-0 p-2">No options available</p>
        ) : (
          options.map((option) => {
            const value = getValue(option);
            return (
              <div key={value} className="multi-select-item">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`${name}-${value}`}
                    checked={selectedValues.includes(value)}
                    onChange={() => handleToggle(value)}
                    disabled={disabled}
                  />
                  <label className="form-check-label" htmlFor={`${name}-${value}`}>
                    {getLabel(option)}
                  </label>
                </div>
              </div>
            );
          })
        )}
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default MultiSelect;
