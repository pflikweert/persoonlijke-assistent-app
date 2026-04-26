---
title: Budio Workspace Command Room — Linear-inspired, Codex-ready, local-first
audience: human
doc_type: idea-research
source_role: reference
visual_profile: budio-terminal
upload_bundle: 20-budio-strategy-research-and-ideas.md
status: draft
type: platform-architecture
horizon: next-later
workstream: plugin
priority: p2
created_at: 2026-04-26
---

# Budio Workspace Command Room — Linear-inspired, Codex-ready, local-first

## Status

**Draft idea/research.**

Dit document legt een richting vast voor een toekomstige Budio Workspace-laag die leert van:

- **Linear**: werkstructuur, triage, views, snelheid, keyboard-first UX, rustige informatiearchitectuur.
- **Cline Kanban**: browser-based agent orchestration, task cards, worktrees, diff review en agentstatus.
- **OpenAI Codex**: lokale en/of cloud coding agent die via ChatGPT-account of API gebruikt kan worden.

Dit is **geen actieve bouwscope**. Dit is een startpunt om later gericht taken te maken wanneer er capaciteit is.

---

## 1. Executive summary

De kans is sterk: Budio Workspace kan uitgroeien tot een lokale, browser-openbare command room voor projectuitvoering.

De richting:

```text
╔════════════════════════════════════════════════════════════════╗
║ BUDIO WORKSPACE COMMAND ROOM                                  ║
╠════════════════════════════════════════════════════════════════╣
║ LEARN FROM LINEAR   structure, triage, views, UX speed        ║
║ LEARN FROM CLINE    agent orchestration and review workflow   ║
║ USE CODEX           runner / coding agent, not something to clone
║ BUILD LOCAL-FIRST   repo docs + browser + VS Code wrapper     ║
║ DO NOT BUILD NOW    full Linear clone, full Cline clone, Jarvis
╚════════════════════════════════════════════════════════════════╝
```

De beste productkeuze:

**Budio Workspace wordt niet een Linear-kloon en niet een Cline-kloon.**

Budio Workspace wordt:

> een lokale, docs-first, taskflow-first workspace die Budio-projectwaarheid, taken, ideeën, research en later Codex-uitvoering in één rustige werklaag samenbrengt.

De eerste werkende stap moet klein zijn:

> **Browser Shell V1:** dezelfde workspace UI kunnen openen in VS Code én in een gewone browser op localhost.

Waarom dit eerst:

- het geeft direct voordeel
- het maakt de plugin minder opgesloten in VS Code
- het maakt latere Codex-runner integratie eenvoudiger
- het is een technische fundering zonder AI-scope creep

---

## 2. Budio-context en scopeguard

### Past dit binnen Budio?

Ja, mits het als **internal tooling / plugin workstream** wordt behandeld.

Budio Workspace is in de huidige Budio-context bedoeld als dagelijkse uitvoeringslaag bovenop `docs/project/25-tasks/**`, planning, open points en idea/research lagen.

Belangrijke guardrails:

- plugin/workspace vervangt nooit canonieke projectdocs
- `docs/project/**` blijft bron van waarheid
- `docs/upload/**` blijft generated uploadcontext, geen repo-bron
- Jarvis blijft internal-only en niet publiek
- AI-agent-uitvoering komt pas na structuur en review
- geen pricing, billing, public workspace of teamproduct als bijvangst

### Budio-specifieke kern

Linear en Cline starten vanuit algemene softwareteams. Budio moet starten vanuit eigen workflow:

1. **Docs truth**
   - `docs/project/**`
   - planning
   - ideas
   - taskfiles
   - open points
   - AIQS governance

2. **Founder execution**
   - korte dagdelen
   - één taak tegelijk
   - veel context uit ChatGPT/Codex
   - duidelijke prompts
   - verify en commit pas na bewijs

3. **AI-assisted, not AI-owned**
   - AI mag helpen structureren en uitvoeren
   - AI bepaalt niet zelfstandig productwaarheid
   - review-first blijft hard

---

## 3. Research: Linear

### Wat Linear goed doet

Linear voelt sterk omdat het niet alleen een kanbanboard is. Het is een werk-OS met:

- inbox / triage
- issues
- projects
- custom views
- display options
- peek
- keyboard shortcuts
- command menu
- search
- integrations
- status / priority / ownership
- rustige density
- snelle navigatie
- weinig visuele ruis

### Relevante Linear-functionaliteiten

| Linear patroon         | Wat het doet                                                          | Budio-vertaling                                           |
| ---------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| Triage                 | Binnenkomend werk eerst beoordelen voordat het normale workflow wordt | Budio Intake: user request, idee, bug, research, later    |
| Custom Views           | Duurzame gefilterde views                                             | Mijn focus, Review, Ideas, Blocked, AIQS, Plugin          |
| Display Options        | Layout, grouping, ordering, properties                                | Board/list/detail/timeline later, persoonlijke voorkeuren |
| Peek                   | Detail bekijken zonder context te verliezen                           | Side pane / quick preview voor tasks, ideas en docs       |
| Command menu           | Snelle acties via keyboard                                            | `Cmd+K`: open view, create task, route idea, copy prompt  |
| Search                 | Snel navigeren over issues/docs/projects                              | Global search over taskfiles, ideas en docs               |
| Keyboard flow          | Minder muiswerk, meer snelheid                                        | Shortcuts voor view switch, open, close, status, copy     |
| Projects / Initiatives | Werk groeperen op hoger niveau                                        | Later: maandblokken, epics, workspace milestones          |
| Integrations           | GitHub, Slack, Sentry, customer feedback                              | Later: GitHub read-only, PR status, CI status             |
| Updates / health       | Statuscommunicatie                                                    | Later: weekdigest / planning radar                        |

### Wat Budio moet kopiëren

Niet het merk. Wel de principes:

1. **Context-first**
   - niet starten bij kaartjes
   - starten bij werkcontext: docs, decisions, ideas, tasks, code

2. **Saved views als primaire werkvorm**
   - board is slechts één view
   - list/detail/review/intake zijn net zo belangrijk

3. **Triage als bescherming tegen chaos**
   - nieuw werk niet direct in planning gooien
   - eerst routeren: task, idea, research, later, reject

4. **Peek boven modale chaos**
   - detail zonder contextverlies
   - side pane of quick look

5. **Keyboard-first**
   - snelheid ontstaat uit command palette + shortcuts

6. **Rustige informatiedichtheid**
   - compact, helder, weinig chrome
   - geen dashboard-massa

### Wat Budio niet moet kopiëren

- team SaaS-complexiteit
- enterprise workflows
- cycles als standaard ritme
- exact Linear-design
- workspace social/team features
- public feedback portal
- SLA / business plan complexity
- brede automation rules engine

---

## 4. Research: Cline Kanban

### Wat Cline Kanban goed doet

Cline Kanban is interessant omdat het laat zien hoe een board niet alleen taken toont, maar agents kan orkestreren.

Kern:

- terminal-launched
- lokaal in browser
- draait vanuit git repo
- task cards
- sidebar chat agent
- elke taak eigen git worktree
- elke taak eigen terminal
- agents parallel uitvoeren
- live status op kaart
- diffs reviewen
- inline comments
- commit of PR openen
- worktree opruimen

### Relevante Cline Kanban-functionaliteiten

| Cline Kanban patroon  | Wat het doet                         | Budio-vertaling                         |
| --------------------- | ------------------------------------ | --------------------------------------- |
| Local browser board   | Board opent vanuit repo op localhost | Budio Workspace Browser Shell           |
| Task cards            | Werk als uitvoerbare kaart           | Budio taskfile als kaart + detail       |
| Sidebar agent         | Agent maakt/verdeelt taken           | Later: Codex assistant / prompt builder |
| Git worktree per task | Isolatie per taak                    | Later: optionele task worktree          |
| Agent status          | Live voortgang zichtbaar             | Later: run status per task              |
| Terminal per task     | Agent heeft eigen uitvoerruimte      | Later: local runner pane                |
| Diff viewer           | Changes reviewen                     | Later: git diff pane                    |
| Inline comments       | Agent bijsturen op diff              | Later: review comments                  |
| Commit / PR           | Ship na review                       | Veel later: commit proposal / PR        |
| Task linking          | Dependencies tussen taken            | Later: blocked-by / follows-from        |

### Wat Budio moet kopiëren

1. **Browser-first local workspace**
   - dit is de belangrijkste eerste les
   - VS Code plugin wordt wrapper, niet de hele app

2. **Task detail als execution cockpit**
   - status
   - checklist
   - relevante docs/files
   - verify
   - prompt
   - run notes

3. **Agentstatus zichtbaar maar ondergeschikt**
   - agent is uitvoerder
   - task blijft bron van workflow

4. **Review-first**
   - nooit blind committen
   - diff en verify vóór done

5. **Worktree later**
   - sterk idee, maar pas nadat browser shell en taskviews stabiel zijn

### Wat Budio niet moet kopiëren in de eerste fases

- parallel agents
- bypassed permissions
- auto-commit
- PR automation
- meerdere agentproviders
- sidebar-agent die taken autonoom start
- dependency chains
- background cloud execution

---

## 5. Research: OpenAI Codex

### Relevantie

Codex is interessant omdat Budio niet zelf een coding agent hoeft te bouwen. Budio kan Codex gebruiken als uitvoerder.

Codex kan lokaal via:

- Codex CLI
- Codex IDE extension
- mogelijk Codex app/cloud flows

Budio Workspace moet Codex dus niet namaken, maar **Codex context geven**.

### Beste rolverdeling

```text
Budio Workspace:
  - taskflow
  - contextselectie
  - promptgeneratie
  - docs/guardrails
  - verify checklist
  - status/review
  - diff awareness later

Codex:
  - repo lezen
  - code wijzigen
  - tests draaien
  - uitleg geven
  - patch voorstellen
```

### Codex-chat in workspace

Niet direct bouwen als volledige chat.

Eerst:

1. **Copy-ready Codex prompt**
   - vanuit taakdetail
   - met juiste scope
   - met files wel/niet raken
   - met verify-regels
   - met commit-regel

2. **Open in Codex**
   - instructie of command voor Codex CLI/IDE
   - eventueel later launcher

3. **Run notes**
   - handmatig noteren wat Codex heeft gedaan
   - later automatisch session log koppelen

Later:

- Codex runner
- output stream
- changed files tracker
- diff pane
- status updates
- verify output capture

---

## 6. Productconcept: Budio Workspace Command Room

### Doel

Een interne, lokale workspace om Budio-uitvoering rustiger, sneller en beter traceerbaar te maken.

### Doelgroep

Eerst alleen:

- founder / Pieter
- lokale repo
- ChatGPT + Codex + Cline/Codex workflow
- Budio projectdocs

Niet:

- externe teams
- betalende gebruikers
- Budio Vandaag eindgebruikers
- publieke Jarvis

### Belofte

> Van losse ideeën, taken en prompts naar een rustige werklaag waarin je in korte dagdelen kunt kiezen, uitvoeren, reviewen en afronden.

### Kernobjecten

| Object     | Bron                                 | Doel                   |
| ---------- | ------------------------------------ | ---------------------- |
| Task       | `docs/project/25-tasks/**`           | Uitvoering             |
| Idea       | `docs/project/40-ideas/**`           | Voorstelruimte         |
| Plan       | `docs/project/20-planning/**`        | Focus                  |
| Open point | `docs/project/open-points.md`        | Risico/gap             |
| Doc        | `docs/project/**`, `docs/dev/**`     | Context                |
| View       | `.budio-workspace/views.json` later  | Werkweergave           |
| Session    | `.budio-workspace/sessions/**` later | Agent/run context      |
| Run        | later                                | Codex/Cline uitvoering |
| Diff       | git                                  | Review                 |

---

## 7. Technische architectuurrichting

### Kernkeuze

Splits Budio Workspace in drie lagen:

```text
tools/budio-workspace/
  web/
    React UI
    board/list/detail/views
  server/
    local Node server
    file system adapter
    git adapter
    codex runner adapter later
  shared/
    schemas
    task parser/writer
    filters/views
    command definitions

tools/budio-workspace-vscode/
  extension wrapper
  webview host
  starts/connects local server
  open file in editor
```

Als huidige repo al `tools/budio-workspace-vscode/**` gebruikt, bouw daar niet wild doorheen. Eerst onderzoeken wat herbruikbaar is.

### Waarom deze splitsing

- browser en VS Code gebruiken dezelfde UI
- minder plugin lock-in
- makkelijker testen
- later ook mogelijk als PWA of desktop shell
- Codex runner hoort lokaal/server-side, niet in webview
- geen secrets in client

### Local-first state

Markdown blijft waarheid.

Lokale UI-state kan later in:

```text
.budio-workspace/
  views.json
  preferences.json
  sessions/
  cache/
```

Niet direct nodig in fase 0/1.

### API-idee

Later local server endpoints:

```text
GET  /api/tasks
GET  /api/ideas
GET  /api/docs
GET  /api/views
POST /api/views
GET  /api/git/status
GET  /api/git/diff
POST /api/codex/prompt
POST /api/codex/run
WS   /events
```

Niet allemaal tegelijk bouwen.

---

## 8. UX-richting

### Layout V1

```text
┌───────────────────────────────────────────────────────────────┐
│ Budio Workspace                            Search / Cmd+K      │
├──────────────┬──────────────────────────────┬─────────────────┤
│ Left rail    │ Main view                    │ Detail / Peek   │
│              │                              │                 │
│ Mijn focus   │ List / Board                 │ selected task   │
│ Taken        │ filters + grouping           │ summary         │
│ Ideas        │ cards/rows                   │ checklist       │
│ Review       │                              │ docs/files      │
│ Blocked      │                              │ Codex prompt    │
│ Settings     │                              │ verify          │
└──────────────┴──────────────────────────────┴─────────────────┘
```

### Designprincipes

- Linear-achtig in rust en snelheid
- Budio-eigen in warmte en docs/terminal-smaak
- compact, niet druk
- list-first
- board-second
- detail/peek altijd dichtbij
- command palette belangrijk
- filters zichtbaar maar niet dominant
- geen grote dashboardkaarten
- geen AI-magie als hoofdvisual

### Belangrijkste interacties

- open task in detail pane
- switch board/list
- filter status/workstream/priority
- saved view openen
- copy Codex prompt
- open source file
- route idea naar task later
- markeren als blocked/review/done via bestaande taskfile flow

---

## 9. Fasering

Elke fase levert iets werkends op. Elke fase moet klein genoeg zijn voor een dagdeel of enkele dagdelen, afhankelijk van repo-realiteit.

## Fase 0 — Idea/research vastleggen

### Doel

Dit idee canoniek vastleggen zodat het later niet verdwijnt of als losse chatcontext blijft hangen.

### Werkend resultaat

- idea/research file bestaat in `docs/project/40-ideas/40-platform-and-architecture/`
- taskfile bestaat in `docs/project/25-tasks/open/`
- docs bundle en verify draaien

### In scope

- nieuw idea/research document
- starttask of future-task
- links naar bestaande Linear Workspace idee
- geen code

### Buiten scope

- plugin wijzigen
- browser server bouwen
- Codex runner bouwen

### Acceptatie

- file staat op juiste plek
- task staat op backlog of candidate
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run taskflow:verify`

---

## Fase 1 — Browser Shell Spike

### Doel

Budio Workspace kunnen openen in gewone browser via localhost, naast VS Code.

### Waarom eerst

Dit geeft direct voordeel en is technische basis voor alles erna.

### Werkend resultaat

- één command start/opened de workspace in browser
- bestaande workspace UI draait buiten VS Code webview
- VS Code plugin kan dezelfde UI blijven gebruiken of ernaar verwijzen
- geen agent/Codex-integratie

### In scope

- inventaris huidige pluginstructuur
- minimale shared web build of local server
- browser route
- README met startcommando
- geen redesign

### Buiten scope

- nieuwe features
- Codex
- worktrees
- data model herbouw

### Mogelijke files

Exacte files door Codex/Cline laten bepalen na repo-inspectie, maar waarschijnlijk:

- `tools/budio-workspace-vscode/**`
- eventueel nieuw `tools/budio-workspace/**`
- root `package.json` scripts indien nodig
- docs taskfile / idea update

### Acceptatie

- workspace opent in browser
- bestaande VS Code pluginflow blijft werken
- `npm run lint`
- `npm run typecheck`
- plugin apply indien plugin geraakt:
  - `cd tools/budio-workspace-vscode && npm run apply:workspace`

---

## Fase 2 — Saved Views V1

### Doel

Linear-achtige views toevoegen zonder groot datamodel.

### Werkend resultaat

- links rail toont vaste views
- views: Mijn focus, Open, In progress, Review, Blocked, Ideas
- filters worden per view toegepast
- geen custom editor nodig

### In scope

- view-definities hardcoded of simpele config
- status/workstream/priority filters
- list/board switch behouden
- no server persistence tenzij al makkelijk aanwezig

### Buiten scope

- user-created custom views
- sharing
- workspace defaults
- drag/drop redesign

### Acceptatie

- view selecteren werkt
- filters kloppen
- actieve view zichtbaar
- bestaande board/list blijven bruikbaar

---

## Fase 3 — Peek/detail pane stabiliseren

### Doel

Linear-achtig detail zonder contextverlies.

### Werkend resultaat

- detail pane is stabiel op desktop
- klein scherm gebruikt fullscreen detail
- geen lege rechterkolom
- duidelijke close/fullscreen toggle
- selected item blijft behouden na refresh

### In scope

- bestaande detailpane verbeteren
- responsive gedrag
- checklist/status/summary/files duidelijker
- detail los trekken van oude split-layout indien nodig

### Buiten scope

- volledige redesign
- nieuwe data
- Codex

### Acceptatie

- desktop: side pane werkt
- klein scherm: fullscreen detail werkt
- geen overlap/lege kolom
- task selectie blijft stabiel

---

## Fase 4 — Triage / Inbox V1

### Doel

Nieuwe input eerst routeren vóór het planning/taken wordt.

### Werkend resultaat

- aparte Inbox/Triage view
- losse items kunnen worden gecategoriseerd als task / idea / later / reject
- in eerste instantie mag dit handmatig en markdown-light zijn

### In scope

- eenvoudige inbox-source bepalen
- bv. `docs/project/40-ideas/00-ideas-inbox.md`
- view die inbox-items toont
- actie: open bronfile / copy route prompt

### Buiten scope

- automatische rules engine
- Slack/GitHub ingest
- write-heavy routing

### Acceptatie

- inbox zichtbaar
- item kan bekeken worden
- gebruiker kan sneller beslissen wat ermee gebeurt

---

## Fase 5 — Codex Prompt Builder V1

### Doel

Vanuit een taskdetail direct een sterke Codex-prompt genereren.

### Werkend resultaat

- knop: “Copy Codex prompt”
- prompt bevat:
  - doel
  - scopegrens
  - relevante files
  - niet raken
  - bestaande patronen hergebruiken
  - geen redesign
  - geen nieuwe dependency tenzij nodig
  - verify
  - commit alleen na verify

### In scope

- prompt template
- context uit taskfile
- eventueel relevante links/files uit task metadata
- copy-to-clipboard

### Buiten scope

- Codex automatisch starten
- Codex output streamen
- diff review

### Acceptatie

- prompt is direct bruikbaar in Codex
- prompt volgt Budio/Cline regels
- één taak per prompt

---

## Fase 6 — Git status / changed files V1

### Doel

Workspace helpt zien wat door Codex/Cline of handmatig is veranderd.

### Werkend resultaat

- git status zichtbaar in workspace
- changed files lijst
- open file
- mogelijk diff link of command

### In scope

- read-only git status
- changed files
- refresh
- geen write acties

### Buiten scope

- committen
- branches beheren
- PR maken
- worktrees

### Acceptatie

- gebruiker ziet gewijzigde files
- kan file openen in VS Code
- geen destructieve git-acties

---

## Fase 7 — Codex Run Notes V1

### Doel

Codex-uitvoering traceerbaar maken zonder runner te bouwen.

### Werkend resultaat

- task detail krijgt sectie “Agent/Codex notes”
- gebruiker kan plakken:
  - prompt gebruikt
  - resultaat
  - verify output
  - open vervolgpunten
- kan later naar taskfile of session log

### In scope

- lokale note file of taskfile-sectie
- geen automatische parsing nodig

### Buiten scope

- Codex starten
- logs streamen
- automatische verify

### Acceptatie

- run context blijft bewaard
- later terug te vinden
- geen truth-drift

---

## Fase 8 — Local Codex Runner Spike

### Doel

Voorzichtig testen of Budio Workspace Codex CLI kan starten of voorbereiden.

### Werkend resultaat

- knop of command maakt Codex command klaar
- eventueel terminal opent
- nog geen volledige orchestration

### In scope

- check of Codex CLI beschikbaar is
- command preview
- handmatige start of veilige spawn met toestemming
- status “started / manual follow-up”

### Buiten scope

- autonoom runnen zonder toestemming
- permissions bypass
- parallel tasks
- worktrees
- auto-commit

### Acceptatie

- geen secrets
- gebruiker blijft in control
- run start alleen expliciet
- log of note wordt gekoppeld aan task

---

## Fase 9 — Diff Review V1

### Doel

Review-first flow versterken.

### Werkend resultaat

- task detail toont changed files/diff
- gebruiker kan reviewen vóór verify/commit
- geen inline comments verplicht

### In scope

- read-only diff
- file-open
- maybe copy review note

### Buiten scope

- commit/PR
- inline comments
- agent feedback loop

### Acceptatie

- diff zichtbaar
- geen write git acties
- review vóór done wordt makkelijker

---

## Fase 10 — Worktree Research Spike

### Doel

Onderzoeken of Cline Kanban-achtig worktree-per-task nuttig is voor Budio.

### Werkend resultaat

- researchdoc / spike bewijs
- eventueel één handmatige worktree-flow
- geen standaardproductieflow

### In scope

- git worktree commands onderzoeken
- branch naming voorstel
- disk/cleanup risico’s
- interactie met Expo/Supabase/local env

### Buiten scope

- parallel agents standaard aan
- auto PR
- team workflow

### Acceptatie

- heldere go/no-go
- risico’s bekend
- geen schade aan main workspace

---

## Fase 11 — Agent Orchestration V1

### Doel

Pas als voorgaande lagen stabiel zijn: echte task-runner flow.

### Werkend resultaat

- task kan status `running` krijgen
- agent output gekoppeld aan task
- changed files/diff/verify zichtbaar
- human review vereist

### In scope

- één agentprovider: Codex
- één taak tegelijk als default
- manual approval gates

### Buiten scope

- meerdere providers
- cloud queue
- PR automation
- multi-agent parallel standaard

### Acceptatie

- run is traceerbaar
- stop/review werkt
- geen auto-commit
- verify is zichtbaar

---

## Fase 12 — Commit/PR Assist Later

### Doel

Na veel bewijs: ship-flow versnellen.

### Werkend resultaat

- commit message voorstel
- PR summary voorstel
- eventueel GitHub CLI command klaarzetten

### In scope

- voorstel genereren
- copy command
- handmatige uitvoering

### Buiten scope

- automatisch pushen/PR maken zonder expliciete opdracht
- CI decisions autonoom nemen

### Acceptatie

- gebruiker blijft eindbeslisser
- verify moet groen zijn
- commit alleen na akkoord

---

## 10. Roadmap op dagdeel-niveau

Voor jouw werkritme is dit belangrijker dan een grote roadmap.

### Dagdeel 1

- Fase 0 uitvoeren: docs + task vastleggen.
- Geen code.

### Dagdeel 2

- Repo inspectie plugin.
- Architectuuropties noteren.
- Eén voorstel voor Browser Shell V1.

### Dagdeel 3

- Browser Shell V1 bouwen.
- Alleen openen in browser.
- Verify.

### Dagdeel 4

- Browser Shell polish.
- README en startcommando.
- Plugin blijft werken.

### Dagdeel 5

- Saved Views V1.
- Geen persistence.
- Direct bruikbaar.

### Dagdeel 6

- Detail/peek stabiliseren.
- Vooral huidige frictie oplossen.

### Dagdeel 7

- Codex Prompt Builder V1.
- Grote waarde, weinig risico.

### Dagdeel 8

- Git status read-only.
- Changed files inzicht.

### Daarna

Pas dan opnieuw beslissen of Codex runner/worktrees verstandig zijn.

---

## 11. Promotiecriteria per fase

Een fase mag pas starten als:

- vorige fase werkt
- bestaande plugin niet kapot is
- verify kan draaien
- scope in taskfile staat
- geen nieuwe dependency tenzij expliciet nodig
- geen brede redesign
- geen agent-autonomie zonder aparte beslissing

Een fase is klaar als:

- er iets zichtbaar/bruikbaar werkt
- taskfile is bijgewerkt
- verify is gedraaid
- docs zijn bijgewerkt indien nodig
- commit pas na groen verify

---

## 12. Belangrijkste risico’s

### 1. Scope drift naar full platform

Mitigatie:

- elke fase één werkend voordeel
- geen parallelle provider-support
- geen PR automation nu

### 2. Plugin wordt te zwaar

Mitigatie:

- web app + VS Code wrapper splitsing
- browser shell eerst
- shared core later

### 3. Truth-drift tussen Markdown en UI-state

Mitigatie:

- Markdown blijft bron
- UI-state alleen preferences/views
- task writes via bestaande taskflow

### 4. AI-agent maakt te brede wijzigingen

Mitigatie:

- Codex prompt builder met harde scope
- één taak per prompt
- verify verplicht
- geen auto-commit

### 5. Jarvis sluipt naar binnen

Mitigatie:

- Jarvis expliciet buiten scope
- alleen Jarvis-ready contextlaag
- geen publieke of brede assistentclaim

---

## 13. Aanbevolen eerste task

Maak één starttask:

```text
budio-workspace-command-room-research-en-startpunt-vastleggen.md
```

Status:

```text
backlog
```

Doel:

- dit researchdocument toevoegen
- bestaand Linear-idee koppelen
- vervolgfases als roadmap in idea vastleggen
- nog geen code

Daarna aparte toekomstige task:

```text
budio-workspace-browser-shell-spike.md
```

Status:

```text
backlog
```

Doel:

- onderzoeken en bouwen van minimale browser shell

---

## 14. Non-goals hard vastleggen

Deze dingen zijn expliciet **niet** onderdeel van het startpunt:

- Linear clone bouwen
- Cline Kanban namaken
- eigen coding agent bouwen
- Jarvis bouwen
- publieke workspace
- team/workspace SaaS
- GitHub PR automation
- Slack ingest
- Sentry ingest
- worktrees
- parallel agents
- agent auto-commit
- production Budio app koppeling
- Supabase schema wijzigingen
- billing/credits/usage laag

---

## 15. Bronnen

### Budio interne bronnen

Gebruik canonieke repo-bronnen, niet generated uploadartefacten, wanneer dit in de repo wordt geplaatst.

Relevante bronpaden:

- `docs/project/README.md`
- `docs/project/20-planning/50-budio-workspace-plugin-focus.md`
- `docs/project/20-planning/30-now-next-later.md`
- `docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md`
- `docs/project/40-ideas/40-platform-and-architecture/20-vscode-project-copilot-plugin.md`
- `docs/project/40-ideas/40-platform-and-architecture/30-budio-modular-intelligence-workspace.md`
- `docs/project/40-ideas/40-platform-and-architecture/70-budio-workspace-plugin-decision-board.md`
- `docs/dev/cline-workflow.md`
- `AGENTS.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`

### Externe researchbronnen

Gecheckt op 2026-04-26.

#### Cline

- `https://docs.cline.bot/kanban/overview`
- `https://docs.cline.bot/kanban/getting-started`
- `https://docs.cline.bot/features/worktrees`
- `https://docs.cline.bot/features/focus-chain`
- `https://docs.cline.bot/core-workflows/checkpoints`
- `https://docs.cline.bot/features/hooks/index`
- `https://cline.bot/kanban`

#### Linear

- `https://linear.app/docs/triage`
- `https://linear.app/docs/custom-views`
- `https://linear.app/docs/display-options`
- `https://linear.app/docs/peek`
- `https://linear.app/docs/search`
- `https://linear.app/docs/keyboard-shortcuts`
- `https://linear.app/docs/projects`
- `https://linear.app/docs/github-integration`
- `https://linear.app/docs/slack`

#### OpenAI Codex

- `https://help.openai.com/en/articles/11369540-codex-in-chatgpt`
- `https://help.openai.com/en/articles/11381614-codex-codex-andsign-in-with-chatgpt`
- `https://developers.openai.com/codex/use-cases`
- `https://developers.openai.com/`

---

## 16. Voorgestelde bestandslocatie in repo

Plaats dit idee als canonieke idea/research file:

```text
docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md
```

Maak daarnaast deze task:

```text
docs/project/25-tasks/open/budio-workspace-command-room-research-en-startpunt-vastleggen.md
```

Als het bestaande Linear-idee al `100-linear-geinspireerde-budio-workspace-structuurlaag.md` is, dan is dit document een vervolg/uitbreiding, niet een vervanging.

---

## 17. Samenvattend besluitadvies

Mijn advies:

1. **Ja, vastleggen als idea/research.**
2. **Nee, nog niet bouwen als agentplatform.**
3. **Eerste bouwfase later: Browser Shell Spike.**
4. **Daarna: Saved Views + Peek.**
5. **Daarna pas: Codex Prompt Builder.**
6. **Codex Runner en Worktrees pas veel later.**

Dit houdt het klein, werkend en nuttig per dagdeel.
