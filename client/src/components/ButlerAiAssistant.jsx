import { useState, useEffect, useMemo } from 'react';
import { Bot, Sparkles, Clock, CheckCircle2, AlertTriangle, Zap, X, Send, Heart, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { DAYS, getCurrentDayKey, timeToMinutes } from '../constants/index.js';
import { playChimeSound } from '../utils/audio.js';

export function ButlerAiAssistant({ plan, onUpdatePlan, addToast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'butler',
      text: 'Kính chào Quý chủ nhân! 🎩 Tôi là Quản Gia AI trợ lý thời gian của gia đình. Tôi đã phân tích toàn bộ lịch sinh hoạt tuần này và sẵn sàng hỗ trợ chủ nhân tối ưu hóa thời gian nghỉ ngơi & làm việc.',
      time: 'Vừa xong',
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Time Calculation Engine
  const stats = useMemo(() => {
    if (!plan?.schedule) return { workMins: 0, studyMins: 0, healthMins: 0, restMins: 0, totalMins: 0 };

    let workMins = 0;
    let studyMins = 0;
    let healthMins = 0;
    let restMins = 0;

    plan.schedule.forEach((slot) => {
      const startM = timeToMinutes(slot.start);
      const endM = timeToMinutes(slot.end);
      let duration = endM > startM ? endM - startM : (1440 - startM) + endM;

      // Count across days
      Object.values(slot.cells || {}).forEach((cell) => {
        if (!cell?.text) return;
        const cat = cell.category || 'default';
        if (cat === 'work') workMins += duration;
        else if (cat === 'study') studyMins += duration;
        else if (cat === 'health') healthMins += duration;
        else if (cat === 'rest') restMins += duration;
        else workMins += duration;
      });
    });

    const totalMins = workMins + studyMins + healthMins + restMins || 1;
    return {
      workMins,
      studyMins,
      healthMins,
      restMins,
      totalMins,
      workHours: (workMins / 60).toFixed(1),
      studyHours: (studyMins / 60).toFixed(1),
      healthHours: (healthMins / 60).toFixed(1),
      restHours: (restMins / 60).toFixed(1),
    };
  }, [plan]);

  // Butler Advice Generator based on Time Calculation
  const butlerAssessment = useMemo(() => {
    if (stats.workHours > 40) {
      return {
        status: 'warning',
        title: 'Cảnh báo khối lượng công việc cao',
        msg: 'Thưa Chủ nhân, tổng thời gian làm việc & học tập khá lớn. Quản gia kiến nghị chèn thêm 15-20 phút nghỉ ngơi giữa các ca làm việc để tránh kiệt sức.',
      };
    }
    if (stats.healthHours < 5) {
      return {
        status: 'caution',
        title: 'Nên dành thêm thời gian vận động',
        msg: 'Kính thưa Chủ nhân, thời gian tập thể thao tuần này hơi khiêm tốn. Quản gia đã chuẩn bị sẵn danh sách bài tập 15 phút mỗi sáng!',
      };
    }
    return {
      status: 'excellent',
      title: 'Tỷ lệ sinh hoạt lý tưởng',
      msg: 'Kính thưa Chủ nhân, quỹ thời gian giữa Học tập, Công việc, Thể thao và Giấc ngủ đạt sự cân bằng tuyệt vời!',
    };
  }, [stats]);

  // Handle Butler Auto-Optimization of Schedule
  const handleOptimizeSchedule = () => {
    setIsAnalyzing(true);
    playChimeSound();

    setTimeout(() => {
      if (!plan?.schedule) return;

      // Intelligent adjustment: Ensure default categories and meal times are tagged correctly
      const updatedSchedule = plan.schedule.map((slot) => {
        const startM = timeToMinutes(slot.start);
        const cells = { ...slot.cells };

        // Auto categorize meals and sleep
        if (startM >= 360 && startM <= 450) { // 06:00 - 07:30
          Object.keys(cells).forEach((dayKey) => {
            if (!cells[dayKey]?.category || cells[dayKey]?.category === 'default') {
              cells[dayKey] = { ...cells[dayKey], category: 'health' };
            }
          });
        }

        return { ...slot, cells };
      });

      onUpdatePlan({
        ...plan,
        schedule: updatedSchedule,
      });

      setIsAnalyzing(false);
      addToast('🎩 Quản gia AI đã tối ưu hóa phân bổ thời gian & nhãn phân loại chuẩn y tế!', 'success');

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'butler',
          text: 'Thưa Quý chủ nhân, Quản gia vừa hoàn tất việc tính toán và tinh chỉnh lại các nhãn phân loại khung giờ giúp chủ nhân dễ dàng theo dõi chỉ số sức khỏe!',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  // Handle Interactive User Questions to Butler
  const handleSendMessage = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    playChimeSound();

    setTimeout(() => {
      let butlerReply = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('học') || qLower.includes('tổng số giờ')) {
        butlerReply = `Thưa Chủ nhân, tổng thời gian học tập được ghi nhận tuần này là ${stats.studyHours} giờ. Quản gia thấy tiến độ đang rất khả quan!`;
      } else if (qLower.includes('tập') || qLower.includes('sức khỏe') || qLower.includes('thể thao')) {
        butlerReply = `Kính thưa Chủ nhân, tổng thời gian rèn luyện sức khỏe là ${stats.healthHours} giờ. Hãy duy trì ít nhất 30 phút vận động nhẹ mỗi ngày nhé!`;
      } else if (qLower.includes('quá tải') || qLower.includes('mệt')) {
        butlerReply = `Quản gia lo lắng cho sức khỏe của Chủ nhân! Hiện tại tổng làm việc là ${stats.workHours}h. Hãy uống 1 ly nước ấm và chớp mắt thư giãn 5 phút ngay lúc này ạ.`;
      } else {
        butlerReply = `Thưa Quý chủ nhân, Quản gia đã ghi nhận yêu cầu "${query}". Quản gia luôn túc trực 24/7 để nhắc nhở và bảo đảm sinh hoạt của gia đình chuẩn mực nhất!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'butler',
          text: butlerReply,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating AI Butler Trigger Widget (Bottom Right) */}
      <div className="no-print fixed bottom-20 md:bottom-6 right-5 z-40 select-none">
        <div className="relative group">
          {/* Quick Butler Advice Hover Pill */}
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block transition animate-fadeIn">
            <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/95 p-3 text-xs shadow-2xl backdrop-blur-md w-64 space-y-1">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <span>🎩 Quản Gia AI</span>
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-400 font-extrabold">ONLINE</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                "{butlerAssessment.msg.slice(0, 75)}..."
              </p>
            </div>
          </div>

          {/* Butler Avatar Button */}
          <button
            onClick={() => {
              setIsOpen(true);
              playChimeSound();
            }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 border-2 border-indigo-400/50 text-white shadow-2xl hover:scale-110 active:scale-95 transition glow-violet group"
            title="Mở Quản Gia AI Trợ Lý Thời Gian"
          >
            <span className="text-2xl animate-wiggle">🎩</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 text-[9px] font-black items-center justify-center text-white">AI</span>
            </span>
          </button>
        </div>
      </div>

      {/* Butler AI Full Assistant Modal */}
      {isOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-4 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-indigo-500/30 bg-slate-900/95 p-5 md:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header Modal Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-2xl shadow-inner">
                  🎩
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                    <span>Quản Gia AI Gia Đình</span>
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-extrabold text-indigo-300">
                      SMART BUTLER v2.5
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Trợ lý tính toán thời gian, tư vấn cân bằng sinh hoạt & quản lý nhịp sống</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Real-time Time Balance Dashboard Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-400" /> Bảng Thống Kê Giờ Sinh Hoạt Trong Tuần
                </span>
                <span className="text-indigo-300 font-mono-code font-bold">Tổng: {(stats.totalMins / 60).toFixed(1)}h</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-card rounded-2xl p-3 border border-indigo-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Học Tập</div>
                  <div className="text-xl font-black text-indigo-300 font-heading">{stats.studyHours}h</div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${Math.min(100, (stats.studyMins / stats.totalMins) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-3 border border-sky-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Công Việc</div>
                  <div className="text-xl font-black text-sky-300 font-heading">{stats.workHours}h</div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: `${Math.min(100, (stats.workMins / stats.totalMins) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-3 border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Sức Khỏe</div>
                  <div className="text-xl font-black text-emerald-300 font-heading">{stats.healthHours}h</div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(100, (stats.healthMins / stats.totalMins) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-3 border border-amber-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Nghỉ Ngơi</div>
                  <div className="text-xl font-black text-amber-300 font-heading">{stats.restHours}h</div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, (stats.restMins / stats.totalMins) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Butler Assessment & 1-Click Optimization */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 p-4 space-y-3 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-400 animate-spin-slow" />
                    <span>Đánh Giá Của Quản Gia AI:</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">{butlerAssessment.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{butlerAssessment.msg}"</p>
                </div>

                <button
                  onClick={handleOptimizeSchedule}
                  disabled={isAnalyzing}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50"
                >
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>{isAnalyzing ? 'Đang tính toán...' : 'Tối Ưu 1-Click'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Butler Chat Console */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-indigo-400" />
                <span>Trò Chuyện & Nhận Lời Khuyên Từ Quản Gia</span>
              </div>

              {/* Chat Message Scroll */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 text-xs ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'butler' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 text-sm">
                        🎩
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-3 max-w-[80%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-medium'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="mt-1 block text-[9px] text-slate-400 font-mono-code text-right">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendMessage('Tổng số giờ học tập tuần này là bao nhiêu?')}
                  className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] text-indigo-300 hover:border-indigo-500 transition"
                >
                  💡 Tổng giờ học tập?
                </button>
                <button
                  onClick={() => handleSendMessage('Kiểm tra xem tôi có bị làm việc quá tải không?')}
                  className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] text-emerald-300 hover:border-emerald-500 transition"
                >
                  ⚖️ Có bị quá tải không?
                </button>
                <button
                  onClick={() => handleSendMessage('Gợi ý thời gian tập thể dục hợp lý hôm nay')}
                  className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] text-amber-300 hover:border-amber-500 transition"
                >
                  🏃 Gợi ý giờ thể thao
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Hỏi Quản Gia AI (Ví dụ: Tính tổng giờ làm việc, nhắc tôi tập thể thao...)..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="rounded-xl bg-indigo-600 p-2.5 text-white hover:bg-indigo-500 transition shadow-md"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
