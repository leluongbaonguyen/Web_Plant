import { useState } from 'react';
import { CheckSquare, Plus, Square, Target, Trash2, Award, Sparkles } from 'lucide-react';
import { DAYS, uid, cx } from '../../constants/index.js';
import { useRole } from '../../context/RoleContext.jsx';

export function GoalsTab({ plan, onUpdatePlan }) {
  const { permissions } = useRole();
  const [newTitle, setNewTitle] = useState('');
  const [newResult, setNewResult] = useState('');
  const [newPriority, setNewPriority] = useState('Cao');
  const [newDueDay, setNewDueDay] = useState('Thứ Sáu');

  if (!plan) return null;

  const goals = plan.weeklyGoals || [];
  const completedGoals = goals.filter((g) => g.done).length;
  const goalPercent = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const handleAddGoal = () => {
    if (!permissions.canManageGoals) return;
    if (!newTitle.trim()) return;

    const newGoal = {
      id: uid('goal'),
      title: newTitle.trim(),
      result: newResult.trim(),
      priority: newPriority,
      dueDay: newDueDay,
      done: false,
      notes: '',
    };

    onUpdatePlan({ ...plan, weeklyGoals: [...goals, newGoal] });
    setNewTitle('');
    setNewResult('');
  };

  const handleToggleGoal = (id) => {
    if (!permissions.canManageGoals) return;
    const nextGoals = goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g));
    onUpdatePlan({ ...plan, weeklyGoals: nextGoals });
  };

  const handleDeleteGoal = (id) => {
    if (!permissions.canManageGoals) return;
    const nextGoals = goals.filter((g) => g.id !== id);
    onUpdatePlan({ ...plan, weeklyGoals: nextGoals });
  };

  const handleGoalChange = (id, field, value) => {
    if (!permissions.canManageGoals) return;
    const nextGoals = goals.map((g) => (g.id === id ? { ...g, [field]: value } : g));
    onUpdatePlan({ ...plan, weeklyGoals: nextGoals });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Visual Goals Header Banner with 3D Artwork */}
      <div className="glass-panel rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 md:p-8 shadow-2xl overflow-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Thiết Lập Mục Tiêu Trọng Tâm</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-white">
              Mục Tiêu Trọng Tâm Trong Tuần (<span className="text-emerald-400">{completedGoals}/{goals.length}</span>)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Xác định các mục tiêu ưu tiên cao nhất cần hoàn thành trong tuần. Theo dõi tỷ lệ đạt được theo thời gian thực.
            </p>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Tiến độ mục tiêu:</span>
                <span className="text-emerald-400">{goalPercent}%</span>
              </div>
              <div className="w-full max-w-md bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-md" style={{ width: `${goalPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end">
            <img
              src="/assets/focus_goals_artwork.png"
              alt="Goals Artwork"
              className="h-36 md:h-44 w-auto object-contain rounded-2xl shadow-xl transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Add New Goal Form */}
      {permissions.canManageGoals && (
        <div className="glass-panel rounded-3xl border border-indigo-500/30 bg-slate-900/90 p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-400" /> Thêm Mục Tiêu Trọng Tâm Mới
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Tên mục tiêu..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Kết quả kỳ vọng cần đạt..."
              value={newResult}
              onChange={(e) => setNewResult(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <span>Ưu tiên:</span>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Cao">Cao</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Thấp">Thấp</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <span>Hạn hoàn thành:</span>
                <select
                  value={newDueDay}
                  onChange={(e) => setNewDueDay(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:outline-none"
                >
                  {DAYS.map((d) => (
                    <option key={d.key} value={d.label}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddGoal}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:scale-105 active:scale-95 transition shadow-md"
            >
              + Thêm Mục Tiêu
            </button>
          </div>
        </div>
      )}

      {/* Goals List Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-400" /> Danh Sách Mục Tiêu Tuần ({goals.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={cx(
                'glass-card rounded-2xl p-5 border transition-all space-y-3',
                goal.done ? 'border-emerald-500/40 bg-emerald-950/20 shadow-md' : 'border-slate-800 bg-slate-900/60'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    disabled={!permissions.canManageGoals}
                    onClick={() => handleToggleGoal(goal.id)}
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 disabled:opacity-50 transition"
                  >
                    {goal.done ? (
                      <CheckSquare className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <input
                      type="text"
                      disabled={!permissions.canManageGoals}
                      value={goal.title}
                      onChange={(e) => handleGoalChange(goal.id, 'title', e.target.value)}
                      className={cx(
                        'w-full bg-transparent font-bold text-sm text-slate-100 focus:outline-none disabled:cursor-not-allowed',
                        goal.done ? 'line-through text-slate-400' : ''
                      )}
                    />
                    <input
                      type="text"
                      disabled={!permissions.canManageGoals}
                      placeholder="Kết quả kỳ vọng..."
                      value={goal.result || ''}
                      onChange={(e) => handleGoalChange(goal.id, 'result', e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {permissions.canManageGoals && (
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <span className={cx(
                  'rounded-lg px-2.5 py-0.5 text-[10px] font-bold border',
                  goal.priority === 'Cao'
                    ? 'border-red-500/30 bg-red-950/40 text-red-300'
                    : goal.priority === 'Trung bình'
                    ? 'border-amber-500/30 bg-amber-950/40 text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                )}>
                  Ưu tiên: {goal.priority}
                </span>

                <span className="text-slate-400 font-medium">Hạn: {goal.dueDay}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
