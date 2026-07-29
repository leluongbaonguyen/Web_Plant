import { useState } from 'react';
import { Bot, CheckCircle2, Play, Sparkles, Volume2, VolumeX, Zap, RefreshCw, Smartphone, ShieldCheck } from 'lucide-react';
import { autoMarkPastTasksCompleted, autoOptimizePlan } from '../utils/aiEngine.js';
import { getCurrentDayKey, timeToMinutes } from '../constants/index.js';
import { playChimeSound } from '../utils/audio.js';

export function MobileAutomationDock({ plan, onUpdatePlan, addToast }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  // Trigger Haptic Vibration Feedback on Mobile Devices
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate([30, 40, 30]);
      } catch (e) {
        // Ignore if unsupported
      }
    }
  };

  // 1-Tap Auto-Mark Past Tasks Completed for Today
  const handleAutoMarkPast = () => {
    triggerHaptic();
    playChimeSound();
    setIsAutoRunning(true);

    const todayKey = getCurrentDayKey();
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const updatedPlan = autoMarkPastTasksCompleted(plan, todayKey, currentMins);
    onUpdatePlan(updatedPlan);

    setTimeout(() => {
      setIsAutoRunning(false);
      addToast('⚡ Tự động hóa: Đã tích chọn hoàn thành tất cả công việc đã qua hôm nay!', 'success');
    }, 400);
  };

  // 1-Tap AI Full Schedule Smart Fill & Optimize
  const handleAiSmartOptimize = () => {
    triggerHaptic();
    playChimeSound();
    setIsAutoRunning(true);

    const updatedPlan = autoOptimizePlan(plan);
    onUpdatePlan(updatedPlan);

    setTimeout(() => {
      setIsAutoRunning(false);
      addToast('🤖 Quản gia AI đã tự động điền & tối ưu hóa toàn bộ khung giờ trống!', 'success');
    }, 500);
  };

  // Web Speech Synthesis AI Voice Spoken Butler Reminder
  const handleSpeakButlerVoice = () => {
    triggerHaptic();
    if (!('speechSynthesis' in window)) {
      addToast('Trình duyệt của bạn chưa hỗ trợ giọng nói AI Speech Synthesis.', 'info');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const todayKey = getCurrentDayKey();
    const currentSlot = plan?.schedule?.find((slot) => {
      const now = new Date();
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const startM = timeToMinutes(slot.start);
      const endM = timeToMinutes(slot.end);
      return currentMins >= startM && currentMins <= endM;
    });

    let speechText = 'Kính chào Quý chủ nhân. Quản gia AI đã kích hoạt hệ thống tự động hóa thời gian sinh hoạt.';
    if (currentSlot && currentSlot.cells?.[todayKey]?.text) {
      speechText += ` Hoạt động đang diễn ra lúc này là: ${currentSlot.cells[todayKey].text}. Chúc chủ nhân một ngày làm việc hiệu quả!`;
    } else {
      speechText += ' Hiện tại không có hoạt động bắt buộc nào. Hãy dành thời gian thư giãn và chăm sóc sức khỏe nhé!';
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    addToast('🔊 Đang phát giọng nói Quản gia AI...', 'info');
  };

  return (
    <div className="no-print space-y-3">
      {/* Universal Automation Control Bar (Desktop & Mobile) */}
      <div className="glass-panel rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-3 md:p-4 shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300">
            <Zap className="h-4 w-4 text-indigo-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <span>HỆ THỐNG TỰ ĐỘNG HÓA AI</span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.2 text-[9px] font-extrabold text-emerald-300">
                  MOBILE & PC READY
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">1-Tap tự động đánh dấu xong, điền khung giờ & phát giọng nói Quản gia</p>
          </div>
        </div>

        {/* Quick Automation Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            onClick={handleAutoMarkPast}
            disabled={isAutoRunning}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-900/80 transition active:scale-95 shadow-sm disabled:opacity-50"
            title="Tự động tích hoàn thành các việc trong quá khứ hôm nay"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Tích Xong Đã Qua</span>
          </button>

          <button
            onClick={handleAiSmartOptimize}
            disabled={isAutoRunning}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition disabled:opacity-50"
            title="Quản gia AI tự động điền toàn bộ khung giờ trống"
          >
            <Bot className="h-4 w-4 text-indigo-200" />
            <span>AI Điền Khung Giờ Trống</span>
          </button>

          <button
            onClick={handleSpeakButlerVoice}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition active:scale-95 shadow-sm ${
              isSpeaking
                ? 'border-amber-500/40 bg-amber-950/60 text-amber-300 animate-pulse'
                : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
            }`}
            title="Đọc thông báo giọng nói Quản gia AI"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4 text-amber-400" /> : <Volume2 className="h-4 w-4 text-indigo-400" />}
            <span className="hidden md:inline">{isSpeaking ? 'Dừng Đọc' : 'Đọc Giọng Nói AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
