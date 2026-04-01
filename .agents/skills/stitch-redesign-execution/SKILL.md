---
name: stitch-redesign-execution
description: Voer scherm-redesigns uit op basis van Stitch exports in design_refs met strikte visuele doorvertaling naar RN/Expo, zonder feature- of dataflowwijzigingen.
---

# Gebruik
Gebruik deze skill bij scherm-redesigns waar een bindende Stitch export beschikbaar is in `design_refs/...`.

## Gebruik deze skill wel
- bestaand scherm redesignen op basis van `design_refs/.../code.html` + `screen.png`
- schermdoorvoer na foundation-pass
- visual polish waarbij Stitch visuele waarheid is
- screen-level redesign zonder featurewijziging

## Gebruik deze skill niet
- backendwijzigingen
- nieuwe productflows of features
- service/data-contract herontwerp
- architectuurverbreding
- pure foundation-pass zonder scherm-specifieke Stitch bron
- productbeslissingen zonder bindende `design_refs`

## Verplichte input
Prompt moet minimaal bevatten:
1. Doelscherm en concrete app-file(s)
2. Leidende `design_refs/...` map
3. Leidende foundationbron (`.../ethos_ivory/DESIGN.md` of expliciete DESIGN.md)
4. Welke files wel geraakt mogen worden
5. Wat expliciet buiten scope is

Als dit ontbreekt: neem de kleinste veilige aanname en benoem die expliciet.

## Verplichte werkvolgorde
1. Lees bindende bronnen:
   - relevante spec in `docs/project/...`
   - relevante `DESIGN.md`
   - relevante `code.html`
   - relevante `screen.png`
2. Analyseer huidig scherm:
   - huidige layout/hiërarchie
   - bestaande componenten
   - legacy UI-patronen
   - welke data/logica onaangeraakt moet blijven
3. Benoem mismatch met Stitch:
   - wat visueel afwijkt
   - wat uit legacy UI weg moet of afgezwakt moet worden
   - wat expliciet sterker doorvertaald moet worden
4. Scheid visueel van functioneel:
   - layout/spacing/hiërarchie/styling wel
   - dataflow/backend/features niet
5. Bouw de kleinste sterke redesign-pass:
   - één scherm tegelijk
   - geen scope-uitloop
6. Doe expected-vs-built check:
   - hero
   - hiërarchie
   - card-reductie
   - CTA-dominantie
   - lijst vs kaarten
   - editorial vs technisch
   - aantoonbaar dichter bij Stitch

## Harde ontwerpregels
- `design_refs` zijn bindend, niet optioneel.
- Stitch is visuele waarheid, geen moodboard.
- HTML niet letterlijk kopiëren; vertaal naar nette RN/Expo-equivalenten.
- Bestaande layout is niet automatisch leidend.
- Bestaande dataflow blijft leidend tenzij expliciet anders gevraagd.
- Geen feature creep.
- Geen backend/service/migrationwerk.
- Geen extra schermen meenemen.
- Geen halve redesign (alleen kleuren/spacing) als structuur ook moet veranderen.
- Benoem expliciet welke legacy UI verwijderd of afgezwakt is.

## Scope-discipline (altijd expliciet melden)
- wat nu wel wordt gebouwd
- wat expliciet niet wordt gebouwd
- welke files je aanpast
- welke files je bewust niet aanpast
- waarom die keuze scope-veilig is

## Lessen uit gevalideerde Today-pass
- Technisch “geslaagd” kan visueel nog te voorzichtig zijn.
- Card-heavy legacy UI moet soms bewust afgebouwd worden.
- Hero en primaire actie moeten echt dominant worden als Stitch dat laat zien.
- Insight/quote-blokken moeten editorial kunnen zijn, niet generieke app-cards.
- Recent-secties moeten lijstgevoel houden, niet terugvallen op kaartstapeling.
- Topbar/hero/spacing moeten structureel doorvertaald worden.
- “Bestaande app met nieuwe kleuren” is onvoldoende.

## Aanbevolen uitvoerformat
1. Korte analyse huidig scherm
2. Gebruikte bindende bronnen
3. Visuele mismatch met Stitch
4. Wat wordt aangepast
5. Wat blijft bewust gelijk
6. Welke files worden aangepast
7. Welke files bewust niet
8. Validatie (`lint`, `typecheck`, gerichte smoke-check)
9. Expected-vs-built beoordeling
10. Eventuele mini-restpunten

## Anti-patterns (verboden)
- Stitch alleen als inspiratie gebruiken
- oude card-layout grotendeels laten staan
- halverwege stoppen na alleen tokenkleur-updates
- dataflow aanpassen om visual mismatch te “fixen”
- redesign op meerdere schermen zonder expliciete scope
