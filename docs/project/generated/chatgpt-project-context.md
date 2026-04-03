# DO NOT EDIT — GENERATED FILE

Build Timestamp (UTC): 2026-04-03T12:47:57.234Z
Source Commit: 9e4ce59

Doel: compacte uploadcontext voor ChatGPT Project, afgeleid van canonieke projectdocs.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Bronbestanden (vaste volgorde)
- docs/project/README.md
- docs/project/master-project.md
- docs/project/product-vision-mvp.md
- docs/project/current-status.md
- docs/project/open-points.md
- docs/project/content-processing-rules.md
- AGENTS.md

---

## Docs-Hiërarchie Samenvatting

# Projectdocs — Waarheidshiërarchie

Deze map bevat de actieve projectwaarheid voor productscope, faseplanning en actuele status.

## 1) Leidende documenten (handmatig onderhouden)
1. `docs/project/master-project.md`
2. `docs/project/product-vision-mvp.md`
3. `docs/project/current-status.md`
4. `docs/project/open-points.md`
5. `docs/project/content-processing-rules.md`

Gebruik deze volgorde ook als leesvolgorde.

## 2) Generated document (afgeleid, niet leidend)
- `docs/project/generated/chatgpt-project-context.md`

Dit bestand is bedoeld als compacte uploadcontext voor ChatGPT Project.
Het is afgeleid van de leidende documenten hierboven.

Regel:
- handmatige docs zijn de bron
- generated docs zijn output

## 3) Archive-only (niet leidend)
- `docs/project/archive/**`
- `docs/design/archive/**`
- historische dumps in `docs/dev/archive/**`

Archive-only documenten mogen context geven, maar zijn nooit bindend voor scopebeslissingen.

## 4) Uploadworkflow voor ChatGPT Project
Upload primair:
- `docs/project/generated/chatgpt-project-context.md`

Niet nodig om mee te uploaden:
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/**`
- lokale setup/run-instructies die geen productwaarheid zijn

## 5) Onderhoudsworkflow
1. Werk eerst de handmatige leidende docs bij.
2. Draai `npm run docs:bundle`.
3. Controleer met `npm run docs:bundle:verify`.
4. Commit handmatige docs + generated bundle samen.

---

## Hoofd Projectdocument

# Persoonlijke Assistent App — Master Project (Canoniek)

## Doel van dit document
Dit is het hoofd-document voor:
- productdefinitie
- scopegrenzen
- fasekaart
- huidige uitvoervolgorde

Dit document is leidend samen met:
- `docs/project/product-vision-mvp.md`
- `docs/project/content-processing-rules.md`

Designbeslissingen blijven leidend in:
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/**`

## Productkern
De app is een persoonlijke contextmachine:
- capture via tekst en audio
- server-side verwerking naar bruikbare entries
- opbouw van één canonieke dagboeklaag per dag
- week- en maandreflecties op basis van die dagboeklaag

Kernbelofte:
- snel vastleggen
- rustig teruglezen
- later overzicht zonder handmatig knip- en plakwerk

## Harde scopegrens (MVP)
In scope:
- auth (magic link)
- tekstcapture en audiocapture
- transcriptie voor audio
- entry normalisatie
- day journal opbouw per kalenderdag
- week- en maandreflecties
- kernschermen: Vandaag, Vastleggen, Dagen, Dagdetail, Reflecties

Buiten scope:
- brede chat/coach/agent-ervaring
- retrieval/Q&A en vector search
- document intelligence en brede uploadsuite
- taken/agenda/reminders
- realtime voice als productmodus

## Productprincipes
1. Capture-first: vastleggen moet laagdrempelig en snel zijn.
2. Dagboeklaag leidend: day journal is de canonieke productlaag.
3. Bron en AI-output gescheiden: ruwe bron blijft herleidbaar.
4. Reflectie boven pseudo-intelligentie: eerst kwaliteit en betrouwbaarheid.
5. Geen scope-creep naar brede assistent in MVP.

## Huidige code-realiteit (samengevat)
Aantoonbaar aanwezig in code:
- auth, capture (tekst/audio), processing, day journals, reflecties
- edge functions: `process-entry`, `regenerate-day-journal`, `renormalize-entry`, `generate-reflection`
- dagdetail mutaties (edit/delete) met heropbouw van afgeleide lagen

Ook aanwezig, maar niet leidend voor kernscope:
- ChatGPT markdown importpad via instellingen + edge function (`import-chatgpt-markdown`)
- dit pad is feature-flagged en moet niet gelezen worden als verbreding naar brede chatapp

Niet aangetroffen als productfeature:
- gebruikersgerichte export/backupflow
- gebruikersgerichte reset/delete-all flow

## Fasehistorie
- Fase 0: setupbasis
- Fase 1: kernlus (auth → capture → verwerking → day journal → reflectie)
- Huidige hardeningfase: Fase 1.2

## Fase 1.2 (hardening, geen featureverbreding)
Fase 1.2 is pre-release hardening van de bestaande kern, niet een nieuwe productrichting.

### Subfases met huidige status
| Subfase | Doel | Status (code) | Toelichting |
|---|---|---|---|
| 1.2A Stabiliteit/foutafhandeling | deterministische flow + tracing + verify | **Deels aanwezig** | request/flow logging en verify scripts aanwezig; afronding als geheel niet hard bewezen. |
| 1.2B Outputkwaliteit | betere narrative/reflection kwaliteit | **Deels aanwezig** | contracts, guardrails en quality-checks aanwezig; geen harde “afgerond”-markering als complete set. |
| 1.2C UX-polish | rustiger kernflows zonder feature-uitbreiding | **Deels aanwezig** | veel loading/empty/error states aanwezig; volledige uniformiteit niet hard bewezen. |
| 1.2D Vertrouwen (export/reset) | eigenaarschap via export/reset-basis | **Niet aangetroffen** | alleen dev/export tooling gevonden, geen gebruikersfeature in app-flow. |
| 1.2E Private-beta readiness | overdraagbaarheid, checks, checklist | **Deels aanwezig** | setup + verify aanwezig; complete smoke/release-checklist als afgeronde set niet hard bewezen. |

Statuslabels:
- Aanwezig = hard aantoonbaar in code
- Deels aanwezig = aantoonbare onderdelen, maar niet volledig bewezen als afgeronde subfase
- Niet aangetroffen = geen productimplementatie gevonden
- Onzeker = bewijs onvoldoende

## Juiste huidige uitvoervolgorde
1. 1.2A stabiliteit en foutafhandeling
2. 1.2B outputkwaliteit
3. 1.2C UX-polish
4. 1.2D export/reset op productniveau
5. 1.2E private-beta readiness

## Open beslisregels voor deze fase
- Geen nieuwe architectuur voor de app.
- Geen verbreding naar brede chat/coach/agent.
- Geen runtime featurewerk buiten bestaande scope.
- Twijfelgevallen blijven expliciet “onzeker” tot bewijs in code/docs.

## Bekende spanningen tussen plan en realiteit
1. Productvisie noemt een kleine directe assistentlaag na capture.
   - Status: **deels/onzeker** als aparte expliciete featurelaag.
   - Wel aanwezig: entry-completion en afgeleide verwerking.
   - Niet hard aangetroffen: zelfstandige, duidelijk afgebakende post-capture assistentmodule.

2. Export/reset stond gepland in 1.2D.
   - Status: **niet aangetroffen** als gebruikersfeature.
   - Wel aanwezig: developer dumps en verify tooling.

3. ChatGPT markdown import is gebouwd.
   - Status: **aanwezig** als feature-flagged importpad.
   - Positionering: ondersteunende ingest, geen wijziging van kernscope.

## Post-MVP / expliciet buiten huidige scope
- retrieval/Q&A over volledig archief
- vector en semantic search
- brede assistant/chatcoaching
- document intelligence als brede productlaag
- taken/agenda/reminder-suite

## Niet leidend / archive-only
- `docs/project/archive/**`
- `docs/design/archive/**`
- historische dumps in `docs/dev/archive/**`

## Samenvatting in één zin
De app blijft een capture-first dagboekmachine met day journals als hoofdwaarheid; Fase 1.2 draait om hardening van de bestaande kern, niet om verbreding naar een brede assistent.

---

## Productvisie Aanscherping

# Persoonlijke Assistent App — Productvisie Aanscherping (MVP)

## Doel
Dit document scherpt de productrichting aan zonder de oorspronkelijke scope te verbreden.

Bindend in combinatie met:
- `docs/project/master-project.md`
- `docs/project/content-processing-rules.md`

## Kernformule
De productformule voor MVP blijft:
- capture → structureren → dagboekdag → weekreflectie → maandreflectie

Aangescherpte formule:
- capture → korte terugkoppeling waar passend → opname in dagboeklaag → latere reflectie

## Harde productregel
De app is eerst een dagboekmachine, pas daarna een lichte assistentlaag.

Dat betekent:
- dagboeklaag is leidend
- assistentlaag is ondersteunend
- geen open chatproduct als default

## Twee sporen
### Spoor A — Canonieke inhoud (leidend)
- ruwe input
- genormaliseerde entry
- day journal
- weekreflectie
- maandreflectie

Eigenschap:
- duurzaam opgeslagen en terugleesbaar

### Spoor B — Tijdelijke assistentie (ondersteunend)
- korte observatie/spiegel/vraag direct rond capture
- eventueel zeer beperkte vervolginteractie

Eigenschap:
- niet leidend
- standaard niet de canonieke dagboeklaag

## Realiteitscheck t.o.v. actuele code
Status van de aangescherpte assistentlaag als aparte feature:
- **Deels aanwezig / onzeker**

Wat wel hard aantoonbaar is:
- capture-verwerking
- entry completion schermen
- afgeleide heropbouw (day journal + reflecties)

Wat niet hard als aparte laag is aangetoond:
- een duidelijk afgebakende, zelfstandige post-capture assistentmodule met eigen persistentieregels

Beslisregel:
- zolang dat bewijs ontbreekt, blijft de status “deels aanwezig / onzeker”.

## Dagboekhygiëne
Standaard niet in de canonieke dagboeklaag:
- assistentmeta-tekst
- analyse-over-analyse
- losse chatachtige interactie zonder dagboekwaarde

Wel in de canonieke dagboeklaag:
- gebruikersbron
- genormaliseerde inhoud
- dagboekdag
- week/maandreflecties

## Scopebehoud
Binnen MVP:
- capture-first flows
- betrouwbare dagboekopbouw
- rustige reflecties

Buiten MVP:
- brede coach/chatmodus
- therapeutische of diagnose-achtige assistentrollen
- open memory-agentgedrag
- verbreding naar algemene agentarchitectuur

## Fase 1.2 implicaties
- 1.2B: kwaliteit van narrative en reflecties moet brongetrouw en niet-generiek blijven.
- 1.2C: UX moet duidelijk maken wat canonieke opslag is en wat tijdelijke assistentie is.
- 1.2D: export mag niet impliciet verworden tot chatlog-export.

## Beslisregel voor vervolg
Nieuwe ideeën tellen alleen mee als ze de dagboekmachine versterken.
Als iets vooral richting brede assistent trekt, valt het buiten de huidige fase.

---

## Actuele Gebouwde Status

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

---

## Open Punten / Resterend Werk

# Open Points — Resterend Werk

## Doel
Dit document bevat alleen resterende gaps op basis van:
- oorspronkelijke planning in projectdocs
- aantoonbare code-realiteit

## Echt open (niet aangetroffen in code als productfeature)
1. Export van dagboeklaag voor eindgebruiker (1.2D).
2. Export van reflecties voor eindgebruiker (1.2D).
3. Eenvoudige gebruikersreset/delete-all flow (1.2D).

Toelichting:
- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.

## Deels open (aanwezig maar niet aantoonbaar afgerond)
1. 1.2A stabiliteit/foutafhandeling.
2. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
3. 1.2C UX-polish over alle kernflows.
4. 1.2E private-beta readiness inclusief expliciete releasechecklist.

## Onzeker (bewust niet geüpgraded naar “aanwezig”)
1. Volledige implementatiedekking van designrefs 1.2.1 per scherm.
2. Expliciete, aparte post-capture assistentlaag zoals visieformulering suggereert.
3. Import-verify robuustheid: chatgpt-import tests verwijzen naar ontbrekende fixture (`docs/dev/Dagboek voor gemoedstoestand.md`).

## Prioriteitsvolgorde
1. Sluit 1.2D productgaps (export/reset).
2. Maak completion-criteria voor 1.2A/1.2B/1.2C/1.2E expliciet en toetsbaar.
3. Los onzekerheden op met hard bewijs (code + docs), anders onzeker laten.

## Buiten scope / post-MVP
- brede chat/coach/agent-richting
- retrieval/Q&A en vector search
- document intelligence als brede productlaag
- taken/agenda/reminders

## Risico's
1. Scope-creep richting brede assistent.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.

---

## Content / Narrative Processing Regels

# Content & Narrative Processing Rules (Canoniek)

## Doel
Dit document is het bindende gedragscontract voor contentverwerking in drie lagen:
1. `entries_normalized.body`
2. `day_journals.narrative_text`
3. `day_journals.summary`

Dit is de canonieke content-regeldoc voor MVP.

## Waarom dit document leidend is
Deze regels sluiten direct aan op:
- server contracts en guardrails in `process-entry`, `regenerate-day-journal`, `renormalize-entry`
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

## Scheidingsregel tussen lagen
- `entries_normalized.body` = volledige opgeschoonde bronlaag van één entry
- `day_journals.narrative_text` = volledige dagverhaallaag
- `day_journals.summary` = compacte samenvattingslaag

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
4. Geen marker-leak of fallback-tekst als inhoud in dagboek/reflectie.
5. Output blijft brongebonden en leesbaar op representatieve quality-fixtures.

## Implementatiekoppeling
Primair geraakt door:
- `supabase/functions/process-entry/index.ts`
- `supabase/functions/regenerate-day-journal/index.ts`
- `supabase/functions/renormalize-entry/index.ts`
- `supabase/functions/_shared/day-journal-contract.mjs`
- `scripts/verify-local-output-quality.sh`

## Buiten scope
- nieuwe AI-flowarchitectuur
- stijlclone-engine
- extra tabellen of migrations voor deze regels

---

## Korte Appendix — Projectkritische AGENTS-punten
### Canonieke projectbron
- `docs/project/master-project.md`
- `docs/project/product-vision-mvp.md`

### Canonieke designbronnen (MVP 1.2.1)
- `docs/design/mvp-design-spec-1.2.1.md` is leidend voor MVP-designbeslissingen.
- `design_refs/1.2.1/ethos_ivory/DESIGN.md` is leidend voor foundations.
- `design_refs/1.2.1/*/code.html` en `design_refs/1.2.1/*/screen.png` zijn leidend per scherm.
- `docs/design/archive/phase-1.3-design-direction.md` is verouderd en niet leidend.

### Security
- `OPENAI_API_KEY` blijft altijd server-side.
- Commit nooit secrets, tokens of lokale env-bestanden.
- Bouw geen client-side OpenAI-calls met geheime sleutels.

### Kwaliteit
- `npm run lint`
- `npm run typecheck`
