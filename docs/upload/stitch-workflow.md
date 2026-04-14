# Stitch workflow (operationeel)

_Status: operationele workflow, niet-canonieke productwaarheid_

## Doel
Deze workflow beschrijft hoe we Stitch gebruiken voor merk- en schermwerk binnen **Budio Vandaag**, zodat:
- designwerk consistent blijft met bestaande product- en designguardrails
- ChatGPT betere Stitch-prompts kan schrijven
- Cline uitkomsten gestructureerd kan opnemen in repo-docs en design refs
- Stitch-output niet direct als waarheid in code of docs belandt zonder selectie en handoff

## Plaats in de docs-hiërarchie
Dit document is een **workflowdoc** en hoort in:

`docs/dev/stitch-workflow.md`

Niet in:
- `docs/project/**` → canonieke productwaarheid
- `docs/upload/**` → generated uploadartefacten

## Relatie met leidende bronnen
Stitch werkt altijd binnen deze kaders:
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/ethos_ivory/DESIGN.md`
- `theme/tokens.ts`
- `docs/project/copy-instructions.md`
- `docs/project/master-project.md`
- `docs/upload/stitch-design-context.md` alleen als compacte upload/handoff, niet als waarheid

## Kernprincipes
1. **Capture-first blijft leidend**
   - Geen dashboardisering
   - Geen chat- of coachgevoel
   - Today blijft entry point met 1 dominante primaire actie

2. **Stitch is exploratie + handoff, geen waarheid**
   - Stitch-output is pas bruikbaar na selectie, review en vertaling naar design refs/docs
   - Geen screen direct als bindende waarheid behandelen zonder expliciete keuze

3. **Eén scherm per prompt**
   - Niet meerdere hoofdschermen tegelijk genereren
   - Eerst foundation/shell, daarna losse schermen

4. **Gebruik exacte merkassets**
   - Gebruik het geüploade Budio Vandaag-logo/icoon als huidige werkbasis
   - Laat Stitch geen nieuwe merknaam, nieuw logo of nieuw symbool verzinnen

5. **Correctierondes zijn verplicht**
   - Eerste prompt = generate
   - Tweede prompt = correction/refinement met harde keep/change/do-not regels

6. **Stitch moet systeem volgen, niet sfeer alleen**
   - Prompt altijd met productregels, shellregels, kleurregels en merkregels
   - Niet alleen woorden als “calm”, “premium” of “editorial” geven

## Officiële merkregels voor Stitch
Gebruik in Stitch altijd deze merkregels, tenzij later expliciet aangepast in canonieke design refs:

- Parent brand: `Budio`
- Product brand: `Budio Vandaag`
- In-app shorthand: `Vandaag`
- Gebruik `Budio Vandaag` voor auth, about, brand boards en documentatie
- Gebruik `Vandaag` alleen als schermtitel of korte in-app context
- Gebruik nooit alternatieve labels zoals:
  - `Vandaag by Budio`
  - `Quiet Curator`
  - nieuwe descriptoren of submerken

## Assetregels
Gebruik altijd een vaste asset-set per Stitch-sessie:
- huidige Budio Vandaag-logo SVG/PNG
- relevante bestaande Stitch-screen of referentiebeeld
- relevante design ref of screenshot uit repo
- vaste promptregels uit dit document

Expliciet verbieden in prompts:
- do not invent a new logo
- do not invent a new symbol
- do not rename the brand
- do not introduce alternative labels
- do not create website concepts unless explicitly requested

## Kleur- en UI-regels voor Stitch
- Warm neutral base blijft leidend
- Gold is in principe voor **primaire CTA** en kleine merkaccenten
- Gold niet als dominante verflaag op elk scherm
- Clean-first: spacing, typografie en hiërarchie vóór containers
- Topnav is navigation-only
- Titel en supporting copy horen standaard in hero onder de topnav
- Auth sfeer komt uit achtergrond + spacing, niet uit zware auth cards
- Dark mode volgt dezelfde compositie als light mode

## Stitch-werkvolgorde
Werk altijd in deze volgorde:

### Fase 1 — Foundation
1. brand foundation
2. auth
3. topnav / app shell

### Fase 2 — Core product screens
4. Today
5. day detail / dagboek
6. weekreflectie
7. maandreflectie
8. settings/about

### Fase 3 — Handoff naar repo
9. beste variant selecteren
10. designkeuzes samenvatten
11. relevante `design_refs/**` of nieuwe brand refs bijwerken
12. docs/bundle opnieuw genereren

## Vast promptformat voor Stitch
Gebruik voor Stitch standaard dit blokformat:

### 1. Goal
Wat dit scherm moet oplossen.

### 2. Screen
Noem exact één scherm of één board.

### 3. Use exact assets
Noem expliciet welke logo’s/referenties gebruikt moeten worden.

### 4. Brand rules
Merknaam, lockup, assetbeperkingen.

### 5. Product rules
Capture-first, geen dashboard, geen chat, geen AI-branding, etc.

### 6. Keep
Wat behouden moet blijven uit een vorige versie.

### 7. Change
Wat moet veranderen.

### 8. Do not
Wat Stitch expliciet niet mag doen.

### 9. Deliver
Wat voor output je wilt zien.

## Correction loop
Na iedere eerste generatie volgt een correctieronde met dit type instructie:

- keep the overall layout structure
- change only brand usage, spacing, hierarchy and CTA emphasis
- use the uploaded Budio Vandaag asset exactly
- remove any invented symbols or alternative brand names
- reduce decorative gold usage
- make the screen more implementation-friendly and less conceptual

## Reviewkader voor Stitch-output
Beoordeel iedere Stitch-uitkomst op deze vaste punten:

### Merk
- gebruikt het exact `Budio Vandaag`?
- gebruikt het het juiste logo/icoon?
- verzint het geen extra merklaag?
- blijft de parent/product-relatie helder?

### Productfit
- blijft het capture-first?
- heeft het 1 duidelijke primaire actie waar relevant?
- voelt het niet als dashboard, coach of chat?

### Shell / compositie
- is topnav navigation-only?
- zit titel/supporting copy onder de nav?
- blijft de compositie clean-first?

### Kleur
- is goud beperkt en hiërarchisch gebruikt?
- blijven achtergronden warm en rustig?
- wordt dark mode niet zwaarder dan light mode?

### Buildability
- is het een app-scherm en geen merkposter?
- is het geloofwaardig voor implementatie?
- is het bruikbaar als design ref voor Cline?

## Wanneer Stitch-output naar repo mag
Stitch-output gaat pas door naar repo wanneer:
- het scherm productmatig klopt
- merk en naam consistent zijn
- de shellregels gevolgd zijn
- de output niet meer afhankelijk is van uitleg buiten het scherm
- er een duidelijke keuze is gemaakt: dit is de referentievariant

## Hoe Stitch-output in repo landt
Stitch-output wordt niet rauw opgeslagen als waarheid.
Gebruik deze vertaling:

1. kies de beste screenvariant
2. vat de learnings samen in mensentaal
3. werk relevante `design_refs/**/DESIGN.md` of brand refs bij
4. update zo nodig `docs/design/mvp-design-spec-1.2.1.md` alleen als een regel echt breed en stabiel is
5. draai daarna:
   - `npm run docs:bundle`
   - `npm run docs:bundle:verify`

## Implementatieguardrails voor repo-handoff
- `theme/tokens.ts` blijft de enige tokenbron voor implementatie.
- Gebruik eerst bestaande shared primitives/patronen; maak alleen een nieuw shared component bij een echt herhaalbaar patroon over meerdere schermen.
- Stop geen screen-specifieke designregels in generieke shared primitives.
- `design_refs/1.2.1/**` blijven bindend per scherm; `.md` notes tellen mee naast `code.html` en `screen.png`.
- Noem stylingwerk pas klaar na check in light én dark mode tegen de relevante design refs.

## Aanbevolen repo-structuur voor dit onderwerp
### Canonieke workflowbron
- `docs/dev/stitch-workflow.md`

### Generated upload copy
- `docs/upload/stitch-workflow.md`

### Eventuele brand refs
- `design_refs/brand/budio-vandaag/**`

### Bestaande compacte handoff
- `docs/upload/stitch-design-context.md`

## Wat in de upload bundle moet
Voeg `docs/upload/stitch-workflow.md` toe als workflow-upload voor:
- ChatGPT Project
- Stitch-handoff
- eventuele Cline-context

Werk ook het upload manifest bij zodat deze file in de uploadset zichtbaar wordt.

## ChatGPT-regels voor Stitch-prompts
Als ChatGPT prompts schrijft voor Stitch, moet het:
- altijd 1 scherm tegelijk doen
- altijd harde merkregels opnemen
- altijd exacte asset-regels opnemen
- altijd productguardrails meenemen
- nooit brede redesigns bundelen als 1 prompt
- eerst foundation/shell prioriteren vóór detailschermen
- na ieder scherm een korte review geven: sterk / zwak / volgende correctie

## Cline-regels voor Stitch-MCP gebruik
Cline mag Stitch of Stitch-MCP alleen gebruiken binnen deze grenzen:
- voor designexploratie, varianten en handoff
- niet als vervanging van canonieke projectdocs
- niet als automatische waarheidsschrijver
- niet voor brede redesigns zonder schermscope
- eerst bestaande docs lezen, dan pas Stitch-werk uitvoeren
- resultaten terugvertalen naar docs/design refs

Belangrijk:
- MCP-setup kan lokaal verschillen
- de repo legt daarom **workflowregels** vast, geen harde environment-specifieke commando’s als die niet bewezen zijn
- documenteer MCP-gebruik op taakniveau en gedragsniveau, niet met onbewezen shell- of configdetails

## Niet doen
- meerdere hoofdschermen tegelijk vragen
- merknaam laten variëren
- nieuw logo of nieuw symbool laten verzinnen
- goud overal gebruiken
- stockfoto’s of marketingbeelden in productschermen accepteren
- Stitch-output direct als canonieke waarheid behandelen
- generated uploadbestanden handmatig als bron gaan gebruiken

## Definition of done per Stitch-scherm
Een Stitch-scherm is pas klaar als:
- merk klopt
- productfit klopt
- shell/logica klopt
- kleurhiërarchie klopt
- het scherm buildable voelt
- er een duidelijke repo-handoff klaarstaat

## Appendix A — Korte prompttemplate voor ChatGPT om Stitch-prompts te maken
Gebruik dit format:

```text
Schrijf een Stitch-prompt voor exact 1 scherm.

Scherm:
[naam]

Doel:
[wat dit scherm moet oplossen]

Gebruik exact deze assets:
- [logo]
- [vorige screen/ref]

Merkregels:
- Parent brand: Budio
- Product brand: Budio Vandaag
- Gebruik geen alternatieve merknamen
- Verzin geen nieuw logo of symbool

Productregels:
- capture-first
- geen dashboard
- geen chat
- geen coachgevoel
- topnav navigation-only
- titel onder nav in hero
- goud voor primaire CTA en kleine accenten

Behoud:
[wat goed was]

Verander:
[wat beter moet]

Niet doen:
[verboden dingen]

Deliver:
[gewenste output]
```

## Appendix B — Korte correctieprompt voor Stitch
```text
Keep the overall screen structure.
Use the uploaded Budio Vandaag brand asset exactly.
Do not invent a new icon, new logo, or new brand name.
Reduce decorative gold usage.
Make the screen more implementation-friendly and less conceptual.
Preserve the product hierarchy and keep the primary CTA dominant.
```
