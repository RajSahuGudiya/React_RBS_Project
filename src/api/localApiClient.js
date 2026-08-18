import auditLogsSeed from '../mockJsonData/audit-logs.json';
import authUsersSeed from '../mockJsonData/auth-users.json';
import dashboardSeed from '../mockJsonData/dashboard.json';
import menusSeed from '../mockJsonData/menus.json';
import permissionsSeed from '../mockJsonData/permissions.json';
import rolesSeed from '../mockJsonData/roles.json';
import usersSeed from '../mockJsonData/users.json';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';

const clone = (value) => JSON.parse(JSON.stringify(value));

const roleCodeOf = (role) => role.roleCode || role.name || role.roleName;
const roleNameOf = (role) => role.roleName || role.name || role.roleCode;
const permissionCodeOf = (permission) => permission.permissionCode || permission.code;
const permissionNameOf = (permission) => permission.permissionName || permission.name;

const normalizeRole = (role) => ({
  ...role,
  name: role.name || role.roleCode,
  roleCode: roleCodeOf(role),
  roleName: roleNameOf(role),
  permissionCount: role.permissionCount ?? role.permissionIds?.length ?? role.permissions?.length ?? 0,
});

const normalizePermission = (permission) => ({
  ...permission,
  code: permission.code || permission.permissionCode,
  name: permission.name || permission.permissionName,
  permissionCode: permissionCodeOf(permission),
  permissionName: permissionNameOf(permission),
});

const normalizeDashboard = (summary) => ({
  ...summary,
  recentUpdates: (summary.recentUpdates || []).map((item) => ({
    ...item,
    updatedAt: item.updatedAt || item.timestamp,
  })),
});

const normalizeAuditLog = (log) => ({
  ...log,
  createdAt: log.createdAt || log.timestamp,
});

const store = {
  users: clone(usersSeed),
  roles: clone(rolesSeed).map(normalizeRole),
  permissions: clone(permissionsSeed).map(normalizePermission),
  menus: clone(menusSeed),
  auditLogs: clone(auditLogsSeed).map(normalizeAuditLog),
  dashboard: clone(dashboardSeed).map(normalizeDashboard),
  authUsers: clone(authUsersSeed),
  tokens: [],
};

const response = (data, status = 200) =>
  Promise.resolve({
    data: clone(data),
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    headers: {},
    config: {},
  });

const reject = (status, message) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  error.userMessage = message;
  return Promise.reject(error);
};

const getStoredUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

const requireAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  return getStoredUser();
};

const permissionsForUser = (user) => {
  if (!user) return [];
  if ((user.roles || []).includes('ADMIN')) {
    return store.permissions.map(permissionCodeOf);
  }

  const permissionIds = new Set();
  (user.roleIds || []).forEach((roleId) => {
    const role = store.roles.find((item) => Number(item.id) === Number(roleId));
    (role?.permissionIds || []).forEach((permissionId) => permissionIds.add(Number(permissionId)));
  });

  return store.permissions
    .filter((permission) => permissionIds.has(Number(permission.id)))
    .map(permissionCodeOf);
};

const paginate = (items, params = {}) => {
  const page = Math.max(0, Number(params.page || 0));
  const size = Math.max(1, Number(params.size || 10));
  const totalElements = items.length;

  return {
    content: items.slice(page * size, page * size + size),
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    number: page,
    size,
  };
};

const matchesText = (value, expected) =>
  String(value || '').toLowerCase() === String(expected || '').toLowerCase();

const filterCollection = (resource, params = {}) => {
  let items = [...resource];
  const search = String(params.search || '').toLowerCase();

  if (search) {
    items = items.filter((item) => JSON.stringify(item).toLowerCase().includes(search));
  }
  if (params.username) items = items.filter((item) => matchesText(item.username, params.username));
  if (params.email) items = items.filter((item) => matchesText(item.email, params.email));
  if (params.role) {
    items = items.filter(
      (item) =>
        (item.roles || []).some((role) => matchesText(role, params.role)) ||
        (item.roleIds || []).some((roleId) => matchesText(roleId, params.role))
    );
  }
  if (params.status) items = items.filter((item) => matchesText(item.status, params.status));
  if (params.moduleName) {
    items = items.filter((item) =>
      String(item.moduleName || '').toLowerCase().includes(String(params.moduleName).toLowerCase())
    );
  }

  return items;
};

const nextId = (items) => Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1;

const collectionFor = (resource) => {
  switch (resource) {
    case 'audit-logs':
      return store.auditLogs;
    case 'auth-users':
      return store.authUsers;
    default:
      return store[resource];
  }
};

const getById = (resource, id) => {
  const collection = collectionFor(resource);
  if (!collection) return null;
  return collection.find((item) => Number(item.id) === Number(id));
};

const createItem = (resource, data) => {
  const collection = collectionFor(resource);
  if (!collection) return null;
  let item = { id: nextId(collection), ...data };

  if (resource === 'roles') item = normalizeRole({ ...item, name: item.name || item.roleCode });
  if (resource === 'permissions') {
    item = normalizePermission({ ...item, code: item.code || item.permissionCode });
  }

  collection.push(item);
  return item;
};

const updateItem = (resource, id, data) => {
  const collection = collectionFor(resource);
  if (!collection) return null;
  const index = collection.findIndex((item) => Number(item.id) === Number(id));
  if (index < 0) return null;

  let updated = { ...collection[index], ...data };
  if (resource === 'roles') updated = normalizeRole({ ...updated, name: updated.name || updated.roleCode });
  if (resource === 'permissions') {
    updated = normalizePermission({ ...updated, code: updated.code || updated.permissionCode });
  }

  collection[index] = updated;
  return updated;
};

const deleteItem = (resource, id) => {
  const collection = collectionFor(resource);
  if (!collection) return false;
  const index = collection.findIndex((item) => Number(item.id) === Number(id));
  if (index < 0) return false;
  collection.splice(index, 1);
  return true;
};

const parsePath = (url) =>
  String(url)
    .split('?')[0]
    .replace(/^\/api/, '')
    .split('/')
    .filter(Boolean);

const handleLogin = (credentials = {}) => {
  const authUser = store.authUsers.find(
    (item) => item.username === credentials.username && item.password === credentials.password
  );
  if (!authUser) return reject(401, 'Invalid username or password');

  const user = store.users.find((item) => Number(item.id) === Number(authUser.userId));
  if (!user || user.status !== 'ACTIVE') {
    return reject(403, 'User account is inactive');
  }

  return response({
    accessToken: `local-json-token-${user.username}-${Date.now()}`,
    tokenType: 'Bearer',
    expiresIn: 3600,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles || [],
      roleIds: user.roleIds || [],
      permissions: permissionsForUser(user),
    },
  });
};

const authGuard = () => {
  const user = requireAuth();
  return user ? null : reject(401, 'Invalid or missing token');
};

const localApiClient = {
  get: (url, config = {}) => {
    const authError = authGuard();
    if (authError) return authError;

    const params = config.params || {};
    const [resource, id, child] = parsePath(url);

    if (resource === 'auth' && id === 'profile') {
      const user = getStoredUser();
      return response(user);
    }

    if (resource === 'dashboard' && id === 'summary') {
      return response(store.dashboard[0] || {});
    }

    if (resource === 'menus' && id === 'my-menus') {
      const user = getStoredUser();
      const activeMenus = store.menus
        .filter((menu) => menu.status === 'ACTIVE')
        .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));

      if ((user?.roles || []).includes('ADMIN')) return response(activeMenus);

      const permissions = new Set(permissionsForUser(user));
      return response(
        activeMenus.filter((menu) => !menu.permissionCode || permissions.has(menu.permissionCode))
      );
    }

    if (resource === 'roles' && id && child === 'permissions') {
      const role = getById('roles', id);
      if (!role) return reject(404, 'Role not found');
      const permissionIds = new Set((role.permissionIds || []).map(Number));
      return response(store.permissions.filter((permission) => permissionIds.has(Number(permission.id))));
    }

    if (['users', 'roles', 'permissions'].includes(resource) && !id) {
      return response(paginate(filterCollection(collectionFor(resource), params), params));
    }

    if (resource === 'audit-logs' && !id) {
      let items = filterCollection(store.auditLogs, params);
      if (params.startDate) {
        items = items.filter((item) => String(item.timestamp || item.createdAt || '') >= params.startDate);
      }
      if (params.endDate) {
        items = items.filter((item) => String(item.timestamp || item.createdAt || '') <= params.endDate);
      }
      return response(paginate(items, params));
    }

    if (resource && id) {
      const item = getById(resource, id);
      if (!item) return reject(404, 'Resource not found');
      return response(item);
    }

    const collection = collectionFor(resource);
    if (collection) return response(collection);

    return reject(404, 'Resource not found');
  },

  post: (url, data = {}) => {
    const [resource, id, child] = parsePath(url);

    if (resource === 'auth' && id === 'login') return handleLogin(data);

    const authError = authGuard();
    if (authError) return authError;

    if (resource === 'auth' && id === 'logout') return response({ message: 'Logged out successfully' });

    if (resource === 'roles' && id && child === 'permissions') {
      const role = getById('roles', id);
      if (!role) return reject(404, 'Role not found');
      return response(
        updateItem('roles', id, {
          permissionIds: (data.permissionIds || []).map(Number),
        })
      );
    }

    if (resource === 'users' && id && child === 'roles') {
      const user = getById('users', id);
      if (!user) return reject(404, 'User not found');
      const roleIds = (data.roleIds || []).map(Number);
      const roles = store.roles
        .filter((role) => roleIds.includes(Number(role.id)))
        .map(roleCodeOf);
      return response(updateItem('users', id, { roleIds, roles }));
    }

    const item = createItem(resource, data);
    if (!item) return reject(404, 'Resource not found');
    return response(item, 201);
  },

  put: (url, data = {}) => {
    const authError = authGuard();
    if (authError) return authError;

    const [resource, id] = parsePath(url);
    const item = updateItem(resource, id, data);
    if (!item) return reject(404, 'Resource not found');
    return response(item);
  },

  patch: (url, data = {}) => {
    const authError = authGuard();
    if (authError) return authError;

    const [resource, id, child] = parsePath(url);
    if (resource === 'users' && id && child === 'status') {
      if (!['ACTIVE', 'INACTIVE'].includes(data.status)) {
        return reject(422, 'status must be ACTIVE or INACTIVE');
      }
      const user = updateItem('users', id, { status: data.status });
      if (!user) return reject(404, 'User not found');
      return response(user);
    }

    const item = updateItem(resource, id, data);
    if (!item) return reject(404, 'Resource not found');
    return response(item);
  },

  delete: (url) => {
    const authError = authGuard();
    if (authError) return authError;

    const [resource, id] = parsePath(url);
    if (!deleteItem(resource, id)) return reject(404, 'Resource not found');
    return response({ message: 'Deleted successfully' });
  },
};

export default localApiClient;
