import React, { useState, useEffect } from 'react';
import FormInput from '../../components/forms/FormInput';
import SelectInput from '../../components/forms/SelectInput';
import MultiSelect from '../../components/forms/MultiSelect';
import { STATUS_OPTIONS } from '../../utils/constants';
import { validateRoleForm, hasErrors } from '../../utils/validators';

const INITIAL_FORM = {
  roleCode: '',
  roleName: '',
  description: '',
  status: 'ACTIVE',
  permissionIds: [],
};

/**
 * Role create/edit form component
 */
const RoleForm = ({ role, permissions = [], onSave, onCancel, loading = false }) => {
  const isEdit = Boolean(role?.id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role) {
      setFormData({
        roleCode: role.roleCode || '',
        roleName: role.roleName || '',
        description: role.description || '',
        status: role.status || 'ACTIVE',
        permissionIds: role.permissionIds || role.permissions?.map((p) => p.id || p) || [],
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRoleForm(formData);
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
            label="Role Code"
            name="roleCode"
            value={formData.roleCode}
            onChange={handleChange}
            error={errors.roleCode}
            required
            disabled={loading || isEdit}
            helpText="Unique identifier (e.g., ADMIN, MANAGER)"
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Role Name"
            name="roleName"
            value={formData.roleName}
            onChange={handleChange}
            error={errors.roleName}
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

      <MultiSelect
        label="Permissions"
        name="permissionIds"
        options={permissions}
        selectedValues={formData.permissionIds}
        onChange={handleChange}
        valueKey="id"
        labelKey="permissionName"
        codeKey="permissionCode"
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

export default RoleForm;
