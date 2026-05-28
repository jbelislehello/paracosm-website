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

async function fetchRoutes(): Promise<Route[]> {
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
      description: "A field manual for relational intelligence, AI leadership, and the inner work of building learning organizations.",
    },
    {
      path: "/book/compasses",
      title: "Compasses — Calm Magic",
      description: "All Calm Magic compasses: navigation patterns for operators and builders.",
    },
    {
      path: "/book/operators",
      title: "Operators — Calm Magic",
      description: "The operators of Calm Magic: the people, archetypes, and roles inside the book.",
    },
  ];

  if (!supabaseUrl || !anonKey) {
    // eslint-disable-next-line no-console
    console.warn("[prerender-og] Missing Supabase env; emitting static routes only.");
    return routes;
  }

  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };

  try {
    const tRes = await fetch(
      `${supabaseUrl}/rest/v1/trainings?status=eq.published&select=slug,title,tagline`,
      { headers },
    );
    if (tRes.ok) {
      const rows = (await tRes.json()) as Array<{
        slug: string;
        title: string;
        tagline: string | null;
      }>;
      for (const r of rows) {
        routes.push({
          path: `/trainings/${r.slug}`,
          title: `${r.title} | Paracosm Trainings`,
          description: r.tagline ?? "Paracosm Crewdle-bound training.",
          ogType: "article",
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
      `${supabaseUrl}/rest/v1/book_chapters?status=eq.published&select=slug,title,summary`,
      { headers },
    );
    if (cRes.ok) {
      const rows = (await cRes.json()) as Array<{
        slug: string;
        title: string;
        summary: string | null;
      }>;
      for (const r of rows) {
        routes.push({
          path: `/book/chapter/${r.slug}`,
          title: `${r.title} — Calm Magic`,
          description: r.summary ?? "A chapter from the Calm Magic book.",
          ogType: "article",
        });
      }
    } else {
      console.warn("[prerender-og] book_chapters fetch failed:", cRes.status);
    }
  } catch (err) {
    console.warn("[prerender-og] book_chapters fetch error:", err);
  }

  return routes;
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

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  const replaceMeta = (re: RegExp, replacement: string) => {
    if (re.test(out)) out = out.replace(re, replacement);
    else out = out.replace(/<\/head>/, `    ${replacement}\n  </head>`);
  };

  replaceMeta(
    /<meta\s+name="description"[^>]*>/,
    `<meta name="description" content="${desc}" />`,
  );
  replaceMeta(
    /<meta\s+property="og:title"[^>]*>/,
    `<meta property="og:title" content="${title}" />`,
  );
  replaceMeta(
    /<meta\s+property="og:description"[^>]*>/,
    `<meta property="og:description" content="${desc}" />`,
  );
  replaceMeta(
    /<meta\s+property="og:type"[^>]*>/,
    `<meta property="og:type" content="${ogType}" />`,
  );
  replaceMeta(
    /<meta\s+property="og:image"[^>]*>/,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
  );
  replaceMeta(
    /<meta\s+property="og:url"[^>]*>/,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
  );
  replaceMeta(
    /<meta\s+name="twitter:card"[^>]*>/,
    `<meta name="twitter:card" content="summary_large_image" />`,
  );
  replaceMeta(
    /<meta\s+name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  replaceMeta(
    /<meta\s+name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${desc}" />`,
  );
  replaceMeta(
    /<meta\s+name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  );
  replaceMeta(
    /<link\s+rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );

  return out;
}

export function prerenderOgPlugin(): Plugin {
  return {
    name: "paracosm-prerender-og",
    apply: "build",
    async generateBundle(_opts, bundle) {
      // Find the emitted index.html
      const indexAsset = Object.values(bundle).find(
        (b) => b.type === "asset" && b.fileName === "index.html",
      );
      if (!indexAsset || indexAsset.type !== "asset") {
        console.warn("[prerender-og] index.html not found in bundle; skipping.");
        return;
      }
      const indexHtml = String(indexAsset.source);

      let routes: Route[] = [];
      try {
        routes = await fetchRoutes();
      } catch (err) {
        console.warn("[prerender-og] route fetch failed:", err);
        return;
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
      console.log(`[prerender-og] Emitted ${routes.length} prerendered HTML files.`);
    },
  };
}

export default prerenderOgPlugin;
