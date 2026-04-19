# DO NOT EDIT - GENERATED FILE

# Budio Product Truth

Build Timestamp (UTC): 2026-04-19T13:35:47.478Z
Source Commit: b30bc50

Doel: primaire uploadbundle met productkaders, statusrealiteit en actieve planningsfocus.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Bronbestanden (vaste volgorde)
- docs/project/README.md
- docs/project/master-project.md
- docs/project/product-vision-mvp.md
- docs/project/current-status.md
- docs/project/open-points.md
- docs/project/content-processing-rules.md
- docs/project/copy-instructions.md
- docs/project/ai-quality-studio.md
- docs/dev/cline-workflow.md
- docs/project/20-planning/README.md
- docs/project/20-planning/10-roadmap-phases.md
- docs/project/20-planning/20-active-phase.md
- docs/project/20-planning/30-now-next-later.md
- docs/project/20-planning/40-deviations-and-decisions.md

## Leesregel
- Dit is de primaire bron voor scope, status en uitvoering binnen de huidige fase.
- Strategische verdieping staat in de strategy/research bundle.

---

## Docs-Hiërarchie Samenvatting

# Projectdocs — Waarheidshiërarchie en Operating System

Deze map bevat de actieve projectwaarheid voor scope, richting en status,
plus een lean operating system voor strategie, planning en ideeën.

## 0) Lean operating system (nieuw)

- `docs/project/10-strategy/**` = lange termijn richting (horizon)
- `docs/project/20-planning/**` = actieve fase, roadmap, now/next/later en afwijkingslog
- `docs/project/40-ideas/**` = gestructureerde ideeënruimte (één idee per file + inbox)

Regel:
- deze lagen sturen focus en executie
- ze vervangen niet automatisch canonieke productwaarheid
- statusclaims blijven bewijs-gebonden in `current-status.md`

### Obsidian graph hubs
- Strategy hub
- Planning hub
- Research hub
- Ideas workspace
- Current status
- Open points

## 1) Canonieke handmatige documenten (leidend)
1. `docs/project/master-project.md`
2. `docs/project/product-vision-mvp.md`
3. `docs/project/current-status.md`
4. `docs/project/open-points.md`
5. `docs/project/content-processing-rules.md`
6. `docs/project/copy-instructions.md`
7. `docs/project/ui-modals.md`
8. `docs/project/ai-quality-studio.md`

Aanvulling:
- `docs/project/ai-quality-studio.md` is de centrale AI governance-laag voor AI-gedrag, promptbeheer en evaluatie.

Overgangsnoot:
- Canonieke docs staan nu nog op rootniveau van `docs/project/`.
- De nieuwe structuur (`10-strategy/`, `20-planning/`, `40-ideas/`) wordt vanaf nu gebruikt om richting/focus/ideeën gescheiden te beheren.

## 2) Generated documenten (afgeleid, niet leidend)
- `docs/project/generated/chatgpt-project-context.md`
- `docs/project/generated/budio-research.md`
- `docs/design/generated/stitch-design-context.md`
- `docs/upload/**`

Regel:
- handmatige docs zijn de bron
- generated docs zijn afgeleide output
- `docs/upload/**` is alleen bedoeld als kant-en-klare uploadset voor de gebruiker; agents gebruiken deze map niet als canonieke bron

## 3) Archive-only (niet leidend)
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/archive/**`

## 3b) Research-documenten (strategische input, niet canonieke MVP-waarheid)
- `docs/project/30-research/**`

Regel:
- research-documenten zijn bedoeld als richting-, markt- en scenario-input
- ze vervangen niet automatisch de canonieke MVP-kaders in `master-project.md` en `product-vision-mvp.md`
- feitelijke implementatierealiteit blijft in `current-status.md` en `open-points.md`

## 3c) Ideas-documenten (gestructureerde ideecapture, niet canonieke waarheid)
- `docs/project/40-ideas/**`

Regel:
- `ideas/00-ideas-inbox.md` is snelle capture (ruw)
- gepromoveerde ideeën krijgen één file per idee in categorie-submap
- ideas zijn voorstelruimte; alleen na besluit + bewijs doorstromen naar planning/status/canonieke docs

## 3d) Planning-documenten (actieve focuslaag)
- `docs/project/20-planning/**`

Regel:
- `planning/20-active-phase.md` is de huidige focuslaag voor uitvoering
- afwijkingen op actieve fase worden vastgelegd in `planning/40-deviations-and-decisions.md`
- planning is richtinggevend voor werkvolgorde, maar statuswaarheid blijft code/bewijs-gedreven

## 4) Standaard upload naar ChatGPT Project / Stitch
Upload standaard de bestanden uit `docs/upload/`:
1. `docs/upload/00-budio-upload-manifest.md`
2. `docs/upload/10-budio-product-truth.md`
3. `docs/upload/20-budio-strategy-and-research.md`
4. `docs/upload/25-budio-ideas-and-opportunity-map.md`
5. `docs/upload/30-budio-build-truth.md`
6. `docs/upload/40-budio-ui-system-and-design-truth.md`
7. `docs/upload/50-budio-ai-governance-and-operations.md`

Reden:
- de uploadset is logisch geordend (00/10/20/30/40/50) voor vaste leesvolgorde
- productwaarheid, strategie/research, build-truth, UI/design en AI-governance zijn expliciet gescheiden
- ideas/opportunity mapping is expliciet gescheiden van strategy/research
- het manifest maakt de primaire uploadset controleerbaar
- use-case subsets staan in `docs/upload/00-budio-upload-manifest.md`

Legacy compatibiliteit:
- Bestaande legacy uploadfiles (zoals `chatgpt-project-context.md`, `budio-research.md`, `upload-manifest.md`) blijven beschikbaar voor bestaande workflows,
  maar de 00/10/20/30/40/50-set is de primaire standaard.

## 5) Wat je normaal niet hoeft te uploaden
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/**`
- setup/run-notities zonder canonieke productwaarheid

## 6) Onderhoudsflow
1. Werk eerst de handmatige canonieke docs bij.
2. Draai `npm run docs:bundle`.
3. Controleer met `npm run docs:bundle:verify`.
4. Commit canonieke docs + generated output samen.

## 7) Werken met ChatGPT Projects + Cline
- **ChatGPT Projects**: strategie, review en promptontwerp buiten repo-uitvoering.
- **Cline in VS Code**: repo-analyse, plan, wijzigingen, verify en commit.
- Leidende waarheid voor product/scope/status staat in `docs/project/**`.
- `AGENTS.md` + `.clinerules` zijn leidend voor werkwijze tijdens uitvoering.
- Skills gebruik je alleen wanneer een taak duidelijk in een bestaande skillflow valt.
- `docs/upload/**` blijft uploadartefact (generated), geen canonieke agentbron.
- Bij wijzigingen aan canonieke docs: altijd bundlen + verify (`npm run docs:bundle` en `npm run docs:bundle:verify`).
- Sessielearnings horen in:
  - `AGENTS.md` voor always-on repo-regels
  - `docs/dev/**` voor operationele workflowafspraken
  - `docs/project/current-status.md` alleen voor bewijsbare statusrealiteit
  - niet in productdocs als toolingsruis

## 8) Repo-eigen Memory Bank (workflow, geen extra waarheid)
Deze repo gebruikt een lichte memory-bank workflow als uitvoerhulp, zonder tweede waarheidshiërarchie.

Relatie tussen lagen:
- `docs/project/**` = canonieke waarheid (product/scope/status)
- `AGENTS.md` = always-on uitvoerregels
- `.agents/skills/**` = taak-/domeinspecifieke herhaalpatronen
- `docs/dev/cline-workflow.md` = operationele Cline-werkwijze
- `docs/dev/memory-bank.md` = memory-bank principes en update-regels
- `docs/dev/active-context.md` = tijdelijke sessiecontext (niet-canoniek)

Regels:
- geen generieke memory-bank boom toevoegen
- geen duplicatie van canonieke docs
- `current-status.md` blijft de enige statuswaarheid

## Obsidian graph — snelle start
- Gebruik hubs als startpunt: 10-strategy/README, 20-planning/README, 30-research/README, 40-ideas/README.
- Gebruik status-ankers: current-status en open-points.
- Mapstructuur alleen is niet genoeg; links tussen notities bouwen de graph-clusters.

---

## Hoofd Projectdocument

# Persoonlijke Assistent App — Master Project (Canoniek)

## Doel van dit document

Dit document beschrijft de stabiele productkaders:

- productdefinitie
- scope en buiten scope
- fasekaart
- beslisregels

Voor feitelijke implementatiestatus en code-realiteit is leidend:

- `docs/project/current-status.md`

## Productdefinitie

De app is een capture-first persoonlijke contextmachine:

- vastleggen via tekst en audio
- verwerken naar een leesbare dagboeklaag
- periodieke reflectie op basis van die dagboeklaag

Kernbelofte:

- snel vastleggen
- rustig teruglezen
- later overzicht zonder handmatig samenstellen

## Waarom dit product bestaat

Veel dagen verdwijnen in losse momenten, gedachten en notities.

Deze app is gebouwd om die fragmenten niet kwijt te raken.
Je legt snel vast wat er is, ziet het later terug als een leesbare dag, en kunt over een week of maand rustiger terugzien wat terugkomt.

De kernwaarde zit niet in meer functies, maar in continuïteit:

- snel vastleggen
- rustig teruglezen
- later overzicht zonder handmatig samenstellen

De app is daarmee geen coach, chatinterface of therapeutisch systeem, maar een rustige dagboekmachine die helpt om je eigen verhaal terug te zien.

## Scope (MVP)

In scope:

- auth-baseline
- capture via tekst en audio
- server-side verwerking van input
- dagboeklaag per dag
- week- en maandreflecties
- kernschermen voor capture, dagweergave en reflecties

Buiten scope:

- brede chat/coach/agent-ervaring
- retrieval/Q&A en vector search
- document intelligence als brede productlaag
- taken/agenda/reminders
- realtime voice als productmodus

## Fasekaart

### Fase 0

Setup en basisomgeving.

### Fase 1

Kernlus bouwen: van capture naar dagboeklaag en reflecties.

### Fase 1.2 (hardening)

Release-1 hardening in subfases:

1. 1.2A stabiliteit en foutafhandeling
2. 1.2B outputkwaliteit
3. 1.2C UX-polish
4. 1.2D vertrouwen (export/reset)
5. 1.2E private-beta readiness

Deze fase blijft hardening en is geen verbreding van productscope.

## Beslisregels

1. Capture-first blijft leidend.
2. Dagboeklaag blijft canonieke productlaag.
3. Geen scope-creep naar brede assistent.
4. Geen nieuwe app-architectuur binnen deze fase.
5. Twijfelgevallen worden niet als waarheid vastgezet zonder bewijs.
6. AI-gedrag en promptbeheer volgen `docs/project/ai-quality-studio.md`.

## Copykader (bindend)

Voor productcopy, microcopy en UX-tekst is leidend:

- `docs/project/copy-instructions.md`

Regel:

- copybeslissingen volgen dit document naast de productkaders in dit masterdocument.

## Post-MVP

Mogelijke vervolgsporen na afronding van 1.2:

### 1. Archiefdoorzoeking

- zoeken door dagen, weken en maanden
- sneller terugvinden wat er eerder speelde

### 2. Retrieval / Q&A over archief

- gerichte vragen stellen over eerder vastgelegde perioden of gebeurtenissen
- antwoorden blijven gebaseerd op opgeslagen dagboeklagen

### 3. Entiteitsextractie en tagging

- mensen
- plekken
- thema’s
- terugkerende onderwerpen

### 4. Persoonlijke archieflaag

- rijkere verbanden tussen dagen, perioden en terugkerende onderwerpen
- meer structuur bovenop het bestaande archief

### 5. Verdere intelligentielagen

- alleen toevoegen als ze de dagboekmachine versterken
- nooit als verbreding naar een brede coach-, chat- of agentervaring zonder expliciete nieuwe productfase

### Productregel voor later

Deze richtingen zijn waardevolle vervolgideeën, maar geen huidige MVP-belofte.

In de huidige fase blijft leidend:

- capture-first
- dagboeklaag centraal
- periodieke reflectie op basis van die dagboeklaag

---

## Productvisie Aanscherping

# Persoonlijke Assistent App — Productvisie Aanscherping (MVP)

## Doel

Dit document beschrijft gewenst productgedrag en guardrails binnen MVP.

Voor implementatiestatus en code-audit is leidend:

- `docs/project/current-status.md`

## Productgedrag

Bindende formule:

- capture → structureren → dagboeklaag → periodieke reflectie

Aangescherpte interactieformule:

- capture → korte ondersteuning waar passend → opname in dagboeklaag → latere reflectie

## Waarde voor de gebruiker

De app is bedoeld voor mensen die hun dagen niet kwijt willen raken in losse flarden.

De waarde zit in drie stappen:

1. snel vastleggen wat er vandaag gebeurt
2. dat terugzien als een leesbare dag
3. later rustiger herkennen wat terugkomt over een week of maand

De app helpt daarmee niet door veel te praten of te sturen, maar door continuïteit te geven aan eigen input.

Belangrijke productuitkomst:

- losse momenten worden één geheel
- teruglezen kost minder energie
- reflectie ontstaat op basis van je eigen dagboeklaag, niet op basis van losse herinneringen

## Dagboeklaag vs assistentlaag

### Dagboeklaag (canoniek)

- broninhoud van de gebruiker
- verwerkte daginhoud
- periodieke reflecties

Eigenschappen:

- duurzaam
- terugleesbaar
- leidend voor productwaarde

### Assistentlaag (ondersteunend)

- korte begeleiding direct rond capture
- begrensde, lichte ondersteuning

Eigenschappen:

- ondergeschikt aan dagboeklaag
- niet de primaire productmodus
- geen open chat als default

## Productguardrails

1. Dagboeklaag blijft centraal.
2. Assistentgedrag blijft kort en functioneel.
3. Geen therapeutische positionering.
4. Geen verschuiving naar brede coach/chatapp.
5. Rust, helderheid en eigenaarschap van gebruikersinhoud blijven leidend.

## UX-principes rond de kleine assistentlaag

1. Ondersteuning direct rond capture, niet als los chatuniversum.
2. Duidelijk onderscheid tussen wat tijdelijk helpt en wat canoniek wordt opgeslagen.
3. Toon: rustig, concreet, niet-zwaar.
4. Interactie blijft compact en doelgericht.

## Beslisregel voor uitbreidingen

Alleen uitbreiden als het de dagboekmachine versterkt.
Als het vooral richting brede assistent trekt, valt het buiten de huidige MVP-kaders.

## Huidige productclaim vs latere richting

### Huidige productclaim

De app is nu een capture-first dagboekmachine.

De kern is:

- snel vastleggen
- verwerken naar een leesbare dag
- later rustig terugzien wat terugkomt via week- en maandreflecties

De onderscheidende waarde zit in:

- brongebonden verwerking
- rustige narratieve reconstructie
- terugleesbaarheid zonder verzonnen interpretatie

### Latere richting

Na MVP kan dit uitgroeien tot een rijkere persoonlijke archieflaag, bijvoorbeeld met:

- archiefdoorzoeking
- retrieval/Q&A over eigen geschiedenis
- entiteitsextractie of tagging
- een bredere kennislaag bovenop het archief

### Belangrijke grens

Deze latere richting mag intern richting geven, maar is geen huidige productclaim.

We positioneren het product nu niet als:

- second brain
- knowledge base
- personal CRM
- life insights engine
- vraaginterface over je leven

Zolang deze lagen niet productmatig bewezen en expliciet in scope zijn, blijven ze post-MVP.

---

## Actuele Gebouwde Status

# Current Status — Codegevalideerd

## Doel
Dit document is de enige statuswaarheid voor implementatierealiteit.

## Obsidian links
- open-points
- Active phase
- Now / Next / Later
- Deviations and decisions
- Strategy hub
- Research hub
- Ideas workspace

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
|---|---|---|---|
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
| Branded productlaag “Budio Vandaag” in shell/auth/menu | Niet als losse MVP-feature benoemd in vroege projectdocs | **Aanwezig** | branded login/header/menu/splash doorgevoerd in `app/sign-in.tsx`, `components/ui/auth-screen-primitives.tsx`, `components/navigation/fullscreen-menu-overlay.tsx`, `app/(tabs)/index.tsx`, `app.json`. |

## Fase 1.2 status
| Subfase | Status | Onderbouwing |
|---|---|---|
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

---

## Open Punten / Resterend Werk

# Open Points — Resterend Werk

## Doel
Dit document bevat alleen resterende gaps, risico’s en onzekerheden op basis van code-realiteit.

## Obsidian links
- current-status
- Active phase
- Now / Next / Later
- Deviations and decisions
- Research map
- Research hub
- Ideas workspace

## Echt open (niet aangetroffen in code als productfeature)
1. Self-service beheer van adminrechten in product-UI ontbreekt; huidige toegang loopt via server-side allowlist env.

Toelichting:
- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.
- settings export/import/delete zijn functioneel aanwezig en voor deze scope bewezen.

## Deels open (nog niet hard afgerond)
1. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
2. 1.2E private-beta readiness met volledige runtime-doorloop van de releasechecklist in light + dark mode.
3. Commerciële brug van capture naar publiceerbare output (Pro-wedge) is strategisch uitgewerkt in research, maar nog niet als eindgebruikersflow productmatig geland.
4. Nieuwe 00/10/20/30/40/50 uploadbundels zijn nu primair ingericht, maar teamworkflow moet nog expliciet op deze primaire set standaardiseren (legacy blijft nog aanwezig).

## Onzeker
1. Expliciete aparte post-capture assistentlaag als zelfstandige feature.
2. Import-verify robuustheid door ontbrekende chatgpt-import fixture.
3. Volledige handmatige UI-smoke voor alle settings-states (hub/export/import/delete) is nog niet als apart bewijsartefact vastgelegd.
4. Repo versus productie-deploy boundary is nog niet expliciet genoeg: welke repo-artefacten (docs/workflow/Obsidian-werkbestanden) mogen versioned zijn maar horen nooit in runtime/deploypad terecht te komen.

## Afwijkingen tussen huidig MVP-plan en runtime-realiteit

### Functionaliteit-afwijkingen (al gebouwd t.o.v. oudere docs)
1. Audio-opslagvoorkeur per gebruiker is toegevoegd (aan/uit bewaren van originele opnames), inclusief storage- en metadatafundering.
2. Import/background task infrastructuur is toegevoegd met `user_background_tasks` en voortgang/notices in UI.
3. Settings IA is verbreed met aparte audio-instellingen naast export/import/delete en admin-routes.
4. Supabase hardening bevat extra security- en dataconsistentie-aanpassingen (search_path-fixes, `entries_normalized.updated_at`) die niet als afzonderlijke productcapabilities in het oudere MVP-plan stonden.
5. Obsidian settings-route is technisch aanwezig maar standaard uitgezet achter feature flag (`enableObsidianSettings`), waardoor runtime-capability en zichtbare productscope uit elkaar lopen.

### UI/UX-afwijkingen (al zichtbaar in product)
1. Branded laag “Budio Vandaag” is doorgevoerd in auth/header/menu/splash en ligt nu nadrukkelijker op merkidentiteit dan in eerdere MVP-docs stond.
2. Shell-polish (menu/topnav/background consistency) is verder doorgevoerd dan de oorspronkelijke minimale MVP-beschrijving.
3. Capture/detail/settings UX bevat nu uitgebreidere status- en feedbackstates (background notices, selector-modals, audio playback), waardoor de runtime-ervaring rijker is dan de vroege MVP-baseline.

### Strategische afwijkingen (research vs huidige productrealiteit)
1. Research stuurt op Pro-wedge (capture -> review -> output/publicatievoorbereiding), maar die flow ontbreekt nog als concrete gebruikersfunctionaliteit.
2. Research stuurt op usage/credits/tiering en commerciële stuurinformatie; runtime bevat dit nog niet als productlaag.
3. AIQS is sterk als admin-governance, maar nog niet de volledige control plane zoals in future-state research beschreven.

## Prioriteit
1. Maak completion-criteria voor 1.2A/1.2B/1.2C/1.2E expliciet en toetsbaar.
2. Maak expliciet besluitbaar welke MVP-afwijkingen worden geformaliseerd in volgende planupdate (zonder huidige canonieke plannen nu te herschrijven).
3. Los onzekerheden op met hard bewijs; anders onzeker laten.
4. Beslis expliciet welke research-gedreven afwijkingen (Pro-wedge, flow-modulariteit, AIQS control-plane verdieping) in de volgende planronde naar `planning/next` promoveren.

## Risico’s
1. Scope-creep richting brede assistent.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.
4. Strategische drift: capture-machine blijft groeien zonder commerciële outputbrug te operationaliseren.

## Later project — import volledig laten doorlopen op de achtergrond

### Status
Later onderzoeken. Niet voor huidige fase.

### Waarom
Het echte importeren van entries draait server-side zodra de request loopt.
De naverwerking daarna is nu nog afhankelijk van het open importscherm of actieve app-sessie.
Daardoor is dit nog geen volledige fire-and-forget achtergrondtaak.

### Gewenste eindrichting
Import moet volledig server-side kunnen doorlopen, ook als:
- de gebruiker het scherm sluit
- de app naar de achtergrond gaat
- de verbinding kort wegvalt na het starten

### Doel
Een robuustere importflow waarbij:
- entry-import start via één gebruikersactie
- afgeleide verwerking daarna zelfstandig doorloopt
- dagboekdagen, weekreflecties en maandreflecties niet meer afhankelijk zijn van actieve client-state

### Buiten scope nu
Niet in fase 1.2.
Dit raakt architectuur, job-afhandeling en betrouwbaarheid van achtergrondverwerking.

### Waarom later waardevol
- betrouwbaardere importervaring
- minder afhankelijkheid van open scherm of actieve app
- logisch vervolg op importfeature zodra MVP/hardening stabiel is

### Open vragen voor later
- server-side jobmodel of queue
- statusopvolging voor gebruiker
- retry-gedrag bij mislukte naverwerking
- hoe en wanneer de UI importstatus terughaalt

---

## Content / Narrative Processing Regels

# Content & Narrative Processing Rules (Canoniek)

> Relatie met AI governance:
> - Deze regels zijn onderdeel van het AI Quality Studio-contract.
> - Bij conflict geldt:
>   - `content-processing-rules.md` is leidend voor inhoud en laagcontracten.
>   - `ai-quality-studio.md` is leidend voor tooling, prompting-governance en evaluatieproces.

## Doel
Dit document is het bindende gedragscontract voor contentverwerking in drie lagen:
1. `entries_normalized.body`
2. `day_journals.narrative_text`
3. `day_journals.summary`

Dit is de canonieke content-regeldoc voor MVP en fase 1.2B.

## Waarom dit document leidend is
Deze regels sluiten direct aan op:
- server contracts en guardrails in `process-entry`, `regenerate-day-journal`, `renormalize-entry`, `generate-reflection`
- quality-verify checks in `scripts/verify-local-output-quality.sh`

## Kernregel
De engine structureert en verwoordt, maar voegt geen nieuwe betekenis toe.

## Laagcontracten
### 1) `entries_normalized.body`
Doel:
- volledige opgeschoonde entrytekst behouden

Mag:
- ruis/stotteren/kleine taalfouten opschonen
- betekenisloze dubbele herhaling reduceren

Mag niet:
- samenvatten
- merkbaar inkorten
- parafraseren naar generieke AI-tekst
- nieuwe claims toevoegen

### 2) `day_journals.narrative_text`
Doel:
- volledige verhalende dagtekst over alle betekenisvolle dagmomenten

Moet:
- brongebonden blijven
- ik-vorm volgen waar bron in ik-vorm is
- betekenisvolle momenten behouden
- rustige, natuurlijke leesbaarheid hebben

Mag niet:
- functioneren als samenvatting
- verslaggever-/derdepersoonstonen introduceren
- verzonnen brugzinnen, oorzaken of inzichten toevoegen
- therapie/diagnose/coachtaal gebruiken

### 3) `day_journals.summary`
Doel:
- korte, compacte dagsamenvatting voor snelle oriëntatie

Moet:
- duidelijk korter zijn dan narrative
- concreet en feitelijk blijven

Mag niet:
- rol van narrative overnemen
- nieuwe interpretatie of niet-brongebonden inhoud introduceren

## Aanvullend contract — `period_reflections`
Doel:
- compacte periodieke synthese op basis van day journals

Moet:
- brongebonden blijven op `day_journals`
- samenvatting, highlights en reflectiepunten compact en bruikbaar houden

Mag niet:
- therapeutische of diagnostische taal gebruiken
- inhoud verzinnen buiten de bron
- standaard vervallen in todo-achtige actiepunten of checklisttaal

## Aanvullend contract — directe assistentlaag na capture (indien gebruikt)
Doel:
- korte ondersteuning direct rond vastleggen

Moet:
- kort en ondersteunend zijn
- niet-canoniek blijven t.o.v. dagboeklaag
- rustige, niet-therapeutische toon gebruiken

Mag niet:
- automatisch dagboeklaag vervuilen
- de productervaring verschuiven naar open chatmodus

## Scheidingsregel tussen lagen
- `entries_normalized.body` = volledige opgeschoonde bronlaag van één entry
- `day_journals.narrative_text` = volledige dagverhaallaag
- `day_journals.summary` = compacte samenvattingslaag
- `period_reflections` = periodieke synthese op dagboeklaag
- directe assistentlaag = tijdelijk, ondersteunend, niet-canoniek

Als `summary` en `narrative_text` functioneel hetzelfde worden, is dat contractbreuk.

## Toonregels
Gewenst:
- rustig Nederlands
- concreet
- niet-meta
- niet-generiek AI

Ongewenst:
- psychologische duiding als feit
- therapietaal
- management-/rapporttaal
- meta-zinnen over “de notities” of aantallen als inhoudsvuller

## Acceptatiecriteria
1. Betekenisvolle broninhoud blijft behouden in `entries_normalized.body`.
2. `narrative_text` bevat alle relevante dagmomenten zonder verzinsels.
3. `summary` is korter en compacter dan `narrative_text`.
4. `period_reflections` blijven brongebonden en compact-synthetisch.
5. Directe assistentreacties (indien gebruikt) blijven kort, ondersteunend en niet-canoniek.
6. Geen marker-leak of fallback-tekst als inhoud in dagboek/reflectie.

## Implementatiekoppeling
Primair geraakt door:
- `supabase/functions/process-entry/index.ts`
- `supabase/functions/regenerate-day-journal/index.ts`
- `supabase/functions/renormalize-entry/index.ts`
- `supabase/functions/generate-reflection/index.ts`
- `supabase/functions/_shared/day-journal-contract.mjs`
- `scripts/verify-local-output-quality.sh`

## Buiten scope
- nieuwe AI-flowarchitectuur
- stijlclone-engine
- extra tabellen of migrations voor deze regels

## Capture Audio — State Guardrails

- Opname is pas actief wanneer de recorder technisch gestart is
- Init/preparing state moet zichtbaar zijn vóór actieve opname
- Annuleren-modal pauzeert actieve opname direct
- Sluiten van modal herstelt de pre-modal state correct
- Annuleren (bevestigd) reset alle capture state volledig naar idle
- Annuleren start nooit verwerking en slaat niets op
- State-transities zijn expliciet, nooit impliciet

---

## Copy Instructions

# Persoonlijke Assistent App — Copy Instructions

## Doel

Zorg dat alle copy in de app en website:

- rustig aanvoelt
- menselijk klinkt
- direct is
- niet overdreven slim doet
- de gebruiker helpt zonder aandacht te vragen

De app is geen assistent, coach of AI-tool.  
Het is een plek om je dag vast te leggen.

---

## Kernbelofte

**Vandaag — Je dag, rustig vastgelegd.**

Alles wat we schrijven moet dit ondersteunen:

- vastleggen
- terugzien
- rust
- continuïteit

---

## Website-kernboodschap

Gebruik voor website en positionering steeds deze gedachte:

Deze app helpt je om losse momenten van je dag niet kwijt te raken.
Je legt snel vast wat er is, ziet het later terug als een leesbare dag, en kunt rustiger terugzien wat terugkomt.

### Kernzinnen voor website-copy

- Leg vast wat er vandaag gebeurt
- Zie je dag later rustig terug
- Maak van losse momenten een leesbare dag
- Zie over tijd wat terugkomt
- Rust en continuïteit, zonder gedoe

### Wat we wel beloven

- snel vastleggen
- rustig terugzien
- leesbare dagopbouw
- reflectie op basis van je eigen dagen
- meer continuïteit in je eigen verhaal

### Wat we niet beloven

- therapie
- coaching
- diagnoses
- gedragsanalyse als hoofdpropositie
- een slimme assistent die het van je overneemt

### Positioneringsregel

Schrijf altijd vanuit de ervaring van de gebruiker:

- ik wil mijn dagen niet kwijt raken
- ik wil sneller kunnen terugzien wat er echt speelde
- ik wil rustiger herkennen wat terugkomt

Schrijf niet vanuit systeemtaal of technische slimheid.

## Tone of voice

### 1. Rustig

- korte zinnen
- geen uitroeptekens
- geen marketingdruk

✔ Leg iets vast  
✖ Leg NU iets vast!

---

### 2. Menselijk

- spreek zoals een mens, niet als systeem
- geen technische taal

✔ Je hebt vandaag nog niets vastgelegd  
✖ Geen entries gevonden voor huidige datum

---

### 3. Direct

- zeg wat iemand kan doen
- vermijd abstractie

✔ Spreek of schrijf iets  
✖ Start een nieuwe input sessie

---

### 4. Bescheiden intelligentie

- de app mag slim zijn
- maar zegt dat niet

✔ Dit is je dag tot nu toe  
✖ AI gegenereerde samenvatting van je dag

---

## Wat we NIET zijn

Gebruik deze woorden niet:

- AI
- assistant
- coach
- insights (als buzzword)
- magic
- powerful
- productivity tool
- personal curator
- journaling platform

---

## Website-positionering guardrails

### Wat we wél mogen zeggen

Gebruik taal die past bij:

- je dagen niet kwijt raken
- losse momenten terugzien als één leesbare dag
- rustig terugzien wat terugkomt
- continuïteit in je eigen verhaal
- brongebonden verwerking
- terugleesbaarheid en vertrouwen

### Wat we níet mogen zeggen

Gebruik niet:

- second brain
- knowledge base
- personal CRM
- life insights engine
- AI-journal
- therapeutisch systeem
- coach voor herstel
- vraag alles over je leven

### Positioneringsregel

De huidige website-copy verkoopt geen brede intelligentielaag.

De website verkoopt nu:

- snel vastleggen
- leesbare dagopbouw
- rustige terugblik
- vertrouwen dat de output dicht bij de eigen input blijft

### Founder story regel

De oorsprong van het product mag persoonlijk zijn.
De hoofdpositionering blijft productmatig.

Dus:

- persoonlijke aanleiding mag in een founder story of over-pagina
- de homepage-hero en kerncopy spreken vanuit gebruikerswaarde, niet vanuit diagnoses, therapie of privégeschiedenis

### Extra copycheck voor marketing

Controleer bij website-copy altijd:

1. Verkopen we hier een huidige productwaarde of een latere belofte?
2. Klinkt dit rustig en menselijk?
3. Trekken we niet ongemerkt richting AI-, coach- of second-brain-taal?
4. Is de gebruiker hier geholpen met een concreet voordeel?

## Schrijfprincipes

### 1. Actie eerst

De gebruiker opent de app om iets vast te leggen.

✔ Leg iets vast  
✖ Welkom terug

---

### 2. Vandaag is centraal

De app draait om vandaag.

✔ Dit is je dag tot nu toe  
✖ Overzicht van je activiteit

---

### 3. Geen overload

Houd tekst compact.

✔ Een korte samenvatting  
✖ Lange uitlegblokken

---

### 4. Geen oordeel

De app is neutraal.

✔ Je hebt vandaag nog niets vastgelegd  
✖ Je bent vandaag nog niet productief geweest

---

## Standaard copy (gebruik deze exact)

### Primary action

Leg iets vast

### Input CTA

Spreek of schrijf iets

### Empty state (vandaag)

Je hebt vandaag nog niets vastgelegd.

### Day summary intro

Dit is je dag tot nu toe.

### Status

Vandaag bijgewerkt

---

## Reflecties (secundair)

Reflecties zijn ondersteunend, niet leidend.

✔ Weekreflectie beschikbaar  
✖ Ontdek inzichten uit je week

✔ Bekijk reflectie  
✖ Analyseer je gedrag

---

## Microcopy regels

- maximaal 1 zin waar mogelijk
- geen dubbele uitleg
- geen herhaling van hetzelfde in andere woorden
- vermijd bijvoeglijke naamwoorden
- schermen met één primaire actie volgen bij voorkeur: hero + actie + compacte notice
- zet niet dezelfde uitleg boven én onder een formulier of CTA
- notice-copy is ondersteunend, kort en niet technisch
- auth- en settings-copy blijft compact, menselijk en rustig

✔ Rustig terugzien  
✖ Gemakkelijk en overzichtelijk terugkijken

---

## Fouten die we vermijden

### Te productmatig

✖ Optimaliseer je dag  
✖ Verhoog je productiviteit

### Te slim doen

✖ Op basis van je gedrag zien we dat...

### Te vaag

✖ Begin hier  
✖ Ga verder

### Te vaag (CTA’s)

✖ Verder  
✖ Ga door  
✖ Start

✔ Gebruik altijd een concrete actie die beschrijft wat er gebeurt

---

## Check voor elke tekst

Stel jezelf deze vragen:

1. Helpt dit iemand iets doen?
2. Is dit korter te maken?
3. Klinkt dit als een mens?
4. Zeggen we niet impliciet “wij zijn slim”?

Als het antwoord niet duidelijk ja is → herschrijven.

---

## Samenvatting in 1 zin

De app praat niet tegen je.  
Hij helpt je rustig je dag vast te leggen.

---

## AI Quality Studio Governance

# AI Quality Studio (Canoniek)

## Canonieke status

Dit document is de **leidende bron voor AI-gedrag, promptbeheer, evaluatie en runtime-governance** binnen dit project.

Bij conflict geldt:
- `docs/project/content-processing-rules.md` is leidend voor **inhoudscontracten en grensgedrag van output**
- `docs/project/ai-quality-studio.md` is leidend voor **AI-tooling, prompting, evaluatie, versiebeheer, rollout en runtime-governance**
- andere projectdocs verwijzen hiernaar voor AI-gedrag en promptbeheer

Dit document beschrijft zowel:
- de huidige werkende tussenarchitectuur
- als de gewenste eindrichting voor een volwassen AI quality platform-laag
- en de **bindende bouwvolgorde** voor de volgende studio-fase

---

## 1. Doel en positie

AI Quality Studio is een **admin-only AI quality en prompting governance tool**.

Doel:
- AI-output betrouwbaar verbeteren
- prompt- en modelwijzigingen beheersbaar maken
- testbaar en reproduceerbaar itereren op echte brondata
- zichtbaar kunnen valideren of een nieuwe prompt **daadwerkelijk beter** is dan de huidige runtime-basis
- runtime-gedrag later gecontroleerd uit code-baseline naar DB-live binding brengen

De studio is:
- task-first
- contract-first
- result-first
- evidence-first
- server-side only

De studio is **geen**:
- end-user feature
- brede assistentlaag
- generieke AI per scherm
- vervanging van productkaders of contentcontracten
- mini-Langfuse of mini-Agenta als generiek platformdoel

---

## 2. Scopekader

### In scope
- Werk per **AI-task**, niet per scherm
- Versioning per task
- Runtime-baseline import uit code
- Drafting en gecontroleerde model/prompt-editing
- Test runs met snapshots
- Vergelijking testoutput vs runtime-basis
- Opslaan van evaluatie-uitkomsten per run/case/versie
- Handmatige review en rollout-governance
- Traceability per versie en run
- Admin UX voor mobiel én desktop/fullscreen gebruik

### Buiten scope
- Client-side OpenAI calls
- End-user debug- of beheerfeatures
- Brede chat/coach/agent-ervaring
- Auto-optimalisatie als vervanging van menselijke review
- Runtime DB-binding zonder rollout- en rollbackpad
- Volledige live-observability en productiebeoordeling als eerste volgende fase
- Generieke prompt IDE voor willekeurige toekomstige AI use cases

---

## 3. Strategische aanscherping (april 2026)

De eerstvolgende studiofase draait **niet** primair om rollout of live runtime-integratie.

De eerstvolgende studiofase draait om één kernvraag:

**Is een nieuwe promptversie aantoonbaar beter dan de huidige basis?**

Daarom is de bindende prioriteit nu:
1. testen binnen de studio
2. vergelijkbaar valideren van kandidaat-output vs runtime-basis
3. evaluatie-uitkomsten opslaan als bewijs
4. editor-ervaring en task-consistentie gelijktrekken
5. admin UX op desktop/fullscreen verbeteren zonder mobiel te breken
6. lifecycle, rollout, runtime-koppeling en live monitoring pas daarna verder uitbouwen

Dit betekent expliciet:
- testbaarheid gaat vóór rollout-volume
- evidence gaat vóór dashboard-polish
- editor-consistentie gaat vóór nieuwe promptfeatures
- runtime/live-beoordeling komt **later**, omdat runtime nu nog hardcoded en niet versiegestuurd uit de studio leest

---

## 4. Canonieke ontwerpprincipes

1. **Contract-first**  
   Content contracts zijn leidend boven promptvrijheid.

2. **Task-first**  
   Beheer op AI-taken, niet op UI-schermen.

3. **Result-first**  
   Testresultaat, compare en evaluatie zijn primair; technische metadata is secundair.

4. **Evidence-first**  
   Een promptwijziging is pas waardevol als zichtbaar is of die beter, gelijk, slechter of fout is ten opzichte van de basis.

5. **Server-side only**  
   API keys, modelcalls en runtime-execution blijven server-side.

6. **Traceability by default**  
   Input/prompt/model/output snapshots + request/flow context zijn standaard.

7. **Eerlijke representatie**  
   Toon expliciet wanneer een studio-task onderdeel is van een gedeelde runtime-family.

8. **Geen dubbele waarheid zonder transitieplan**  
   Als code en DB tijdelijk naast elkaar bestaan, moet de hiërarchie expliciet zijn.

9. **Desktop-capable admin**  
   Adminschermen mogen mobiel goed werken, maar mogen niet kunstmatig vastgezet blijven op een mobiele breedte als primaire desktopervaring.

---

## 5. Relatie met contentcontracten (bindend)

Volgt `docs/project/content-processing-rules.md`.

Kernscheiding:
- `entry_cleanup` ≠ samenvatting
- entry-normalization loopt als één compound flow (`entry_cleanup`) voor `title`, `body`, `summary_short`
- `day_narrative` ≠ `day_summary`
- reflectiepunten ≠ advieslaag
- reflecties ≠ therapeutische interpretatie

Als output deze grenzen schendt, is dat een **kwaliteitsfout**, ongeacht modelscore of “mooier” taalgebruik.

---

## 6. Huidige code-realiteit (status april 2026)

Deze sectie beschrijft wat nu aantoonbaar gebouwd is en wat strategisch relevant is voor de volgende fase.

### 6.1 Datamodel (aanwezig)
Tabellen:
- `ai_tasks`
- `ai_task_versions`
- `ai_test_cases`
- `ai_test_runs`
- `ai_live_generation_log`

Aanwezig in schema:
- enums voor input/output/status/review/source
- UUID PK’s, FK’s, timestamps
- 1 live versie per task
- oplopende versioning per task
- snapshotvelden voor test runs
- seed van 12 canonieke tasks

### 6.2 Edge function (aanwezig)
Function:
- `admin-ai-quality-studio`

Huidige acties:
- `access`
- `list_tasks`
- `get_task_detail`
- `import_runtime_baseline`
- `create_draft_version`
- `update_draft_version`
- `delete_draft_version`
- `list_test_sources`
- `run_test`
- `get_test_run`
- `get_compare_view`

Auth:
- allowlist + internal token patroon, server-side gehandhaafd

### 6.3 App-beheerlagen (aanwezig)
- task hub
- task detail / versions
- draft editor
- test / compare

### 6.4 Entry_cleanup contract-first editor (aanwezig, maar voor op generieke editorlaag)
- `entry_cleanup` volgt nu expliciet een contract-first editorstructuur:
  - **alleen taakinstructie bewerkbaar**
  - input/system/response/model contractlagen zichtbaar als read-only
- response-contract is object-based en zichtbaar als:
  - `title: string`
  - `body: string`
  - `summary_short: string`
- systemcontract is compact gehouden op niet-vrije grenzen:
  - alleen opgegeven bronvelden gebruiken
  - alleen JSON volgens contract retourneren
  - field-level contractgrenzen blijven technisch afgedwongen
- baseline metadata blijft zichtbaar maar read-only, en geen primaire bewerklaag

**Belangrijke conclusie:** `entry_cleanup` is nu inhoudelijk sterker dan de rest van de editors. Dat is goed voor die task, maar nog geen uniforme studio-abstraction.

### 6.5 Admin detail-shell polish (aanwezig, maar desktop-ervaring nog niet goed genoeg)
- gedeelde admin topnavigatie is visueel en technisch gecentreerd en navigation-only gebleven
- gedeelde sticky action footer is nu een compact, herbruikbaar admin pattern met duidelijke hiërarchie:
  - primary
  - secondary
  - tertiary (quiet/destructive)
- patroon is toegepast op AIQS detailschermen zonder runtime- of contractscope uit te breiden

**Belangrijke conclusie:** huidige adminschermen zijn nog te veel als mobiele breedte gefixeerd, ook op desktop. Dat beperkt de studio-waarde op grotere schermen en fullscreen gebruik.

### 6.5b Prompt Assist in draft editor (`entry_cleanup`) (aanwezig, beperkte scope)
- prompt assist draait admin-only binnen de bestaande draft editorlaag
- assist is task-first en contract-first:
  - analyse gebruikt volledige promptcontext (`system rules`, `general instruction`, `field rules`, outputcontract, taskmetadata)
  - rewrite/apply blijft per run beperkt tot één expliciet gekozen targetlaag
- server-side previewactie aanwezig (`prompt_assist_preview`) met typed payload/result
- UI blijft diff/apply-georiënteerd en vermijdt brede chatervaring

**Belangrijke conclusie:** assist is bewust een lokale editor-hardening en geen autonome prompt-optimizer of generieke chatlaag.

### 6.6 Runtime-baseline model (aanwezig, transitie)
- runtime-definities worden nu opgebouwd vanuit code
- baseline import schrijft deze als `live` naar studio-DB
- runtime zelf leest nog niet uit studio-DB

**Conclusie:** huidige model is een bruikbare overgangsarchitectuur, geen eindarchitectuur. Live beoordeling en rollout moeten daarom nog niet de primaire studiofocus zijn.

---

## 7. Eerstvolgende fase: wat het product nú moet oplossen

De studio moet in de volgende bouwstap vooral deze dingen beter maken:

1. ik kan een draftprompt wijzigen
2. ik kan die op goede testbronnen draaien
3. ik zie output naast de runtime-basis
4. ik kan expliciet vastleggen of die beter, gelijk, slechter of fout is
5. ik kan die uitkomst later terugvinden per task, versie en case

Zolang dit niet stevig staat, zijn de volgende zaken **te vroeg als hoofdfocus**:
- live production review
- rollout-gates tot in detail
- runtime DB-binding
- kwaliteitsdashboard als eindlaag

---

## 8. Editor abstraction (bindend)

De studio bewerkt **taakinstructies**, niet ruwe request/payload blobs.

### Bindende scheiding
Elke bewerkbare taskversie bestaat conceptueel uit deze lagen:

1. **Taakinstructie**
   - primaire bewerklaag
   - gewone tekst
   - gericht op wat deze task moet doen

2. **Vaste regels / system instructions**
   - stabielere systeemlaag
   - zelden aangepast
   - standaard secundair of advanced

3. **Input template / mapping**
   - technische request assembly
   - placeholders, bronvelden, mappinglogica
   - niet dominant in de hoofd-editor

4. **Output contract / schema**
   - beschrijft verwachte output
   - hoort bij de task of runtime-family

5. **Model- en configlaag**
   - modelkeuze
   - temperature / response_format / andere toegestane parameters

### Bindende UI-regel
De hoofd-editor toont:
- taakinstructie
- taskdoel
- model
- contract notice
- versiecontext

De hoofd-editor toont **niet**:
- volledige request payloads
- raw placeholders als hoofdinhoud
- baseline metadata als primaire bewerklaag

### Aanscherping voor de volgende fase
De `entry_cleanup` editor is de referentie voor de volgende editorronde.

Dat betekent:
- andere edit-schermen moeten hier conceptueel naartoe convergeren
- hardcoded afwijkingen per task moeten worden afgebouwd
- gedeelde editorprimitives moeten task-compatibel worden, niet alleen `entry_cleanup`-specifiek
- waar taakverschillen echt nodig zijn, moeten die via task-metadata of config verklaard worden, niet via verborgen UI-afwijkingen

---

## 9. Task composition model

Niet elke studio-task is een volledig losse runtime prompt.

Daarom moet elke task conceptueel deze velden hebben:
- `runtime_family`
- `composition_role`: `standalone | compound_member`
- `managed_output_field`
- `affected_output_fields`

### Voorbeelden
- `entry_cleanup`
  - runtime_family: `entry_normalization`
  - composition_role: `compound_member`
  - managed_output_field: `title/body/summary_short` (compound)
- `day_narrative`
  - runtime_family: `day_journal`
  - composition_role: `compound_member`
  - managed_output_field: `narrativeText`
- `day_summary`
  - runtime_family: `day_journal`
  - composition_role: `compound_member`
  - managed_output_field: `summary`
- week/month tasks
  - runtime_family: `reflection`
  - composition_role: meestal `compound_member`

### Bindende representatieregel
Als een task onderdeel is van een gedeelde runtime-family:
- toon dat expliciet
- toon ook wat die wijziging beïnvloedt
- doe niet alsof het een volledig autonome prompt is als dat niet zo is

---

## 10. Output discipline

### Richting
Waar output gestructureerd moet zijn, is **Structured Outputs / JSON Schema** de voorkeursrichting.

### Regels
- outputtype expliciet vastleggen:
  - `text`
  - `object`
  - `list`
  - `compound`
- schema hoort bij task of runtime-family, niet als los prompthulpstuk
- JSON mode is alleen acceptabel als compat-layer of tijdelijke fallback
- task-scherm, instructie en schema mogen elkaar niet tegenspreken

### Voorbeeld
Als `day_narrative` in studio één output representeert, dan moet:
- het scherm dat eerlijk tonen
- het schema dat ondersteunen
- of expliciet zichtbaar zijn dat het onderdeel is van een compound runtime-family

---

## 11. Model policy

### Productie
- productie gebruikt **pinned model snapshots**
- geen vrije modelkeuze in runtime
- modelupgrade is een rollout-beslissing, geen gewone promptedit

### Studio
- modelkeuze in studio gebeurt via **allowlist**, niet vrije tekst
- alleen goedgekeurde modellen zijn testbaar
- modelwijziging moet zichtbaar meeversien

### Logging
Elke test run en latere runtime write moet minimaal vastleggen:
- model
- versie / snapshot
- relevante config

---

## 12. Runtime-baseline import en tijdelijke dubbele waarheid

### Huidige overgangsregel
De studio gebruikt nu een **runtime baseline import** uit code:
- code blijft runtime source-of-truth
- studio importeert een mirror naar `ai_task_versions`
- drafts starten vanuit deze runtime-basis

### Bindende regels
- runtime-baseline import mag nooit stil bestaande afwijkende live versies overschrijven
- conflicts moeten expliciet worden gerapporteerd
- baseline metadata moet zichtbaar maken:
  - `baseline_source`
  - `runtime_flow`
  - `derived_from_shared_flow`
  - `output_field`

### Doel
De studio moet een geloofwaardige live-basis tonen zonder productie al DB-driven te maken.

### Strategische aanscherping
Zolang runtime nog hardcoded is en niet versiegestuurd uit de studio leest:
- blijft testvalidatie belangrijker dan live-review tooling
- blijft compare tegen runtime-basis voldoende voor de eerstvolgende fase
- blijven live-resultaten, reviewer queues en runtime dashboards een latere laag

---

## 13. Evaluation architecture (aangescherpt)

Evaluatie gebeurt in lagen, in vaste volgorde.

### Laag 1 — Contract checks
Hard rules, bijvoorbeeld:
- `entry_cleanup` mag niet samenvatten
- `day_summary` moet compacter zijn dan `day_narrative`
- reflectiepunten mogen geen advieslaag worden
- min/max items
- schema validatie
- verboden taal / verboden meta-zinnen

### Laag 2 — Pairwise compare
Standaard menselijke vergelijking tussen:
- runtime-basis / huidige productie-uitkomst
- draft / candidate output

Labels:
- `beter`
- `gelijk`
- `slechter`
- `fout`

### Laag 3 — Evaluation result opslag
Pairwise compare en contractuitkomsten mogen niet alleen tijdelijke UI-output zijn.

Per run/case/versie moet de studio evaluatie-uitkomsten structureel kunnen opslaan, zodat zichtbaar wordt:
- welke versie beter scoort
- welke cases regressies tonen
- welke fouten terugkomen
- welke review al gedaan is

**Bindende richting:** evaluatie wordt een first-class objectlaag, niet alleen een schermactie.

### Laag 4 — Curated regression sets
Voor elke belangrijke task geleidelijk opbouwen:
- goldens
- edge cases
- noisy input
- dunne bron
- duplicate-heavy dag
- lange persoonlijke dag
- afwijkende talen / rare input

### Laag 5 — Automated graders
Pas later toevoegen.

Regels:
- nooit de enige bron van waarheid
- pas ná curated regressiesets
- alleen ondersteunend aan contract checks + human review

---

## 14. Evaluation object model (nieuwe bindende richting)

De studio heeft een expliciete evaluatie-objectlaag nodig.

Minimale richting:
- evaluatie hoort bij task
- evaluatie hoort bij taskversion
- evaluatie hoort bij testcase of testbron
- evaluatie hoort bij een specifieke run
- evaluatie kan contractmatig, handmatig en later geautomatiseerd zijn

### Minimale veldenrichting
- `task_id`
- `task_version_id`
- `test_run_id`
- `test_case_id` of bronreferentie
- `evaluator_type` (`contract`, `human`, later optioneel `auto`)
- `result_label` (`beter`, `gelijk`, `slechter`, `fout`, of contractstatus)
- `score` of compacte scorevelden waar zinvol
- `notes`
- `created_at`
- reviewer / actor waar relevant

### Waarom dit bindend is
Zonder evaluatie-objectlaag blijft de studio goed in testen, maar zwak in kwaliteitsbewijs.

---

## 15. Human review protocol

### Standaardreview
De default reviewvorm is **pairwise**:
- runtime-basis vs draft/candidate

### Labels
- `beter`
- `gelijk`
- `slechter`
- `fout`

### Verplichtingen
- note verplicht bij `slechter` of `fout`
- review gebeurt op compacte rubric, niet op los gevoel

### Rubric
Minimaal beoordelen op:
- contracttrouw
- natuurlijkheid
- helderheid
- volledigheid
- compactheid waar relevant

### Aanscherping
De reviewactie moet opslaan als bewijslaag en niet alleen in de compare-UI blijven hangen.

---

## 16. Source selection rules

Bronselectie is onderdeel van kwaliteit, niet alleen een UI-detail.

### Regels
- testdata moet representatief zijn
- default sortering: recent + bruikbaar
- fallback/lege records mogen niet dominant zijn
- noisy cases mogen zichtbaar zijn, maar duidelijk herkenbaar
- bronselectie moet compacte preview + zoek/filter ondersteunen

### Richting
Volgende fase:
- curated saved cases
- goldens
- regressiesets per task
- snelle herbruikbare testsets per taskversie

---

## 17. Version lifecycle governance

### Gewenste lifecycle
- `draft`
- `candidate`
- `approved`
- `live`
- `archived`
- optioneel `shadow`

### Governance-regels
- promote naar live alleen na voldoende evidence
- rollbackpad moet bestaan vóór runtime DB-binding
- modelwijzigingen en promptwijzigingen horen in dezelfde lifecycle-governance

### Evidence voor promote (richtlijn)
Minimaal:
- contract checks passeren
- pairwise review uitgevoerd
- relevante curated cases gecontroleerd

### Aanscherping voor huidige fase
Deze lifecycle blijft bindende richting, maar is **niet** de eerstvolgende bouwfocus. Eerst moet test- en validatiebewijs in de studio zelf stevig staan.

---

## 18. Prompt registry readiness

De studio moet compatibel blijven met een centrale prompt registry of prompt object model.

### Regels
Promptstructuur moet logisch opgesplitst blijven in:
- instruction
- system
- input template
- output schema
- config

### Verboden richting
- monolithische request blobs als enige bewerkbare eenheid
- prompttekst waarin payload assembly, placeholders en taakdoel door elkaar lopen

---

## 19. Execution-modi

1. **Single interactive call**
   - 1 task, 1 versie, 1 bron

2. **Curated batch evaluation**
   - 1 task, 1 versie, N cases

3. **Production-derived shadow batch**
   - echte bronnen, geen canonieke write

4. **Live regeneration batch**
   - gecontroleerde herberekening na rollout

### Aanscherping
Voor de volgende fase is de kernvolgorde:
- eerst single interactive goed
- daarna curated batch evaluation
- production-derived en live regeneration pas later zwaarder uitwerken

---

## 20. Prompt caching (vooruitblik)

Nog niet leidend voor implementatie, wel bindend als technische richting.

### Regels
- vaste delen vroeg in prompt
- variabele input later in prompt
- prefixstabiliteit is gewenst

### Doel
- lagere latency
- lagere kosten
- stabielere uitvoering bij herhaling

---

## 21. Runtime-koppeling en lineage

Elke latere runtime-write moet versie-lineage dragen.

Doel:
- reproduceerbaarheid
- impactanalyse
- rollback
- veilige regeneration

Minimaal te koppelen:
- `task_version`
- `requestId`
- `flowId`
- `source_type / source_record_id`
- `target_table / target_record_id`

`ai_live_generation_log` is hiervoor de structurele richting, niet alleen debug-data.

### Aanscherping
Dit blijft belangrijk, maar is **niet** de eerstvolgende prioriteit zolang runtime nog niet DB-live uit de studio leest.

---

## 22. Admin UX-principes (nieuw bindend)

AI Quality Studio is een admin-tool en mag daarom anders werken dan de eindgebruikersapp.

### Regels
- mobiel moet goed bruikbaar blijven
- desktop mag niet kunstmatig klein blijven
- fullscreen gebruik op desktop moet actief ondersteund worden
- editor, compare en review zijn productieve werkmodi en verdienen ruimte
- detailschermen mogen op grotere schermen werken met bredere layouts, kolommen of split views waar functioneel zinvol
- behoud duidelijke hiërarchie en focus; geen generieke enterprise-zwaarte

### Concreet betekent dit
- task detail en draft editor mogen op desktop breder openen dan de app-shell
- compare-views mogen naast elkaar staan op grotere schermen
- testresultaten en contractnotices mogen op desktop zichtbaar zijn zonder overmatig scrollen
- sticky action areas moeten goed werken op mobiel én desktop
- fullscreen mag gebruikt worden voor productiviteit, niet alleen voor esthetiek

### Niet doen
- admin 1-op-1 behandelen als consumentenscherm
- alles centreren in een smalle mobile-column op grote schermen
- desktop oplossen met alleen grotere marges zonder informatiearchitectuur aan te passen

---

## 23. Bekende beperkingen (huidige fase)

Niet volledig aanwezig:
- promote-to-live workflow
- rollback flow
- reviewer labeling flow in UI als persistente bewijslaag
- batch test runs / regressiesets als volwaardige productlaag
- volledige compare-ondersteuning voor alle taskkeys
- directe DB-live binding voor productie-runtime
- uniforme editor-abstraction over alle tasks heen
- volwaardige desktop/fullscreen admin-ervaring
- kwaliteitsdashboard met echte aggregatie en trendweergave

---

## 24. Learnings uit de bouwsessie (gestandaardiseerd)

1. Bewerk op **taakinstructie**, niet op payload/request blob.
2. Modelkeuze moet gecontroleerd zijn, niet vrije tekst.
3. Advanced moet gegroepeerd blijven:
   - Vaste regels
   - Outputvorm
   - Modelinstellingen
   - Technische herkomst
4. Baseline metadata is zichtbaar maar niet bewerkdominant.
5. Compound tasks moeten expliciet tonen wat ze beïnvloeden.
6. Editor, detail en test zijn verschillende modi en horen niet op één scherm gepropt.
7. Bronselectie is onderdeel van kwaliteit; slechte selectie ondermijnt evaluatie.
8. Testscherm moet editor-taal volgen:
   - runtime-basis
   - testresultaat
   - verschil met live
9. Goede studio-UX is niet alleen mobiel; adminwerk vraagt ook desktopruimte.
10. Een compare-view zonder opgeslagen oordeel is nog geen volwaardig kwaliteitsbewijs.

---

## 25. Valkuilen (expliciet)

1. Task/scherm-verwarring
2. Compound-runtime verbergen als single output
3. Dubbele waarheid tussen code en DB zonder transitieplan
4. Promptedits zonder contractguardrails
5. Alleen line-diff gebruiken als kwaliteitsbewijs
6. Te vroege automation zonder curated regressiesets
7. Product-visible debugdrift buiten admincontext
8. Runtimekoppeling zonder rollbackpad
9. Payload-editing vermommen als promptbeheer
10. Een dashboard bouwen voordat evaluatie als dataset bestaat
11. Desktop “oplossen” door alleen containerbreedte aan te passen zonder workflowverbetering

---

## 26. Prioriteitenvolgorde (bindend advies)

### Fase A — Nu eerst bouwen
1. **Testen en valideren binnen de tool als primaire lus**
   - draft wijzigen
   - bron kiezen
   - run uitvoeren
   - output vergelijken met runtime-basis
   - expliciet oordeel vastleggen

2. **Evaluation objectlaag toevoegen**
   - contractresultaten + menselijke compare-uitkomst opslaan per run/case/versie
   - vergelijking niet alleen tonen, maar ook bewaren

3. **Editor abstraction gelijktrekken over tasks heen**
   - `entry_cleanup` als referentie
   - hardcoded afwijkingen afbouwen
   - gedeelde edit-patterns en task-compatibele configuratie verstevigen

4. **Admin UX voor desktop/fullscreen verbeteren**
   - bredere detail/editor layouts
   - compare beter naast elkaar op groot scherm
   - mobiel niet breken

### Fase B — Daarna uitbreiden
5. **Curated testsets / regressiesets per task**
   - saved cases
   - goldens
   - edge/noisy cases
   - batch evals

6. **Version governance verder dichtzetten**
   - candidate / approved / live beter afbakenen
   - promote-evidence expliciet tonen

### Fase C — Pas daarna
7. **Runtime lineage en DB-live binding verder uitwerken**
   - pas na sterke test/evidence-lus

8. **Live testen/resultaten/beoordelingen toevoegen**
   - pas wanneer runtime daadwerkelijk zinnig koppelbaar is aan task versions uit de studio

### Fase D — Als laatste
9. **Kwaliteitsdashboard bouwen**
   - pas bouwen wanneer er echte evaluatiedata, trends en aggregaties zijn
   - dashboard is eindlaag, niet startpunt

---

## 27. Concrete next steps om nu te bouwen

### Stap 1 — Compare en validatie echt afmaken
Doel:
- in de studio aantoonbaar kunnen zeggen of een draft beter is dan de basis

Bouwen:
- compare-view afronden als primaire werkmodus
- expliciete reviewactie inbouwen: `beter`, `gelijk`, `slechter`, `fout`
- verplichte notitie bij `slechter` of `fout`
- contract checks zichtbaar in dezelfde evaluatieflow

Nog niet bouwen:
- zware live dashboards
- rollout automation

### Stap 2 — Evaluation results persistent maken
Doel:
- evaluatie wordt bewijslaag

Bouwen:
- opslagmodel voor evaluatie-uitkomsten
- koppeling aan task, versie, run en case
- historisch terugvindbare beoordelingen
- simpele aggregaties per versie: pass/fail, beter/gelijk/slechter/fout

Nog niet bouwen:
- complexe auto graders
- brede analyticslaag

### Stap 3 — Editors gelijktrekken
Doel:
- `entry_cleanup` niet als uitzondering laten bestaan

Bouwen:
- audit van alle bestaande prompt-editschermen
- bepalen wat nog hardcoded of task-specifiek is
- gedeelde editor-secties harmoniseren:
  - taakinstructie
  - system/advanced
  - input mapping
  - output contract
  - model/config
- task-metadata gebruiken waar taakverschillen echt bestaan

Nog niet bouwen:
- vrije payload editors
- raw JSON blob editing als hoofdmodus

### Stap 4 — Admin desktop/fullscreen UX verbeteren
Doel:
- AIQS wordt op desktop daadwerkelijk prettiger en sneller om mee te werken

Bouwen:
- bredere layoutregels voor admin
- detail/editor/test schermen geschikt maken voor grotere schermen
- split of multi-column waar compare dat ondersteunt
- sticky action footer aanpassen waar nodig voor desktop
- fullscreen als ondersteunde werkmodus behandelen

Nog niet bouwen:
- designpolish zonder workflowverbetering

### Stap 5 — Curated testsets en batch evaluatie
Doel:
- minder handmatig dezelfde cases zoeken

Bouwen:
- saved cases
- golden/edge/noisy labels
- N-case batch runs per task/version
- regressie-indicatie op dezelfde set

Nog niet bouwen:
- live beoordelingsqueues op productie-output

### Stap 6 — Pas later runtime/live en dashboard
Doel:
- pas toevoegen wanneer de onderlaag klopt

Later bouwen:
- runtime-koppeling aan echte studio versions
- live result reviews
- reviewer queues op productie-output
- kwaliteitstrends over live verkeer
- dashboard bovenop echte evaluatiedata

---

## 28. Samenvatting

AI Quality Studio is nu een werkende admin-hardening basis met:
- taskbeheer
- baseline import
- drafting
- single-run testen
- compare

De volgende volwassen stap is **niet** meer UI-volume of direct live runtimebeheer.

De volgende volwassen stap is:
- aantoonbaar testen in de tool
- evaluatie-uitkomsten opslaan als bewijs
- editors gelijktrekken
- admin desktop/fullscreen bruikbaar maken
- daarna pas regressiesets, lifecycle-verdieping, runtime-lineage en live-kwaliteit

Zo blijft de studio:
- contractvast
- reproduceerbaar
- beheersbaar voor admins
- eerlijk over wat nu al werkt en wat nog niet
- gericht op echte kwaliteitsverbetering in plaats van tool-uitbreiding

---

## 29. Recente regressie-learnings (bindend)

Doel: voorkomen dat dezelfde regressies terugkomen in AIQS editor- en admin-access flows.

### 29.1 Access-state mag geen netwerkfout als “geen toegang” framen

Regel:
- `adminAccess=false` mag alleen bij expliciete auth-codes (`AUTH_UNAUTHORIZED` of `AUTH_MISSING`).
- Generieke load/invoke/netwerkfouten blijven een laadfout, geen autorisatie-uitkomst.

Waarom:
- anders ontstaat false-negative “Geen toegang” voor echte allowlisted admins.

### 29.2 Allowlist parsing moet robuust zijn voor gequote env-waarden

Regel:
- allowlist parsing in edge functions moet omringende quotes strippen op bron- én itemniveau.

Waarom:
- lokale `.env.local` waarden staan vaak als `"uuid"`; zonder quote-strip faalt user-id match en krijg je onterechte `Forbidden`.

### 29.3 Prompt-editor normalisatie moet editor-overstijgend consistent zijn

Regel:
- newline/paragraph normalisatie moet identiek blijven tussen visual editor en sectieparsering.
- sectiewissels mogen geen “lege regel migratie” veroorzaken.

Waarom:
- inconsistente representatie (lege regels direct toevoegen vs buffered toepassen) veroorzaakt drift: regel weg in editor A, lege regel terug in editor B.

### 29.4 UI-regel voor deze editor

Regel:
- “Gebruikte tokens” hulpblok is verwijderd uit de editor-surface.
- editor-surface blijft licht/thematisch leesbaar in dark mode.

Waarom:
- minder visuele ruis, minder dubbelheid, en stabiel contrast voor tekstbewerking.

---

## Cline Workflow Afspraken

# Cline workflow (operationeel)

## Doel
Operationele werkwijze voor werken met ChatGPT Projects + Cline, zonder productwaarheid te vervuilen.

## Rolverdeling
- **ChatGPT Projects**: strategie, review en promptontwerp buiten repo-uitvoering.
- **Cline in VS Code**: repo-analyse, plan, wijzigingen, verify en commit.

## Bronnenvolgorde
1. `docs/project/README.md`
2. `AGENTS.md`
3. taakrelevante canonieke docs in `docs/project/**`
4. relevante skill(s) in `.agents/skills/**` wanneer de taak daar expliciet onder valt
5. `docs/dev/active-context.md` alleen wanneer recente sessiecontext of WIP relevant is

Regels:
- `docs/project/**` = canonieke projectwaarheid.
- `docs/dev/**` = workflowafspraken.
- `docs/upload/**` = generated uploadartefacten, geen canonieke bron.
- Geen "lees alles altijd"-regel; lees alleen taakrelevante bronnen.
- Voor Stitch-werk: gebruik `docs/dev/stitch-workflow.md` als operationele workflowbron.
- Voor idee-capture/promotie: gebruik `docs/dev/idea-lifecycle-workflow.md`.

## Design-implementatie guardrails (operationeel)
- `theme/tokens.ts` is de enige tokenbron; afgeleide configbestanden zijn niet leidend.
- Gebruik eerst bestaande shared primitives/patronen; voeg alleen een nieuw shared component toe bij een echt herhaalbaar patroon over meerdere schermen.
- Stop geen screen-specifieke designregels in generieke shared primitives.
- `design_refs/1.2.1/**` zijn bindend per scherm; `.md` notes tellen mee naast `code.html` en `screen.png`.
- Verify stylingwerk altijd in light én dark mode tegen relevante design refs voordat het “klaar” is.

## Repo-eigen Memory Bank workflow
- Onze memory bank is een **workflowlaag**, geen extra waarheidshiërarchie.
- Verdeling:
  - canonieke waarheid: `docs/project/**`
  - always-on gedrag: `AGENTS.md`
  - domeinspecifieke herhaalpatronen: `.agents/skills/**`
  - operationele workflow: `docs/dev/cline-workflow.md` + `docs/dev/memory-bank.md`
  - tijdelijke sessiecontext: `docs/dev/active-context.md`
  - statuswaarheid: `docs/project/current-status.md`
  - echte gaps/onzekerheden: `docs/project/open-points.md`

## Active context tussen sessies
- `docs/dev/active-context.md` is een lichte brug tussen Cline-sessies.
- Gebruik actief bij:
  - non-triviale taken
  - onderbroken sessies
  - multi-file werk
  - taken waar recente learnings/WIP of docs-updates relevant zijn
- Meestal niet nodig bij:
  - kleine, volledig afgebakende fixes zonder sessieafhankelijkheid

Regels:
- `active-context.md` is niet canoniek en niet de statuswaarheid.
- Verwijs naar canonieke docs in plaats van inhoud te kopiëren.
- Promoveer alleen stabiele learnings naar `AGENTS.md`, skills of `docs/dev/**`.

## Beslisregels per laag
- canonieke waarheid → `docs/project/**`
- operationele workflow → `docs/dev/**`
- always-on gedrag → `AGENTS.md`
- taak-/domeinspecifieke herhaalpatronen → skills
- tijdelijke sessiecontext → `docs/dev/active-context.md`
- statusrealiteit (bewijsbaar) → `docs/project/current-status.md`
- echte gaps/onzekerheden → `docs/project/open-points.md`

## Wanneer Plan mode
Gebruik Plan mode bij:
- bugs met onduidelijke oorzaak
- multi-file wijzigingen
- migraties
- taken met duidelijke scope-/architectuurrisico’s

## Wanneer Act mode
Gebruik Act mode voor:
- gerichte implementatie
- kleine fixes met duidelijke file-scope
- verify en afronding

## Promptpatronen

### Kleine fixes
- Houd input compact: doel + scope + files.
- Werk cheap-first: kleinste werkende wijziging.
- Geen scope-uitbreiding tijdens implementatie.

### Multi-file werk
- Begin met expliciete todo/checklist.
- Splits in: lezen → plan → edits → verify.
- Werk per duidelijke milestone en update checklist tussendoor.

## Verify-regel
- Voor relevante codewijzigingen: `npm run lint` en `npm run typecheck`.
- Voor canonieke docs-wijzigingen: ook `npm run docs:bundle` en `npm run docs:bundle:verify`.
- Commit alleen na geslaagde verify.

## Supabase migratie-uitvoering (verplicht)
- Bij wijzigingen in `supabase/migrations/**` voert Cline/Codex de lokale DB-stap standaard zelf uit: `npx supabase db push --local` (of `npx supabase db reset` wanneer nodig).
- Ook wanneer een taak leunt op een **al bestaande maar lokaal nog niet toegepaste** migratie (bijv. nieuwe tabel/kolom ontbreekt in runtime), voert Cline/Codex alsnog direct `npx supabase db push --local` uit.
- Vraag deze stap niet terug aan de gebruiker als de CLI hem veilig non-interactief kan uitvoeren.

## Dev-server policy
- Start geen langlopende dev servers tenzij expliciet gevraagd.
- Gebruik geen `CI=1` prefix voor lokale dev-server commando’s.
- Als live server nodig is: geef alleen het handmatige commando aan de gebruiker.

## Lessen uit sessies (stabiel, herbruikbaar)
- Bevestig bij onderbroken sessies altijd eerst de actuele file state (small read/diff) vóór nieuwe patches.
- Houd productwaarheid, toolingafspraken en uploadartefacten strikt gescheiden.
- Verhoog status/docs alleen met hard bewijs uit code, runtime of canonieke docs.
- Verwerk workflowlearnings in `AGENTS.md` of `docs/dev/**`, niet in productinhoud.

## Valkuilen om te vermijden
- Verder patchen op oude context na interrupties.
- Te brede patches zonder eerst klein te valideren waar de wijziging exact landt.
- `docs/upload/**` gebruiken als bron van waarheid.
- Productdocs vullen met operationele toolinguitleg.
- “Klaar” melden zonder volledige verify.

---

## README

# Planning hub

## Doel
Navigatiehub voor actieve uitvoeringsfocus, roadmap en afwijkingsbesluiten.

## Kernnotities
- Roadmap fases
- Active phase
- Now / Next / Later
- Deviations and decisions

## Verbonden lagen
- Strategy hub
- Research hub
- Ideas workspace
- Project hub

---

## Roadmap Phases

# Roadmap phases (lean)

## Doel
Eén overzicht van projectfases met status, zonder detail-overload.

## Obsidian links
- Planning hub
- Active phase
- Now / Next / Later
- Deviations and decisions
- Current status
- Open points

## Fasekaart
| Fase | Doel | Status |
|---|---|---|
| Fase 1 (kernlus) | capture -> dagboeklaag -> reflecties bouwen | afgerond als basis |
| Fase 1.2 (hardening) | stabiliteit, kwaliteit, UX, vertrouwen, beta-readiness | actief afgerond in delen / bewijsgedreven |
| Fase 2 (commerciële brug) | capture -> hergebruik -> reviewbare output pilots | next |
| Fase 3 (modulaire flows) | flow-families met eigen contracts/evals | later |

## Regel
- Alleen `planning/20-active-phase.md` bepaalt wat nu actief focusgebied is.

---

## Active Phase

# Active phase (uitvoeringsfocus)

## Actieve fase
Fase 1.2 hardening + structurering van project operating system.

## Doel van deze fase
1. Huidige capture-first productkwaliteit betrouwbaar houden.
2. Docs/planning/ideas structuur professionaliseren voor focus en automatisering.
3. Voorbereiden op volgende fase (commerciële brug) zonder die nu al te forceren.

## Obsidian links
- Planning hub
- Roadmap phases
- Now / Next / Later
- Deviations and decisions
- Current status
- Open points
- Strategy hub
- Ideas workspace

## In focus (Now)
- Stabiliteit, UX-consistentie, outputkwaliteit en releasebewijs.
- Duidelijke planninglaag (`roadmap`, `active`, `now-next-later`, `deviations`).
- Gestructureerde idee-capture met één file per idee.

## Niet in focus (nu niet trekken)
- Volledige productverbreding naar alle future-state modules tegelijk.
- Monolithische AI-oplossing over alle domeinen.
- Grote productpivot zonder expliciet besluit.

## Flexibele afwijkingsregel
- Kleine afwijkingen met lage impact mogen direct, maar moeten achteraf in `planning/40-deviations-and-decisions.md`.
- Structurele afwijkingen eerst als besluit/deviation vastleggen, daarna active-phase updaten.

## Bewijsregel
- Claims over “gereed” alleen met code- of runtimebewijs.

---

## Now Next Later

# Now / Next / Later

## Doel
Lean focusbord voor kanban-achtige planning zonder overgedetailleerde sprintadministratie.

## Obsidian links
- Planning hub
- Active phase
- Deviations and decisions
- Current status
- Open points
- Ideas workspace
- ../40-ideas/10-product/30-conversation-aware-ingest-and-interpretation
- ../40-ideas/30-ai-and-aiqs/50-source-aware-routing-and-evaluation
- ../40-ideas/40-platform-and-architecture/50-security-posture-and-continuous-hardening
- ../40-ideas/40-platform-and-architecture/60-budio-pro-markdown-workspace-and-obsidian-export

## Now
- Hardeningkwaliteit en evidence-first releaseproofing.
- Project operating system structuur in `docs/project/**` consolideren.
- Idea capture structureren (inbox + één-file-per-idee).
- Upload use-case matrix operationaliseren en primaire bundle-volgorde stabiliseren.
- Bundlescript hardening op curated build-truth paden (drift-preventie).

## Next
- Product-truth bundle compacter maken (minder duplicatie, minder self-reference).
- Legacy `upload-manifest.md` herpositioneren als extended/compatibility manifest.
- Design/UI truth bundle compositie verfijnen (minder excerpt-volume, meer gerichte guardrail-samenvatting).
- AI governance/operations bundle mogelijk compacter maken met focus op execution-samenvatting.
- Eerste expliciete commerciële brug (capture -> hergebruikbare output) als afgebakende pilot verkennen.
- Conversation-aware ingest (copy/paste fase 1) en source-aware AIQS-evaluatie verkennen als afgebakend spoor (zie `40-ideas/10-product/30-conversation-aware-ingest-and-interpretation.md` en `40-ideas/30-ai-and-aiqs/50-source-aware-routing-and-evaluation.md`).
- Security posture baseline + trust charter als gecombineerd spoor verkennen (zie `40-ideas/40-platform-and-architecture/50-security-posture-and-continuous-hardening.md` en `40-ideas/10-product/40-trust-and-security-charter.md`). Voor een dagboekapp is vertrouwen productwaarde, geen achtergrond-polish.

## Later
- Volledige modulaire flow-architectuur (journal/project-code/podcast/coaches) productiseren.
- VS Code plugin + MCP/API bridge als operationele bouwlaag realiseren.
- Budio brainstorm workspace als aparte productmodule valideren.
- Budio Pro markdown workspace + Obsidian export/koppeling alleen als later export-first integratiespoor (geen productie-sync nu).

## Parking lot
- Nieuwe ideeën eerst kort in `docs/project/40-ideas/00-ideas-inbox.md`.

---

## Deviations And Decisions

# Deviations and decisions

## Doel
Logboek van bewuste afwijkingen op actieve fase/planning, zodat flexibiliteit traceerbaar blijft.

## Obsidian links
- Planning hub
- Active phase
- Now / Next / Later
- Current status
- Open points
- Strategy hub

## Gebruik
- Elke structurele koerswijziging krijgt hier een korte entry.
- Kleine lage-impact afwijkingen mogen direct, maar worden alsnog achteraf gelogd.

## Template

### [YYYY-MM-DD] Titel
- **Type**: deviation | decision
- **Van plan/document**: (bijv. `planning/20-active-phase.md`)
- **Wijziging**: wat verandert er
- **Waarom**: context/redenering
- **Impact**: product | ui | services | supabase | docs
- **Vervolgactie**: welke docs/code moeten worden aangepast

## Entries

### 2026-04-19 — Lean operating system expliciet toegevoegd aan projectdocs
- **Type**: decision
- **Van plan/document**: impliciete root-structuur in `docs/project/`
- **Wijziging**: introductie van `strategy/`, `planning/` en `ideas/` als vaste operating system lagen
- **Waarom**: focus en traceerbaarheid verbeteren; ideeën, planning en canonieke waarheid scheiden
- **Impact**: docs
- **Vervolgactie**: bundelstrategie in volgende stap herschrijven op nieuwe structuur
