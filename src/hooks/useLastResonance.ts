import { useEffect, useState } from "react";
import {
  clearLastResonance,
  loadLastResonance,
  type StoredResonance,
} from "@/lib/resonanceStorage";

export function useLastResonance() {
  const [data, setData] = useState<StoredResonance | null>(() =>
    typeof window === "undefined" ? null : loadLastResonance(),
  );

  useEffect(() => {
    const refresh = () => setData(loadLastResonance());
    window.addEventListener("resonance:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("resonance:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { data, clear: clearLastResonance };
}
