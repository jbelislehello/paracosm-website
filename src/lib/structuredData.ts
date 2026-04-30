/**
 * Schema.org JSON-LD builders for page-level structured data.
 *
 * All builders return plain JSON-LD objects compatible with the
 * `jsonLd` option of `usePageSeo`. Pages should compose these as needed.
 *
 * The canonical host matches `usePageSeo`'s CANONICAL_HOST.
 */

export const CANONICAL_HOST = "https://paracosm.helloarchitekt.com";
export const DEFAULT_IMAGE = `${CANONICAL_HOST}/og-image.jpeg`;
export const ORG_ID = `${CANONICAL_HOST}/#organization`;
export const SITE_ID = `${CANONICAL_HOST}/#website`;

const abs = (path: string) =>
  path.startsWith("http") ? path : `${CANONICAL_HOST}${path.startsWith("/") ? path : `/${path}`}`;

export const orgSchema = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Paracosm",
  url: CANONICAL_HOST,
  logo: DEFAULT_IMAGE,
  image: DEFAULT_IMAGE,
  description:
    "Paracosm builds Learning Organizations for executives and innovators — AI systems mastery, relational intelligence, and the Calm Magic methodology.",
  sameAs: [
    "https://www.linkedin.com/in/jonathan-tk/",
    "https://medium.com/@jonathan-tk",
    "https://www.youtube.com/@ParacosmLife",
  ],
});

export const websiteSchema = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SITE_ID,
  url: CANONICAL_HOST,
  name: "Paracosm",
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
});

export const webPageSchema = (args: {
  title: string;
  description: string;
  url: string;
  type?: "WebPage" | "AboutPage" | "CollectionPage" | "ContactPage";
  image?: string;
}): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": args.type ?? "WebPage",
  url: abs(args.url),
  name: args.title,
  description: args.description,
  image: args.image ?? DEFAULT_IMAGE,
  isPartOf: { "@id": SITE_ID },
  publisher: { "@id": ORG_ID },
});

export const articleSchema = (args: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: args.title,
  description: args.description,
  mainEntityOfPage: abs(args.url),
  url: abs(args.url),
  image: args.image ?? DEFAULT_IMAGE,
  datePublished: args.datePublished,
  dateModified: args.dateModified ?? args.datePublished,
  author: {
    "@type": "Person",
    name: args.authorName ?? "Jonathan",
  },
  publisher: { "@id": ORG_ID },
});

export const productSchema = (args: {
  name: string;
  description: string;
  url: string;
  image?: string;
  brand?: string;
  category?: string;
  offers?: Array<{ name?: string; price?: string; priceCurrency?: string; url?: string }>;
}): Record<string, unknown> => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    url: abs(args.url),
    image: args.image ?? DEFAULT_IMAGE,
    brand: {
      "@type": "Brand",
      name: args.brand ?? "Paracosm",
    },
    category: args.category,
  };
  if (args.offers && args.offers.length) {
    schema.offers = args.offers.map((o) => ({
      "@type": "Offer",
      name: o.name,
      price: o.price,
      priceCurrency: o.priceCurrency ?? "USD",
      url: o.url ? abs(o.url) : abs(args.url),
      availability: "https://schema.org/InStock",
    }));
  }
  return schema;
};

export const eventSchema = (args: {
  name: string;
  description: string;
  url: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  locationAddress?: { locality?: string; region?: string; country?: string };
  image?: string;
  attendanceMode?: "Offline" | "Online" | "Mixed";
}): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: args.name,
  description: args.description,
  url: abs(args.url),
  image: args.image ?? DEFAULT_IMAGE,
  startDate: args.startDate,
  endDate: args.endDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: `https://schema.org/${args.attendanceMode ?? "Offline"}EventAttendanceMode`,
  location: {
    "@type": "Place",
    name: args.locationName,
    address: args.locationAddress
      ? {
          "@type": "PostalAddress",
          addressLocality: args.locationAddress.locality,
          addressRegion: args.locationAddress.region,
          addressCountry: args.locationAddress.country,
        }
      : undefined,
  },
  organizer: { "@id": ORG_ID },
});

export const bookSchema = (args: {
  name: string;
  description: string;
  url: string;
  authorName?: string;
  image?: string;
  inLanguage?: string;
}): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Book",
  name: args.name,
  description: args.description,
  url: abs(args.url),
  image: args.image ?? DEFAULT_IMAGE,
  inLanguage: args.inLanguage ?? "en",
  author: {
    "@type": "Person",
    name: args.authorName ?? "Jonathan",
  },
  publisher: { "@id": ORG_ID },
});

export const creativeWorkSchema = (args: {
  name: string;
  description: string;
  url: string;
  image?: string;
  authorName?: string;
}): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: args.name,
  description: args.description,
  url: abs(args.url),
  image: args.image ?? DEFAULT_IMAGE,
  author: {
    "@type": "Person",
    name: args.authorName ?? "Jonathan",
  },
  publisher: { "@id": ORG_ID },
});

export const itemListSchema = (args: {
  url: string;
  name: string;
  items: Array<{ name: string; url?: string; description?: string }>;
}): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: args.name,
  url: abs(args.url),
  itemListElement: args.items.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.name,
    url: item.url ? abs(item.url) : undefined,
    description: item.description,
  })),
});

const absWithHost = (path: string, host?: string) => {
  if (path.startsWith("http")) return path;
  const base = host ?? CANONICAL_HOST;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const breadcrumbSchema = (
  items: Array<{ name: string; path: string }>,
  options: { host?: string } = {},
): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: it.name,
    item: {
      "@type": "WebPage",
      "@id": absWithHost(it.path, options.host),
      url: absWithHost(it.path, options.host),
      name: it.name,
    },
  })),
});

export const offerCatalogSchema = (args: {
  name: string;
  url: string;
  offers: Array<{ name: string; description?: string; price?: string; priceCurrency?: string }>;
}): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: args.name,
  url: abs(args.url),
  itemListElement: args.offers.map((o) => ({
    "@type": "Offer",
    name: o.name,
    description: o.description,
    price: o.price,
    priceCurrency: o.priceCurrency ?? "USD",
  })),
});
