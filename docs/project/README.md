# Projectdocs — Waarheidshiërarchie

Deze map bevat de actieve projectwaarheid voor scope, richting en status.

## 1) Canonieke handmatige documenten (leidend)
1. `docs/project/master-project.md`
2. `docs/project/product-vision-mvp.md`
3. `docs/project/current-status.md`
4. `docs/project/open-points.md`
5. `docs/project/content-processing-rules.md`

## 2) Generated document (afgeleid, niet leidend)
- `docs/project/generated/chatgpt-project-context.md`

Regel:
- handmatige docs zijn de bron
- generated docs zijn afgeleide output

## 3) Archive-only (niet leidend)
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/archive/**`

## 4) Standaard upload naar ChatGPT Project
Upload standaard beide bestanden:
1. `docs/project/generated/chatgpt-project-context.md`
2. `docs/design/mvp-design-spec-1.2.1.md`

Reden:
- de bundle bevat compacte projectcontext
- de bundle bevat niet de volledige designwaarheid
- de design spec blijft apart leidend voor MVP-designbesluiten

## 5) Wat je normaal niet hoeft te uploaden
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/**`
- setup/run-notities zonder canonieke productwaarheid

## 6) Onderhoudsflow
1. Werk eerst de handmatige canonieke docs bij.
2. Draai `npm run docs:bundle`.
3. Controleer met `npm run docs:bundle:verify`.
4. Commit canonieke docs + generated bundle samen.
