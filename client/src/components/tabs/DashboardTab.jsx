import { useState } from 'react';
import { Activity, Award, CheckCircle2, Clock, ShieldCheck, Sparkles, Target, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import { DAYS, getCurrentDayKey } from '../../constants/index.js';
import { useRole } from '../../context/RoleContext.jsx';

const MOTIVATIONAL_QUOTES = [
  "Rà soát giữa tuần, điều chỉnh tiến độ và phục hồi năng lượng.",
  "Mỗi bước tiến nhỏ mỗi ngày sẽ tạo nên thành quả vĩ đại.",
  "Tập trung vào mục tiêu tối thượng, loại bỏ các xao nhãng không cần thiết.",
  "Kỷ luật là cầu nối giữa mục tiêu và thành tựu xuất sắc.",
];

export function DashboardTab({ plan, onNavigateTab }) {
  const { roleInfo, permissions } = useRole();
  const [quoteIndex, setQuoteIndex] = useState(0);

  if (!plan) return null;

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 3D Glassmorphic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" />
              <span>EduSchedule Enterprise v2.5</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Quản lý Thời khóa biểu & <span className="gradient-text-indigo">Năng Suất Đỉnh Cao</span>
            </h2>

            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Hệ thống theo dõi lịch sinh hoạt 1 tuần thông minh. Tự động đồng bộ Supabase Cloud, thông báo nhắc nhở thời gian thực và phân quyền 3 cấp.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('schedule')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition"
              >
                <span>Mở Lịch Chi Tiết</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigateTab('goals')}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
              >
                <Target className="h-4 w-4 text-emerald-400" />
                <span>Mục Tiêu Tuần ({completedGoals}/{goals.length})</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative group">
              <img
                src="/assets/hero_productivity_banner.png"
                alt="Productivity Dashboard Illustration"
                className="h-44 md:h-52 w-auto object-contain rounded-2xl shadow-2xl transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Progress Card */}
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Tiến Độ Tuần</span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Activity className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-heading">{overallPercent}%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 shadow-sm" style={{ width: `${overallPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{completedCells} / {totalCells} khung giờ đã hoàn thành</p>
        </div>

        {/* Weekly Goals Card */}
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Mục Tiêu Tuần</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-heading">{goalPercent}%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-sm" style={{ width: `${goalPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{completedGoals} / {goals.length} mục tiêu đạt được</p>
        </div>

        {/* Weekly Score Card */}
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Điểm Đánh Giá</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Award className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300 font-heading">{plan.summary?.score || 0} <span className="text-lg text-slate-500">/ 10</span></div>
          <div className="text-xs font-semibold text-slate-300">Tâm trạng: <span className="text-amber-400">{plan.summary?.mood || 'Bình thường'}</span></div>
          <p className="text-[11px] text-slate-400 font-medium">Tổng kết cuối tuần & tự đánh giá</p>
        </div>

        {/* User Role Card */}
        <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Quyền Truy Cập</span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          <div className="text-lg font-bold text-purple-200">{roleInfo.name.split(' (')[0]}</div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {permissions.canManageSlots ? 'Đầy đủ quyền Quản trị (Admin)' : permissions.canEditCells ? 'Quyền Chỉnh sửa nội dung' : 'Quyền Chỉ Xem'}
          </p>
          <button
            onClick={() => onNavigateTab('agent_workspace')}
            className="text-[11px] font-bold text-purple-400 hover:underline pt-0.5 block flex items-center gap-1"
          >
            <span>Không gian Tác nhân</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Today Focus & Interactive Quote Banner */}
      <div className="glass-panel rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400 animate-pulse" /> Trọng Tâm Hôm Nay ({DAYS.find((d) => d.key === todayKey)?.label})
          </h3>
          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
            title="Đổi câu nói động lực"
          >
            <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
            <span>Đổi động lực</span>
          </button>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-slate-950/60 p-4 text-sm font-medium text-slate-200 leading-relaxed italic flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-indigo-400 shrink-0"></div>
          <span>"{todayFocus}"</span>
        </div>
      </div>

      {/* Daily Progress Breakdown Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-400" /> Tiến Độ Từng Ngày Trong Tuần
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
          {DAYS.map((day) => {
            const isToday = day.key === todayKey;
            const stat = dayStats[day.key];
            return (
              <div
                key={day.key}
                className={`glass-card rounded-2xl p-4 border transition-all ${
                  isToday
                    ? 'border-indigo-500 bg-indigo-950/50 shadow-lg shadow-indigo-500/20 scale-102'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isToday ? 'text-indigo-300' : 'text-slate-300'}`}>
                    {day.label} {isToday && '•'}
                  </span>
                  <span className="text-[10px] font-mono-code font-bold text-slate-400">{stat.percent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isToday ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-slate-600'}`}
                    style={{ width: `${stat.percent}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between font-medium">
                  <span>Hoàn thành:</span>
                  <span className="font-bold text-slate-200">{stat.done}/{stat.total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
