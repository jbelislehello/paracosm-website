// Garden-specific audio system with ambient soundscapes

import { useState, useEffect, useRef, useCallback } from 'react';

export interface GardenAudioProfile {
  name: string;
  description: string;
  baseFrequency: number;
  oscillatorType: OscillatorType;
  gainLevel: number;
  modulationSpeed: number;
}

const GARDEN_AUDIO_PROFILES: Record<string, GardenAudioProfile> = {
  intelligence: {
    name: 'Neural Forest',
    description: 'Synaptic pulses and thought whispers',
    baseFrequency: 432, // Cosmic tuning
    oscillatorType: 'sine',
    gainLevel: 0.08,
    modulationSpeed: 0.3,
  },
  systems: {
    name: 'Mechanical Garden',
    description: 'Rhythmic gears and data flow',
    baseFrequency: 528, // DNA repair frequency
    oscillatorType: 'triangle',
    gainLevel: 0.06,
    modulationSpeed: 0.5,
  },
  prototypes: {
    name: 'Greenhouse',
    description: 'Growth rustles and wind chimes',
    baseFrequency: 396, // Liberation frequency
    oscillatorType: 'sine',
    gainLevel: 0.07,
    modulationSpeed: 0.2,
  },
};

interface UseGardenAudioOptions {
  garden: 'intelligence' | 'systems' | 'prototypes';
  initialVolume?: number;
  autoPlay?: boolean;
}

interface UseGardenAudioReturn {
  isPlaying: boolean;
  volume: number;
  profile: GardenAudioProfile;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  playConnectionSound: () => void;
  playActivitySound: (activity: string) => void;
}

export const useGardenAudio = ({
  garden,
  initialVolume = 0.5,
  autoPlay = false,
}: UseGardenAudioOptions): UseGardenAudioReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(initialVolume);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

  const profile = GARDEN_AUDIO_PROFILES[garden];

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();
  }, []);

  // Create ambient drone
  const createAmbientDrone = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // Main oscillator
    const osc = ctx.createOscillator();
    osc.type = profile.oscillatorType;
    osc.frequency.value = profile.baseFrequency;
    
    // LFO for subtle modulation
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = profile.modulationSpeed;
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 10; // Modulation depth
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    // Main gain
    const gain = ctx.createGain();
    gain.gain.value = profile.gainLevel * volume;
    
    // Add subtle harmonics for richer sound
    const harmonic = ctx.createOscillator();
    harmonic.type = 'sine';
    harmonic.frequency.value = profile.baseFrequency * 1.5; // Fifth
    
    const harmonicGain = ctx.createGain();
    harmonicGain.gain.value = profile.gainLevel * volume * 0.3;
    
    // Connect everything
    osc.connect(gain);
    harmonic.connect(harmonicGain);
    gain.connect(ctx.destination);
    harmonicGain.connect(ctx.destination);
    
    // Start
    osc.start();
    lfo.start();
    harmonic.start();
    
    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    lfoRef.current = lfo;
    lfoGainRef.current = lfoGain;
  }, [profile, volume]);

  // Play
  const play = useCallback(() => {
    initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    createAmbientDrone();
    setIsPlaying(true);
  }, [initAudio, createAmbientDrone]);

  // Pause
  const pause = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch {}
      oscillatorRef.current = null;
    }
    if (lfoRef.current) {
      try {
        lfoRef.current.stop();
        lfoRef.current.disconnect();
      } catch {}
      lfoRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Toggle
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = profile.gainLevel * newVolume;
    }
  }, [profile.gainLevel]);

  // Play connection sound (when root extends to a service)
  const playConnectionSound = useCallback(() => {
    if (!audioContextRef.current) {
      initAudio();
    }
    
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(profile.baseFrequency * 1.5, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(profile.baseFrequency * 2, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }, [initAudio, profile.baseFrequency, volume]);

  // Play activity-specific sound
  const playActivitySound = useCallback((activity: string) => {
    if (!audioContextRef.current) {
      initAudio();
    }
    
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const frequencies: Record<string, number[]> = {
      seed: [523, 659, 784], // C-E-G arpeggio (planting)
      water: [392, 440, 494], // G-A-B (flowing)
      prune: [659, 523, 440], // E-C-A (cutting)
      grow: [440, 554, 659, 880], // Rising arpeggio (growth)
    };
    
    const freqs = frequencies[activity] || [440];
    
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.08 * volume, ctx.currentTime + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.4);
    });
  }, [initAudio, volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pause();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [pause]);

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && !isPlaying) {
      play();
    }
  }, [autoPlay, isPlaying, play]);

  // Update profile when garden changes
  useEffect(() => {
    if (isPlaying) {
      pause();
      play();
    }
  }, [garden]);

  return {
    isPlaying,
    volume,
    profile,
    play,
    pause,
    toggle,
    setVolume,
    playConnectionSound,
    playActivitySound,
  };
};

export default useGardenAudio;
