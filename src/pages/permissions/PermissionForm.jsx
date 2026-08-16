import React, { useState, useEffect } from 'react';
import FormInput from '../../components/forms/FormInput';
import SelectInput from '../../components/forms/SelectInput';
import { STATUS_OPTIONS } from '../../utils/constants';
import { validatePermissionForm, hasErrors } from '../../utils/validators';

const INITIAL_FORM = {
  permissionCode: '',
  permissionName: '',
  moduleName: '',
  description: '',
  status: 'ACTIVE',
};

/**
 * Permission create/edit form component
 */
const PermissionForm = ({ permission, onSave, onCancel, loading = false }) => {
  const isEdit = Boolean(permission?.id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (permission) {
      setFormData({
        permissionCode: permission.permissionCode || '',
        permissionName: permission.permissionName || '',
        moduleName: permission.moduleName || '',
        description: permission.description || '',
        status: permission.status || 'ACTIVE',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [permission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePermissionForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData, isEdit);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Permission Code"
            name="permissionCode"
            value={formData.permissionCode}
            onChange={handleChange}
            error={errors.permissionCode}
            required
            disabled={loading || isEdit}
            helpText="e.g., USER_VIEW, ROLE_CREATE"
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Permission Name"
            name="permissionName"
            value={formData.permissionName}
            onChange={handleChange}
            error={errors.permissionName}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Module Name"
            name="moduleName"
            value={formData.moduleName}
            onChange={handleChange}
            error={errors.moduleName}
            required
            disabled={loading}
          />
        </div>
        <div className="col-md-6">
          <SelectInput
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            error={errors.status}
            required
            disabled={loading}
          />
        </div>
      </div>

      <FormInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        as="textarea"
        rows={3}
        disabled={loading}
      />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-1"></i>
              Save
            </>
          )}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PermissionForm;
