import { useState } from 'react';
import { CheckSquare, Plus, Square, Target, Trash2 } from 'lucide-react';
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
      {/* Add New Goal Toolbar */}
      {permissions.canManageGoals && (
        <div className="glass-panel rounded-3xl border border-indigo-500/30 bg-indigo-950/30 p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-400" /> Thêm Mục Tiêu Mới Trong Tuần
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Tên mục tiêu..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900/90 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Kết quả kỳ vọng cần đạt..."
              value={newResult}
              onChange={(e) => setNewResult(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900/90 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <span>Độ ưu tiên:</span>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Cao">Cao</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Thấp">Thấp</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <span>Hạn hoàn thành:</span>
                <select
                  value={newDueDay}
                  onChange={(e) => setNewDueDay(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200 focus:outline-none"
                >
                  {DAYS.map((d) => (
                    <option key={d.key} value={d.label}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddGoal}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md transition"
            >
              + Thêm Mục Tiêu
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-400" /> Danh Sách Mục Tiêu Tuần ({goals.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={cx(
                'glass-panel rounded-2xl p-5 border transition-all space-y-3',
                goal.done ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/60'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    disabled={!permissions.canManageGoals}
                    onClick={() => handleToggleGoal(goal.id)}
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 disabled:opacity-50"
                  >
                    {goal.done ? (
                      <CheckSquare className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-600" />
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
                  'rounded-lg px-2 py-0.5 text-[10px] font-bold border',
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
