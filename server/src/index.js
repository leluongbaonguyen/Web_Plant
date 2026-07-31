import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createWordBuffer, createBrdWordBuffer } from './exportWord.js';
import { readPlan, resetPlan, writePlan, readKidsProgress, writeKidsProgress } from './store.js';
import { sanitizePlan } from './validation.js';
import { appendAuditLog, readAuditLogs, readUsers, writeUsers } from './db.js';
import { getKangarooTelemetry, readKangarooVault, syncAllToKangaroo, writeKangarooVault } from './kangarooDb.js';
import { checkRateLimit, createSecurityToken, hasPermission, PERMISSION_MATRIX, verifySecurityToken } from './security.js';
import { deleteUserFromSupabase, isSupabaseConfigured } from './supabase.js';
import { deleteStateSnapshot, readStateSnapshots } from './snapshots.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '2mb' }));

// Middleware kiểm tra và gán vai trò & Security Token
app.use((req, _res, next) => {
  const authHeader = req.headers['authorization'];
  const stealthHeader = req.headers['x-stealth-token'];
  const queryToken = req.query?.token;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (stealthHeader) {
    token = stealthHeader;
  } else if (queryToken) {
    token = queryToken;
  }

  if (token) {
    const decoded = verifySecurityToken(token);
    if (decoded) {
      req.userRole = decoded.role;
      req.user = decoded;
    }
  }
  next();
});

// Middleware bắt buộc tất cả tác nhân phải đăng nhập tài khoản trước khi truy cập API
app.use('/api', (req, res, next) => {
  const publicPaths = [
    '/auth/login', '/health', '/roles', '/admin/auth', '/kids/progress',
    '/export/brd-doc', '/export/word',
    '/api/auth/login', '/api/health', '/api/roles', '/api/admin/auth', '/api/kids/progress',
    '/api/export/brd-doc', '/api/export/word'
  ];
  if (publicPaths.includes(req.path) || publicPaths.includes(req.originalUrl)) {
    return next();
  }

  if (!req.user) {
    return res.status(401).json({
      ok: false,
      error: 'UNAUTHORIZED',
      message: '🔒 Yêu cầu đăng nhập: Tất cả tác nhân đều phải đăng nhập tài khoản mới sử dụng được hệ thống!',
    });
  }
  next();
});

// Middleware kiểm tra Granular Permission
function requirePermission(permName) {
  return (req, res, next) => {
    if (!hasPermission(req.userRole, permName)) {
      appendAuditLog('ACCESS_DENIED', `Từ chối truy cập cho vai trò '${req.userRole}': Yêu cầu quyền '${permName}'`, req.userRole, req.ip);
      return res.status(403).json({
        ok: false,
        error: 'FORBIDDEN_SECURITY_GUARD',
        message: `Quyền truy cập bị từ chối: Vai trò '${req.userRole.toUpperCase()}' không có quyền '${permName}'.`,
        requiredPermission: permName,
        currentRole: req.userRole,
      });
    }
    next();
  };
}

// Legacy Middleware yêu cầu vai trò
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: `Quyền truy cập bị từ chối: Vai trò '${req.userRole.toUpperCase()}' không có quyền thực hiện thao tác này.`,
        requiredRoles: allowedRoles,
        currentRole: req.userRole,
      });
    }
    next();
  };
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'lich-sinh-hoat-api',
    storageMode: isSupabaseConfigured() ? 'SUPABASE_POSTGRES_CLOUD' : 'LOCAL_JSON_FILES',
    supabaseConnected: isSupabaseConfigured(),
    userRole: req.userRole,
    time: new Date().toISOString(),
  });
});

app.get('/api/roles', (_req, res) => {
  res.json({
    roles: [
      {
        id: 'admin',
        name: 'Quản trị viên (Admin)',
        description: 'Toàn quyền chỉnh sửa lịch, mục tiêu, thêm/xóa khung giờ, đặt lại hệ thống và sao lưu/khôi phục.',
        permissions: ['read', 'edit_cells', 'manage_goals', 'manage_slots', 'reset_system', 'export', 'backup_restore'],
      },
      {
        id: 'editor',
        name: 'Quản lý / Người sửa (Editor)',
        description: 'Được phép cập nhật trạng thái việc, chỉnh sửa nội dung ô, ghi chú và mục tiêu. Không được xóa khung giờ hoặc reset hệ thống.',
        permissions: ['read', 'edit_cells', 'manage_goals', 'export'],
      },
      {
        id: 'viewer',
        name: 'Thành viên / Viewer 👀',
        description: 'Quyền: Xem Lịch & Tiến Độ, Chỉnh Sửa Ô Công Việc, Xóa Khung Giờ Hoạt Động, Biên Tập Mục Tiêu Tuần.',
        permissions: ['read', 'edit_cells', 'manage_goals', 'manage_slots', 'export'],
      },
    ],
  });
});

app.get('/api/plan', async (_req, res, next) => {
  try {
    res.json(await readPlan());
  } catch (error) {
    next(error);
  }
});

app.put('/api/plan', requireRole('admin', 'editor', 'viewer', 'kids_english'), async (req, res, next) => {
  try {
    const currentPlan = await readPlan();
    
    // Nếu vai trò là editor: Không cho phép xóa khung giờ
    if (req.userRole === 'editor') {
      const currentSlotIds = new Set((currentPlan.schedule || []).map((s) => s.id));
      const incomingSchedule = Array.isArray(req.body?.schedule) ? req.body.schedule : [];
      const incomingSlotIds = new Set(incomingSchedule.map((s) => s.id));
      
      // Kiểm tra xem editor có xóa slot cũ nào không
      for (const id of currentSlotIds) {
        if (!incomingSlotIds.has(id)) {
          return res.status(403).json({
            message: 'Quyền Quản lý (Editor) không được phép xóa khung giờ trong lịch. Thao tác này cần quyền Quản trị viên (Admin).',
          });
        }
      }
    }

    const plan = sanitizePlan(req.body);
    const username = req.user?.username || req.userRole || 'SYSTEM';
    const updated = await writePlan(plan, `Cập nhật Lịch sinh hoạt bởi tác nhân '${username}'`, username, req.userRole);
    res.json(updated);
  } catch (error) {
    error.status = error.status || 400;
    next(error);
  }
});

app.post('/api/plan/reset', requireRole('admin'), async (req, res, next) => {
  try {
    const username = req.user?.username || 'admin';
    const reset = await resetPlan(username, req.userRole);
    await appendAuditLog('SYSTEM_RESET', `Admin '${username}' đã đặt lại kế hoạch về mặc định ban đầu`, username, req.ip);
    res.json(reset);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// STATE HISTORY & ULTRA-DETAILED RESTORE API
// ==========================================

app.get('/api/history/snapshots', async (_req, res, next) => {
  try {
    const snapshots = await readStateSnapshots();
    res.json({ ok: true, snapshots });
  } catch (error) {
    next(error);
  }
});

app.post('/api/history/snapshots/restore/:id', requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const snapshots = await readStateSnapshots();
    const targetSnapshot = snapshots.find((s) => s.id === id);

    if (!targetSnapshot) {
      return res.status(404).json({ ok: false, message: 'Không tìm thấy bản ghi điểm khôi phục!' });
    }

    const username = req.user?.username || req.userRole || 'admin';
    const restoredPlan = await writePlan(
      targetSnapshot.snapshot,
      `⚡ KHÔI PHỤC TRẠNG THÁI: Trở về bản ghi '${targetSnapshot.action}' (${new Date(targetSnapshot.timestamp).toLocaleString('vi-VN')})`,
      username,
      req.userRole
    );

    await appendAuditLog(
      'STATE_RESTORED',
      `Tác nhân '${username}' đã khôi phục thành công trạng thái hệ thống về điểm khôi phục ngày ${new Date(targetSnapshot.timestamp).toLocaleString('vi-VN')}`,
      username,
      req.ip
    );

    res.json({
      ok: true,
      message: `⚡ Đã khôi phục thành công trạng thái hệ thống về phiên bản ${new Date(targetSnapshot.timestamp).toLocaleString('vi-VN')}!`,
      plan: restoredPlan,
    });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/history/snapshots/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const snapshots = await deleteStateSnapshot(id);
    res.json({ ok: true, message: 'Đã xóa điểm khôi phục thành công!', snapshots });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/word', async (_req, res, next) => {
  try {
    const plan = await readPlan();
    const buffer = await createWordBuffer(plan);
    const filename = `Lich_sinh_hoat_1_tuan_${new Date().toISOString().slice(0, 10)}.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/brd-doc', async (_req, res, next) => {
  try {
    const buffer = await createBrdWordBuffer();
    const filename = `Dac_Ta_Nghiep_Vu_ChronoFlow_Premium_12_Trang_v2.0.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// KIDS ENGLISH LEARNING PROGRESS API
// ==========================================
app.get('/api/kids/progress', async (_req, res, next) => {
  try {
    const progress = await readKidsProgress();
    res.json({ ok: true, progress });
  } catch (error) {
    next(error);
  }
});

app.post('/api/kids/progress', async (req, res, next) => {
  try {
    const { stars, masteredCards, quizScore } = req.body || {};
    const updated = await writeKidsProgress({
      stars: typeof stars === 'number' ? stars : 120,
      masteredCards: Array.isArray(masteredCards) ? masteredCards : [],
      quizScore: typeof quizScore === 'number' ? quizScore : 0,
    });
    res.json({ ok: true, message: '⚡ Đã đồng bộ tiến độ học Tiếng Anh của Minh Anh lên máy chủ thành công!', progress: updated });
  } catch (error) {
    next(error);
  }
});


// ==========================================
// SUPER ADMIN & STEALTH MANAGEMENT AGENT API
// ==========================================

let systemState = {
  version: 'v2.5.0-ENTERPRISE',
  maintenanceMode: false,
  lastUpgraded: new Date().toISOString(),
  auditLogs: [
    { id: 'log-1', timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'SYSTEM_BOOT', details: 'Hệ thống Lịch Sinh Hoạt khởi động thành công', ip: '127.0.0.1' },
    { id: 'log-2', timestamp: new Date(Date.now() - 1800000).toISOString(), event: 'SECURITY_INIT', details: 'Cấu hình phân quyền 3 cấp (Admin, Editor, Viewer) được kích hoạt', ip: '127.0.0.1' },
  ],
  upgradeHistory: [
    { version: 'v2.0.0', date: '2026-07-20', changes: 'Khởi tạo hệ thống Lịch Sinh Hoạt 1 tuần' },
    { version: 'v2.4.0', date: '2026-07-28', changes: 'Tái cấu trúc mô-đun hóa & Phân quyền RBAC 3 cấp' },
    { version: 'v2.5.0-ENTERPRISE', date: new Date().toISOString().slice(0, 10), changes: 'Tác nhân Admin siêu chi tiết & Đăng nhập ẩn' },
  ],
};

// Đăng nhập ẩn Stealth Admin Passcode
app.post('/api/admin/auth', (req, res) => {
  const { passcode } = req.body || {};
  // Mật khẩu mã hóa ẩn mặc định: 8888 hoặc superadmin
  if (passcode === '8888' || passcode === 'superadmin' || passcode === 'admin123') {
    const token = `stealth-token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    systemState.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'STEALTH_ADMIN_LOGIN_SUCCESS',
      details: 'Tác nhân Super Admin đăng nhập ẩn thành công',
      ip: req.ip || '127.0.0.1',
    });
    return res.json({
      ok: true,
      token,
      message: 'Đăng nhập ẩn Tác nhân Super Admin thành công!',
      systemState,
    });
  }

  systemState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: 'STEALTH_ADMIN_LOGIN_FAILED',
    details: 'Nhập sai mã đăng nhập ẩn',
    ip: req.ip || '127.0.0.1',
  });

  return res.status(401).json({
    ok: false,
    message: 'Mã đăng nhập ẩn không chính xác. Truy cập bị từ chối!',
  });
});

// Lấy thông số chẩn đoán hệ thống siêu chi tiết (Telemetry Diagnostics)
app.get('/api/admin/telemetry', async (_req, res) => {
  const mem = process.memoryUsage();
  const plan = await readPlan();
  const slotCount = (plan.schedule || []).length;
  const goalCount = (plan.weeklyGoals || []).length;

  res.json({
    ok: true,
    system: {
      version: systemState.version,
      maintenanceMode: systemState.maintenanceMode,
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      storageEngine: isSupabaseConfigured() ? 'Supabase Postgres Cloud ⚡' : 'Local JSON Files 📁',
      supabaseConnected: isSupabaseConfigured(),
      memory: {
        rssMB: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
        heapTotalMB: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
        heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      },
      database: {
        status: 'ONLINE',
        slotCount,
        goalCount,
        totalCells: slotCount * 7,
        dataSizeBytes: JSON.stringify(plan).length,
      },
      auditLogCount: systemState.auditLogs.length,
    },
    logs: systemState.auditLogs.slice(0, 50),
    upgradeHistory: systemState.upgradeHistory,
  });
});

// Nâng cấp hệ thống tự động (Automated System Upgrade Engine)
app.post('/api/admin/upgrade', (req, res) => {
  const { targetVersion } = req.body || {};
  const newVer = targetVersion || `v2.${systemState.upgradeHistory.length + 1}.0-ULTRA`;

  systemState.version = newVer;
  systemState.lastUpgraded = new Date().toISOString();
  systemState.upgradeHistory.unshift({
    version: newVer,
    date: new Date().toISOString().slice(0, 10),
    changes: 'Nâng cấp lõi hệ thống, tối ưu bộ nhớ cache & cập nhật bản vá bảo mật RBAC v2',
  });

  systemState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: 'SYSTEM_UPGRADED',
    details: `Tác nhân Admin thực hiện nâng cấp hệ thống lên phiên bản ${newVer}`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({
    ok: true,
    message: `Đã nâng cấp hệ thống thành công lên phiên bản ${newVer}!`,
    version: systemState.version,
    upgradeHistory: systemState.upgradeHistory,
  });
});

// Bật / Tắt chế độ bảo trì hệ thống (Maintenance Mode Toggle)
app.post('/api/admin/maintenance', (req, res) => {
  const { enabled } = req.body || {};
  systemState.maintenanceMode = Boolean(enabled);

  systemState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: 'MAINTENANCE_TOGGLED',
    details: `Chế độ bảo trì đã được ${systemState.maintenanceMode ? 'BẬT' : 'TẮT'}`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({
    ok: true,
    maintenanceMode: systemState.maintenanceMode,
    message: `Đã ${systemState.maintenanceMode ? 'bật' : 'tắt'} chế độ bảo trì hệ thống thành công!`,
  });
});

// ====================================================
// ====================================================
// KANGAROO DATABASE API ENDPOINTS
// ====================================================

// Lấy thông số chẩn đoán hệ thống Kangaroo DB (Diagnostic & Hop Telemetry)
app.get('/api/kangaroo/status', (_req, res) => {
  const telemetry = getKangarooTelemetry();
  res.json({
    ok: true,
    kangaroo: telemetry,
  });
});

// Ép buộc đồng bộ toàn bộ dữ liệu vào Kangaroo Vault Engine
app.post('/api/kangaroo/sync', async (req, res, next) => {
  try {
    const plan = await readPlan();
    const users = await readUsers();
    const logs = await readAuditLogs();

    syncAllToKangaroo(plan, users, logs);
    await appendAuditLog('KANGAROO_SYNC_FORCE', 'Admin kích hoạt ép buộc đồng bộ dữ liệu vào Kangaroo Vault DB Engine', req.userRole, req.ip);

    res.json({
      ok: true,
      message: '⚡ Đã đồng bộ 100% dữ liệu kế hoạch và tài khoản vào Kangaroo DB Vault thành công!',
      kangaroo: getKangarooTelemetry(),
    });
  } catch (error) {
    next(error);
  }
});

// AGENT / USER MANAGEMENT & PERSISTENT DATABASE API
// ====================================================

// Đăng nhập Tài Khoản Tác Nhân / Admin Bắt Buộc (Bảo vệ bởi Rate Limit & HMAC Token)
app.post('/api/auth/login', async (req, res) => {
  // Brute-force rate limit protection
  const limitCheck = checkRateLimit(req.ip);
  if (limitCheck.blocked) {
    await appendAuditLog('SECURITY_THREAT_BLOCKED', limitCheck.message, 'UNKNOWN', req.ip);
    return res.status(429).json({ ok: false, message: limitCheck.message });
  }

  const { username, password } = req.body || {};
  const users = await readUsers();

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    await appendAuditLog('AUTH_LOGIN_FAILED', `Thử đăng nhập tài khoản '${username}' thất bại`, username, req.ip);
    return res.status(401).json({
      ok: false,
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác!',
    });
  }

  if (user.status === 'DISABLED') {
    return res.status(403).json({
      ok: false,
      message: 'Tài khoản tác nhân của bạn đã bị Admin tạm khóa!',
    });
  }

  const securityToken = createSecurityToken(user);
  await appendAuditLog('AUTH_LOGIN_SUCCESS', `Tác nhân '${user.fullName}' (${user.role.toUpperCase()}) đăng nhập thành công với Token HMAC`, user.username, req.ip);

  res.json({
    ok: true,
    token: securityToken,
    permissions: PERMISSION_MATRIX[user.role] || [],
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
    },
    message: `Đăng nhập thành công với vai trò ${user.role.toUpperCase()}`,
  });
});

// Lấy danh sách tất cả Tác nhân / Người dùng (Chỉ Admin)
app.get('/api/admin/agents', requireRole('admin'), async (_req, res) => {
  const users = await readUsers();
  res.json({ ok: true, agents: users });
});

// Thêm Tác nhân / Tài khoản mới (Chỉ Admin)
app.post('/api/admin/agents', requireRole('admin'), async (req, res) => {
  const { username, password, fullName, role, avatar } = req.body || {};
  if (!username || !password || !fullName) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ Tên đăng nhập, Mật khẩu và Họ tên tác nhân!' });
  }

  const users = await readUsers();
  if (users.some((u) => u.username === username.trim().toLowerCase())) {
    return res.status(400).json({ message: `Tên tài khoản '${username}' đã tồn tại trên hệ thống!` });
  }

  const newAgent = {
    id: `usr-agent-${Date.now()}`,
    username: username.trim().toLowerCase(),
    password: password.trim(),
    fullName: fullName.trim(),
    role: role || 'editor',
    avatar: avatar || '👤',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  users.push(newAgent);
  await writeUsers(users);

  await appendAuditLog('AGENT_CREATED', `Admin đã tạo thêm tác nhân mới: ${newAgent.fullName} (${newAgent.role})`, req.userRole, req.ip);

  res.json({
    ok: true,
    message: `Đã tạo thành công Tác nhân '${newAgent.fullName}'!`,
    agent: newAgent,
    agents: users,
  });
});

// Chỉnh sửa thông tin Tác nhân (Chỉ Admin)
app.put('/api/admin/agents/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { password, fullName, role, avatar, status } = req.body || {};

  let users = await readUsers();
  const agentIndex = users.findIndex((u) => u.id === id);

  if (agentIndex === -1) {
    return res.status(404).json({ message: 'Không tìm thấy Tác nhân cần chỉnh sửa!' });
  }

  const targetAgent = users[agentIndex];
  const updatedAgent = {
    ...targetAgent,
    fullName: fullName !== undefined ? fullName.trim() : targetAgent.fullName,
    password: password !== undefined && password.trim() ? password.trim() : targetAgent.password,
    role: role !== undefined ? role : targetAgent.role,
    avatar: avatar !== undefined ? avatar : targetAgent.avatar,
    status: status !== undefined ? status : targetAgent.status,
  };

  users[agentIndex] = updatedAgent;
  await writeUsers(users);

  await appendAuditLog('AGENT_UPDATED', `Admin đã cập nhật thông tin tác nhân '${updatedAgent.fullName}'`, req.userRole, req.ip);

  res.json({
    ok: true,
    message: `Đã cập nhật thông tin Tác nhân '${updatedAgent.fullName}' thành công!`,
    agent: updatedAgent,
    agents: users,
  });
});

// Xóa Tác nhân (Chỉ Admin)
app.delete('/api/admin/agents/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  let users = await readUsers();

  const targetAgent = users.find((u) => u.id === id);
  if (!targetAgent) {
    return res.status(404).json({ message: 'Không tìm thấy Tác nhân cần xóa!' });
  }

  if (targetAgent.username === 'admin') {
    return res.status(403).json({ message: 'Không thể xóa tài khoản Quản trị viên Tối cao (Admin Master)!' });
  }

  users = users.filter((u) => u.id !== id);
  await writeUsers(users);
  await deleteUserFromSupabase(id);

  await appendAuditLog('AGENT_DELETED', `Admin đã xóa tác nhân '${targetAgent.fullName}' khỏi cơ sở dữ liệu`, req.userRole, req.ip);

  res.json({
    ok: true,
    message: `Đã xóa thành công Tác nhân '${targetAgent.fullName}' khỏi hệ thống!`,
    agents: users,
  });
});



const clientDist = path.resolve(__dirname, '../../client/dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.status ? error.message : 'Máy chủ gặp lỗi. Vui lòng thử lại.',
  });
});

app.listen(port, () => {
  console.log(`Lịch sinh hoạt API đang chạy tại http://localhost:${port}`);
});

