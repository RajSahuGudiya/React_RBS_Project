import React, { useState, useEffect } from 'react';
import FormInput from '../../components/forms/FormInput';
import SelectInput from '../../components/forms/SelectInput';
import MultiSelect from '../../components/forms/MultiSelect';
import { STATUS_OPTIONS } from '../../utils/constants';
import { validateUserForm, hasErrors } from '../../utils/validators';

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  status: 'ACTIVE',
  roleIds: [],
};

/**
 * User create/edit form component
 */
const UserForm = ({ user, roles = [], onSave, onCancel, loading = false }) => {
  const isEdit = Boolean(user?.id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        status: user.status || 'ACTIVE',
        roleIds: user.roleIds || user.roles?.map((r) => r.id || r) || [],
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(formData, !isEdit);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    const payload = { ...formData };
    if (isEdit) delete payload.password;
    onSave(payload, isEdit);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
            disabled={loading}
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
            disabled={loading || isEdit}
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            disabled={loading}
          />
        </div>
      </div>

      {!isEdit && (
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={loading}
        />
      )}

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
        label="Assigned Roles"
        name="roleIds"
        options={roles}
        selectedValues={formData.roleIds}
        onChange={handleChange}
        valueKey="id"
        labelKey="roleName"
        codeKey="roleCode"
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

export default UserForm;
