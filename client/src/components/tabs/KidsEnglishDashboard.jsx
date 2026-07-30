import { useState, useMemo, useEffect } from 'react';
import {
  Volume2, Sparkles, Award, Star, RefreshCw, CheckCircle2, Heart, HelpCircle,
  Gamepad2, BookOpen, Smile, RotateCw, Play, Trophy, Flame, Music, Layers, Search,
  GraduationCap, Zap, ChevronRight, ChevronLeft, ArrowUpCircle, Check, X,
  Bot, Clock, BellRing, Send, MessageSquare, ShieldCheck
} from 'lucide-react';
import { COURSE_LEVELS, VOCAB_CATEGORIES, VOCABULARY_DATABASE } from '../../constants/kidsVocabularyDatabase.js';

export function KidsEnglishDashboard({ plan, addToast }) {
  const [selectedLevel, setSelectedLevel] = useState('basic'); // 'basic' | 'elementary' | 'intermediate' | 'advanced'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [flippedCards, setFlippedCards] = useState({});
  const [masteredCards, setMasteredCards] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_mastered_words_2000');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_earned_stars_2000');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'roadmap' | 'quiz'

  // Spotlight Enlarged Card State
  const [spotlightCard, setSpotlightCard] = useState(null);
  const [showSpotlightMeaning, setShowSpotlightMeaning] = useState(false);

  // AI Manager & Study Reminder for Minh Anh State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiNotice, setAiNotice] = useState('Minh Anh ơi, AI trợ lý nhắc con hôm nay học 5 từ vựng mới nhé!');
  const [aiCustomQuestion, setAiCustomQuestion] = useState('');

  // 4,000 Exercises & Timed Quiz Game States
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(15);
  const [quizMode, setQuizMode] = useState('image_to_word'); // 'image_to_word' | 'word_to_meaning' | 'fill_sentence'

  // Mascot Speech Bubble State (Tặng Nguyễn Ngọc Minh Anh)
  const [mascotQuoteIndex, setMascotQuoteIndex] = useState(0);
  const mascotQuotes = [
    "💖 Tặng con gái yêu NGUYỄN NGỌC MINH ANH - Chúc con luôn luôn học giỏi, ngoan ngoãn và xinh đẹp! 🎀✨",
    "🦄 Minh Anh ơi! Mỗi từ vựng con thuộc là thêm 1 Ngôi Sao Bé Ngoan rực rỡ tặng con đấy! ⭐💖",
    "👑 Chúc công chúa Nguyễn Ngọc Minh Anh luôn chinh phục 4,000 từ vựng Tiếng Anh thật dễ dàng nhé! 🚀",
    "🔊 Minh Anh bấm biểu tượng Loa hoặc bấm trực tiếp vào Icon đang chạy để nghe phát âm giọng chuẩn nhé! 🎶",
    "🤖 AI Trợ Lý nhắc nhở: Minh Anh nhớ làm 5 bài tập đố vui mỗi ngày để nhận huy hiệu Thần Đồng Tiếng Anh! 🏆",
  ];

  // Automated Target Milestones & Reward System for Minh Anh
  const TARGET_MILESTONES = useMemo(() => [
    { id: 'm1', starsNeeded: 50, title: 'Huy Hiệu 50 ⭐ - Công Chúa Ngôi Sao', reward: '🦄 Gấu Bông Kỳ Lân Hồng Minh Anh', icon: '🦄', bonus: 10 },
    { id: 'm2', starsNeeded: 100, title: 'Huy Hiệu 100 ⭐ - Thần Đồng Tiếng Anh', reward: '👑 Vương Miện Thần Đồng Tiếng Anh', icon: '👑', bonus: 20 },
    { id: 'm3', starsNeeded: 250, title: 'Huy Hiệu 250 ⭐ - Nữ Hoàng Flashcard', reward: '🎁 Hộp Quà Bí Mật 1,000 Từ Vựng', icon: '🎁', bonus: 30 },
    { id: 'm4', starsNeeded: 500, title: 'Huy Hiệu 500 ⭐ - Đại Sứ Tiếng Anh Toàn Cầu', reward: '🏆 Cúp Vô Địch 4,000 Từ Vựng Tiếng Anh', icon: '🏆', bonus: 50 },
  ], []);

  const [claimedRewards, setClaimedRewards] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_claimed_rewards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeRewardModal, setActiveRewardModal] = useState(null);

  // Automated System Target Check & Reward Unlock Engine
  useEffect(() => {
    const nextMilestone = TARGET_MILESTONES.find(
      (m) => stars >= m.starsNeeded && !claimedRewards.includes(m.id)
    );
    if (nextMilestone && !activeRewardModal) {
      setActiveRewardModal(nextMilestone);
    }
  }, [stars, claimedRewards, activeRewardModal, TARGET_MILESTONES]);

  const handleClaimReward = (milestone) => {
    const nextClaimed = [...claimedRewards, milestone.id];
    setClaimedRewards(nextClaimed);
    try {
      localStorage.setItem('kids_claimed_rewards', JSON.stringify(nextClaimed));
    } catch (e) {}
    setStars((prev) => prev + milestone.bonus);
    setActiveRewardModal(null);
    if (addToast) addToast(`🎉 CHÚC MỪNG MINH ANH! Nhận quà ${milestone.reward} (+${milestone.bonus} Bonus Stars ⭐)`, 'success');
  };

  // Sync Kids Learning Progress with Backend Server API (/api/kids/progress)
  useEffect(() => {
    fetch('/api/kids/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.progress) {
          if (typeof data.progress.stars === 'number' && data.progress.stars > 0) {
            setStars(data.progress.stars);
          }
          if (Array.isArray(data.progress.masteredCards) && data.progress.masteredCards.length > 0) {
            setMasteredCards(data.progress.masteredCards);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kids_earned_stars_2000', stars.toString());
      localStorage.setItem('kids_mastered_words_2000', JSON.stringify(masteredCards));
      
      // Auto Sync with server backend
      fetch('/api/kids/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars, masteredCards, quizScore }),
      }).catch(() => {});
    } catch (e) {}
  }, [stars, masteredCards, quizScore]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMascotQuoteIndex((prev) => (prev + 1) % mascotQuotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Filter 2,000 Vocabulary Database
  const filteredDatabase = useMemo(() => {
    return VOCABULARY_DATABASE.filter((item) => {
      const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchLevel && matchCategory && matchSearch;
    });
  }, [selectedLevel, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDatabase.length / pageSize) || 1;
  const paginatedCards = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredDatabase.slice(startIdx, startIdx + pageSize);
  }, [filteredDatabase, currentPage]);

  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
    setCurrentPage(1);
    if (addToast) {
      const levelName = COURSE_LEVELS.find((l) => l.id === levelId)?.name || levelId;
      addToast(`Đã chuyển sang ${levelName}!`, 'info');
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const playWordAudio = (text, slow = false) => {
    if (!('speechSynthesis' in window)) {
      if (addToast) addToast('Trình duyệt không hỗ trợ đọc giọng nói Web Speech', 'error');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = slow ? 0.65 : 0.95;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleMastered = (id, word) => {
    let next;
    if (masteredCards.includes(id)) {
      next = masteredCards.filter((c) => c !== id);
      setMasteredCards(next);
      if (addToast) addToast(`Bé đã bỏ đánh dấu thuộc từ '${word}'`, 'info');
    } else {
      next = [...masteredCards, id];
      setMasteredCards(next);
      const newStars = stars + 2;
      setStars(newStars);
      localStorage.setItem('kids_earned_stars_2000', String(newStars));
      if (addToast) addToast(`🎉 Hoan hô Bé Bắp! Đã thuộc từ '${word}' (+2 Stars ⭐)`, 'success');
    }
    localStorage.setItem('kids_mastered_words_2000', JSON.stringify(next));
  };

  // Quiz Option Generator based on current filtered dataset and selected quiz mode
  const quizPool = filteredDatabase.length > 0 ? filteredDatabase : VOCABULARY_DATABASE;
  const currentQuizCard = (quizPool && quizPool.length > 0) ? quizPool[quizIndex % quizPool.length] : VOCABULARY_DATABASE[0];

  // Timed Quiz Countdown Timer (Thời Gian Đếm Nguồn 15 Giây)
  useEffect(() => {
    if (activeTab !== 'quiz' || quizAnswered) return;

    const correctAnswer = quizMode === 'word_to_meaning' ? currentQuizCard?.meaning : currentQuizCard?.word;

    if (quizTimeLeft <= 0) {
      setQuizAnswered(true);
      if (addToast) addToast(`⏰ Hết giờ rồi Minh Anh ơi! Đáp án đúng là: ${correctAnswer}`, 'warning');
      return;
    }

    const timer = setInterval(() => {
      setQuizTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, quizAnswered, quizTimeLeft, currentQuizCard, quizMode]);

  const quizOptions = useMemo(() => {
    if (!currentQuizCard) return [];
    if (quizMode === 'word_to_meaning') {
      const correct = currentQuizCard.meaning;
      const others = VOCABULARY_DATABASE.filter((c) => c.meaning !== correct).map((c) => c.meaning);
      const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
      return [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
    } else {
      const correct = currentQuizCard.word;
      const others = VOCABULARY_DATABASE.filter((c) => c.word !== correct).map((c) => c.word);
      const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
      return [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
    }
  }, [currentQuizCard, quizIndex, quizMode]);

  const handleSelectQuizAnswer = (option) => {
    if (quizAnswered) return;
    setSelectedQuizOption(option);
    setQuizAnswered(true);

    const correctAnswer = quizMode === 'word_to_meaning' ? currentQuizCard.meaning : currentQuizCard.word;

    if (option === correctAnswer) {
      setQuizScore((prev) => prev + 1);
      const bonusStars = quizTimeLeft > 5 ? 5 : 3;
      const nextStars = stars + bonusStars;
      setStars(nextStars);
      localStorage.setItem('kids_earned_stars_2000', String(nextStars));
      playWordAudio(currentQuizCard.word);
      if (addToast) addToast(`🎉 Hoan hô Minh Anh! Đúng rồi (+${bonusStars} Stars ⭐)`, 'success');
    } else {
      if (addToast) addToast(`Gần đúng rồi! Đáp án đúng là: ${correctAnswer}`, 'error');
    }
  };

  const handleNextQuiz = () => {
    setQuizAnswered(false);
    setSelectedQuizOption(null);
    setQuizTimeLeft(15);
    setQuizIndex((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* 3D Dynamic Animated Hero Banner - DEDICATED TO DAUGHTER NGUYỄN NGỌC MINH ANH */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-pink-400/60 bg-gradient-to-r from-pink-950/90 via-slate-900 to-purple-950/90 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-pink-500/25 blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none animate-pulse"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* SPECIAL DEDICATION BANNER TO DAUGHTER */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-pink-400 bg-pink-500/20 px-4 py-2 text-xs font-black text-pink-200 shadow-xl animate-pulse">
              <Heart className="h-4 w-4 text-pink-400 fill-pink-400 animate-bounce" />
              <span className="tracking-wide">💖 MÓN QUÀ TẶNG CON GÁI NGUYỄN NGỌC MINH ANH - CHÚC CON LUÔN LUÔN HỌC GIỎI! 💖</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Khóa Học Tiếng Anh <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-300 to-cyan-300">Siêu Dễ Thương Cho Minh Anh</span> 🦄
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Thiết kế dành riêng cho con gái yêu **Nguyễn Ngọc Minh Anh**: 4 Cấp độ chuẩn CEFR (Basic - Elementary - Intermediate - Advanced), 4,000 từ vựng minh họa sinh động, lật thẻ 3D & icon động xoay tròn tự động đọc Tiếng Anh!
            </p>

            {/* Live Interactive Mascot Encouragement Speech */}
            <div className="rounded-2xl border border-pink-400/50 bg-slate-950/80 p-4 flex items-center gap-3.5 shadow-xl animate-fadeIn">
              <div className="text-4xl animate-bounce">🦄</div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-pink-400 animate-spin-slow" />
                  <span>Lời Chúc Yêu Thương Tới Minh Anh:</span>
                </div>
                <div className="text-xs md:text-sm font-black text-white mt-0.5">{mascotQuotes[mascotQuoteIndex]}</div>
              </div>
            </div>

            {/* Quick Stats & Star Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 rounded-2xl border border-yellow-500/50 bg-yellow-950/80 px-4 py-2 text-xs font-black text-yellow-300 shadow-lg">
                <Star className="h-4.5 w-4.5 text-yellow-400 fill-yellow-400 animate-bounce" />
                <span>{stars} Ngôi Sao Bé Ngoan Của Minh Anh</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-950/80 px-4 py-2 text-xs font-black text-emerald-300 shadow-lg">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                <span>Đã Thuộc {masteredCards.length} / 4000 Từ</span>
              </div>
            </div>

            {/* Automated Target Milestones Progress Bar */}
            <div className="p-4 rounded-2xl border border-yellow-500/40 bg-slate-950/90 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-yellow-300 flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-yellow-400" /> Tiến Độ Tự Động Đạt Target Mở Quà Minh Anh:
                </span>
                <span className="font-mono-code font-bold text-yellow-400">
                  {stars} / {TARGET_MILESTONES.find((m) => !claimedRewards.includes(m.id))?.starsNeeded || 500} ⭐
                </span>
              </div>
              
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-pink-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (stars / (TARGET_MILESTONES.find((m) => !claimedRewards.includes(m.id))?.starsNeeded || 500)) * 100
                    )}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-300">🎯 Mục Tiêu: {TARGET_MILESTONES.find((m) => !claimedRewards.includes(m.id))?.title || 'Đã Đạt Tất Cả Target! 🎉'}</span>
                <span className="text-yellow-300">🎁 Phần Thưởng: {TARGET_MILESTONES.find((m) => !claimedRewards.includes(m.id))?.reward || 'Cúp Vàng'}</span>
              </div>
            </div>
          </div>

          {/* Animated Mascot Character Card - DAUGHTER MINH ANH */}
          <div className="flex items-center justify-center p-6 rounded-3xl border-2 border-pink-400 bg-slate-900/95 shadow-2xl backdrop-blur-md hover:scale-105 transition duration-300">
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <div className="text-8xl animate-bounce">🦄</div>
                <div className="absolute -top-2 -right-2 text-3xl animate-spin-slow">👑</div>
              </div>

              <div>
                <div className="text-base font-black text-pink-300 font-heading tracking-wide">NGUYỄN NGỌC MINH ANH</div>
                <div className="text-[10px] font-bold text-slate-400 font-mono-code">BÉ HỌC GIỎI TIẾNG ANH 🌟</div>
              </div>

              <div className="rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-4 py-1.5 text-xs font-black text-white shadow-xl">
                Công Chúa 2000 Từ Vựng 🏆
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COURSE ROADMAP SELECTOR: 4 CEFR LEVELS (BASIC -> ADVANCED) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-cyan-400" /> Lộ Trình 4 Khóa Học Tiếng Anh Chuẩn CEFR:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COURSE_LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => handleLevelChange(lvl.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? `bg-slate-900 border-2 ${lvl.color} shadow-xl scale-[1.02]`
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{lvl.icon}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black border ${lvl.bgBadge}`}>
                    {lvl.badge}
                  </span>
                </div>

                <div className="font-extrabold text-sm text-white">{lvl.name}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{lvl.description}</div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code font-bold">
                  <span className="text-cyan-300">{lvl.targetWords} Từ Vựng</span>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Feature Tabs (Flashcard Gallery vs Timed Quiz Game vs AI Manager) */}
      <div className="flex flex-wrap rounded-2xl bg-slate-950 p-1.5 border border-slate-800 gap-1">
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'flashcards' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Bảo Tàng 2000 Từ Vựng Flashcard</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'quiz' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="h-4 w-4 text-yellow-300 animate-pulse" />
          <span>2000 Bài Tập Đấu Trí Có Thời Gian ⏰</span>
        </button>

        <button
          onClick={() => setShowAiModal(true)}
          className="py-3 px-5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 text-white shadow-xl hover:scale-105"
        >
          <Bot className="h-4.5 w-4.5 text-yellow-300 animate-bounce" />
          <span>🤖 AI Quản Lý & Nhắc Học Minh Anh</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: 2000 VOCABULARY FLASHCARD GALLERY WITH SEARCH & CATEGORY FILTER */}
      {/* ========================================================================= */}
      {activeTab === 'flashcards' && (
        <div className="space-y-5">
          {/* Search & Topic Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tra cứu từ vựng 2000 từ (ví dụ: Apple, Dog, Sư tử, Quả cam)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition shadow-inner font-bold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Results Count Badge */}
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>Tìm thấy: <strong className="text-cyan-300 font-mono-code">{filteredDatabase.length}</strong> / 2000 từ</span>
            </div>
          </div>

          {/* Category Filter Pills (Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {VOCAB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-extrabold shrink-0 transition ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Split Container: Flashcards Grid + Enlarged Side Spotlight Preview Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left/Main Column: Flashcard Gallery (8 Cols when Spotlight open, 12 Cols when closed) */}
            <div className={spotlightCard ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
              {paginatedCards.length > 0 ? (
                <div className={`grid gap-4 ${spotlightCard ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                  {paginatedCards.map((card) => {
                    const isSelected = spotlightCard?.id === card.id;
                    const isFlipped = Boolean(flippedCards[card.id]);
                    const isMastered = masteredCards.includes(card.id);

                    return (
                      <div
                        key={card.id}
                        onClick={() => {
                          setSpotlightCard(card);
                          setShowSpotlightMeaning(false);
                          playWordAudio(card.word, false);
                        }}
                        className={`group relative rounded-3xl border p-4 shadow-xl transition-all duration-300 backdrop-blur-xl bg-slate-900/90 hover:scale-[1.03] cursor-pointer flex flex-col justify-between perspective-1000 ${
                          isSelected
                            ? 'border-cyan-400 ring-2 ring-cyan-500/50 bg-slate-900 shadow-cyan-500/20'
                            : 'border-slate-800 hover:border-cyan-500/40'
                        }`}
                      >
                        {/* Card Header Info - Always upright */}
                        <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800/80 pb-2 mb-2">
                          <span className="rounded-full bg-slate-950 border border-slate-800 px-2 py-0.5 text-[10px] text-cyan-300 font-mono-code">
                            {card.level.toUpperCase()}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMastered(card.id, card.word);
                            }}
                            className={`flex items-center gap-1 rounded-xl px-2 py-0.5 text-[10px] font-black transition ${
                              isMastered
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Star className={`h-3 w-3 ${isMastered ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                            <span>{isMastered ? 'Thuộc' : 'Chưa thuộc'}</span>
                          </button>
                        </div>

                        {/* 3D Flip Container for Card Body */}
                        <div className={`w-full my-auto transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                          {!isFlipped ? (
                            /* FRONT SIDE - Right side up */
                            <div className="text-center space-y-3 py-3">
                              <div className="text-6xl drop-shadow-xl transition-transform group-hover:scale-125 duration-300 animate-pulse">
                                {card.image}
                              </div>

                              <div>
                                <h3 className="text-2xl font-black font-heading text-white tracking-tight">
                                  {card.word}
                                </h3>
                                <p className="text-[11px] font-mono-code text-cyan-300 mt-0.5">{card.ipa}</p>
                              </div>
                            </div>
                          ) : (
                            /* BACK SIDE 3D FLIPPED - COUNTER ROTATED TO GUARANTEE UPRIGHT NON-MIRRORED TEXT */
                            <div className="text-center space-y-2 py-3 text-xs [transform:rotateY(180deg)]">
                              <div className="text-xl font-black text-yellow-300 font-heading">{card.meaning}</div>
                              <div className="text-[10px] text-slate-300 italic">{card.hint}</div>
                              <div className="text-[11px] text-cyan-300 font-bold">"{card.sentence}"</div>
                              <div className="text-[10px] text-slate-400">({card.sentenceVi})</div>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Action - Always upright */}
                        <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px] font-bold text-cyan-400 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlip(card.id);
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-cyan-300"
                          >
                            <RotateCw className="h-3 w-3 text-cyan-400" />
                            <span>{isFlipped ? 'Lật Mặt Trước' : 'Lật Thẻ 3D 🔄'}</span>
                          </button>

                          <div className="flex items-center gap-1 text-cyan-400 group-hover:text-cyan-300">
                            <span>Phóng Lớn ✨</span>
                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-12 rounded-3xl border border-slate-800 bg-slate-950 text-slate-400 space-y-2">
                  <div className="text-5xl">🔍</div>
                  <div className="font-bold text-slate-200">Không tìm thấy từ vựng phù hợp</div>
                  <p className="text-xs">Vui lòng thử tìm từ khác hoặc đổi cấp độ học tập ở trên!</p>
                </div>
              )}
            </div>

            {/* Right Column: FULL HEIGHT ENLARGED SPOTLIGHT PANEL WITH MARQUEE TICKER & CUTE EXAMPLE ICONS */}
            {spotlightCard && (
              <div className="lg:col-span-5 sticky top-4 h-full">
                <div className="rounded-3xl border-2 border-cyan-400 bg-gradient-to-b from-slate-900 via-slate-950 to-cyan-950/90 p-6 shadow-2xl space-y-5 animate-scaleIn backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between min-h-[calc(100vh-160px)]">
                  {/* Glowing background ambient effect */}
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl pointer-events-none"></div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                      <div className="flex items-center gap-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
                        <Sparkles className="h-4 w-4 text-cyan-400 animate-spin-slow" />
                        <span>XEM CHI TIẾT & ICON PHÓNG LỚN CHẠY VÒNG QUANH</span>
                      </div>

                      <button
                        onClick={() => setSpotlightCard(null)}
                        className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                        title="Đóng xem chi tiết"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* MARQUEE RUNNING TEXT TICKER (Dòng chữ chạy ngang qua cho Minh Anh) */}
                    <div className="overflow-hidden rounded-2xl border border-pink-500/40 bg-pink-950/60 py-2 shadow-inner">
                      <div className="animate-marquee whitespace-nowrap text-xs font-black text-pink-200 tracking-wide flex items-center gap-6">
                        <span>💖 NGUYỄN NGỌC MINH ANH HỌC GIỎI TIẾNG ANH • CHÚC CON LUÔN LUÔN HỌC GIỎI • BÉ NGOAN MINH ANH 2,000 TỪ VỰNG TIẾNG ANH • CHÚC CON NGOAN NGOÃN VÀ XINH ĐẸP! 💖</span>
                        <span>💖 NGUYỄN NGỌC MINH ANH HỌC GIỎI TIẾNG ANH • CHÚC CON LUÔN LUÔN HỌC GIỎI • BÉ NGOAN MINH ANH 2,000 TỪ VỰNG TIẾNG ANH • CHÚC CON NGOAN NGOÃN VÀ XINH ĐẸP! 💖</span>
                      </div>
                    </div>

                    {/* HUGE ANIMATED ICON CHẠY VÒNG QUANH + TỰ ĐỘNG ĐỌC TIẾNG ANH */}
                    <div className="text-center space-y-4 py-8 rounded-3xl border border-cyan-500/30 bg-slate-950/80 p-6 shadow-inner relative overflow-hidden">
                      {/* Floating Cute Example Icons Around Icon */}
                      <div className="absolute top-3 left-3 text-2xl animate-float opacity-80 pointer-events-none">🐱</div>
                      <div className="absolute top-3 right-3 text-2xl animate-orbit opacity-80 pointer-events-none">🐰</div>
                      <div className="absolute bottom-3 left-3 text-2xl animate-wiggle opacity-80 pointer-events-none">🐼</div>
                      <div className="absolute bottom-3 right-3 text-2xl animate-bounce opacity-80 pointer-events-none">🦊</div>

                      <div className="relative h-44 flex items-center justify-center">
                        <div
                          onClick={() => playWordAudio(spotlightCard.word, false)}
                          className="text-8xl md:text-9xl animate-run-around drop-shadow-2xl hover:scale-125 transition duration-300 cursor-pointer select-none"
                          title="Bấm vào icon để đọc lại Tiếng Anh"
                        >
                          {spotlightCard.image}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-3xl md:text-4xl font-black font-heading text-white tracking-tight">
                          {spotlightCard.word}
                        </h2>
                        <p className="text-sm font-mono-code text-cyan-300 mt-1">{spotlightCard.ipa}</p>
                      </div>

                      {/* Pronunciation Audio Toolbar */}
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => playWordAudio(spotlightCard.word, false)}
                          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-xs font-black text-white hover:from-cyan-500 hover:to-blue-500 shadow-xl active:scale-95 transition"
                        >
                          <Volume2 className="h-4 w-4 animate-pulse" />
                          <span>Phát Âm Đọc Chuẩn 🔊</span>
                        </button>

                        <button
                          onClick={() => playWordAudio(spotlightCard.word, true)}
                          className="flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-xs font-black text-white hover:bg-amber-500 shadow-lg active:scale-95 transition"
                        >
                          <span>🐢 Đọc Chậm</span>
                        </button>
                      </div>
                    </div>

                    {/* CLICK TO REVEAL VIETNAMESE MEANING (Chỉ xem nghĩa khi bấm vào nút) */}
                    <div className="space-y-3">
                      {!showSpotlightMeaning ? (
                        <button
                          onClick={() => setShowSpotlightMeaning(true)}
                          className="w-full rounded-2xl border border-yellow-500/40 bg-yellow-950/60 p-4 text-center text-xs font-black text-yellow-300 hover:bg-yellow-900/80 transition shadow-lg flex items-center justify-center gap-2 group"
                        >
                          <Sparkles className="h-4 w-4 text-yellow-400 group-hover:rotate-12 transition-transform" />
                          <span>BẤM VÀO ĐÂY ĐỂ XEM NGHĨA TIẾNG VIỆT 💡</span>
                        </button>
                      ) : (
                        <div className="rounded-2xl border border-yellow-500/50 bg-slate-950 p-4 space-y-2 text-center animate-fadeIn shadow-lg">
                          <div className="text-2xl font-black text-yellow-300 font-heading">
                            {spotlightCard.meaning}
                          </div>
                          <p className="text-xs text-slate-300 italic font-medium">💡 Mẹo nhớ: {spotlightCard.hint}</p>

                          <div className="pt-2 border-t border-slate-800 text-left text-xs space-y-1">
                            <div className="font-bold text-cyan-300">"{spotlightCard.sentence}"</div>
                            <div className="text-slate-400">({spotlightCard.sentenceVi})</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CUTE EXAMPLE ICONS MINI GALLERY (Các icon ví dụ ngộ nghĩnh) */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-center space-y-1">
                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Bộ Icon Ví Dụ Ngộ Nghĩnh Minh Anh Yêu Thích:</div>
                      <div className="flex items-center justify-center gap-3 text-xl py-1 flex-wrap">
                        <span className="hover:scale-150 transition cursor-pointer" title="Con Chó">🐶</span>
                        <span className="hover:scale-150 transition cursor-pointer" title="Con Mèo">🐱</span>
                        <span className="hover:scale-150 transition cursor-pointer" title="Con Voi">🐘</span>
                        <span className="hover:scale-150 transition cursor-pointer" title="Con Sư Tử">🦁</span>
                        <span className="hover:scale-150 transition cursor-pointer" title="Con Khỉ">🐒</span>
                        <span className="hover:scale-150 transition cursor-pointer" title="Con Thỏ">🐰</span>
                        <span className="hover:scale-150 transition cursor-pointer" title="Chim Cánh Cụt">🐧</span>
                        <span className="hover:scale-150 transition cursor-pointer" title="Gấu Trúc">🐼</span>
                        <span className="hover:scale-150 transition cursor-pointer" title="Kỳ Lân">🦄</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Mastered Star Toggle - Bottom Pinned */}
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center mt-auto">
                    <span className="text-xs font-bold text-slate-400">Đã ghi nhớ từ này chưa?</span>
                    <button
                      onClick={() => toggleMastered(spotlightCard.id, spotlightCard.word)}
                      className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-black transition shadow-lg ${
                        masteredCards.includes(spotlightCard.id)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${masteredCards.includes(spotlightCard.id) ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                      <span>{masteredCards.includes(spotlightCard.id) ? 'Đã Thuộc ⭐' : 'Đánh Dấu Thuộc Từ (+2 Stars ⭐)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Trang Trước
              </button>

              <div className="text-xs font-mono-code font-bold text-slate-400">
                Trang <strong className="text-cyan-300">{currentPage}</strong> / {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 disabled:opacity-40"
              >
                Trang Sau <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: 2,000 EXERCISES & TIMED TEST ENGINE FOR MINH ANH */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="glass-panel max-w-3xl mx-auto rounded-3xl border-2 border-pink-400/50 bg-slate-900/95 p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          {/* Header Stats & Timed Test Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-pink-600/20 border border-pink-500/40 text-pink-400 text-3xl animate-bounce">
                🎮
              </div>
              <div>
                <h3 className="text-xl font-black font-heading text-white">4,000 BÀI TẬP ĐẤU TRÍ CÓ THỜI GIAN</h3>
                <p className="text-xs text-slate-300">Thử thách bấm đúng trước khi đồng hồ đếm ngược về 0 giây!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Question Count Tracker */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-mono-code font-bold text-cyan-300">
                Bài tập #{quizIndex + 1} / 4,000
              </div>

              {/* Total Score */}
              <div className="flex items-center gap-1.5 rounded-2xl bg-pink-950 border border-pink-500/40 px-3.5 py-1.5 text-xs font-black text-pink-300 shadow-md">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>Điểm: {quizScore}</span>
              </div>
            </div>
          </div>

          {/* Quiz Mode Selector Bar */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => { setQuizMode('image_to_word'); setQuizTimeLeft(15); setQuizAnswered(false); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${quizMode === 'image_to_word' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              🖼️ Đoán Từ Tiếng Anh
            </button>
            <button
              onClick={() => { setQuizMode('word_to_meaning'); setQuizTimeLeft(15); setQuizAnswered(false); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${quizMode === 'word_to_meaning' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              💡 Đoán Nghĩa Tiếng Việt
            </button>
            <button
              onClick={() => { setQuizMode('fill_sentence'); setQuizTimeLeft(15); setQuizAnswered(false); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${quizMode === 'fill_sentence' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              📝 Điền Từ Vào Câu
            </button>
          </div>

          {/* 15-SECOND COUNTDOWN TIMER PROGRESS BAR */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono-code font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-pink-400 animate-spin-slow" /> Thời Gian Trả Lời:
              </span>
              <span className={`text-sm ${quizTimeLeft <= 5 ? 'text-rose-400 font-black animate-ping' : 'text-amber-300'}`}>
                ⏱️ {quizTimeLeft} Giây
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  quizTimeLeft > 8 ? 'bg-emerald-500' : quizTimeLeft > 4 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${(quizTimeLeft / 15) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Quiz Question Card */}
          {currentQuizCard && (
            <div className="rounded-3xl border border-pink-500/40 bg-slate-950 p-6 text-center space-y-4 shadow-inner relative overflow-hidden">
              {quizMode === 'image_to_word' && (
                <>
                  <div className="text-8xl md:text-9xl animate-bounce drop-shadow-2xl">
                    {currentQuizCard.image}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-pink-300">Hình ảnh ngộ nghĩnh này có tên Tiếng Anh là gì?</div>
                    <div className="text-sm font-bold text-slate-400 mt-1 font-heading">Nghĩa tiếng Việt: "{currentQuizCard.meaning}"</div>
                  </div>
                </>
              )}

              {quizMode === 'word_to_meaning' && (
                <>
                  <div className="text-4xl md:text-5xl font-black font-heading text-cyan-300 tracking-tight">
                    {currentQuizCard.word}
                  </div>
                  <p className="text-sm font-mono-code text-cyan-400">{currentQuizCard.ipa}</p>
                  <div className="text-xs font-bold uppercase tracking-wider text-pink-300 pt-2">
                    Từ Tiếng Anh trên có nghĩa tiếng Việt là gì?
                  </div>
                </>
              )}

              {quizMode === 'fill_sentence' && (
                <>
                  <div className="text-lg md:text-xl font-black text-amber-300 font-heading bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                    "{currentQuizCard.sentence.replace(new RegExp(currentQuizCard.word, 'gi'), '_____')}"
                  </div>
                  <p className="text-xs text-slate-400 italic">Dịch nghĩa câu: "{currentQuizCard.sentenceVi}"</p>
                  <div className="text-xs font-bold uppercase tracking-wider text-pink-300">
                    Chọn từ Tiếng Anh chính xác để điền vào khoảng trống trên!
                  </div>
                </>
              )}

              <button
                onClick={() => playWordAudio(currentQuizCard.word)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-pink-600/30 border border-pink-500/40 px-3.5 py-1.5 text-xs font-bold text-pink-200 hover:bg-pink-600/50 transition active:scale-95 shadow-md"
              >
                <Volume2 className="h-4 w-4 text-pink-400 animate-pulse" /> Nghe Gợi Ý Phát Âm 🔊
              </button>
            </div>
          )}

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedQuizOption === opt;
              const correctAnswer = quizMode === 'word_to_meaning' ? currentQuizCard?.meaning : currentQuizCard?.word;
              const isCorrect = currentQuizCard && opt === correctAnswer;

              let btnStyle = 'border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800 hover:border-pink-500/40';
              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-950/90 text-emerald-200 ring-2 ring-emerald-500 shadow-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-500 bg-rose-950/90 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizAnswer(opt)}
                  disabled={quizAnswered}
                  className={`rounded-2xl border p-4 text-left font-black text-base transition duration-200 flex items-center justify-between active:scale-95 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 text-xs font-mono-code font-bold text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {quizAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Next Question Button */}
          {quizAnswered && (
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center animate-fadeIn">
              <div className="text-xs font-bold text-slate-300">
                {(() => {
                  const correctAnswer = quizMode === 'word_to_meaning' ? currentQuizCard?.meaning : currentQuizCard?.word;
                  return selectedQuizOption === correctAnswer ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Tuyệt vời lắm Minh Anh! +5 Stars ⭐
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold">
                      Cố gắng ở câu tiếp theo nhé Minh Anh! Đáp án là '{correctAnswer}'
                    </span>
                  );
                })()}
              </div>

              <button
                onClick={handleNextQuiz}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-xs font-black text-white hover:from-pink-500 hover:to-purple-500 shadow-xl transition active:scale-95"
              >
                <span>Bài Tập Tiếp Theo (#{quizIndex + 2})</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI MANAGER & REMINDER ASSISTANT MODAL FOR DAUGHTER MINH ANH */}
      {/* ========================================================================= */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl rounded-3xl border-2 border-pink-400 bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-pink-500/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-xl">
                  <Bot className="h-6 w-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-white">AI TRỢ LÝ QUẢN LÝ & NHẮC HỌC MINH ANH</h3>
                  <p className="text-xs text-pink-300">Tác nhân trí tuệ nhân tạo theo dõi tiến độ 4,000 từ vựng</p>
                </div>
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* AI Speech Bubble & Status Card */}
            <div className="rounded-3xl border border-pink-500/40 bg-slate-950 p-5 space-y-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce">🤖</div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-pink-400 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-pink-400 animate-spin-slow" /> AI Tutor Thông Thông Minh:
                  </div>
                  <div className="text-sm font-black text-white leading-relaxed">
                    "{aiNotice}"
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-mono-code text-cyan-300 font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Tiến Độ: Thuộc {masteredCards.length} / 4,000 Từ</span>
                </div>

                <button
                  onClick={() => playWordAudio("Nguyễn Ngọc Minh Anh ơi, AI trợ lý chúc con học giỏi và luôn luôn đạt điểm mười nhé!", false)}
                  className="flex items-center gap-1.5 rounded-xl bg-pink-600/30 border border-pink-500/40 px-3 py-1.5 font-bold text-pink-200 hover:bg-pink-600/50 transition active:scale-95"
                >
                  <Volume2 className="h-4 w-4 text-pink-400" /> AI Đọc Lời Chúc 🔊
                </button>
              </div>
            </div>

            {/* Quick Action Reminders */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Lựa Chọn Nhắc Nhở Học Tập AI:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setAiNotice("Minh Anh ơi! AI đã mở 5 bài tập đố vui 15 giây. Hãy chọn tab Bài Tập nhé!");
                    playWordAudio("Minh Anh ơi, AI đề xuất con ôn 5 câu đố vui!", false);
                  }}
                  className="p-3 rounded-2xl border border-slate-800 bg-slate-950 text-left font-bold text-slate-200 hover:border-pink-500/50 hover:bg-slate-800 transition"
                >
                  ⏰ Nhắc Minh Anh Ôn Tập Đố Vui
                </button>

                <button
                  onClick={() => {
                    setAiNotice("Con gái Minh Anh đã đạt được " + stars + " Ngôi Sao Bé Ngoan! Cố lên con nhé!");
                    playWordAudio("Hoan hô Minh Anh đạt " + stars + " Ngôi Sao!", false);
                  }}
                  className="p-3 rounded-2xl border border-slate-800 bg-slate-950 text-left font-bold text-slate-200 hover:border-pink-500/50 hover:bg-slate-800 transition"
                >
                  ⭐ AI Kiểm Tra Ngôi Sao Bé Ngoan
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-2.5 text-xs font-black text-white hover:from-pink-500 hover:to-purple-500 shadow-xl transition"
              >
                Đã Rõ (Đóng AI Trợ Lý)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTOMATED TARGET REWARD CLAIM UNLOCK MODAL FOR MINH ANH */}
      {/* ========================================================================= */}
      {activeRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-lg animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border-4 border-yellow-400 bg-gradient-to-b from-yellow-950 via-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden animate-scaleIn">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-yellow-400/30 blur-3xl pointer-events-none animate-pulse"></div>

            <div className="text-7xl animate-bounce">{activeRewardModal.icon}</div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/60 bg-yellow-500/20 px-4 py-1 text-xs font-black text-yellow-300 uppercase tracking-widest">
                <Trophy className="h-4 w-4 text-yellow-400 animate-spin-slow" /> HỘP QUÀ TỰ ĐỘNG ĐẠT TARGET MINH ANH 🎉
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-white">
                {activeRewardModal.title}
              </h2>
              <p className="text-xs md:text-sm text-yellow-200 font-bold">
                Hoan hô bé **Nguyễn Ngọc Minh Anh** đã xuất sắc tích lũy đạt mốc **{activeRewardModal.starsNeeded} Ngôi Sao ⭐**!
              </p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-yellow-400/40 bg-slate-950/90 space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase">Phần Thưởng Đã Mở Khóa:</div>
              <div className="text-lg md:text-xl font-black text-yellow-300 font-heading">{activeRewardModal.reward}</div>
              <div className="text-xs text-emerald-400 font-bold font-mono-code">+ {activeRewardModal.bonus} Bonus Stars ⭐ Thưởng Nóng!</div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => handleClaimReward(activeRewardModal)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-400 to-pink-500 text-slate-950 font-black text-base md:text-lg shadow-2xl hover:scale-105 transition duration-200 flex items-center justify-center gap-2"
              >
                <span>🎁 MỞ HỘP QUÀ BÍ MẬT & NHẬN THƯỞNG ⭐</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
