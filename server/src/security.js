import crypto from 'node:crypto';

// Secret key for security HMAC signing
const SECURITY_SECRET = process.env.SECURITY_SECRET || 'chrono-flow-quantum-military-key-998877665544332211';

// Rate Limiting Store for Brute-Force Protection
const loginAttemptsMap = new Map();
const BLOCKED_IPS = new Set();

/**
 * Generate Secure Signed Authentication Token (JWT-like HMAC Token)
 */
export function createSecurityToken(user) {
  const payload = {
    uid: user.id,
    username: user.username,
    role: user.role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h validity
  };

  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr).toString('base64url');
  const signature = crypto.createHmac('sha256', SECURITY_SECRET).update(base64Payload).digest('base64url');

  return `chrono-sec.${base64Payload}.${signature}`;
}

/**
 * Verify & Decode Security Token
 */
export function verifySecurityToken(tokenStr) {
  if (!tokenStr || !tokenStr.startsWith('chrono-sec.')) return null;

  try {
    const parts = tokenStr.split('.');
    if (parts.length !== 3) return null;

    const [prefix, base64Payload, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SECURITY_SECRET).update(base64Payload).digest('base64url');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      const jsonStr = Buffer.from(base64Payload, 'base64url').toString('utf8');
      const payload = JSON.parse(jsonStr);

      if (payload.expiresAt && Date.now() > payload.expiresAt) {
        return null; // Expired
      }
      return payload;
    }
  } catch (err) {
    return null;
  }
  return null;
}

/**
 * Ultra-Detailed 12-Point Permission Matrix Definition
 */
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
    'PERM_EXPORT_WORD',
  ],
};

/**
 * Check if a role has specific permission
 */
export function hasPermission(role, permissionName) {
  const allowed = PERMISSION_MATRIX[role] || [];
  return allowed.includes(permissionName);
}

/**
 * Brute-force Attack Protection Middleware
 */
export function checkRateLimit(ip) {
  if (BLOCKED_IPS.has(ip)) {
    return { blocked: true, message: 'Địa chỉ IP của bạn bị khóa tạm thời do nhập sai quá nhiều lần!' };
  }

  const record = loginAttemptsMap.get(ip) || { count: 0, resetTime: Date.now() + 60000 };
  if (Date.now() > record.resetTime) {
    record.count = 0;
    record.resetTime = Date.now() + 60000;
  }

  record.count++;
  loginAttemptsMap.set(ip, record);

  if (record.count > 5) {
    BLOCKED_IPS.add(ip);
    setTimeout(() => BLOCKED_IPS.delete(ip), 5 * 60 * 1000); // Unblock after 5 minutes
    return { blocked: true, message: 'Phát hiện nguy cơ Brute-Force: IP bị tạm khóa 5 phút!' };
  }

  return { blocked: false };
}
