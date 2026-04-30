import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { breadcrumbsFor, type BreadcrumbItem } from "@/lib/routeRegistry";
import { CANONICAL_HOST } from "@/lib/structuredData";

export interface UseAutoBreadcrumbsOptions {
  /** When true, each `path` is returned as a fully-qualified absolute URL. */
  absolute?: boolean;
  /** Optional host override (defaults to the canonical paracosm host). */
  host?: string;
}

/**
 * Returns the breadcrumb trail for the current route, derived from the
 * central route registry. Use this for any visible breadcrumb UI to
 * guarantee it stays in sync with the JSON-LD BreadcrumbList emitted
 * by `usePageSeo`.
 *
 * Pass `{ absolute: true }` to receive canonical absolute URLs (useful
 * when rendering anchors that should match the JSON-LD output).
 */
export const useAutoBreadcrumbs = (
  options: UseAutoBreadcrumbsOptions = {},
): BreadcrumbItem[] => {
  const { pathname } = useLocation();
  const { absolute = false, host = CANONICAL_HOST } = options;

  return useMemo(() => {
    const trail = breadcrumbsFor(pathname);
    if (!absolute) return trail;
    return trail.map((item) => ({
      ...item,
      path: item.path.startsWith("http")
        ? item.path
        : `${host}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    }));
  }, [pathname, absolute, host]);
};

export default useAutoBreadcrumbs;
