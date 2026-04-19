# Source-aware routing and evaluation

## Status
idea

## Type
ai-aiqs

## Horizon
next

## Korte samenvatting
Maak AIQS-bewust van **source type** (note, voice-transcript, conversation, import), zodat promptrouting, contracten en evaluaties expliciet verschillen per input en niet langer stil in één generieke `entry_cleanup`-laag worden afgehandeld.

## Probleem
Vandaag behandelt AIQS input primair taak-gedreven (bijv. `entry_cleanup`) zonder formeel onderscheid in source type.
Dat werkt voor “dagboek tekst/audio”, maar breekt voor bronnen als chat/conversatie, waar:
- meerdere sprekers bestaan
- eigen stem vs. andermans stem gescheiden moet blijven
- hallucinatierisico op intenties/emoties veel hoger is
- contract “title/body/summary_short” niet per definitie klopt

Dit is een directe consequentie van het productidee `40-ideas/10-product/30-conversation-aware-ingest-and-interpretation.md`.

## Waarom interessant
- Versterkt AIQS als control plane in plaats van task-only governance.
- Voorkomt dat `entry_cleanup` stilzwijgend een overloaded generieke AI-laag wordt.
- Levert expliciete, testbare evaluatiedomeinen voor nieuwe bronnen (zoals conversation).
- Houdt contract-first principes expliciet per source/task i.p.v. impliciet “werkt ook wel voor chat”.
- Maakt latere commerciële tiering (per source/type usage) mogelijk zonder achteraf te refactoren.

## Voorgestelde richting

### 1. Source type als eerste-klas metadata
- Input source types: `note_text`, `voice_transcript`, `conversation_text`, `imported_text`.
- Source type reist mee door `process-entry`, entry-normalization en AIQS-testbedding.
- Source type is zichtbaar in AIQS baseline import en testruns.

### 2. Task- en family-scheiding per source
Opties:
- **Klein startpunt**: huidige `entry_cleanup` blijft, maar krijgt source-aware instructies en expliciete evaluatiecontract per source.
- **Structureel startpunt**: aparte task(s) voor conversation-verwerking, bijv.:
  - `conversation_ingest_classification`
  - `conversation_cleanup`
  - `conversation_to_entry`
  - `conversation_summary`
- **Family richting**: eigen AIQS family `conversation_handling` naast huidige `moments`.

### 3. Evaluatiecriteria per source
AIQS moet per source kunnen toetsen:
- classificatie source type consistent?
- stem-attributie correct (eigen vs. andermans stem)?
- geen hallucinatie van emoties/intenties?
- geen onterechte samenvatting van andermans inhoud als eigen reflectie?
- contractconformiteit per task (title/body/summary_short of een alternatief conversation-contract)?
- rustige, Budio-conforme output zonder coach/advies drift?

### 4. Compare-laag
Compare-view laat expliciet zien:
- welke source type de run behandelt
- hoe kandidaatversie scoort op source-specifieke criteria
- verschillen t.o.v. runtime-basis voor dezelfde source

## Relatie met huidige code-realiteit
- `services/ai-quality-studio/readmodel.ts` definieert tasks en families incl. `entry_cleanup` → natuurlijke plek voor source-aware uitbreiding.
- `services/import/chatgpt-markdown*.ts` levert al structured message-objects (speaker, timestamp) die later als `conversation_text` baseline kunnen dienen.
- `supabase/functions/admin-ai-quality-studio/*` is de juiste server-laag voor source-aware acties zonder client-side uitbreiding.
- `server-contracts/ai/*` is de juiste plek voor nieuwe contracttypes als conversation een eigen contract krijgt.

## Relatie met AIQS-governance (canoniek)
- Blijft admin-only en server-side (`docs/project/ai-quality-studio.md`).
- Blijft contract-first, task-first, evidence-first.
- Geen brede chat/agent UI; alleen gerichte evaluatie en compare.
- Runtime blijft source-of-truth tot expliciet gecontroleerd gemigreerd.

## Mogelijke impact
- aiqs
- services
- supabase
- docs
- product (indirect via conversation-aware ingest)

## Open vragen
- Wel of geen aparte family voor conversation, of eerst source-aware uitbreiding binnen `entry_cleanup`?
- Krijgt `conversation_text` een eigen response-contract i.p.v. `title/body/summary_short`, of juist een genormaliseerde variant?
- Moet source type invloed hebben op routing/model/kosten (bijv. zwaardere model voor chat-interpretatie)?
- Hoe representeren we stem-attributie in de output zonder UI/feature creep?
- Welke minimale set evaluatiecases dekt de kern voor MVP-waardige conversation-support?

## Volgende stap
- Detail-spec voor source type metadata door de keten (capture → process-entry → normalized → AIQS testbed).
- Kleine AIQS-contractschets voor `conversation_*` tasks en/of source-aware `entry_cleanup` extensie, zonder runtime-werk te starten.
- Expliciete evaluatiecasesuggestie voor compare-runs (chat eigen stem, chat andermans stem, mixed thread, single speaker note).
