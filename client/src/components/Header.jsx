import { useState } from 'react';
import { Download, Printer, RefreshCw, Share2, ShieldCheck, Sparkles, Upload, Zap } from 'lucide-react';
import { useRole } from '../context/RoleContext.jsx';
import { TABS, cx } from '../constants/index.js';

export function Header({
  meta,
  activeTab,
  setActiveTab,
  onOpenRoleModal,
  onResetPlan,
  onDownloadJson,
  onImportJson,
  onExportWord,
  onPrint,
  saveStatus,
  isSaving,
}) {
  const { roleInfo, permissions } = useRole();

  return (
    <header className="no-print space-y-4">
      {/* Upper Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Logo & Brand Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-300">
                {meta?.title || 'KẾ HOẠCH SINH HOẠT 1 TUẦN'}
              </h1>
              {/* Role Badge Button */}
              <button
                onClick={onOpenRoleModal}
                title="Bấm để xem ma trận phân quyền và đổi vai trò"
                className={cx(
                  'flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-extrabold tracking-wide transition shadow-sm hover:scale-105',
                  roleInfo.color
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{roleInfo.badge}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Hệ thống Quản lý Kế hoạch Sinh hoạt Chuyên nghiệp</span>
              <span className="h-1 w-1 rounded-full bg-slate-600"></span>
              <span className={isSaving ? 'text-amber-400 font-bold animate-pulse' : 'text-emerald-400 font-medium'}>
                {saveStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Word Export Button */}
          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-900/80 transition shadow-sm"
          >
            <Download className="h-4 w-4" /> Xuất Word A3
          </button>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            <Printer className="h-4 w-4" /> In / PDF
          </button>

          {/* Admin Only Actions */}
          {permissions.canBackupRestore && (
            <>
              <button
                onClick={onDownloadJson}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
                title="Sao lưu toàn bộ dữ liệu ra tệp JSON"
              >
                <Share2 className="h-4 w-4" /> Sao lưu JSON
              </button>

              <label className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer transition">
                <Upload className="h-4 w-4 text-sky-400" /> Nhập JSON
                <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
              </label>
            </>
          )}

          {permissions.canResetSystem && (
            <button
              onClick={onResetPlan}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/40 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-900/60 transition"
              title="Khôi phục kế hoạch về mặc định ban đầu (Chỉ Admin)"
            >
              <RefreshCw className="h-4 w-4" /> Đặt lại mặc định
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs Header (Desktop) */}
      <div className="hidden md:flex items-center justify-between border-b border-slate-800 pb-1">
        <nav className="flex items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cx(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all relative',
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <Icon className={cx('h-4 w-4', isActive ? 'text-indigo-400' : 'text-slate-500')} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500"></span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold">Phân quyền:</span>
          <span className="rounded-lg bg-slate-800 border border-slate-700 px-2 py-0.5 font-bold text-slate-200">
            {roleInfo.name.split(' (')[0]}
          </span>
        </div>
      </div>
    </header>
  );
}
