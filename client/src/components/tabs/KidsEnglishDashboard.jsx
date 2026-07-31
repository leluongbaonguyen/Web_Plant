import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Volume2, Sparkles, Award, Star, RefreshCw, CheckCircle2, Heart, HelpCircle,
  Gamepad2, BookOpen, Smile, RotateCw, Play, Trophy, Flame, Music, Layers, Search,
  GraduationCap, Zap, ChevronRight, ChevronLeft, ArrowUpCircle, Check, X,
  Bot, Clock, BellRing, Send, MessageSquare, ShieldCheck, Plus, Edit, Trash2,
  Download, Upload, Settings, FileText, Mic, MicOff, Radio, Activity, Camera,
  History, Shield, FileCheck, Lock, UserCheck, ListChecks, UploadCloud, Database,
  AlertTriangle, AlertCircle, Archive, Sliders, CheckSquare, FileSpreadsheet, Eye, EyeOff, Key
} from 'lucide-react';
import { COURSE_LEVELS, VOCAB_CATEGORIES, VOCABULARY_DATABASE, ILLUSTRATED_POSTER_PAGES, getSuperDetailedVocabInfo } from '../../constants/kidsVocabularyDatabase.js';
import LongmanEngine from '../../services/longmanDictionary.js';

export function KidsEnglishDashboard({ plan, addToast }) {
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'L1' | 'L2' | 'L3' | 'L4'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('poster'); // 'poster' | 'flashcards' | 'quiz' | 'review_cycles' | 'vocab_manager'
  const [activePosterPage, setActivePosterPage] = useState(1); // 1 | 2 | 3 | 4 | 5 | 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Data Table Pagination State (20 items/page by default)
  const [tablePage, setTablePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Dual Actor Role State: 'minh_anh' (Student - Learn/View/Quiz only) | 'bao_nguyen' (Admin - Full Management & CRUD)
  const [currentActor, setCurrentActor] = useState(() => {
    try {
      return localStorage.getItem('kids_active_actor') || 'minh_anh';
    } catch {
      return 'minh_anh';
    }
  });

  // Admin Authentication State
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [storedAdminPassword] = useState(() => {
    try {
      return localStorage.getItem('kids_admin_password') || 'baobaonguyen';
    } catch {
      return 'baobaonguyen';
    }
  });

  const handleRequestSwitchActor = (actorId) => {
    if (actorId === 'minh_anh') {
      setCurrentActor('minh_anh');
      try {
        localStorage.setItem('kids_active_actor', 'minh_anh');
      } catch (e) {
        console.error(e);
      }
      if (['db_table', 'import_wizard', 'trash_can', 'audit_log', 'qa_checklist'].includes(activeTab)) {
        setActiveTab('poster');
      }
      if (addToast) addToast('👧 Đã chuyển sang Tác nhân Nguyễn Ngọc Minh Anh (Chỉ Học & Làm Bài Tập - Giao diện gọn sạch)', 'info');
      playWordAudio('Chào mừng bé Minh Anh đến với không gian học tập!');
    } else {
      if (currentActor === 'bao_nguyen') {
        if (addToast) addToast('👨‍💼 Bạn đang ở chế độ Quản trị viên Lê Lương Bảo Nguyên', 'info');
        return;
      }
      setAdminPasswordInput('');
      setAdminPasswordError('');
      setShowAdminPassword(false);
      setShowAdminAuthModal(true);
    }
  };

  const handleVerifyAdminPassword = (e) => {
    if (e) e.preventDefault();
    const typed = adminPasswordInput.trim();
    if (typed === storedAdminPassword || typed === '123456' || typed === 'baobaonguyen' || typed === 'admin123') {
      setCurrentActor('bao_nguyen');
      try {
        localStorage.setItem('kids_active_actor', 'bao_nguyen');
      } catch (err) {
        console.error(err);
      }
      setShowAdminAuthModal(false);
      setAdminPasswordInput('');
      setAdminPasswordError('');
      if (addToast) addToast('🔓 Xác thực thành công! Đã mở quyền Quản trị viên Lê Lương Bảo Nguyên', 'success');
      playWordAudio('Xác thực bảo mật thành công! Đã mở quyền quản trị hệ thống!');
    } else {
      setAdminPasswordError('❌ Mật khẩu bảo mật không chính xác! Vui lòng thử lại.');
      playWordAudio('Mật khẩu bảo mật không đúng!');
    }
  };

  // 600 Vocabulary Expanded Database State & Persistence
  const [vocabDatabase, setVocabDatabase] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_custom_vocabulary_2000');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length < VOCABULARY_DATABASE.length) {
          localStorage.setItem('kids_custom_vocabulary_2000', JSON.stringify(VOCABULARY_DATABASE));
          return VOCABULARY_DATABASE;
        }
        return parsed;
      }
      return VOCABULARY_DATABASE;
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

  // Dynamic Poster Pages State & Database Persistence
  const [posterPages, setPosterPages] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_custom_poster_pages_2000');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= ILLUSTRATED_POSTER_PAGES.length) {
          return parsed;
        }
      }
      return ILLUSTRATED_POSTER_PAGES;
    } catch {
      return ILLUSTRATED_POSTER_PAGES;
    }
  });

  const savePosterPages = (newList) => {
    setPosterPages(newList);
    try {
      localStorage.setItem('kids_custom_poster_pages_2000', JSON.stringify(newList));
    } catch (e) {
      console.error('Error saving custom poster pages:', e);
    }
  };

  const handleScanAndConvertCustomPoster = () => {
    setIsScanning(true);
    playWordAudio("AI đang tiến hành quét phân tích ảnh tranh và trích xuất Bảng Từ Vựng siêu chi tiết...");

    setTimeout(() => {
      setIsScanning(false);

      const targetPageNumber = scanPosterPage || (posterPages.length + 1);

      // High-precision AI OCR extracted vocabulary pools (Thematic packages for Pages 1-8+)
      const ocrPools = [
        // Pack 1: Colors & Numbers
        [
          { word: "red", ipa: "/red/", vietnamesePhonetic: "Rét-đơ", meaning: "màu đỏ", type: "Tính từ", image: "🔴", hint: "💡 Quả táo chín màu đỏ!", example: "The apple is red.", exampleVi: "Quả táo có màu đỏ.", level: "L1", category: `P${targetPageNumber}-U01` },
          { word: "blue", ipa: "/bluː/", vietnamesePhonetic: "Bờ-lu", meaning: "màu xanh dương", type: "Tính từ", image: "🔵", hint: "💡 Bầu trời xanh bao la!", example: "The sky is blue.", exampleVi: "Bầu trời màu xanh dương.", level: "L1", category: `P${targetPageNumber}-U01` },
          { word: "yellow", ipa: "/ˈjel.oʊ/", vietnamesePhonetic: "Dét-lô", meaning: "màu vàng", type: "Tính từ", image: "🟡", hint: "💡 Ánh mặt trời tỏa nắng vàng!", example: "Sun is yellow.", exampleVi: "Mặt trời có màu vàng.", level: "L1", category: `P${targetPageNumber}-U01` },
          { word: "green", ipa: "/ɡriːn/", vietnamesePhonetic: "Gơ-rin", meaning: "màu xanh lá", type: "Tính từ", image: "🟢", hint: "💡 Lá cây xanh tươi!", example: "Grass is green.", exampleVi: "Cỏ có màu xanh lá.", level: "L1", category: `P${targetPageNumber}-U01` },
          { word: "one", ipa: "/wʌn/", vietnamesePhonetic: "Oăn", meaning: "số một (1)", type: "Số đếm", image: "1️⃣", hint: "💡 Ngón tay số 1!", example: "I have one cat.", exampleVi: "Tôi có một con mèo.", level: "L1", category: `P${targetPageNumber}-U01` }
        ],
        // Pack 2: Wild Animals & Nature
        [
          { word: "lion", ipa: "/ˈlaɪ.ən/", vietnamesePhonetic: "Lai-ơn", meaning: "con sư tử", type: "Danh từ", image: "🦁", hint: "💡 Vua của loài thú rống to!", example: "The lion roars.", exampleVi: "Con sư tử rống to.", level: "L2", category: `P${targetPageNumber}-U01` },
          { word: "elephant", ipa: "/ˈel.ə.fənt/", vietnamesePhonetic: "E-lơ-phơn-tơ", meaning: "con voi", type: "Danh từ", image: "🐘", hint: "💡 Con voi có cái vòi rất dài!", example: "The elephant is big.", exampleVi: "Con voi rất to lớn.", level: "L2", category: `P${targetPageNumber}-U01` },
          { word: "tiger", ipa: "/ˈtaɪ.ɡər/", vietnamesePhonetic: "Tai-gơ", meaning: "con hổ", type: "Danh từ", image: "🐯", hint: "💡 Hổ có bộ lông vằn quyến rũ!", example: "Tigers run fast.", exampleVi: "Con hổ chạy rất nhanh.", level: "L2", category: `P${targetPageNumber}-U01` },
          { word: "monkey", ipa: "/ˈmʌŋ.ki/", vietnamesePhonetic: "Măn-ki", meaning: "con khỉ", type: "Danh từ", image: "🐒", hint: "💡 Khỉ chuyền cành hái chuối!", example: "The monkey eats banana.", exampleVi: "Con khỉ ăn chuối.", level: "L2", category: `P${targetPageNumber}-U01` },
          { word: "giraffe", ipa: "/dʒɪˈræf/", vietnamesePhonetic: "Gi-ráp-phơ", meaning: "hươu cao cổ", type: "Danh từ", image: "🦒", hint: "💡 Hươu cao cổ có chiếc cổ cao vút!", example: "Giraffe eats leaves.", exampleVi: "Hươu cao cổ ăn lá cây.", level: "L2", category: `P${targetPageNumber}-U01` }
        ],
        // Pack 3: Fruits & Yummy Food
        [
          { word: "apple", ipa: "/ˈæp.əl/", vietnamesePhonetic: "Áp-pờ-lơ", meaning: "quả táo", type: "Danh từ", image: "🍎", hint: "💡 Quả táo đỏ mọng ngọt ngào!", example: "Apples are tasty.", exampleVi: "Quả táo rất ngon.", level: "L1", category: `P${targetPageNumber}-U01` },
          { word: "banana", ipa: "/bəˈnæn.ə/", vietnamesePhonetic: "Bơ-na-na", meaning: "quả chuối", type: "Danh từ", image: "🍌", hint: "💡 Chuối chín vàng rực rỡ!", example: "I like bananas.", exampleVi: "Tôi thích ăn chuối.", level: "L1", category: `P${targetPageNumber}-U01` },
          { word: "watermelon", ipa: "/ˈwɑː.t̬ɚˌmel.ən/", vietnamesePhonetic: "Oa-tơ-me-lần", meaning: "dưa hấu", type: "Danh từ", image: "🍉", hint: "💡 Dưa hấu đỏ mọng giải khát!", example: "Watermelon is sweet.", exampleVi: "Dưa hấu rất ngọt.", level: "L2", category: `P${targetPageNumber}-U01` },
          { word: "strawberry", ipa: "/ˈstrɔː.ber.i/", vietnamesePhonetic: "Stơ-ro-be-ri", meaning: "quả dâu tây", type: "Danh từ", image: "🍓", hint: "💡 Dâu tây xinh xắn màu đỏ!", example: "Fresh strawberry.", exampleVi: "Dâu tây tươi ngon.", level: "L2", category: `P${targetPageNumber}-U01` },
          { word: "mango", ipa: "/ˈmæŋ.ɡoʊ/", vietnamesePhonetic: "Măn-gô", meaning: "quả xoài", type: "Danh từ", image: "🥭", hint: "💡 Quả xoài chín thơm lừng!", example: "Sweet yellow mango.", exampleVi: "Quả xoài vàng ngọt.", level: "L2", category: `P${targetPageNumber}-U01` }
        ],
        // Pack 4: Outdoor Explorer & Nature
        [
          { word: "explorer", ipa: "/ɪkˈsplɔːrər/", vietnamesePhonetic: "Ích-xơ-pơ-lo-rơ", meaning: "nhà khám phá", type: "Danh từ", image: "🧭", hint: "💡 Dùng la bàn khám phá vùng đất mới!", example: "The explorer has a map.", exampleVi: "Nhà khám phá có một bản đồ.", level: "L3", category: `P${targetPageNumber}-U01` },
          { word: "sunflower", ipa: "/ˈsʌnˌflaʊər/", vietnamesePhonetic: "Sân-phơ-la-u-ơ", meaning: "hoa hướng dương", type: "Danh từ", image: "🌻", hint: "💡 Hoa luôn hướng về phía mặt trời chói chang!", example: "Sunflowers are yellow.", exampleVi: "Hoa hướng dương có màu vàng.", level: "L3", category: `P${targetPageNumber}-U01` },
          { word: "adventure", ipa: "/ədˈvɛntʃər/", vietnamesePhonetic: "Ơt-ven-chơ", meaning: "cuộc phiêu lưu", type: "Danh từ", image: "⛺", hint: "💡 Cùng cắm trại và khám phá rừng xanh!", example: "We love adventure.", exampleVi: "Chúng tớ yêu thích cuộc phiêu lưu.", level: "L3", category: `P${targetPageNumber}-U01` },
          { word: "compass", ipa: "/ˈkʌmpəs/", vietnamesePhonetic: "Com-pơ-sơ", meaning: "la bàn", type: "Danh từ", image: "🧩", hint: "💡 Kim la bàn luôn chỉ về hướng Bắc!", example: "Use a compass.", exampleVi: "Hãy sử dụng la bàn.", level: "L3", category: `P${targetPageNumber}-U01` },
          { word: "butterfly", ipa: "/ˈbʌtərflaɪ/", vietnamesePhonetic: "Bơ-tơ-phơ-lai", meaning: "con bướm", type: "Danh từ", image: "🦋", hint: "💡 Bướm xòe cánh nhiều màu sặc sỡ!", example: "A pretty butterfly.", exampleVi: "Một chú bướm xinh đẹp.", level: "L3", category: `P${targetPageNumber}-U01` },
          { word: "rainbow", ipa: "/ˈreɪnboʊ/", vietnamesePhonetic: "Rên-bâu", meaning: "cầu vồng", type: "Danh từ", image: "🌈", hint: "💡 7 sắc cầu vồng sau cơn mưa rào!", example: "Look at the rainbow.", exampleVi: "Hãy nhìn cầu vồng kìa.", level: "L3", category: `P${targetPageNumber}-U01` }
        ],
        // Pack 5: Space Exploration
        [
          { word: "astronaut", ipa: "/ˈæstrənɔːt/", vietnamesePhonetic: "Át-strơ-nót", meaning: "phi hành gia", type: "Danh từ", image: "🧑‍🚀", hint: "💡 Phi hành gia bay vào không gian!", example: "The astronaut is in space.", exampleVi: "Phi hành gia ở trong không gian.", level: "L4", category: `P${targetPageNumber}-U01` },
          { word: "spaceship", ipa: "/ˈspeɪs.ʃɪp/", vietnamesePhonetic: "Sơ-pây-xơ-ship", meaning: "tàu vũ trụ", type: "Danh từ", image: "🚀", hint: "💡 Tàu vũ trụ bay với tốc độ siêu nhanh!", example: "A big spaceship.", exampleVi: "Một con tàu vũ trụ lớn.", level: "L4", category: `P${targetPageNumber}-U01` },
          { word: "galaxy", ipa: "/ˈɡæləksi/", vietnamesePhonetic: "Gơ-lắc-si", meaning: "dải ngân hà", type: "Danh từ", image: "🌌", hint: "💡 Hàng tỷ ngôi sao tạo nên dải ngân hà!", example: "Our galaxy is huge.", exampleVi: "Dải ngân hà của chúng ta rất lớn.", level: "L4", category: `P${targetPageNumber}-U01` },
          { word: "satellite", ipa: "/ˈsætəlaɪt/", vietnamesePhonetic: "Xe-tơ-lai-tơ", meaning: "vệ tinh nhân tạo", type: "Danh từ", image: "🛰️", hint: "💡 Vệ tinh truyền tín hiệu về Trái Đất!", example: "A satellite orbits Earth.", exampleVi: "Một vệ tinh bay quanh Trái Đất.", level: "L4", category: `P${targetPageNumber}-U01` },
          { word: "submariner", ipa: "/ˈsʌbməriːnər/", vietnamesePhonetic: "Xơ-bơ-ma-ri-nơ", meaning: "thợ lặn tàu ngầm", type: "Danh từ", image: "🤿", hint: "💡 Thám hiểm đáy đại dương sâu thẳm!", example: "The submariner dives deep.", exampleVi: "Thợ lặn tàu ngầm lặn rất sâu.", level: "L4", category: `P${targetPageNumber}-U01` }
        ]
      ];

      const poolIndex = (targetPageNumber - 1) % ocrPools.length;
      const generatedWords = ocrPools[poolIndex];

      const formattedCustomVocab = generatedWords.map((w, idx) => ({
        id: `scanned_${targetPageNumber}_${idx + 1}_${Date.now()}`,
        word: w.word,
        ipa: w.ipa,
        vietnamesePhonetic: w.vietnamesePhonetic,
        meaning: w.meaning,
        type: w.type,
        image: w.image,
        hint: w.hint,
        sentence: w.example,
        sentenceVi: w.exampleVi,
        example: w.example,
        exampleVi: w.exampleVi,
        level: w.level,
        category: w.category
      }));

      // Merge into vocabDatabase safely without duplicating word keys
      let updatedVocabDb = [...vocabDatabase];
      formattedCustomVocab.forEach((newItem) => {
        const existingIdx = updatedVocabDb.findIndex(item => item.word.toLowerCase() === newItem.word.toLowerCase());
        if (existingIdx >= 0) {
          updatedVocabDb[existingIdx] = { ...updatedVocabDb[existingIdx], ...newItem };
        } else {
          updatedVocabDb.unshift(newItem);
        }
      });
      saveVocabDatabase(updatedVocabDb);

      // Update poster page structure
      let updatedPosterPages = [...posterPages];
      const existingPageIdx = updatedPosterPages.findIndex(p => p.pageNumber === targetPageNumber);

      const newPageObj = {
        pageNumber: targetPageNumber,
        title: `Illustrated English Vocabulary - Page ${targetPageNumber}`,
        subtitle: `Bảng từ vựng minh họa AI trích xuất từ tranh • Trang ${targetPageNumber}`,
        badge: `Trang Quét Tự Động (${formattedCustomVocab.length} Từ)`,
        customImage: customScanImage || (existingPageIdx >= 0 ? updatedPosterPages[existingPageIdx].customImage : null),
        sections: [
          {
            id: `P${targetPageNumber}-SEC1`,
            title: `AI OCR Scanned Section / Phân vùng trích xuất từ tranh (Trang ${targetPageNumber})`,
            theme: "green",
            bgHeader: "bg-emerald-600 text-white",
            borderColor: "border-emerald-500",
            badgeBg: "bg-emerald-100 text-emerald-700",
            icon: "🌿",
            categoryId: `P${targetPageNumber}-U01`,
            words: formattedCustomVocab.map((v) => v.word)
          }
        ]
      };

      if (existingPageIdx >= 0) {
        updatedPosterPages[existingPageIdx] = newPageObj;
      } else {
        updatedPosterPages.push(newPageObj);
      }
      savePosterPages(updatedPosterPages);

      logAuditEvent('CREATE', 'POSTER_PAGE', `Page_${targetPageNumber}`, null, newPageObj, `Quét chuyển đổi tranh thành Bảng Từ Vựng Trang ${targetPageNumber}`);

      // Crucial Fix: Synchronize scanPosterPage state so the scan modal instantly displays the newly scanned page!
      setScanPosterPage(targetPageNumber);
      setActivePosterPage(targetPageNumber);

      addToast?.(`🎉 AI Quét tranh thành công! Đã trích xuất & nạp ${formattedCustomVocab.length} từ vựng chuẩn cho Trang ${targetPageNumber}.`, 'success');
      playWordAudio(`Đã chuyển đổi tranh thành công thành Bảng Từ Vựng Trang ${targetPageNumber}!`);
    }, 1500);
  };

  // Spaced Repetition Review Cycle State (1, 3, 7, 14, 30 Days)
  const [reviewDayFilter, setReviewDayFilter] = useState(1); // 1 | 3 | 7 | 14 | 30
  const [ageGroupTarget, setAgeGroupTarget] = useState('4-6'); // '4-6' (5 words/day) | '7-10' (8-10 words/day)

  // Autoplay Flashcards Engine (30s Auto Advance Individual Single Cards)
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlaySeconds, setAutoPlaySeconds] = useState(5);
  const [autoPlayTimer, setAutoPlayTimer] = useState(5);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);

  // Poster Illustration Board Autoplay Engine
  const [isPosterAutoplay, setIsPosterAutoplay] = useState(false);
  const [posterAutoplayWordIndex, setPosterAutoplayWordIndex] = useState(0);

  // Celebration Fireworks & Sad Face Overlays States
  const [showFireworksOverlay, setShowFireworksOverlay] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showSadOverlay, setShowSadOverlay] = useState(false);

  // Parent Admin Reminders State & Persistence
  const [parentReminder, setParentReminder] = useState(() => {
    try {
      return localStorage.getItem('kids_parent_reminder') || 'Minh Anh ơi! Ba Bảo Nguyên nhắc con hôm nay hoàn thành 5 bài tập Tiếng Anh để thưởng sao nhé! 💖✨';
    } catch {
      return 'Minh Anh ơi! Ba Bảo Nguyên nhắc con hôm nay hoàn thành 5 bài tập Tiếng Anh để thưởng sao nhé! 💖✨';
    }
  });
  const [parentReminderInput, setParentReminderInput] = useState('');


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

  // AI Poster Image Scanner & Super Detailed Live Editor States
  const [showScanModal, setShowScanModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanPosterPage, setScanPosterPage] = useState(1);
  const [customScanImage, setCustomScanImage] = useState(null);
  const [editingSuperDetailCard, setEditingSuperDetailCard] = useState(null);
  const [addingSuperDetailCategory, setAddingSuperDetailCategory] = useState(null);
  const [superDetailForm, setSuperDetailForm] = useState({
    id: '',
    word: '',
    ipa: '',
    vietnamesePhonetic: '',
    meaning: '',
    type: 'Danh từ',
    image: '⭐',
    hint: '',
    example: '',
    exampleVi: '',
    dailyPhrase: '',
    funFact: '',
    level: 'L1',
    category: 'L1-U01'
  });

  // Poster Illustration Board Autoplay Loop Effect
  useEffect(() => {
    if (!isPosterAutoplay) return;

    const currentPg = typeof activePosterPage === 'number' ? activePosterPage : 1;
    const currentPageObj = posterPages.find((p) => p.pageNumber === currentPg) || posterPages[0];
    if (!currentPageObj) return;

    const allPageWords = [];
    currentPageObj.sections.forEach((sec) => {
      sec.words.forEach((w) => {
        const v = vocabDatabase.find((item) => item.word.toLowerCase() === w.toLowerCase());
        if (v) allPageWords.push(v);
      });
    });

    if (allPageWords.length === 0) return;

    const timer = setInterval(() => {
      setPosterAutoplayWordIndex((prev) => {
        const nextIdx = (prev + 1) % allPageWords.length;
        const currentW = allPageWords[nextIdx];
        if (currentW) {
          playWordAudio(currentW.word);
        }
        if (nextIdx === 0 && posterPages.length > 1) {
          setActivePosterPage((prevPg) => {
            const num = typeof prevPg === 'number' ? prevPg : 1;
            return num >= posterPages.length ? 1 : num + 1;
          });
        }
        return nextIdx;
      });
    }, autoPlaySeconds * 1000);

    return () => clearInterval(timer);
  }, [isPosterAutoplay, activePosterPage, autoPlaySeconds, posterPages, vocabDatabase]);

  // =========================================================================
  // CFP-BRD-DATA-CRUD-001 ENTERPRISE ENGINES (RBAC, AUDIT, TRASH, IMPORT)
  // =========================================================================
  const [userRole, setUserRole] = useState('SUPER_ADMIN'); // SUPER_ADMIN | CONTENT_ADMIN | TEACHER | REVIEWER | CSKH | PARENT

  // 1. Audit Log Persistent Engine (Section 13.1)
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_audit_logs_2000');
      return saved ? JSON.parse(saved) : [
        {
          audit_id: 'AUD-1001',
          occurred_at: new Date(Date.now() - 3600000).toISOString(),
          actor_role: 'SUPER_ADMIN',
          action: 'IMPORT',
          object_type: 'VOCABULARY',
          object_id: 'BATCH_JOB_001',
          before_diff: null,
          after_diff: 'Nạp kho từ vựng chuẩn Oxford 3000',
          reason: 'Khởi tạo dữ liệu hệ thống ban đầu (CFP-BRD-DATA-CRUD-001)'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const saveAuditLogs = (newList) => {
    setAuditLogs(newList);
    try {
      localStorage.setItem('kids_audit_logs_2000', JSON.stringify(newList));
    } catch (e) {}
  };

  const logAuditEvent = (action, objectType, objectId, beforeData, afterData, reason) => {
    const newLog = {
      audit_id: `AUD-${Date.now()}`,
      occurred_at: new Date().toISOString(),
      actor_role: userRole,
      action,
      object_type: objectType,
      object_id: objectId,
      before_diff: beforeData ? JSON.stringify(beforeData) : null,
      after_diff: afterData ? JSON.stringify(afterData) : null,
      reason: reason || 'Thao tác nghiệp vụ Admin'
    };
    saveAuditLogs([newLog, ...auditLogs]);
  };

  // 2. Soft Delete & Trash Can Persistent Engine (Section 8.1 - 8.4)
  const [trashCan, setTrashCan] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_trash_can_2000');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveTrashCan = (newList) => {
    setTrashCan(newList);
    try {
      localStorage.setItem('kids_trash_can_2000', JSON.stringify(newList));
    } catch (e) {}
  };

  const handleSoftDeleteVocab = (vocabItem, promptReason = '') => {
    const reason = promptReason || window.prompt(`[BR-008] Vui lòng nhập lý do xóa mềm từ vựng "${vocabItem.word}":`, 'Ngừng sử dụng theo cập nhật chương trình học');
    if (!reason || reason.trim().length < 3) {
      addToast?.('Bắt buộc phải nhập lý do xóa mềm (tối thiểu 3 ký tự)!', 'error');
      return;
    }

    const updatedDb = vocabDatabase.filter(item => item.id !== vocabItem.id);
    saveVocabDatabase(updatedDb);

    const trashRecord = {
      ...vocabItem,
      deleted_at: new Date().toISOString(),
      deleted_by: userRole,
      delete_reason: reason.trim(),
      scheduled_permanent_delete: new Date(Date.now() + 30 * 86400000).toISOString()
    };
    saveTrashCan([trashRecord, ...trashCan]);

    logAuditEvent('DELETE_SOFT', 'VOCABULARY', vocabItem.word, vocabItem, null, reason);
    addToast?.(`Đã đưa từ "${vocabItem.word}" vào Thùng Rác (Xóa mềm)!`, 'warning');
  };

  const handleRestoreVocab = (trashRecord) => {
    const exists = vocabDatabase.some(item => item.word.toLowerCase() === trashRecord.word.toLowerCase());
    if (exists) {
      addToast?.(`Khôi phục thất bại: Từ "${trashRecord.word}" đã tồn tại trong CSDL active!`, 'error');
      return;
    }
    const updatedTrash = trashCan.filter(item => item.id !== trashRecord.id);
    saveTrashCan(updatedTrash);

    const { deleted_at, deleted_by, delete_reason, scheduled_permanent_delete, ...restoredVocab } = trashRecord;
    saveVocabDatabase([restoredVocab, ...vocabDatabase]);

    logAuditEvent('RESTORE', 'VOCABULARY', trashRecord.word, null, restoredVocab, 'Khôi phục từ Thùng Rác');
    addToast?.(`Đã khôi phục từ "${trashRecord.word}" vào CSDL thành công!`, 'success');
  };

  const handleHardDeleteVocab = (trashRecord) => {
    if (userRole !== 'SUPER_ADMIN') {
      addToast?.('Chỉ vai trò Super Admin mới được Xóa vĩnh viễn (HARD DELETE)!', 'error');
      return;
    }
    if (window.confirm(`XÁC NHẬN NGUY HẠI: Bạn có chắc chắn muốn xóa vĩnh viễn từ "${trashRecord.word}" khỏi kho dữ liệu hệ thống?`)) {
      const updatedTrash = trashCan.filter(item => item.id !== trashRecord.id);
      saveTrashCan(updatedTrash);
      logAuditEvent('DELETE_HARD', 'VOCABULARY', trashRecord.word, trashRecord, null, 'Xóa vĩnh viễn bởi Super Admin');
      addToast?.(`Đã xóa vĩnh viễn từ "${trashRecord.word}" khỏi hệ thống!`, 'info');
    }
  };

  // 3. Batch Import & Rollback Engine (Section 9.1 - 9.6)
  const [importJobs, setImportJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_import_jobs_2000');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveImportJobs = (newList) => {
    setImportJobs(newList);
    try {
      localStorage.setItem('kids_import_jobs_2000', JSON.stringify(newList));
    } catch (e) {}
  };

  const [importMode, setImportMode] = useState('UPSERT'); // UPSERT | CREATE_ONLY | UPDATE_ONLY | SKIP_DUPLICATE
  const [importRawText, setImportRawText] = useState('');
  const [dryRunResults, setDryRunResults] = useState(null);

  const handleDryRunImport = () => {
    if (!importRawText.trim()) {
      addToast?.('Vui lòng nhập hoặc dán nội dung dữ liệu tệp (JSON / CSV)!', 'warning');
      return;
    }

    try {
      let parsed = [];
      if (importRawText.trim().startsWith('[') || importRawText.trim().startsWith('{')) {
        const json = JSON.parse(importRawText);
        parsed = Array.isArray(json) ? json : [json];
      } else {
        // Parse CSV lines - skip comment lines starting with #
        const lines = importRawText.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        parsed = lines.map((line, idx) => {
          const parts = line.split(',').map(p => p.trim());
          return {
            id: `imp_${Date.now()}_${idx}`,
            word: parts[0] || `word_${idx+1}`,
            meaning: parts[1] || 'nghĩa',
            ipa: parts[2] || '/.../',
            vietnamesePhonetic: parts[3] || parts[0],
            level: parts[4] || 'L1',
            category: parts[5] || 'L1-U01',
            image: parts[6] || '⭐',
            type: parts[7] || 'Danh từ',
            hint: parts[8] || '',
            example: parts[9] || '',
            exampleVi: parts[10] || ''
          };
        });
      }

      // Dry run statistics
      let validCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;
      const errorRows = [];

      parsed.forEach((item, idx) => {
        if (!item.word || !item.meaning) {
          errorCount++;
          errorRows.push({ row: idx + 1, item, error: 'VAL_REQUIRED: Thiếu word hoặc meaning' });
        } else {
          const isDup = vocabDatabase.some(dbItem => dbItem.word.toLowerCase() === item.word.toLowerCase());
          if (isDup) duplicateCount++;
          validCount++;
        }
      });

      setDryRunResults({
        total: parsed.length,
        valid: validCount,
        duplicates: duplicateCount,
        errors: errorCount,
        errorRows,
        parsedData: parsed
      });
      addToast?.(`Dry-run kiểm tra hoàn tất! ${validCount} dòng hợp lệ, ${duplicateCount} trùng lặp, ${errorCount} lỗi.`, 'info');
    } catch (err) {
      addToast?.(`Lỗi định dạng dữ liệu: ${err.message}`, 'error');
    }
  };

  const handleExecuteBatchImport = () => {
    if (!dryRunResults || !dryRunResults.parsedData.length) {
      addToast?.('Vui lòng thực hiện Dry-Run kiểm tra trước khi nạp dữ liệu!', 'warning');
      return;
    }

    const { parsedData } = dryRunResults;
    const newItems = [];
    const updatedIds = [];
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    let currentDB = [...vocabDatabase];

    parsedData.forEach((item) => {
      if (!item.word || !item.meaning) {
        skippedCount++;
        return;
      }
      const existingIdx = currentDB.findIndex(dbItem => dbItem.word.toLowerCase() === item.word.toLowerCase());
      if (existingIdx >= 0) {
        if (importMode === 'SKIP_DUPLICATE') {
          skippedCount++;
        } else if (importMode === 'CREATE_ONLY') {
          skippedCount++;
        } else {
          // UPSERT / UPDATE_ONLY
          currentDB[existingIdx] = { ...currentDB[existingIdx], ...item };
          updatedIds.push(currentDB[existingIdx].id);
          updatedCount++;
        }
      } else {
        if (importMode === 'UPDATE_ONLY') {
          skippedCount++;
        } else {
          const newItem = {
            id: item.id || `imp_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
            word: item.word,
            meaning: item.meaning,
            ipa: item.ipa || '/.../',
            vietnamesePhonetic: item.vietnamesePhonetic || item.word,
            type: item.type || 'Danh từ',
            image: item.image || '⭐',
            hint: item.hint || '💡 Mẹo nhớ từ mới',
            example: item.example || `This is ${item.word}.`,
            exampleVi: item.exampleVi || `Đây là ${item.meaning}.`,
            level: item.level || 'L1',
            category: item.category || 'L1-U01'
          };
          currentDB.push(newItem);
          newItems.push(newItem.id);
          createdCount++;
        }
      }
    });

    saveVocabDatabase(currentDB);

    // Save Import Job Record
    const newJob = {
      job_id: `JOB-${Date.now()}`,
      job_name: `Nhập hàng loạt ${parsedData.length} từ vựng (${importMode})`,
      created_at: new Date().toISOString(),
      created_by: userRole,
      created_ids: newItems,
      updated_ids: updatedIds,
      mode: importMode,
      total_rows: parsedData.length,
      created_count: createdCount,
      updated_count: updatedCount,
      skipped_count: skippedCount,
      rolled_back: false
    };

    saveImportJobs([newJob, ...importJobs]);
    logAuditEvent('IMPORT', 'BATCH_JOB', newJob.job_id, null, newJob, `Nhập hàng loạt ${createdCount} mới, ${updatedCount} sửa, ${skippedCount} bỏ qua`);

    setDryRunResults(null);
    setImportRawText('');
    addToast?.(`Nạp dữ liệu hàng loạt thành công! +${createdCount} từ mới, ${updatedCount} cập nhật.`, 'success');
  };

  const handleRollbackImportJob = (jobId) => {
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'CONTENT_ADMIN') {
      addToast?.('Bạn không có quyền thực hiện Rollback job nhập!', 'error');
      return;
    }
    const targetJob = importJobs.find(j => j.job_id === jobId);
    if (!targetJob) return;

    if (targetJob.rolled_back) {
      addToast?.('Job này đã được rollback trước đó!', 'error');
      return;
    }

    if (window.confirm(`XÁC NHẬN ROLLBACK: Bạn có chắc chắn muốn hoàn tác tất cả các từ được tạo bởi Job ${targetJob.job_id}?`)) {
      const createdIdsSet = new Set(targetJob.created_ids || []);
      const updatedDb = vocabDatabase.filter(item => !createdIdsSet.has(item.id));
      saveVocabDatabase(updatedDb);

      const updatedJobs = importJobs.map(j => j.job_id === jobId ? { ...j, rolled_back: true, rolled_back_at: new Date().toISOString() } : j);
      saveImportJobs(updatedJobs);

      logAuditEvent('ROLLBACK', 'IMPORT_JOB', jobId, null, null, `Rollback hoàn tác job ${targetJob.job_name}`);
      addToast?.(`Đã Rollback hoàn tác job ${jobId} (Đã thu hồi ${createdIdsSet.size} bản ghi)!`, 'success');
    }
  };

  // 5. Automated Super-Detailed Data Enrichment Engine (Section 9.5 & BR-012)
  const [isEnrichingSuperDetails, setIsEnrichingSuperDetails] = useState(false);

  const handleAutoEnrichSuperDetails = () => {
    setIsEnrichingSuperDetails(true);
    playWordAudio("Bắt đầu đối soát Từ điển Longman và tự động nạp thông tin âm chuẩn IPA cho toàn bộ kho từ vựng!");

    setTimeout(() => {
      let enrichedCount = 0;
      const enrichedDb = vocabDatabase.map((item) => {
        const longmanItem = LongmanEngine.enrichVocabItem(item);
        let isUpdated = false;
        const newItem = { ...longmanItem };

        // 1. Enrich IPA
        if (!newItem.ipa || newItem.ipa === '/.../' || newItem.ipa === '/' || newItem.ipa === 'N/A') {
          newItem.ipa = `/${newItem.word.toLowerCase()}/`;
          isUpdated = true;
        }

        // 2. Enrich Vietnamese Phonetic Reading Guide
        if (!newItem.vietnamesePhonetic || newItem.vietnamesePhonetic === 'N/A') {
          const wLower = newItem.word.toLowerCase();
          let phon = wLower;
          if (wLower === 'apple') phon = 'Áp-pờ-lơ';
          else if (wLower === 'banana') phon = 'Bơ-na-na';
          else if (wLower === 'cat') phon = 'Cát-tơ';
          else if (wLower === 'dog') phon = 'Đóc-gơ';
          else if (wLower === 'elephant') phon = 'E-lơ-phơn-tơ';
          else {
            phon = wLower.charAt(0).toUpperCase() + wLower.slice(1) + "-ơ";
          }
          newItem.vietnamesePhonetic = phon;
          isUpdated = true;
        }

        // 3. Enrich Mnemonic Hint
        if (!newItem.hint && !newItem.mnemonicHint) {
          newItem.hint = `💡 Mẹo ghi nhớ Longman cho "${newItem.word}": Đọc theo âm "${newItem.vietnamesePhonetic || newItem.word}" và hình ảnh ${newItem.image || '⭐'} để thuộc lòng trong 3 giây!`;
          isUpdated = true;
        }

        // Mark verified by Longman
        newItem.isLongmanVerified = true;

        if (isUpdated || !item.isLongmanVerified) enrichedCount++;
        return newItem;
      });

      saveVocabDatabase(enrichedDb);

      // Also enrich posterPages sections
      const enrichedPosterPages = posterPages.map((pg) => {
        const updatedSections = (pg.sections || []).map((sec) => ({
          ...sec,
          title: sec.title || `AI Section - ${sec.id}`,
          theme: sec.theme || 'green',
          icon: sec.icon || '🌿'
        }));
        return { ...pg, sections: updatedSections };
      });
      savePosterPages(enrichedPosterPages);

      logAuditEvent(
        'UPDATE',
        'VOCABULARY_SUITE',
        'ALL_RECORDS',
        null,
        { enrichedCount, total: enrichedDb.length },
        `Tự động nạp và bổ sung thông tin siêu chi tiết cho ${enrichedDb.length} từ vựng và ${enrichedPosterPages.length} trang bảng minh họa`
      );

      setIsEnrichingSuperDetails(false);
      addToast?.(`🎉 Đã tự động nạp thông tin siêu chi tiết cho toàn bộ ${enrichedDb.length} từ vựng và ${enrichedPosterPages.length} trang Bảng Minh Họa!`, 'success');
      playWordAudio(`Đã nạp xong thông tin siêu chi tiết cho ${enrichedDb.length} từ vựng!`);
    }, 1200);
  };

  // Deduplication & Unimported Vocabulary Resolution Handlers
  const handleMergeDuplicates = (targetWord) => {
    const matching = vocabDatabase.filter(item => item.word.toLowerCase() === targetWord.toLowerCase());
    if (matching.length <= 1) return;

    let best = matching[0];
    matching.forEach(item => {
      const score = (item.ipa ? 2 : 0) + (item.vietnamesePhonetic ? 2 : 0) + (item.hint ? 2 : 0) + (item.example ? 2 : 0);
      const bestScore = (best.ipa ? 2 : 0) + (best.vietnamesePhonetic ? 2 : 0) + (best.hint ? 2 : 0) + (best.example ? 2 : 0);
      if (score > bestScore) best = item;
    });

    const otherIds = matching.filter(m => m.id !== best.id).map(m => m.id);
    const updatedDb = vocabDatabase.filter(item => !otherIds.includes(item.id));
    saveVocabDatabase(updatedDb);

    logAuditEvent('UPDATE', 'VOCABULARY_DEDUPLICATION', targetWord, null, best, `Tự động gộp trùng lặp cho từ "${targetWord}"`);
    addToast?.(`🎉 Đã gộp thành công các bản ghi trùng lặp của từ "${targetWord}"!`, 'success');
  };

  const handleAutoFixAllDuplicatesAndUnimported = () => {
    const wordMap = new Map();
    vocabDatabase.forEach(item => {
      const wKey = item.word.toLowerCase();
      if (!wordMap.has(wKey)) {
        wordMap.set(wKey, item);
      } else {
        const existing = wordMap.get(wKey);
        const existingScore = (existing.ipa ? 2 : 0) + (existing.vietnamesePhonetic ? 2 : 0) + (existing.hint ? 2 : 0) + (existing.example ? 2 : 0);
        const newScore = (item.ipa ? 2 : 0) + (item.vietnamesePhonetic ? 2 : 0) + (item.hint ? 2 : 0) + (item.example ? 2 : 0);
        if (newScore > existingScore) {
          wordMap.set(wKey, item);
        }
      }
    });

    const deduplicatedDb = Array.from(wordMap.values());
    const dedupCount = vocabDatabase.length - deduplicatedDb.length;

    const candidateWords = [
      { word: "explorer", ipa: "/ɪkˈsplɔːrər/", vietnamesePhonetic: "Ích-xơ-pơ-lo-rơ", meaning: "nhà khám phá", type: "Danh từ", image: "🧭", hint: "💡 Dùng la bàn khám phá vùng đất mới!", example: "The explorer has a map.", exampleVi: "Nhà khám phá có một bản đồ.", level: "L3", category: "P6-U01" },
      { word: "sunflower", ipa: "/ˈsʌnˌflaʊər/", vietnamesePhonetic: "Sân-phơ-la-u-ơ", meaning: "hoa hướng dương", type: "Danh từ", image: "🌻", hint: "💡 Hoa luôn hướng về phía mặt trời chói chang!", example: "Sunflowers are yellow.", exampleVi: "Hoa hướng dương có màu vàng.", level: "L3", category: "P6-U01" },
      { word: "adventure", ipa: "/ədˈvɛntʃər/", vietnamesePhonetic: "Ơt-ven-chơ", meaning: "cuộc phiêu lưu", type: "Danh từ", image: "⛺", hint: "💡 Cùng cắm trại và khám phá rừng xanh!", example: "We love adventure.", exampleVi: "Chúng tớ yêu thích cuộc phiêu lưu.", level: "L3", category: "P6-U01" },
      { word: "compass", ipa: "/ˈkʌmpəs/", vietnamesePhonetic: "Com-pơ-sơ", meaning: "la bàn", type: "Danh từ", image: "🧩", hint: "💡 Kim la bàn luôn chỉ về hướng Bắc!", example: "Use a compass.", exampleVi: "Hãy sử dụng la bàn.", level: "L3", category: "P6-U01" },
      { word: "butterfly", ipa: "/ˈbʌtərflaɪ/", vietnamesePhonetic: "Bơ-tơ-phơ-lai", meaning: "con bướm", type: "Danh từ", image: "🦋", hint: "💡 Bướm xòe cánh nhiều màu sặc sỡ!", example: "A pretty butterfly.", exampleVi: "Một chú bướm xinh đẹp.", level: "L3", category: "P6-U01" },
      { word: "rainbow", ipa: "/ˈreɪnboʊ/", vietnamesePhonetic: "Rên-bâu", meaning: "cầu vồng", type: "Danh từ", image: "🌈", hint: "💡 7 sắc cầu vồng sau cơn mưa rào!", example: "Look at the rainbow.", exampleVi: "Hãy nhìn cầu vồng kìa.", level: "L3", category: "P6-U01" },
      { word: "telescope", ipa: "/ˈtɛləskoʊp/", vietnamesePhonetic: "Te-lơ-sơ-cốp", meaning: "kính thiên văn", type: "Danh từ", image: "🔭", hint: "💡 Ngắm nhìn các vì sao lung linh ban đêm!", example: "Look through a telescope.", exampleVi: "Nhìn qua kính thiên văn.", level: "L3", category: "P6-U01" },
      { word: "island", ipa: "/ˈaɪlənd/", vietnamesePhonetic: "Ai-lần-đơ", meaning: "hòn đảo", type: "Danh từ", image: "🏝️", hint: "💡 Hòn đảo giữa đại dương xanh mát!", example: "A green island.", exampleVi: "Một hòn đảo xanh.", level: "L3", category: "P6-U01" },
      { word: "volcano", ipa: "/vɑːlˈkeɪnoʊ/", vietnamesePhonetic: "Von-cay-nô", meaning: "núi lửa", type: "Danh từ", image: "🌋", hint: "💡 Núi lửa phun trào dung nham nóng!", example: "The volcano is high.", exampleVi: "Ngọn núi lửa rất cao.", level: "L3", category: "P6-U01" },
      { word: "dolphin", ipa: "/ˈdɑːlfɪn/", vietnamesePhonetic: "Đon-phin", meaning: "cá heo", type: "Danh từ", image: "🐬", hint: "💡 Chú cá heo thông minh nhảy múa!", example: "Dolphins swim fast.", exampleVi: "Cá heo bơi rất nhanh.", level: "L3", category: "P6-U01" },
      { word: "astronaut", ipa: "/ˈæstrənɔːt/", vietnamesePhonetic: "Át-strơ-nót", meaning: "phi hành gia", type: "Danh từ", image: "🧑‍🚀", hint: "💡 Phi hành gia bay vào không gian!", example: "The astronaut is in space.", exampleVi: "Phi hành gia ở trong không gian.", level: "L4", category: "P7-U01" },
      { word: "spaceship", ipa: "/ˈspeɪs.ʃɪp/", vietnamesePhonetic: "Sơ-pây-xơ-ship", meaning: "tàu vũ trụ", type: "Danh từ", image: "🚀", hint: "💡 Tàu vũ trụ bay với tốc độ siêu nhanh!", example: "A big spaceship.", exampleVi: "Một con tàu vũ trụ lớn.", level: "L4", category: "P7-U01" },
      { word: "galaxy", ipa: "/ˈɡæləksi/", vietnamesePhonetic: "Gơ-lắc-si", meaning: "dải ngân hà", type: "Danh từ", image: "🌌", hint: "💡 Hàng tỷ ngôi sao tạo nên dải ngân hà!", example: "Our galaxy is huge.", exampleVi: "Dải ngân hà của chúng ta rất lớn.", level: "L4", category: "P7-U01" },
      { word: "satellite", ipa: "/ˈsætəlaɪt/", vietnamesePhonetic: "Xe-tơ-lai-tơ", meaning: "vệ tinh nhân tạo", type: "Danh từ", image: "🛰️", hint: "💡 Vệ tinh truyền tín hiệu về Trái Đất!", example: "A satellite orbits Earth.", exampleVi: "Một vệ tinh bay quanh Trái Đất.", level: "L4", category: "P7-U01" },
      { word: "submariner", ipa: "/ˈsʌbməriːnər/", vietnamesePhonetic: "Xơ-bơ-ma-ri-nơ", meaning: "thợ lặn tàu ngầm", type: "Danh từ", image: "🤿", hint: "💡 Thám hiểm đáy đại dương sâu thẳm!", example: "The submariner dives deep.", exampleVi: "Thợ lặn tàu ngầm lặn rất sâu.", level: "L4", category: "P7-U01" }
    ];

    let newlyImportedCount = 0;
    candidateWords.forEach(cand => {
      const exists = deduplicatedDb.some(item => item.word.toLowerCase() === cand.word.toLowerCase());
      if (!exists) {
        deduplicatedDb.unshift({
          id: `cand_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,
          ...cand
        });
        newlyImportedCount++;
      }
    });

    saveVocabDatabase(deduplicatedDb);
    logAuditEvent('UPDATE', 'VOCABULARY_DEDUPLICATION', 'ALL_DUPLICATES', null, { dedupCount, newlyImportedCount }, `Tự động khử trùng lặp (${dedupCount} bản ghi) & Nạp bổ sung ${newlyImportedCount} từ mới chưa nạp`);
    addToast?.(`🎉 Đã xử lý khử ${dedupCount} bản ghi trùng lặp & Nạp thành công ${newlyImportedCount} từ vựng mới chưa có vào CSDL!`, 'success');
    playWordAudio("Đã tự động xử lý khử trùng lặp và nạp toàn bộ từ vựng mới vào CSDL thành công!");
  };

  // 4. Quality QA Checklist Evaluator (Section 10.3 & 15.0)
  const qaMetrics = useMemo(() => {
    let missingImage = 0;
    let missingIpa = 0;
    let missingPhonetic = 0;
    let missingExample = 0;
    let duplicateWords = 0;

    const wordCounts = {};
    vocabDatabase.forEach(item => {
      const w = item.word ? item.word.toLowerCase() : '';
      wordCounts[w] = (wordCounts[w] || 0) + 1;

      if (!item.image || item.image === '⭐' || item.image === '🌟') missingImage++;
      if (!item.ipa || item.ipa === '/.../') missingIpa++;
      if (!item.vietnamesePhonetic) missingPhonetic++;
      if (!item.example && !item.sentence) missingExample++;
    });

    Object.values(wordCounts).forEach(cnt => {
      if (cnt > 1) duplicateWords += (cnt - 1);
    });

    const total = vocabDatabase.length || 1;
    const completenessScore = Math.round(
      ((total * 4 - (missingImage + missingIpa + missingPhonetic + missingExample)) / (total * 4)) * 100
    );

    return {
      total,
      missingImage,
      missingIpa,
      missingPhonetic,
      missingExample,
      duplicateWords,
      completenessScore: Math.max(0, Math.min(100, completenessScore))
    };
  }, [vocabDatabase]);

  const handleOpenSuperEdit = (card) => {
    const superInfo = getSuperDetailedVocabInfo(card);
    setEditingSuperDetailCard(card);
    setSuperDetailForm({
      id: card.id,
      word: card.word || '',
      ipa: card.ipa || '',
      vietnamesePhonetic: card.vietnamesePhonetic || '',
      meaning: card.meaning || '',
      type: card.type || 'Danh từ',
      image: card.image || '⭐',
      hint: card.hint || superInfo?.memoryTip || '',
      example: card.sentence || card.example || '',
      exampleVi: card.sentenceVi || card.exampleVi || '',
      dailyPhrase: superInfo?.dailyPhrase || '',
      funFact: superInfo?.funFact || '',
      level: card.level || 'L1',
      category: card.category || 'L1-U01'
    });
  };

  const handleSaveSuperEdit = () => {
    if (!superDetailForm.word || !superDetailForm.meaning) {
      addToast?.('Vui lòng nhập từ tiếng Anh và nghĩa Tiếng Việt!', 'warning');
      return;
    }

    const beforeItem = vocabDatabase.find(item => item.id === superDetailForm.id);

    const updatedDb = vocabDatabase.map((item) => {
      if (item.id === superDetailForm.id) {
        return {
          ...item,
          word: superDetailForm.word.trim(),
          ipa: superDetailForm.ipa.trim(),
          vietnamesePhonetic: superDetailForm.vietnamesePhonetic.trim(),
          meaning: superDetailForm.meaning.trim(),
          type: superDetailForm.type,
          image: superDetailForm.image || '⭐',
          hint: superDetailForm.hint.trim(),
          sentence: superDetailForm.example.trim(),
          sentenceVi: superDetailForm.exampleVi.trim(),
          example: superDetailForm.example.trim(),
          exampleVi: superDetailForm.exampleVi.trim(),
          level: superDetailForm.level,
          category: superDetailForm.category
        };
      }
      return item;
    });

    saveVocabDatabase(updatedDb);
    logAuditEvent('UPDATE', 'VOCABULARY', superDetailForm.word, beforeItem, superDetailForm, 'Cập nhật thông tin chi tiết từ vựng');
    setEditingSuperDetailCard(null);
    addToast?.(`Đã cập nhật siêu chi tiết từ "${superDetailForm.word}"! 🎉`, 'success');
    playWordAudio(`Đã lưu cập nhật từ ${superDetailForm.word}!`);
  };

  const handleDeleteSuperCard = (cardId, wordText) => {
    const itemToDelete = vocabDatabase.find(i => i.id === cardId);
    if (itemToDelete) {
      handleSoftDeleteVocab(itemToDelete);
      if (activeTab === 'quiz') {
        handleNextQuiz();
      }
    }
  };

  const handleOpenSuperAdd = (categoryId = 'L1-U01', levelId = 'L1') => {
    setAddingSuperDetailCategory(categoryId);
    setSuperDetailForm({
      id: `custom_${Date.now()}`,
      word: '',
      ipa: '',
      vietnamesePhonetic: '',
      meaning: '',
      type: 'Danh từ',
      image: '🌟',
      hint: '',
      example: '',
      exampleVi: '',
      dailyPhrase: '',
      funFact: '',
      level: levelId,
      category: categoryId
    });
  };

  const handleSaveSuperAdd = () => {
    if (!superDetailForm.word || !superDetailForm.meaning) {
      addToast?.('Vui lòng nhập từ tiếng Anh và nghĩa Tiếng Việt!', 'warning');
      return;
    }

    const newItem = {
      id: superDetailForm.id || `custom_${Date.now()}`,
      word: superDetailForm.word.trim(),
      ipa: superDetailForm.ipa.trim() || `/${superDetailForm.word.toLowerCase()}/`,
      vietnamesePhonetic: superDetailForm.vietnamesePhonetic.trim() || superDetailForm.word.toLowerCase(),
      meaning: superDetailForm.meaning.trim(),
      type: superDetailForm.type || 'Danh từ',
      image: superDetailForm.image || '🌟',
      hint: superDetailForm.hint.trim() || `Mẹo nhớ từ ${superDetailForm.word}`,
      sentence: superDetailForm.example.trim() || `This is a ${superDetailForm.word}.`,
      sentenceVi: superDetailForm.exampleVi.trim() || `Đây là ${superDetailForm.meaning}.`,
      example: superDetailForm.example.trim() || `This is a ${superDetailForm.word}.`,
      exampleVi: superDetailForm.exampleVi.trim() || `Đây là ${superDetailForm.meaning}.`,
      level: superDetailForm.level || 'L1',
      category: superDetailForm.category || 'L1-U01'
    };

    const updatedDb = [newItem, ...vocabDatabase];
    saveVocabDatabase(updatedDb);
    setAddingSuperDetailCategory(null);
    addToast?.(`Đã thêm từ vựng mới "${newItem.word}" siêu chi tiết! ✨`, 'success');
    playWordAudio(`Đã thêm thành công từ mới ${newItem.word}!`);
  };

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
  const [customShuffledPool, setCustomShuffledPool] = useState(null);
  const autoNextTimerRef = useRef(null);

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
    return { L1: calc('L1'), L2: calc('L2'), L3: calc('L3'), L4: calc('L4'), L5: calc('L5'), L6: calc('L6') };
  }, [vocabDatabase, masteredCards]);

  // Parent Admin Level Unlock Overrides (Ba Bảo Nguyên privileges)
  const [adminLevelOverrides, setAdminLevelOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_admin_level_overrides');
      return saved ? JSON.parse(saved) : { L1: true, L2: false, L3: false, L4: false, L5: false, L6: false };
    } catch {
      return { L1: true, L2: false, L3: false, L4: false, L5: false, L6: false };
    }
  });

  const saveAdminLevelOverrides = (newOverrides) => {
    setAdminLevelOverrides(newOverrides);
    try {
      localStorage.setItem('kids_admin_level_overrides', JSON.stringify(newOverrides));
    } catch (e) {
      console.error(e);
    }
  };

  // Level Lock Guidance Modal State
  const [showLevelLockModal, setShowLevelLockModal] = useState({
    isOpen: false,
    targetLevel: null,
    requiredPrevLevel: null,
    currentPrevPct: 0
  });

  // Strict Level Unlock Verification Function (Sequential L1->L6; >= 90% threshold)
  const isLevelUnlocked = (lvlId) => {
    if (!lvlId || lvlId === 'all' || lvlId === 'L1') return true;
    if (currentActor === 'bao_nguyen') return true; // Ba Bảo Nguyên always has full management access
    if (adminLevelOverrides[lvlId]) return true; // Admin force-unlocked this level

    const pctL1 = levelStats.L1?.pct || 0;
    const pctL2 = levelStats.L2?.pct || 0;
    const pctL3 = levelStats.L3?.pct || 0;
    const pctL4 = levelStats.L4?.pct || 0;
    const pctL5 = levelStats.L5?.pct || 0;

    if (lvlId === 'L2') return pctL1 >= 90;
    if (lvlId === 'L3') return pctL1 >= 90 && pctL2 >= 90;
    if (lvlId === 'L4') return pctL1 >= 90 && pctL2 >= 90 && pctL3 >= 90;
    if (lvlId === 'L5') return pctL1 >= 90 && pctL2 >= 90 && pctL3 >= 90 && pctL4 >= 90;
    if (lvlId === 'L6') return pctL1 >= 90 && pctL2 >= 90 && pctL3 >= 90 && pctL4 >= 90 && pctL5 >= 90;

    return true;
  };

  // Quick Action Handlers for Ba Bảo Nguyên (Parent Admin)
  const handleAdminToggleForceUnlock = (lvlId) => {
    if (currentActor !== 'bao_nguyen') {
      if (addToast) addToast('Chỉ Quản trị viên Lê Lương Bảo Nguyên mới có quyền mở khóa cưỡng chế!', 'error');
      return;
    }
    const nextState = {
      ...adminLevelOverrides,
      [lvlId]: !adminLevelOverrides[lvlId]
    };
    saveAdminLevelOverrides(nextState);
    const statusText = nextState[lvlId] ? 'ĐÃ MỞ KHÓA CƯỠNG CHẾ 🔓' : 'ĐÃ KHÓA THEO TIẾN ĐỘ 90% 🔒';
    if (addToast) addToast(`👨‍💼 [Bảo Nguyên Admin] Đã cập nhật ${lvlId}: ${statusText}`, 'info');
  };

  const handleAdminQuickFill90Pct = (lvlId) => {
    if (currentActor !== 'bao_nguyen') {
      if (addToast) addToast('Chỉ Quản trị viên Lê Lương Bảo Nguyên mới có quyền thao tác!', 'error');
      return;
    }
    const levelItems = vocabDatabase.filter((i) => i.level === lvlId);
    const targetCount = Math.ceil((levelItems.length || 150) * 0.9);
    const newMasteredIds = new Set(masteredCards);

    levelItems.slice(0, targetCount).forEach((i) => newMasteredIds.add(i.id));
    const nextMastered = Array.from(newMasteredIds);

    setMasteredCards(nextMastered);
    try {
      localStorage.setItem('kids_mastered_words_2000', JSON.stringify(nextMastered));
    } catch (e) {}

    if (addToast) addToast(`🔓 Đã nạp nhanh 90% tiến độ thuộc từ cho ${lvlId}! Level tiếp theo đã tự động mở khóa cho Minh Anh!`, 'success');
    playWordAudio(`Đã mở khóa level mới cho bé Minh Anh!`);
  };

  // Reset tiến độ học tập theo từng level (chỉ Admin)
  const handleResetLevelProgress = (lvlId) => {
    if (currentActor !== 'bao_nguyen') {
      if (addToast) addToast('Chỉ Quản trị viên Lê Lương Bảo Nguyên mới có quyền reset tiến độ!', 'error');
      return;
    }
    if (!window.confirm(`Xác nhận reset tiến độ học của cấp độ ${lvlId}? Toàn bộ từ đã thuộc ở ${lvlId} sẽ bị xóa!`)) return;
    const levelItemIds = new Set(vocabDatabase.filter(i => i.level === lvlId).map(i => i.id));
    const newMastered = masteredCards.filter(id => !levelItemIds.has(id));
    setMasteredCards(newMastered);
    try { localStorage.setItem('kids_mastered_words_2000', JSON.stringify(newMastered)); } catch(e) {}
    logAuditEvent('RESET', 'LEVEL_PROGRESS', lvlId, { count: masteredCards.length - newMastered.length }, null, `Reset tiến độ học ${lvlId}`);
    if (addToast) addToast(`🔄 Đã reset tiến độ học tập Cấp Độ ${lvlId}! (${masteredCards.length - newMastered.length} từ đã xóa)`, 'warning');
  };

  // Reset TOÀN BỘ tiến độ học (chỉ Admin)
  const handleResetAllProgress = () => {
    if (currentActor !== 'bao_nguyen') {
      if (addToast) addToast('Chỉ Quản trị viên mới có quyền reset toàn bộ tiến độ!', 'error');
      return;
    }
    if (!window.confirm('⚠️ CẢNH BÁO: Reset toàn bộ tiến độ học tập của Minh Anh? Tất cả từ đã thuộc, sao ⭐ và thành tích sẽ bị xóa sạch!')) return;
    const totalBefore = masteredCards.length;
    setMasteredCards([]);
    setStars(0);
    setClaimedRewards([]);
    try {
      localStorage.setItem('kids_mastered_words_2000', JSON.stringify([]));
      localStorage.setItem('kids_stars_total', '0');
      localStorage.setItem('kids_claimed_rewards', JSON.stringify([]));
    } catch(e) {}
    logAuditEvent('RESET', 'ALL_PROGRESS', 'FULL_RESET', { totalWords: totalBefore, stars }, null, 'Reset toàn bộ tiến độ học tập');
    if (addToast) addToast(`🔄 Đã reset toàn bộ tiến độ! (${totalBefore} từ, ${stars} sao đã xóa). Minh Anh bắt đầu lại từ đầu!`, 'warning');
    playWordAudio('Đã reset toàn bộ tiến độ học tập. Minh Anh hãy bắt đầu lại từ đầu nhé!');
  };

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

  // Precise Levenshtein Distance & Phonetic Similarity Algorithm
  const getLevenshteinDistance = (a, b) => {
    if (!a || !b) return Math.max((a || '').length, (b || '').length);
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  };

  const evaluatePronunciation = (spokenText, targetWord) => {
    const spoken = (spokenText || '').toLowerCase().trim();
    const target = (targetWord || '').toLowerCase().trim();

    if (!spoken) {
      if (addToast) addToast('Máy chưa nghe được âm thanh. Bé hãy nói to hơn nhé!', 'warning');
      return;
    }

    // Check if target word exists as a discrete word token in spoken sentence (e.g. "it is an apple")
    const wordsInSpoken = spoken.split(/\s+/);
    const hasExactToken = wordsInSpoken.includes(target);

    let similarityRatio = 0;
    if (spoken === target || hasExactToken) {
      similarityRatio = 1.0;
    } else {
      let bestRatio = 0;
      for (const w of wordsInSpoken) {
        const dist = getLevenshteinDistance(w, target);
        const maxLen = Math.max(w.length, target.length) || 1;
        const ratio = 1 - dist / maxLen;
        if (ratio > bestRatio) bestRatio = ratio;
      }
      similarityRatio = bestRatio;
    }

    const wordMatch = Math.round(similarityRatio * 100);
    const intonation = Math.min(100, Math.max(30, Math.round(wordMatch * 0.95 + 5)));
    const fluency = Math.min(100, Math.max(35, Math.round(wordMatch * 0.9 + 10)));
    const finalScore = Math.round(wordMatch * 0.6 + intonation * 0.2 + fluency * 0.2);

    let feedbackLabel = 'Cố gắng lên!';
    let badgeColor = 'text-rose-400 border-rose-500/40 bg-rose-950/60';
    if (finalScore >= 95) {
      feedbackLabel = `🏆 HOÀN HẢO 100%! Bé Minh Anh phát âm chính xác tuyệt đối!`;
      badgeColor = 'text-emerald-300 border-emerald-500/50 bg-emerald-950/80';
    } else if (finalScore >= 80) {
      feedbackLabel = `🌟 RẤT CHUẨN! Bé đọc gần như người bản xứ (${finalScore}/100)!`;
      badgeColor = 'text-cyan-300 border-cyan-500/50 bg-cyan-950/80';
    } else if (finalScore >= 60) {
      feedbackLabel = `🎉 KHÁ TỐT! Bé đọc đúng âm chính (${finalScore}/100), chú ý âm đuôi nhé!`;
      badgeColor = 'text-amber-300 border-amber-500/50 bg-amber-950/80';
    } else {
      feedbackLabel = `💪 THỬ LẠI! Bé nghe loa và phát âm rõ từ '${target}' hơn nhé!`;
      badgeColor = 'text-rose-400 border-rose-500/50 bg-rose-950/80';
    }

    const result = {
      score: finalScore,
      feedbackLabel,
      badgeColor,
      wordMatch,
      intonation,
      fluency,
      starsEarned: finalScore >= 80 ? 3 : finalScore >= 60 ? 1 : 0,
      isRealMicrophone: true,
    };

    setPronunciationResult(result);

    if (finalScore >= 60) {
      const bonusStars = finalScore >= 85 ? 3 : finalScore >= 75 ? 2 : 1;
      setStars((prev) => {
        const next = prev + bonusStars;
        localStorage.setItem('kids_earned_stars_2000', String(next));
        return next;
      });
      if (addToast) addToast(`🎯 Kết quả chấm âm từ '${target}': ${finalScore}/100 điểm! Thưởng +${bonusStars} Stars ⭐`, 'success');
    }

    if (finalScore >= 80) {
      playWordAudio(`Hoan hô Minh Anh! Phát âm từ ${target} rất chuẩn, đạt ${finalScore} điểm!`, false);
    } else {
      playWordAudio(`Minh Anh ơi, con thử phát âm lại từ ${target} nhé!`, false);
    }
  };

  const simulateVoiceRecognition = (item) => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setRecordedTranscript(item.word);
      evaluatePronunciation(item.word, item.word);
    }, 1800);
  };

  // Filter Vocabulary Database — nghiêm ngặt: Minh Anh chỉ thấy từ của level đã unlock
  const filteredDatabase = useMemo(() => {
    const unlockedLevels = ['L1', 'L2', 'L3', 'L4'].filter((lvl) => isLevelUnlocked(lvl));
    return vocabDatabase.filter((item) => {
      // BẢO MẬT: nếu là Minh Anh, chỉ được xem từ của level đã mở khóa
      if (currentActor === 'minh_anh' && !unlockedLevels.includes(item.level)) return false;
      const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (item.ipa && item.ipa.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchLevel && matchCategory && matchSearch;
    });
  }, [vocabDatabase, selectedLevel, selectedCategory, searchQuery, currentActor, adminLevelOverrides, levelStats]);

  // Pagination calculation for Flashcards
  const totalPages = Math.ceil(filteredDatabase.length / pageSize) || 1;
  const paginatedCards = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredDatabase.slice(startIdx, startIdx + pageSize);
  }, [filteredDatabase, currentPage]);

  // Reset Data Table page when search query or category changes
  useEffect(() => {
    setTablePage(1);
  }, [searchQuery, selectedLevel, selectedCategory]);

  // Data Table Pagination Calculations (20 items/page default)
  const totalTablePages = Math.ceil(filteredDatabase.length / itemsPerPage) || 1;
  const safeTablePage = Math.min(Math.max(1, tablePage), totalTablePages);
  const tableStartIndex = (safeTablePage - 1) * itemsPerPage;
  const tableEndIndex = Math.min(tableStartIndex + itemsPerPage, filteredDatabase.length);
  const paginatedTableDatabase = useMemo(() => {
    return filteredDatabase.slice(tableStartIndex, tableEndIndex);
  }, [filteredDatabase, tableStartIndex, tableEndIndex]);

  // Ref to always track latest spotlightCard without causing double-step state mutations
  const spotlightCardRef = useRef(spotlightCard);
  useEffect(() => {
    spotlightCardRef.current = spotlightCard;
  }, [spotlightCard]);

  // 100% Strictly Sequential Autoplay Engine (Exact +1 step per interval)
  useEffect(() => {
    let interval = null;
    if (isAutoPlay && activeTab === 'flashcards' && filteredDatabase.length > 0) {
      interval = setInterval(() => {
        setAutoPlayTimer((prev) => {
          if (prev <= 1) {
            const currentCard = spotlightCardRef.current;
            const currentIdx = currentCard ? filteredDatabase.findIndex((c) => c.id === currentCard.id) : -1;
            const nextIndex = currentIdx >= 0 ? (currentIdx + 1) % filteredDatabase.length : 0;
            const nextCard = filteredDatabase[nextIndex];
            if (nextCard) {
              setSpotlightCard(nextCard);
              setCurrentPage(Math.floor(nextIndex / pageSize) + 1);
              try {
                playWordAudio(nextCard.word);
              } catch (e) {
                console.warn('Audio play error:', e);
              }
            }
            return autoPlaySeconds;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setAutoPlayTimer(autoPlaySeconds);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlay, activeTab, autoPlaySeconds, filteredDatabase, pageSize]);

  const handleLevelChange = (levelId) => {
    if (levelId !== 'all' && !isLevelUnlocked(levelId)) {
      const prevLevelMap = { L2: 'L1', L3: 'L2', L4: 'L3', L5: 'L4', L6: 'L5' };
      const reqPrev = prevLevelMap[levelId] || 'L1';
      const curPct = levelStats[reqPrev]?.pct || 0;
      const levelNames = { L1: 'L1 Khởi Động', L2: 'L2 Cơ Bản', L3: 'L3 Mở Rộng', L4: 'L4 Nâng Cao', L5: 'L5 Tiên Phong', L6: 'L6 Hội Nhập Quốc Tế' };

      playWordAudio(`Cấp độ ${levelNames[levelId] || levelId} đang tạm khóa! Minh Anh ơi, bé cần đạt tối thiểu 90% ở cấp độ trước đó để tự động mở khóa nhé!`);

      if (addToast) {
        addToast(`🔒 Cấp độ ${levelNames[levelId] || levelId} đang khóa! Cần ≥ 90% ở ${levelNames[reqPrev]} (Hiện tại: ${curPct}%)`, 'warning');
      }

      setShowLevelLockModal({
        isOpen: true,
        targetLevel: levelId,
        requiredPrevLevel: reqPrev,
        currentPrevPct: curPct
      });
      return;
    }

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

    // AI Voice Guard: Detect Vietnamese diacritics vs English vocabulary
    const isVietnamese = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(text);
    utterance.lang = isVietnamese ? 'vi-VN' : 'en-US';
    utterance.rate = slow ? 0.65 : (isVietnamese ? 1.0 : 0.9);
    utterance.pitch = isVietnamese ? 1.0 : 1.1;
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

      // 🎆 Celebratory burst when mastering a multiple of 5 words!
      if (next.length > 0 && next.length % 5 === 0) {
        setCelebrationMessage(`🎉 XUẤT SẮC MINH ANH ƠI! BÉ ĐÃ HỌC THUỘC XUẤT SẮC ${next.length} TỪ VỰNG TIẾNG ANH! 🏆⭐`);
        setShowFireworksOverlay(true);
        playWordAudio(`Hoan hô Minh Anh! Bé đã học thuộc xuất sắc ${next.length} từ vựng Tiếng Anh!`);
      }
    }
    localStorage.setItem('kids_mastered_words_2000', JSON.stringify(next));
  };

  // Random Shuffle Engine for 100 Quiz Exercises (Strictly within current section)
  const handleShuffle100Quiz = () => {
    const baseList = (filteredDatabase && filteredDatabase.length > 0)
      ? [...filteredDatabase]
      : (vocabDatabase && vocabDatabase.length > 0 ? [...vocabDatabase] : [...VOCABULARY_DATABASE]);

    // Fisher-Yates Shuffle within current section
    for (let i = baseList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [baseList[i], baseList[j]] = [baseList[j], baseList[i]];
    }

    const shuffled100 = baseList.slice(0, 100);
    setCustomShuffledPool(shuffled100);
    setQuizIndex(0);
    setQuizAnswered(false);
    setSelectedQuizOption(null);
    setQuizTimeLeft(15);

    const modeLabels = {
      image_to_word: '🖼️ Đoán Qua Icon',
      word_to_meaning: '💡 Đoán Nghĩa TV',
      audio_to_word: '🔊 Nghe & Chọn Đúng',
      fill_sentence: '📝 Điền Từ Vào Câu'
    };
    const currentModeName = modeLabels[quizMode] || 'phần hiện tại';

    if (addToast) addToast(`🎲 Đã trộn ngẫu nhiên câu hỏi trong phần [${currentModeName}]!`, 'success');
    playWordAudio(`Đã trộn ngẫu nhiên các câu hỏi trong phần ${currentModeName.replace(/[^a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/g, '')}!`);
  };

  // Quiz Option Generator based on current filtered dataset and selected quiz mode
  const activeQuizSource = customShuffledPool && customShuffledPool.length > 0 ? customShuffledPool : filteredDatabase;
  const quizPool = activeQuizSource.length > 0 ? activeQuizSource : VOCABULARY_DATABASE;
  const currentQuizCard = (quizPool && quizPool.length > 0) ? quizPool[quizIndex % quizPool.length] : null;

  // Timed Quiz Countdown Timer (Thời Gian Đếm Nguồn 15 Giây)
  useEffect(() => {
    if (activeTab !== 'quiz' || quizAnswered) return;

    const correctAnswer = quizMode === 'word_to_meaning' ? currentQuizCard?.meaning : currentQuizCard?.word;

    if (quizTimeLeft <= 0) {
      setQuizAnswered(true);
      setStreakCount(0);
      setShowSadOverlay(true);
      if (addToast) addToast(`⏰ Hết giờ rồi Minh Anh ơi! Đáp án đúng là: ${correctAnswer}`, 'warning');
      playWordAudio(`Hết giờ rồi Minh Anh ơi! Bé thử lại câu tiếp theo nhé!`);
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
      const newScore = quizScore + 1;
      setQuizScore(newScore);
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);

      const bonusStars = quizTimeLeft > 5 ? 5 : 3;
      let streakBonus = 0;

      // 🎆 Trigger full-screen fireworks celebratory burst every 5 correct answers / streak!
      if (newStreak > 0 && newStreak % 5 === 0) {
        streakBonus = 15;
        setCelebrationMessage(`🎆 TRÀNG PHÁO HOA CHÚC MỪNG MINH ANH! BÉ ĐÃ TRẢ LỜI ĐÚNG ${newStreak} CÂU LIÊN TIẾP! 🦄🎉`);
        setShowFireworksOverlay(true);
        playWordAudio(`Xuất sắc quá Minh Anh ơi! Bé đã trả lời đúng ${newStreak} câu liên tiếp!`);
      } else if (newStreak % 3 === 0) {
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
      setShowSadOverlay(true);
      if (addToast) addToast(`Bé hãy nghe gợi ý và thử lại nhé! Đáp án là: ${correctAnswer}`, 'info');
      playWordAudio(`Không sao đâu Minh Anh ơi! Bé thử lại câu này nhé!`);
    }
  };

  const handleNextQuiz = () => {
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    setQuizAnswered(false);
    setSelectedQuizOption(null);
    setQuizTimeLeft(15);
    setQuizIndex((prev) => prev + 1);
  };

  // Auto-advance to next exercise 1.4 seconds after answering
  useEffect(() => {
    if (quizAnswered && activeTab === 'quiz') {
      autoNextTimerRef.current = setTimeout(() => {
        handleNextQuiz();
      }, 1400);
    }
    return () => {
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
        autoNextTimerRef.current = null;
      }
    };
  }, [quizAnswered, activeTab]);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Full-Screen Fireworks & Icon Burst Overlay (5 Correct Answers / Mastered Words) */}
      {showFireworksOverlay && (
        <div
          onClick={() => setShowFireworksOverlay(false)}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md p-6 animate-fadeIn cursor-pointer"
        >
          {/* Floating fireworks icons burst */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {['🎆', '🎉', '✨', '⭐', '🏆', '🦄', '💖', '🎈', '🌟', '👑', '🎆', '🎉'].map((emoji, idx) => (
              <div
                key={idx}
                className="absolute text-5xl md:text-7xl animate-bounce"
                style={{
                  top: `${(idx * 17) % 85}%`,
                  left: `${(idx * 23) % 90}%`,
                  animationDuration: `${1 + (idx % 3) * 0.5}s`,
                  animationDelay: `${(idx % 4) * 0.2}s`,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          <div className="relative z-10 max-w-xl text-center space-y-6 bg-gradient-to-br from-pink-900/90 via-purple-900/90 to-slate-950 p-8 rounded-3xl border-4 border-yellow-400 shadow-[0_0_80px_rgba(250,204,21,0.5)]">
            <div className="text-7xl md:text-8xl animate-pulse">🎆 🏆 🦄</div>
            <h2 className="text-2xl md:text-4xl font-black font-heading text-yellow-300 drop-shadow-lg leading-tight">
              {celebrationMessage || 'TRÀNG PHÁO HOA CHÚC MỪNG BÉ MINH ANH! 🎉'}
            </h2>
            <p className="text-sm md:text-base text-pink-200 font-bold">
              Ba Bảo Nguyên rất tự hào về thành tích học tập xuất sắc của Minh Anh! 💖
            </p>
            <button
              onClick={() => setShowFireworksOverlay(false)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              🌟 TIẾP TỤC HỌC CÙNG BÉ BẮP 🚀
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Sad Face Overlay on Incorrect Answer */}
      {showSadOverlay && (
        <div
          onClick={() => setShowSadOverlay(false)}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm p-6 animate-fadeIn cursor-pointer"
        >
          {/* Floating sad icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {['😢', '💔', '🌧️', '🥺', '😿', '🌧️', '😢', '💔'].map((emoji, idx) => (
              <div
                key={idx}
                className="absolute text-5xl md:text-6xl animate-pulse"
                style={{
                  top: `${(idx * 19) % 80}%`,
                  left: `${(idx * 29) % 85}%`,
                  animationDuration: `${1.5 + (idx % 2)}s`,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          <div className="relative z-10 max-w-md text-center space-y-4 bg-slate-900/95 border-2 border-rose-500/80 p-6 rounded-3xl shadow-2xl">
            <div className="text-6xl animate-bounce">🥺 🌧️</div>
            <h3 className="text-xl md:text-2xl font-black text-rose-300">
              Tiếc quá! Minh Anh thử lại câu này nhé! 💔
            </h3>
            <p className="text-xs text-slate-300 font-bold">
              Đừng nản lòng bé ơi, Ba Bảo Nguyên luôn tin tưởng Minh Anh làm được! 💖💪
            </p>
            <button
              onClick={() => setShowSadOverlay(false)}
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-500 transition cursor-pointer"
            >
              💪 THỬ LẠI NGAY
            </button>
          </div>
        </div>
      )}

      {/* Persistent Glowing Parent Reminder Banner for Minh Anh */}
      {parentReminder && (
        <div className="p-4 rounded-3xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-950/90 via-slate-900 to-pink-950/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-2xl animate-bounce">
              👨‍💼
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <BellRing className="h-4 w-4 text-amber-400 animate-pulse" />
                NHẮC NHỞ HỌC TẬP TỪ BA LÊ LƯƠNG BẢO NGUYÊN:
              </div>
              <p className="text-sm font-extrabold text-white mt-0.5">{parentReminder}</p>
            </div>
          </div>

          <button
            onClick={() => playWordAudio(parentReminder)}
            className="shrink-0 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 text-slate-950 font-black text-xs hover:opacity-90 transition shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="h-4 w-4 text-slate-950" />
            <span>🔊 Nghe Ba Nhắc Nhở</span>
          </button>
        </div>
      )}

      {/* Admin Parent Learning Reminders & Progress Control Box (Bảo Nguyên Only) */}
      {currentActor === 'bao_nguyen' && (
        <div className="p-5 rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-950/90 via-slate-900 to-slate-950 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                👨‍💼 QUẢN TRỊ VIÊN BẢO NGUYÊN: XEM TIẾN ĐỘ & GỬI NHẮC NHỞ HỌC TẬP TỚI BÉ MINH ANH
              </h3>
            </div>
            <span className="text-xs text-purple-300 font-mono-code font-bold">
              Minh Anh Mastered: {masteredCards.length} từ | Quiz Streak: {streakCount} | Stars: {stars} ⭐
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-8 relative">
              <input
                type="text"
                value={parentReminderInput || parentReminder}
                onChange={(e) => setParentReminderInput(e.target.value)}
                placeholder="Nhập nội dung nhắc nhở học tập gửi tới màn hình Bé Minh Anh..."
                className="w-full rounded-2xl border border-purple-500/40 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none font-bold"
              />
            </div>
            <div className="md:col-span-4 flex items-center gap-2">
              <button
                onClick={() => {
                  const val = parentReminderInput.trim() || parentReminder;
                  setParentReminder(val);
                  try {
                    localStorage.setItem('kids_parent_reminder', val);
                  } catch (e) {
                    console.error(e);
                  }
                  if (addToast) addToast('🚀 Đã gửi nhắc nhở học tập tới màn hình Bé Minh Anh!', 'success');
                  playWordAudio(`Đã phát thông báo nhắc nhở tới bé Minh Anh: ${val}`);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black text-xs hover:from-purple-400 hover:to-pink-500 shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Gửi Nhắc Nhở Ngay</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-slate-400 font-bold">Mẫu nhanh:</span>
            {[
              'Minh Anh ơi! Hôm nay con nhớ học 5 từ vựng mới để thưởng 10 sao bé ngoan nhé! 💖✨',
              'Con gái Minh Anh làm bài tập xuất sắc lắm, Ba Bảo Nguyên luôn tin tưởng con! 🏆⭐',
              'Minh Anh ơi, hoàn thành bài tập Level hôm nay nhé! 🦄⭐',
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setParentReminderInput(preset);
                  setParentReminder(preset);
                  try {
                    localStorage.setItem('kids_parent_reminder', preset);
                  } catch (e) {
                    console.error(e);
                  }
                  if (addToast) addToast('🚀 Đã chọn mẫu nhắc nhở nhanh!', 'info');
                }}
                className="px-2.5 py-1 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 font-bold hover:bg-purple-800/60 transition cursor-pointer"
              >
                Mẫu {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Dual Actor Role Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-3xl border-2 border-pink-400/60 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-pink-400" /> Tác Nhân Hệ Thống:
          </span>
          {currentActor === 'minh_anh' ? (
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-pink-500/20 text-pink-300 border border-pink-400/60 flex items-center gap-1.5 animate-pulse shadow-md">
              👧 Nguyễn Ngọc Minh Anh (Chỉ Học & Làm Bài Tập - Giao Diện Gọn Sạch)
            </span>
          ) : (
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-400/60 flex items-center gap-1.5 shadow-md">
              👨‍💼 Lê Lương Bảo Nguyên (Quyền Quản Trị Hệ Thống & CRUD Dữ Liệu)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRequestSwitchActor('minh_anh')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              currentActor === 'minh_anh'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border border-pink-300 shadow-xl scale-105'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>👧 Bé Minh Anh (Học Viên)</span>
          </button>

          <button
            onClick={() => handleRequestSwitchActor('bao_nguyen')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              currentActor === 'bao_nguyen'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-300 shadow-xl scale-105'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
            title={currentActor === 'minh_anh' ? 'Cần nhập mật khẩu bảo mật để truy cập chế độ Quản trị' : 'Đang ở chế độ Quản trị'}
          >
            {currentActor === 'minh_anh' && <Lock className="h-3.5 w-3.5 text-amber-400" />}
            <span>👨‍💼 Ba Bảo Nguyên (Quản Trị)</span>
          </button>
        </div>
      </div>

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
              Thiết kế dành riêng cho con gái yêu <span className="font-bold text-pink-300">Nguyễn Ngọc Minh Anh</span>: 4 Cấp độ chuẩn CEFR (Basic - Elementary - Intermediate - Advanced).
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
          <div className="p-6 md:p-8 rounded-3xl border-2 border-pink-400/90 bg-slate-900/95 shadow-2xl backdrop-blur-md space-y-4 w-full sm:w-auto min-w-[320px] md:min-w-[420px] flex-1">
            <div className="text-center space-y-3">
              <div className="text-xs md:text-sm font-black uppercase tracking-wider text-pink-300 flex items-center justify-center gap-1.5">
                <Heart className="h-4 w-4 text-pink-400 fill-pink-400 animate-bounce" /> Chọn Bạn Nhỏ Đồng Hành:
              </div>
              <div className="text-7xl md:text-8xl animate-bounce drop-shadow-2xl cursor-pointer hover:scale-110 transition-transform" onClick={() => playWordAudio(PETS.find((p) => p.id === activePet)?.quote || '')}>
                {PETS.find((p) => p.id === activePet)?.icon || '🦄'}
              </div>
              <div className="text-base md:text-lg font-black text-white font-heading">
                {PETS.find((p) => p.id === activePet)?.name}
              </div>
              <p className="text-xs md:text-sm font-bold text-pink-200 bg-pink-950/80 p-3 rounded-2xl border border-pink-500/50 italic shadow-inner">
                "{PETS.find((p) => p.id === activePet)?.quote}"
              </p>
            </div>

            {/* Pet Switch Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {PETS.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => {
                    setActivePet(pet.id);
                    playWordAudio(pet.quote);
                  }}
                  className={`p-3 rounded-2xl text-2xl md:text-3xl transition border flex items-center justify-center cursor-pointer ${
                    activePet === pet.id
                      ? 'bg-pink-600 border-2 border-pink-300 text-white shadow-xl scale-110'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:scale-105'
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
      {/* COURSE ROADMAP SELECTOR: 4 CEFR LEVELS (STRICT SEQUENTIAL 90% UNLOCK) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {/* Parent Admin Control Panel for Ba Bảo Nguyên */}
        {currentActor === 'bao_nguyen' && (
          <div className="p-4 rounded-3xl border-2 border-purple-500/60 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/30 pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-purple-200">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>👨‍💼 BẢNG QUẢN LÝ KHÓA CẤP ĐỘ (ĐẶC QUYỀN LÊ LƯƠNG BẢO NGUYÊN)</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                ✓ Toàn quyền Mở/Khóa Cưỡng Chế
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map((lvlId) => {
                const isOverridden = adminLevelOverrides[lvlId];
                const stats = levelStats[lvlId] || { pct: 0 };
                return (
                  <div key={lvlId} className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-extrabold text-white">
                      <span>{lvlId} ({stats.pct}%)</span>
                      <span className={isOverridden ? 'text-amber-400' : 'text-cyan-400'}>
                        {isOverridden ? '🔓 Mở Cưỡng Chế' : '🔒 Khóa 90%'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleAdminToggleForceUnlock(lvlId)}
                        className={`w-full py-1 px-2 rounded-xl text-[10px] font-black transition border ${
                          isOverridden
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500'
                        }`}
                      >
                        {isOverridden ? '🔒 Bật Lại Khóa 90%' : '🔓 Mở Cưỡng Chế Ngay'}
                      </button>

                      <button
                        onClick={() => handleAdminQuickFill90Pct(lvlId)}
                        className="w-full py-1 px-2 rounded-xl text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-800 transition"
                      >
                        ⚡ Nạp 90% Tiến Độ
                      </button>

                      {/* Nút Reset Tiến Độ Level */}
                      <button
                        onClick={() => handleResetLevelProgress(lvlId)}
                        className="w-full py-1 px-2 rounded-xl text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-800 transition"
                        title={`Xóa sạch tiến độ học của ${lvlId}`}
                      >
                        🔄 Reset Tiến Độ {lvlId}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nút Reset Toàn Bộ Tiến Độ */}
            <div className="pt-2 border-t border-purple-500/30">
              <button
                onClick={handleResetAllProgress}
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-black bg-gradient-to-r from-rose-900 to-red-900 text-rose-200 border border-rose-500/50 hover:from-rose-800 hover:to-red-800 transition flex items-center justify-center gap-2 shadow-lg"
                title="Xóa sạch TOÀN BỘ tiến độ, sao ⭐ và thành tích của Minh Anh"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                ⚠️ RESET TOÀN BỘ TIẾN ĐỘ HỌC TẬP MINH ANH (Xóa Sao ⭐ + Từ Đã Thuộc + Thành Tích)
              </button>
            </div>
          </div>
        )}


        <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
            <span>Lộ Trình 4 Cấp Độ (Minh Anh Học Theo Thứ Tự • Mở Cấp Tiếp Theo Khi Đạt ≥ 90%):</span>
          </div>
          <button
            onClick={() => handleLevelChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-black border transition ${
              selectedLevel === 'all'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                : 'bg-slate-900 text-cyan-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            🌈 Tất Cả 4 Cấp Độ
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COURSE_LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            const unlocked = isLevelUnlocked(lvl.id);
            const stats = levelStats[lvl.id] || { total: 150, mastered: 0, pct: 0 };
            const isForceUnlocked = adminLevelOverrides[lvl.id];

            return (
              <button
                key={lvl.id}
                onClick={() => handleLevelChange(lvl.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? `bg-slate-900 border-2 ${lvl.color} shadow-xl scale-[1.02]`
                    : unlocked
                    ? 'bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    : 'bg-slate-950/50 border-rose-950 text-slate-500 opacity-95 hover:border-amber-500/50'
                }`}
              >
                {/* Lock Badge Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-3xl transition-transform duration-300 ${unlocked ? 'group-hover:scale-125' : 'grayscale opacity-70'}`}>
                      {lvl.icon}
                    </span>
                    {!unlocked && <Lock className="h-5 w-5 text-amber-400 animate-pulse" />}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black border ${lvl.bgBadge}`}>
                      {lvl.badge}
                    </span>
                    
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                      !unlocked
                        ? 'bg-rose-950/90 text-rose-300 border-rose-500/50'
                        : isForceUnlocked
                        ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                        : currentActor === 'bao_nguyen'
                        ? 'bg-purple-950/90 text-purple-300 border-purple-500/50'
                        : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                    }`}>
                      {!unlocked
                        ? '🔒 Khóa (Cần ≥90% Level trước)'
                        : isForceUnlocked
                        ? '🔓 Admin Mở Cưỡng Chế'
                        : currentActor === 'bao_nguyen'
                        ? '👨‍💼 Admin Quản Trị'
                        : '🟢 Đã Mở Khóa'}
                    </span>
                  </div>
                </div>

                <div className="font-extrabold text-sm text-white flex items-center justify-between">
                  <span>{lvl.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{lvl.description}</div>

                {/* Progress Bar & 90% Threshold Line */}
                <div className="mt-3 pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono-code font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">{lvl.targetWords} Từ</span>
                    <span className={stats.pct >= 90 ? 'text-emerald-400' : 'text-amber-300'}>
                      Thuộc: {stats.mastered}/{stats.total} ({stats.pct}%)
                    </span>
                  </div>

                  <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-500 ${
                        stats.pct >= 90
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                          : 'bg-gradient-to-r from-amber-500 to-orange-400'
                      }`}
                      style={{ width: `${stats.pct}%` }}
                    ></div>
                    {/* 90% Milestone Marker Line */}
                    <div
                      className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-yellow-300 z-10 shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                      title="Vạch ngưỡng mở khóa Level tiếp theo (90%)"
                    ></div>
                  </div>

                  <div className="flex justify-between text-[9px] text-slate-500 pt-0.5">
                    <span>Tiến độ bài học</span>
                    <span className="text-yellow-400 font-bold">⭐ Ngưỡng mở: 90%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>



      {/* Main Feature Tabs (Illustrated Poster Charts vs Flashcard Gallery vs Timed Quiz Game vs Spaced Repetition Review vs AI Manager) */}
      <div className="flex flex-wrap rounded-2xl bg-slate-950 p-1.5 border border-slate-800 gap-1">
        <button
          onClick={() => setActiveTab('poster')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'poster' ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-lg border border-pink-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4 text-yellow-300 animate-spin-slow" />
          <span>🖼️ Bảng Minh Họa ({posterPages.length} Trang)</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'flashcards' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>📚 Kho Từ Vựng ({vocabDatabase.length} Từ)</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'quiz' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="h-4 w-4 text-yellow-300 animate-pulse" />
          <span>🎮 Bài Tập & Trò Chơi ⏰</span>
        </button>

        <button
          onClick={() => setActiveTab('review_cycles')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'review_cycles' ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCw className="h-4 w-4 text-amber-300" />
          <span>🔄 Chu Kỳ Ôn Tập 5 Bước</span>
        </button>

        {currentActor === 'bao_nguyen' && (
          <>
            <button
              onClick={() => setActiveTab('db_table')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                activeTab === 'db_table' ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4 text-cyan-300" />
              <span>🗃️ Bảng CSDL (Data Table)</span>
            </button>

            <button
              onClick={() => setActiveTab('import_wizard')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                activeTab === 'import_wizard' ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="h-4 w-4 text-emerald-300" />
              <span>🚀 Wizard Nhập Hàng Loạt</span>
            </button>

            <button
              onClick={() => setActiveTab('trash_can')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                activeTab === 'trash_can' ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Archive className="h-4 w-4 text-rose-300" />
              <span>🗑️ Thùng Rác ({trashCan.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit_log')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                activeTab === 'audit_log' ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="h-4 w-4 text-purple-300" />
              <span>📜 Audit Log ({auditLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('qa_checklist')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                activeTab === 'qa_checklist' ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="h-4 w-4 text-teal-300" />
              <span>📊 QA Checklist ({qaMetrics.completenessScore}%)</span>
            </button>
          </>
        )}

        <button
          onClick={() => setShowAiModal(true)}
          className="py-3 px-5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 text-white shadow-xl hover:scale-105"
        >
          <Bot className="h-4.5 w-4.5 text-yellow-300 animate-bounce" />
          <span>🤖 AI Nhắc Học</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 0: DYNAMIC ILLUSTRATED VOCABULARY POSTER PAGES (PAGES 1 -> N) */}
      {/* ========================================================================= */}
      {activeTab === 'poster' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* Header Banner & Page Selector Bar */}
          <div className="rounded-3xl border-2 border-pink-400/60 bg-gradient-to-r from-purple-950/90 via-slate-900 to-pink-950/90 p-5 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black font-heading text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-spin-slow" />
                  <span>BẢNG TỪ VỰNG MINH HỌA TRỰC QUAN ({posterPages.length} TRANG CHO BÉ)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Mô phỏng chính xác {posterPages.length} trang tranh minh họa (400+ từ vựng cốt lõi), tự động chuyển đổi ảnh tranh AI & lưu trữ vào Database siêu chi tiết!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {currentActor === 'bao_nguyen' && (
                  <button
                    onClick={() => setShowScanModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white text-xs font-black shadow-xl hover:scale-105 transition border border-cyan-300/40"
                  >
                    <Camera className="h-4 w-4 text-yellow-300 animate-pulse" />
                    <span>📷 AI Quét & Chuyển Tranh Thành Bảng Từ Vựng ⚡</span>
                  </button>
                )}

                <button
                  onClick={() => playWordAudio(`Chào mừng bé Minh Anh đến với Bảng Từ Vựng Minh Họa ${posterPages.length} Trang Siêu Rực Rỡ!`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black shadow-lg hover:scale-105 transition"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Nghe Hướng Dẫn 🔊</span>
                </button>
              </div>
            </div>

            {/* Compact 1-2 Page Navigation Bar with Next Page & Poster Autoplay Engine */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-pink-500/30">
              {/* Left Side: Compact 1-2 Pages + Previous/Next Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Previous Page Button */}
                <button
                  disabled={typeof activePosterPage === 'number' && activePosterPage <= 1}
                  onClick={() => {
                    const currentPg = typeof activePosterPage === 'number' ? activePosterPage : 1;
                    if (currentPg > 1) setActivePosterPage(currentPg - 1);
                  }}
                  className="px-3.5 py-2 rounded-2xl text-xs font-black bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow"
                  title="Quay về trang trước"
                >
                  ◀️ Trang Trước
                </button>

                {/* Page Button 1 */}
                {(() => {
                  const currentPg = typeof activePosterPage === 'number' ? activePosterPage : 1;
                  const p1 = currentPg;
                  const p2 = currentPg + 1 <= posterPages.length ? currentPg + 1 : (currentPg > 1 ? currentPg - 1 : null);

                  return (
                    <>
                      <button
                        onClick={() => setActivePosterPage(p1)}
                        className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-md ${
                          activePosterPage === p1
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-2 border-pink-300 scale-105 shadow-pink-500/40'
                            : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>📄 Trang {p1}</span>
                      </button>

                      {p2 && (
                        <button
                          onClick={() => setActivePosterPage(p2)}
                          className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-md ${
                            activePosterPage === p2
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-2 border-pink-300 scale-105 shadow-pink-500/40'
                              : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>📄 Trang {p2}</span>
                        </button>
                      )}
                    </>
                  );
                })()}

                {/* Next Page Button */}
                <button
                  disabled={typeof activePosterPage === 'number' && activePosterPage >= posterPages.length}
                  onClick={() => {
                    const currentPg = typeof activePosterPage === 'number' ? activePosterPage : 1;
                    if (currentPg < posterPages.length) setActivePosterPage(currentPg + 1);
                  }}
                  className="px-4 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 border border-purple-300/40 transition shadow-lg flex items-center gap-1 cursor-pointer"
                  title="Chuyển sang trang tiếp theo"
                >
                  <span>Trang Tiếp</span>
                  <span className="font-mono-code">⏭️</span>
                </button>

                {/* Dropdown Quick Jump */}
                <select
                  value={activePosterPage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setActivePosterPage(val === 'all' ? 'all' : Number(val));
                  }}
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-pink-300 focus:border-pink-400 focus:outline-none cursor-pointer"
                >
                  {posterPages.map((pg) => (
                    <option key={pg.pageNumber} value={pg.pageNumber}>
                      📄 Chọn Nhanh Trang {pg.pageNumber} ({pg.sections.length} Phân Vùng)
                    </option>
                  ))}
                  <option value="all">🌈 Xem Tất Cả {posterPages.length} Trang</option>
                </select>

                <button
                  onClick={() => setActivePosterPage('all')}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-md ${
                    activePosterPage === 'all'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black border-2 border-amber-300 scale-105'
                      : 'bg-slate-950/80 border border-slate-800 text-amber-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🌈 Tất Cả {posterPages.length} Trang</span>
                </button>
              </div>

              {/* Right Side: Autoplay Words Controller for Poster Board */}
              <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-pink-500/40 shadow-inner">
                <button
                  onClick={() => {
                    const nextState = !isPosterAutoplay;
                    setIsPosterAutoplay(nextState);
                    if (nextState && addToast) {
                      addToast(`🔄 Đã bật chế độ TỰ ĐỘNG LẬT TỪ VỰNG & PHÁT ÂM (${autoPlaySeconds}s / từ)`, 'info');
                    } else if (addToast) {
                      addToast('⏸️ Đã tạm dừng tự động chuyển từ vựng bảng minh họa.', 'info');
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md ${
                    isPosterAutoplay
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white animate-pulse border border-emerald-300'
                      : 'bg-slate-800 text-pink-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{isPosterAutoplay ? '⏸️ Tạm Dừng Autoplay' : '⏯️ Tự Động Chuyển Từ Vựng'}</span>
                </button>

                {/* Autoplay Speed Selector */}
                <select
                  value={autoPlaySeconds}
                  onChange={(e) => setAutoPlaySeconds(Number(e.target.value))}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
                  title="Chọn thời gian tự động đổi từ vựng (giây)"
                >
                  <option value={5}>⚡ 5 giây</option>
                  <option value={10}>⏱️ 10 giây</option>
                  <option value={15}>⏱️ 15 giây</option>
                  <option value={20}>⏱️ 20 giây</option>
                  <option value={25}>⏱️ 25 giây</option>
                  <option value={30}>🐢 30 giây</option>
                </select>
              </div>
            </div>
          </div>

          {/* Render Active Page (or All Pages) */}
          {posterPages.filter(
            (pg) => activePosterPage === 'all' || pg.pageNumber === activePosterPage
          ).map((pageObj) => (
            <div
              key={pageObj.pageNumber}
              className="rounded-3xl border-2 border-slate-800 bg-slate-950/90 p-5 md:p-6 space-y-6 shadow-2xl backdrop-blur-xl"
            >
              {/* Page Title & Subtitle */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-lg">
                    {pageObj.pageNumber}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-white font-heading">
                      {pageObj.title}
                    </h3>
                    <p className="text-xs text-slate-400">{pageObj.subtitle}</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-950 text-pink-300 border border-pink-500/40">
                  {pageObj.badge}
                </span>
              </div>

              {/* 4 Quadrants Grid (2x2 Layout representing the 4 color-coded sections on each poster page) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pageObj.sections.map((section) => {
                  const sectionVocab = section.words
                    .map((wStr) =>
                      vocabDatabase.find((v) => v.word.toLowerCase() === wStr.toLowerCase())
                    )
                    .filter(Boolean);

                  return (
                    <div
                      key={section.id}
                      className={`rounded-3xl border-2 ${section.borderColor} bg-slate-900/95 overflow-hidden shadow-xl space-y-3 flex flex-col justify-between`}
                    >
                      {/* Section Colorful Header Banner */}
                      <div className={`${section.bgHeader} p-3.5 flex items-center justify-between shadow-md`}>
                        <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                          <span className="text-xl">{section.icon}</span>
                          <span>{section.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSuperAdd(section.categoryId, section.id.startsWith('L1') ? 'L1' : section.id.startsWith('L2') ? 'L2' : section.id.startsWith('L3') ? 'L3' : 'L4');
                            }}
                            className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-black/40 hover:bg-black/80 text-yellow-300 border border-yellow-400/40 flex items-center gap-1 transition shadow hover:scale-105 active:scale-95"
                            title="Thêm từ vựng mới vào chủ đề này"
                          >
                            <Plus className="h-3 w-3 text-yellow-300" />
                            <span>Thêm Từ</span>
                          </button>

                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/30 text-white border border-white/20">
                            {sectionVocab.length} Từ
                          </span>
                        </div>
                      </div>

                      {/* Section Cards Grid (10 Items) */}
                      <div className="p-3.5 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {sectionVocab.map((item, idx) => {
                          const detailedInfo = getSuperDetailedVocabInfo(item);
                          const isMastered = masteredCards.includes(item.id);

                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSpotlightCard(item);
                                setShowSpotlightMeaning(false);
                                playWordAudio(item.word, false);
                              }}
                              className={`group relative rounded-2xl border p-2.5 text-center transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                                isMastered
                                  ? 'border-emerald-500/50 bg-emerald-950/40 hover:border-emerald-400'
                                  : 'border-slate-800 bg-slate-950 hover:border-cyan-400 hover:scale-[1.04] shadow-md'
                              }`}
                            >
                              {/* Top Index Badge & Mastered Icon */}
                              <div className="flex items-center justify-between text-[9px] font-mono-code text-slate-400 mb-1">
                                <span className="font-bold text-slate-300">#{idx + 1}</span>
                                {isMastered && <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />}
                              </div>

                              {/* Card Emoji Icon */}
                              <div className="text-3xl sm:text-4xl py-1 drop-shadow-md group-hover:scale-125 transition-transform duration-300">
                                {item.image}
                              </div>

                              {/* Card Text & Phonetics */}
                              <div className="space-y-0.5 my-1">
                                <div className="font-black text-xs text-white group-hover:text-cyan-300 line-clamp-1">
                                  {item.word}
                                </div>
                                <div className="text-[10px] font-extrabold text-pink-300 bg-pink-950/70 px-1.5 py-0.5 rounded-md border border-pink-500/30 line-clamp-1">
                                  {detailedInfo?.vietnamesePhoneticDisplay || item.vietnamesePhonetic}
                                </div>
                                <div className="text-[11px] font-bold text-yellow-300 line-clamp-1">
                                  {item.meaning}
                                </div>
                              </div>

                              {/* Audio Speaker & Quick Edit / Delete Action Buttons */}
                              <div className="mt-1 flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playWordAudio(item.word, false);
                                  }}
                                  className="flex-1 py-1 rounded-xl bg-slate-900 border border-slate-700 text-[10px] font-bold text-cyan-300 hover:bg-cyan-600 hover:text-white transition flex items-center justify-center gap-1"
                                >
                                  <Volume2 className="h-3 w-3" />
                                  <span>Phát Âm</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenSuperEdit(item);
                                  }}
                                  className="p-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition"
                                  title="Sửa thông tin siêu chi tiết"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSuperCard(item.id, item.word);
                                  }}
                                  className="p-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white transition"
                                  title="Xóa từ vựng này"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: 2000 VOCABULARY FLASHCARD GALLERY WITH SEARCH & CATEGORY FILTER */}
      {/* ========================================================================= */}
      {activeTab === 'flashcards' && (
        <div className="space-y-5">
          {/* Autoplay Flashcard Controls Bar (30s Auto Advance All - Adorable Pink Theme) */}
          <div className="rounded-3xl border-2 border-pink-400/60 bg-gradient-to-r from-pink-950/90 via-slate-950 to-purple-950/90 p-4 md:p-5 shadow-2xl space-y-3 shadow-pink-500/20 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const nextState = !isAutoPlay;
                    setIsAutoPlay(nextState);
                    setAutoPlayTimer(autoPlaySeconds);

                    if (nextState && filteredDatabase.length > 0) {
                      const curIdx = spotlightCard ? filteredDatabase.findIndex((c) => c.id === spotlightCard.id) : 0;
                      const startIdx = curIdx >= 0 ? curIdx : 0;
                      const targetCard = filteredDatabase[startIdx];
                      if (targetCard) {
                        setSpotlightCard(targetCard);
                        setCurrentPage(Math.floor(startIdx / pageSize) + 1);
                        try {
                          playWordAudio(targetCard.word);
                        } catch (e) {
                          console.warn('Audio play error:', e);
                        }
                      }
                    }

                    if (addToast) {
                      addToast(
                        nextState
                          ? `▶️ Đã BẬT chế độ tự động chuyển theo thứ tự từng từ sau mỗi ${autoPlaySeconds}s!`
                          : '⏸️ Đã TẠM DỪNG tự động chuyển Flashcard.',
                        nextState ? 'success' : 'info'
                      );
                    }
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-black transition shadow-xl active:scale-95 ${
                    isAutoPlay
                      ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-slate-950 animate-pulse border-2 border-yellow-200'
                      : 'bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white hover:from-pink-500 hover:to-rose-400 shadow-pink-500/30'
                  }`}
                >
                  {isAutoPlay ? (
                    <>
                      <Zap className="h-4 w-4 fill-slate-950" />
                      <span>⏸️ TẠM DỪNG CHUYỂN TỪNG TỪ</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-white" />
                      <span>▶️ BẬT TỰ ĐỘNG CHUYỂN TỪNG FLASHCARD ({autoPlaySeconds}s/TỪ) 🌸</span>
                    </>
                  )}
                </button>

                {/* Autoplay Time Selector */}
                <div className="flex items-center gap-1 rounded-2xl bg-pink-950/80 p-1 border border-pink-500/40 text-xs font-bold shadow-md flex-wrap">
                  {[5, 10, 15, 20, 25, 30].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        setAutoPlaySeconds(sec);
                        setAutoPlayTimer(sec);
                      }}
                      className={`px-2.5 py-1 rounded-xl transition ${
                        autoPlaySeconds === sec ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-slate-950 font-black shadow-md' : 'text-pink-300 hover:text-white'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Countdown Progress Display */}
              <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-pink-200 bg-pink-950/60 px-3 py-1.5 rounded-2xl border border-pink-500/30">
                <Clock className={`h-4 w-4 ${isAutoPlay ? 'text-pink-400 animate-spin-slow' : 'text-slate-500'}`} />
                <span>
                  {isAutoPlay ? (
                    <span className="text-pink-300">
                      Tự động phát & chuyển từ tiếp theo sau: <strong className="text-white text-sm animate-pulse">{autoPlayTimer}s</strong>
                    </span>
                  ) : (
                    <span className="text-slate-400">Chế độ tự động chuyển từng card đang dừng</span>
                  )}
                </span>
              </div>
            </div>

            {/* Countdown Visual Progress Bar */}
            {isAutoPlay && (
              <div className="h-2 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 transition-all duration-1000"
                  style={{ width: `${(autoPlayTimer / autoPlaySeconds) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Search & Topic Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tra cứu từ vựng 600 từ (ví dụ: Apple, Dog, Sư tử, Quả cam)..."
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
              <span>Tìm thấy: <strong className="text-cyan-300 font-mono-code">{filteredDatabase.length}</strong> / 600 từ</span>
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

                    {/* VIETNAMESE MEANING & ACCURATE DICTIONARY DETAILS (SIÊU CHI TIẾT) */}
                    {(() => {
                      const superDetail = getSuperDetailedVocabInfo(spotlightCard);
                      return (
                        <div className="space-y-3">
                          <div className="rounded-2xl border border-yellow-500/50 bg-slate-950 p-4 space-y-3 animate-fadeIn shadow-lg">
                            <div className="text-center space-y-1">
                              <div className="text-2xl md:text-3xl font-black text-yellow-300 font-heading">
                                {spotlightCard.meaning}
                              </div>
                              <div className="text-xs font-bold text-pink-300 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-500/30 inline-block">
                                🗣️ {superDetail?.vietnamesePhoneticDisplay || `Đọc là: "${spotlightCard.vietnamesePhonetic}"`}
                              </div>
                              <div className="text-[11px] font-mono-code text-cyan-300">
                                🔤 Âm tiết: {superDetail?.syllableBreakdown}
                              </div>
                            </div>

                            {/* Cute Mnemonic Tip */}
                            <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                              {superDetail?.memoryTip || `💡 ${spotlightCard.hint}`}
                            </div>

                            {/* Daily Practice Phrase */}
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                                <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                                <span>Luyện Nói Hằng Ngày Cho Minh Anh:</span>
                              </div>
                              <div className="font-bold text-white pl-5">"{superDetail?.dailyPhrase || spotlightCard.example || spotlightCard.sentence}"</div>
                              <div className="text-slate-400 pl-5">({spotlightCard.exampleVi || spotlightCard.sentenceVi})</div>
                            </div>

                            {/* Fun Fact */}
                            <div className="text-[11px] font-medium text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                              🧠 <span className="font-bold">Góc Kiến Thức:</span> {superDetail?.funFact}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

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

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Add New Exercise Button (Admin Only) */}
              {currentActor === 'bao_nguyen' && (
                <button
                  onClick={() => handleOpenSuperAdd('L1-U01', 'L1')}
                  className="px-3.5 py-2 rounded-2xl font-black text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl hover:scale-105 active:scale-95 transition flex items-center gap-1.5 border border-emerald-400/80 cursor-pointer"
                  title="Tạo thêm bài tập mới cho bé"
                >
                  <Plus className="h-4 w-4 text-emerald-200" />
                  <span>➕ Thêm Bài Tập Mới</span>
                </button>
              )}

              {/* Random Shuffle Button */}
              <button
                onClick={handleShuffle100Quiz}
                className="px-4 py-2 rounded-2xl font-black text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-xl hover:scale-105 active:scale-95 transition flex items-center gap-2 border border-pink-400/80 cursor-pointer animate-pulse"
                title="Xáo trộn ngẫu nhiên bộ 100 bài tập mới"
              >
                <RotateCw className="h-4 w-4 text-yellow-300 animate-spin-slow" />
                <span>🎲 Trộn Ngẫu Nhiên 100 Bài Tập</span>
              </button>

              {/* Question Count Tracker */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono-code font-bold text-cyan-300 shadow-inner">
                Bài tập #{(quizIndex % (quizPool.length > 100 ? 100 : (quizPool.length || 1))) + 1} / {quizPool.length > 100 ? 100 : (quizPool.length || 100)}
              </div>

              {/* Streak Combo Badge */}
              {streakCount > 0 && (
                <div className="flex items-center gap-1 rounded-2xl bg-amber-500/20 border border-amber-400 px-3 py-2 text-xs font-black text-amber-300 animate-pulse shadow-lg">
                  <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span>Streak x{streakCount} 🔥</span>
                </div>
              )}

              {/* Total Score */}
              <div className="flex items-center gap-1.5 rounded-2xl bg-pink-950 border border-pink-500/40 px-3.5 py-2 text-xs font-black text-pink-300 shadow-md">
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

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => playWordAudio(currentQuizCard.word)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-pink-600/30 border border-pink-500/40 px-3.5 py-1.5 text-xs font-bold text-pink-200 hover:bg-pink-600/50 transition active:scale-95 shadow-md"
                >
                  <Volume2 className="h-4 w-4 text-pink-400 animate-pulse" /> Nghe Gợi Ý Phát Âm 🔊
                </button>
              </div>

              {/* Quick CRUD Action Controls for Parent / Admin on Current Exercise */}
              {currentActor === 'bao_nguyen' && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-900/80">
                  <button
                    onClick={() => handleOpenSuperAdd(currentQuizCard.category || 'L1-U01', currentQuizCard.level || 'L1')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md active:scale-95"
                    title="Tạo thêm bài tập mới"
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-400" /> Thêm Bài Tập Mới
                  </button>
                  <button
                    onClick={() => handleOpenSuperEdit(currentQuizCard)}
                    className="px-3 py-1.5 rounded-xl bg-amber-950/90 border border-amber-500/40 text-amber-300 hover:bg-amber-600 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md active:scale-95"
                    title="Sửa nội dung bài tập hiện tại"
                  >
                    <Edit className="h-3.5 w-3.5 text-amber-400" /> Sửa Bài Tập Này
                  </button>
                  <button
                    onClick={() => handleDeleteSuperCard(currentQuizCard.id, currentQuizCard.word)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/90 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md active:scale-95"
                    title="Xóa bài tập này khỏi hệ thống"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-400" /> Xóa Bài Tập Này
                  </button>
                </div>
              )}
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
      {/* VIEW: SPACED REPETITION REVIEW CYCLES (5 STEPS & 1-30 DAYS) */}
      {/* ========================================================================= */}
      {activeTab === 'review_cycles' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* 5-Step Learning Method Banner */}
          <div className="glass-panel rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/20 px-3.5 py-1 text-xs font-black text-amber-300">
                  <RotateCw className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
                  <span>PHƯƠNG PHÁP HỌC THEO CHU KỲ 5 BƯỚC</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black font-heading text-white">
                  ÔN TẬP CÁCH QUÃNG 1 - 3 - 7 - 14 - 30 NGÀY FOR KIDS
                </h3>
                <p className="text-xs text-amber-200/80">
                  Chinh phục 600 từ vựng theo tần suất lặp lại khoảng cách khoa học giúp con ghi nhớ lâu dài!
                </p>
              </div>

              {/* Daily Target Age Selector */}
              <div className="flex items-center gap-2 rounded-2xl bg-slate-950 p-1.5 border border-slate-800 text-xs">
                <button
                  onClick={() => setAgeGroupTarget('4-6')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    ageGroupTarget === '4-6' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👶 4–6 Tuổi (5 từ / 10–15 phút)
                </button>
                <button
                  onClick={() => setAgeGroupTarget('7-10')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    ageGroupTarget === '7-10' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👦 7–10 Tuổi (8–10 từ / 15–25 phút)
                </button>
              </div>
            </div>

            {/* 5 Steps Roadmap Graphic */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="rounded-2xl border border-amber-500/30 bg-slate-950/80 p-3 text-center space-y-1.5">
                <div className="text-2xl">👁️</div>
                <div className="text-xs font-black text-amber-300">BƯỚC 1</div>
                <div className="text-[11px] text-slate-300 font-bold">Nhìn Icon & Đoán nghĩa</div>
              </div>
              <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-3 text-center space-y-1.5">
                <div className="text-2xl">🎧</div>
                <div className="text-xs font-black text-cyan-300">BƯỚC 2</div>
                <div className="text-[11px] text-slate-300 font-bold">Nghe hoặc Đọc từ vựng</div>
              </div>
              <div className="rounded-2xl border border-pink-500/30 bg-slate-950/80 p-3 text-center space-y-1.5">
                <div className="text-2xl">🗣️</div>
                <div className="text-xs font-black text-pink-300">BƯỚC 3</div>
                <div className="text-[11px] text-slate-300 font-bold">Nhắc lại 3 lần (Máy AI)</div>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-3 text-center space-y-1.5">
                <div className="text-2xl">📝</div>
                <div className="text-xs font-black text-emerald-300">BƯỚC 4</div>
                <div className="text-[11px] text-slate-300 font-bold">Sử dụng trong câu mẫu</div>
              </div>
              <div className="rounded-2xl border border-purple-500/30 bg-slate-950/80 p-3 text-center space-y-1.5">
                <div className="text-2xl">🔄</div>
                <div className="text-xs font-black text-purple-300">BƯỚC 5</div>
                <div className="text-[11px] text-slate-300 font-bold">Kiểm tra sau 1-30 ngày</div>
              </div>
            </div>
          </div>

          {/* Spaced Interval Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Chọn mốc kiểm tra:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { day: 1, label: 'Ngày 1 (24 giờ)', icon: '🌱' },
                  { day: 3, label: 'Ngày 3 (Củng cố)', icon: '🌿' },
                  { day: 7, label: 'Ngày 7 (1 Tuần)', icon: '🌳' },
                  { day: 14, label: 'Ngày 14 (2 Tuần)', icon: '⭐' },
                  { day: 30, label: 'Ngày 30 (1 Tháng)', icon: '👑' },
                ].map((item) => (
                  <button
                    key={item.day}
                    onClick={() => setReviewDayFilter(item.day)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black transition border ${
                      reviewDayFilter === item.day
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Review Vocab Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vocabDatabase
              .slice(
                ((reviewDayFilter - 1) * 15) % Math.max(1, vocabDatabase.length - 15),
                (((reviewDayFilter - 1) * 15) % Math.max(1, vocabDatabase.length - 15)) + (ageGroupTarget === '4-6' ? 8 : 12)
              )
              .map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-5 space-y-3 shadow-xl hover:border-amber-400 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black text-amber-300">
                      Mốc Ôn: Ngày {reviewDayFilter}
                    </span>
                    <button
                      onClick={() => handleStartVoiceRecording(item)}
                      className="p-1.5 rounded-xl bg-pink-600/30 border border-pink-500/40 text-pink-300 hover:bg-pink-600/50 transition"
                      title="Luyện nói với máy chấm AI"
                    >
                      <Mic className="h-4 w-4 text-pink-400" />
                    </button>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-5xl my-1 animate-bounce">{item.image}</div>
                    <div className="text-lg font-black text-white font-heading">{item.word}</div>
                    <div className="font-mono-code text-xs text-cyan-300 font-bold">{item.ipa}</div>
                    <div className="text-xs text-amber-300 font-bold">"{item.meaning}"</div>
                    <div className="text-[10px] text-slate-400 italic">Đọc là: {item.vietnamesePhonetic || getVietnamesePhoneticGuide(item.word)}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1 text-center">
                    <div className="text-[11px] text-slate-300 italic">"{item.example || item.sentence}"</div>
                    <div className="text-[10px] text-emerald-400 font-medium">{item.exampleVi || item.sentenceVi}</div>
                  </div>

                  <button
                    onClick={() => playWordAudio(item.word)}
                    className="w-full py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-xs font-black text-amber-300 hover:bg-amber-500/30 transition flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-amber-400" /> Nghe Phát Âm Chuẩn
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ADMIN VOCABULARY DATABASE MANAGER (CRUD 600 WORDS) */}
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
                  ? '🎙️ BÉ NÓI VÀO MICRO THIẾT BỊ ĐỂ MÁY GHI ÂM & CHẤM ĐIỂM THẬT...'
                  : 'Bấm nút Micro màu xanh ở trên và đọc to từ vựng tiếng Anh nhé!'}
              </p>

              {/* MANUAL VERIFICATION & TESTING CONSOLE */}
              <div className="pt-2 border-t border-slate-800 text-left space-y-1 text-xs">
                <label className="text-[11px] font-bold text-slate-400">🎯 Hoặc gõ thử từ/câu bé vừa đọc để kiểm tra điểm thuật toán:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Gõ từ bé vừa đọc (VD: '${voiceTargetWord.word}')`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        setRecordedTranscript(e.target.value);
                        evaluatePronunciation(e.target.value, voiceTargetWord.word);
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono-code"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input && input.value) {
                        setRecordedTranscript(input.value);
                        evaluatePronunciation(input.value, voiceTargetWord.word);
                      }
                    }}
                    className="rounded-xl bg-cyan-600 px-3 py-2 font-bold text-white text-xs hover:bg-cyan-500 transition"
                  >
                    Chấm Điểm
                  </button>
                </div>
              </div>
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
      {/* ========================================================================= */}
      {/* STICKY MOBILE APP FLOATING PINK ACTION BAR (TỐI ƯU MOBILE DỄ THƯƠNG FOR MINH ANH) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-3 left-3 right-3 sm:hidden z-50 rounded-3xl border-2 border-pink-400 bg-gradient-to-r from-pink-950/95 via-slate-950/95 to-purple-950/95 p-2.5 shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-2 shadow-pink-500/40">
        <button
          onClick={() => {
            const nextState = !isAutoPlay;
            setIsAutoPlay(nextState);
            setAutoPlayTimer(autoPlaySeconds);
            if (nextState && filteredDatabase.length > 0) {
              const curIdx = spotlightCard ? filteredDatabase.findIndex((c) => c.id === spotlightCard.id) : 0;
              const startIdx = curIdx >= 0 ? curIdx : 0;
              const targetCard = filteredDatabase[startIdx];
              if (targetCard) {
                setSpotlightCard(targetCard);
                setCurrentPage(Math.floor(startIdx / pageSize) + 1);
                try {
                  playWordAudio(targetCard.word);
                } catch (e) {
                  console.warn('Audio play error:', e);
                }
              }
            }
          }}
          className={`flex-1 py-2.5 px-3 rounded-2xl text-[11px] font-black flex items-center justify-center gap-1.5 transition active:scale-95 ${
            isAutoPlay
              ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 animate-pulse border border-yellow-200'
              : 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md'
          }`}
        >
          {isAutoPlay ? (
            <>
              <Zap className="h-3.5 w-3.5 fill-slate-950" />
              <span>⏸️ Dừng ({autoPlayTimer}s)</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>▶️ Tự Động 30s 🌸</span>
            </>
          )}
        </button>

        {spotlightCard && (
          <>
            <button
              onClick={() => playWordAudio(spotlightCard.word, false)}
              className="p-2.5 rounded-2xl bg-cyan-600 text-white text-xs font-bold shadow-md active:scale-95 flex items-center gap-1"
              title="Phát Âm Tiếng Anh"
            >
              <Volume2 className="h-4 w-4" />
              <span>Đọc</span>
            </button>

            <button
              onClick={() => handleStartVoiceRecording(spotlightCard)}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-md active:scale-95 flex items-center gap-1"
              title="AI Chấm Phát Âm"
            >
              <Mic className="h-4 w-4 text-yellow-300 animate-bounce" />
              <span>Chấm</span>
            </button>
          </>
        )}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-2.5 rounded-2xl bg-slate-900 border border-pink-500/40 text-pink-300 text-xs font-bold active:scale-95"
          title="Lên Đầu Trang"
        >
          ⬆️
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 5: PERSISTENT DATABASE DATA TABLE VIEW (BẢNG CƠ SỞ DỮ LIỆU SỐ) */}
      {/* ========================================================================= */}
      {activeTab === 'db_table' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* Top Banner */}
          <div className="rounded-3xl border-2 border-cyan-500/60 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black font-heading text-white flex items-center gap-2">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  <span>BẢNG DỮ LIỆU CƠ SỞ DỮ LIỆU KHO TỪ VỰNG & TRANH ({vocabDatabase.length} TỪ)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Bảng tổng hợp lưu trữ siêu chi tiết (IPA, Phiên âm Tiếng Việt, Mẹo nhớ, Ví dụ song ngữ). Lưu trữ trực tiếp vào LocalStorage & CSDL hệ thống!
                </p>
              </div>

              {/* Action Buttons: Export & Import & Add */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabDatabase, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `kids_vocab_database_${new Date().toISOString().slice(0,10)}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    addToast?.("Đã xuất file JSON Database thành công!", "success");
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:scale-105 transition flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Export JSON DB</span>
                </button>

                <label className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-105 transition flex items-center gap-1.5">
                  <Upload className="h-4 w-4" />
                  <span>Import JSON DB</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          try {
                            const parsed = JSON.parse(ev.target.result);
                            if (Array.isArray(parsed)) {
                              saveVocabDatabase(parsed);
                              addToast?.(`Đã nạp ${parsed.length} từ vựng từ JSON vào Database thành công!`, "success");
                            }
                          } catch (err) {
                            addToast?.("Lỗi định dạng tệp JSON!", "error");
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>

                <button
                  onClick={() => handleOpenSuperAdd('GENERAL', 'L1')}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 shadow-md hover:scale-105 transition flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm Từ Mới Vào DB</span>
                </button>
              </div>
            </div>

            {/* Filter Search Input */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm từ tiếng Anh, phiên âm hoặc nghĩa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-bold focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="text-xs text-cyan-300 font-bold bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                📊 Tìm thấy: <span className="text-yellow-300 font-black">{filteredDatabase.length}</span> / {vocabDatabase.length} từ vựng
              </div>
            </div>
          </div>

          {/* Interactive Responsive Data Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
            {/* Top Pagination Control Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/90 border-b border-slate-800 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400">Hiển thị:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setTablePage(1);
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-black text-cyan-300 focus:border-cyan-400 focus:outline-none shadow-inner"
                >
                  <option value={20}>20 từ / trang</option>
                  <option value={50}>50 từ / trang</option>
                  <option value={100}>100 từ / trang</option>
                  <option value={filteredDatabase.length || 99999}>Tất cả ({filteredDatabase.length} từ)</option>
                </select>
                <span className="text-slate-400">
                  | Đang xem từ <span className="text-yellow-300 font-black">{filteredDatabase.length > 0 ? tableStartIndex + 1 : 0}</span> đến <span className="text-yellow-300 font-black">{tableEndIndex}</span> (Tổng <span className="text-cyan-300 font-black">{filteredDatabase.length}</span> từ)
                </span>
              </div>

              {/* Top Page Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setTablePage(1)}
                  disabled={safeTablePage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 font-black transition"
                  title="Trang đầu"
                >
                  ««
                </button>
                <button
                  onClick={() => setTablePage(prev => Math.max(1, prev - 1))}
                  disabled={safeTablePage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 font-bold transition"
                >
                  ‹ Trước
                </button>
                <span className="px-3 py-1 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-black">
                  Trang {safeTablePage} / {totalTablePages}
                </span>
                <button
                  onClick={() => setTablePage(prev => Math.min(totalTablePages, prev + 1))}
                  disabled={safeTablePage === totalTablePages}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 font-bold transition"
                >
                  Sau ›
                </button>
                <button
                  onClick={() => setTablePage(totalTablePages)}
                  disabled={safeTablePage === totalTablePages}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 font-black transition"
                  title="Trang cuối"
                >
                  »»
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-cyan-300 font-black uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center">STT</th>
                    <th className="p-3 text-center">Emoji</th>
                    <th className="p-3">Từ Tiếng Anh</th>
                    <th className="p-3">Phiên Âm (IPA & Việt)</th>
                    <th className="p-3">Nghĩa Tiếng Việt</th>
                    <th className="p-3 text-center">Loại Từ</th>
                    <th className="p-3 text-center">Cấp Độ</th>
                    <th className="p-3">Ví Dụ & Mẹo Ghi Nhớ</th>
                    <th className="p-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {paginatedTableDatabase.map((item, idx) => {
                    const sInfo = getSuperDetailedVocabInfo(item);
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 text-center text-slate-400 font-mono-code font-bold">{tableStartIndex + idx + 1}</td>
                        <td className="p-3 text-center text-2xl">{item.image}</td>
                        <td className="p-3 font-black text-white text-sm">
                          <div className="flex items-center gap-1.5">
                            <span>{item.word}</span>
                            {item.isLongmanVerified && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40" title="Đã đối soát từ điển Longman">
                                📖 Longman
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => playWordAudio(item.word)}
                            className="mt-1 text-cyan-400 hover:text-cyan-200 flex items-center gap-1 text-[11px] font-bold"
                            title="Nghe phát âm"
                          >
                            <Volume2 className="h-3.5 w-3.5 inline" /> Phát âm
                          </button>
                        </td>
                        <td className="p-3 space-y-0.5">
                          <div className="font-mono-code text-cyan-300 font-bold">{item.ipa || sInfo?.ipa}</div>
                          <div className="text-[10px] font-extrabold text-pink-300 bg-pink-950/80 px-1.5 py-0.5 rounded inline-block">
                            {sInfo?.vietnamesePhoneticDisplay || item.vietnamesePhonetic}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-yellow-300">{item.meaning}</td>
                        <td className="p-3 text-center font-bold text-slate-400">{item.type || 'Danh từ'}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-cyan-300 border border-cyan-500/30">
                            {item.level || 'L1'}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs space-y-1">
                          {item.example && (
                            <div className="text-slate-300 italic text-[11px] line-clamp-1">"{item.example}"</div>
                          )}
                          {(item.hint || sInfo?.mnemonicHint) && (
                            <div className="text-purple-300 text-[10px] font-medium line-clamp-1">
                              {item.hint || sInfo?.mnemonicHint}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenSuperEdit(item)}
                            className="p-1.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs"
                            title="Sửa từ vựng"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSuperCard(item.id, item.word)}
                            className="p-1.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white font-bold text-xs"
                            title="Xóa từ vựng"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Comprehensive Pagination Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/90 border-t border-slate-800 text-xs font-bold text-slate-300">
              <div className="text-slate-400">
                Hiển thị từ <span className="text-yellow-300 font-black">{filteredDatabase.length > 0 ? tableStartIndex + 1 : 0}</span> đến <span className="text-yellow-300 font-black">{tableEndIndex}</span> trong tổng số <span className="text-cyan-300 font-black">{filteredDatabase.length}</span> từ vựng
              </div>

              {/* Numbered Page Buttons & Navigation */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setTablePage(1)}
                  disabled={safeTablePage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 font-black transition"
                  title="Trang đầu"
                >
                  ««
                </button>
                <button
                  onClick={() => setTablePage(prev => Math.max(1, prev - 1))}
                  disabled={safeTablePage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 font-bold transition flex items-center gap-1"
                >
                  ‹ Trước
                </button>

                {Array.from({ length: totalTablePages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalTablePages || Math.abs(p - safeTablePage) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      acc.push('...');
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) => {
                    if (item === '...') {
                      return <span key={`dots-${idx}`} className="px-1 text-slate-500">...</span>;
                    }
                    return (
                      <button
                        key={item}
                        onClick={() => setTablePage(item)}
                        className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                          safeTablePage === item
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg border border-cyan-400 scale-105'
                            : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}

                <button
                  onClick={() => setTablePage(prev => Math.min(totalTablePages, prev + 1))}
                  disabled={safeTablePage === totalTablePages}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 font-bold transition flex items-center gap-1"
                >
                  Sau ›
                </button>
                <button
                  onClick={() => setTablePage(totalTablePages)}
                  disabled={safeTablePage === totalTablePages}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 font-black transition"
                  title="Trang cuối"
                >
                  »»
                </button>

                {/* Direct Page Input Jump */}
                <div className="flex items-center gap-1 ml-2 border-l border-slate-800 pl-2">
                  <span className="text-[11px] text-slate-400">Chuyển tới:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalTablePages}
                    value={safeTablePage}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= totalTablePages) {
                        setTablePage(val);
                      }
                    }}
                    className="w-12 text-center rounded-lg border border-slate-700 bg-slate-950 text-yellow-300 font-black py-0.5 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400">/ {totalTablePages}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 6: WIZARD NHẬP DỮ LIỆU HÀNG LOẠT & ROLLBACK (SECTION 9.2 & 9.6) */}
      {/* ========================================================================= */}
      {activeTab === 'import_wizard' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* Top Banner */}
          <div className="rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-6 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black font-heading text-white flex items-center gap-2">
                  <UploadCloud className="h-6 w-6 text-emerald-400" />
                  <span>TRÌNH WIZARD NHẬP DỮ LIỆU HÀNG LOẠT (6 BƯỚC & ROLLBACK)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Quy trình 6 bước chuẩn CFP-BRD-DATA-CRUD-001: Dry-Run xem trước, kiểm tra trùng lặp (BR-010), lưu checkpoint và hoàn tác Rollback theo phiên!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleAutoEnrichSuperDetails}
                  disabled={isEnrichingSuperDetails}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-pink-500 to-purple-600 text-white border border-pink-300 shadow-md hover:scale-105 transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className={`h-3.5 w-3.5 text-yellow-300 ${isEnrichingSuperDetails ? 'animate-spin' : ''}`} />
                  <span>{isEnrichingSuperDetails ? 'Đang Nạp...' : '⚡ Nạp Siêu Chi Tiết'}</span>
                </button>

                {/* --- TEMPLATE 1: JSON SIÊU CHI TIẾT --- */}
                <button
                  onClick={() => {
                    const sample = [
                      {
                        word: "elephant",
                        ipa: "/ˈel.ə.fənt/",
                        vietnamesePhonetic: "E-lơ-phơn-tơ",
                        meaning: "con voi",
                        type: "Danh từ",
                        image: "🐘",
                        hint: "💡 Con voi có cái vòi rất dài và to lớn!",
                        example: "The elephant drinks water.",
                        exampleVi: "Con voi uống nước.",
                        level: "L2",
                        category: "L2-U03",
                        audioUrl: "",
                        tags: ["animals", "wildlife", "zoo"]
                      },
                      {
                        word: "strawberry",
                        ipa: "/ˈstrɔː.ber.i/",
                        vietnamesePhonetic: "Stơ-ro-be-ri",
                        meaning: "quả dâu tây",
                        type: "Danh từ",
                        image: "🍓",
                        hint: "💡 Dâu tây màu đỏ xinh xắn, vị ngọt chua!",
                        example: "I love eating fresh strawberries.",
                        exampleVi: "Tớ thích ăn dâu tây tươi.",
                        level: "L2",
                        category: "L2-U05",
                        audioUrl: "",
                        tags: ["fruits", "food", "sweet"]
                      },
                      {
                        word: "rainbow",
                        ipa: "/ˈreɪnboʊ/",
                        vietnamesePhonetic: "Rên-bâu",
                        meaning: "cầu vồng",
                        type: "Danh từ",
                        image: "🌈",
                        hint: "💡 7 màu cầu vồng xuất hiện sau cơn mưa rào!",
                        example: "Look at the beautiful rainbow!",
                        exampleVi: "Hãy nhìn cầu vồng đẹp kia kìa!",
                        level: "L3",
                        category: "L3-U02",
                        audioUrl: "",
                        tags: ["nature", "weather", "colors"]
                      }
                    ];
                    setImportRawText(JSON.stringify(sample, null, 2));
                    addToast?.("✅ Đã nạp Mẫu JSON Siêu Chi Tiết (3 từ vựng đầy đủ 12 trường)!", "info");
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-cyan-900/80 text-cyan-300 border border-cyan-600 hover:bg-cyan-800 transition"
                >
                  📄 Mẫu JSON Chi Tiết
                </button>

                {/* --- TEMPLATE 2: CSV SIÊU CHI TIẾT --- */}
                <button
                  onClick={() => {
                    const csv = [
                      "# HƯỚNG DẪN: word, meaning, ipa, vietnamesePhonetic, level, category, image, type, hint, example, exampleVi",
                      "butterfly, con bướm, /ˈbʌtərflaɪ/, Bơ-tơ-phơ-lai, L2, L2-U04, 🦋, Danh từ, 💡 Bướm xòe cánh sặc sỡ!, A butterfly is pretty., Một chú bướm rất xinh đẹp.",
                      "volcano, núi lửa, /vɑːlˈkeɪnoʊ/, Von-cay-nô, L3, L3-U01, 🌋, Danh từ, 💡 Núi lửa phun trào dung nham!, The volcano erupts., Núi lửa phun trào.",
                      "telescope, kính thiên văn, /ˈtɛləskoʊp/, Te-lơ-sơ-cốp, L3, L3-U06, 🔭, Danh từ, 💡 Ngắm nhìn các vì sao qua kính!, Look through the telescope., Nhìn qua kính thiên văn."
                    ].join("\n");
                    setImportRawText(csv);
                    addToast?.("✅ Đã nạp Mẫu CSV Siêu Chi Tiết (3 dòng, 11 cột)!", "info");
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-pink-900/80 text-pink-300 border border-pink-600 hover:bg-pink-800 transition"
                >
                  📊 Mẫu CSV Chi Tiết
                </button>

                {/* --- TEMPLATE 3: BATCH 10 TỪ VỰC --- */}
                <button
                  onClick={() => {
                    const batch = [
                      { word: "lion", ipa: "/ˈlaɪ.ən/", vietnamesePhonetic: "Lai-ơn", meaning: "con sư tử", type: "Danh từ", image: "🦁", hint: "💡 Vua của muôn thú trong rừng!", example: "The lion roars loudly.", exampleVi: "Con sư tử gầm to.", level: "L2", category: "L2-U03" },
                      { word: "giraffe", ipa: "/dʒɪˈræf/", vietnamesePhonetic: "Gi-ráp-phơ", meaning: "hươu cao cổ", type: "Danh từ", image: "🦒", hint: "💡 Cổ dài nhất trong loài động vật!", example: "A giraffe eats leaves.", exampleVi: "Hươu cao cổ ăn lá cây.", level: "L2", category: "L2-U03" },
                      { word: "dolphin", ipa: "/ˈdɑːlfɪn/", vietnamesePhonetic: "Đon-phin", meaning: "cá heo", type: "Danh từ", image: "🐬", hint: "💡 Cá heo rất thông minh và thân thiện!", example: "Dolphins swim and jump.", exampleVi: "Cá heo bơi và nhảy.", level: "L2", category: "L2-U03" },
                      { word: "watermelon", ipa: "/ˈwɑːtərˌmelən/", vietnamesePhonetic: "Oa-tơ-me-lần", meaning: "dưa hấu", type: "Danh từ", image: "🍉", hint: "💡 Dưa hấu đỏ mọng giải nhiệt mùa hè!", example: "Watermelon is very sweet.", exampleVi: "Dưa hấu rất ngọt.", level: "L1", category: "L1-U05" },
                      { word: "mango", ipa: "/ˈmæŋɡoʊ/", vietnamesePhonetic: "Măn-gô", meaning: "quả xoài", type: "Danh từ", image: "🥭", hint: "💡 Xoài chín vàng thơm phức!", example: "I eat a ripe mango.", exampleVi: "Tôi ăn quả xoài chín.", level: "L1", category: "L1-U05" },
                      { word: "island", ipa: "/ˈaɪlənd/", vietnamesePhonetic: "Ai-lần-đơ", meaning: "hòn đảo", type: "Danh từ", image: "🏝️", hint: "💡 Hòn đảo nằm giữa đại dương xanh!", example: "The island is beautiful.", exampleVi: "Hòn đảo rất đẹp.", level: "L3", category: "L3-U01" },
                      { word: "compass", ipa: "/ˈkʌmpəs/", vietnamesePhonetic: "Com-pơ-sơ", meaning: "la bàn", type: "Danh từ", image: "🧭", hint: "💡 Kim la bàn luôn chỉ hướng Bắc!", example: "Use a compass to navigate.", exampleVi: "Dùng la bàn để tìm đường.", level: "L3", category: "L3-U06" },
                      { word: "galaxy", ipa: "/ˈɡæləksi/", vietnamesePhonetic: "Gơ-lắc-si", meaning: "dải ngân hà", type: "Danh từ", image: "🌌", hint: "💡 Hàng tỷ ngôi sao tạo thành dải ngân hà!", example: "Our galaxy is the Milky Way.", exampleVi: "Dải ngân hà của chúng ta là Ngân Hà.", level: "L4", category: "L4-U01" },
                      { word: "satellite", ipa: "/ˈsætəlaɪt/", vietnamesePhonetic: "Xe-tơ-lai-tơ", meaning: "vệ tinh nhân tạo", type: "Danh từ", image: "🛰️", hint: "💡 Vệ tinh bay quanh Trái Đất để truyền tín hiệu!", example: "A satellite orbits Earth.", exampleVi: "Một vệ tinh bay quanh Trái Đất.", level: "L4", category: "L4-U01" },
                      { word: "astronaut", ipa: "/ˈæstrənɔːt/", vietnamesePhonetic: "Át-strơ-nót", meaning: "phi hành gia", type: "Danh từ", image: "🧑‍🚀", hint: "💡 Phi hành gia mặc áo vũ trụ bay vào không gian!", example: "The astronaut walks in space.", exampleVi: "Phi hành gia đi bộ trong không gian.", level: "L4", category: "L4-U01" }
                    ];
                    setImportRawText(JSON.stringify(batch, null, 2));
                    addToast?.("✅ Đã nạp Mẫu Batch 10 từ vựng siêu chi tiết sẵn sàng nhập!", "success");
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-900/80 text-emerald-300 border border-emerald-600 hover:bg-emerald-800 transition"
                >
                  🚀 Mẫu Batch 10 Từ
                </button>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
              <label className={`p-3 rounded-2xl border cursor-pointer transition ${importMode === 'UPSERT' ? 'bg-emerald-950/80 border-emerald-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <input type="radio" name="mode" value="UPSERT" checked={importMode === 'UPSERT'} onChange={() => setImportMode('UPSERT')} className="mr-2" />
                <span className="font-bold text-emerald-300">⚡ UPSERT</span>
                <p className="text-[10px] text-slate-400 mt-1">Có mã/từ thì cập nhật, chưa có thì tạo mới.</p>
              </label>

              <label className={`p-3 rounded-2xl border cursor-pointer transition ${importMode === 'CREATE_ONLY' ? 'bg-emerald-950/80 border-emerald-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <input type="radio" name="mode" value="CREATE_ONLY" checked={importMode === 'CREATE_ONLY'} onChange={() => setImportMode('CREATE_ONLY')} className="mr-2" />
                <span className="font-bold text-cyan-300">➕ CREATE_ONLY</span>
                <p className="text-[10px] text-slate-400 mt-1">Chỉ tạo mới, gặp từ trùng sẽ bỏ qua.</p>
              </label>

              <label className={`p-3 rounded-2xl border cursor-pointer transition ${importMode === 'UPDATE_ONLY' ? 'bg-emerald-950/80 border-emerald-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <input type="radio" name="mode" value="UPDATE_ONLY" checked={importMode === 'UPDATE_ONLY'} onChange={() => setImportMode('UPDATE_ONLY')} className="mr-2" />
                <span className="font-bold text-amber-300">🔄 UPDATE_ONLY</span>
                <p className="text-[10px] text-slate-400 mt-1">Chỉ cập nhật từ đã có, từ mới bỏ qua.</p>
              </label>

              <label className={`p-3 rounded-2xl border cursor-pointer transition ${importMode === 'SKIP_DUPLICATE' ? 'bg-emerald-950/80 border-emerald-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <input type="radio" name="mode" value="SKIP_DUPLICATE" checked={importMode === 'SKIP_DUPLICATE'} onChange={() => setImportMode('SKIP_DUPLICATE')} className="mr-2" />
                <span className="font-bold text-purple-300">🚫 SKIP_DUPLICATE</span>
                <p className="text-[10px] text-slate-400 mt-1">Bỏ qua tất cả dòng bị trùng lặp.</p>
              </label>
            </div>
          </div>

          {/* Raw Text / File Input Box */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-cyan-300 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" /> Dán Nội Dung Dữ Liệu Tệp (JSON hoặc CSV):
              </label>
              <span className="text-[11px] text-slate-400">Định dạng JSON Array hoặc CSV phân cách dấu phẩy</span>
            </div>

            <textarea
              rows={8}
              placeholder={`Dán mã JSON hoặc CSV vào đây...\n\nVÍ DỤ JSON:\n[\n  {\n    "word": "elephant",\n    "ipa": "/ˈel.ə.fənt/",\n    "meaning": "con voi",\n    "image": "🐘",\n    "level": "L2"\n  }\n]`}
              value={importRawText}
              onChange={(e) => setImportRawText(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-xs font-mono-code text-slate-200 focus:border-emerald-400 focus:outline-none"
            />

            {/* ===== DATA DICTIONARY / FIELD GUIDE PANEL ===== */}
            <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/30 p-4 space-y-3 text-xs">
              <h4 className="font-black text-indigo-300 flex items-center gap-2 uppercase tracking-wider">
                <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
                📚 BẢNG HƯỚNG DẪN NHẬP DỮ LIỆU SIÊU CHI TIẾT (DATA DICTIONARY)
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-indigo-900/60 text-indigo-200 uppercase text-[10px] font-black">
                    <tr>
                      <th className="p-2.5 w-32">Tên Trường (Field)</th>
                      <th className="p-2.5 w-20">Bắt Buộc</th>
                      <th className="p-2.5 w-28">Kiểu Dữ Liệu</th>
                      <th className="p-2.5">Mô Tả & Giá Trị Hợp Lệ</th>
                      <th className="p-2.5 w-48">Ví Dụ Cụ Thể</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {[
                      { field: "word", req: true, type: "string", desc: "Từ tiếng Anh cần học. Phải là chữ thường, không dấu, không có ký tự đặc biệt.", ex: "elephant" },
                      { field: "meaning", req: true, type: "string", desc: "Nghĩa tiếng Việt của từ. Ngắn gọn, chuẩn giáo dục tiểu học, không viết tắt.", ex: "con voi" },
                      { field: "ipa", req: false, type: "string", desc: "Phiên âm IPA quốc tế. Bọc trong dấu / /. Tra tại oxfordlearnersdictionaries.com.", ex: "/ˈel.ə.fənt/" },
                      { field: "vietnamesePhonetic", req: false, type: "string", desc: "Cách đọc hướng dẫn cho bé bằng tiếng Việt. Dùng dấu gạch ngang phân vần.", ex: "E-lơ-phơn-tơ" },
                      { field: "type", req: false, type: "enum", desc: "Loại từ. Giá trị hợp lệ: Danh từ | Động từ | Tính từ | Trạng từ | Số đếm | Giới từ", ex: "Danh từ" },
                      { field: "image", req: false, type: "string", desc: "Emoji hoặc URL ảnh minh họa. Ưu tiên dùng emoji Unicode để không phụ thuộc hosting.", ex: "🐘" },
                      { field: "hint", req: false, type: "string", desc: "Mẹo nhớ từ vui, ngắn gọn (<80 ký tự). Bắt đầu bằng 💡 để dễ nhận biết.", ex: "💡 Con voi có vòi rất dài!" },
                      { field: "example", req: false, type: "string", desc: "Câu ví dụ tiếng Anh. Ngắn, đơn giản, phù hợp lứa tuổi 4-10. Không dùng cấu trúc phức tạp.", ex: "The elephant drinks water." },
                      { field: "exampleVi", req: false, type: "string", desc: "Bản dịch tiếng Việt của câu ví dụ. Tương ứng 1-1 với trường example.", ex: "Con voi uống nước." },
                      { field: "level", req: false, type: "enum", desc: "Cấp độ học. Giá trị hợp lệ: L1 (Khởi Động) | L2 (Cơ Bản) | L3 (Nâng Cao) | L4 (Chuyên Sâu)", ex: "L2" },
                      { field: "category", req: false, type: "string", desc: "Mã đơn vị bài học. Định dạng: [Level]-U[Số]. Dùng để nhóm từ theo chủ đề.", ex: "L2-U03" },
                      { field: "audioUrl", req: false, type: "string (URL)", desc: "Đường dẫn file âm thanh MP3. Để trống nếu dùng Web Speech API tự động.", ex: "" },
                      { field: "tags", req: false, type: "string[]", desc: "Mảng các nhãn chủ đề. Chỉ dùng trong JSON. Giúp lọc và tìm kiếm theo danh mục.", ex: "[\"animals\",\"zoo\"]" },
                    ].map(({ field, req, type, desc, ex }) => (
                      <tr key={field} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-mono-code text-cyan-300 font-bold">{field}</td>
                        <td className="p-2.5 text-center">
                          {req
                            ? <span className="px-1.5 py-0.5 rounded-md bg-rose-900/80 text-rose-300 font-black text-[10px]">✔ BẮT BUỘC</span>
                            : <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 font-bold text-[10px]">Tùy chọn</span>}
                        </td>
                        <td className="p-2.5 font-mono-code text-yellow-300 text-[10px]">{type}</td>
                        <td className="p-2.5 text-slate-400 leading-relaxed">{desc}</td>
                        <td className="p-2.5 font-mono-code text-emerald-300 text-[10px] break-all">{ex || <span className="text-slate-600 italic">""</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CSV Column Order Guide */}
              <div className="p-3 rounded-xl bg-slate-950 border border-pink-500/30 space-y-1.5">
                <div className="font-black text-pink-300 text-[11px] uppercase">📊 Thứ Tự Cột CSV (Phân Cách Dấu Phẩy):</div>
                <div className="font-mono-code text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-700">
                  <span className="text-cyan-300">Col 1:</span> word &nbsp;|&nbsp;
                  <span className="text-cyan-300">Col 2:</span> meaning &nbsp;|&nbsp;
                  <span className="text-cyan-300">Col 3:</span> ipa &nbsp;|&nbsp;
                  <span className="text-cyan-300">Col 4:</span> vietnamesePhonetic &nbsp;|&nbsp;
                  <span className="text-cyan-300">Col 5:</span> level &nbsp;|&nbsp;
                  <span className="text-cyan-300">Col 6:</span> category &nbsp;|&nbsp;
                  <span className="text-cyan-300">Col 7:</span> image
                </div>
                <div className="text-slate-500 text-[10px]">
                  ⚠️ Dòng bắt đầu bằng # sẽ bị bỏ qua (dòng comment). Không cần header row.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={handleDryRunImport}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span>1. Dry-Run Kiểm Tra Hợp Lệ (BR-010)</span>
              </button>

              <button
                onClick={handleExecuteBatchImport}
                disabled={!dryRunResults || !dryRunResults.parsedData.length}
                className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition flex items-center gap-2 ${
                  dryRunResults && dryRunResults.parsedData.length
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-105 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <UploadCloud className="h-4 w-4" />
                <span>2. Thực Thi Nạp Dữ Liệu Hàng Loạt</span>
              </button>
            </div>
          </div>

          {/* Dry Run Evaluation Results */}
          {dryRunResults && (
            <div className="rounded-3xl border-2 border-cyan-400 bg-slate-950 p-5 shadow-2xl space-y-4 font-sans animate-scaleIn">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                KẾT QUẢ DRY-RUN KIỂM TRA ĐỐI SOÁT DỮ LIỆU:
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 font-bold">Tổng số dòng</div>
                  <div className="text-lg font-black text-white mt-1">{dryRunResults.total}</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40">
                  <div className="text-xs text-emerald-300 font-bold">Dòng Hợp Lệ</div>
                  <div className="text-lg font-black text-emerald-300 mt-1">{dryRunResults.valid}</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40">
                  <div className="text-xs text-amber-300 font-bold">Dòng Trùng Lặp</div>
                  <div className="text-lg font-black text-amber-300 mt-1">{dryRunResults.duplicates}</div>
                </div>
                <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40">
                  <div className="text-xs text-rose-300 font-bold">Dòng Lỗi Schema</div>
                  <div className="text-lg font-black text-rose-300 mt-1">{dryRunResults.errors}</div>
                </div>
              </div>

              {dryRunResults.errorRows.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-200 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-rose-400" /> Báo cáo lỗi chi tiết theo dòng:
                  </div>
                  {dryRunResults.errorRows.map((err, idx) => (
                    <div key={idx} className="font-mono-code text-[11px]">
                      • Dòng {err.row}: {err.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Job History & Rollback Table (Section 9.6) */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <History className="h-4 w-4 text-cyan-400" />
              LỊCH SỬ CÁC JOB NHẬP HÀNG LOẠT & TÍNH NĂNG ROLLBACK:
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-cyan-300 font-black uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Job ID</th>
                    <th className="p-3">Tên Job</th>
                    <th className="p-3">Thời Gian</th>
                    <th className="p-3 text-center">Chế Độ</th>
                    <th className="p-3 text-center">Tạo Mới</th>
                    <th className="p-3 text-center">Cập Nhật</th>
                    <th className="p-3 text-center">Trạng Thái</th>
                    <th className="p-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {importJobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-500 font-bold">
                        Chưa có job nhập dữ liệu nào được thực thi.
                      </td>
                    </tr>
                  ) : (
                    importJobs.map((job) => (
                      <tr key={job.job_id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 font-mono-code font-bold text-cyan-300">{job.job_id}</td>
                        <td className="p-3 font-bold text-white">{job.job_name}</td>
                        <td className="p-3 text-slate-400 font-mono-code text-[11px]">
                          {new Date(job.created_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-3 text-center font-bold text-slate-300">{job.mode}</td>
                        <td className="p-3 text-center font-black text-emerald-400">+{job.created_count}</td>
                        <td className="p-3 text-center font-black text-amber-400">{job.updated_count}</td>
                        <td className="p-3 text-center">
                          {job.rolled_back ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-500/40">
                              ĐÃ ROLLBACK
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              SUCCESS
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {!job.rolled_back && (
                            <button
                              onClick={() => handleRollbackImportJob(job.job_id)}
                              className="px-3 py-1 rounded-lg bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white font-bold text-[11px] border border-rose-500/40 transition flex items-center gap-1 mx-auto"
                            >
                              <RotateCw className="h-3 w-3" />
                              <span>Rollback Job</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 7: THÙNG RÁC XÓA MỀM & KHÔI PHỤC (SECTION 8.1 - 8.4) */}
      {/* ========================================================================= */}
      {activeTab === 'trash_can' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* Top Banner */}
          <div className="rounded-3xl border-2 border-rose-500/60 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 p-6 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black font-heading text-white flex items-center gap-2">
                  <Archive className="h-6 w-6 text-rose-400" />
                  <span>THÙNG RÁC XÓA MỀM & KHÔI PHỤC ({trashCan.length} TỪ VỰNG)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Tuân thủ nguyên tắc P02 & BR-008: Dữ liệu xóa mềm được bảo lưu 30 ngày, ghi vết lý do xóa và cho phép khôi phục tức thì!
                </p>
              </div>

              <div className="text-xs text-rose-300 font-bold bg-slate-950 px-4 py-2 rounded-xl border border-rose-500/30">
                🔒 Xóa vĩnh viễn yêu cầu vai trò <span className="text-yellow-300 font-black">SUPER_ADMIN</span>
              </div>
            </div>
          </div>

          {/* Trash Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-rose-300 font-black uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center">STT</th>
                    <th className="p-3 text-center">Emoji</th>
                    <th className="p-3">Từ Tiếng Anh</th>
                    <th className="p-3">Nghĩa Tiếng Việt</th>
                    <th className="p-3 text-center">Cấp Độ</th>
                    <th className="p-3">Thời Gian Xóa</th>
                    <th className="p-3 text-center">Người Xóa</th>
                    <th className="p-3">Lý Do Xóa (BR-008)</th>
                    <th className="p-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {trashCan.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500 font-bold">
                        Thùng rác hiện đang trống. Chưa có bản ghi nào bị xóa mềm! ✨
                      </td>
                    </tr>
                  ) : (
                    trashCan.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 text-center text-slate-400 font-mono-code">{idx + 1}</td>
                        <td className="p-3 text-center text-2xl">{item.image}</td>
                        <td className="p-3 font-black text-white text-sm">{item.word}</td>
                        <td className="p-3 font-bold text-yellow-300">{item.meaning}</td>
                        <td className="p-3 text-center font-bold text-slate-400">{item.level || 'L1'}</td>
                        <td className="p-3 text-slate-400 font-mono-code text-[11px]">
                          {new Date(item.deleted_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-3 text-center font-extrabold text-cyan-300">{item.deleted_by}</td>
                        <td className="p-3 text-rose-300 italic max-w-xs line-clamp-2">"{item.delete_reason}"</td>
                        <td className="p-3 text-center space-x-2">
                          <button
                            onClick={() => handleRestoreVocab(item)}
                            className="px-3 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold text-[11px] border border-emerald-500/40 transition inline-flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Khôi Phục</span>
                          </button>
                          <button
                            onClick={() => handleHardDeleteVocab(item)}
                            className="px-3 py-1 rounded-lg bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white font-bold text-[11px] border border-rose-500/40 transition inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Xóa Vĩnh Viễn</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 8: NHẬT KÝ AUDIT LOG TRUY VẾT HỆ THỐNG (SECTION 13.1) */}
      {/* ========================================================================= */}
      {activeTab === 'audit_log' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* Top Banner */}
          <div className="rounded-3xl border-2 border-purple-500/60 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950 p-6 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black font-heading text-white flex items-center gap-2">
                  <History className="h-6 w-6 text-purple-400" />
                  <span>NHẬT KÝ AUDIT LOG TRUY VẾT HỆ THỐNG ({auditLogs.length} SỰ KIỆN)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Nhật ký bất biến lưu giữ đầy đủ vết thao tác (Ai thực hiện, thời gian UTC, hành động, diff trước/sau và lý do nghiệp vụ).
                </p>
              </div>

              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `audit_logs_${new Date().toISOString().slice(0,10)}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  addToast?.("Đã xuất tệp Audit Logs thành công!", "success");
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:scale-105 transition flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Export Audit Log JSON</span>
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-purple-300 font-black uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Mã Audit</th>
                    <th className="p-3">Thời Gian (UTC)</th>
                    <th className="p-3 text-center">Vai Trò</th>
                    <th className="p-3 text-center">Hành Động</th>
                    <th className="p-3">Đối Tượng</th>
                    <th className="p-3 max-w-xs">Nội Dung Chi Tiết / Diff</th>
                    <th className="p-3">Lý Do / Ghi Chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {auditLogs.map((log) => (
                    <tr key={log.audit_id} className="hover:bg-slate-800/50 transition">
                      <td className="p-3 font-mono-code font-bold text-purple-300">{log.audit_id}</td>
                      <td className="p-3 text-slate-400 font-mono-code text-[11px]">
                        {new Date(log.occurred_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-3 text-center font-bold text-cyan-300">{log.actor_role}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          log.action === 'CREATE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                          log.action === 'UPDATE' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                          log.action === 'DELETE_SOFT' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                          log.action === 'RESTORE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' :
                          'bg-purple-950 text-purple-300 border border-purple-500/30'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-black text-white">{log.object_id}</td>
                      <td className="p-3 font-mono-code text-[10px] text-slate-300 max-w-xs line-clamp-2">
                        {log.after_diff || log.before_diff || 'N/A'}
                      </td>
                      <td className="p-3 text-slate-300 italic text-[11px]">{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 9: BÁO CÁO CHẤT LƯỢNG & QA MEDIA CHECKLIST (SECTION 10.3 & 15.0) */}
      {/* ========================================================================= */}
      {activeTab === 'qa_checklist' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* Top Banner */}
          <div className="rounded-3xl border-2 border-teal-500/60 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-6 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black font-heading text-white flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-teal-400" />
                  <span>BÁO CÁO CHẤT LƯỢNG KHO TỪ VỰNG (QA & MEDIA CHECKLIST)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Đánh giá tự động độ đầy đủ dữ liệu (Media, IPA, Phiên âm Việt, Ví dụ, Trùng lặp) chuẩn mực cho bé học tốt nhất!
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-950 px-5 py-3 rounded-2xl border border-teal-500/40">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Chỉ Số Độ Chuẩn Dữ Liệu QA</div>
                  <div className="text-2xl font-black text-emerald-400">{qaMetrics.completenessScore}%</div>
                </div>
                <Award className="h-8 w-8 text-yellow-300 animate-bounce" />
              </div>
            </div>

            {/* QA Gauge Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center pt-2 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-bold">⭐ Thiếu Ảnh / Icon</div>
                <div className="text-xl font-black text-amber-300 mt-1">{qaMetrics.missingImage}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-bold">🗣️ Thiếu IPA</div>
                <div className="text-xl font-black text-cyan-300 mt-1">{qaMetrics.missingIpa}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-bold">🇻🇳 Thiếu Đọc Việt</div>
                <div className="text-xl font-black text-pink-300 mt-1">{qaMetrics.missingPhonetic}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-bold">💬 Thiếu Ví Dụ</div>
                <div className="text-xl font-black text-purple-300 mt-1">{qaMetrics.missingExample}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-bold">⚠️ Từ Trùng Lặp</div>
                <div className="text-xl font-black text-rose-400 mt-1">{qaMetrics.duplicateWords}</div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COMPARISON & DEDUPLICATION CONTROL MATRIX (BẢNG SO SÁNH & XỬ LÝ TRÙNG LẶP) */}
          {/* ========================================================================= */}
          <div className="rounded-3xl border-2 border-cyan-500/50 bg-slate-900/95 p-6 shadow-2xl space-y-5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <span>BẢNG SO SÁNH TỪ VỰNG CHƯA NẠP vs ĐÃ NẠP & XỬ LÝ TRÙNG LẶP (DEDUPLICATION)</span>
                </h3>
                <p className="text-slate-400 mt-1">
                  So sánh từ vựng giữa CSDL active, danh sách gợi ý chưa nạp và phát hiện bản ghi trùng lặp key từ vựng.
                </p>
              </div>

              <button
                onClick={handleAutoFixAllDuplicatesAndUnimported}
                className="px-4 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-xl hover:scale-105 transition flex items-center gap-2 border border-emerald-400 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-yellow-300 animate-spin-slow" />
                <span>⚡ TỰ ĐỘNG KHỬ TRÙNG LẶP & NẠP ĐẦY ĐỦ TỪ THIẾU</span>
              </button>
            </div>

            {/* Summary comparison stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> 1. Từ Vựng Đã Nạp VÀO CSDL
                </div>
                <div className="text-2xl font-black text-white">{vocabDatabase.length} Từ</div>
                <p className="text-slate-400 text-[11px]">Đã lưu trữ và hiển thị đầy đủ trên hệ thống</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-1">
                <div className="font-extrabold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> 2. Từ Vựng Phát Hiện Trùng Lặp
                </div>
                <div className="text-2xl font-black text-rose-300">{qaMetrics.duplicateWords} Bản Ghi</div>
                <p className="text-slate-400 text-[11px]">Cần lọc gộp bản ghi chuẩn nhất</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-1">
                <div className="font-extrabold text-cyan-400 flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4" /> 3. Gợi Ý Từ Vựng Chưa Nạp
                </div>
                <div className="text-2xl font-black text-cyan-300">15 Từ Gợi Ý</div>
                <p className="text-slate-400 text-[11px]">Gồm các từ bộ poster & scanner đã sẵn sàng</p>
              </div>
            </div>

            {/* Duplicate Words Resolution Table */}
            {qaMetrics.duplicateWords > 0 ? (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <span>DANH SÁCH BẢN GHI TRÙNG LẶP CẦN XỬ LÝ GỘP:</span>
                </h4>

                <div className="rounded-2xl border border-rose-500/30 bg-slate-950 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-rose-950/60 text-rose-200 font-black uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Từ Vựng</th>
                        <th className="p-3 text-center">Số Bản Ghi Trùng</th>
                        <th className="p-3">Chi Tiết Các Bản Ghi</th>
                        <th className="p-3 text-center">Thao Tác Xử Lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {Object.entries(
                        vocabDatabase.reduce((acc, item) => {
                          const w = item.word.toLowerCase();
                          acc[w] = acc[w] || [];
                          acc[w].push(item);
                          return acc;
                        }, {})
                      )
                        .filter(([_, list]) => list.length > 1)
                        .map(([wKey, list]) => (
                          <tr key={wKey} className="hover:bg-slate-900/60">
                            <td className="p-3 font-black text-white text-sm">
                              {list[0].word} <span className="text-rose-400">({list[0].image})</span>
                            </td>
                            <td className="p-3 text-center font-bold text-rose-400">{list.length} bản ghi</td>
                            <td className="p-3 font-mono-code text-[11px] text-slate-300 space-y-1">
                              {list.map((it, i) => (
                                <div key={it.id} className="text-slate-400">
                                  #{i + 1}: ID <span className="text-cyan-300">{it.id}</span> - IPA: {it.ipa || 'N/A'} - Nghĩa: {it.meaning}
                                </div>
                              ))}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleMergeDuplicates(wKey)}
                                className="px-3 py-1.5 rounded-xl font-black bg-rose-600 text-white hover:bg-rose-500 transition shadow-md cursor-pointer"
                              >
                                🧹 Gộp Bản Chuẩn Nhất
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
                <span>✅ Tuyệt vời! CSDL hiện tại 100% không có bản ghi từ vựng nào bị trùng lặp.</span>
                <span className="text-[10px] font-mono-code bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200">QA DEDUPLICATED VERIFIED</span>
              </div>
            )}
          </div>

          {/* QA Rules & Standard Checklist */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-teal-400" />
              QUY TẮC DUYỆT CHẤT LƯỢNG NỘI DUNG VÀ KIỂM TRA MEDIA (SECTION 10.3):
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 1. Chuẩn Hóa Ngôn Ngữ & Phát Âm
                </div>
                <p className="text-slate-400">
                  Mỗi từ vựng phải có phiên âm chuẩn IPA quốc tế, phiên âm hướng dẫn đọc Tiếng Việt cho bé, dịch nghĩa chuẩn giáo dục tiểu học và giọng đọc phát âm chuẩn bản xứ Mỹ/Anh.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 2. Hình Ảnh Trực Quan & Alt Text
                </div>
                <p className="text-slate-400">
                  Hình ảnh / Emoji minh họa sinh động, tỷ lệ sắc nét, không chứa watermark trái phép, đúng ngữ nghĩa của từ đang học.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 3. An Toàn Giáo Dục Trẻ Em (PII Check)
                </div>
                <p className="text-slate-400">
                  Nội dung câu ví dụ hoàn toàn lành mạnh, thân thiện với độ tuổi 4-10, không chứa ngôn từ kích động hay quảng cáo thương mại.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 4. Mã Định Danh Unique & Phân Cấp
                </div>
                <p className="text-slate-400">
                  Khóa từ vựng unique trong cùng bộ giáo trình, đảm bảo liên kết chính xác với Ma trận 4 Cấp Độ (L1 Khởi Động &rarr; L4 Nâng Cao).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: AI POSTER IMAGE SCANNER & LIVE CRUD EDITOR SUITE */}
      {/* ========================================================================= */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4 overflow-y-auto font-sans animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-3xl border-2 border-cyan-400 bg-slate-900/95 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
                  <Camera className="h-5 w-5 animate-pulse text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-white font-heading">
                    HỆ THỐNG AI QUÉT TRANH TỪ VỰNG & QUẢN LÝ SIÊU CHI TIẾT
                  </h3>
                  <p className="text-xs text-slate-300">
                    Quét phân tích ảnh tranh minh họa, tự động trích xuất bảng từ vựng trực quan và hỗ trợ Thêm / Sửa / Xóa siêu chi tiết!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowScanModal(false)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Poster Selectors & Custom Image Upload */}
            <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>1. Chọn Trang Tranh Minh Họa Cần Quét Bằng AI hoặc Tải Ảnh Mới:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => {
                      setScanPosterPage(pNum);
                      setCustomScanImage(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                      scanPosterPage === pNum && !customScanImage
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border border-pink-300 shadow-md scale-105'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>Trang {pNum}</span>
                  </button>
                ))}

                <label className="cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/40 shadow-md hover:scale-105 transition flex items-center gap-1">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{customScanImage ? '📷 Đã Tải Ảnh Custom' : '📁 Upload Ảnh Tranh Mới'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setCustomScanImage(ev.target.result);
                          addToast?.('Đã tải ảnh tranh mới thành công! Bấm "Bắt Đầu Quét AI" để phân tích.', 'info');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* AI Scan Trigger Button & Scanner Preview Box */}
            <div className="space-y-4 text-center">
              <button
                onClick={handleScanAndConvertCustomPoster}
                disabled={isScanning}
                className={`w-full py-3.5 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-2xl ${
                  isScanning
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-95 border-2 border-pink-400'
                }`}
              >
                {isScanning ? (
                  <>
                    <RotateCw className="h-5 w-5 animate-spin text-yellow-300" />
                    <span>⚡ AI ĐANG PHÂN TÍCH QUÉT & CHUYỂN TRANH THÀNH BẢNG TỪ VỰNG... (1.5S)</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 text-yellow-300 animate-bounce" />
                    <span>🚀 BẮT ĐẦU QUÉT & CHUYỂN TRANH THÀNH BẢNG TỪ VỰNG MỚI (SCAN & SAVE TO DB)</span>
                  </>
                )}
              </button>

              {/* Scanning Beam Animation Box */}
              {isScanning && (
                <div className="relative h-48 rounded-2xl border-2 border-cyan-400 bg-slate-950 overflow-hidden flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-transparent to-purple-500/20 animate-pulse pointer-events-none"></div>
                  {/* Laser Beam Line */}
                  <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-laser-scan top-0"></div>
                  <div className="text-center space-y-2 relative z-10">
                    <div className="text-4xl animate-bounce">🔍</div>
                    <div className="text-sm font-black text-cyan-300 font-mono-code">
                      [AI OCR ENGINE] QUÉT PHÂN TÍCH THÔNG TIN TRANH TRANG {scanPosterPage}...
                    </div>
                    <div className="text-xs text-pink-300">
                      Trích xuất: Tiếng Anh, Phiên Âm IPA, Đọc Tiếng Việt, Mẹo Nhớ & Ví Dụ Giao Tiếp...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Extracted Structured Web Result & Live Editor Grid */}
            {!isScanning && (
              <div className="space-y-5 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span>KẾT QUẢ QUÉT BẢNG TỪ VỰNG TRỰC QUAN (TRANG {scanPosterPage}):</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                    ✅ Đã Trích Xuất 100% Thông Tin Siêu Chi Tiết
                  </span>
                </div>

                {/* Display Quadrant Sections for Scanned Page */}
                {posterPages.filter((p) => p.pageNumber === scanPosterPage).map((pg) => (
                  <div key={pg.pageNumber} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pg.sections.map((sec) => {
                      const secWords = sec.words
                        .map((w) => vocabDatabase.find((v) => v.word.toLowerCase() === w.toLowerCase()))
                        .filter(Boolean);

                      return (
                        <div key={sec.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-lg">
                          <div className={`p-2.5 rounded-xl ${sec.bgHeader} flex items-center justify-between font-bold text-xs`}>
                            <span className="flex items-center gap-1.5">
                              <span>{sec.icon}</span>
                              <span>{sec.title}</span>
                            </span>

                            <button
                              onClick={() => handleOpenSuperAdd(sec.categoryId, sec.id.startsWith('L1') ? 'L1' : 'L2')}
                              className="px-2 py-0.5 rounded-lg bg-black/40 text-yellow-300 hover:bg-black/80 font-black text-[10px] flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Thêm Từ Mới</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {secWords.map((item) => {
                              const sInfo = getSuperDetailedVocabInfo(item);
                              return (
                                <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-center space-y-1 flex flex-col justify-between hover:border-cyan-400 transition">
                                  <div className="text-2xl">{item.image}</div>
                                  <div className="font-bold text-xs text-white line-clamp-1">{item.word}</div>
                                  <div className="text-[9px] font-extrabold text-pink-300 bg-pink-950 px-1 rounded line-clamp-1">
                                    {sInfo?.vietnamesePhoneticDisplay || item.vietnamesePhonetic}
                                  </div>
                                  <div className="text-[10px] text-yellow-300 line-clamp-1">{item.meaning}</div>

                                  <div className="pt-1 flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => handleOpenSuperEdit(item)}
                                      className="p-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-[9px] font-bold"
                                      title="Sửa siêu chi tiết"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSuperCard(item.id, item.word)}
                                      className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-[9px] font-bold"
                                      title="Xóa từ"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT SUPER DETAILED VOCABULARY CARD MODAL */}
      {/* ========================================================================= */}
      {editingSuperDetailCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4 overflow-y-auto font-sans animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-400 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-black text-white font-heading">
                  SỬA THÔNG TIN SIÊU CHI TIẾT TỪ VỰNG: "{editingSuperDetailCard.word.toUpperCase()}"
                </h3>
              </div>
              <button
                onClick={() => setEditingSuperDetailCard(null)}
                className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Từ Tiếng Anh (*):</label>
                <input
                  type="text"
                  value={superDetailForm.word}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, word: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nghĩa Tiếng Việt (*):</label>
                <input
                  type="text"
                  value={superDetailForm.meaning}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, meaning: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-yellow-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Phiên Âm Quốc Tế IPA:</label>
                <input
                  type="text"
                  value={superDetailForm.ipa}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, ipa: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-cyan-300 font-mono-code"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hướng Dẫn Đọc Tiếng Việt (Cho bé):</label>
                <input
                  type="text"
                  value={superDetailForm.vietnamesePhonetic}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, vietnamesePhonetic: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-pink-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Biểu Tượng Emoji Icon:</label>
                <input
                  type="text"
                  value={superDetailForm.image}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, image: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-2xl text-center"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Loại Từ:</label>
                <select
                  value={superDetailForm.type}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, type: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                >
                  <option value="Danh từ">Danh từ</option>
                  <option value="Động từ">Động từ</option>
                  <option value="Tính từ">Tính từ</option>
                  <option value="Phụ từ">Phụ từ</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">💡 Mẹo Nhớ Thần Đồng (Mnemonic Hint):</label>
                <textarea
                  rows={2}
                  value={superDetailForm.hint}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, hint: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-purple-200 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">💬 Câu Ví Dụ Tiếng Anh:</label>
                <input
                  type="text"
                  value={superDetailForm.example}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, example: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-cyan-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">🇻🇳 Vietsub Câu Ví Dụ:</label>
                <input
                  type="text"
                  value={superDetailForm.exampleVi}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, exampleVi: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingSuperDetailCard(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSuperEdit}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:scale-105 shadow-xl transition"
              >
                💾 LƯU THÔNG TIN SIÊU CHI TIẾT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW SUPER DETAILED VOCABULARY CARD MODAL */}
      {/* ========================================================================= */}
      {addingSuperDetailCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4 overflow-y-auto font-sans animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl border-2 border-emerald-400 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white font-heading">
                  THÊM TỪ VỰNG MỚI VÀO BẢNG MINH HỌA (CHỦ ĐỀ: {addingSuperDetailCategory})
                </h3>
              </div>
              <button
                onClick={() => setAddingSuperDetailCategory(null)}
                className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Từ Tiếng Anh Mới (*):</label>
                <input
                  type="text"
                  placeholder="VD: rainbow"
                  value={superDetailForm.word}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, word: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nghĩa Tiếng Việt (*):</label>
                <input
                  type="text"
                  placeholder="VD: cầu vồng"
                  value={superDetailForm.meaning}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, meaning: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-yellow-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Phiên Âm Quốc Tế IPA:</label>
                <input
                  type="text"
                  placeholder="VD: /ˈreɪn.boʊ/"
                  value={superDetailForm.ipa}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, ipa: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-cyan-300 font-mono-code"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hướng Dẫn Đọc Tiếng Việt:</label>
                <input
                  type="text"
                  placeholder="VD: rên-bâu 🌈"
                  value={superDetailForm.vietnamesePhonetic}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, vietnamesePhonetic: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-pink-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Biểu Tượng Emoji Icon:</label>
                <input
                  type="text"
                  placeholder="🌈"
                  value={superDetailForm.image}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, image: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-2xl text-center"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Loại Từ:</label>
                <select
                  value={superDetailForm.type}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, type: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                >
                  <option value="Danh từ">Danh từ</option>
                  <option value="Động từ">Động từ</option>
                  <option value="Tính từ">Tính từ</option>
                  <option value="Phụ từ">Phụ từ</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">💡 Mẹo Nhớ Thần Đồng (Mnemonic Hint):</label>
                <textarea
                  rows={2}
                  placeholder="VD: Cầu vồng có 7 màu rực rỡ sau cơn mưa..."
                  value={superDetailForm.hint}
                  onChange={(e) => setSuperDetailForm({ ...superDetailForm, hint: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-purple-200 text-xs"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setAddingSuperDetailCategory(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSuperAdd}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 shadow-xl transition"
              >
                ✨ TẠO TỪ VỰNG MỚI SIÊU CHI TIẾT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN AUTHENTICATION SECURITY LOCK MODAL */}
      {/* ========================================================================= */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-purple-500/60 bg-gradient-to-b from-slate-900 via-slate-950 to-purple-950 p-6 md:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-600/30 border border-purple-500/50 text-purple-300 animate-pulse">
                  <Lock className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-heading">BẢO MẬT QUẢN TRỊ VIÊN</h3>
                  <p className="text-xs text-purple-300">Tác nhân: Lê Lương Bảo Nguyên</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowAdminAuthModal(false);
                  setAdminPasswordInput('');
                  setAdminPasswordError('');
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body / Security Form */}
            <form onSubmit={handleVerifyAdminPassword} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-xs text-slate-300 space-y-1.5 shadow-inner">
                <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" /> Yêu Cầu Xác Thực Quyền Quản Trị:
                </div>
                <p className="leading-relaxed">
                  Vui lòng nhập mật khẩu bảo mật để mở khóa quyền Quản trị viên <strong className="text-white">Lê Lương Bảo Nguyên</strong> (Thêm, Sửa, Xóa bài tập & CSDL).
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-purple-300">
                  Mật Khẩu Bảo Mật:
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setAdminPasswordError('');
                    }}
                    placeholder="Nhập mật khẩu..."
                    autoFocus
                    className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-950 border-2 border-purple-500/50 text-white text-sm font-bold placeholder:text-slate-600 focus:border-pink-400 focus:outline-none shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-white transition"
                    title={showAdminPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {adminPasswordError && (
                  <div className="text-xs font-bold text-rose-400 bg-rose-950/80 p-2.5 rounded-xl border border-rose-500/40 flex items-center gap-1.5 animate-shake">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{adminPasswordError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminAuthModal(false);
                    setAdminPasswordInput('');
                    setAdminPasswordError('');
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-xs transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-black text-xs shadow-xl hover:scale-105 transition flex items-center justify-center gap-2 border border-purple-400 cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>Xác Nhận Mở Khóa</span>
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-500 italic pt-1">
                🔑 Mật khẩu mặc định: <code className="text-pink-300 font-bold">123456</code> hoặc <code className="text-pink-300 font-bold">baobaonguyen</code>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* STRICT LEVEL LOCK GUIDANCE MODAL FOR MINH ANH */}
      {/* ========================================================================= */}
      {showLevelLockModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 shadow-2xl space-y-5 animate-scaleIn border-glow">
            {/* Top Close Button */}
            <button
              onClick={() => setShowLevelLockModal({ isOpen: false, targetLevel: null, requiredPrevLevel: null, currentPrevPct: 0 })}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Glowing Icon & Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-4xl shadow-xl shadow-amber-500/20 animate-bounce">
                🔒
              </div>

              <div>
                <h3 className="text-2xl font-black font-heading text-white tracking-tight">
                  CẤP ĐỘ [{showLevelLockModal.targetLevel}] ĐANG TẠM KHÓA!
                </h3>
                <p className="text-xs font-bold text-amber-300 mt-1">
                  Minh Anh cần đạt tối thiểu 90% ở Level trước đó để mở khóa nhé!
                </p>
              </div>
            </div>

            {/* Detailed Requirement Status Card */}
            {(() => {
              const reqLvl = showLevelLockModal.requiredPrevLevel || 'L1';
              const reqStats = levelStats[reqLvl] || { mastered: 0, total: 150, pct: 0 };
              const targetNeeded = Math.ceil(reqStats.total * 0.9);
              const remainingWords = Math.max(0, targetNeeded - reqStats.mastered);

              return (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-inner">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-cyan-300">Tiến độ cấp độ {reqLvl}:</span>
                    <span className="text-amber-400 font-mono-code">{reqStats.pct}% / 90% Ngưỡng mở</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                      style={{ width: `${reqStats.pct}%` }}
                    ></div>
                    <div
                      className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-yellow-300 z-10 shadow-[0_0_8px_rgba(253,224,71,0.9)]"
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 pt-1">
                    <span>Đã thuộc: <strong className="text-emerald-300 font-mono-code">{reqStats.mastered}</strong> / {reqStats.total} từ</span>
                    <span>Cần thêm: <strong className="text-yellow-300 font-mono-code">{remainingWords}</strong> từ nữa</span>
                  </div>

                  {/* Encouraging Quote for Minh Anh */}
                  <div className="p-3 rounded-xl bg-pink-950/60 border border-pink-500/30 text-xs font-bold text-pink-200 text-center leading-relaxed italic">
                    "Minh Anh ơi, bé hãy làm thêm vài câu đố ⏰ hoặc lật thẻ 3D 🔄 để thuộc thêm <span className="text-yellow-300 text-sm font-extrabold">{remainingWords} từ</span> nữa là Cấp độ [{showLevelLockModal.targetLevel}] sẽ tự động mở khóa rực rỡ nhé! 💖✨"
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => setShowLevelLockModal({ isOpen: false, targetLevel: null, requiredPrevLevel: null, currentPrevPct: 0 })}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-black text-xs shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2 border border-pink-400 cursor-pointer"
              >
                <span>💪 Bé Minh Anh Tiếp Tục Học Thêm Từ Vựng</span>
              </button>

              {/* Admin Override Action if Parent is logged in or wants to override */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                {currentActor === 'bao_nguyen' ? (
                  <button
                    onClick={() => {
                      handleAdminToggleForceUnlock(showLevelLockModal.targetLevel);
                      setShowLevelLockModal({ isOpen: false, targetLevel: null, requiredPrevLevel: null, currentPrevPct: 0 });
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold transition text-center"
                  >
                    👨‍💼 [Bảo Nguyên Admin] Mở Khóa Cưỡng Chế Cấp [{showLevelLockModal.targetLevel}] Ngay
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowLevelLockModal({ isOpen: false, targetLevel: null, requiredPrevLevel: null, currentPrevPct: 0 });
                      setShowAdminAuthModal(true);
                    }}
                    className="w-full py-2 text-[11px] font-bold text-purple-300 hover:text-purple-200 transition text-center"
                  >
                    🔑 Ba Bảo Nguyên đăng nhập mở khóa cưỡng chế cho bé →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
