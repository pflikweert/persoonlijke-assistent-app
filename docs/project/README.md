# Projectdocs — Waarheidshiërarchie en Operating System

Deze map bevat de actieve projectwaarheid voor scope, richting en status,
plus een lean operating system voor strategie, planning en ideeën.

## 0) Lean operating system (nieuw)

- `docs/project/10-strategy/**` = lange termijn richting (horizon)
- `docs/project/20-planning/**` = actieve fase, roadmap, now/next/later en afwijkingslog
- `docs/project/40-ideas/**` = gestructureerde ideeënruimte (één idee per file + inbox)

Regel:
- deze lagen sturen focus en executie
- ze vervangen niet automatisch canonieke productwaarheid
- statusclaims blijven bewijs-gebonden in `current-status.md`

## 1) Canonieke handmatige documenten (leidend)
1. `docs/project/master-project.md`
2. `docs/project/product-vision-mvp.md`
3. `docs/project/current-status.md`
4. `docs/project/open-points.md`
5. `docs/project/content-processing-rules.md`
6. `docs/project/copy-instructions.md`
7. `docs/project/ui-modals.md`
8. `docs/project/ai-quality-studio.md`

Aanvulling:
- `docs/project/ai-quality-studio.md` is de centrale AI governance-laag voor AI-gedrag, promptbeheer en evaluatie.

Overgangsnoot:
- Canonieke docs staan nu nog op rootniveau van `docs/project/`.
- De nieuwe structuur (`10-strategy/`, `20-planning/`, `40-ideas/`) wordt vanaf nu gebruikt om richting/focus/ideeën gescheiden te beheren.

## 2) Generated documenten (afgeleid, niet leidend)
- `docs/project/generated/chatgpt-project-context.md`
- `docs/project/generated/budio-research.md`
- `docs/design/generated/stitch-design-context.md`
- `docs/upload/**`

Regel:
- handmatige docs zijn de bron
- generated docs zijn afgeleide output
- `docs/upload/**` is alleen bedoeld als kant-en-klare uploadset voor de gebruiker; agents gebruiken deze map niet als canonieke bron

## 3) Archive-only (niet leidend)
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/archive/**`

## 3b) Research-documenten (strategische input, niet canonieke MVP-waarheid)
- `docs/project/30-research/**`

Regel:
- research-documenten zijn bedoeld als richting-, markt- en scenario-input
- ze vervangen niet automatisch de canonieke MVP-kaders in `master-project.md` en `product-vision-mvp.md`
- feitelijke implementatierealiteit blijft in `current-status.md` en `open-points.md`

## 3c) Ideas-documenten (gestructureerde ideecapture, niet canonieke waarheid)
- `docs/project/40-ideas/**`

Regel:
- `ideas/00-ideas-inbox.md` is snelle capture (ruw)
- gepromoveerde ideeën krijgen één file per idee in categorie-submap
- ideas zijn voorstelruimte; alleen na besluit + bewijs doorstromen naar planning/status/canonieke docs

## 3d) Planning-documenten (actieve focuslaag)
- `docs/project/20-planning/**`

Regel:
- `planning/20-active-phase.md` is de huidige focuslaag voor uitvoering
- afwijkingen op actieve fase worden vastgelegd in `planning/40-deviations-and-decisions.md`
- planning is richtinggevend voor werkvolgorde, maar statuswaarheid blijft code/bewijs-gedreven

## 4) Standaard upload naar ChatGPT Project / Stitch
Upload standaard de bestanden uit `docs/upload/`:
1. `docs/upload/00-budio-upload-manifest.md`
2. `docs/upload/10-budio-product-truth.md`
3. `docs/upload/20-budio-strategy-and-research.md`
4. `docs/upload/25-budio-ideas-and-opportunity-map.md`
5. `docs/upload/30-budio-build-truth.md`
6. `docs/upload/40-budio-ui-system-and-design-truth.md`
7. `docs/upload/50-budio-ai-governance-and-operations.md`

Reden:
- de uploadset is logisch geordend (00/10/20/30/40/50) voor vaste leesvolgorde
- productwaarheid, strategie/research, build-truth, UI/design en AI-governance zijn expliciet gescheiden
- ideas/opportunity mapping is expliciet gescheiden van strategy/research
- het manifest maakt de primaire uploadset controleerbaar
- use-case subsets staan in `docs/upload/00-budio-upload-manifest.md`

Legacy compatibiliteit:
- Bestaande legacy uploadfiles (zoals `chatgpt-project-context.md`, `budio-research.md`, `upload-manifest.md`) blijven beschikbaar voor bestaande workflows,
  maar de 00/10/20/30/40/50-set is de primaire standaard.

## 5) Wat je normaal niet hoeft te uploaden
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/**`
- setup/run-notities zonder canonieke productwaarheid

## 6) Onderhoudsflow
1. Werk eerst de handmatige canonieke docs bij.
2. Draai `npm run docs:bundle`.
3. Controleer met `npm run docs:bundle:verify`.
4. Commit canonieke docs + generated output samen.

## 7) Werken met ChatGPT Projects + Cline
- **ChatGPT Projects**: strategie, review en promptontwerp buiten repo-uitvoering.
- **Cline in VS Code**: repo-analyse, plan, wijzigingen, verify en commit.
- Leidende waarheid voor product/scope/status staat in `docs/project/**`.
- `AGENTS.md` + `.clinerules` zijn leidend voor werkwijze tijdens uitvoering.
- Skills gebruik je alleen wanneer een taak duidelijk in een bestaande skillflow valt.
- `docs/upload/**` blijft uploadartefact (generated), geen canonieke agentbron.
- Bij wijzigingen aan canonieke docs: altijd bundlen + verify (`npm run docs:bundle` en `npm run docs:bundle:verify`).
- Sessielearnings horen in:
  - `AGENTS.md` voor always-on repo-regels
  - `docs/dev/**` voor operationele workflowafspraken
  - `docs/project/current-status.md` alleen voor bewijsbare statusrealiteit
  - niet in productdocs als toolingsruis

## 8) Repo-eigen Memory Bank (workflow, geen extra waarheid)
Deze repo gebruikt een lichte memory-bank workflow als uitvoerhulp, zonder tweede waarheidshiërarchie.

Relatie tussen lagen:
- `docs/project/**` = canonieke waarheid (product/scope/status)
- `AGENTS.md` = always-on uitvoerregels
- `.agents/skills/**` = taak-/domeinspecifieke herhaalpatronen
- `docs/dev/cline-workflow.md` = operationele Cline-werkwijze
- `docs/dev/memory-bank.md` = memory-bank principes en update-regels
- `docs/dev/active-context.md` = tijdelijke sessiecontext (niet-canoniek)

Regels:
- geen generieke memory-bank boom toevoegen
- geen duplicatie van canonieke docs
- `current-status.md` blijft de enige statuswaarheid
