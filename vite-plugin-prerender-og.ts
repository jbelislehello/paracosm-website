import type { Plugin } from "vite";

/**
 * Build-time prerender plugin: emits per-route HTML files whose <head>
 * carries the right title/description/og:* tags so social-preview
 * crawlers (LinkedIn, iMessage, Slack, Facebook, WhatsApp, X) see
 * accurate previews for /trainings/* and /book/* URLs.
 *
 * The body stays the SPA shell — when a real browser loads the URL,
 * React Router hydrates and renders the page normally. Only the head
 * differs from the default index.html.
 *
 * Per-route OG images:
 *   - If the row in Supabase has `og_image_url`, use it verbatim.
 *   - Otherwise emit a branded SVG card at /og/<kind>-<slug>.svg and
 *     point og:image / twitter:image at it.
 */

const HOST = "https://calm-magic.com";
const DEFAULT_IMAGE = `${HOST}/og-image.jpeg`;

type Route = {
  path: string; // e.g. "/trainings/glitch"
  title: string;
  description: string;
  image?: string;
  ogType?: string;
};

type GeneratedImage = {
  fileName: string; // e.g. "og/trainings-glitch.svg"
  source: string; // SVG markup
};

const PARACOSM_GRADIENTS: Record<string, [string, string, string]> = {
  trainings: ["#0b0f1a", "#1a1033", "#3b1d6b"],
  book: ["#0b0f1a", "#0d2333", "#1d3d4d"],
};

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const wrapTitle = (text: string, maxCharsPerLine: number, maxLines: number) => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if (!current) {
      current = w;
      continue;
    }
    if ((current + " " + w).length <= maxCharsPerLine) {
      current += " " + w;
    } else {
      lines.push(current);
      current = w;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines) {
    // ellipsize the last line if there's still text left over
    const total = lines.join(" ").length;
    if (total < text.length) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,3}$/, "…");
    }
  }
  return lines;
};

function generateOgSvg(opts: {
  kind: "trainings" | "book";
  title: string;
  eyebrow: string;
  subtitle?: string;
}): string {
  const [c1, c2, c3] = PARACOSM_GRADIENTS[opts.kind];
  const lines = wrapTitle(opts.title, 22, 3);
  const lineHeight = 84;
  const baseY = 360 - ((lines.length - 1) * lineHeight) / 2;
  const titleTspans = lines
    .map(
      (line, i) =>
        `<tspan x="80" y="${baseY + i * lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const subtitle = opts.subtitle
    ? `<text x="80" y="540" fill="#cbd5ff" font-family="ui-sans-serif, -apple-system, Segoe UI, Inter, sans-serif" font-size="28" opacity="0.85">${escapeXml(
        opts.subtitle.length > 80 ? opts.subtitle.slice(0, 79) + "…" : opts.subtitle,
      )}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g font-family="ui-sans-serif, -apple-system, Segoe UI, Inter, sans-serif">
    <text x="80" y="120" fill="#ffffff" font-size="22" letter-spacing="6" font-weight="600" opacity="0.85">PARACOSM</text>
    <text x="80" y="160" fill="#a5b4fc" font-size="20" letter-spacing="3" font-weight="500" opacity="0.9">${escapeXml(opts.eyebrow.toUpperCase())}</text>
    <text fill="#ffffff" font-size="72" font-weight="700" letter-spacing="-1">${titleTspans}</text>
    ${subtitle}
    <text x="80" y="590" fill="#ffffff" font-size="20" opacity="0.6">calm-magic.com</text>
  </g>
</svg>`;
}

async function fetchRoutes(): Promise<{
  routes: Route[];
  images: GeneratedImage[];
}> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const routes: Route[] = [
    {
      path: "/trainings",
      title: "Trainings — GL!TCH, Drift & Tune | Paracosm × Crewdle",
      description:
        "Three Crewdle-bound trainings by Paracosm: GL!TCH (official 65h Crewdle AI Formation), Drift (60h co-assisted development) and Tune (60h orchestrated autonomy).",
    },
    {
      path: "/book",
      title: "Calm Magic — the book | Paracosm",
      description:
        "A field manual for relational intelligence, AI leadership, and the inner work of building learning organizations.",
    },
    {
      path: "/book/compasses",
      title: "Compasses — Calm Magic",
      description:
        "All Calm Magic compasses: navigation patterns for operators and builders.",
    },
    {
      path: "/book/operators",
      title: "Operators — Calm Magic",
      description:
        "The operators of Calm Magic: the people, archetypes, and roles inside the book.",
    },
  ];
  const images: GeneratedImage[] = [];

  if (!supabaseUrl || !anonKey) {
    // eslint-disable-next-line no-console
    console.warn("[prerender-og] Missing Supabase env; emitting static routes only.");
    return { routes, images };
  }

  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };

  try {
    const tRes = await fetch(
      `${supabaseUrl}/rest/v1/trainings?status=eq.published&select=slug,title,tagline,og_image_url`,
      { headers },
    );
    if (tRes.ok) {
      const rows = (await tRes.json()) as Array<{
        slug: string;
        title: string;
        tagline: string | null;
        og_image_url: string | null;
      }>;
      for (const r of rows) {
        let image: string;
        if (r.og_image_url && r.og_image_url.trim()) {
          image = r.og_image_url.trim();
        } else {
          const fileName = `og/trainings-${r.slug}.svg`;
          images.push({
            fileName,
            source: generateOgSvg({
              kind: "trainings",
              eyebrow: "Training",
              title: r.title,
              subtitle: r.tagline ?? undefined,
            }),
          });
          image = `${HOST}/${fileName}`;
        }
        routes.push({
          path: `/trainings/${r.slug}`,
          title: `${r.title} | Paracosm Trainings`,
          description: r.tagline ?? "Paracosm Crewdle-bound training.",
          ogType: "article",
          image,
        });
      }
    } else {
      console.warn("[prerender-og] trainings fetch failed:", tRes.status);
    }
  } catch (err) {
    console.warn("[prerender-og] trainings fetch error:", err);
  }

  try {
    const cRes = await fetch(
      `${supabaseUrl}/rest/v1/book_chapters?status=eq.published&select=slug,title,summary,phase,og_image_url`,
      { headers },
    );
    if (cRes.ok) {
      const rows = (await cRes.json()) as Array<{
        slug: string;
        title: string;
        summary: string | null;
        phase: string | null;
        og_image_url: string | null;
      }>;
      for (const r of rows) {
        let image: string;
        if (r.og_image_url && r.og_image_url.trim()) {
          image = r.og_image_url.trim();
        } else {
          const fileName = `og/book-${r.slug}.svg`;
          images.push({
            fileName,
            source: generateOgSvg({
              kind: "book",
              eyebrow: r.phase ? `Calm Magic · ${r.phase}` : "Calm Magic",
              title: r.title,
              subtitle: r.summary ?? undefined,
            }),
          });
          image = `${HOST}/${fileName}`;
        }
        routes.push({
          path: `/book/chapter/${r.slug}`,
          title: `${r.title} — Calm Magic`,
          description: r.summary ?? "A chapter from the Calm Magic book.",
          ogType: "article",
          image,
        });
      }
    } else {
      console.warn("[prerender-og] book_chapters fetch failed:", cRes.status);
    }
  } catch (err) {
    console.warn("[prerender-og] book_chapters fetch error:", err);
  }

  return { routes, images };
}

const escapeAttr = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function rewriteHead(html: string, route: Route): string {
  const url = `${HOST}${route.path}`;
  const image = route.image ?? DEFAULT_IMAGE;
  const ogType = route.ogType ?? "website";
  const title = escapeAttr(route.title);
  const desc = escapeAttr(route.description);

  let out = html;

  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  const replaceMeta = (re: RegExp, replacement: string) => {
    if (re.test(out)) out = out.replace(re, replacement);
    else out = out.replace(/<\/head>/, `    ${replacement}\n  </head>`);
  };

  replaceMeta(/<meta\s+name="description"[^>]*>/, `<meta name="description" content="${desc}" />`);
  replaceMeta(/<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`);
  replaceMeta(/<meta\s+property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}" />`);
  replaceMeta(/<meta\s+property="og:type"[^>]*>/, `<meta property="og:type" content="${ogType}" />`);
  replaceMeta(/<meta\s+property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeAttr(image)}" />`);
  replaceMeta(/<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeAttr(url)}" />`);
  replaceMeta(/<meta\s+name="twitter:card"[^>]*>/, `<meta name="twitter:card" content="summary_large_image" />`);
  replaceMeta(/<meta\s+name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`);
  replaceMeta(/<meta\s+name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${desc}" />`);
  replaceMeta(/<meta\s+name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${escapeAttr(image)}" />`);
  replaceMeta(/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeAttr(url)}" />`);

  return out;
}

export function prerenderOgPlugin(): Plugin {
  return {
    name: "paracosm-prerender-og",
    apply: "build",
    async generateBundle(_opts, bundle) {
      const indexAsset = Object.values(bundle).find(
        (b) => b.type === "asset" && b.fileName === "index.html",
      );
      if (!indexAsset || indexAsset.type !== "asset") {
        console.warn("[prerender-og] index.html not found in bundle; skipping.");
        return;
      }
      const indexHtml = String(indexAsset.source);

      let routes: Route[] = [];
      let images: GeneratedImage[] = [];
      try {
        const fetched = await fetchRoutes();
        routes = fetched.routes;
        images = fetched.images;
      } catch (err) {
        console.warn("[prerender-og] route fetch failed:", err);
        return;
      }

      for (const img of images) {
        this.emitFile({
          type: "asset",
          fileName: img.fileName,
          source: img.source,
        });
      }

      for (const route of routes) {
        const trimmed = route.path.replace(/^\//, "");
        const fileName = `${trimmed}/index.html`;
        const html = rewriteHead(indexHtml, route);
        this.emitFile({
          type: "asset",
          fileName,
          source: html,
        });
      }
      console.log(
        `[prerender-og] Emitted ${routes.length} HTML files and ${images.length} OG images.`,
      );
    },
  };
}

export default prerenderOgPlugin;
