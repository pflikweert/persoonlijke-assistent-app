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
- Gebruik bestaande patronen in de repo vóór nieuwe patronen.
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
  - `docs/upload/**` = generated uploadartefacten, nooit canonieke bron
- `docs/upload/chatgpt-project-context.md` is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects.
- `docs/upload/**` is geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- Bij spanning tussen `docs/upload/**` en canonieke docs zijn canonieke docs leidend.
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

## Codex-regels

- Gebruik minimale context per prompt.
- Herhaal geen projectcontext uit docs.
- Werk met 1 taak per prompt.
- Gebruik plan mode alleen bij bugs, multi-file wijzigingen of migraties.

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
- In ChatGPT Projects: gebruik na de bootstrap alleen de kleinste relevante subset uit het uploadmanifest; upload niet standaard de volledige set.
- De bundelscript zet uploadbestanden klaar voor handmatige upload; upload naar ChatGPT Projects gebeurt nu nog niet automatisch.
- De primaire aanbevolen handmatige uploadset is teruggebracht naar maximaal 5 bestanden totaal.
- Budgetpolicy in ChatGPT Project-context blijft licht; token/cost/runtime-discipline hoort in repo-/runtime-/AI-governance-docs.
- Session/multi-user/OpenAI-contextbeleid is nu alleen als later idee vastgelegd.
- Zet geen toolinguitleg of sessieruis in productdocs; workflowafspraken horen in `docs/dev/**` en waar nodig in dit bestand.
- Bij taskstatuswijzigingen of taakverplaatsing naar `done/`: werk taskfile + relevante planning/open-points context bij en draai daarna ook `npm run docs:bundle` en `npm run docs:bundle:verify`.

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
