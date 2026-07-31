import { CheckCircle2, Sparkles, Zap, BookOpen } from 'lucide-react';
import { cx } from '../../constants/index.js';

export function ToastContainer({ toasts, onOpenErrorHandbook }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cx(
            'pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-float',
            toast.type === 'error'
              ? 'bg-gradient-to-r from-red-950/95 via-slate-900/95 to-slate-950/95 border-red-500/50 text-red-200 shadow-red-950/50'
              : toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
              : 'bg-slate-900/95 border-slate-700 text-slate-200'
          )}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'error' && <Zap className="h-5 w-5 text-red-400 shrink-0 animate-bounce" />}
            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />}
            <span className="text-xs md:text-sm font-semibold">{toast.message}</span>
          </div>

          {toast.type === 'error' && onOpenErrorHandbook && (
            <button
              onClick={() => onOpenErrorHandbook(toast.errorCode || toast.message)}
              className="px-2.5 py-1 rounded-xl bg-red-600/30 text-red-200 border border-red-500/40 hover:bg-red-600 hover:text-white text-[10px] font-black transition shrink-0 flex items-center gap-1 shadow-md cursor-pointer"
              title="Tra cứu nguyên nhân & cách khắc phục trong Cẩm Nang"
            >
              <BookOpen className="h-3 w-3" /> Cẩm Nang
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
