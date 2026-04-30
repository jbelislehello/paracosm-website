import { useEffect } from "react";
import { breadcrumbsFor } from "@/lib/routeRegistry";
import { breadcrumbSchema } from "@/lib/structuredData";

const CANONICAL_HOST = "https://paracosm.helloarchitekt.com";
const DEFAULT_IMAGE = `${CANONICAL_HOST}/og-image.jpeg`;

export type JsonLd = Record<string, unknown>;

export interface PageSeo {
  /** Page title shown in the tab and OG/Twitter title */
  title: string;
  /** Meta description (≤160 chars recommended) */
  description: string;
  /** Path that should be the canonical URL, e.g. "/calm-magic-demo" */
  path: string;
  /** Optional fully-qualified image URL for social previews */
  image?: string;
  /** Optional override of the canonical host (defaults to paracosm.helloarchitekt.com) */
  host?: string;
  /** og:type — defaults to "website" */
  ogType?: string;
  /** Optional JSON-LD structured data — single object or array of schema.org objects */
  jsonLd?: JsonLd | JsonLd[];
  /**
   * Auto-inject a BreadcrumbList derived from the route registry.
   * Defaults to true. Set to false to opt out (or supply your own
   * BreadcrumbList in `jsonLd` — auto-injection is skipped automatically
   * when one is detected).
   */
  autoBreadcrumb?: boolean;
}

const upsertMeta = (
  selector: string,
  attrs: Record<string, string>,
) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => {
      if (k !== "content") el.setAttribute(k, v);
    });
    document.head.appendChild(el);
  }
  el.setAttribute("content", attrs.content);
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const PAGE_LD_ATTR = "data-page-seo";

const clearPageJsonLd = () => {
  document.head
    .querySelectorAll(`script[type="application/ld+json"][${PAGE_LD_ATTR}="true"]`)
    .forEach((node) => node.remove());
};

const injectJsonLd = (schemas: JsonLd[]) => {
  schemas.forEach((schema) => {
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute(PAGE_LD_ATTR, "true");
    try {
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    } catch {
      // ignore malformed schema
    }
  });
};

/**
 * Update document title, canonical URL, description, OG/Twitter
 * meta tags, and (optionally) JSON-LD structured data for the
 * current page. Call once per page, near the top of the component,
 * with stable strings.
 */
export const usePageSeo = ({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  host = CANONICAL_HOST,
  ogType = "website",
  jsonLd,
}: PageSeo) => {
  const ldKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const url = `${host}${path.startsWith("/") ? path : `/${path}`}`;

    document.title = title;

    upsertCanonical(url);

    upsertMeta('meta[name="description"]', { name: "description", content: description });

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: ogType });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

    // Page-scoped JSON-LD: clear any previously-injected page schemas
    // (global schemas in index.html are untouched), then inject fresh.
    clearPageJsonLd();
    if (jsonLd) {
      const list = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      injectJsonLd(list);
    }

    return () => {
      clearPageJsonLd();
    };
  }, [title, description, path, image, host, ogType, ldKey]);
};

export default usePageSeo;
