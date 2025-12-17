import { useRef, useCallback, useEffect, useState } from 'react';

// Pentatonic scale frequencies for pleasant harmonics
const PENTATONIC_RATIOS = [1, 1.125, 1.25, 1.5, 1.667, 2];

interface PositionAudioConfig {
  baseFrequency: number;
  enabled: boolean;
  volume: number;
}

// Map position to musical parameters
function positionToMusic(
  x: number, // -1 to 1 (Memory to Novelty)
  y: number, // -1 to 1 (Intimacy to Sovereignty)
  density: number // 0 to 1
) {
  // X-axis controls pitch (Memory = lower, Novelty = higher)
  const pitchIndex = Math.floor(((x + 1) / 2) * (PENTATONIC_RATIOS.length - 1));
  const pitchRatio = PENTATONIC_RATIOS[Math.min(pitchIndex, PENTATONIC_RATIOS.length - 1)];
  
  // Y-axis controls filter (Intimacy = warm/mellow, Sovereignty = bright/clear)
  const filterFreq = 200 + ((y + 1) / 2) * 2000;
  const filterQ = 1 + ((y + 1) / 2) * 4;
  
  // Density controls volume/sustain
  const gain = 0.1 + density * 0.3;
  
  // Distance from center affects detune (more extreme = more tension)
  const distFromCenter = Math.sqrt(x * x + y * y);
  const detune = distFromCenter * 15; // Cents of detune
  
  return { pitchRatio, filterFreq, filterQ, gain, detune };
}

export function usePositionAudio(config: PositionAudioConfig = {
  baseFrequency: 220,
  enabled: false,
  volume: 0.3,
}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    
    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    
    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = config.volume;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;
    
    // Create filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    filter.Q.value = 2;
    filter.connect(masterGain);
    filterNodeRef.current = filter;
    
    // Create gain for envelope
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(filter);
    gainNodeRef.current = gain;
    
    // Create oscillators (fundamental + harmonics)
    const oscs: OscillatorNode[] = [];
    [1, 2, 3].forEach((harmonic, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = config.baseFrequency * harmonic;
      
      const oscGain = ctx.createGain();
      oscGain.gain.value = 1 / (harmonic * 2); // Harmonics get quieter
      
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start();
      oscs.push(osc);
    });
    oscillatorsRef.current = oscs;
  }, [config.baseFrequency, config.volume]);

  // Update position and generate corresponding sound
  const playPosition = useCallback((x: number, y: number, density: number = 0.5, season?: string) => {
    if (!config.enabled) return;
    
    initAudio();
    
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;
    const filter = filterNodeRef.current;
    const oscs = oscillatorsRef.current;
    
    if (!ctx || !gain || !filter || oscs.length === 0) return;
    
    const now = ctx.currentTime;
    const music = positionToMusic(x, y, density);
    
    // Update oscillator frequencies
    oscs.forEach((osc, i) => {
      const baseFreq = config.baseFrequency * music.pitchRatio;
      const harmonicFreq = baseFreq * (i + 1);
      osc.frequency.setTargetAtTime(harmonicFreq, now, 0.1);
      osc.detune.setTargetAtTime(music.detune * (i + 1), now, 0.1);
    });
    
    // Update filter
    filter.frequency.setTargetAtTime(music.filterFreq, now, 0.1);
    filter.Q.setTargetAtTime(music.filterQ, now, 0.1);
    
    // Envelope: quick attack, sustain, then fade
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(music.gain, now + 0.05);
    gain.gain.linearRampToValueAtTime(music.gain * 0.7, now + 0.5);
    gain.gain.linearRampToValueAtTime(0, now + 1.5);
    
    setCurrentPosition({ x, y });
    setIsPlaying(true);
    
    setTimeout(() => setIsPlaying(false), 1500);
  }, [config.enabled, config.baseFrequency, initAudio]);

  // Play continuous drone based on position (for ambient mode)
  const startDrone = useCallback((x: number, y: number, density: number = 0.5) => {
    if (!config.enabled) return;
    
    initAudio();
    
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;
    const filter = filterNodeRef.current;
    const oscs = oscillatorsRef.current;
    
    if (!ctx || !gain || !filter || oscs.length === 0) return;
    
    const now = ctx.currentTime;
    const music = positionToMusic(x, y, density);
    
    // Update all parameters smoothly
    oscs.forEach((osc, i) => {
      const baseFreq = config.baseFrequency * music.pitchRatio;
      const harmonicFreq = baseFreq * (i + 1);
      osc.frequency.setTargetAtTime(harmonicFreq, now, 0.3);
      osc.detune.setTargetAtTime(music.detune * (i + 1), now, 0.3);
    });
    
    filter.frequency.setTargetAtTime(music.filterFreq, now, 0.3);
    filter.Q.setTargetAtTime(music.filterQ, now, 0.3);
    
    // Gentle fade in
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(music.gain * 0.5, now, 0.5);
    
    setCurrentPosition({ x, y });
    setIsPlaying(true);
  }, [config.enabled, config.baseFrequency, initAudio]);

  // Stop all sound
  const stopDrone = useCallback(() => {
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;
    
    if (ctx && gain) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.3);
    }
    
    setIsPlaying(false);
  }, []);

  // Set master volume
  const setVolume = useCallback((vol: number) => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        Math.max(0, Math.min(1, vol)),
        audioContextRef.current?.currentTime || 0,
        0.1
      );
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playPosition,
    startDrone,
    stopDrone,
    setVolume,
    isPlaying,
    currentPosition,
  };
}
