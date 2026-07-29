import { useState, useEffect } from 'react';
import { Flame, Rocket, Sparkles, Star, Trophy, Zap, Coffee } from 'lucide-react';

export function AnimatedMascots({ addToast }) {
  const [enabled, setEnabled] = useState(true);
  const [cheerMsg, setCheerMsg] = useState('🏃‍♂️ Cố lên! Tiến vào vạch đích tuần!');

  const cheers = [
    '🏃‍♂️ "Kỷ luật tạo nên sự khác biệt!"',
    '⚡ "Tập trung 100% sức mạnh!"',
    '🔥 "Bạn đang chạy nhanh hơn mục tiêu hôm nay đấy!"',
    '🏆 "Sắp chạm tới điểm 10 tuần này rồi!"',
    '🚀 "Bật chế độ Siêu Tốc Độ!"',
  ];

  const handleRunnerClick = () => {
    const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
    setCheerMsg(randomCheer);
    if (addToast) {
      addToast(randomCheer, 'success');
    }
  };

  if (!enabled) return null;

  return (
    <div className="no-print pointer-events-none fixed inset-0 z-40 overflow-hidden select-none">
      {/* Floating Background Orbiting Icons */}
      <div className="absolute top-24 left-10 opacity-40 animate-orbit pointer-events-auto cursor-pointer" title="Cập nhật năng lượng">
        <div className="flex items-center justify-center h-9 w-9 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 backdrop-blur-md shadow-lg hover:scale-125 transition">
          <Rocket className="h-4 w-4 animate-pulse" />
        </div>
      </div>

      <div className="absolute top-44 right-12 opacity-40 animate-float pointer-events-auto cursor-pointer" title="Ngôi sao thành tựu">
        <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 backdrop-blur-md shadow-lg hover:scale-125 transition">
          <Star className="h-4 w-4 animate-spin-slow" />
        </div>
      </div>

      <div className="absolute bottom-32 left-16 opacity-30 animate-float-reverse pointer-events-auto cursor-pointer" title="Năng lượng làm việc">
        <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-pink-500/20 border border-pink-400/30 text-pink-400 backdrop-blur-md shadow-lg hover:scale-125 transition">
          <Coffee className="h-4 w-4" />
        </div>
      </div>

      <div className="absolute bottom-48 right-24 opacity-30 animate-orbit pointer-events-auto cursor-pointer" title="Lửa nhiệt huyết">
        <div className="flex items-center justify-center h-8 w-8 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 backdrop-blur-md shadow-lg hover:scale-125 transition">
          <Flame className="h-4 w-4 animate-bounce" />
        </div>
      </div>

      {/* Running Boy Mascot Running Across Bottom Screen */}
      <div className="absolute bottom-2 left-0 w-full pointer-events-auto">
        <div
          onClick={handleRunnerClick}
          className="animate-runner-across absolute bottom-0 flex items-center gap-2 cursor-pointer group"
          title="Bấm vào cậu bé chạy bộ để lấy động lực!"
        >
          {/* Speech Bubble */}
          <div className="relative rounded-2xl border border-indigo-500/40 bg-slate-900/95 px-3 py-1.5 text-[11px] font-bold text-indigo-300 shadow-xl backdrop-blur-md transition group-hover:scale-110 whitespace-nowrap">
            <span>{cheerMsg}</span>
            <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 border-r border-b border-indigo-500/40 bg-slate-900"></div>
          </div>

          {/* Running Boy Character Avatar */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-2xl shadow-xl border border-indigo-400/50 group-hover:scale-125 transition">
            <span className="animate-wiggle">🏃‍♂️</span>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          {/* Dust Particle Trail */}
          <div className="flex items-center gap-1 opacity-60 text-slate-500 text-xs font-mono-code font-bold">
            <span className="animate-ping">💨</span>
            <span className="animate-pulse">✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
