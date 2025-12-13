import { useRef, useCallback, useEffect, useState } from 'react';
import { getTileCosmology } from '@/data/cosmologicalMapping';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

// Pentatonic scale frequencies mapped to seals (grouped by color)
const SEAL_FREQUENCIES: Record<string, number> = {
  // Red seals - lower frequencies
  'Dragon': 261.63,      // C4
  'Serpent': 293.66,     // D4
  'Moon': 329.63,        // E4
  'Skywalker': 392.00,   // G4
  'Earth': 440.00,       // A4
  // White seals - mid frequencies
  'Wind': 523.25,        // C5
  'Worldbridger': 587.33,// D5
  'Dog': 659.25,         // E5
  'Wizard': 783.99,      // G5
  'Mirror': 880.00,      // A5
  // Blue seals - higher frequencies
  'Night': 1046.50,      // C6
  'Hand': 1174.66,       // D6
  'Monkey': 1318.51,     // E6
  'Eagle': 1567.98,      // G6
  'Storm': 1760.00,      // A6
  // Yellow seals - harmonic blend
  'Seed': 369.99,        // F#4
  'Star': 493.88,        // B4
  'Human': 739.99,       // F#5
  'Warrior': 987.77,     // B5
  'Sun': 1479.98,        // F#6
};

// Tone modifiers (galactic tones affect the sound)
const TONE_MODIFIERS: Record<number, { detune: number; duration: number; volume: number }> = {
  1: { detune: 0, duration: 1.5, volume: 0.6 },      // Magnetic - pure, unified
  2: { detune: -10, duration: 1.2, volume: 0.5 },   // Lunar - polarized
  3: { detune: 5, duration: 1.0, volume: 0.55 },    // Electric - activated
  4: { detune: -5, duration: 1.3, volume: 0.5 },    // Self-Existing - defined
  5: { detune: 0, duration: 0.8, volume: 0.6 },     // Overtone - radiant
  6: { detune: 10, duration: 1.1, volume: 0.55 },   // Rhythmic - balanced
  7: { detune: -15, duration: 1.4, volume: 0.5 },   // Resonant - attuned
  8: { detune: 0, duration: 0.9, volume: 0.65 },    // Galactic - harmonized
  9: { detune: 15, duration: 1.0, volume: 0.6 },    // Solar - pulsing
  10: { detune: -20, duration: 1.2, volume: 0.5 },  // Planetary - manifested
  11: { detune: 20, duration: 0.7, volume: 0.65 },  // Spectral - dissolving
  12: { detune: 0, duration: 1.3, volume: 0.55 },   // Crystal - cooperative
  13: { detune: 25, duration: 1.5, volume: 0.6 },   // Cosmic - transcendent
};

// Season affects the overall character
const SEASON_CHARACTERISTICS: Record<Season, { filterFreq: number; reverbMix: number; waveform: OscillatorType }> = {
  POLLENS: { filterFreq: 2000, reverbMix: 0.3, waveform: 'sine' },
  NOEMS: { filterFreq: 3000, reverbMix: 0.5, waveform: 'triangle' },
  POEMS: { filterFreq: 4000, reverbMix: 0.4, waveform: 'sine' },
  TOTEMS: { filterFreq: 2500, reverbMix: 0.6, waveform: 'triangle' },
  ANTHEMS: { filterFreq: 5000, reverbMix: 0.7, waveform: 'sine' },
};

export const useCosmologicalAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio context on first use
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.3; // Master volume
      setIsInitialized(true);
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    return audioContextRef.current;
  }, []);

  // Play a harmonic tone based on tile cosmology
  const playTileSound = useCallback((tileId: number, season: Season = 'POLLENS') => {
    const ctx = initAudio();
    if (!ctx || isPlayingRef.current) return;

    const cosmology = getTileCosmology(tileId, season);
    const seal = cosmology.seal;
    const tone = cosmology.tone;
    const isPortal = cosmology.isPortalDay;

    const baseFreq = SEAL_FREQUENCIES[seal.name] || 440;
    const toneModifier = TONE_MODIFIERS[tone.number] || TONE_MODIFIERS[1];
    const seasonChar = SEASON_CHARACTERISTICS[season];

    isPlayingRef.current = true;
    const now = ctx.currentTime;

    // Create main oscillator
    const osc1 = ctx.createOscillator();
    osc1.type = seasonChar.waveform;
    osc1.frequency.value = baseFreq;
    osc1.detune.value = toneModifier.detune;

    // Create harmonic oscillator (5th above)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = baseFreq * 1.5; // Perfect 5th
    osc2.detune.value = toneModifier.detune * 0.5;

    // Portal days get an extra mystical oscillator
    let osc3: OscillatorNode | null = null;
    if (isPortal) {
      osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.value = baseFreq * 2; // Octave above
      osc3.detune.value = toneModifier.detune + 50; // Slight shimmer
    }

    // Create filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = seasonChar.filterFreq;
    filter.Q.value = 2;

    // Create gain nodes for envelope
    const envGain = ctx.createGain();
    envGain.gain.value = 0;

    const harmGain = ctx.createGain();
    harmGain.gain.value = 0.3;

    // Connect nodes
    osc1.connect(filter);
    osc2.connect(harmGain);
    harmGain.connect(filter);
    if (osc3) {
      const portalGain = ctx.createGain();
      portalGain.gain.value = 0.15;
      osc3.connect(portalGain);
      portalGain.connect(filter);
    }
    filter.connect(envGain);
    envGain.connect(gainNodeRef.current!);

    // ADSR envelope
    const duration = toneModifier.duration;
    const attackTime = 0.1;
    const decayTime = 0.2;
    const sustainLevel = toneModifier.volume * 0.7;
    const releaseTime = 0.5;

    envGain.gain.setValueAtTime(0, now);
    envGain.gain.linearRampToValueAtTime(toneModifier.volume, now + attackTime);
    envGain.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    envGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
    envGain.gain.linearRampToValueAtTime(0, now + duration);

    // Start and stop oscillators
    osc1.start(now);
    osc2.start(now);
    osc3?.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    osc3?.stop(now + duration + 0.1);

    // Cleanup
    setTimeout(() => {
      isPlayingRef.current = false;
    }, duration * 1000 + 100);

  }, [initAudio]);

  // Play a sequence of tiles (for path visualization)
  const playTilePath = useCallback((tileIds: number[], season: Season = 'POLLENS', interval: number = 500) => {
    tileIds.forEach((tileId, index) => {
      setTimeout(() => {
        playTileSound(tileId, season);
      }, index * interval);
    });
  }, [playTileSound]);

  // Play resonance chord (multiple tiles at once)
  const playResonanceChord = useCallback((tileIds: number[], season: Season = 'POLLENS') => {
    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chordGain = ctx.createGain();
    chordGain.gain.value = 0.4 / tileIds.length; // Normalize volume
    chordGain.connect(gainNodeRef.current!);

    tileIds.forEach((tileId, index) => {
      const cosmology = getTileCosmology(tileId, season);
      const baseFreq = SEAL_FREQUENCIES[cosmology.seal.name] || 440;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = baseFreq;

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.3, now + 0.2 + index * 0.1);
      oscGain.gain.linearRampToValueAtTime(0, now + 2);

      osc.connect(oscGain);
      oscGain.connect(chordGain);

      osc.start(now + index * 0.1);
      osc.stop(now + 2.5);
    });
  }, [initAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playTileSound,
    playTilePath,
    playResonanceChord,
    initAudio,
    isInitialized
  };
};
