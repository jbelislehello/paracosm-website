// Allowlist of origins permitted as post-checkout / redirect targets.
// Prevents attacker-controlled Origin headers from steering Stripe success/cancel URLs.
const ALLOWED_ORIGINS = new Set<string>([
  "https://paracosm.helloarchitekt.com",
  "https://calm-magic.com",
  "https://www.calm-magic.com",
  "https://paracosm-website.lovable.app",
]);

const LOVABLE_PREVIEW_RE = /^https:\/\/[a-z0-9-]+\.lovable\.app$/i;

export function safeOrigin(req: Request, fallback: string): string {
  const raw = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.has(raw)) return raw;
  if (LOVABLE_PREVIEW_RE.test(raw)) return raw;
  return fallback;
}
