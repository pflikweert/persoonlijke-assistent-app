# Reflectie-lengte en vertelstijl voor periodereflecties

## Status

candidate

## Type

ai-aiqs

## Horizon

next

## Korte samenvatting

Voeg een reflectie-diepte/vertelstijl-instelling toe voor week- en maandreflecties, zodat gebruikers kunnen kiezen tussen `compact`, `normal`, `rich` en `book`. De instelling stuurt vooral `narrativeText`, met beperkte invloed op `summaryText`, `highlights` en `reflectionPoints`.

## Probleem

Week- en maandreflecties hebben nu effectief een vaste vertelomvang. Dat past niet altijd bij de behoefte van de gebruiker:

- soms wil iemand snel hoofdlijnen lezen
- soms wil iemand juist herinneringswaarde en concrete details
- maandreflecties kunnen inhoudelijk rijk genoeg zijn voor een hoofdstukachtig verhaal
- AIQS-validatie/debugging moet zichtbaar maken met welke stijl een test is gedraaid

Zonder expliciete instelling wordt reflectielengte impliciet promptgedrag, waardoor gebruikers weinig controle hebben en validatie minder reproduceerbaar is.

## Waarom interessant

- Verhoogt persoonlijke waarde van Budio-reflecties zonder een nieuwe AI-flow te introduceren.
- Maakt week/maand output beter afstembaar op moment, energie en gebruikscontext.
- Past bij AIQS: runtime-input, promptcontext en validatie worden explicieter en testbaarder.
- Houdt bestaande gebruikers veilig via default `normal`.

## Gewenst gedrag

### 1. Reflection depth/type

Introduceer een enum/type voor reflection depth/style:

- `compact`
- `normal`
- `rich`
- `book`

Default is `normal`. Bestaande gebruikers/data mogen niet breken.

### 2. Runtime input/context

Voeg de gekozen instelling toe aan de runtime input/context van week- en maandreflecties.

- Week en maand mogen dezelfde instelling gebruiken.
- Laat ruimte om later aparte defaults per periode te ondersteunen.
- Zonder expliciete keuze gebruikt de runtime `normal`.

### 3. UI bij genereren/hergenereren

Maak de instelling beschikbaar in de UI bij het genereren of hergenereren van week- en maandreflecties.

Labels:

- Compact
- Normaal
- Rijk
- Boek

Helpertekst:

- Compact: korte terugblik met hoofdlijnen
- Normaal: gebalanceerd verhaal met belangrijke details
- Rijk: uitgebreid verhaal met meer herinneringswaarde
- Boek: lang hoofdstukachtig verhaal met veel context en scènes

### 4. AI-runtime

De gekozen instelling wordt meegestuurd naar de AI-call en expliciet verwerkt in de promptopbouw.

### 5. Gedragsregels per stijl

#### Compact

- Schrijf korter.
- Focus op hoofdlijnen en enkele bepalende momenten.
- Weekverhaal: ongeveer 3-5 alinea's.
- Maandverhaal: ongeveer 4-7 alinea's.
- Minder details, maar geen belangrijke verhaallijn volledig laten verdwijnen.

#### Normaal

- Huidige standaardgedrag.
- Weekverhaal: ongeveer 5-10 alinea's.
- Maandverhaal: ongeveer 6-12 alinea's.
- Balans tussen leesbaarheid, herinneringswaarde en brondekking.

#### Rijk

- Meer diepgang en meer concrete herinneringsdetails.
- Geef belangrijke gebeurtenissen meer ruimte.
- Weekverhaal: ongeveer 8-14 alinea's.
- Maandverhaal: ongeveer 10-18 alinea's.
- Gebruik meer voorbeelden uit gesprekken, lichamelijke ervaringen, kleine momenten en terugkerende ontwikkelingen.

#### Boek

- Schrijf als een persoonlijk hoofdstuk uit een levensverhaal.
- Veel ruimte voor samenhang, scènes, nuance en herinneringswaarde.
- Weekverhaal: mag lang zijn wanneer de bron rijk genoeg is.
- Maandverhaal: mag meerdere langere alinea's bevatten en duidelijke hoofdstukachtige diepgang krijgen.
- Niet literair overdrijven; nog steeds rustig, menselijk en volledig brongebonden.
- Geen verzonnen scènes, geen extra interpretaties.

### 6. AIQS-validatie/debugging

De gekozen instelling is zichtbaar bij validatie/debugging van AI Quality Studio, zodat duidelijk is met welke stijl een test is gedraaid.

## Relatie met huidige docs

- Bouwt voort op `docs/project/ai-quality-studio.md`: runtimegedrag moet contract-first, brongebonden en testbaar blijven.
- Raakt periodereflecties uit de bestaande consumerflow, maar begint als expliciete AIQS/runtime-extensie.
- Sluit aan op eerdere week/maand-validatiecases uit day journals: testcases moeten dezelfde reflection depth kunnen tonen/gebruiken als runtime.

## Mogelijke impact

- ui
- services
- supabase
- aiqs
- types
- tests
- docs

## Waarschijnlijke implementatie-impact

- Type toevoegen voor `ReflectionDepth` of vergelijkbaar.
- API payload van `generate-reflection` uitbreiden met optionele depth/style.
- Runtime context voor `week_narrative` en `month_narrative` uitbreiden.
- Promptopbouw aanpassen zodat stijlregels expliciet in instructies komen.
- UI-state toevoegen bij week/maand genereren/hergenereren.
- AIQS test/validate/debug input snapshot tonen of gebruiken met gekozen stijl.
- Waar nodig databasevelden toevoegen om gekozen stijl bij reflectie-output vast te leggen.
- Migraties backwards compatible houden; bestaande reflecties hoeven niet verplicht opnieuw gegenereerd te worden.

## Open vragen

- Moet de gekozen stijl per reflectie worden opgeslagen, per gebruiker als voorkeur, of beide?
- Is de instelling alleen zichtbaar bij handmatige hergeneratie, of ook op automatische periodereflectie-refresh na capture?
- Moet `book` beschikbaar zijn voor iedereen of later achter een premium/advanced toggle?
- Hoe voorkomen we dat `book` onnodig hoge kosten veroorzaakt bij magere brondata?
- Moet AIQS validate standaard `normal` gebruiken of de laatst gebruikte/productie-default stijl tonen?

## Volgende stap

Promoveer dit idee naar een spec-ready P1/P2 bouwtask zodra besloten is:

- opslagmodel: per reflectie, per gebruiker, of beide
- eerste UI-locatie: periodereflectiepagina, regenerate-control, settings, of combinatie
- AIQS-validatiegedrag: test-run style-selector of input snapshot only

## Promotiecriteria

- Wordt een epic als reflection style ook persoonlijke voorkeuren, premium/usage policy of meerdere outputvarianten omvat.
- Wordt een task als scope beperkt blijft tot week/maandreflecties met default `normal`, runtime payload, UI-selector, promptinstructies en AIQS-validatiezichtbaarheid.
- Eerst uitzoeken: minimale databasekeuze en waar de UI-selector precies hoort binnen bestaande reflectieflows.

## Spec-readiness bij promotie

- User outcome: gebruiker kiest bij week- en maandreflecties hoe compact of rijk het verhaal wordt.
- Happy flow: gebruiker kiest stijl, genereert/hergenereert reflectie, AI-call ontvangt stijl, output volgt stijl.
- Non-happy flow: geen keuze of oude client gebruikt default `normal`.
- UX/copy: labels Compact, Normaal, Rijk, Boek met korte helpertekst.
- Data/IO: optionele stijl in request/context en waar nodig opslag bij reflectie.
- AIQS: test/validate/debug toont of gebruikt gekozen stijl.

## Acceptatiecriteria voor toekomstige task

- Ik kan bij weekreflectie en maandreflectie kiezen tussen Compact, Normaal, Rijk en Boek.
- De keuze wordt meegenomen in de AI-call.
- Zonder keuze gebruikt het systeem `normal`.
- De prompt krijgt duidelijke instructies passend bij de gekozen stijl.
- Bestaande reflectiegeneratie blijft werken.
- Validatie/testpagina toont of gebruikt de gekozen stijl.
- Typecheck, lint en relevante tests slagen.
