# Role Based Security Frontend

Production-level frontend application for managing Role Based Security (RBS). This React application provides a clean, professional interface for managing users, roles, permissions, menus, and audit logs with permission-based access control.

For complete setup, architecture, module, REST API, cache, JWT expiry, renewal, and flow documentation, see [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md).

## Project Overview

The Role Based Security Management System frontend allows administrators to:

- Authenticate users via JWT-based login
- View dashboard summaries and quick actions
- Manage users with role assignments
- Manage roles with permission assignments
- Manage permissions by module
- Configure menu access with permission mapping
- View audit logs with filtering
- Control UI visibility based on user permissions

This is a **frontend-only** project designed to integrate with a Java Spring Boot backend via REST APIs.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| JavaScript | Programming language |
| HTML / CSS | Markup and styling |
| Bootstrap 5 | Responsive UI components |
| Bootstrap Icons | Icon library |
| React Router DOM | Client-side routing |
| Axios | REST API communication |
| Context API | Authentication and caching state |

## Folder Structure

```
src/
├── api/                    # REST API service files
│   ├── axiosConfig.js      # Centralized Axios configuration
│   ├── authApi.js
│   ├── dashboardApi.js
│   ├── userApi.js
│   ├── roleApi.js
│   ├── permissionApi.js
│   ├── menuApi.js
│   └── auditLogApi.js
├── assets/                 # Static assets
├── components/
│   ├── common/             # Reusable UI components
│   ├── forms/              # Form input components
│   ├── layout/             # App layout components
│   └── security/           # Route and permission guards
├── context/                # React Context providers
│   ├── AuthContext.jsx     # Authentication state
│   └── CacheContext.jsx    # Frontend caching
├── pages/                  # Page components
├── routes/                 # Route configuration
├── styles/                 # CSS files
├── utils/                  # Utility functions
├── App.jsx
└── index.js
```

## How to Run Frontend

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The application runs at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

## Configure Backend API URL

Set the backend API base URL in the `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

Copy `.env.example` to `.env` and update the URL to match your Spring Boot backend.

All API calls use this base URL through the centralized Axios configuration in `src/api/axiosConfig.js`.

## Login Flow

1. User enters username/email and password on the login page
2. Frontend calls `POST /api/auth/login`
3. On success, JWT token and user details are stored in localStorage
4. User is redirected to the dashboard
5. On subsequent requests, the JWT token is attached automatically via Axios interceptor

### Expected Login Response

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "roles": ["ADMIN"],
    "permissions": ["USER_VIEW", "USER_CREATE", "USER_UPDATE", "USER_DELETE"]
  }
}
```

## JWT Token Usage

- Token is stored in localStorage after login
- Axios request interceptor attaches `Authorization: Bearer <token>` to every API call
- Token expiry is checked before requests
- On 401 response, token is cleared and user is redirected to login
- On logout, token and cache are cleared

## Permission Based Menu Rendering

Sidebar menus are filtered based on the logged-in user's permissions:

- Each menu item has an associated `permissionCode`
- Menus without required permission are hidden
- API endpoint `GET /api/menus/my-menus` can provide user-specific menus
- Fallback default menus are used if API is unavailable

Example permission codes:

- `USER_VIEW`, `USER_CREATE`, `USER_UPDATE`, `USER_DELETE`
- `ROLE_VIEW`, `ROLE_CREATE`, `ROLE_UPDATE`, `ROLE_DELETE`
- `PERMISSION_VIEW`, `PERMISSION_CREATE`, `PERMISSION_UPDATE`, `PERMISSION_DELETE`
- `MENU_VIEW`, `AUDIT_VIEW`, `DASHBOARD_VIEW`, `SETTINGS_VIEW`

## Frontend Caching

Lightweight in-memory caching reduces repeated API calls:

| Cache Key | Data | TTL |
|---|---|---|
| roles | Role dropdown data | 5 min |
| permissions | Permission dropdown data | 5 min |
| menus | All menus | 5 min |
| myMenus | User-specific menus | 5 min |
| dashboard | Dashboard summary | 2 min |

Cache is automatically cleared after save/update/delete operations. Manual refresh buttons reload data from the API.

## API Endpoints

| Module | Endpoints |
|---|---|
| Auth | `POST /api/auth/login`, `POST /api/auth/logout` |
| Dashboard | `GET /api/dashboard/summary` |
| Users | `GET/POST/PUT/DELETE /api/users`, `PATCH /api/users/{id}/status`, `POST /api/users/{id}/roles` |
| Roles | `GET/POST/PUT/DELETE /api/roles`, `GET/POST /api/roles/{id}/permissions` |
| Permissions | `GET/POST/PUT/DELETE /api/permissions` |
| Menus | `GET/POST/PUT/DELETE /api/menus`, `GET /api/menus/my-menus` |
| Audit Logs | `GET /api/audit-logs` |

## How to Add a New Page

1. Create page component in `src/pages/`
2. Add permission constant in `src/utils/constants.js`
3. Add route in `src/routes/AppRoutes.jsx` with `ProtectedRoute`
4. Add sidebar menu item in `src/components/layout/Sidebar.jsx`
5. Create API service in `src/api/` if needed

Example route:

```jsx
<Route
  path="/reports"
  element={
    <ProtectedRoute permission={PERMISSIONS.REPORT_VIEW}>
      <ReportsPage />
    </ProtectedRoute>
  }
/>
```

## How to Add a New API Service

1. Create file in `src/api/` (e.g., `reportApi.js`)
2. Import `apiClient` from `./axiosConfig`
3. Export API methods using the shared Axios instance

Example:

```javascript
import apiClient from './axiosConfig';

export const reportApi = {
  getAll: (params) => apiClient.get('/reports', { params }),
  getById: (id) => apiClient.get(`/reports/${id}`),
};
```

## How to Add a New Permission Check

### Route Protection

```jsx
<ProtectedRoute permission={PERMISSIONS.REPORT_VIEW}>
  <ReportsPage />
</ProtectedRoute>
```

### UI Element Protection

```jsx
<PermissionGuard permission={PERMISSIONS.REPORT_CREATE}>
  <button>Add Report</button>
</PermissionGuard>
```

### Programmatic Check

```jsx
const { checkPermission } = useAuth();

if (checkPermission(PERMISSIONS.REPORT_DELETE)) {
  // allow delete action
}
```

## Error Handling

The application handles:

- Invalid login credentials
- Expired JWT tokens (auto redirect to login)
- Unauthorized access (403 - access denied message)
- Server unreachable (network error message)
- Backend validation errors
- Duplicate entries (409)
- Delete failures due to dependencies

## Responsive Design

The application is fully responsive for:

- Desktop (992px+)
- Tablet (768px - 991px)
- Mobile (< 768px)

Features include collapsible sidebar, responsive tables, and mobile-friendly forms.

## License

Private - Internal Use
