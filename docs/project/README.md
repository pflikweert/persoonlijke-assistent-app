# Projectdocs — Waarheidshiërarchie

Deze map bevat de actieve projectwaarheid voor productscope, faseplanning en actuele status.

## 1) Leidende documenten (handmatig onderhouden)
1. `docs/project/master-project.md`
2. `docs/project/product-vision-mvp.md`
3. `docs/project/current-status.md`
4. `docs/project/open-points.md`
5. `docs/project/content-processing-rules.md`

Gebruik deze volgorde ook als leesvolgorde.

## 2) Generated document (afgeleid, niet leidend)
- `docs/project/generated/chatgpt-project-context.md`

Dit bestand is bedoeld als compacte uploadcontext voor ChatGPT Project.
Het is afgeleid van de leidende documenten hierboven.

Regel:
- handmatige docs zijn de bron
- generated docs zijn output

## 3) Archive-only (niet leidend)
- `docs/project/archive/**`
- `docs/design/archive/**`
- historische dumps in `docs/dev/archive/**`

Archive-only documenten mogen context geven, maar zijn nooit bindend voor scopebeslissingen.

## 4) Uploadworkflow voor ChatGPT Project
Upload primair:
- `docs/project/generated/chatgpt-project-context.md`

Niet nodig om mee te uploaden:
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/**`
- lokale setup/run-instructies die geen productwaarheid zijn

## 5) Onderhoudsworkflow
1. Werk eerst de handmatige leidende docs bij.
2. Draai `npm run docs:bundle`.
3. Controleer met `npm run docs:bundle:verify`.
4. Commit handmatige docs + generated bundle samen.
