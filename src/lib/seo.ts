/**
 * Hjælpere til strukturerede data (JSON-LD / schema.org).
 * Siderne bygger objekterne her og sender dem til BaseLayout via
 * `schema`-proppen, som skriver dem i <script type="application/ld+json">.
 */
import { SITE, SOCIAL_LINKS } from "../config";

/** Absolut URL ud fra en rod-relativ sti, fx "/anmeldelser/" -> fuldt domæne. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).href;
}

/** Matchabladet som udgiver og forfatter. Genbruges på tværs af artikeltyperne. */
export const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE.url}/#organisation`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/images/logo/leaf_logo.png"),
  },
  // Profiler på andre platforme; mailto-links hører ikke til i sameAs.
  sameAs: SOCIAL_LINKS.filter((link) => link.href.startsWith("http")).map(
    (link) => link.href,
  ),
} as const;

/** Selve sitet. Bruges på forsiden sammen med organizationSchema. */
export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: `${SITE.url}/`,
  name: SITE.name,
  description: SITE.description,
  inLanguage: SITE.lang,
  publisher: { "@id": `${SITE.url}/#organisation` },
} as const;

/**
 * Brødkrummesti, fx Forside > Anmeldelser > artiklen.
 * Sidste led må gerne stå uden sti; så peger det på den aktuelle side.
 */
export function breadcrumbSchema(crumbs: { name: string; path?: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

/** Datoformat til schema.org og <time datetime>, fx "2026-06-09". */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
