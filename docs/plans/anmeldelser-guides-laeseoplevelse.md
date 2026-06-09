# Plan: bedre læseoplevelse for anmeldelser og guides

Oprettet: 2026-06-09

## Formål

Gøre anmeldelser og guides rarere at læse på Matchabladet uden at ændre sidens rolige redaktionelle udtryk. Planen bygger på en gennemgang af de nuværende sider, indholdet i `src/content/reviews` og `src/content/guides`, artikeltemplates og screenshots af de renderede sider.

## Kort vurdering

Siden har allerede et stærkt udgangspunkt: rolig farvepalette, god typografisk tone, tydelige billeder og en brødtekst med generøs linjeafstand. Guiden om matchapulver er den mest vellykkede læseoplevelse lige nu. Den har et klart emne, en god intro og en tekstbredde, der er behagelig.

Anmeldelsen har stærkt materiale, men layoutet gør læsningen mere urolig. Karakterer og fakta ligger som en float ved siden af teksten, så første del af artiklen får en smal og lidt presset tekstkolonne. Det ses især i screenshot, hvor brødteksten starter ved siden af bokse og derfor får mange korte linjer. Derudover mangler både anmeldelser og guides nogle faste artikelgreb, der hjælper læseren med hurtigt at forstå konklusionen, fortsætte læsningen og finde tilbage til konkrete pointer.

## Relevante best practices

- Hold brødtekst omkring 50-75 tegn pr. linje. Baymard peger på 50-60 som særligt læsevenligt, og W3C anbefaler højst 80 tegn.
- Brug line-height omkring 1.5 eller mere. Den nuværende `prose-matcha` ligger på 1.75, hvilket passer godt til det rolige udtryk.
- Gør artikler nemme at scanne med korte afsnit, konkrete mellemoverskrifter, lister og tydelige konklusioner.
- Undgå justified tekst og for brede eller for smalle tekstkolonner.
- Lad metadata, fakta og sekundære oplysninger støtte teksten uden at bryde læserytmen.

## Prioritet 1: Gør anmeldelseslayoutet mere roligt

### Problem

På anmeldelsessiden bruger `src/pages/anmeldelser/[slug].astro` en floated aside til karakterer og fakta. Det giver en god magasinfornemmelse, men brødteksten bliver for smal i starten af artiklen. Det skaber mange korte linjer og gør den første læseoplevelse mere hakket end guiden.

### Forslag

Skift anmeldelsens indholdsområde fra float til et kontrolleret grid på desktop:

- Venstre kolonne: artikeltekst med fast læsebredde, ca. `minmax(0, 65ch)`.
- Højre kolonne: karakterer og fakta, ca. `18rem`, eventuelt sticky efter hero.
- På mobil: fakta og karakterer placeres efter introen eller efter hero, før brødteksten.
- Inline medier i MDX skal altid spænde over artikelkolonnen og ikke klemmes af faktabokse.

### Berørte filer

- `src/pages/anmeldelser/[slug].astro`
- Eventuelt en ny fælles artikelkomponent, hvis samme grid senere skal bruges til guides.

### Acceptkriterier

- Første afsnit i anmeldelser har en rolig linjelængde på desktop.
- Fakta og karakterer er stadig synlige tidligt.
- Inline video og billeder bliver ikke smallere på grund af sidebokse.
- Mobilvisning har en naturlig rækkefølge: titel, rating, hero, nøglefakta, tekst.

## Prioritet 2: Tilføj en kort dom eller standfirst i anmeldelser

### Problem

Anmeldelsen har en stærk `excerpt`, men den vises ikke på detaljesiden. Læseren får titel, rating og dato, men ikke den korte redaktionelle konklusion før hero.

### Forslag

Vis `data.excerpt` som en standfirst under ratinglinjen på anmeldelsessiden. Den skal have samme rolige stil som guideintroen, men gerne lidt mere kompakt.

Mulig placering:

- Under rating og besøgsdato.
- Før hero.
- Maks. bredde som resten af artikelintroen.

### Berørte filer

- `src/pages/anmeldelser/[slug].astro`

### Acceptkriterier

- Læseren kan forstå vurderingen uden først at scrolle ned til dommen.
- Teksten føles som redaktionel intro, ikke som kortresume fra kortvisningen.

## Prioritet 3: Giv guides en fast "kort fortalt" sektion

### Problem

Guiden er velskrevet og læsbar, men den er lang og kræver, at læseren selv samler hovedreglerne undervejs. Det fungerer for fordybelse, men mindre godt for en bruger, der står i en webshop og hurtigt vil tjekke et pulver.

### Forslag

Indfør et frivilligt MDX-mønster til guides: en kort opsummering lige efter hero og før brødteksten. Den kan enten være ren MDX eller en lille komponent.

Indhold for den aktuelle guide kunne være:

- Vælg første høst, hvis du vil starte sikkert.
- Kig efter region og kultivar.
- Vær skeptisk over for "ceremonial" uden konkrete oplysninger.
- Brug billeder som fingerpeg, ikke bevis.

### Berørte filer

- `src/content/guides/kvalitet-af-matchapulver.mdx`
- Eventuelt `src/components/ArticleSummary.astro`
- Eventuelt `src/styles/global.css`

### Acceptkriterier

- Guiden kan scannes på 10-15 sekunder.
- Opsummeringen gentager ikke hele introen.
- Komponenten bruger eksisterende tokens og føles ikke som en reklameboks.

## Prioritet 4: Stram artikeltypografi i `prose-matcha`

### Problem

`prose-matcha` er tæt på målet, men den kan blive mere robust:

- Der er ikke en eksplicit max-bredde på selve prose-klassen.
- Lister kan få lidt mere afstand til omgivende afsnit.
- Citater er meget diskrete og kan bruges bedre som redaktionel dom.
- Globale headings bruger negativ letter spacing, selvom projektets konvention siger, at letter spacing ikke må være negativ.

### Forslag

Juster `src/styles/global.css`:

- Fjern negativ `letter-spacing` fra headings.
- Overvej `max-width: 68ch` på `.prose-matcha`, med layoutet som ansvarlig for placering.
- Giv `ul` og `ol` en anelse mere top og bund, så lister ikke føles som del af samme afsnit.
- Gør blockquotes mere bevidste: lidt større tekst, mere luft og stadig rolig kant.
- Behold line-height tæt på 1.7, da den passer godt til den nuværende tone.

### Berørte filer

- `src/styles/global.css`

### Acceptkriterier

- Artikler får samme læserytme på guides, blog og anmeldelser.
- Lange lister er tydelige uden at blive tunge.
- Ændringerne bryder ikke kort, navigation eller forsidelayout.

## Prioritet 5: Gør guideindhold mere visuelt brugbart

### Problem

Guiden forklarer mange vurderingskriterier, men alt er tekst. Det passer til magasinformen, men emnet egner sig godt til en kompakt sammenligning.

### Forslag

Tilføj en enkel tabel eller definition list i guiden:

- Høst: hvad det siger om pulveret.
- Region: hvorfor det er relevant.
- Kultivar: hvad læseren skal kigge efter.
- Forarbejdning: hvorfor tencha betyder noget.

Det kan erstatte eller supplere den nuværende punktliste under "Kig efter høst, region og kultivar".

### Berørte filer

- `src/content/guides/kvalitet-af-matchapulver.mdx`
- `src/styles/global.css`, hvis tabeller skal styles i `.prose-matcha`

### Acceptkriterier

- Tabellen er læsbar på mobil.
- Den hjælper brugeren med at sammenligne oplysninger, ikke bare pynter.
- Den følger sidens afdæmpede farver og bruger ikke nye hexværdier.

## Prioritet 6: Gør anmeldelsers dom mere handlingsklar

### Problem

Anmeldelsen slutter godt med en klar dom, men dommen står først helt til sidst. For caféanmeldelser er det nyttigt at vise en kort vurdering tidligere og gøre slutdommen mere ensartet på tværs af anmeldelser.

### Forslag

Indfør et fast mønster for anmeldelser:

- Standfirst øverst med `excerpt`.
- Slutcitat eller dom nederst.
- Eventuelt et lille "God til" og "Ikke for" afsnit i MDX, når der er flere anmeldelser.

For Faetter kunne det være:

- God til: mad, stemning, uformel cafépause.
- Ikke for: matcha som hovedårsag til besøget.

### Berørte filer

- `src/content/reviews/faetter-aarhus.mdx`
- Eventuelt en fremtidig `ReviewVerdict.astro`

### Acceptkriterier

- Læseren får en tydelig anbefaling uden at miste den observerende tekst.
- Mønsteret kan gentages i fremtidige anmeldelser uden at gøre dem skabelonagtige.

## Prioritet 7: Overvej automatisk læsetid

### Problem

`readingTime` er manuelt i frontmatter for guides og blog. Det er fint nu, men kan blive inkonsistent, når der kommer flere artikler.

### Forslag

Beregn læsetid fra indholdet i stedet for at skrive den manuelt, eller tilføj en lille scriptbaseret kontrol senere.

### Berørte filer

- `src/content.config.ts`
- `src/pages/guides/[slug].astro`
- `src/pages/blog/[slug].astro`
- Eventuelt `src/utils.ts`

### Acceptkriterier

- Læsetid passer nogenlunde til tekstlængden.
- Frontmatter bliver enklere.
- Eksisterende visning af læsetid bevares.

## Prioritet 8: Flyt copyprincipper til et fast dokument i `docs`

### Problem

Projektets copyprincipper står lige nu primært i `AGENTS.md`. Det er nyttigt for agenter, men mindre godt som varig redaktionel reference. Når tonen, læsbarheden og artikelstrukturen udvikler sig, bør der være et dokument, som både mennesker og agenter kan bruge som kilde.

### Forslag

Opret et dokument i `docs`, for eksempel `docs/copy-og-laesbarhed.md`, der beskriver Matchabladets tilgang til tekst og artikeloplevelse:

- Tone: rolig, konkret, observerende og dansk uden kampagnesprog.
- Readability: linjelængde, korte afsnit, tydelige mellemoverskrifter, lister og luft.
- Anmeldelser: hvordan man skriver fra et faktisk besøg, bruger sanselige detaljer og giver en klar dom.
- Guides: hvordan man forklarer uden hype, starter med det vigtigste og gør stoffet nemt at scanne.
- Metadata: hvordan `excerpt`, titler, læsetid og billedtekster bør skrives.
- Ord og vendinger: hvad der bør undgås, blandt andet AI-sprog, brede hypeord og "skål matcha" om drikke.

Opdater derefter `AGENTS.md`, så den henviser til dokumentet i stedet for at bære alle detaljer alene. `AGENTS.md` kan stadig have de vigtigste regler kort, men den dybere redaktionelle vejledning bør ligge i `docs`.

### Berørte filer

- `docs/copy-og-laesbarhed.md`
- `AGENTS.md`
- Eventuelt `README.md`, hvis dokumentet også skal nævnes som redaktionel reference for mennesker.

### Acceptkriterier

- `docs/copy-og-laesbarhed.md` kan læses alene og giver klare eksempler på god og dårlig Matchabladet-copy.
- `AGENTS.md` linker tydeligt til dokumentet.
- Der er ingen modstrid mellem `AGENTS.md` og det nye dokument.
- Dokumentet følger projektets egne copyregler.

## Foreslået rækkefølge

1. Ret anmeldelseslayout fra float til grid.
2. Vis `excerpt` som standfirst på anmeldelser.
3. Juster `prose-matcha` og fjern negativ letter spacing.
4. Tilføj "kort fortalt" til guiden.
5. Tilføj tabel eller definition list styling til guides.
6. Stram Faetter-anmeldelsen med en tidligere konklusion og lidt kortere første afsnit.
7. Opret `docs/copy-og-laesbarhed.md` og opdater `AGENTS.md` med en reference.
8. Overvej automatisk læsetid, når der er flere artikler.

## Kontrol efter implementering

- Kør `npm run check`, fordi `.astro`, styles og MDX sandsynligvis ændres.
- Kør `npm run build`, hvis layout, routing, billeder eller produktionoutput ændres.
- Tjek desktop og mobil for:
  - linjelængde i første afsnit
  - faktabokse på anmeldelser
  - hero og inline medier
  - lister og tabeller i guides
  - sticky header, så overskrifter ikke føles klemt ved ankerlinks
- Når copydokumentet oprettes, tjek at `AGENTS.md` og dokumentet ikke giver forskellige regler for tone, ordvalg eller typografi.

## Kilder til best practice

- W3C WCAG: `https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html`
- W3C WCAG visuel præsentation: `https://www.w3.org/TR/WCAG21/`
- Baymard om linjelængde: `https://baymard.com/blog/line-length-readability`
- Nielsen Norman Group om web-læsning: `https://www.nngroup.com/articles/how-users-read-on-the-web/`
- Nielsen Norman Group om kort og scannable tekst: `https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/`
- Butterick Practical Typography: `https://practicaltypography.com/typography-in-ten-minutes.html`
