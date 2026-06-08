# AGENTS.md

Retningslinjer for agents, der arbejder i dette repo.

## Projekt

Matchabladet er et dansk, statisk matcha-site bygget med Astro, TypeScript, Tailwind CSS, MDX og Astro Content Collections.

Sitet skal være hurtigt, SEO-venligt og roligt editorialt i udtrykket: japandi-inspireret, varmt, luftigt og let premium. Det må ikke føles som en SaaS-landingpage.

## Sprog

Dansk er standardsprog for hele projektet.

Brug dansk til:

- Synlig UI-tekst
- Navigation
- Knapper
- Metadata og SEO-beskrivelser
- README og dokumentation, hvor det er naturligt
- Sample content
- Kommentarer, hvis kommentarer er nødvendige

Brug engelsk til:

- Kodeidentifikatorer
- Konventionelle fil- og mappenavne
- Package names
- Teknisk konfiguration

## Stack

- Astro
- TypeScript
- Tailwind CSS
- MDX
- Astro Content Collections
- npm
- Statisk output til Cloudflare Pages eller Vercel

## Struktur

- Sider ligger i `src/pages`
- Layouts ligger i `src/layouts`
- Komponenter ligger i `src/components`
- Global styling ligger i `src/styles`
- Content collections ligger i `src/content`

Content collections:

- `reviews`
- `guides`
- `blog`

## Arbejdsregler

- Hold implementationen enkel og vedligeholdbar.
- Tilføj ikke CMS, database eller client-side state uden eksplicit behov.
- Bevar dansk som default language, inklusive `lang="da"`.
- Brug MDX/Markdown til indhold.
- Følg eksisterende komponent- og stylingmønstre.
- Undgå lorem ipsum og generiske placeholders.
- Brug diskrete borders og rolige farver frem for tunge shadows.
- Hold layout mobile-first og responsivt.

## Kvalitetstjek

Kør efter relevante ændringer:

```bash
npm.cmd run build
```

Buildet kører både `astro check` og `astro build`.

Ved lokal visuel test:

```bash
npm.cmd run dev
```

Hvis `Start-Process` fejler på Windows med `Path`/`PATH`, kan dev-serveren startes via `Invoke-CimMethod`:

```powershell
Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
  CommandLine = 'cmd.exe /c "npm.cmd run dev -- --host 127.0.0.1 --port 4321 > dev-4321.log 2> dev-4321.err.log"'
  CurrentDirectory = 'C:\Webprojekter\matchabladet'
}
```
