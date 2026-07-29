import { useState } from 'react';
import { Bell, Download, Lock, LogOut, Maximize2, Minimize2, Printer, Share2, ShieldCheck, Sparkles, Upload, UserCheck } from 'lucide-react';
import { useRole } from '../context/RoleContext.jsx';
import { TABS, cx } from '../constants/index.js';

export function Header({
  meta,
  activeTab,
  setActiveTab,
  onOpenRoleModal,
  onOpenSecretAdmin,
  onOpenReminders,
  reminderBadgeCount,
  onResetPlan,
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
  const { user, logout, roleInfo, permissions } = useRole();
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 3) {
      setLogoClicks(0);
      onOpenSecretAdmin();
    }
  };

  return (
    <header className="no-print space-y-3">
      {/* Sleek Minimalist Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-slate-800/80 shadow-sm">
        {/* Brand & Sync Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            title="Bấm 3 lần để mở Cổng Admin Ẩn"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 transition shrink-0"
          >
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                {meta?.title || 'LỊCH SINH HOẠT 1 TUẦN'}
              </h1>
              <button
                onClick={onOpenRoleModal}
                className={cx(
                  'flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-bold transition hover:opacity-80',
                  roleInfo.color
                )}
                title="Quản lý vai trò & RBAC"
              >
                <ShieldCheck className="h-3 w-3" />
                <span>{roleInfo.badge}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Supabase Cloud ⚡</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className={isSaving ? 'text-amber-400 font-medium animate-pulse' : 'text-slate-400'}>
                {saveStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* User Profile Tag */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-200">
              <span className="text-base">{user.avatar || '👤'}</span>
              <span className="font-bold text-indigo-300">{user.fullName || user.username}</span>
            </div>
          )}

          {/* Prominent Bell Notification Button */}
          <button
            onClick={onOpenReminders}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-3 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-900/80 transition relative shadow-sm"
            title="Mở Trung Tâm Nhắc Nhở & Chuông Báo"
          >
            <Bell className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span>Nhắc Nhở</span>
            {reminderBadgeCount > 0 && (
              <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-slate-950">
                {reminderBadgeCount}
              </span>
            )}
          </button>

          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            title="Xuất Word A3"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Xuất Word</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            title="In / PDF"
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
            onClick={onOpenSecretAdmin}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/30 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/50 transition"
            title="Admin Ẩn (Ctrl+Shift+A)"
          >
            <Lock className="h-3.5 w-3.5 text-red-400" />
            <span className="hidden sm:inline">Admin Ẩn</span>
          </button>

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

      {/* Minimal Navigation Tabs Bar */}
      <nav className="flex items-center justify-between border-b border-slate-800 pb-1 px-1">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
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
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
          <span>Tác nhân:</span>
          <span className="font-bold text-slate-200">{user?.fullName || user?.username || roleInfo.name.split(' (')[0]}</span>
        </div>
      </nav>
    </header>
  );
}
