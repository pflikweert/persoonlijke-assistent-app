# Persoonlijke Assistent App — Master Project Document (Actuele basis)

## Doel van dit document
Dit is het enige hoofd-document dat je in een ChatGPT-project hoeft te uploaden om de actuele productcontext, scope, architectuur, bouwgeschiedenis en huidige fase van de **Persoonlijke Assistent App** goed mee te geven.

Dit document vervangt de eerdere losse projectoverzichten en fasebestanden als **primaire contextbron**.

Voor de actuele MVP-designdoorvoer zijn aanvullend leidend:
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/`

---

## 1. Korte productdefinitie

De Persoonlijke Assistent App is in de kern een **persoonlijke contextmachine**.

De app laat een gebruiker snel met **stem of tekst** dingen vastleggen, zet die invoer server-side om naar bruikbare gestructureerde inhoud, bouwt daar automatisch **dagboekdagen** van op en genereert later **week- en maandreflecties**.

### Kernbelofte
**Leg je dag vast met stem of tekst, laat de app daar automatisch een nette dagboekdag van maken, en krijg wekelijkse en maandelijkse reflecties zonder handmatig knip- en plakwerk.**

### Wat het product wel is
- persoonlijk archief
- automatische structurering
- dagboek- en reflectie-assistent
- terugleesbare context

### Wat het product niet is
- algemene AI-levenscoach
- therapeutische vervanger
- WhatsApp-platform
- volledig relationeel analyseproduct
- alles-in-één personal operating system in v1

---

## 2. Harde productkeuze

De eerste release is bewust klein gehouden:

**capturen → structureren → dagboekdag → weekreflectie → maandreflectie**

Dus niet in release 1:
- retrieval/Q&A
- vector search
- document intelligence
- document uploads
- message help
- contactprofielen
- realtime voice
- WhatsApp-imports
- brede agentarchitectuur
- taken / agenda / reminders

### Waarom deze keuze klopt
De app moet eerst een **betrouwbare dagelijkse kern** bouwen. Niet starten als brede slimme assistent, maar als een product dat echte invoer omzet in duurzame, leesbare en later nuttige persoonlijke context.

---

## 3. Productprincipes

1. **Vastleggen moet sneller voelen dan ChatGPT openen**  
   Anders verliest de app zijn bestaansrecht.

2. **De gebruiker moet niet hoeven organiseren**  
   Geen mappen, geen handmatig knip- en plakwerk als standaardgedrag.

3. **Day journal is de eerste echte productprimitive**  
   Niet losse chats of losse notities, maar per dag opgebouwde context.

4. **Reflectie is waardevoller dan pseudo-intelligentie**  
   Eerst structureren en samenvatten, later pas retrieval of open archiefvragen.

5. **Ruwe bron en AI-bewerking blijven gescheiden**  
   Dat maakt het product betrouwbaarder, uitlegbaarder en later beter schaalbaar.

6. **Geen realtime-first architectuur**  
   De MVP mag asynchroon zijn als dat de kernwaarde sneller oplevert.

7. **Geen vector-first architectuur**  
   Metadata, structuur en opslag gaan eerst; retrieval is later pas een upgrade.

---

## 4. Release 1 scope

### In scope
- tekstnotitie vastleggen
- stemnotitie vastleggen
- audio transcriptie
- entry normalization
- day journal opbouw per kalenderdag
- weekreflecties
- maandreflecties
- dagenlijst
- dagdetail
- reflectiescherm

### Buiten scope
- retrieval/Q&A
- vector store
- document uploads
- message help
- contactprofielen
- realtime voice
- WhatsApp-imports
- brede agentarchitectuur

---

## 5. Schermen van release 1

### Home / Vandaag
Doel: rustige dagelijkse startplek met één duidelijke hoofdactie.

Onderdelen:
- primaire actie: **Spreek iets in**
- secundaire actie: **Schrijf iets op**
- blok: **Vandaag**
- blok: **Laatste reflectie**
- blok: **Recente dagen**

### Vastleggen
Doel: nieuwe invoer toevoegen.

Modi:
- stem
- tekst

Minimaal:
- inhoud
- optionele titel
- optionele tag

Bewust niet in release 1:
- persoonselectie
- bronlabels voor meerdere systemen
- zware categorisatie
- complexe typehints

### Dagboekdag
Doel: één leesbare dagweergave.

Onderdelen:
- datum
- dagsamenvatting
- samengevoegde dagtekst
- onderliggende entries
- actie: **Opnieuw samenvatten**

Geen chatinterface. Dit is een dagweergave.

### Reflecties
Tabs:
- week
- maand

Per reflectie:
- kernsamenvatting
- belangrijkste gebeurtenissen
- terugkerende patronen
- bruikbare reflectiepunten

Beperking:
- rustig
- praktisch
- niet zwaar psychologiserend

### Archief
Doel: eerdere dagen en reflecties teruglezen.

Release 1:
- lijst van dagen
- lijst van weekreflecties
- lijst van maandreflecties
- filter op periode

Nog niet:
- vrije AI-zoekvraag
- semantische archief-Q&A

---

## 6. Informatie-architectuur

We werken in drie lagen.

### Laag 1 — Bronnen
De ruwe input:
- audio-opname
- transcript
- handmatige tekstnotitie

### Laag 2 — Gestructureerde inhoud
De bruikbare productlaag:
- entry
- day journal
- weekreflectie
- maandreflectie

### Laag 3 — Assistentlaag
De vaste AI-verwerking:
- transcriptie
- normalisatie
- dagsamenvoeging
- periodieke reflectie

Belangrijk:
De productervaring draait in release 1 **niet** op een open chatassistent maar op vaste inhoudsflows.

---

## 7. Datamodel (release 1)

### Kernentiteiten
- **User**
- **SourceItem**  
  ruwe invoer zoals audio of tekst
- **Entry**  
  genormaliseerde inhoud afgeleid van een bron
- **DayJournal**  
  canonieke daglaag, leidend voor de productervaring
- **PeriodSummary / period_reflections**  
  opgeslagen week- en maandreflecties

### Belangrijke ontwerpkeuzes
- bron en interpretatie gescheiden opslaan
- day journal is leidend, niet losse entries
- reflecties worden opgeslagen, niet alleen on-demand berekend
- alleen modelleren wat release 1 echt gebruikt

### Expliciet nog niet modelleren
- Person
- ThemeTag
- EntryPersonLink
- EntryThemeLink
- SearchIndexItem
- MessageDraftRequest

---

## 8. AI-rollen in release 1

### 1. Transcriber
Zet audio om naar tekst.

Regels:
- geen interpretatie
- geen reflectie

### 2. Entry Normalizer
Maakt van ruwe invoer een nette entry.

Output:
- titel
- opgeschoonde tekst
- korte samenvatting

Regels:
- dicht bij de bron blijven
- geen grote conclusies trekken

### 3. Day Composer
Voegt entries van één dag samen tot een bruikbare dagboekdag.

Output:
- korte dagsamenvatting
- canonieke dagtekst
- kernpunten

Regels:
- geen fantasie
- geen therapeutische claims
- duplicatie verminderen

### 4. Period Reflector
Genereert week- en maandreflecties.

Output:
- samenvatting
- belangrijkste gebeurtenissen
- patronen
- reflectiepunten

Regels:
- nuchter
- niet dramatiseren
- niet psychologiseren als feit

---

## 9. Technische uitgangspunten

### Stack
- React Native
- Expo
- TypeScript
- Supabase
- server-side OpenAI
- npm
- VS Code + Codex

### Principes
- OpenAI alleen server-side
- geen secrets client-side
- Supabase als primaire backend
- brondata en AI-output gescheiden opslaan
- simpele services boven generieke agentlagen
- expliciete foutafhandeling
- verify scripts en kleine tests zodra dat regressies helpt voorkomen

### Repo/Codex-basis
Verplicht:
- `AGENTS.md` in repo-root
- repo-local skills in `.agents/skills/`

Aanbevolen skills:
- Expo / React Native schermworkflow
- Supabase schema/types workflow
- OpenAI server-flow workflow

---

## 10. Bouwgeschiedenis tot nu toe

### Fase 0 — Setup en omgeving
Voorbereid / opgezet:
- GitHub repo
- lokale repo-koppeling
- `main` branch
- Expo-basis
- Supabase project en CLI
- env-structuur
- OpenAI server-side setup
- Codex-config met `AGENTS.md` en repo-local skills

### Fase 1 — Kernlus bouwen
Doel:
De eerste werkende productlus bouwen:

**sign-in → capture → process-entry → entries_raw → entries_normalized → day_journals → vandaag / dagen / dagdetail**

Later binnen release 1:
**weekreflecties + maandreflecties + reflectiescherm**

#### Belangrijkste Fase 1-besluiten
- magic link auth wel, maar geen kunstmatig niet-persistente sessie afdwingen
- `process-entry` is de centrale intake voor release 1
- brondata en AI-output blijven gescheiden
- text-only vertical slice eerst
- daarna audio + dagen + dagdetail
- daarna reflecties
- niet tussendoor herontwerpen als een faseplan al besluitklaar is

#### Text-only slice
Volgorde:
1. auth-baseline
2. schema + RLS
3. server-side `process-entry` voor text
4. Vandaag scherm
5. Vastleggen scherm
6. end-to-end text slice koppelen

#### Audio + Dagen + Dagdetail
Vastgezette defaults:
- `expo-audio`
- audio via JSON + base64
- max duur 90 seconden
- payload guard
- geen persistente audio-opslag
- `Dagdetail` toont `summary + sections + entries`

#### Reflecties
Vastgezette defaults:
- één tabel `period_reflections`
- weekgrens = ISO week, UTC
- maandgrens = UTC
- generatiegedrag = handmatig on-demand
- bron = alleen `day_journals`
- aparte Edge Function `generate-reflection`

#### Belangrijke debug-/fixmomenten
- CORS op `process-entry` moest expliciet goed gezet worden
- lokale Supabase flow moest end-to-end worden gevalideerd
- verify scripts werden belangrijker naarmate de flow groeide

---

## 11. Huidige planning: Fase 1.2

### Waarom deze naam
Deze stap heette eerder in losse documenten “Fase 2 — Stabilisatie”, maar is nu bewust hernoemd naar **Fase 1.2** om opschoning te beperken en duidelijk te maken dat dit nog steeds hoort bij het **hardmaken van release 1**, niet bij een nieuwe uitbreidingsfase.

### Definitie
**Fase 1.2 is geen featurefase.**  
Het is de pre-fase vóór nieuwe ontwikkelingen.

Doel:
De bestaande kern betrouwbaar, prettig en private-beta klaar maken.

### Wat Fase 1.2 wel is
- stabiliteit
- foutafhandeling
- outputkwaliteit
- UX-polish van bestaande flows
- export / reset / vertrouwen
- smoke tests, verify scripts en beta-readiness

### Wat Fase 1.2 expliciet niet is
- retrieval/Q&A
- vector search
- document intelligence
- document uploads
- message help
- contactprofielen
- realtime voice
- nieuwe brede assistentlagen

---

## 12. Fase 1.2 — uitvoering in subfasen

### Fase 1.2A — Stabiliteit en foutafhandeling
Doel:
De keten deterministisch en fouttolerant maken.

Focus:
- retries waar nodig
- betere foutmeldingen
- loading states opschonen
- logging verbeteren
- edge cases afvangen
- duidelijke statusovergangen in de kernflow

Concreet:
- capture → process-entry → opslag → day journal → reflectie beter observeerbaar maken
- simpele flow-id / request logging
- verify scripts voor text, audio en reflecties
- consistente foutafhandeling server-side en client-side

### Fase 1.2B — Outputkwaliteit
Doel:
Zorgen dat day journals en reflecties echt bruikbaar zijn.

Focus:
- dagboekdagen mogen niet rommelig of repetitief zijn
- reflecties mogen niet te vaag of te zwaar zijn
- duplicatie verminderen
- toon rustig en praktisch houden
- normalization en composition aanscherpen
- entry-normalisatie blijft bronnabij en volledig: opschonen mag, inkorten/samenvatten niet

Concreet:
- kleine vaste kwaliteitsset met representatieve invoer
- beoordeling per laag: transcript → entry → day journal → reflection
- prompts/guardrails aanscherpen waar nodig
- eventueel simpele regenerate-acties, maar geen nieuwe AI-flowarchitectuur

### Fase 1.2C — UX-polish
Doel:
De bestaande productervaring rustiger en prettiger maken.

Focus:
- Home rustiger en duidelijker
- capture-flow soepeler
- dagen/detail leesbaarder
- reflectiescherm netter
- empty/loading/error states consequent

Belangrijk:
Geen nieuw productconcept en geen feature-uitbreiding. Alleen polish van bestaande schermen en flows.

### Fase 1.2D — Vertrouwen: export / backup / reset
Doel:
Eigenaarschap en vertrouwen vergroten.

Focus:
- export van day journals
- export van reflecties
- eenvoudige markdown/json export
- basis delete/reset-mogelijkheden

Belangrijk:
Dit is geen grote backup-suite. Alleen de kleinste bruikbare export- en herstelbasis.

### Fase 1.2E — Private-beta readiness
Doel:
De app daadwerkelijk overdraagbaar en testbaar maken.

Focus:
- smoke tests betrouwbaar
- verify scripts op orde
- documentatie voor lokale setup en deploy
- simpele release-checklist
- bekende beperkingen en testprotocol vastleggen

---

## 13. Huidige uitvoervolgorde

De juiste volgorde is:

1. **Fase 1.2A — Stabiliteit + verify + logging**
2. **Fase 1.2B — Outputkwaliteit**
3. **Fase 1.2C — UX-polish**
4. **Fase 1.2D — Export / reset**
5. **Fase 1.2E — Beta docs + smoke tests + checklist**

Niet andersom.

Reden:
Eerst betrouwbaarheid, dan kwaliteit, dan polish, dan vertrouwen, dan releasegereedheid.

---

## 14. Exit-criteria van Fase 1.2

Fase 1.2 is pas klaar als:
- text en audio betrouwbaar door de hele keten lopen
- day journals en reflecties op een kleine vaste testset consequent bruikbaar zijn
- de UI op kernschermen geen rommelige states meer heeft
- export werkt
- verify scripts en smoke tests bestaan en bruikbaar zijn
- iemand anders de app lokaal of in beta kan draaien zonder mondelinge uitleg

---

## 15. Wat de volgende echte fase pas wordt

Pas na Fase 1.2 komt de eerstvolgende echte ontwikkelfase:

### Fase 2 — nieuwe ontwikkeling na release-1-hardening
Waarschijnlijk richting:
- persoonlijk archief slimmer maken
- pas later retrieval / archiefvragen
- pas daarna eventueel berichthulp

Maar:
dit is **post-Fase-1.2** en dus niet nu.

---

## 16. Samenvatting in één zin

**Deze app moet in release 1 en Fase 1.2 eerst een extreem eenvoudige, betrouwbare persoonlijke contextmachine worden die stem en tekst omzet in bruikbare dagboekdagen en reflecties — niet een te brede AI-assistent.**
