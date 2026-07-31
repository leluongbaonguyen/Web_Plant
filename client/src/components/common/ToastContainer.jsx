import { CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { cx } from '../../constants/index.js';

export function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cx(
            'pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-float',
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-200'
              : toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900/90 border-slate-700 text-slate-200'
          )}
        >
          {toast.type === 'error' && <Zap className="h-5 w-5 text-red-400 shrink-0" />}
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
          {toast.type === 'info' && <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
