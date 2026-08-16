/**
 * Frontend form validation utilities
 */

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateRequired = (value, fieldName) => {
  if (!isRequired(value)) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateEmail = (email) => {
  if (!isRequired(email)) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password, isCreate = true) => {
  if (isCreate && !isRequired(password)) return 'Password is required';
  if (password && password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

/**
 * Validate user form fields
 */
export const validateUserForm = (formData, isCreate = false) => {
  const errors = {};

  const firstNameError = validateRequired(formData.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequired(formData.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  const usernameError = validateRequired(formData.username, 'Username');
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password, isCreate);
  if (passwordError) errors.password = passwordError;

  const statusError = validateRequired(formData.status, 'Status');
  if (statusError) errors.status = statusError;

  return errors;
};

/**
 * Validate role form fields
 */
export const validateRoleForm = (formData) => {
  const errors = {};

  const codeError = validateRequired(formData.roleCode, 'Role code');
  if (codeError) errors.roleCode = codeError;

  const nameError = validateRequired(formData.roleName, 'Role name');
  if (nameError) errors.roleName = nameError;

  const statusError = validateRequired(formData.status, 'Status');
  if (statusError) errors.status = statusError;

  return errors;
};

/**
 * Validate permission form fields
 */
export const validatePermissionForm = (formData) => {
  const errors = {};

  const codeError = validateRequired(formData.permissionCode, 'Permission code');
  if (codeError) errors.permissionCode = codeError;

  const nameError = validateRequired(formData.permissionName, 'Permission name');
  if (nameError) errors.permissionName = nameError;

  const moduleError = validateRequired(formData.moduleName, 'Module name');
  if (moduleError) errors.moduleName = moduleError;

  const statusError = validateRequired(formData.status, 'Status');
  if (statusError) errors.status = statusError;

  return errors;
};

/**
 * Validate menu form fields
 */
export const validateMenuForm = (formData) => {
  const errors = {};

  const nameError = validateRequired(formData.menuName, 'Menu name');
  if (nameError) errors.menuName = nameError;

  const pathError = validateRequired(formData.path, 'Path');
  if (pathError) errors.path = pathError;

  const statusError = validateRequired(formData.status, 'Status');
  if (statusError) errors.status = statusError;

  return errors;
};

/**
 * Validate login form fields
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  const usernameError = validateRequired(formData.username, 'Username or email');
  if (usernameError) errors.username = usernameError;

  const passwordError = validateRequired(formData.password, 'Password');
  if (passwordError) errors.password = passwordError;

  return errors;
};

/**
 * Check if errors object has any validation errors
 */
export const hasErrors = (errors) => Object.keys(errors).length > 0;
