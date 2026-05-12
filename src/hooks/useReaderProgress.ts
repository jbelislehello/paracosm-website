import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "calm-magic-reader-progress";

interface ProgressState {
  readSlugs: string[];
  readPhases: string[];
  lastSlug: string | null;
  updatedAt: string | null;
}

const EMPTY: ProgressState = {
  readSlugs: [],
  readPhases: [],
  lastSlug: null,
  updatedAt: null,
};

function readStored(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      readSlugs: Array.isArray(parsed.readSlugs) ? parsed.readSlugs : [],
      readPhases: Array.isArray(parsed.readPhases) ? parsed.readPhases : [],
      lastSlug: parsed.lastSlug ?? null,
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return EMPTY;
  }
}

function writeStored(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("reader-progress:update"));
  } catch {
    // ignore quota errors
  }
}

export function useReaderProgress() {
  const [state, setState] = useState<ProgressState>(EMPTY);

  useEffect(() => {
    setState(readStored());
    const handler = () => setState(readStored());
    window.addEventListener("reader-progress:update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("reader-progress:update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const markRead = useCallback((slug: string, phase?: string) => {
    const current = readStored();
    const readSlugs = current.readSlugs.includes(slug)
      ? current.readSlugs
      : [...current.readSlugs, slug];
    const readPhases =
      phase && !current.readPhases.includes(phase)
        ? [...current.readPhases, phase]
        : current.readPhases;
    const next: ProgressState = {
      readSlugs,
      readPhases,
      lastSlug: slug,
      updatedAt: new Date().toISOString(),
    };
    writeStored(next);
    setState(next);
  }, []);

  const reset = useCallback(() => {
    writeStored(EMPTY);
    setState(EMPTY);
  }, []);

  return { ...state, markRead, reset };
}
