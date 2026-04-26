# DO NOT EDIT - GENERATED FILE

# Budio Product Truth

Build Timestamp (UTC): 2026-04-26T19:57:29.572Z
Source Commit: 09d9374

Doel: primaire uploadbundle met productkaders, statusrealiteit en actieve planningsfocus.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Bronbestanden (vaste volgorde)
- docs/project/README.md
- docs/project/00-docs-governance/README.md
- docs/project/master-project.md
- docs/project/product-vision-mvp.md
- docs/project/current-status.md
- docs/project/open-points.md
- docs/project/content-processing-rules.md
- docs/project/copy-instructions.md
- docs/project/ai-quality-studio.md
- docs/dev/cline-workflow.md
- docs/project/20-planning/README.md
- docs/project/20-planning/10-roadmap-phases.md
- docs/project/20-planning/20-active-phase.md
- docs/project/20-planning/30-now-next-later.md
- docs/project/20-planning/40-deviations-and-decisions.md
- docs/project/20-planning/50-budio-workspace-plugin-focus.md
- docs/project/20-planning/60-april-2026-ideeen-prioritering-en-learning-loop.md
- docs/project/20-planning/70-post-basis-6-month-roadmap.md

## Leesregel
- Dit is de primaire bron voor scope, status en uitvoering binnen de huidige fase.
- Strategische verdieping staat in de strategy/research bundle.

---

## Docs-Hiërarchie Samenvatting

---
title: Projectdocs waarheidshierarchie en operating system
audience: both
doc_type: hub
source_role: canonical
visual_profile: budio-terminal
upload_bundle: chatgpt-project-context.md
---

# Projectdocs — Waarheidshiërarchie en Operating System

Deze map bevat de actieve projectwaarheid voor scope, richting en status,
plus een lean operating system voor strategie, planning en ideeën.

## 0) Lean operating system (nieuw)

- `docs/project/10-strategy/**` = lange termijn richting (horizon)
- `docs/project/20-planning/**` = actieve fase, roadmap, now/next/later en afwijkingslog
- `docs/project/25-tasks/**` = operationele taaklaag voor de huidige fase-uitvoering
- `docs/project/40-ideas/**` = gestructureerde ideeënruimte (één idee per file + inbox)
- `docs/project/00-docs-governance/**` = audience, metadata en docs-visual-language afspraken

Regel:

- deze lagen sturen focus en executie
- ze vervangen niet automatisch canonieke productwaarheid
- statusclaims blijven bewijs-gebonden in `current-status.md`

### Obsidian graph hubs

- Strategy hub
- Planning hub
- Tasks hub
- Research hub
- Ideas workspace
- Docs governance
- Current status
- Open points

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

## 4) Docs audience en visual language

Gebruik frontmatter om per document vast te leggen voor wie het bedoeld is.
De afspraken staan in `docs/project/00-docs-governance/README.md`.

```text
┌───────────────────────┬──────────────────────────────┐
│ audience              │ gebruik                       │
├───────────────────────┼──────────────────────────────┤
│ human                 │ strategie, planning, research │
│ agent                 │ workflow, skills, instructies │
│ both                  │ hubs, status, shared truth    │
└───────────────────────┴──────────────────────────────┘
```

Human-facing docs mogen een duidelijke Budio Terminal-smaaklaag krijgen.
Agent-only docs blijven sober en operationeel.

## 5) Uploadpolicy voor ChatGPT Projects (handmatig)

Gebruik altijd eerst:

1. `docs/upload/chatgpt-project-context.md` (verplichte bootstrap/startcontext)

Daarna upload je alleen de kleinste relevante subset uit het uploadmanifest.
Upload niet standaard de volledige set.

`docs/upload/**` wordt beheerd als maximaal 10 uploadbestanden totaal.

De primaire aanbevolen subset blijft klein:

1. `docs/upload/chatgpt-project-context.md`
2. kies daarna alleen de relevante domeinbundle uit het manifest

Reden:

- bootstrap blijft apart en verplicht
- domeinbundels zijn logisch samengevoegd en use-case gestuurd
- use-case subsets en volledigheidscheck staan in `docs/upload/00-budio-upload-manifest.md`
- volledige set alleen gebruiken voor brede strategie-, audit-, roadmap- of totaalreviews

## 6) Wat je normaal niet hoeft te uploaden

- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/**`
- `docs/project/25-tasks/**`
- setup/run-notities zonder canonieke productwaarheid

## 7) Onderhoudsflow

1. Werk eerst de handmatige canonieke docs bij.
2. Draai `npm run docs:bundle`.
3. Controleer met `npm run docs:bundle:verify`.
4. Commit canonieke docs + generated output samen.

## 8) Werken met ChatGPT Projects + Cline

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

## 9) Repo-eigen Memory Bank (workflow, geen extra waarheid)

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

- Gebruik hubs als startpunt: 10-strategy/README, 20-planning/README, 30-research/README, 40-ideas/README.
- Gebruik status-ankers: current-status en open-points.
- Mapstructuur alleen is niet genoeg; links tussen notities bouwen de graph-clusters.

---

## Docs Governance

---
title: Docs governance, audience en visual language
audience: both
doc_type: governance
source_role: canonical
visual_profile: budio-terminal
upload_bundle: 80-budio-agent-workflow-and-docs-tooling.md
---

# Docs governance, audience en visual language

## Doel

Deze laag maakt expliciet voor wie een document bedoeld is, hoe het gelezen
moet worden en wanneer visuele verrijking waarde toevoegt.

```text
╔══════════════════════════════════════════════════════════════════╗
║ BUDIO DOCS TERMINAL                                             ║
╠══════════════════════════════════════════════════════════════════╣
║ MODE        docs-governance                                     ║
║ RULE        serious first, nerdy enough                         ║
║ RENDER      plain Markdown baseline, richer in Obsidian/VS Code ║
║ BOUNDARY    no IP-copy, no gimmick overload                     ║
╚══════════════════════════════════════════════════════════════════╝
```

## Metadata-contract

Nieuwe of actieve handmatige docs krijgen frontmatter wanneer ze onderdeel zijn
van projectwaarheid, planning, research, ideas, setup of workflow.

Vaste velden:

| Veld | Waarden | Betekenis |
| --- | --- | --- |
| `title` | vrije titel | Menselijke titel voor vault, bundler en uploadcontext. |
| `audience` | `human`, `agent`, `both` | Primaire lezer: gebruiker/founder, agent/AI, of allebei. |
| `doc_type` | vrije korte categorie | Bijvoorbeeld `hub`, `strategy`, `planning`, `research`, `workflow`, `setup`. |
| `source_role` | `canonical`, `operational`, `reference`, `generated`, `archive` | Waarheidsrol van het document. |
| `visual_profile` | `plain`, `budio-terminal`, `diagram-first` | Hoe rijk de Markdown visueel mag zijn. |
| `upload_bundle` | uploadbestandsnaam of `none` | In welke generated uploadcontext het document terecht hoort. |

## Audience-regels

- `human`: uitleg, strategie, planning, roadmap, ideeën en besliscontext voor mensen.
- `agent`: uitvoeringsregels, skills, checklists en technische workflow voor agents.
- `both`: docs die mensen en agents allebei nodig hebben als gedeelde waarheid.

Regel: als een document vooral een agent moet sturen, voeg geen extra sfeerlaag
toe. Als een document een mens moet meenemen in strategie of planning, mag het
wel visueel meer karakter krijgen.

## Budio Terminal visual profile

De Budio Terminal-stijl is een interne docs-smaaklaag, geen productdesignsystem.
Hij is geinspireerd door retro terminals en mission-control interfaces, maar
kopieert geen bestaande serie, game of IP.

Gebruik:

- terminalpanelen met `text` codeblocks voor status, sequencing en prioriteit
- Mermaid-diagrammen voor flow, dependencies en roadmapstructuur
- compacte radar/mission-control blokken voor menselijke oriëntatie
- normale Markdown als basis, zodat lezen zonder plugin altijd werkt

Niet gebruiken:

- animatie als harde afhankelijkheid
- HTML/CSS die in ChatGPT, GitHub of Obsidian slecht degradeert
- gimmicks die de inhoud overheersen
- productcopy richting app-eindgebruikers

## Portable rendering

```mermaid
flowchart LR
  A[Plain Markdown] --> B[VS Code preview]
  A --> C[Obsidian vault]
  B --> D[Mermaid preview as plus]
  C --> E[Native Mermaid rendering]
  A --> F[ChatGPT upload]
```

Baseline:

- elk document blijft leesbaar als ruwe Markdown
- Mermaid is handig voor preview, maar de omliggende tekst moet de boodschap ook dragen
- uploadbundels blijven `.md`-bestanden zonder assets of runtime-afhankelijkheden

## Folderstructuur-regel

We doen nu geen brede foldermigratie. Metadata en bundling lossen de verwarring
goedkoper en veiliger op.

Een mogelijke folderherziening krijgt pas vervolg na bewijs uit deze fase.
Daarvoor bestaat de blocked task:
`docs/project/25-tasks/open/docs-folderstructuur-en-visual-language-herbeoordeling-na-metadatafase.md`.

---

## Hoofd Projectdocument

---
title: Persoonlijke Assistent App Master Project
audience: both
doc_type: product-canonical
source_role: canonical
visual_profile: plain
upload_bundle: chatgpt-project-context.md
---

# Persoonlijke Assistent App — Master Project (Canoniek)

## Doel van dit document

Dit document beschrijft de stabiele productkaders:

- productdefinitie
- scope en buiten scope
- fasekaart
- beslisregels

Voor feitelijke implementatiestatus en code-realiteit is leidend:

- `docs/project/current-status.md`

## Productdefinitie

De app is een capture-first persoonlijke contextmachine:

- vastleggen via tekst en audio
- verwerken naar een leesbare dagboeklaag
- periodieke reflectie op basis van die dagboeklaag

Kernbelofte:

- snel vastleggen
- rustig teruglezen
- later overzicht zonder handmatig samenstellen

## Waarom dit product bestaat

Veel dagen verdwijnen in losse momenten, gedachten en notities.

Deze app is gebouwd om die fragmenten niet kwijt te raken.
Je legt snel vast wat er is, ziet het later terug als een leesbare dag, en kunt over een week of maand rustiger terugzien wat terugkomt.

De kernwaarde zit niet in meer functies, maar in continuïteit:

- snel vastleggen
- rustig teruglezen
- later overzicht zonder handmatig samenstellen

De app is daarmee geen coach, chatinterface of therapeutisch systeem, maar een rustige dagboekmachine die helpt om je eigen verhaal terug te zien.

## Scope (MVP)

In scope:

- auth-baseline
- capture via tekst en audio
- server-side verwerking van input
- dagboeklaag per dag
- week- en maandreflecties
- kernschermen voor capture, dagweergave en reflecties

Buiten scope:

- brede chat/coach/agent-ervaring
- retrieval/Q&A en vector search
- document intelligence als brede productlaag
- taken/agenda/reminders
- realtime voice als productmodus

## Strategische splitsing (vanaf april 2026)

Naast de bestaande capture-first productkern loopt de uitvoering in twee expliciete sporen:

1. `Budio Jarvis` (internal-only, founder-only)
   - inzet in Budio app + Budio Workspace
   - local-first taken zoals cleanup/interpunctie/tagging
   - geen publieke productbelofte in de huidige horizon
2. `Knowledge Hub + AIQS` (intern eerst, later publiek inzetbaar)
   - source ingest (PDF/audio/foto)
   - source-grounded retrieval met citations
   - expert-knowledge packs en evaluatie via AIQS

## Fasekaart

### Fase 0

Setup en basisomgeving.

### Fase 1

Kernlus bouwen: van capture naar dagboeklaag en reflecties.

### Fase 1.2 (hardening)

Release-1 hardening in subfases:

1. 1.2A stabiliteit en foutafhandeling
2. 1.2B outputkwaliteit
3. 1.2C UX-polish
4. 1.2D vertrouwen (export/reset)
5. 1.2E private-beta readiness

Deze fase blijft hardening en is geen verbreding van productscope.

### Fase 2A (internal Jarvis)

Founder-only R&D-spoor voor interne intelligentie in app + workspace.

### Fase 2B (Knowledge Hub + AIQS)

Brongebaseerde kwaliteits- en kennislaag als publiek-relevant fundament.

## Beslisregels

1. Capture-first blijft leidend.
2. Dagboeklaag blijft canonieke productlaag.
3. Jarvis blijft internal-only tot expliciet nieuw strategisch besluit.
4. Publieke AI-innovatie loopt primair via Knowledge Hub + AIQS, niet via Jarvis.
5. Twijfelgevallen worden niet als waarheid vastgezet zonder bewijs.
6. AI-gedrag en promptbeheer volgen `docs/project/ai-quality-studio.md`.

## Copykader (bindend)

Voor productcopy, microcopy en UX-tekst is leidend:

- `docs/project/copy-instructions.md`

Regel:

- copybeslissingen volgen dit document naast de productkaders in dit masterdocument.

## Post-MVP

Mogelijke vervolgsporen na afronding van 1.2:

### 1. Archiefdoorzoeking

- zoeken door dagen, weken en maanden
- sneller terugvinden wat er eerder speelde

### 2. Retrieval / Q&A over archief

- gerichte vragen stellen over eerder vastgelegde perioden of gebeurtenissen
- antwoorden blijven gebaseerd op opgeslagen dagboeklagen

### 3. Entiteitsextractie en tagging

- mensen
- plekken
- thema’s
- terugkerende onderwerpen

### 4. Persoonlijke archieflaag

- rijkere verbanden tussen dagen, perioden en terugkerende onderwerpen
- meer structuur bovenop het bestaande archief

### 5. Verdere intelligentielagen

- alleen toevoegen als ze de dagboekmachine versterken
- nooit als verbreding naar een brede coach-, chat- of agentervaring zonder expliciete nieuwe productfase

### Productregel voor later

Deze richtingen zijn waardevolle vervolgideeën, maar geen huidige MVP-belofte.

In de huidige fase blijft leidend:

- capture-first
- dagboeklaag centraal
- periodieke reflectie op basis van die dagboeklaag

---

## Productvisie Aanscherping

---
title: Productvisie MVP
audience: both
doc_type: product-canonical
source_role: canonical
visual_profile: plain
upload_bundle: chatgpt-project-context.md
---

# Persoonlijke Assistent App — Productvisie Aanscherping (MVP)

## Doel

Dit document beschrijft gewenst productgedrag en guardrails binnen MVP.

Voor implementatiestatus en code-audit is leidend:

- `docs/project/current-status.md`

## Productgedrag

Bindende formule:

- capture → structureren → dagboeklaag → periodieke reflectie

Aangescherpte interactieformule:

- capture → korte ondersteuning waar passend → opname in dagboeklaag → latere reflectie

## Waarde voor de gebruiker

De app is bedoeld voor mensen die hun dagen niet kwijt willen raken in losse flarden.

De waarde zit in drie stappen:

1. snel vastleggen wat er vandaag gebeurt
2. dat terugzien als een leesbare dag
3. later rustiger herkennen wat terugkomt over een week of maand

De app helpt daarmee niet door veel te praten of te sturen, maar door continuïteit te geven aan eigen input.

Belangrijke productuitkomst:

- losse momenten worden één geheel
- teruglezen kost minder energie
- reflectie ontstaat op basis van je eigen dagboeklaag, niet op basis van losse herinneringen

## Dagboeklaag vs assistentlaag

### Dagboeklaag (canoniek)

- broninhoud van de gebruiker
- verwerkte daginhoud
- periodieke reflecties

Eigenschappen:

- duurzaam
- terugleesbaar
- leidend voor productwaarde

### Assistentlaag (ondersteunend)

- korte begeleiding direct rond capture
- begrensde, lichte ondersteuning

Eigenschappen:

- ondergeschikt aan dagboeklaag
- niet de primaire productmodus
- geen open chat als default

## Productguardrails

1. Dagboeklaag blijft centraal.
2. Assistentgedrag blijft kort en functioneel.
3. Geen therapeutische positionering.
4. Geen verschuiving naar brede coach/chatapp.
5. Rust, helderheid en eigenaarschap van gebruikersinhoud blijven leidend.

## UX-principes rond de kleine assistentlaag

1. Ondersteuning direct rond capture, niet als los chatuniversum.
2. Duidelijk onderscheid tussen wat tijdelijk helpt en wat canoniek wordt opgeslagen.
3. Toon: rustig, concreet, niet-zwaar.
4. Interactie blijft compact en doelgericht.

## Beslisregel voor uitbreidingen

Alleen uitbreiden als het de dagboekmachine versterkt.
Als het vooral richting brede assistent trekt, valt het buiten de huidige MVP-kaders.

## Huidige productclaim vs latere richting

### Huidige productclaim

De app is nu een capture-first dagboekmachine.

De kern is:

- snel vastleggen
- verwerken naar een leesbare dag
- later rustig terugzien wat terugkomt via week- en maandreflecties

De onderscheidende waarde zit in:

- brongebonden verwerking
- rustige narratieve reconstructie
- terugleesbaarheid zonder verzonnen interpretatie

### Latere richting

Na MVP kan dit uitgroeien tot een rijkere persoonlijke archieflaag, bijvoorbeeld met:

- archiefdoorzoeking
- retrieval/Q&A over eigen geschiedenis
- entiteitsextractie of tagging
- een bredere kennislaag bovenop het archief

### Belangrijke grens

Deze latere richting mag intern richting geven, maar is geen huidige productclaim.

We positioneren het product nu niet als:

- second brain
- knowledge base
- personal CRM
- life insights engine
- vraaginterface over je leven

Zolang deze lagen niet productmatig bewezen en expliciet in scope zijn, blijven ze post-MVP.

---

## Actuele Gebouwde Status

---
title: Current Status
audience: both
doc_type: status
source_role: canonical
visual_profile: plain
upload_bundle: chatgpt-project-context.md
---

# Current Status — Codegevalideerd

## Doel

Dit document is de enige statuswaarheid voor implementatierealiteit.

## Obsidian links

- open-points
- Active phase
- Now / Next / Later
- Deviations and decisions
- Strategy hub
- Research hub
- Ideas workspace

Bronnen voor deze status:

1. bestaande projectdocs (scope/planning)
2. actuele codebase (bewijs van implementatie)

## Auditbasis

Gecontroleerd op:

- `docs/**`, `README.md`, `docs/README.md`, `AGENTS.md`
- `.agents/skills/**`
- `app/**`, `components/**`, `services/**`
- `supabase/functions/**`, `supabase/migrations/**`
- `scripts/**`, `package.json`

## Statuslabels

- **Aanwezig**: hard aantoonbaar in code
- **Deels aanwezig**: aantoonbare onderdelen, maar niet volledig bewezen als afgerond
- **Niet aangetroffen**: geen implementatie gevonden
- **Onzeker**: bewijs onvoldoende

## Bewijsmatrix (docsplan vs code)

| Onderwerp | Oorspronkelijk plan | Code-status | Conclusie |
| --- | --- | --- | --- |
| Auth (magic link) | In scope | **Aanwezig** | `app/sign-in.tsx`, `services/auth.ts`, auth-gating in `app/_layout.tsx`. |
| Capture tekst | In scope | **Aanwezig** | `submitTextEntry` + capture UI in `app/capture/index.tsx` en `app/capture/type.tsx`, met servicekoppeling in `services/entries.ts`. |
| Capture audio | In scope | **Aanwezig** | recorder + audio-submit + payload guards in capture/services. |
| Intake flow | Kernflow | **Aanwezig** | `supabase/functions/process-entry/index.ts` + client invoke. |
| Entry hernormalisatie bij edit | Hardening-onderdeel | **Aanwezig** | `renormalize-entry` function + dagdetail editpad. |
| Day journal opbouw | Kernflow | **Aanwezig** | upsert in `process-entry` + `regenerate-day-journal` flow. |
| Reflecties week/maand | Kernflow | **Aanwezig** | `generate-reflection` function + reflectie UI/service. |
| Dagdetail mutaties | UX/hardening | **Aanwezig** | edit/delete + derived refresh in `app/day/[date].tsx` en `app/entry/[id].tsx`. |
| “Opnieuw samenvatten” als zichtbare knop | Genoemd in documentatie | **Deels aanwezig** | heropbouw bestaat functioneel, expliciete zichtbare knop niet hard aangetroffen. |
| ChatGPT markdown import | Niet kern in oorspronkelijke scope | **Aanwezig (feature-flagged)** | `app/settings.tsx`, `services/import/*`, `import-chatgpt-markdown` function + migrationkolommen. |
| Instellingen-submenu | Gevraagd in beheerflow | **Aanwezig** | `app/settings.tsx` toont submenu met `Archief downloaden`, `Importeren`, `Verwijder alles` en admin-only `Data opnieuw verwerken`. |
| Audio-opslagvoorkeur + opnamebewaring | Niet expliciet in vroeg MVP-plan uitgewerkt | **Aanwezig** | `app/settings-audio.tsx`, `services/user-preferences.ts`, migration `20260418101500_entry_audio_storage_and_user_preferences.sql` met `user_preferences`, audio metadata op `entries_raw` en private `entry-audio` bucket policies. |
| User background tasks voor import-status | Hardening-uitbreiding buiten oorspronkelijke kernformule | **Aanwezig** | migration `20260416125000_user_background_tasks.sql` + UI-componenten `components/feedback/background-task-*` + import/services-koppeling voor voortgang en notice-state. |
| Admin globale regeneratiejob | Gevraagd in beheerflow | **Aanwezig** | `app/settings-regeneration.tsx`, `services/admin-regeneration.ts`, `supabase/functions/admin-regeneration-job/index.ts`. |
| OpenAI Batch API verwerking | Vereiste voor schaal/efficiëntie | **Aanwezig** | batch-upload + create/poll/apply + retry-pad op `error_file_id` in `admin-regeneration-job`. |
| Voortgang/status per datatype | Vereiste voor transparantie | **Aanwezig** | teller- en fasevelden (`total/queued/openai_completed/applied/failed/remaining/phase`) in job-steps + UI. |
| Metadata generatie-info (`generation_meta`) | Gevraagd voor gerichte re-run | **Aanwezig** | migration `20260404201500_*` + writes vanuit `admin-regeneration-job` op entries/day/period. |
| Admin-only afscherming regen-pagina | Vereiste security | **Aanwezig** | route verborgen voor niet-admin in `app/settings.tsx` + server-side allowlist checks in function. |
| Product-export voor gebruiker | Gepland in 1.2D | **Aanwezig** | productflow aanwezig in `app/settings.tsx` + `app/settings-export.tsx` op `downloadUserArchive`; handmatige settings-tests bevestigen werkende exportflow, en runtime/API-check bevestigt aanwezige exportbrondata. |
| Product-reset/delete-all | Gepland in 1.2D | **Aanwezig** | delete-sheet flow aanwezig in `app/settings.tsx` met `confirm/loading/success/error`; handmatige settings-tests bevestigen de gebruikersflow en runtime/API-check toont leegmaken van `period_reflections`, `day_journals`, `entries_normalized`, `entries_raw`. |
| Logging/tracing | Gepland 1.2A | **Aanwezig** | `requestId/flowId` contract + `_shared/flow-logger.ts`. |
| Verify scripts lokaal | Gepland 1.2A/1.2E | **Aanwezig** | text/audio/reflection/output-quality scripts aanwezig. |
| AI Quality Studio contract-first editor (`entry_cleanup`) | Hardening AI governance | **Aanwezig** | editor split met alleen taakinstructie als bewerklaag; input/system/response/model + baseline metadata read-only zichtbaar. |
| AIQS admin detail topnav + sticky action footer (shared) | UX/hardening admin | **Aanwezig** | gedeelde admin topnav en 3-action sticky footer primitives toegepast op task/draft/test detailschermen. |
| AIQS prompt-assist preview voor `entry_cleanup` (admin-only) | Editor hardening | **Aanwezig** | server-side action `prompt_assist_preview` + client service/types + draft editor met single-target apply, inline diff en issue-signalen zonder brede chat-UI. |
| Import verify fixtureconsistentie | Kwaliteitsborging | **Aanwezig** | fixture en scripts uitgelijnd op `scripts/fixtures/chatgpt-markdown/dagboek-voor-gemoedstoestand.md`; lokale verify en parser-test slagen weer. |
| Lokale auth smoke workflow (magic-link + Mailpit) | Kwaliteitsborging / testbaarheid | **Aanwezig** | local-only auth smoke tooling met verify-link extractie, login-proof en veilige cleanup voor herkenbare smoke users toegevoegd in `scripts/*local-auth*` en `docs/dev/local-auth-smoke-workflow.md`. |
| Entry detail fotogalerij (max 5) | Moment-detail uitbreiding | **Aanwezig** | secure upload + featured thumbnail onder samenvatting + galerij onderaan + fullscreen swipe/delete/pinch-zoom aanwezig in `app/entry/[id].tsx` en `components/journal/entry-photo-gallery.tsx`. |
| Dag- en momenttekst tonen markdownstructuur (display-only) | Leesbaarheids-/UX-hardening | **Aanwezig** | gedeelde markdown-rendering voor summary/narrative blokken in `components/ui/markdown-display.tsx`, `components/journal/day-journal-summary-inset.tsx` en `components/journal/editorial-narrative-block.tsx`. |
| Entry detail audio + foto-layoutpolish | UX/hardening | **Aanwezig** | audio-sectie blijft zichtbaar; featured foto los bovenin bij aanwezige foto's; empty state en thumbnails onderaan in dezelfde fotosectie. |
| Design 1.2.1 volledige doorvoer | Gepland designspoor | **Aanwezig** | designrefs zijn structureel doorvertaald in shared primitives en kernflows; shell/theming/copy-guardrails zijn expliciet geborgd in canonieke docs en runtime-checklist. |
| Foundation polish: editorial typography + selective ambient backgrounds | Shared design-system hardening | **Aanwezig** | `theme/tokens.ts` bevat nu expliciete typography-roles inclusief display title en gedeelde `ambient/subtle/flat` background tokens; `components/themed-text.tsx`, `components/ui/app-background.tsx`, `components/ui/home-screen-primitives.tsx`, `components/ui/auth-screen-primitives.tsx` en Today (`app/(tabs)/index.tsx`) gebruiken deze foundation. |
| Branded productlaag “Budio Vandaag” in shell/auth/menu | Niet als losse MVP-feature benoemd in vroege projectdocs | **Aanwezig** | branded login/header/menu/splash doorgevoerd in `app/sign-in.tsx`, `components/ui/auth-screen-primitives.tsx`, `components/navigation/fullscreen-menu-overlay.tsx`, `app/(tabs)/index.tsx`, `app.json`. |

## Fase 1.2 status

| Subfase | Status | Onderbouwing |
| --- | --- | --- |
| 1.2A Stabiliteit/foutafhandeling | **Aanwezig** | tracing, foutafhandeling en verify-commando’s zijn aanwezig en actief gebruikt in hardening-passes. |
| 1.2B Outputkwaliteit | **Deels aanwezig** | contracts/guardrails/quality-checks aanwezig; eindstatus “afgerond” niet hard vastgelegd. |
| 1.2C UX-polish | **Aanwezig** | kernflows en shared shell/primitives zijn gepolijst met bron-first fixes en mode-aware guardrails. |
| 1.2D Vertrouwen (export/reset) | **Aanwezig** | settings export/import/delete zijn functioneel geland; handmatige tests bevestigen gebruikersflows en runtime/API-checks bevestigen service- en data-effecten. |
| 1.2E Private-beta readiness | **Deels aanwezig** | setup + verify aanwezig; smoke/release-checklist is nu vastgelegd, maar volledige light/dark runtime-doorloop per kernflow blijft bewijsafhankelijk. |

## Private-beta smoke checklist (1.2E)

Gebruik deze checklist voor proof-first release/hardening. Vink alleen af met runtime-bewijs (light + dark) en check tegen relevante `design_refs/1.2.1/**`.

### Kernflow-routes

- [ ] Auth/login: route opent zonder layoutbreuk; copy compact; geen zware enclosing card.
- [ ] Today: primaire CTA visueel dominant; statusregel compact; recente context secundair.
- [ ] Capture (idle/voice/typing): affordance direct duidelijk; geen toolbars/live transcript/pause-uitbreiding.
- [ ] Post-entry: completion-feel rustig; narrative leesbaar; bewerkactie klein; delete niet dominant.
- [ ] Day detail: reading-hiërarchie helder; geen visuele card-stapeling.
- [ ] Entry detail: terugkoppeling naar juiste dag; narrative/result rustig; acties functioneel compact.
- [ ] Days overview: list-not-cards; per maand gegroepeerd; datum + scanbare samenvatting.
- [ ] Week overview: insight-not-analytics; korte summary + narrative + subtiele highlights.
- [ ] Month overview: insight-not-analytics; korte summary + narrative + subtiele highlights.
- [ ] Settings hub: nav/hero/rows consistent; destructive row rustig.
- [ ] Export: hero/action/notice hiërarchie helder; copy compact.
- [ ] Import: hero/action/result-states helder; voortgang begrijpelijk.
- [ ] Delete/reset flow: confirm/loading/success/error begrijpelijk en rustig.
- [ ] Fullscreen menu/shell/tab bar: header/page/footer coherent; menu/backdrop rustig.

### Theming en shell

- [ ] Light/dark delen dezelfde compositie; dark mode voegt geen extra massa/lagen toe.
- [ ] Header en footer rustiger dan page background; geen decoratieve shell-randen als default.
- [ ] Background modes zijn selectief en mode-aware (`ambient`, `subtle`, `flat`).
- [ ] Content-heavy screens blijven `flat` en clean-first.

### Copy en UX-guardrails

- [ ] Copy is kort, menselijk, direct; geen AI/coach/productivity-taal.
- [ ] Geen dubbele uitleg rond dezelfde primaire actie.
- [ ] Geen dashboardisering/assistentdrift in overview- en reflection-flows.

### Evidence-regel

- [ ] Werk wordt pas “klaar” genoemd na: routecheck + light/dark runtime-check + vergelijking met relevante design refs.

## Correcties op eerdere ruis

- Foutieve padverwijzing gecorrigeerd: `docs/project/docs/project/master-project.md` bestaat niet; correct is `docs/project/master-project.md`.
- Productfeature, dev-tooling en verify-tooling zijn expliciet onderscheiden.
- Tooling-aanwezigheid telt niet automatisch als gebruikersfeature.

## Workflow/docs realiteit (april 2026)

- Rolverdeling ChatGPT Projects (strategie/review/promptontwerp) vs Cline (repo-uitvoering) is nu expliciet vastgelegd in `AGENTS.md`.
- Scheiding tussen canonieke projectdocs (`docs/project/**`), workflowdocs (`docs/dev/**`) en uploadartefacten (`docs/upload/**`) is expliciet aangescherpt.
- Er is een operationele workflowdoc toegevoegd: `docs/dev/cline-workflow.md`.
- Er is een lichte repo-eigen memory-bank/active-context workflow vastgelegd in `docs/dev/memory-bank.md` en `docs/dev/active-context.md` (operationeel, niet-canoniek).

## Delta-audit (laatste 2 weken codewijzigingen)

- Capture/detail-flows zijn verder gepolijst met audio-afspeelcomponent (`components/journal/entry-audio-player.tsx`), verfijnde modals en rustiger feedbackstates.
- Settings-informatiearchitectuur is uitgebreid met aparte audio-instellingen (`app/settings-audio.tsx`) naast export/import/delete/admin.
- Obsidian-settingspad is technisch toegevoegd maar default-off gezet achter feature flag (`enableObsidianSettings`) en staat daarmee buiten de standaard productroute.
- Importflow gebruikt nu expliciet background task infrastructuur (`user_background_tasks`) voor voortgang/notices i.p.v. enkel schermgebonden status.
- AIQS adminflow is verdiept met editor- en readmodelverbeteringen, prompt-assist en debug-opslagfundering.
- Supabase hardening is uitgebreid met securityfixes op `search_path` en extra datafundering (`entries_normalized.updated_at`, audio storage metadata/policies).
- UI-shell/branding is zichtbaarder door branded auth/header/menu/splash doorvertaling.

## Recente regressie-learnings (april 2026)

- Admin-access UI mag alleen `Geen toegang` tonen bij expliciete auth-codes (`AUTH_UNAUTHORIZED`/`AUTH_MISSING`), niet bij generieke netwerk- of loadfouten.
- Allowlist parsing in edge functions moet gequote env-waarden (`"uuid"`, `'uuid'`) normaliseren om false `Forbidden` te voorkomen.
- Prompt-editor newline/paragraph normalisatie moet editor-overstijgend consistent blijven; sectiewissels mogen geen lege-regel-migratie veroorzaken.
- AIQS token-editor blijft bewust compact: helperblok “Gebruikte tokens” verwijderd en editor-surface blijft licht voor leesbaarheid in dark mode.

## Strategische afwijking t.o.v. nieuw researchpakket

- De huidige runtime is sterker in capture/hardening dan in commerciële output-conversie: de app levert aantoonbaar capture, daglaag, reflecties, import/export, audio-opslagoptie en admin-governance.
- De in research beschreven Pro-wedge (capture -> review -> publiceerbare output) is nog niet productmatig als eindgebruikersflow geland.
- AIQS is al een sterke admin control-laag, maar nog niet de volledige future-state control plane met breed task-registry, usage-economie en product-tiering in runtime.
- Strategische koers is per 20 april 2026 formeel gesplitst in twee sporen: `Jarvis` internal-only (founder use) en `Knowledge Hub + AIQS` als publiek-relevante ontwikkellijn; dit is nu documentair besloten, maar nog niet als volledige runtime-implementatie geland.

## Samenvatting

De release-1 kernlus is aantoonbaar gebouwd. Daarnaast is een admin-only settingspad toegevoegd voor globale herverwerking via OpenAI Batch API, inclusief persistente jobstatus en per-type voortgang. Voor 1.2D zijn settings export/import/delete nu functioneel bewezen binnen deze afgesloten scope (handmatige flow-validatie + runtime/API-bewijs van service- en data-effecten). Onvoldoende bewezen claims buiten deze scope blijven expliciet onzeker.

---

## Open Punten / Resterend Werk

---
title: Open Points
audience: both
doc_type: status
source_role: canonical
visual_profile: plain
upload_bundle: chatgpt-project-context.md
---

# Open Points — Resterend Werk

## Doel
<!-- TASK_OVERVIEW:START -->
_Open taken voor de huidige fase; de detailbeschrijving leeft in `docs/project/25-tasks/**`._

| Taak | Status | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- | --- |
| [1.2B outputkwaliteit expliciteren en afronden](25-tasks/open/1-2b-outputkwaliteit-expliciteren-en-afronden.md) | Backlog | p1 | transitiemaand-consumer-beta | Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als "voldoende goed" geldt. De ta... |
| [AIQS productie live zetten voor bestaande OpenAI-calls](25-tasks/open/aiqs-productie-live-zetten-bestaande-openai-calls.md) | Backlog | p1 | transitiemaand-consumer-beta | De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls. Er worden geen nieuwe calls toegevoegd en geen n... |
| [Entry photo gallery volledige end-user E2E flows](25-tasks/open/entry-photo-gallery-volledige-end-user-e2e-flows.md) | Ready | p1 | transitiemaand-consumer-beta | Er is een volledige Playwright end-user suite voor entry photo gallery flows. De suite gebruikt reproduceerbare local-only seed/cleanup h... |
| [Moment detail foto-upload productieflakiness onderzoeken](25-tasks/open/moment-detail-foto-upload-productieflakiness-onderzoek.md) | Ready | p1 | transitiemaand-consumer-beta | Voor moment detail foto-upload is de productieoorzaak bevestigd en hersteld. Een upload met de vaste agent-testaccount werkt betrouwbaar... |
| [1.2E beta-readiness expliciteren en afronden](25-tasks/open/1-2e-beta-readiness-expliciteren-en-afronden.md) | In Progress | p1 | transitiemaand-consumer-beta | Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.... |
| [AIQS logging valideren in OpenAI dashboard en fallback-logpad](25-tasks/open/aiqs-logging-valideren-openai-dashboard-en-fallback.md) | In Progress | p1 | transitiemaand-consumer-beta | Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests... |
| [Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering](25-tasks/open/origineel-plan-integriteit-borgen-tijdens-agent-uitvoering.md) | In Progress | p1 | transitiemaand-consumer-beta | De repo-taskflow borgt voortaan expliciet dat een goedgekeurd oorspronkelijk plan of afgesproken scope tijdens uitvoering stabiel blijft,... |
| [Plan Mode task auto-create bij ontbrekende match](25-tasks/open/plan-mode-task-auto-create-bij-ontbrekende-match.md) | In Progress | p1 | transitiemaand-consumer-beta | Plan Mode werkt voortaan met een goedkope en consistente preflight: - eerst zoeken naar een passende bestaande task - bij duidelijke matc... |
| [Moments-overzicht primaire foto thumbnail en viewer](25-tasks/open/moments-overzicht-primaire-foto-thumbnail-en-viewer.md) | Blocked | p1 | transitiemaand-consumer-beta | In het gedeelde `MomentsTimelineSection` wordt bij aanwezige foto's een compacte primaire thumbnail getoond binnen de bestaande tijdkolom... |
| [AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)](25-tasks/open/aiqs-admin-interface-thema-herontwerp-spotify-openai-stijl.md) | Backlog | p2 | transitiemaand-consumer-beta | AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.... |
| [Budio webapp compatible maken](25-tasks/open/budio-webapp-compatible-maken.md) | Backlog | p2 | transitiemaand-consumer-beta | Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een... |
| [Docs scheiden naar private repo (strategie + migratieplan)](25-tasks/open/docs-private-repo-scheiding-en-migratieplan.md) | Backlog | p2 | transitiemaand-consumer-beta | Een concreet en uitvoerbaar migratieplan voor optie 2: docs onderbrengen in een aparte private repo binnen dezelfde workspace, inclusief... |
| [niet vergeten](25-tasks/open/niet-vergeten.md) | Backlog | p2 | transitiemaand-consumer-beta | Beschrijf in 1-3 korte alinea's wat klaar moet zijn wanneer deze taak done is. |
| [npm audit kwetsbaarheden beoordelen en saneren](25-tasks/open/npm-audit-kwetsbaarheden-beoordelen-en-saneren.md) | Backlog | p2 | transitiemaand-consumer-beta | Er ligt een bron-gebaseerde beoordeling van de npm audit meldingen, inclusief onderscheid tussen: - direct runtime-risico - dev-only/tool... |
| [STITCH_API_KEY voor MCP activeren](25-tasks/open/stitch-api-key-voor-mcp-activeren.md) | Backlog | p2 | transitiemaand-consumer-beta | De lokale setup bevat een actieve `STITCH_API_KEY` in `.env.local`, zodat Stitch MCP later zonder extra handelingen gebruikt kan worden.... |
| [Budio Workspace activity-bar opent list view zonder workspace-menu](25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md) | In Progress | p2 | transitiemaand-consumer-beta | Klikken op het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in `list` view. De oude `Workspace`-launcher is... |
| [Docs folderstructuur en visual language herbeoordelen na metadatafase](25-tasks/open/docs-folderstructuur-en-visual-language-herbeoordeling-na-metadatafase.md) | Blocked | p3 | transitiemaand-consumer-beta | Na afronding van `docs-ux-audience-taxonomie-en-uploadbundels.md` ligt er een korte, brongebaseerde beoordeling: - Is metadata + bundling... |
<!-- TASK_OVERVIEW:END -->

Dit document bevat alleen resterende gaps, risico’s en onzekerheden op basis van code-realiteit.

## Obsidian links

- current-status
- Active phase
- Now / Next / Later
- Deviations and decisions
- Research map
- Research hub
- Ideas workspace

## Echt open (niet aangetroffen in code als productfeature)

1. Self-service beheer van adminrechten in product-UI ontbreekt; huidige toegang loopt via server-side allowlist env.

Toelichting:

- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.
- settings export/import/delete zijn functioneel aanwezig en voor deze scope bewezen.

## Deels open (nog niet hard afgerond)

1. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
2. 1.2E private-beta readiness met volledige runtime-doorloop van de releasechecklist in light + dark mode.
3. Internal Jarvis-baseline (founder-only) is alleen als research-lane actief (max 1 dag/week) en nog niet volledig uitgewerkt.
4. Knowledge Hub voor AIQS (PDF/audio/foto, grounding, citations) blijft hoge prioriteit, maar staat gepland voor volgend kwartaal.
5. Nieuwe 00/10/20/30/40/50 uploadbundels zijn nu primair ingericht, maar teamworkflow moet nog expliciet op deze primaire set standaardiseren (legacy blijft nog aanwezig).

## Onzeker

1. Tempo en diepte van Jarvis internal uitbreidingen voor planning/podcast/builder-workflows.
2. Import-verify robuustheid door ontbrekende chatgpt-import fixture.
3. Volledige handmatige UI-smoke voor alle settings-states (hub/export/import/delete) is nog niet als apart bewijsartefact vastgelegd.
4. Repo versus productie-deploy boundary is nog niet expliciet genoeg: welke repo-artefacten (docs/workflow/Obsidian-werkbestanden) mogen versioned zijn maar horen nooit in runtime/deploypad terecht te komen.

## Afwijkingen tussen huidig MVP-plan en runtime-realiteit

### Functionaliteit-afwijkingen (al gebouwd t.o.v. oudere docs)

1. Audio-opslagvoorkeur per gebruiker is toegevoegd (aan/uit bewaren van originele opnames), inclusief storage- en metadatafundering.
2. Import/background task infrastructuur is toegevoegd met `user_background_tasks` en voortgang/notices in UI.
3. Settings IA is verbreed met aparte audio-instellingen naast export/import/delete en admin-routes.
4. Supabase hardening bevat extra security- en dataconsistentie-aanpassingen (search_path-fixes, `entries_normalized.updated_at`) die niet als afzonderlijke productcapabilities in het oudere MVP-plan stonden.
5. Obsidian settings-route is technisch aanwezig maar standaard uitgezet achter feature flag (`enableObsidianSettings`), waardoor runtime-capability en zichtbare productscope uit elkaar lopen.

### UI/UX-afwijkingen (al zichtbaar in product)

1. Branded laag “Budio Vandaag” is doorgevoerd in auth/header/menu/splash en ligt nu nadrukkelijker op merkidentiteit dan in eerdere MVP-docs stond.
2. Shell-polish (menu/topnav/background consistency) is verder doorgevoerd dan de oorspronkelijke minimale MVP-beschrijving.
3. Capture/detail/settings UX bevat nu uitgebreidere status- en feedbackstates (background notices, selector-modals, audio playback), waardoor de runtime-ervaring rijker is dan de vroege MVP-baseline.

### Strategische afwijkingen (research vs huidige productrealiteit)

1. Research stuurt op Pro-wedge (capture -> review -> output/publicatievoorbereiding), maar die flow ontbreekt nog als concrete gebruikersfunctionaliteit.
2. Research stuurt op usage/credits/tiering en commerciële stuurinformatie; runtime bevat dit nog niet als productlaag.
3. AIQS is sterk als admin-governance, maar nog niet de volledige control plane zoals in future-state research beschreven.

## Prioriteit

1. Plan A primair afronden: AIQS-basis + 1.2B/1.2E bewijsgedreven completion.
2. Plan B beperkt uitvoeren: Jarvis internal-only researchlane binnen weekbudget.
3. Knowledge Hub inhoudelijk voorbereiden als next-quarter high-prio traject.
4. Verbind podcast/builder-wedge expliciet aan publieke roadmapkeuzes.
5. Los resterende onzekerheden op met hard bewijs; anders onzeker laten.

## Risico’s

1. Scope-creep waarbij Jarvis alsnog impliciet publieke feature wordt.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.
4. Strategische drift: te veel interne Jarvis-focus zonder publiek-relevante Knowledge Hub voortgang.

## Later project — import volledig laten doorlopen op de achtergrond

### Status

Later onderzoeken. Niet voor huidige fase.

### Waarom

Het echte importeren van entries draait server-side zodra de request loopt.
De naverwerking daarna is nu nog afhankelijk van het open importscherm of actieve app-sessie.
Daardoor is dit nog geen volledige fire-and-forget achtergrondtaak.

### Gewenste eindrichting

Import moet volledig server-side kunnen doorlopen, ook als:

- de gebruiker het scherm sluit
- de app naar de achtergrond gaat
- de verbinding kort wegvalt na het starten

### Doel

Een robuustere importflow waarbij:

- entry-import start via één gebruikersactie
- afgeleide verwerking daarna zelfstandig doorloopt
- dagboekdagen, weekreflecties en maandreflecties niet meer afhankelijk zijn van actieve client-state

### Buiten scope nu

Niet in fase 1.2.
Dit raakt architectuur, job-afhandeling en betrouwbaarheid van achtergrondverwerking.

### Waarom later waardevol

- betrouwbaardere importervaring
- minder afhankelijkheid van open scherm of actieve app
- logisch vervolg op importfeature zodra MVP/hardening stabiel is

### Open vragen voor later

- server-side jobmodel of queue
- statusopvolging voor gebruiker
- retry-gedrag bij mislukte naverwerking
- hoe en wanneer de UI importstatus terughaalt

---

## Content / Narrative Processing Regels

---
title: Content and narrative processing rules
audience: both
doc_type: product-canonical
source_role: canonical
visual_profile: plain
upload_bundle: chatgpt-project-context.md
---

# Content & Narrative Processing Rules (Canoniek)

> Relatie met AI governance:
>
> - Deze regels zijn onderdeel van het AI Quality Studio-contract.
> - Bij conflict geldt:
>   - `content-processing-rules.md` is leidend voor inhoud en laagcontracten.
>   - `ai-quality-studio.md` is leidend voor tooling, prompting-governance en evaluatieproces.

## Doel

Dit document is het bindende gedragscontract voor contentverwerking in drie lagen:

1. `entries_normalized.body`
2. `day_journals.narrative_text`
3. `day_journals.summary`

Dit is de canonieke content-regeldoc voor MVP en fase 1.2B.

## Waarom dit document leidend is

Deze regels sluiten direct aan op:

- server contracts en guardrails in `process-entry`, `regenerate-day-journal`, `renormalize-entry`, `generate-reflection`
- quality-verify checks in `scripts/verify-local-output-quality.sh`

## Kernregel

De engine structureert en verwoordt, maar voegt geen nieuwe betekenis toe.

## Laagcontracten

### 1) `entries_normalized.body`

Doel:

- volledige opgeschoonde entrytekst behouden

Mag:

- ruis/stotteren/kleine taalfouten opschonen
- betekenisloze dubbele herhaling reduceren

Mag niet:

- samenvatten
- merkbaar inkorten
- parafraseren naar generieke AI-tekst
- nieuwe claims toevoegen

### 2) `day_journals.narrative_text`

Doel:

- volledige verhalende dagtekst over alle betekenisvolle dagmomenten

Moet:

- brongebonden blijven
- ik-vorm volgen waar bron in ik-vorm is
- betekenisvolle momenten behouden
- rustige, natuurlijke leesbaarheid hebben

Mag niet:

- functioneren als samenvatting
- verslaggever-/derdepersoonstonen introduceren
- verzonnen brugzinnen, oorzaken of inzichten toevoegen
- therapie/diagnose/coachtaal gebruiken

### 3) `day_journals.summary`

Doel:

- korte, compacte dagsamenvatting voor snelle oriëntatie

Moet:

- duidelijk korter zijn dan narrative
- concreet en feitelijk blijven

Mag niet:

- rol van narrative overnemen
- nieuwe interpretatie of niet-brongebonden inhoud introduceren

## Aanvullend contract — `period_reflections`

Doel:

- compacte periodieke synthese op basis van day journals

Moet:

- brongebonden blijven op `day_journals`
- samenvatting, highlights en reflectiepunten compact en bruikbaar houden

Mag niet:

- therapeutische of diagnostische taal gebruiken
- inhoud verzinnen buiten de bron
- standaard vervallen in todo-achtige actiepunten of checklisttaal

## Aanvullend contract — directe assistentlaag na capture (indien gebruikt)

Doel:

- korte ondersteuning direct rond vastleggen

Moet:

- kort en ondersteunend zijn
- niet-canoniek blijven t.o.v. dagboeklaag
- rustige, niet-therapeutische toon gebruiken

Mag niet:

- automatisch dagboeklaag vervuilen
- de productervaring verschuiven naar open chatmodus

## Scheidingsregel tussen lagen

- `entries_normalized.body` = volledige opgeschoonde bronlaag van één entry
- `day_journals.narrative_text` = volledige dagverhaallaag
- `day_journals.summary` = compacte samenvattingslaag
- `period_reflections` = periodieke synthese op dagboeklaag
- directe assistentlaag = tijdelijk, ondersteunend, niet-canoniek

Als `summary` en `narrative_text` functioneel hetzelfde worden, is dat contractbreuk.

## Toonregels

Gewenst:

- rustig Nederlands
- concreet
- niet-meta
- niet-generiek AI

Ongewenst:

- psychologische duiding als feit
- therapietaal
- management-/rapporttaal
- meta-zinnen over “de notities” of aantallen als inhoudsvuller

## Acceptatiecriteria

1. Betekenisvolle broninhoud blijft behouden in `entries_normalized.body`.
2. `narrative_text` bevat alle relevante dagmomenten zonder verzinsels.
3. `summary` is korter en compacter dan `narrative_text`.
4. `period_reflections` blijven brongebonden en compact-synthetisch.
5. Directe assistentreacties (indien gebruikt) blijven kort, ondersteunend en niet-canoniek.
6. Geen marker-leak of fallback-tekst als inhoud in dagboek/reflectie.

## Implementatiekoppeling

Primair geraakt door:

- `supabase/functions/process-entry/index.ts`
- `supabase/functions/regenerate-day-journal/index.ts`
- `supabase/functions/renormalize-entry/index.ts`
- `supabase/functions/generate-reflection/index.ts`
- `supabase/functions/_shared/day-journal-contract.mjs`
- `scripts/verify-local-output-quality.sh`

## Buiten scope

- nieuwe AI-flowarchitectuur
- stijlclone-engine
- extra tabellen of migrations voor deze regels

## Capture Audio — State Guardrails

- Opname is pas actief wanneer de recorder technisch gestart is
- Init/preparing state moet zichtbaar zijn vóór actieve opname
- Annuleren-modal pauzeert actieve opname direct
- Sluiten van modal herstelt de pre-modal state correct
- Annuleren (bevestigd) reset alle capture state volledig naar idle
- Annuleren start nooit verwerking en slaat niets op
- State-transities zijn expliciet, nooit impliciet

---

## Copy Instructions

---
title: Copy instructions
audience: both
doc_type: product-canonical
source_role: canonical
visual_profile: plain
upload_bundle: chatgpt-project-context.md
---

# Persoonlijke Assistent App — Copy Instructions

## Doel

Zorg dat alle copy in de app en website:

- rustig aanvoelt
- menselijk klinkt
- direct is
- niet overdreven slim doet
- de gebruiker helpt zonder aandacht te vragen

De app is geen assistent, coach of AI-tool.  
Het is een plek om je dag vast te leggen.

---

## Kernbelofte

**Vandaag — Je dag, rustig vastgelegd.**

Alles wat we schrijven moet dit ondersteunen:

- vastleggen
- terugzien
- rust
- continuïteit

---

## Website-kernboodschap

Gebruik voor website en positionering steeds deze gedachte:

Deze app helpt je om losse momenten van je dag niet kwijt te raken.
Je legt snel vast wat er is, ziet het later terug als een leesbare dag, en kunt rustiger terugzien wat terugkomt.

### Kernzinnen voor website-copy

- Leg vast wat er vandaag gebeurt
- Zie je dag later rustig terug
- Maak van losse momenten een leesbare dag
- Zie over tijd wat terugkomt
- Rust en continuïteit, zonder gedoe

### Wat we wel beloven

- snel vastleggen
- rustig terugzien
- leesbare dagopbouw
- reflectie op basis van je eigen dagen
- meer continuïteit in je eigen verhaal

### Wat we niet beloven

- therapie
- coaching
- diagnoses
- gedragsanalyse als hoofdpropositie
- een slimme assistent die het van je overneemt

### Positioneringsregel

Schrijf altijd vanuit de ervaring van de gebruiker:

- ik wil mijn dagen niet kwijt raken
- ik wil sneller kunnen terugzien wat er echt speelde
- ik wil rustiger herkennen wat terugkomt

Schrijf niet vanuit systeemtaal of technische slimheid.

## Tone of voice

### 1. Rustig

- korte zinnen
- geen uitroeptekens
- geen marketingdruk

✔ Leg iets vast  
✖ Leg NU iets vast!

---

### 2. Menselijk

- spreek zoals een mens, niet als systeem
- geen technische taal

✔ Je hebt vandaag nog niets vastgelegd  
✖ Geen entries gevonden voor huidige datum

---

### 3. Direct

- zeg wat iemand kan doen
- vermijd abstractie

✔ Spreek of schrijf iets  
✖ Start een nieuwe input sessie

---

### 4. Bescheiden intelligentie

- de app mag slim zijn
- maar zegt dat niet

✔ Dit is je dag tot nu toe  
✖ AI gegenereerde samenvatting van je dag

---

## Wat we NIET zijn

Gebruik deze woorden niet:

- AI
- assistant
- coach
- insights (als buzzword)
- magic
- powerful
- productivity tool
- personal curator
- journaling platform

---

## Website-positionering guardrails

### Wat we wél mogen zeggen

Gebruik taal die past bij:

- je dagen niet kwijt raken
- losse momenten terugzien als één leesbare dag
- rustig terugzien wat terugkomt
- continuïteit in je eigen verhaal
- brongebonden verwerking
- terugleesbaarheid en vertrouwen

### Wat we níet mogen zeggen

Gebruik niet:

- second brain
- knowledge base
- personal CRM
- life insights engine
- AI-journal
- therapeutisch systeem
- coach voor herstel
- vraag alles over je leven

### Positioneringsregel

De huidige website-copy verkoopt geen brede intelligentielaag.

De website verkoopt nu:

- snel vastleggen
- leesbare dagopbouw
- rustige terugblik
- vertrouwen dat de output dicht bij de eigen input blijft

### Founder story regel

De oorsprong van het product mag persoonlijk zijn.
De hoofdpositionering blijft productmatig.

Dus:

- persoonlijke aanleiding mag in een founder story of over-pagina
- de homepage-hero en kerncopy spreken vanuit gebruikerswaarde, niet vanuit diagnoses, therapie of privégeschiedenis

### Extra copycheck voor marketing

Controleer bij website-copy altijd:

1. Verkopen we hier een huidige productwaarde of een latere belofte?
2. Klinkt dit rustig en menselijk?
3. Trekken we niet ongemerkt richting AI-, coach- of second-brain-taal?
4. Is de gebruiker hier geholpen met een concreet voordeel?

## Schrijfprincipes

### 1. Actie eerst

De gebruiker opent de app om iets vast te leggen.

✔ Leg iets vast  
✖ Welkom terug

---

### 2. Vandaag is centraal

De app draait om vandaag.

✔ Dit is je dag tot nu toe  
✖ Overzicht van je activiteit

---

### 3. Geen overload

Houd tekst compact.

✔ Een korte samenvatting  
✖ Lange uitlegblokken

---

### 4. Geen oordeel

De app is neutraal.

✔ Je hebt vandaag nog niets vastgelegd  
✖ Je bent vandaag nog niet productief geweest

---

## Standaard copy (gebruik deze exact)

### Primary action

Leg iets vast

### Input CTA

Spreek of schrijf iets

### Empty state (vandaag)

Je hebt vandaag nog niets vastgelegd.

### Day summary intro

Dit is je dag tot nu toe.

### Status

Vandaag bijgewerkt

---

## Reflecties (secundair)

Reflecties zijn ondersteunend, niet leidend.

✔ Weekreflectie beschikbaar  
✖ Ontdek inzichten uit je week

✔ Bekijk reflectie  
✖ Analyseer je gedrag

---

## Microcopy regels

- maximaal 1 zin waar mogelijk
- geen dubbele uitleg
- geen herhaling van hetzelfde in andere woorden
- vermijd bijvoeglijke naamwoorden
- schermen met één primaire actie volgen bij voorkeur: hero + actie + compacte notice
- zet niet dezelfde uitleg boven én onder een formulier of CTA
- notice-copy is ondersteunend, kort en niet technisch
- auth- en settings-copy blijft compact, menselijk en rustig

✔ Rustig terugzien  
✖ Gemakkelijk en overzichtelijk terugkijken

---

## Fouten die we vermijden

### Te productmatig

✖ Optimaliseer je dag  
✖ Verhoog je productiviteit

### Te slim doen

✖ Op basis van je gedrag zien we dat...

### Te vaag

✖ Begin hier  
✖ Ga verder

### Te vaag (CTA’s)

✖ Verder  
✖ Ga door  
✖ Start

✔ Gebruik altijd een concrete actie die beschrijft wat er gebeurt

---

## Check voor elke tekst

Stel jezelf deze vragen:

1. Helpt dit iemand iets doen?
2. Is dit korter te maken?
3. Klinkt dit als een mens?
4. Zeggen we niet impliciet “wij zijn slim”?

Als het antwoord niet duidelijk ja is → herschrijven.

---

## Samenvatting in 1 zin

De app praat niet tegen je.  
Hij helpt je rustig je dag vast te leggen.

---

## AI Quality Studio Governance

---
title: AI Quality Studio
audience: both
doc_type: ai-governance
source_role: canonical
visual_profile: plain
upload_bundle: 30-budio-build-ai-governance-and-operations.md
---

# AI Quality Studio (Canoniek)

## Canonieke status

Dit document is de **leidende bron voor AI-gedrag, promptbeheer, evaluatie en runtime-governance** binnen dit project.

Bij conflict geldt:

- `docs/project/content-processing-rules.md` is leidend voor **inhoudscontracten en grensgedrag van output**
- `docs/project/ai-quality-studio.md` is leidend voor **AI-tooling, prompting, evaluatie, versiebeheer, rollout en runtime-governance**
- andere projectdocs verwijzen hiernaar voor AI-gedrag en promptbeheer

Dit document beschrijft zowel:

- de huidige werkende tussenarchitectuur
- als de gewenste eindrichting voor een volwassen AI quality platform-laag
- en de **bindende bouwvolgorde** voor de volgende studio-fase

---

## 1. Doel en positie

AI Quality Studio is een **admin-only AI quality en prompting governance tool**.

Doel:

- AI-output betrouwbaar verbeteren
- prompt- en modelwijzigingen beheersbaar maken
- testbaar en reproduceerbaar itereren op echte brondata
- zichtbaar kunnen valideren of een nieuwe prompt **daadwerkelijk beter** is dan de huidige runtime-basis
- runtime-gedrag later gecontroleerd uit code-baseline naar DB-live binding brengen

De studio is:

- task-first
- contract-first
- result-first
- evidence-first
- server-side only

De studio is **geen**:

- end-user feature
- brede assistentlaag
- generieke AI per scherm
- vervanging van productkaders of contentcontracten
- mini-Langfuse of mini-Agenta als generiek platformdoel

---

## 2. Scopekader

### In scope

- Werk per **AI-task**, niet per scherm
- Versioning per task
- Runtime-baseline import uit code
- Drafting en gecontroleerde model/prompt-editing
- Test runs met snapshots
- Vergelijking testoutput vs runtime-basis
- Opslaan van evaluatie-uitkomsten per run/case/versie
- Handmatige review en rollout-governance
- Traceability per versie en run
- Admin UX voor mobiel én desktop/fullscreen gebruik

### Buiten scope

- Client-side OpenAI calls
- End-user debug- of beheerfeatures
- Brede chat/coach/agent-ervaring
- Auto-optimalisatie als vervanging van menselijke review
- Runtime DB-binding zonder rollout- en rollbackpad
- Volledige live-observability en productiebeoordeling als eerste volgende fase
- Generieke prompt IDE voor willekeurige toekomstige AI use cases

---

## 3. Strategische aanscherping (april 2026)

De eerstvolgende studiofase draait **niet** primair om brede rollout of live runtime-integratie.

De eerstvolgende studiofase draait om één kernvraag:

**Is een nieuwe promptversie aantoonbaar beter dan de huidige basis?**

Vanaf de strategische splitsing (20 april 2026) geldt aanvullend:

- AIQS prioriteert `Knowledge Hub`-fundering (source ingest, grounding, citations).
- AIQS ondersteunt publieke wedge-validatie op builders/podcasters.
- `Jarvis` blijft internal-only founderplatform en is geen publieke AIQS-productbelofte.

Daarom is de bindende prioriteit nu:

1. testen binnen de studio
2. vergelijkbaar valideren van kandidaat-output vs runtime-basis
3. source-aware evaluatie op grounding en citation-fidelity toevoegen
4. evaluatie-uitkomsten opslaan als bewijs
5. editor-ervaring en task-consistentie gelijktrekken
6. admin UX op desktop/fullscreen verbeteren zonder mobiel te breken
7. lifecycle, rollout, runtime-koppeling en live monitoring pas daarna verder uitbouwen

Dit betekent expliciet:

- testbaarheid gaat vóór rollout-volume
- evidence gaat vóór dashboard-polish
- editor-consistentie gaat vóór nieuwe promptfeatures
- runtime/live-beoordeling komt **later**, omdat runtime nu nog hardcoded en niet versiegestuurd uit de studio leest

---

## 4. Canonieke ontwerpprincipes

1. **Contract-first**  
   Content contracts zijn leidend boven promptvrijheid.

2. **Task-first**  
   Beheer op AI-taken, niet op UI-schermen.

3. **Result-first**  
   Testresultaat, compare en evaluatie zijn primair; technische metadata is secundair.

4. **Evidence-first**  
   Een promptwijziging is pas waardevol als zichtbaar is of die beter, gelijk, slechter of fout is ten opzichte van de basis.

5. **Server-side only**  
   API keys, modelcalls en runtime-execution blijven server-side.

6. **Traceability by default**  
   Input/prompt/model/output snapshots + request/flow context zijn standaard.

7. **Eerlijke representatie**  
   Toon expliciet wanneer een studio-task onderdeel is van een gedeelde runtime-family.

8. **Geen dubbele waarheid zonder transitieplan**  
   Als code en DB tijdelijk naast elkaar bestaan, moet de hiërarchie expliciet zijn.

9. **Desktop-capable admin**  
   Adminschermen mogen mobiel goed werken, maar mogen niet kunstmatig vastgezet blijven op een mobiele breedte als primaire desktopervaring.

---

## 5. Relatie met contentcontracten (bindend)

Volgt `docs/project/content-processing-rules.md`.

Kernscheiding:

- `entry_cleanup` ≠ samenvatting
- entry-normalization loopt als één compound flow (`entry_cleanup`) voor `title`, `body`, `summary_short`
- `day_narrative` ≠ `day_summary`
- reflectiepunten ≠ advieslaag
- reflecties ≠ therapeutische interpretatie

Als output deze grenzen schendt, is dat een **kwaliteitsfout**, ongeacht modelscore of “mooier” taalgebruik.

---

## 6. Huidige code-realiteit (status april 2026)

Deze sectie beschrijft wat nu aantoonbaar gebouwd is en wat strategisch relevant is voor de volgende fase.

### 6.1 Datamodel (aanwezig)

Tabellen:

- `ai_tasks`
- `ai_task_versions`
- `ai_test_cases`
- `ai_test_runs`
- `ai_live_generation_log`

Aanwezig in schema:

- enums voor input/output/status/review/source
- UUID PK’s, FK’s, timestamps
- 1 live versie per task
- oplopende versioning per task
- snapshotvelden voor test runs
- seed van 12 canonieke tasks

### 6.2 Edge function (aanwezig)

Function:

- `admin-ai-quality-studio`

Huidige acties:

- `access`
- `list_tasks`
- `get_task_detail`
- `import_runtime_baseline`
- `create_draft_version`
- `update_draft_version`
- `delete_draft_version`
- `list_test_sources`
- `run_test`
- `get_test_run`
- `get_compare_view`

Auth:

- allowlist + internal token patroon, server-side gehandhaafd

### 6.3 App-beheerlagen (aanwezig)

- task hub
- task detail / versions
- draft editor
- test / compare

### 6.4 Entry_cleanup contract-first editor (aanwezig, maar voor op generieke editorlaag)

- `entry_cleanup` volgt nu expliciet een contract-first editorstructuur:
  - **alleen taakinstructie bewerkbaar**
  - input/system/response/model contractlagen zichtbaar als read-only
- response-contract is object-based en zichtbaar als:
  - `title: string`
  - `body: string`
  - `summary_short: string`
- systemcontract is compact gehouden op niet-vrije grenzen:
  - alleen opgegeven bronvelden gebruiken
  - alleen JSON volgens contract retourneren
  - field-level contractgrenzen blijven technisch afgedwongen
- baseline metadata blijft zichtbaar maar read-only, en geen primaire bewerklaag

**Belangrijke conclusie:** `entry_cleanup` is nu inhoudelijk sterker dan de rest van de editors. Dat is goed voor die task, maar nog geen uniforme studio-abstraction.

### 6.5 Admin detail-shell polish (aanwezig, maar desktop-ervaring nog niet goed genoeg)

- gedeelde admin topnavigatie is visueel en technisch gecentreerd en navigation-only gebleven
- gedeelde sticky action footer is nu een compact, herbruikbaar admin pattern met duidelijke hiërarchie:
  - primary
  - secondary
  - tertiary (quiet/destructive)
- patroon is toegepast op AIQS detailschermen zonder runtime- of contractscope uit te breiden

**Belangrijke conclusie:** huidige adminschermen zijn nog te veel als mobiele breedte gefixeerd, ook op desktop. Dat beperkt de studio-waarde op grotere schermen en fullscreen gebruik.

### 6.5b Prompt Assist in draft editor (`entry_cleanup`) (aanwezig, beperkte scope)

- prompt assist draait admin-only binnen de bestaande draft editorlaag
- assist is task-first en contract-first:
  - analyse gebruikt volledige promptcontext (`system rules`, `general instruction`, `field rules`, outputcontract, taskmetadata)
  - rewrite/apply blijft per run beperkt tot één expliciet gekozen targetlaag
- server-side previewactie aanwezig (`prompt_assist_preview`) met typed payload/result
- UI blijft diff/apply-georiënteerd en vermijdt brede chatervaring

**Belangrijke conclusie:** assist is bewust een lokale editor-hardening en geen autonome prompt-optimizer of generieke chatlaag.

### 6.6 Runtime-baseline model (aanwezig, transitie)

- runtime-definities worden nu opgebouwd vanuit code
- baseline import schrijft deze als `live` naar studio-DB
- runtime zelf leest nog niet uit studio-DB

**Conclusie:** huidige model is een bruikbare overgangsarchitectuur, geen eindarchitectuur. Live beoordeling en rollout moeten daarom nog niet de primaire studiofocus zijn.

---

## 7. Eerstvolgende fase: wat het product nú moet oplossen

De studio moet in de volgende bouwstap vooral deze dingen beter maken:

1. ik kan een draftprompt wijzigen
2. ik kan die op goede testbronnen draaien
3. ik zie output naast de runtime-basis
4. ik kan expliciet vastleggen of die beter, gelijk, slechter of fout is
5. ik kan die uitkomst later terugvinden per task, versie en case

Zolang dit niet stevig staat, zijn de volgende zaken **te vroeg als hoofdfocus**:

- live production review
- rollout-gates tot in detail
- runtime DB-binding
- kwaliteitsdashboard als eindlaag

---

## 8. Editor abstraction (bindend)

De studio bewerkt **taakinstructies**, niet ruwe request/payload blobs.

### Bindende scheiding

Elke bewerkbare taskversie bestaat conceptueel uit deze lagen:

1. **Taakinstructie**
   - primaire bewerklaag
   - gewone tekst
   - gericht op wat deze task moet doen

2. **Vaste regels / system instructions**
   - stabielere systeemlaag
   - zelden aangepast
   - standaard secundair of advanced

3. **Input template / mapping**
   - technische request assembly
   - placeholders, bronvelden, mappinglogica
   - niet dominant in de hoofd-editor

4. **Output contract / schema**
   - beschrijft verwachte output
   - hoort bij de task of runtime-family

5. **Model- en configlaag**
   - modelkeuze
   - temperature / response_format / andere toegestane parameters

### Bindende UI-regel

De hoofd-editor toont:

- taakinstructie
- taskdoel
- model
- contract notice
- versiecontext

De hoofd-editor toont **niet**:

- volledige request payloads
- raw placeholders als hoofdinhoud
- baseline metadata als primaire bewerklaag

### Aanscherping voor de volgende fase

De `entry_cleanup` editor is de referentie voor de volgende editorronde.

Dat betekent:

- andere edit-schermen moeten hier conceptueel naartoe convergeren
- hardcoded afwijkingen per task moeten worden afgebouwd
- gedeelde editorprimitives moeten task-compatibel worden, niet alleen `entry_cleanup`-specifiek
- waar taakverschillen echt nodig zijn, moeten die via task-metadata of config verklaard worden, niet via verborgen UI-afwijkingen

---

## 9. Task composition model

Niet elke studio-task is een volledig losse runtime prompt.

Daarom moet elke task conceptueel deze velden hebben:

- `runtime_family`
- `composition_role`: `standalone | compound_member`
- `managed_output_field`
- `affected_output_fields`

### Voorbeelden

- `entry_cleanup`
  - runtime_family: `entry_normalization`
  - composition_role: `compound_member`
  - managed_output_field: `title/body/summary_short` (compound)
- `day_narrative`
  - runtime_family: `day_journal`
  - composition_role: `compound_member`
  - managed_output_field: `narrativeText`
- `day_summary`
  - runtime_family: `day_journal`
  - composition_role: `compound_member`
  - managed_output_field: `summary`
- week/month tasks
  - runtime_family: `reflection`
  - composition_role: meestal `compound_member`

### Bindende representatieregel

Als een task onderdeel is van een gedeelde runtime-family:

- toon dat expliciet
- toon ook wat die wijziging beïnvloedt
- doe niet alsof het een volledig autonome prompt is als dat niet zo is

---

## 10. Output discipline

### Richting

Waar output gestructureerd moet zijn, is **Structured Outputs / JSON Schema** de voorkeursrichting.

### Regels

- outputtype expliciet vastleggen:
  - `text`
  - `object`
  - `list`
  - `compound`
- schema hoort bij task of runtime-family, niet als los prompthulpstuk
- JSON mode is alleen acceptabel als compat-layer of tijdelijke fallback
- task-scherm, instructie en schema mogen elkaar niet tegenspreken

### Voorbeeld

Als `day_narrative` in studio één output representeert, dan moet:

- het scherm dat eerlijk tonen
- het schema dat ondersteunen
- of expliciet zichtbaar zijn dat het onderdeel is van een compound runtime-family

---

## 11. Model policy

### Productie

- productie gebruikt **pinned model snapshots**
- geen vrije modelkeuze in runtime
- modelupgrade is een rollout-beslissing, geen gewone promptedit

### Studio

- modelkeuze in studio gebeurt via **allowlist**, niet vrije tekst
- alleen goedgekeurde modellen zijn testbaar
- modelwijziging moet zichtbaar meeversien

### Logging

Elke test run en latere runtime write moet minimaal vastleggen:

- model
- versie / snapshot
- relevante config

---

## 12. Runtime-baseline import en tijdelijke dubbele waarheid

### Huidige overgangsregel

De studio gebruikt nu een **runtime baseline import** uit code:

- code blijft runtime source-of-truth
- studio importeert een mirror naar `ai_task_versions`
- drafts starten vanuit deze runtime-basis

### Bindende regels

- runtime-baseline import mag nooit stil bestaande afwijkende live versies overschrijven
- conflicts moeten expliciet worden gerapporteerd
- baseline metadata moet zichtbaar maken:
  - `baseline_source`
  - `runtime_flow`
  - `derived_from_shared_flow`
  - `output_field`

### Doel

De studio moet een geloofwaardige live-basis tonen zonder productie al DB-driven te maken.

### Strategische aanscherping

Zolang runtime nog hardcoded is en niet versiegestuurd uit de studio leest:

- blijft testvalidatie belangrijker dan live-review tooling
- blijft compare tegen runtime-basis voldoende voor de eerstvolgende fase
- blijven live-resultaten, reviewer queues en runtime dashboards een latere laag

---

## 13. Evaluation architecture (aangescherpt)

Evaluatie gebeurt in lagen, in vaste volgorde.

### Laag 1 — Contract checks

Hard rules, bijvoorbeeld:

- `entry_cleanup` mag niet samenvatten
- `day_summary` moet compacter zijn dan `day_narrative`
- reflectiepunten mogen geen advieslaag worden
- min/max items
- schema validatie
- verboden taal / verboden meta-zinnen

### Laag 2 — Pairwise compare

Standaard menselijke vergelijking tussen:

- runtime-basis / huidige productie-uitkomst
- draft / candidate output

Labels:

- `beter`
- `gelijk`
- `slechter`
- `fout`

### Laag 3 — Evaluation result opslag

Pairwise compare en contractuitkomsten mogen niet alleen tijdelijke UI-output zijn.

Per run/case/versie moet de studio evaluatie-uitkomsten structureel kunnen opslaan, zodat zichtbaar wordt:

- welke versie beter scoort
- welke cases regressies tonen
- welke fouten terugkomen
- welke review al gedaan is

**Bindende richting:** evaluatie wordt een first-class objectlaag, niet alleen een schermactie.

### Laag 4 — Curated regression sets

Voor elke belangrijke task geleidelijk opbouwen:

- goldens
- edge cases
- noisy input
- dunne bron
- duplicate-heavy dag
- lange persoonlijke dag
- afwijkende talen / rare input

### Laag 5 — Automated graders

Pas later toevoegen.

Regels:

- nooit de enige bron van waarheid
- pas ná curated regressiesets
- alleen ondersteunend aan contract checks + human review

---

## 14. Evaluation object model (nieuwe bindende richting)

De studio heeft een expliciete evaluatie-objectlaag nodig.

Minimale richting:

- evaluatie hoort bij task
- evaluatie hoort bij taskversion
- evaluatie hoort bij testcase of testbron
- evaluatie hoort bij een specifieke run
- evaluatie kan contractmatig, handmatig en later geautomatiseerd zijn

### Minimale veldenrichting

- `task_id`
- `task_version_id`
- `test_run_id`
- `test_case_id` of bronreferentie
- `evaluator_type` (`contract`, `human`, later optioneel `auto`)
- `result_label` (`beter`, `gelijk`, `slechter`, `fout`, of contractstatus)
- `score` of compacte scorevelden waar zinvol
- `notes`
- `created_at`
- reviewer / actor waar relevant

### Waarom dit bindend is

Zonder evaluatie-objectlaag blijft de studio goed in testen, maar zwak in kwaliteitsbewijs.

---

## 15. Human review protocol

### Standaardreview

De default reviewvorm is **pairwise**:

- runtime-basis vs draft/candidate

### Labels

- `beter`
- `gelijk`
- `slechter`
- `fout`

### Verplichtingen

- note verplicht bij `slechter` of `fout`
- review gebeurt op compacte rubric, niet op los gevoel

### Rubric

Minimaal beoordelen op:

- contracttrouw
- natuurlijkheid
- helderheid
- volledigheid
- compactheid waar relevant

### Aanscherping

De reviewactie moet opslaan als bewijslaag en niet alleen in de compare-UI blijven hangen.

---

## 16. Source selection rules

Bronselectie is onderdeel van kwaliteit, niet alleen een UI-detail.

### Regels

- testdata moet representatief zijn
- default sortering: recent + bruikbaar
- fallback/lege records mogen niet dominant zijn
- noisy cases mogen zichtbaar zijn, maar duidelijk herkenbaar
- bronselectie moet compacte preview + zoek/filter ondersteunen

### Richting

Volgende fase:

- curated saved cases
- goldens
- regressiesets per task
- snelle herbruikbare testsets per taskversie

---

## 17. Version lifecycle governance

### Gewenste lifecycle

- `draft`
- `candidate`
- `approved`
- `live`
- `archived`
- optioneel `shadow`

### Governance-regels

- promote naar live alleen na voldoende evidence
- rollbackpad moet bestaan vóór runtime DB-binding
- modelwijzigingen en promptwijzigingen horen in dezelfde lifecycle-governance

### Evidence voor promote (richtlijn)

Minimaal:

- contract checks passeren
- pairwise review uitgevoerd
- relevante curated cases gecontroleerd

### Aanscherping voor huidige fase

Deze lifecycle blijft bindende richting, maar is **niet** de eerstvolgende bouwfocus. Eerst moet test- en validatiebewijs in de studio zelf stevig staan.

---

## 18. Prompt registry readiness

De studio moet compatibel blijven met een centrale prompt registry of prompt object model.

### Regels

Promptstructuur moet logisch opgesplitst blijven in:

- instruction
- system
- input template
- output schema
- config

### Verboden richting

- monolithische request blobs als enige bewerkbare eenheid
- prompttekst waarin payload assembly, placeholders en taakdoel door elkaar lopen

---

## 19. Execution-modi

1. **Single interactive call**
   - 1 task, 1 versie, 1 bron

2. **Curated batch evaluation**
   - 1 task, 1 versie, N cases

3. **Production-derived shadow batch**
   - echte bronnen, geen canonieke write

4. **Live regeneration batch**
   - gecontroleerde herberekening na rollout

### Aanscherping

Voor de volgende fase is de kernvolgorde:

- eerst single interactive goed
- daarna curated batch evaluation
- production-derived en live regeneration pas later zwaarder uitwerken

---

## 20. Prompt caching (vooruitblik)

Nog niet leidend voor implementatie, wel bindend als technische richting.

### Regels

- vaste delen vroeg in prompt
- variabele input later in prompt
- prefixstabiliteit is gewenst

### Doel

- lagere latency
- lagere kosten
- stabielere uitvoering bij herhaling

---

## 21. Runtime-koppeling en lineage

Elke latere runtime-write moet versie-lineage dragen.

Doel:

- reproduceerbaarheid
- impactanalyse
- rollback
- veilige regeneration

Minimaal te koppelen:

- `task_version`
- `requestId`
- `flowId`
- `source_type / source_record_id`
- `target_table / target_record_id`

`ai_live_generation_log` is hiervoor de structurele richting, niet alleen debug-data.

### Aanscherping

Dit blijft belangrijk, maar is **niet** de eerstvolgende prioriteit zolang runtime nog niet DB-live uit de studio leest.

---

## 22. Admin UX-principes (nieuw bindend)

AI Quality Studio is een admin-tool en mag daarom anders werken dan de eindgebruikersapp.

### Regels

- mobiel moet goed bruikbaar blijven
- desktop mag niet kunstmatig klein blijven
- fullscreen gebruik op desktop moet actief ondersteund worden
- editor, compare en review zijn productieve werkmodi en verdienen ruimte
- detailschermen mogen op grotere schermen werken met bredere layouts, kolommen of split views waar functioneel zinvol
- behoud duidelijke hiërarchie en focus; geen generieke enterprise-zwaarte

### Concreet betekent dit

- task detail en draft editor mogen op desktop breder openen dan de app-shell
- compare-views mogen naast elkaar staan op grotere schermen
- testresultaten en contractnotices mogen op desktop zichtbaar zijn zonder overmatig scrollen
- sticky action areas moeten goed werken op mobiel én desktop
- fullscreen mag gebruikt worden voor productiviteit, niet alleen voor esthetiek

### Niet doen

- admin 1-op-1 behandelen als consumentenscherm
- alles centreren in een smalle mobile-column op grote schermen
- desktop oplossen met alleen grotere marges zonder informatiearchitectuur aan te passen

---

## 23. Bekende beperkingen (huidige fase)

Niet volledig aanwezig:

- promote-to-live workflow
- rollback flow
- reviewer labeling flow in UI als persistente bewijslaag
- batch test runs / regressiesets als volwaardige productlaag
- volledige compare-ondersteuning voor alle taskkeys
- directe DB-live binding voor productie-runtime
- uniforme editor-abstraction over alle tasks heen
- volwaardige desktop/fullscreen admin-ervaring
- kwaliteitsdashboard met echte aggregatie en trendweergave

---

## 24. Learnings uit de bouwsessie (gestandaardiseerd)

1. Bewerk op **taakinstructie**, niet op payload/request blob.
2. Modelkeuze moet gecontroleerd zijn, niet vrije tekst.
3. Advanced moet gegroepeerd blijven:
   - Vaste regels
   - Outputvorm
   - Modelinstellingen
   - Technische herkomst
4. Baseline metadata is zichtbaar maar niet bewerkdominant.
5. Compound tasks moeten expliciet tonen wat ze beïnvloeden.
6. Editor, detail en test zijn verschillende modi en horen niet op één scherm gepropt.
7. Bronselectie is onderdeel van kwaliteit; slechte selectie ondermijnt evaluatie.
8. Testscherm moet editor-taal volgen:
   - runtime-basis
   - testresultaat
   - verschil met live
9. Goede studio-UX is niet alleen mobiel; adminwerk vraagt ook desktopruimte.
10. Een compare-view zonder opgeslagen oordeel is nog geen volwaardig kwaliteitsbewijs.

---

## 25. Valkuilen (expliciet)

1. Task/scherm-verwarring
2. Compound-runtime verbergen als single output
3. Dubbele waarheid tussen code en DB zonder transitieplan
4. Promptedits zonder contractguardrails
5. Alleen line-diff gebruiken als kwaliteitsbewijs
6. Te vroege automation zonder curated regressiesets
7. Product-visible debugdrift buiten admincontext
8. Runtimekoppeling zonder rollbackpad
9. Payload-editing vermommen als promptbeheer
10. Een dashboard bouwen voordat evaluatie als dataset bestaat
11. Desktop “oplossen” door alleen containerbreedte aan te passen zonder workflowverbetering

---

## 26. Prioriteitenvolgorde (bindend advies)

### Fase A — Nu eerst bouwen

1. **Testen en valideren binnen de tool als primaire lus**
   - draft wijzigen
   - bron kiezen
   - run uitvoeren
   - output vergelijken met runtime-basis
   - expliciet oordeel vastleggen

2. **Evaluation objectlaag toevoegen**
   - contractresultaten + menselijke compare-uitkomst opslaan per run/case/versie
   - vergelijking niet alleen tonen, maar ook bewaren

3. **Editor abstraction gelijktrekken over tasks heen**
   - `entry_cleanup` als referentie
   - hardcoded afwijkingen afbouwen
   - gedeelde edit-patterns en task-compatibele configuratie verstevigen

4. **Admin UX voor desktop/fullscreen verbeteren**
   - bredere detail/editor layouts
   - compare beter naast elkaar op groot scherm
   - mobiel niet breken

### Fase B — Daarna uitbreiden

5. **Curated testsets / regressiesets per task**
   - saved cases
   - goldens
   - edge/noisy cases
   - batch evals

2. **Version governance verder dichtzetten**
   - candidate / approved / live beter afbakenen
   - promote-evidence expliciet tonen

### Fase C — Pas daarna

7. **Runtime lineage en DB-live binding verder uitwerken**
   - pas na sterke test/evidence-lus

2. **Live testen/resultaten/beoordelingen toevoegen**
   - pas wanneer runtime daadwerkelijk zinnig koppelbaar is aan task versions uit de studio

### Fase D — Als laatste

9. **Kwaliteitsdashboard bouwen**
   - pas bouwen wanneer er echte evaluatiedata, trends en aggregaties zijn
   - dashboard is eindlaag, niet startpunt

---

## 27. Concrete next steps om nu te bouwen

### Stap 1 — Compare en validatie echt afmaken

Doel:

- in de studio aantoonbaar kunnen zeggen of een draft beter is dan de basis

Bouwen:

- compare-view afronden als primaire werkmodus
- expliciete reviewactie inbouwen: `beter`, `gelijk`, `slechter`, `fout`
- verplichte notitie bij `slechter` of `fout`
- contract checks zichtbaar in dezelfde evaluatieflow

Nog niet bouwen:

- zware live dashboards
- rollout automation

### Stap 2 — Evaluation results persistent maken

Doel:

- evaluatie wordt bewijslaag

Bouwen:

- opslagmodel voor evaluatie-uitkomsten
- koppeling aan task, versie, run en case
- historisch terugvindbare beoordelingen
- simpele aggregaties per versie: pass/fail, beter/gelijk/slechter/fout

Nog niet bouwen:

- complexe auto graders
- brede analyticslaag

### Stap 3 — Editors gelijktrekken

Doel:

- `entry_cleanup` niet als uitzondering laten bestaan

Bouwen:

- audit van alle bestaande prompt-editschermen
- bepalen wat nog hardcoded of task-specifiek is
- gedeelde editor-secties harmoniseren:
  - taakinstructie
  - system/advanced
  - input mapping
  - output contract
  - model/config
- task-metadata gebruiken waar taakverschillen echt bestaan

Nog niet bouwen:

- vrije payload editors
- raw JSON blob editing als hoofdmodus

### Stap 4 — Admin desktop/fullscreen UX verbeteren

Doel:

- AIQS wordt op desktop daadwerkelijk prettiger en sneller om mee te werken

Bouwen:

- bredere layoutregels voor admin
- detail/editor/test schermen geschikt maken voor grotere schermen
- split of multi-column waar compare dat ondersteunt
- sticky action footer aanpassen waar nodig voor desktop
- fullscreen als ondersteunde werkmodus behandelen

Nog niet bouwen:

- designpolish zonder workflowverbetering

### Stap 5 — Curated testsets en batch evaluatie

Doel:

- minder handmatig dezelfde cases zoeken

Bouwen:

- saved cases
- golden/edge/noisy labels
- N-case batch runs per task/version
- regressie-indicatie op dezelfde set

Nog niet bouwen:

- live beoordelingsqueues op productie-output

### Stap 6 — Pas later runtime/live en dashboard

Doel:

- pas toevoegen wanneer de onderlaag klopt

Later bouwen:

- runtime-koppeling aan echte studio versions
- live result reviews
- reviewer queues op productie-output
- kwaliteitstrends over live verkeer
- dashboard bovenop echte evaluatiedata

---

## 28. Samenvatting

AI Quality Studio is nu een werkende admin-hardening basis met:

- taskbeheer
- baseline import
- drafting
- single-run testen
- compare

De volgende volwassen stap is **niet** meer UI-volume of direct live runtimebeheer.

De volgende volwassen stap is:

- aantoonbaar testen in de tool
- evaluatie-uitkomsten opslaan als bewijs
- editors gelijktrekken
- admin desktop/fullscreen bruikbaar maken
- daarna pas regressiesets, lifecycle-verdieping, runtime-lineage en live-kwaliteit

Zo blijft de studio:

- contractvast
- reproduceerbaar
- beheersbaar voor admins
- eerlijk over wat nu al werkt en wat nog niet
- gericht op echte kwaliteitsverbetering in plaats van tool-uitbreiding

---

## 29. Recente regressie-learnings (bindend)

Doel: voorkomen dat dezelfde regressies terugkomen in AIQS editor- en admin-access flows.

### 29.1 Access-state mag geen netwerkfout als “geen toegang” framen

Regel:

- `adminAccess=false` mag alleen bij expliciete auth-codes (`AUTH_UNAUTHORIZED` of `AUTH_MISSING`).
- Generieke load/invoke/netwerkfouten blijven een laadfout, geen autorisatie-uitkomst.

Waarom:

- anders ontstaat false-negative “Geen toegang” voor echte allowlisted admins.

### 29.2 Allowlist parsing moet robuust zijn voor gequote env-waarden

Regel:

- allowlist parsing in edge functions moet omringende quotes strippen op bron- én itemniveau.

Waarom:

- lokale `.env.local` waarden staan vaak als `"uuid"`; zonder quote-strip faalt user-id match en krijg je onterechte `Forbidden`.

### 29.3 Prompt-editor normalisatie moet editor-overstijgend consistent zijn

Regel:

- newline/paragraph normalisatie moet identiek blijven tussen visual editor en sectieparsering.
- sectiewissels mogen geen “lege regel migratie” veroorzaken.

Waarom:

- inconsistente representatie (lege regels direct toevoegen vs buffered toepassen) veroorzaakt drift: regel weg in editor A, lege regel terug in editor B.

### 29.4 UI-regel voor deze editor

Regel:

- “Gebruikte tokens” hulpblok is verwijderd uit de editor-surface.
- editor-surface blijft licht/thematisch leesbaar in dark mode.

Waarom:

- minder visuele ruis, minder dubbelheid, en stabiel contrast voor tekstbewerking.

---

## Cline Workflow Afspraken

---
title: Cline workflow
audience: agent
doc_type: workflow
source_role: operational
visual_profile: plain
upload_bundle: 80-budio-agent-workflow-and-docs-tooling.md
---

# Cline workflow (operationeel)

## Doel

Operationele werkwijze voor werken met ChatGPT Projects + Cline, zonder productwaarheid te vervuilen.

## Execution OS (compact)

- Voor harde MVP-scope en uitvoerdiscipline: gebruik `.clinerules/workflows/budio-cline-execution-os.md`.
- Deze workflow blijft aanvullend en vervangt `AGENTS.md` of `docs/project/**` niet.

## Rolverdeling

- **ChatGPT Projects**: strategie, review en promptontwerp buiten repo-uitvoering.
- **Cline in VS Code**: repo-analyse, plan, wijzigingen, verify en commit.

## Bronnenvolgorde

1. `docs/project/README.md`
2. `AGENTS.md`
3. taakrelevante canonieke handmatige docs in `docs/project/**` (excl. `docs/project/generated/**` en `docs/project/archive/**`)
4. bij niet-triviale uitvoertaken: `docs/project/open-points.md` + relevante taskfile in `docs/project/25-tasks/**`
5. relevante skill(s) in `.agents/skills/**` wanneer de taak daar expliciet onder valt
6. `docs/dev/active-context.md` alleen wanneer recente sessiecontext of WIP relevant is

Regels:

- `docs/project/**` = canonieke projectwaarheid.
- `docs/project/25-tasks/**` = operationele taaklaag voor de huidige fase.
- `docs/dev/**` = workflowafspraken.
- `docs/project/generated/**` en `docs/design/generated/**` = generated output; geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- `docs/upload/chatgpt-project-context.md` is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects.
- `docs/upload/**` = generated uploadartefacten; geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- Bij spanning tussen generated docs en canonieke docs zijn canonieke docs leidend.
- Bij spanning tussen `docs/upload/**` en canonieke docs zijn canonieke docs leidend.
- Geen "lees alles altijd"-regel; lees alleen taakrelevante bronnen.
- Scope-routing is context-first:
  - default-context: Budio app + AIQS
  - bepaal scope via intentie/formulering (doel, doelgroep, omgeving, planningimpact), niet alleen op keyword-match
  - routeer naar Jarvis/plugin-spoor zodra de intentie daar logisch op wijst, ook zonder expliciete termen
- Twijfelprotocol:
  - hoge-impact twijfel (planning, roadmap, idea/task-classificatie): eerst korte afstemming met de gebruiker
  - lage-impact twijfel: redelijke aanname doen en die expliciet labelen in plan/doc
- Strategie/planning wijzig je nooit stilzwijgend:
  - geen mutaties in `docs/project/10-strategy/**` of `docs/project/20-planning/**` zonder expliciete user-approval of expliciet overlegbesluit in dezelfde sessie
  - bij koerswijziging altijd eerst voorstel + impact + advies, daarna pas mutatie
- Voor Stitch-werk: gebruik `docs/dev/stitch-workflow.md` als operationele workflowbron.
- Voor idee-capture/promotie: gebruik `docs/dev/idea-lifecycle-workflow.md`.
- Voor taakaanmaak en statusflow: gebruik `docs/dev/task-lifecycle-workflow.md`.

## Design-implementatie guardrails (operationeel)

- `theme/tokens.ts` is de enige tokenbron; afgeleide configbestanden zijn niet leidend.
- Gebruik eerst bestaande shared primitives/patronen; voeg alleen een nieuw shared component toe bij een echt herhaalbaar patroon over meerdere schermen.
- UI assembly is scaffold-first: check eerst `components/ui/screen-scaffolds.tsx` en daarna pas screen-lokale opbouw.
- Volg bij UI-keuzes de beslisboom in `docs/dev/ui-assembly-decision-tree.md`.
- Stop geen screen-specifieke designregels in generieke shared primitives.
- `design_refs/1.2.1/**` zijn bindend per scherm; `.md` notes tellen mee naast `code.html` en `screen.png`.
- Verify stylingwerk altijd in light én dark mode tegen relevante design refs voordat het “klaar” is.

## Repo-eigen Memory Bank workflow

- Onze memory bank is een **workflowlaag**, geen extra waarheidshiërarchie.
- Verdeling:
  - canonieke waarheid: `docs/project/**`
  - always-on gedrag: `AGENTS.md`
  - domeinspecifieke herhaalpatronen: `.agents/skills/**`
  - operationele workflow: `docs/dev/cline-workflow.md` + `docs/dev/memory-bank.md`
  - taakworkflow: `docs/dev/task-lifecycle-workflow.md`
  - tijdelijke sessiecontext: `docs/dev/active-context.md`
  - statuswaarheid: `docs/project/current-status.md`
  - echte gaps/onzekerheden: `docs/project/open-points.md`
  - operationele taken: `docs/project/25-tasks/**`

## Active context tussen sessies

- `docs/dev/active-context.md` is een lichte brug tussen Cline-sessies.
- Gebruik actief bij:
  - non-triviale taken
  - onderbroken sessies
  - multi-file werk
  - taken waar recente learnings/WIP of docs-updates relevant zijn
- Meestal niet nodig bij:
  - kleine, volledig afgebakende fixes zonder sessieafhankelijkheid

Regels:

- `active-context.md` is niet canoniek en niet de statuswaarheid.
- Verwijs naar canonieke docs in plaats van inhoud te kopiëren.
- Promoveer alleen stabiele learnings naar `AGENTS.md`, skills of `docs/dev/**`.

## Beslisregels per laag

- canonieke waarheid → `docs/project/**`
- operationele workflow → `docs/dev/**`
- always-on gedrag → `AGENTS.md`
- taak-/domeinspecifieke herhaalpatronen → skills
- tijdelijke sessiecontext → `docs/dev/active-context.md`
- statusrealiteit (bewijsbaar) → `docs/project/current-status.md`
- echte gaps/onzekerheden → `docs/project/open-points.md`
- operationele uitvoeringstaken → `docs/project/25-tasks/**`

## Wanneer Plan mode

Gebruik Plan mode bij:

- bugs met onduidelijke oorzaak
- multi-file wijzigingen
- migraties
- taken met duidelijke scope-/architectuurrisico’s

Plan mode heft de taskfile-verplichting niet op:

- begin bij inhoudelijke repo-taken altijd met een bestaande of nieuw aangemaakte taskfile
- een inhoudelijk plan zonder concrete taskfile geldt als onvolledig
- noem in elk plan expliciet `Task`, `Task file` en `Status`

Extra repo-regel voor Plan Mode:

- gebruik in Plan Mode eerst een **bestaande** taskfile wanneer daar een duidelijke match voor is
- maak in Plan Mode bij duidelijke nieuwe scope automatisch een nieuwe task aan vanuit `_template.md`
- vraag alleen bij echte twijfel: meerdere plausibele tasks, onduidelijke scope-routing of onduidelijk task-vs-idea
- `Taskflow summary` mag dus ook een nieuw aangemaakte task noemen

## Wanneer Act mode

Gebruik Act mode voor:

- gerichte implementatie
- kleine fixes met duidelijke file-scope
- verify en afronding

## Promptpatronen

### Uitvoerblokken

- Cline/Codex bepaalt bij elke inhoudelijke taak zelf de efficiëntste blokken op basis van huidige agent/model, taaktype, risico, dirty worktree, verificatiekosten en afhankelijkheden.
- Vraag de gebruiker niet om fasering tenzij er een echte product-, planning- of architectuurtradeoff is.
- Default: preflight/context/taskflow -> kleinste bronwijziging -> gerichte verify -> docs/taskstatus/bundel afronden.
- Voor grotere docs/roadmaptaken: research -> template/workflow -> primair artefact -> bundel -> verify.

### Kleine fixes

- Houd input compact: doel + scope + files.
- Werk cheap-first: kleinste werkende wijziging.
- Geen scope-uitbreiding tijdens implementatie.

### Multi-file werk

- Begin met expliciete todo/checklist.
- Maak of vind vóór het plan eerst de taskfile.
- Splits in: lezen → plan → edits → verify.
- Werk per duidelijke milestone en update checklist tussendoor.
- Behandel het laatst besproken subprobleem nooit automatisch als de nieuwe hoofdscope.
- Leg bij niet-triviale taken het **oorspronkelijke plan / afgesproken scope** expliciet vast in de taskfile en houd die sectie stabiel tijdens uitvoering.
- Leg expliciete user-details met latere uitvoer- of reviewwaarde vast onder een aparte requirement-sectie in de taskfile; alleen een samenvatting is niet genoeg.
- Maak onderscheid tussen review-uitkomst en requirement-uitkomst: de taskfile moet niet alleen de conclusie bevatten, maar ook de concrete requirement-details waarop die conclusie rust.
- Als de gebruiker een bestaand uitgebreid plan of detailblok expliciet in de taskfile wil terugzien, moet dat bronblok als eigen sectie behouden blijven; een statusreview of samenvatting mag dat niet vervangen.
- Leg latere regressies, polish of user-correcties vast als **toegevoegde verbeteringen tijdens uitvoering**, tenzij de gebruiker expliciet de hoofdscope wijzigt.
- Rond een taak pas af na een expliciete **plan reconciliation**: oorspronkelijk plan, later toegevoegd werk en resterende open punten moeten allemaal zichtbaar zijn.

## Verify-regel

- Voor relevante codewijzigingen: `npm run lint` en `npm run typecheck`.
- Voor canonieke docs-wijzigingen: ook `npm run docs:bundle` en `npm run docs:bundle:verify`.
- Draai `npm run docs:bundle` en `npm run docs:bundle:verify` altijd sequentieel, nooit parallel.
- Voor taskstatuswijzigingen of verplaatsing naar `done/`: ook `npm run docs:bundle` en `npm run docs:bundle:verify`.
- Voor inhoudelijke agentuitvoering (plan/research/bug/implementatie): ook `npm run taskflow:verify`.
- Commit alleen na geslaagde verify.

## ChatGPT Projects uploaddiscipline

- Dit is een uploadrichtlijn voor ChatGPT Projects, geen repo-uitvoerregel.
- Gebruik na de bootstrap alleen de kleinste relevante subset uit `docs/upload/00-budio-upload-manifest.md`.
- Upload niet standaard de volledige set.
- Bundelscript zet uploadbestanden klaar voor handmatige upload; upload naar ChatGPT gebeurt nu nog niet automatisch.
- `docs/upload/**` wordt beheerd als maximaal 10 uploadbestanden totaal; upload per ChatGPT Project-context alleen de kleinste relevante subset uit het manifest.
- Audience-metadata en Budio Terminal-regels staan in `docs/project/00-docs-governance/README.md`.
- Developer docs-tooling en Obsidian vault setup staan in `docs/setup/developer-docs-environment.md`.
- Budgetpolicy in ChatGPT Projects blijft licht; token/cost/runtime-discipline hoort in repo en AI-governance-docs.
- Session/multi-user/OpenAI-contextbeleid is nu alleen als later idee vastgelegd.

## VS Code plugin toepassen (verplicht)

- Bij wijzigingen in `tools/budio-workspace-vscode/**` altijd de plugin opnieuw toepassen op de normale VS Code-workspace.
- Standaardcommando in `tools/budio-workspace-vscode/`:
  - `npm run apply:workspace`
- Dit voert build + vsix package + lokale install + VS Code refresh uit in één flow.

## Supabase migratie-uitvoering (verplicht)

- Bij wijzigingen in `supabase/migrations/**` voert Cline/Codex de lokale DB-stap standaard zelf uit: `npx supabase db push --local` (of `npx supabase db reset` wanneer nodig).
- Ook wanneer een taak leunt op een **al bestaande maar lokaal nog niet toegepaste** migratie (bijv. nieuwe tabel/kolom ontbreekt in runtime), voert Cline/Codex alsnog direct `npx supabase db push --local` uit.
- Vraag deze stap niet terug aan de gebruiker als de CLI hem veilig non-interactief kan uitvoeren.

## Dev-server policy

- Start geen langlopende dev servers tenzij expliciet gevraagd.
- Gebruik voor deze repo `http://localhost:8081` als standaard lokale web dev/smoke-test target wanneer geen andere lokale webtarget is opgegeven.
- Gebruik geen `CI=1` prefix voor lokale dev-server commando’s.
- Als live server nodig is: geef alleen het handmatige commando aan de gebruiker.

## Repo-local Codex MCP (local AI development)

Gebruik voor deze repo standaard de lokale MCP-config in `.codex/config.toml`.

Default (veilig):

- `supabase_local` actief
- `supabase_remote_ro` uit

Switchflow:

- local activeren: `node scripts/codex-mcp-target.mjs local`
- remote/prod read-only activeren: `node scripts/codex-mcp-target.mjs remote-ro --project-ref <project_ref>`

Gebruik `supabase_remote_ro` alleen wanneer nodig voor:

- productiegerichte read-only diagnose
- metadata/log/context-checks die lokaal niet beschikbaar zijn

Gebruik `supabase_remote_ro` niet voor:

- schema- of datawrites
- reguliere lokale ontwikkeliteraties
- bulk inspecties als local/dev voldoende is

Agent-default:

- bij twijfel altijd `supabase_local`
- na remote-ro checks altijd terugzetten naar local

Voor productiebug-onderzoek:

- volg `docs/dev/production-bug-investigation-workflow.md`
- gebruik remote/prod alleen read-only voor logs, metadata en diagnosecontext
- leg timestamp, route en deployment/logbron vast zodra je productiebevindingen claimt

## Lessen uit sessies (stabiel, herbruikbaar)

- Bevestig bij onderbroken sessies altijd eerst de actuele file state (small read/diff) vóór nieuwe patches.
- Houd productwaarheid, toolingafspraken en uploadartefacten strikt gescheiden.
- Verhoog status/docs alleen met hard bewijs uit code, runtime of canonieke docs.
- Verwerk workflowlearnings in `AGENTS.md` of `docs/dev/**`, niet in productinhoud.

## Valkuilen om te vermijden

- Verder patchen op oude context na interrupties.
- Te brede patches zonder eerst klein te valideren waar de wijziging exact landt.
- `docs/upload/**` gebruiken als bron van waarheid.
- Productdocs vullen met operationele toolinguitleg.
- “Klaar” melden zonder volledige verify.

---

## README

---
title: Planning hub
audience: human
doc_type: hub
source_role: operational
visual_profile: budio-terminal
upload_bundle: 10-budio-core-product-and-planning.md
---

# Planning hub

## Doel

Navigatiehub voor actieve uitvoeringsfocus, roadmap en afwijkingsbesluiten.

## Kernnotities

- Roadmap fases
- Active phase
- Now / Next / Later
- Budio Workspace plugin focus
- April 2026 ideeënprioritering en learning loop
- Post-basis 6-maandenroadmap
- Deviations and decisions

## Verbonden lagen

- Strategy hub
- Research hub
- Ideas workspace
- Project hub

---

## Roadmap Phases

# Roadmap phases (lean)

## Doel

Eén overzicht van projectfases met status, zonder detail-overload.

## Obsidian links

- Planning hub
- Active phase
- Now / Next / Later
- Deviations and decisions
- Current status
- Open points

## Fasekaart

| Fase | Doel | Status |
| --- | --- | --- |
| Fase 1 (kernlus) | capture -> dagboeklaag -> reflecties bouwen | afgerond als basis |
| Fase 1.2 (hardening) | stabiliteit, kwaliteit, UX, vertrouwen, beta-readiness | afgerond in delen / blijft onderhoudsspoor |
| Fase 2A (Jarvis intern) | founder-only local-first intelligence in app + workspace | idee/research lane (geen actieve bouwtaak) |
| Fase 2B (Knowledge Hub + AIQS) | source ingest, grounding, citations en quality loop | later na Fase 3 (high-prio idee) |
| Fase 3 (publieke wedge) | builders/podcasters: kennisgestuurde outputworkflows | next (uitvoeringsprioriteit boven 2B) |
| Fase 4 (opschaling) | bredere productisering/commerciële lagen | later |

## Regel

- Alleen `planning/20-active-phase.md` bepaalt wat nu actief focusgebied is.

---

## Active Phase

# Active phase (uitvoeringsfocus)

## Actieve fase

Dual active planning met wijzigingscontrole:

- Plan A (primair): huidige fase-afspraken met AIQS-basis eerst
- Plan B (secundair): Jarvis research-lane, maximaal 1 dag per week

## Doel van deze fase

1. Plan A primair uitvoeren: AIQS-basis en lopende faseafspraken afronden met bewijs.
2. Plan B beperkt uitvoeren: Jarvis internal-only als researchspoor (idee/epic-candidate, geen bouwtaak).
3. Knowledge Hub hoog op de roadmap houden als epic-candidate, maar niet als actieve uitvoeringsscope in Q2 2026.
4. Fase 3 krijgt uitvoeringsprioriteit boven Fase 2B.
5. Strategische/planningswijzigingen alleen doorvoeren na expliciete user-approval of expliciet overlegbesluit.

## Korte samenvatting van deze maand

De oorspronkelijke fasefocus blijft primair actief (AIQS-basis en lopende betrouwbaarheidstaken).
Jarvis draait parallel als gecontroleerd intern researchspoor met harde capaciteitlimiet.
Knowledge Hub blijft een high-prio richting, maar staat gepland voor na dit kwartaal.

## Obsidian links

- Planning hub
- Roadmap phases
- Now / Next / Later
- Budio Workspace plugin focus
- Deviations and decisions
- Current status
- Open points
- Strategy hub
- Ideas workspace

## In focus (Now)

- Plan A (primair):
  - AIQS-basis afronden (stabiliteit, logging/quality governance en bestaande faseafspraken)
  - 1.2B/1.2E afronding als bewijsgedreven onderhoudsspoor
  - Budio Workspace plugin inzetten voor dagelijkse focus op bestaande open AIQS- en hardeningtaken
- Plan B (secondary lane):
  - Jarvis internal-only research in app + workspace (idee/epic-candidate)
  - harde capaciteitslimiet: maximaal 1 dag per week
  - promotie naar bouwtaak pas na expliciet besluit

## Niet in focus (nu niet trekken)

- Knowledge Hub als actieve build-scope in Q2 2026.
- Jarvis publiek uitrollen als productfeature.
- Marketingpositionering van Jarvis richting eindgebruikers.
- Teams, Business/Private en usage billing als primaire fasefocus.
- Scheduler/autopost/multi-channel publishing buiten builder/podcast validatie.
- Research behandelen alsof het automatisch runtime-realiteit is zonder bewijs.

## Flexibele afwijkingsregel

- Kleine afwijkingen met lage impact mogen direct, maar moeten achteraf in `planning/40-deviations-and-decisions.md`.
- Structurele afwijkingen eerst als besluit/deviation vastleggen, daarna active-phase updaten.

## Bewijsregel

- Claims over “gereed” alleen met code- of runtimebewijs.
- `current-status.md` blijft leidend voor code-realiteit.
- `open-points.md` blijft leidend voor open gaten en onzekerheden.

---

## Now Next Later

---
title: Now Next Later
audience: human
doc_type: planning
source_role: operational
visual_profile: budio-terminal
upload_bundle: 10-budio-core-product-and-planning.md
---

# Now / Next / Later

## Doel

Lean focusbord voor kanban-achtige planning zonder overgedetailleerde sprintadministratie.

```text
┌──────────────────────────────────────────────────────────────┐
│ BUDIO PLANNING RADAR                                         │
├───────────────┬──────────────────────────────────────────────┤
│ NOW           │ bewijs, basis, AIQS, lopende fase            │
│ NEXT          │ builder/podcast wedge + Knowledge Hub prep   │
│ LATER         │ Jarvis public, Pro, billing, scheduler       │
└───────────────┴──────────────────────────────────────────────┘
```

```mermaid
flowchart LR
  Now[Now: basis bewijzen] --> Next[Next: wedge verdiepen]
  Next --> Later[Later: opschalen na bewijs]
  Parking[Parking lot] --> Now
  Parking -. alleen na besluit .-> Next
```

## Obsidian links

- Planning hub
- Active phase
- Budio Workspace plugin focus
- Deviations and decisions
- Current status
- Open points
- Ideas workspace

## Now

- Plan A (primair): AIQS-basis en lopende faseafspraken afronden met bewijs.
- 1.2B en 1.2E afronding als onderhoudsspoor binnen de huidige fase.
- Plan B (secondary): Jarvis internal-only researchlane als idee/epic-candidate (geen bouwtaak), max 1 dag per week.
- Budio Workspace plugin gebruiken als dagelijkse uitvoeringslaag met prioriteit op Plan A.

## Next

- Fase 3 builders/podcasters uitvoeren als eerstvolgende prioriteit.
- Knowledge Hub (hoog-prio) inhoudelijk voorbereiden als epic-candidate voor fase na Fase 3.
- Scope en evaluatiecriteria voor Knowledge Hub + AIQS concretiseren (grounding/citations/relevance) zonder taakpromotie in Q2.
- Competitor benchmark sprint (Wispr Flow + NotebookLM) plannen als researchspoor na AIQS-live (harde gate, geen `Now`-bouwscope).
- Jarvis interne workflowuitbreiding alleen binnen afgesproken researchcapaciteit.

## Later

- Mogelijke externalisatie van Jarvis pas na expliciet strategisch besluit.
- Verdere productisering van Knowledge Hub + AIQS als brede kennisbanklaag.
- Brede Pro-laag, Business/Private en commerciële operatie opschalen op basis van bewijs.
- Scheduler/autopost pas oppakken als builder/podcast wedge bewezen is.

## Parking lot

- Nieuwe ideeën eerst kort in `docs/project/40-ideas/00-ideas-inbox.md`.

---

## Deviations And Decisions

# Deviations and decisions

## Doel

Logboek van bewuste afwijkingen op actieve fase/planning, zodat flexibiliteit traceerbaar blijft.

## Obsidian links

- Planning hub
- Active phase
- Now / Next / Later
- Current status
- Open points
- Strategy hub

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

---

## Budio Workspace Plugin Focus

# Budio Workspace plugin focus (gesplitste strategie)

## Doel

De Budio Workspace plugin expliciet inzetten als actief werkspoor voor dual active planning, met Plan A (AIQS-basis) als hoofdfocus en Plan B (Jarvis researchlane) als begrensde nevenbaan.

## Rol in de huidige fase

De plugin is in deze fase zowel operationele toolinglaag als internal Jarvis-experimentruimte.
Het is geen nieuwe productwaarheid en vervangt de canonieke projectdocs niet.

Wat de plugin nu moet ondersteunen:

- duidelijk overzicht van open/in-progress/done werk
- snelle verwijzing van planning naar concrete taakuitvoering
- minder context-switching tussen planning, taken en uitvoering
- voorspelbare workflow voor prioritering en voortgang
- founder-only Jarvis workflows voor softwareplanning, productbouw en podcastwerk

## Afbakening en guardrails

- Geen runtime- of deploykoppeling met Budio app, Supabase of productiepad.
- Jarvis blijft internal-only; geen publieke feature-uitrol vanuit pluginwerk.
- Geen onbegrensde verbreding naar brede Pro-, Business- of Private-roadmap.
- Geen pricing, usage billing, credits of top-ups als primaire pluginfocus.
- Research en idee-docs blijven richtinggevend; niet automatisch canonieke productwaarheid.

## Now / Next / Later (plugin)

### Now

- Plugin inzetten als dagelijkse focuslaag bovenop `docs/project/25-tasks/**`.
- Board/list/workflow prioriteren op Plan A-taken (AIQS-basis + lopende faseafspraken).
- Jarvis-werk expliciet begrenzen als researchlane (max 1 dag/week).
- Knowledge Hub alleen voorbereiden als roadmap-input, niet als actieve Q2-build.

### Next

- Jarvis uitbreiden als founder-assistive laag voor planning/podcast/builder flows.
- AI alleen als assistive laag (suggesties), niet als autonome planningswaarheid.
- Start actieve Knowledge Hub-uitvoering (source ingest/citations) vanaf volgend kwartaal.

### Later

- Verdere intelligente workspace-automatisering pas na bewijs op huidige fase.
- Grotere uitbreidingen (bredere orkestratie, diepe AI-flowkoppeling) pas na expliciete herprioritering.

## Relatie met actieve fase

De plugin is ondersteunend aan de gesplitste fase-doelen:

1. Plan A primair uitvoeren (AIQS-basis)
2. Jarvis researchlane gecontroleerd en begrensd uitvoeren
3. Knowledge Hub als next-quarter high-prio traject voorbereiden

## Obsidian links

- Planning hub
- Active phase
- Now / Next / Later
- Deviations and decisions
- Tasks hub
- Open points

---

## April 2026 Ideeen Prioritering En Learning Loop

# April 2026 — Ideeënprioritering, roadmap en learning loop

> Noot (2026-04-20): deze prioritering blijft als historische onderbouwing bestaan, maar de actieve roadmap is formeel herijkt naar de gesplitste strategie (`Jarvis` internal-only + `Knowledge Hub + AIQS` publiek-relevant). Raadpleeg hiervoor primair `20-active-phase.md`, `30-now-next-later.md` en `10-roadmap-phases.md`.

## Doel

Deze notitie vertaalt de april-2026 ideeënlijst naar een uitvoerbare, scopebewuste roadmap die past binnen de huidige productkaders:

- capture-first
- dagboeklaag centraal
- evidence-first iteratie
- geen verbreding naar brede assistent/chat/agent in de huidige fase

## Besliscriteria

Per idee zijn twee scores toegekend op schaal 1-5:

- **MVP-waarde**: essentieel voor eerste lancering van Budio Vandaag?
- **Strategische fit**: draagt het direct bij aan builder-onafhankelijkheid, brongetrouwe contentcreatie en een houdbaar verdienmodel?

## Prioritering per idee

| Idee                                | MVP-waarde | Strategische fit | Categorie                           | Korte motivatie                                                           | Impact op huidige roadmap                           |
| ----------------------------------- | ---------- | ---------------- | ----------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| Momentopnames en transcriptie       | 5          | 5                | Core Roadmap (Nu)                   | Kern van de productbelofte: snel vastleggen en brongetrouw verwerken.     | Blijft P1 in 1.2B outputkwaliteit.                  |
| Multimodale bijlagen                | 2          | 4                | Future Expansion (Later)            | Waardevol voor rijkere context, maar te veel extra complexiteit voor MVP. | Pas na stabiele kernflow.                           |
| Swipe-navigatie                     | 4          | 4                | Core Roadmap (Nu)                   | Versterkt rustig teruglezen over momenten/dagen/weken/maanden.            | UX-polish binnen huidige hardening.                 |
| Walkthrough-gids                    | 3          | 3                | Future Expansion (Later)            | Nuttig voor onboarding, niet kritisch voor kernwaarde.                    | Alleen oppakken bij aantoonbare onboarding-frictie. |
| Leren van correcties (diffs)        | 4          | 5                | Core Roadmap (Nu)                   | Bouwt een kwaliteitsflywheel op basis van echte correcties.               | Nu als admin-governed learning loop via AIQS.       |
| To-do lijst integratie              | 1          | 2                | Non-Strategic                       | Trekt richting agenda/reminder-product i.p.v. dagboekmachine.             | Nu niet meenemen; scope-creep risico.               |
| Historisch geheugen (Neocortex/HTM) | 1          | 3                | Internal Learning & Experimentation | Interessant R&D-spoor, maar niet nodig voor MVP-bewijs.                   | Alleen intern experimenteren.                       |
| Themadetectie en categorisering     | 2          | 4                | Future Expansion (Later)            | Sterk voor archiefstructuur, maar geen launch-noodzaak.                   | Post-MVP verrijkingslaag.                           |
| Automatische tagging                | 2          | 4                | Future Expansion (Later)            | Verhoogt vindbaarheid en hergebruik, niet kern voor eerste release.       | Later bovenop stabiele dagboeklaag.                 |
| Relatie- en profielanalyse          | 1          | 2                | Non-Strategic                       | Stuurt richting personal CRM/life graph buiten huidige claim.             | Parkeren.                                           |
| Datumlogica verbetering             | 4          | 5                | Core Roadmap (Nu)                   | Essentieel voor brongetrouwe tijdsinterpretatie in dag- en reflectielaag. | Hoort direct in 1.2B kwaliteitsset.                 |
| Lokaal LLM (privacy)                | 2          | 3                | Internal Learning & Experimentation | Strategisch interessant, maar technisch zwaar voor huidige fase.          | Alleen intern op beperkte subtaken.                 |
| Cinematic podcast generatie         | 1          | 4                | Future Expansion (Later)            | Sterk voor later creator-spoor, maar buiten huidige MVP-kern.             | Pas na bewezen review-first outputbrug.             |
| Social Media Agent                  | 1          | 3                | Future Expansion (Later)            | Als volledige agent te breed; als draft-assist later mogelijk.            | Later, eerst review-first drafts zonder autopost.   |
| Stijl-analyse (tweede brein)        | 2          | 4                | Future Expansion (Later)            | Interessant voor authenticiteit in output, niet noodzakelijk voor launch. | Later als outputverrijking.                         |
| Fotogeneratie templates             | 1          | 3                | Future Expansion (Later)            | Zinvol na bewezen output/publicatieflow, niet eerder.                     | Lage prioriteit in huidige fase.                    |
| AI Quality Studio                   | 4          | 5                | Core Roadmap (Nu)                   | Cruciale admin-only kwaliteits- en governance-laag.                       | Verdiepen voor compare/evaluatie/traceability.      |
| Business-variant voor creatieven    | 1          | 4                | Future Expansion (Later)            | Interessante productvariant na bewezen founder- en creator-wedge.         | Later productspoor, niet nu.                        |
| Token-verdienmodel                  | 4          | 5                | Core Roadmap (Nu)                   | Financiële onafhankelijkheid vraagt directe usage- en kostenmeting.       | Nu metering, pricing/tiering pas later live.        |

## Categorie-overzicht

### Core Roadmap (Nu)

1. Momentopnames en transcriptie
2. Swipe-navigatie
3. Leren van correcties (diffs)
4. Datumlogica verbetering
5. AI Quality Studio
6. Token-verdienmodel (minimaal als interne meteringlaag)

### Internal Learning & Experimentation

1. Historisch geheugen (Neocortex/HTM)
2. Lokaal LLM (privacy)

### Future Expansion (Later)

1. Multimodale bijlagen
2. Walkthrough-gids
3. Themadetectie en categorisering
4. Automatische tagging
5. Cinematic podcast generatie
6. Social Media Agent (eerst als draft-assist)
7. Stijl-analyse
8. Fotogeneratie templates
9. Business-variant voor creatieven

### Non-Strategic

1. To-do lijst integratie
2. Relatie- en profielanalyse

## Vernieuwd roadmap-overzicht

### Fase A — Nu: consumer beta hardening + meetbare betrouwbaarheid

Doel: kernlus betrouwbaar, brongetrouw en kosteninzichtelijk maken.

- transcriptie-hardening
- datumlogica correctheid
- correctie-diff vastlegging
- swipe-navigatie polish
- AIQS compare/evaluatie voor kwaliteitsverbeteringen
- token/cost metering per AI-task

### Fase B — Next: review-first brugpilot naar output

Doel: valideren of de bestaande bronlaag bruikbare creator-output kan leveren.

- review-first content transforms vanuit entry/day
- kleine outputformats testen (post-draft/script-aanzet)
- geen scheduler/autopost/multi-channel publishing
- stijlconsistentie beperkt verkennen

### Fase C — Later: uitbreiding boven bewezen kern

- multimodale bijlagen
- tagging/themadetectie
- style layer
- social draft tooling
- business-variant voor creatieven/coaches

### Fase D — Parallel learning tracks (intern)

- lokaal LLM
- HTM/neocortex

Deze tracks leveren leerwinst, maar zijn geen releaseverplichting.

## Learning loop (bindende werkwijze)

1. **Capture**: rauwe input via audio/tekst.
2. **Process**: transcriptie, cleanup, dagboekopbouw.
3. **Review**: gebruiker/admin signaleert fouten of stijlverlies.
4. **Diff capture**: correcties als gestructureerde feedback vastleggen.
5. **AIQS compare**: kandidaatprompt/run vergelijken met runtime-baseline.
6. **Decision**: alleen uitrollen bij aantoonbare winst.
7. **Cost gate**: token- en latency-impact meewegen vóór uitrol.

## Token- en kosteneconomie (nu starten)

### Nu verplicht meten

Per AI-task (`entry_cleanup`, `day_narrative`, `reflection`, latere transforms):

- model
- input/output tokens
- geschatte kosten
- latency
- retry/rerun rate
- kwaliteitsuitkomst (bijv. correctiedruk)

Per gebruiker/segment:

- captures per dag/week/maand
- tokens per actieve gebruiker
- kosten per actieve gebruiker
- heavy-user patronen

### Fasering verdienmodel

1. **Nu**: interne metering en besluitinformatie (geen brede pricinglaunch).
2. **Next**: beperkte bundel-/top-up hypotheses valideren.
3. **Later**: expliciete tiering en pricing-activering op basis van bewijs.

## Obsidian links

- Active phase
- Now / Next / Later
- Deviations and decisions
- Budio Workspace plugin focus
- Open points
- Ideas workspace

---

## Post Basis 6 Month Roadmap

---
title: Post-basis 6-maandenroadmap
audience: human
doc_type: roadmap
source_role: operational
visual_profile: budio-terminal
upload_bundle: 50-budio-roadmap-planning-pack.md
---

# Post-basis 6-maandenroadmap - concept

## Status en leesregel

Dit is een concept-roadmap voor de periode nadat de basis klaar is.
Het is richtinggevend voor sequencing en productplanning, niet automatisch een set actieve taken.

```text
╔════════════════════════════════════════════════════════════════════╗
║ BUDIO ROADMAP CONSOLE                                            ║
╠════════════════════════════════════════════════════════════════════╣
║ MODE       post-basis concept                                    ║
║ UNIT       maandblokken op epicniveau                            ║
║ GOAL       buildbare volgorde voor testbare gebruikerswaarde     ║
║ FILTER     must-have eerst, nice-to-have alleen als ruimte helpt ║
╚════════════════════════════════════════════════════════════════════╝
```

Basis klaar betekent minimaal:

- 1.2B outputkwaliteit is expliciet genoeg voor beta-gebruik
- 1.2E private-beta readiness heeft voldoende runtimebewijs
- kernlus capture -> dagboeklaag -> reflecties blijft stabiel
- AIQS-basis en bestaande hardeningtaken blokkeren de volgende productlaag niet meer

## Strategische keuze

Na de basis bouwen we niet breder, maar scherper:

- eerst een builder/podcast wedge bewijzen
- daarna pas kennislaag, formats, workflow en Jarvis-ready structuur verdiepen
- geen publieke Jarvis-launch als shortcut

## Onderbouwing

Deze roadmap gebruikt een lichte combinatie van bewezen roadmapprincipes:

- doelen per maand in plaats van losse featurelijsten, geinspireerd door de GO Product Roadmap van Roman Pichler
- thema-roadmaps in plaats van sprintdetail, zoals ProductPlan beschrijft
- doel/uitkomst/werk-terug redeneren uit Atlassian roadmap guidance
- RICE-denken van Intercom als sanity-check op impact, confidence en effort
- Opportunity Solution Tree-denken van Product Talk om kans, probleem en oplossing gescheiden te houden

Bronnen:

- [Roman Pichler - GO Product Roadmap](https://www.romanpichler.com/tools/the-go-product-roadmap/)
- [Atlassian - Create a project roadmap](https://www.atlassian.com/agile/project-management/create-project-roadmap)
- [ProductPlan - Organize your roadmap by themes](https://www.productplan.com/learn/organize-your-roadmap-by-themes)
- [Intercom - RICE prioritization](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)
- [Product Talk - Opportunity Solution Trees](https://www.producttalk.org/opportunity-solution-trees/)

## Niet bouwen in deze roadmap

- Geen publieke Jarvis-launch.
- Geen brede Pro/Business/Private uitbreiding.
- Geen billing/credits/usage-economie.
- Geen zware sprint/cycle-machine als hoofdlaag.
- Geen brede scheduler/autopost-flow voordat de builder/podcast wedge bewezen is.

## Hoofdlijn

```text
┌────────────┐
│ Basis klaar│
└─────┬──────┘
      ▼
┌────────────────────────────────────────┐
│ M1 Capture naar eerste contentbrug     │
├────────────────────────────────────────┤
│ M2 Output review queue en export       │
├────────────────────────────────────────┤
│ M3 Knowledge Hub V1                    │
├────────────────────────────────────────┤
│ M4 Builder/podcast profile + packs     │
├────────────────────────────────────────┤
│ M5 Podcast/solo expert workflow beta   │
├────────────────────────────────────────┤
│ M6 Workspace + Jarvis-ready structuur  │
└────────────────────────────────────────┘
```

```mermaid
flowchart TD
  Basis[Basis klaar] --> M1[M1 Capture -> contentbrug]
  M1 --> M2[M2 Review queue -> export]
  M2 --> M3[M3 Knowledge Hub V1]
  M3 --> M4[M4 Profile + format packs]
  M4 --> M5[M5 Expert workflow beta]
  M5 --> M6[M6 Workspace context layer]
  M6 -. future only .-> Jarvis[Jarvis skills / agents]
```

## Dependency flow

```text
Stabiele basis
  -> contentbrug
  -> review/export bewijs
  -> broncontext
  -> format/podcast herhaalbaarheid
  -> beta workflow
  -> workspace + Jarvis-ready contextlaag
```

## Must-have versus nice-to-have

```text
+---------+--------------------------------------+--------------------------------------+
| Maand   | Must-have                            | Nice-to-have                         |
+---------+--------------------------------------+--------------------------------------+
| M1      | entry -> output intent -> draft      | meerdere kanalen tegelijk            |
| M2      | review queue + export                | publishing/scheduler                 |
| M3      | source hub + citations               | brede document intelligence          |
| M4      | profile + format packs               | marketplace van formats              |
| M5      | podcast beta workflow                | autopost clips                       |
| M6      | workspace views + contextlaag        | publieke Jarvis                      |
+---------+--------------------------------------+--------------------------------------+
```

## Maand 1 - Capture Naar Eerste Contentbrug

### Doel

Maak van bestaande dagboek- en momentinput een eerste bewuste brug naar content-output voor builders/podcasters.
De gebruiker moet niet opnieuw vanaf een lege prompt beginnen.

### Waarom deze maand

De basis heeft al capture, daglaag en reflecties.
De grootste strategische gap is dat die context nog niet leidt tot een concrete builder-output.
Deze maand bewijst of Budio van persoonlijke context naar bruikbare publicatievoorbereiding kan bewegen.

### Eindgebruikerswaarde

De gebruiker kan een moment, dag of reflectie aanwijzen en daar een eerste contentrichting uit halen, zoals een post-idee, talking point of episode-angle.
Het voelt als hergebruik van eigen context, niet als generieke AI-output.

### Budio-ROI

Dit levert het eerste bewijs voor de publieke wedge: Budio helpt makers sneller van eigen input naar concrete contentvoorbereiding.
Het verhoogt strategische differentiatie zonder meteen scheduler, billing of teamfeatures te bouwen.

### Must-have epics

| Epic | Wat moet het kunnen | Waarom belangrijk | Afhankelijkheid |
| --- | --- | --- | --- |
| Output intent kiezen | Een gebruiker kiest vanuit een moment/dag het doel: post, talking point, podcast angle of outline. | Maakt output expliciet zonder open chat te introduceren. | Stabiele entry/day detail flow. |
| Eerste draft op basis van eigen context | Het systeem maakt een korte concept-output met bronverwijzing naar de gekozen input. | Bewijst de contentbrug en houdt output source-grounded. | AIQS/outputkwaliteit basis. |
| Review-first resultaat | Output landt als concept met duidelijke reviewstatus, niet als automatisch gepubliceerde content. | Voorkomt premature autopost en houdt vertrouwen hoog. | Bestaande edit/review patronen. |

### Nice-to-have epics

| Epic | Wat voegt het toe | Waarom niet must-have |
| --- | --- | --- |
| Meerdere kanaalvarianten | Een concept kan tegelijk als LinkedIn, newsletter of podcast-hook worden herschreven. | Eerst moet één sterke outputbrug bewezen worden. |
| Tone quick-picks | Snelle toonkeuze zoals helder, persoonlijk of scherp. | Kan wachten tot we echte reviewfeedback zien. |

### Rollout en testlogica

Start met founder/testers die al eigen capture-data hebben.
Goed genoeg wanneer testers zonder arrow-prompt of leeg scherm een bruikbare eerste output kunnen maken en snappen waar die op gebaseerd is.

### Niet bouwen in deze maand

Geen scheduler, geen autopost, geen brede contentkalender en geen publieke Jarvis-interface.

## Maand 2 - Output Review Queue En Export

### Doel

Maak gegenereerde concepten beheersbaar: bewaren, vergelijken, verbeteren, afkeuren en exporteren.

### Waarom deze maand

Maand 1 bewijst creatie.
Maand 2 bewijst workflow: gebruikers moeten niet losse outputs verliezen of direct moeten publiceren.

### Eindgebruikerswaarde

De gebruiker heeft één plek om concepten terug te vinden, te reviewen en klaar te maken voor publicatie buiten Budio.
Export is belangrijker dan publiceren binnen Budio.

### Budio-ROI

Reviewdata laat zien welke outputs waardevol zijn en waar kwaliteit tekortschiet.
Dit voedt AIQS, formatkeuzes en latere productbeslissingen.

### Must-have epics

| Epic | Wat moet het kunnen | Waarom belangrijk | Afhankelijkheid |
| --- | --- | --- | --- |
| Output review queue | Concepten krijgen status zoals nieuw, in review, goedgekeurd of afgewezen. | Maakt outputproductie beheersbaar zonder sprintmachine. | Maand 1 concept-output. |
| Source peek | Vanuit een concept kan de gebruiker snel de gebruikte entry/dag/reflectie zien. | Houdt vertrouwen en context vast. | Bronkoppeling uit M1. |
| Markdown/copy export | Goedgekeurde output kan schoon worden gekopieerd of als Markdown worden geëxporteerd. | Geeft direct nut zonder publishing-infra. | Review queue. |

### Nice-to-have epics

| Epic | Wat voegt het toe | Waarom niet must-have |
| --- | --- | --- |
| Simpele batch export | Meerdere goedgekeurde concepten in één export. | Eerst individuele review/export bewijzen. |
| Feedbacklabels | Gebruiker labelt waarom output goed of slecht is. | Waardevol, maar kan na basisreview volgen. |

### Rollout en testlogica

Test met 5-10 echte outputconcepten per gebruiker.
Goed genoeg wanneer de gebruiker concepten terugvindt, begrijpt, verbetert en buiten Budio kan gebruiken zonder extra uitleg.

### Niet bouwen in deze maand

Geen automatische publicatie, geen contentkalender als hoofdlaag en geen zware cycle/sprint-statussen.

## Maand 3 - Knowledge Hub V1

### Doel

Voeg een compacte bronlaag toe zodat output niet alleen op dagboekcontext leunt, maar ook op expliciete kennisbronnen.

### Waarom deze maand

Na review/export weten we welke outputtypes waarde hebben.
Daarna pas is het logisch om bronnen toe te voegen, omdat we weten waarvoor die bronnen nodig zijn.

### Eindgebruikerswaarde

De gebruiker kan belangrijke bronnen toevoegen of aanwijzen en ziet dat outputs beter onderbouwd zijn met context en citations.

### Budio-ROI

Dit vergroot differentiatie: Budio wordt geen generieke generator, maar een brongetrouwe contextmachine voor makers.
Het bouwt voort op AIQS in plaats van een losse knowledge-base te worden.

### Must-have epics

| Epic | Wat moet het kunnen | Waarom belangrijk | Afhankelijkheid |
| --- | --- | --- | --- |
| Source library V1 | Gebruiker kan beperkte bronnen toevoegen of registreren voor builder/podcast-output. | Legt fundament voor kennisgestuurde output. | Review/export flow uit M2. |
| Citation-aware output | Concepten tonen compacte bronverwijzingen of contextsignalen. | Vertrouwen en herleidbaarheid. | AIQS/grounding checks. |
| Source peek | Bronnen zijn snel previewbaar zonder context-switch. | Past bij rustige, preview-first UX. | Source library. |

### Nice-to-have epics

| Epic | Wat voegt het toe | Waarom niet must-have |
| --- | --- | --- |
| Brede documenttypen | PDF, audio, foto en webbronnen allemaal tegelijk. | Te breed voor V1; eerst klein bronbewijs. |
| Semantische zoekervaring | Vrij zoeken door alle bronnen. | Waardevol later, maar outputflow is belangrijker. |

### Rollout en testlogica

Begin met enkele bronsoorten en echte builder/podcast-bronnen.
Goed genoeg wanneer bronnen zichtbaar betere en beter herleidbare outputs opleveren.

### Niet bouwen in deze maand

Geen brede document intelligence-suite en geen publieke second-brain positionering.

## Maand 4 - Builder/Podcast Profile En Format Packs

### Doel

Maak herhaalbare output mogelijk via profielen, formats en stijlkeuzes.
De gebruiker moet minder vaak dezelfde context uitleggen.

### Waarom deze maand

Na M1-M3 weten we welke outputs werken en welke bronnen nuttig zijn.
Dan pas kunnen vaste formats en profielen waardevol worden in plaats van premature configuratie.

### Eindgebruikerswaarde

De gebruiker legt eenmalig positionering, doelgroep, toon en favoriete outputformats vast.
Nieuwe outputs sluiten daarna beter aan zonder telkens opnieuw promptwerk.

### Budio-ROI

Profielen en format packs verhogen herhaalgebruik en maken de builder/podcast wedge verkoopbaarder.
Ze vormen ook een later fundament voor pricing, maar zonder nu billing te bouwen.

### Must-have epics

| Epic | Wat moet het kunnen | Waarom belangrijk | Afhankelijkheid |
| --- | --- | --- | --- |
| Builder/podcast profile | Vaste context voor doelgroep, propositie, toon en expertisegebied. | Vermindert herhaling en verbetert outputconsistentie. | Reviewfeedback uit M2-M3. |
| Format packs V1 | Enkele vaste formats zoals solo episode outline, LinkedIn post, newsletter intro en talking points. | Maakt waarde concreet en testbaar. | Profiel en output queue. |
| Format preview | Gebruiker ziet vooraf wat een format oplevert en waarvoor het bedoeld is. | Voorkomt dashboard- of prompt-chaos. | Format packs. |

### Nice-to-have epics

| Epic | Wat voegt het toe | Waarom niet must-have |
| --- | --- | --- |
| Custom format builder | Gebruiker maakt eigen formats. | Eerst moeten standaardformats bewezen zijn. |
| Team/klantprofielen | Meerdere profielen voor verschillende merken of klanten. | Past later bij Pro/Business, niet nu. |

### Rollout en testlogica

Test met 2-3 archetypes: solo expert, podcastmaker en builder/founder.
Goed genoeg wanneer profiel + format minder correctierondes oplevert dan losse output.

### Niet bouwen in deze maand

Geen marketplace, geen teamspaces en geen brede Business-laag.

## Maand 5 - Podcast/Solo Expert Workflow Beta

### Doel

Bundel capture, bronnen, formats en review tot één end-to-end workflow voor podcastmakers en solo experts.

### Waarom deze maand

Pas nu zijn de noodzakelijke bouwstenen aanwezig: outputbrug, review/export, broncontext en formats.
Deze maand bewijst of de wedge echt als productflow werkt.

### Eindgebruikerswaarde

De gebruiker kan van idee en bronnen naar een aflevering-outline, talking points, show notes en publicatievoorbereiding.
Het blijft review-first en source-grounded.

### Budio-ROI

Dit is het scherpste validatiemoment voor retentie en commerciële waarde.
Als deze workflow niet aanslaat, is brede opschaling te vroeg.

### Must-have epics

| Epic | Wat moet het kunnen | Waarom belangrijk | Afhankelijkheid |
| --- | --- | --- | --- |
| Episode/project workspace | Eén lichte werkruimte voor een aflevering of solo expert asset. | Verbindt losse outputs tot een echte workflow. | M1-M4 capabilities. |
| Outline + talking points | Genereert outline en talking points uit eigen context en bronnen. | Kernwaarde voor podcast/builder wedge. | Source hub + format packs. |
| Show notes/export pack | Maakt een exporteerbaar pakket met show notes, summary en post-ideeën. | Direct bruikbaar buiten Budio. | Review queue/export. |

### Nice-to-have epics

| Epic | Wat voegt het toe | Waarom niet must-have |
| --- | --- | --- |
| Clip-ideeën | Ideeën voor short clips of quotes. | Nuttig, maar pas na outline/show notes. |
| Gastvoorbereiding | Specifieke guest prep flow. | Later uitbreiden als solo expert flow bewijs heeft. |

### Rollout en testlogica

Beta met kleine groep makers die echt een aflevering of expertstuk voorbereiden.
Goed genoeg wanneer de workflow tijd bespaart, betere structuur oplevert en buiten Budio gebruikt wordt.

### Niet bouwen in deze maand

Geen autopost, geen full scheduler en geen brede customer-support suite.

## Maand 6 - Workspace En Jarvis-Ready Structuur

### Doel

Breng structuur aan rond intake, views, beslissingen en uitvoering zodat Budio later Jarvis-compatible wordt zonder Jarvis nu publiek te maken.

### Waarom deze maand

Na de wedge-beta weten we welke werkobjecten bestaan: bronnen, outputs, episodes, reviews, beslissingen en vervolgacties.
Pas dan is workspace-structuur waardevol en geen abstract intern systeem.

### Eindgebruikerswaarde

De gebruiker krijgt overzicht: wat is nieuw, wat wacht op review, wat is klaar voor export, en welke bron of beslissing hoort erbij.

### Budio-ROI

Dit verbetert interne snelheid en legt de contextlaag voor toekomstige Jarvis-skills/agents.
Het voorkomt dat Jarvis bovenop rommelige data en losse workflows wordt gebouwd.

### Must-have epics

| Epic | Wat moet het kunnen | Waarom belangrijk | Afhankelijkheid |
| --- | --- | --- | --- |
| Workspace views | Saved views voor inbox, review, sources, outputs en episode/project work. | Maakt werk vindbaar en bestuurbaar. | M1-M5 objecten. |
| Decision view | Belangrijke keuzes rond formats, bronnen en outputrichting zijn zichtbaar en herleidbaar. | Helpt planning en productontwikkeling. | Review/source metadata. |
| Jarvis-ready context layer | Objecten krijgen genoeg context en status om later door Jarvis/agents gebruikt te worden. | Bouwt toekomstfundament zonder publieke Jarvis-belofte. | Workspace views. |

### Nice-to-have epics

| Epic | Wat voegt het toe | Waarom niet must-have |
| --- | --- | --- |
| Slack/GitHub event ingest | Interne workflow-events automatisch binnenhalen. | Eerst workspace-objectmodel stabiel maken. |
| Agent quick actions | Jarvis-achtige assistive acties op objects. | Pas na stabiele structuurlaag. |

### Rollout en testlogica

Eerst intern/founder-only en met beta-outputdata.
Goed genoeg wanneer de workspace minder contextverlies geeft en vervolgwerk sneller te prioriteren is.

### Niet bouwen in deze maand

Geen publieke Jarvis, geen brede automationlaag en geen enterprise workspace.

## Volgordecontrole

```text
Kan M2 zonder M1? Nee, review queue heeft concept-output nodig.
Kan M3 voor M2? Liever niet, bronnen hebben pas waarde als output/review scherp is.
Kan M4 voor M3? Beperkt, maar formats worden sterker met bron- en reviewbewijs.
Kan M5 voor M4? Nee, beta workflow heeft formats/profiel nodig.
Kan M6 eerder? Alleen intern, maar productmatig is structuur pas logisch na echte wedge-objecten.
```

## Vervolg

De basis-roadmap wordt apart uitgewerkt met dezelfde templates.
Deze post-basis roadmap blijft de conceptlijn voor wat er na de basis gebouwd wordt.
