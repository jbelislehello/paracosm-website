export const ALLOWED_HOSTS = new Set([
  "paracosm.helloarchitekt.com",
  "calm-magic.com",
  "www.calm-magic.com",
]);
// Backward-compat: default allowed host used by callers expecting a single value.
export const ALLOWED_HOST = "calm-magic.com";
export const BLOCKED_HOSTS = new Set(["paracosm.life", "www.paracosm.life"]);

export function assertAllowedUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error(`Invalid URL: ${raw}`);
  }
  if (BLOCKED_HOSTS.has(u.host)) {
    throw new Error("paracosm.life is not an allowed source.");
  }
  if (!ALLOWED_HOSTS.has(u.host)) {
    throw new Error(`Host not allowed: ${u.host}.`);
  }
  return u;
}
