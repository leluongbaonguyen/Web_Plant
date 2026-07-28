import { Activity, Award, BookOpen, Calendar, Target } from 'lucide-react';

export const DAYS = [
  { key: 'monday', label: 'Thứ Hai', short: 'T2' },
  { key: 'tuesday', label: 'Thứ Ba', short: 'T3' },
  { key: 'wednesday', label: 'Thứ Tư', short: 'T4' },
  { key: 'thursday', label: 'Thứ Năm', short: 'T5' },
  { key: 'friday', label: 'Thứ Sáu', short: 'T6' },
  { key: 'saturday', label: 'Thứ Bảy', short: 'T7' },
  { key: 'sunday', label: 'Chủ Nhật', short: 'CN' },
];

export const TABS = [
  { id: 'dashboard', label: 'Tổng quan', icon: Activity },
  { id: 'schedule', label: 'Lịch tuần', icon: Calendar },
  { id: 'goals', label: 'Mục tiêu tuần', icon: Target },
  { id: 'summary', label: 'Tổng kết & Đánh giá', icon: Award },
  { id: 'docs', label: 'Phân quyền & API', icon: BookOpen },
];

export const CATEGORIES = {
  default: { label: 'Chung', color: 'border-slate-700 bg-slate-800/60 text-slate-300', dot: 'bg-slate-400' },
  study: { label: 'Học tập', color: 'border-indigo-500/30 bg-indigo-950/50 text-indigo-300', dot: 'bg-indigo-400' },
  work: { label: 'Công việc', color: 'border-sky-500/30 bg-sky-950/50 text-sky-300', dot: 'bg-sky-400' },
  health: { label: 'Sức khỏe', color: 'border-emerald-500/30 bg-emerald-950/50 text-emerald-300', dot: 'bg-emerald-400' },
  rest: { label: 'Nghỉ ngơi', color: 'border-amber-500/30 bg-amber-950/50 text-amber-300', dot: 'bg-amber-400' },
  personal: { label: 'Cá nhân', color: 'border-pink-500/30 bg-pink-950/50 text-pink-300', dot: 'bg-pink-400' },
};

export const ROLES = {
  admin: {
    id: 'admin',
    name: 'Quản trị viên (Admin)',
    badge: 'ADMIN',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Toàn quyền chỉnh sửa lịch, mục tiêu, thêm/xóa khung giờ, đặt lại hệ thống và quản lý dữ liệu.',
  },
  editor: {
    id: 'editor',
    name: 'Quản lý / Người sửa (Editor)',
    badge: 'EDITOR',
    color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    description: 'Được phép cập nhật trạng thái việc, chỉnh sửa nội dung ô, ghi chú và mục tiêu. Không xóa khung giờ hoặc reset.',
  },
  viewer: {
    id: 'viewer',
    name: 'Thành viên / Xem (Viewer)',
    badge: 'VIEWER',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Chế độ chỉ xem. Tìm kiếm, lọc, nghe chuông nhắc nhở, in và xuất file Word. Không được sửa dữ liệu.',
  },
};

export function uid(prefix = 'item') {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
}

export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function getCurrentDayKey() {
  const dayIndex = new Date().getDay();
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return map[dayIndex];
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
