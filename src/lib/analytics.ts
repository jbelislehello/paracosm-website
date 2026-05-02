import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "anon-session-id";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "no-session";
  }
}

export async function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  try {
    // Mirror to dataLayer for any future GA4/GTM install
    const w = typeof window !== "undefined" ? (window as unknown as { dataLayer?: unknown[] }) : undefined;
    if (w?.dataLayer && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: eventName, ...properties });
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id ?? null;

    await supabase.from("analytics_events").insert({
      event_name: eventName,
      properties: properties as never,
      session_id: getSessionId(),
      user_id: userId,
      path: typeof window !== "undefined" ? window.location.pathname : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });
  } catch {
    /* analytics must never break UX */
  }
}
