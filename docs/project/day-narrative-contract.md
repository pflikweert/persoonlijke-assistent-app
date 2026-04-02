# Day Narrative Contract

## Doel
Dit document fixeert het gedragscontract voor drie outputlagen in de dagverhaal-pipeline:
- `entries_normalized.body`
- `day_journals.narrative_text`
- `day_journals.summary`

Doel:
- opschonen zonder reductie
- verhalend herschrijven zonder betekenisverlies
- compact samenvatten zonder de rol van de narrative over te nemen

## Probleemdefinitie
De semantische scheiding tussen normaliseren, verhalend uitschrijven en samenvatten moet hard zijn.

Ongewenst gedrag:
- `entries_normalized.body` zakt richting samenvatting
- `day_journals.narrative_text` leest als samenvatting in plaats van als dagtekst
- `day_journals.summary` neemt te veel verhalende ruimte in
- lange bronpassages worden te sterk gecomprimeerd
- losse momenten worden met verzonnen brugzinnen aan elkaar geplakt

## Leidende productregels
- De app is eerst een dagboekmachine.
- De day journal is de canonieke daglaag en hoofdwaarheid.
- De engine structureert en verwoordt, maar interpreteert niet.
- Day output moet natuurlijk, rustig, verhalend en dicht bij de bron zijn.
- Geen psychologische duiding, therapietaal, coachtaal of nieuwe informatie.

## Contract Per Outputlaag

### `entries_normalized.body`
Doel:
- volledige opgeschoonde entry-inhoud bewaren

Moet behouden:
- alle betekenisvolle broninhoud
- concrete gebeurtenissen, observaties, uitspraken en emoties

Mag opschonen:
- spraakruis
- stotteren
- kleine grammaticale oneffenheden
- duidelijke dubbele herhaling zonder extra betekenis

Mag niet:
- samenvatten
- merkbaar reduceren
- generiek parafraseren
- betekenis toevoegen

Toon en structuur:
- rustig Nederlands
- doorlopende entrytekst
- bronnabij

Compressiegraad:
- minimaal

Relatie tot bronwaarheid:
- dichtste bruikbare tekstlaag boven de bron

### `day_journals.narrative_text`
Doel:
- canonieke dagtekst vormen als volledige verhalende herschrijving van alle betekenisvolle dagmomenten

Moet behouden:
- alle betekenisvolle dagmomenten
- concrete details die momenten herkenbaar houden
- expliciet genoemde emoties
- bronvolgorde op basis van entry-volgorde en `captured_at`
- letterlijke formuleringen waar dat brongetrouwheid helpt

Mag opschonen:
- ruis
- duidelijke dubbele herhaling
- alinea-indeling bij duidelijke moment- of onderwerpwissels

Mag niet:
- lezen als samenvatting
- lezen als verslaggeverstekst of derdepersoonstekst
- betekenisvolle momenten weglaten
- lange bronpassages plat slaan tot generieke parafrase
- nieuwe informatie, lessen, motieven of inzichten toevoegen
- verzonnen brugzinnen of tijd-/oorzaaksovergangen toevoegen
- psychologische duiding, therapietaal of coachtaal gebruiken

Gewenste toon:
- ik-vorm
- natuurlijk, rustig, verhalend Nederlands
- dicht bij terugleesbaar dagboekmateriaal

Gewenste structuur:
- doorlopende dagtekst
- alinea’s toegestaan en gewenst bij duidelijke wissels

Compressiegraad:
- laag

Relatie tot bronwaarheid:
- iedere inhoudelijke claim moet herleidbaar zijn naar bronentries

### `day_journals.summary`
Doel:
- korte compacte dagsamenvatting bieden voor snelle oriëntatie

Moet behouden:
- hoofdlijn van de dag
- enkele concrete ankers

Mag opschonen:
- sterke compressie
- samenvoegen van verwante momenten

Mag niet:
- de rol van `narrative_text` overnemen
- nieuwe interpretaties of patronen toevoegen
- generieke AI-samenvattingstaal of meta-zinnen gebruiken

Gewenste toon:
- feitelijk
- rustig
- compact

Gewenste structuur:
- korte dagschets van 1-2 zinnen

Compressiegraad:
- hoogst van de drie lagen

Relatie tot bronwaarheid:
- alleen reductie, geen nieuwe inhoud

## Verschillen Tussen De Lagen
- `entries_normalized.body` = volledige opgeschoonde inhoud van één entry, niet samenvattend
- `day_journals.narrative_text` = volledige verhalende herschrijving van alle betekenisvolle dagmomenten, in ik-vorm en bronvolgorde
- `day_journals.summary` = korte compacte dagsamenvatting

Contractbreuk:
- informatie in `summary` die niet herleidbaar is naar bron of narrative
- betekenisvolle bronmomenten die in `narrative_text` ontbreken zonder dat het ruis of dubbeling was
- `narrative_text` die functioneel een langere `summary` is

## Acceptatiecriteria
- `entries_normalized.body` behoudt alle betekenisvolle broninhoud
- lange entries worden niet merkbaar samengevat
- `narrative_text` staat in ik-vorm waar de bron ook in ik-vorm spreekt
- `narrative_text` bevat alle betekenisvolle dagmomenten van de dag
- `narrative_text` voelt verhalend en terugleesbaar, niet als AI-samenvatting
- `narrative_text` voelt niet als verslaggeverstekst of derdepersoonstekst
- `narrative_text` mag alinea’s gebruiken bij duidelijke momentwissels
- `narrative_text` bevat geen verzonnen brugzinnen, oorzaken of inzichten
- `narrative_text` bevat geen psychologische duiding, therapietaal of coachtaal
- `summary` is duidelijk korter en compacter dan `narrative_text`
- `summary` blijft concreet en feitelijk
- `summary` en `narrative_text` zijn niet identiek of bijna-identiek in functie
- geen meta-zinnen over notities, aantallen of patronen

## Voorbeelden Goed/Fout

### Slechte `day_journals.narrative_text`
“De dag begon gespannen maar ontwikkelde zich gaandeweg tot een dag met beweging, werk en verbinding. Er waren stressvolle momenten, waarna steun en zelfzorg hielpen om de spanning te reguleren.”

Waarom fout:
- geen ik-vorm
- samenvattingstoon
- generieke AI-taal
- therapeutische formulering
- concrete bronmomenten ontbreken

### Goede `day_journals.narrative_text`
“Ik was vanmorgen al vroeg wakker omdat ik tegen het overleg opzag. Toch ben ik gaan hardlopen, en dat hielp even.

Op kantoor liep het overleg uit. Daarna kreeg ik mijn aandacht er niet goed meer bij. Aan het eind van de middag belde ik mijn zus. Dat luchtte op. ’s Avonds was ik moe en heb ik vroeg gegeten.”

Waarom goed:
- ik-vorm
- alle betekenisvolle momenten blijven aanwezig
- natuurlijk en rustig
- verhalend zonder extra interpretatie
- alinea op duidelijke momentwisseling

### Goede `day_journals.summary`
“Ik begon de dag onrustig door een overleg en bleef daar op werk last van houden. Een telefoontje met mijn zus luchtte op, en ’s avonds hield ik het vroeg rustig.”

### Transformaties die wel mogen
- “eh ik was echt echt moe” → “Ik was echt moe.”
- “ik zat in de auto, eh, en daarna op kantoor” → “Ik zat in de auto en was daarna op kantoor.”
- bijna identieke bronzinnen samenvoegen tot één heldere zin
- alinea toevoegen bij duidelijke overgang

### Reducties die niet mogen
- “Ik moest drie keer dezelfde uitleg geven in dat overleg” → “Het overleg was vermoeiend.”
- “Ik voelde me gejaagd en chagrijnig” → “Ik was wat gespannen.”
- vijf concrete dagmomenten reduceren tot twee algemene zinnen
- opluchting, lessen of inzichten toevoegen die niet in de bron stonden

## Verwachte Impact Op Implementatie
- prompts en guardrails voor normalisatie en day composition moeten deze scheiding afdwingen
- day journal fallback moet narrative en summary duidelijk verschillend houden
- verify moet checks toevoegen op ik-vorm, inhoudsbehoud, anti-samenvattingstoon en afwezigheid van verzonnen brugzinnen

Waarschijnlijk geraakte implementatieplekken:
- `supabase/functions/process-entry/index.ts`
- `supabase/functions/regenerate-day-journal/index.ts`
- `supabase/functions/renormalize-entry/index.ts`
- `scripts/verify-local-output-quality.sh`

## Risico’s / Buiten Scope
Risico’s:
- te agressieve deduplicatie veroorzaakt inhoudsverlies
- vloeiender maken introduceert ongemerkt nieuwe tijd- of oorzaakrelaties
- verify blijft te zwak als die alleen overlap en generiekheid controleert

Buiten scope:
- geen UI-wijzigingen
- geen migrations
- geen nieuwe tabellen of velden
- geen nieuwe AI-flow
- geen stijlclone of persoonlijke schrijfstijl-engine
