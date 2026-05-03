import type { ResonanceMapData } from "./resonance";

const KEY = "paracosm:lastResonance";

export type StoredResonance = ResonanceMapData & { savedAt: number };

export function saveLastResonance(data: ResonanceMapData) {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ ...data, savedAt: Date.now() }),
    );
    window.dispatchEvent(new CustomEvent("resonance:updated"));
  } catch {
    // ignore quota / private mode
  }
}

export function loadLastResonance(): StoredResonance | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.question || !Array.isArray(parsed?.axes)) return null;
    return parsed as StoredResonance;
  } catch {
    return null;
  }
}

export function clearLastResonance() {
  try {
    sessionStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("resonance:updated"));
  } catch {
    // ignore
  }
}
