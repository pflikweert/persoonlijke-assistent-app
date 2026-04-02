# Current Project Status

## Doel
Huidige projectstatus op basis van validatie van bestaande docs tegen de actuele codebase.

## Huidige productkern (docs + code)
- Capture via tekst en audio.
- Server-side verwerking via `process-entry`.
- Opslag in `entries_raw`, `entries_normalized`, `day_journals`.
- UI voor Vandaag, Vastleggen, Dagen, Dagdetail en Reflecties.
- Reflectiegeneratie via `generate-reflection` voor week en maand.

Bronnen:
- `docs/project/docs/project/master-project.md`
- `docs/project/product-vision-mvp.md`
- `app/**`, `services/**`, `supabase/functions/**`, `supabase/migrations/**`

## Validatie tegen codebase
Gevalideerd in:
- `app/**` (schermen + navigatie)
- `services/**` (flows + data-aanroepen)
- `supabase/functions/**` (process-entry, generate-reflection)
- `supabase/migrations/**` en `src/lib/supabase/database.types.ts`
- `scripts/**` en `package.json`

### Reality matrix
| Onderwerp | Docs-status | Code-status | Conclusie |
|---|---|---|---|
| Auth basis (magic link) | In scope / aanwezig | Aanwezig | `app/sign-in.tsx` + `services/auth.ts` + auth-gating in `app/_layout.tsx`. |
| Capture text | In scope | Aanwezig | `submitTextEntry` + typing state in `app/(tabs)/capture.tsx`. |
| Capture audio | In scope | Aanwezig | Recorder + submitAudioEntry + guards in `capture.tsx`/`services/entries.ts`. |
| Process-entry flow | Kernflow release 1 | Aanwezig | Edge function `supabase/functions/process-entry/index.ts` actief gebruikt, plus aparte `renormalize-entry` stap voor edits. |
| Entry normalisatie | Kernflow release 1 | Aanwezig | In `process-entry` (normalize stap + persist `entries_normalized.body` als opgeschoonde volledige tekst, met bronbehoud-guardrail) en `renormalize-entry` voor edit-hernormalisatie. |
| Day journal opbouw | Kernflow release 1 | Aanwezig | In `process-entry` en extra client-regenerate helper in `services/day-journals.ts`; via edits/delete kan de dagjournal opnieuw opgebouwd worden. |
| Vandaag/Home scherm | In scope | Aanwezig | `app/(tabs)/index.tsx`. |
| Dagenlijst | In scope | Aanwezig | `app/(tabs)/days.tsx`. |
| Dagdetail | In scope | Aanwezig | `app/day/[date].tsx`. |
| Read modal op entries | Niet expliciet in hoofdscope, wel doorgevoerde UX | Aanwezig | In `app/day/[date].tsx` met `readingEntry` modal. |
| Edit entry | In scope dagdetail entries | Aanwezig | `updateNormalizedEntryById` + edit modal in dagdetail. |
| Delete entry | In scope dagdetail entries | Aanwezig | Delete via `deleteNormalizedEntryById` met raw+cascade pad. |
| Regenerate day journal | Genoemd in docs als actie | Deels aanwezig | Functioneel aanwezig via service/helper; geen aparte zichtbare “Opnieuw samenvatten”-knop in huidige UI. |
| Weekreflecties | In scope | Aanwezig | `generate-reflection` + UI generatie/fetch; hergeneratie wordt ook gebruikt na relevante entry-mutaties. |
| Maandreflecties | In scope | Aanwezig | `generate-reflection` + UI generatie/fetch; hergeneratie wordt ook gebruikt na relevante entry-mutaties. |
| Reflectiescherm | In scope | Aanwezig | `app/(tabs)/reflections.tsx` met week/maand switch + generatie. |
| Export / backup | Gepland in Fase 1.2D | Niet aangetroffen | Geen export-feature in app/services/scripts gevonden. |
| Reset flows (productniveau) | Gepland in Fase 1.2D | Niet aangetroffen | Alleen infra/db reset commando’s; geen product-resetflow. |
| Logging / request tracing | Gepland in 1.2A | Aanwezig | `flowId/requestId` contract + `flow-logger.ts` in beide edge functions. |
| Verify scripts | Gepland/benoemd | Aanwezig | `verify-local-flow`, `verify-local-audio-flow`, `verify-local-reflection-flow`, `verify-local-output-quality`. |
| Smoke tests | Gepland in 1.2E | Deels aanwezig | Verify-scripts aanwezig; aparte UI smoke-testsuite niet aangetroffen. |
| UX polish states | Gepland in 1.2C | Deels aanwezig | Veel loading/empty/error states via `StateBlock`; niet aantoonbaar uniform op alle schermen/flows. |
| Design doorvoer 1.2.1 | Leidend designspoor | Deels aanwezig | Foundations + meerdere schermpasses zichtbaar; geen hard bewijs dat volledige 1.2.1-uitvoervolgorde compleet is. |

## Wat aantoonbaar al gedaan/besloten is
- Release-1 kernschermen en kernservices zijn aanwezig.
- Drie edge functions zijn aanwezig en gekoppeld aan app-services:
  - `process-entry`
  - `generate-reflection`
  - `renormalize-entry`
- Datamodel voor release-1 tabellen staat in migrations en types.
- Lokale verify scripts voor text/audio/reflection/output-quality zijn aanwezig.
- Dagdetail entry-actions zijn aanwezig (read/edit/delete) met herverwerking van dag + reflecties.
- Entry-normalisatie is nu expliciet bronnabij gehouden: `entries_raw` blijft bron, `entries_normalized.body` blijft volledige opgeschoonde tekst, `summary_short` is preview-only, en quality-verify bevat een lange-entry regressiecheck.

## Fases/subfases (herijkt op code)
- Fase 0: Aanwezig (setupbasis, scripts, env-structuur).
- Fase 1 kernlus: Aanwezig (auth + capture + processing + day journals + reflecties + schermen).
- Fase 1.2A (stabiliteit/logging/verify): Deels aanwezig.
- Fase 1.2B (outputkwaliteit): Deels aanwezig (quality script + guards aanwezig; volledige kwaliteitsset als “afgerond” niet aantoonbaar).
- Fase 1.2C (UX-polish): Deels aanwezig.
- Fase 1.2D (export/reset): Niet aangetroffen.
- Fase 1.2E (beta readiness/smoke): Deels aanwezig.

## Huidige MVP waarheid
- In code aanwezig: capture (tekst/audio), normalisatie, day journal opbouw, week/maand reflecties, dagen/dagdetail/reflectiescherm.
- Niet aangetroffen in code als productfeature: export/backup/reset flows.

## Wat niet meer leidend is
- `docs/design/archive/phase-1.3-design-direction.md` (historisch).

## Welke documenten leidend zijn
- Product/scope:
  - `docs/project/docs/project/master-project.md`
  - `docs/project/product-vision-mvp.md`
- Design:
  - `docs/design/mvp-design-spec-1.2.1.md`
  - `design_refs/1.2.1/ethos_ivory/DESIGN.md`
  - `design_refs/1.2.1/*/code.html` en `design_refs/1.2.1/*/screen.png`
- Setup:
  - `README.md`
  - `docs/setup/step-0-readiness.md`

## Docs audit samenvatting
- Leidend:
  - `docs/project/master-project.md`, `docs/project/product-vision-mvp.md`, `docs/design/mvp-design-spec-1.2.1.md`, `design_refs/1.2.1/*`
- Verouderd/historisch:
  - `docs/design/archive/phase-1.3-design-direction.md`
- Overlap:
  - Setup info in zowel `README.md` als `docs/setup/step-0-readiness.md`
  - Productrichting in zowel `docs/project/master-project.md` als `docs/project/product-vision-mvp.md` (aanvullend)
- Aangepast in deze herijking:
  - `docs/project/current-status.md`
  - `docs/project/open-points.md`
