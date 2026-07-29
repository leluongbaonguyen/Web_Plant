import { Bell, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { getCurrentDayKey } from '../constants/index.js';

export function LiveReminderBanner({ liveScheduleStatus, onOpenReminders, onMarkDone }) {
  const { currentSlot, nextSlot, overdueSlots } = liveScheduleStatus;
  const todayKey = getCurrentDayKey();

  return (
    <div className="no-print rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 p-3.5 md:p-4 shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenReminders}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 hover:bg-indigo-600/50 transition cursor-pointer"
          title="Mở Trung Tâm Nhắc Nhở & Chuông Báo"
        >
          <Bell className="h-5 w-5 text-indigo-300 animate-bounce" />
          {(currentSlot || overdueSlots.length > 0) && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </button>

        <div>
          {currentSlot ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                ĐANG DIỄN RA:
              </span>
              <span className="text-sm font-extrabold text-white">{currentSlot.cell.text}</span>
              <span className="text-xs font-mono-code text-indigo-200 bg-indigo-900/60 px-2 py-0.5 rounded-lg border border-indigo-500/30 font-bold">
                {currentSlot.slot.start} - {currentSlot.slot.end} (Còn {currentSlot.minutesLeft}m)
              </span>
            </div>
          ) : nextSlot ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-sky-400" /> SẮP TỚI:
              </span>
              <span className="text-sm font-bold text-slate-100">{nextSlot.cell.text}</span>
              <span className="text-xs font-mono-code text-sky-200 bg-sky-900/60 px-2 py-0.5 rounded-lg border border-sky-500/30 font-bold">
                Bắt đầu {nextSlot.slot.start} (sau {nextSlot.minutesUntilStart}m)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Hệ thống Nhắc nhở Chớp thời gian thực đang hoạt động liên tục.</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {currentSlot && (
          <button
            onClick={() => onMarkDone(currentSlot.slot.id, todayKey, true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-bold text-white hover:scale-105 active:scale-95 transition shadow-md"
          >
            <CheckCircle2 className="h-4 w-4" /> Hoàn thành ngay
          </button>
        )}

        <button
          onClick={onOpenReminders}
          className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1.5 text-xs font-bold text-indigo-200 hover:bg-indigo-900/80 transition shadow-sm"
        >
          <Bell className="h-4 w-4 text-indigo-400" />
          <span>Trung tâm nhắc nhở</span>
          {overdueSlots.length > 0 && (
            <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-slate-950">
              {overdueSlots.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
