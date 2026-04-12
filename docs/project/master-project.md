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
