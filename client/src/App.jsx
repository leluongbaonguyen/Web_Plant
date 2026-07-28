import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Coffee,
  Copy,
  Download,
  Edit3,
  FileText,
  Filter,
  Heart,
  Info,
  Layers,
  Moon,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Square,
  Sun,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { getPlan, getWordFile, resetPlan as resetPlanApi, savePlan } from './api.js';

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function getCurrentDayKey() {
  const dayIndex = new Date().getDay();
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return map[dayIndex];
}

function playChimeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Ignore audio restrictions
  }
}


const DAYS = [
  { key: 'monday', label: 'Thứ Hai', short: 'T2' },
  { key: 'tuesday', label: 'Thứ Ba', short: 'T3' },
  { key: 'wednesday', label: 'Thứ Tư', short: 'T4' },
  { key: 'thursday', label: 'Thứ Năm', short: 'T5' },
  { key: 'friday', label: 'Thứ Sáu', short: 'T6' },
  { key: 'saturday', label: 'Thứ Bảy', short: 'T7' },
  { key: 'sunday', label: 'Chủ Nhật', short: 'CN' },
];

const TABS = [
  { id: 'dashboard', label: 'Tổng quan', icon: Activity },
  { id: 'schedule', label: 'Lịch tuần', icon: Calendar },
  { id: 'goals', label: 'Mục tiêu tuần', icon: Target },
  { id: 'summary', label: 'Tổng kết & Đánh giá', icon: Award },
  { id: 'docs', label: 'Nghiệp vụ & API Explorer', icon: BookOpen },
];

const CATEGORIES = {
  default: { label: 'Chung', color: 'border-slate-700 bg-slate-800/60 text-slate-300', dot: 'bg-slate-400' },
  study: { label: 'Học tập', color: 'border-indigo-500/30 bg-indigo-950/50 text-indigo-300', dot: 'bg-indigo-400' },
  work: { label: 'Công việc', color: 'border-sky-500/30 bg-sky-950/50 text-sky-300', dot: 'bg-sky-400' },
  health: { label: 'Sức khỏe', color: 'border-emerald-500/30 bg-emerald-950/50 text-emerald-300', dot: 'bg-emerald-400' },
  rest: { label: 'Nghỉ ngơi', color: 'border-amber-500/30 bg-amber-950/50 text-amber-300', dot: 'bg-amber-400' },
  personal: { label: 'Cá nhân', color: 'border-pink-500/30 bg-pink-950/50 text-pink-300', dot: 'bg-pink-400' },
};

function uid(prefix = 'item') {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/* Toast Notifications System */
function ToastContainer({ toasts }) {
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

/* Note Modal Dialog */
function NoteModal({ isOpen, initialValue, onSave, onClose }) {
  const [note, setNote] = useState(initialValue || '');

  useEffect(() => {
    setNote(initialValue || '');
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-400" /> Ghi chú công việc
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 font-bold text-xl">
            ×
          </button>
        </div>
        <textarea
          rows={5}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Nhập ghi chú chi tiết, lưu ý hoặc danh sách việc nhỏ..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 hover:bg-slate-800 transition"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onSave(note);
              onClose();
            }}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition"
          >
            Lưu Ghi Chú
          </button>
        </div>
      </div>
    </div>
  );
}

/* Notification & Reminders Drawer Modal */
function NotificationModal({ isOpen, onClose, liveScheduleStatus, soundEnabled, setSoundEnabled, desktopNotifyEnabled, toggleDesktopNotifications, onMarkDone }) {
  if (!isOpen) return null;
  const { currentSlot, overdueSlots, upcomingSlots } = liveScheduleStatus;
  const todayKey = getCurrentDayKey();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel h-full w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl space-y-5 flex flex-col justify-between overflow-y-auto">
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

          {/* Overdue Tasks Section */}
          {overdueSlots.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Chưa hoàn thành hôm nay ({overdueSlots.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {overdueSlots.map(({ slot, cell }) => (
                  <div key={slot.id} className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{cell.text}</div>
                      <div className="text-[11px] text-amber-400/80 font-mono-code">{slot.start} - {slot.end}</div>
                    </div>
                    <button
                      onClick={() => onMarkDone(slot.id, todayKey, true)}
                      className="rounded-lg bg-amber-600/80 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-500 transition"
                    >
                      Xong
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-indigo-400" /> Công việc sắp tới hôm nay
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {upcomingSlots.length > 0 ? (
                upcomingSlots.map(({ slot, cell, minutesUntilStart }) => (
                  <div key={slot.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{cell.text}</div>
                      <div className="text-[11px] text-slate-400 font-mono-code">{slot.start} - {slot.end}</div>
                    </div>
                    <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-bold text-indigo-300">
                      Sau {minutesUntilStart} phút
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-500 text-center">
                  Đã hết lịch dự kiến trong ngày.
                </div>
              )}
            </div>
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

/* Live Activity Banner */
function LiveReminderBanner({ liveScheduleStatus, onOpenReminders, onMarkDone }) {
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

export default function App() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('Đang tải...');
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [dayFilter, setDayFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toasts, setToasts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Direct Reminders & Notification States
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifyEnabled, setDesktopNotifyEnabled] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [lastNotifiedSlotId, setLastNotifiedSlotId] = useState(null);

  // Note Modal State
  const [activeNoteCell, setActiveNoteCell] = useState(null); // { slotId, dayKey, text }

  const importRef = useRef(null);
  const loadedRef = useRef(false);

  const addToast = (message, type = 'info') => {
    const id = uid('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time schedule scanner for live task status & reminders
  const liveScheduleStatus = useMemo(() => {
    if (!plan) return { currentSlot: null, nextSlot: null, overdueSlots: [], upcomingSlots: [] };
    const todayKey = getCurrentDayKey();
    const nowMinutes = timeToMinutes(
      `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
    );

    let currentSlot = null;
    let nextSlot = null;
    const overdueSlots = [];
    const upcomingSlots = [];

    for (const slot of plan.schedule) {
      const cell = slot.cells[todayKey];
      if (!cell?.text?.trim()) continue;

      const startMin = timeToMinutes(slot.start);
      const endMin = timeToMinutes(slot.end);

      if (nowMinutes >= startMin && nowMinutes < endMin) {
        currentSlot = { slot, cell, minutesLeft: endMin - nowMinutes };
      } else if (startMin > nowMinutes) {
        upcomingSlots.push({ slot, cell, minutesUntilStart: startMin - nowMinutes });
      } else if (endMin <= nowMinutes && !cell.done) {
        overdueSlots.push({ slot, cell });
      }
    }

    if (upcomingSlots.length) {
      upcomingSlots.sort((a, b) => a.minutesUntilStart - b.minutesUntilStart);
      nextSlot = upcomingSlots[0];
    }

    return { currentSlot, nextSlot, overdueSlots, upcomingSlots };
  }, [plan, currentTime]);

  // Trigger live activity notifications when new slot starts
  useEffect(() => {
    if (!liveScheduleStatus.currentSlot) return;
    const { slot, cell } = liveScheduleStatus.currentSlot;
    if (lastNotifiedSlotId !== slot.id) {
      setLastNotifiedSlotId(slot.id);
      const msg = `⏰ Bắt đầu: ${cell.text} (${slot.start} - ${slot.end})`;
      addToast(msg, 'info');
      if (soundEnabled) playChimeSound();
      if (desktopNotifyEnabled && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('🔔 ChronoFlow - Nhắc Nhở Trực Tiếp', {
          body: msg,
          icon: '/favicon.ico',
        });
      }
    }
  }, [liveScheduleStatus.currentSlot, soundEnabled, desktopNotifyEnabled, lastNotifiedSlotId]);

  function toggleDesktopNotifications() {
    if (!('Notification' in window)) {
      addToast('Trình duyệt của bạn không hỗ trợ thông báo desktop.', 'error');
      return;
    }
    if (Notification.permission === 'granted') {
      setDesktopNotifyEnabled(!desktopNotifyEnabled);
      addToast(!desktopNotifyEnabled ? 'Đã bật thông báo Desktop' : 'Đã tắt thông báo Desktop', 'info');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setDesktopNotifyEnabled(true);
          addToast('Đã cấp quyền & bật thông báo Desktop thành công!', 'success');
        } else {
          addToast('Chưa cấp quyền thông báo Desktop', 'error');
        }
      });
    } else {
      addToast('Quyền thông báo đã bị chặn trong cài đặt trình duyệt.', 'error');
    }
  }


  // Fetch Initial Plan
  useEffect(() => {
    let cancelled = false;
    getPlan()
      .then((data) => {
        if (cancelled) return;
        setPlan(data);
        setSaveStatus('Sẵn sàng');
        loadedRef.current = true;
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          addToast(err.message, 'error');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-save debounce
  useEffect(() => {
    if (!plan || !loadedRef.current) return undefined;
    setSaveStatus('Đang đồng bộ...');
    setIsSaving(true);
    const timer = setTimeout(() => {
      savePlan(plan)
        .then(() => {
          setSaveStatus(`Đã lưu ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`);
          setIsSaving(false);
        })
        .catch((err) => {
          setSaveStatus('Lưu thất bại');
          setIsSaving(false);
          setError(err.message);
          addToast('Không thể tự động lưu kế hoạch', 'error');
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [plan]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (!plan) return { total: 0, done: 0, rate: 0, goalsDone: 0, dayRates: {}, categoryStats: {} };
    let total = 0;
    let done = 0;
    const dayRates = {};
    const categoryStats = { default: 0, study: 0, work: 0, health: 0, rest: 0, personal: 0 };

    for (const day of DAYS) {
      let dayTotal = 0;
      let dayDone = 0;
      for (const slot of plan.schedule) {
        const cell = slot.cells[day.key];
        if (cell?.text?.trim()) {
          dayTotal += 1;
          total += 1;
          const cat = cell.category || 'default';
          categoryStats[cat] = (categoryStats[cat] || 0) + 1;
          if (cell.done) {
            dayDone += 1;
            done += 1;
          }
        }
      }
      dayRates[day.key] = dayTotal ? Math.round((dayDone / dayTotal) * 100) : 0;
    }
    const goalsDone = plan.weeklyGoals.filter((goal) => goal.done).length;
    const rate = total ? Math.round((done / total) * 100) : 0;
    return { total, done, rate, goalsDone, dayRates, categoryStats };
  }, [plan]);

  // Filtered Schedule items
  const filteredSchedule = useMemo(() => {
    if (!plan) return [];
    const keyword = search.trim().toLocaleLowerCase('vi-VN');
    return plan.schedule.filter((slot) => {
      const daysToCheck = dayFilter === 'all' ? DAYS : DAYS.filter((day) => day.key === dayFilter);
      return daysToCheck.some((day) => {
        const cell = slot.cells[day.key];
        const matchesText = !keyword || `${cell.text} ${cell.notes}`.toLocaleLowerCase('vi-VN').includes(keyword);
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'done' && cell.done) ||
          (statusFilter === 'pending' && !cell.done);
        const matchesCat = categoryFilter === 'all' || (cell.category || 'default') === categoryFilter;
        return matchesText && matchesStatus && matchesCat;
      });
    });
  }, [plan, search, dayFilter, statusFilter, categoryFilter]);

  // Handlers
  function updateMeta(field, value) {
    setPlan((cur) => ({ ...cur, meta: { ...cur.meta, [field]: value } }));
  }

  function updateSetting(field, value) {
    setPlan((cur) => ({ ...cur, settings: { ...cur.settings, [field]: value } }));
  }

  function updateFocus(dayKey, value) {
    setPlan((cur) => ({ ...cur, dailyFocus: { ...cur.dailyFocus, [dayKey]: value } }));
  }

  function updateSlot(slotId, patch) {
    setPlan((cur) => ({
      ...cur,
      schedule: cur.schedule.map((slot) => (slot.id === slotId ? { ...slot, ...patch } : slot)),
    }));
  }

  function updateCell(slotId, dayKey, field, value) {
    setPlan((cur) => ({
      ...cur,
      schedule: cur.schedule.map((slot) => (
        slot.id === slotId
          ? {
              ...slot,
              cells: {
                ...slot.cells,
                [dayKey]: { ...slot.cells[dayKey], [field]: value },
              },
            }
          : slot
      )),
    }));
  }

  function addSlot(afterId = null) {
    const cells = Object.fromEntries(
      DAYS.map((day) => [day.key, { text: '', done: false, notes: '', category: 'default' }])
    );
    const nextSlot = { id: uid('slot'), start: '08:00', end: '09:00', cells };
    setPlan((cur) => {
      const schedule = [...cur.schedule];
      if (!afterId) schedule.push(nextSlot);
      else schedule.splice(schedule.findIndex((s) => s.id === afterId) + 1, 0, nextSlot);
      return { ...cur, schedule };
    });
    addToast('Đã thêm khung giờ mới', 'info');
  }

  function duplicateSlot(slotId) {
    const target = plan.schedule.find((s) => s.id === slotId);
    if (!target) return;
    const cloned = JSON.parse(JSON.stringify(target));
    cloned.id = uid('slot');
    setPlan((cur) => {
      const idx = cur.schedule.findIndex((s) => s.id === slotId);
      const schedule = [...cur.schedule];
      schedule.splice(idx + 1, 0, cloned);
      return { ...cur, schedule };
    });
    addToast('Đã sao chép khung giờ', 'info');
  }

  function removeSlot(slotId) {
    if (plan.schedule.length <= 1) {
      addToast('Cần giữ lại ít nhất một khung giờ trong lịch', 'error');
      return;
    }
    if (!window.confirm('Bạn có chắc chắn muốn xóa khung giờ này khỏi toàn bộ 7 ngày?')) return;
    setPlan((cur) => ({ ...cur, schedule: cur.schedule.filter((s) => s.id !== slotId) }));
    addToast('Đã xóa khung giờ', 'info');
  }

  function markAllDayStatus(dayKey, isDone) {
    setPlan((cur) => ({
      ...cur,
      schedule: cur.schedule.map((slot) => ({
        ...slot,
        cells: {
          ...slot.cells,
          [dayKey]: { ...slot.cells[dayKey], done: isDone },
        },
      })),
    }));
    addToast(`Đã đánh dấu ${isDone ? 'hoàn thành' : 'chưa xong'} toàn bộ ${DAYS.find((d) => d.key === dayKey)?.label}`, 'success');
  }

  function updateGoal(goalId, field, value) {
    setPlan((cur) => ({
      ...cur,
      weeklyGoals: cur.weeklyGoals.map((g) => (g.id === goalId ? { ...g, [field]: value } : g)),
    }));
  }

  function addGoal(template = null) {
    const newGoal = template || {
      id: uid('goal'),
      title: '',
      result: '',
      priority: 'Trung bình',
      dueDay: 'Chủ Nhật',
      done: false,
      notes: '',
    };
    setPlan((cur) => ({
      ...cur,
      weeklyGoals: [...cur.weeklyGoals, newGoal],
    }));
    addToast('Đã thêm mục tiêu tuần mới', 'info');
  }

  function removeGoal(goalId) {
    setPlan((cur) => ({ ...cur, weeklyGoals: cur.weeklyGoals.filter((g) => g.id !== goalId) }));
    addToast('Đã xóa mục tiêu', 'info');
  }

  function updateSummary(field, value) {
    setPlan((cur) => ({ ...cur, summary: { ...cur.summary, [field]: value } }));
  }

  async function exportWord() {
    try {
      setSaveStatus('Đang tạo DOCX...');
      await savePlan(plan);
      const blob = await getWordFile();
      downloadBlob(blob, `ChronoFlow_Lich_Sinh_Hoat_${new Date().toISOString().slice(0, 10)}.docx`);
      addToast('Xuất file Word thành công!', 'success');
      setSaveStatus('Đã xuất Word');
    } catch (err) {
      addToast(`Lỗi xuất Word: ${err.message}`, 'error');
      setSaveStatus('Xuất thất bại');
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `ChronoFlow-backup-${new Date().toISOString().slice(0, 10)}.json`);
    addToast('Đã sao lưu tệp JSON thành công', 'success');
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed.schedule || !parsed.meta) throw new Error('Tệp không đúng cấu trúc kế hoạch ChronoFlow.');
        setPlan(parsed);
        addToast('Đã khôi phục dữ liệu từ tệp JSON!', 'success');
      } catch (err) {
        addToast(`Nhập dữ liệu thất bại: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file, 'utf-8');
    event.target.value = '';
  }

  async function resetAll() {
    if (!window.confirm('Bạn có chắc chắn muốn khôi phục lịch mẫu chuẩn ban đầu?')) return;
    try {
      const data = await resetPlanApi();
      setPlan(data);
      addToast('Đã khôi phục lịch sinh hoạt mẫu!', 'success');
    } catch (err) {
      addToast(`Lỗi khôi phục mẫu: ${err.message}`, 'error');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <div className="text-xl font-bold font-heading text-indigo-400 animate-pulse">
          Đang khởi chạy ChronoFlow Ultra-Premium...
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-red-500/30 bg-red-950/40 p-8 text-red-200 backdrop-blur-xl shadow-2xl">
        <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
          <Zap className="h-6 w-6 text-red-400" /> Không thể khởi động ứng dụng
        </h1>
        <p className="mt-3 text-slate-300">{error || 'Không thể truy vấn dữ liệu từ máy chủ Node.js backend.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white hover:bg-red-500 transition shadow-lg shadow-red-600/30"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white pb-16">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Note Modal */}
      <NoteModal
        isOpen={Boolean(activeNoteCell)}
        initialValue={activeNoteCell?.notes}
        onClose={() => setActiveNoteCell(null)}
        onSave={(newNotes) => {
          if (activeNoteCell) {
            updateCell(activeNoteCell.slotId, activeNoteCell.dayKey, 'notes', newNotes);
            addToast('Đã lưu ghi chú công việc', 'success');
          }
        }}
      />

      {/* Header Bar */}
      <header className="no-print sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex max-w-[1850px] flex-wrap items-center justify-between gap-4 px-6 py-3.5">
          {/* Brand Logo & Live Clock */}
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25 animate-float">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight font-heading gradient-text-indigo">
                  ChronoFlow<span className="text-indigo-400 font-mono-code text-xs ml-1 font-normal">v2.5 PRO</span>
                </h1>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Quản Lý Lịch Sinh Hoạt & Hiệu Suất</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono-code text-indigo-300 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {currentTime.toLocaleTimeString('vi-VN')}
                </span>
              </p>
            </div>
          </div>

          {/* Global Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="mr-2 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300">
              <span className={cx('h-2 w-2 rounded-full', isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400')}></span>
              <span>{saveStatus}</span>
            </div>

            <button
              onClick={() => setShowNotificationDrawer(true)}
              className="relative flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-3.5 py-2 text-xs font-bold text-indigo-200 hover:bg-indigo-900/80 transition shadow-lg shadow-indigo-600/20"
              title="Trung tâm thông báo & nhắc nhở"
            >
              <Bell className="h-4 w-4 text-indigo-400 animate-pulse" />
              <span>Nhắc nhở</span>
              {(liveScheduleStatus.currentSlot || liveScheduleStatus.overdueSlots.length > 0) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-slate-950 animate-bounce">
                  {(liveScheduleStatus.currentSlot ? 1 : 0) + liveScheduleStatus.overdueSlots.length}
                </span>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
              title="In hoặc Lưu PDF"
            >
              <Printer className="h-4 w-4 text-sky-400" /> In / PDF
            </button>

            <button
              onClick={exportWord}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 transition"
              title="Xuất file DOCX chuẩn định dạng"
            >
              <Download className="h-4 w-4" /> Xuất Word (.docx)
            </button>

            <button
              onClick={exportJson}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
              title="Sao lưu dữ liệu JSON"
            >
              <Share2 className="h-4 w-4 text-purple-400" /> Sao lưu
            </button>

            <button
              onClick={() => importRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
              title="Nhập dữ liệu từ JSON"
            >
              <Upload className="h-4 w-4 text-pink-400" /> Nhập JSON
            </button>

            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-900/50 transition"
              title="Khôi phục dữ liệu mẫu ban đầu"
            >
              <RefreshCw className="h-4 w-4 text-red-400" /> Khôi phục mẫu
            </button>

            <input ref={importRef} className="hidden" type="file" accept="application/json,.json" onChange={importJson} />
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="mx-auto flex max-w-[1850px] gap-2 overflow-x-auto px-6 pb-2.5 custom-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cx(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 shrink-0',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40 scale-[1.02]'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <Icon className={cx('h-4 w-4', isActive ? 'text-white' : 'text-slate-500')} />
                <span>{tab.label}</span>

                {/* Badges for tabs */}
                {tab.id === 'schedule' && (
                  <span className="ml-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-indigo-300 border border-indigo-500/20 font-mono-code">
                    {stats.rate}%
                  </span>
                )}
                {tab.id === 'goals' && (
                  <span className="ml-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-emerald-300 border border-emerald-500/20 font-mono-code">
                    {stats.goalsDone}/{plan.weeklyGoals.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Notification Drawer Modal */}
      <NotificationModal
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        liveScheduleStatus={liveScheduleStatus}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        desktopNotifyEnabled={desktopNotifyEnabled}
        toggleDesktopNotifications={toggleDesktopNotifications}
        onMarkDone={(slotId, dayKey, isDone) => {
          updateCell(slotId, dayKey, 'done', isDone);
          addToast('Đã đánh dấu hoàn thành!', 'success');
        }}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1850px] p-6 space-y-6">
        {/* Live Reminder & Activity Tracker Banner */}
        <LiveReminderBanner
          liveScheduleStatus={liveScheduleStatus}
          onOpenReminders={() => setShowNotificationDrawer(true)}
          onMarkDone={(slotId, dayKey, isDone) => {
            updateCell(slotId, dayKey, 'done', isDone);
            addToast('Đã đánh dấu hoàn thành!', 'success');
          }}
        />

        {activeTab === 'dashboard' && <DashboardView plan={plan} stats={stats} setActiveTab={setActiveTab} updateGoal={updateGoal} />}
        {activeTab === 'schedule' && (
          <ScheduleView
            plan={plan}
            filteredSchedule={filteredSchedule}
            search={search}
            setSearch={setSearch}
            dayFilter={dayFilter}
            setDayFilter={setDayFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            updateMeta={updateMeta}
            updateSetting={updateSetting}
            updateFocus={updateFocus}
            updateSlot={updateSlot}
            updateCell={updateCell}
            addSlot={addSlot}
            duplicateSlot={duplicateSlot}
            removeSlot={removeSlot}
            markAllDayStatus={markAllDayStatus}
            setActiveNoteCell={setActiveNoteCell}
            stats={stats}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsView plan={plan} updateGoal={updateGoal} addGoal={addGoal} removeGoal={removeGoal} stats={stats} />
        )}
        {activeTab === 'summary' && <SummaryView plan={plan} updateSummary={updateSummary} stats={stats} />}
        {activeTab === 'docs' && <DocumentationView />}
      </main>
    </div>
  );
}

/* ==========================================
   1. DASHBOARD VIEW COMPONENT
   ========================================== */
function DashboardView({ plan, stats, setActiveTab, updateGoal }) {
  const bestDay = useMemo(() => {
    return DAYS.reduce((best, day) => (stats.dayRates[day.key] > stats.dayRates[best.key] ? day : best), DAYS[0]);
  }, [stats]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Ultra Hero Performance Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 text-xs font-bold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Kế hoạch tuần hiện tại
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight font-heading text-slate-100">{plan.meta.title}</h2>
            <p className="max-w-3xl text-base text-slate-300 leading-relaxed">
              Khung thời gian sinh hoạt cố định: <strong className="text-indigo-300 font-mono-code">{plan.meta.wakeTime} thức dậy</strong>{' '}
              và <strong className="text-purple-300 font-mono-code">{plan.meta.sleepTime} đi ngủ</strong>. Tối ưu hóa chu kỳ giấc ngủ và năng lượng làm việc.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Productivity Ring Gauge */}
            <div className="flex items-center gap-4 rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl backdrop-blur-md">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${stats.rate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold font-mono-code text-indigo-300">{stats.rate}%</span>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Hiệu suất tuần</div>
                <div className="text-sm font-semibold text-slate-200">
                  {stats.rate >= 80 ? 'Xuất sắc 🚀' : stats.rate >= 50 ? 'Đang tiến triển 🎯' : 'Cần tăng tốc ⚡'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('schedule')}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 font-bold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition transform hover:-translate-y-0.5"
            >
              Mở Lịch Chi Tiết <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Key Metric Cards Grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          bgGlow="glow-emerald"
          label="Công việc hoàn thành"
          value={`${stats.done}/${stats.total}`}
          subtext={`Tỷ lệ hoàn thành: ${stats.rate}%`}
          badge={stats.rate >= 75 ? 'Hoạt động tốt' : 'Theo tiến độ'}
        />
        <MetricCard
          icon={Target}
          iconColor="text-indigo-400"
          bgGlow="glow-blue"
          label="Mục tiêu cốt lõi"
          value={`${stats.goalsDone}/${plan.weeklyGoals.length}`}
          subtext={`Đã xong ${plan.weeklyGoals.length ? Math.round((stats.goalsDone / plan.weeklyGoals.length) * 100) : 0}% mục tiêu`}
          badge="Tuần này"
        />
        <MetricCard
          icon={TrendingUp}
          iconColor="text-purple-400"
          bgGlow="glow-violet"
          label="Ngày hiệu quả nhất"
          value={bestDay.label}
          subtext={`${stats.dayRates[bestDay.key]}% hoàn thành`}
          badge="Đỉnh điểm"
        />
        <MetricCard
          icon={Award}
          iconColor="text-pink-400"
          bgGlow="glow-blue"
          label="Tự đánh giá & Tâm trạng"
          value={`${plan.summary.score}/10`}
          subtext={`Tâm trạng: ${plan.summary.mood}`}
          badge="Cuối tuần"
        />
      </section>

      {/* 7-Day Progress Breakdown Grid */}
      <section className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" /> Tiến Độ Hoàn Thành 7 Ngày Trong Tuần
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Theo dõi tỷ lệ hoàn thành công việc được đánh dấu theo từng ngày</p>
          </div>
          <button
            onClick={() => setActiveTab('schedule')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Quản lý chi tiết →
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {DAYS.map((day) => {
            const dayRate = stats.dayRates[day.key];
            const isWeekend = day.key === 'saturday' || day.key === 'sunday';
            const focus = plan.dailyFocus[day.key];
            return (
              <div
                key={day.key}
                className={cx(
                  'rounded-2xl border p-4 transition-all duration-300 flex flex-col justify-between hover:scale-[1.02]',
                  isWeekend
                    ? 'border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-slate-900/60'
                    : 'border-slate-800 bg-slate-900/60'
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-200">{day.label}</span>
                    <span className="font-mono-code text-xs font-bold text-indigo-300">{dayRate}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={cx(
                        'h-full rounded-full transition-all duration-500',
                        dayRate >= 80
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : dayRate >= 40
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      )}
                      style={{ width: `${dayRate}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Trọng tâm</div>
                  <div className="text-xs text-slate-300 line-clamp-2 mt-1 italic">
                    {focus || 'Chưa ghi trọng tâm...'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Goals & Wellness Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Goals Checklist Snapshot */}
        <section className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-400" /> Mục Tiêu Nổi Bật Tuần Này
            </h3>
            <button onClick={() => setActiveTab('goals')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
              Quản lý tất cả →
            </button>
          </div>

          <div className="space-y-3">
            {plan.weeklyGoals.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-slate-500 text-sm">
                Chưa có mục tiêu tuần. Nhấn sang tab "Mục tiêu tuần" để tạo mới.
              </div>
            )}
            {plan.weeklyGoals.slice(0, 5).map((goal) => (
              <div
                key={goal.id}
                className={cx(
                  'flex items-start gap-3 rounded-2xl border p-4 transition-all duration-200',
                  goal.done ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/50'
                )}
              >
                <input
                  type="checkbox"
                  checked={goal.done}
                  onChange={(e) => updateGoal(goal.id, 'done', e.target.checked)}
                  className="custom-checkbox mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className={cx('font-bold text-sm text-slate-100', goal.done && 'line-through text-slate-500')}>
                    {goal.title || 'Mục tiêu chưa đặt tên'}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{goal.result || 'Chưa nhập kết quả'}</span>
                    <span>•</span>
                    <span
                      className={cx(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        goal.priority === 'Cao'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : goal.priority === 'Trung bình'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {goal.priority}
                    </span>
                    <span>•</span>
                    <span>Hạn: {goal.dueDay}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sleep & Wellness Note Card */}
        <section className="glass-panel rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-amber-200">Lưu Ý Về Năng Lượng & Giấc Ngủ</h3>
              <p className="text-xs text-slate-400">Đảm bảo hồi phục thể chất để duy trì hiệu suất cao</p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/30 p-4 text-sm text-amber-100 leading-relaxed italic">
            "{plan.meta.note}"
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Giờ thức dậy mục tiêu</div>
              <div className="mt-1 text-lg font-extrabold font-mono-code text-indigo-400">{plan.meta.wakeTime}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400 font-medium">Giờ đi ngủ mục tiêu</div>
              <div className="mt-1 text-lg font-extrabold font-mono-code text-purple-400">{plan.meta.sleepTime}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, iconColor, bgGlow, label, value, subtext, badge }) {
  return (
    <div className={cx('glass-panel rounded-3xl p-5 border border-slate-800 transition-all duration-300 hover:border-slate-700', bgGlow)}>
      <div className="flex items-center justify-between">
        <div className={cx('flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-bold text-slate-300 border border-slate-700">
          {badge}
        </span>
      </div>
      <div className="mt-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
        <div className="mt-1 text-3xl font-extrabold font-heading text-slate-100">{value}</div>
        <div className="mt-1 text-xs text-slate-400">{subtext}</div>
      </div>
    </div>
  );
}

/* ==========================================
   2. SCHEDULE VIEW COMPONENT
   ========================================== */
function ScheduleView({
  plan,
  filteredSchedule,
  search,
  setSearch,
  dayFilter,
  setDayFilter,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  updateMeta,
  updateSetting,
  updateFocus,
  updateSlot,
  updateCell,
  addSlot,
  duplicateSlot,
  removeSlot,
  markAllDayStatus,
  setActiveNoteCell,
  stats,
}) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Config Accordion Toggle Header */}
      <section className="glass-panel rounded-3xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowConfig(!showConfig)}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-100">Cấu Hình Lịch & Ghi Chú Cố Định</h2>
              <p className="text-xs text-slate-400">Tiêu đề kế hoạch, giờ giấc ngủ và cài đặt hiển thị</p>
            </div>
          </div>
          <button className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700">
            {showConfig ? 'Thu gọn ▲' : 'Tùy chỉnh ▼'}
          </button>
        </div>

        {showConfig && (
          <div className="pt-4 border-t border-slate-800 grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fadeIn">
            <div className="lg:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-300">Tiêu đề kế hoạch</label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                value={plan.meta.title}
                onChange={(e) => updateMeta('title', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Giờ thức dậy</label>
              <input
                type="time"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono-code text-indigo-300 focus:border-indigo-500 focus:outline-none"
                value={plan.meta.wakeTime}
                onChange={(e) => updateMeta('wakeTime', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Giờ đi ngủ</label>
              <input
                type="time"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono-code text-purple-300 focus:border-indigo-500 focus:outline-none"
                value={plan.meta.sleepTime}
                onChange={(e) => updateMeta('sleepTime', e.target.value)}
              />
            </div>
            <div className="lg:col-span-4 space-y-1">
              <label className="text-xs font-bold text-slate-300">Lưu ý cố định cuối bảng</label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                value={plan.meta.note}
                onChange={(e) => updateMeta('note', e.target.value)}
              />
            </div>
            <div className="lg:col-span-4 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={plan.settings.weekendHighlight}
                  onChange={(e) => updateSetting('weekendHighlight', e.target.checked)}
                  className="custom-checkbox"
                />
                Tô sáng Thứ 7 & Chủ Nhật (Weekend Glow)
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={plan.settings.compact}
                  onChange={(e) => updateSetting('compact', e.target.checked)}
                  className="custom-checkbox"
                />
                Chế độ bảng rút gọn (Compact Rows)
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Daily Focus Cards */}
      <section className="glass-panel rounded-3xl border border-slate-800 p-5 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Zap className="h-4 w-4" /> Trọng Tâm Từng Ngày Trong Tuần
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {DAYS.map((day) => (
            <div key={day.key} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">{day.label}</span>
                <span className="font-mono-code text-indigo-300">{stats.dayRates[day.key]}%</span>
              </div>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                placeholder="Trọng tâm ngày..."
                value={plan.dailyFocus[day.key]}
                onChange={(e) => updateFocus(day.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="glass-panel rounded-3xl border border-slate-800 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                placeholder="Tìm từ khóa hoặc ghi chú..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Day Filter dropdown */}
            <select
              className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
            >
              <option value="all">Tất cả 7 ngày</option>
              {DAYS.map((day) => (
                <option key={day.key} value={day.key}>
                  {day.label} ({stats.dayRates[day.key]}%)
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="done">Đã hoàn thành (✓)</option>
              <option value="pending">Chưa hoàn thành</option>
            </select>

            {/* Category Filter */}
            <select
              className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả phân loại</option>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => addSlot()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition"
          >
            <Plus className="h-4 w-4" /> Thêm Khung Giờ
          </button>
        </div>
      </section>

      {/* Main Schedule Grid Table */}
      <section className="print-area overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-center">
          <h2 className="text-2xl font-black font-heading text-slate-100">{plan.meta.title}</h2>
          <p className="mt-1 text-xs text-indigo-300 font-mono-code">
            Khung giờ cố định: {plan.meta.wakeTime} Thức dậy | {plan.meta.sleepTime} Đi ngủ
          </p>
        </div>

        <div className="schedule-scroll overflow-x-auto custom-scrollbar">
          <table className="schedule-table min-w-[1700px] w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-left text-xs font-bold text-slate-300">
                <th className="sticky left-0 z-20 w-44 border-r border-slate-800 bg-slate-900 p-3 text-center">
                  Khung giờ
                </th>
                {DAYS.map((day) => {
                  const hidden = dayFilter !== 'all' && dayFilter !== day.key;
                  return (
                    <th
                      key={day.key}
                      className={cx(
                        'w-[220px] border-r border-slate-800 p-3 transition-opacity',
                        hidden && 'opacity-30'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100">{day.label}</span>
                        <div className="flex items-center gap-1">
                          <button
                            title={`Đánh dấu ${day.label} là hoàn thành toàn bộ`}
                            onClick={() => markAllDayStatus(day.key, true)}
                            className="no-print rounded p-0.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
                          >
                            <CheckSquare className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] font-normal text-slate-400">
                        <span>Tiến độ</span>
                        <span className="font-mono-code font-bold text-indigo-400">{stats.dayRates[day.key]}%</span>
                      </div>
                    </th>
                  );
                })}
                <th className="schedule-actions no-print w-24 p-3 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredSchedule.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Time slot column */}
                  <td className="sticky left-0 z-10 border-r border-slate-800 bg-slate-900/95 p-3 align-top">
                    <div className="space-y-2">
                      <div className="flex flex-col items-center gap-1">
                        <input
                          type="time"
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-center font-mono-code font-extrabold text-indigo-300 text-xs focus:border-indigo-500 focus:outline-none"
                          value={slot.start}
                          onChange={(e) => updateSlot(slot.id, { start: e.target.value })}
                        />
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">đến</span>
                        <input
                          type="time"
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-center font-mono-code font-extrabold text-purple-300 text-xs focus:border-indigo-500 focus:outline-none"
                          value={slot.end}
                          onChange={(e) => updateSlot(slot.id, { end: e.target.value })}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 7 Days Cells */}
                  {DAYS.map((day, idx) => {
                    const cell = slot.cells[day.key];
                    const hiddenByDay = dayFilter !== 'all' && dayFilter !== day.key;
                    const isWeekend = plan.settings.weekendHighlight && idx >= 5;
                    const catObj = CATEGORIES[cell.category || 'default'];

                    return (
                      <td
                        key={day.key}
                        className={cx(
                          'schedule-cell border-r border-slate-800/80 p-2.5 align-top transition-all duration-200',
                          isWeekend && 'bg-amber-950/10',
                          hiddenByDay && 'opacity-25',
                          cell.done && 'bg-emerald-950/20'
                        )}
                      >
                        <div className="space-y-2">
                          <textarea
                            rows={plan.settings.compact ? 2 : 3}
                            className={cx(
                              'w-full rounded-xl border p-2 text-xs leading-relaxed transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500',
                              cell.done
                                ? 'border-emerald-500/30 bg-emerald-950/30 text-slate-400 line-through'
                                : 'border-slate-800 bg-slate-900/90 text-slate-200 focus:bg-slate-900'
                            )}
                            placeholder="Nhập nội dung công việc..."
                            value={cell.text}
                            onChange={(e) => updateCell(slot.id, day.key, 'text', e.target.value)}
                          />

                          {/* Cell Actions & Category Selector */}
                          <div className="flex items-center justify-between gap-1 text-[11px]">
                            <label className="flex items-center gap-1.5 font-bold cursor-pointer text-slate-300 hover:text-slate-100">
                              <input
                                type="checkbox"
                                checked={cell.done}
                                onChange={(e) => updateCell(slot.id, day.key, 'done', e.target.checked)}
                                className="custom-checkbox"
                              />
                              <span className={cell.done ? 'text-emerald-400' : ''}>Xong</span>
                            </label>

                            <div className="flex items-center gap-1">
                              {/* Category Tag Selector */}
                              <select
                                className={cx('rounded-md px-1.5 py-0.5 text-[10px] font-semibold border', catObj.color)}
                                value={cell.category || 'default'}
                                onChange={(e) => updateCell(slot.id, day.key, 'category', e.target.value)}
                              >
                                {Object.entries(CATEGORIES).map(([k, c]) => (
                                  <option key={k} value={k} className="bg-slate-900 text-slate-200">
                                    {c.label}
                                  </option>
                                ))}
                              </select>

                              {/* Note Button */}
                              <button
                                type="button"
                                onClick={() => setActiveNoteCell({ slotId: slot.id, dayKey: day.key, notes: cell.notes })}
                                className={cx(
                                  'no-print rounded px-1.5 py-0.5 text-[10px] font-bold transition',
                                  cell.notes
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                    : 'text-slate-500 hover:text-slate-300'
                                )}
                              >
                                {cell.notes ? 'Ghi chú ★' : '+ Ghi chú'}
                              </button>
                            </div>
                          </div>

                          {/* Note Preview */}
                          {cell.notes && (
                            <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/30 p-2 text-[11px] italic text-indigo-200 flex items-start gap-1">
                              <FileText className="h-3 w-3 shrink-0 mt-0.5 text-indigo-400" />
                              <span className="line-clamp-2">{cell.notes}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Slot Actions Column */}
                  <td className="schedule-actions no-print p-3 align-top text-center">
                    <div className="flex flex-col gap-1.5">
                      <button
                        title="Thêm hàng bên dưới"
                        onClick={() => addSlot(slot.id)}
                        className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center justify-center gap-1 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5" /> Thêm
                      </button>
                      <button
                        title="Sao chép hàng"
                        onClick={() => duplicateSlot(slot.id)}
                        className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center justify-center gap-1 text-xs"
                      >
                        <Copy className="h-3.5 w-3.5" /> Nhân bản
                      </button>
                      <button
                        title="Xóa hàng này"
                        disabled={plan.schedule.length <= 1}
                        onClick={() => removeSlot(slot.id)}
                        className="rounded-lg border border-red-500/30 bg-red-950/40 p-1.5 text-red-300 hover:bg-red-900/60 transition disabled:opacity-30 flex items-center justify-center gap-1 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSchedule.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm">
            Không tìm thấy khung giờ nào phù hợp với bộ lọc hiện tại.
          </div>
        )}

        <div className="border-t border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
          <strong className="text-amber-400">Lưu ý chung: </strong>
          {plan.meta.note}
        </div>
      </section>
    </div>
  );
}

/* ==========================================
   3. GOALS VIEW COMPONENT
   ========================================== */
function GoalsView({ plan, updateGoal, addGoal, removeGoal, stats }) {
  const goalTemplates = [
    { title: 'Đọc và thực hành 2 chương sách chuyên môn', result: 'Hoàn thành ghi chú và bài tập', priority: 'Cao', dueDay: 'Thứ Sáu' },
    { title: 'Tập thể dục / Gym 4 buổi trong tuần', result: 'Ghi nhận 4 buổi tập >45 phút', priority: 'Trung bình', dueDay: 'Chủ Nhật' },
    { title: 'Hoàn thiện module tính năng ứng dụng', result: 'Pass toàn bộ test case & deploy', priority: 'Cao', dueDay: 'Thứ Năm' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <section className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-heading text-slate-100 flex items-center gap-3">
              <Target className="h-8 w-8 text-indigo-400" /> Mục Tiêu Cốt Lõi Trong Tuần
            </h2>
            <p className="mt-1 text-sm text-slate-400">Thiết lập mục tiêu thông minh (SMART), theo dõi tiến độ và đánh giá kết quả</p>
          </div>

          <button
            onClick={() => addGoal()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition"
          >
            <Plus className="h-5 w-5" /> Thêm Mục Tiêu Mới
          </button>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-300">
            <span>Tiến độ hoàn thành mục tiêu tuần</span>
            <span className="font-mono-code text-indigo-400">
              {stats.goalsDone}/{plan.weeklyGoals.length} ({plan.weeklyGoals.length ? Math.round((stats.goalsDone / plan.weeklyGoals.length) * 100) : 0}%)
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700"
              style={{
                width: `${plan.weeklyGoals.length ? Math.round((stats.goalsDone / plan.weeklyGoals.length) * 100) : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Templates suggestions */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Gợi ý mẫu nhanh:
          </span>
          {goalTemplates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => addGoal(tpl)}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:border-indigo-500/40 hover:bg-slate-800 transition"
            >
              + {tpl.title.slice(0, 24)}...
            </button>
          ))}
        </div>
      </section>

      {/* Goals Cards List */}
      <section className="space-y-4">
        {plan.weeklyGoals.length === 0 && (
          <div className="glass-panel rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
            Chưa có mục tiêu tuần nào. Nhấn nút "Thêm Mục Tiêu Mới" để bắt đầu thiết lập.
          </div>
        )}

        {plan.weeklyGoals.map((goal, index) => (
          <article
            key={goal.id}
            className={cx(
              'glass-panel rounded-3xl border p-6 transition-all duration-300 space-y-4',
              goal.done ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800 bg-slate-900/60'
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={goal.done}
                  onChange={(e) => updateGoal(goal.id, 'done', e.target.checked)}
                  className="custom-checkbox h-6 w-6"
                />
                <span className={cx('text-lg font-bold font-heading', goal.done ? 'text-emerald-400 line-through' : 'text-slate-100')}>
                  Mục tiêu #{index + 1}: {goal.title || 'Chưa đặt tên'}
                </span>
              </label>

              <button
                onClick={() => removeGoal(goal.id)}
                className="rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-900/60 transition flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" /> Xóa
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tên mục tiêu</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  value={goal.title}
                  onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                  placeholder="Ví dụ: Hoàn thành khóa học React.js..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Kết quả cần đạt / Tiêu chí đo lường</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  value={goal.result}
                  onChange={(e) => updateGoal(goal.id, 'result', e.target.value)}
                  placeholder="Ví dụ: Đạt 100% bài lab và xây dựng xong demo app..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Mức ưu tiên</label>
                <select
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  value={goal.priority}
                  onChange={(e) => updateGoal(goal.id, 'priority', e.target.value)}
                >
                  <option value="Cao">Cao 🔥</option>
                  <option value="Trung bình">Trung bình ⚡</option>
                  <option value="Thấp">Thấp ☕</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Hạn hoàn thành</label>
                <select
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  value={goal.dueDay}
                  onChange={(e) => updateGoal(goal.id, 'dueDay', e.target.value)}
                >
                  {DAYS.map((d) => (
                    <option key={d.key} value={d.label}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300">Ghi chú & Rủi ro cần lưu ý</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  value={goal.notes}
                  onChange={(e) => updateGoal(goal.id, 'notes', e.target.value)}
                  placeholder="Tài nguyên cần dùng, khó khăn dự kiến..."
                />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

/* ==========================================
   4. SUMMARY VIEW COMPONENT
   ========================================== */
function SummaryView({ plan, updateSummary, stats }) {
  const fields = [
    { key: 'wins', label: '🏆 Thành Tựu Nổi Bật', placeholder: 'Những việc đã hoàn thành xuất sắc, kỷ lục cá nhân đạt được trong tuần...' },
    { key: 'incomplete', label: '🎯 Việc Chưa Hoàn Thành & Nguyên Nhân', placeholder: 'Nêu rõ lý do chưa đạt và phương án xử lý kế tiếp...' },
    { key: 'lessons', label: '💡 Bài Học Kinh Nghiệm', placeholder: 'Điều gì hoạt động hiệu quả? Điều gì cần tối ưu hoặc dừng lại...' },
    { key: 'nextWeek', label: '🚀 Kế Hoạch & Ưu Tiên Tuần Tiếp Theo', placeholder: 'Top 3 ưu tiên lớn nhất cho tuần tới...' },
  ];

  const moods = [
    { label: 'Rất tốt', emoji: '🚀' },
    { label: 'Tốt', emoji: '🌟' },
    { label: 'Bình thường', emoji: '🧘' },
    { label: 'Mệt mỏi', emoji: '🔋' },
    { label: 'Cần phục hồi', emoji: '💤' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-3xl font-extrabold font-heading text-slate-100 flex items-center gap-3">
          <Award className="h-8 w-8 text-purple-400" /> Tổng Kết & Đánh Giá Cuối Tuần
        </h2>
        <p className="text-sm text-slate-400">Nhìn lại tiến độ thực tế, rút ra bài học và sẵn sàng cho tuần bứt phá mới</p>

        <div className="grid gap-4 sm:grid-cols-3 pt-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs text-slate-400 font-bold uppercase">Hiệu suất lịch</div>
            <div className="mt-1 text-2xl font-extrabold font-mono-code text-indigo-400">{stats.rate}%</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs text-slate-400 font-bold uppercase">Công việc hoàn thành</div>
            <div className="mt-1 text-2xl font-extrabold font-mono-code text-emerald-400">
              {stats.done}/{stats.total}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs text-slate-400 font-bold uppercase">Mục tiêu đạt được</div>
            <div className="mt-1 text-2xl font-extrabold font-mono-code text-purple-400">
              {stats.goalsDone}/{plan.weeklyGoals.length}
            </div>
          </div>
        </div>
      </section>

      {/* Self Evaluation & Mood Selector */}
      <section className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Score Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-200">Điểm Tự Đánh Giá Tuần</label>
              <span className="font-mono-code text-2xl font-black text-indigo-400">{plan.summary.score}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              value={plan.summary.score}
              onChange={(e) => updateSummary('score', Number(e.target.value))}
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-bold">
              <span>0 (Kém)</span>
              <span>5 (Đạt)</span>
              <span>10 (Xuất sắc)</span>
            </div>
          </div>

          {/* Mood Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-200">Tâm Trạng Chung Trong Tuần</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {moods.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => updateSummary('mood', m.label)}
                  className={cx(
                    'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition',
                    plan.summary.mood === m.label
                      ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow-lg shadow-purple-500/20'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                  )}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Reflection Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-3">
            <label className="text-base font-bold font-heading text-slate-100">{f.label}</label>
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              placeholder={f.placeholder}
              value={plan.summary[f.key]}
              onChange={(e) => updateSummary(f.key, e.target.value)}
            />
          </div>
        ))}
      </section>
    </div>
  );
}

/* ==========================================
   5. DOCUMENTATION & API EXPLORER VIEW
   ========================================== */
function DocumentationView() {
  const [apiResult, setApiResult] = useState(null);
  const [testingApi, setTestingApi] = useState(false);

  async function testHealth() {
    setTestingApi(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiResult({ endpoint: '/api/health', data });
    } catch (err) {
      setApiResult({ endpoint: '/api/health', error: err.message });
    } finally {
      setTestingApi(false);
    }
  }

  async function testGetPlan() {
    setTestingApi(true);
    try {
      const res = await fetch('/api/plan');
      const data = await res.json();
      setApiResult({ endpoint: '/api/plan', data });
    } catch (err) {
      setApiResult({ endpoint: '/api/plan', error: err.message });
    } finally {
      setTestingApi(false);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-3xl font-extrabold font-heading text-slate-100 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-indigo-400" /> Tài Liệu Nghiệp Vụ & API Explorer
        </h2>
        <p className="text-sm text-slate-400">Kiến trúc hệ thống, quy tắc nghiệp vụ và công cụ tương tác trực tiếp API backend</p>
      </section>

      {/* Interactive API Explorer */}
      <section className="glass-panel rounded-3xl border border-indigo-500/30 p-6 space-y-4 bg-gradient-to-br from-slate-900 to-indigo-950/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400" /> Live Interactive API Test Console
          </h3>
          <span className="text-xs font-mono-code text-indigo-300">Base URL: http://localhost:4000</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={testHealth}
            disabled={testingApi}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            GET /api/health
          </button>
          <button
            onClick={testGetPlan}
            disabled={testingApi}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
          >
            GET /api/plan
          </button>
        </div>

        {apiResult && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono-code text-xs space-y-2">
            <div className="text-indigo-400 font-bold">Response from {apiResult.endpoint}:</div>
            <pre className="max-h-60 overflow-y-auto text-slate-300 custom-scrollbar">
              {JSON.stringify(apiResult.data || apiResult.error, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* Documentation Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-3">
          <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" /> Quy Tắc Nghiệp Vụ Chính
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc pl-4">
            <li>Mỗi khung giờ có 7 ô tương ứng từ Thứ Hai đến Chủ Nhật.</li>
            <li>Một ô chỉ được tính vào tiến độ hoàn thành khi có nội dung văn bản.</li>
            <li>Tự động đồng bộ với backend sau khi dừng gõ 1 giây (Debounced Auto-save).</li>
            <li>Xuất file Word giữ nguyên định dạng khổ ngang A3, font Times New Roman cỡ 13pt chuẩn ISO.</li>
          </ul>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-3">
          <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-400" /> Kiến Trúc Kỹ Thuật
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc pl-4">
            <li>Frontend: React 19 + Vite 6 + Tailwind CSS v4.0 + Lucide Icons.</li>
            <li>Backend: Node.js 20+ với Express REST API server.</li>
            <li>Engine Xuất Bản: Thư viện `docx` tạo file binary buffer trực tiếp từ JS plan object.</li>
            <li>Data Persistence: Lưu trữ tệp JSON với ghi đè nguyên tử (atomic file write).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
