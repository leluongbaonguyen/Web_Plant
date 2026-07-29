import { createContext, useContext, useState, useEffect } from 'react';
import { getApiRole, setApiRole, loginAgent, setAuthToken, getAuthToken } from '../api.js';
import { ROLES } from '../constants/index.js';

const RoleContext = createContext(null);

export const PERMISSION_MATRIX = {
  admin: [
    'PERM_READ_SCHEDULE',
    'PERM_EDIT_CELL',
    'PERM_DELETE_SLOT',
    'PERM_MANAGE_GOALS',
    'PERM_MANAGE_AGENTS',
    'PERM_RESET_SYSTEM',
    'PERM_KANGAROO_SYNC',
    'PERM_VIEW_AUDIT_LOGS',
    'PERM_EXPORT_WORD',
    'PERM_SYSTEM_UPGRADE',
    'PERM_MAINTENANCE_TOGGLE',
    'PERM_BACKUP_RESTORE',
  ],
  editor: [
    'PERM_READ_SCHEDULE',
    'PERM_EDIT_CELL',
    'PERM_MANAGE_GOALS',
    'PERM_EXPORT_WORD',
  ],
  viewer: [
    'PERM_READ_SCHEDULE',
    'PERM_EDIT_CELL',
    'PERM_DELETE_SLOT',
    'PERM_MANAGE_GOALS',
  ],
};

export function RoleProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('chrono_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => getAuthToken() || '');
  const [role, setRole] = useState(() => user?.role || getApiRole() || 'admin');

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
      setApiRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('chrono_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('chrono_unauthorized', handleUnauthorized);
  }, []);

  const login = async (username, password) => {
    const res = await loginAgent(username, password);
    if (res.ok && res.token && res.user) {
      setAuthToken(res.token);
      setApiRole(res.user.role);
      setUser(res.user);
      setToken(res.token);
      setRole(res.user.role);
      localStorage.setItem('chrono_user', JSON.stringify(res.user));
    }
    return res;
  };

  const loginWithSession = (userData, userToken) => {
    setAuthToken(userToken);
    setApiRole(userData.role);
    setUser(userData);
    setToken(userToken);
    setRole(userData.role);
    localStorage.setItem('chrono_user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuthToken('');
    setUser(null);
    setToken('');
    localStorage.removeItem('chrono_user');
  };

  const switchRole = (newRole) => {
    if (ROLES[newRole]) {
      setRole(newRole);
      setApiRole(newRole);
      if (user) {
        const updated = { ...user, role: newRole };
        setUser(updated);
        localStorage.setItem('chrono_user', JSON.stringify(updated));
      }
    }
  };

  const isAuthenticated = Boolean(user && token);
  const roleInfo = ROLES[role] || ROLES.admin;
  const activePermissions = PERMISSION_MATRIX[role] || PERMISSION_MATRIX.viewer;

  const hasPerm = (permName) => activePermissions.includes(permName);

  const permissions = {
    canEditCells: hasPerm('PERM_EDIT_CELL'),
    canManageGoals: hasPerm('PERM_MANAGE_GOALS'),
    canManageSummary: hasPerm('PERM_MANAGE_GOALS'),
    canManageSlots: hasPerm('PERM_DELETE_SLOT'),
    canResetSystem: hasPerm('PERM_RESET_SYSTEM'),
    canBackupRestore: hasPerm('PERM_BACKUP_RESTORE'),
    canManageAgents: hasPerm('PERM_MANAGE_AGENTS'),
    canKangarooSync: hasPerm('PERM_KANGAROO_SYNC'),
    canExport: hasPerm('PERM_EXPORT_WORD'),
    activePermissions,
    hasPerm,
  };

  return (
    <RoleContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        loginWithSession,
        logout,
        role,
        roleInfo,
        permissions,
        switchRole,
        isAdmin: role === 'admin',
        isEditor: role === 'editor',
        isViewer: role === 'viewer',
        hasPerm,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
