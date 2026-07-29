import { useState } from 'react';
import { Activity, Award, CheckCircle2, Clock, ShieldCheck, Sparkles, Target, Zap, ArrowRight, RefreshCw, Heart, Baby } from 'lucide-react';
import { DAYS, getCurrentDayKey } from '../../constants/index.js';
import { useRole } from '../../context/RoleContext.jsx';
import { MaternalPregnantDashboard } from './MaternalPregnantDashboard.jsx';
import { MaternalPostpartumDashboard } from './MaternalPostpartumDashboard.jsx';

const MOTIVATIONAL_QUOTES = [
  "Rà soát giữa tuần, điều chỉnh tiến độ và phục hồi năng lượng.",
  "Mỗi bước tiến nhỏ mỗi ngày sẽ tạo nên thành quả vĩ đại.",
  "Tập trung vào mục tiêu tối thượng, loại bỏ các xao nhãng không cần thiết.",
  "Kỷ luật là cầu nối giữa mục tiêu và thành tựu xuất sắc.",
];

export function DashboardTab({ plan, onNavigateTab, onOpenUrgentWarnings, addToast }) {
  const { role, roleInfo, permissions } = useRole();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'specialized' | 'overview'

  if (!plan) return null;

  const profileMode = plan?.profile?.mode || (role === 'postpartum' ? 'postpartum' : 'pregnant');

  // If user logged in as pregnant or postpartum actor, render specialized dashboard by default
  const isMaternalActor = role === 'pregnant' || role === 'postpartum' || profileMode === 'pregnant' || profileMode === 'postpartum';
  const showSpecialized = (viewMode === 'auto' && isMaternalActor) || viewMode === 'specialized';

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
      {/* Dynamic Workspace Mode Bar for Maternal Actors */}
      {isMaternalActor && (
        <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-2 border border-pink-500/30">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
            {role === 'postpartum' || profileMode === 'postpartum' ? (
              <>
                <Baby className="h-4 w-4 text-amber-400" />
                <span>Không Gian Chuyên Biệt Tác Nhân: PHỤ NỮ SAU SINH (🤱)</span>
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 text-pink-400" />
                <span>Không Gian Chuyên Biệt Tác Nhân: PHỤ NỮ MANG THAI (🤰)</span>
              </>
            )}
          </div>

          <div className="flex gap-1 text-[11px] font-bold">
            <button
              onClick={() => setViewMode('specialized')}
              className={`px-3 py-1 rounded-xl transition ${
                showSpecialized ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Giao Diện Chuyên Biệt Y Tế
            </button>

            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-1 rounded-xl transition ${
                !showSpecialized ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Tổng Quan Lịch 7 Ngày
            </button>
          </div>
        </div>
      )}

      {/* RENDER SPECIALIZED MATERNAL DASHBOARD */}
      {showSpecialized ? (
        role === 'postpartum' || profileMode === 'postpartum' ? (
          <MaternalPostpartumDashboard plan={plan} addToast={addToast} onOpenUrgentWarnings={onOpenUrgentWarnings} />
        ) : (
          <MaternalPregnantDashboard plan={plan} addToast={addToast} onOpenUrgentWarnings={onOpenUrgentWarnings} />
        )
      ) : (
        /* STANDARD OVERVIEW DASHBOARD */
        <>
          {/* 3D Glassmorphic Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 p-6 md:p-8 shadow-2xl">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" />
                  <span>ChronoFlow Maternal & Postpartum v2.0</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
                  Quản lý Lịch Sinh Hoạt & <span className="gradient-text-indigo">An Toàn Sức Khỏe Mẹ & Bé</span>
                </h2>

                <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Hệ thống theo dõi lịch 7 ngày cho phụ nữ mang thai & sau sinh. Tự động nhắc cữ bú, tiêm chủng, đo thai máy & cảnh báo khẩn cấp CDC/WHO.
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
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Tiến Độ Lịch 7 Ngày</span>
                <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-heading">{overallPercent}%</div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 shadow-sm" style={{ width: `${overallPercent}%` }}></div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{completedCells} / {totalCells} ô cữ sinh hoạt đã hoàn thành</p>
            </div>

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

            <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Điểm Đánh Giá</span>
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Award className="h-4 w-4 text-amber-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-300 font-heading">{plan.summary?.score || 0} <span className="text-lg text-slate-500">/ 10</span></div>
              <div className="text-xs font-semibold text-slate-300">Cảm xúc: <span className="text-amber-400">{plan.summary?.mood || 'Bình thường'}</span></div>
              <p className="text-[11px] text-slate-400 font-medium">Tổng kết sức khỏe mẹ & bé</p>
            </div>

            <div className="glass-card glass-card-interactive rounded-2xl p-5 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Tác Nhân Hệ Thống</span>
                <div className="h-8 w-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              <div className="text-lg font-bold text-purple-200">{roleInfo.name.split(' (')[0]}</div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {permissions.canManageSlots ? 'Toàn quyền Quản trị (Admin)' : 'Quyền theo dõi & cập nhật nhật ký'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
