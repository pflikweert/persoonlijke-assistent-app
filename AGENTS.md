# AGENTS.md

## Docs-ingang

Gebruik altijd eerst:

- `docs/project/README.md`

Die file bepaalt:

- welke docs leidend zijn
- welke generated zijn
- welke archive-only zijn
- wat naar ChatGPT Project geüpload wordt

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

## Skill-selectie

- Gebruik `.agents/skills/stitch-redesign-execution/SKILL.md` voor scherm-redesigns op basis van Stitch exports in `design_refs/...`.
- Gebruik `.agents/skills/ui-implementation-guardrails/SKILL.md` voor UI-implementatie, polish en regressiefixes zonder volledige Stitch-redesignscope.

## Codex-regels

- Gebruik minimale context per prompt.
- Herhaal geen projectcontext uit docs.
- Werk met 1 taak per prompt.
- Gebruik plan mode alleen bij bugs, multi-file wijzigingen of migraties.

## UI-guardrails (NativeWind / component-first)

- Screens in `app/**` zijn assembly-only.
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
- Sectielabels staan standaard op de page background (zonder section-card), tenzij de design_ref expliciet een section surface vraagt.
- Rows/cards blijven compact en licht: geen overmatige hoogte, padding of visuele massa; destructive rows mogen accent hebben maar blijven rustig.
- Dark mode behoudt dezelfde lichtgewicht compositie als light mode: geen extra containerlagen, extra massa of zwaardere surfaces zonder expliciete design_ref.
- Top navigation is navigation only: paginatitel + ondersteunende beschrijving staan standaard in een hero onder de topnav, tenzij de design_ref expliciet anders toont.
- Gebruik een gedeeld header-systeem met 2 modi: `main-screen header` (nav-row + hero voor hoofdschermen) en `detail-screen header` (back/menu-row + compacte hero voor details/subscreens).
- Page-level atmosphere komt eerst uit achtergrondlagen en spacing, niet uit oversized donkere cards; auth-schermen vermijden zware omvattende surfaces tenzij een design_ref dit expliciet vraagt.
- Copy bij een primaire actie blijft compact: liever `hero + action + compacte notice` dan meerdere uitlegblokken of herhaling van dezelfde boodschap.
- Los visuele regressies bron-first op in shared primitives (`components/ui/**`, `components/layout/**`) als een default de fout veroorzaakt; herhaal dezelfde schermfix niet op meerdere plekken.
- Shared primitives mogen geen borders, fills, nested surfaces of zware visuele massa als default introduceren zonder expliciete functionele reden of design-ref dekking.
- Background-modi zijn altijd mode-aware; pas nooit een dark ambient behandeling ongewijzigd toe in light mode.
- Header, page en footer volgen per mode één coherente themahiërarchie; dark mode is niet de impliciete visuele waarheid voor alle schermen.
- Iedere UI-polish of designwijziging moet dark én light mode runtime/screenshot-checks meenemen voordat het werk klaar heet.
- Every UI polish or design change must be checked in both dark and light mode before it is considered done.
- Noem design-implementatie pas klaar na bewijs: check tegen relevante `design_refs`, gerichte runtime/smoke-check en verplichte verify-output voor de taak.
- Houd productfeature, tooling en verify-tooling gescheiden: status/docs alleen ophogen met hard bewijs uit code, runtime of expliciete projectdocs.

## Kosten- en inputregels

- Gebruik het lichtste model dat de taak aankan.
- Werk met minimale input: doel + scope + files.

## Docs-workflow

Bij wijzigingen aan canonieke docs:

- werk eerst de handmatige docs bij
- houd ook root `README.md` synchroon met actuele runtime/feature-realiteit
- draai daarna:
  - `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `docs/upload/**` is generated uploadoutput voor de gebruiker; gebruik deze map niet als canonieke agentbron.
- Standaard uploadset staat in `docs/upload/upload-manifest.md` en bevat ChatGPT Project context, MVP design spec en Stitch design context.

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

Regel:

- `npm run dev` is lokaal-only en mag geen remote functions deploy doen.
- productie deploy van Supabase Edge Functions loopt alleen via GitHub Actions.

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
