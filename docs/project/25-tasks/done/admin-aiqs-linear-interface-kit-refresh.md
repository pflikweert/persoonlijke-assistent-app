---
id: admin-aiqs-linear-interface-kit-refresh
title: Admin + AIQS Linear interface kit refresh
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-07-15
summary: "Budio admin en AIQS krijgen een gedeelde mode-aware admin-console laag op basis van de Linear-geinspireerde interface kit, zonder consumer-, backend- of datamodelwijzigingen."
tags: [admin, aiqs, ui, ux, linear-kit]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: [aiqs-admin-console-uiux-linear-richting]
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 5
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---










## Probleem / context

AIQS heeft al een eerste admin-console laag, maar de bredere adminroutes zoals adminrechten, regeneration en meeting capture gebruiken nog oude settings/surface-primitives en voelen daardoor niet als dezelfde tooling-omgeving. De geuploade Linear-geinspireerde interface kit beschrijft een compacte, mode-aware admin workspace met statuschips, metrics, inspectorpanelen, timelines en dense lists.

## Gewenste uitkomst

Budio admin en AIQS gebruiken een gedeelde admin-console componentlaag die desktop/tablet/mobile beter ondersteunt, zonder routes, dataflows, backendcontracten of consumer-schermen aan te passen.

## User outcome

Een founder/admin ervaart adminrechten, regeneration, meeting capture en AIQS als een samenhangende admin-console: compact, scanbaar, status-first en bruikbaar op desktop, tablet en mobiel.

## Functional slice

UI/UX-only migratie naar gedeelde admin-console primitives en route-specifieke admin shell-breedte voor bestaande admin/AIQS schermen.

## Entry / exit

- Entry: admin opent bestaande routes via settings/admin-menu of directe adminroute.
- Exit: bestaande routes en acties werken hetzelfde, maar delen dezelfde admin-console visual layer en responsive structuur.

## Happy flow

1. Admin opent AIQS overview en ziet metrics, families en utilities in console-layout.
2. Founder opent adminrechten en beheert capabilities in dense admin lists.
3. Admin opent regeneration en ziet status, metrics, selected steps en jobprogress als console panels.
4. Admin opent meeting capture placeholders en ziet admin-only shell zonder nieuwe recorderfunctionaliteit te suggereren.

## Non-happy flows

- Empty state: blijft zichtbaar via admin empty/error state wrappers.
- Permission denied / unavailable: denial states blijven expliciet en actiegericht.
- Validation / unsupported state: bestaande disabled states en foutmeldingen blijven behouden.
- Failure / retry / cancel: bestaande retry/refresh/delete/back acties blijven functioneel hetzelfde.

## UX / copy

- Mode-aware admin-console: dark mode krijgt de sterkste tooling-uitstraling; light mode blijft coherent.
- Geen exacte Linear-copy/assets.
- Copy blijft compact en operationeel.
- Geen nieuwe productclaims of feature-uitbreiding.
- Consumer-schermen blijven ongemoeid.

## Data / IO

- Input: bestaande admin/AIQS service responses, readmodels en route params.
- Output: dezelfde UI-acties en servicecalls als voorheen.
- Opslag/API/service/file-impact: geen backend, Supabase, services, types of datamodelwijzigingen.
- Statussen: bestaande live/draft/running/failed/completed/founder/capability states.

## Waarom nu

AIQS en adminrechten worden productie-relevant voor MVP-livegang. Een consistente admin-console vermindert beheerfrictie zonder productscope uit te breiden.

## In scope

- Shared admin console primitives uitbreiden.
- Route-specifieke web-shell verbreden voor adminroutes.
- Adminrechten, regeneration, meeting capture en AIQS bestaande UI migreren naar shared admin patterns.
- Responsive polish voor mobiel/tablet/desktop/wide.
- Static en runtime UI-verify.

## Buiten scope

- Consumer screens.
- Backend/API/schema/datamodel/services.
- Nieuwe dependencies.
- Nieuwe features, filters, command menu, boards, analytics of grafieken.
- Generated docs aanpassen binnen deze slice.

## Oorspronkelijk plan / afgesproken scope

Gebruiker vroeg om implementatie van het plan `Budio Admin + AIQS Linear Interface Kit Refresh`: gedeelde mode-aware admin-console laag op basis van de Linear-geinspireerde kit, alleen admin/AIQS en shared admin componenten, geen consumer screens, geen datamodel, geen nieuwe dependencies, geen flow-redesign en geen generated files.

## Expliciete user requirements / detailbehoud

- Alleen admin/AIQS interface en shared admin componenten.
- Geen consumentenschermen aanpassen.
- Geen datamodel-wijzigingen.
- Geen nieuwe dependencies.
- Geen redesign van flows; alleen bestaande pagina's beter structureren en stylen.
- Geen generated files aanpassen.
- Geen backend/API wijzigen.
- Geen feature-uitbreiding.
- Toekomstbestendige implementatie.
- Fase 1: shared componenten + tokens.
- Fase 2: admin pagina's toepassen.
- Fase 3: AIQS pagina's toepassen.
- Fase 4: responsive polish.

## Status per requirement

- [x] Alleen admin/AIQS interface en shared admin componenten — status: gebouwd
- [x] Geen consumentenschermen aanpassen — status: gebouwd; route-breedte alleen uitgebreid voor admin/AIQS route-prefixes.
- [x] Geen datamodel/backend/API/dependency wijzigingen — status: gebouwd; geen service-, Supabase-, schema- of package-wijziging binnen deze slice.
- [x] Shared admin componenten + tokens — status: gebouwd
- [x] Admin pagina's toepassen — status: gebouwd voor adminrechten, regeneration en meeting capture.
- [x] AIQS pagina's toepassen — status: gebouwd voor overview, group, detail, draft, test en validate binnen bestaande flowcontracten.
- [x] Responsive polish — status: gebouwd en gecontroleerd op mobile/tablet/desktop/wide.
- [x] Verify en runtime UI-smoke — status: gebouwd en bewezen.

## Toegevoegde verbeteringen tijdens uitvoering

- `AdminConsoleShell` ondersteunt nu optionele sidebar/inspector slots zodat toekomstige adminroutes dezelfde workspace-structuur kunnen gebruiken zonder nieuwe routecontracten.
- `AdminMetricCard`, `AdminInspectorPanel`, `AdminTimeline`, `AdminList`, `AdminActionBar`, `AdminEmptyState` en admin form wrappers zijn toegevoegd als gedeelde primitives.
- Browser-smoke is gecorrigeerd naar de canonieke AIQS family route keys `moments`, `today`, `week`, `month`; runtime-family keys zoals `day_journal` zijn geen group-route keys.
- Review/polishronde: de resterende AIQS-only `AdminStickyFooterActions`-duplicatie is vervangen door de gedeelde `AdminActionBar`.
- Review/polishronde: `AdminActionBar` heeft een optionele `floating` variant gekregen voor fixed footers met console-surface en safe-area padding; inline action bars blijven compact.
- Reviewbevinding: oude generieke admin layout-primitives (`AdminShell`, `SettingsTopNav`, `AdminPageHero`, `AdminMetaStrip`, `AdminSection`, `SurfaceSection`, `AdminStickyFooterActions`) komen niet meer voor in admin/AIQS routes. Alleen editor-specifieke settings-primitives blijven in AIQS waar ze inhoudelijk kloppen, zoals accordion/read-only/token editor helpers.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow, huidige file-state en kit-context bevestigen.
- [x] Blok 2: shared admin-console primitives en admin tokens uitbreiden.
- [x] Blok 3: adminrechten, regeneration en meeting capture migreren naar shared admin patterns.
- [x] Blok 4: AIQS schermen aanscherpen met metric/inspector/list/actionbar patterns.
- [x] Blok 5: responsive polish, static verify, runtime UI-smoke en taskflow afronden.

## Concrete checklist

- [x] Nieuwe taskfile aanmaken en plan vastleggen.
- [x] `admin-console-primitives` uitbreiden.
- [x] `theme/tokens.ts` admin subset toevoegen.
- [x] `app/_layout.tsx` adminroutes breder maken zonder consumer routes.
- [x] Adminrechten route + manager migreren.
- [x] Regeneration route migreren.
- [x] Meeting capture shell/routes migreren.
- [x] AIQS overview/detail/draft/test/validate polish toepassen.
- [x] Typecheck/lint/unit/smoke draaien.

## Acceptance criteria

- [x] Alle bestaande routes en acties blijven beschikbaar.
- [x] Geen nieuwe dependencies.
- [x] Geen backend/API/schema/datamodel wijziging.
- [x] Geen consumer UI regressie door root shell of shared primitive changes.
- [x] Adminroutes delen dezelfde console visual language.
- [x] Light en dark mode zijn beide bruikbaar.

## Blockers / afhankelijkheden

- Bestaande AIQS console WIP uit `aiqs-admin-console-uiux-linear-richting` is linked context.

## Verify / bewijs

- `npm run test:unit -- ai-quality-readmodel` — geslaagd, 1 testfile / 3 tests.
- `npm run typecheck` — geslaagd.
- `npm run lint` — geslaagd.
- `npm run taskflow:verify` — geslaagd.
- Review/polish verify:
  - `npm run typecheck` — geslaagd na actionbar-deduplicatie.
  - `npm run lint` — geslaagd na actionbar-deduplicatie.
  - Legacy primitive audit: geen hits meer voor oude generieke admin primitives in admin/AIQS routes.
  - Runtime footer-smoke via Playwright fallback: 16 checks geslaagd voor AIQS detail/draft/test/validate op mobile/desktop en light/dark; draft zonder lokale draft blijft bestaande non-happy state zonder actionbar.
- Runtime UI-smoke via Playwright fallback op `http://localhost:8081`:
  - 52 route/viewport checks geslaagd, geen hard errors.
  - Routes: AIQS overview, family `today/week/month`, task detail, draft, test, validate, adminrechten, regeneration, meeting capture overview/new/detail.
  - Viewports: 390px, 820px, 1280px, 1536px.
  - Dark-mode smoke: 10 route/viewport checks geslaagd voor AIQS, adminrechten, regeneration en meeting capture.
  - Screenshots opgeslagen onder `tmp/admin-ui-smoke/` voor lokale visuele inspectie.
- Visuele inspectie:
  - Light desktop/mobile: workspace + inspector op desktop, stacked op mobile, denial states zichtbaar.
  - Dark desktop/mobile: sterkere tooling-uitstraling zonder extra consumer-surface impact.
- `npm run docs:bundle` en `npm run docs:bundle:verify` bewust niet gedraaid binnen deze slice, omdat de user-scope expliciet zegt geen generated files aan te passen.

## Reconciliation voor afronding

- Oorspronkelijk plan: volledige admin/AIQS Linear kit refresh, UI-only.
- Toegevoegde verbeteringen: shared inspector/sidebar-ready shell, admin timeline/list/actionbar/form wrappers, en gecorrigeerde route-smoke voor canonieke AIQS family keys.
- Afgerond: shared primitives/tokens, adminroutes, AIQS overview/group/detail/draft/test/validate, responsive smoke, static verify en review/polishronde op resterende duplicatie.
- Open / blocked: geen technische blocker of resterend werk binnen deze iteratie. De gebruiker sluit de huidige visuele richting op 2026-07-15 bewust af, ondanks resterende ontevredenheid; eventuele verdere polish krijgt later alleen op expliciet verzoek een nieuwe taak.

## Relevante links

- `docs/project/ai-quality-studio.md`
- `/Users/pieterflikweert/Downloads/budio-linear-admin-interface-kit.zip`


## Commits

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state


- 2026-07-15T11:25:38+02:00 — feat: harden AIQS regeneration and close interface tasks
## Agent activity

- start 2026-07-15T08:42:46.489Z - Codex / gpt-5 / codex / default

- stop 2026-07-15T08:42:46.489Z -> 2026-07-15T08:43:42.207Z - Codex / gpt-5 / codex / default - reason: done
