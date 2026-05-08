import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  retreatImageCredits,
  retreatImages,
  type ImageCredit,
} from "@/assets/retreats";
import { useAdminStatus } from "./useAdminStatus";

type Slug = keyof typeof retreatImages;

export type CreditPatch = {
  photographer?: string | null;
  location?: string | null;
  year?: string | null;
  event?: string | null;
};

type DbRow = {
  slug: string;
  photographer: string | null;
  location: string | null;
  year: string | null;
  event: string | null;
};

/**
 * Merges static fallback credits (from `src/assets/retreats/index.ts`)
 * with live overrides from the `image_credits` Supabase table.
 * Anyone can read; only admins can mutate.
 */
export function useImageCredits() {
  const { isAdmin, isLoading: adminLoading } = useAdminStatus();
  const [overrides, setOverrides] = useState<Record<string, DbRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("image_credits")
        .select("slug, photographer, location, year, event");
      if (cancelled) return;
      if (!error && data) {
        const map: Record<string, DbRow> = {};
        for (const row of data as DbRow[]) map[row.slug] = row;
        setOverrides(map);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getCredit = useCallback(
    (slug: Slug): ImageCredit => {
      const base = retreatImageCredits[slug];
      const o = overrides[slug];
      if (!o) return base;
      return {
        ...base,
        photographer: o.photographer ?? base.photographer,
        location: o.location ?? base.location,
        year: o.year ?? base.year,
        event: o.event ?? base.event,
      };
    },
    [overrides],
  );

  const upsertCredit = useCallback(
    async (slug: Slug, patch: CreditPatch) => {
      const payload = {
        slug,
        photographer: patch.photographer ?? null,
        location: patch.location ?? null,
        year: patch.year ?? null,
        event: patch.event ?? null,
      };
      const { data, error } = await supabase
        .from("image_credits")
        .upsert(payload, { onConflict: "slug" })
        .select("slug, photographer, location, year, event")
        .single();
      if (error) throw error;
      setOverrides((prev) => ({ ...prev, [slug]: data as DbRow }));
      return data as DbRow;
    },
    [],
  );

  return {
    getCredit,
    upsertCredit,
    isAdmin,
    loading: loading || adminLoading,
  };
}
