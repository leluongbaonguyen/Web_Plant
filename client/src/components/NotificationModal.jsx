import { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, Clock, Sparkles, Volume2, VolumeX, Zap } from 'lucide-react';
import { getCurrentDayKey, cx } from '../constants/index.js';
import { dispatchMobileLockScreenNotification } from '../utils/notifications.js';

export function NotificationModal({
  isOpen,
  onClose,
  liveScheduleStatus,
  soundEnabled,
  setSoundEnabled,
  soundMode,
  setSoundMode,
  desktopNotifyEnabled,
  toggleDesktopNotifications,
  onMarkDone,
  triggerSoundNotification,
  isAlarmPlaying,
  alarmSecondsLeft,
  handleStopAlarm,
}) {
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [delayMinutes, setDelayMinutes] = useState(0);

  if (!isOpen) return null;

  const { currentSlot, overdueSlots, upcomingSlots } = liveScheduleStatus;
  const todayKey = getCurrentDayKey();

  function handleSendCustomNotification() {
    const title = customTitle.trim() || '🔔 Nhắc nhở trực tiếp từ ChronoFlow';
    const body = customMessage.trim() || 'Đã đến lúc kiểm tra công việc và lịch sinh hoạt của bạn!';

    const delayMs = delayMinutes * 60 * 1000;
    triggerSoundNotification();

    if (delayMinutes > 0) {
      dispatchMobileLockScreenNotification('⏰ Đã lên lịch thông báo', `Sẽ thông báo "${title}" sau ${delayMinutes} phút.`);
      dispatchMobileLockScreenNotification(title, body, delayMs);
    } else {
      dispatchMobileLockScreenNotification(title, body, 0);
    }

    setCustomTitle('');
    setCustomMessage('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel h-full w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl space-y-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
              <Bell className="h-6 w-6 text-indigo-400 animate-bounce" /> Trung Tâm Nhắc Nhở Trực Tiếp
            </h3>
            <button onClick={onClose} className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white transition">
              ×
            </button>
          </div>

          {/* Alert Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cx(
                'flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition border',
                soundEnabled ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'
              )}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-indigo-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
              <span>{soundEnabled ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT'}</span>
            </button>

            <button
              onClick={toggleDesktopNotifications}
              className={cx(
                'flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition border',
                desktopNotifyEnabled ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'
              )}
            >
              <Bell className="h-4 w-4 text-emerald-400" />
              <span>{desktopNotifyEnabled ? 'Desktop: BẬT' : 'Desktop: TẮT'}</span>
            </button>
          </div>

          {/* Sound Mode Selection */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-purple-300 uppercase tracking-wider">
                <Volume2 className="h-4 w-4 text-purple-400" /> Kiểu Âm Thanh Nhắc Nhở
              </span>
              {soundMode === 'special_60s' && (
                <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-[10px] font-extrabold text-purple-300">
                  Đặc Biệt 1 Phút
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSoundMode('chime')}
                className={cx(
                  'rounded-xl p-2.5 text-xs font-bold transition border text-left flex flex-col gap-0.5',
                  soundMode === 'chime'
                    ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                )}
              >
                <span>🔔 Chime Tiêu Chuẩn</span>
                <span className="text-[10px] font-normal text-slate-400">Âm ngắn 0.5 giây</span>
              </button>

              <button
                onClick={() => setSoundMode('special_60s')}
                className={cx(
                  'rounded-xl p-2.5 text-xs font-bold transition border text-left flex flex-col gap-0.5',
                  soundMode === 'special_60s'
                    ? 'bg-purple-950/80 border-purple-500/50 text-purple-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                )}
              >
                <span>🎶 Âm Báo Đặc Biệt</span>
                <span className="text-[10px] font-normal text-purple-300/80">Kéo dài 1 phút (60s)</span>
              </button>
            </div>

            {/* Test Audio Controls */}
            <div className="pt-1">
              {isAlarmPlaying ? (
                <button
                  onClick={handleStopAlarm}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 px-3 text-xs font-bold text-white shadow-lg transition animate-pulse"
                >
                  <VolumeX className="h-4 w-4" />
                  <span>Dừng Âm Thanh Đặc Biệt (Còn {alarmSecondsLeft}s)</span>
                </button>
              ) : (
                <button
                  onClick={() => triggerSoundNotification(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 py-2 px-3 text-xs font-bold text-purple-200 transition"
                >
                  <Volume2 className="h-4 w-4 text-purple-300" />
                  <span>Phát Thử Âm Báo ({soundMode === 'special_60s' ? 'Đặc biệt 1 phút' : 'Chime 0.5s'})</span>
                </button>
              )}
            </div>
          </div>

          {/* Custom Direct Notification Dispatcher */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400" /> Gửi thông báo trực tiếp đến màn hình
            </h4>
            <input
              type="text"
              placeholder="Tiêu đề thông báo..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <textarea
              rows={2}
              placeholder="Nội dung thông báo chi tiết..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Number(e.target.value))}
                className="rounded-xl border border-slate-700 bg-slate-900/90 p-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value={0}>Gửi ngay bây giờ</option>
                <option value={1}>Hẹn gửi sau 1 phút</option>
                <option value={5}>Hẹn gửi sau 5 phút</option>
                <option value={15}>Hẹn gửi sau 15 phút</option>
              </select>

              <button
                onClick={handleSendCustomNotification}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-md transition flex items-center gap-1"
              >
                <Zap className="h-3.5 w-3.5" /> Gửi Ngay
              </button>
            </div>
          </div>

          {/* Current Active Task Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-400" /> Đang diễn ra ngay lúc này
            </h4>
            {currentSlot ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {currentSlot.slot.start} - {currentSlot.slot.end} (Còn {currentSlot.minutesLeft} phút)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="text-base font-bold text-slate-100">{currentSlot.cell.text}</div>
                {currentSlot.cell.notes && <div className="text-xs text-slate-300 italic">{currentSlot.cell.notes}</div>}
                <button
                  onClick={() => onMarkDone(currentSlot.slot.id, todayKey, true)}
                  className="w-full mt-2 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" /> Đánh dấu hoàn thành
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 text-center">
                Không có lịch hoạt động cố định nào vào thời điểm hiện tại.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
        >
          Đóng Trung Tâm Nhắc Nhở
        </button>
      </div>
    </div>
  );
}
