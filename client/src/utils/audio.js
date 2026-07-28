let activeSpecialAlarmInterval = null;
let activeAudioCtx = null;

export function playChimeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Ignore audio restriction errors
  }
}

export function stopSpecialAlarmSound() {
  if (activeSpecialAlarmInterval) {
    clearInterval(activeSpecialAlarmInterval);
    activeSpecialAlarmInterval = null;
  }
  if (activeAudioCtx) {
    try {
      activeAudioCtx.close();
    } catch {}
    activeAudioCtx = null;
  }
}

export function playSpecialAlarmSound(durationSeconds = 60, onTick = null, onEnd = null) {
  stopSpecialAlarmSound();

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    activeAudioCtx = ctx;

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 783.99];
    let noteIdx = 0;
    const startTime = Date.now();
    const endTime = startTime + durationSeconds * 1000;

    const playPulseSequence = () => {
      if (!activeAudioCtx || ctx.state === 'closed' || Date.now() >= endTime) {
        stopSpecialAlarmSound();
        if (onEnd) onEnd();
        return;
      }

      [0, 1, 2].forEach((offsetIndex) => {
        const freq = notes[(noteIdx + offsetIndex) % notes.length];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + offsetIndex * 0.16);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + offsetIndex * 0.16);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + offsetIndex * 0.16 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offsetIndex * 0.16 + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + offsetIndex * 0.16);
        osc.stop(ctx.currentTime + offsetIndex * 0.16 + 0.9);
      });

      noteIdx = (noteIdx + 1) % notes.length;
    };

    playPulseSequence();

    activeSpecialAlarmInterval = setInterval(() => {
      const remainingMs = Math.max(0, endTime - Date.now());
      const remainingSec = Math.ceil(remainingMs / 1000);

      if (onTick) onTick(remainingSec);

      if (remainingMs <= 0) {
        stopSpecialAlarmSound();
        if (onEnd) onEnd();
      } else {
        playPulseSequence();
      }
    }, 1800);

    return true;
  } catch {
    if (onEnd) onEnd();
    return false;
  }
}
