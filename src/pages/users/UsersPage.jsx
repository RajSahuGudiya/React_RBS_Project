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
import UserForm from './UserForm';
import UserDetails from './UserDetails';
import userApi from '../../api/userApi';
import { useCache } from '../../context/CacheContext';
import { PERMISSIONS, STATUS_OPTIONS, DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { getErrorMessage } from '../../api/axiosConfig';

/**
 * User Management page
 */
const UsersPage = () => {
  const { getRoles, invalidateUsersCache } = useCache();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    username: '',
    email: '',
    role: '',
    status: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const loadRoles = useCallback(async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch {
      setRoles([]);
    }
  }, [getRoles]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        search: appliedFilters.search,
        username: appliedFilters.username,
        email: appliedFilters.email,
        role: appliedFilters.role,
        status: appliedFilters.status,
      };
      const response = await userApi.getAll(params);
      const data = response.data;
      setUsers(data.content || data || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || (data.content || data || []).length);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load users'), 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(0);
  };

  const clearFilters = () => {
    const empty = { search: '', username: '', email: '', role: '', status: '' };
    setFilters(empty);
    setAppliedFilters(empty);
    setCurrentPage(0);
  };

  const handleRefresh = () => loadUsers();

  const handleAdd = () => {
    setSelectedUser(null);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleEdit = async (user) => {
    try {
      const response = await userApi.getById(user.id);
      setSelectedUser(response.data);
      setShowForm(true);
      setShowDetails(false);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load user details'), 'error');
    }
  };

  const handleView = async (user) => {
    try {
      const response = await userApi.getById(user.id);
      setSelectedUser(response.data);
      setShowDetails(true);
      setShowForm(false);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load user details'), 'error');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userApi.delete(userToDelete.id);
      showToast('User deleted successfully');
      invalidateUsersCache();
      setShowDeleteModal(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete user'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await userApi.updateStatus(user.id, newStatus);
      showToast(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`);
      invalidateUsersCache();
      loadUsers();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to update user status'), 'error');
    }
  };

  const handleSave = async (formData, isEdit) => {
    setSaving(true);
    try {
      const { roleIds, ...userData } = formData;
      let userId;

      if (isEdit) {
        await userApi.update(selectedUser.id, userData);
        userId = selectedUser.id;
        showToast('User updated successfully');
      } else {
        const response = await userApi.create(userData);
        userId = response.data?.id;
        showToast('User created successfully');
      }

      if (roleIds?.length > 0 && userId) {
        await userApi.assignRoles(userId, roleIds);
      }

      invalidateUsersCache();
      setShowForm(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save user'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'id', label: 'User ID', width: '80px' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    {
      key: 'fullName',
      label: 'Full Name',
      render: (row) => [row.firstName, row.lastName].filter(Boolean).join(' ') || '-',
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (row) =>
        (row.roles || []).map((r, i) => (
          <span key={i} className="badge bg-primary me-1">
            {typeof r === 'object' ? r.roleName || r.roleCode : r}
          </span>
        )),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      render: (row) => row.createdDate || row.createdAt || '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <ActionButtons
          onView={() => handleView(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDeleteClick(row)}
          viewPermission={PERMISSIONS.USER_VIEW}
          editPermission={PERMISSIONS.USER_UPDATE}
          deletePermission={PERMISSIONS.USER_DELETE}
          extraActions={[
            {
              permission: PERMISSIONS.USER_UPDATE,
              icon: row.status === 'ACTIVE' ? 'bi-pause-circle' : 'bi-play-circle',
              title: row.status === 'ACTIVE' ? 'Deactivate' : 'Activate',
              variant: 'warning',
              onClick: () => handleStatusToggle(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AppLayout
      pageTitle="User Management"
      breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Users' }]}
    >
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {!showForm && !showDetails && (
        <>
          <FilterPanel onApply={applyFilters} onClear={clearFilters}>
            <div className="col-md-3">
              <label className="form-label">Search</label>
              <SearchBox
                placeholder="Search users..."
                value={filters.search}
                onChange={(val) => handleFilterChange('search', val)}
              />
            </div>
            <div className="col-md-2">
              <SelectInput
                label="Status"
                name="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={STATUS_OPTIONS}
                placeholder="All Status"
              />
            </div>
            <div className="col-md-3">
              <SelectInput
                label="Role"
                name="role"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                options={roles.map((r) => ({ value: r.roleCode || r.id, label: r.roleName }))}
                placeholder="All Roles"
              />
            </div>
          </FilterPanel>

          <div className="card">
            <div className="card-body">
              <div className="table-toolbar">
                <div className="table-toolbar-left">
                  <PermissionGuard permission={PERMISSIONS.USER_CREATE}>
                    <button className="btn btn-primary btn-sm" onClick={handleAdd}>
                      <i className="bi bi-plus-lg me-1"></i> Add User
                    </button>
                  </PermissionGuard>
                </div>
                <div className="table-toolbar-right">
                  <button className="btn btn-outline-secondary btn-sm" onClick={handleRefresh}>
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                  </button>
                </div>
              </div>

              <DataTable
                columns={columns}
                data={users}
                loading={loading}
                emptyMessage="No users found. Try adjusting your filters."
              />

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
      )}

      {showForm && (
        <div className="card">
          <div className="card-header">
            {selectedUser ? 'Edit User' : 'Add User'}
          </div>
          <div className="card-body">
            <UserForm
              user={selectedUser}
              roles={roles}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelectedUser(null);
              }}
              loading={saving}
            />
          </div>
        </div>
      )}

      {showDetails && (
        <div className="card">
          <div className="card-header">User Details</div>
          <div className="card-body">
            <UserDetails
              user={selectedUser}
              onClose={() => {
                setShowDetails(false);
                setSelectedUser(null);
              }}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={showDeleteModal}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.username}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        loading={deleting}
      />
    </AppLayout>
  );
};

export default UsersPage;
