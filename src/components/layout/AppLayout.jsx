import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

/**
 * Main application layout with sidebar, header, and content area
 */
const AppLayout = ({ children, pageTitle, breadcrumb = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    if (window.innerWidth >= 993) {
      setSidebarCollapsed((prev) => !prev);
      return;
    }
    setSidebarOpen((prev) => !prev);
  };
  const closeSidebar = () => setSidebarOpen(false);

  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      ></div>

      <Sidebar isOpen={sidebarOpen} isCollapsed={sidebarCollapsed} onClose={closeSidebar} />

      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="app-header">
          <div className="header-left">
            <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>
            <button className="sidebar-toggle d-none d-lg-inline-block" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>
            <div>
              {breadcrumb.length > 0 && (
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb breadcrumb-nav mb-0">
                    {breadcrumb.map((item, index) => (
                      <li
                        key={index}
                        className={`breadcrumb-item ${index === breadcrumb.length - 1 ? 'active' : ''}`}
                      >
                        {item.path && index < breadcrumb.length - 1 ? (
                          <Link to={item.path}>{item.label}</Link>
                        ) : (
                          item.label
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              {pageTitle && <h1 className="header-title">{pageTitle}</h1>}
            </div>
          </div>

          <div className="header-right">
            <div className="dropdown user-dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="user-avatar">{userInitials}</div>
                <span className="d-none d-md-inline">{user?.username}</span>
                <i className="bi bi-chevron-down small"></i>
              </button>
            {dropdownOpen && (
              <>
                <div
                  className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1020 }}
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <ul className="dropdown-menu dropdown-menu-end show">
                    <li>
                      <span className="dropdown-item-text">
                        <strong>{user?.username}</strong>
                        <br />
                        <small className="text-muted">{user?.email}</small>
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <span className="dropdown-item-text small">
                        Roles: {(user?.roles || []).join(', ') || 'None'}
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
              </>
            )}
            </div>
          </div>
        </header>

        <main className="app-content">
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
