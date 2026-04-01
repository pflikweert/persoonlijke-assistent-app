# Persoonlijke Assistent App — Aanvulling op productvisie en MVP-richting

## Doel van dit document
Dit document is een **gerichte aanvulling** op het bestaande masterdocument van de Persoonlijke Assistent App.  
Het vervangt de bestaande basis niet, maar scherpt de productrichting aan op één belangrijk punt:

**de app is primair een dagboek- en contextmachine, met daarnaast een kleine ondersteunende assistentlaag direct na invoer.**

Deze aanvulling sluit aan op de eerder vastgelegde kern:
- persoonlijke contextmachine
- capture via tekst en audio
- entry normalization
- day journals als kernprimitive
- week- en maandreflecties
- geen brede AI-coach
- geen open retrieval-first product

Die basis blijft leidend. Deze aanvulling maakt alleen explicieter **hoe de interactie direct na een entry eruit mag zien** en **hoe de dagboeklaag schoon en betrouwbaar blijft**.

---

## 1. Aangescherpte productformule

De app is in release 1 niet alleen:

**capture → structureren → dagboekdag → weekreflectie → maandreflectie**

maar concreter:

**capture → korte directe terugkoppeling → opname in dagboeklaag → latere reflectie**

Dat betekent:
- de gebruiker legt iets vast via tekst of stem
- de app verwerkt dit tot een bruikbare entry en dagboekinhoud
- de app mag direct daarna **kort meedenken**
- die directe assistentreactie is ondersteunend, niet leidend
- het dagboek blijft de hoofdwaarheid van het product

Dit is een belangrijk onderscheid.

De app is dus:
- **niet** puur een stille logger
- **niet** een open chatassistent
- **wel** een contextmachine met een kleine, begrensde reflectielaag rond het moment van vastleggen

---

## 2. Waarom deze aanvulling productmatig klopt

Deze richting sluit beter aan op echt gebruik.

In de praktijk wil een gebruiker vaak twee dingen tegelijk:

### 1. Direct gezien worden in het moment
Na het inspreken of typen is het prettig als de app kort laat merken:
- ik heb je begrepen
- dit valt op
- hier kun je even bij stilstaan

### 2. Het verhaal goed bewaren als dagboek
Tegelijk wil de gebruiker dat de inhoud:
- netjes wordt uitgewerkt
- leesbaar wordt opgeslagen
- later terug te lezen is als een echt persoonlijk dagboek
- niet vervuild raakt met AI-chat en meta-gesprek

Juist die combinatie maakt deze richting sterk.

Alleen opslag is te kaal.  
Alleen chat is te vluchtig en rommelig.  
De juiste MVP-vorm zit ertussenin.

---

## 3. Harde productregel

De volgende regel is bindend voor release 1:

> **De app is eerst een dagboekmachine, pas daarna een lichte reflectie-assistent.**

Daaruit volgen alle andere keuzes.

Dus:
- de dagboeklaag is leidend
- de assistentlaag is klein en ondersteunend
- het product mag niet afglijden naar een brede coach- of chatapp

---

## 4. Twee sporen in het product

Om de kern schoon te houden, wordt het product expliciet in twee sporen gedacht.

## Spoor A — Vastgelegde inhoud
Dit is de canonieke productlaag.

Hieronder vallen:
- ruwe input
- transcriptie
- genormaliseerde entry
- day journal
- weekreflectie
- maandreflectie

Eigenschappen:
- duurzaam opgeslagen
- exporteerbaar
- terugleesbaar
- onderdeel van het persoonlijke archief
- hoofdbron voor latere reflecties

Dit is de echte dagboeklaag.

## Spoor B — Directe assistentreactie
Dit is de ondersteunende interactielaag direct na vastleggen.

Hieronder vallen:
- een korte observatie
- een korte spiegel
- een korte reflectievraag
- eventueel een zeer beperkte vervolguitwisseling

Eigenschappen:
- tijdelijk en ondersteunend
- niet leidend voor de productervaring
- standaard niet onderdeel van het dagboek
- geen open, eindeloze chatmodus als default

Dit spoor helpt bij het moment.  
Spoor A bewaart het verhaal.

---

## 5. Wat er direct na een entry mag gebeuren

Na een entry mag de app drie dingen doen:

### 1. Verwerken
De invoer wordt technisch en inhoudelijk verwerkt:
- transcriptie waar nodig
- normalisatie
- koppeling aan de juiste dag
- voorbereiding of vernieuwing van de dagboekdag

### 2. Kort reageren
De app mag één compacte reactie teruggeven die de gebruiker helpt om direct even stil te staan bij wat er is gezegd.

Die reactie moet:
- kort zijn
- menselijk aanvoelen
- rustig van toon zijn
- niet therapeutisch of zwaar klinken
- niet de aandacht weghalen van de dagboeklaag

### 3. Een beperkte vervolgstap aanbieden
Bijvoorbeeld:
- verder aanvullen
- nog iets toevoegen
- afronden voor nu

Niet:
- automatisch uitgroeien tot een open chatthread
- de gebruiker trekken in lange AI-interactie

---

## 6. Toegestane typen directe reacties

Om scope creep te voorkomen, beperken we de directe assistentlaag in release 1 tot een klein aantal reactietypen.

### Type 1 — Korte observatie
Voorbeeldfunctie:
- benoemt kort wat opvalt in wat de gebruiker heeft gedeeld

Doel:
- laten voelen dat de invoer is begrepen

### Type 2 — Korte empathische spiegel
Voorbeeldfunctie:
- vat in rustige taal iets terug van de ervaring of spanning die doorklinkt

Doel:
- directe nabijheid zonder therapietaal

### Type 3 — Eén reflectievraag
Voorbeeldfunctie:
- stelt één simpele, bruikbare vraag waar de gebruiker meteen iets aan heeft

Doel:
- lichte verdieping zonder coachmodus

### Belangrijke beperkingen
Niet toegestaan in release 1:
- lange analyses
- therapeutische duidingen
- diagnose-achtige taal
- meerdere tegelijk gestelde vragen
- uitgebreide coaching
- relationele of psychologische adviesgesprekken als standaardrespons

---

## 7. Wat standaard níet in het dagboek terechtkomt

Dit is een cruciaal productbesluit.

De volgende inhoud komt standaard **niet** automatisch in het dagboek:
- assistentreacties
- vervolgvragen van de assistent
- chatachtige uitwisseling na de entry
- meta-gesprek over de entry
- analyse over analyse

Waarom dit belangrijk is:
- het dagboek moet van de gebruiker blijven
- de dagboeklaag moet leesbaar en rustig blijven
- export mag niet aanvoelen als een AI-chatlog
- de gebruiker moet later zijn eigen verhaal teruglezen, niet een gesprek met de machine

---

## 8. Wat wél in het dagboek terechtkomt

De dagboeklaag bevat alleen:
- wat de gebruiker expliciet heeft vastgelegd
- de nette verwerking daarvan
- de opgebouwde dagboekdag
- de weekreflectie
- de maandreflectie

Dit bewaakt eigenaarschap.

De app helpt dus bij vorm en structuur, maar neemt het dagboek niet over met een chatlaag.

---

## 9. Gewenste outputstijl van day journals en reflecties

De kwaliteit van de output is kern van het product.

De day journals, weekreflecties en maandreflecties moeten niet voelen als:
- generieke AI-samenvattingen
- coachtaal
- therapeutische rapportages
- management- of analysetekst

De gewenste stijl is:
- natuurlijk Nederlands
- rustig
- verhalend waar passend
- praktisch en leesbaar
- dicht bij de bron
- zonder overdreven interpretatie
- geschikt om later terug te lezen als echt dagboekmateriaal

### Belangrijke nuance
Release 1 belooft **niet** perfecte imitatie van iemands unieke schrijfstijl.

Release 1 belooft wél:
- natuurlijk en menselijk geschreven output
- taal die dicht bij de manier van vertellen van de gebruiker blijft
- output die niet als standaard-AI-tekst aanvoelt

Dat is ambitieus genoeg voor MVP en voorkomt onnodige complexiteit.

---

## 10. Gevolgen voor schermen en flows

Deze richting heeft directe impact op de productflow.

## Home / Vandaag
Blijft een rustige startplek.  
De kern verandert niet.

Wel moet duidelijk zijn:
- vastleggen staat centraal
- de assistentreactie is een korte laag na vastleggen
- de dagboekdag blijft de echte bestemming van de invoer

## Vastleggen
Na submit ontstaat niet alleen verwerking, maar ook:
- één korte reactie
- één beperkte vervolgactie

Maar dit scherm mag geen open chatomgeving worden.

## Dagboekdag
Moet expliciet de canonieke daglaag blijven.

Dus:
- geen vervuiling met assistentberichten
- geen doorlopende AI-chat in de dagweergave
- wel een mooi, verhalend opgebouwde dagtekst

## Reflecties
Blijven gebouwd op de dagboeklaag, niet op de tijdelijke assistentlaag.

Dat betekent:
- weekreflecties en maandreflecties worden gevoed door de day journals
- niet door losse mini-gesprekken na entries

---

## 11. Impact op architectuur en opslag

Deze aanvulling verandert de basisarchitectuur niet, maar scherpt de scheiding aan.

### Blijft gelijk
- brondata gescheiden van AI-output
- day journal als productprimitive
- period_reflections als opgeslagen output
- geen brede agentarchitectuur
- geen retrieval-first opzet

### Wordt explicieter
We maken onderscheid tussen:

#### A. Canonieke inhoudsverwerking
- input verwerken
- entry normaliseren
- day journal opbouwen
- reflecties genereren

#### B. Tijdelijke assistentinteractie
- korte respons na capture
- eventueel beperkte follow-up
- standaard niet persistent als dagboeklaag

Praktisch betekent dit:
- de app hoeft geen volledige chatarchitectuur te krijgen
- de assistentlaag mag technisch klein blijven
- de inhoudspipeline blijft de hoofdstructuur

---

## 12. MVP-scope: aangescherpte in-scope / niet-in-scope

## Extra in scope binnen release 1
Naast de al vastgelegde release-1 scope valt nu expliciet ook binnen scope:
- korte post-entry assistentreactie
- begrensde mini-follow-up direct na vastleggen
- expliciete scheiding tussen dagboekinhoud en assistentlaag
- outputstijl gericht op natuurlijk, rustig en verhalend Nederlands

## Expliciet buiten scope
Blijft buiten scope:
- open chat als primaire modus
- brede AI-coach
- therapeutische begeleiding
- relationele analyse-engine
- memory-gestuurde open gespreksagent
- automatische opname van volledige chatinteractie in het dagboek
- geavanceerde schrijfstijlclone-engine

---

## 13. Productrisico’s en guardrails

## Risico 1 — De app glijdt alsnog af naar een chatproduct
**Gevaar:** de assistentreactie wordt te groot en gaat domineren.

**Guardrail:**
- maximaal compacte reactie
- geen open eindeloze thread als default
- dagboeklaag blijft centraal in UI en architectuur

## Risico 2 — Het dagboek vervuilt met AI-taal
**Gevaar:** de output leest als AI-tekst of als chatlog.

**Guardrail:**
- strikte scheiding tussen dagboeklaag en assistentlaag
- kwaliteitscontrole op toon en stijl
- reflecties alleen op basis van day journals

## Risico 3 — “In jouw taal” wordt te ambitieus in MVP
**Gevaar:** te veel promptcomplexiteit, inconsistente output, teleurstelling.

**Guardrail:**
- niet beloven dat de app iemands stijl perfect kopieert
- wel sturen op natuurlijk, rustig, verhalend Nederlands dicht bij de bron

## Risico 4 — Assistentreacties voelen te coachend of te zwaar
**Gevaar:** product schuift richting therapie of self-help-app.

**Guardrail:**
- alleen observatie, spiegel of één reflectievraag
- geen zware duidingen
- geen diagnose-achtige taal
- rustige en praktische toon

---

## 14. Gevolgen voor Fase 1.2

Deze aanvulling past logisch binnen de al vastgelegde Fase 1.2.

### Extra aandacht in Fase 1.2B — Outputkwaliteit
Hier moet nu expliciet op worden beoordeeld:
- voelt de day journal verhalend en natuurlijk?
- blijft de tekst dicht bij de bron?
- leest de output niet als generieke AI?
- voelt de directe assistentreactie kort en bruikbaar?
- blijft de assistentreactie duidelijk los van het dagboek?

### Extra aandacht in Fase 1.2C — UX-polish
Hier moet nu expliciet op worden gelet:
- voelt de post-entry reactie licht en ondersteunend?
- is duidelijk wat wordt opgeslagen als dagboekinhoud en wat niet?
- blijft de productervaring rustig en niet-chatty?

### Extra aandacht in Fase 1.2D — Export / vertrouwen
Bij export moet duidelijk zijn:
- de gebruiker exporteert zijn dagboek en reflecties
- niet per ongeluk een volledige AI-chatgeschiedenis

---

## 15. Beslisregel voor toekomstige uitbreidingen

Toekomstige ideeën mogen alleen door als ze deze regel respecteren:

> **Versterkt dit de dagboekmachine, of trekt het het product richting brede assistent?**

Als het vooral het tweede doet, hoort het niet in de huidige fase.

Dat betekent concreet:
- features die capture, day journals, reflecties, export en leesbaarheid versterken passen waarschijnlijk wel
- features die de app veranderen in een brede gesprekspartner passen waarschijnlijk niet

---

## 16. Korte slotsamenvatting

De Persoonlijke Assistent App blijft in de kern wat eerder is vastgelegd:
- een persoonlijke contextmachine
- voor tekst en audio capture
- met automatische structurering naar dagboekdagen
- en periodieke reflecties

De nieuwe aanscherping is:
- direct na vastleggen mag de app **kort meedenken**
- maar alleen in een kleine, begrensde assistentlaag
- die assistentlaag is ondersteunend en niet leidend
- de dagboeklaag blijft schoon, exporteerbaar en van de gebruiker

De bindende formule voor MVP is daarom:

> **Capture eerst. Dagboek leidend. Korte assistentreactie ondersteunend. Reflecties later op basis van de dagboeklaag.**
