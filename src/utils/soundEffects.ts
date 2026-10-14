// Web Audio API Synthesizer for Suspense & Celebration Sound Effects
// Safe, cross-browser, zero external MP3 dependencies, works 100% offline

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Suspense sound: Anticipation drumroll / heartbeat / rising tension ticking
  public playSuspenseSound(durationSeconds: number = 2.2) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Deep rumble / heartbeat oscillator
      const rumble = ctx.createOscillator();
      const rumbleGain = ctx.createGain();

      rumble.type = 'triangle';
      rumble.frequency.setValueAtTime(55, now);
      rumble.frequency.exponentialRampToValueAtTime(140, now + durationSeconds);

      rumbleGain.gain.setValueAtTime(0.02, now);
      rumbleGain.gain.linearRampToValueAtTime(0.25, now + durationSeconds * 0.85);
      rumbleGain.gain.linearRampToValueAtTime(0.01, now + durationSeconds);

      rumble.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);

      rumble.start(now);
      rumble.stop(now + durationSeconds);

      // Accelerating heartbeat and drumroll clicks
      const steps = 18;
      for (let i = 0; i < steps; i++) {
        // Accelerating curve
        const progress = Math.pow(i / steps, 1.4);
        const clickTime = now + progress * durationSeconds;
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(120 + i * 15, clickTime);

        clickGain.gain.setValueAtTime(0.12, clickTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.045);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);

        clickOsc.start(clickTime);
        clickOsc.stop(clickTime + 0.05);
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Celebration sound: Triumphant fireworks explosion + Joyful fanfare music + Crowd cheer harmonics
  public playCelebrationSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Fireworks Explosion Boom ("BOOM!")
      const boomBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = boomBuffer.getChannelData(0);
      for (let i = 0; i < boomBuffer.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }
      const boomSource = ctx.createBufferSource();
      boomSource.buffer = boomBuffer;
      const boomGain = ctx.createGain();
      boomGain.gain.setValueAtTime(0.35, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      boomSource.connect(boomGain);
      boomGain.connect(ctx.destination);
      boomSource.start(now);

      // 2. Joyful Triumphant Fanfare (Rich brass & bells: C5, E5, G5, B5, C6)
      const fanfare = [
        { freq: 523.25, time: 0.05, dur: 0.22, vol: 0.22 }, // C5
        { freq: 659.25, time: 0.18, dur: 0.22, vol: 0.24 }, // E5
        { freq: 783.99, time: 0.32, dur: 0.28, vol: 0.26 }, // G5
        { freq: 1046.50, time: 0.48, dur: 1.20, vol: 0.32 }, // C6 (Big finish)
        { freq: 1318.51, time: 0.52, dur: 1.10, vol: 0.22 }, // E6 harmonic
        { freq: 1567.98, time: 0.60, dur: 0.95, vol: 0.18 }, // G6 bell
      ];

      fanfare.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.linearRampToValueAtTime(n.vol, now + n.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });

      // 3. Cheerful arpeggio chimes / joy bells (music of happiness)
      const chimes = [1046.50, 1174.66, 1318.51, 1567.98, 2093.00];
      chimes.forEach((freq, idx) => {
        const chimeTime = now + 0.7 + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chimeTime);

        gain.gain.setValueAtTime(0.001, chimeTime);
        gain.gain.linearRampToValueAtTime(0.12, chimeTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, chimeTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(chimeTime);
        osc.stop(chimeTime + 0.5);
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Subtle WhatsApp message sent 'pop' sound
  public playMessageSentSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Subtle WhatsApp message incoming ping
  public playMessageReceivedSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [
        { freq: 650, time: 0, dur: 0.06 },
        { freq: 950, time: 0.07, dur: 0.1 }
      ].forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.07, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.02);
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Subtle double-tick sound when message is marked as read
  public playMessageReadSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Two quick crisp micro-tones for double checkmark
      [0, 0.08].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(idx === 0 ? 980 : 1320, now + delay);

        gain.gain.setValueAtTime(0.04, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.06);
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }
}

export const sounds = new SoundEffects();
