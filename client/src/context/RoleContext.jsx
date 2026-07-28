import { createContext, useContext, useState, useEffect } from 'react';
import { getApiRole, setApiRole } from '../api.js';
import { ROLES } from '../constants/index.js';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState(getApiRole() || 'admin');

  useEffect(() => {
    setApiRole(role);
  }, [role]);

  const switchRole = (newRole) => {
    if (ROLES[newRole]) {
      setRole(newRole);
      setApiRole(newRole);
    }
  };

  const roleInfo = ROLES[role] || ROLES.admin;

  const permissions = {
    canEditCells: role === 'admin' || role === 'editor',
    canManageGoals: role === 'admin' || role === 'editor',
    canManageSummary: role === 'admin' || role === 'editor',
    canManageSlots: role === 'admin',
    canResetSystem: role === 'admin',
    canBackupRestore: role === 'admin',
    canExport: true,
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        roleInfo,
        permissions,
        switchRole,
        isAdmin: role === 'admin',
        isEditor: role === 'editor',
        isViewer: role === 'viewer',
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
