# Copy og læsbarhed på Matchabladet

Dette dokument er Matchabladets redaktionelle reference for tekst og
artikeloplevelse. Det gælder for både mennesker og AI-agenter, og det er kilden,
når noget er i tvivl om tone, ordvalg eller artikelstruktur.

`AGENTS.md` har de vigtigste regler kort. Her er den uddybende version med
eksempler på god og dårlig copy.

## Tone

Matchabladet skriver dansk som et faktisk besøg, ikke som en kampagne. Rolig,
konkret, observerende og lidt personlig. Vi skriver om det, der blev smagt, set,
hørt, betalt, ventet på eller lagt mærke til i rummet.

- Skriv det konkrete frem for det generelle. Hellere "barstolens ryg er for lav
  til at læne sig tilbage" end "ubehagelige siddepladser".
- Hold adjektiver fortjent. Hvis noget er "cremet", "grønt", "bittert" eller
  "roligt", så forankr det i en detalje. Ellers skær ordet væk.
- Lad sætningerne trække vejret. Korte og mellemlange sætninger er bedre end
  glatte one-liners. Brug sætningsfragmenter sparsomt, og kun når de lyder som
  en, der tager noter, ikke som en slogan.
- Vær gerne ærlig om det, der ikke fungerede. En anmeldelse må godt skuffe.

God: "Matchaen så ud til at være pisket på forhånd og blev sprøjtet fra en
plastikbeholder ned i den isede mælk."

Dårlig: "En autentisk matchaoplevelse, der tager dine sanser til næste niveau."

## Læsbarhed

- Hold brødtekst på en rolig læsebredde, omkring 50-75 tegn pr. linje.
  `.prose-matcha` har en `max-width` på 68ch, så layoutet placerer kolonnen, og
  teksten ikke bliver for bred.
- Skriv korte afsnit. Et afsnit er gerne en tanke, ikke fem.
- Brug konkrete mellemoverskrifter, der siger, hvad afsnittet handler om. Hellere
  "Glasset og sugerøret" end "Detaljer".
- Brug lister, når der er noget at tælle op eller sammenligne, men ikke til at
  bryde almindelig tekst i stykker.
- Brug en tabel, når læseren skal sammenligne oplysninger på tværs, for eksempel
  høst, region og kultivar. Tabeller styles i `.prose-matcha` og skal kunne
  læses på mobil, så hold dem til to eller tre kolonner.
- Undgå blokjusteret tekst og for brede eller for smalle tekstkolonner.

## Anmeldelser

En anmeldelse er en beretning fra et faktisk besøg. Den følger et fast mønster,
så læseren hurtigt forstår vurderingen og kan stole på den.

- **Standfirst øverst.** `excerpt` vises som en kort redaktionel indledning under
  ratinglinjen og før hero. Den skal lyde som en intro, ikke som et resumé fra
  kortvisningen.
- **Sanselige detaljer.** Skriv om smag, tekstur, temperatur, servering, lyd og
  stemning. Det er detaljerne, der gør en vurdering troværdig.
- **Klar dom til sidst.** Slut med en tydelig anbefaling. Et kort slutcitat eller
  en dom samler besøget.
- **God til og Ikke for.** Når det giver mening, så afslut "Dommen" med to korte
  linjer, der gør anbefalingen handlingsklar:

  ```md
  - **God til:** mad, stemning og en uformel cafépause.
  - **Ikke for:** dig, der kommer for matchaens skyld.
  ```

- **Karakterer er på 1-10.** De er delkarakterer for matcha-kvalitet,
  tilberedning, tekstur og stemning plus en samlet karakter.
- Brug "en kop matcha" om varme drikke og "et glas matcha" om iskolde drikke og
  lattes. "Skål" bruges kun om selve skålen, der piskes i.
- Skriv om mælk præcist: `milkType` er den mælk, der faktisk blev smagt, og
  `plantMilkService` siger, om plantemælk er standard, skal bestilles eller ikke
  tilbydes.

## Guides

En guide forklarer noget uden hype og starter med det vigtigste.

- **Begynd med det, der betyder mest.** Sig konklusionen tidligt, og uddyb
  bagefter.
- **Kort fortalt.** Læg en kort opsummering lige efter hero med
  `ArticleSummary`, så en travl læser kan scanne hovedpointerne på få sekunder.
  Den må ikke gentage hele introen.

  ```mdx
  import ArticleSummary from "../../components/ArticleSummary.astro";

  <ArticleSummary>

  - Vælg første høst, hvis du vil starte sikkert.
  - Kig efter region og kultivar på produktsiden.

  </ArticleSummary>
  ```

- **Gør stoffet nemt at scanne.** Brug mellemoverskrifter, korte afsnit og en
  tabel, når læseren skal sammenligne.
- **Forklar uden at sælge.** En guide skal hjælpe læseren med at vurdere selv,
  ikke skubbe mod et bestemt køb.

## Metadata

- **`excerpt`:** En til to sætninger, der lyder som en redaktionel indledning.
  Den bruges som standfirst på anmeldelser, som intro på guides og blog, og som
  beskrivelse i søgeresultater og delinger. Skriv den, så den kan stå alene.
- **Titler:** Konkrete og beskrivende. Hellere "Faetter på Godsbanen har
  stemningen og maden, men ismatchaen halter" end "Anmeldelse af Faetter".
- **Læsetid:** `readingTime` er valgfri. Udelades den, beregnes den automatisk ud
  fra indholdet. Sæt den kun manuelt, hvis estimatet skal overstyres.
- **Billedtekster og alt-tekst:** Beskriv, hvad der er på billedet, roligt og
  konkret. Alt-teksten skal give mening for en, der ikke kan se billedet.

## Ord og vendinger, der bør undgås

- **AI-sprog:** "dyk ned", "opdag", "ultimativ", "autentisk", "uundværlig",
  "problemfri", "skjult perle", "i hjertet af", "en hyldest", "næste niveau" og
  standardmønstre som "ikke bare X, men Y", "ikke som X, bare som Y" og
  "ikke på samme måde som X, mere som Y".
- **Brede hypeord** uden dækning: "perfekt", "fantastisk", "magisk", "game
  changer". Brug dem kun, hvis sætningen stadig holder som en ærlig note fra
  bordet.
- **"En skål matcha"** om en drik. Brug "en kop matcha" eller "et glas matcha".
- **Tankestreger (em dash og en dash) i prosa.** Brug punktum, komma, kolon eller
  en almindelig bindestreg ved talintervaller (`1-10`, `10-15s`). Det gælder al
  copy, indhold, kommentarer, metadata og dokumentation.

God: "Smagen var acceptabel uden rigtig at gøre indtryk."

Dårlig: "En autentisk smagsoplevelse, der bare er helt magisk og uundværlig."
