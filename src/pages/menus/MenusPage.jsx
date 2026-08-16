import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/common/DataTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import ToastMessage from '../../components/common/ToastMessage';
import ActionButtons from '../../components/common/ActionButtons';
import StatusBadge from '../../components/common/StatusBadge';
import PermissionGuard from '../../components/security/PermissionGuard';
import MenuForm from './MenuForm';
import menuApi from '../../api/menuApi';
import { useCache } from '../../context/CacheContext';
import { PERMISSIONS } from '../../utils/constants';
import { getErrorMessage } from '../../api/axiosConfig';

/**
 * Menu Access Management page
 */
const MenusPage = () => {
  const { getMenus, invalidateMenusCache } = useCache();

  const [menus, setMenus] = useState([]);
  const [allMenus, setAllMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const loadMenus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMenus(true);
      setMenus(data);
      setAllMenus(data);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load menus'), 'error');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, [getMenus]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const handleEdit = async (menu) => {
    try {
      const response = await menuApi.getById(menu.id);
      setSelectedMenu(response.data);
      setShowForm(true);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to load menu details'), 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!menuToDelete) return;
    setDeleting(true);
    try {
      await menuApi.delete(menuToDelete.id);
      showToast('Menu deleted successfully');
      invalidateMenusCache();
      setShowDeleteModal(false);
      setMenuToDelete(null);
      loadMenus();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete menu'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (formData, isEdit) => {
    setSaving(true);
    try {
      if (isEdit) {
        await menuApi.update(selectedMenu.id, formData);
        showToast('Menu updated successfully');
      } else {
        await menuApi.create(formData);
        showToast('Menu created successfully');
      }
      invalidateMenusCache();
      setShowForm(false);
      setSelectedMenu(null);
      loadMenus();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save menu'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const getParentName = (parentId) => {
    if (!parentId) return '-';
    const parent = allMenus.find((m) => m.id === parentId);
    return parent?.menuName || parentId;
  };

  const columns = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'menuName', label: 'Menu Name' },
    { key: 'path', label: 'Path' },
    {
      key: 'icon',
      label: 'Icon',
      render: (row) =>
        row.icon ? <i className={`bi ${row.icon}`}></i> : '-',
    },
    {
      key: 'parentMenuId',
      label: 'Parent Menu',
      render: (row) => getParentName(row.parentMenuId || row.parentId),
    },
    { key: 'displayOrder', label: 'Order' },
    { key: 'permissionCode', label: 'Permission Code' },
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
            setMenuToDelete(row);
            setShowDeleteModal(true);
          }}
          editPermission={PERMISSIONS.MENU_UPDATE}
          deletePermission={PERMISSIONS.MENU_DELETE}
        />
      ),
    },
  ];

  return (
    <AppLayout
      pageTitle="Menu Access Management"
      breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Menus' }]}
    >
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {!showForm ? (
        <div className="card">
          <div className="card-body">
            <div className="table-toolbar">
              <div className="table-toolbar-left">
                <PermissionGuard permission={PERMISSIONS.MENU_CREATE}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedMenu(null);
                      setShowForm(true);
                    }}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Add Menu
                  </button>
                </PermissionGuard>
              </div>
              <div className="table-toolbar-right">
                <button className="btn btn-outline-secondary btn-sm" onClick={loadMenus}>
                  <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                </button>
              </div>
            </div>

            <DataTable columns={columns} data={menus} loading={loading} />
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">{selectedMenu ? 'Edit Menu' : 'Add Menu'}</div>
          <div className="card-body">
            <MenuForm
              menu={selectedMenu}
              menus={allMenus}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelectedMenu(null);
              }}
              loading={saving}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Menu"
        message={`Are you sure you want to delete menu "${menuToDelete?.menuName}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setMenuToDelete(null);
        }}
        loading={deleting}
      />
    </AppLayout>
  );
};

export default MenusPage;
