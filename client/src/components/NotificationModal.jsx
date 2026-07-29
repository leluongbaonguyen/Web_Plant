import { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, Clock, Sparkles, Volume2, VolumeX, Zap, ShieldCheck, Heart, Leaf } from 'lucide-react';
import { getCurrentDayKey, cx } from '../constants/index.js';
import { dispatchMobileLockScreenNotification } from '../utils/notifications.js';
import { MATERNAL_REMINDER_TEMPLATES } from '../constants/maternalData.js';

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
  const [filterAudience, setFilterAudience] = useState('all');

  if (!isOpen) return null;

  const { currentSlot } = liveScheduleStatus;
  const todayKey = getCurrentDayKey();

  function handleSendCustomNotification() {
    const title = customTitle.trim() || '🔔 Nhắc nhở trực tiếp từ ChronoFlow Maternal';
    const body = customMessage.trim() || 'Đã đến lúc kiểm tra đơn thuốc và lịch sinh hoạt thai kỳ / sau sinh!';

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

  function handleSendTemplateReminder(tpl) {
    triggerSoundNotification();
    dispatchMobileLockScreenNotification(
      `🔔 ${tpl.category}: ${tpl.title}`,
      `${tpl.message} (Mức ưu tiên: ${tpl.priority})`,
      0
    );
  }

  const filteredTemplates = MATERNAL_REMINDER_TEMPLATES.filter((tpl) => {
    if (filterAudience === 'all') return true;
    return tpl.audience === filterAudience;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel h-full w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900/95 p-5 md:p-6 shadow-2xl space-y-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-400 animate-bounce" /> Trung Tâm Lời Nhắc Thai Kỳ & Sau Sinh
            </h3>
            <button onClick={onClose} className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white transition">
              ×
            </button>
          </div>

          {/* Sound & Desktop Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cx(
                'flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-bold transition border',
                soundEnabled ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'
              )}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-indigo-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
              <span>{soundEnabled ? 'Âm Thanh: BẬT' : 'Âm Thanh: TẮT'}</span>
            </button>

            <button
              onClick={toggleDesktopNotifications}
              className={cx(
                'flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-bold transition border',
                desktopNotifyEnabled ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'
              )}
            >
              <Bell className="h-4 w-4 text-emerald-400" />
              <span>{desktopNotifyEnabled ? 'Desktop: BẬT' : 'Desktop: TẮT'}</span>
            </button>
          </div>

          {/* Sound Mode Selection */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-purple-300 uppercase tracking-wider">
                <Volume2 className="h-4 w-4 text-purple-400" /> Kiểu Âm Báo Nhắc Việc
              </span>
              {soundMode === 'special_60s' && (
                <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-[10px] font-extrabold text-purple-300">
                  Chuông Báo 60 giây
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSoundMode('chime')}
                className={cx(
                  'rounded-xl p-2 text-xs font-bold transition border text-left flex flex-col gap-0.5',
                  soundMode === 'chime'
                    ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                )}
              >
                <span>🔔 Chime Tiêu Chuẩn</span>
                <span className="text-[9px] text-slate-400">Âm ngắn 0.5s</span>
              </button>

              <button
                onClick={() => setSoundMode('special_60s')}
                className={cx(
                  'rounded-xl p-2 text-xs font-bold transition border text-left flex flex-col gap-0.5',
                  soundMode === 'special_60s'
                    ? 'bg-purple-950/80 border-purple-500/50 text-purple-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                )}
              >
                <span>🎶 Âm Báo 60 giây</span>
                <span className="text-[9px] text-purple-300/80">Nhắc chuông kéo dài</span>
              </button>
            </div>
          </div>

          {/* Maternal Template Reminders Catalog (Section 4.2 & 5.2) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Mẫu Lời Nhắc Chuẩn Y Tế (WHO/ACOG)
              </h4>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilterAudience('all')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${filterAudience === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterAudience('pregnant')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${filterAudience === 'pregnant' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  🤰 Mang thai
                </button>
                <button
                  onClick={() => setFilterAudience('postpartum')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${filterAudience === 'postpartum' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  🤱 Sau sinh
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-1.5 hover:border-indigo-500/40 transition"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-indigo-300 uppercase px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30">
                      {tpl.category} • {tpl.stageRange}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Đã Duyệt Y Khoa
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{tpl.title}</span>
                  </h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{tpl.message}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                    <span className="text-slate-400 italic">Nguồn: {tpl.source}</span>
                    <button
                      onClick={() => handleSendTemplateReminder(tpl)}
                      className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-white font-bold hover:bg-indigo-500 transition shadow-sm"
                    >
                      <Zap className="h-3 w-3" /> Bật Nhắc Việc
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Notification Dispatcher */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-3.5 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Tự Tạo Thông Báo Tùy Chỉnh
            </h4>
            <input
              type="text"
              placeholder="Tiêu đề thông báo..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <textarea
              rows={2}
              placeholder="Nội dung nhắc nhở..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Number(e.target.value))}
                className="rounded-xl border border-slate-700 bg-slate-900/90 p-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value={0}>Gửi ngay bây giờ</option>
                <option value={1}>Hẹn sau 1 phút</option>
                <option value={5}>Hẹn sau 5 phút</option>
                <option value={15}>Hẹn sau 15 phút</option>
              </select>

              <button
                onClick={handleSendCustomNotification}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-md transition flex items-center gap-1"
              >
                <Zap className="h-3.5 w-3.5" /> Gửi Nhắc
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg"
        >
          Đóng Trung Tâm Lời Nhắc
        </button>
      </div>
    </div>
  );
}
