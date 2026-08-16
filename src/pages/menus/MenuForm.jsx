import React, { useState, useEffect } from 'react';
import FormInput from '../../components/forms/FormInput';
import SelectInput from '../../components/forms/SelectInput';
import { STATUS_OPTIONS } from '../../utils/constants';
import { validateMenuForm, hasErrors } from '../../utils/validators';

const INITIAL_FORM = {
  menuName: '',
  path: '',
  icon: '',
  parentMenuId: '',
  displayOrder: 0,
  permissionCode: '',
  status: 'ACTIVE',
};

/**
 * Menu create/edit form component
 */
const MenuForm = ({ menu, menus = [], onSave, onCancel, loading = false }) => {
  const isEdit = Boolean(menu?.id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (menu) {
      setFormData({
        menuName: menu.menuName || '',
        path: menu.path || '',
        icon: menu.icon || '',
        parentMenuId: menu.parentMenuId || menu.parentId || '',
        displayOrder: menu.displayOrder ?? 0,
        permissionCode: menu.permissionCode || '',
        status: menu.status || 'ACTIVE',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [menu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateMenuForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder) || 0,
      parentMenuId: formData.parentMenuId || null,
    };
    onSave(payload, isEdit);
  };

  const parentMenuOptions = menus
    .filter((m) => m.id !== menu?.id)
    .map((m) => ({ value: m.id, label: m.menuName }));

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Menu Name"
            name="menuName"
            value={formData.menuName}
            onChange={handleChange}
            error={errors.menuName}
            required
            disabled={loading}
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Path"
            name="path"
            value={formData.path}
            onChange={handleChange}
            error={errors.path}
            required
            disabled={loading}
            helpText="e.g., /users, /roles"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <FormInput
            label="Icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            disabled={loading}
            helpText="Bootstrap icon class (e.g., bi-people)"
          />
        </div>
        <div className="col-md-4">
          <SelectInput
            label="Parent Menu"
            name="parentMenuId"
            value={formData.parentMenuId}
            onChange={handleChange}
            options={parentMenuOptions}
            placeholder="None (Top Level)"
            disabled={loading}
          />
        </div>
        <div className="col-md-4">
          <FormInput
            label="Display Order"
            name="displayOrder"
            type="number"
            value={formData.displayOrder}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Permission Code"
            name="permissionCode"
            value={formData.permissionCode}
            onChange={handleChange}
            disabled={loading}
            helpText="Permission required to view this menu"
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

export default MenuForm;
