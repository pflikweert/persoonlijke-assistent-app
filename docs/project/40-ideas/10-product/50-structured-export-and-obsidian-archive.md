# Structured export and Obsidian archive package

## Status

candidate

## Type

product

## Horizon

next

## Korte samenvatting

Breid de huidige export uit met een tweede pad naast single-file markdown: een server-side structured export job die een Obsidian-compatibel archief oplevert met logische mapstructuur (jaar/maand/week/dag/moment), wiki-link clusters en optionele audio-export wanneer audio-opslag actief is en bestanden beschikbaar zijn.

## Probleem

- De huidige export levert één markdownbestand; dat is goed voor snel bewaren, maar beperkt voor kennisopbouw en hergebruik in Obsidian.
- Er is nog geen export die hiërarchie en node-clusters expliciet maakt (jaar > maand > week > dag > moment).
- Audio-opnames kunnen nu in de app bewaard worden, maar er is geen consistente manier om die in export mee te nemen als bronmateriaal.
- Multi-file export client-side is kwetsbaar en minder schaalbaar; het past beter in server-side background verwerking.

## Waarom interessant

- Sluit direct aan op bestaande exportflow, user preferences en `user_background_tasks` patroon.
- Versterkt de commerciële brug van capture naar herbruikbare output zonder productverbreding naar nieuwe formaten.
- Geeft gebruikers een toekomstvaste, overdraagbare knowledge-export met duidelijke structuur.
- Houdt markdown-first uitgangspunt intact en blijft compatible met huidige workflows.

## Productvisie

### Pad 1 — Huidige single-file export blijft

- Bestaande “alles in één markdownbestand” blijft beschikbaar als snelle standaard.

### Pad 2 — Structured export (nieuw)

- Exportvorm met opties:
  - momenten
  - dagen
  - weken
  - maanden
  - audio meenemen (optioneel)
- Output:
  - één `.md` als netto output 1 bestand is
  - `.zip` als output meerdere bestanden bevat

### Obsidian-compatibele opbouw

- Root `README.md` met overzicht, selectie, tellingen en warnings.
- Mappen per jaar/maand/week/dag/moment met consistente bestandsnamen.
- Wiki-link netwerken tussen notities zodat graph-clusters zichtbaar worden.

## Voorstel outputstructuur

```text
budio-export-YYYYMMDD-HHmm.zip
  README.md
  00-overzicht/
    README.md
  2026/
    README.md
    2026-04-april/
      README.md
      maanden/
        2026-04-april-maandoverzicht.md
      weken/
        2026-W16-20260413-tm-20260419-weekoverzicht.md
      dagen/
        2026-04-19-zaterdag/
          README.md
          20260419-dag.md
          momenten/
            20260419-0831-spraak-korte-slug.md
            20260419-1412-tekst-korte-slug.md
          audio/
            20260419-0831-spraak-korte-slug.m4a
```

## Relatie met huidige code-realiteit

- Export nu: client-side in `app/settings-export.tsx` + `services/export.ts`.
- Background-task patroon bestaat al in importflow (`user_background_tasks`).
- Audio metadata bestaat al op `entries_raw` (`audio_storage_path`, `audio_mime_type`, etc.) en opslag via private `entry-audio` bucket.
- Nog niet aanwezig: dedicated server-side export function, export artifact bucket en structured zip packaging.

## Architectuurvoorstel (richting)

- Structured export als server-side edge function met background-task updates.
- Hergebruik `user_background_tasks` met `task_type = archive_export`.
- Artifact opslaan in private export bucket (bijv. `user-exports`) met user-scoped pad.
- Download via signed URL / artifact reference.

## Scope (wel / niet)

### Wel

- Markdown-only output.
- Structured map + bestandsnaamconventies.
- Optionele audio-export als bestanden aanwezig zijn.
- Root README + relinkbare note-hiërarchie.

### Niet (in deze ronde)

- Geen pdf/html/json/docx export.
- Geen directe vault sync of lokale Obsidian pad-koppeling.
- Geen file-manager productlaag in app.
- Geen audio-transcoding pipeline.

## Mogelijke impact

- product
- ui
- services
- supabase
- docs

## Open vragen

- Welke zip-library is het meest robuust in Supabase Edge/Deno runtime?
- Hoe lang bewaren we export artifacts in storage (retentie/cleanup)?
- Hoe tonen we warnings (bijv. ontbrekende audio bestanden) in UI en README consistent?
- Welke minimale linkset levert de beste Obsidian graph zonder overlinking?

## Volgende stap

- Als afgebakende multi-file implementatieronde plannen:
  1. task/result contract uitbreiden
  2. server-side export job bouwen
  3. structured markdown generator + zip
  4. app export-ui met mode/checkboxes + status/download
