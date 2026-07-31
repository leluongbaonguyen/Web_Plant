import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, SkipForward, Plus, Trash2, Edit3, Settings, Sparkles, Heart } from 'lucide-react';

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
    id: 'stream_relaxing_4',
    title: '🍭 Bản Nhạc Hòa Tấu Nhẹ Nhàng & Thư Thái MP3 (Soothing Ambient Track)',
    artist: 'ChronoFlow Peaceful Audio',
    type: 'url',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  },
];

export function BackgroundMusicPlayer({ currentActor, addToast }) {
  const [tracks, setTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_bgm_tracks_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_CUTE_TRACKS;
    } catch {
      return DEFAULT_CUTE_TRACKS;
    }
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25); // Gentle soft volume
  const [isMuted, setIsMuted] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Form states for adding/editing tracks
  const [trackForm, setTrackForm] = useState({ title: '', url: '', artist: 'Bé Minh Anh & Ba' });

  // Web Audio Synth Reference
  const audioCtxRef = useRef(null);
  const synthTimerRef = useRef(null);
  const audioElemRef = useRef(null);

  // Save tracks to localStorage
  const saveTracks = (newTracks) => {
    setTracks(newTracks);
    try {
      localStorage.setItem('kids_bgm_tracks_v2', JSON.stringify(newTracks));
    } catch (e) {
      console.error('Error saving BGM tracks:', e);
    }
  };

  const currentTrack = tracks[currentTrackIndex % tracks.length] || DEFAULT_CUTE_TRACKS[0];

  // Web Audio Soothing Melodious Ambient Arpeggio Synthesizer Loop Generator
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

    // Smooth harmonic chord arpeggio progression (Cmaj7 -> Am7 -> Fmaj7 -> G7)
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

        // Soft sine wave tone for smooth, gentle acoustic feel
        osc.type = synthType === 'lofi_gentle' ? 'triangle' : 'sine';

        const currentChord = soothingChords[chordIdx % soothingChords.length];
        const noteName = currentChord[noteIdx % currentChord.length];
        const freq = noteFreqs[noteName] || 329.63;

        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const currentVol = isMuted ? 0 : volume * 0.12; // Ultra soft gentle volume
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
    }, 600); // 60 BPM gentle tempo
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
    setShowAdminModal(false);
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

  return (
    <>
      {/* HTML5 Audio Element for custom MP3 URLs */}
      <audio ref={audioElemRef} loop />

      {/* Floating 3D Cute BGM Music Player Widget (Bottom Left) */}
      <div className="no-print fixed bottom-4 left-4 z-50 select-none font-sans">
        {showWidget ? (
          <div className="flex items-center gap-2 p-2.5 rounded-3xl border-2 border-pink-400/80 bg-gradient-to-r from-pink-950/95 via-purple-950/95 to-slate-900 shadow-[0_10px_30px_rgba(236,72,153,0.4)] backdrop-blur-xl animate-fadeIn">
            {/* Animated Wiggling Music Note Icon */}
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

            {/* Track Info & Controls */}
            <div className="space-y-1 pr-1 max-w-[180px] md:max-w-[220px]">
              <div className="flex items-center justify-between text-[11px] font-black text-pink-200 truncate">
                <span className="truncate flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-yellow-300 shrink-0" />
                  {currentTrack.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Play/Pause Button */}
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

                {/* Next Track Button */}
                <button
                  onClick={handleNextTrack}
                  className="p-1.5 rounded-xl bg-slate-800 text-pink-300 hover:bg-slate-700 transition"
                  title="Bài nhạc tiếp theo"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>

                {/* Volume Mute Button */}
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

                {/* Volume Range Slider */}
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

            {/* Admin Management Gear Button (Bảo Nguyên Only) */}
            {currentActor === 'bao_nguyen' && (
              <button
                onClick={() => setShowAdminModal(true)}
                className="p-2 rounded-2xl bg-purple-900/60 border border-purple-500/40 text-purple-300 hover:bg-purple-800 transition cursor-pointer"
                title="👨‍💼 Admin Bảo Nguyên: Quản lý danh sách nhạc nền thêm/sửa/xóa"
              >
                <Settings className="h-4 w-4 text-purple-300" />
              </button>
            )}
          </div>
        ) : (
          /* Mini Collapsed Music Button */
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

      {/* Admin Music Management Modal (👨‍💼 Lê Lương Bảo Nguyên Only) */}
      {showAdminModal && currentActor === 'bao_nguyen' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn font-sans">
          <div className="w-full max-w-2xl rounded-3xl border-2 border-purple-500/60 bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider font-heading">
                    👨‍💼 QUẢN LÝ NHẠC NỀN DU DƯƠNG (BẢO NGUYÊN ADMIN)
                  </h3>
                  <p className="text-xs text-purple-300 font-bold">
                    Thêm, sửa, xóa các bản nhạc nền giao diện hệ thống cho bé Minh Anh
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAdminModal(false)}
                className="rounded-full bg-slate-900 border border-slate-700 px-3 py-1 text-xs font-bold text-slate-400 hover:text-white"
              >
                Đóng ✖
              </button>
            </div>

            {/* Add New Track Form */}
            <form onSubmit={handleAddCustomTrack} className="space-y-4 bg-slate-900/90 p-4 rounded-2xl border border-purple-500/30">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-purple-400" /> Thêm Bài Nhạc Mới Hoặc Đường Dẫn MP3 / Audio Dài
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
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Đường dẫn Link Audio URL (MP3/WAV - Để trống để dùng AI Synthesizer):</label>
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

            {/* Existing Track List Table */}
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
                          <p className="text-[10px] text-slate-400 font-mono-code">
                            {t.type === 'synth' ? '🤖 Giai Điệu AI Du Dương Êm Diệu' : `🌐 URL MP3: ${t.url}`}
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
        </div>
      )}
    </>
  );
}
