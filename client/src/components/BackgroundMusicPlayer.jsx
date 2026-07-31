import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, SkipForward, Plus, Trash2, Settings, Sparkles, Upload, Image as ImageIcon, Video, Eye, Shield } from 'lucide-react';

const DEFAULT_CUTE_TRACKS = [
  {
    id: 'synth_soothing_1',
    title: '🌸 Giai Điệu Dài Du Dương & Êm Diệu (Peaceful Lullaby Arpeggio)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'soothing_long',
    url: '',
  },
  {
    id: 'synth_soothing_2',
    title: '🌈 Nhạc Lofi Dừa Thư Giãn Dành Cho Bé Học Tập (Relaxing Lofi Loop)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'lofi_gentle',
    url: '',
  },
  {
    id: 'synth_soothing_3',
    title: '🦄 Tiếng Đàn Piano Dài & Thong Dong (Peaceful Piano Garden)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'piano_calm',
    url: '',
  },
  {
    id: 'synth_soothing_4',
    title: '🎀 Vũ Điệu Hạc Giấy & Tiếng Đàn Tranh Ru Êm (Paper Crane Dreams)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'oriental_harp',
    url: '',
  },
  {
    id: 'synth_soothing_5',
    title: '✨ Bản Nhạc Ngôi Sao Đêm Lấp Lánh Du Dương (Starlight Celestial)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'starlight_chime',
    url: '',
  },
  {
    id: 'synth_soothing_6',
    title: '🍭 Tiệm Bánh Ngọt Ngào & Tiếng Chuông Gió (Sweet Bakery Chimes)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'sweet_bakery',
    url: '',
  },
  {
    id: 'synth_soothing_7',
    title: '🌊 Tiếng Sóng Biển Hoàng Hôn Ru Giấc Ngủ (Ocean Sunset Lullaby)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'ocean_waves',
    url: '',
  },
  {
    id: 'synth_soothing_8',
    title: '🧸 Gấu Bông Ôm Mơ Thư Giãn Học Tập (Bear Hug Study Breeze)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'bear_hug',
    url: '',
  },
  {
    id: 'synth_soothing_9',
    title: '👑 Bản Hòa Tấu Hoàng Gia Êm Đềm (Royal Classical Serenade)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'royal_classical',
    url: '',
  },
  {
    id: 'synth_soothing_10',
    title: '🎨 Cây Cọ Phép Thuật & Giai Điệu Trong Trẻo (Magic Brush Melody)',
    artist: 'ChronoFlow Kids Studio',
    type: 'synth',
    synthType: 'magic_brush',
    url: '',
  },
  {
    id: 'stream_relaxing_11',
    title: '🍭 Bản Nhạc Hòa Tấu Nhẹ Nhàng & Thư Thái MP3 (Soothing Ambient Track)',
    artist: 'ChronoFlow Peaceful Audio',
    type: 'url',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  },
  {
    id: 'stream_relaxing_12',
    title: '🌙 Nhạc Piano Lofi Hoàng Hôn Thư Giãn (Pastel Twilight Chill MP3)',
    artist: 'ChronoFlow Lofi Studio',
    type: 'url',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a8163f.mp3?filename=relaxing-mountains-141319.mp3',
  },
  {
    id: 'stream_relaxing_13',
    title: '🌸 Bản Nhạc Hòa Tấu Cây Cầu Vồng Dành Cho Bé MP3 (Rainbow Bridge Classical)',
    artist: 'ChronoFlow Lofi Studio',
    type: 'url',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=sweet-love-111663.mp3',
  },
  {
    id: 'stream_relaxing_14',
    title: '🍃 Giai Điệu Thung Lũng Xanh & Tiếng Chim Hót MP3 (Green Valley Breeze)',
    artist: 'ChronoFlow Nature Audio',
    type: 'url',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939b4b0e8.mp3?filename=relaxing-guitar-loop-124673.mp3',
  },
];

export function BackgroundMusicPlayer({ currentActor, addToast, onBgConfigChange, currentBgConfig }) {
  const [tracks, setTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_bgm_tracks_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_CUTE_TRACKS;
    } catch {
      return DEFAULT_CUTE_TRACKS;
    }
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(10); // Auto-default to Track #11
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play enabled by default
  const [volume, setVolume] = useState(0.35);
  const [isMuted, setIsMuted] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('music'); // 'music' or 'background3d'

  // Form states for adding tracks
  const [trackForm, setTrackForm] = useState({ title: '', url: '', artist: 'Bé Minh Anh & Ba' });

  // Custom Background Form States
  const [bgConfig, setBgConfig] = useState(() => {
    return currentBgConfig || {
      theme: 'auto',
      customUrl: '',
      customType: 'image',
      opacity: 0.85,
      blur: 0,
      speed: 1.0,
    };
  });

  // Web Audio Synth Reference
  const audioCtxRef = useRef(null);
  const synthTimerRef = useRef(null);
  const audioElemRef = useRef(null);
  const autoplayUnlockedRef = useRef(false);

  // ── Autoplay Unlock: play BGM on first user interaction (browser policy bypass) ──
  useEffect(() => {
    const unlockAndPlay = () => {
      if (autoplayUnlockedRef.current) return;
      autoplayUnlockedRef.current = true;
      setIsPlaying(true);
      document.removeEventListener('click', unlockAndPlay, { capture: true });
      document.removeEventListener('keydown', unlockAndPlay, { capture: true });
      document.removeEventListener('touchstart', unlockAndPlay, { capture: true });
    };
    document.addEventListener('click', unlockAndPlay, { capture: true });
    document.addEventListener('keydown', unlockAndPlay, { capture: true });
    document.addEventListener('touchstart', unlockAndPlay, { capture: true });
    return () => {
      document.removeEventListener('click', unlockAndPlay, { capture: true });
      document.removeEventListener('keydown', unlockAndPlay, { capture: true });
      document.removeEventListener('touchstart', unlockAndPlay, { capture: true });
    };
  }, []);

  // Save tracks to localStorage
  const saveTracks = (newTracks) => {
    setTracks(newTracks);
    try {
      localStorage.setItem('kids_bgm_tracks_v3', JSON.stringify(newTracks));
    } catch (e) {
      console.error('Error saving BGM tracks:', e);
    }
  };

  const currentTrack = tracks[currentTrackIndex % tracks.length] || DEFAULT_CUTE_TRACKS[0];

  // Web Audio Soothing Melodious Ambient Synthesizer Loop Generator
  const playSynthesizedMelody = (synthType = 'soothing_long') => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {
      console.warn('AudioContext init warning:', e);
    }

    const noteFreqs = {
      F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00,
    };

    const soothingChords = [
      ['C4', 'E4', 'G4', 'B4', 'C5', 'E5'],
      ['A3', 'C4', 'E4', 'G4', 'A4', 'C5'],
      ['F3', 'A3', 'C4', 'E4', 'F4', 'A4'],
      ['G3', 'B3', 'D4', 'F4', 'G4', 'B4'],
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    synthTimerRef.current = setInterval(() => {
      if (!audioCtxRef.current || isMuted || volume <= 0) return;

      try {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = synthType.includes('lofi') ? 'triangle' : 'sine';

        const currentChord = soothingChords[chordIdx % soothingChords.length];
        const noteName = currentChord[noteIdx % currentChord.length];
        const freq = noteFreqs[noteName] || 329.63;

        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const currentVol = isMuted ? 0 : volume * 0.12;
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(currentVol, ctx.currentTime + 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.95);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.0);

        noteIdx++;
        if (noteIdx >= currentChord.length) {
          noteIdx = 0;
          chordIdx++;
        }
      } catch (err) {
        console.warn('Synth playback step error:', err);
      }
    }, 600);
  };

  const stopSynthesizedMelody = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  // Synchronize music state playback
  useEffect(() => {
    if (!isPlaying) {
      stopSynthesizedMelody();
      if (audioElemRef.current) {
        audioElemRef.current.pause();
      }
      return;
    }

    if (currentTrack.type === 'synth') {
      if (audioElemRef.current) {
        audioElemRef.current.pause();
      }
      playSynthesizedMelody(currentTrack.synthType || 'soothing_long');
    } else if (currentTrack.url) {
      stopSynthesizedMelody();
      if (!audioElemRef.current) {
        audioElemRef.current = new Audio(currentTrack.url);
        audioElemRef.current.loop = true;
      } else {
        audioElemRef.current.src = currentTrack.url;
      }
      audioElemRef.current.volume = isMuted ? 0 : volume;
      audioElemRef.current.play().catch((err) => {
        console.warn('Custom URL audio playback error:', err);
      });
    }
  }, [isPlaying, currentTrackIndex, volume, isMuted]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying && addToast) {
      addToast(`🎵 Đã phát nhạc nền du dương êm dịu: "${currentTrack.title}"`, 'info');
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    if (addToast) {
      addToast(`⏭️ Đổi bản nhạc du dương tiếp theo: "${tracks[nextIdx].title}"`, 'info');
    }
  };

  // Handle Local File Upload from PC for Music Tracks
  const handleFileUploadMusic = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const newTrack = {
      id: `local_track_${Date.now()}`,
      title: `🎵 ${file.name.replace(/\.[^/.]+$/, '')} (File từ máy)`,
      artist: 'Lê Lương Bảo Nguyên',
      type: 'url',
      url: fileUrl,
    };

    const updated = [...tracks, newTrack];
    saveTracks(updated);
    setCurrentTrackIndex(updated.length - 1);
    setIsPlaying(true);

    if (addToast) {
      addToast(`📂 Đã tải file nhạc từ máy lên thành công: "${file.name}"!`, 'success');
    }
  };

  // Handle Local Image/Video Upload from PC for Custom 3D Background
  const handleFileUploadBg = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const fileUrl = URL.createObjectURL(file);

    const newBgConfig = {
      ...bgConfig,
      theme: 'custom_image',
      customUrl: fileUrl,
      customType: isVideo ? 'video' : 'image',
    };

    setBgConfig(newBgConfig);
    if (onBgConfigChange) onBgConfigChange(newBgConfig);

    try {
      localStorage.setItem('system_bg_config_v1', JSON.stringify(newBgConfig));
    } catch (err) {
      console.warn('Bg config save error:', err);
    }

    if (addToast) {
      addToast(`🖼️ Đã tải ${isVideo ? 'Video' : 'Ảnh'} nền 3D từ máy lên thành công: "${file.name}"!`, 'success');
    }
  };

  const handleAddCustomTrack = (e) => {
    e.preventDefault();
    if (!trackForm.title.trim()) return;

    const newTrack = {
      id: `track_${Date.now()}`,
      title: trackForm.title.trim(),
      url: trackForm.url.trim(),
      artist: trackForm.artist.trim() || 'Lê Lương Bảo Nguyên',
      type: trackForm.url.trim() ? 'url' : 'synth',
      synthType: 'soothing_long',
    };

    const updated = [...tracks, newTrack];
    saveTracks(updated);
    setTrackForm({ title: '', url: '', artist: 'Bé Minh Anh & Ba' });
    if (addToast) addToast(`🎶 Đã thêm bài hát du dương mới: "${newTrack.title}"!`, 'success');
  };

  const handleDeleteTrack = (id) => {
    if (tracks.length <= 1) {
      if (addToast) addToast('⚠️ Phải giữ lại ít nhất 1 bài nhạc nền trong danh sách!', 'warning');
      return;
    }
    const filtered = tracks.filter((t) => t.id !== id);
    saveTracks(filtered);
    if (currentTrackIndex >= filtered.length) {
      setCurrentTrackIndex(0);
    }
    if (addToast) addToast('🗑️ Đã xóa bài nhạc khỏi danh sách hệ thống!', 'info');
  };

  const updateBgSetting = (key, value) => {
    const updated = { ...bgConfig, [key]: value };
    setBgConfig(updated);
    if (onBgConfigChange) onBgConfigChange(updated);
    try {
      localStorage.setItem('system_bg_config_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('Bg config save error:', e);
    }
  };

  return (
    <>
      <audio ref={audioElemRef} loop />

      {/* Floating 3D Cute BGM Music Player Widget (Bottom Left) */}
      <div className="no-print fixed bottom-4 left-4 z-50 select-none font-sans">
        {showWidget ? (
          <div className="flex items-center gap-2 p-2.5 rounded-3xl border-2 border-pink-400/80 bg-gradient-to-r from-pink-950/95 via-purple-950/95 to-slate-900 shadow-[0_10px_30px_rgba(236,72,153,0.4)] backdrop-blur-xl animate-fadeIn">
            <button
              onClick={() => setShowWidget(false)}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-black text-xl shadow-lg border border-pink-300 hover:scale-110 transition cursor-pointer"
              title="Click để thu nhỏ trình phát nhạc"
            >
              <span className={isPlaying ? 'animate-bounce' : ''}>🎵</span>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              )}
            </button>

            <div className="space-y-1 pr-1 max-w-[180px] md:max-w-[220px]">
              <div className="flex items-center justify-between text-[11px] font-black text-pink-200 truncate">
                <span className="truncate flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-yellow-300 shrink-0" />
                  {currentTrack.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className={`p-1.5 rounded-xl font-bold text-xs transition flex items-center justify-center ${
                    isPlaying
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-slate-800 text-pink-300 hover:bg-slate-700'
                  }`}
                  title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc nền du dương'}
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-1.5 rounded-xl bg-slate-800 text-pink-300 hover:bg-slate-700 transition"
                  title="Bài nhạc tiếp theo"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-xl bg-slate-800 text-pink-300 hover:bg-slate-700 transition"
                  title={isMuted ? 'Mở âm thanh' : 'Tắt âm thanh'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (val > 0) setIsMuted(false);
                  }}
                  className="w-14 md:w-20 accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  title="Điều chỉnh âm lượng nhạc nền"
                />
              </div>
            </div>

            {currentActor === 'bao_nguyen' && (
              <button
                onClick={() => setShowAdminModal(true)}
                className="p-2 rounded-2xl bg-purple-900/60 border border-purple-500/40 text-purple-300 hover:bg-purple-800 transition cursor-pointer"
                title="👨‍💼 Admin Bảo Nguyên: Quản lý Nhạc Nền & Background 3D"
              >
                <Settings className="h-4 w-4 text-purple-300" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowWidget(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-pink-400 bg-pink-950/90 text-pink-200 font-extrabold text-xs shadow-xl backdrop-blur-md hover:scale-110 transition cursor-pointer"
            title="Mở trình phát nhạc du dương cute"
          >
            <Music className={`h-4 w-4 text-pink-400 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span>🎵 Nhạc Du Dương</span>
          </button>
        )}
      </div>

      {/* Admin Music & 3D Background Controller Modal (👨‍💼 Lê Lương Bảo Nguyên Only) */}
      {showAdminModal && currentActor === 'bao_nguyen' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn font-sans overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl border-2 border-purple-500/60 bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 space-y-6 shadow-2xl my-auto">
            
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider font-heading">
                    👨‍💼 QUẢN LÝ NHẠC NỀN & BACKGROUND 3D (BẢO NGUYÊN ADMIN)
                  </h3>
                  <p className="text-xs text-purple-300 font-bold">
                    Tùy chỉnh danh sách bài hát, tải file từ máy lên & đổi nền 3D chuyển động siêu chi tiết
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAdminModal(false)}
                className="rounded-full bg-slate-900 border border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500"
              >
                Đóng ✖
              </button>
            </div>

            {/* Sub Tabs: Music vs 3D Background */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveAdminTab('music')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition ${
                  activeAdminTab === 'music'
                    ? 'bg-purple-600 text-white shadow-lg border border-purple-400'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Music className="h-4 w-4" />
                <span>🎶 Danh Sách Nhạc Du Dương ({tracks.length} bài)</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('background3d')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition ${
                  activeAdminTab === 'background3d'
                    ? 'bg-purple-600 text-white shadow-lg border border-purple-400'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="h-4 w-4 text-pink-400" />
                <span>🖼️ Tùy Chỉnh Background 3D Động Siêu Chi Tiết</span>
              </button>
            </div>

            {/* TAB 1: MUSIC MANAGEMENT */}
            {activeAdminTab === 'music' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Upload Local Audio File from Computer Input */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-purple-400/60 bg-purple-950/40 text-center space-y-2">
                  <Upload className="h-6 w-6 text-purple-300 mx-auto animate-bounce" />
                  <h4 className="text-xs font-black text-purple-200">
                    📂 TẢI BÀI HÁT MP3 / AUDIO TRỰC TIẾP TỪ MÁY TÍNH CỦA BẠN UP LÊN HỆ THỐNG
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Hỗ trợ định dạng: .mp3, .wav, .m4a, .ogg — Phát trực tiếp mượt mà ngay lập tức
                  </p>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-black text-xs shadow-xl hover:scale-105 transition cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Chọn File Nhạc Từ Máy Tính Của Bạn</span>
                    <input type="file" accept="audio/*" onChange={handleFileUploadMusic} className="hidden" />
                  </label>
                </div>

                {/* Add Custom Track via URL Form */}
                <form onSubmit={handleAddCustomTrack} className="space-y-4 bg-slate-900/90 p-4 rounded-2xl border border-purple-500/30">
                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-purple-400" /> Hoặc Thêm Bài Nhạc Qua Link Audio Online MP3
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Tên bài hát / Giai điệu cute:</label>
                      <input
                        type="text"
                        required
                        placeholder="ví dụ: 🌸 Vũ Điệu Du Dương Đàn Piano Dài"
                        value={trackForm.title}
                        onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Đường dẫn Link Audio URL (MP3/WAV):</label>
                      <input
                        type="url"
                        placeholder="https://example.com/cute_soothing_song.mp3"
                        value={trackForm.url}
                        onChange={(e) => setTrackForm({ ...trackForm, url: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black text-xs hover:from-purple-400 hover:to-pink-500 shadow-md transition"
                    >
                      ➕ Thêm Bài Nhạc Này Vào Danh Sách
                    </button>
                  </div>
                </form>

                {/* Track List Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                    🎶 Danh Sách Bài Nhạc Đang Có ({tracks.length} bài)
                  </h4>

                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                    {tracks.map((t, idx) => {
                      const isCurrent = currentTrackIndex === idx;
                      return (
                        <div
                          key={t.id || idx}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                            isCurrent
                              ? 'border-purple-400 bg-purple-950/80 shadow-md ring-1 ring-purple-400/50'
                              : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 text-xs font-mono-code font-bold text-purple-300">
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="text-xs font-black text-white flex items-center gap-1.5">
                                <span>{t.title}</span>
                                {isCurrent && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/40">Đang chọn</span>}
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono-code truncate max-w-[280px]">
                                {t.type === 'synth' ? '🤖 Giai Điệu AI Du Dương Êm Diệu' : `🌐 URL: ${t.url}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCurrentTrackIndex(idx);
                                setIsPlaying(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition shadow"
                            >
                              ▶️ Phát Bài Này
                            </button>

                            <button
                              onClick={() => handleDeleteTrack(t.id)}
                              className="p-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white transition"
                              title="Xóa bài nhạc"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DYNAMIC 3D BACKGROUND MANAGER */}
            {activeAdminTab === 'background3d' && (
              <div className="space-y-6 animate-fadeIn">
                {/* 3D Theme Selector Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-400" /> Chọn Mẫu Chủ Đề Background 3D Chuyển Động
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'auto', title: '✨ Tự Động Theo Chức Năng', desc: 'Đổi theme 3D thông minh cho từng Tab' },
                      { id: 'galaxy3d', title: '🌌 Dải Ngân Hà Galaxy 3D', desc: 'Sao 3D bay rực rỡ pastel' },
                      { id: 'neonwaves', title: '⚡ Sóng Neon Waves 3D', desc: 'Lưới sóng Neon chuyển động' },
                      { id: 'crystals3d', title: '💎 Pha Lê Crystals 3D', desc: 'Tinh thể pha lê nổi 3D' },
                      { id: 'aurora3d', title: '🌈 Cực Quang Aurora 3D', desc: 'Dải cực quang mơ màng' },
                      { id: 'cybergrid', title: '🌐 Ma Trận Cyber Grid 3D', desc: 'Lưới ma trận công nghệ 3D' },
                    ].map((themeItem) => (
                      <button
                        key={themeItem.id}
                        onClick={() => updateBgSetting('theme', themeItem.id)}
                        className={`p-3 rounded-2xl border text-left transition relative overflow-hidden ${
                          bgConfig.theme === themeItem.id
                            ? 'border-pink-400 bg-purple-900/90 shadow-xl ring-2 ring-pink-400/50'
                            : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-black text-white mb-1">{themeItem.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{themeItem.desc}</div>
                        {bgConfig.theme === themeItem.id && (
                          <div className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Custom Image or Video Background from PC */}
                <div className="p-5 rounded-2xl border-2 border-dashed border-pink-400/60 bg-pink-950/30 text-center space-y-3">
                  <ImageIcon className="h-7 w-7 text-pink-300 mx-auto animate-pulse" />
                  <h4 className="text-xs font-black text-pink-200 uppercase tracking-wider">
                    🖼️ TẢI ẢNH HOẶC VIDEO BACKGROUND CÁ NHÂN TỪ MÁY TÍNH LÊN CÀI LÀM NỀN HỆ THỐNG
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium max-w-md mx-auto">
                    Tải lên hình ảnh tùy thích (.jpg, .png, .webp, .gif) hoặc video chuyển động (.mp4, .webm) để làm Background riêng siêu độc đáo!
                  </p>

                  <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs shadow-xl hover:scale-105 transition cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Chọn File Ảnh / Video Từ Máy Tính</span>
                    <input type="file" accept="image/*,video/*" onChange={handleFileUploadBg} className="hidden" />
                  </label>
                </div>

                {/* Fine-Tuning Controls: Opacity & Speed Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>Độ Hiển Thị Background (Opacity):</span>
                      <span className="text-pink-400 font-mono-code">{Math.round(bgConfig.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={bgConfig.opacity}
                      onChange={(e) => updateBgSetting('opacity', parseFloat(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>Tốc Độ Chuyển Động 3D (Speed):</span>
                      <span className="text-purple-400 font-mono-code">{bgConfig.speed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.2"
                      value={bgConfig.speed}
                      onChange={(e) => updateBgSetting('speed', parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
