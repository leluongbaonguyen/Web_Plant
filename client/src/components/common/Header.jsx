import { useState } from 'react';
import {
  Bell,
  Download,
  History,
  LogOut,
  Maximize2,
  Minimize2,
  Printer,
  Share2,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext.jsx';
import { TABS, cx } from '../../constants/index.js';

export function Header({
  meta,
  activeTab,
  setActiveTab,
  onOpenRoleModal,
  onOpenSecretAdmin,
  onOpenStateHistory,
  onOpenErrorHandbook,
  onOpenReminders,
  reminderBadgeCount,
  onDownloadJson,
  onImportJson,
  onExportWord,
  onPrint,
  saveStatus,
  isSaving,
  isFullscreen,
  onToggleFullscreen,
  lastSyncedTime,
}) {
  const { role, logout, roleInfo, permissions } = useRole();
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 3) {
      setLogoClicks(0);
      onOpenSecretAdmin();
    }
  };

  const isKidsActor = role === 'kids_english';

  return (
    <header className="no-print space-y-3 font-sans">
      {/* Top Navigation Bar with Ultra Glassmorphism */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-900/95 via-purple-950/80 to-slate-900/95 backdrop-blur-xl p-3 md:p-4 rounded-3xl border-2 border-pink-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            title="Bấm 3 lần để mở Cổng Admin Ẩn"
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_8px_20px_rgba(236,72,153,0.4)] hover:scale-110 active:scale-95 transition shrink-0 border-2 ${
              isKidsActor
                ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 border-pink-300'
                : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-indigo-300'
            }`}
          >
            {isKidsActor ? <span className="text-2xl animate-wiggle">🦄</span> : <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />}
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base md:text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-300 font-heading drop-shadow-md">
                {isKidsActor
                  ? '🌸 GIAO DIỆN HỌC TIẾNG ANH FLASHCARD SIÊU CUTE (MINH ANH) 🔤✨'
                  : meta?.title || '👑 LỊCH SINH HOẠT THÔNG MINH & QUẢN LÝ TIẾN ĐỘ TUẦN'}
              </h1>
              <button
                onClick={onOpenRoleModal}
                className={cx(
                  'flex items-center gap-1 rounded-full border-2 px-3 py-0.5 text-[11px] font-black transition hover:scale-105 shadow-md',
                  roleInfo.color
                )}
                title="Quản lý vai trò & RBAC"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{roleInfo.badge}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs flex-wrap">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 px-3 py-0.5 text-[10px] font-black text-emerald-300 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>REALTIME SYNC ACTIVE ({lastSyncedTime ? lastSyncedTime.toLocaleTimeString('vi-VN') : 'Tự động'})</span>
              </div>

              <span className={isSaving ? 'text-amber-300 font-extrabold animate-pulse text-[11px]' : 'text-slate-300 text-[11px] font-bold'}>
                {saveStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* History & Time-Travel State Restoration Button */}
          <button
            onClick={onOpenStateHistory}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/50 bg-cyan-950/70 px-3 py-1.5 text-xs font-black text-cyan-300 hover:bg-cyan-900/90 transition shadow-md"
            title="Lịch Sử Thao Tác & Khôi Phục Trạng Thái Siêu Chi Tiết"
          >
            <History className="h-4 w-4 text-cyan-400 animate-spin-slow" />
            <span>Lịch Sử & Khôi Phục</span>
          </button>

          {/* System Error Handbook Lookup Button */}
          <button
            onClick={() => onOpenErrorHandbook && onOpenErrorHandbook('500')}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/50 bg-red-950/70 px-3 py-1.5 text-xs font-black text-red-300 hover:bg-red-900/90 transition shadow-md cursor-pointer"
            title="Tra Cứu Cẩm Nang & Chi Tiết Tất Cả Mã Lỗi Hệ Thống"
          >
            <Sparkles className="h-4 w-4 text-red-400 animate-pulse" />
            <span>📚 Cẩm Nang Mã Lỗi</span>
          </button>

          {/* Bell Notification Button */}
          <button
            onClick={onOpenReminders}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-3 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-900/80 transition relative shadow-sm"
            title="Mở Trung Tâm Lời Nhắc"
          >
            <Bell className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span>Mẫu Lời Nhắc</span>
            {reminderBadgeCount > 0 && (
              <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-slate-950">
                {reminderBadgeCount}
              </span>
            )}
          </button>

          {/* Word Export A3 */}
          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/50 bg-indigo-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-md hover:bg-indigo-500 transition"
            title="Xuất File Word A3 Ngang (Font Times New Roman 13)"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Xuất Word A3</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            title="In / Xuất PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">In</span>
          </button>

          {permissions.canBackupRestore && (
            <>
              <button
                onClick={onDownloadJson}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
                title="Sao lưu JSON"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Sao lưu</span>
              </button>
              <label className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer transition" title="Nhập JSON">
                <Upload className="h-3.5 w-3.5 text-sky-400" />
                <span className="hidden lg:inline">Nhập</span>
                <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
              </label>
            </>
          )}

          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/40 px-2.5 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition shadow-sm"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden md:inline">Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center justify-between border-b border-slate-800 pb-1 px-1">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-1">
          {TABS.filter((t) => {
            if (isKidsActor) return t.id === 'dashboard';
            return true;
          }).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const label = isKidsActor && tab.id === 'dashboard' ? 'Giao Diện Học Tiếng Anh Flashcard 🔤' : tab.label;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cx(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition shrink-0',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
