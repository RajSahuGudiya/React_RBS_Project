import React from 'react';

/**
 * Header component - can be used standalone if needed
 * Main header is integrated in AppLayout
 */
const Header = ({ title, onToggleSidebar, user, onLogout }) => {
  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        {title && <h1 className="header-title">{title}</h1>}
      </div>

      <div className="header-right">
        <div className="d-flex align-items-center gap-2">
          <div className="user-avatar">{userInitials}</div>
          <span className="d-none d-md-inline">{user?.username}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
