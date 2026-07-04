/**
 * Build a sitemap.xml string from the route registry.
 *
 * - Static routes (no `:param` segments) are included verbatim.
 * - Dynamic routes are expanded from known data sources:
 *     /drift/library/:axis  → one URL per DriftToolAxis
 *     /drift/:year/:month   → one URL per unique (year, month) pair
 * - Routes flagged `noindex: true` are skipped.
 *
 * Pure / dependency-light: safe to call from a Vite plugin in Node.
 */

import { ROUTE_REGISTRY, type RouteMeta } from "./routeRegistry";
import { CANONICAL_HOST } from "./structuredData";
import { driftTools, type DriftToolAxis } from "@/data/driftTools";
import { agenticResidencies } from "@/data/agenticResidencies";
import { REHEARSAL_ARC_PROGRAM } from "@/data/rehearsalArcProgram";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
}

const isDynamic = (path: string) => path.includes(":");

const priorityFor = (path: string): { changefreq: SitemapUrl["changefreq"]; priority: string } => {
  if (path === "/") return { changefreq: "weekly", priority: "1.0" };
  // Top-level (one segment) marketing routes
  if (path.split("/").filter(Boolean).length === 1) {
    return { changefreq: "monthly", priority: "0.8" };
  }
  return { changefreq: "monthly", priority: "0.6" };
};

const join = (host: string, path: string) =>
  `${host}${path.startsWith("/") ? path : `/${path}`}`;

const expandDynamic = (meta: RouteMeta): string[] => {
  switch (meta.path) {
    case "/drift/library/:axis": {
      const axes: DriftToolAxis[] = ["love", "magic", "calm", "open", "free"];
      return axes.map((axis) => `/drift/library/${axis}`);
    }
    case "/drift/:year/:month": {
      const seen = new Set<string>();
      driftTools.forEach((t) => seen.add(`${t.year}/${t.month}`));
      return Array.from(seen).map((ym) => `/drift/${ym}`);
    }
    case "/trainings/:slug": {
      return ["glitch", "drift", "tune"].map((s) => `/trainings/${s}`);
    }
    case "/agentic-ux/residencies/:slug": {
      return agenticResidencies.map((r) => `/agentic-ux/residencies/${r.slug}`);
    }
    case "/programs/rehearsal-arc/:slug": {
      return REHEARSAL_ARC_PROGRAM.map((o) => `/programs/rehearsal-arc/${o.slug}`);
    }
    default:
      return [];
  }

};

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface BuildSitemapOptions {
  host?: string;
  /** ISO date string for <lastmod>; defaults to today. */
  lastmod?: string;
}

export const buildSitemapXml = (options: BuildSitemapOptions = {}): string => {
  const host = (options.host ?? CANONICAL_HOST).replace(/\/+$/, "");
  const lastmod = options.lastmod ?? new Date().toISOString().slice(0, 10);

  const urls: SitemapUrl[] = [];
  const seen = new Set<string>();

  for (const meta of ROUTE_REGISTRY) {
    if (meta.noindex) continue;

    const paths = isDynamic(meta.path) ? expandDynamic(meta) : [meta.path];
    for (const p of paths) {
      if (seen.has(p)) continue;
      seen.add(p);
      const { changefreq, priority } = priorityFor(p);
      urls.push({ loc: join(host, p), lastmod, changefreq, priority });
    }
  }

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
};

export default buildSitemapXml;
