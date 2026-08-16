import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCache } from '../../context/CacheContext';
import { filterMenusByPermission } from '../../utils/permissionUtils';
import { APP_NAME } from '../../utils/constants';

/**
 * Default sidebar menu configuration
 * Menus are filtered based on user permissions
 */
const DEFAULT_MENUS = [
  { id: 1, menuName: 'Dashboard', path: '/dashboard', icon: 'bi-speedometer2', permissionCode: 'DASHBOARD_VIEW' },
  { id: 2, menuName: 'User Management', path: '/users', icon: 'bi-people', permissionCode: 'USER_VIEW' },
  { id: 3, menuName: 'Role Management', path: '/roles', icon: 'bi-shield-check', permissionCode: 'ROLE_VIEW' },
  { id: 4, menuName: 'Permission Management', path: '/permissions', icon: 'bi-key', permissionCode: 'PERMISSION_VIEW' },
  { id: 5, menuName: 'Menu Access Management', path: '/menus', icon: 'bi-menu-button-wide', permissionCode: 'MENU_VIEW' },
  { id: 6, menuName: 'Audit Logs', path: '/audit-logs', icon: 'bi-journal-text', permissionCode: 'AUDIT_VIEW' },
  { id: 7, menuName: 'Settings', path: '/settings', icon: 'bi-gear', permissionCode: 'SETTINGS_VIEW' },
];

/**
 * Sidebar navigation component
 * Permission-based menu rendering - hides menus user cannot access
 */
const Sidebar = ({ isOpen, isCollapsed, onClose }) => {
  const { permissions, roles } = useAuth();
  const { getMyMenus } = useCache();
  const [menus, setMenus] = useState(DEFAULT_MENUS);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const apiMenus = await getMyMenus();
        if (apiMenus && apiMenus.length > 0) {
          setMenus(apiMenus);
        }
      } catch {
        // Fallback to default menus filtered by permissions
        setMenus(DEFAULT_MENUS);
      }
    };
    loadMenus();
  }, [getMyMenus]);

  // Permission-based menu rendering; ADMIN role can access every configured menu.
  const visibleMenus = filterMenusByPermission(menus, permissions, roles);

  return (
    <aside className={`app-sidebar ${isOpen ? 'show' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <i className="bi bi-shield-lock"></i>
        <span>{APP_NAME}</span>
      </div>

      <nav className="sidebar-nav">
        {visibleMenus.map((menu) => (
          <NavLink
            key={menu.id || menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <i className={`bi ${menu.icon || 'bi-circle'}`}></i>
            {menu.menuName}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
