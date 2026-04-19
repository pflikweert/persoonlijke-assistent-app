# Budio — future-state analyse, 12-maandenrichting en AIQS-architectuur

## Doel van dit document
Dit document bundelt:
- waar Budio nu staat ten opzichte van het 12-maandenplan en de richtingsanalyse
- de toekomstige rol van AI Quality Studio (AIQS)
- een scherpe future-state architectuur in 3 lagen: consumer, Pro en private/regulated
- een abonnements- en kredietmodel met usage-registratie vanaf MVP
- de minimale logging- en analysetruth die nodig is om kosten, verbruik en marge te kunnen sturen

---

## 1. Waar Budio nu staat

Budio staat nu productmatig op een sterke **capture-first basis**, niet op een uitgewerkte Pro-contentmachine.

De huidige kern is:
- snelle tekst- en audiocapture
- server-side verwerking
- daglaag / narratieve dagboeklaag
- week- en maandreflecties
- rustige, niet-chatachtige UX
- een al opvallend volwassen admin AI-governance-laag via AIQS

Dat betekent:
- **de intake-machine staat er al**
- **de kwaliteitsmachine staat in opbouw**
- **de omzetmachine staat nog niet scherp genoeg in het product**

De belangrijkste strategische waarheid:

**Vandaag is nu nog de validatielaag. Niet de volledige eindmarkt.**

De consumenten-MVP is dus zinvol, maar alleen als die bewust gebruikt wordt om te leren:
- capturen mensen echt vaak genoeg?
- komt men terug?
- vertrouwen mensen de AI-structuur?
- willen ze later iets dóén met hun input?

Als dat laatste waar blijkt, dan ontstaat de echte commerciële route:

**capture -> structureren -> hergebruik -> content/output -> review -> distributie**

---

## 2. De echte strategische positie van Budio

Budio moet niet eindigen als:
- nog een journaling app
- nog een AI social tool
- nog een autopost machine
- nog een generieke promptlaag

De sterkste positie is:

**Budio = capture-first intelligence stack**

Voor mensen die ruwe gedachten, audio, dagen, ideeën en expertise willen omzetten in:
- overzicht
- betekenisvolle terugblik
- werkbare output
- publiceerbare content
- zonder hun eigen stem kwijt te raken

De kernmoat zit waarschijnlijk in 4 dingen:
1. context
2. geheugen / memory
3. review en governance
4. modelrouting + kwaliteitsbewijs

Daarom is AIQS strategisch veel belangrijker dan alleen promptbeheer.

---

## 3. Wat AIQS nu is en wat het moet worden

## Wat AIQS nu is
AIQS is nu vooral:
- admin-only
- task-first
- contract-first
- evidence-first
- server-side
- geschikt voor baseline import, drafting, testen en compare

Dat is goed.
Maar dit is nog vooral de **eerste kwaliteitsschil**.

## Wat AIQS moet worden
AIQS moet uitgroeien tot de **control plane van Budio intelligence**.

Niet zichtbaar als product voor eindgebruikers, maar intern de plek waar je beheert:
- welke AI-taken bestaan
- welke outputcontracten gelden
- welke modellen per taak zijn toegestaan
- welke provider per taak gebruikt wordt
- wanneer local, private of cloud inferentie is toegestaan
- welke kosten per taak ontstaan
- welke kwaliteit per taak bewezen is
- welke versies live mogen
- welke privacy- en complianceregels per taak gelden

AIQS wordt dan niet alleen prompting-governance, maar:

### AIQS future capabilities
1. **task registry**
   - cleanup
   - summary
   - narrative
   - reflections
   - post voorstel
   - caption
   - script outline
   - brand voice rewrite
   - redaction / privacy filter
   - publish prep

2. **model routing per task**
   - local model
   - public cloud model
   - private cloud model
   - fallback model

3. **structured output governance**
   - schemas
   - hard contracts
   - validation
   - allowed failure paths

4. **evaluation and evidence**
   - goldens
   - regressiesets
   - pairwise compare
   - human review
   - contract checks
   - quality scorecards

5. **usage and cost analytics**
   - cost per task
   - cost per user
   - cost per plan
   - cost per provider
   - token and audio usage
   - outliers / heavy users

6. **privacy routing**
   - local only
   - EU-cloud only
   - no-retention routing
   - redact first
   - human approval required

7. **lineage and audit**
   - source -> transform -> review -> export -> publication

---

## 4. Future-state architectuur in 3 lagen

# Laag 1 — Consumer

## Doel
Laagdrempelig, rustig, persoonlijk capture-product.

## Productnaam
**Budio Vandaag**

## Belofte
Leg je dag snel vast. Zie hem later rustig terug.

## Kern
- tekstcapture
- audiocapture
- cleanup
- daglaag
- week/maandreflectie
- eenvoudig archief
- export
- beperkte hergebruikacties als brugfunctie

## AI-doel in deze laag
Niet “slim” lijken.
Wel:
- rustig structureren
- terugleesbaarheid vergroten
- lage frictie
- vertrouwen opbouwen

## Toekomstige AI-functies in consumer
- maak hier een korte post van
- maak hier een caption van
- maak hier een ruwe note van
- samenvattingen en terugblik
- optioneel lokale eerste-pass cleanup op supported devices

## Privacy-principe
- cloud default, privacy-bewust
- local assist waar mogelijk
- heldere export/delete controls
- geen medische of therapeutische positionering

## Commerciële rol
Consumer is:
- validatielaag
- instaplaag
- merkbouwlaag
- bovenkant van de funnel

Niet de sterkste omzetlaag op zichzelf.

---

# Laag 2 — Pro

## Doel
Van ruwe capture naar werkbare, publiceerbare output.

## Productnaam
**Budio Pro**

## Primaire doelgroep
- solo experts
- podcasters
- coaches
- consultants
- trainers
- ervaringsdeskundigen
- knowledge creators

## Belofte
Denk hardop. Budio maakt er werkbare content van.

## Kern
- alles uit consumer
- betere capture-to-content flows
- format packs
- tone / voice presets
- series en content buckets
- review queue
- kanaalspecifieke output
- export / publish prep
- usage inzicht

## Belangrijkste nieuwe capability
De input is niet alleen archief.
De input wordt **grondstof voor output**.

Bijvoorbeeld:
- dag -> LinkedIn post
- voice note -> short-form script
- losse ideeën -> podcast outline
- reflectie -> nieuwsbrief-startpunt
- meeting note -> samenvatting + follow-up concept

## AI-doel in deze laag
- kwaliteit + snelheid
- stembehoud
- contextbehoud
- review before publish

## Productregel
Niet automatisch alles posten.
Wel:
- auto-prepare
- human approve
- smart publish

## Commerciële rol
Dit is de eerste echte kern van de omzetmachine.

---

# Laag 3 — Private / Regulated

## Doel
Budio voor privacygevoelige en professioneel gereguleerde omgevingen.

## Mogelijke namen
- **Budio Private**
- **Budio Business**
- **Budio Sovereign**

## Doelgroepen
- kleine zorg- of begeleidingspraktijken
- coaches/therapeuten met hoge privacy-eisen
- consultancy/bureaus met vertrouwelijke klantinformatie
- organisaties met EU data-eisen
- later mogelijk enterprise-achtige teams

## Belofte
Dezelfde capture- en outputkracht, maar met strengere controle, routing en governance.

## Kern
- private workspace
- admin controls
- data residency / routing policies
- private model allowlists
- gevoeligheidsprofielen per taak
- audit trails
- team approval
- langere opnames
- meeting capture
- strengere export- en retentionregels

## AI-doel in deze laag
Niet eerst “meer features”, maar:
- meer controle
- meer privacy
- meer governance
- meer deployopties

## Inference-opties
- EU-cloud only
- private cloud routing
- model allowlist per workspace
- local-first hybride flows
- later optioneel on-prem / self-hosted gateway

## Commerciële rol
Dit is niet de eerste wedge.
Maar het is wel de sterkste high-ARPU laag zodra governance, privacy en teamflows echt goed zitten.

---

## 5. Productarchitectuur over deze 3 lagen heen

Onder alle 3 lagen hoort eigenlijk dezelfde basisarchitectuur te liggen:

### A. Experience layer
- app UX
- capture UX
- archive UX
- review UX
- export / publish UX

### B. Intelligence execution layer
- transcription
- cleanup
- summaries
- reflections
- transforms
- content outputs
- redaction / safety tasks
- model routing

### C. Governance layer
- AIQS
- task registry
- evals
- model allowlists
- contracts
- rollout
- lineage
- audit

### D. Usage and billing layer
- plans
- monthly entitlements
- credit ledger
- top-ups
- auto-recharge
- cost analytics
- quota enforcement

### E. Privacy and policy layer
- consent / disclosure
- retention policy
- residency routing
- local-vs-cloud policy
- sensitive-data handling

---

## 6. Verdienmodel — abonnement + usage credits

## Belangrijk productprincipe
Naar gebruikers toe verkoop je idealiter **credits** of **AI-verbruik**.
Niet ruwe provider-tokens.

Waarom:
- begrijpelijker
- stabieler ondanks modelwissels
- beter voor prijssturing
- makkelijker te bundelen per plan

Intern registreer je wél:
- input tokens
- output tokens
- cached tokens waar relevant
- audio seconden / minuten
- inferentietype (local/cloud/private)
- provider en model
- geschatte kostprijs

Dus:
- **extern = credits**
- **intern = usage truth**

---

## 7. Voorstel abonnementsmodel

# 1. Free

## Doel
Instap, validatie, productleren.

## Inbegrepen
- basis capture
- tekst
- korte audio
- daglaag
- beperkt archief
- basis reflectie
- beperkt aantal AI-acties per maand

## Grenzen
- audio max **3 minuten** per opname
- lagere maandelijkse credits
- tragere of goedkopere modelrouting waar acceptabel
- beperkte export
- beperkte hergebruikacties

## Rol
- lage drempel
- merkintro
- geen royale bundel
- net genoeg om waarde te voelen

---

# 2. Plus

## Doel
Betaalde consument die vooral rust, archief en AI-structuur wil.

## Inbegrepen
- alles uit Free
- meer maandelijkse credits
- langere audio
- betere export
- betere reflecties
- iets meer hergebruikmogelijkheden

## Grenzen
- audio max **5 minuten** per opname
- geen geavanceerde content-workflows
- geen uitgebreide review queue

## Richtprijs
Denk aan: **€9–€14 p/m**

---

# 3. Pro

## Doel
Solo expert / creator die ruwe input omzet naar output.

## Inbegrepen
- alles uit Plus
- content transforms
- kanaalspecifieke outputs
- format packs
- tone/voice-instellingen
- review queue
- betere AI-modellen
- meer credits

## Grenzen
- audio max **10 minuten** per opname
- individuele gebruiker / beperkte workspace

## Richtprijs
Denk aan: **€29–€49 p/m**

Dit is waarschijnlijk de eerste sweet spot.

---

# 4. Private / Business

## Doel
Privacy-intensief, teammatig of zwaarder gebruik.

## Inbegrepen
- alles uit Pro
- lange meeting captures
- team/workspace controls
- usage- en auditinzichten
- routing policies
- private/EU-only opties
- grotere of gepoolde credits
- prioriteit / support

## Grenzen
- per workspace, seat of usage bundle
- extra governancekosten terecht doorberekenen

## Opnamegrens
- **60 minuten of langer** per opname / meeting
- eventueel hoger per plan of add-on

## Richtprijs
Denk aan:
- **€99–€249 p/m per workspace startpunt**
- of **€39–€99 p/m per seat**
- afhankelijk van privacy/gateway/support eisen

---

## 8. Credits en top-ups

## Model
Elke betaalde tier krijgt:
- een maandelijkse bundel credits
- optionele losse top-up packs
- optionele auto-recharge

## Slim ontwerp
Niet te royaal bundelen.
Wel royaal genoeg dat het grootste deel van normale gebruikers niet dagelijks tegen limieten aanloopt.

## Aanbevolen gedrag
- credits verversen maandelijks
- beperkt rollover toegestaan, bijvoorbeeld max 25%
- auto-recharge optioneel
- gebruiker kan maandlimiet / spend-cap instellen
- waarschuwingen bij 50%, 80%, 100%

## Auto-recharge voorbeeld
- als creditbalans onder drempel X komt
- koop automatisch pack Y
- tot maximaal maandlimiet Z

Dit voorkomt frustratie zonder open eindrisico.

## Add-on types
1. extra AI credits
2. extra lange audio packs
3. premium model packs
4. private routing add-on

---

## 9. Pricing-principe per taaksoort

Niet elke AI-actie hoeft hetzelfde te kosten.

### Lage kost / hoge frequentie
- cleanup
- korte samenvatting
- titelvoorstel
- caption seed

### Middel
- dagnarratief
- reflectie
- rewrite per kanaal
- outline

### Hoog
- lange audio transcriptie
- meeting synthese
- multi-output generation
- private routing
- top-tier modellen

Daarom moet je intern werken met:
- kostclassificatie per taak
- planpolicy per taak
- modelrouting per taak

---

## 10. Wat al in MVP vastgelegd moet worden

Dit moet je **nu al** doen, niet later.

Per AI-call moet vanaf MVP minimaal worden gelogd:
- `user_id`
- `workspace_id` of null
- `task_key`
- `runtime_family`
- `provider`
- `model`
- `model_snapshot` of concrete modelnaam
- `config_snapshot` of config hash
- `input_type`
- `input_tokens`
- `output_tokens`
- `cached_input_tokens` indien beschikbaar
- `audio_seconds`
- `request_id`
- `flow_id`
- `latency_ms`
- `success/failure`
- `error_code`
- `estimated_cost`
- `source_record_type`
- `source_record_id`
- `target_record_type`
- `target_record_id`
- `execution_mode` (`local`, `cloud`, `private_cloud`)
- `plan_at_time_of_call`
- `credits_charged`

Als local inferentie draait en provider-tokens niet bestaan, log dan:
- `local_compute_class`
- `audio_seconds`
- `chars_in/chars_out` of andere surrogate usage units
- geschatte interne kostformule

Belangrijk:
**billing moet niet afhankelijk zijn van losse providerformaten.**
Maak een eigen usage-truthlaag.

---

## 11. Aanbevolen datalaag voor usage en billing

### Nieuwe kernobjecten
1. `ai_usage_events`
   - 1 record per AI-call of AI-subcall

2. `ai_usage_monthly_rollups`
   - aggregaties per user / workspace / plan / maand

3. `billing_plans`
   - planregels, limieten, features, creditbundels

4. `user_plan_subscriptions`
   - actief abonnement per user/workspace

5. `credit_ledger`
   - alle toevoegingen, afboekingen, top-ups, correcties

6. `credit_topup_rules`
   - auto-recharge instellingen

7. `ai_provider_rate_cards`
   - interne kostprijsformules per model/provider/periode

### Waarom deze scheiding goed is
Omdat je dan later:
- kosten kunt analyseren
- prijsmodellen kunt wijzigen
- credits kunt herrekenen
- experimenten kunt doen zonder de usage truth te verliezen

---

## 12. Wat AIQS moet tonen als usage inzicht

AIQS moet later niet alleen kwaliteit tonen, maar ook:

### Per task
- aantal calls
- succesratio
- gemiddelde latency
- gemiddelde input/output tokens
- gemiddelde audio duur
- geschatte kost per run
- cost drift over tijd

### Per model
- totaal gebruik
- gemiddelde kost
- kwaliteit vs kost
- fallback gebruik

### Per plan
- gemiddelde cost-to-serve
- heavy-user patroon
- meest gebruikte functies
- risico op negatieve marge

### Per gebruiker / workspace
- usage trend per maand
- credits verbruikt
- credits gekocht
- top-up gedrag
- outlier detectie

### Per AI-task versie
- kwaliteitsscore
- kostverandering
- tokenverandering
- latencyverandering

Dat maakt AIQS uiteindelijk een combinatie van:
- prompt governance
- quality evals
- usage intelligence
- margin control

---

## 13. Future-state AIQS inzichten die commercieel echt tellen

AIQS moet straks vragen kunnen beantwoorden als:
- welke taak kost het meest?
- welke taak geeft de meeste waarde?
- welk model is te duur voor Free of Plus?
- welk model is de sweet spot voor Pro?
- welke gebruikers maken structureel verlies?
- welke plans moeten strakker begrensd?
- waar is local inferentie goed genoeg?
- waar moet premium cloudkwaliteit juist behouden blijven?

Dit is belangrijk:

**AIQS moet niet alleen betere output bewijzen, maar ook betere unit economics.**

---

## 14. Slimme modelrouting voor marge

Niet elk plan hoeft dezelfde modelkwaliteit te krijgen.

### Consumer
- cheaper-by-default waar veilig
- local first-pass waar mogelijk
- premium only when needed

### Pro
- hogere kwaliteit als default op contentkritische taken
- fallback naar goedkopere route op niet-zichtbare tussenstappen

### Private / Regulated
- routing volgens beleid, niet alleen kost
- privacy en residency kunnen zwaarder wegen dan marge per call

Dus per taak definieer je:
- primary model
- fallback model
- local eligibility
- privacy policy
- plan eligibility
- cost ceiling

---

## 15. Harde productkeuzes die ik zou maken

## Ja
- credits extern, tokens intern
- usage logging vanaf dag 1
- AIQS uitbreiden met usage- en cost-inzichten
- duidelijke opnamegrenzen per plan
- auto-recharge met caps
- consumer als instap, Pro als omzetkern
- private/privacy als premium laag

## Nee
- raw provider tokens direct als consumentenpricing
- onbeperkte Free tier
- full auto posting als kernbelofte
- alle users dezelfde modelstack geven
- privacy pas later serieus nemen
- billing pas bouwen als er al veel gebruik is

---

## 16. Aanbevolen 12-maandenvolgorde

### Fase 1 — Nu / MVP hardening
- usage logging per call toevoegen
- model/config snapshot loggen
- input/output tokens loggen
- audio duur loggen
- geschatte kost berekenen
- eerste AIQS usage tab intern bouwen

### Fase 2 — Consumer launch
- Free + Plus structureren
- basis credit- en limietmodel
- opnamegrenzen actief afdwingen
- zichtbare maar simpele usage indicatie voor gebruiker

### Fase 3 — Brug naar Pro
- eerste content transform acties
- review queue light
- Pro-plan met hogere limieten en betere outputs

### Fase 4 — Margin control
- top-ups
- auto-recharge
- cost-to-serve dashboards in AIQS
- plan tuning op basis van echte usage

### Fase 5 — Private / Regulated
- workspace policies
- EU/private routing
- langere meeting capture
- audit / admin / seat model

---

## 17. Eindconclusie

De juiste toekomst voor Budio is waarschijnlijk:

### Frontstage
- **Budio Vandaag** voor consumer capture en reflectie
- **Budio Pro** voor capture-to-content en output workflows
- **Budio Private / Business** voor privacy-intensieve en gereguleerde contexten

### Backstage
- **AIQS als intelligence control plane**
- **usage + billing truthlaag vanaf MVP**
- **credits extern, tokens intern**
- **kwaliteit én marge sturen vanuit dezelfde governance-laag**

De grootste strategische winst zit niet in “meer AI”.
Die zit in:
- betere routing
- betere governance
- betere review
- beter kosteninzicht
- en een productlijn die logisch oploopt van consumer naar Pro naar private.

