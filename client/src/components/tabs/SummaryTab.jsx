import { Award, Heart, Frown, Meh, Smile, Sparkles, Zap } from 'lucide-react';
import { useRole } from '../../context/RoleContext.jsx';
import { cx } from '../../constants/index.js';

export function SummaryTab({ plan, onUpdatePlan }) {
  const { permissions } = useRole();
  if (!plan) return null;

  const summary = plan.summary || {
    wins: '',
    incomplete: '',
    lessons: '',
    nextWeek: '',
    score: 0,
    mood: 'Bình thường',
  };

  const handleSummaryChange = (field, value) => {
    if (!permissions.canManageSummary) return;
    onUpdatePlan({
      ...plan,
      summary: {
        ...summary,
        [field]: value,
      },
    });
  };

  const moods = [
    { label: 'Hào hứng', icon: '🚀', color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300' },
    { label: 'Tốt', icon: '😊', color: 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300' },
    { label: 'Bình thường', icon: '😐', color: 'border-slate-700 bg-slate-800 text-slate-300' },
    { label: 'Mệt mỏi', icon: '😴', color: 'border-amber-500/40 bg-amber-950/40 text-amber-300' },
    { label: 'Căng thẳng', icon: '😰', color: 'border-red-500/40 bg-red-950/40 text-red-300' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upper Evaluation Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Score Rating */}
        <div className="glass-panel rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" /> Tự Đánh Giá Tuần (Thang 0 - 10)
            </h3>
            <span className="text-2xl font-black text-amber-300 font-heading">{summary.score} / 10</span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              disabled={!permissions.canManageSummary}
              value={summary.score}
              onChange={(e) => handleSummaryChange('score', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>0 (Kém)</span>
              <span>5 (Đạt)</span>
              <span>10 (Xuất sắc)</span>
            </div>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="glass-panel rounded-3xl border border-indigo-500/30 bg-indigo-950/20 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-400" /> Tâm Trạng & Cảm Xúc Cuối Tuần
          </h3>

          <div className="flex flex-wrap gap-2">
            {moods.map((m) => {
              const isSelected = summary.mood === m.label;
              return (
                <button
                  key={m.label}
                  disabled={!permissions.canManageSummary}
                  onClick={() => handleSummaryChange('mood', m.label)}
                  className={cx(
                    'flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition shadow-sm disabled:opacity-60',
                    isSelected ? m.color : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Review Textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wins / Achievements */}
        <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> 🏆 Thành Tựu & Việc Làm Tốt Trong Tuần
          </h4>
          <textarea
            rows={4}
            disabled={!permissions.canManageSummary}
            placeholder="Liệt kê những việc đã hoàn thành xuất sắc..."
            value={summary.wins || ''}
            onChange={(e) => handleSummaryChange('wins', e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
          />
        </div>

        {/* Incomplete Tasks */}
        <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Zap className="h-4 w-4" /> ⚠️ Việc Còn Tồn & Lý Do
          </h4>
          <textarea
            rows={4}
            disabled={!permissions.canManageSummary}
            placeholder="Ghi nhận những việc chưa hoàn thành và lý do nguyên nhân..."
            value={summary.incomplete || ''}
            onChange={(e) => handleSummaryChange('incomplete', e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
          />
        </div>

        {/* Lessons Learned */}
        <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Award className="h-4 w-4" /> 💡 Bài Học Rút Ra
          </h4>
          <textarea
            rows={4}
            disabled={!permissions.canManageSummary}
            placeholder="Những bài học kinh nghiệm để cải thiện hiệu suất..."
            value={summary.lessons || ''}
            onChange={(e) => handleSummaryChange('lessons', e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
          />
        </div>

        {/* Next Week Plan */}
        <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> 🎯 Kế Hoạch & Hành Động Tuần Tới
          </h4>
          <textarea
            rows={4}
            disabled={!permissions.canManageSummary}
            placeholder="Định hướng và công việc ưu tiên cho tuần kế tiếp..."
            value={summary.nextWeek || ''}
            onChange={(e) => handleSummaryChange('nextWeek', e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
