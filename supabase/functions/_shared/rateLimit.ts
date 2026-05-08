// Simple in-memory per-IP rate limiter for edge functions.
// Note: in-memory state is per-instance; this is a pragmatic mitigation,
// not a hard guarantee. Use to slow abuse on unauthenticated AI endpoints.

const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitOptions {
  // Max requests per window per key
  limit?: number;
  // Window length in milliseconds
  windowMs?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function getClientKey(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

/**
 * Returns a 429 Response if the caller has exceeded the rate limit,
 * otherwise null to indicate the caller may proceed.
 */
export function checkRateLimit(
  req: Request,
  opts: RateLimitOptions = {},
): Response | null {
  const limit = opts.limit ?? 20;
  const windowMs = opts.windowMs ?? 60_000;

  const key = getClientKey(req);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (bucket.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please slow down.' }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      },
    );
  }

  bucket.count += 1;
  return null;
}
