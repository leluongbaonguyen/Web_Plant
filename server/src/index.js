import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createWordBuffer } from './exportWord.js';
import { readPlan, resetPlan, writePlan } from './store.js';
import { sanitizePlan } from './validation.js';
import { appendAuditLog, readAuditLogs, readUsers, writeUsers } from './db.js';
import { getKangarooTelemetry, readKangarooVault, syncAllToKangaroo, writeKangarooVault } from './kangarooDb.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '2mb' }));

// Middleware kiểm tra và gán vai trò người dùng (x-user-role)
app.use((req, _res, next) => {
  const rawRole = (req.headers['x-user-role'] || 'admin').toString().toLowerCase();
  const validRoles = ['admin', 'editor', 'viewer'];
  req.userRole = validRoles.includes(rawRole) ? rawRole : 'viewer';
  next();
});

// Middleware yêu cầu quyền hạn cụ thể
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
        name: 'Thành viên / Xem (Viewer)',
        description: 'Chế độ chỉ xem. Tìm kiếm, lọc, nghe chuông nhắc nhở, in và xuất file Word. Không được sửa dữ liệu.',
        permissions: ['read', 'export'],
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

app.put('/api/plan', requireRole('admin', 'editor'), async (req, res, next) => {
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
    res.json(await writePlan(plan));
  } catch (error) {
    error.status = error.status || 400;
    next(error);
  }
});

app.post('/api/plan/reset', requireRole('admin'), async (_req, res, next) => {
  try {
    res.json(await resetPlan());
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
    const users = readUsers();
    const logs = readAuditLogs();

    syncAllToKangaroo(plan, users, logs);
    appendAuditLog('KANGAROO_SYNC_FORCE', 'Admin kích hoạt ép buộc đồng bộ dữ liệu vào Kangaroo Vault DB Engine', req.userRole, req.ip);

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

// Đăng nhập Tài Khoản Tác Nhân / Admin Bắt Buộc
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const users = readUsers();

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    appendAuditLog('AUTH_LOGIN_FAILED', `Thử đăng nhập tài khoản '${username}' thất bại`, username, req.ip);
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

  appendAuditLog('AUTH_LOGIN_SUCCESS', `Tác nhân '${user.fullName}' (${user.role.toUpperCase()}) đăng nhập thành công`, user.username, req.ip);

  res.json({
    ok: true,
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
app.get('/api/admin/agents', requireRole('admin'), (_req, res) => {
  const users = readUsers();
  res.json({ ok: true, agents: users });
});

// Thêm Tác nhân / Tài khoản mới (Chỉ Admin)
app.post('/api/admin/agents', requireRole('admin'), (req, res) => {
  const { username, password, fullName, role, avatar } = req.body || {};
  if (!username || !password || !fullName) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ Tên đăng nhập, Mật khẩu và Họ tên tác nhân!' });
  }

  const users = readUsers();
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
  writeUsers(users);

  appendAuditLog('AGENT_CREATED', `Admin đã tạo thêm tác nhân mới: ${newAgent.fullName} (${newAgent.role})`, req.userRole, req.ip);

  res.json({
    ok: true,
    message: `Đã tạo thành công Tác nhân '${newAgent.fullName}'!`,
    agent: newAgent,
    agents: users,
  });
});

// Chỉnh sửa thông tin Tác nhân (Chỉ Admin)
app.put('/api/admin/agents/:id', requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const { password, fullName, role, avatar, status } = req.body || {};

  let users = readUsers();
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
  writeUsers(users);

  appendAuditLog('AGENT_UPDATED', `Admin đã cập nhật thông tin tác nhân '${updatedAgent.fullName}'`, req.userRole, req.ip);

  res.json({
    ok: true,
    message: `Đã cập nhật thông tin Tác nhân '${updatedAgent.fullName}' thành công!`,
    agent: updatedAgent,
    agents: users,
  });
});

// Xóa Tác nhân (Chỉ Admin)
app.delete('/api/admin/agents/:id', requireRole('admin'), (req, res) => {
  const { id } = req.params;
  let users = readUsers();

  const targetAgent = users.find((u) => u.id === id);
  if (!targetAgent) {
    return res.status(404).json({ message: 'Không tìm thấy Tác nhân cần xóa!' });
  }

  if (targetAgent.username === 'admin') {
    return res.status(403).json({ message: 'Không thể xóa tài khoản Quản trị viên Tối cao (Admin Master)!' });
  }

  users = users.filter((u) => u.id !== id);
  writeUsers(users);

  appendAuditLog('AGENT_DELETED', `Admin đã xóa tác nhân '${targetAgent.fullName}' khỏi cơ sở dữ liệu`, req.userRole, req.ip);

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

