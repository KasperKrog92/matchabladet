# AGENTS.md

Guidance for AI agents (and humans) working in **Matchabladet**, a Danish
matcha magazine: café reviews, guides, rankings, and blog posts. Static site
built with Astro.

## Commands

| Task | Command |
| --- | --- |
| Dev server (port 4321) | `npm run dev` |
| Type-check content + components | `npm run check` (`astro check`) |
| Production build | `npm run build` (runs `astro check` then `astro build`) |
| Preview built site | `npm run preview` |

Always run `npm run check` after touching content frontmatter, the schemas, or
`.astro` components. It validates the Zod content schemas and Astro types.

When starting the dev server for the user, open it in a visible terminal window
so the user can stop it directly with `Ctrl+C`.

The dev server defaults to port 4321 but respects a `PORT` environment variable
when set (used by preview tooling when 4321 is already taken).

## Commit And Push Workflow

When the user writes "commit and push", treat it as a full finish-and-publish
request, not only `git commit` plus `git push`.

Before committing:

1. Review `git status --short` and `git diff` so the commit scope is clear.
2. Run the relevant checks for the touched files. At minimum, run
   `npm run check` when content, schemas, or `.astro` files changed. Use
   `npm run build` when the change affects routing, media rendering, layout,
   SEO, or production output. Skip checks only when the same relevant checks
   have already passed recently and no files affecting those checks have changed
   since then.
3. Update `AGENTS.md`, `README.md`, schemas, scripts, or other referenced docs
   when the change alters workflow, conventions, commands, content fields, media
   handling, or future agent expectations.
4. Search for stale references after deletes, renames, or copy changes.
5. Only then stage the intended files, commit with a clear message, and push the
   current branch.

If checks fail, fix the issue before committing unless the user explicitly asks
to commit the failing state.

## Stack

- **Astro 6**, `output: "static"` ([astro.config.mjs](astro.config.mjs)). Site: `https://matchabladet.dk`.
- **MDX** + **sitemap** integrations.
- **Tailwind CSS v4** via the Vite plugin. Design tokens (colors, radii, fonts)
  live in `@theme` in [src/styles/global.css](src/styles/global.css), e.g.
  `matcha-*`, `cream`, `ink`, `rounded-card`. Reuse these tokens; don't hardcode
  hex values or invent new utilities.
- TypeScript throughout.

## Structure

```
src/
  pages/            Routes: index, om, 404, anmeldelser/, blog/, guides/, ranglister/, og/ (share cards)
  content/          reviews/ guides/ blog/  (.mdx) + content.config.ts (Zod schemas)
  components/        SiteHeader/Footer, ReviewCard, ArticleCard, RatingBadge, TagList, ReviewMedia, ArticleSummary
  layouts/          BaseLayout.astro (SEO / Open Graph)
  lib/og-card.ts    Renders the generated OG share cards (satori + resvg + sharp)
  assets/images/    Media optimised by Astro (<Image>); one subfolder per review
  styles/global.css Tailwind @theme design tokens
  config.ts         Site name, nav, default SEO
  utils.ts          Helpers (Danish date formatting, etc.)
public/             Served as-is: images/ (logo, OG fallback), robots.txt
```

## Conventions

- **Language: Danish.** All user-facing content, UI strings, AND code comments
  are in Danish. Match the surrounding files.
- **Content** is MDX in `src/content/<collection>/`. Schemas and field docs are
  in [src/content.config.ts](src/content.config.ts). Review ratings are on a
  **1-10** scale. Set `draft: true` to keep a post out of the build.
- **Review milk fields:** use `milkType` for the milk actually tasted, and
  `plantMilkService` to say whether plant milk is served as `"standard"`, must
  be requested (`"skal-bestilles"`), or is not offered (`"ikke-tilbudt"`).
- **Images:** content images go in `src/assets/images/` and render through
  `astro:assets` `<Image>` (optimised). Only truly static assets (logo, OG
  fallback) go in `public/`.
- **One folder per review** under `src/assets/images/<slug>/`. See below.

## Copy And Tone

The full editorial reference, with examples of good and bad Matchabladet copy and
the article structure for reviews and guides, lives in
**[docs/copy-og-laesbarhed.md](docs/copy-og-laesbarhed.md)**. Read it when writing
or editing content. The rules below are the short version.

- **Write Danish like a real visit, not a campaign.** Calm, specific, observant
  and lightly personal. Prefer what was tasted, seen, heard, paid, waited for,
  or noticed in the room.
- **No AI-speak.** Avoid generic polish like "dyk ned", "opdag", "ultimativ",
  "autentisk", "uundværlig", "problemfri", "skjult perle", "i hjertet af",
  "en hyldest", "næste niveau", and stock patterns like "ikke bare X, men Y",
  "ikke som X, bare som Y", and "ikke på samme måde som X, mere som Y".
- **No em dashes or en dashes in prose.** Use a period, comma, colon, or a
  plain hyphen-minus for numeric ranges (`1-10`, `10-15s`). This applies to
  site copy, content, comments, metadata, README, and this file.
- **Do not call matcha "en skål matcha".** Use "en kop matcha" for hot drinks
  and "et glas matcha" for iced drinks or lattes. "Skål" is only okay when
  referring to the physical bowl used for preparation.
- **Keep adjectives earned.** If copy says "cremet", "grøn", "bitter",
  "rolig", or "fyldig", anchor it in a concrete detail. Cut broad hype words
  unless the sentence still works as an honest note from the table.
- **Let sentences breathe.** Short and medium sentences are better than glossy
  one-liners. Use fragments sparingly when they sound like a person taking
  notes, not like a slogan.

## Review media workflow

Reviews are illustrated with the author's phone footage: **portrait 9:16,
silent, ~10-15s close-up clips** plus portrait stills. Phones record video as
**HEVC/H.265**, which browsers won't reliably play, so every clip must be
re-encoded to H.264 before use. Conversion is a manual `ffmpeg` step. Astro
optimises images but does **not** transcode video.

**Folder layout** (per review):

```
src/assets/images/<slug>/
  hero.webp          # or e.g. matcha.webp, the still, also used as video poster + share card photo
  hero.mp4           # converted, web-ready H.264 (optional)
  originals/         # raw phone .jpg/.mp4 masters, GITIGNORED, kept locally only
```

**Conversion script** ([scripts/convert-media.ps1](scripts/convert-media.ps1)):
needs ffmpeg, install once: `winget install Gyan.FFmpeg`.

```powershell
# Output extension decides the format: .webp = still, .mp4 = clip.
./scripts/convert-media.ps1 src/assets/images/<slug>/originals/hero.jpg src/assets/images/<slug>/hero.webp
./scripts/convert-media.ps1 src/assets/images/<slug>/originals/clip.mov  src/assets/images/<slug>/hero.mp4
```

It downscales (stills ≤ 1920 px long side, clips ≤ 1280 px) and, for video, drops
audio, fixes orientation, and writes H.264 + `yuv420p` + faststart (`yuv420p` is
essential for Safari/iOS). Equivalent raw ffmpeg, if ever needed by hand:

```powershell
ffmpeg -y -i in.mp4 -an -vf "scale=-2:1280" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4
ffmpeg -y -i in.jpg -vf "scale=-2:1920" -c:v libwebp -quality 82 out.webp
```

**Colour grade.** The script bakes in one consistent, restrained grade across
**both** photos and clips, so a video matches its poster still: gentle
desaturation, soft contrast, a slight midtone lift and a touch of warmth, to suit
the calm/japandi tone. It lives in one place (`$grade` in the script); tweak it
there, or pass `-NoGrade` for a raw conversion.

Typical results: ~32-40 MB HEVC clip -> ~1.4-2.4 MB H.264; ~3.5 MB JPG -> ~60-210 KB webp.

**How it renders:**

- Reviews schema has `heroImage` (`image()`, also reused as the video poster and
  as the photo on the generated share card) and optional `heroVideo` (string path
  relative to `src/assets/images`, e.g. `"faetter-aarhus/matcha.mp4"`).
- [src/pages/anmeldelser/\[slug\].astro](src/pages/anmeldelser/[slug].astro)
  resolves the video URL via `import.meta.glob` and passes it to `ReviewMedia`.
- [src/components/ReviewMedia.astro](src/components/ReviewMedia.astro) adapts to
  the hero's orientation (derived from `heroImage`'s dimensions): **landscape:
  full-width 8:5 banner** (`object-cover`); **portrait: natural ratio, centred,
  capped at ~70svh** (no crop). Video **does not autoplay**: the still shows
  with a small play button; pressing plays the muted loop (`playsinline`),
  pressing again stops and reverts to the still (static-by-default also suits
  reduced motion). Reuse it for inline media in MDX (import the
  photo and the `.mp4?url`, then `<ReviewMedia image={...} videoSrc={...}
  alt="..." />`).

**Adding a new review:**

1. Create `src/assets/images/<slug>/originals/` and drop the raw phone files in.
2. Convert each still to `<name>.webp` and (optional) clip to `<name>.mp4` with
   `scripts/convert-media.ps1` (see above), into `src/assets/images/<slug>/`.
3. Create `src/content/reviews/<slug>.mdx` with frontmatter per the schema;
   set `heroImage: "../../assets/images/<slug>/<name>.webp"` and, if there's a
   clip, `heroVideo: "<slug>/<name>.mp4"`.
4. `npm run check`, then verify on `npm run dev` that the video plays upright and
   isn't cropped.

**OG/share images:** every published article (reviews, guides, blog) gets a
generated 1200x630 share card at `/og/<sektion>/<slug>.jpg` (sections:
`anmeldelser`, `guides`, `blog`), rendered at build time by
[src/pages/og/\[section\]/\[slug\].jpg.ts](src/pages/og/[section]/[slug].jpg.ts)
with the composition in [src/lib/og-card.ts](src/lib/og-card.ts) (satori +
resvg + sharp, dev dependencies). The card shows the hero photo cropped to the
full card behind a dark bottom gradient, the leaf wordmark "matchabladet.dk"
and the article title; articles without a hero get a calm paper-toned card
instead. Hero orientation no longer matters for share previews, and the article
pages point `og:image` at the card route themselves. The card colours mirror
the design tokens in [src/styles/global.css](src/styles/global.css) and are
repeated in og-card.ts, so change both together. Non-article pages still use
`public/images/og-default.webp`.
