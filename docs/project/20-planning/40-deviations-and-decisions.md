# Deviations and decisions

## Doel

Logboek van bewuste afwijkingen op actieve fase/planning, zodat flexibiliteit traceerbaar blijft.

## Obsidian links

- [[README|Planning hub]]
- [[20-active-phase|Active phase]]
- [[30-now-next-later|Now / Next / Later]]
- [[../current-status|Current status]]
- [[../open-points|Open points]]
- [[../10-strategy/README|Strategy hub]]

## Gebruik

- Elke structurele koerswijziging krijgt hier een korte entry.
- Kleine lage-impact afwijkingen mogen direct, maar worden alsnog achteraf gelogd.

## Template

### [YYYY-MM-DD] Titel

- **Type**: deviation | decision
- **Van plan/document**: (bijv. `planning/20-active-phase.md`)
- **Wijziging**: wat verandert er
- **Waarom**: context/redenering
- **Impact**: product | ui | services | supabase | docs
- **Vervolgactie**: welke docs/code moeten worden aangepast

## Entries

### 2026-04-21 — Competitor benchmark als expliciet Next researchspoor (na AIQS-live)

- **Type**: decision
- **Van plan/document**: `docs/project/20-planning/30-now-next-later.md`, `docs/project/30-research/70-wisprflow-notebooklm-benchmark-na-aiqs-live.md`, `docs/project/40-ideas/10-product/60-capture-ux-benchmark-implementatiekansen-wispr-notebooklm.md`
- **Wijziging**: Wispr Flow + NotebookLM benchmark is formeel vastgelegd als dual benchmark researchspoor met decision matrix (`kopieren`, `aanpassen`, `niet-onze-markt`) en harde AIQS-live gate; geen actieve `Now` bouwscope
- **Waarom**: concurrentie-inzichten gericht benutten zonder scope-creep of premature taakpromotie
- **Impact**: docs, planning, product, aiqs
- **Vervolgactie**: na AIQS-live benchmark sprint starten en per patroon promotiecriteria toetsen voordat iets naar tasklaag gaat

### 2026-04-20 — Governance aangescherpt naar context-first routing

- **Type**: decision
- **Van plan/document**: `docs/dev/cline-workflow.md`, `docs/dev/idea-lifecycle-workflow.md`, `docs/dev/task-lifecycle-workflow.md`, `AGENTS.md`
- **Wijziging**: scope-routing is gewijzigd van te strikte keyword-interpretatie naar context-first routing met default op Budio app + AIQS; Jarvis/plugin blijven aparte sporen op basis van intentie; twijfelprotocol toegevoegd (hoge-impact afstemmen, lage-impact expliciete aanname)
- **Waarom**: voorkomt foutieve scope-classificatie, houdt samenwerking natuurlijk en borgt tegelijk traceerbare beslissingen bij planning- of roadmapimpact
- **Impact**: docs, governance, planning
- **Vervolgactie**: inspiratie-items over schrijfstijl/auto-cleanup classificeren onder Budio app + AIQS-compatibele ideas, niet onder Jarvis tenzij expliciet/contextueel herpositioneerd

### 2026-04-20 — Herstel naar dual active planning + approval-gated wijzigingen

- **Type**: decision
- **Van plan/document**: `planning/20-active-phase.md`, `planning/30-now-next-later.md`, `strategy/10-long-term-strategy.md`
- **Wijziging**: planning is gecorrigeerd naar dual active uitvoering: Plan A primair (AIQS-basis + huidige faseafspraken), Plan B secundair (Jarvis research-lane, max 1 dag/week); Knowledge Hub blijft high-prio, maar niet als actieve scope in Q2 2026
- **Waarom**: expliciete gebruikersinstructie om originele planning niet te verliezen en koerswijzigingen alleen samen en gecontroleerd door te voeren
- **Impact**: docs, planning, strategy, tasks, governance
- **Vervolgactie**: wijzigingscontrole expliciet vastleggen in operationele workflowdocs (`docs/dev/**` en `AGENTS.md`) zodat strategische mutaties approval-gated blijven

### 2026-04-20 — Strategische splitsing naar Internal Jarvis + Publieke Knowledge Hub

- **Type**: decision
- **Van plan/document**: `planning/20-active-phase.md`, `planning/30-now-next-later.md`, `strategy/10-long-term-strategy.md`
- **Wijziging**: fasefocus is omgezet van transitiemaand/brugpilot naar een tweesporenstrategie met `Jarvis` als founder-only intern platform en `Knowledge Hub + AIQS` als versneld publiek-relevant spoor
- **Waarom**: oprichter wil Jarvis eerst intern benutten als geheime bouw- en testlaag; publieke AI-waarde moet eerder via source-grounded Knowledge Hub en AIQS-kwaliteit komen
- **Impact**: docs, planning, aiqs, workspace-plugin-focus
- **Vervolgactie**: nieuwe 25-tasks voor Jarvis-baseline en Knowledge Hub/AIQS foundation toevoegen en active phase/roadmap hierop alignen

### 2026-04-20 — Budio Workspace plugin van idee naar actief fase-werkspoor

- **Type**: decision
- **Van plan/document**: `planning/20-active-phase.md` en `planning/30-now-next-later.md`
- **Wijziging**: de Budio Workspace plugin wordt niet langer alleen als idee behandeld, maar als expliciet ondersteunend werkspoor binnen de transitiemaand
- **Waarom**: betere focus, minder context-switching en sterkere uitvoerbaarheid voor de huidige maanddoelen (consumer beta bewijs, 1.2B, 1.2E en brugpilot-definitie)
- **Impact**: docs
- **Vervolgactie**: plugin-focusdoc toevoegen in planning en actieve fase + now/next/later + planning-hub navigatie hierop alignen

### 2026-04-19 — Actieve maandfocus herijkt naar transitiemaand

- **Type**: decision
- **Van plan/document**: `planning/20-active-phase.md` en `planning/30-now-next-later.md`
- **Wijziging**: eerdere maandfocus op generieke hardening + docs/operating-system werk wordt formeel vervangen door een transitiemaand met consumer beta bewijs, expliciete 1.2B/1.2E en een afgebakende review-first brugpilot
- **Waarom**: runtime-realiteit en researchrichting lopen uit fase met de oude planning; de codebasis is al sterk in capture/hardening, terwijl outputkwaliteit, beta-readiness en commerciële brug nog expliciete planning missen
- **Impact**: docs
- **Vervolgactie**: active phase en now/next/later alignen; strategy-horizon alleen licht aanscherpen zodat de eerstvolgende maand geen brede Pro-activatie suggereert

### 2026-04-19 — Lean operating system expliciet toegevoegd aan projectdocs

- **Type**: decision
- **Van plan/document**: impliciete root-structuur in `docs/project/`
- **Wijziging**: introductie van `strategy/`, `planning/` en `ideas/` als vaste operating system lagen
- **Waarom**: focus en traceerbaarheid verbeteren; ideeën, planning en canonieke waarheid scheiden
- **Impact**: docs
- **Vervolgactie**: bundelstrategie in volgende stap herschrijven op nieuwe structuur
