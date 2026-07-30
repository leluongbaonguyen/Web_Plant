import { useState } from 'react';
import { Activity, Award, CheckCircle2, Clock, ShieldCheck, Sparkles, Target, Zap, ArrowRight, Calendar, Flame, RefreshCw, Star, TrendingUp, Layers } from 'lucide-react';
import { DAYS, getCurrentDayKey, cx } from '../../constants/index.js';
import { useRole } from '../../context/RoleContext.jsx';
import { KidsEnglishDashboard } from './KidsEnglishDashboard.jsx';

const MOTIVATIONAL_QUOTES = [
  "Rà soát giữa tuần, điều chỉnh tiến độ và phục hồi năng lượng.",
  "Mỗi bước tiến nhỏ mỗi ngày sẽ tạo nên thành quả vĩ đại.",
  "Tập trung vào mục tiêu tối thượng, loại bỏ các xao nhãng không cần thiết.",
  "Kỷ luật là cầu nối giữa mục tiêu và thành tựu xuất sắc.",
  "Chiến thắng ngày hôm nay là nền tảng cho sự bứt phá của cả tuần.",
];

export function DashboardTab({ plan, onNavigateTab, addToast }) {
  const { role, roleInfo, permissions } = useRole();
  const [quoteIndex, setQuoteIndex] = useState(0);

  if (!plan) return null;

  // Render Kids English Dashboard directly if logged in as kids_english actor
  if (role === 'kids_english') {
    return <KidsEnglishDashboard plan={plan} addToast={addToast} />;
  }

  const todayKey = getCurrentDayKey();
  const schedule = plan.schedule || [];
  const totalSlots = schedule.length;
  const totalCells = totalSlots * 7;

  let completedCells = 0;
  const dayStats = {};

  DAYS.forEach((day) => {
    let dayDone = 0;
    schedule.forEach((slot) => {
      if (slot.cells?.[day.key]?.done) {
        dayDone++;
        completedCells++;
      }
    });
    const percent = totalSlots > 0 ? Math.round((dayDone / totalSlots) * 100) : 0;
    dayStats[day.key] = { done: dayDone, total: totalSlots, percent };
  });

  const overallPercent = totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0;

  const goals = plan.weeklyGoals || [];
  const completedGoals = goals.filter((g) => g.done).length;
  const goalPercent = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const todayFocus = plan.dailyFocus?.[todayKey] || MOTIVATIONAL_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* 3D Glassmorphic Master Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-purple-950/80 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/20 px-3.5 py-1 text-xs font-black text-indigo-300 shadow-inner">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" />
                <span>ChronoFlow v2.0 • Ultra-Detailed</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-300">
                <Flame className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                <span>Hiệu Suất {overallPercent}%</span>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-black font-heading text-white tracking-tight leading-tight">
              Lập Kế Hoạch Sinh Hoạt & <span className="gradient-text-indigo font-black">Quản Lý Hiệu Suất Cao</span>
            </h2>

            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Trung tâm chỉ huy thông minh hỗ trợ tự động hóa lịch tuần, đồng bộ thời gian thực đa thiết bị, và quản lý chi tiết từng khung giờ.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('schedule')}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-3 text-xs font-black text-white shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition duration-200"
              >
                <Calendar className="h-4 w-4" />
                <span>Khám Phá Lịch Tuần Chi Tiết</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigateTab('goals')}
                className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-5 py-3 text-xs font-black text-slate-200 hover:bg-slate-800 transition active:scale-95 shadow-md"
              >
                <Target className="h-4 w-4 text-emerald-400" />
                <span>Mục Tiêu Tuần ({completedGoals}/{goals.length})</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur group-hover:opacity-75 transition duration-500"></div>
              <img
                src="/assets/hero_productivity_banner.png"
                alt="Productivity Dashboard Illustration"
                className="relative h-48 md:h-56 w-auto object-contain rounded-2xl shadow-2xl transition duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive High-Fidelity Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-indigo-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Tiến Độ Tổng Thể</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <Activity className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-heading tracking-tight">{overallPercent}%</div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 h-full rounded-full transition-all duration-700 shadow-md" style={{ width: `${overallPercent}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-0.5">
            <span>{completedCells} / {totalCells} ô đã xong</span>
            <span className="text-indigo-300 font-mono-code font-bold">7 Ngày Tuần</span>
          </div>
        </div>

        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-emerald-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Mục Tiêu Tuần</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Target className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-heading tracking-tight">{goalPercent}%</div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-md" style={{ width: `${goalPercent}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-0.5">
            <span>{completedGoals} / {goals.length} mục tiêu đạt</span>
            <span className="text-emerald-300 font-mono-code font-bold">Ưu tiên cao</span>
          </div>
        </div>

        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-amber-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Điểm Số & Cảm Xúc</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300 font-heading tracking-tight">
            {plan.summary?.score || 0} <span className="text-sm font-normal text-slate-500">/ 10 ĐIỂM</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="text-slate-400">Trạng thái:</span>
            <span className="rounded-md bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-amber-300 font-bold">
              {plan.summary?.mood || 'Bình thường'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium pt-0.5">Đánh giá tổng kết tuần</p>
        </div>

        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-purple-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Vai Trò Tác Nhân</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <div className="text-lg font-black text-purple-200 font-heading">{roleInfo.name.split(' (')[0]}</div>
          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold font-mono-code bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
            <span>✓ RBAC Sign Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {permissions.canManageSlots ? 'Toàn quyền Quản trị Super Admin' : 'Quyền biên tập & xem lịch'}
          </p>
        </div>
      </div>

      {/* 7-DAY PRODUCTIVITY PROGRESS GRID */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black font-heading text-white">TIẾN ĐỘ THỰC HIỆN 7 NGÀY TRONG TUẦN</h3>
              <p className="text-xs text-slate-400">Bấm vào từng ngày để xem nhanh danh sách công việc tương ứng</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAYS.map((d) => {
            const stat = dayStats[d.key] || { done: 0, total: 0, percent: 0 };
            const isToday = d.key === todayKey;

            return (
              <div
                key={d.key}
                onClick={() => onNavigateTab('schedule')}
                className={cx(
                  'rounded-2xl border p-4 cursor-pointer transition duration-300 space-y-3 relative overflow-hidden group',
                  isToday
                    ? 'border-indigo-500 bg-indigo-950/60 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900'
                )}
              >
                {isToday && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-[9px] font-black text-white px-2 py-0.5 rounded-bl-xl shadow-md">
                    HÔM NAY ⭐
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-heading">{d.label}</span>
                  <span className="text-[10px] font-mono-code font-bold text-slate-400">{d.short}</span>
                </div>

                <div className="text-2xl font-black text-white font-heading">{stat.percent}%</div>

                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={cx(
                      'h-full rounded-full transition-all duration-500',
                      stat.percent >= 80
                        ? 'bg-emerald-500'
                        : stat.percent >= 40
                        ? 'bg-indigo-500'
                        : 'bg-amber-500'
                    )}
                    style={{ width: `${stat.percent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span>Đã xong:</span>
                  <span className="font-mono-code font-bold text-slate-200">{stat.done}/{stat.total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOCUS OF THE DAY & MOTIVATION ASSISTANT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 glass-panel rounded-3xl border border-amber-500/30 bg-slate-900/80 p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-300 font-heading">
                TRỌNG TÂM SINH HOẠT HÔM NAY ({DAYS.find((d) => d.key === todayKey)?.label})
              </h3>
            </div>

            <button
              onClick={handleNextQuote}
              className="flex items-center gap-1 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Đổi Lời Khuyên</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <p className="text-sm md:text-base font-bold text-slate-200 leading-relaxed italic">
              "{todayFocus}"
            </p>
            <div className="flex items-center justify-end gap-1 text-[11px] text-amber-400 font-bold font-mono-code">
              <Star className="h-3.5 w-3.5 fill-amber-400" /> AI Butler ChronoFlow Recommendation
            </div>
          </div>
        </div>

        <div className="md:col-span-4 glass-panel rounded-3xl border border-purple-500/30 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-purple-300 font-heading">
              BỘ ĐỘNG LỰC HẰNG NGÀY
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <span className="text-xl">🚀</span>
              <div>
                <div className="font-bold text-slate-200">Kỷ Luật Cao</div>
                <div className="text-[10px] text-slate-400">Tập trung hoàn thành 3 ưu tiên lớn</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <span className="text-xl">💧</span>
              <div>
                <div className="font-bold text-slate-200">Uống Đủ Nước</div>
                <div className="text-[10px] text-slate-400">Duy trì 2 lít nước mỗi ngày</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
