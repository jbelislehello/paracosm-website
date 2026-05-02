/**
 * Single source of truth for canonical, shareable routes.
 *
 * Each entry maps a path pattern (React Router style, e.g. "/drift/:axis")
 * to a human-readable label and an optional parent path. Breadcrumbs are
 * derived from this graph so JSON-LD BreadcrumbList always matches the
 * visible navigation.
 *
 * Add new public routes here whenever they're added to App.tsx so SEO
 * stays in sync with routing.
 */

export interface RouteMeta {
  /** Path pattern as registered in the router (supports :params). */
  path: string;
  /** Human label shown in breadcrumbs. Function form receives matched params. */
  label: string | ((params: Record<string, string>) => string);
  /** Parent route path. `null` for the root. Defaults to "/" when omitted. */
  parent?: string | null;
  /** Exclude from sitemap.xml (e.g. auth, admin, dashboard). */
  noindex?: boolean;
}

export const ROUTE_REGISTRY: RouteMeta[] = [
  { path: "/", label: "Home", parent: null },

  // Top-level public pages
  { path: "/about-us", label: "About" },
  { path: "/case-studies", label: "Case Studies" },
  { path: "/pricing", label: "Pricing" },
  { path: "/book", label: "Book" },
  { path: "/glitch-methodology", label: "GL!TCH Methodology" },
  { path: "/calm-magic-demo", label: "Calm Magic" },
  { path: "/dream-and-learn", label: "Dream & Learn" },
  { path: "/paracosm-retreat", label: "Paracosm Retreat" },
  { path: "/wuxia", label: "Wuxia the Fox" },
  { path: "/tonalli", label: "Tonalli" },
  { path: "/tarot", label: "Entrepreneurial Tarot" },
  { path: "/pattern-encyclopedia", label: "Pattern Encyclopedia" },
  { path: "/agentic-ux", label: "Agentic UX" },
  { path: "/design-system", label: "Design System" },
  { path: "/lineage", label: "Lineage & Comparables", parent: "/book" },
  { path: "/agentic-ecosystem-deck", label: "Agentic Ecosystem Deck", noindex: true },

  // Drift hierarchy
  { path: "/drift", label: "Drift" },
  {
    path: "/drift/library/:axis",
    label: (p) => `Drift Library — ${p.axis ?? ""}`.trim(),
    parent: "/drift",
  },
  {
    path: "/drift/:year/:month",
    label: (p) => `Drift ${p.year}/${p.month}`,
    parent: "/drift",
  },

  // Calm Magic Board hierarchy
  { path: "/calm-magic-board", label: "Calm Magic Board" },
  { path: "/calm-magic-board/log", label: "Log", parent: "/calm-magic-board" },
  { path: "/calm-magic-board/events", label: "Events", parent: "/calm-magic-board" },
  { path: "/calm-magic-board/insights", label: "Insights", parent: "/calm-magic-board" },
  { path: "/calm-magic-board/drift", label: "Drift", parent: "/calm-magic-board" },
  { path: "/calm-magic-board/prds", label: "PRDs", parent: "/calm-magic-board" },
  { path: "/calm-magic-board/garden", label: "Garden", parent: "/calm-magic-board" },
  { path: "/calm-magic-board/paracosm", label: "Paracosm", parent: "/calm-magic-board" },
  {
    path: "/calm-magic-board/prds/:id",
    label: (p) => `PRD ${p.id ?? ""}`.trim(),
    parent: "/calm-magic-board/prds",
  },
];

/* ------------------------------------------------------------------ */
/* Pattern matching                                                    */
/* ------------------------------------------------------------------ */

const segmentize = (path: string) =>
  path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

const matchPattern = (
  pattern: string,
  pathname: string,
): Record<string, string> | null => {
  if (pattern === "/" && (pathname === "/" || pathname === "")) return {};
  const pSegs = segmentize(pattern);
  const aSegs = segmentize(pathname);
  if (pSegs.length !== aSegs.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pSegs.length; i++) {
    const ps = pSegs[i];
    const as = aSegs[i];
    if (ps.startsWith(":")) {
      params[ps.slice(1)] = decodeURIComponent(as);
    } else if (ps !== as) {
      return null;
    }
  }
  return params;
};

interface ResolvedRoute {
  meta: RouteMeta;
  params: Record<string, string>;
}

const resolveRoute = (pathname: string): ResolvedRoute | null => {
  for (const meta of ROUTE_REGISTRY) {
    const params = matchPattern(meta.path, pathname);
    if (params) return { meta, params };
  }
  return null;
};

const findByPath = (path: string): RouteMeta | undefined =>
  ROUTE_REGISTRY.find((r) => r.path === path);

const labelFor = (meta: RouteMeta, params: Record<string, string>): string =>
  typeof meta.label === "function" ? meta.label(params) : meta.label;

/** Substitute params back into a parent pattern for the breadcrumb URL. */
const substitute = (pattern: string, params: Record<string, string>): string => {
  if (!pattern.includes(":")) return pattern;
  return (
    "/" +
    segmentize(pattern)
      .map((s) => (s.startsWith(":") ? params[s.slice(1)] ?? s : s))
      .join("/")
  );
};

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Build the breadcrumb trail for a concrete pathname by walking the
 * `parent` graph up to Home. Falls back to a Home-only trail for
 * unknown paths so JSON-LD output is always valid.
 */
export const breadcrumbsFor = (pathname: string): BreadcrumbItem[] => {
  const resolved = resolveRoute(pathname);
  if (!resolved) {
    return [{ name: "Home", path: "/" }];
  }

  const trail: BreadcrumbItem[] = [];
  let current: RouteMeta | undefined = resolved.meta;
  const params = resolved.params;
  let guard = 0;

  while (current && guard++ < 16) {
    trail.unshift({
      name: labelFor(current, params),
      path: substitute(current.path, params),
    });

    const parentPath =
      current.parent === null
        ? null
        : current.parent ?? (current.path === "/" ? null : "/");

    if (!parentPath) break;
    const parent = findByPath(parentPath);
    if (!parent) break;
    current = parent;
  }

  return trail;
};

export const labelForPath = (pathname: string): string | undefined => {
  const resolved = resolveRoute(pathname);
  if (!resolved) return undefined;
  return labelFor(resolved.meta, resolved.params);
};
