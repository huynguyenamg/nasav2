class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Read mute preference from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('space_academy_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('space_academy_muted', String(this.isMuted));
    }
    if (!this.isMuted) {
      this.playClick();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Button click
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 2. Component Equipping Snap
  public playEquip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 3. Rover Wheel Motor Buzz
  public playRoverMove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 4. Camera Shutter Snapshot
  public playCamera() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Two clicks for double-shutter
    for (let i = 0; i < 2; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + i * 0.08;

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200 - i * 300, time);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.04);
    }
  }

  // 5. Scientific Rock Sample Laser / ChemCam Zap
  public playLaserScan() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.18);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 6. Rocket Thruster Rumble
  public playLaunchIgnition() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // White noise buffer for thruster exhaust
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to make it deep rocket rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.linearRampToValueAtTime(450, now + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 1.5);
  }

  // 7. Success Fanfare / Badge Earned
  public playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const start = now + idx * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  // 8. Warning / Anomaly Alert
  public playAlert() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.15;

      osc.type = 'square';
      osc.frequency.setValueAtTime(620, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.1);
    }
  }

  // 9. Wrench Repair Ratchet
  public playRepairTool() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + i * 0.06;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320 + i * 60, time);

      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.03);
    }
  }

  // 10. Child-friendly cute female Vietnamese voice narration
  private cachedViVoice: SpeechSynthesisVoice | null = null;
  private voicesHooked: boolean = false;

  private pickCuteFemaleViVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const viVoices = voices.filter((v) => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return (
        lang.startsWith('vi') ||
        lang.includes('vi-vn') ||
        name.includes('vietnam') ||
        name.includes('tiếng việt') ||
        name.includes('tieng viet')
      );
    });

    if (viVoices.length === 0) return null;

    const femaleKeywords = [
      'hoaimy',
      'hoài my',
      'linh',
      'mai',
      'lan',
      'ngoc',
      'ngọc',
      'huong',
      'hương',
      'thao',
      'thảo',
      'chi',
      'anh',
      'my',
      'female',
      'woman',
      'girl',
      'nu',
      'nữ',
      'google tiếng việt',
      'google vietnamese',
      'natural',
    ];
    const maleKeywords = ['namminh', 'nam minh', 'nam', 'male', 'man', 'boy', 'duc', 'hung', 'minh'];

    const scoreVoice = (v: SpeechSynthesisVoice): number => {
      const name = v.name.toLowerCase();
      let score = 0;
      if (v.lang.toLowerCase().startsWith('vi')) score += 20;
      if (name.includes('hoaimy') || name.includes('hoài my')) score += 60;
      if (name.includes('google tiếng việt') || name.includes('google vietnamese')) score += 50;
      if (name.includes('natural') || name.includes('online')) score += 15;
      if (femaleKeywords.some((k) => name.includes(k))) score += 30;
      if (maleKeywords.some((k) => name.includes(k))) score -= 80;
      return score;
    };

    const sorted = [...viVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    this.cachedViVoice = sorted[0];
    return this.cachedViVoice;
  }

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser speech synthesis cancellation errors
      }
    }
  }

  public speak(text: string, _lang: 'vi' | 'en' = 'vi', onEnd?: () => void) {
    if (this.isMuted || !this.isSpeechSupported() || !text.trim()) {
      onEnd?.();
      return;
    }

    try {
      const synth = window.speechSynthesis;
      if (!this.voicesHooked && typeof synth.addEventListener === 'function') {
        this.voicesHooked = true;
        synth.addEventListener('voiceschanged', () => {
          this.pickCuteFemaleViVoice();
        });
      }

      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.94;
      utterance.pitch = 1.16;
      utterance.volume = 1.0;

      const femaleViVoice = this.pickCuteFemaleViVoice() || this.cachedViVoice;
      if (femaleViVoice) {
        utterance.voice = femaleViVoice;
      }

      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();
      synth.speak(utterance);
    } catch {
      onEnd?.();
    }
  }
}

export const sound = new SoundService();
