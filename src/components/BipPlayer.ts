/**
 * Singleton Web Audio bip player.
 * iOS Safari requires AudioContext to be created/resumed inside a user gesture.
 * Call BipPlayer.unlock() on the first tap (Démarrer button, etc.).
 */
class BipPlayerImpl {
  private ctx: AudioContext | null = null;
  private unlocked = false;

  private ensureCtx(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const Ctor = w.AudioContext ?? w.webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    return this.ctx;
  }

  /** Call from a user gesture handler to unlock iOS audio. Idempotent. */
  unlock() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    if (!this.unlocked) {
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      this.unlocked = true;
    }
  }

  private beep(freq: number, durationMs: number, volume = 0.3) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.linearRampToValueAtTime(0, now + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.05);
  }

  /** Petit bip court (tic du compte à rebours). */
  tick() {
    this.beep(880, 120, 0.25);
  }

  /** Bip long de fin de phase. */
  ding() {
    this.beep(660, 700, 0.4);
  }
}

export const BipPlayer = new BipPlayerImpl();
