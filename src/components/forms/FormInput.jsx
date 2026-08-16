import React from 'react';

/**
 * Reusable form input component with validation
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  helpText,
  as = 'input',
  rows = 3,
}) => {
  const InputComponent = as === 'textarea' ? 'textarea' : 'input';
  const inputProps = {
    id: name,
    name,
    className: `form-control ${error ? 'is-invalid' : ''}`,
    value: value ?? '',
    onChange,
    placeholder,
    disabled,
  };

  if (as === 'textarea') {
    inputProps.rows = rows;
  } else {
    inputProps.type = type;
  }

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <InputComponent {...inputProps} />
      {error && <div className="form-error">{error}</div>}
      {helpText && !error && <div className="form-text">{helpText}</div>}
    </div>
  );
};

export default FormInput;
