---
id: aiqs-admin-console-uiux-linear-richting
title: AIQS admin console UI/UX Linear-richting
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-02
summary: "AIQS en admin-interface krijgen een eigen compacte tooling-look in Linear-richting, zonder runtime-, route- of functionaliteitswijzigingen."
tags: [aiqs, admin, ui, ux, polish]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: [aiqs-runtime-db-binding-voor-live-prompts]
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 3
---




## Probleem / context

AI Quality Studio werkt functioneel, maar voelt nog te veel als een mobiele settings-flow met gestapelde warme Budio-cards. Voor productie-admins moet AIQS aanvoelen als een compacte tooling-console: sneller scanbaar, neutraler, dichter, duidelijker en los van de gewone Budio gebruikersflow.

## Gewenste uitkomst

De admin- en AIQS-interface krijgt een eigen look and feel die past bij admin tooling en visueel richting Linear beweegt: rustige toolbar, dense lijsten, duidelijke statuschips, split views op desktop, minder uitlegcopy en minder zware surfaces.

Functionaliteit, routes, runtime-binding, promptbeheer, test/validate en adminrechten blijven intact. De gewone Budio gebruikersflow blijft ongemoeid.

## User outcome

Een founder/admin kan AIQS sneller scannen en bedienen als admin-console: families openen, promptstatus beoordelen, drafts bewerken, testen en valideren zonder door lange settings-cards te moeten scrollen.

## Functional slice

UI/UX-only herstructurering van AIQS admin-schermen naar een gedeelde admin-console presentatielaag, zonder backend-, schema-, route- of contractwijzigingen.

## Entry / exit

- Entry: founder/admin opent AI Quality Studio via het admin/settings-menu.
- Exit: founder/admin kan overview, group, task detail, draft, test en validate flows gebruiken met dezelfde functionaliteit maar compactere tooling-layout.

## Happy flow

1. Admin opent AIQS-overzicht en ziet runtime-status, families en utilities compact.
2. Admin opent een family en ziet driver, varianten en read-only compound members als dense rows met badges.
3. Admin opent task detail, draft, test of validate en behoudt alle bestaande acties in een console/workbench-layout.

## Non-happy flows

- Empty state: AIQS toont compact dat baseline ontbreekt en biedt importactie.
- Permission denied / unavailable: denial blijft zichtbaar en actiegericht.
- Validation / unsupported state: bestaande foutmeldingen blijven beschikbaar, maar worden scanbaar gepresenteerd.
- Failure / retry / cancel: bestaande retry-/save-/cancelroutes blijven intact.

## UX / copy

- Admin interface krijgt eigen look and feel.
- Gewone Budio flow blijft ongemoeid.
- Linear is visuele richting: compact, rustig, dense, keyboard/workbench-achtig; geen exacte kopie.
- Simpel en duidelijk, met minder uitlegcopy.
- Geen functionaliteit verwijderen of wijzigen.
- UI gebruikt een aparte admin-console primitive-laag; gewone settings/scaffold-primitives blijven leidend voor niet-admin schermen.
- Adminlabels blijven kort: `Runtime actief`, `Draft aanwezig`, `Baseline ontbreekt`, `Driver`, `Variant`, `Read-only`, `Repair`.

## Data / IO

- Input: bestaande AIQS admin readmodels, task metadata, version data, test/validate cases en debug settings.
- Output: dezelfde routes, servicecalls en save/test/validate resultaten als voorheen.
- Opslag/API/service/file-impact: geen schema-, backend- of API-contractwijzigingen.
- Statussen: bestaande live/draft/runtime/read-only/variant metadata blijft leidend.

## Waarom nu

AIQS wordt productie-relevant als runtime-bron voor prompts. Admins moeten dit beheersbaar en betrouwbaar kunnen bedienen voordat MVP-productie livegang prettig en veilig voelt.

## In scope

- Nieuwe gedeelde admin-console UI-primitives.
- AIQS overview, group, task detail, draft, test en validate visueel/IA-matig verbeteren.
- Compacte statuschips, dense rows, panels, toolbar/contextbar en desktop split/workbench layouts.
- Copy inkorten waar dit geen contract of betekenis wijzigt.
- Gerichte static en runtime UI-verificatie.

## Buiten scope

- Backend/runtime/prompt/schema/permissiewijzigingen.
- Routes verwijderen, hernoemen of contractueel wijzigen.
- Gewone Budio end-user flow restylen.
- Exacte Linear-kopie of nieuwe productfeatures.

## Oorspronkelijk plan / afgesproken scope

We geven alleen de admin- en AIQS-interface een eigen tooling-look, los van de gewone Budio gebruikersflow. Functionaliteit, routes, dataflows, runtime-binding, promptbeheer, test/validate en adminrechten blijven intact; we verbeteren alleen informatiearchitectuur, layout, density, hiërarchie, states en copy.

Reviewbevindingen:

- `AdminShell` gebruikt nu nog gewone settings-primitives en warm Budio surfaces; daardoor voelt AIQS als settings, niet als tooling-console.
- Overzicht, groep en task-detail zijn te card-stacked; op desktop wordt beschikbare breedte nauwelijks benut.
- Draft/test/validate hebben goede functionaliteit, maar missen een sterke werkstructuur: context, editor, output, checks en acties staan te veel in één lange verticale stroom.
- Statusmetadata is zichtbaar, maar nog niet scanbaar genoeg als badges/chips zoals `Live`, `Draft`, `Runtime driver`, `Repair`, `Read-only`, `Baseline missing`.
- Debug logging en baseline import staan op het AIQS-overzicht als grote blokken; ze horen visueel secundair te zijn in een tooling admin console.
- Copy is soms technisch of uitleggerig; voor admin tooling mag de taal compacter en operationeler zijn, zonder gewone Budio end-user tone te veranderen.

## Expliciete user requirements / detailbehoud

- Admin interface krijgt eigen look and feel.
- Gewone Budio gebruikersflow blijft zijn eigen interface behouden.
- Linear is visuele richting.
- Interface moet simpel en duidelijk worden.
- Geen functionaliteit verwijderen of wijzigen.
- Review en test de nieuwe wijzigingen en verbeter waar nodig.

## Status per requirement

- [x] Admin interface krijgt eigen look and feel — status: gebouwd
- [x] Gewone Budio gebruikersflow blijft ongemoeid — status: gebouwd
- [x] Linear-richting wordt vertaald naar compacte admin tooling — status: gebouwd
- [x] Interface wordt simpeler en duidelijker — status: gebouwd
- [x] Geen functionaliteit verwijderen of wijzigen — status: in code aanwezig maar nog user-review nodig
- [x] Nieuwe wijzigingen zijn gereviewd en getest — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Gedeelde `admin-console-primitives` toegevoegd, zodat AIQS-schermen dezelfde compacte console-taal gebruiken zonder gewone Budio settings-flow te restylen.
- AIQS sticky footer compacter en neutraler gemaakt; deze primitive wordt momenteel alleen door AIQS-schermen gebruikt.
- Web app-shell route-specifiek verbreed voor `settings-ai-quality-studio*`, zodat AIQS desktopbreedte benut terwijl gewone Budio routes mobile-first blijven.
- Tijdens runtime-smoke een foutieve `Baseline`-chip op live families gevonden en gecorrigeerd naar `Runtime actief`.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante docs/taskflow/context bevestigen.
- [x] Blok 2: gedeelde admin-console primitive-laag toevoegen zonder gewone settings-primitives te breken.
- [x] Blok 3: AIQS overview en group flow omzetten naar compacte console IA.
- [x] Blok 4: task detail, draft, test en validate omzetten naar console/workbench-layout.
- [ ] Blok 5: static verify, runtime UI-smoke, taskflow en docs-bundel afronden.

## Concrete checklist

- [x] Taskflow en linked runtime-context vastleggen.
- [x] Admin-console primitives toevoegen.
- [x] Overview compact maken met toolbar, statuschips, dense family rows en utility logging.
- [x] Group screen compact maken met contextbar, badges en dense task rows.
- [x] Task detail compact maken met contextbar, version list en admin actions.
- [x] Draft editor desktop split-layout geven.
- [x] Test en validate workbench-density verbeteren.
- [x] Light/dark en desktop/mobile visueel controleren waar praktisch.
- [x] Relevante verifies draaien.

## Acceptance criteria

- [x] AIQS gebruikt een eigen admin-console visual layer, niet alleen gewone settings-cards.
- [x] Overview, group, detail, draft, test en validate behouden bestaande functionaliteit.
- [x] Runtime drivers, technische varianten en read-only compound members zijn scanbaar als badges/states.
- [x] Desktop gebruikt breedte beter via dense rows/split/workbench-layout; mobile blijft bruikbaar stacked.
- [x] Debug logging en baseline import zijn visueel secundair/operationeel gepresenteerd.
- [x] Gewone Budio gebruikersflow is niet aangepast.

## Blockers / afhankelijkheden

- Linked context: `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`

## Verify / bewijs

- `npm run test:unit -- ai-quality-readmodel` — groen, 1 testfile / 3 tests.
- `npm run typecheck` — groen.
- `npm run lint` — groen.
- `npm run taskflow:verify` — groen.
- Runtime UI-smoke op `http://localhost:8081`:
  - overview laad als admin/founder met `14 live`, `Prompt families`, `Runtime actief`.
  - group routes `today`, `week`, `month` laden met `Driver`, `Read-only` en `Live` badges.
  - task detail `day_narrative` laadt met `Driver`, `Primary`, `Runtime actief`.
  - draft flow via bestaande detailactie maakte lokaal draft v3 en laadde editor, `Runtime contract`, `Geavanceerd` en `Assist`.
  - validate route voor dezelfde draft laadde `Case kiezen`, compare panes, `Snelle controle`, `Beslissing` en `Run test` zonder run te starten.
  - lokaal aangemaakte testdraft v3 is na smoke via UI-delete flow weer verwijderd.
  - desktop light/dark en mobile light/dark screenshots gecontroleerd op overlap, tekstfit en scanbaarheid.
- `npm run verify:local-flow` — groen, text-flow PASS.
- `npm run verify:local-reflection-flow` — groen, week/month reflection-flow PASS.

## Reconciliation voor afronding

- Oorspronkelijk plan: AIQS/admin UI-only Linear-richting, zonder functionaliteit of gewone Budio-flow te wijzigen.
- Toegevoegde verbeteringen: gedeelde console primitives, AIQS-only footerdensity, AIQS-only web-shell verbreding, runtime-active chipfix.
- Afgerond: overview, group, task detail, draft, test en validate hebben een compactere console-laag; static checks, runtime UI-smoke en runtime smokes zijn groen.
- Open / blocked: taak blijft `in_progress` voor visuele user-review; geen technische blocker bekend.

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`


## Commits

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident