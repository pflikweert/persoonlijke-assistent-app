---
id: task-plugin-activitybar-opent-list-view-zonder-workspace-menu
title: Budio Workspace activity-bar opent list view zonder workspace-menu
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in list view, maar de task is verbreed naar een structurele herziening van task-openen, detail-rendering, drag/sort interacties, actieve-agent zichtbaarheid, commit logging en multi-agent robuustheid. Laatste sessiestatus: fullscreen toggle werkt, maar task-openen/tonen en drag/sort in board + list zijn nog niet opgelost; daarnaast opent klikken op willekeurige tasks nu onterecht steeds dezelfde (actieve) kaart. Dit moet structureel herbouwd worden in maximaal 3 fases."
tags: [plugin, vscode, list-view, activity-bar]
workstream: plugin
due_date: null
sort_order: 6
---



# Budio Workspace activity-bar opent list view zonder workspace-menu

## Probleem / context

Wanneer de gebruiker op het Budio Workspace icoon in VS Code klikt, verschijnt nu eerst de oude `Workspace`-launcher/tussenlaag. Die route is verouderd en voegt geen waarde meer toe.

Daardoor voelt openen indirect en onnodig rommelig, terwijl de gewenste werkvorm juist is: direct de bestaande Budio Workspace window openen in de list view.

## Gewenste uitkomst

Klikken op het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in `list` view. De oude `Workspace`-launcher is uit de code en documentatie opgeruimd voor zover VS Code dit technisch toelaat.

Board blijft bestaan als secundaire view binnen de plugin en via het command palette, maar is niet meer de default open-route vanaf het icoon.

## Waarom nu

- Dit is een concrete UX-frictie in dagelijks gebruik van de plugin.
- De oude launcher-route zorgt voor verwarring en hoort niet meer bij de actuele pluginflow.
- Kleine plugin-polish is hier direct waardevol omdat deze extensie juist de dagelijkse uitvoeringslaag moet ondersteunen.

## In scope

- Activity-bar open-route laten landen in `list` view.
- Oude launcher/tussenlaag opruimen of minimaliseren tot alleen technisch noodzakelijke VS Code plumbing. Geen zijbalk openen/tonen die toch leeg is.
- Verouderde launcher-referenties uit extension-code en README verwijderen.
- Zorgen dat de webview-titel correct meebeweegt met de actieve view.

## Buiten scope

- Een volledige architectuurwissel naar een native sidebar-list in plaats van de bestaande panel/webview.
- Verwijderen van board of settings als beschikbare pluginviews.
- Nieuwe pluginfeatures buiten deze open-flow.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Activity-bar open-flow aangepast naar `list`.
- [x] Oude launcher-code en manifestverwijzingen opgeschoond.
- [x] README bijgewerkt naar het nieuwe open-gedrag.
- [x] List-view header/filters/sort/refresh UI aangescherpt (icon-only refresh, sort-select in topbar, actieve sort-header, statuschips gecentreerd, gekleurde batchchips).
- [x] List-view kolomheaders sticky gemaakt zodat ze onder de topnav zichtbaar blijven tijdens scroll.
- [x] Actieve taak-indicator visueel versterkt in board cards en list rows.
- [x] Automatische refresh/selectie-behoud aangescherpt voor repo- en agentgedreven markdownwijzigingen.
- [x] `Due` vervangen door `Last change` in de list view (datum-only, sorteert op wijzigingsdatum).
- [x] Checklist progress compacter en visueel consistenter gemaakt met gedeelde kleurbanden.
- [x] Plugin opent standaard met `Alleen open` actief.
- [x] Linker rail omgezet naar icon-first navigatie.
- [x] Detail pane uitbreidbaar gemaakt met resize handle en fullscreen toggle (basis aanwezig).
- [x] Agent activity zichtbaar gemaakt in list/board task-overzichten via gedeeld helperpatroon.
- [x] Rail refresh-knop gelijkgetrokken met de andere icon-buttons.
- [x] `Last change` compact gemaakt (`Apr 25`) zodat de datum niet over twee regels breekt.
- [x] Drag-vs-click structureel gescheiden zodat slepen niet meer meteen task detail opent.
- [ ] Task-openen en tonen structureel herzien: openen altijd in het taakvlak boven board/lane of list (niet in een lege placeholder rechts naast board/list).
- [ ] Selectiebug herstellen: klikken op willekeurige task in board/list opent nu steeds dezelfde actieve kaart i.p.v. de aangeklikte task.
- [ ] Task-openen weer klikbaar en betrouwbaar maken in board + list na de structurele herbouw.
- [ ] Drag & drop voor lane/sortering in board + list volledig herstellen en valideren (nu niet klik/sleepbaar in runtime).
- [ ] Detailweergave volledig stabiel maken: klein scherm fullscreen, desktop side-pane met expliciete fullscreen-optie, zonder lege rechterkolom of overlap over list/board.
- [ ] Fullscreen-renderpath structureel los trekken van de side-pane render zodat fullscreen niet meer meedraait op de oude split-layout.
- [ ] Laatste rail-sizing check bevestigen zodat refresh exact dezelfde maat houdt als de andere rail-icon buttons.
- [ ] Handmatige smoke-check in de normale VS Code workspace bevestigd.

## Uitvoerblokken / fasering

### Fase 1 — Task-openen/tonen en interactief fundament structureel herbouwen

- task-openen/tonen volledig herzien: detail opent in het taakvlak boven lane/board of list, nooit in een losse rechter-placeholder
- selectie-state fixen zodat klik altijd de correcte aangeklikte task opent (niet de eerder actieve kaart)
- klik op tasks in board + list weer betrouwbaar maken
- drag-vs-click regressies herstellen zonder board/list drag-drop te breken
- board + list drag/drop voor lane + sortering robuust herstellen
- fullscreen detail als aparte render-layer buiten split-grid houden, samen met resize-state via kleine hook

### Fase 2 — Ordering + agent-activiteit end-to-end zichtbaar en robuust maken

- actieve taken automatisch bovenaan binnen hun statuskolom houden
- actieve taken in list lane-onafhankelijk bovenaan tonen
- bestaande `sort_order` per lane/status robuust herschrijven zonder cross-lane chaos (multi-agent veilig)
- agentstatus volledig zichtbaar maken in board, list én detail (incl. actieve state)
- sort/order helpers klein en testbaar houden

### Fase 3 — Commit logging + multi-agent hardening afronden

- `## Commits` automatisch vullen voor nieuwe commits (repo-script/hook pad)
- `## Agent activity` structureel maken in taskfile-output
- conflict-arm schrijven/hydrateren voor gelijktijdige agents bevestigen
- gerichte E2E/smoke-check uitvoeren in VS Code op openen, drag/drop, fullscreen en ordering
- verify-flow afronden

## Status tegen uitgebreid plan uit deze sessie

## Oorspronkelijk uitgebreid plan / detailbehoud

Onderstaande planstructuur is expliciet bewaard omdat deze later nog uitvoerwaarde heeft. Deze sectie is geen samenvatting, maar de bronreferentie voor het uitgebreide plan dat tijdens deze taak is afgesproken.

### A. Status- en sorteermodel uitbreiden

1. **Nieuwe status `review` toevoegen**
   - statusvolgorde: `backlog -> ready -> in_progress -> review -> blocked -> done`
   - `review` blijft in `open/`; alleen `done` verhuist naar `done/`
   - constants, parser, writer, repository, sort-policy, config, tests, taskflow-verify en docs-statusmodel bijwerken

1. **Manual sorting regels aanscherpen**
   - nieuwe taken komen standaard **bovenaan** in manual sorting
   - zodra een taak actief in uitvoering komt, wordt die automatisch **bovenaan zijn huidige statuskolom** gezet en in de list view, volledig boven aan de list, lane onafhankelijk.
   - dit moet robuust zijn bij **meerdere agents tegelijk**: bestaande `sort_order` herschrijven per lane/status, zonder cross-lane chaos
   - actieve taken staan dus bovenaan binnen hun statuskolom

### B. UI/UX plugin polish

3. **Due vervangen door Last change date**
   - list-kolom `Due` wordt `Last change`
   - altijd **datum-only**, geen tijd
   - nette visuele weergave en sortering op wijzigingsdatum

4. **Checklist verbeteren op board + list**
   - checklisttekst compacter/weg waar logisch
   - gedeelde progress-chip voor board + list
   - max **5 kleurbanden** op percentage
   - visueel rustiger en sneller scanbaar

5. **Default altijd alleen open taken tonen**
   - plugin opent met `onlyOpen = true`

6. **Linker rail opnieuw bouwen**
   - flush links, geen restbalkje
   - vaste icon-buttons, zonder tekst
   - gelijke maat, subtiele actieve state
   - logisch kleuronderscheid per functie

7. **Resizable detail pane op board + list**
   - subtiele drag handle links van detailpane
   - gebruiker kan breedte live aanpassen
   - visuele indicator klein maar duidelijk

8. **Fullscreen detail toggle op board + list**
   - knop naast menu-knop
   - toggle tussen normale split en fullscreen task detail
   - samenwerken met resize-gedrag

### C. Agent-activiteit zichtbaar maken

9. **Actieve agent indicator in board, list en detail**
   - chip/badge tonen als taak op dat moment actief door een agent bewerkt wordt
   - tonen van agentnaam: bijv. `Codex`, `Cline`, `Claude`, `Chat`
   - subtiele animatie zolang actief
   - zodra klaar: geen animatie en geen actieve chip meer

10. **Agent metadata opslaan in task-md**

Ik stel voor een vaste metadata- en sectiestructuur toe te voegen, bijvoorbeeld:

- frontmatter velden voor actuele agentstatus
- sectie voor historiek / referentie, zoals:
  - `## Agent activity`
  - `## Commits`

Daarin kunnen we per nieuwe activiteit vastleggen:

- agentnaam
- model
- relevante agent-instellingen / context
- start/stop-status waar zinvol

### D. Automatische commit logging voor nieuwe commits

11. **`## Commits` voorbereiden én automatisch vullen**

- repo-managed hook/script, geen losse lokale sample-hooks
- alleen **nieuwe commits**, geen historische backfill
- nieuwe commits worden toegevoegd aan relevante taskfile(s)
- commit hash + subject loggen in `## Commits`

### E. Multi-agent robuustheid

12. **Concurrency-aanpak**

- task updates blijven file-version/checks respecteren
- agent-activiteit en sort-order updates moeten conflict-arm worden geschreven
- bij race/conflict: refresh/herhydrate pad behouden, geen stille overschrijvingen

## Verwachte implementatiestructuur uit het oorspronkelijke plan

- **helper** voor checklist-progress kleur/label
- **hook** voor detailpane resize/fullscreen state
- **task metadata uitbreiding** voor agent activity + commits
- **klein repo-script/hook** voor commit logging

## Oorspronkelijk verify-plan uit het uitgebreide plan

- `cd tools/budio-workspace-vscode && npm run typecheck`
- `cd tools/budio-workspace-vscode && npm run test`
- `cd tools/budio-workspace-vscode && npm run apply:workspace`
- `npm run taskflow:verify`
- omdat docs/statusmodel wijzigen:
  - `npm run docs:bundle`
  - `npm run docs:bundle:verify`

## Oorspronkelijke risico's uit het uitgebreide plan

- `review` + multi-agent + commit-logging samen maken dit groter dan een pure UI-polish
- actieve-agent chips vragen om een duidelijke bron van waarheid in task-md
- automatische sort-promotie bij status/activiteit moet netjes blijven werken met meerdere agents tegelijk

## Oorspronkelijke uitvoervolgorde in Act Mode

1. statusmodel + docs/taskflow (`review`)
2. sort/order regels voor nieuwe + actieve taken
3. last-change + checklist chips + open-only default
4. linker rail polish
5. resize + fullscreen detailpane
6. agent metadata + actieve chips
7. commit logging voor nieuwe commits
8. verify + plugin re-apply + taskfile bijwerken

## Expliciete user requirements / detailbehoud

- Filter `toon alleen open taken` is alleen zichtbaar in de filter van de **list-weergave** en wordt ook alleen daar toegepast; dit is niet relevant voor het board-scherm.
- Agent-activiteit moet visueel zichtbaar zijn in **board, list en task detail**, inclusief subtiele animatie zolang een taak actief door een agent wordt bewerkt.
- Bij code-review van requirementstatus geldt: als iets al in code bestaat dan moet dat als **user-review nodig** worden vastgelegd; anders blijft het **nog bouwen**.
- De uitgebreide requirements hieronder zijn expliciet relevant om later opnieuw op deze task te kunnen bouwen en mogen niet worden teruggebracht tot alleen een samenvatting.
- Punt 11 (`## Commits` automatisch vullen) en punt 12 (multi-agent concurrency) moeten als expliciete open requirements zichtbaar blijven zolang ze niet volledig zijn gebouwd; een reviewconclusie mag deze bronpunten niet vervangen.

## Status per requirement

- [x] `review` status toegevoegd — status: gebouwd.

- [~] Manual sorting regels voor actieve taken bovenaan binnen hun status — status: gedeeltelijk / niet bevestigd als generieke repo-regel.
- [x] `Due` vervangen door `Last change` — status: gebouwd.
- [x] Checklist compacter met gedeelde progress-chip / kleurbanden — status: gebouwd.
- [x] `onlyOpen` default / open taken filter — status: gebouwd; nu alleen zichtbaar en toegepast in list view.
- [x] Linker rail icon-first — status: gebouwd, met nog open visuele bevestiging voor refresh-sizing.
- [x] Resizable detail pane — status: gebouwd.
- [~] Fullscreen detail toggle — status: opnieuw in uitvoering; eerdere claim was te vroeg, structurele herbouw loopt nu in fase 1.
- [~] Actieve agent indicator in board/list/detail — status: gedeeltelijk; basisweergave aanwezig, animatie en consistente detail-state ontbreken nog.
- [~] Agent metadata opslaan in task-md — status: gedeeltelijk; frontmattermodel aanwezig, activity-/commit-secties ontbreken nog.
- [ ] `## Commits` automatisch vullen — status: nog niet gebouwd.
- [ ] Multi-agent concurrency-aanpak — status: nog niet afgerond / niet bewezen.

### Al gebouwd in code

- `review` status toegevoegd in plugin statusmodel (`backlog -> ready -> in_progress -> review -> blocked -> done`).
- `Due` in list view vervangen door `Last change` met sortering op wijzigingsdatum.
- Checklist-progress compacter gemaakt met gedeelde helper/presentatielaag voor board + list.
- `onlyOpen` default blijft actief voor list view en is niet langer een board-brede filter.
- Linker rail omgezet naar icon-first navigatie.
- Resize-handle en fullscreen toggle voor task detail toegevoegd.
- Frontmatter support toegevoegd voor agentvelden (`active_agent`, model, runtime, since, status, settings).
- Basisweergave van agentactiviteit toegevoegd in board/list en agent metadata in task detail.

### Gedeeltelijk gebouwd / nog niet af

- **Punt 5 — only open taken**
  - Staat nu standaard actief voor list view.
  - Is aangescherpt zodat het **alleen in list view zichtbaar én alleen daar toegepast** wordt.
- **Punt 9 — actieve agent indicator**
  - Basis chip/label bestaat in board/list.
  - Nog niet af: subtiele animatie zolang actief, en nog geen uniforme visuele active-state in board + list + detail.
- **Punt 10 — agent metadata in task-md**
  - Frontmatter velden bestaan en worden al geparsed/geschreven.
  - Nog niet af: expliciete sectiestructuur/historiek zoals `## Agent activity` en verdere activity-log per taak.
- **Punt 8 — fullscreen detail toggle**
  - Toggle/state bestaat.
  - Eerdere fullscreen-fix bleek niet structureel genoeg; renderpad wordt nu expliciet herbouwd buiten de split-layout.

### Nog niet overtuigend gebouwd / niet als klaar te claimen

- **Punt 2 — manual sorting regels voor actieve taken bovenaan binnen hun status**
  - Nieuwe taken bovenaan lijkt grotendeels aanwezig.
  - Niet bevestigd als generieke repo-regel: taken met actieve agent automatisch bovenaan binnen hun status.
- **Punt 11 — `## Commits` automatisch vullen**
  - Nog geen bewijs dat nieuwe commits automatisch naar relevante taskfiles worden gelogd.
- **Punt 12 — concurrency-aanpak voor multi-agent activity + sort order**
  - Bestaande file-version/conflictchecks helpen al deels.
  - De specifieke multi-agent uitbreiding uit het plan is nog niet als afgeronde feature zichtbaar.

## Bekende resterende punten uit deze sessie

- Fullscreen toggle werkt nu wel, maar de rest van de interactiestack is nog niet opgelost.
- Task-openen moet structureel opnieuw worden ontworpen: openen over lane/board/list-context, niet in de rechter placeholder naast board/list.
- Nieuwe regressie bevestigd: klikken op verschillende tasks opent nu telkens dezelfde actieve kaart (bijv. `Entry photo gallery volledige end-user E2E flows`) in plaats van de geselecteerde task.
- Task-openen en drag/drop in board + list hebben op dit moment regressies (taken niet goed aanklikbaar en niet sleepbaar voor lane/sortering).
- Actieve agent-visualisatie is nog niet volledig volgens plan: animatie en consistente visual state in board/list/detail ontbreken nog.
- Agent metadata bestaat nu vooral als frontmatter-model; de geplande activity-/commit-secties in task-md zijn nog niet uitgewerkt.
- Commit-logging en de expliciete multi-agent concurrency-uitbreiding uit het uitgebreide plan zijn nog niet afgerond.
- De taak blijft bewust `in_progress` totdat het nieuwe 3-fasenplan volledig is uitgevoerd en met runtime-checks bevestigd is.

## Blockers / afhankelijkheden

- VS Code verwacht voor een activity-bar container nog steeds een gekoppelde view; als volledig verwijderen daarvan technisch niet haalbaar blijkt, blijft alleen de minimaal noodzakelijke bridge over zonder oude launcher-semantiek.

## Verify / bewijs

- `npm run taskflow:verify`
- In `tools/budio-workspace-vscode/`: `npm run typecheck`
- In `tools/budio-workspace-vscode/`: `npm run test`
- In `tools/budio-workspace-vscode/`: `npm run apply:workspace`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Handmatige smoke-check in VS Code:
  - activity-bar icoon opent direct list view
  - oude `Workspace` launcher/menu verschijnt niet meer als betekenisvolle tussenlaag
  - `Budio Workspace: Open Board` werkt nog
  - `Budio Workspace: Open List View` werkt nog
  - settings blijft bereikbaar

## Relevante links

- `tools/budio-workspace-vscode/package.json`
- `tools/budio-workspace-vscode/src/extension.ts`
- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`

## Toegevoegde verbeteringen tijdens uitvoering

- `onlyOpen` filter afgebakend naar list view: alleen daar zichtbaar en alleen daar functioneel actief.
- Start gemaakt met hook-first detail-layout herstructurering (`use-task-detail-layout`) zodat fullscreen niet meer als ad-hoc CSS-truc op de split-layout hoeft te leunen.
- Refresh-knop in de activity rail dezelfde icon-sizing gegeven als de andere rail-buttons.
- Fase 1 verify opnieuw gedraaid: plugin `typecheck`, plugin `test`, `taskflow:verify`, `docs:bundle`, `docs:bundle:verify` en `apply:workspace` zijn opnieuw succesvol uitgevoerd na de herstructurering.

## Oorspronkelijk plan / afgesproken scope

- Activity-bar opent direct list view zonder oude workspace-menu tussenlaag.
- Fullscreen detail toggle van tasks werkend op board + list.
- Resize en fullscreen moeten samenwerken zonder lege rechterkolom of overlap.
- Actieve taken moeten ordering-promotie krijgen, robuust bij meerdere agents.
- Agent-activiteit volledig zichtbaar in board, list en task detail.
- Automatische commit logging voor nieuwe commits.
- Multi-agent robuustheid expliciet uitvoeren.

## Reconciliation voor afronding

- **Oorspronkelijk plan binnen deze task:** activity-bar direct naar list view, launcher-opruiming, full task interaction flow structureel goed, plus de resterende requirements uit het uitgebreide plan.
- **In deze ronde aantoonbaar afgerond:** list-only `onlyOpen`, start van detail-layout herbouw via aparte hook, plugin typecheck/test/docs-verify in de vorige ronde.
- **Later toegevoegd of opnieuw geopend:** fullscreen/detail claims teruggezet naar in uitvoering omdat runtime nog fout was; board/list click+drag regressies horen expliciet in fase 1 thuis.
- **Open / blocked:** taak blijft `in_progress` totdat fase 1 runtime-stabiel is en daarna fase 2/3 inclusief handmatige smoke-check bevestigd zijn.


## Commits

- dbe712d — docs(task): update plugin task status with unresolved bugs and 3-phase plan

- a9e2961 — docs(task): add selection bug to plugin task status