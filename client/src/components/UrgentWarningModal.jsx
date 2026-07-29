import { useState } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { URGENT_WARNING_SIGNS, MATERNAL_SAFETY_DISCLAIMER } from '../constants/maternalData.js';

export function UrgentWarningModal({ isOpen, onClose, addToast }) {
  const [filterAudience, setFilterAudience] = useState('all');

  if (!isOpen) return null;

  const filteredSigns = URGENT_WARNING_SIGNS.filter((sign) => {
    if (filterAudience === 'all') return true;
    return sign.audience === filterAudience || sign.audience === 'both';
  });

  const handleCallEmergency = () => {
    if (addToast) addToast('📞 Đang kết nối cuộc gọi Cấp cứu 115...', 'warning');
    window.location.href = 'tel:115';
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-rose-500/40 bg-slate-900/95 p-5 md:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between border-b border-rose-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 shadow-inner">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <span>DANH MỤC CẢNH BÁO KHẨN CẤP (CDC / WHO)</span>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-extrabold text-rose-300">
                  CẬP NHẬT 2026 🚨
                </span>
              </h3>
              <p className="text-xs text-rose-200">Các dấu hiệu nguy hiểm cần tìm chăm sóc y tế ngay lập tức</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Safety Banner */}
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-3.5 flex items-start gap-3 text-xs text-amber-200">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-300">Tuyên bố an toàn y khoa: </span>
            {MATERNAL_SAFETY_DISCLAIMER}
          </div>
        </div>

        {/* Audience Filter Pills */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterAudience('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterAudience === 'all'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Tất Cả Dấu Hiệu ({URGENT_WARNING_SIGNS.length})
            </button>
            <button
              onClick={() => setFilterAudience('pregnant')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterAudience === 'pregnant'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🤰 Thai Kỳ
            </button>
            <button
              onClick={() => setFilterAudience('postpartum')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterAudience === 'postpartum'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🤱 Sau Sinh
            </button>
          </div>

          <button
            onClick={handleCallEmergency}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:scale-105 transition animate-pulse"
          >
            <PhoneCall className="h-4 w-4" />
            <span>GỌI 115 CẤP CỨU NGAY</span>
          </button>
        </div>

        {/* Warning List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
          {filteredSigns.map((sign) => (
            <div
              key={sign.id}
              className={`rounded-2xl border p-4 space-y-2 transition ${
                sign.severity === 'EMERGENCY'
                  ? 'border-rose-500/50 bg-rose-950/30'
                  : 'border-amber-500/40 bg-amber-950/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      sign.severity === 'EMERGENCY'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {sign.severity === 'EMERGENCY' ? '🚨 KHẨN CẤP NGAY' : '⚠️ CẢNH BÁO CAO'}
                  </span>

                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Dành cho: {sign.audience === 'pregnant' ? '🤰 Thai kỳ' : sign.audience === 'postpartum' ? '🤱 Sau sinh' : '👩‍🍼 Cả hai giai đoạn'}
                  </span>
                </div>

                <span className="text-[10px] text-slate-400 italic">{sign.source}</span>
              </div>

              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 shrink-0 ${sign.severity === 'EMERGENCY' ? 'text-rose-400' : 'text-amber-400'}`} />
                <span>{sign.title}</span>
              </h4>

              <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-xs text-slate-200 flex items-start gap-2 leading-relaxed">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300">Hành động hiển thị: </span>
                  {sign.action}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support Hotline */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-indigo-400" />
            <span>Cần tư vấn y tế gấp? Hãy gọi Bác sĩ phụ trách hoặc cơ sở y tế nơi đăng ký khám.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-slate-800 px-4 py-2 font-bold text-slate-300 hover:text-white transition"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
