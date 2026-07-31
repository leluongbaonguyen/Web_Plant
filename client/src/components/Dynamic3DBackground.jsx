import { useState, useEffect, useRef } from 'react';

export function Dynamic3DBackground({ activeTab, customBgConfig }) {
  const canvasRef = useRef(null);

  // Background config with fallback defaults
  const config = customBgConfig || {
    theme: 'auto', // 'auto', 'galaxy3d', 'neonwaves', 'crystals3d', 'aurora3d', 'cybergrid', 'custom_image'
    customUrl: '',
    customType: 'image', // 'image' or 'video'
    opacity: 0.85,
    blur: 0,
    speed: 1.0,
  };

  // Determine active 3D theme based on tab if theme is 'auto'
  const effectiveTheme = config.theme === 'auto' ? (
    activeTab === 'dashboard' ? 'neonwaves' :
    activeTab === 'schedule' ? 'crystals3d' :
    activeTab === 'goals' ? 'aurora3d' :
    activeTab === 'summary' || activeTab === 'docs' ? 'cybergrid' : 'galaxy3d'
  ) : config.theme;

  useEffect(() => {
    if (config.theme === 'custom_image' && config.customUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle definitions for 3D simulation
    const particleCount = effectiveTheme === 'galaxy3d' ? 120 : effectiveTheme === 'neonwaves' ? 80 : 60;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 1000 + 1,
        radius: Math.random() * 2.5 + 1,
        color: effectiveTheme === 'galaxy3d' 
          ? ['#f472b6', '#c084fc', '#818cf8', '#38bdf8', '#fef08a'][i % 5]
          : effectiveTheme === 'neonwaves'
          ? ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'][i % 4]
          : ['#38bdf8', '#818cf8', '#a855f7'][i % 3],
        speedZ: (Math.random() * 2 + 1) * config.speed,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Horizontal 3D Parallax Moving Sprites (Chạy Ngang Màn Hình)
    const horizontalItems = [];
    const cuteEmojis = ['🦄', '🧸', '🐱', '🐰', '🐶', '🌈', '👑', '🍭', '🌸', '✨', '⭐', '🎈', '🚀'];

    for (let h = 0; h < 18; h++) {
      horizontalItems.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.85),
        z: Math.random() * 500 + 100, // Depth layer
        speedX: (Math.random() * 1.5 + 0.8) * config.speed,
        emoji: cuteEmojis[h % cuteEmojis.length],
        scale: Math.random() * 0.8 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    let waveAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Theme-Specific 3D Canvas Visuals
      if (effectiveTheme === 'galaxy3d') {
        const cx = width / 2;
        const cy = height / 2;

        particles.forEach((p) => {
          p.z -= p.speedZ * 1.5;
          if (p.z <= 0) {
            p.z = 1000;
            p.x = Math.random() * width - width / 2;
            p.y = Math.random() * height - height / 2;
          }

          const k = 400 / p.z;
          const px = p.x * k + cx;
          const py = p.y * k + cy;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const size = Math.max(0.5, (1 - p.z / 1000) * p.radius * 2.5);
            const alpha = Math.min(1, (1 - p.z / 1000) * 0.9);

            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.shadowBlur = size * 4;
            ctx.shadowColor = p.color;
            ctx.fill();
          }
        });
      } else if (effectiveTheme === 'neonwaves') {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        waveAngle += 0.02 * config.speed;

        const gridStep = 45;
        for (let x = 0; x < width; x += gridStep) {
          ctx.beginPath();
          for (let y = 0; y < height; y += 20) {
            const z = Math.sin(x * 0.005 + waveAngle) * Math.cos(y * 0.005 + waveAngle) * 35;
            const drawX = x + z * 0.3;
            const drawY = y + z * 0.5;
            if (y === 0) ctx.moveTo(drawX, drawY);
            else ctx.lineTo(drawX, drawY);
          }
          ctx.stroke();
        }
      } else if (effectiveTheme === 'aurora3d') {
        waveAngle += 0.01 * config.speed;
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, `hsla(${(waveAngle * 20) % 360}, 80%, 20%, 0.4)`);
        grad.addColorStop(0.5, `hsla(${(waveAngle * 20 + 90) % 360}, 80%, 15%, 0.3)`);
        grad.addColorStop(1, `hsla(${(waveAngle * 20 + 180) % 360}, 80%, 10%, 0.4)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (effectiveTheme === 'crystals3d') {
        waveAngle += 0.015 * config.speed;
        particles.forEach((p, idx) => {
          p.y -= 0.8 * config.speed;
          if (p.y < -height / 2) p.y = height / 2;

          const px = p.x + width / 2 + Math.sin(waveAngle + idx) * 20;
          const py = p.y + height / 2;

          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(waveAngle + idx);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.4;
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;

          ctx.beginPath();
          ctx.moveTo(0, -p.radius * 5);
          ctx.lineTo(p.radius * 4, 0);
          ctx.lineTo(0, p.radius * 5);
          ctx.lineTo(-p.radius * 4, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });
      } else if (effectiveTheme === 'cybergrid') {
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        waveAngle += 0.03 * config.speed;

        for (let i = 0; i < width; i += 60) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
        for (let j = (waveAngle * 30) % 60; j < height; j += 60) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(width, j);
          ctx.stroke();
        }
      }

      // Render Horizontal 3D Moving Emoji & Cute Icons (Chạy Ngang Ngang Trải Dài)
      horizontalItems.forEach((item) => {
        item.x += item.speedX;
        if (item.x > width + 60) {
          item.x = -60;
          item.y = Math.random() * (height * 0.85);
        }

        item.rotation += item.rotSpeed;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.font = `${Math.floor(28 * item.scale)}px sans-serif`;
        ctx.globalAlpha = 0.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ec4899';
        ctx.fillText(item.emoji, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effectiveTheme, config.speed, config.theme, config.customUrl]);

  return (
    <div
      className="no-print pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-all duration-700"
      style={{
        opacity: config.opacity !== undefined ? config.opacity : 0.85,
        filter: config.blur ? `blur(${config.blur}px)` : 'none',
      }}
    >
      {/* Render Custom Image or Video Background with Horizontal Continuous 3D Scrolling if Image set */}
      {config.theme === 'custom_image' && config.customUrl ? (
        config.customType === 'video' ? (
          <video
            src={config.customUrl}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          /* Horizontal 3D Endless Parallax Panning Image Background */
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="absolute inset-0 flex h-full w-[200%] animate-horizontalPan"
              style={{
                backgroundImage: `url("${config.customUrl}")`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: 'contain',
              }}
            />
          </div>
        )
      ) : (
        /* Dynamic 3D WebGL / HTML5 Canvas Element with Horizontal Running Elements */
        <canvas ref={canvasRef} className="h-full w-full block" />
      )}
    </div>
  );
}
