# Current Status — Codegevalideerd

## Doel
Dit document beschrijft de actuele werkelijkheid van het project op basis van:
1. bestaande projectdocs (scope/planning)
2. actuele codebase (bewijs van implementatie)

## Auditbasis
Gecontroleerd op:
- `docs/**`, `README.md`, `docs/README.md`, `AGENTS.md`
- `.agents/skills/**`
- `app/**`, `components/**`, `services/**`
- `supabase/functions/**`, `supabase/migrations/**`
- `scripts/**`, `package.json`

## Leidende documenten nu
- `docs/project/master-project.md`
- `docs/project/product-vision-mvp.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/content-processing-rules.md`

## Bewijsmatrix (docsplan vs code)
| Onderwerp | Oorspronkelijk plan | Code-status | Conclusie |
|---|---|---|---|
| Auth (magic link) | In scope | **Aanwezig** | `app/sign-in.tsx`, `services/auth.ts`, auth-gating in `app/_layout.tsx`. |
| Capture tekst | In scope | **Aanwezig** | `submitTextEntry` + capture UI in `app/(tabs)/capture.tsx`, `services/entries.ts`. |
| Capture audio | In scope | **Aanwezig** | recorder + audio-submit + payload guards in capture/services. |
| Intake flow | Kernflow | **Aanwezig** | `supabase/functions/process-entry/index.ts` + client invoke. |
| Entry hernormalisatie bij edit | Hardening-onderdeel | **Aanwezig** | `renormalize-entry` function + dagdetail editpad. |
| Day journal opbouw | Kernflow | **Aanwezig** | upsert in `process-entry` + `regenerate-day-journal` flow. |
| Reflecties week/maand | Kernflow | **Aanwezig** | `generate-reflection` function + reflectie UI/service. |
| Dagdetail mutaties | UX/hardening | **Aanwezig** | edit/delete + derived refresh in `app/day/[date].tsx` en `app/entry/[id].tsx`. |
| “Opnieuw samenvatten” als zichtbare knop | Genoemd in oude beschrijving | **Deels aanwezig** | functionele heropbouw bestaat, maar geen expliciete knop met die naam in huidige UI. |
| ChatGPT markdown import | Niet kern in oorspronkelijke scope | **Aanwezig (feature-flagged)** | `app/settings.tsx`, `services/import/*`, `import-chatgpt-markdown` function + migrationkolommen. |
| Product-export voor gebruiker | Gepland in 1.2D | **Niet aangetroffen** | geen exportflow in app-UX/services voor eindgebruiker. |
| Product-reset/delete-all | Gepland in 1.2D | **Niet aangetroffen** | geen gebruikersresetflow aangetroffen. |
| Logging/tracing | Gepland 1.2A | **Aanwezig** | `requestId/flowId` contract + `_shared/flow-logger.ts`. |
| Verify scripts lokaal | Gepland 1.2A/1.2E | **Aanwezig** | text/audio/reflection/output-quality scripts aanwezig. |
| Import verify fixtureconsistentie | Kwaliteitsborging | **Niet aangetroffen / onzeker** | `scripts/test-chatgpt-markdown-import.mjs` en `verify-local-chatgpt-import.sh` verwijzen naar ontbrekend `docs/dev/Dagboek voor gemoedstoestand.md`. |
| Design 1.2.1 volledige doorvoer | Gepland designspoor | **Onzeker** | refs bestaan, maar complete implementatiedekking per scherm niet hard bewezen. |

## Fase 1.2 status op code
| Subfase | Status | Onderbouwing |
|---|---|---|
| 1.2A Stabiliteit/foutafhandeling | **Deels aanwezig** | tracing + verify aanwezig; geen harde afrondingsregistratie als complete subfase. |
| 1.2B Outputkwaliteit | **Deels aanwezig** | contracts/guardrails/quality-script aanwezig; eindstatus “afgerond” niet hard vastgelegd. |
| 1.2C UX-polish | **Deels aanwezig** | duidelijke polish in kernschermen; volledigheid over alle flows niet hard bewezen. |
| 1.2D Export/reset vertrouwen | **Niet aangetroffen** | productniveau export/reset ontbreekt. |
| 1.2E Private-beta readiness | **Deels aanwezig** | setup + verify aanwezig; complete smoke/release-checklist niet hard aangetroffen. |

## Correcties op eerdere documentatieruis
- Foutieve padverwijzing gecorrigeerd: `docs/project/docs/project/master-project.md` bestaat niet; correct is `docs/project/master-project.md`.
- Verschil expliciet gemaakt tussen:
  - productfeature
  - dev tooling (bijv. dumps)
  - verify tooling
- Aanwezigheid van tooling is niet automatisch aanwezigheid van gebruikersfeature.

## Wat niet meer leidend is
- `docs/project/archive/**`
- `docs/design/archive/**`
- historische dumps in `docs/dev/archive/**`

## Samenvatting
De release-1 kernlus is aantoonbaar gebouwd. Fase 1.2 heeft duidelijke voortgang in A/B/C/E, maar D (export/reset als productfeature) is niet aangetroffen. Enkele claims blijven bewust onzeker tot hard bewijs beschikbaar is.
