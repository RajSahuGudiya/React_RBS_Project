import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import SearchBox from '../../components/common/SearchBox';
import FilterPanel from '../../components/common/FilterPanel';
import ConfirmModal from '../../components/common/ConfirmModal';
import ToastMessage from '../../components/common/ToastMessage';
import ActionButtons from '../../components/common/ActionButtons';
import StatusBadge from '../../components/common/StatusBadge';
import PermissionGuard from '../../components/security/PermissionGuard';
import SelectInput from '../../components/forms/SelectInput';
import RoleForm from './RoleForm';
import roleApi from '../../api/roleApi';
import { useCache } from '../../context/CacheContext';
import { PERMISSIONS, STATUS_OPTIONS, SYSTEM_ROLE_ADMIN, DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { getErrorMessage } from '../../api/axiosConfig';

/**
 * Role Management page
 */
const RolesPage = () => {
  const { getPermissions, invalidateRolesCache } = useCache();

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({ search: '', status: '' });
  const [appliedFilters, setAppliedFilters] = useState({});

  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const loadPermissions = useCallback(async () => {
    try {
      const data = await getPermissions();
      setPermissions(data);
    } catch {
      setPermissions([]);
    }
  }, [getPermissions]);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        search: appliedFilters.search,
        status: appliedFilters.status,
      };
      const response = await roleApi.getAll(params);
      const data = response.data;
      setRoles(data.content || data || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || (data.content || data || []).length);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load roles'), 'error');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleEdit = async (role) => {
    try {
      const [roleRes, permRes] = await Promise.all([
        roleApi.getById(role.id),
        roleApi.getPermissions(role.id),
      ]);
      setSelectedRole({
        ...roleRes.data,
        permissionIds: (permRes.data?.content || permRes.data || []).map((p) => p.id),
      });
      setShowForm(true);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load role details'), 'error');
    }
  };

  const handleDeleteClick = (role) => {
    if (role.roleCode === SYSTEM_ROLE_ADMIN) {
      showToast('System role ADMIN cannot be deleted', 'warning');
      return;
    }
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    setDeleting(true);
    try {
      await roleApi.delete(roleToDelete.id);
      showToast('Role deleted successfully');
      invalidateRolesCache();
      setShowDeleteModal(false);
      setRoleToDelete(null);
      loadRoles();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete role'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (formData, isEdit) => {
    setSaving(true);
    try {
      const { permissionIds, ...roleData } = formData;
      let roleId;

      if (isEdit) {
        await roleApi.update(selectedRole.id, roleData);
        roleId = selectedRole.id;
        showToast('Role updated successfully');
      } else {
        const response = await roleApi.create(roleData);
        roleId = response.data?.id;
        showToast('Role created successfully');
      }

      if (permissionIds?.length >= 0 && roleId) {
        await roleApi.assignPermissions(roleId, permissionIds);
      }

      invalidateRolesCache();
      setShowForm(false);
      setSelectedRole(null);
      loadRoles();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save role'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Role ID', width: '80px' },
    { key: 'roleCode', label: 'Role Code' },
    { key: 'roleName', label: 'Role Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'permissionCount',
      label: 'Permission Count',
      render: (row) => row.permissionCount ?? row.permissions?.length ?? 0,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <ActionButtons
          showView={false}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDeleteClick(row)}
          editPermission={PERMISSIONS.ROLE_UPDATE}
          deletePermission={PERMISSIONS.ROLE_DELETE}
          disableDelete={row.roleCode === SYSTEM_ROLE_ADMIN}
          deleteTooltip={
            row.roleCode === SYSTEM_ROLE_ADMIN ? 'System role cannot be deleted' : 'Delete'
          }
        />
      ),
    },
  ];

  return (
    <AppLayout
      pageTitle="Role Management"
      breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Roles' }]}
    >
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {!showForm ? (
        <>
          <FilterPanel
            onApply={() => {
              setAppliedFilters({ ...filters });
              setCurrentPage(0);
            }}
            onClear={() => {
              setFilters({ search: '', status: '' });
              setAppliedFilters({});
              setCurrentPage(0);
            }}
          >
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <SearchBox
                placeholder="Search roles..."
                value={filters.search}
                onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
              />
            </div>
            <div className="col-md-3">
              <SelectInput
                label="Status"
                name="status"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                options={STATUS_OPTIONS}
                placeholder="All Status"
              />
            </div>
          </FilterPanel>

          <div className="card">
            <div className="card-body">
              <div className="table-toolbar">
                <div className="table-toolbar-left">
                  <PermissionGuard permission={PERMISSIONS.ROLE_CREATE}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedRole(null);
                        setShowForm(true);
                      }}
                    >
                      <i className="bi bi-plus-lg me-1"></i> Add Role
                    </button>
                  </PermissionGuard>
                </div>
                <div className="table-toolbar-right">
                  <button className="btn btn-outline-secondary btn-sm" onClick={loadRoles}>
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                  </button>
                </div>
              </div>

              <DataTable columns={columns} data={roles} loading={loading} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(0);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="card-header">{selectedRole ? 'Edit Role' : 'Add Role'}</div>
          <div className="card-body">
            <RoleForm
              role={selectedRole}
              permissions={permissions}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelectedRole(null);
              }}
              loading={saving}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Role"
        message={`Are you sure you want to delete role "${roleToDelete?.roleName}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setRoleToDelete(null);
        }}
        loading={deleting}
      />
    </AppLayout>
  );
};

export default RolesPage;
