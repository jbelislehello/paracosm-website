import { useRef, useCallback, useEffect, useState } from 'react';
import { getTileCosmology, TRIGRAMS, Trigram, Hexagram } from '@/data/cosmologicalMapping';

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

// Trigram sound profiles - 3-note arpeggios with characteristic shapes
const TRIGRAM_SOUNDS: Record<string, { frequencies: number[]; character: 'ascending' | 'descending' | 'stable' }> = {
  'Heaven': { frequencies: [523.25, 659.25, 783.99], character: 'ascending' },   // C5-E5-G5 - bright, rising
  'Earth': { frequencies: [261.63, 220.00, 196.00], character: 'descending' },   // C4-A3-G3 - grounding
  'Water': { frequencies: [293.66, 329.63, 293.66], character: 'stable' },       // D4-E4-D4 - flowing
  'Fire': { frequencies: [440.00, 523.25, 659.25], character: 'ascending' },     // A4-C5-E5 - bright, intense
  'Thunder': { frequencies: [130.81, 196.00, 261.63], character: 'ascending' },  // C3-G3-C4 - rumbling rise
  'Mountain': { frequencies: [329.63, 329.63, 293.66], character: 'stable' },    // E4-E4-D4 - still, solid
  'Wind': { frequencies: [392.00, 440.00, 523.25], character: 'ascending' },     // G4-A4-C5 - gentle lift
  'Lake': { frequencies: [523.25, 440.00, 392.00], character: 'descending' },    // C5-A4-G4 - reflective descent
};

// Geometric pattern sound profiles
const GEOMETRIC_SOUND_PROFILES: Record<string, { type: string; frequencies: number[]; timing: number[] }> = {
  'cross': { type: 'chord', frequencies: [261.63, 329.63, 392.00, 523.25], timing: [0, 0, 0, 0] },
  'tower': { type: 'ascending', frequencies: [196.00, 220.00, 261.63, 293.66, 329.63, 392.00], timing: [0, 100, 200, 300, 400, 500] },
  'bridge': { type: 'sweep', frequencies: [261.63, 293.66, 329.63, 369.99, 392.00, 440.00], timing: [0, 80, 160, 240, 320, 400] },
  'garden': { type: 'ambient', frequencies: [261.63, 329.63, 392.00], timing: [0, 0, 0] },
  'web': { type: 'rapid', frequencies: [440.00, 523.25, 659.25, 783.99], timing: [0, 50, 100, 150] },
  'spiral': { type: 'circular', frequencies: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63], timing: [0, 150, 300, 450, 600, 750] },
  'diamond': { type: 'mirror', frequencies: [261.63, 329.63, 440.00, 329.63, 261.63], timing: [0, 100, 200, 300, 400] },
  'scatter': { type: 'random', frequencies: [293.66, 369.99, 440.00, 523.25], timing: [0, 120, 80, 200] },
  'frame': { type: 'edge', frequencies: [196.00, 261.63, 329.63, 261.63], timing: [0, 100, 200, 300] },
};

// Season-specific ambient profiles
const AMBIENT_PROFILES: Record<Season, { 
  baseFreqs: number[]; 
  lfoRate: number; 
  lfoDepth: number; 
  filterFreq: number;
  character: string;
}> = {
  POLLENS: { 
    baseFreqs: [65.41, 98.00, 130.81], // C2, G2, C3 - earthy, grounding
    lfoRate: 0.08, 
    lfoDepth: 3,
    filterFreq: 800,
    character: 'Earthy drone'
  },
  NOEMS: { 
    baseFreqs: [220.00, 277.18, 329.63], // A3, C#4, E4 - crystalline
    lfoRate: 0.15, 
    lfoDepth: 5,
    filterFreq: 2000,
    character: 'Crystalline shimmer'
  },
  POEMS: { 
    baseFreqs: [146.83, 196.00, 246.94], // D3, G3, B3 - flowing, melodic
    lfoRate: 0.12, 
    lfoDepth: 4,
    filterFreq: 1200,
    character: 'Flowing melody'
  },
  TOTEMS: { 
    baseFreqs: [82.41, 110.00, 164.81], // E2, A2, E3 - solid, foundational
    lfoRate: 0.06, 
    lfoDepth: 2,
    filterFreq: 600,
    character: 'Solid foundation'
  },
  ANTHEMS: { 
    baseFreqs: [196.00, 293.66, 392.00], // G3, D4, G4 - soaring, triumphant
    lfoRate: 0.1, 
    lfoDepth: 6,
    filterFreq: 2500,
    character: 'Soaring harmony'
  },
};

export const useCosmologicalAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const ambientNodesRef = useRef<{
    oscillators: OscillatorNode[];
    lfos: OscillatorNode[];
    gains: GainNode[];
    masterGain: GainNode | null;
  }>({ oscillators: [], lfos: [], gains: [], masterGain: null });
  const isPlayingRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientVolume, setAmbientVolumeState] = useState(0.15);
  const [currentAmbientSeason, setCurrentAmbientSeason] = useState<Season>('POLLENS');

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

  // Play trigram sound - 3-note arpeggio with characteristic shape
  const playTrigramSound = useCallback((trigramName: string) => {
    const ctx = initAudio();
    if (!ctx) return;

    const config = TRIGRAM_SOUNDS[trigramName];
    if (!config) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(gainNodeRef.current!);

    // Create filter for shimmer
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3000;
    filter.connect(masterGain);

    config.frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Add slight detune for richness
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 1.002;

      const oscGain = ctx.createGain();
      const startTime = now + index * 0.15;
      
      oscGain.gain.setValueAtTime(0, startTime);
      oscGain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
      oscGain.gain.linearRampToValueAtTime(0.3, startTime + 0.2);
      oscGain.gain.linearRampToValueAtTime(0, startTime + 0.8);

      osc.connect(oscGain);
      osc2.connect(oscGain);
      oscGain.connect(filter);

      osc.start(startTime);
      osc2.start(startTime);
      osc.stop(startTime + 1);
      osc2.stop(startTime + 1);
    });
  }, [initAudio]);

  // Play hexagram sound - 6-part harmony based on lines
  const playHexagramSound = useCallback((hexagram: Hexagram) => {
    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(gainNodeRef.current!);

    // Map lines to frequencies: yang (solid) = higher, yin (broken) = lower
    const baseFreq = 220; // A3
    const yangFreqs = [440, 493.88, 523.25, 587.33, 659.25, 783.99]; // Higher octave
    const yinFreqs = [220, 246.94, 261.63, 293.66, 329.63, 392.00];   // Lower octave

    hexagram.lines.forEach((isYang, index) => {
      const freq = isYang ? yangFreqs[index] : yinFreqs[index];
      
      const osc = ctx.createOscillator();
      osc.type = isYang ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      const oscGain = ctx.createGain();
      const startTime = now + index * 0.1;
      
      oscGain.gain.setValueAtTime(0, startTime);
      oscGain.gain.linearRampToValueAtTime(0.4, startTime + 0.15);
      oscGain.gain.linearRampToValueAtTime(0.25, startTime + 0.5);
      oscGain.gain.linearRampToValueAtTime(0, startTime + 2);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 2.5);
    });
  }, [initAudio]);

  // Play geometric pattern sound
  const playGeometricPatternSound = useCallback((patternType: string) => {
    const ctx = initAudio();
    if (!ctx) return;

    const config = GEOMETRIC_SOUND_PROFILES[patternType];
    if (!config) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(gainNodeRef.current!);

    config.frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = config.type === 'ambient' ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      const oscGain = ctx.createGain();
      const startTime = now + (config.timing[index] || 0) / 1000;
      
      oscGain.gain.setValueAtTime(0, startTime);
      oscGain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
      oscGain.gain.linearRampToValueAtTime(0.3, startTime + 0.3);
      oscGain.gain.linearRampToValueAtTime(0, startTime + 1.2);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 1.5);
    });
  }, [initAudio]);

  // Start ambient soundscape
  const startAmbientSoundscape = useCallback((season: Season = 'POLLENS') => {
    const ctx = initAudio();
    if (!ctx || isAmbientPlaying) return;

    const profile = AMBIENT_PROFILES[season];
    const now = ctx.currentTime;

    // Create master gain for ambient with fade-in
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(ambientVolume, now + 2); // 2s fade-in
    masterGain.connect(gainNodeRef.current!);
    ambientNodesRef.current.masterGain = masterGain;

    // Create filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = profile.filterFreq;
    filter.Q.value = 1;
    filter.connect(masterGain);

    // Create oscillators for each base frequency
    profile.baseFreqs.forEach((freq, index) => {
      // Main oscillator
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // LFO for subtle movement
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = profile.lfoRate + (index * 0.02); // Slight offset per voice

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = profile.lfoDepth;

      // Connect LFO to oscillator frequency
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Voice gain (stagger entry)
      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0, now);
      voiceGain.gain.linearRampToValueAtTime(0.3, now + 1 + (index * 0.5));

      osc.connect(voiceGain);
      voiceGain.connect(filter);

      // Start
      osc.start(now);
      lfo.start(now);

      // Store references
      ambientNodesRef.current.oscillators.push(osc);
      ambientNodesRef.current.lfos.push(lfo);
      ambientNodesRef.current.gains.push(voiceGain);
    });

    setIsAmbientPlaying(true);
    setCurrentAmbientSeason(season);
  }, [initAudio, isAmbientPlaying, ambientVolume]);

  // Stop ambient soundscape
  const stopAmbientSoundscape = useCallback(() => {
    if (!isAmbientPlaying || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Fade out master gain
    if (ambientNodesRef.current.masterGain) {
      ambientNodesRef.current.masterGain.gain.linearRampToValueAtTime(0, now + 1.5);
    }

    // Stop all nodes after fade
    setTimeout(() => {
      ambientNodesRef.current.oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) { /* already stopped */ }
      });
      ambientNodesRef.current.lfos.forEach(lfo => {
        try { lfo.stop(); } catch (e) { /* already stopped */ }
      });
      ambientNodesRef.current = { oscillators: [], lfos: [], gains: [], masterGain: null };
      setIsAmbientPlaying(false);
    }, 1600);
  }, [isAmbientPlaying]);

  // Change ambient season (crossfade)
  const changeAmbientSeason = useCallback((newSeason: Season) => {
    if (!isAmbientPlaying) {
      startAmbientSoundscape(newSeason);
      return;
    }
    
    // Crossfade: stop current and start new
    stopAmbientSoundscape();
    setTimeout(() => {
      startAmbientSoundscape(newSeason);
    }, 1700); // Start after fade-out completes
  }, [isAmbientPlaying, startAmbientSoundscape, stopAmbientSoundscape]);

  // Set ambient volume
  const setAmbientVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setAmbientVolumeState(clampedVolume);
    
    if (ambientNodesRef.current.masterGain && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      ambientNodesRef.current.masterGain.gain.linearRampToValueAtTime(clampedVolume, now + 0.1);
    }
  }, []);

  // Get current ambient profile info
  const getAmbientProfile = useCallback((season: Season) => {
    return AMBIENT_PROFILES[season];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop ambient if playing
      ambientNodesRef.current.oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) { /* ignore */ }
      });
      ambientNodesRef.current.lfos.forEach(lfo => {
        try { lfo.stop(); } catch (e) { /* ignore */ }
      });
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playTileSound,
    playTilePath,
    playResonanceChord,
    playTrigramSound,
    playHexagramSound,
    playGeometricPatternSound,
    initAudio,
    isInitialized,
    // Ambient soundscape
    startAmbientSoundscape,
    stopAmbientSoundscape,
    changeAmbientSeason,
    setAmbientVolume,
    getAmbientProfile,
    isAmbientPlaying,
    ambientVolume,
    currentAmbientSeason
  };
};
