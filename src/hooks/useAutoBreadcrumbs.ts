import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { breadcrumbsFor, type BreadcrumbItem } from "@/lib/routeRegistry";

/**
 * Returns the breadcrumb trail for the current route, derived from the
 * central route registry. Use this for any visible breadcrumb UI to
 * guarantee it stays in sync with the JSON-LD BreadcrumbList emitted
 * by `usePageSeo`.
 */
export const useAutoBreadcrumbs = (): BreadcrumbItem[] => {
  const { pathname } = useLocation();
  return useMemo(() => breadcrumbsFor(pathname), [pathname]);
};

export default useAutoBreadcrumbs;
