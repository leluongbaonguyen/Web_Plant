import { useState } from 'react';
import { Activity, Heart, Smile, Meh, Frown, AlertCircle, X, CheckCircle, Save } from 'lucide-react';
import { postMaternalCheckIn } from '../api.js';

export function CheckInModal({ isOpen, onClose, addToast, onCheckInSaved }) {
  const [mood, setMood] = useState('Vui vẻ & Tích cực');
  const [energy, setEnergy] = useState(4);
  const [painLevel, setPainLevel] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await postMaternalCheckIn({
        mood,
        energy,
        painLevel,
        notes,
      });

      if (res.ok) {
        addToast('✅ Đã lưu Check-in sức khỏe chủ động thành công!', 'success');
        if (onCheckInSaved) onCheckInSaved(res.checkIn);
        onClose();
      } else {
        addToast(res.message || 'Lỗi khi lưu check-in!', 'error');
      }
    } catch {
      addToast('Lỗi kết nối máy chủ!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-indigo-500/40 bg-slate-900/95 p-5 md:p-6 shadow-2xl space-y-5">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">CHECK-IN SỨC KHỎE CHỦ ĐỘNG</h3>
              <p className="text-xs text-slate-400">Ghi nhận cảm xúc, năng lượng và triệu chứng hôm nay</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mood Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Tâm Trạng Hôm Nay</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: 'Vui vẻ & Tích cực', icon: '🌸' },
                { label: 'Bình thường', icon: '😐' },
                { label: 'Lo âu / Hồi hộp', icon: '😟' },
                { label: 'Mệt mỏi / Kiệt sức', icon: '😫' },
                { label: 'Buồn / U sầu', icon: '🌧️' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setMood(item.label)}
                  className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-semibold transition ${
                    mood === item.label
                      ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-md'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Rating */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300">Mức Năng Lượng (1 - 5)</label>
              <span className="font-bold text-amber-400">{energy} / 5 ⚡</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setEnergy(star)}
                  className={`flex-1 py-2 rounded-xl font-black text-sm border transition ${
                    star <= energy
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          {/* Pain Level Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300">Mức Đau / Khó Chịu (0 - 10)</label>
              <span className={`font-bold ${painLevel > 5 ? 'text-rose-400 font-extrabold' : 'text-emerald-400'}`}>
                {painLevel} / 10 {painLevel > 5 ? '⚠️ Đau nhiều' : '🟢 Bình thường'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Notes Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Ghi Chú Triệu Chứng / Thắc Mắc</label>
            <textarea
              rows={3}
              placeholder="Ghi lại triệu chứng gò tử cung, đau mưng vết mổ, hoặc câu hỏi dành cho Bác sĩ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu Check-in'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
