/**
 * Central konfiguration for Matchabladet.
 * Samler sidens navn, navigation og standard-SEO ét sted.
 */
export const SITE = {
  name: "Matchabladet",
  tagline: "Et dansk matcha-magasin",
  description:
    "Matchabladet er et dansk magasin om matcha med ærlige caféanmeldelser, rolige guides og ranglister, der hjælper dig med at finde den bedste matcha i Danmark.",
  url: "https://matchabladet.dk",
  locale: "da_DK",
  lang: "da",
  defaultOgImage: "/images/og-default.webp",
  author: "Matchabladet",
} as const;

export const NAV_LINKS = [
  { label: "Anmeldelser", href: "/anmeldelser" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "Ranglister", href: "/ranglister" },
  { label: "Om", href: "/om" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Kontakt", href: "mailto:kkandersen01@gmail.com" },
] as const;
