import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createWordBuffer } from './exportWord.js';
import { readPlan, resetPlan, writePlan } from './store.js';
import { sanitizePlan } from './validation.js';

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

