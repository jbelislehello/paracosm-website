import { supabase } from "@/integrations/supabase/client";
import type {
  DimensionScore,
  RelationalAnswersMap,
  RelationalOverall,
  RelationalSnapshot,
} from "./types";

export function buildRelationalSnapshot(input: {
  ownerEmail?: string | null;
  overall: RelationalOverall;
  dimensionScores: Record<string, DimensionScore>;
  answers: RelationalAnswersMap;
}): RelationalSnapshot {
  return {
    kind: "relational",
    version: 1,
    ownerEmail: input.ownerEmail ?? null,
    overall: input.overall,
    dimensionScores: input.dimensionScores,
    answers: input.answers,
    builtAt: new Date().toISOString(),
  };
}

export function isRelationalSnapshot(s: unknown): s is RelationalSnapshot {
  return !!s && typeof s === "object" && (s as { kind?: string }).kind === "relational";
}

/** Creates a share row backed by the shared readiness_shares table (session_id stays null). */
export async function createRelationalShare(params: {
  ownerId: string;
  recipients: string[];
  note?: string;
  snapshot: RelationalSnapshot;
  expiresInDays?: number;
}) {
  const expiresAt = new Date(
    Date.now() + (params.expiresInDays ?? 7) * 24 * 60 * 60 * 1000,
  ).toISOString();
  const { data, error } = await supabase
    .from("readiness_shares")
    .insert({
      session_id: null,
      owner_id: params.ownerId,
      recipient_emails: params.recipients,
      note: params.note ?? null,
      snapshot: params.snapshot as never,
      expires_at: expiresAt,
    })
    .select("id, expires_at")
    .single();
  if (error) throw error;
  return data;
}
