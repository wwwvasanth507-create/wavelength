import type { SoundPreset } from "../types";

export class AudioEngine {
  private static instance: AudioEngine | null = null;

  private ctx: AudioContext | null = null;
  private connectedElements = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();

  // DSP Nodes
  private bassNode: BiquadFilterNode | null = null;
  private midNode: BiquadFilterNode | null = null;
  private trebleNode: BiquadFilterNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private masterGain: GainNode | null = null;

  private currentPreset: SoundPreset = "spatial_3d";

  private constructor() {
    // Lazy initialized on first user audio element attachment
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private initAudioContext() {
    if (this.ctx) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx({ latencyHint: "playback" });

    // 1. Bass Low-Shelf Filter (Sub-bass warmth & punch)
    this.bassNode = this.ctx.createBiquadFilter();
    this.bassNode.type = "lowshelf";
    this.bassNode.frequency.value = 70; // Hz
    this.bassNode.gain.value = 4.5; // dB

    // 2. Mid Peaking Filter (Vocal & Instrument Presence)
    this.midNode = this.ctx.createBiquadFilter();
    this.midNode.type = "peaking";
    this.midNode.frequency.value = 1800; // Hz
    this.midNode.Q.value = 1.0;
    this.midNode.gain.value = 2.0; // dB

    // 3. Treble High-Shelf Filter (Apple Hi-Res Acoustic Air & Shimmer)
    this.trebleNode = this.ctx.createBiquadFilter();
    this.trebleNode.type = "highshelf";
    this.trebleNode.frequency.value = 11000; // Hz
    this.trebleNode.gain.value = 3.5; // dB

    // 4. Apple Mastering Dynamic Range Compressor
    // Brings out micro-details, acoustic nuances, and protects against digital distortion
    this.compressorNode = this.ctx.createDynamicsCompressor();
    this.compressorNode.threshold.value = -24; // dB
    this.compressorNode.knee.value = 30; // dB
    this.compressorNode.ratio.value = 4;
    this.compressorNode.attack.value = 0.003; // 3ms fast attack
    this.compressorNode.release.value = 0.25; // 250ms smooth decay

    // 5. 3D Spatial Stereo Panner
    if (typeof this.ctx.createStereoPanner === "function") {
      this.pannerNode = this.ctx.createStereoPanner();
      this.pannerNode.pan.value = 0;
    }

    // 6. Master Acoustic Gain Staging
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;

    // Connect DSP Processing Graph
    // Source -> Bass -> Mid -> Treble -> Compressor -> [Panner] -> MasterGain -> Destination
    this.bassNode.connect(this.midNode);
    this.midNode.connect(this.trebleNode);
    this.trebleNode.connect(this.compressorNode);

    if (this.pannerNode) {
      this.compressorNode.connect(this.pannerNode);
      this.pannerNode.connect(this.masterGain);
    } else {
      this.compressorNode.connect(this.masterGain);
    }

    this.masterGain.connect(this.ctx.destination);

    this.applyPreset(this.currentPreset);
  }

  public attachAudioElement(audio: HTMLAudioElement) {
    try {
      this.initAudioContext();
      if (!this.ctx || !this.bassNode) return;

      // Resume Web Audio Context if browser suspended it due to auto-play policy
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }

      if (!this.connectedElements.has(audio)) {
        const source = this.ctx.createMediaElementSource(audio);
        source.connect(this.bassNode);
        this.connectedElements.set(audio, source);
      }
    } catch {
      // Fallback gracefully if element already connected or cross-origin restricted
    }
  }

  public setSoundPreset(preset: SoundPreset) {
    this.currentPreset = preset;
    this.applyPreset(preset);
  }

  public getSoundPreset(): SoundPreset {
    return this.currentPreset;
  }

  private applyPreset(preset: SoundPreset) {
    if (!this.bassNode || !this.midNode || !this.trebleNode || !this.compressorNode) return;

    switch (preset) {
      case "spatial_3d":
        // Immersive Spatial Atmos feel: Warm sub-bass, crystal clear presence, open high-frequency air stage
        this.bassNode.frequency.value = 65;
        this.bassNode.gain.value = 5.0;
        this.midNode.frequency.value = 1800;
        this.midNode.gain.value = 2.5;
        this.trebleNode.frequency.value = 12000;
        this.trebleNode.gain.value = 4.0;
        this.compressorNode.threshold.value = -22;
        this.compressorNode.ratio.value = 4.5;
        break;

      case "studio_master":
        // Apple Lossless Studio Reference: Ultra-pure flat acoustic fidelity with soft dynamic compression
        this.bassNode.frequency.value = 50;
        this.bassNode.gain.value = 2.0;
        this.midNode.frequency.value = 1000;
        this.midNode.gain.value = 0.5;
        this.trebleNode.frequency.value = 14000;
        this.trebleNode.gain.value = 2.5;
        this.compressorNode.threshold.value = -18;
        this.compressorNode.ratio.value = 2.5;
        break;

      case "bass_boost":
        // Deep Club & Sub-Bass Impact: Maximum low-end frequency response
        this.bassNode.frequency.value = 80;
        this.bassNode.gain.value = 8.0;
        this.midNode.frequency.value = 1500;
        this.midNode.gain.value = 1.0;
        this.trebleNode.frequency.value = 10000;
        this.trebleNode.gain.value = 3.0;
        this.compressorNode.threshold.value = -26;
        this.compressorNode.ratio.value = 5.0;
        break;

      case "vocal_pure":
        // Acoustic & Vocal Pure: High vocal presence, clear acoustic string details, reduced rumble
        this.bassNode.frequency.value = 120;
        this.bassNode.gain.value = 0.5;
        this.midNode.frequency.value = 2200;
        this.midNode.gain.value = 5.0;
        this.trebleNode.frequency.value = 11000;
        this.trebleNode.gain.value = 4.5;
        this.compressorNode.threshold.value = -20;
        this.compressorNode.ratio.value = 3.5;
        break;
    }
  }

  public ensureContextActive() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }
}
