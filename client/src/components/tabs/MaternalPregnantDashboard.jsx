import { useState } from 'react';
import { Activity, AlertTriangle, Calendar, CheckCircle2, Heart, ShieldAlert, Sparkles, User, Utensils, Zap, PhoneCall } from 'lucide-react';
import { MATERNAL_SAFETY_DISCLAIMER } from '../../constants/maternalData.js';

export function MaternalPregnantDashboard({ plan, onUpdatePlan, addToast, onOpenUrgentWarnings }) {
  const profile = plan?.profile || {};
  const [kickCount, setKickCount] = useState(4);
  const [kickTimerActive, setKickTimerActive] = useState(false);
  const [kickStartTime, setKickStartTime] = useState(null);

  // Hospital bag items state
  const [checklist, setChecklist] = useState([
    { id: 'item-1', label: 'Căn cước công dân & Thẻ BHYT (Bản gốc + photo)', category: 'Giấy tờ', done: true },
    { id: 'item-2', label: 'Sổ khám thai, kết quả siêu âm & xét nghiệm cả thai kỳ', category: 'Giấy tờ', done: true },
    { id: 'item-3', label: 'Áo nốt cài cúc sơ sinh + Bao tay bao chân (5 bộ)', category: 'Đồ cho bé', done: false },
    { id: 'item-4', label: 'Tã dán sơ sinh (NB) + Khăn xô mềm (10 chiếc)', category: 'Đồ cho bé', done: false },
    { id: 'item-5', label: 'Váy cài nút sau sinh cho mẹ + Băng vệ sinh Mama', category: 'Đồ cho mẹ', done: false },
    { id: 'item-6', label: 'Bình nước ấm + Miếng lót thấm sữa', category: 'Đồ cho mẹ', done: false },
  ]);

  const handleKick = () => {
    if (!kickTimerActive) {
      setKickTimerActive(true);
      setKickStartTime(new Date().toLocaleTimeString('vi-VN'));
    }
    const nextCount = kickCount + 1;
    setKickCount(nextCount);
    if (addToast) addToast(`❤️ Ghi nhận thai máy! Đã cử động: ${nextCount} lần`, 'success');
  };

  const resetKickCounter = () => {
    setKickCount(0);
    setKickTimerActive(false);
    setKickStartTime(null);
    if (addToast) addToast('Đã đặt lại bộ đếm thai máy', 'info');
  };

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header Banner & Telemetry */}
      <div className="rounded-3xl border border-pink-500/40 bg-gradient-to-r from-pink-950/60 via-slate-900 to-purple-950/60 p-5 md:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-600/30 border border-pink-500/50 text-4xl shadow-inner shrink-0">
              🤰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black font-heading text-white">
                  {profile.fullName || 'Mẹ Bầu Thu Hà'}
                </h2>
                <span className="rounded-full bg-pink-500/20 border border-pink-500/40 px-3 py-1 text-xs font-black text-pink-300">
                  TUẦN THAI {profile.pregnancyWeek || 24} (TAM CÁ NGUYỆT 2)
                </span>
              </div>
              <p className="text-xs text-pink-200 mt-1">
                Ngày dự sinh dự kiến: <strong className="text-white font-bold">{profile.dueDate || '15/11/2026'}</strong> | Bác sĩ phụ trách: <strong className="text-indigo-300">{profile.assignedDoctor || 'BS. CKII Nguyễn Thị Mai'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenUrgentWarnings}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg hover:scale-105 transition animate-pulse"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>🚨 DANH MỤC CẢNH BÁO KHẨN CẤP</span>
          </button>
        </div>

        {/* Medical Safety Disclaimer */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-200 flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-300">Tuyên bố an toàn: </strong>
            {MATERNAL_SAFETY_DISCLAIMER}
          </span>
        </div>
      </div>

      {/* 2. Main Grid: Fetal Kick Counter & ANC Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card A: Interactive Fetal Kick Counter */}
        <div className="glass-panel rounded-3xl border border-pink-500/30 bg-slate-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white font-heading flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400 animate-bounce" />
              <span>BỘ ĐẾM THAI MÁY (KICK COUNTER)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              MỤC TIÊU 4+ LẦN / GIỜ
            </span>
          </div>

          <div className="text-center py-4 space-y-3 rounded-2xl bg-slate-950 border border-pink-500/20 p-4">
            <div className="text-5xl font-black text-pink-400 font-mono-code">{kickCount}</div>
            <div className="text-xs text-slate-300">Lần em bé cử động / đạp trong cữ này</div>
            {kickStartTime && (
              <div className="text-[11px] text-pink-300 italic">Bắt đầu lúc: {kickStartTime}</div>
            )}

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleKick}
                className="flex-1 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 py-3 text-xs font-black text-white hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/30 transition transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Heart className="h-4 w-4 fill-current" />
                <span>+1 EM BÉ ĐẠP</span>
              </button>

              <button
                onClick={resetKickCounter}
                className="px-3 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                Đặt Lại
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-300 space-y-1 border border-slate-800">
            <div className="font-bold text-pink-300">💡 Hướng dẫn chuẩn ACOG:</div>
            <div>• Chọn thời điểm sau bữa ăn, nằm nghiêng trái thoải mái.</div>
            <div>• Đếm mọi cử động (xoay người, đạp, chòi). Nếu thai nhi cử động từ 4 lần trở lên trong 1 giờ là bình thường.</div>
          </div>
        </div>

        {/* Card B: Antenatal Check-up Milestones (Mốc Khám Thai) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white font-heading flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" />
              <span>MỐC KHÁM THAI & XÉT NGHIỆM ĐỊNH KỲ (BỘ Y TẾ)</span>
            </h3>
            <span className="text-xs text-slate-400">8+ đợt khám chuẩn</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { week: 'Tuần 11 - 13+6', title: 'Đo độ mờ da cổ & Sàng lọc Double Test', status: 'COMPLETED', date: '15/04/2026' },
              { week: 'Tuần 20 - 22', title: 'Siêu âm hình thái 4D (Rà soát dị tật cơ quan)', status: 'COMPLETED', date: '20/06/2026' },
              { week: 'Tuần 24 - 28', title: 'Nghiệm pháp dung nạp Đường (Tiểu đường thai kỳ)', status: 'CURRENT', date: 'Hôm nay' },
              { week: 'Tuần 28 - 32', title: 'Tiêm vắc-xin Uốn ván VAT + Siêu âm tăng trưởng', status: 'UPCOMING', date: 'Dự kiến 15/08/2026' },
              { week: 'Tuần 36', title: 'Chạy NST (Non-Stress Test) & Đánh giá ngôi thai', status: 'UPCOMING', date: 'Dự kiến 10/09/2026' },
              { week: 'Tuần 38 - 40', title: 'Theo dõi dấu hiệu chuyển dạ & Khám cổ tử cung', status: 'UPCOMING', date: 'Dự kiến 01/10/2026' },
            ].map((mote, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-3.5 space-y-1.5 transition ${
                  mote.status === 'CURRENT'
                    ? 'border-pink-500/60 bg-pink-950/30'
                    : mote.status === 'COMPLETED'
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-extrabold text-pink-300 font-mono-code">{mote.week}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                      mote.status === 'CURRENT'
                        ? 'bg-pink-600 text-white animate-pulse'
                        : mote.status === 'COMPLETED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {mote.status === 'CURRENT' ? '🎯 MỐC HÔM NAY' : mote.status === 'COMPLETED' ? '✓ ĐÃ HOÀN THÀNH' : 'SẮP TỚI'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-100">{mote.title}</div>
                <div className="text-[10px] text-slate-400">Thời gian: {mote.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Hospital Bag Checklist (Sổ Tay Giỏ Đồ Đi Sinh) */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white font-heading flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>DANH MỤC CHUẨN BỊ GIỎ ĐỒ ĐI SINH (HOSPITAL BAG CHECKLIST)</span>
          </h3>
          <span className="text-xs text-emerald-400 font-bold">
            Đã chuẩn bị: {checklist.filter((i) => i.done).length} / {checklist.length} món
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition ${
                item.done
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-slate-300'
                  : 'border-slate-800 bg-slate-950 text-slate-100 hover:border-slate-700'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                  item.done ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 bg-slate-900'
                }`}
              >
                {item.done && '✓'}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{item.category}</span>
                <p className={`text-xs font-semibold leading-relaxed ${item.done ? 'line-through opacity-70' : ''}`}>
                  {item.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
