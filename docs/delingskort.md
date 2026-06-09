# Delingskort (Open Graph-billeder)

Dette dokument beskriver, hvordan Matchabladets delingskort fungerer: de
billeder, der vises, når et link til en artikel deles på sociale platforme og i
beskedapps. Det gælder for både mennesker og AI-agenter.

`AGENTS.md` har den korte version. Her er detaljerne: hvordan kortene bygges,
hvordan designet justeres, og hvad der skal gøres efter et deploy.

## Sådan virker det

Hver udgivet artikel (ikke-draft) i de tre samlinger `reviews`, `guides` og
`blog` får et genereret delingskort på 1200x630 som JPEG. Kortene bygges ved
`npm run build` og ligger på ruter, der spejler sidens sektioner:

```
/og/anmeldelser/<slug>.jpg
/og/guides/<slug>.jpg
/og/blog/<slug>.jpg
```

To filer udgør featuren:

- [src/pages/og/\[section\]/\[slug\].jpg.ts](../src/pages/og/[section]/[slug].jpg.ts)
  er endpointet. Det finder alle ikke-draft artikler og genererer ét kort pr.
  artikel ved build.
- [src/lib/og-card.ts](../src/lib/og-card.ts) er selve kompositionen. satori
  lægger layout og tekst som SVG, resvg rasteriserer, og sharp beskærer fotoet
  og leverer JPEG.

Artikelsiderne (`[slug].astro` i anmeldelser, guides og blog) peger selv
`og:image` på kortruten, og `BaseLayout.astro` skriver meta-taggene. Forsiden
og de øvrige sider bruger stadig `public/images/og-default.webp`.

## Kortets udseende

Med foto:

- Artiklens `heroImage` beskåret til hele fladen (cover). Orienteringen er
  ligegyldig, stående heroes beskæres ikke længere af platformene, fordi kortet
  selv har det rigtige format.
- Mørk gradient i bunden, så teksten kan læses.
- Wordmark: bladlogoet (indfarvet creme) og "matchabladet.dk".
- Titlen i Fraunces, klampet til tre linjer. Titler over 75 tegn sættes en
  anelse mindre.

Uden foto: et roligt kort i papirtonen med et stort, svagt blad som dekoration,
wordmark i matcha-grøn og titel i blæk.

Farverne gentager designtokens fra
[src/styles/global.css](../src/styles/global.css). satori kan ikke læse
CSS-variabler, så værdierne står også i `COLOR` i `og-card.ts`: ret begge
steder, hvis tokens ændres.

## Ny artikel

Der er intet manuelt trin. Et nyt ikke-draft indlæg får automatisk et kort ved
næste build. Vil du efterse kortet, så kør `npm run build` og åbn filen under
`dist/og/<sektion>/<slug>.jpg`.

Bemærk: dev-serveren cacher endpointets ruter, så kortet for en helt ny artikel
kan give 404 i dev, indtil serveren genstartes. Brug et build, når kortet skal
kontrolleres.

## Justering af designet

Alt ligger i [src/lib/og-card.ts](../src/lib/og-card.ts): gradienten,
skriftstørrelser, marginer, wordmark og fallback-kortet. Efter en ændring: kør
`npm run build` og se på et par kort i `dist/og/`, gerne både et med foto og
(hvis der findes en artikel uden hero) et uden.

## Afhængigheder

Alle er devDependencies:

- `satori`: layout og tekst til SVG.
- `@resvg/resvg-js`: SVG til PNG.
- `sharp`: fotobeskæring, indfarvning af logoet og endelig JPEG.
- `@fontsource/fraunces`: statiske woff-snit (500 og 600). Sitet bruger ellers
  variable woff2-fonte, men satori kan ikke læse dem, så kortet læser
  woff-filerne direkte fra node_modules.

Bladlogoet læses fra `public/images/logo/leaf_logo.png`.

## Efter deploy

Platformene cacher gamle link-previews. Allerede delte links skal opfriskes
manuelt, før det nye kort vises:

- Facebook/Messenger/WhatsApp: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- LinkedIn: [Post Inspector](https://www.linkedin.com/post-inspector/)

Kortene vejer typisk 80-100 KB, godt under platformenes grænser.
