import { useState, useEffect } from 'react';
import {
  History, RotateCcw, Clock, ShieldCheck, User, CheckCircle2, AlertCircle,
  Search, Trash2, Eye, Database, Sparkles, X, ChevronRight, Layers, ArrowLeft
} from 'lucide-react';
import { getHistorySnapshots, restoreSnapshot, deleteSnapshot } from '../api.js';

export function StateHistoryModal({ isOpen, onClose, onRestorePlan, addToast, userRole }) {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getHistorySnapshots();
      if (res?.snapshots) {
        setSnapshots(res.snapshots);
      }
    } catch (err) {
      if (addToast) addToast(`[LỖI LỊCH SỬ] ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRestore = async (snap) => {
    const formattedDate = new Date(snap.timestamp).toLocaleString('vi-VN');
    if (!confirm(`⚠️ XÁC NHẬN KHÔI PHỤC TRẠNG THÁI:\n\nBạn có chắc chắn muốn khôi phục toàn bộ Lịch Sinh Hoạt & Mục Tiêu về phiên bản:\n📅 Thời gian: ${formattedDate}\n👤 Tác nhân: ${snap.username} (${snap.role.toUpperCase()})\n📝 Thao tác: ${snap.action}?`)) {
      return;
    }

    try {
      setRestoringId(snap.id);
      const res = await restoreSnapshot(snap.id);
      if (res.ok && res.plan) {
        if (onRestorePlan) onRestorePlan(res.plan);
        if (addToast) addToast(`⚡ [KHÔI PHỤC THÀNH CÔNG] Đã khôi phục trạng thái hệ thống về bản ghi ngày ${formattedDate}!`, 'success');
        fetchHistory();
        onClose();
      }
    } catch (err) {
      if (addToast) addToast(`[LỖI KHÔI PHỤC] ${err.message}`, 'error');
    } finally {
      setRestoringId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa điểm khôi phục lịch sử này?')) return;
    try {
      const res = await deleteSnapshot(id);
      if (res.ok) {
        setSnapshots(res.snapshots);
        if (selectedSnapshot?.id === id) setSelectedSnapshot(null);
        if (addToast) addToast('Đã xóa bản ghi điểm khôi phục!', 'info');
      }
    } catch (err) {
      if (addToast) addToast(`[LỖI XÓA] ${err.message}`, 'error');
    }
  };

  const filteredSnapshots = snapshots.filter((snap) => {
    const term = searchTerm.toLowerCase();
    return (
      snap.action?.toLowerCase().includes(term) ||
      snap.username?.toLowerCase().includes(term) ||
      snap.role?.toLowerCase().includes(term) ||
      new Date(snap.timestamp).toLocaleString('vi-VN').includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl border border-cyan-500/40 bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 p-5 md:p-6 border-b border-slate-800">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <History className="h-6 w-6 animate-spin-slow" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-0.5 text-[10px] font-black text-cyan-300 border border-cyan-500/20 mb-1">
                  <Database className="h-3 w-3" />
                  <span>KANGAROO & SUPABASE TIME-TRAVEL ENGINE</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white font-heading tracking-tight">
                  Lịch Sử Thao Tác & Khôi Phục Trạng Thái Siêu Chi Tiết
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Search Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo người thực hiện, thao tác, thời gian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-bold"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <RotateCcw className={`h-3.5 w-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm Mới</span>
            </button>
            <div className="text-xs font-black text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
              Tổng số: <span className="text-cyan-400">{filteredSnapshots.length}</span> bản ghi
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 font-sans">
          {loading && snapshots.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl animate-bounce">⏳</div>
              <div className="text-sm font-bold text-slate-300">Đang tải lịch sử thao tác từ Supabase Cloud & Kangaroo Vault...</div>
            </div>
          ) : filteredSnapshots.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="text-4xl">📜</div>
              <div className="text-sm font-bold text-slate-300">Chưa có bản ghi điểm khôi phục nào phù hợp</div>
              <p className="text-xs text-slate-500">Mọi thao tác chỉnh sửa lịch sinh hoạt và mục tiêu sẽ tự động được ghi lại siêu chi tiết tại đây.</p>
            </div>
          ) : (
            filteredSnapshots.map((snap) => {
              const dateStr = new Date(snap.timestamp).toLocaleString('vi-VN');
              const summary = snap.summary || {};
              const isSelected = selectedSnapshot?.id === snap.id;

              return (
                <div
                  key={snap.id}
                  className={`rounded-2xl border transition-all duration-200 p-4 space-y-3 ${
                    isSelected
                      ? 'border-cyan-500/80 bg-slate-900 shadow-xl ring-1 ring-cyan-500/50'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-xs">
                        {snap.role === 'admin' ? '🛡️' : snap.role === 'editor' ? '✍️' : '👤'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-white text-sm">{snap.action}</span>
                          <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-black text-cyan-300 border border-cyan-500/20 uppercase">
                            {snap.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1 font-mono-code text-slate-300">
                            <Clock className="h-3 w-3 text-cyan-400" />
                            {dateStr}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-bold text-slate-300">
                            <User className="h-3 w-3 text-amber-400" />
                            Tác nhân: {snap.username}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSnapshot(isSelected ? null : snap)}
                        className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{isSelected ? 'Ẩn Chi Tiết' : 'Xem Chi Tiết'}</span>
                      </button>

                      <button
                        onClick={() => handleRestore(snap)}
                        disabled={restoringId === snap.id}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-1.5 text-xs font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-50"
                      >
                        <RotateCcw className={`h-3.5 w-3.5 ${restoringId === snap.id ? 'animate-spin' : ''}`} />
                        <span>Khôi Phục Trạng Thái</span>
                      </button>

                      {userRole === 'admin' && (
                        <button
                          onClick={() => handleDelete(snap.id)}
                          className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-400 transition"
                          title="Xóa điểm khôi phục này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Stats Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                    <div className="rounded-xl bg-slate-950 p-2 border border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Khung Giờ</div>
                      <div className="text-xs font-extrabold text-white">{summary.totalSlots || 0} Khung</div>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-2 border border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Việc Đã Làm</div>
                      <div className="text-xs font-extrabold text-emerald-400">
                        {summary.completedCells || 0} / {summary.totalCells || 0} ({summary.overallPercent || 0}%)
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-2 border border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Mục Tiêu Tuần</div>
                      <div className="text-xs font-extrabold text-amber-400">
                        {summary.completedGoals || 0} / {summary.totalGoals || 0} ({summary.goalProgressPercent || 0}%)
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-2 border border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Điểm Năng Suất</div>
                      <div className="text-xs font-extrabold text-cyan-400">⭐ {summary.score || 0} Điểm</div>
                    </div>
                  </div>

                  {/* Expanded Snapshot Inspection Panel */}
                  {isSelected && snap.snapshot && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-extrabold text-cyan-300 border-b border-slate-800 pb-2">
                        <span className="flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-cyan-400" />
                          DỮ LIỆU ĐIỂM KHÔI PHỤC CHI TIẾT SYSTEM SNAPSHOT
                        </span>
                        <span className="text-slate-400 font-mono-code text-[10px]">{snap.id}</span>
                      </div>

                      <div className="text-xs space-y-1.5 text-slate-300">
                        <div><strong className="text-white">Tiêu đề bản ghi:</strong> {snap.snapshot.meta?.title || 'Lịch sinh hoạt'}</div>
                        <div><strong className="text-white">Ghi chú tuần:</strong> "{snap.snapshot.summary?.notes || 'Không có ghi chú'}"</div>
                        <div><strong className="text-white">Số lượng công việc trong tuần:</strong> {(snap.snapshot.schedule || []).length} khung giờ</div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleRestore(snap)}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-black text-white hover:from-emerald-500 hover:to-teal-500 shadow-xl transition"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Áp Dụng Khôi Phục Phiên Bản Này Ngay</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Mọi điểm khôi phục được bảo vệ mã hóa hai lớp trên Kangaroo Vault DB Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
