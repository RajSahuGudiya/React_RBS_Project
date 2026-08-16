import React from 'react';

/**
 * Reusable select input component
 */
const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  placeholder = 'Select...',
  disabled = false,
  valueKey = 'value',
  labelKey = 'label',
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optValue = typeof option === 'object' ? option[valueKey] : option;
          const optLabel = typeof option === 'object' ? option[labelKey] : option;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default SelectInput;
