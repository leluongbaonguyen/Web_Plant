import { Bell, CheckCircle2, Clock } from 'lucide-react';
import { getCurrentDayKey } from '../constants/index.js';

export function LiveReminderBanner({ liveScheduleStatus, onOpenReminders, onMarkDone }) {
  const { currentSlot, nextSlot, overdueSlots } = liveScheduleStatus;
  const todayKey = getCurrentDayKey();

  return (
    <div className="no-print rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 p-4 shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300">
          <Bell className="h-5 w-5 animate-pulse" />
          {(currentSlot || overdueSlots.length > 0) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping"></span>
          )}
        </div>

        <div>
          {currentSlot ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span> ĐANG DIỄN RA:
              </span>
              <span className="text-sm font-extrabold text-slate-100">{currentSlot.cell.text}</span>
              <span className="text-xs font-mono-code text-indigo-300 bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-500/30">
                {currentSlot.slot.start} - {currentSlot.slot.end} (Còn {currentSlot.minutesLeft}m)
              </span>
            </div>
          ) : nextSlot ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> SẮP TỚI:
              </span>
              <span className="text-sm font-bold text-slate-200">{nextSlot.cell.text}</span>
              <span className="text-xs font-mono-code text-sky-300 bg-sky-900/50 px-2 py-0.5 rounded border border-sky-500/30">
                Bắt đầu lúc {nextSlot.slot.start} (sau {nextSlot.minutesUntilStart}m)
              </span>
            </div>
          ) : (
            <div className="text-sm text-slate-300 font-medium">Không có hoạt động cố định diễn ra ngay lúc này.</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentSlot && (
          <button
            onClick={() => onMarkDone(currentSlot.slot.id, todayKey, true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md transition"
          >
            <CheckCircle2 className="h-4 w-4" /> Hoàn thành ngay
          </button>
        )}

        <button
          onClick={onOpenReminders}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-indigo-300 hover:bg-slate-700 transition"
        >
          <Bell className="h-4 w-4 text-indigo-400" />
          <span>Trung tâm nhắc nhở</span>
          {overdueSlots.length > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-black text-slate-950">
              {overdueSlots.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
