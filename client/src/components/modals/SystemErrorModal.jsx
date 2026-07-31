import { useState, useMemo } from 'react';
import {
  X, Search, BookOpen, AlertCircle, ShieldAlert, Lock, FileQuestion, Sliders,
  Clock, Zap, Server, AlertTriangle, Timer, Code, SearchX, FileX, WifiOff,
  Radio, Database, Link2Off, AlertOctagon, RefreshCw, KeyRound, ShieldOff,
  UserX, CheckCircle2, ChevronRight, Play, Sparkles, Terminal
} from 'lucide-react';
import { SYSTEM_ERROR_CATALOG, lookupSystemError } from '../../utils/systemErrorCatalog.js';

const ICON_MAP = {
  AlertCircle, ShieldAlert, Lock, FileQuestion, Sliders, Clock, Zap, Server,
  AlertTriangle, Timer, Code, SearchX, FileX, WifiOff, Radio, Database,
  Link2Off, AlertOctagon, RefreshCw, KeyRound, ShieldOff, UserX
};

export function SystemErrorModal({ activeError, onClose, onTestSimulateError }) {
  const [selectedTab, setSelectedTab] = useState('current'); // 'current' | 'browser' | 'architecture'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState('all');

  // If activeError provided, lookup detailed catalog item
  const currentCatalogItem = useMemo(() => {
    if (!activeError) return SYSTEM_ERROR_CATALOG[0];
    return lookupSystemError(activeError);
  }, [activeError]);

  // Filter handbook items
  const filteredCatalog = useMemo(() => {
    return SYSTEM_ERROR_CATALOG.filter(item => {
      const matchChapter = selectedChapterFilter === 'all' || item.chapter.includes(selectedChapterFilter);
      const matchSearch = !searchQuery || 
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.solution.toLowerCase().includes(searchQuery.toLowerCase());
      return matchChapter && matchSearch;
    });
  }, [selectedChapterFilter, searchQuery]);

  const CurrentIcon = ICON_MAP[currentCatalogItem.icon] || Zap;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border-2 border-red-500/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-red-500/30 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/30 border border-red-500/50 text-red-300 animate-pulse">
              <Zap className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white font-heading flex items-center gap-2">
                <span>CẨM NANG XỬ LÝ & TRA CỨU MÃ LỖI HỆ THỐNG</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-400/40">Handbook v2.5</span>
              </h2>
              <p className="text-xs text-slate-400">
                Tài liệu tra cứu chuyên sâu & nguyên nhân gốc rễ dành cho lập trình viên & quản trị hệ thống
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-950/80">
          <button
            onClick={() => setSelectedTab('current')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              selectedTab === 'current'
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>⚠️ Lỗi Vừa Phát Sinh ({currentCatalogItem.code})</span>
          </button>

          <button
            onClick={() => setSelectedTab('browser')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              selectedTab === 'browser'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>📚 Cẩm Nang Tra Cứu Mã Lỗi (20+ Mã)</span>
          </button>

          <button
            onClick={() => setSelectedTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              selectedTab === 'architecture'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>🛡️ Chiến Lược Quản Lý Kiến Trúc</span>
          </button>
        </div>

        {/* Modal Body Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TAB 1: CURRENT TRIGGERED ERROR DETAILED CARD */}
          {selectedTab === 'current' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className={`p-5 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${currentCatalogItem.badgeColor}`}>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/20">
                    <CurrentIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider opacity-80">{currentCatalogItem.chapter} • {currentCatalogItem.category}</span>
                    <h3 className="text-xl font-black text-white">{currentCatalogItem.title}</h3>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono font-bold text-center">
                  CODE: <span className="text-red-400 text-base">{currentCatalogItem.code}</span>
                </div>
              </div>

              {/* Grid 2 Columns: Root Cause vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Root Cause Box */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-red-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Chi Tiết Nguyên Nhân Gốc Rễ:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                    {currentCatalogItem.rootCause}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">Ngữ cảnh xuất hiện:</span>
                    <div className="text-xs text-slate-300 whitespace-pre-line font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                      {currentCatalogItem.context}
                    </div>
                  </div>
                </div>

                {/* Solution Box */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Giải Pháp Khắc Phục Triệt Để:</span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-semibold bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-300">
                    {currentCatalogItem.solution}
                  </div>

                  {onTestSimulateError && (
                    <button
                      onClick={() => onTestSimulateError(currentCatalogItem.code)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md hover:scale-105 transition flex items-center justify-center gap-2 border border-pink-400/40"
                    >
                      <Play className="h-4 w-4" />
                      <span>Chạy Thử Nghiệm Mô Phỏng Lỗi Này ({currentCatalogItem.code})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HANDBOOK BROWSER */}
          {selectedTab === 'browser' && (
            <div className="space-y-5">
              {/* Search & Chapter Filter Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã lỗi (400, 401, TypeError, 1062...)"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                  <span className="text-xs text-slate-400 font-bold">Lọc theo chương:</span>
                  <select
                    value={selectedChapterFilter}
                    onChange={(e) => setSelectedChapterFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="all">Tất cả 4 Chương Cẩm Nang</option>
                    <option value="Chương I">Chương I: HTTP Status Codes</option>
                    <option value="Chương II">Chương II: Runtime & System</option>
                    <option value="Chương III">Chương III: Database Errors</option>
                    <option value="Chương IV">Chương IV: API & Auth Errors</option>
                  </select>
                </div>
              </div>

              {/* Error Catalog Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCatalog.map((item) => {
                  const ItemIcon = ICON_MAP[item.icon] || Zap;
                  return (
                    <div
                      key={item.key}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition space-y-3 shadow-md flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${item.badgeColor}`}>
                            {item.code}
                          </span>
                          <span className="text-[10px] text-slate-400 italic">{item.category}</span>
                        </div>

                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <ItemIcon className="h-4 w-4 text-purple-400 shrink-0" />
                          <span>{item.title}</span>
                        </h4>

                        <p className="text-xs text-slate-300 font-medium line-clamp-2">
                          <strong className="text-red-400">Nguyên nhân:</strong> {item.rootCause}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="text-[11px] text-emerald-400 font-semibold line-clamp-1">
                          👉 {item.solution.split('\n')[0]}
                        </div>
                        {onTestSimulateError && (
                          <button
                            onClick={() => onTestSimulateError(item.code)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600/30 text-purple-200 border border-purple-500/40 hover:bg-purple-600 hover:text-white text-[10px] font-black transition shrink-0 flex items-center gap-1"
                            title="Chạy thử lỗi này"
                          >
                            <Play className="h-3 w-3" /> Thử Lỗi
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CHAPTER V ARCHITECTURE STRATEGY */}
          {selectedTab === 'architecture' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-teal-500/30 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 border-b border-teal-500/30 pb-4">
                <div className="p-3 rounded-2xl bg-teal-600/20 border border-teal-500/40 text-teal-300">
                  <Terminal className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">CHƯƠNG V: CHIẾN LƯỢC QUẢN LÝ LỖI TOÀN DIỆN MỨC KIẾN TRÚC</h3>
                  <p className="text-xs text-slate-300">Chuẩn hóa xử lý lỗi theo tiêu chuẩn kiến trúc phần mềm enterprise</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-200 leading-relaxed font-medium">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <h4 className="font-black text-amber-300 flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-amber-400" /> 1. Thiết lập Middleware Xử Lý Lỗi Tập Trung (Centralized Error Handling)
                  </h4>
                  <p className="text-slate-300">
                    Toàn bộ lỗi ở các tầng (Controller, Services, Repository) đều được ném về một nơi duy nhất để chuẩn hóa cấu trúc JSON trả về với tiêu chuẩn thống nhất <code className="text-amber-300">{`{ status: 'error', code, message, timestamp }`}</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <h4 className="font-black text-cyan-300 flex items-center gap-2 text-sm">
                    <ShieldAlert className="h-4 w-4 text-cyan-400" /> 2. Phân Tách Error Log Theo Cấp Độ Nghiêm Trọng
                  </h4>
                  <p className="text-slate-300">
                    Sử dụng các thư viện Log chuyên nghiệp (Winston, Pino) phân tách rõ ràng thành <code className="text-cyan-300 font-mono">info</code>, <code className="text-amber-300 font-mono">warn</code>, <code className="text-rose-400 font-mono">error</code>. Đẩy log lỗi nghiêm trọng trực tiếp về hệ thống cảnh báo (Slack, Telegram, Discord, Sentry) theo thời gian thực.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <h4 className="font-black text-pink-300 flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 text-pink-400" /> 3. Thiết Kế Idempotency Key Cho API
                  </h4>
                  <p className="text-slate-300">
                    Đối với các mã lỗi mạng không chắc chắn (như 502, 504), việc Client gửi lại yêu cầu (Retry) có thể gây trùng lặp dữ liệu. Hãy sử dụng cơ chế Idempotency để đảm bảo an toàn cho các tác vụ thanh toán hoặc tạo đơn hàng.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950">
          <div className="text-xs text-slate-400 italic">
            💡 Tổng cộng 20+ mã lỗi hệ thống chuẩn ISO đã được tích hợp tra cứu tức thì.
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition"
          >
            Đóng Cẩm Nang
          </button>
        </div>
      </div>
    </div>
  );
}
