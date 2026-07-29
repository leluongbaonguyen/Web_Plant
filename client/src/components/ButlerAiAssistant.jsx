import { useState, useMemo } from 'react';
import { Bot, Sparkles, Clock, Zap, X, Send, BookOpen, Search, Leaf, Heart, Calendar, CheckCircle2 } from 'lucide-react';
import { getCurrentDayKey, timeToMinutes } from '../constants/index.js';
import {
  AI_KNOWLEDGE_BASE,
  PLANT_QUICK_QUESTIONS,
  LIFE_QUICK_QUESTIONS,
  SCHEDULE_QUICK_QUESTIONS,
  findAiKnowledgeAnswer,
} from '../constants/aiKnowledgeBase.js';
import { playChimeSound } from '../utils/audio.js';

export function ButlerAiAssistant({ plan, onUpdatePlan, addToast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'schedule' | 'plant' | 'life' | 'kb'
  const [chatInput, setChatInput] = useState('');
  const [kbSearch, setKbSearch] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'butler',
      text: 'Kính chào Quý chủ nhân! 🎩 Tôi là Quản Gia AI Trợ Lý Thời Gian & Chăm Sóc Sinh Hoạt Gia Đình. Tôi đã được huấn luyện đầy đủ bộ kiến thức về 🗓️ **Lịch Sinh Hoạt Hằng Ngày**, 🌱 **Chăm Sóc Cây Cảnh & Trồng Cây** cùng 🏠 **Cuộc Sống Hằng Ngày**. Quý chủ nhân cần tư vấn điều gì hôm nay?',
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
        title: 'Nên dành thêm thời gian vận động & tưới cây',
        msg: 'Kính thưa Chủ nhân, thời gian tập thể thao tuần này hơi khiêm tốn. Quản gia kiến nghị kết hợp 15 phút vận động nhẹ và tưới cây xanh buổi sáng!',
      };
    }
    return {
      status: 'excellent',
      title: 'Tỷ lệ sinh hoạt & chăm sóc không gian lý tưởng',
      msg: 'Kính thưa Chủ nhân, quỹ thời gian giữa Học tập, Công việc, Thể thao, Giấc ngủ và Chăm sóc cây xanh đạt sự cân bằng tuyệt vời!',
    };
  }, [stats]);

  // Filtered Knowledge Base
  const filteredKb = useMemo(() => {
    if (!kbSearch.trim()) return AI_KNOWLEDGE_BASE;
    const s = kbSearch.toLowerCase();
    return AI_KNOWLEDGE_BASE.filter(
      (item) =>
        item.topic.toLowerCase().includes(s) ||
        item.question.toLowerCase().includes(s) ||
        item.answer.toLowerCase().includes(s) ||
        item.keywords.some((k) => k.toLowerCase().includes(s))
    );
  }, [kbSearch]);

  // Handle Butler Auto-Optimization of Schedule
  const handleOptimizeSchedule = () => {
    setIsAnalyzing(true);
    playChimeSound();

    setTimeout(() => {
      if (!plan?.schedule) return;

      const updatedSchedule = plan.schedule.map((slot) => {
        const startM = timeToMinutes(slot.start);
        const cells = { ...slot.cells };

        // Auto categorize meals and health times
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

  // Handle Interactive User Questions to Butler (AI Engine Matching)
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

      // 1. Check AI Knowledge Base dataset match
      const matchedKnowledge = findAiKnowledgeAnswer(query);

      if (matchedKnowledge) {
        butlerReply = `Thưa Quý chủ nhân, về câu hỏi "${matchedKnowledge.question}":\n\n${matchedKnowledge.answer}\n\n💡 **Mẹo nhỏ từ Quản gia:** ${matchedKnowledge.tips}`;
      }
      // 2. Check Live Schedule Metrics Questions
      else if (qLower.includes('học') || qLower.includes('tổng số giờ')) {
        butlerReply = `Thưa Chủ nhân, tổng thời gian học tập được ghi nhận tuần này là ${stats.studyHours} giờ. Quản gia thấy tiến độ đang rất khả quan!`;
      } else if (qLower.includes('tập') || qLower.includes('thể thao')) {
        butlerReply = `Kính thưa Chủ nhân, tổng thời gian rèn luyện sức khỏe là ${stats.healthHours} giờ. Hãy duy trì ít nhất 30 phút vận động nhẹ mỗi ngày nhé!`;
      } else if (qLower.includes('quá tải') || qLower.includes('mệt')) {
        butlerReply = `Quản gia lo lắng cho sức khỏe của Chủ nhân! Hiện tại tổng làm việc là ${stats.workHours}h. Hãy uống 1 ly nước ấm và chớp mắt thư giãn 5 phút ngay lúc này ạ.`;
      }
      // 3. General Trained Response
      else {
        butlerReply = `Thưa Quý chủ nhân, Quản gia đã ghi nhận thắc mắc "${query}". Quản gia đã sẵn sàng giải đáp các câu hỏi về **Lịch Sinh Hoạt Hằng Ngày**, **Khung Giờ Học/Làm**, **Tưới Cây & Chăm Cảnh**, **Giấc Ngủ**, và **Năng Suất**. Chủ nhân có thể chọn các gợi ý bên dưới để tra cứu ngay ạ!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'butler',
          text: butlerReply,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 500);
  };

  return (
    <>
      {/* Floating AI Butler Trigger Widget (Bottom Right) */}
      <div className="no-print fixed bottom-20 md:bottom-6 right-5 z-40 select-none">
        <div className="relative group">
          {/* Quick Butler Advice Hover Pill */}
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block transition animate-fadeIn">
            <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/95 p-3 text-xs shadow-2xl backdrop-blur-md w-72 space-y-1">
              <div className="font-bold text-indigo-300 flex items-center justify-between">
                <span className="flex items-center gap-1">🎩 Quản Gia AI (Trained Routine & Plant)</span>
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-400 font-extrabold">ONLINE</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                "{butlerAssessment.msg.slice(0, 80)}..."
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
            title="Mở Quản Gia AI Trợ Lý Lịch Sinh Hoạt Hằng Ngày"
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
          <div className="glass-panel w-full max-w-3xl rounded-3xl border border-indigo-500/30 bg-slate-900/95 p-5 md:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                      TRAINED ROUTINE & PLANT AI v3.5
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Trợ lý tối ưu Lịch sinh hoạt hằng ngày, chăm sóc cây trồng & sức khỏe gia đình</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs Inside Butler AI */}
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="h-4 w-4" />
                <span>Trò Chuyện AI</span>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                  activeTab === 'schedule'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="h-4 w-4 text-sky-300" />
                <span>🗓️ Lịch Sinh Hoạt ({SCHEDULE_QUICK_QUESTIONS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('plant')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                  activeTab === 'plant'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                <Leaf className="h-4 w-4 text-emerald-400" />
                <span>🌱 Chăm Cây ({PLANT_QUICK_QUESTIONS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('life')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                  activeTab === 'life'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="h-4 w-4 text-amber-400" />
                <span>🏠 Sức Khỏe ({LIFE_QUICK_QUESTIONS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('kb')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                  activeTab === 'kb'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4 text-purple-300" />
                <span>📚 Thư Viện AI ({AI_KNOWLEDGE_BASE.length} Chủ đề)</span>
              </button>
            </div>

            {/* TAB 1 & CHAT OVERVIEW: Real-time Time Balance Dashboard Cards */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                {/* Stats Grid */}
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
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Sức Khỏe & Cây</div>
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

                {/* Butler Assessment */}
                <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 p-3.5 flex items-center justify-between gap-3 shadow-lg">
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" />
                      <span>Đánh Giá Của Quản Gia AI:</span>
                    </div>
                    <h4 className="text-xs font-extrabold text-white">{butlerAssessment.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed italic">"{butlerAssessment.msg}"</p>
                  </div>

                  <button
                    onClick={handleOptimizeSchedule}
                    disabled={isAnalyzing}
                    className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg hover:scale-105 transition disabled:opacity-50"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-300" />
                    <span>{isAnalyzing ? '...' : 'Tối Ưu 1-Click'}</span>
                  </button>
                </div>

                {/* Interactive Chat Console */}
                <div className="space-y-3">
                  {/* Chat Message Scroll */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
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
                          className={`rounded-2xl p-3 max-w-[85%] leading-relaxed whitespace-pre-line ${
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

                  {/* Input bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Hỏi Quản Gia về lịch làm việc, ăn uống, thể thao, tưới cây, giấc ngủ..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="rounded-2xl bg-indigo-600 p-3 text-white hover:bg-indigo-500 transition shadow-md shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DAILY SCHEDULE TIMETABLE QUESTIONS */}
            {activeTab === 'schedule' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-3.5 flex items-center gap-3 text-xs text-sky-200">
                  <Calendar className="h-5 w-5 text-sky-400 shrink-0" />
                  <div>
                    <span className="font-bold text-sky-300">Bộ Kiến Thức Lịch Sinh Hoạt Hằng Ngày: </span>
                    Bấm vào các câu hỏi bên dưới để nhận hướng dẫn chia khung giờ học/làm, lịch ăn uống, thể thao & nghỉ ngơi!
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SCHEDULE_QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendMessage(q);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left text-xs font-semibold text-slate-200 hover:border-sky-500 hover:bg-sky-950/40 transition group"
                    >
                      <span>{q}</span>
                      <Send className="h-3.5 w-3.5 text-sky-400 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PLANT CARE QUICK QUESTIONS */}
            {activeTab === 'plant' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 flex items-center gap-3 text-xs text-emerald-200">
                  <Leaf className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-300">Bộ Kiến Thức Cây Cảnh & Trồng Cây: </span>
                    Bấm vào các câu hỏi thường gặp bên dưới để nhận ngay lời khuyên chăm sóc cây xanh từ Quản gia AI!
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PLANT_QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendMessage(q);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left text-xs font-semibold text-slate-200 hover:border-emerald-500 hover:bg-emerald-950/40 transition group"
                    >
                      <span>{q}</span>
                      <Send className="h-3.5 w-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: DAILY LIFE QUICK QUESTIONS */}
            {activeTab === 'life' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-center gap-3 text-xs text-amber-200">
                  <Heart className="h-5 w-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-300">Bộ Kiến Thức Cuộc Sống & Sinh Hoạt: </span>
                    Bấm vào các câu hỏi bên dưới để nhận hướng dẫn về giấc ngủ, nước uống, Pomodoro và thể thao!
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {LIFE_QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendMessage(q);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left text-xs font-semibold text-slate-200 hover:border-amber-500 hover:bg-amber-950/40 transition group"
                    >
                      <span>{q}</span>
                      <Send className="h-3.5 w-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: FULL SEARCHABLE AI KNOWLEDGE BASE */}
            {activeTab === 'kb' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm chủ đề (lịch làm việc, ăn uống, thể thao, tưới cây, vàng lá, ngủ, stress)..."
                    value={kbSearch}
                    onChange={(e) => setKbSearch(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Knowledge cards list */}
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                  {filteredKb.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2 hover:border-indigo-500/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                          {item.category === 'schedule' ? '🗓️ LỊCH SINH HOẠT' : item.category === 'plant' ? '🌱 CÂY TRỒNG' : '🏠 CUỘC SỐNG'} • {item.topic}
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('chat');
                            handleSendMessage(item.question);
                          }}
                          className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>Hỏi AI ngay</span>
                          <Send className="h-3 w-3" />
                        </button>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{item.question}</span>
                      </h4>

                      <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        {item.answer}
                      </p>

                      <div className="text-[10px] text-amber-300 italic flex items-center gap-1 pt-0.5">
                        <span>💡 {item.tips}</span>
                      </div>
                    </div>
                  ))}

                  {filteredKb.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Không tìm thấy chủ đề phù hợp với từ khóa "{kbSearch}".
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
