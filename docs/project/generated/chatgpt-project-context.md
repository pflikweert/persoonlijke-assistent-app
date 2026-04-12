# DO NOT EDIT - GENERATED FILE

# ChatGPT Project Context

Build Timestamp (UTC): 2026-04-12T11:36:12.046Z
Source Commit: 83b088f

Doel: compacte uploadcontext voor ChatGPT Project, afgeleid van canonieke projectdocs. Upload via docs/upload samen met de MVP design spec en Stitch design context.
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
- AGENTS.md

---

## Docs-Hiërarchie Samenvatting

# Projectdocs — Waarheidshiërarchie

Deze map bevat de actieve projectwaarheid voor scope, richting en status.

## 1) Canonieke handmatige documenten (leidend)
1. `docs/project/master-project.md`
2. `docs/project/product-vision-mvp.md`
3. `docs/project/current-status.md`
4. `docs/project/open-points.md`
5. `docs/project/content-processing-rules.md`
6. `docs/project/copy-instructions.md`
7. `docs/project/ai-quality-studio.md`

Aanvulling:
- `docs/project/ai-quality-studio.md` is de centrale AI governance-laag voor AI-gedrag, promptbeheer en evaluatie.

## 2) Generated documenten (afgeleid, niet leidend)
- `docs/project/generated/chatgpt-project-context.md`
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

## 4) Standaard upload naar ChatGPT Project / Stitch
Upload standaard de bestanden uit `docs/upload/`:
1. `docs/upload/chatgpt-project-context.md`
2. `docs/upload/ai-quality-studio.md`
3. `docs/upload/mvp-design-spec-1.2.1.md`
4. `docs/upload/stitch-design-context.md`
5. `docs/upload/upload-manifest.md`

Reden:
- de bundle bevat compacte projectcontext
- AI Quality Studio governance wordt als canonieke upload-copy apart meegenomen
- de design spec blijft apart leidend voor MVP-designbesluiten
- de Stitch design context bevat compacte design-handoff zonder alle docs te dupliceren
- het manifest maakt de uploadset controleerbaar

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
| Capture tekst | In scope | **Aanwezig** | `submitTextEntry` + capture UI in `app/(tabs)/capture.tsx`, `services/entries.ts`. |
| Capture audio | In scope | **Aanwezig** | recorder + audio-submit + payload guards in capture/services. |
| Intake flow | Kernflow | **Aanwezig** | `supabase/functions/process-entry/index.ts` + client invoke. |
| Entry hernormalisatie bij edit | Hardening-onderdeel | **Aanwezig** | `renormalize-entry` function + dagdetail editpad. |
| Day journal opbouw | Kernflow | **Aanwezig** | upsert in `process-entry` + `regenerate-day-journal` flow. |
| Reflecties week/maand | Kernflow | **Aanwezig** | `generate-reflection` function + reflectie UI/service. |
| Dagdetail mutaties | UX/hardening | **Aanwezig** | edit/delete + derived refresh in `app/day/[date].tsx` en `app/entry/[id].tsx`. |
| “Opnieuw samenvatten” als zichtbare knop | Genoemd in documentatie | **Deels aanwezig** | heropbouw bestaat functioneel, expliciete zichtbare knop niet hard aangetroffen. |
| ChatGPT markdown import | Niet kern in oorspronkelijke scope | **Aanwezig (feature-flagged)** | `app/settings.tsx`, `services/import/*`, `import-chatgpt-markdown` function + migrationkolommen. |
| Instellingen-submenu | Gevraagd in beheerflow | **Aanwezig** | `app/settings.tsx` toont submenu met `Archief downloaden`, `Importeren`, `Verwijder alles` en admin-only `Data opnieuw verwerken`. |
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
| Import verify fixtureconsistentie | Kwaliteitsborging | **Niet aangetroffen / onzeker** | import-tests verwijzen naar ontbrekende fixture `docs/dev/Dagboek voor gemoedstoestand.md`. |
| Design 1.2.1 volledige doorvoer | Gepland designspoor | **Aanwezig** | designrefs zijn structureel doorvertaald in shared primitives en kernflows; shell/theming/copy-guardrails zijn expliciet geborgd in canonieke docs en runtime-checklist. |

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

## Samenvatting
De release-1 kernlus is aantoonbaar gebouwd. Daarnaast is een admin-only settingspad toegevoegd voor globale herverwerking via OpenAI Batch API, inclusief persistente jobstatus en per-type voortgang. Voor 1.2D zijn settings export/import/delete nu functioneel bewezen binnen deze afgesloten scope (handmatige flow-validatie + runtime/API-bewijs van service- en data-effecten). Onvoldoende bewezen claims buiten deze scope blijven expliciet onzeker.

---

## Open Punten / Resterend Werk

# Open Points — Resterend Werk

## Doel
Dit document bevat alleen resterende gaps, risico’s en onzekerheden op basis van code-realiteit.

## Echt open (niet aangetroffen in code als productfeature)
1. Self-service beheer van adminrechten in product-UI ontbreekt; huidige toegang loopt via server-side allowlist env.

Toelichting:
- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.
- settings export/import/delete zijn functioneel aanwezig en voor deze scope bewezen.

## Deels open (nog niet hard afgerond)
1. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
2. 1.2E private-beta readiness met volledige runtime-doorloop van de releasechecklist in light + dark mode.

## Onzeker
1. Expliciete aparte post-capture assistentlaag als zelfstandige feature.
2. Import-verify robuustheid door ontbrekende chatgpt-import fixture.
3. Volledige handmatige UI-smoke voor alle settings-states (hub/export/import/delete) is nog niet als apart bewijsartefact vastgelegd.

## Prioriteit
1. Maak completion-criteria voor 1.2A/1.2B/1.2C/1.2E expliciet en toetsbaar.
2. Los onzekerheden op met hard bewijs; anders onzeker laten.

## Risico’s
1. Scope-creep richting brede assistent.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.

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

---

## 1. Doel en positie

AI Quality Studio is een **admin-only AI quality en prompting governance tool**.

Doel:
- AI-output betrouwbaar verbeteren
- prompt- en modelwijzigingen beheersbaar maken
- testbaar en reproduceerbaar itereren op echte brondata
- runtime-gedrag later gecontroleerd uit code-baseline naar DB-live binding brengen

De studio is:
- task-first
- contract-first
- result-first
- server-side only

De studio is **geen**:
- end-user feature
- brede assistentlaag
- generieke AI per scherm
- vervanging van productkaders of contentcontracten

---

## 2. Scopekader

### In scope
- Werk per **AI-task**, niet per scherm
- Versioning per task
- Runtime-baseline import uit code
- Drafting en gecontroleerde model/prompt-editing
- Test runs met snapshots
- Vergelijking testoutput vs runtime-basis / live-output
- Handmatige review en rollout-governance
- Traceability per versie en run

### Buiten scope
- Client-side OpenAI calls
- End-user debug- of beheerfeatures
- Brede chat/coach/agent-ervaring
- Auto-optimalisatie als vervanging van menselijke review
- Runtime DB-binding zonder rollout- en rollbackpad

---

## 3. Canonieke ontwerpprincipes

1. **Contract-first**  
   Content contracts zijn leidend boven promptvrijheid.

2. **Task-first**  
   Beheer op AI-taken, niet op UI-schermen.

3. **Result-first**  
   Testresultaat, compare en evaluatie zijn primair; technische metadata is secundair.

4. **Server-side only**  
   API keys, modelcalls en runtime-execution blijven server-side.

5. **Traceability by default**  
   Input/prompt/model/output snapshots + request/flow context zijn standaard.

6. **Eerlijke representatie**  
   Toon expliciet wanneer een studio-task onderdeel is van een gedeelde runtime-family.

7. **Geen dubbele waarheid zonder transitieplan**  
   Als code en DB tijdelijk naast elkaar bestaan, moet de hiërarchie expliciet zijn.

---

## 4. Relatie met contentcontracten (bindend)

Volgt `docs/project/content-processing-rules.md`.

Kernscheiding:
- `entry_cleanup` ≠ samenvatting
- `entry_summary` ≠ volledige bronlaag
- `day_narrative` ≠ `day_summary`
- reflectiepunten ≠ advieslaag
- reflecties ≠ therapeutische interpretatie

Als output deze grenzen schendt, is dat een **kwaliteitsfout**, ongeacht modelscore of “mooier” taalgebruik.

---

## 5. Huidige code-realiteit (status april 2026)

Deze sectie beschrijft wat nu aantoonbaar gebouwd is.

### 5.1 Datamodel (aanwezig)
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

### 5.2 Edge function (aanwezig)
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

### 5.3 App-beheerlagen (aanwezig)
- task hub
- task detail / versions
- draft editor
- test / compare

### 5.5 Entry_cleanup contract-first editor (aanwezig)
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
- baseline metadata blijft zichtbaar maar read-only, en geen primaire bewerklaag.

### 5.6 Admin detail-shell polish (aanwezig)
- gedeelde admin topnavigatie is visueel en technisch gecentreerd en navigation-only gebleven.
- gedeelde sticky action footer is nu een compact, herbruikbaar admin pattern met duidelijke hiërarchie:
  - primary
  - secondary
  - tertiary (quiet/destructive)
- patroon is toegepast op AIQS detailschermen zonder runtime- of contractscope uit te breiden.

### 5.4 Runtime-baseline model (aanwezig, transitie)
- Runtime-definities worden nu opgebouwd vanuit code
- Baseline import schrijft deze als `live` naar studio-DB
- Runtime zelf leest nog niet uit studio-DB

**Conclusie:** huidige model is een bruikbare overgangsarchitectuur, geen eindarchitectuur.

---

## 6. Editor abstraction (bindend)

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

---

## 7. Task composition model

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
  - managed_output_field: `body`
- `entry_summary`
  - runtime_family: `entry_normalization`
  - composition_role: `compound_member`
  - managed_output_field: `summary_short`
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

## 8. Output discipline

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

## 9. Model policy

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

## 10. Runtime-baseline import en tijdelijke dubbele waarheid

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

---

## 11. Evaluation architecture

Evaluatie gebeurt in 4 lagen, in vaste volgorde.

### Laag 1 — Contract checks
Hard rules, bijvoorbeeld:
- entry_cleanup mag niet samenvatten
- day_summary moet compacter zijn dan day_narrative
- reflectiepunten mogen geen advieslaag worden
- min/max items
- schema validatie
- verboden taal / verboden meta-zinnen

### Laag 2 — Pairwise compare
Standaard menselijke vergelijking tussen:
- live basis / huidige productie-uitkomst
- draft / candidate output

Labels:
- `beter`
- `gelijk`
- `slechter`
- `fout`

### Laag 3 — Curated regression sets
Voor elke belangrijke task geleidelijk opbouwen:
- goldens
- edge cases
- noisy input
- dunne bron
- duplicate-heavy dag
- lange persoonlijke dag
- afwijkende talen / rare input

### Laag 4 — Automated graders
Pas later toevoegen.

Regels:
- nooit de enige bron van waarheid
- pas ná curated regressiesets
- alleen ondersteunend aan contract checks + human review

---

## 12. Human review protocol

### Standaardreview
De default reviewvorm is **pairwise**:
- live / runtime-basis vs draft/candidate

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

---

## 13. Source selection rules

Bronselectie is onderdeel van kwaliteit, niet alleen een UI-detail.

### Regels
- testdata moet representatief zijn
- default sortering: recent + bruikbaar
- fallback/lege records mogen niet dominant zijn
- noisy cases mogen zichtbaar zijn, maar duidelijk herkenbaar
- bronselectie moet compacte preview + zoek/filter ondersteunen

### Richting
Latere fase:
- curated saved cases
- goldens
- regressiesets per task

---

## 14. Version lifecycle governance

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

---

## 15. Prompt registry readiness

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

## 16. Execution-modi

1. **Single interactive call**
   - 1 task, 1 versie, 1 bron

2. **Curated batch evaluation**
   - 1 task, 1 versie, N cases

3. **Production-derived shadow batch**
   - echte bronnen, geen canonieke write

4. **Live regeneration batch**
   - gecontroleerde herberekening na rollout

---

## 17. Prompt caching (vooruitblik)

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

## 18. Runtime-koppeling en lineage

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

---

## 19. Bekende beperkingen (huidige fase)

Niet volledig aanwezig:
- promote-to-live workflow
- rollback flow
- reviewer labeling flow in UI
- batch test runs / regressiesets
- volledige compare-ondersteuning voor alle taskkeys
- directe DB-live binding voor productie-runtime

---

## 20. Learnings uit de bouwsessie (gestandaardiseerd)

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

---

## 21. Valkuilen (expliciet)

1. Task/scherm-verwarring
2. Compound-runtime verbergen als single output
3. Dubbele waarheid tussen code en DB zonder transitieplan
4. Promptedits zonder contractguardrails
5. Alleen line-diff gebruiken als kwaliteitsbewijs
6. Te vroege automation zonder curated regressiesets
7. Product-visible debugdrift buiten admincontext
8. Runtimekoppeling zonder rollbackpad
9. Payload-editing vermommen als promptbeheer

---

## 22. Prioriteitenvolgorde (advies)

1. Stabiliseer **editor abstraction + task semantiek**
2. Voltooi **review protocol + version governance**
3. Voeg **curated regression sets + batch evals** toe
4. Verbind **runtime writes met lineage**
5. Schakel gecontroleerd naar **DB-live binding**
6. Open daarna pas verdere model-upgrades en automation

---

## 23. Samenvatting

AI Quality Studio is nu een werkende admin-hardening basis met:
- taskbeheer
- baseline import
- drafting
- single-run testen
- compare

De volgende volwassen stap is niet meer UI-volume, maar:
- bindende editor-abstraction
- expliciete task-compositie
- evaluatie-architectuur
- lifecycle governance
- runtime-lineage
- en daarna pas gecontroleerde DB-live binding

Zo blijft de studio:
- contractvast
- reproduceerbaar
- beheersbaar voor admins
- veilig richting echte runtime-koppeling

---

## Korte Appendix - Projectkritische AGENTS-punten

### Canonieke projectdocs
- `docs/project/master-project.md`
- `docs/project/product-vision-mvp.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/content-processing-rules.md`
- `docs/project/copy-instructions.md`
- `docs/project/ai-quality-studio.md`
- `master-project.md` = product, scope, fasekaart, beslisregels
- `product-vision-mvp.md` = productgedrag en guardrails
- `current-status.md` = enige statuswaarheid voor code-realiteit
- `open-points.md` = resterende gaps en onzekerheden
- `content-processing-rules.md` = canonieke inhouds- en outputregels
- `copy-instructions.md` = canonieke copy-, tone-of-voice- en microcopyregels
- `ai-quality-studio.md` = canonieke AI-governance voor prompting, evaluatie en kwaliteit
- volg altijd `docs/project/ai-quality-studio.md`

### Canonieke designbronnen (MVP 1.2.1)
- `docs/design/mvp-design-spec-1.2.1.md` is leidend voor MVP-designbeslissingen.
- `design_refs/1.2.1/ethos_ivory/DESIGN.md` is leidend voor foundations.
- `design_refs/1.2.1/*/code.html` en `design_refs/1.2.1/*/screen.png` zijn leidend per scherm.
- Als een schermmap in `design_refs/1.2.1/**` een `.md` design-note heeft, gebruik die ook als aanvullende per-scherm designinput.
- `docs/design/archive/phase-1.3-design-direction.md` is verouderd en niet leidend.

### Docs-workflow
- werk eerst de handmatige docs bij
- houd ook root `README.md` synchroon met actuele runtime/feature-realiteit
- draai daarna:
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `docs/upload/**` is generated uploadoutput voor de gebruiker; gebruik deze map niet als canonieke agentbron.
- Standaard uploadset staat in `docs/upload/upload-manifest.md` en bevat ChatGPT Project context, MVP design spec en Stitch design context.
- documenteer altijd zichtbaarheidsregel (admin-only) en allowlist-mechanisme
- documenteer relevante env-vars (`ADMIN_REGEN_ALLOWLIST_USER_IDS`, `ADMIN_REGEN_INTERNAL_TOKEN`)

### Security
- `OPENAI_API_KEY` blijft altijd server-side.
- Commit nooit secrets, tokens of lokale env-bestanden.
- Bouw geen client-side OpenAI-calls met geheime sleutels.

### Kwaliteit
- `npm run lint`
- `npm run typecheck`
- Never run long-lived dev servers like `npx expo start`, `npm run dev`, `vite`, `next dev`, `supabase functions serve`, or similar unless I explicitly ask.
- Assume the local dev server is already running.
- Never prefix local dev-server commands with `CI=1`.
- For validation, use one-shot commands only, such as:
- `npm run lint`
- `npm run typecheck`
- project verify scripts
- If a live server is required, tell me the exact command to run manually instead of running it yourself (example: `npx expo start --web --localhost`).
