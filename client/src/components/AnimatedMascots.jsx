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
      {/* Giảm xuống 4 sticker ambient để giảm tải CSS animation đồng thời */}
      <div
        onClick={() => handlePetClick('🦄 Kỳ Lân May Mắn')}
        className="absolute top-20 right-1/3 opacity-90 animate-float pointer-events-auto cursor-pointer text-4xl hover:scale-150 transition"
        title="Kỳ lân 3D siêu dễ thương"
      >
        🦄
      </div>

      <div
        onClick={() => handlePetClick('🧸 Gấu Bông 3D')}
        className="absolute top-44 right-1/4 opacity-85 animate-wiggle pointer-events-auto cursor-pointer text-4xl hover:scale-150 transition"
        title="Gấu bông 3D ôm tim"
      >
        🧸
      </div>

      <div
        onClick={() => handlePetClick('👑 Vương Miện Công Chúa')}
        className="absolute bottom-40 left-12 opacity-90 animate-float-reverse pointer-events-auto cursor-pointer text-4xl hover:scale-150 transition"
        title="Vương miện vàng 3D"
      >
        👑
      </div>

      <div
        onClick={() => handlePetClick('🌸 Hoa Đào Ngọt Ngào')}
        className="absolute bottom-36 right-12 opacity-85 animate-float pointer-events-auto cursor-pointer text-3xl hover:scale-150 transition"
        title="Hoa anh đào 3D"
      >
        🌸
      </div>

      {/* Mascot runner (giữ lại nhưng đơn giản hơn — bỏ bớt nested animations) */}
      <div className="absolute bottom-2 left-0 w-full pointer-events-auto">
        <div
          onClick={() => handlePetClick('🦄 Đội Pet Cu Te')}
          className="animate-runner-across absolute bottom-0 flex items-center gap-3 cursor-pointer group"
          title="Bấm để nghe lời cổ vũ!"
        >
          <div className="relative rounded-2xl border-2 border-pink-400/80 bg-gradient-to-r from-pink-950/95 via-purple-950/95 to-slate-900 px-4 py-2 text-xs font-black text-pink-200 backdrop-blur-xl transition group-hover:scale-110 whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <span>💖</span> {cheerMsg}
            </span>
            <div className="absolute -bottom-1 left-6 h-2.5 w-2.5 rotate-45 border-r border-b border-pink-400 bg-pink-950"></div>
          </div>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-3xl border-2 border-pink-300 group-hover:scale-125 transition">
            🦄
          </div>
        </div>
      </div>
    </div>
  );
}
