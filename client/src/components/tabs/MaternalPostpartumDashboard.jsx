import { useState } from 'react';
import { Activity, AlertTriangle, Baby, CheckCircle2, Heart, Moon, ShieldAlert, Sparkles, Sun, Droplets, Zap } from 'lucide-react';
import { MATERNAL_SAFETY_DISCLAIMER } from '../../constants/maternalData.js';

export function MaternalPostpartumDashboard({ plan, onUpdatePlan, addToast, onOpenUrgentWarnings }) {
  const profile = plan?.profile || {};

  // Feeding Tracker State
  const [feedings, setFeedings] = useState([
    { id: 'f-1', time: '06:00', type: 'Cho bé bú trực tiếp', amount: '15 phút', note: 'Bé bú ngoan' },
    { id: 'f-2', time: '09:00', type: 'Hút sữa mẹ (Pumping)', amount: '120 ml', note: 'Sữa đầu cữ' },
    { id: 'f-3', time: '12:00', type: 'Cho bé bú bình (Sữa mẹ)', amount: '100 ml', note: 'Vợ/chồng hỗ trợ' },
  ]);

  const [newTime, setNewTime] = useState('15:00');
  const [newType, setNewType] = useState('Cho bé bú trực tiếp');
  const [newAmount, setNewAmount] = useState('15 phút');

  // EPDS Questionnaire State
  const [epdsScore, setEpdsScore] = useState(0);
  const [epdsAnswers, setEpdsAnswers] = useState({ q1: 0, q2: 0, q3: 0 });

  const handleAddFeeding = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `f-${Date.now()}`,
      time: newTime,
      type: newType,
      amount: newAmount,
      note: 'Ghi nhận mới',
    };
    setFeedings([newEntry, ...feedings]);
    if (addToast) addToast(`🤱 Đã lưu cữ bú mới lúc ${newTime}!`, 'success');
  };

  const calculateEpds = (key, value) => {
    const nextAnswers = { ...epdsAnswers, [key]: Number(value) };
    setEpdsAnswers(nextAnswers);
    const total = Object.values(nextAnswers).reduce((a, b) => a + b, 0);
    setEpdsScore(total);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header Banner & Telemetry */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/60 p-5 md:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-600/30 border border-amber-500/50 text-4xl shadow-inner shrink-0">
              🤱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black font-heading text-white">
                  {profile.fullName || 'Mẹ Sau Sinh Thanh Mai'}
                </h2>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-black text-amber-300">
                  NGÀY THỨ {profile.daysPostpartum || 21} SAU SINH
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-1">
                Phương pháp sinh: <strong className="text-white font-bold">{profile.deliveryMethod || 'Sinh Mổ (Caesarean)'}</strong> | Tái khám 6 tuần: <strong className="text-emerald-300">18/08/2026</strong> | Bác sĩ: <strong className="text-indigo-300">{profile.assignedDoctor || 'BS. CKII Nguyễn Thị Mai'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenUrgentWarnings}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg hover:scale-105 transition animate-pulse"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>🚨 CẢNH BÁO NGUY HIỂM HẬU SẢN</span>
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

      {/* 2. Main Grid: Feeding Tracker & Postpartum Recovery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card A: Baby Feeding & Diaper Tracker */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-amber-500/30 bg-slate-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white font-heading flex items-center gap-2">
              <Baby className="h-5 w-5 text-amber-400" />
              <span>NHẬT KÝ CỮ BÚ & VẮT SỮA CỦA BÉ (FEEDING TRACKER)</span>
            </h3>
            <span className="text-xs text-amber-300 font-bold">Mục tiêu: 8 - 12 cữ/ngày</span>
          </div>

          {/* Quick Feeding Input Form */}
          <form onSubmit={handleAddFeeding} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 font-mono-code"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100"
            >
              <option value="Cho bé bú trực tiếp">🤱 Bú trực tiếp</option>
              <option value="Hút sữa mẹ (Pumping)">🍼 Hút sữa (Pumping)</option>
              <option value="Bú bình sữa mẹ">🍼 Sữa mẹ bú bình</option>
              <option value="Sữa công thức">🍼 Sữa công thức</option>
            </select>
            <input
              type="text"
              placeholder="Lượng ml / Thời gian..."
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100"
            />
            <button
              type="submit"
              className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-500 transition shadow-md"
            >
              + Ghi Cữ Bú
            </button>
          </form>

          {/* Feedings Log Feed */}
          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
            {feedings.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-slate-950/60 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono-code font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-1 rounded-lg">
                    {f.time}
                  </span>
                  <div>
                    <div className="font-bold text-slate-100">{f.type}</div>
                    <div className="text-[11px] text-slate-400">{f.note}</div>
                  </div>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  {f.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card B: Postpartum Depression Screening (EPDS Check-in) */}
        <div className="glass-panel rounded-3xl border border-purple-500/30 bg-slate-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white font-heading flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-400" />
              <span>SÀNG LỌC TÂM LÝ SAU SINH (EPDS)</span>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${epdsScore >= 4 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`}>
              ĐIỂM: {epdsScore}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1.5 rounded-2xl bg-slate-950 p-3 border border-slate-800">
              <label className="font-bold text-slate-200">1. Mẹ có cảm thấy vui vẻ, sảng khoái không?</label>
              <select onChange={(e) => calculateEpds('q1', e.target.value)} className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
                <option value={0}>Luôn luôn vui vẻ (0 điểm)</option>
                <option value={1}>Thỉnh thoảng vui vẻ (1 điểm)</option>
                <option value={2}>Hiếm khi cảm thấy vui (2 điểm)</option>
                <option value={3}>Không còn cảm thấy vui thích (3 điểm)</option>
              </select>
            </div>

            <div className="space-y-1.5 rounded-2xl bg-slate-950 p-3 border border-slate-800">
              <label className="font-bold text-slate-200">2. Mẹ có lo lắng quá mức không lý do?</label>
              <select onChange={(e) => calculateEpds('q2', e.target.value)} className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
                <option value={0}>Không bao giờ (0 điểm)</option>
                <option value={1}>Thỉnh thoảng lo lắng (1 điểm)</option>
                <option value={2}>Thường xuyên lo lắng (2 điểm)</option>
                <option value={3}>Rất lo lắng, hoảng sợ (3 điểm)</option>
              </select>
            </div>

            {epdsScore >= 4 ? (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1 text-rose-300">
                  <AlertTriangle className="h-3.5 w-3.5" /> Mẹ đang có dấu hiệu căng thẳng tâm lý!
                </div>
                <p>Hãy chia sẻ ngay với người thân hoặc Bác sĩ sản khoa để được hỗ trợ tinh thần kịp thời.</p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-[11px]">
                🌸 Tinh thần của mẹ đang ổn định! Hãy giữ giấc ngủ sâu & nghỉ ngơi khi bé ngủ nhé.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Postpartum Wound & Lochia Recovery Card */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-white font-heading flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          <span>KIỂM TRA PHỤC HỒI VẾT MỔ / TẦNG SINH MÔN & SẢN DỊCH HÀNG NGÀY</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Droplets className="h-4 w-4" /> 1. Theo Dõi Sản Dịch (Lochia)
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Sản dịch chuyển từ đỏ tươi ➔ hồng nhạt / nâu ➔ trắng đục. Nếu sản dịch có mùi hôi hoặc ra máu cục to ➔ Gọi ngay cấp cứu 115.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> 2. Chăm Sóc Vết Mổ / Tầng Sinh Môn
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Vết mổ khô ráo, không sưng đỏ, không chảy dịch mủ. Rửa nhẹ nhàng bằng nước ấm sau mỗi lần đi vệ sinh & lau khô.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Zap className="h-4 w-4" /> 3. Vận Động Tăng Cường Năng Lượng
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Đi lại nhẹ nhàng trong phòng từ ngày thứ 2 sau sinh để ngừa tắc mạch máu & hỗ trợ đẩy sản dịch ra ngoài tốt hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
