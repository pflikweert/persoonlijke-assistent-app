---
id: aiqs-admin-console-uiux-linear-richting
title: AIQS admin console UI/UX Linear-richting
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
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
sort_order: 7
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
- Goedgekeurde cleaner AIQS-startdesign doorvoeren op alle onderliggende AI Quality Studio schermen.
- Alle zwarte/default/native buttons uit AIQS verwijderen en migreren naar één consistent Admin Button System.
- AIQS validatiepagina herontwerpen naar diff-first vergelijken en beoordelen: default `Diff`, tabs `Diff/Huidig/Nieuw`, AI-observaties, oordeel onderaan en shortcuts `1/2/3/4`.

## Status per requirement

- [x] Admin interface krijgt eigen look and feel — status: gebouwd
- [x] Gewone Budio gebruikersflow blijft ongemoeid — status: gebouwd
- [x] Linear-richting wordt vertaald naar compacte admin tooling — status: gebouwd
- [x] Interface wordt simpeler en duidelijker — status: gebouwd
- [x] Geen functionaliteit verwijderen of wijzigen — status: in code aanwezig maar nog user-review nodig
- [x] Nieuwe wijzigingen zijn gereviewd en getest — status: gebouwd
- [x] Goedgekeurde cleaner AIQS-startdesign doorvoeren op alle onderliggende AI Quality Studio schermen — status: gebouwd
- [x] Alle zwarte/default/native buttons uit AIQS verwijderen en migreren naar één consistent Admin Button System — status: gebouwd
- [x] AIQS validatiepagina diff-first maken voor lange outputvergelijkingen — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Gedeelde `admin-console-primitives` toegevoegd, zodat AIQS-schermen dezelfde compacte console-taal gebruiken zonder gewone Budio settings-flow te restylen.
- AIQS sticky footer compacter en neutraler gemaakt; deze primitive wordt momenteel alleen door AIQS-schermen gebruikt.
- Web app-shell route-specifiek verbreed voor `settings-ai-quality-studio*`, zodat AIQS desktopbreedte benut terwijl gewone Budio routes mobile-first blijven.
- Tijdens runtime-smoke een foutieve `Baseline`-chip op live families gevonden en gecorrigeerd naar `Runtime actief`.
- AIQS overview volgt nu expliciet de admin-workspace standaard: exact één globale statusbron, promptfamilies als primaire lijst en `Systeem` als secundaire utility-sectie.
- Gedeelde admin-primitives zijn uitgebreid met `AdminStatusNotice`, `AdminSectionList`, `AdminToggleRow` en rustigere panel/meta-varianten, zodat toekomstige admin-overviews minder dashboard-achtig hoeven op te bouwen.
- Debug logging is teruggebracht van groot utilityblok naar een compacte toggle-rij met optionele detailuitklap; flow-level toggles en TTL-beheer blijven intact.
- Dedicated AIQS/admin smoke-user `smoke.aiqs.local@example.com` toegevoegd aan de lokale auth smoke-flow, zodat admin-validatie los blijft van gallery/consumer smoke-users.
- Gedeelde Playwright helper voor local magic-link browser-login toegevoegd en hergebruikt door zowel AIQS- als gallery-smokes.
- AIQS local smoke kan nu zelf lokale dev starten, een ontbrekende AIQS internal token tijdelijk injecteren via functions env-restart, baseline importeren en daarna de geauthenticeerde browser-overview controleren.
- Lokale docs en env-templates verduidelijken nu het verschil tussen token/login-proof en echte browser-sessie, plus het fallbackpad wanneer `localhost:8081` of een internal token ontbreekt.
- AIQS startpagina verder opgeschoond naar een cleaner Linear-achtige admin workspace: header zonder governance-eyebrow, healthy status als inline chip, promptfamilies als rustige list/table en debug logging als single-action settings row.
- Shared admin-primitives uitgebreid met plain sections, inline status, list/table rows en single-action togglegedrag zodat toekomstige admin-overviews dezelfde rustige compositie kunnen hergebruiken.
- `docs/design/admin-ui-principles.md` toegevoegd als handmatige designrichtlijn voor Budio Admin UI Principles.
- De cleaner list-first/workspace-stijl is doorgetrokken naar AIQS group, task detail, draft editor, test en validate: minder header-badges/eyebrows, geen detail-inspector op task detail, plain secties voor metadata/context en minder runtime-duplicatie in rows.
- `AdminConsolePanel` heeft nu ook `variant="plain"` als gedeelde primitive voor onderliggende admin-workbenchschermen waar een functionele sectie nodig is zonder card-fill/border.
- AIQS admin actions zijn gehard naar één button-contract: `AdminConsoleButton` ondersteunt nu primary/secondary/danger/ghost, selected/full-width states en subtiele pressed/hover/focus states zonder zwarte primary-fill.
- Screen-local AIQS action-Pressables in draft en validate zijn vervangen door gedeelde admin button/text-action primitives; klikbare source/case rows blijven bewust rows.
- De raw HTML token-remove button in de prompt editor heeft nu expliciete browser-appearance reset, size, radius en hover/focus styling zodat native/default button styling niet kan lekken.
- `docs/design/admin-ui-principles.md` documenteert nu het gedeelde Admin Button System.
- AIQS validate is diff-first gemaakt: `Diff` is default, `Huidig` en `Nieuw` zijn tabs, per-veld `Toon diff` is verwijderd, lange output wordt per sectie vergeleken en mobile toont een stacked diffblok in plaats van twee volledige tekstkolommen onder elkaar.
- Validate toont nu lokale niet-normatieve AI-observaties zoals `uitgebreider`, `concreter` en `meer/minder brondekking`; deze zetten nooit automatisch een oordeel.
- Validate ondersteunt shortcuts `1/2/3/4` voor `beter/gelijk/slechter/fout`, met input/textarea/contenteditable guard.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante docs/taskflow/context bevestigen.
- [x] Blok 2: gedeelde admin-console primitive-laag toevoegen zonder gewone settings-primitives te breken.
- [x] Blok 3: AIQS overview en group flow omzetten naar compacte console IA.
- [x] Blok 4: task detail, draft, test en validate omzetten naar console/workbench-layout.
- [x] Blok 5: static verify, runtime UI-smoke, taskflow en docs-bundel afronden.

## Concrete checklist

- [x] Taskflow en linked runtime-context vastleggen.
- [x] Admin-console primitives toevoegen.
- [x] Overview compact maken met toolbar, statuschips, dense family rows en utility logging.
- [x] Group screen compact maken met contextbar, badges en dense task rows.
- [x] Task detail compact maken met contextbar, version list en admin actions.
- [x] Draft editor desktop split-layout geven.
- [x] Test en validate workbench-density verbeteren.
- [x] Goedgekeurde cleaner AIQS-startstijl doorvoeren naar onderliggende AIQS-schermen.
- [x] AIQS action buttons migreren naar één consistent Admin Button System zonder zwarte/default buttons.
- [x] Validate diff-first vergelijking, observaties en shortcuts toevoegen.
- [x] Light/dark en desktop/mobile visueel controleren waar praktisch.
- [x] Relevante verifies draaien.

## Acceptance criteria

- [x] AIQS gebruikt een eigen admin-console visual layer, niet alleen gewone settings-cards.
- [x] Overview, group, detail, draft, test en validate behouden bestaande functionaliteit.
- [x] Runtime drivers, technische varianten en read-only compound members zijn scanbaar als badges/states.
- [x] Desktop gebruikt breedte beter via dense rows/split/workbench-layout; mobile blijft bruikbaar stacked.
- [x] Debug logging en baseline import zijn visueel secundair/operationeel gepresenteerd.
- [x] Gewone Budio gebruikersflow is niet aangepast.
- [x] AIQS toont geen zwarte/default/native action buttons meer; button states komen uit gedeelde admin primitives.
- [x] AIQS validate toont standaard diff, heeft tabs `Diff/Huidig/Nieuw`, toont observaties zonder automatische beslissing en plaatst oordeel na vergelijking.

## Blockers / afhankelijkheden

- Linked context: `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`

## Verify / bewijs

- `npm run test:unit -- ai-quality-readmodel` — groen, 1 testfile / 3 tests.
- `npm run typecheck` — groen.
- `npm run lint` — groen.
- `npm run taskflow:verify` — groen.
- 2026-06-22 redesign verify:
  - `npm run typecheck` — groen na AIQS overview-herstructurering.
  - `npm run lint` — groen na AIQS overview-herstructurering.
  - `npm run taskflow:verify` — groen na taskfile-update.
  - Browser-smoke op `http://localhost:8081/settings-ai-quality-studio` blokkeerde eerst op `ERR_CONNECTION_REFUSED`; daarna is `npm run dev` gestart en laadde de webtarget weer op `http://localhost:8081`.
  - Playwright-navigatie naar AIQS redirectte daarna anoniem naar `/sign-in`, waardoor de nieuwe overviewstructuur niet volledig visueel bevestigd kon worden zonder extra lokale auth/bootstrap.
  - `npm run verify:local-aiqs-bootstrap` — faalde verwacht op ontbrekende shell-env `ADMIN_AI_QUALITY_INTERNAL_TOKEN` of `ADMIN_REGEN_INTERNAL_TOKEN`; bestaande verify-script zelf bevestigt daarmee de resterende lokale bootstrapvoorwaarde.
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
- 2026-06-22 local smoke hardening:
  - `npm run verify:local-aiqs-login` — groen; dedicated `smoke.aiqs.local@example.com`, founder + `ai_quality_studio` access bevestigd, runtime-baseline import groen en tijdelijke local-only AIQS internal token injectie/herstart bewezen.
  - `npm run verify:local-aiqs-smoke` — groen; script startte zelf `npm run dev`, logde browser echt in via Mailpit magic link, opende `/settings-ai-quality-studio`, valideerde de nieuwe workspace-first overview en navigeerde door naar `group/today`.
  - `npm run test:e2e:gallery:seed` — groen; lokale gallery fixture opnieuw gezaaid voor regressiecheck van gedeelde login-helper.
  - `npm run test:e2e:gallery:smoke` met verse `GALLERY_E2E_ENTRY_URL` en `GALLERY_E2E_PHOTO_IDS` uit de seed-run — groen; gedeelde local magic-link browser-login helper blijft compatibel met bestaande gallery smoke.
  - `npm run typecheck` — groen na AIQS smoke-hardening.
  - `npm run lint` — groen na AIQS smoke-hardening.
  - `npm run taskflow:verify` — groen na taskfile- en docs-aanvulling.
  - `npm run docs:bundle` — groen; bundles en uploadcontext opnieuw opgebouwd.
  - `npm run docs:bundle:verify` — groen.
- 2026-06-22 cleaner Linear-achtige AIQS workspace:
  - `npm run test:unit -- ai-quality-readmodel` — groen, 1 testfile / 3 tests.
  - `npm run typecheck` — groen na shared primitive- en AIQS-startpaginawijzigingen.
  - `npm run lint` — groen na shared primitive- en AIQS-startpaginawijzigingen.
  - `npm run verify:local-aiqs-smoke` — groen; AIQS overview opent geauthenticeerd, toont `Alle runtimes actief`, promptfamilies en systeemsectie, en navigeert naar `group/today`.
  - Playwright viewport-check desktop light/dark en mobile light/dark — groen; desktopkolommen `Naam`, `Omschrijving`, `Prompts`, `Draft`, `Actie` zichtbaar, mobile rows stacked, `Runtime actief` niet meer zichtbaar per healthy family.
  - Mobiele debug-row single-action check — groen; `Schakel in` zichtbaar en geen exacte `Aan`/`Uit` actieknoppen tegelijk.
  - Screenshotcheck `/tmp/aiqs-cleaner-desktop-light.png` en `/tmp/aiqs-cleaner-mobile-light.png` — gecontroleerd op rustige max-width, dividers, minder cardgevoel en leesbare mobile stacking.
  - `npm run taskflow:verify` — groen na cleaner workspace taskfile-update.
  - `npm run docs:bundle` — groen na admin UI principles doc en taskfile-update.
  - `npm run docs:bundle:verify` — groen.
- 2026-06-22 onderliggende AIQS-schermen cleaner doorgetrokken:
  - `npm run typecheck` — groen na group/detail/draft/test/validate en `AdminConsolePanel variant="plain"`.
  - `npm run lint` — groen na group/detail/draft/test/validate en shared primitive update.
  - `npm run test:unit -- ai-quality-readmodel` — groen, 1 testfile / 3 tests.
  - `npm run verify:local-aiqs-smoke` — groen; geauthenticeerde overview-smoke blijft werken en navigeert naar `group/today`.
  - One-shot Playwright subroute-smoke — groen; `group/today`, draft editor, test route, validate route en mobile group renderen; oude `Runtime metadata`, `Prompt editor`, `Runtime test` en `Compare workbench` labels zijn niet meer zichtbaar.
  - One-shot Playwright loaded-state check — groen; draft wacht op `Runtime contract`/`Geavanceerd`, test wacht op `Bron kiezen`.
  - One-shot Playwright dark-mode smoke — groen; `group/today` en validate renderen in dark mode.
  - Screenshotcheck: `/tmp/aiqs-subroute-group-desktop.png`, `/tmp/aiqs-subroute-group-mobile.png`, `/tmp/aiqs-subroute-draft-desktop-loaded.png`, `/tmp/aiqs-subroute-test-desktop-loaded.png`, `/tmp/aiqs-subroute-validate-desktop.png`, `/tmp/aiqs-subroute-group-dark.png`, `/tmp/aiqs-subroute-validate-dark.png`.
- 2026-06-22 AIQS Admin Button System cleanup:
  - `npm run typecheck` — groen na shared admin button API, AIQS action-migratie en prompt-editor button reset.
  - `npm run lint` — groen na shared admin button API, AIQS action-migratie en prompt-editor button reset.
  - `npm run test:unit -- ai-quality-readmodel` — groen, 1 testfile / 3 tests.
  - `npm run verify:local-aiqs-smoke` — groen; overview-smoke blijft geauthenticeerd werken en navigeert naar `group/today`.
  - Projectbrede audit op AIQS action-plekken — alleen toegestane source/case row-Pressables en prompt-editor token-remove `<button>` blijven over; token-remove heeft expliciete appearance reset.
  - One-shot Playwright computed-style routecheck — groen; overview, group, detail, draft, test, validate, mobile group, dark group en dark validate hebben geen zichtbare zwarte/default button backgrounds.
  - Screenshotcheck: `/tmp/aiqs-buttons-overview-light.png`, `/tmp/aiqs-buttons-group-light.png`, `/tmp/aiqs-buttons-detail-light.png`, `/tmp/aiqs-buttons-draft-light.png`, `/tmp/aiqs-buttons-test-light.png`, `/tmp/aiqs-buttons-validate-light.png`, `/tmp/aiqs-buttons-group-mobile.png`, `/tmp/aiqs-buttons-group-dark.png`, `/tmp/aiqs-buttons-validate-dark.png`.
- 2026-06-22 AIQS validate diff-first redesign:
  - `npx vitest run tests/unit/ai-quality-validate-compare.test.ts` — groen, 1 testfile / 5 tests.
  - `npm run test:unit -- ai-quality` — groen, 4 testfiles / 21 tests.
  - `npm run typecheck` — groen na validate compare-helper en routewijziging.
  - `npm run lint` — groen na validate compare-helper en routewijziging.
  - `npm run verify:local-aiqs-smoke` — groen; geauthenticeerde AIQS overview-smoke blijft werken.
  - One-shot Playwright validate-route diff-smoke — groen; `day_narrative` draft v16 test run gestart, `Diff` standaard zichtbaar, tabs `Diff/Huidig/Nieuw` zichtbaar, `AI observaties` en `Beslissing` zichtbaar, `Toon diff` afwezig, shortcut `1` selecteerbaar en mobile viewport blijft diff-first.
  - Screenshotcheck: `/tmp/aiqs-validate-diff-light.png`, `/tmp/aiqs-validate-diff-dark.png`, `/tmp/aiqs-validate-diff-mobile-dark.png`.

## Reconciliation voor afronding

- Oorspronkelijk plan: AIQS/admin UI-only Linear-richting, zonder functionaliteit of gewone Budio-flow te wijzigen.
- Toegevoegde verbeteringen: gedeelde console primitives, AIQS-only footerdensity, AIQS-only web-shell verbreding, runtime-active chipfix, workspace-first overviewstructuur met gedeelde status/toggle/list primitives, de doorvertaling van dezelfde cleaner designrichting naar group/detail/draft/test/validate, één consistent Admin Button System en een diff-first validatepagina voor lange outputvergelijkingen.
- Afgerond: AIQS overview gebruikt geen KPI-grid, geen AIQS-context inspector en geen runtime-governance dubbellaag meer; status, promptfamilies en systeemtools hebben nu een expliciete list-first hiërarchie. De startpagina is daarna verder versimpeld naar plain sections, inline status, list/table rows en single-action debug logging. Onderliggende AIQS-schermen gebruiken nu dezelfde rustige admin-workspace taal: minder header-badges/eyebrows, minder card-fill, metadata als plain secties en bestaande acties/functionele editors behouden. Alle AIQS action buttons lopen via gedeelde admin button/text-action primitives, primary gebruikt geen zwarte fill meer en de raw prompt-editor token button is browser-default-proof gemaakt.
- Open / blocked: geen technische blockers meer. Taak blijft `in_progress` totdat de gebruiker de cleaner AIQS referentie-implementatie inclusief onderliggende schermen inhoudelijk afvinkt of laat doorlopen naar bredere admin-standaardisatie.

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/design/admin-ui-principles.md`
- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`


## Commits

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-22T14:07:06+02:00 — fix: unify AIQS admin workspace controls

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state