export const ALLOWED_HOST = "paracosm.helloarchitekt.com";
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
  if (u.host !== ALLOWED_HOST) {
    throw new Error(`Only ${ALLOWED_HOST} URLs are allowed (got ${u.host}).`);
  }
  return u;
}
