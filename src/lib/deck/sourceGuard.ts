export const ALLOWED_HOST = "paracosm.helloarchitekt.com";
export const BLOCKED_HOSTS = new Set(["paracosm.life", "www.paracosm.life"]);

export function isAllowedSourceUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.host === ALLOWED_HOST && !BLOCKED_HOSTS.has(u.host);
  } catch {
    return false;
  }
}
