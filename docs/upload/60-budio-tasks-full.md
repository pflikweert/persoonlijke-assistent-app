# DO NOT EDIT - GENERATED FILE

# Budio Tasks Full

Build Timestamp (UTC): 2026-04-24T18:42:06.530Z
Source Commit: c32c098

Doel: volledige uploadbundle met alle tasks uit `docs/project/25-tasks/open/**` en `docs/project/25-tasks/done/**`.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Brondirectories
- docs/project/25-tasks/open/**
- docs/project/25-tasks/done/**

## Telling
- Totaal tasks opgenomen: 33

## Leesregel
- Dit is een uploadartefact en geen canonieke bron voor repo-uitvoering.
- Canonieke taskfiles blijven de bron in `docs/project/25-tasks/**`.

---

## Actieve maandplanning herijkt naar transitiemaand

- Path: `docs/project/25-tasks/done/actieve-maandplanning-herijkt-naar-transitiemaand.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-19

```md
---
id: task-actieve-maandplanning-herijkt
title: Actieve maandplanning herijkt naar transitiemaand
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/20-planning/40-deviations-and-decisions.md
updated_at: 2026-04-19
summary: "Een compacte maandfocus waarin consumer beta bewijs, 1.2B, 1.2E en een smalle brugpilot expliciet prioriteit krijgen."
tags: [planning, transitiemaand]
workstream: idea
due_date: null
sort_order: 1
---


# Actieve maandplanning herijkt naar transitiemaand

## Probleem / context

De actieve planning leunde nog te veel op een generieke hardening/docs-focus en sloot niet meer goed aan op de huidige code-realiteit en de nieuwe researchrichting.

## Gewenste uitkomst

Een compacte maandfocus waarin consumer beta bewijs, 1.2B, 1.2E en een smalle brugpilot expliciet prioriteit krijgen.

## Waarom nu

- Deze koerswijziging moest eerst formeel vastliggen voordat vervolgtaken scherp konden worden aangestuurd.

## In scope

- Active phase herschrijven.
- Now/Next/Later herschrijven.
- Decision-log toevoegen.
- 12-maandenhorizon licht aanscherpen.

## Buiten scope

- Codewijzigingen.
- Brede Pro- of Business-roadmap activeren.

## Concrete checklist

- [x] Active phase herijkt.
- [x] Now/Next/Later herijkt.
- [x] Decision-log toegevoegd.
- [x] 12-maandenhorizon licht aangescherpt.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/20-planning/20-active-phase.md`
- `docs/project/20-planning/30-now-next-later.md`
- `docs/project/20-planning/40-deviations-and-decisions.md`
```

---

## Always-on taskflow enforcement (agent-onafhankelijk)

- Path: `docs/project/25-tasks/done/always-on-taskflow-enforcement-agent-onafhankelijk.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-always-on-taskflow-enforcement-agent-onafhankelijk
title: Always-on taskflow enforcement (agent-onafhankelijk)
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-23
summary: "Alle inhoudelijke agentsessies volgen verplicht de taskflow in docs/project/25-tasks, met hard verify-script, vaste outputstatus en duidelijke done-afronding."
tags: [workflow, tasks, governance]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

In de huidige workflow bestaan al task-afspraken, maar die worden niet overal en niet hard genoeg afgedwongen. Daardoor moet de gebruiker de taskflow opnieuw uitleggen en kan statusdrift ontstaan tussen uitvoering en taaklaag.

## Gewenste uitkomst

Elke inhoudelijke agentsessie (plan/research/bug/implementatie) loopt automatisch via een taskfile in `docs/project/25-tasks/**`, inclusief zichtbare status in updates/resultaten en een verplichte afrondflow naar `done` met docs-bundling verify.

## Waarom nu

- De gebruiker wil dit nooit meer per sessie hoeven herhalen.
- Workflowconsistentie is nodig over Cline/Codex/agentvarianten heen binnen deze repo.

## In scope

- Always-on policy expliciet en leidend vastleggen in `AGENTS.md`.
- Workflowdocs en skill aanscherpen naar verplichte taskflow.
- Hard guardrail script toevoegen (`taskflow:verify`) met duidelijke foutcodes/meldingen.
- Verifypaden opnemen in operationele docs.

## Buiten scope

- Externe tooling buiten repo-context hard afdwingen.
- Runtime-app features of API-contracten wijzigen.

## Concrete checklist

- [x] Taskflow-policy uitbreiden in AGENTS + docs/dev workflowdocs.
- [x] `task-status-sync-workflow` skill verplicht en expliciet maken.
- [x] `scripts/docs/verify-taskflow-enforcement.mjs` implementeren + npm script toevoegen.
- [x] Unit-tests toevoegen voor verifier/sortering van regels.
- [x] Docs bundle verify uitvoeren en taak afronden naar `done`.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:test`
- `npm run taskflow:verify`
- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/25-tasks/README.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
```

---

## Audio-instellingen testadvies stabiliseren en mic-selectie polish

- Path: `docs/project/25-tasks/done/audio-instellingen-testadvies-stabiliseren-en-mic-selectie-polish.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-audio-instellingen-testadvies-stabiliseren
title: Audio-instellingen testadvies stabiliseren en mic-selectie polish
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: chat
updated_at: 2026-04-23
summary: "Stabiliseer testadvies in audio-instellingen, laat advies staan na stop, voorkom layout-jitter met vaste advieshoogte en verbeter slider/microfoonselectie UX tijdens actieve test."
tags: [audio, settings, ux, web]
workstream: app
due_date: null
sort_order: null
---

## Probleem / context

De nieuwe audio-instellingen werken functioneel, maar het testadvies wisselt nog te snel, verdwijnt bij stop in sommige paden en de adviessectie veroorzaakt layout-verspringing. Daarnaast moet volume-aanpassing via slider-tap betrouwbaar blijven en microfoonwissel tijdens test direct merkbaar blijven.

## Gewenste uitkomst

Op het scherm Audio Instellingen is het advies tijdens testen rustiger en gebaseerd op langere sampleperiodes. Het eerste advies komt pas na voldoende spreektijd. Na stoppen blijft het laatste advies zichtbaar.

De advieszone heeft een vaste hoogte zodat onderliggende UI niet verspringt. Slider-tap en microfoonwissel tijdens actieve test blijven direct bruikbaar.

## Waarom nu

- Directe UX-frictie op een net opgeleverde flow die bedoeld is om microfoonproblemen op te lossen.

## In scope

- Advieslogica timing in `app/settings-audio.tsx` aanscherpen.
- Advies behouden na test-stop.
- Vaste adviescontainerhoogte + subtiele apply-link zonder layout jump.
- Slider tap-interactie en mic-switch tijdens test verifiëren en waar nodig corrigeren.
- Taskstatus en verify-output synchroon houden.

## Buiten scope

- Nieuwe audio processing pipelines buiten settings/test UI.
- Native-specifieke microfoonrouting buiten bestaande web-scope.

## Concrete checklist

- [x] Eerste advies pas tonen na langere initiële spreekperiode.
- [x] Adviesupdates minder frequent en op langer samplevenster.
- [x] Laatste advies behouden bij stop.
- [x] Adviesblok vaste hoogte geven om layout-verspringing te voorkomen.
- [x] Slider tap + mic-switch tijdens test smoke valideren.
- [x] `npm run lint` en `npm run typecheck` draaien en vastleggen.

## Statusnotitie

- Afgerond: code, verify en docs-bundles zijn uitgevoerd; taak is klaar voor archivering in `done/`.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Relevante links

- `app/settings-audio.tsx`
- `services/web-audio-input.ts`
- `docs/project/25-tasks/README.md`
```

---

## docs:bundle en docs:bundle:verify race condition structureel voorkomen

- Path: `docs/project/25-tasks/done/docs-bundle-en-verify-race-condition-voorkomen.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-docs-bundle-en-verify-race-condition-voorkomen
title: docs:bundle en docs:bundle:verify race condition structureel voorkomen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Voorkom structureel dat docs:bundle en docs:bundle:verify tegelijk kunnen draaien door een harde script-lock en expliciete workflowguardrail toe te voegen."
tags: [workflow, docs, verify, locking]
workstream: plugin
due_date: null
sort_order: 1
---

# docs:bundle en docs:bundle:verify race condition structureel voorkomen

## Probleem / context

`npm run docs:bundle` en `npm run docs:bundle:verify` kunnen nu tegelijk draaien. Daardoor kan `docs:bundle:verify` halverwege lezen terwijl `docs:bundle` nog bestanden herschrijft, met een misleidende fout als gevolg.

Dit is nu al meerdere keren gebeurd en moet structureel worden afgevangen, niet alleen als handmatige werkafspraak.

## Gewenste uitkomst

Parallelle bundelruns worden hard geblokkeerd met een duidelijke foutmelding. Daardoor kan `docs:bundle:verify` niet meer vals falen doordat `docs:bundle` nog bezig is.

Daarnaast staat in de workflow expliciet dat `docs:bundle` en `docs:bundle:verify` sequentieel moeten lopen.

## Waarom nu

- De fout is herhaald en veroorzaakt onnodige ruis tijdens verify.
- Het probleem zit in workflow-infra en is goedkoop structureel op te lossen.

## In scope

- Locking toevoegen rond `scripts/docs/build-docs-bundles.mjs`.
- Tests toevoegen voor de lockinglogica.
- Workflowdocs aanscherpen voor sequentiële docs-bundelruns.

## Buiten scope

- Brede herbouw van alle docs-scripts.
- Nieuwe queueing/orchestratie buiten deze bundelflow.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Locking toegevoegd zodat `docs:bundle` en `docs:bundle:verify` niet parallel kunnen draaien.
- [x] Tests toegevoegd voor lock/stale-lock gedrag.
- [x] Workflowdocs aangescherpt naar expliciet sequentiële docs-bundelruns.
- [x] Verify gedraaid.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `node --test scripts/docs/doc-bundle-lock.test.mjs` ✅
- `npm run taskflow:verify` ✅
- `npm run docs:bundle` ✅
- `npm run docs:bundle:verify` ✅

## Relevante links

- `scripts/docs/build-docs-bundles.mjs`
- `docs/dev/task-lifecycle-workflow.md`
- `docs/dev/cline-workflow.md`
```

---

## Entry photo gallery QA-basis: unit, smoke en end-user tests

- Path: `docs/project/25-tasks/done/entry-photo-gallery-qa-basis-unit-smoke-e2e.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-entry-photo-gallery-qa-basis
title: Entry photo gallery QA-basis: unit, smoke en end-user tests
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Zet een reproduceerbare QA-basis neer voor entry photo gallery: unit-tests voor sorteerhelpers, scripts voor smoke/full E2E en bewijsregels voor toekomstige gallery-wijzigingen."
tags: [qa, tests, gallery, photos, smoke]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

De thumbnail reorder-fix kon lint/typecheck bewijzen, maar niet de echte drag-interactie.
Voor complexe gallery-code is dat onvoldoende: nieuwe wijzigingen moeten snel regressies kunnen vangen en waar nodig volledige end-user interactie bewijzen.

## Gewenste uitkomst

Er is een eerste QA-basis voor de entry photo gallery:
snelle unit-tests voor complexe sorteerlogica, scripts voor gallery smoke/full tests, en duidelijke bewijsregels voor wanneer welke testlaag draait.

## Waarom nu

- De reorder-bug vraagt om herhaalbaar interactiebewijs.
- De helperextractie maakt unit-tests nu goedkoop.
- De 80% coverage-KPI moet starten bij nieuwe complexe code, niet wachten op een grote repo-brede testmigratie.

## In scope

- Vitest unit-testinfra voor gallery helperlogica.
- Coverage-script voor unit-tests.
- Playwright scriptnamen/configbasis voor gallery smoke/full E2E.
- Unit-tests voor sorteren, clampen en drag target berekening.
- Workflow/skill/AGENTS-regels voor smoke versus full E2E en unit-tests bij complexe code.

## Buiten scope

- Volledige local Supabase seed/cleanup voor alle gallery E2E-flows als die te groot wordt voor deze basis.
- Native iOS/Android E2E.
- Repo-brede 80% coverage gate voor legacy code.
- Productwijzigingen aan gallery UX.

## Concrete checklist

- [x] Test-task aanmaken en taskflow correct zetten.
- [x] Vitest + coverage scripts toevoegen.
- [x] Gallery helper unit-tests toevoegen.
- [x] Playwright smoke/full scripts en basisconfig toevoegen.
- [x] QA-workflowregels vastleggen in AGENTS/skills/docs.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen blockers meer voor deze basislaag.
- Volledige add/delete/error end-user coverage blijft bewust een vervolgstap bovenop de nieuwe smoke-basis.

## Verify / bewijs

- ✅ `npm run test:unit` (8 tests geslaagd op 2026-04-23)
- ✅ `npm run test:unit:coverage` (100% coverage voor gallery sorting helpers op 2026-04-23)
- ✅ `npm run test:e2e:gallery:seed` (lokale fixture aangemaakt op 2026-04-23)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-23 met local magic-link login en touch-drag reorder naar links)
- ✅ `npm run test:e2e:gallery:cleanup` (lokale fixture opgeschoond op 2026-04-23)
- ✅ `npm run test:e2e:gallery:full` (script draait; 1 test geskipt omdat `GALLERY_E2E_FULL=1` en seed/cleanup helpers nog ontbreken)
- ✅ `npm run lint` (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` (geslaagd op 2026-04-23)
- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-23)

## Relevante links

- `src/lib/entry-photo-gallery/sorting.ts`
- `components/journal/entry-photo-gallery.tsx`
- `docs/dev/local-auth-smoke-workflow.md`
- `AGENTS.md`
```

---

## GitHub Actions Node 24 hardening en lokale Node-align

- Path: `docs/project/25-tasks/done/github-actions-node24-hardening-en-lokale-node-align.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-github-actions-node24-hardening-en-lokale-node-align
title: GitHub Actions Node 24 hardening en lokale Node-align
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Upgrade GitHub Actions naar Node-24-compatibele action-versies, verwijder waar passend de tijdelijke force-flag, en draai de repo-install/verify lokaal onder Node 24."
tags: [github, actions, node, npm, hardening]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

De diagnose bevestigde dat deploys nu slagen, maar GitHub Actions nog warnings geeft omdat `actions/checkout@v4` en `actions/setup-node@v4` intern nog Node 20 targeten. Die draaien nu dankzij `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`.

Daarnaast draaide de lokale shell op Node 25 terwijl de repo expliciet Node 24 vereist.

## Gewenste uitkomst

GitHub workflows gebruiken actuele Node-24-compatibele action-versies, zodat de tijdelijke warning-constructie niet meer nodig is of minimaal kan worden heroverwogen. De repo is lokaal opnieuw gecontroleerd onder Node 24.

## Waarom nu

- De warning is al bevestigd met GitHub brondata.
- Nieuwe action-versies bestaan al.
- Lokale Node 25 vergroot kans op install- en lockfile-drift.

## In scope

- `.github/workflows/deploy.yml` en `.github/workflows/secret-scan.yml` upgraden naar moderne action-versies.
- Tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` verwijderen als dat na de upgrade niet meer nodig is.
- Relevante lokale verify onder Node 24 draaien.

## Buiten scope

- Npm audit vulnerabilities inhoudelijk oplossen.
- Grote dependency-upgrades buiten de action-versies.
- Productcode wijzigen.

## Concrete checklist

- [x] Taskflow gestart en taskfile bovenaan in_progress gezet.
- [x] GitHub Actions upgraden naar Node-24-compatibele versies.
- [x] Tijdelijke force-flag heroverwegen en verwijderen waar veilig.
- [x] Lokale Node 24 verify draaien.
- [x] Docs/taskflow verify afronden.

## Blockers / afhankelijkheden

- Geen blockers.

## Verify / bewijs

- ✅ `node -v` / `npm -v` onder Node 24 (`v24.15.0` / `11.12.1` op 2026-04-23)
- ✅ `npm install` onder Node 24 (geslaagd op 2026-04-23; audit-summary blijft 14 vulnerabilities)
- ✅ `npm run check:node-version` onder Node 24 (geslaagd op 2026-04-23)
- ✅ `npm run lint` onder Node 24 (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` onder Node 24 (geslaagd op 2026-04-23)
- ✅ Workflow-upgrade uitgevoerd: `actions/checkout@v6`, `actions/setup-node@v6`, tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` verwijderd
- ⏳ Post-push GitHub warning-check nog niet opnieuw bewezen in een nieuwe run
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `.github/workflows/deploy.yml`
- `.github/workflows/secret-scan.yml`
- `.nvmrc`
- `package.json`
```

---

## GitHub deployment Node/NPM-versie diagnose

- Path: `docs/project/25-tasks/done/github-deployment-node-npm-versie-diagnose.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-github-deployment-node-npm-versie-diagnose
title: GitHub deployment Node/NPM-versie diagnose
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Zoek bron-first uit of de lokale Node/NPM-versie, GitHub Actions Node 24 instelling of npm install gedrag opnieuw deployment-risico vormt, en bepaal pas daarna of een backlogtask nodig is."
tags: [github, deployment, node, npm, diagnostics]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

Tijdens lokale testinfra-installatie draaide de machine op Node 25.8.0 terwijl de repo `node: 24.x` vereist. Eerder was er vermoedelijk een GitHub deployment-melding rond Node/NPM of GitHub Actions runtime opgelost met een extra instelling.

We moeten bron-first bepalen of er nu nog een echt deployment-risico is, en of lokaal of in GitHub iets aangepast moet worden.

## Gewenste uitkomst

Er ligt een korte diagnose met:
- actuele repo Node/NPM-config
- actuele GitHub Actions deployment-config
- relevante recente GitHub run/check bewijzen
- advies: niets doen, lokaal naar Node 24 terug, GitHub configuratie aanpassen, of aparte backlogtask maken

## Diagnose

Bevestigd op 2026-04-23:
- Repo vraagt Node 24 via `.nvmrc` (`24`) en `package.json` engines (`24.x`).
- Lokale shell draaide tijdens installatie op Node `v25.8.0` met npm `11.11.0`.
- `npm run check:node-version` faalt lokaal terecht zolang Node 25 actief is.
- GitHub Deploy Supabase Functions gebruikt `actions/setup-node@v4` met `node-version-file: .nvmrc`; recente deploy-run gebruikte Node `24.15.0` en npm `11.12.1`.
- GitHub workflows bevatten `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"`, de eerder bedoelde tijdelijke instelling.
- Recente deploy-run `24810626440` is `success`.
- Recente secret-scan run `24811218494` is `success`.
- GitHub annotation is een warning, geen failure: `actions/checkout@v4` en in deploy ook `actions/setup-node@v4` targeten Node 20 maar worden geforceerd op Node 24.
- GitHub changelog zegt dat Node 20 EOL is en dat GitHub runners vanaf juni 2026 Node 24 standaard gaan gebruiken; gebruikers moeten workflows updaten naar action-versies die Node 24 ondersteunen.
- Officiële nieuwste action releases bestaan: `actions/checkout@v6.0.2` en `actions/setup-node@v6.4.0`.

Conclusie: deployment wordt nu niet geblokkeerd door NPM/Node. Het echte resterende punt is een workflow-warning/hardening: upgrade GitHub Actions van v4 naar v6 en evalueer daarna of de tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` vlag nog nodig is.

## Waarom nu

- Nieuwe npm devDependencies zijn toegevoegd voor testinfra.
- Lokale Node 25 kan lockfile/install-gedrag beïnvloeden.
- Deployment-risico's moeten niet op gevoel maar op GitHub/checkrun-bewijs beoordeeld worden.

## In scope

- `.nvmrc`, `package.json`, `.github/workflows/**` en npm-config inspecteren.
- Recente GitHub Actions/checkruns via `gh` inspecteren.
- Alleen een nieuwe backlogtask maken als er daadwerkelijk werk uit de diagnose volgt.

## Buiten scope

- Direct dependency-upgrades of npm-audit fixes uitvoeren.
- GitHub workflow aanpassen zonder expliciet besluit na diagnose.
- Productcode wijzigen.

## Concrete checklist

- [x] Repo Node/NPM-config inspecteren.
- [x] GitHub workflow-config inspecteren.
- [x] Recente GitHub run/checkrun via `gh` inspecteren.
- [x] Diagnose en advies vastleggen.
- [x] Alleen indien nodig vervolgtaak/backlogtask maken.

## Blockers / afhankelijkheden

- Geen blockers.

## Verify / bewijs

- ✅ `gh run list --repo pflikweert/persoonlijke-assistent-app --limit 12`
- ✅ `gh api repos/pflikweert/persoonlijke-assistent-app/check-runs/72616314178/annotations`
- ✅ `gh run view 24810626440 --repo pflikweert/persoonlijke-assistent-app --json ...`
- ✅ `gh run view 24810626440 --repo pflikweert/persoonlijke-assistent-app --log`
- ✅ `gh api repos/actions/checkout/releases/latest` (`v6.0.2`)
- ✅ `gh api repos/actions/setup-node/releases/latest` (`v6.4.0`)
- ✅ `npm run check:node-version` faalt lokaal op Node `v25.8.0`, zoals bedoeld
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `.github/workflows/deploy.yml`
- `.github/workflows/secret-scan.yml`
- `.nvmrc`
- `package.json`
```

---

## Lokale auth smoke workflow hardenen (magic-link + Mailpit)

- Path: `docs/project/25-tasks/done/local-auth-smoke-hardening-workflow.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-local-auth-smoke-hardening
title: Lokale auth smoke workflow hardenen (magic-link + Mailpit)
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "Lokale magic-link loginflow reproduceerbaar gemaakt met smoke-user profielen, verify-link extractie, login-proof script en veilige local-only cleanup voor smoke users."
tags: [auth, smoke-test, local, mailpit]
workstream: app
due_date: null
sort_order: 3
---

# Lokale auth smoke workflow hardenen (magic-link + Mailpit)

## Probleem / context

De lokale smoke test flow had wel losse auth/mail checks, maar geen complete, reproduceerbare magic-link loginflow voor UI smoke tests.

## Gewenste uitkomst

Een vaste local-only auth smoke workflow waarmee een agent of developer veilig kan inloggen en daarna end-to-end UI smoke tests kan doen (zoals entry-detail galerijchecks), zonder runtime auth-bypass.

## Waarom nu

- Recente UI smoke checks liepen vast op login/onboarding handwerk.
- Er was behoefte aan een vaste smoke-user strategie (`default`/`clean`/`new`) en lokale cleanup om testvervuiling te beperken.

## In scope

- Magic-link verify-link extractie uit Mailpit.
- Volledige local auth login-proof script.
- Smoke-user profielstrategie (default/clean/new).
- Veilige local-only cleanup voor herkenbare smoke users.
- Compacte workflowdocumentatie onder `docs/dev/`.

## Buiten scope

- Productie/staging Mailtrap automatisering.
- Runtime auth shortcuts of test-backdoors.
- Niet-auth functionele UI-redesigns.

## Concrete checklist

- [x] Shared local auth smoke utils toegevoegd (`scripts/_shared/local-auth-smoke-utils.mjs`).
- [x] Verify-link extractie script toegevoegd (`scripts/get-local-magic-link.mjs`).
- [x] Login-proof script toegevoegd (`scripts/verify-local-auth-login.mjs`).
- [x] Local-only cleanup script toegevoegd (`scripts/cleanup-local-smoke-users.mjs`).
- [x] Bestaande auth-mail verify script uitgebreid met smoke-user profielen.
- [x] npm scripts toegevoegd voor auth smoke tooling.
- [x] Workflowdocumentatie toegevoegd (`docs/dev/local-auth-smoke-workflow.md`).

## Blockers / afhankelijkheden

- Lokale Supabase stack + Mailpit moeten draaien.
- `APP_SUPABASE_SERVICE_ROLE_KEY` vereist voor cleanup script.

## Verify / bewijs

- `npm run typecheck`
- `npm run lint`
- `npm run verify:local-auth-mail`
- `npm run verify:local-auth-login`

## Relevante links

- `scripts/verify-local-auth-mail.sh`
- `scripts/get-local-magic-link.mjs`
- `scripts/verify-local-auth-login.mjs`
- `scripts/cleanup-local-smoke-users.mjs`
- `docs/dev/local-auth-smoke-workflow.md`
```

---

## Moment detail foto's toevoegen met beveiligde galerij (max 5)

- Path: `docs/project/25-tasks/done/moment-entry-fotos-galerij-beveiligde-upload.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-moment-entry-fotos-galerij
title: Moment detail foto's toevoegen met beveiligde galerij (max 5)
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "Op de moment detailpagina een rustige fotoflow toevoegen: camera/upload, veilige opslag per user, featured thumbnail onder samenvatting (alleen bij foto), galerij onderaan, fullscreen swipe en verwijderen met bevestiging."
tags: [moment-detail, photos, security, ui]
workstream: app
due_date: null
sort_order: 2
---

# Moment detail foto's toevoegen met beveiligde galerij (max 5)

## Probleem / context

De moment detailweergave ondersteunt nu tekst/audio, maar nog geen foto's per moment.
Gebruikers moeten veilig eigen momentfoto's kunnen toevoegen en terugzien zonder dat andere users toegang hebben.

## Gewenste uitkomst

Een compacte fotoflow op moment detail met maximaal 5 foto's per moment.
Als er nog geen foto's zijn toont de UI een rustige empty state met duidelijke upload-CTA.

Bij aanwezige foto's toont de pagina een rustige featured afbeelding onder de samenvatting en een galerij met thumbnails.
Foto's openen fullscreen met swipe en sluit-actie; verwijderen gaat via bestaand confirm-sheet patroon.

## Waarom nu

- Deze flow maakt momentdetail completer zonder scope-uitbreiding buiten MVP-randen.
- Security en multi-user afscherming moeten direct goed staan (owner-only + ingelogd verplicht).

## In scope

- Supabase opslag + metadata voor momentfoto's (private bucket + owner-only policies).
- Upload via camera of bibliotheek, met max 5 foto's per moment.
- On-device resize/compressie (display + thumbnail) vóór upload.
- UI in moment detail: empty state, featured image, thumbnail-galerij, fullscreen viewer, verwijderen met confirm.

## Buiten scope

- Delen/public links.
- Extra varianten/captions/albumbeheer.
- Reordering van foto's.

## Concrete checklist

- [x] Taskfile aangemaakt en status op `in_progress` gezet.
- [x] Schema + policies voor `entry_photos` en private bucket toegevoegd.
- [x] Service-laag voor upload/list/delete + signed URLs toegevoegd.
- [x] Moment detail UI met fotocomponent en confirm-delete aangesloten.
- [x] Layout/polish ronde: audio-sectie behouden, featured thumbnail los bovenin, upload/galerij-sectie onderaan.
- [x] Fullscreen viewer polish: grotere beeldruimte, sluitknop overlay rechtsboven, delete-actie onderaan, swipe-index/teller gesynchroniseerd.
- [x] Overlay-volgorde fix: delete-confirm verschijnt voorgrond i.p.v. achter viewer.
- [x] Verify gedraaid (lint/typecheck) en status bijgewerkt.

## Blockers / afhankelijkheden

- Geen functionele blockers; afhankelijk van lokale Supabase migration apply en verify-run.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- UI smoke op moment detail in dark + light mode

## Relevante links

- `app/entry/[id].tsx`
- `services/day-journals.ts`
- `supabase/migrations/20260422153000_entry_photos_gallery.sql`
```

---

## Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen

- Path: `docs/project/25-tasks/done/moment-fotoviewer-swipe-zoom-en-markdown-weergave.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-moment-fotoviewer-swipe-zoom-markdown
title: Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "De fullscreen momentfoto-viewer op mobiel slimmer laten snappen per swipe, pinch-to-zoom op de foto zelf ondersteunen, en gedeelde dag-/momenttekstblokken markdownstructuur display-only laten weergeven."
tags: [moment-detail, photos, markdown, ui, mobile]
workstream: app
due_date: null
sort_order: 3
---

# Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen

## Probleem / context

De fullscreen fotoviewer op mobiel schiet bij swipen soms door naar een onbedoelde foto en ondersteunt nog geen pinch-to-zoom op de foto zelf.
Daarnaast tonen de gedeelde dag- en momenttekstcomponenten markdown nu nog als ruwe plain text, terwijl de inhoud baat heeft bij herkenbare structuur.

## Gewenste uitkomst

De fotoviewer voelt op mobiel beheerst en direct aan: per swipe land je op de bedoelde vorige of volgende foto, en ingezoomde foto's kun je lokaal pinchen en pannen zonder dat de browser of pagina zelf gaat zoomen.

Dag- en momenttekst tonen markdownstructuur display-only via gedeelde componenten, zodat koppen, lijsten, quotes en inline nadruk leesbaar terugkomen zonder editoruitbreiding.

## Waarom nu

- De huidige fullscreen interactie voelt onrustig en haalt vertrouwen uit de galerij-ervaring.
- Markdownstructuur verbetert leesbaarheid van bestaande output zonder scope-uitbreiding naar bewerken of rich-text authoring.

## In scope

- Slimmere fullscreen paging voor momentfoto's met single-step snap per swipe.
- Gedeelde zoomable slide met pinch-to-zoom, pan en paging-lock terwijl ingezoomd.
- Gedeelde display-only markdown-rendering voor day/moment summary- en narrativeblokken.
- Taskflow/documentatie/verify voor deze wijziging.

## Buiten scope

- Reordering, captions of delen van foto's.
- Markdown bewerken, HTML-rendering of volledige rich-text editor.
- Wijzigingen aan foto-authtransport of schema's.

## Concrete checklist

- [x] Taskfile aangemaakt voor deze UX/rendering-taak.
- [x] Fullscreen viewer aangepast naar momentum-end snap met begrensde stapgrootte.
- [x] Gedeelde zoomable photo slide toegevoegd met pinch/pan en paging-lock bij zoom.
- [x] Gedeelde markdown displaycomponent toegevoegd voor journaltekst.
- [x] Summary/narrative shared wrappers gekoppeld aan markdown-rendering.
- [x] Current status licht bijgewerkt voor de nieuwe runtime-capabilities.
- [x] Verify gedraaid (`npm run lint`, `npm run typecheck`, `npm run docs:bundle`, `npm run docs:bundle:verify`); `npm run docs:lint` is ook uitgevoerd maar faalt op al bestaande, niet-gerelateerde docsissues.

## Blockers / afhankelijkheden

- Geen functionele blockers.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run docs:lint` (faalt op al bestaande issues in `docs/project/25-tasks/done/local-auth-smoke-hardening-workflow.md` en `docs/project/25-tasks/open/niet-vergeten.md`)
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `components/journal/entry-photo-gallery.tsx`
- `components/ui/zoomable-photo-slide.tsx`
- `components/ui/markdown-display.tsx`
```

---

## OpenAI Codex Automations en AI use-case scaling vertalen naar ideeën

- Path: `docs/project/25-tasks/done/openai-codex-automations-en-ai-use-case-scaling-vertalen-naar-ideeen.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-openai-codex-automations-en-ai-use-case-scaling-vertalen-naar-ideeen
title: OpenAI Codex Automations en AI use-case scaling vertalen naar ideeën
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-24
summary: "Nieuwe OpenAI-bronnen over codex automations en use-case scaling vertalen naar concrete Budio-ideeën, met strategische én repo-uitvoeringsrelevantie."
tags: [idea, strategy, agents, openai]
workstream: idea
due_date: null
sort_order: 1
---

# OpenAI Codex Automations en AI use-case scaling vertalen naar ideeën

## Probleem / context

Er zijn twee nieuwe externe bronnen die zowel strategisch (AI use-case selectie/schaal) als operationeel (agent-automations in repo-flow) relevant kunnen zijn. Zonder expliciete vertaling blijven het losse links.

## Gewenste uitkomst

Minstens één bestaand idee in `docs/project/40-ideas/**` is bijgewerkt (of een nieuw idee is toegevoegd) met concrete, afgebakende learnings uit beide bronnen.

## Waarom nu

- Sluit aan op actieve ideeën rond AIQS, plugin en operating system.
- Maakt volgende keuzes rond planning/uitvoering sneller en evidence-first.

## In scope

- Beide OpenAI-bronnen lezen en kernpunten extraheren.
- Vertaling naar Budio-context voor strategie + repo-uitvoering met agents.
- Idea-docs en taskfile bijwerken, inclusief verify-stappen.

## Buiten scope

- Directe implementatie van nieuwe automations/features.
- Wijzigen van canonieke productscope zonder apart besluit.

## Concrete checklist

- [x] Bron 1 (Codex Automations) samengevat met relevante inzichten.
- [x] Bron 2 (Identifying and scaling AI use cases) samengevat met relevante inzichten.
- [x] Bestaand idee bijgewerkt of nieuw idee toegevoegd met concrete vertaling.
- [x] Docs/taskflow verify uitgevoerd.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `https://openai.com/academy/codex-automations/`
- `https://openai.com/business/guides-and-resources/identifying-and-scaling-ai-use-cases/`
```

---

## OpenAI Privacy Filter-idee vertalen naar Budio privacyplan

- Path: `docs/project/25-tasks/done/openai-privacy-filter-idee-vertalen-naar-budio-privacyplan.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-openai-privacy-filter-idee-vertalen-naar-budio-privacyplan
title: OpenAI Privacy Filter-idee vertalen naar Budio privacyplan
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-24
summary: "We vertalen concrete inzichten uit OpenAI Privacy Filter naar een bestaand Budio privacy-idee, met focus op haalbare privacy-by-design stappen zonder scope creep."
tags: [idea, privacy, openai, security]
workstream: idea
due_date: null
sort_order: 1
---

# OpenAI Privacy Filter-idee vertalen naar Budio privacyplan

## Probleem / context

Er is een concrete externe privacy-ontwikkeling (OpenAI Privacy Filter) die relevant kan zijn voor Budio. Zonder expliciete vertaling naar onze eigen ideelaag blijft dit losse inspiratie in plaats van bruikbare richting.

## Gewenste uitkomst

Een bestaand privacy/security-idee in `docs/project/40-ideas/**` is bijgewerkt met de belangrijkste lessen uit de OpenAI Privacy Filter release, inclusief wat direct bruikbaar is, wat eerst gevalideerd moet worden, en wat bewust buiten scope blijft.

## Waarom nu

- Directe aansluiting op lopende privacy- en trust-ideeën.
- Lage implementatiekosten: dit is documentatie/idee-verfijning, geen productbouw.

## In scope

- OpenAI Privacy Filter release samenvatten op kernpunten voor Budio.
- Bestaande privacy-ideedoc aanvullen met concrete leerpunten en vervolgstap.
- Taskfile en docs-flow netjes bijwerken volgens taskflow.

## Buiten scope

- Product- of code-implementatie van een nieuwe redactiepipeline.
- Nieuwe AIQS-features of runtime-architectuurwijzigingen.
- Juridische/compliance claims buiten wat de bron expliciet ondersteunt.

## Concrete checklist

- [x] Relevante bron gelezen en kernclaims verzameld.
- [x] Bestaand idee bijgewerkt met concrete, scoped learnings.
- [x] Verify/scripts uitgevoerd volgens docs-taskflow.

## Blockers / afhankelijkheden

- Geen; broninhoud is beschikbaar.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/40-ideas/40-platform-and-architecture/50-security-posture-and-continuous-hardening.md`
- `https://openai.com/index/introducing-openai-privacy-filter/`
```

---

## Plugin drag-drop sortering in board en list herstellen

- Path: `docs/project/25-tasks/done/plugin-drag-drop-sortering-board-en-list-herstel.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: plugin-drag-drop-sortering-board-en-list-herstel
title: Plugin drag-drop sortering in board en list herstellen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: ad-hoc user request
updated_at: 2026-04-23
summary: "Herstel een regressie waarbij slepen/sorteren van tasks met de muis niet meer werkt in board en list view."
tags: [plugin, ui, bugfix]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

In de Budio Workspace plugin werkt drag-and-drop sortering met de muis niet meer, zowel in board view als list view.

## Gewenste uitkomst

Taken moeten weer met de muis versleept kunnen worden in board én list view, inclusief statusverplaatsing en herordening.

## Waarom nu

- Het blokkeert directe prioritering en workflow in de plugin.

## In scope

- Oorzaakanalyse van drag/drop blokkade.
- Gerichte fix in webview UI logica.
- Verify + plugin apply + taskflow/docs checks.

## Buiten scope

- Geen redesign of nieuwe interactiepatronen.

## Concrete checklist

- [x] Regressieoorzaak isoleren in drag/drop conditions
- [x] Drag/drop in board en list herstellen
- [x] Verify + apply + docs/taskflow afronden

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run typecheck`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run apply:workspace`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle:verify`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`
```

---

## Plugin task classification filters en manual prio actions

- Path: `docs/project/25-tasks/done/plugin-task-classification-filters-en-manual-prio-actions.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: plugin-task-classification-filters-en-manual-prio-actions
title: Plugin task classification filters en manual prio actions
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: ad-hoc user request
updated_at: 2026-04-23
summary: "Leg expliciete task-classificatie vast in template/instructies en toon/filter deze in de plugin, plus subtiele manual sort acties in de list view om een taak direct bovenaan of onderaan te zetten."
tags: [plugin, tasks, ui, workflow]
workstream: plugin
due_date: null
sort_order: 4
---

## Probleem / context

Task tags zijn al bruikbaar, maar er ontbreekt een expliciet en uniform onderscheid tussen werk aan ideeën, de Budio Workspace plugin, de Budio App en AIQS. Daardoor is die context niet consistent vastgelegd in taskfiles, niet goed filterbaar in de plugin en niet visueel duidelijk op task cards en in de list view.

Daarnaast ontbreekt in de list view een snelle manual-sort actie om een taak direct naar de top of bodem van de prioriteitsvolgorde te sturen.

## Gewenste uitkomst

Taskfiles krijgen een expliciete classificatie in template en instructies. De plugin toont deze classificatie zichtbaar in cards en list rows, en biedt filteropties hiervoor in board en list view. In de list view komen twee subtiele acties om een taak direct bovenaan of onderaan de manual sort order van zijn lane/status te zetten, met persistente opslag.

## Waarom nu

- Dit verbetert task-overzicht, routing en focus direct in de dagelijkse plugin-workflow.

## In scope

- Task template + relevante workflow-instructies voor verplichte/aanbevolen task-classificatie.
- Parser/types/writer-uitbreiding voor nieuwe task-classificatie.
- Board/list visualisatie en filtering in de plugin.
- List view manual sort quick actions (top/bottom) inclusief opslag.

## Buiten scope

- Geen volledige redesign van de plugin.
- Geen nieuwe task-statussen of nieuwe sortmodi buiten manual-sort hulpacties.

## Concrete checklist

- [x] Bepaal en documenteer het task-classificatieveld voor template/instructies
- [x] Voeg parsing/types/writing support toe in plugin task-model
- [x] Toon classificatie visueel in board cards en list view
- [x] Voeg classificatie-filters toe in board en list view
- [x] Voeg subtiele top/bottom manual sort actions toe in list view en sla deze op
- [x] Verify + docs/taskflow afronden

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run typecheck`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run apply:workspace`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle:verify`

## Relevante links

- `docs/project/25-tasks/_template.md`
- `AGENTS.md`
- `tools/budio-workspace-vscode/src/tasks/types.ts`
- `tools/budio-workspace-vscode/src/tasks/parser.ts`
- `tools/budio-workspace-vscode/src/tasks/writer.ts`
- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
```

---

## Plugin task overview line en detail hero sticky fix

- Path: `docs/project/25-tasks/done/plugin-task-overview-line-en-detail-hero-sticky-fix.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: plugin-task-overview-line-en-detail-hero-sticky-fix
title: Plugin task overview line en detail hero sticky fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: ad-hoc user request
updated_at: 2026-04-23
summary: "Task overview list rail staat weer links naast titel/description; detail-pane header+hero blijven zichtbaar tijdens scroll, met kleinere titel en extra gap naar het Titel-label."
tags: [plugin, ui, bugfix]
workstream: plugin
due_date: null
sort_order: null
---

## Probleem / context

In de Budio Workspace VS Code plugin stond in het task overview list-scherm de statuslijn visueel niet netjes links naast titel en description. Daarnaast verdween in task detail de header/hero uit beeld bij scroll, terwijl die zichtbaar moest blijven.

## Gewenste uitkomst

De list-rij toont de accentlijn stabiel links naast titel + description (niet erboven). In task detail blijft de header/hero zichtbaar tijdens scroll (sticky gedrag), is de hero-titel kleiner, en zit er meer ruimte tussen hero en het veldlabel `Titel`.

## Waarom nu

- Dit was een expliciete UI-bugfix met directe impact op leesbaarheid en gebruiksgemak in de plugin.

## In scope

- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/styles.css`
- UI-layout en styling voor overview list + detail hero.

## Buiten scope

- Geen functionele wijzigingen in task data, sortering of DnD-logica.
- Geen bredere redesign of nieuwe featureflow.

## Concrete checklist

- [x] Relevante plugin UI-locaties geïdentificeerd (overview list + detail pane)
- [x] Markup/CSS fix voor list accentlijn links naast titel/description
- [x] Detail-header/hero sticky maken met kleinere titel
- [x] Extra spacing toevoegen tussen hero en `Titel` label
- [x] Verify uitvoeren (typecheck + plugin apply + taskflow verify)

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run typecheck`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run apply:workspace`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`

## Relevante links

- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/styles.css`
```

---

## Programmeer-architectuur guardrails, helper-extractie en refactorbeleid

- Path: `docs/project/25-tasks/done/programmeer-architectuur-guardrails-helper-extractie-en-refactorbeleid.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-programmeer-architectuur-guardrails-helper-extractie
title: Programmeer-architectuur guardrails, helper-extractie en refactorbeleid
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Leg een compacte programmeer-architectuur skill en workflow vast zodat complexe code niet verder groeit in één component/file, en pas dit als eerste voorbeeld toe op de entry photo gallery helpers."
tags: [architecture, skills, refactor, qa, gallery]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

Complexe UI- en interactiecode groeit nu nog te makkelijk door in één componentfile.
Daardoor wordt testen, wijzigen en reviewen zwaarder dan nodig.

De gewenste les is niet “meer architectuur”, maar gerichter structureren:
pure logica naar helpers, stateful interactie naar hooks waar nuttig, IO naar services, en simpele glue/render-code gewoon inline laten.

## Gewenste uitkomst

Er is een compacte programmeer-architectuur skill die agents helpt om bij complexe code vaker goede helperfiles/hooks te maken, zonder scope creep of big-bang refactors.

De entry photo gallery dient als eerste voorbeeld: sorteerberekeningen en reorder helpers staan los van de component, zodat fase 1 QA-tests dezelfde helpers kunnen gebruiken.

## Waarom nu

- De thumbnail reorder-bug liet zien dat complexe interactielogica in een grote component lastig hard te bewijzen is.
- De komende QA-basis heeft testbare helperlogica nodig.
- Nieuwe en bestaande complexe code moet structureel beter worden wanneer we die aanraken.

## In scope

- Nieuwe skill `.agents/skills/programming-architecture-guardrails/SKILL.md`.
- `AGENTS.md`, `scope-guard` en `ui-implementation-guardrails` uitbreiden met compacte architectuurregels.
- Entry photo gallery sorteerhelpers extraheren naar `src/lib/entry-photo-gallery/**`.
- Component functioneel gelijk houden, zonder brede gallery- of app-refactor.

## Buiten scope

- Repo-brede cleanup.
- Refactors buiten entry photo gallery.
- Nieuwe QA-runner of coverage-infra; dat hoort bij de aparte QA-basis.
- Native iOS/Android E2E.

## Concrete checklist

- [x] Nieuwe programmeer-architectuur skill toevoegen.
- [x] `AGENTS.md` uitbreiden met helper/hook/refactor-while-touching regels.
- [x] `scope-guard` uitbreiden met refactor-scope regels.
- [x] `ui-implementation-guardrails` uitbreiden met complexe interactie helper/hook regels.
- [x] Entry photo gallery sorteerhelpers extraheren naar `src/lib/entry-photo-gallery/**`.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen functionele blockers. De volledige QA-runner wordt in een aparte fase/task opgezet.

## Verify / bewijs

- ✅ `npm run lint` (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` (geslaagd op 2026-04-23)
- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-23)
- Niet gedraaid: relevante unit-tests uit fase 1, omdat de QA-testinfra nog niet bestaat in deze repo.

## Relevante links

- `AGENTS.md`
- `.agents/skills/scope-guard/SKILL.md`
- `.agents/skills/ui-implementation-guardrails/SKILL.md`
- `components/journal/entry-photo-gallery.tsx`
- `src/lib/entry-photo-gallery/**`
```

---

## Repo-local Codex MCP documentatie en agent-defaults voor local AI development

- Path: `docs/project/25-tasks/done/repo-local-codex-mcp-documentatie-en-agent-defaults.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-repo-local-codex-mcp-documentatie-agent-defaults
title: Repo-local Codex MCP documentatie en agent-defaults voor local AI development
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Leg de repo-local Codex MCP local/remote-ro workflow expliciet vast in docs en AGENTS, zodat agents dit standaard veilig toepassen zonder extra gebruikersinstructies."
tags: [codex, mcp, local-development, workflow, docs]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

De repo heeft nu een werkende lokale Codex MCP setup, maar de operationele guidance voor wanneer local versus remote/prod read-only gebruikt moet worden staat nog niet scherp in de standaard agent-routes.

## Gewenste uitkomst

Docs en AGENTS beschrijven compact en eenduidig:

- default gebruik van `supabase_local`
- wanneer `supabase_remote_ro` wel gebruikt mag worden
- wanneer `supabase_remote_ro` juist niet gebruikt mag worden
- dat agents na remote-ro gebruik terugzetten naar local

## Waarom nu

- Verhoogt veiligheid en voorspelbaarheid bij lokaal AI-assisted development.
- Voorkomt dat toekomstige agents onnodig remote/prod-context gebruiken.

## In scope

- Aanvullen van `docs/dev/cline-workflow.md` met compacte MCP-werkwijze.
- Aanvullen van `AGENTS.md` met always-on default gedrag voor agents.
- Korte taskflow-afronding en verify.

## Buiten scope

- App-code wijzigingen.
- Nieuwe MCP servers of bredere architectuurwijzigingen.

## Concrete checklist

- [x] Voeg workflownotitie toe voor local-vs-remote-ro MCP gebruik in `docs/dev/cline-workflow.md`.
- [x] Voeg always-on agent-defaults toe in `AGENTS.md`.
- [x] Verifieer taskflow/docs scripts en commit/push de wijzigingen.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run taskflow:verify`

## Relevante links

- `.codex/config.toml`
- `.codex/README.md`
- `scripts/codex-mcp-target.mjs`
- `docs/dev/cline-workflow.md`
- `AGENTS.md`
```

---

## Repo-local Codex MCP setup met veilige Supabase target-switchflow

- Path: `docs/project/25-tasks/done/repo-local-codex-mcp-setup-met-veilige-supabase-target-switchflow.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-repo-local-codex-mcp-setup-switchflow
title: Repo-local Codex MCP setup met veilige Supabase target-switchflow
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Maak een repo-lokale Codex MCP-config met vaste servers voor context7/playwright/stitch en een veilige, eenvoudige Supabase local-vs-remote read-only switchflow zonder secrets in de repo."
tags: [codex, mcp, supabase, tooling, workflow]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

De huidige Codex MCP-config staat globaal in de home-directory en bevat alleen een beperkte set servers. Voor deze repo is een lokale, voorspelbare setup nodig waarmee local development en remote/prod-georiënteerd Supabase-gebruik veilig naast elkaar bestaan, zonder handmatig TOML-werk of secrets in version control.

## Gewenste uitkomst

De repo bevat één begrijpelijke `.codex/config.toml` met vaste MCP-servers voor context7, playwright en stitch, plus een Supabase-opzet waarmee lokaal veilig tussen een local target en een remote/prod read-only target gewisseld kan worden.

De standaardstand is veilig voor dagelijks gebruik. Eventuele switching blijft klein, expliciet en robuust, met een korte lokale gebruiksinstructie voor developer en agent.

## Waarom nu

- Nodig om Codex/Cline lokaal consistenter en veiliger te gebruiken binnen deze repo.
- Voorkomt ad-hoc globale configuratie en handmatig targetwisselen.
- Houdt lokale ontwikkelcapabilities en productiegerichte read-only analyse helder gescheiden.

## In scope

- Inspecteren wat Codex CLI/config native ondersteunt voor project-scoped MCP-config en switching/profiles.
- Ontwerpen en implementeren van de kleinste robuuste repo-local MCP-opzet.
- Vastleggen van een veilige local-vs-remote Supabase flow zonder secrets in de repo.
- Korte workflowdocumentatie voor activeren/switchen/verifiëren.

## Buiten scope

- Wijzigingen aan app-code, UI, services of Supabase runtime-code.
- Nieuwe MCP-servers buiten context7, playwright, stitch en supabase.
- Sentry of bredere architectuurwijzigingen.

## Concrete checklist

- [x] Bevestig via CLI/config-inspectie wat Codex native ondersteunt voor MCP switching of profiles.
- [x] Kies de kleinste veilige repo-local setup voor vaste MCP-servers en Supabase targets.
- [x] Werk de config en eventuele minimale helperflow uit zonder secrets in de repo.
- [x] Documenteer kort hoe local en remote/prod read-only worden geactiveerd.
- [x] Verifieer syntax, bruikbaarheid, read-only default voor remote en repo-local scope.

## Blockers / afhankelijkheden

- Exacte Supabase MCP server-command/env-contracten moeten bevestigd zijn voordat implementatie start.

## Verify / bewijs

- CLI-bewijs voor wat Codex MCP/config native ondersteunt.
- Geldige TOML en werkende repo-local switchflow.
- Controle dat gewijzigde files geen secrets bevatten en geen globale Codex config vervuilen.

## Relevante links

- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
- `AGENTS.md`
- `../../.codex/config.toml`
```

---

## Thumbnail reorder productiebug in moment detail

- Path: `docs/project/25-tasks/done/thumbnail-reorder-productiebug-moment-detail.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-thumbnail-reorder-productiebug-moment-detail
title: Thumbnail reorder productiebug in moment detail
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "In productie blijft de gesleepte thumbnail in de galerij visueel steken of sprint terug; de reorder-interactie moet vanaf de thumb zelf stabiel werken en de visuele indicatie blijft icon-only."
tags: [bug, moment-detail, photos, thumbnail]
workstream: app
due_date: null
sort_order: 3
---

## Probleem / context

De nieuwe thumbnail reorder-flow werkt niet goed in productie. Bij het slepen van een thumbnail in de galerij blijft de foto hangen op zijn oude positie, waardoor de volgorde voor de gebruiker niet betrouwbaar of intuïtief aanvoelt.

Daarnaast is de copy/presentatie van de thumbnail-indicatie nu te zwaar:
- de `Thumbnail`-tag op de grote foto onder de samenvatting is daar niet nodig
- tekstlabels in de galerij voegen onrust toe; een kleine icon-only indicatie past beter

Na de eerste fix bleek het slepen nog niet structureel goed: naar links slepen kwam niet verder dan ongeveer de helft van de thumbnail en de foto sprong terug. De aangescherpte diagnose is dat de vorige aanpak de drag te laat overdroeg aan een later gemounte overlay/responder, waardoor de originele touch niet betrouwbaar eigenaar bleef van de sorteeractie.

Tijdens de nieuwe smoke-test bleek aanvullend dat de laatste pointerpositie niet altijd via een move-event binnenkomt. De release-handler neemt daarom nu ook de loslaatpositie mee voordat de target-index wordt afgerond.

## Gewenste uitkomst

De galerij-reorder werkt in productie vloeiend en betrouwbaar: tijdens slepen beweegt de actieve thumbnail correct mee en blijft niet vast op zijn oude positie hangen. Na loslaten klopt de nieuwe positie visueel én functioneel.

De grote foto onder de samenvatting toont geen overbodige thumbnail-tag meer. In de galerij blijft de indicatie alleen icon-only aanwezig, zonder zichtbare badge-copy.

## Waarom nu

- Dit is een zichtbare regressie in een net toegevoegde kerninteractie.
- Het gedrag schaadt vertrouwen in de reorder-flow en dus in de featured-thumbnaillogica.
- De visuele badge-uitwerking is nu te zwaar voor de bedoelde rustige Budio-UI.

## In scope

- Reproduceren en oplossen van het vastlopende dragged-thumbnail gedrag in productie/runtime.
- Verwijderen van de thumbnail-tag op de grote foto onder de samenvatting.
- Verwijderen van zichtbare thumbnail-labels in de galerij; icon-only indicatie behouden waar nuttig.
- Gerichte runtime-verify van reorder-gedrag op de lokale webtarget.

## Buiten scope

- Nieuwe fotofeatures buiten reorder en thumbnail-indicatie.
- Grote redesign van moment detail buiten deze bugfix.
- Nieuwe taskflow- of pluginwijzigingen buiten wat nodig is voor deze bug.

## Concrete checklist

- [x] Aangescherpte oorzaak van vastlopende/terugspringende dragged thumbnail in code bevestigd.
- [x] Reorder-gedrag in galerij structureel aangepast naar thumb-owned drag.
- [x] Thumbnail-tag op featured foto verwijderen.
- [x] Thumbnail-labels in galerij verwijderen en icon-only maken.
- [x] Verify draaien (lint, typecheck, gerichte runtime-check).

## Blockers / afhankelijkheden

- Geen functionele blockers meer bekend.

## Verify / bewijs

- ✅ `npm run lint` (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` (geslaagd op 2026-04-23)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-23 op `http://localhost:8081`: local magic-link login, icon-only badge-copy check, tweede thumb naar links gesleept en visueel op nieuwe positie bevestigd)
- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-23)

## Relevante links

- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`
- `docs/project/open-points.md`
```

---

## Upload bundles uitbreiden met volledige tasks en apart full archive

- Path: `docs/project/25-tasks/done/upload-bundles-volledige-tasks-en-archive.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-upload-bundles-volledige-tasks-en-archive
title: Upload bundles uitbreiden met volledige tasks en apart full archive
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-24
summary: "Voeg in docs/upload een volledige tasks bundle toe (open + done) en een aparte volledige archive bundle (done), allebei directory-gebaseerd en uploadbaar voor ChatGPT."
tags: [docs, upload, tasks, bundle]
workstream: idea
due_date: null
sort_order: 1
---

# Upload bundles uitbreiden met volledige tasks en apart full archive

## Probleem / context

De huidige bundeloutput zet ideas, strategy en build-context klaar in `docs/upload/**`, maar er is nog geen uploadbaar bestand dat alle taskfiles volledig bundelt. Daardoor ontbreekt een compacte manier om complete taakgeschiedenis als context te uploaden.

## Gewenste uitkomst

`docs/upload/**` bevat twee nieuwe generated bestanden:

- één volledige tasks bundle met zowel `open/` als `done/` taskfiles
- één aparte volledige archive bundle met alleen `done/` taskfiles

Beide bundels zijn directory-gebaseerd, worden automatisch via `docs:bundle` gegenereerd en worden meegenomen in het uploadmanifest.

## Waarom nu

- Directe gebruikersvraag voor betere uploadcontext in ChatGPT.
- Sluit aan op bestaande generated uploadflow zonder productscope te verbreden.

## In scope

- Bundlescript uitbreiden met nieuwe task-upload outputs.
- Upload manifest/registratie bijwerken.
- Verify draaien en taskflow afronden.

## Buiten scope

- Nieuwe taskstatuslogica of herstructurering van taskfiles.
- Wijzigen van primaire top-5 uploadset (tenzij expliciet gevraagd).

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Nieuwe full tasks upload bundle toegevoegd (open + done).
- [x] Nieuwe full archive upload bundle toegevoegd (done).
- [x] Upload manifest entries bijgewerkt.
- [x] Verify gedraaid (`taskflow`, `docs:bundle`, `docs:bundle:verify`).

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `scripts/docs/build-docs-bundles.mjs`
- `docs/upload/00-budio-upload-manifest.md`
```

---

## Workstream backfill voor bestaande taskfiles

- Path: `docs/project/25-tasks/done/workstream-backfill-bestaande-taskfiles.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: workstream-backfill-bestaande-taskfiles
title: Workstream backfill voor bestaande taskfiles
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: ad-hoc user request
updated_at: 2026-04-23
summary: "Alle bestaande taskfiles krijgen een expliciete workstream-classificatie (idea/plugin/app/aiqs), consistent met de nieuwe task-template en plugin-filters."
tags: [tasks, docs, workflow]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

Na introductie van `workstream` in template en plugin ontbreekt dit veld nog in vrijwel alle bestaande taskfiles. Daardoor is filtering en visuele classificatie incompleet.

## Gewenste uitkomst

Alle bestaande taskfiles onder `docs/project/25-tasks/**` hebben een passende `workstream`-waarde (`idea`, `plugin`, `app` of `aiqs`).

## In scope

- Backfill van `workstream` in bestaande taskfiles.
- Verify + docs-bundle + taskflow-check na update.

## Buiten scope

- Geen inhoudelijke herschrijving van taken.
- Geen statuswijzigingen van bestaande taken.

## Concrete checklist

- [x] Inventariseer alle taskfiles zonder `workstream`
- [x] Ken per task een passende `workstream` toe
- [x] Draai docs/taskflow verify

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle:verify`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`
```

---

## 1.2B outputkwaliteit expliciteren en afronden

- Path: `docs/project/25-tasks/open/1-2b-outputkwaliteit-expliciteren-en-afronden.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-1-2b-outputkwaliteit
title: 1.2B outputkwaliteit expliciteren en afronden
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als voldoende goed geldt.
tags: [consumer-beta, outputkwaliteit]
workstream: app
due_date: null
sort_order: 3
---

















# 1.2B outputkwaliteit expliciteren en afronden

## Probleem / context

`current-status.md` markeert 1.2B als deels aanwezig.
De kwaliteitslaag bestaat functioneel, maar afrondcriteria en bewijsset zijn nog niet scherp genoeg vastgelegd.

## Gewenste uitkomst

Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als "voldoende goed" geldt.
De taak is klaar wanneer de criteria, verificatiestappen en bewijsregel helder genoeg zijn om 1.2B niet langer als impliciete restcategorie te laten hangen.

## Waarom nu

- Outputkwaliteit is een van de drie open gaten in de actieve transitiemaand.
- Zonder expliciete kwaliteitsset blijft releasebewijs te vaag.

## In scope

- Kwaliteitscriteria voor entry/day/reflection output aanscherpen.
- Verify- en bewijsverwachting expliciteren voor deze fase.
- Planning- en open-gap aansluiting bewaken.

## Buiten scope

- Brede Pro-outputformats of publicatiekanalen toevoegen.
- Nieuwe pricing-, usage- of control-plane laag activeren.

## Concrete checklist

- [ ] Kwaliteitscriteria voor huidige outputlaag uitschrijven.
- [ ] Verify- en bewijsverwachting per relevante flow expliciteren.
- [ ] Afrondcriterium voor 1.2B documentair vastleggen.

## Blockers / afhankelijkheden

- Afstemming met 1.2E beta-readiness zodat bewijsregels consistent blijven.

## Verify / bewijs

- Canonieke docs bijgewerkt.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/20-planning/20-active-phase.md`
```

---

## 1.2E beta-readiness expliciteren en afronden

- Path: `docs/project/25-tasks/open/1-2e-beta-readiness-expliciteren-en-afronden.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-1-2e-beta-readiness
title: 1.2E beta-readiness expliciteren en afronden
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft."
tags: [consumer-beta, beta-readiness]
workstream: app
due_date: null
sort_order: 5
---













# 1.2E beta-readiness expliciteren en afronden

## Probleem / context

`current-status.md` markeert 1.2E als deels aanwezig.
De smoke-checklist bestaat al, maar volledige runtime-doorloop en bewijsstandaard zijn nog niet als afgeronde readiness set verankerd.

## Gewenste uitkomst

Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.
De taak is klaar wanneer het team in één oogopslag ziet wat nog nodig is voor een overtuigende beta-readiness claim.

## Waarom nu

- Beta-readiness is een kernonderdeel van de nieuwe maandfocus.
- Zonder expliciete readinessset blijft de releasebeslissing diffuus.

## In scope

- Readinesschecklist structureren voor de huidige fase.
- Bewijsverwachting voor runtime- en UI-smokes expliciteren.
- Relatie met bestaande smoke-checklist aanscherpen.

## Buiten scope

- Nieuwe productsporen buiten consumer beta.
- Business/Private readiness of governanceverbreding.

## Concrete checklist

- [ ] Beta-readiness checklist structureren tot duidelijke fase-output.
- [ ] Bewijsregel per kernflow expliciteren.
- [ ] Resterende open items voor de beta-release zichtbaar maken.

## Blockers / afhankelijkheden

- Samenhang met 1.2B outputkwaliteit en de bestaande smoke-checklist.

## Verify / bewijs

- Canonieke docs bijgewerkt.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/20-planning/20-active-phase.md`
```

---

## AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)

- Path: `docs/project/25-tasks/open/aiqs-admin-interface-thema-herontwerp-spotify-openai-stijl.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-aiqs-admin-interface-thema-herontwerp
title: AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "Geef AIQS admin een helderder en strakker eigen thema, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools, met goede bruikbaarheid op telefoon en desktop."
tags: [aiqs, admin-ui, thema, design]
workstream: aiqs
due_date: null
sort_order: 4
---












# AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)

## Probleem / context

De huidige AIQS admin-interface werkt functioneel, maar voelt nog te complex en mist een heldere, strakke admin-uitstraling.
Voor dagelijkse tuning op mobiel en desktop is een duidelijker en consistenter admin-thema gewenst.

## Gewenste uitkomst

AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.
De interface ondersteunt prettig gebruik op telefoon én desktop/fullscreen, zonder de bestaande AIQS-governance of datastromen functioneel te verbreden.

## Waarom nu

- Deze stap maakt de tool sneller en prettiger inzetbaar na livegang van de huidige AIQS-variant.
- Het verlaagt frictie bij testen, beoordelen en tunen van prompts/calls.

## In scope

- Visuele/thematische herwerking van AIQS admin-gedeelte.
- Strakkere informatiehiërarchie en duidelijkere states/controls in adminschermen.
- Goede mode-aware uitwerking voor mobiel en desktop/fullscreen.
- Doorvertaling via bestaande shared UI-primitives waar passend.

## Buiten scope

- Nieuwe OpenAI-calls of uitbreiding van AIQS functionele scope.
- Nieuwe review- of evaluatieprocessen buiten bestaande flows.
- End-user themawijzigingen buiten admin-context.

## Concrete checklist

- [ ] Designrichting en referentieprincipes concretiseren voor AIQS admin.
- [ ] Belangrijkste AIQS adminschermen herstijlen met duidelijke hiërarchie.
- [ ] Mobiel + desktop/fullscreen gebruik valideren in light en dark mode.
- [ ] Regressiecheck op bestaande AIQS functionaliteit en admin-guardrails.
- [ ] Final polish + bewijs vastleggen tegen designrefs/acceptatie.

## Blockers / afhankelijkheden

- Bij voorkeur pas uitvoeren nadat loggingvalidatie + productie-livepad stabiel zijn.
- Afstemming met bestaande UI-guardrails en AIQS admin-only principes.

## Verify / bewijs

- Runtime/smoke-check AIQS admin in light en dark mode.
- Desktop/fullscreen + mobiel gebruikscheck met screenshots/bewijs.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/ethos_ivory/DESIGN.md`
```

---

## AIQS logging valideren in OpenAI dashboard en fallback-logpad

- Path: `docs/project/25-tasks/open/aiqs-logging-valideren-openai-dashboard-en-fallback.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-aiqs-logging-valideren-openai-dashboard-en-fallback
title: AIQS logging valideren in OpenAI dashboard en fallback-logpad
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Valideer dat AIQS logging voor bestaande OpenAI-calls leesbaar binnenkomt in het OpenAI API-dashboard, met werkende fallback-logging en een duidelijke 4-uurs logging-toggle in de admin UI."
tags: [aiqs, logging, openai, consumer-beta]
workstream: aiqs
due_date: null
sort_order: 4
---
















# AIQS logging valideren in OpenAI dashboard en fallback-logpad

## Probleem / context

Voor de huidige AIQS-testflow is logging al deels aanwezig, maar het is nog niet duidelijk genoeg of logging voor de bestaande OpenAI-calls daadwerkelijk zichtbaar en leesbaar is in de OpenAI dashboard-logging.
Daarnaast is onduidelijkheid in de huidige logging-UI (aan/uit-state en werking van de 4-uurs privacy-timebox) een blokkade voor betrouwbaar gebruik tijdens testen.

## Gewenste uitkomst

Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests in de praktijk traceerbaar zijn.
De fallback in eigen logging blijft aantoonbaar werken.

De logging-bediening in AIQS is helder en laagdrempelig: een duidelijke aan/uit-keuze met begrijpelijke statusweergave en expliciete 4-uurs vervaltijd, zodat direct duidelijk is of logging actief is.

## Waarom nu

- Dit is de basis om tijdens live testen gericht verbeteringen te kunnen doen.
- Zonder zichtbare logging blijft AIQS-iteratie te blind en te traag.
- Het ondersteunt de bewijs-gedreven afronding van de huidige consumer-beta fase.

## In scope

- Valideren dat bestaande AIQS-calls in OpenAI dashboard-logging terechtkomen en leesbaar zijn.
- Valideren dat fallback-logging voor dezelfde calls beschikbaar blijft.
- Logging-toggle/controls in AIQS admin vereenvoudigen en status expliciet maken.
- Expliciteren dat logging na 4 uur automatisch uitgaat (privacy-default).
- Runtime-bewijs vastleggen van logging aan/uit + zichtbaar resultaat.

## Buiten scope

- Nieuwe OpenAI-calls of uitbreiding van AI-task families.
- Uitbouw naar volledige observability-suite of nieuwe review-workflow.
- End-user loggingfeatures buiten AIQS admin.

## Concrete checklist

- [ ] Huidige loggingpaden voor AIQS-calls inventariseren (OpenAI dashboard + fallback).
- [ ] End-to-end valideren dat dashboard logging zichtbaar is bij actieve logging-toggle.
- [ ] Fallback logging valideren voor dezelfde flow en failure-/degradatiescenario.
- [ ] Logging-toggle UX versimpelen met duidelijke aan/uit-status en 4-uurs indicatie.
- [ ] Bewijs vastleggen met concrete testresultaten voor aan/uit-gedrag en zichtbaarheid.

## Blockers / afhankelijkheden

- Toegang tot productieomgeving en OpenAI API-dashboard loggingweergave.
- Afstemming met admin-only guardrails uit `docs/project/ai-quality-studio.md`.

## Verify / bewijs

- Runtime-validatie van logging aan/uit in AIQS admin.
- Aantoonbare logging in OpenAI dashboard voor bestaande calls.
- Aantoonbare fallback logging voor dezelfde testcases.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`
```

---

## AIQS productie live zetten voor bestaande OpenAI-calls

- Path: `docs/project/25-tasks/open/aiqs-productie-live-zetten-bestaande-openai-calls.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-aiqs-productie-live-zetten-bestaande-openai-calls
title: AIQS productie live zetten voor bestaande OpenAI-calls
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Zet de huidige AIQS-variant snel en gecontroleerd live in productie voor alleen de bestaande OpenAI-calls, zonder nieuwe reviewflow of extra calls toe te voegen."
tags: [aiqs, productie, openai, consumer-beta]
workstream: aiqs
due_date: null
sort_order: 2
---













# AIQS productie live zetten voor bestaande OpenAI-calls

## Probleem / context

De huidige AIQS-variant is functioneel bruikbaar, maar de productiedoelstelling is nog niet expliciet als taak verankerd: AIQS moet in productie werken voor de bestaande OpenAI-calls, zonder scope-uitbreiding.
Er is nadrukkelijk geen behoefte om nu de geplande bredere reviewflow te bouwen.

## Gewenste uitkomst

De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls.
Er worden geen nieuwe calls toegevoegd en geen nieuwe reviewproceslaag gebouwd binnen deze taak.

Deze taak is klaar wanneer de productieroute aantoonbaar werkt en de minimale operationele checks zijn vastgelegd om live testen mogelijk te maken.

## Waarom nu

- Snelle live-validatie in de eigen productieomgeving is nu belangrijker dan featureverbreding.
- Het verlaagt de feedbackloop voor AIQS-verbetering in realistische omstandigheden.
- Het houdt de fase focus op bewijs-gedreven consumer-beta afronding.

## In scope

- Productieroute voor bestaande AIQS OpenAI-calls valideren en waar nodig repareren.
- Admin-only toegang en server-side guardrails behouden in productie.
- Nodige runtime/config checks voor stabiele live-werking vastleggen.
- Bewijs leveren dat huidige AIQS-calls in productie end-to-end werken.

## Buiten scope

- Nieuw reviewproces of uitgebreide evaluatielifecycle bouwen.
- Nieuwe AI-taken, extra OpenAI-calls of control-plane verbreding.
- Niet-AIQS productverbreding buiten de huidige adminflow.

## Concrete checklist

- [ ] Productiepad van bestaande AIQS-calls checken op end-to-end werking.
- [ ] Eventuele blockers in config/guardrails oplossen zonder scope-uitbreiding.
- [ ] Bevestigen dat admin-only toegang in productie correct gehandhaafd blijft.
- [ ] Bewijs vastleggen dat de huidige calls live werken zoals verwacht.
- [ ] Korte operationele go-live notitie vastleggen voor vervolgtesten.

## Blockers / afhankelijkheden

- Productieomgeving en geldige admin-toegang.
- Bestaande server-side configuratie voor AIQS/OpenAI-callpad.

## Verify / bewijs

- Runtimebewijs van succesvolle AIQS-calls in productie.
- Bevestiging van admin-only afscherming in productie.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`
```

---

## Budio webapp compatible maken

- Path: `docs/project/25-tasks/open/budio-webapp-compatible-maken.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-budio-webapp-compatible-maken
title: Budio webapp compatible maken
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "Implementeer PWA-installatieprompt voor webgebruikers om de app als desktop-app te installeren, met modal, cookie-onthouding en instellingenoptie."
tags: [pwa, webapp, installatie, modal, cookie]
workstream: app
due_date: null
sort_order: 5
---

## Probleem / context

Gebruikers van de webversie kunnen de app momenteel niet eenvoudig installeren als Progressive Web App (PWA) op hun desktop. Dit beperkt de gebruikerservaring, vooral voor Android-gebruikers die geen native app beschikbaar hebben. Een installatieprompt zou de toegankelijkheid verbeteren en de app meer app-achtig maken.

## Gewenste uitkomst

Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een modal met de vraag om de app op de desktop te installeren. Als de gebruiker weigert, onthoud dit met een cookie zodat de prompt niet herhaald wordt. De gebruiker kan de installatieoptie altijd heractiveren via instellingen. Gebruik juiste iconen, naam en manifestinstellingen voor een professionele installatie-ervaring.

## Waarom nu

- We hebben nog geen Android en iOS apps beschikbaar, dus voor Android-gebruikers (zoals ikzelf) is dit een handige tussenoplossing.
- Verbetert de gebruikerservaring op web zonder afhankelijk te zijn van app stores.
- Voorbereiding op bredere PWA-adoptie.

## In scope

- Bijwerken of aanmaken van web app manifest (manifest.json) met juiste iconen, naam en instellingen.
- Implementeren van PWA-installatie logica in de app (detectie van 'beforeinstallprompt' event).
- Creëren van een installatiemodal component met duidelijke call-to-action.
- Toevoegen van local storage om gebruikerskeuze te onthouden (niet tonen als geweigerd), wel altijd via menu -> instellingen alsnog weer activeren.
- Integreren van een toggle in instellingen scherm om installatieprompt te heractiveren.
- Testen op verschillende browsers (Chrome, Firefox, Safari) voor compatibiliteit.

## Buiten scope

- Ontwikkeling van native Android/iOS apps.
- Uitbreiding naar andere PWA-features zoals offline caching of push notifications (tenzij direct gerelateerd aan installatie).
- Browser-specifieke aanpassingen buiten standaard PWA-ondersteuning.

## Concrete checklist

- [ ] Onderzoek huidige PWA-compatibiliteit en manifest.json controleren/bijwerken.
- [ ] Implementeer 'beforeinstallprompt' event listener in app root (\_layout.tsx).
- [ ] Creëer PwaInstallModal component met installatieknop en 'later' optie.
- [ ] Voeg cookie-logica toe voor onthouden van gebruikerskeuze (gebruik js-cookie of native cookies).
- [ ] Integreer modal in hoofdapp flow (toon alleen voor ingelogde webgebruikers).
- [ ] Voeg toggle toe in instellingen scherm voor heractiveren van prompt.
- [ ] Test installatie op desktop browsers en controleer cookie-functionaliteit.
- [ ] Update documentatie indien nodig.

## Blockers / afhankelijkheden

- Geen blockers; kan parallel lopen met andere features.
- Afhankelijk van Expo/React Native Web voor PWA-ondersteuning (al aanwezig).

## Verify / bewijs

- Runtime-test: Open app in browser, controleer of installatieprompt verschijnt voor nieuwe gebruikers.
- Installatie-test: Klik op installeren en verificeer dat app als desktop-app wordt geïnstalleerd met juiste iconen.
- Cookie-test: Weiger installatie, refresh pagina en controleer dat prompt niet meer verschijnt; activeer via instellingen en test opnieuw.
- Browser-compatibiliteit: Test op Chrome, Firefox en Safari desktop.
- Code-review: Controleer manifest.json en installatielogica in repo.

## Relevante links

- `docs/project/open-points.md`
- [PWA Install Prompt Guide](https://web.dev/customize-install/)
- [Expo PWA documentation](https://docs.expo.dev/guides/progressive-web-apps/)
```

---

## Docs scheiden naar private repo (strategie + migratieplan)

- Path: `docs/project/25-tasks/open/docs-private-repo-scheiding-en-migratieplan.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-21

```md
---
id: task-docs-private-repo-scheiding-migratieplan
title: Docs scheiden naar private repo (strategie + migratieplan)
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-21
summary: "Werk een besluitbaar plan uit om strategische docs naar een aparte private repo te verplaatsen (optie 2), met behoud van historie, workflow en AIQS-governance."
tags: [docs, governance, security, repo-structuur, planning]
workstream: idea
due_date: null
sort_order: 7
---




## Probleem / context

De projectdocs bevatten geen secrets, maar wel gevoelige interne strategie en governance (zoals commerciële richting, AIQS-governance, admin-gedrag, en toekomstige productsporen). Zolang docs in dezelfde repo leven als runtime-code, ontstaat risico bij eventueel publiek delen van de hoofdrepo.

## Gewenste uitkomst

Een concreet en uitvoerbaar migratieplan voor optie 2: docs onderbrengen in een aparte private repo binnen dezelfde workspace, inclusief heldere werkwijze voor sync met code, toegang, historiebehoud en updateflow.

Het resultaat van deze taak is een besluit- en uitvoeringskader; geen directe technische migratie in deze taak.

## Waarom nu

- Strategisch belangrijk voor private beta en toekomstige commerciële positionering.
- Voorkomt dat gevoelige roadmap/governance-data onbedoeld meebeweegt bij eventueel publiek delen van code.
- Houdt productwaarheid en docs-kwaliteit intact zonder drastische kennisverliesoptie.

## In scope

- Uitwerken van het doelbeeld voor een aparte private docs-repo in dezelfde workspace.
- Vergelijken van implementatievarianten (submodule vs aparte clone) op workflow-impact.
- Definiëren van migratieaanpak met behoud van historie en duidelijke eigenaarschap.
- Vastleggen van operationele aanpassingen in workflowregels (`AGENTS.md` / `docs/dev/**`) voor werken met 2 repos.
- Opstellen van risicoanalyse, rollbackstrategie en acceptatiecriteria voor go/no-go.

## Buiten scope

- Direct verplaatsen van bestaande docsbestanden.
- Aanpassen van runtime-code, API's of database.
- Open-source/public repo-strategie volledig uitvoeren binnen deze taak.

## Concrete checklist

- [ ] Inventariseer welke documenttypes gevoelig zijn en welke in hoofdrepo kunnen blijven.
- [ ] Werk variantvergelijking uit: submodule vs aparte clone (developer UX, CI, onderhoud, risico).
- [ ] Definieer aanbevolen doelarchitectuur met folderstructuur en sync-afspraken.
- [ ] Beschrijf stapsgewijze migratieflow inclusief geschiedenisbehoud en rollback.
- [ ] Definieer governance-updates voor werken met aparte docs-repo.
- [ ] Leg promotiecriteria vast voor uitvoering als vervolgtaak (ready/in_progress).

## Blockers / afhankelijkheden

- Afhankelijk van expliciet gebruikersbesluit op de aanbevolen variant.
- Afstemming nodig over toekomstige publiek/private repo-strategie.

## Verify / bewijs

- Documentair bewijs: uitgewerkt migratievoorstel met variantenanalyse en besluitadvies.
- Governancebewijs: expliciete workflowregels voor 2-repo samenwerking en wijzigingscontrole.
- Planningbewijs: traceerbare opvolging in tasklaag zonder premature uitvoering.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/README.md`
- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
```

---

## Entry photo gallery volledige end-user E2E flows

- Path: `docs/project/25-tasks/open/entry-photo-gallery-volledige-end-user-e2e-flows.md`
- Bucket: open
- Status: ready
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-entry-photo-gallery-volledige-end-user-e2e-flows
title: Entry photo gallery volledige end-user E2E flows
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Breid de nieuwe gallery-smoke basis uit naar een volledige end-user E2E-suite voor toevoegen, verwijderen, max-limiet, viewer, reorder en unhappy/error flows."
tags: [qa, tests, gallery, photos, e2e]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

De eerste gallery QA-basis bewijst de kerninteractie voor thumbnail-reorder en legt unit/smoke-infra neer. De volledige end-user dekking voor alle gallery-flows bestaat nog niet.

Voor toekomstige gallery-wijzigingen willen we kunnen kiezen tussen:
- een snelle smoke-test die bewijst dat de belangrijkste interactie niet kapot is
- een volledige end-user test die alle vastgelegde use cases en unhappy paths doorloopt

## Gewenste uitkomst

Er is een volledige Playwright end-user suite voor entry photo gallery flows. De suite gebruikt reproduceerbare local-only seed/cleanup helpers en kan opnieuw gedraaid worden wanneer dit scherm of de gallery-services wijzigen.

## Waarom nu

- De reorder-bug liet zien dat lint/typecheck onvoldoende zijn voor complexe interactie.
- De basis-smoke is klaar; de volgende kwaliteitsstap is volledige flowdekking.
- Dit ondersteunt de 80% coverage/KPI-richting zonder legacy-code ineens repo-breed te blokkeren.

## In scope

- Local seed/cleanup uitbreiden voor add/delete/max/error scenario's.
- E2E-dekking voor:
  - foto's toevoegen
  - max 5 foto's en disabled/limietgedrag
  - viewer openen/sluiten
  - foto verwijderen en annuleren
  - thumbnail reorder links/rechts
  - persist-fout of service-error pad waar lokaal veilig te simuleren
- Heldere run-instructies in `docs/dev/qa-test-strategy.md`.

## Buiten scope

- Native iOS/Android E2E.
- Repo-brede coverage gate voor legacy code.
- Nieuwe productfunctionaliteit buiten bestaande gallery-flows.

## Concrete checklist

- [ ] Full E2E seed/cleanup fixtures ontwerpen.
- [ ] Add-flow testen.
- [ ] Delete/cancel-flow testen.
- [ ] Max-limiet testen.
- [ ] Viewer-flow testen.
- [ ] Reorder links/rechts testen.
- [ ] Minstens één unhappy/error flow testen of expliciet onderbouwen waarom lokaal niet veilig simuleerbaar.
- [ ] Docs/runbook bijwerken.
- [ ] Verify draaien.

## Blockers / afhankelijkheden

- Vereist draaiende lokale webserver, Supabase local stack en Mailpit auth-flow.

## Verify / bewijs

- ⏳ `npm run test:e2e:gallery:full`
- ⏳ `npm run lint`
- ⏳ `npm run typecheck`
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `tests/e2e/gallery-full.spec.mjs`
- `scripts/seed-local-entry-photo-gallery-smoke.mjs`
- `docs/dev/qa-test-strategy.md`
```

---

## Moment detail foto reorder + thumbnail-logica en audio test auto-stop

- Path: `docs/project/25-tasks/open/moment-detail-foto-reorder-en-audio-test-auto-stop.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-moment-detail-foto-reorder-audio-test-auto-stop
title: Moment detail foto reorder + thumbnail-logica en audio test auto-stop
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-24
summary: "Hardening van moment-detail foto-upload en reorder in productie, inclusief live drag-preview, foutclassificatie, retry/refetch-gedrag, bevestigde reorder-root-cause in productie en repo-brede diagnoseflow/taskflow-guardrails."
tags: [moment-detail, photos, production, diagnostics, taskflow]
workstream: app
due_date: null
sort_order: 3
---


## Probleem / context

De moment detail-flow toont in productie twee reele regressies:

- foto-upload werkt soms wel en soms niet, zonder duidelijke foutfasering of diagnosepad
- reorder geeft in productie foutmeldingen en de placeholder schuift tijdens slepen niet live mee naar de nieuwe doelpositie

Daarnaast moet de repo-brede taskflow worden aangescherpt:

- Plan Mode mag in deze repo niet langer automatisch nieuwe taskfiles aanmaken
- productieonderzoek moet via een vaste read-only diagnoseflow en vaste agent-testaccount reproduceerbaar worden

Bevestigde reorder-root-cause op 2026-04-24:

- de productie-reorderfout zat in `public.reorder_entry_photos`
- een swap van `sort_order` veroorzaakte eerst een `23505` unique-conflict op `(raw_entry_id, sort_order)`
- een eerste tijdelijke offset-fix botste daarna op de check `sort_order between 0 and 4`
- de duurzame oplossing is: unieke constraint `deferrable` maken en de reorder-update binnen een deferred constraint uitvoeren

## Gewenste uitkomst

Op het moment-detailscherm kan de gebruiker foto's betrouwbaar uploaden en herordenen. Tijdens het slepen schuift de galerij live mee naar de beoogde nieuwe positie, en persist gebeurt pas na loslaten. Bij mismatch- of persistfouten volgt exact een autoritatieve refetch + retry; daarna blijft een geclassificeerde fout zichtbaar.

Daarnaast is er een compacte repo-brede workflow voor productiebug-onderzoek: altijd gekoppeld aan een bestaande task, met vaste Vercel/Supabase diagnosevolgorde, tijdelijke productie read-only context, een dedicated agent-testaccount zonder adminrechten en expliciete learnings terug naar taskfile + runbook.

## Waarom nu

- De productiebug schaadt vertrouwen in een kernflow: foto's toevoegen en een thumbnail kiezen voor een moment.
- De huidige reorder-UI laat niet betrouwbaar zien waar de foto zal landen.
- Toekomstig productieonderzoek kost te veel tijd zonder vaste testaccount, logvolgorde en taskflow-regel.

## In scope

- Hardening van uploadfases: pick, prepare, display upload, thumb upload, DB insert, post-upload refresh.
- Autoritatieve refetch na succesvolle upload voordat reorder weer actief wordt.
- Reorder-preview die live mee schuift met de doelpositie.
- Persist na loslaten, met precies een refetch + retry bij bekende reorder-mismatch.
- Geclassificeerde foutmelding voor upload/reorder i.p.v. alleen generieke fouttekst.
- Productie diagnose runbook in `docs/dev/**`.
- Repo-brede Plan Mode-regel: bestaande task verplicht, nieuwe task alleen buiten Plan Mode.
- Dedicated productie agent-testaccount als gedocumenteerd ops secret contract.

## Buiten scope

- Nieuwe foto-editing features zoals captions, albums of bulkbeheer.
- Nieuwe auth-backdoors of productie adminroutes voor agents.
- Nieuwe statuswaarden of aparte plan-only taakstructuur.
- Grote herbouw van andere moment detail-subflows buiten gallery/diagnose/taskflow.

## Concrete checklist

- [x] Bestaande task expliciet als enige hoofdtaak voor deze flow bevestigd.
- [x] Taskflow-regels bijgewerkt: Plan Mode gebruikt alleen bestaande taskfiles; geen auto-create.
- [x] Productie diagnose runbook toegevoegd met Vercel/Supabase read-only volgorde.
- [x] Ops secret contract voor dedicated productie agent-testaccount gedocumenteerd.
- [x] Gallery upload flow geclassificeerd per foutfase en autoritatieve refetch toegevoegd.
- [x] Gallery reorder flow toont live preview / meeschuivende doelpositie.
- [x] Reorder retry na refetch voor bekende mismatch-fouten toegevoegd.
- [x] Unit-tests uitgebreid voor preview-ordering, foutclassificatie en retry-pad.
- [x] Gallery smoke/full E2E bijgewerkt voor upload/reorder regressies.
- [x] Verify gedraaid (`taskflow`, `lint`, `typecheck`, relevante tests, docs bundle checks).

## Blockers / afhankelijkheden

- Productie diagnose vereist bestaande read-only toegangspaden en beschikbare Vercel-capability of CLI/API-route.
- Gerichte runtime-check in light/dark mode blijft afhankelijk van bruikbare lokale web/app target.
- Dedicated productie testaccount is aangemaakt; stabiele metadata staat lokaal in de gitignored env-config onder `PROD_AGENT_TEST_*`.
- Upload-flakiness in productie is nog niet separaat bronvast bevestigd; reorder is nu wel hard onderzocht en hersteld.

## Verify / bewijs

- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-24)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-24)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-24)
- ✅ `npm run test:unit` (13 tests geslaagd op 2026-04-24)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-24; desktop-web reorder bevestigt linkse verplaatsing na hold-and-drag)
- ✅ `GALLERY_E2E_FULL=1 npm run test:e2e:gallery:full` (1 test geslaagd, 2 bewust geskipt/fixme op 2026-04-24)
- ✅ `npm run lint` (geslaagd op 2026-04-24)
- ✅ `npm run typecheck` (geslaagd op 2026-04-24)
- ✅ Vercel productiecontext bevestigd op 2026-04-24:
  - deployment `dpl_VNVWEcwvCfcrFu7FcRWAY522Akp6`
  - alias `https://assistent.budio.nl`
  - created `2026-04-23 17:07:48 CEST`
- ⚠️ Vercel runtime-logcheck over laatste 24 uur op production/main gaf geen relevante logs terug voor `error`, `upload`, `reorder`, `storage` of `supabase`
- ✅ Supabase cloud project bevestigd via CLI op 2026-04-24:
  - project ref `xmrndabfqfvkhdhcjqit`
  - region `Central EU (Frankfurt)`
- ✅ Supabase cloud logquery via Management API op 2026-04-24:
  - `auth_logs`, `storage_logs`, `postgres_logs` en `edge_logs` voor de laatste 24 uur expliciet uitgevraagd
  - geen relevante logregels terug voor gallery/upload/reorder in het onderzochte venster
- ✅ Productie-repro reorder op 2026-04-24 rond `18:29Z` bevestigd:
  - fixture-entry: `/entry/f806e61f-1148-49d1-9694-78ecdda41301`
  - mobiele/touch repro stuurde `POST /rest/v1/rpc/reorder_entry_photos`
  - response: `409`
  - body bevatte `code: 23505` en `duplicate key value violates unique constraint "entry_photos_raw_entry_id_sort_order_key"`
- ✅ Tussenstap gevalideerd op 2026-04-24 rond `20:28Z`:
  - tijdelijke offset-aanpak faalde met `400`
  - body bevatte `code: 23514` en check-constraint `entry_photos_sort_order_check`
- ✅ Definitieve productie-fix toegepast op 2026-04-24 rond `20:38Z`:
  - `entry_photos_raw_entry_id_sort_order_key` is `deferrable`
  - `reorder_entry_photos` gebruikt deferred constraint tijdens reorder-update
- ✅ Productie-herverify reorder op 2026-04-24 rond `20:39Z`:
  - dezelfde touch-repro op dezelfde fixture-entry geeft `204` op `reorder_entry_photos`
  - geen zichtbare gallery-foutmelding
  - volgorde veranderde van `[f2d14118..., 61941a4b..., ca2c5fbd...]` naar `[61941a4b..., f2d14118..., ca2c5fbd...]`
- ✅ Gerichte runtime-checks in light en dark mode voor moment detail gallery (lokale webtarget, screenshots vastgelegd op 2026-04-24)
- Productie repro-check met baseline-entry + sessie-entry via dedicated agent-testaccount

## Relevante links

- `docs/project/open-points.md`
- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
- `src/lib/entry-photo-gallery/flow.ts`
- `src/lib/entry-photo-gallery/sorting.ts`
- `docs/dev/production-bug-investigation-workflow.md`
```

---

## niet vergeten

- Path: `docs/project/25-tasks/open/niet-vergeten.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-niet-vergeten
title: niet vergeten
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "screenshots van Flow verwerken tot ideeen. todo, ideeen etc taggen in momenten tekst en bijbehorende schermen uitdenken in AIQS en Budio."
tags: []
workstream: idea
due_date: null
sort_order: 6
---



# niet vergeten

## Probleem / context

Beschrijf kort welk concreet gat, risico of uitvoeringsprobleem deze taak oplost.

## Gewenste uitkomst

Beschrijf in 1-3 korte alinea's wat klaar moet zijn wanneer deze taak done is.

## Waarom nu

- Waarom deze taak nu relevant is voor de actieve fase.

## In scope

- Concreet werk dat binnen deze taak valt.

## Buiten scope

- Werk dat bewust niet in deze taak zit.

## Concrete checklist

- [ ] Eerste concrete stap
- [ ] Tweede concrete stap

## Blockers / afhankelijkheden

- Geen of nog te bepalen.

## Verify / bewijs

- Noem hier de relevante verify-, runtime- of doc-bewijzen.

## Relevante links

- `docs/project/open-points.md`
```

---

## npm audit kwetsbaarheden beoordelen en saneren

- Path: `docs/project/25-tasks/open/npm-audit-kwetsbaarheden-beoordelen-en-saneren.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-npm-audit-kwetsbaarheden-beoordelen-en-saneren
title: npm audit kwetsbaarheden beoordelen en saneren
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Beoordeel de huidige npm audit meldingen na de testinfra-uitbreiding, bepaal welke runtime-relevant zijn, en saneer alleen de passende dependency-updates zonder onnodige brekende sprongen."
tags: [npm, audit, dependencies, security]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

Na `npm install` onder Node 24 rapporteert npm nog steeds `14 vulnerabilities (13 moderate, 1 high)`. Deze zijn in deze ronde bewust niet inhoudelijk opgelost, omdat de actieve taak alleen GitHub Actions/Node-align en workflow-hardening betrof.

## Gewenste uitkomst

Er ligt een bron-gebaseerde beoordeling van de npm audit meldingen, inclusief onderscheid tussen:
- direct runtime-risico
- dev-only/tooling-risico
- fixes die veilig zijn
- fixes die breaking of scope-te-groot zijn

## Waarom nu

- De waarschuwing is actueel bevestigd op 2026-04-23.
- Testinfra en tooling zijn net uitgebreid.
- Dependency-onderhoud moet bewust gebeuren, niet stilzwijgend.

## In scope

- `npm audit` output analyseren.
- Impact per package/risk bepalen.
- Veilige sanering voorstellen of uitvoeren in een aparte uitvoerronde.

## Buiten scope

- Grote package-modernisering zonder expliciete keuze.
- Productcode refactors die alleen indirect uit dependency-upgrades voortkomen.

## Concrete checklist

- [ ] Audit-output vastleggen.
- [ ] Runtime vs dev-only risico scheiden.
- [ ] Veilige fixes bepalen.
- [ ] Beslissen welke fixes direct kunnen en welke een aparte grotere task vragen.

## Blockers / afhankelijkheden

- Nog te bepalen na concrete audit-output.

## Verify / bewijs

- ⏳ `npm audit`
- ⏳ relevante package verify

## Relevante links

- `package.json`
- `package-lock.json`
```

---

## Budio Workspace activity-bar opent list view zonder workspace-menu

- Path: `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`
- Bucket: open
- Status: in_progress
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-plugin-activitybar-opent-list-view-zonder-workspace-menu
title: Budio Workspace activity-bar opent list view zonder workspace-menu
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-24
summary: "Het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in list view, terwijl de oude Workspace-launcher en overbodige tussenlaag worden opgeruimd."
tags: [plugin, vscode, list-view, activity-bar]
workstream: plugin
due_date: null
sort_order: 2
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
- Oude launcher/tussenlaag opruimen of minimaliseren tot alleen technisch noodzakelijke VS Code plumbing.
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
- [ ] Handmatige smoke-check in de normale VS Code workspace bevestigd.

## Blockers / afhankelijkheden

- VS Code verwacht voor een activity-bar container nog steeds een gekoppelde view; als volledig verwijderen daarvan technisch niet haalbaar blijkt, blijft alleen de minimaal noodzakelijke bridge over zonder oude launcher-semantiek.

## Verify / bewijs

- `npm run taskflow:verify`
- In `tools/budio-workspace-vscode/`: `npm run typecheck`
- In `tools/budio-workspace-vscode/`: `npm run test`
- In `tools/budio-workspace-vscode/`: `npm run apply:workspace`
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
```
