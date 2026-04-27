# AGENTS.md

## Docs-ingang

Gebruik altijd eerst:

- `docs/project/README.md`

Die file bepaalt:

- welke docs leidend zijn
- welke generated zijn
- welke archive-only zijn
- wat naar ChatGPT Project geüpload wordt

Lees daarna alleen taakrelevante bronnen; hanteer geen “lees alles altijd”-aanpak.

## Canonieke projectdocs

Gebruik deze docs als actieve projectwaarheid:

- `docs/project/master-project.md`
- `docs/project/product-vision-mvp.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/content-processing-rules.md`
- `docs/project/copy-instructions.md`
- `docs/project/ai-quality-studio.md`

Regels:

- `master-project.md` = product, scope, fasekaart, beslisregels
- `product-vision-mvp.md` = productgedrag en guardrails
- `current-status.md` = enige statuswaarheid voor code-realiteit
- `open-points.md` = resterende gaps en onzekerheden
- `content-processing-rules.md` = canonieke inhouds- en outputregels
- `copy-instructions.md` = canonieke copy-, tone-of-voice- en microcopyregels
- `ai-quality-studio.md` = canonieke AI-governance voor prompting, evaluatie en kwaliteit

Voor AI-gedrag, prompting en evaluatie:
- volg altijd `docs/project/ai-quality-studio.md`

## Canonieke designbronnen (MVP 1.2.1)

- `docs/design/mvp-design-spec-1.2.1.md` is leidend voor MVP-designbeslissingen.
- `design_refs/1.2.1/ethos_ivory/DESIGN.md` is leidend voor foundations.
- `design_refs/1.2.1/*/code.html` en `design_refs/1.2.1/*/screen.png` zijn leidend per scherm.
- Als een schermmap in `design_refs/1.2.1/**` een `.md` design-note heeft, gebruik die ook als aanvullende per-scherm designinput.
- `docs/design/archive/phase-1.3-design-direction.md` is verouderd en niet leidend.

## Werkwijze

- Herbeslis geen bestaande keuzes uit de projectdocs.
- Geen feature creep buiten de vastgelegde scope.
- Werk cheap-first: kleinste werkende wijziging eerst.
- Houd taken klein en scherp afgebakend.
- Bepaal bij elke inhoudelijke repo-taak zelf de efficiëntste uitvoerblokken/fases op basis van huidige agent/model, taaktype, risico, dirty worktree, verificatiekosten en afhankelijkheden.
- Vraag de gebruiker niet om fasering tenzij er een echte product-, planning- of architectuurtradeoff is; kies anders zelf de kleinste veilige blokken en leg die vast in taskfile, plan of eerste inhoudelijke update.
- Standaardblok voor niet-triviaal werk: preflight/context/taskflow -> kleinste bronwijziging -> gerichte verify -> docs/taskstatus/bundel afronden. Voor grotere docs/roadmaptaken: research -> template/workflow -> primair artefact -> bundel -> verify.
- Gebruik bestaande patronen in de repo vóór nieuwe patronen.
- Simpeler maken of iets weghalen is een volwaardige oplossing: kijk bij code en UI eerst naar minder copy, minder surface, minder state en minder custom interactielagen voordat je complexiteit toevoegt.
- Tijdelijk complexer onderzoeken mag om het probleem te begrijpen, maar schaal daarna actief terug naar de simpelste werkende oplossing.
- Bij complexe wijzigingen vraag je eerst: kan dit testbaar als pure helper, of hoort stateful interactielogica in een kleine hook?
- Laat geen nieuwe grote componentfiles ontstaan zonder bewuste reden; extractie moet altijd testbaarheid, leesbaarheid, hergebruik of minder risico opleveren.
- Refactor bestaande code alleen binnen de aangeraakte flow; grotere opruimingen krijgen een eigen task.
- Nieuwe complexe helperlogica krijgt unit-tests; simpele render/glue-code hoeft niet standaard getest te worden.
- Bij interactieve UI is `lint`/`typecheck` niet genoeg als de wijziging gedrag raakt: draai een relevante smoke-test of leg expliciet vast waarom dat nog niet kan.
- 80% coverage is de KPI; nieuwe complexe helpermodules mikken direct op minimaal 80% coverage, zonder legacy code in één keer als gate te blokkeren.
- Hypothese-first is toegestaan, maar advies pas na bronbevestiging:
  - formuleer bij onduidelijkheid eerst een expliciete hypothese
  - verifieer die hypothese daarna via primaire bronnen (code, config, logs, runtime, API/CLI)
  - geef pas daarna diagnose/advies/uitvoerplan
  - label onbevestigde punten altijd expliciet als aanname
- Bij warnings na monitoring (bijv. deployment/checks):
  - los warnings niet stilzwijgend op
  - vraag eerst expliciet: **"Hey, wil je dit nu oplossen, of zal ik dit als een taak in de backlog zetten? Of als idee in de backlog?"**
  - voer een warning-fix pas uit na expliciete keuze/akkoord

## Workflowlaag: ChatGPT Projects + Cline

- **ChatGPT Projects** gebruik je voor strategie, review en promptontwerp buiten de repo-uitvoering.
- **Cline in VS Code** gebruik je voor repo-analyse, plan, code/docs-wijzigingen, verify en commit.
- Productwaarheid en toolingwaarheid blijven gescheiden:
  - `docs/project/**` = canonieke projectwaarheid
  - `docs/project/25-tasks/**` = operationele taaklaag voor huidige fase-uitvoering
  - `docs/dev/**` = operationele workflowafspraken
  - `docs/project/generated/**` + `docs/design/generated/**` = generated output, nooit canonieke bron
  - `docs/upload/**` = generated uploadartefacten, nooit canonieke bron
- Audience en docs-visual-language staan in `docs/project/00-docs-governance/README.md`.
- `docs/` is ook de lokale Obsidian vault; developer tooling staat in `docs/setup/developer-docs-environment.md`.
- `docs/project/generated/**` en `docs/design/generated/**` zijn geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- `docs/upload/chatgpt-project-context.md` is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects.
- `docs/upload/**` is geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- Bij spanning tussen `docs/upload/**` en canonieke docs zijn canonieke docs leidend.
- Bij spanning tussen generated docs en canonieke docs zijn canonieke docs leidend.
- Start-of-session guardrail:
  - lees eerst `docs/project/README.md`
  - check bij non-triviale uitvoering daarna `docs/project/open-points.md` en relevante taskfiles in `docs/project/25-tasks/**`
  - check `docs/dev/active-context.md` alleen bij non-triviale/onderbroken/multi-file taken
  - sla `active-context.md` over bij kleine, volledig afgebakende fixes
- Bij onderbroken of herhaalde patch-rondes: bevestig eerst de actuele file state (small-read/diff) vóór je verder wijzigt.
- Gebruik `docs/dev/active-context.md` als lichte sessiecontext wanneer recente WIP/learnings relevant zijn.
- Verhoog nooit status of waarheid op basis van `docs/dev/active-context.md` alleen.
- Canonieke docs blijven altijd leidend boven `docs/dev/active-context.md`.
- Structurele workflowlearnings horen in `AGENTS.md` of `docs/dev/**`, niet in productdocs.
- Is een learning taak-/domeinspecifiek en herhaalbaar, leg die vast in een bestaande skill (niet in AGENTS).
- Voor "nieuwe taak": maak eerst een taskfile aan vanuit `docs/project/25-tasks/_template.md`.
- Voor verwijzing op taaktitel: open eerst de overeenkomstige taskfile; gebruik `id` als fallback bij ambiguiteit.
- Always-on taskflow (verplicht voor alle inhoudelijke agenttaken):
  - geldt voor plan/research/bug/implementatie binnen repo-context
  - uitzondering: pure chat of simpele read-only vraag zonder uitvoertaak
  - preflight: zoek eerst naar een passende bestaande taskfile; maak bij duidelijke nieuwe scope anders direct een nieuwe taskfile uit `docs/project/25-tasks/_template.md`
  - geen inhoudelijk plan, research-antwoord of implementatiestart zonder taskfile
  - in Plan Mode: gebruik eerst een passende bestaande taskfile wanneer die er duidelijk is
  - in Plan Mode: maak bij duidelijke nieuwe scope automatisch een nieuwe taskfile aan
  - vraag alleen nog bij echte twijfel: meerdere plausibele bestaande tasks, onduidelijke scope-routing, of onduidelijk task-vs-idea/epic
  - buiten Plan Mode: als taskfile ontbreekt, maak die eerst aan en ga pas daarna verder met plan/research/uitvoering
  - wanneer een taak automatisch wordt aangemaakt: plaats die direct bovenaan de doel-lane door `sort_order` van die lane te herschrijven en de nieuwe taak op positie `1` te zetten
  - wanneer een open taak actief wordt uitgevoerd en naar `in_progress` gaat: plaats die direct bovenaan de `in_progress` lane door `sort_order` van bron- en doellane opnieuw doorlopend op te slaan
  - zet status direct op `in_progress` zodra uitvoering start
  - kies en benoem bij inhoudelijke uitvoering de compacte uitvoerblokken/fases; leg die bij voorkeur vast in de taskfile-sectie `Uitvoerblokken / fasering`
  - eerste inhoudelijke update bevat altijd:
    - `Task: <taaktitel>`
    - `Task file: <pad naar task md>`
    - `Status: <huidige status>`
  - werk tijdens uitvoering checklist + `updated_at` bij op echte voortgang
  - elk inhoudelijk plan noemt expliciet de concrete taskfile-path
  - elk inhoudelijk Plan Mode-plan bevat een korte `Taskflow summary`: welke taskfile gebruikt of aangemaakt wordt, welke statuswijziging verwacht wordt, en wanneer extra werk een eigen task krijgt
  - nieuwe of inhoudelijk geharde P1/P2 bouwtaken moeten spec-ready zijn vóór bouwstart:
    - `User outcome`
    - `Functional slice`
    - `Entry / exit`
    - `Happy flow`
    - `Non-happy flows`
    - `UX / copy`
    - `Data / IO`
    - `Acceptance criteria`
    - `Verify / bewijs`
  - zet `spec_ready: true` alleen wanneer de taskfile zelfstandig uitvoerbaar is voor een developer of agent zonder sessiecontext
  - nieuwe epics/projectbeschrijvingen moeten P1/P2-scheiding, UX/copy-contract, flow-contract, dependencies, linked tasks en acceptatie bevatten; een epic is meer dan een takenlijst
  - promoted/candidate ideas en researchdocs moeten promotiecriteria, open vragen, volgende stap en bekende UX/flow/data-impact bevatten; ze mogen geen runtimewaarheid claimen zonder bewijs
  - verbeteringen die direct voortkomen uit testen van dezelfde flow blijven in dezelfde task; nieuw niet-relevant werk krijgt een eigen task
  - updates en eindresultaat bevatten altijd:
    - `Task: <taaktitel>`
    - `Task file: <pad naar task md>`
    - `Status: <huidige status>`
- planintegriteit is verplicht:
  - een goedgekeurd oorspronkelijk plan of expliciet afgestemde hoofdscope blijft tijdens uitvoering het vaste referentiepunt
  - vervang of verklein het oorspronkelijke plan nooit stilzwijgend tijdens bouwen, testen of polish-rondes
  - nieuwe feedback, regressies of verbeteringen tijdens uitvoering gelden standaard als **aanvulling op het bestaande plan**, niet als vervanging ervan, tenzij de gebruiker expliciet de hoofdscope wijzigt
  - leg het oorspronkelijke plan bij niet-triviale taken expliciet vast in de taskfile onder `## Oorspronkelijk plan / afgesproken scope`
  - leg extra werk dat tijdens uitvoering ontstaat expliciet vast onder `## Toegevoegde verbeteringen tijdens uitvoering`
  - voer vóór afronding altijd een expliciete **plan reconciliation** uit in de taskfile:
    - wat was het oorspronkelijke plan?
    - wat is daarvan afgerond?
    - wat is later toegevoegd?
    - wat blijft nog open of blocked?
  - markeer een taak nooit impliciet als klaar alleen omdat het laatste subprobleem is opgelost; afronding mag pas wanneer oorspronkelijke planpunten én later toegevoegde verbeteringen expliciet zijn gereconcilieerd
  - alleen de gebruiker mag de oorspronkelijke hoofdscope inhoudelijk herdefiniëren of verkleinen
  - expliciete user-details of requirement-punten met latere uitvoer-, bouw- of reviewwaarde mogen niet verdwijnen in alleen een samenvatting
  - leg zulke details bij niet-triviale taken expliciet vast in de taskfile onder `## Expliciete user requirements / detailbehoud`
  - leg per requirement vast of die:
    - gebouwd is
    - gedeeltelijk gebouwd is
    - nog niet gebouwd is
    - in code aanwezig is maar nog user-review nodig heeft
  - wanneer een gebruiker vraagt om een bestaande task te verrijken met gemiste detailrequirements, moet de taskfile die details expliciet opnemen en niet alleen de conclusie van een review
  - wanneer een gebruiker een bestaand uitgebreid plan of genummerde requirements expliciet laat opnemen in een taskfile, moet die bronstructuur letterlijk of nagenoeg letterlijk bewaard blijven onder een aparte bron-/detailsectie
  - een afgeleide review, samenvatting of statusmatrix mag de bronstructuur nooit vervangen; bronplan, detailrequirements en reviewconclusie zijn aparte lagen
  - afronding vereist:
    - status `done`
    - verplaatsing naar `docs/project/25-tasks/done/`
    - `npm run docs:bundle`
    - `npm run docs:bundle:verify`
  - hard guardrail:
    - draai `npm run taskflow:verify` bij relevante repo-uitvoering
    - bij falen eerst taskflow herstellen, daarna pas afronden
- Scope-routing is context-first:
  - default-context is Budio app + AIQS
  - bepaal scope op intentie/formulering (doel, doelgroep, omgeving, planningimpact), niet alleen op letterlijke keywords
  - Jarvis/plugin zijn aparte sporen zodra de intentie daar logisch op wijst, ook zonder exacte keyword-match
  - bij hoge-impact twijfel (planning, roadmap, idea/task-classificatie): eerst kort afstemmen
  - bij lage-impact twijfel: maak een redelijke aanname en label die expliciet in plan/doc
- Wijzig strategie/planning nooit stilzwijgend:
  - geen mutaties in `docs/project/10-strategy/**` of `docs/project/20-planning/**` zonder expliciete gebruikersvraag of expliciet overlegbesluit in dezelfde sessie
  - bij voorgestelde koerswijzigingen eerst voorstel + impact + advies, daarna pas muteren

## Skill-selectie

- Gebruik `.agents/skills/stitch-redesign-execution/SKILL.md` voor scherm-redesigns op basis van Stitch exports in `design_refs/...`.
- Gebruik `.agents/skills/ui-implementation-guardrails/SKILL.md` voor UI-implementatie, polish en regressiefixes zonder volledige Stitch-redesignscope.
- Gebruik `.agents/skills/github-deployment-diagnostics/SKILL.md` voor GitHub deployment/security-issues met verplichte `gh` API-diagnose vóór advies.
- Gebruik `.agents/skills/programming-architecture-guardrails/SKILL.md` voor complexe componenten, bugfixes in grote files, nieuwe interactielogica, services/dataflows of helper-extractie.
- Gebruik `docs/dev/qa-test-strategy.md` als QA-basis voor unit-, smoke- en full-E2E bewijs bij complexe of interactieve wijzigingen.

## Codex-regels

- Gebruik minimale context per prompt.
- Herhaal geen projectcontext uit docs.
- Werk met 1 taak per prompt.
- Gebruik plan mode alleen bij bugs, multi-file wijzigingen of migraties.

## Repo-local Codex MCP defaults (local AI development)

- Gebruik in deze repo standaard de lokale MCP-config: `.codex/config.toml`.
- Default target voor Supabase is altijd `supabase_local`.
- `supabase_remote_ro` gebruik je alleen voor expliciete productiegerichte read-only checks (diagnose/metadata/logcontext) die lokaal niet kunnen.
- Gebruik `supabase_remote_ro` niet voor normale ontwikkeliteraties, writes of bulk inspecties die lokaal ook kunnen.
- Als een agent `supabase_remote_ro` tijdelijk activeert, zet die daarna direct terug naar `supabase_local`.
- Gebruik voor target-switching altijd de helper: `node scripts/codex-mcp-target.mjs <local|remote-ro ...>`; geen handmatige TOML-edits tenzij expliciet nodig.
- Gebruik bij productiebug-onderzoek de runbook-volgorde in `docs/dev/production-bug-investigation-workflow.md`.
- Leg productieclaims alleen vast met bronspoor: timestamp, route, deployment/logbron en bevestigde status (`bevestigd`, `onbevestigd`, `blocked`).

## UI-guardrails (NativeWind / component-first)

- Screens in `app/**` zijn assembly-only.
- UI assembly is scaffold-first: controleer eerst `components/ui/screen-scaffolds.tsx` voor een passend schermskelet.
- Reuse-first beslisvolgorde is verplicht:
  - eerst bestaand scaffold/component gebruiken
  - dan bestaand shared component uitbreiden
  - pas daarna een nieuw shared component maken als uitbreiding niet schoon past
- Voeg geen nieuwe grote `StyleSheet.create` patronen toe in `app/**`.
- Introduceer geen nieuwe visuele patronen in screens.
- Plaats styling eerst in `components/ui/**` of `components/layout/**`.
- `theme/tokens.ts` is de enige tokenbron.
- Tailwind/NativeWind config is afgeleid en nooit leidend.
- Voorkom className-chaos in screens; varianten horen in shared components.
- Per taak: max 1 screen + noodzakelijke shared component-aanpassing.
- Bij styling-taken is check tegen `design_refs/1.2.1/**` verplicht.
- Geen redesign zonder expliciete opdracht.
- Plain text wrappers zijn standaard transparant; zet geen achtergrondfill op containers die alleen title/subtitle/body copy groeperen.
- Voeg geen extra content fill toe achter plain text in cards, rows, modals, sheets, dialogs, popups of state blocks.
- Alleen functionele componenten mogen een eigen fill hebben: chip, badge, input, button, textarea, alert, toast of tagged status surface.
- Borders zijn opt-in, niet default: voeg geen decoratieve borders/strokes/outlines toe aan pages, cards, rows, modals, sheets, dialogs of popups zonder expliciete `design_ref` of expliciete gebruikersvraag.
- Clean-first UI: gebruik eerst spacing, tonal contrast, typografie en hiërarchie; niet borders als standaard scheiding.
- Borders mogen alleen wanneer functioneel of design-ref-gedekt (zoals input, textarea, focus state, divider/separator, geselecteerde state of expliciete alert/toast-surface).
- Standaard content-gap is altijd 32px voor content-stacks (screens, sections, modals, sheets, dialogs en popups), tenzij een `design_ref` expliciet iets anders toont.
- Nieuwe componenten volgen default `spacing.content` (32) voor verticale content-spacing; afwijkingen alleen met expliciete design-ref of expliciete gebruikersvraag.
- Voor modals/sheets/dialogs/popups: gebruik altijd dezelfde backdrop-scrim/blur-standaard via shared `components/ui/modal-backdrop.tsx`; geen losse backdrop-implementaties per scherm.
- Bevestigingsflows gebruiken altijd een shared variant; verzin geen nieuwe popup/prompt per scherm.
- Destructive confirmaties gebruiken standaard shared `components/feedback/destructive-confirm-sheet.tsx` (modal-variant); alleen met expliciete design_ref of expliciete gebruikersvraag afwijken.
- Sectielabels staan standaard op de page background (zonder section-card), tenzij de design_ref expliciet een section surface vraagt.
- Rows/cards blijven compact en licht: geen overmatige hoogte, padding of visuele massa; destructive rows mogen accent hebben maar blijven rustig.
- Dark mode behoudt dezelfde lichtgewicht compositie als light mode: geen extra containerlagen, extra massa of zwaardere surfaces zonder expliciete design_ref.
- Top navigation is navigation only: paginatitel + ondersteunende beschrijving staan standaard in een hero onder de topnav, tenzij de design_ref expliciet anders toont.
- Gebruik een gedeeld header-systeem met 2 modi: `main-screen header` (nav-row + hero voor hoofdschermen) en `detail-screen header` (back/menu-row + compacte hero voor details/subscreens).
- Page-level atmosphere komt eerst uit achtergrondlagen en spacing, niet uit oversized donkere cards; auth-schermen vermijden zware omvattende surfaces tenzij een design_ref dit expliciet vraagt.
- Copy bij een primaire actie blijft compact: liever `hero + action + compacte notice` dan meerdere uitlegblokken of herhaling van dezelfde boodschap.
- Los visuele regressies bron-first op in shared primitives (`components/ui/**`, `components/layout/**`) als een default de fout veroorzaakt; herhaal dezelfde schermfix niet op meerdere plekken.
- Shared primitives mogen geen borders, fills, nested surfaces of zware visuele massa als default introduceren zonder expliciete functionele reden of design-ref dekking.
- Voor overlays/sheets/selectors: gebruik eerst shared primitives in `components/feedback/**` (`destructive-confirm-sheet`, `selector-modal-shell`, `selectable-list-modal`, `async-status-sheet`) vóór screen-lokale modal-opbouw.
- Keuze-inputs (radio/checkbox met titel+omschrijving of label-only) gebruiken altijd de gedeelde `components/ui/radio-choice-group.tsx` (`ChoiceInputGroup`); maak geen screen-local varianten.
- Background-modi zijn altijd mode-aware; pas nooit een dark ambient behandeling ongewijzigd toe in light mode.
- Header, page en footer volgen per mode één coherente themahiërarchie; dark mode is niet de impliciete visuele waarheid voor alle schermen.
- Iedere UI-polish of designwijziging moet dark én light mode runtime/screenshot-checks meenemen voordat het werk klaar heet.
- Every UI polish or design change must be checked in both dark and light mode before it is considered done.
- Noem design-implementatie pas klaar na bewijs: check tegen relevante `design_refs`, gerichte runtime/smoke-check en verplichte verify-output voor de taak.
- Houd productfeature, tooling en verify-tooling gescheiden: status/docs alleen ophogen met hard bewijs uit code, runtime of expliciete projectdocs.
- Runtime-code mag nooit assets direct uit `design_refs/**` importeren of exposen.
- Promoveer herbruikbare merk- of schermassets altijd eerst naar een publieke assetlocatie onder `assets/**` voordat app-code ze gebruikt.

## Kosten- en inputregels

- Gebruik het lichtste model dat de taak aankan.
- Werk met minimale input: doel + scope + files.

## Docs-workflow

Bij wijzigingen aan canonieke docs:

- werk eerst de handmatige docs bij
- draai `npm run docs:lint` (en waar nodig `npm run docs:lint:fix`)
- houd ook root `README.md` synchroon met actuele runtime/feature-realiteit
- draai daarna:
  - `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `docs/upload/**` is generated uploadoutput voor de gebruiker; gebruik deze map niet als canonieke agentbron.
- `docs/project/generated/**` en `docs/design/generated/**` zijn generated output; gebruik deze mappen niet als canonieke agentbron.
- In ChatGPT Projects: gebruik na de bootstrap alleen de kleinste relevante subset uit het uploadmanifest; upload niet standaard de volledige set.
- De bundelscript zet uploadbestanden klaar voor handmatige upload; upload naar ChatGPT Projects gebeurt nu nog niet automatisch.
- `docs/upload/**` wordt beheerd als maximaal 10 uploadbestanden totaal; upload per ChatGPT Project-context alleen de kleinste relevante subset uit het manifest.
- Human-facing docs mogen een Budio Terminal-smaaklaag gebruiken zolang plain Markdown leesbaar blijft; agent-only docs blijven sober.
- Budgetpolicy in ChatGPT Project-context blijft licht; token/cost/runtime-discipline hoort in repo-/runtime-/AI-governance-docs.
- Session/multi-user/OpenAI-contextbeleid is nu alleen als later idee vastgelegd.
- Zet geen toolinguitleg of sessieruis in productdocs; workflowafspraken horen in `docs/dev/**` en waar nodig in dit bestand.
- Bij taskstatuswijzigingen of taakverplaatsing naar `done/`: werk taskfile + relevante planning/open-points context bij en draai daarna ook `npm run docs:bundle` en `npm run docs:bundle:verify`.
- Draai `npm run docs:bundle` en `npm run docs:bundle:verify` altijd sequentieel, nooit parallel.
- Voor inhoudelijke agentuitvoering in repo-context: draai ook `npm run taskflow:verify`.

Bij wijzigingen in admin-regeneratie:

- documenteer altijd zichtbaarheidsregel (admin-only) en allowlist-mechanisme
- documenteer relevante env-vars (`ADMIN_REGEN_ALLOWLIST_USER_IDS`, `ADMIN_REGEN_INTERNAL_TOKEN`)

## Lokale restart/deploy beslisregel

Na relevante wijzigingen expliciet melden welke extra stap nodig is:

- alleen app/frontend gewijzigd -> meestal niets extra's of alleen app-restart
- `supabase/functions/**` gewijzigd -> `npm run supabase:functions:restart`
- `supabase/migrations/**` gewijzigd -> lokale `db push`/`db reset` + eventuele type-regeneratie
- geen relevante runtime-impact -> expliciet melden dat niets extra's nodig is

Standaarduitvoering:

- Bij `supabase/migrations/**` wijzigingen voert Codex deze lokale DB-stap standaard zelf uit (`npx supabase db push --local` of, indien nodig, `npx supabase db reset`) zonder extra gebruikersprompt.
- Als runtime of errors tonen dat een al bestaande migratie lokaal nog niet is toegepast (bijv. missende tabel/kolom), voert Codex ook dan direct `npx supabase db push --local` uit zonder extra gebruikersprompt.

Regel:

- `npm run dev` is lokaal-only en mag geen remote functions deploy doen.
- productie deploy van Supabase Edge Functions loopt alleen via GitHub Actions.

## Supabase Edge Functions — import-regels

Deno vereist expliciete bestandsextensies op lokale imports. Schending hiervan leidt tot een **silent boot failure (503)** zonder duidelijke foutmelding.

Regels voor elke import in `supabase/functions/**`:

- Gebruik **altijd** `.ts` als extensie op lokale imports: `from '../_shared/mijn-module.ts'`
- Schrijf **nooit** `from '../_shared/mijn-module'` zonder extensie — Deno kan dat niet resolven
- Elke lokale import heeft een `// @ts-ignore`-regel erboven omdat TypeScript `.ts`-extensies in imports niet accepteert
- `// @ts-ignore` onderdrukt **alleen de eerstvolgende regel** — zet het direct boven elke afzonderlijke import-statement
- Een `// @ts-ignore` boven een multi-line import werkt **niet** — gebruik altijd één import per `@ts-ignore`-blok

Correct patroon (verplicht):

```ts
// @ts-ignore -- Deno runtime requires local import extensions.
import { foo } from '../_shared/foo.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { bar } from '../_shared/bar.ts';
```

Fout patroon (verboden):

```ts
// @ts-ignore -- Deno runtime requires local import extensions.
import {
  foo,
  bar,
} from '../_shared/foo.ts'; // @ts-ignore geldt NIET voor multi-line imports

// @ts-ignore -- Deno runtime requires local import extensions.
import { baz } from '../_shared/baz'; // GEEN .ts extensie = boot failure
```

## Security

- `OPENAI_API_KEY` blijft altijd server-side.
- Commit nooit secrets, tokens of lokale env-bestanden.
- Bouw geen client-side OpenAI-calls met geheime sleutels.

## Kwaliteit

Voer na relevante wijzigingen uit:

- `npm run lint`
- `npm run typecheck`

# Dev server policy

- Never run long-lived dev servers like `npx expo start`, `npm run dev`, `vite`, `next dev`, `supabase functions serve`, or similar unless I explicitly ask.
- Assume the local dev server is already running.
- Voor deze repo is `http://localhost:8081` de standaard lokale web dev/smoke-test target wanneer geen andere lokale webtarget is opgegeven.
- Never prefix local dev-server commands with `CI=1`.
- For validation, use one-shot commands only, such as:
  - `npm run lint`
  - `npm run typecheck`
  - project verify scripts
- If a live server is required, tell me the exact command to run manually instead of running it yourself (example: `npx expo start --web --localhost`).

## VS Code plugin workflow (Budio Workspace)

- Bij wijzigingen in `tools/budio-workspace-vscode/**` altijd direct de plugin opnieuw toepassen op de normale workspace.
- Gebruik hiervoor in `tools/budio-workspace-vscode/` standaard:
  - `npm run apply:workspace`
- Deze stap omvat build + vsix package + local install + VS Code refresh en is verplicht voordat werk aan de plugin als "klaar" wordt gemeld.
