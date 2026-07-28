import { Activity, Award, CheckCircle2, Clock, ShieldCheck, Target, Zap } from 'lucide-react';
import { DAYS, getCurrentDayKey } from '../../constants/index.js';
import { useRole } from '../../context/RoleContext.jsx';

export function DashboardTab({ plan, onNavigateTab }) {
  const { roleInfo, permissions } = useRole();
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

  const todayFocus = plan.dailyFocus?.[todayKey] || 'Chưa thiết lập trọng tâm hôm nay.';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upper Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Progress Card */}
        <div className="glass-panel rounded-2xl border border-indigo-500/30 p-5 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Tiến Độ Tuần</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-slate-100 font-heading">{overallPercent}%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">{completedCells} / {totalCells} khung giờ đã hoàn thành</p>
        </div>

        {/* Weekly Goals Card */}
        <div className="glass-panel rounded-2xl border border-emerald-500/30 p-5 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Mục Tiêu Tuần</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-slate-100 font-heading">{goalPercent}%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${goalPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">{completedGoals} / {goals.length} mục tiêu đạt được</p>
        </div>

        {/* Weekly Score Card */}
        <div className="glass-panel rounded-2xl border border-amber-500/30 p-5 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Điểm Đánh Giá</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-heading">{plan.summary?.score || 0} / 10</div>
          <div className="text-xs font-semibold text-slate-300">Tâm trạng: <span className="text-amber-400">{plan.summary?.mood || 'Bình thường'}</span></div>
          <p className="text-[11px] text-slate-400">Tổng kết cuối tuần & tự đánh giá</p>
        </div>

        {/* User Role & Permission Summary */}
        <div className="glass-panel rounded-2xl border border-purple-500/30 p-5 bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Quyền Truy Cập</span>
            <ShieldCheck className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-200">{roleInfo.name.split(' (')[0]}</div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {permissions.canManageSlots ? 'Đầy đủ quyền Quản trị (Admin)' : permissions.canEditCells ? 'Quyền Chỉnh sửa nội dung' : 'Quyền Chỉ Xem'}
          </p>
          <button
            onClick={() => onNavigateTab('docs')}
            className="text-[11px] font-bold text-purple-400 hover:underline pt-1 block"
          >
            Xem ma trận quyền ➔
          </button>
        </div>
      </div>

      {/* Today Focus & Quick Action */}
      <div className="glass-panel rounded-3xl border border-indigo-500/30 bg-indigo-950/30 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400 animate-pulse" /> Trọng Tâm Hôm Nay (Hôm nay: {DAYS.find((d) => d.key === todayKey)?.label})
          </h3>
          <button
            onClick={() => onNavigateTab('schedule')}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-md"
          >
            Mở Lịch Chi Tiết ➔
          </button>
        </div>
        <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/80 p-4 text-sm font-medium text-slate-200 leading-relaxed italic">
          "{todayFocus}"
        </div>
      </div>

      {/* Day Progress Breakdown Grid */}
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
                className={`glass-panel rounded-2xl p-4 border transition-all ${
                  isToday
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isToday ? 'text-indigo-400' : 'text-slate-300'}`}>
                    {day.label} {isToday && '•'}
                  </span>
                  <span className="text-[10px] font-mono-code font-bold text-slate-400">{stat.percent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isToday ? 'bg-indigo-400' : 'bg-slate-500'}`}
                    style={{ width: `${stat.percent}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
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
