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

Regels:

- `master-project.md` = product, scope, fasekaart, beslisregels
- `product-vision-mvp.md` = productgedrag en guardrails
- `current-status.md` = enige statuswaarheid voor code-realiteit
- `open-points.md` = resterende gaps en onzekerheden
- `content-processing-rules.md` = canonieke inhouds- en outputregels
- `copy-instructions.md` = canonieke copy-, tone-of-voice- en microcopyregels

## Canonieke designbronnen (MVP 1.2.1)

- `docs/design/mvp-design-spec-1.2.1.md` is leidend voor MVP-designbeslissingen.
- `design_refs/1.2.1/ethos_ivory/DESIGN.md` is leidend voor foundations.
- `design_refs/1.2.1/*/code.html` en `design_refs/1.2.1/*/screen.png` zijn leidend per scherm.
- `docs/design/archive/phase-1.3-design-direction.md` is verouderd en niet leidend.

## Werkwijze

- Herbeslis geen bestaande keuzes uit de projectdocs.
- Geen feature creep buiten de vastgelegde scope.
- Werk cheap-first: kleinste werkende wijziging eerst.
- Houd taken klein en scherp afgebakend.
- Gebruik bestaande patronen in de repo vóór nieuwe patronen.

## Skill-selectie

- Gebruik `.agents/skills/stitch-redesign-execution/SKILL.md` voor scherm-redesigns op basis van Stitch exports in `design_refs/...`.

## Codex-regels

- Gebruik minimale context per prompt.
- Herhaal geen projectcontext uit docs.
- Werk met 1 taak per prompt.
- Gebruik plan mode alleen bij bugs, multi-file wijzigingen of migraties.

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

Bij wijzigingen in admin-regeneratie:
- documenteer altijd zichtbaarheidsregel (admin-only) en allowlist-mechanisme
- documenteer relevante env-vars (`ADMIN_REGEN_ALLOWLIST_USER_IDS`, `ADMIN_REGEN_INTERNAL_TOKEN`)

## Lokale restart/deploy beslisregel

Na relevante wijzigingen expliciet melden welke extra stap nodig is:

- alleen app/frontend gewijzigd -> meestal niets extra's of alleen app-restart
- `supabase/functions/**` gewijzigd -> `npm run supabase:functions:restart`
- `supabase/migrations/**` gewijzigd -> lokale `db push`/`db reset` + eventuele type-regeneratie
- geen relevante runtime-impact -> expliciet melden dat niets extra's nodig is

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
