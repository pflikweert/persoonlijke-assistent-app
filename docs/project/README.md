# Projectdocs — Waarheidshiërarchie en Operating System

Deze map bevat de actieve projectwaarheid voor scope, richting en status,
plus een lean operating system voor strategie, planning en ideeën.

## 0) Lean operating system (nieuw)

- `docs/project/10-strategy/**` = lange termijn richting (horizon)
- `docs/project/20-planning/**` = actieve fase, roadmap, now/next/later en afwijkingslog
- `docs/project/25-tasks/**` = operationele taaklaag voor de huidige fase-uitvoering
- `docs/project/40-ideas/**` = gestructureerde ideeënruimte (één idee per file + inbox)

Regel:

- deze lagen sturen focus en executie
- ze vervangen niet automatisch canonieke productwaarheid
- statusclaims blijven bewijs-gebonden in `current-status.md`

### Obsidian graph hubs

- [[10-strategy/README|Strategy hub]]
- [[20-planning/README|Planning hub]]
- [[25-tasks/README|Tasks hub]]
- [[30-research/README|Research hub]]
- [[40-ideas/README|Ideas workspace]]
- [[current-status|Current status]]
- [[open-points|Open points]]

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
- `docs/project/generated/**` en `docs/design/generated/**` zijn geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex
- `docs/upload/chatgpt-project-context.md` is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects
- `docs/upload/**` is geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex
- bij spanning tussen `docs/upload/**` en canonieke docs zijn canonieke docs leidend
- bij spanning tussen generated docs en canonieke docs zijn canonieke docs leidend

### 2b) Source-of-truth matrix (hard)

- `docs/project/**` (handmatig, excl. `generated/**` en `archive/**`) = canonieke productwaarheid
- `docs/dev/**` = operationele workflowafspraken
- `docs/project/generated/**` + `docs/design/generated/**` = generated, afgeleid, niet leidend
- `docs/upload/**` = upload-only artefacten voor ChatGPT Projects/handoff, niet leidend

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
- `planning/50-budio-workspace-plugin-focus.md` borgt de plugin als ondersteunend uitvoeringsspoor in de actuele fase
- afwijkingen op actieve fase worden vastgelegd in `planning/40-deviations-and-decisions.md`
- planning is richtinggevend voor werkvolgorde, maar statuswaarheid blijft code/bewijs-gedreven

## 3e) Task-documenten (operationele uitvoeringslaag)

- `docs/project/25-tasks/**`

Regel:

- task-docs zijn operationeel voor de huidige fase en ondergeschikt aan canonieke productwaarheid en actieve planning
- open taken staan in `25-tasks/open/`, afgeronde taken in `25-tasks/done/`
- `open-points.md` toont een automatisch bijgewerkt taakoverzicht, maar blijft het document voor echte gaps, risico's en onzekerheden

## 4) Uploadpolicy voor ChatGPT Projects (handmatig)

Gebruik altijd eerst:

1. `docs/upload/chatgpt-project-context.md` (verplichte bootstrap/startcontext)

Daarna upload je alleen de kleinste relevante subset uit het uploadmanifest.
Upload niet standaard de volledige set.

Primaire aanbevolen handmatige uploadset is teruggebracht naar maximaal 5 bestanden totaal:

1. `docs/upload/chatgpt-project-context.md`
2. `docs/upload/10-budio-core-product-and-planning.md`
3. `docs/upload/20-budio-strategy-research-and-ideas.md`
4. `docs/upload/30-budio-build-ai-governance-and-operations.md`
5. `docs/upload/40-budio-design-handoff-and-truth.md`

Reden:

- bootstrap blijft apart en verplicht
- overige bundels zijn logisch samengevoegd in 4 domeinbundels
- use-case subsets en volledigheidscheck staan in `docs/upload/00-budio-upload-manifest.md`
- het uploadmanifest is lokale referentie/completeness-check en geen verplicht onderdeel van de primaire aanbevolen handmatige uploadset
- volledige set alleen gebruiken voor brede strategie-, audit- of totaalreviews

Legacy compatibiliteit:

- Bestaande legacy uploadfiles blijven beschikbaar voor bestaande workflows, maar zijn niet de primaire aanbevolen handmatige uploadset.

## 5) Wat je normaal niet hoeft te uploaden

- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/**`
- `docs/project/25-tasks/**`
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
- Gebruik bij twijfel altijd de source-of-truth matrix in sectie `2b`.
- `docs/upload/chatgpt-project-context.md` is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects.
- `docs/project/generated/**` en `docs/design/generated/**` zijn geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- `docs/upload/**` blijft generated uploadartefact, geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- Bundelscript zet uploadbestanden klaar voor handmatige upload; upload naar ChatGPT Projects gebeurt nu nog niet automatisch.
- Budgetpolicy in ChatGPT Project-context blijft licht; token/cost/runtime-discipline hoort in repo-/runtime-/AI-governance-docs.
- Session/multi-user/OpenAI-contextbeleid is nu alleen als later idee vastgelegd.
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

## Obsidian graph — snelle start

- Gebruik hubs als startpunt: [[10-strategy/README]], [[20-planning/README]], [[30-research/README]], [[40-ideas/README]].
- Gebruik status-ankers: [[current-status]] en [[open-points]].
- Mapstructuur alleen is niet genoeg; links tussen notities bouwen de graph-clusters.
