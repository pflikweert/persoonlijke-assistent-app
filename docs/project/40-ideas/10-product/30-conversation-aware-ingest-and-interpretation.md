# Conversation-aware ingest and interpretation

## Status

idea

## Type

product

## Horizon

next

## Korte samenvatting

Budio moet conversatie- en berichtfragmenten (zoals WhatsApp, iMessage, Telegram, Slack, e-mail, meeting-transcripts) niet behandelen als platte dagboektekst, maar als een herkenbaar inputtype dat source-aware wordt geïnterpreteerd, verwerkt en weergegeven.

Het idee is niet “WhatsApp integratie”, maar een bredere capability:
**conversation-aware ingest + interpretation layer**, waar WhatsApp later één van meerdere bronnen kan zijn.

## Probleem

Vandaag kopieert de gebruiker soms stukken chatconversatie in een nieuw moment.
De AI-verwerking (entry_cleanup) behandelt dat dan als gewone dagboektekst, wat leidt tot:

- verwarring tussen eigen stem en andermans stem
- onterechte samenvatting van andermans inhoud alsof het eigen reflectie is
- verlies van thread- en tijdstructuur
- risico op hallucineren van intenties en emoties
- visueel geen duidelijk onderscheid tussen conversatie en note/dagboek

## Waarom interessant

- Sluit direct aan op bestaande capture + import infrastructuur (text capture, ChatGPT markdown import, background tasks).
- Past bij Budio’s capture-first principe, maar breidt het uit naar conversational sources zonder platform-lock-in.
- Versterkt het strategische verschil tussen “Budio verwerkt elke ruwe capture goed” vs. “Budio is alleen een typ/spreek dagboek”.
- AIQS krijgt hier een sterk nieuw evaluatiedomein bij (source-type correctheid, stem-attributie, inhoudelijke grens).
- Minimaliseert platformrisico: copy/paste + structured import werken los van officiële WhatsApp/Meta APIs.

## Productvisie (fasegewijs)

### Fase 1 — Manual conversation paste ingest

- Nieuw inputtype / capture-flag: `conversation_text`.
- Gebruiker plakt een chat/gespreksfragment in (of via een dedicated “Conversatie toevoegen” pad).
- Budio detecteert conversational structuur (naam + timestamp + bericht, afzenderwissels).
- UI toont expliciet: dit is een gesprek/fragment, niet een eigen dagboeknotitie.
- Verwerking behandelt eigen vs. andermans stem expliciet gescheiden.

### Fase 2 — Structured conversation import

- `.txt`/`.md` import voor chatthreads en threads uit andere bronnen (WhatsApp export, Telegram export, e-mailthread, meeting-transcript).
- Parser herkent patronen zoals `naam – tijd: bericht`, `[tijd] naam: bericht`, threadgroepen.
- Integratie met bestaande import/background-task infrastructuur.
- Eventueel OCR op screenshots als latere uitbreiding.

### Fase 3 — Source adapters

- Optionele adapters voor:
  - WhatsApp chat-export (`.txt`/`.zip`)
  - Telegram export
  - iMessage export
  - E-mail thread ingest
- Alle adapters produceren dezelfde interne `conversation_text` structuur.

### Fase 4 — Connector experiments (alleen als onderbouwd)

- Officiële WhatsApp Business/Cloud API voor business-spoor (niet bruikbaar voor persoonlijke privéchats).
- Onofficiële WhatsApp Web bridge (`whatsapp-web.js` / Baileys) uitsluitend als geïsoleerd research/prototype, niet als productfundering.
- Expliciete risk-assessment per adapter (ban-risico, privacy, juridisch, operationeel).

## WhatsApp opties — privé minimaal vs. maximaal

Context: het idee ontstond vanuit de vraag “kan ik mijn eigen app koppelen met WhatsApp om conversaties uit te lezen?”.
De volgende uitsplitsing is leidend voor latere beslissingen:

### Privé minimaal (aanbevolen startpunt)

- Copy/paste + structured parsing + source-aware interpretation.
- Geen API, geen Meta-afhankelijkheid, geen ban-risico.
- Werkt voor WhatsApp, Signal, Telegram, iMessage, Slack, e-mail, etc.
- Snelste, veiligste en breedste basis.

### Privé maximaal (alleen experiment)

- Onofficieel via `whatsapp-web.js` / Baileys als gekoppeld apparaat.
- Technisch krachtig (real-time read, send, media, groepscontext).
- Fragiel bij WhatsApp updates, kans op nummerban, tegen ToS.
- Niet geschikt als fundament voor roadmap of product.

### Business officieel

- WhatsApp Cloud API via Meta for Developers.
- Stabiel en officieel ondersteund, webhook-gedreven.
- Kan alleen berichten zien naar het business-nummer; niet bruikbaar om eigen persoonlijke privéchats uit te lezen.
- Relevant voor later business-spoor, niet voor de huidige persoonlijke use-case.

## AI-gedragingen die nodig zijn

1. Herkennen of input conversational is (vs. note/dagboek/audio-transcript).
2. Herkennen hoeveel sprekers er zijn en afzenderwissels.
3. Onderscheid eigen stem vs. andermans stem.
4. Bepalen wat als dagboek-/moment-relevant geldt voor de gebruiker.
5. Output anders structureren dan bij note-input (geen valse samenvatting van andermans inhoud als eigen reflectie).
6. Geen hallucinatie van emoties/intenties toegekend aan gespreksdeelnemers.

## Relatie met AIQS

- Nieuwe task of family-richting (voorstel): `conversation_ingest_classification`, `conversation_cleanup`, `conversation_to_entry`, `conversation_summary`.
- Of, klein startpunt: `entry_cleanup` uitbreiden met expliciete source-type input, zonder de bestaande contract-first editor stil te laten groeien.
- AIQS moet expliciet kunnen evalueren:
  - classificatie conversation vs. note (consistent?)
  - stem-attributie correct?
  - hallucinatie van emoties/intenties?
  - onterechte samenvatting als eigen reflectie?
  - Budio-conforme, rustige output?

## Visuele weergave

- Conversatie-input wordt in de app zichtbaar anders weergegeven dan note-input.
- Minimaal: duidelijke markering dat dit een gespreksbron is, met optionele weergave van thread/structuur.
- Geen zware nieuwe UI-surfaces; volgt clean-first guardrails.
- Maximaal (later): collapsible thread view met duidelijk onderscheid eigen stem vs. andermans stem.

## Relatie met huidige docs

- Strekt bestaande import/capture-infrastructuur uit (`services/import/*`, `process-entry`, `user_background_tasks`).
- Raakt `ai-quality-studio.md` en `content-processing-rules.md` voor source-aware contracten en grensgedrag.
- Buiten huidige MVP-scope; past bij research richting sterkere capture→output brug.
- Niet in `current-status.md` als feature opnemen tot expliciet gepland en gebouwd.

## Mogelijke impact

- product
- ui
- aiqs
- services
- supabase
- docs

## Open vragen

- Introduceren we `conversation_text` als nieuw source type naast `text`/`audio`, of als sub-type?
- Blijft AIQS op één `entry_cleanup` family met source-aware routing, of opent dit een dedicated family?
- Hoe behandelt de app meerdere afzenders in de visuele weergave zonder feature/UI creep?
- Welke minimale parser-patronen dekken 80% van privé use-cases zonder platformspecifiek te worden?
- Wat is het minimaal acceptabele privacy-model als later ooit een adapter/connector wordt toegevoegd?

## Volgende stap

- Detail-spec voor fase 1 (manual conversation paste) met expliciete input/output contracten en AIQS-testcases, zonder nu runtime-werk te starten.
- Parallel: AIQS-idea `50-source-aware-routing-and-evaluation.md` uitwerken als governance-spoor.
