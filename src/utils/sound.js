// Sintetizador con Web Audio API puro
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmOscillator = null;
    this.bgmGain = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // En celulares el AudioContext arranca suspendido ('suspended', o 'interrupted' en iOS
    // tras una llamada o al volver de segundo plano) y solo se reanuda durante un toque
    if (this.ctx.state !== 'running') {
      return this.ctx.resume().catch(() => {});
    }
    return Promise.resolve();
  }

  // Desbloquea el audio en el primer toque/tecla (requisito de iOS y Android).
  // Reproduce un buffer silencioso dentro del gesto, que es lo que iOS exige.
  enableAutoUnlock() {
    const events = ['pointerdown', 'touchend', 'keydown'];

    const unlock = () => {
      const resumed = this.init();
      const source = this.ctx.createBufferSource();
      source.buffer = this.ctx.createBuffer(1, 1, 22050);
      source.connect(this.ctx.destination);
      source.start(0);

      // Si quedó desbloqueado ya no hace falta escuchar; si no, se reintenta en el próximo toque
      resumed.then(() => {
        if (this.ctx.state === 'running') {
          events.forEach((event) => window.removeEventListener(event, unlock, true));
        }
      });
    };

    events.forEach((event) => window.addEventListener(event, unlock, true));

    // Al volver a la pestaña o a la app, el navegador puede haber suspendido el contexto
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.ctx && this.ctx.state !== 'running') {
        this.ctx.resume().catch(() => {});
      }
    });
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
  }

  // Ejecuta el sonido cuando el contexto está activo (espera a que se reanude si hace falta)
  play(buildSound) {
    if (this.isMuted) return;
    this.init().then(() => {
      if (this.isMuted || this.ctx.state !== 'running') return;
      buildSound(this.ctx, this.ctx.currentTime);
    });
  }

  playClick() {
    this.play((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    });
  }

  playSuccess() {
    this.play((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  playError() {
    this.play((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  playCoin() {
    this.play((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  // Sonido tipo "pop" al equipar un avatar
  playEquip() {
    this.play((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    });
  }
}

export const soundFx = new SoundEffects();
soundFx.enableAutoUnlock();
