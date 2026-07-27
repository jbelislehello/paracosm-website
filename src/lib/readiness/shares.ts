import { supabase } from "@/integrations/supabase/client";
import type { AnswersMap, OverallScore, SeasonId, SeasonScore } from "./types";

export interface ShareSummary {
  seasonId: SeasonId;
  complete: boolean;
  score: SeasonScore;
  answered: number;
}

export interface ReadinessSnapshot {
  version: 1;
  ownerEmail?: string | null;
  overall: OverallScore;
  seasonScores: ShareSummary[];
  answers: AnswersMap;
  builtAt: string;
}

export interface ReadinessShareRow {
  id: string;
  session_id: string;
  recipient_emails: string[];
  note: string | null;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

export function buildSnapshot(input: {
  ownerEmail?: string | null;
  overall: OverallScore;
  seasonScores: ShareSummary[];
  answers: AnswersMap;
}): ReadinessSnapshot {
  return {
    version: 1,
    ownerEmail: input.ownerEmail ?? null,
    overall: input.overall,
    seasonScores: input.seasonScores,
    answers: input.answers,
    builtAt: new Date().toISOString(),
  };
}

export async function createShare(params: {
  sessionId: string;
  ownerId: string;
  recipients: string[];
  note?: string;
  snapshot: ReadinessSnapshot;
  expiresInDays?: number;
}) {
  const expiresAt = new Date(
    Date.now() + (params.expiresInDays ?? 7) * 24 * 60 * 60 * 1000,
  ).toISOString();
  const { data, error } = await supabase
    .from("readiness_shares")
    .insert({
      session_id: params.sessionId,
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

export async function listShares(ownerId: string): Promise<ReadinessShareRow[]> {
  const { data, error } = await supabase
    .from("readiness_shares")
    .select("id, session_id, recipient_emails, note, expires_at, revoked_at, created_at")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ReadinessShareRow[];
}

export async function revokeShare(id: string) {
  const { error } = await supabase
    .from("readiness_shares")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteShare(id: string) {
  const { error } = await supabase.from("readiness_shares").delete().eq("id", id);
  if (error) throw error;
}

export function shareUrl(id: string): string {
  return `${window.location.origin}/r/${id}`;
}

export async function requestShareCode(shareId: string, email: string) {
  const { data, error } = await supabase.functions.invoke("readiness-share-request-code", {
    body: { shareId, email },
  });
  if (error) throw error;
  return data as { ok: true; expiresAt: string };
}

export async function verifyShareCode(shareId: string, email: string, code: string) {
  const { data, error } = await supabase.functions.invoke("readiness-share-verify", {
    body: { shareId, email, code },
  });
  if (error) throw error;
  return data as {
    ok: true;
    snapshot: ReadinessSnapshot;
    note: string | null;
    expiresAt: string;
    createdAt: string;
  };
}
