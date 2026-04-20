# Current Status — Codegevalideerd

## Doel

Dit document is de enige statuswaarheid voor implementatierealiteit.

## Obsidian links

- [[open-points]]
- [[20-planning/20-active-phase|Active phase]]
- [[20-planning/30-now-next-later|Now / Next / Later]]
- [[20-planning/40-deviations-and-decisions|Deviations and decisions]]
- [[10-strategy/README|Strategy hub]]
- [[30-research/README|Research hub]]
- [[40-ideas/README|Ideas workspace]]

Bronnen voor deze status:

1. bestaande projectdocs (scope/planning)
2. actuele codebase (bewijs van implementatie)

## Auditbasis

Gecontroleerd op:

- `docs/**`, `README.md`, `docs/README.md`, `AGENTS.md`
- `.agents/skills/**`
- `app/**`, `components/**`, `services/**`
- `supabase/functions/**`, `supabase/migrations/**`
- `scripts/**`, `package.json`

## Statuslabels

- **Aanwezig**: hard aantoonbaar in code
- **Deels aanwezig**: aantoonbare onderdelen, maar niet volledig bewezen als afgerond
- **Niet aangetroffen**: geen implementatie gevonden
- **Onzeker**: bewijs onvoldoende

## Bewijsmatrix (docsplan vs code)

| Onderwerp | Oorspronkelijk plan | Code-status | Conclusie |
| --- | --- | --- | --- |
| Auth (magic link) | In scope | **Aanwezig** | `app/sign-in.tsx`, `services/auth.ts`, auth-gating in `app/_layout.tsx`. |
| Capture tekst | In scope | **Aanwezig** | `submitTextEntry` + capture UI in `app/capture/index.tsx` en `app/capture/type.tsx`, met servicekoppeling in `services/entries.ts`. |
| Capture audio | In scope | **Aanwezig** | recorder + audio-submit + payload guards in capture/services. |
| Intake flow | Kernflow | **Aanwezig** | `supabase/functions/process-entry/index.ts` + client invoke. |
| Entry hernormalisatie bij edit | Hardening-onderdeel | **Aanwezig** | `renormalize-entry` function + dagdetail editpad. |
| Day journal opbouw | Kernflow | **Aanwezig** | upsert in `process-entry` + `regenerate-day-journal` flow. |
| Reflecties week/maand | Kernflow | **Aanwezig** | `generate-reflection` function + reflectie UI/service. |
| Dagdetail mutaties | UX/hardening | **Aanwezig** | edit/delete + derived refresh in `app/day/[date].tsx` en `app/entry/[id].tsx`. |
| “Opnieuw samenvatten” als zichtbare knop | Genoemd in documentatie | **Deels aanwezig** | heropbouw bestaat functioneel, expliciete zichtbare knop niet hard aangetroffen. |
| ChatGPT markdown import | Niet kern in oorspronkelijke scope | **Aanwezig (feature-flagged)** | `app/settings.tsx`, `services/import/*`, `import-chatgpt-markdown` function + migrationkolommen. |
| Instellingen-submenu | Gevraagd in beheerflow | **Aanwezig** | `app/settings.tsx` toont submenu met `Archief downloaden`, `Importeren`, `Verwijder alles` en admin-only `Data opnieuw verwerken`. |
| Audio-opslagvoorkeur + opnamebewaring | Niet expliciet in vroeg MVP-plan uitgewerkt | **Aanwezig** | `app/settings-audio.tsx`, `services/user-preferences.ts`, migration `20260418101500_entry_audio_storage_and_user_preferences.sql` met `user_preferences`, audio metadata op `entries_raw` en private `entry-audio` bucket policies. |
| User background tasks voor import-status | Hardening-uitbreiding buiten oorspronkelijke kernformule | **Aanwezig** | migration `20260416125000_user_background_tasks.sql` + UI-componenten `components/feedback/background-task-*` + import/services-koppeling voor voortgang en notice-state. |
| Admin globale regeneratiejob | Gevraagd in beheerflow | **Aanwezig** | `app/settings-regeneration.tsx`, `services/admin-regeneration.ts`, `supabase/functions/admin-regeneration-job/index.ts`. |
| OpenAI Batch API verwerking | Vereiste voor schaal/efficiëntie | **Aanwezig** | batch-upload + create/poll/apply + retry-pad op `error_file_id` in `admin-regeneration-job`. |
| Voortgang/status per datatype | Vereiste voor transparantie | **Aanwezig** | teller- en fasevelden (`total/queued/openai_completed/applied/failed/remaining/phase`) in job-steps + UI. |
| Metadata generatie-info (`generation_meta`) | Gevraagd voor gerichte re-run | **Aanwezig** | migration `20260404201500_*` + writes vanuit `admin-regeneration-job` op entries/day/period. |
| Admin-only afscherming regen-pagina | Vereiste security | **Aanwezig** | route verborgen voor niet-admin in `app/settings.tsx` + server-side allowlist checks in function. |
| Product-export voor gebruiker | Gepland in 1.2D | **Aanwezig** | productflow aanwezig in `app/settings.tsx` + `app/settings-export.tsx` op `downloadUserArchive`; handmatige settings-tests bevestigen werkende exportflow, en runtime/API-check bevestigt aanwezige exportbrondata. |
| Product-reset/delete-all | Gepland in 1.2D | **Aanwezig** | delete-sheet flow aanwezig in `app/settings.tsx` met `confirm/loading/success/error`; handmatige settings-tests bevestigen de gebruikersflow en runtime/API-check toont leegmaken van `period_reflections`, `day_journals`, `entries_normalized`, `entries_raw`. |
| Logging/tracing | Gepland 1.2A | **Aanwezig** | `requestId/flowId` contract + `_shared/flow-logger.ts`. |
| Verify scripts lokaal | Gepland 1.2A/1.2E | **Aanwezig** | text/audio/reflection/output-quality scripts aanwezig. |
| AI Quality Studio contract-first editor (`entry_cleanup`) | Hardening AI governance | **Aanwezig** | editor split met alleen taakinstructie als bewerklaag; input/system/response/model + baseline metadata read-only zichtbaar. |
| AIQS admin detail topnav + sticky action footer (shared) | UX/hardening admin | **Aanwezig** | gedeelde admin topnav en 3-action sticky footer primitives toegepast op task/draft/test detailschermen. |
| AIQS prompt-assist preview voor `entry_cleanup` (admin-only) | Editor hardening | **Aanwezig** | server-side action `prompt_assist_preview` + client service/types + draft editor met single-target apply, inline diff en issue-signalen zonder brede chat-UI. |
| Import verify fixtureconsistentie | Kwaliteitsborging | **Niet aangetroffen / onzeker** | import-tests verwijzen naar ontbrekende fixture `docs/dev/Dagboek voor gemoedstoestand.md`. |
| Design 1.2.1 volledige doorvoer | Gepland designspoor | **Aanwezig** | designrefs zijn structureel doorvertaald in shared primitives en kernflows; shell/theming/copy-guardrails zijn expliciet geborgd in canonieke docs en runtime-checklist. |
| Foundation polish: editorial typography + selective ambient backgrounds | Shared design-system hardening | **Aanwezig** | `theme/tokens.ts` bevat nu expliciete typography-roles inclusief display title en gedeelde `ambient/subtle/flat` background tokens; `components/themed-text.tsx`, `components/ui/app-background.tsx`, `components/ui/home-screen-primitives.tsx`, `components/ui/auth-screen-primitives.tsx` en Today (`app/(tabs)/index.tsx`) gebruiken deze foundation. |
| Branded productlaag “Budio Vandaag” in shell/auth/menu | Niet als losse MVP-feature benoemd in vroege projectdocs | **Aanwezig** | branded login/header/menu/splash doorgevoerd in `app/sign-in.tsx`, `components/ui/auth-screen-primitives.tsx`, `components/navigation/fullscreen-menu-overlay.tsx`, `app/(tabs)/index.tsx`, `app.json`. |

## Fase 1.2 status

| Subfase | Status | Onderbouwing |
| --- | --- | --- |
| 1.2A Stabiliteit/foutafhandeling | **Aanwezig** | tracing, foutafhandeling en verify-commando’s zijn aanwezig en actief gebruikt in hardening-passes. |
| 1.2B Outputkwaliteit | **Deels aanwezig** | contracts/guardrails/quality-checks aanwezig; eindstatus “afgerond” niet hard vastgelegd. |
| 1.2C UX-polish | **Aanwezig** | kernflows en shared shell/primitives zijn gepolijst met bron-first fixes en mode-aware guardrails. |
| 1.2D Vertrouwen (export/reset) | **Aanwezig** | settings export/import/delete zijn functioneel geland; handmatige tests bevestigen gebruikersflows en runtime/API-checks bevestigen service- en data-effecten. |
| 1.2E Private-beta readiness | **Deels aanwezig** | setup + verify aanwezig; smoke/release-checklist is nu vastgelegd, maar volledige light/dark runtime-doorloop per kernflow blijft bewijsafhankelijk. |

## Private-beta smoke checklist (1.2E)

Gebruik deze checklist voor proof-first release/hardening. Vink alleen af met runtime-bewijs (light + dark) en check tegen relevante `design_refs/1.2.1/**`.

### Kernflow-routes

- [ ] Auth/login: route opent zonder layoutbreuk; copy compact; geen zware enclosing card.
- [ ] Today: primaire CTA visueel dominant; statusregel compact; recente context secundair.
- [ ] Capture (idle/voice/typing): affordance direct duidelijk; geen toolbars/live transcript/pause-uitbreiding.
- [ ] Post-entry: completion-feel rustig; narrative leesbaar; bewerkactie klein; delete niet dominant.
- [ ] Day detail: reading-hiërarchie helder; geen visuele card-stapeling.
- [ ] Entry detail: terugkoppeling naar juiste dag; narrative/result rustig; acties functioneel compact.
- [ ] Days overview: list-not-cards; per maand gegroepeerd; datum + scanbare samenvatting.
- [ ] Week overview: insight-not-analytics; korte summary + narrative + subtiele highlights.
- [ ] Month overview: insight-not-analytics; korte summary + narrative + subtiele highlights.
- [ ] Settings hub: nav/hero/rows consistent; destructive row rustig.
- [ ] Export: hero/action/notice hiërarchie helder; copy compact.
- [ ] Import: hero/action/result-states helder; voortgang begrijpelijk.
- [ ] Delete/reset flow: confirm/loading/success/error begrijpelijk en rustig.
- [ ] Fullscreen menu/shell/tab bar: header/page/footer coherent; menu/backdrop rustig.

### Theming en shell

- [ ] Light/dark delen dezelfde compositie; dark mode voegt geen extra massa/lagen toe.
- [ ] Header en footer rustiger dan page background; geen decoratieve shell-randen als default.
- [ ] Background modes zijn selectief en mode-aware (`ambient`, `subtle`, `flat`).
- [ ] Content-heavy screens blijven `flat` en clean-first.

### Copy en UX-guardrails

- [ ] Copy is kort, menselijk, direct; geen AI/coach/productivity-taal.
- [ ] Geen dubbele uitleg rond dezelfde primaire actie.
- [ ] Geen dashboardisering/assistentdrift in overview- en reflection-flows.

### Evidence-regel

- [ ] Werk wordt pas “klaar” genoemd na: routecheck + light/dark runtime-check + vergelijking met relevante design refs.

## Correcties op eerdere ruis

- Foutieve padverwijzing gecorrigeerd: `docs/project/docs/project/master-project.md` bestaat niet; correct is `docs/project/master-project.md`.
- Productfeature, dev-tooling en verify-tooling zijn expliciet onderscheiden.
- Tooling-aanwezigheid telt niet automatisch als gebruikersfeature.

## Workflow/docs realiteit (april 2026)

- Rolverdeling ChatGPT Projects (strategie/review/promptontwerp) vs Cline (repo-uitvoering) is nu expliciet vastgelegd in `AGENTS.md`.
- Scheiding tussen canonieke projectdocs (`docs/project/**`), workflowdocs (`docs/dev/**`) en uploadartefacten (`docs/upload/**`) is expliciet aangescherpt.
- Er is een operationele workflowdoc toegevoegd: `docs/dev/cline-workflow.md`.
- Er is een lichte repo-eigen memory-bank/active-context workflow vastgelegd in `docs/dev/memory-bank.md` en `docs/dev/active-context.md` (operationeel, niet-canoniek).

## Delta-audit (laatste 2 weken codewijzigingen)

- Capture/detail-flows zijn verder gepolijst met audio-afspeelcomponent (`components/journal/entry-audio-player.tsx`), verfijnde modals en rustiger feedbackstates.
- Settings-informatiearchitectuur is uitgebreid met aparte audio-instellingen (`app/settings-audio.tsx`) naast export/import/delete/admin.
- Obsidian-settingspad is technisch toegevoegd maar default-off gezet achter feature flag (`enableObsidianSettings`) en staat daarmee buiten de standaard productroute.
- Importflow gebruikt nu expliciet background task infrastructuur (`user_background_tasks`) voor voortgang/notices i.p.v. enkel schermgebonden status.
- AIQS adminflow is verdiept met editor- en readmodelverbeteringen, prompt-assist en debug-opslagfundering.
- Supabase hardening is uitgebreid met securityfixes op `search_path` en extra datafundering (`entries_normalized.updated_at`, audio storage metadata/policies).
- UI-shell/branding is zichtbaarder door branded auth/header/menu/splash doorvertaling.

## Recente regressie-learnings (april 2026)

- Admin-access UI mag alleen `Geen toegang` tonen bij expliciete auth-codes (`AUTH_UNAUTHORIZED`/`AUTH_MISSING`), niet bij generieke netwerk- of loadfouten.
- Allowlist parsing in edge functions moet gequote env-waarden (`"uuid"`, `'uuid'`) normaliseren om false `Forbidden` te voorkomen.
- Prompt-editor newline/paragraph normalisatie moet editor-overstijgend consistent blijven; sectiewissels mogen geen lege-regel-migratie veroorzaken.
- AIQS token-editor blijft bewust compact: helperblok “Gebruikte tokens” verwijderd en editor-surface blijft licht voor leesbaarheid in dark mode.

## Strategische afwijking t.o.v. nieuw researchpakket

- De huidige runtime is sterker in capture/hardening dan in commerciële output-conversie: de app levert aantoonbaar capture, daglaag, reflecties, import/export, audio-opslagoptie en admin-governance.
- De in research beschreven Pro-wedge (capture -> review -> publiceerbare output) is nog niet productmatig als eindgebruikersflow geland.
- AIQS is al een sterke admin control-laag, maar nog niet de volledige future-state control plane met breed task-registry, usage-economie en product-tiering in runtime.

## Samenvatting

De release-1 kernlus is aantoonbaar gebouwd. Daarnaast is een admin-only settingspad toegevoegd voor globale herverwerking via OpenAI Batch API, inclusief persistente jobstatus en per-type voortgang. Voor 1.2D zijn settings export/import/delete nu functioneel bewezen binnen deze afgesloten scope (handmatige flow-validatie + runtime/API-bewijs van service- en data-effecten). Onvoldoende bewezen claims buiten deze scope blijven expliciet onzeker.
