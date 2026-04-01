# Persoonlijke Assistent App — Fase 1.3 MVP Design Beschrijving

## Doel
Fase 1.3 is de **design-doorvoerfase** van de bestaande MVP.

Deze fase is **geen nieuwe productfase** en **geen feature-uitbreiding**.  
We veranderen niet wat de app is.  
We zorgen dat de bestaande MVP eruitziet, aanvoelt en werkt als een onderscheidend product.

De kern blijft:
- snel vastleggen
- nette dagboekdagen
- rustige week- en maandreflecties
- exporteerbare persoonlijke context

## Waarom Fase 1.3 nodig is
De huidige productrichting is sterk, maar zonder een strakke designlaag blijft het risico:
- te generiek
- te technisch
- te kaal
- of juist te druk en te “AI-achtig”

De designlaag moet de app laten voelen als:
**premium, rustig, intuïtief, modern en tastbaar**

Niet als:
- chatbot toy
- wellness-app
- productivity dashboard
- experimentele AI demo

## Strategische designrichting
We nemen de visuele discipline, rust en duidelijke hiërarchie van Budio mee, maar vertalen die naar een persoonlijker en zachter product.

### Wat we overnemen uit Budio
- premium minimalistische basis
- warme lichte achtergrond
- duidelijke kaartstructuur
- afgeronde hoeken
- sterke hiërarchie per blok
- één accentkleur met functioneel gebruik
- rustige iconografie
- nette bottom navigation
- content eerst, decoratie tweede

### Wat we aanpassen voor deze app
De Persoonlijke Assistent App is geen finance cockpit.  
Dus:
- minder dashboardgevoel
- minder “status kaarten”
- meer leeservaring
- meer rust rondom tekst
- minder gekleurde statusbalken
- minder harde informatiedichtheid

## Kernprincipe
**Capture voelt actief en slim. Lezen voelt rustig en persoonlijk.**

Dat is de hele designstrategie.

Dus:
- bij invoer mag het levend voelen
- bij output moet het stil, leesbaar en warm voelen

## Productmatige ontwerpkaders
De bestaande productbasis blijft leidend:
- Home / Vandaag
- Vastleggen
- Dagboekdag
- Reflecties
- Archief / Dagen

Dat volgt de bestaande release-1 schermen en scope.

## Designprincipes voor Fase 1.3

### 1. Rust boven feature-energie
De app wint niet door veel te tonen.  
De app wint door precies genoeg te tonen.

Regels:
- weinig gelijktijdige kaarten
- weinig visuele ruis
- veel witruimte
- duidelijke blokscheiding
- geen overbodige iconen

### 2. Eén hoofdactie per scherm
Elk kernscherm heeft één dominante actie.

Voorbeelden:
- Vandaag → **Spreek iets in**
- Vastleggen → **Opnemen** of **Opslaan**
- Dagboekdag → **Lezen**
- Reflectie → **Openen** of **Genereren**

### 3. Typografie is product
De kernoutput is tekst.
Dus typografie is geen stylingdetail, maar productkwaliteit.

Regels:
- rustige grote koppen
- sterke body readability
- voldoende line-height
- duidelijke alineascheiding
- geen te smalle tekstkolommen
- geen te kleine secondary labels

### 4. Motion heeft functie
Motion moet niet decoreren, maar begeleiden.

Gebruik motion voor:
- opname actief maken
- verwerking zichtbaar maken
- nieuwe inhoud rustig laten verschijnen
- expand/collapse van details
- state changes bevestigen

Niet voor:
- continue animatiedrukte
- zwevende gimmicks
- sci-fi AI effecten

### 5. Content eerst
De UI moet de inhoud dragen, niet overschreeuwen.

Dat betekent:
- verhalende dagtekst centraal
- reflecties helder gegroepeerd
- ruwe entries secundair
- instellingen sober
- export en vertrouwen duidelijk zichtbaar

## Visuele basis

## Kleurstrategie
We sluiten aan op Budio: warm licht + donker contrast + één duidelijke accentkleur.

### Basispalet
- Achtergrond hoofd: warm off-white
- Secundaire achtergrond: zacht zand / licht beige
- Surface cards: bijna wit
- Primair tekst: diep antraciet
- Secundair tekst: gedempt grijs
- Border/shadow: zeer zacht neutraal

### Accentkleur
Gebruik dezelfde familie als Budio:
**warm goudgeel**

Rol van het geel:
- primaire focus
- CTA-accent
- actieve staat
- subtiele progress / opname-highlight
- niet overal gebruiken

### Ondersteunende kleuren
Beperkt en functioneel:
- zacht groen voor positief / gereed
- zacht blauw voor informatieve status
- zacht rood alleen voor fouten / destructieve acties

### Vermijden
- fel paars
- hard AI-cyaan
- wellness mint overload
- grote multicolor dashboards
- zware gradients als basisstijl

## Componentstijl

### Cards
Cards blijven een belangrijk patroon, net als in Budio, maar rustiger toegepast.

Regels:
- grote radius
- zachte schaduw
- duidelijke padding
- max 1 hoofdfocus per card
- geen overvolle cards
- liever 1 sterke card dan 3 middelmatige

### Buttons
- afgerond
- compact maar duidelijk
- primaire buttons met accentkleur
- secundaire buttons rustig neutraal
- geen drukke outlines tenzij functioneel

### Icons
- eenvoudige, afgeronde iconstijl
- klein en ondersteunend
- nooit de hoofdrol
- liefst één iconfamilie door de hele app

### Inputs
Input moet premium en simpel voelen:
- veel ruimte
- helder focus-state
- geen drukke form fields
- tekstinvoer en voice capture visueel in dezelfde familie

## Layoutstrategie per scherm

## 1. Vandaag
Doel:
- direct landen
- direct vastleggen
- continuïteit voelen

Opbouw:
1. rustige header
2. hero capture block
3. status van vandaag
4. laatste dagboekdag of laatste reflectie
5. recente dagen

Belangrijk:
Vandaag mag niet als dashboard voelen.  
Het is je startpunt, niet je controlecentrum.

## 2. Vastleggen
Dit scherm moet de “wow” geven.

Doel:
- directe actie
- lage drempel
- voelbare intelligentie

Opbouw:
- centrale opnameknop of tekstinvoer
- subtiele live feedback
- statusregel
- bevestiging na submit

Belangrijk:
Hier mag de app het meest levend voelen.

### Capture micro-interacties
- knop groeit of morpht subtiel bij opname
- zachte ring / glow
- mini waveform of level activiteit
- verwerking met rustige progress-state
- resultaat niet abrupt, maar vloeiend

## 3. Dagboekdag
Doel:
- lezen
- eigenaarschap
- rust

Opbouw:
1. datum
2. korte dagsamenvatting
3. verhalende dagtekst
4. onderliggende entries als secundaire sectie
5. optionele regenerate actie klein en ondergeschikt

Belangrijk:
Dit scherm mag nooit aanvoelen als een AI-console.

## 4. Reflecties
Doel:
- overzicht
- patroonherkenning
- bruikbaarheid

Opbouw per reflectie:
- kernsamenvatting
- belangrijkste momenten
- terugkerende patronen
- korte reflectiepunten

Belangrijk:
Niet te therapeutisch.  
Niet te zwaar.  
Niet te veel uitleg.

## 5. Dagen / Archief
Doel:
- terugvinden
- teruglezen
- rust

Opbouw:
- lijstweergave met sterke datumhiërarchie
- korte snippets
- filter op week / maand
- geen complexe search-first ervaring in MVP

## Motionstrategie
De motionrichting moet aanvoelen als:
**subtiel premium native behavior**

Doel:
- tastbaarheid
- kwaliteit
- intelligentie
- flow

Snelheidsrichting:
- microfeedback: snel
- transities: rustig maar niet traag
- loading: zichtbaar maar ontspannen

## Tone of UI
De app copy moet zijn:
- helder
- rustig
- volwassen
- niet zweverig
- niet coacherig
- niet marketingachtig

Goede voorbeelden:
- Spreek iets in
- Schrijf iets op
- Vandaag bijgewerkt
- Bezig met verwerken
- Reflectie genereren
- Dagboekdag bijgewerkt

Niet doen:
- Hoe voel je je vandaag?
- Je AI companion staat klaar
- Krijg diepgaande inzichten
- Begin jouw reis

## MVP-afbakening voor design
Fase 1.3 doet alleen design-doorvoer op bestaande scope.

### In scope
- design tokens / thema
- typografie schaal
- spacing systeem
- card systeem
- button systeem
- input systeem
- icon keuze
- capture motion
- schermlayout voor bestaande MVP schermen
- empty / loading / error states
- bottom nav styling
- visuele polish van bestaande flows

### Buiten scope
- nieuwe features
- nieuwe navigatiestructuur buiten MVP
- open chatlaag als nieuw product
- uitgebreide dashboards
- redesign van productscope
- marketing website
- desktop ervaring
- post-MVP search / retrieval UX

## Scherpe ontwerpbeslissing
De app moet visueel tussen twee werelden in zitten:

### Wereld 1 — Budio discipline
- helder
- premium
- functioneel
- rustig opgebouwd

### Wereld 2 — persoonlijke context
- warmer
- zachter
- leesbaarder
- minder numeriek
- meer verhalend

Dat is exact de combinatie die onderscheidend kan worden.

## Wat het Steve Jobs-level onderscheid hier echt wordt
Niet “meer design”.
Niet “meer AI”.
Niet “meer effecten”.

Maar:
- extreme eenvoud
- voelbare kwaliteit
- mooie details op de juiste plek
- een opname-ervaring die direct slim voelt
- een leeservaring die voelt alsof het echt jouw dagboek is
- overal dezelfde discipline

## Exit-criteria Fase 1.3
Fase 1.3 is geslaagd als:
- de app visueel als één product aanvoelt
- capture direct en premium voelt
- dagboekdag en reflecties zichtbaar beter leesbaar zijn
- kleuren, spacing, radius en componentgedrag consistent zijn
- empty/loading/error states niet meer rommelig aanvoelen
- iemand binnen 10 seconden snapt wat de hoofdactie is
- de app er rustig en onderscheidend uitziet zonder feature-uitbreiding

## Uitvoervolgorde Fase 1.3
1. Design tokens en foundations
2. Shared component polish
3. Vandaag scherm
4. Vastleggen scherm + motion
5. Dagboekdag
6. Reflecties
7. Dagen / Archief
8. Empty/loading/error states
9. Eind-pas op consistentie

## Stitch-richting
Voor Stitch moet deze fase worden aangestuurd met deze woorden:
- premium minimal
- warm neutral
- soft yellow accent
- calm interface
- content first
- readable
- large radius
- subtle depth
- tactile voice capture
- quiet confidence
- native mobile
- not chatbot-first
- not wellness app
- not dashboard-heavy

## Samenvatting in één zin
**Fase 1.3 maakt van de bestaande MVP geen bredere app, maar een veel sterkere app: visueel rustig, premium en tastbaar, met Budio-discipline als basis en een warmere, verhalende leeservaring als onderscheidende laag.**
