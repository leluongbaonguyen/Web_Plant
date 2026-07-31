import { useState } from 'react';

export function AnimatedMascots({ addToast }) {
  const [enabled] = useState(true);
  const [cheerMsg, setCheerMsg] = useState('🦄 Bé Minh Anh cố lên! Bé cún & Bé kỳ lân cổ vũ con!');

  const cuteCheers = [
    '🦄 "Minh Anh học xuất sắc nhất luôn!"',
    '🧸 "Thêm 1 từ vựng mới = +1 Siêu Sao ⭐!"',
    '🐱 "Mèo Chuột Cute thương chúc Minh Anh học giỏi!"',
    '🐰 "Thỏ Hồng khen bé làm bài tập siêu nhanh!"',
    '🐶 "Gâu Gâu! Bé Minh Anh tự tin chinh phục Tiếng Anh!"',
    '👑 "Ba Bảo Nguyên luôn tự hào về con gái Minh Anh!"',
    '🍭 "Nỗ lực hôm nay = Món quà ngọt ngào ngày mai!"',
  ];

  const handlePetClick = (petName) => {
    const randomCheer = cuteCheers[Math.floor(Math.random() * cuteCheers.length)];
    setCheerMsg(randomCheer);
    if (addToast) {
      addToast(`${petName}: ${randomCheer}`, 'success');
    }
  };

  if (!enabled) return null;

  return (
    <div className="no-print pointer-events-none fixed inset-0 z-40 overflow-hidden select-none">
      {/* 3D Floating Cute Ambient Stickers Across Entire System */}
      <div
        onClick={() => handlePetClick('🎈 Bong Bóng Kỳ Diệu')}
        className="absolute top-16 left-6 opacity-90 animate-orbit pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition drop-shadow-[0_8px_16px_rgba(236,72,153,0.4)]"
        title="Bong bóng 3D siêu cute"
      >
        🎈
      </div>

      <div
        onClick={() => handlePetClick('🍭 Kẹo Ngọt Ngào')}
        className="absolute top-28 left-1/4 opacity-90 animate-float pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition drop-shadow-[0_8px_16px_rgba(244,114,182,0.4)]"
        title="Kẹo mút 3D siêu cu te"
      >
        🍭
      </div>

      <div
        onClick={() => handlePetClick('🦄 Kỳ Lân May Mắn')}
        className="absolute top-20 right-1/3 opacity-95 animate-orbit pointer-events-auto cursor-pointer text-4xl hover:scale-150 transition drop-shadow-[0_10px_20px_rgba(168,85,247,0.5)]"
        title="Kỳ lân 3D siêu dễ thương"
      >
        🦄
      </div>

      <div
        onClick={() => handlePetClick('🎀 Nơ Xinh xắn')}
        className="absolute top-36 right-16 opacity-90 animate-float pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition drop-shadow-[0_8px_16px_rgba(244,114,182,0.4)]"
        title="Nơ công chúa 3D"
      >
        🎀
      </div>

      <div
        onClick={() => handlePetClick('🧸 Gấu Bông 3D')}
        className="absolute top-44 right-1/4 opacity-90 animate-wiggle pointer-events-auto cursor-pointer text-4xl hover:scale-150 transition drop-shadow-[0_10px_20px_rgba(251,146,60,0.4)]"
        title="Gấu bông 3D ôm tim"
      >
        🧸
      </div>

      <div
        onClick={() => handlePetClick('👑 Vương Miện Công Chúa')}
        className="absolute bottom-40 left-12 opacity-95 animate-float-reverse pointer-events-auto cursor-pointer text-4xl hover:scale-150 transition drop-shadow-[0_10px_20px_rgba(250,204,21,0.5)]"
        title="Vương miện vàng 3D"
      >
        👑
      </div>

      <div
        onClick={() => handlePetClick('🌈 Cầu Vồng May Mắn')}
        className="absolute bottom-52 left-1/3 opacity-90 animate-orbit pointer-events-auto cursor-pointer text-4xl hover:scale-150 transition drop-shadow-[0_10px_20px_rgba(56,189,248,0.5)]"
        title="Cầu vồng 3D siêu xinh"
      >
        🌈
      </div>

      <div
        onClick={() => handlePetClick('🌸 Hoa Đào Ngọt Ngào')}
        className="absolute bottom-36 right-12 opacity-90 animate-float pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition drop-shadow-[0_8px_16px_rgba(244,114,182,0.4)]"
        title="Hoa anh đào 3D"
      >
        🌸
      </div>

      <div
        onClick={() => handlePetClick('🐱 Mèo Ú 3D')}
        className="absolute bottom-28 right-1/3 opacity-90 animate-wiggle pointer-events-auto cursor-pointer text-4xl hover:scale-150 transition drop-shadow-[0_10px_20px_rgba(244,114,182,0.4)]"
        title="Mèo cute 3D"
      >
        🐱
      </div>

      <div
        onClick={() => handlePetClick('✨ Siêu Sao Lấp Lánh')}
        className="absolute top-1/2 left-8 opacity-80 animate-pulse pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition"
        title="Ngôi sao lấp lánh"
      >
        ✨
      </div>

      <div
        onClick={() => handlePetClick('⭐ Sao Vàng Bé Ngoan')}
        className="absolute top-1/2 right-8 opacity-80 animate-bounce pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition"
        title="Ngôi sao thưởng 3D"
      >
        ⭐
      </div>

      {/* 3D Cute Running Pets Traversing Screen Bottom */}
      <div className="absolute bottom-2 left-0 w-full pointer-events-auto">
        <div
          onClick={() => handlePetClick('🦄 Đội Pet Cu Te')}
          className="animate-runner-across absolute bottom-0 flex items-center gap-3 cursor-pointer group"
          title="Bấm vào các bạn Pet 3D siêu cu te để nghe lời cổ vũ!"
        >
          {/* 3D Glowing Speech Bubble */}
          <div className="relative rounded-2xl border-2 border-pink-400/80 bg-gradient-to-r from-pink-950/95 via-purple-950/95 to-slate-900 px-4 py-2 text-xs font-black text-pink-200 shadow-[0_0_25px_rgba(244,114,182,0.5)] backdrop-blur-xl transition group-hover:scale-110 whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <span>💖</span> {cheerMsg}
            </span>
            <div className="absolute -bottom-1 left-6 h-2.5 w-2.5 rotate-45 border-r border-b border-pink-400 bg-pink-950"></div>
          </div>

          {/* Running 3D Cute Pet Trio Avatar */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-3xl shadow-[0_10px_25px_rgba(236,72,153,0.5)] border-2 border-pink-300 group-hover:scale-125 transition">
            <span className="animate-wiggle">🦄</span>
            <span className="absolute -top-2 -right-2 text-lg animate-bounce">🐰</span>
            <span className="absolute -bottom-1 -left-2 text-lg animate-pulse">🐶</span>
          </div>

          {/* Sparkle Rainbow Dust Trail */}
          <div className="flex items-center gap-1.5 opacity-80 text-pink-300 text-xs font-mono-code font-bold">
            <span className="animate-ping text-base">💨</span>
            <span className="animate-pulse text-base">✨</span>
            <span className="animate-bounce text-base">⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}
