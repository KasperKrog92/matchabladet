# Matchabladet

Matchabladet er et dansk matcha-univers bygget med Astro, TypeScript, Tailwind CSS, MDX og Astro Content Collections.

Siden er tænkt som et hurtigt, roligt og SEO-venligt content site til caféanmeldelser, ranglister, guides og blogindlæg om matcha i Danmark. Alt indhold ligger foreløbigt som MDX-filer i `src/content`.

## Kom i gang

Installer dependencies:

```bash
npm install
```

Start udviklingsserveren:

```bash
npm run dev
```

Byg den statiske side:

```bash
npm run build
```

Se buildet lokalt:

```bash
npm run preview
```

## Indhold

- Anmeldelser ligger i `src/content/reviews`
- Guides ligger i `src/content/guides`
- Blogindlæg ligger i `src/content/blog`

Frontmatter valideres i `src/content.config.ts`, så fejl i indhold opdages ved build.

## Deployment

Projektet bruger statisk Astro-output og kan deployes på både Cloudflare Pages og Vercel.

Forslag til build settings:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Opdater `site` i `astro.config.mjs`, hvis domænet ændres fra `https://matchabladet.dk`.
