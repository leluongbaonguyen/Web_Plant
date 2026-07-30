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
      {/* Floating Cute Floating Icons Floating Everywhere */}
      <div className="absolute top-16 left-6 opacity-80 animate-orbit pointer-events-auto cursor-pointer text-2xl hover:scale-150 transition drop-shadow-lg" title="Bong bóng dễ thương">🎈</div>
      <div className="absolute top-28 left-1/4 opacity-70 animate-float pointer-events-auto cursor-pointer text-2xl hover:scale-150 transition drop-shadow-lg" title="Kẹo ngọt ngào">🍭</div>
      <div className="absolute top-20 right-1/3 opacity-80 animate-orbit pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition drop-shadow-lg" title="Kỳ lân siêu cút">🦄</div>
      <div className="absolute top-36 right-16 opacity-80 animate-float pointer-events-auto cursor-pointer text-2xl hover:scale-150 transition drop-shadow-lg" title="Nơ công chúa">🎀</div>
      <div className="absolute top-44 right-1/4 opacity-75 animate-wiggle pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition drop-shadow-lg" title="Gấu bông cút">🧸</div>
      <div className="absolute bottom-40 left-12 opacity-80 animate-float-reverse pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition drop-shadow-lg" title="Vương miện công chúa">👑</div>
      <div className="absolute bottom-52 left-1/3 opacity-75 animate-orbit pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition drop-shadow-lg" title="Cầu vồng rực rỡ">🌈</div>
      <div className="absolute bottom-36 right-12 opacity-80 animate-float pointer-events-auto cursor-pointer text-2xl hover:scale-150 transition drop-shadow-lg" title="Hoa đào rực rỡ">🌸</div>
      <div className="absolute bottom-28 right-1/3 opacity-75 animate-wiggle pointer-events-auto cursor-pointer text-2xl hover:scale-150 transition drop-shadow-lg" title="Bảng màu vẽ">🎨</div>
      <div className="absolute top-1/2 left-8 opacity-60 animate-pulse pointer-events-auto cursor-pointer text-2xl hover:scale-150 transition" title="Ngôi sao lấp lánh">✨</div>
      <div className="absolute top-1/2 right-8 opacity-60 animate-bounce pointer-events-auto cursor-pointer text-2xl hover:scale-150 transition" title="Ngôi sao bé ngoan">⭐</div>

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
