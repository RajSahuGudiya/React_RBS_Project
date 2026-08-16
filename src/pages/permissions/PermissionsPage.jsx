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
import PermissionForm from './PermissionForm';
import permissionApi from '../../api/permissionApi';
import { useCache } from '../../context/CacheContext';
import { PERMISSIONS, STATUS_OPTIONS, DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { getErrorMessage } from '../../api/axiosConfig';

const MODULE_OPTIONS = [
  { value: 'USER', label: 'User Management' },
  { value: 'ROLE', label: 'Role Management' },
  { value: 'PERMISSION', label: 'Permission Management' },
  { value: 'MENU', label: 'Menu Management' },
  { value: 'AUDIT', label: 'Audit Logs' },
  { value: 'DASHBOARD', label: 'Dashboard' },
  { value: 'SETTINGS', label: 'Settings' },
];

/**
 * Permission Management page
 */
const PermissionsPage = () => {
  const { invalidatePermissionsCache } = useCache();

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({ search: '', moduleName: '', status: '' });
  const [appliedFilters, setAppliedFilters] = useState({});

  const [showForm, setShowForm] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const loadPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        search: appliedFilters.search,
        moduleName: appliedFilters.moduleName,
        status: appliedFilters.status,
      };
      const response = await permissionApi.getAll(params);
      const data = response.data;
      setPermissions(data.content || data || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || (data.content || data || []).length);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load permissions'), 'error');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const handleEdit = async (permission) => {
    try {
      const response = await permissionApi.getById(permission.id);
      setSelectedPermission(response.data);
      setShowForm(true);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load permission details'), 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!permissionToDelete) return;
    setDeleting(true);
    try {
      await permissionApi.delete(permissionToDelete.id);
      showToast('Permission deleted successfully');
      invalidatePermissionsCache();
      setShowDeleteModal(false);
      setPermissionToDelete(null);
      loadPermissions();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete permission'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (formData, isEdit) => {
    setSaving(true);
    try {
      if (isEdit) {
        await permissionApi.update(selectedPermission.id, formData);
        showToast('Permission updated successfully');
      } else {
        await permissionApi.create(formData);
        showToast('Permission created successfully');
      }
      invalidatePermissionsCache();
      setShowForm(false);
      setSelectedPermission(null);
      loadPermissions();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save permission'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Permission ID', width: '100px' },
    { key: 'permissionCode', label: 'Permission Code' },
    { key: 'permissionName', label: 'Permission Name' },
    { key: 'moduleName', label: 'Module Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <ActionButtons
          showView={false}
          onEdit={() => handleEdit(row)}
          onDelete={() => {
            setPermissionToDelete(row);
            setShowDeleteModal(true);
          }}
          editPermission={PERMISSIONS.PERMISSION_UPDATE}
          deletePermission={PERMISSIONS.PERMISSION_DELETE}
        />
      ),
    },
  ];

  return (
    <AppLayout
      pageTitle="Permission Management"
      breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Permissions' }]}
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
              setFilters({ search: '', moduleName: '', status: '' });
              setAppliedFilters({});
              setCurrentPage(0);
            }}
          >
            <div className="col-md-3">
              <label className="form-label">Search</label>
              <SearchBox
                placeholder="Search permissions..."
                value={filters.search}
                onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
              />
            </div>
            <div className="col-md-3">
              <SelectInput
                label="Module"
                name="moduleName"
                value={filters.moduleName}
                onChange={(e) => setFilters((prev) => ({ ...prev, moduleName: e.target.value }))}
                options={MODULE_OPTIONS}
                placeholder="All Modules"
              />
            </div>
            <div className="col-md-2">
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
                  <PermissionGuard permission={PERMISSIONS.PERMISSION_CREATE}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedPermission(null);
                        setShowForm(true);
                      }}
                    >
                      <i className="bi bi-plus-lg me-1"></i> Add Permission
                    </button>
                  </PermissionGuard>
                </div>
                <div className="table-toolbar-right">
                  <button className="btn btn-outline-secondary btn-sm" onClick={loadPermissions}>
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                  </button>
                </div>
              </div>

              <DataTable columns={columns} data={permissions} loading={loading} />
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
          <div className="card-header">
            {selectedPermission ? 'Edit Permission' : 'Add Permission'}
          </div>
          <div className="card-body">
            <PermissionForm
              permission={selectedPermission}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelectedPermission(null);
              }}
              loading={saving}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Permission"
        message={`Are you sure you want to delete permission "${permissionToDelete?.permissionCode}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setPermissionToDelete(null);
        }}
        loading={deleting}
      />
    </AppLayout>
  );
};

export default PermissionsPage;
