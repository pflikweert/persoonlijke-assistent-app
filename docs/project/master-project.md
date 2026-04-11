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
- retrieval/Q&A over archief
- verdere intelligentie-lagen
- uitgebreidere assistentfunctionaliteit

Deze vallen expliciet buiten de huidige fase.
