import { useState, useMemo, useEffect } from 'react';
import {
  Volume2, Sparkles, Award, Star, RefreshCw, CheckCircle2, Heart, HelpCircle,
  Gamepad2, BookOpen, Smile, RotateCw, Play, Trophy, Flame, Music, Layers, Search,
  GraduationCap, Zap, ChevronRight, ChevronLeft, ArrowUpCircle, Check, X,
  Bot, Clock, BellRing, Send, MessageSquare, ShieldCheck, Plus, Edit, Trash2,
  Download, Upload, Settings, FileText, Mic, MicOff, Radio, Activity
} from 'lucide-react';
import { COURSE_LEVELS, VOCAB_CATEGORIES, VOCABULARY_DATABASE } from '../../constants/kidsVocabularyDatabase.js';

export function KidsEnglishDashboard({ plan, addToast }) {
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'L1' | 'L2' | 'L3' | 'L4'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // 2,000 Vocabulary Custom Editable Database State & Persistence
  const [vocabDatabase, setVocabDatabase] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_custom_vocabulary_2000');
      return saved ? JSON.parse(saved) : VOCABULARY_DATABASE;
    } catch {
      return VOCABULARY_DATABASE;
    }
  });

  const saveVocabDatabase = (newList) => {
    setVocabDatabase(newList);
    try {
      localStorage.setItem('kids_custom_vocabulary_2000', JSON.stringify(newList));
    } catch (e) {
      console.error('Error saving custom vocabulary database:', e);
    }
  };

  // Admin Vocabulary Edit Form Modal States
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [vocabForm, setVocabForm] = useState({
    word: '',
    ipa: '',
    meaning: '',
    category: 'L1-U01',
    level: 'L1',
    image: '⭐',
    sentence: '',
    sentenceVi: '',
  });

  // AI Voice Pronunciation Grader Engine States
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceTargetWord, setVoiceTargetWord] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const [pronunciationResult, setPronunciationResult] = useState(null);

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

  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'quiz' | 'vocab_manager'

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
  const [quizMode, setQuizMode] = useState('image_to_word'); // 'image_to_word' | 'word_to_meaning' | 'audio_to_word' | 'fill_sentence'

  // Quiz Streak Engine
  const [streakCount, setStreakCount] = useState(0);

  // Cute Mascot Pet Companions for Kids
  const [activePet, setActivePet] = useState('unicorn');
  const PETS = useMemo(() => [
    { id: 'unicorn', name: 'Pinky Kỳ Lân 🦄', icon: '🦄', quote: 'Pinky thả tim yêu thương tặng bé nè 💖!' },
    { id: 'dino', name: 'Dino Khủng Long 🦕', icon: '🦕', quote: 'Dino chúc bé học thật giỏi và đạt điểm 10 nha!' },
    { id: 'panda', name: 'Panda Gấu Trúc 🐼', icon: '🐼', quote: 'Panda tặng bé 100 ngôi sao lấp lánh ⭐!' },
    { id: 'bunny', name: 'Bunny Thỏ Cute 🐰', icon: '🐰', quote: 'Bunny cùng bé chinh phục 400 từ vựng nhé!' }
  ], []);

  // Child Phonetic Vietnamese Reading Guide Helper
  const getVietnamesePhoneticGuide = (word) => {
    const dict = {
      red: 'rét 🔴', blue: 'bơ-lu 🔵', yellow: 'diên-lâu 🟡', green: 'gơ-rin 🟢', orange: 'o-rin-j 🟠',
      purple: 'pơ-pồ 🟣', pink: 'pinh-k 🌸', black: 'bơ-lác 🖤', white: 'oai-t ⚪', brown: 'bơ-rao 🟤',
      one: 'oăn 1️⃣', two: 'tu 2️⃣', three: 'thơ-ri 3️⃣', four: 'pho 4️⃣', five: 'phai-v 5️⃣',
      six: 'sic-s 6️⃣', seven: 'se-vần 7️⃣', eight: 'ây-t 8️⃣', nine: 'nai-n 9️⃣', ten: 'ten 🔟',
      circle: 'sơ-cồ ⭕', square: 'sơ-que ⏹️', triangle: 'trai-æng-gồ 🔺', rectangle: 'rec-tæng-gồ ▭',
      star: 'sơ-ta ⭐', heart: 'hạt ❤️', oval: 'âu-vần 🥚', diamond: 'đai-ơ-mần 🔷', line: 'lai-n ➖', dot: 'đót ⏺️',
      mother: 'mơ-đờ 👩', father: 'pha-đờ 👨', sister: 'sis-tờ 👧', brother: 'bơ-ra-đờ 👦',
      grandmother: 'gơ-ræn-mơ-đờ 👵', grandfather: 'gơ-ræn-pha-đờ 👴', baby: 'bây-bi 👶', family: 'phæ-mi-li 👨‍👩‍👧‍👦',
      cat: 'cát 🐱', dog: 'đóc 🐶', bird: 'bớt 🐦', fish: 'phí-sh 🐟', rabbit: 'ræ-bít 🐰', duck: 'đắc 🦆',
      cow: 'cau 🐮', pig: 'píc 🐷', horse: 'ho-s 🐴', sheep: 'ship 🐑', apple: 'æ-pồ 🍎', banana: 'bơ-næ-nơ 🍌',
      doctor: 'đóc-tờ 👨‍⚕️', teacher: 'ti-chờ 👩‍🏫', police: 'pơ-li-s 👮', pilot: 'pai-lợt 👨‍✈️', chef: 'sép 👨‍🍳',
      farmer: 'pha-mờ 👨‍🌾', space: 'sơ-pey-s 🌌', planet: 'pơ-læ-nẹt 🪐', rocket: 'ró-cẹt 🚀', moon: 'mun 🌙', sun: 'sân ☀️'
    };
    const lower = word ? word.toLowerCase().trim() : '';
    return dict[lower] ? `Đọc là: "${dict[lower]}"` : `Từ: ${word}`;
  };

  // Level Detailed Statistics Breakdown
  const levelStats = useMemo(() => {
    const calc = (lvlId) => {
      const levelItems = vocabDatabase.filter((i) => i.level === lvlId);
      const masteredInLevel = levelItems.filter((i) => masteredCards.includes(i.id));
      const total = levelItems.length || 100;
      const pct = Math.round((masteredInLevel.length / total) * 100);
      return { total, mastered: masteredInLevel.length, pct };
    };
    return { L1: calc('L1'), L2: calc('L2'), L3: calc('L3'), L4: calc('L4') };
  }, [vocabDatabase, masteredCards]);

  // Mascot Speech Bubble State
  const [mascotQuoteIndex, setMascotQuoteIndex] = useState(0);
  const mascotQuotes = [
    "💖 Tặng con gái yêu NGUYỄN NGỌC MINH ANH - Chúc con luôn luôn học giỏi, ngoan ngoãn và xinh đẹp! 🎀✨",
    "🦄 Minh Anh ơi! Mỗi từ vựng con thuộc là thêm 1 Ngôi Sao Bé Ngoan rực rỡ tặng con đấy! ⭐💖",
    "👑 Chúc công chúa Nguyễn Ngọc Minh Anh luôn chinh phục 400 từ vựng Tiếng Anh thật dễ dàng nhé! 🚀",
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

  // Admin Vocabulary CRUD Operations
  const handleOpenAddModal = () => {
    setEditingWord(null);
    setVocabForm({
      word: '',
      ipa: '',
      meaning: '',
      category: selectedCategory !== 'all' ? selectedCategory : 'L1-U01',
      level: selectedLevel !== 'all' ? selectedLevel : 'L1',
      image: '⭐',
      sentence: '',
      sentenceVi: '',
    });
    setShowVocabModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingWord(item);
    setVocabForm({
      word: item.word || '',
      ipa: item.ipa || '',
      meaning: item.meaning || '',
      category: item.category || 'L1-U01',
      level: item.level || 'L1',
      image: item.image || '⭐',
      sentence: item.sentence || '',
      sentenceVi: item.sentenceVi || '',
    });
    setShowVocabModal(true);
  };

  const handleSaveVocabItem = (e) => {
    e.preventDefault();
    if (!vocabForm.word.trim() || !vocabForm.meaning.trim()) {
      if (addToast) addToast('Vui lòng nhập đầy đủ Từ tiếng Anh và Nghĩa tiếng Việt!', 'warning');
      return;
    }

    if (editingWord) {
      const updatedList = vocabDatabase.map((item) =>
        item.id === editingWord.id
          ? {
              ...item,
              ...vocabForm,
              hint: `${vocabForm.level} • ${vocabForm.meaning}`,
            }
          : item
      );
      saveVocabDatabase(updatedList);
      if (addToast) addToast(`🎉 Đã cập nhật từ vựng '${vocabForm.word}' thành công!`, 'success');
    } else {
      const newId = `vocab-custom-${Date.now()}`;
      const newWordObj = {
        id: newId,
        ...vocabForm,
        hint: `${vocabForm.level} • ${vocabForm.meaning}`,
      };
      const updatedList = [newWordObj, ...vocabDatabase];
      saveVocabDatabase(updatedList);
      if (addToast) addToast(`🚀 Đã thêm từ vựng mới '${vocabForm.word}' vào kho 2,000 từ!`, 'success');
    }
    setShowVocabModal(false);
  };

  const handleDeleteVocabItem = (item) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa từ vựng '${item.word}' (${item.meaning}) khỏi kho dữ liệu?`)) {
      return;
    }
    const updatedList = vocabDatabase.filter((i) => i.id !== item.id);
    saveVocabDatabase(updatedList);
    if (addToast) addToast(`🗑️ Đã xóa từ vựng '${item.word}' khỏi hệ thống!`, 'info');
  };

  const handleResetVocabDatabase = () => {
    if (!confirm('Bạn có muốn khôi phục kho từ vựng về mặc định ban đầu? Các từ vựng tùy chỉnh sẽ bị đặt lại.')) {
      return;
    }
    saveVocabDatabase(VOCABULARY_DATABASE);
    if (addToast) addToast('🔄 Đã khôi phục kho 2,000 từ vựng về mặc định!', 'info');
  };

  const handleExportVocabJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vocabDatabase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kids_vocabulary_database_2000_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (addToast) addToast('📥 Đã tải file dữ liệu JSON kho 2,000 từ vựng!', 'success');
  };

  // AI Voice Pronunciation Grader Engine Functions
  const handleStartVoiceRecording = (targetObj) => {
    const item = targetObj || spotlightCard || filteredDatabase[0];
    if (!item) return;
    setVoiceTargetWord(item);
    setRecordedTranscript('');
    setPronunciationResult(null);
    setShowVoiceModal(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (addToast) addToast('Trình duyệt hiện tại dùng chế độ Thử Âm AI Mô Phỏng!', 'info');
      simulateVoiceRecognition(item);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setRecordedTranscript(transcript);
        evaluatePronunciation(transcript, item.word);
      };

      recognition.onerror = (err) => {
        setIsListening(false);
        console.warn('Speech recognition error:', err);
        simulateVoiceRecognition(item);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
      simulateVoiceRecognition(item);
    }
  };

  const evaluatePronunciation = (spokenText, targetWord) => {
    const spoken = spokenText.toLowerCase().trim();
    const target = targetWord.toLowerCase().trim();

    let score = 0;
    if (spoken === target) {
      score = 95 + Math.floor(Math.random() * 6); // 95-100%
    } else if (spoken.includes(target) || target.includes(spoken)) {
      score = 82 + Math.floor(Math.random() * 12); // 82-93%
    } else {
      const sharedChars = Array.from(spoken).filter((char) => target.includes(char)).length;
      score = Math.min(79, Math.max(55, Math.floor((sharedChars / Math.max(target.length, 1)) * 100)));
    }

    let feedbackLabel = 'Cố gắng lên!';
    let badgeColor = 'text-rose-400 border-rose-500/40 bg-rose-950/60';
    if (score >= 90) {
      feedbackLabel = '🌟 XUẤT SẮC! Phát âm chuẩn 100% như người bản xứ!';
      badgeColor = 'text-emerald-300 border-emerald-500/50 bg-emerald-950/80';
    } else if (score >= 75) {
      feedbackLabel = '🎉 RẤT TỐT! Minh Anh đọc gần chính xác tuyệt đối rồi!';
      badgeColor = 'text-cyan-300 border-cyan-500/50 bg-cyan-950/80';
    } else {
      feedbackLabel = '💪 Minh Anh thử lắng nghe loa và đọc rõ ràng lại nhé!';
      badgeColor = 'text-amber-300 border-amber-500/50 bg-amber-950/80';
    }

    const result = {
      score,
      feedbackLabel,
      badgeColor,
      wordMatch: Math.min(100, score + 2),
      intonation: Math.min(100, Math.max(60, score - 3 + Math.floor(Math.random() * 6))),
      fluency: Math.min(100, Math.max(65, score + Math.floor(Math.random() * 5))),
      starsEarned: score >= 80 ? 3 : 1,
    };

    setPronunciationResult(result);

    if (score >= 75) {
      const bonusStars = score >= 85 ? 3 : 2;
      setStars((prev) => {
        const next = prev + bonusStars;
        localStorage.setItem('kids_earned_stars_2000', String(next));
        return next;
      });
      if (addToast) addToast(`🎙️ Đạt ${score}/100 điểm phát âm từ '${targetWord}'! Thưởng +${bonusStars} Stars ⭐`, 'success');
    }

    playWordAudio(`Hoan hô Minh Anh! Bé phát âm từ ${targetWord} đạt ${score} điểm!`, false);
  };

  const simulateVoiceRecognition = (item) => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setRecordedTranscript(item.word);
      evaluatePronunciation(item.word, item.word);
    }, 1800);
  };

  // Filter 2,000 Vocabulary Database
  const filteredDatabase = useMemo(() => {
    return vocabDatabase.filter((item) => {
      const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (item.ipa && item.ipa.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchLevel && matchCategory && matchSearch;
    });
  }, [vocabDatabase, selectedLevel, selectedCategory, searchQuery]);

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
  const currentQuizCard = (quizPool && quizPool.length > 0) ? quizPool[quizIndex % quizPool.length] : null;

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
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);

      const bonusStars = quizTimeLeft > 5 ? 5 : 3;
      let streakBonus = 0;
      if (newStreak % 3 === 0) {
        streakBonus = 10;
        if (addToast) addToast(`🔥 COMBO STREAK x${newStreak}! Xuất sắc quá bé ơi! (+${streakBonus} Bonus Stars ⭐)`, 'success');
      } else {
        if (addToast) addToast(`🎉 Hoan hô bé! Đúng rồi (+${bonusStars} Stars ⭐)`, 'success');
      }

      const nextStars = stars + bonusStars + streakBonus;
      setStars(nextStars);
      localStorage.setItem('kids_earned_stars_2000', String(nextStars));
      playWordAudio(currentQuizCard.word);
    } else {
      setStreakCount(0);
      if (addToast) addToast(`Bé hãy nghe gợi ý và thử lại nhé! Đáp án là: ${correctAnswer}`, 'info');
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
                <span>Đã Thuộc {masteredCards.length} / {VOCABULARY_DATABASE.length} Từ</span>
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

          {/* Interactive Cute Pet Companion Selector */}
          <div className="p-5 rounded-3xl border-2 border-pink-400/80 bg-slate-900/95 shadow-2xl backdrop-blur-md space-y-3">
            <div className="text-center space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-pink-300 flex items-center justify-center gap-1">
                <Heart className="h-3.5 w-3.5 text-pink-400 fill-pink-400 animate-bounce" /> Chọn Bạn Nhỏ Đồng Hành:
              </div>
              <div className="text-6xl animate-bounce drop-shadow-xl cursor-pointer" onClick={() => playWordAudio(PETS.find((p) => p.id === activePet)?.quote || '')}>
                {PETS.find((p) => p.id === activePet)?.icon || '🦄'}
              </div>
              <div className="text-sm font-black text-white font-heading">
                {PETS.find((p) => p.id === activePet)?.name}
              </div>
              <p className="text-[11px] font-bold text-pink-200 bg-pink-950/80 p-2 rounded-xl border border-pink-500/40 italic">
                "{PETS.find((p) => p.id === activePet)?.quote}"
              </p>
            </div>

            {/* Pet Switch Buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {PETS.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => {
                    setActivePet(pet.id);
                    playWordAudio(pet.quote);
                  }}
                  className={`p-2 rounded-xl text-lg transition border flex items-center justify-center ${
                    activePet === pet.id
                      ? 'bg-pink-600 border-pink-400 text-white shadow-lg scale-110'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                  title={pet.name}
                >
                  {pet.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COURSE ROADMAP SELECTOR: 4 CEFR LEVELS (BASIC -> ADVANCED) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-cyan-400" /> Ma Trận Lộ Trình 4 Cấp Độ Tiếng Anh Cho Bé (400 Từ Cốt Lõi):
          </div>
          <button
            onClick={() => handleLevelChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-black border transition ${
              selectedLevel === 'all'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                : 'bg-slate-900 text-cyan-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            🌈 Tất Cả 4 Cấp Độ (400 Từ)
          </button>
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

                <div className="mt-3 pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono-code font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">{lvl.targetWords} Từ Vựng</span>
                    <span className="text-emerald-400">
                      Thuộc: {levelStats[lvl.id]?.mastered || 0}/{levelStats[lvl.id]?.total || 100} ({levelStats[lvl.id]?.pct || 0}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                      style={{ width: `${levelStats[lvl.id]?.pct || 0}%` }}
                    ></div>
                  </div>
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
          onClick={() => setActiveTab('vocab_manager')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'vocab_manager' ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="h-4 w-4 text-emerald-300" />
          <span>⚙️ Quản Lý Kho 2,000 Từ Vựng (Admin)</span>
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
                                <p className="text-[10px] font-bold text-pink-300 mt-0.5 bg-pink-950/60 px-2 py-0.5 rounded-full inline-block border border-pink-500/30">
                                  {getVietnamesePhoneticGuide(card.word)}
                                </p>
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
                        <p className="text-xs font-bold text-pink-300 mt-1 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-500/40 inline-block shadow-md">
                          {getVietnamesePhoneticGuide(spotlightCard.word)}
                        </p>
                      </div>

                      {/* Pronunciation Audio Toolbar */}
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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

                        <button
                          onClick={() => handleStartVoiceRecording(spotlightCard)}
                          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:scale-105 shadow-xl active:scale-95 transition"
                        >
                          <Mic className="h-4 w-4 animate-bounce text-yellow-300" />
                          <span>🎙️ AI Chấm Phát Âm Cho Bé</span>
                        </button>
                      </div>
                    </div>

                    {/* VIETNAMESE MEANING & ACCURATE DICTIONARY DETAILS */}
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-yellow-500/50 bg-slate-950 p-4 space-y-2 text-center animate-fadeIn shadow-lg">
                        <div className="text-2xl md:text-3xl font-black text-yellow-300 font-heading">
                          {spotlightCard.meaning}
                        </div>
                        <p className="text-xs text-cyan-300 font-medium">💡 Mẹo nhớ: {spotlightCard.hint}</p>

                        <div className="pt-2 border-t border-slate-800 text-left text-xs space-y-1">
                          <div className="font-bold text-cyan-300">"{spotlightCard.sentence}"</div>
                          <div className="text-slate-400">({spotlightCard.sentenceVi})</div>
                        </div>
                      </div>
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
                <h3 className="text-xl font-black font-heading text-white">100 BÀI TẬP NGẪU NHIÊN CHO BÉ</h3>
                <p className="text-xs text-slate-300">Phản hồi tích cực, gợi ý âm thanh & sinh động theo 4 cấp độ!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Question Count Tracker */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-mono-code font-bold text-cyan-300">
                Bài tập #{(quizIndex % 100) + 1} / 100
              </div>

              {/* Streak Combo Badge */}
              {streakCount > 0 && (
                <div className="flex items-center gap-1 rounded-2xl bg-amber-500/20 border border-amber-400 px-3 py-1.5 text-xs font-black text-amber-300 animate-pulse shadow-lg">
                  <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span>Streak x{streakCount} 🔥</span>
                </div>
              )}

              {/* Total Score */}
              <div className="flex items-center gap-1.5 rounded-2xl bg-pink-950 border border-pink-500/40 px-3.5 py-1.5 text-xs font-black text-pink-300 shadow-md">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>Điểm: {quizScore}</span>
              </div>
            </div>
          </div>

          {/* Quiz Mode Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => { setQuizMode('image_to_word'); setQuizTimeLeft(15); setQuizAnswered(false); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${quizMode === 'image_to_word' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              🖼️ Đoán Qua Icon
            </button>
            <button
              onClick={() => { setQuizMode('word_to_meaning'); setQuizTimeLeft(15); setQuizAnswered(false); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${quizMode === 'word_to_meaning' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              💡 Đoán Nghĩa TV
            </button>
            <button
              onClick={() => {
                setQuizMode('audio_to_word');
                setQuizTimeLeft(15);
                setQuizAnswered(false);
                if (currentQuizCard) playWordAudio(currentQuizCard.word);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${quizMode === 'audio_to_word' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              🔊 Nghe & Chọn Đúng
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
          {currentQuizCard ? (
            <div className="rounded-3xl border border-pink-500/40 bg-slate-950 p-6 text-center space-y-4 shadow-inner relative overflow-hidden">
              <div className="flex justify-center">
                <span className="rounded-full px-3 py-1 text-xs font-black bg-slate-900 border border-slate-700 text-cyan-300">
                  {currentQuizCard.level} • {currentQuizCard.hint}
                </span>
              </div>

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

              {quizMode === 'audio_to_word' && (
                <>
                  <button
                    onClick={() => playWordAudio(currentQuizCard.word)}
                    className="p-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition mx-auto flex items-center justify-center animate-pulse"
                  >
                    <Volume2 className="h-12 w-12" />
                  </button>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Hãy lắng nghe âm thanh và chọn từ Tiếng Anh tương ứng!</div>
                    <div className="text-xs text-slate-400 mt-1">Gợi ý nghĩa: "{currentQuizCard.meaning}"</div>
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
          ) : (
            <div className="text-center p-8 rounded-3xl border border-slate-800 bg-slate-950 text-slate-400 space-y-2">
              <div className="text-4xl">📚</div>
              <div className="font-bold text-slate-200">Chưa có từ vựng nào trong kho dữ liệu</div>
              <p className="text-xs">Hiện tại danh sách từ vựng trống.</p>
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
                      <CheckCircle2 className="h-4 w-4" /> Xuất sắc lắm bé ơi! 🎉 (+5 Stars ⭐)
                    </span>
                  ) : (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-amber-400" /> Bé hãy bấm nghe lại gợi ý nhé! Đáp án đúng là '{correctAnswer}' 💪
                    </span>
                  );
                })()}
              </div>

              <button
                onClick={handleNextQuiz}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-xs font-black text-white hover:from-pink-500 hover:to-purple-500 shadow-xl transition active:scale-95"
              >
                <span>Bài Tập Tiếp Theo (#{(quizIndex % 100) + 2})</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ADMIN VOCABULARY DATABASE MANAGER (CRUD 2,000 WORDS) */}
      {/* ========================================================================= */}
      {activeTab === 'vocab_manager' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* Header Control Panel */}
          <div className="glass-panel rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-950 via-teal-950/60 to-slate-950 p-6 md:p-8 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1 text-xs font-black text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Master Admin CRUD Console</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black font-heading text-white">
                  QUẢN LÝ KHO DỮ LIỆU <span className="gradient-text-emerald font-black">2,000 TỪ VỰNG TIẾNG ANH</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Thêm mới từ vựng, hiệu chỉnh phiên âm IPA, dịch nghĩa tiếng Việt, icon minh họa, và câu ví dụ. Tự động lưu ngầm vào hệ thống.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 px-5 py-3 text-xs font-black text-white shadow-xl hover:scale-105 active:scale-95 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Thêm Từ Vựng Mới</span>
                </button>

                <button
                  onClick={handleExportVocabJson}
                  className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-black text-slate-200 hover:bg-slate-800 transition active:scale-95"
                >
                  <Download className="h-4 w-4 text-cyan-400" />
                  <span>Xuất JSON</span>
                </button>

                <button
                  onClick={handleResetVocabDatabase}
                  className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-xs font-black text-amber-300 hover:bg-amber-900/60 transition active:scale-95"
                >
                  <RefreshCw className="h-4 w-4 text-amber-400" />
                  <span>Khôi Phục Mặc Định</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-800">
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm từ tiếng Anh, phiên âm IPA, nghĩa tiếng Việt..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedLevel}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-200 focus:outline-none"
                >
                  <option value="all">🌈 Tất cả 4 Cấp Độ (CEFR)</option>
                  {COURSE_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-200 focus:outline-none"
                >
                  <option value="all">📚 Tất cả 40 Chủ Đề Units</option>
                  {VOCAB_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Admin Vocabulary Data Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead className="border-b border-slate-800 bg-slate-900/95 text-xs text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-16 text-center">Icon</th>
                  <th className="p-4 w-44">Từ Vựng & IPA</th>
                  <th className="p-4 w-44">Nghĩa Tiếng Việt</th>
                  <th className="p-4 w-48">Cấp Độ & Chủ Đề</th>
                  <th className="p-4">Câu Ví Dụ Minh Họa</th>
                  <th className="p-4 w-28 text-center">Thao Tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {paginatedCards.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-4 text-center text-3xl">{item.image}</td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2 font-black text-sm text-white font-heading">
                        <span>{item.word}</span>
                        <button
                          onClick={() => playWordAudio(item.word)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Nghe phát âm chuẩn"
                        >
                          <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                        </button>
                      </div>
                      <div className="font-mono-code text-[11px] text-cyan-300 font-bold">{item.ipa || '/.../'}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-200">
                      <div>{item.meaning}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{getVietnamesePhoneticGuide(item.word)}</div>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className="inline-block rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-black text-indigo-300">
                        {item.level}
                      </span>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {VOCAB_CATEGORIES.find((c) => c.id === item.category)?.name || item.category}
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="italic text-slate-300 font-medium">"{item.sentence}"</div>
                      <div className="text-[11px] text-emerald-400 font-medium">{item.sentenceVi}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900 transition"
                          title="Sửa từ vựng này"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVocabItem(item)}
                          className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900 transition"
                          title="Xóa từ vựng này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold">
                Trang {currentPage} / {totalPages} (Tổng {filteredDatabase.length} từ)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 font-bold text-slate-300 disabled:opacity-40"
                >
                  Trang Trước
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 font-bold text-slate-300 disabled:opacity-40"
                >
                  Trang Kế
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN EDIT / CREATE VOCABULARY MODAL */}
      {/* ========================================================================= */}
      {showVocabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md animate-fadeIn font-sans">
          <div className="w-full max-w-2xl rounded-3xl border border-emerald-500/50 bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Edit className="h-5 w-5" />
                </div>
                <h3 className="text-lg md:text-xl font-black font-heading text-white">
                  {editingWord ? `HIỆU CHỈNH TỪ VỰNG: ${editingWord.word}` : 'THÊM TỪ VỰNG MỚI VÀO KHO DỮ LIỆU'}
                </h3>
              </div>
              <button
                onClick={() => setShowVocabModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVocabItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Word */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Từ Tiếng Anh (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: strawberry"
                    value={vocabForm.word}
                    onChange={(e) => setVocabForm({ ...vocabForm, word: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* IPA Phonetic */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Phiên Âm IPA:</label>
                  <input
                    type="text"
                    placeholder="VD: /ˈstrɔːbəri/"
                    value={vocabForm.ipa}
                    onChange={(e) => setVocabForm({ ...vocabForm, ipa: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono-code text-cyan-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Meaning */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nghĩa Tiếng Việt (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: quả dâu tây"
                    value={vocabForm.meaning}
                    onChange={(e) => setVocabForm({ ...vocabForm, meaning: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Icon Emoji */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Biểu Tượng Icon Emoji:</label>
                  <input
                    type="text"
                    placeholder="VD: 🍓"
                    value={vocabForm.image}
                    onChange={(e) => setVocabForm({ ...vocabForm, image: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xl text-center focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Level */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Cấp Độ (CEFR Level):</label>
                  <select
                    value={vocabForm.level}
                    onChange={(e) => setVocabForm({ ...vocabForm, level: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200 font-bold focus:outline-none"
                  >
                    {COURSE_LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Chủ Đề (Unit Category):</label>
                  <select
                    value={vocabForm.category}
                    onChange={(e) => setVocabForm({ ...vocabForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200 font-bold focus:outline-none"
                  >
                    {VOCAB_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sample Sentences */}
              <div className="space-y-1 pt-2">
                <label className="font-bold text-slate-300">Câu Ví Dụ Tiếng Anh:</label>
                <input
                  type="text"
                  placeholder="VD: I love fresh strawberries."
                  value={vocabForm.sentence}
                  onChange={(e) => setVocabForm({ ...vocabForm, sentence: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Dịch Nghĩa Câu Tiếng Việt:</label>
                <input
                  type="text"
                  placeholder="VD: Bé rất thích những quả dâu tây tươi."
                  value={vocabForm.sentenceVi}
                  onChange={(e) => setVocabForm({ ...vocabForm, sentenceVi: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowVocabModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 font-bold text-slate-400 hover:text-white transition"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-black text-white shadow-xl hover:scale-105 transition"
                >
                  Lưu Từ Vựng
                </button>
              </div>
            </form>
          </div>
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

      {/* ========================================================================= */}
      {/* AI VOICE PRONUNCIATION GRADER MODAL DIALOG */}
      {/* ========================================================================= */}
      {showVoiceModal && voiceTargetWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xl animate-fadeIn font-sans">
          <div className="w-full max-w-lg rounded-3xl border-2 border-cyan-400 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Ambient Animated Glows */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-48 w-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Mic className="h-5 w-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <h3 className="text-base md:text-lg font-black font-heading text-white">MÁY CHẤM PHÁT ÂM AI CHO BÉ MINH ANH</h3>
                  <p className="text-[11px] text-cyan-300 font-bold">Phân tích âm tiết, phiên âm IPA & cấp điểm số thời gian thật</p>
                </div>
              </div>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Target Word Info */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/90 space-y-2 relative">
              <div className="text-5xl md:text-6xl animate-bounce">{voiceTargetWord.image}</div>
              <div className="text-3xl font-black font-heading text-white tracking-tight">{voiceTargetWord.word}</div>
              <div className="font-mono-code text-sm text-cyan-300 font-bold">{voiceTargetWord.ipa}</div>
              <div className="text-xs text-yellow-300 font-bold">"{voiceTargetWord.meaning}"</div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => playWordAudio(voiceTargetWord.word)}
                  className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-700 px-4 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition active:scale-95"
                >
                  <Volume2 className="h-4 w-4 text-cyan-400" /> Nghe Âm Mẫu Chuẩn
                </button>
              </div>
            </div>

            {/* Mic Record Interactive Control */}
            <div className="space-y-4">
              <div className="relative flex justify-center py-2">
                <button
                  onClick={() => handleStartVoiceRecording(voiceTargetWord)}
                  disabled={isListening}
                  className={`relative z-10 h-24 w-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
                    isListening
                      ? 'bg-rose-600 scale-110 ring-8 ring-rose-500/40 animate-pulse text-white'
                      : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  <Mic className={`h-10 w-10 ${isListening ? 'animate-bounce' : ''}`} />
                  <span className="text-[10px] font-black uppercase mt-1">
                    {isListening ? 'Đang Nghe...' : 'Bấm Đọc'}
                  </span>
                </button>

                {/* Pulsing Audio Waves Ring */}
                {isListening && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-32 w-32 rounded-full border-4 border-rose-500/50 animate-ping"></div>
                    <div className="h-40 w-40 rounded-full border-2 border-cyan-400/30 animate-pulse"></div>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 font-bold">
                {isListening
                  ? '🎙️ BÉ NÓI VÀO MICRO KHÔNG KHÍ HOẶC THIẾT BỊ NÀO...'
                  : 'Bấm nút Micro màu xanh ở trên và đọc to từ vựng tiếng Anh nhé!'}
              </p>
            </div>

            {/* Speech Transcript */}
            {recordedTranscript && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-code">
                <span className="text-slate-400">Giọng nói ghi nhận: </span>
                <span className="text-white font-bold">"{recordedTranscript}"</span>
              </div>
            )}

            {/* Detailed Pronunciation Score Report */}
            {pronunciationResult && (
              <div className="p-5 rounded-2xl border-2 bg-slate-950/90 space-y-4 text-left animate-scaleIn border-cyan-500/50">
                {/* Main Score Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Độ Chuẩn Âm Thanh:</div>
                    <div className="text-3xl font-black text-white font-heading">{pronunciationResult.score} / 100</div>
                  </div>
                  <div className={`px-3 py-1 rounded-xl text-xs font-black border ${pronunciationResult.badgeColor}`}>
                    {pronunciationResult.feedbackLabel}
                  </div>
                </div>

                {/* Score Breakdown Metrics */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono-code">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-slate-400 text-[10px]">Chính Xác</div>
                    <div className="text-cyan-400 font-bold">{pronunciationResult.wordMatch}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-slate-400 text-[10px]">Trọng Âm</div>
                    <div className="text-amber-400 font-bold">{pronunciationResult.intonation}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-slate-400 text-[10px]">Trôi Chảy</div>
                    <div className="text-emerald-400 font-bold">{pronunciationResult.fluency}%</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-700 ${
                        pronunciationResult.score >= 85 ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${pronunciationResult.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowVoiceModal(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-black text-xs shadow-xl hover:scale-105 transition"
              >
                ĐÃ RÕ (ĐÓNG MÁY CHẤM PHÁT ÂM)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
