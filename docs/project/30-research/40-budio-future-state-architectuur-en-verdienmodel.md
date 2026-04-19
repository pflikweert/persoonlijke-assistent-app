# Budio future-state architectuur + verdienmodel

## Samenvatting

Jullie staan nu op een sterke **capture-first basis** met een al serieuze admin AI-governance-laag, maar nog niet op de echte commerciële Pro-machine.

De huidige productwaarheid is bewust smal:
- snelle capture
- dagboeklaag
- reflecties
- geen brede assistent of chat

AIQS is nu admin-only, task-first, contract-first en vooral gericht op baseline import, draften, testen en compare, nog niet op volledige live runtime-orkestratie.

De juiste toekomstlijn is:

- **Vandaag** als rustige capture-ingang
- **Pro** als omzetmachine voor content-conversie
- **Private / Regulated** als premium privacy- en governance-laag
- **AIQS** als control plane voor kwaliteit, routing, usage en marge

---

## Waar staan we nu

Productmatig staan jullie nog niet op **Budio als content operating system**, maar op een sterke **capture-first dagboekmachine met een opvallend volwassen AI-backoffice**.

De kernlus staat:
- auth
- tekst/audio capture
- server-side verwerking
- daglaag
- week- en maandreflecties

Maar commercieel is de brug nog te zwak zichtbaar.

Mijn rauwe conclusie:

**Het product is nu sterker gebouwd dan verkocht.**

De basis is goed.
De commerciële brug is nog niet scherp genoeg in het product.

---

## Future-state architectuur in 3 lagen

# 1. Consumer — Budio Vandaag

Dit blijft de rustige capture-ingang.

Doel:
- laagdrempelig gebruik
- routine opbouwen
- capture-gedrag valideren
- laten voelen waarom het product waarde heeft

### Rol van deze laag
- tekst en audio snel vastleggen
- daglaag teruglezen
- week- en maandreflecties
- basis archief
- eenvoudige export
- beperkte AI-hulp

### Abonnementen in deze laag
#### Free
- basis capture
- beperkte reflectie
- max **3 minuten audio per opname**
- beperkte maandelijkse credits
- beperkte AI-acties
- geen zware hergebruik-workflows

#### Plus
- uitgebreidere capture
- meer archiefwaarde
- langere audio, bijvoorbeeld **5 minuten**
- meer credits
- betere export / terugblik
- iets meer AI-transforms

### Doel van Free
Free moet bruikbaar zijn, maar niet zo ruim dat zware gebruikers gratis blijven.

De functie van Free is:
- product leren kennen
- routine bouwen
- waarde bewijzen
- upsell logisch maken

---

# 2. Pro — Budio Pro

Hier zit de eerste echte omzetkern.

Dit is niet simpelweg “meer dagboek”.
Dit is:

**van ruwe input naar werkbare output**

Voor:
- solo experts
- podcasters
- coaches
- consultants
- trainers
- ervaringsdeskundigen
- knowledge creators

### Wat deze laag moet kunnen
- postvoorstellen
- captions
- LinkedIn-versies
- podcast-notes
- scripts / outlines
- format-vertalingen
- tone presets
- review queue
- export / publish-prep

### Audio-idee
- max **10 minuten audio per opname** als logische Pro-limiet

### Waarom dit de omzetlaag is
Hier gaat het niet alleen om opslaan of reflecteren.
Hier gaat het om:
- tijdsbesparing
- mentale frictie verlagen
- sneller publiceren
- eigen stem behouden
- van ruwe capture naar bruikbare output

### Harde commerciële waarheid
De pure consumenten-journalingversie gaat waarschijnlijk niet efficiënt veel geld opleveren.

De eerste echte geldmachine zit in:
**capture + hergebruik + content-conversie**

---

# 3. Private / Regulated

Dit is de premium laag voor:
- privacy
- governance
- langere werksessies
- workspacebeleid
- audit trails
- private modelrouting

### Voor wie
- business users
- kleine teams
- privacygevoelige professionals
- organisaties met strengere eisen
- later mogelijk regulated use cases

### Wat deze laag moet kunnen
- lange meeting-opnames
- transcriptie van sessies
- volledige review- en audit-trace
- workspace controls
- model policies
- EU/private routing
- strengere logging en lineage
- later eventueel self-hosted / private deployment

### Audio-idee
- **60 minuten of langer** per opname / meeting

### Belangrijke positie
Dit is niet de eerste wedge.
Maar dit is wel de laag met de hoogste potentiële ARPU zodra privacy en governance echt productwaarde worden.

---

## Verdienmodel

De juiste commerciële vorm is:

- abonnement per tier
- inbegrepen maandelijkse credits
- extra credits los bijkopen
- optioneel auto-recharge / auto-aanvullen
- limieten per plan op functionaliteit én gebruik

### Belangrijk principe
Naar buiten toe moet je **geen ruwe provider-tokens** verkopen.

Gebruik extern liever:
- credits
- AI-verbruik
- maandelijkse bundel
- extra top-up

Gebruik intern wél:
- input tokens
- output tokens
- cached tokens waar relevant
- audio seconden
- model/provider
- cost per call

### Waarom dit slim is
Zo kun je:
- modellen wisselen zonder je pricing kapot te maken
- planlimieten slim sturen
- top-ups en auto-recharge logisch aanbieden
- echte marge per taak en per gebruiker meten

---

## Voorbeeld abonnementslijn

## Free
- basis capture
- daglaag
- beperkte reflectie
- max 3 minuten audio
- kleine maandelijkse creditbundel
- beperkte AI-transforms
- geen zware export of Pro-workflows

## Plus
- uitgebreidere capture
- betere terugblik
- langere audio, bijvoorbeeld 5 minuten
- meer credits
- betere export
- iets ruimere AI-verwerking

## Pro
- 10 minuten audio
- content transforms
- review queue
- meer credits
- presets / formats
- hogere usage caps
- top-ups en auto-recharge

## Private / Business
- 60+ minuten meeting capture
- workspace governance
- privacy routing
- grotere bundels of pooled credits
- audit / logging / lineage
- later private of regional deployment-opties

---

## Wat je in de MVP nu al moet loggen

Dit moet je **nu al** vastleggen per AI-call.

Niet later.

### Minimale usage truth per call
- user_id
- workspace_id of account scope
- task_key
- runtime_family
- provider
- model
- model snapshot of versie
- config snapshot of config hash
- input tokens
- output tokens
- cached tokens waar beschikbaar
- audio duration
- requestId
- flowId
- success / failure
- latency
- estimated cost
- charged credits
- abonnement / plan op moment van call
- source record
- target record

### Waarom dit nu belangrijk is
Omdat je dan later niet hoeft te gokken:
- wat kost een gebruiker echt?
- welke feature trekt de meeste marge weg?
- welk plan is te ruim?
- welke taak is te duur?
- waar moet je caps zetten?
- waar is een goedkoper model goed genoeg?

---

## Hoe dit terug moet komen in AIQS

AIQS mag niet blijven hangen op alleen promptbeheer.

Het moet uitgroeien tot:

- quality governance
- model routing
- privacy routing
- usage analytics
- margin control
- rollout control

### AIQS moet straks ook kunnen tonen
- usage per task
- usage per model
- usage per gebruiker / workspace
- cost per task family
- cost per provider
- gemiddelde tokens per call
- gemiddelde audio-lengte per task
- success/failure ratio
- latency per model
- quality vs cost vergelijking
- welke promptversie duurder werd zonder kwaliteitswinst
- welke modellen te duur zijn voor Free of Plus
- welke taken negatieve marge trekken

### Belangrijke verschuiving
Niet alleen:
“welke prompt is beter?”

Maar ook:
- welke taak is winstgevend?
- waar kan een goedkoper model?
- waar is local inferentie goed genoeg?
- welke users of workspaces trekken de marge scheef?
- waar moeten caps of top-ups strakker?

---

## Grootste gemiste kans nu

De grootste gemiste kans is niet méér AI.

De grootste gemiste kans is:
- geen echte usage truthlaag
- nog geen scherpe brug van capture naar betaalde output-workflows
- nog geen duidelijke review queue als productfeature
- nog geen memory/tone/productie-laag voor creators
- nog geen premium privacy-tier als onderscheidend aanbod

Dus:
**jullie missen vooral de commerciële workflow bovenop de AI.**

---

## De rol van AIQS in de toekomst

Vandaag is AIQS vooral:
- admin-only
- task-first
- contract-first
- evidence-first
- test en compare

In de toekomst moet AIQS worden:

## De intelligence control plane van Budio

Niet zichtbaar voor de eindgebruiker, maar wel de plek waar je beheert:
- welke AI-taken bestaan
- welke modellen per taak mogen draaien
- welke privacy-regels per taak gelden
- welke outputstructuren en contracts gelden
- welke usage wordt gelogd
- welke kosten en marges ontstaan
- welke taskversies live mogen
- welke provider of local model gebruikt wordt
- welke evaluaties en regressiesets bepalen of een wijziging echt beter is

Kort gezegd:

**de frontstage is Budio, de backstage moat is AIQS**

---

## Harde eindconclusie

De juiste lijn voor Budio is:

- **Budio Vandaag** als rustige capture-ingang
- **Budio Pro** als omzetmachine voor solo experts en creators
- **Private / Regulated** als premium privacy- en governance-laag
- **AIQS** als control plane voor kwaliteit én marge

### Het echte businessmodel
Niet:
- een brede journaling-app
- een losse AI-social-tool
- full autonomous posting

Wel:
- capture-first
- review-first
- credits per abonnement
- extra credits/top-ups
- usage truth
- slimme modelrouting
- privacy als premium differentiator
- content-conversie als echte omzetlaag

### Samenvatting in één zin
**Budio verdient straks niet vooral aan journaling, maar aan het betrouwbaar en privacy-bewust omzetten van ruwe capture naar bruikbare output, met AIQS als machinekamer voor kwaliteit, routing en marge.**
