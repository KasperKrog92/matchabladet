# Matchabladet

Et dansk matcha-magasin: ærlige caféanmeldelser, rolige guides og ranglister, der hjælper
dig med at finde den bedste skål matcha i Danmark. Siden er bygget til at føles rolig,
editorial og japandi-inspireret – hurtig at læse og nem at vedligeholde.

Hele sitet er på **dansk** som standardsprog.

## Teknologi

- **[Astro](https://astro.build)** – statisk side-generering (`output: "static"`)
- **TypeScript** – i streng tilstand
- **Tailwind CSS v4** – via `@tailwindcss/vite`
- **MDX** – til indhold med komponenter
- **Astro Content Collections** – typesikkert indhold for `reviews`, `guides` og `blog`
- **@astrojs/sitemap** – automatisk sitemap
- **npm** – pakkehåndtering

## Kom i gang

Kræver Node.js 18.20+, 20.3+ eller 22+.

```bash
# Installer afhængigheder
npm install

# Start udviklingsserver på http://localhost:4321
npm run dev

# Byg til produktion (kører TypeScript-tjek + bygger til /dist)
npm run build

# Forhåndsvis det byggede site lokalt
npm run preview
```

Kør `npm run check` for at typetjekke uden at bygge.

## Projektstruktur

```text
public/
  images/            Statiske billeder (logo, OG-fallback)
  robots.txt
src/
  assets/images/     Billeder der optimeres af Astro (<Image>)
  components/        SiteHeader, SiteFooter, ReviewCard, RatingBadge, TagList, PageIntro, ArticleCard
  content/
    reviews/         Caféanmeldelser (.mdx)
    guides/          Guides og artikler (.mdx)
    blog/            Blogindlæg (.mdx)
  layouts/           BaseLayout med SEO/Open Graph
  pages/             Forside + /anmeldelser, /guides, /blog, /ranglister, /om
  styles/            global.css med designtokens (Tailwind @theme)
  config.ts          Sidens navn, navigation og standard-SEO
  content.config.ts  Skemaer for indholdssamlingerne
  utils.ts           Hjælpefunktioner (datoformat m.m.)
```

## Indhold

Alt indhold ligger som Markdown/MDX i `src/content/`. Et nyt indlæg oprettes ved at lægge en
`.mdx`-fil i den relevante mappe med den frontmatter, skemaet kræver (se `src/content.config.ts`).

Eksempel på en anmeldelse:

```mdx
---
title: "Overskrift på anmeldelsen"
slug: "cafe-by"
city: "Aarhus"
cafeName: "Caféens navn"
visitedDate: 2026-05-18
drinkType: "Ceremoniel matcha"
overallRating: 8.7
matchaQuality: 9
preparation: 9
texture: 8
atmosphere: 9
veganFriendly: true
excerpt: "Kort opsummering, der vises på kort og i deling."
tags: ["ceremoniel", "aarhus"]
heroImage: "../../assets/images/review-cafe-by.webp"
---

Brødtekst skrevet i Markdown/MDX.
```

Sæt `draft: true` i frontmatter for at holde et indlæg ude af produktionsbygningen.

## Deployment

Sitet bygger til statiske filer i `dist/` og kan hostes hvor som helst.

### Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`
- Node-version: sæt `NODE_VERSION` til fx `22` under miljøvariabler.

### Vercel

- Vercel genkender Astro automatisk.
- **Build command:** `npm run build` · **Output directory:** `dist`
- Ingen serverless-adapter er nødvendig, da sitet er fuldt statisk.

Husk at sætte det rigtige domæne i `site` i `astro.config.mjs` (og i `public/robots.txt`),
så canonical-links, sitemap og Open Graph-billeder peger korrekt.
