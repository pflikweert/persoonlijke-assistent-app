# DO NOT EDIT - GENERATED FILE

# Budio Ideas and Opportunity Map

Build Timestamp (UTC): 2026-04-19T17:27:40.667Z
Source Commit: 158faa5

Doel: primaire ideebundle met opportunity-map voor triage, sequencing en planherijking.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Bronbestanden (vaste volgorde)
- docs/project/40-ideas/README.md
- docs/project/40-ideas/00-ideas-inbox.md
- docs/project/40-ideas/10-product/20-budio-brainstorm-workspace-for-builders.md
- docs/project/40-ideas/10-product/30-conversation-aware-ingest-and-interpretation.md
- docs/project/40-ideas/10-product/40-trust-and-security-charter.md
- docs/project/40-ideas/10-product/50-structured-export-and-obsidian-archive.md
- docs/project/40-ideas/30-ai-and-aiqs/40-aiqs-modular-flow-control-plane.md
- docs/project/40-ideas/30-ai-and-aiqs/50-source-aware-routing-and-evaluation.md
- docs/project/40-ideas/40-platform-and-architecture/10-lean-project-operating-system-for-repo.md
- docs/project/40-ideas/40-platform-and-architecture/20-vscode-project-copilot-plugin.md
- docs/project/40-ideas/40-platform-and-architecture/30-budio-modular-intelligence-workspace.md
- docs/project/40-ideas/40-platform-and-architecture/40-vscode-plugin-with-budio-runtime-bridge.md
- docs/project/40-ideas/40-platform-and-architecture/50-security-posture-and-continuous-hardening.md
- docs/project/40-ideas/40-platform-and-architecture/60-budio-pro-markdown-workspace-and-obsidian-export.md

## Leesregel
- Ideas zijn voorstelruimte en niet automatisch actieve planning of canonieke productwaarheid.
- Promotie naar actieve uitvoering loopt via `docs/project/20-planning/**` en expliciete decisions.

---

## README

# Ideas workspace (gestructureerde ideecapture)

## Doel
Deze map is de voorstelruimte voor nieuwe ideeën.

Belangrijk:
- ideas zijn **niet** automatisch canonieke productwaarheid
- ideas zijn **niet** automatisch actieve planning

## Werkwijze
1. Snelle inval in `00-ideas-inbox.md`.
2. Triage: verwijderen, parkeren of promoveren.
3. Promotie = één idee per file in passende categorie.

## Categorieën
- `10-product/`
- `20-ui-ux/`
- `30-ai-and-aiqs/`
- `40-platform-and-architecture/`
- `50-growth-and-business/`

## Statuswaarden
- `idea`
- `candidate`
- `later`
- `planned`
- `rejected`
- `superseded`

## Relatie met andere docs
- Actieve focus: `docs/project/20-planning/20-active-phase.md`.
- Open gaps/risico’s: `docs/project/open-points.md`.
- Codewaarheid: `docs/project/current-status.md`.

## Obsidian graph hubs
- Project hub
- Strategy hub
- Planning hub
- Research hub
- Ideas inbox

## Belangrijke idea nodes
- 10-product/20-budio-brainstorm-workspace-for-builders
- 10-product/30-conversation-aware-ingest-and-interpretation
- 10-product/50-structured-export-and-obsidian-archive
- 30-ai-and-aiqs/40-aiqs-modular-flow-control-plane
- 30-ai-and-aiqs/50-source-aware-routing-and-evaluation
- 40-platform-and-architecture/50-security-posture-and-continuous-hardening
- 40-platform-and-architecture/60-budio-pro-markdown-workspace-and-obsidian-export

## Template (kopiëren per idee)

```md
# [Idee titel]

## Status
idea

## Type
product | ui-ux | ai-aiqs | platform-architecture | growth-business | internal-tooling

## Horizon
now | next | later | unknown

## Korte samenvatting

## Probleem

## Waarom interessant

## Relatie met huidige docs

## Mogelijke impact
- ui
- services
- supabase
- aiqs
- docs

## Open vragen

## Volgende stap
```

---

## Ideas Inbox

# Ideas inbox (snelle capture)

## Doel
Lage-frictie plek om nieuwe ideeën direct vast te leggen zonder contextverlies.

## Gebruik
- Korte bullets of ruwe notities zijn toegestaan.
- Inbox-items zijn tijdelijk en moeten later worden getriaged.

## Triage-uitkomsten
- promoveren naar één idee-file
- parkeren als `later`
- verwijderen als niet relevant

## Inbox

- [2026-04-19] VS Code plugin die repo + Budio productiecontext combineert via MCP/API.
- [2026-04-19] AIQS opdelen in flow-families met eigen contracts/evals i.p.v. één generieke laag.
- [2026-04-19] Budio brainstorm/workspace module voor builders/kleine teams als mogelijk productspoor.
- [2026-04-19] Conversation-aware ingest en interpretation layer (WhatsApp/iMessage/Telegram/mail/transcript), gepromoveerd naar 10-product/30-conversation-aware-ingest-and-interpretation.
- [2026-04-19] Source-aware AIQS routing en evaluation (source type als first-class metadata), gepromoveerd naar 30-ai-and-aiqs/50-source-aware-routing-and-evaluation.
- [2026-04-19] Security posture + continuous hardening (RLS, secrets, pentest, AI-pentest alternatief voor Aikido), gepromoveerd naar 40-platform-and-architecture/50-security-posture-and-continuous-hardening.
- [2026-04-19] Trust & security charter voor gebruikers (web + app transparantie "Nico-proof"), gepromoveerd naar 10-product/40-trust-and-security-charter.
- [2026-04-19] Budio Pro markdown workspace + Obsidian export als later integratiespoor, gepromoveerd naar 40-platform-and-architecture/60-budio-pro-markdown-workspace-and-obsidian-export.

---

## Budio Brainstorm Workspace For Builders

# Budio brainstorm workspace voor builders

## Status
idea

## Type
product

## Horizon
later

## Korte samenvatting
Mogelijke productmodule waarin solo builders/kleine teams ideeën kunnen vastleggen, structureren en vertalen naar uitvoerbare projectflow.

## Probleem
Creatieve ideeën ontstaan snel en raken versnipperd; zonder structuur gaat focus en uitvoering verloren.

## Waarom interessant
Past bij capture-first principe, maar toegepast op product-/bouwcontext in plaats van alleen dagboekcontext.

## Relatie met huidige docs
- Buiten huidige MVP-scope; nu alleen als ideespoor.
- Sluit inhoudelijk aan op modular workspace en plugin-bridge ideeën.

## Mogelijke impact
- product
- ui
- aiqs
- services
- docs

## Open vragen
- Is dit een aparte doelgroepmodule of een extensie op bestaande kern?
- Welke minimale MVP van zo’n brainstormflow is valideerbaar?

## Volgende stap
Value proposition en eerste workflow-hypothese uitwerken zonder huidige MVP-focus te verstoren.

---

## Conversation Aware Ingest And Interpretation

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

---

## Trust And Security Charter

# Trust and security charter (gebruikerscommunicatie)

## Status
idea

## Type
product

## Horizon
next

## Korte samenvatting
Budio moet niet alleen technisch veilig zijn, maar dat ook aantoonbaar, begrijpelijk en prominent communiceren via een product-facing **Trust & Security Charter** in web en app. Doel: de angst rond "dagboek + cloud + AI" expliciet wegnemen voor ook de kritische gebruiker.

Dit is de gebruikers- en communicatiekant van het platform-idee `40-ideas/40-platform-and-architecture/50-security-posture-and-continuous-hardening.md`.

## Probleem
- Gebruikers associëren dagboek + AI + cloud met hoog risico (datalek, AI-training, cloud-compromise).
- Zelfs als techniek goed staat, zonder zichtbare uitleg bouwt Budio geen vertrouwen.
- Generieke "privacybeleid" pagina's lezen niemand; ze creëren geen gevoel van controle.
- Vergelijkbare journaling-apps falen vaak op transparantie rond AI-gebruik en data-retentie.

## Waarom interessant
- Vertrouwen is voor een dagboekapp het belangrijkste product, niet alleen een feature.
- Charter-achtige transparantie is goedkoop te bouwen maar zwaar in conversie-effect en retentie.
- Sluit direct aan op de research-richting `private/regulated` als premium differentiator.
- Biedt een repeteerbaar communicatieframe voor later (landingspages, pricing pages, in-app onboarding, menu).
- Helpt bij acquisitie van de kritische gebruiker ("Nico-proof"): iemand die pas instapt als hij snapt waarom hij het kan vertrouwen.

## Productvisie

### Principes (publiek leesbaar)
Drie korte beloftes:

1. **Jouw ogen alleen**
   - Wat wij zien en wat wij niet zien.
   - Hoe toegang beperkt is (RLS, server-side rollen, allowlist).
   - Waar encryptie zit (in rust, in transit), en wat E2EE wel/niet betekent in de huidige fase.

2. **AI zonder oordeel**
   - AI wordt gebruikt om je te helpen, niet om jou te analyseren of door te verkopen.
   - OpenAI zero-retention / no-training setting expliciet bevestigd.
   - Geen verkoop, geen advertentiegebruik, geen third-party tracking pixels.

3. **Open kaart**
   - Welke providers we gebruiken: Supabase (data), Vercel (hosting), OpenAI (AI).
   - Waarom we die kiezen en welke standaarden zij hanteren.
   - Wat jij altijd zelf kan: export, verwijder alles, wachtwoord wijzigen, sessies beëindigen.

### Charter-opbouw (werkvorm)
- 1 korte landingsvariant (pricing/product pagina, 3 beloftes).
- 1 dieper charter-document (FAQ-stijl: "Wat als Supabase wordt gehackt?", "Traint OpenAI op mijn data?", "Kan Budio mijn teksten lezen?").
- 1 versie in-app: korte hero-kaart + link naar volledige versie.

### Transparantie-elementen
- Versiedatum + changelog van het charter zelf.
- Publieke `security.txt` met contactpad.
- Duidelijke scheiding: wat geldt vandaag, wat is roadmap (bijv. E2EE).
- Expliciete keuze-indicatoren: wat kan de gebruiker zelf aanzetten (MFA, audio-retentie, export, delete-all)?

## UX-plek in product
- **Web**: prominente section op landing + dedicated `/trust` of `/security` route.
- **App**: in onboarding (optioneel kort blokje) en in settings-hub als eigen rij ("Privacy & Security"), aansluitend bij bestaande settings IA (`app/settings.tsx`).
- Geen zware modals, geen dark patterns; clean-first, past binnen bestaande spacing/typografie-guardrails.

## Copy-richting
Volgt `docs/project/copy-instructions.md`:
- Kort, direct, menselijk.
- Geen marketingjargon, geen AI-coach-taal.
- Concreet ("we bewaren geen audio tenzij jij dat aanzet") i.p.v. abstract ("state of the art privacy").
- Vertaalbaar naar Nederlands en Engels zonder betekenisverlies.

## Relatie met huidige code-realiteit
- Past bij bestaande "exit/controle"-features: export, import, delete-all (1.2D aanwezig).
- Past bij bestaande admin-only boundary (geen end-user admin controls).
- Past bij bestaande `user_preferences` voor audio-opslag keuze.
- Nog niet aanwezig: dedicated trust/security UI-pad, copy-set, landing-section, `security.txt`.

## Relatie met AIQS
- AIQS blijft admin-only; charter beschrijft *niet* AIQS als gebruikersfeature.
- Charter bevestigt wel: "de AI-instellingen en prompts worden beheerd volgens interne kwaliteitscontroles" zonder internals te tonen.
- Source-aware routing (conversaties) maakt expliciete charter-zinnen extra waardevol (stem-attributie, geen andermans data gebruikt om gebruiker te profileren).

## Mogelijke impact
- product
- ui
- docs
- copy
- marketing/landing
- infra (security.txt en disclosure pad)

## Open vragen
- Starten we met landing-only charter, of gelijk ook in-app?
- Wie is juridisch eindverantwoordelijk voor de charter-teksten (solo of met externe legal review)?
- Koppelen we de charter aan een publiek changelog (datumgestuurd) of alleen aan releases?
- Hoeveel transparantie over concrete technische keuzes (providers, headers, policies) is nuttig voor gebruikers zonder te veel attack surface te onthullen?
- Willen we een expliciete "roadmap naar E2EE" opnemen, of pas wanneer er commitment is op bouw?

## Volgende stap
- Concept-charter in 1 pager uitwerken op basis van drie beloftes.
- Concept copy-set valideren tegen `copy-instructions.md` en `ui-modals.md` guardrails.
- Plek in web + settings IA visueel schetsen (zonder nu te bouwen).
- Besluiten over scope: landing-only eerste versie vs. landing + app gelijk.

---

## Structured Export And Obsidian Archive

# Structured export and Obsidian archive package

## Status
candidate

## Type
product

## Horizon
next

## Korte samenvatting
Breid de huidige export uit met een tweede pad naast single-file markdown: een server-side structured export job die een Obsidian-compatibel archief oplevert met logische mapstructuur (jaar/maand/week/dag/moment), wiki-link clusters en optionele audio-export wanneer audio-opslag actief is en bestanden beschikbaar zijn.

## Probleem
- De huidige export levert één markdownbestand; dat is goed voor snel bewaren, maar beperkt voor kennisopbouw en hergebruik in Obsidian.
- Er is nog geen export die hiërarchie en node-clusters expliciet maakt (jaar > maand > week > dag > moment).
- Audio-opnames kunnen nu in de app bewaard worden, maar er is geen consistente manier om die in export mee te nemen als bronmateriaal.
- Multi-file export client-side is kwetsbaar en minder schaalbaar; het past beter in server-side background verwerking.

## Waarom interessant
- Sluit direct aan op bestaande exportflow, user preferences en `user_background_tasks` patroon.
- Versterkt de commerciële brug van capture naar herbruikbare output zonder productverbreding naar nieuwe formaten.
- Geeft gebruikers een toekomstvaste, overdraagbare knowledge-export met duidelijke structuur.
- Houdt markdown-first uitgangspunt intact en blijft compatible met huidige workflows.

## Productvisie

### Pad 1 — Huidige single-file export blijft
- Bestaande “alles in één markdownbestand” blijft beschikbaar als snelle standaard.

### Pad 2 — Structured export (nieuw)
- Exportvorm met opties:
  - momenten
  - dagen
  - weken
  - maanden
  - audio meenemen (optioneel)
- Output:
  - één `.md` als netto output 1 bestand is
  - `.zip` als output meerdere bestanden bevat

### Obsidian-compatibele opbouw
- Root `README.md` met overzicht, selectie, tellingen en warnings.
- Mappen per jaar/maand/week/dag/moment met consistente bestandsnamen.
- Wiki-link netwerken tussen notities zodat graph-clusters zichtbaar worden.

## Voorstel outputstructuur

```text
budio-export-YYYYMMDD-HHmm.zip
  README.md
  00-overzicht/
    README.md
  2026/
    README.md
    2026-04-april/
      README.md
      maanden/
        2026-04-april-maandoverzicht.md
      weken/
        2026-W16-20260413-tm-20260419-weekoverzicht.md
      dagen/
        2026-04-19-zaterdag/
          README.md
          20260419-dag.md
          momenten/
            20260419-0831-spraak-korte-slug.md
            20260419-1412-tekst-korte-slug.md
          audio/
            20260419-0831-spraak-korte-slug.m4a
```

## Relatie met huidige code-realiteit
- Export nu: client-side in `app/settings-export.tsx` + `services/export.ts`.
- Background-task patroon bestaat al in importflow (`user_background_tasks`).
- Audio metadata bestaat al op `entries_raw` (`audio_storage_path`, `audio_mime_type`, etc.) en opslag via private `entry-audio` bucket.
- Nog niet aanwezig: dedicated server-side export function, export artifact bucket en structured zip packaging.

## Architectuurvoorstel (richting)
- Structured export als server-side edge function met background-task updates.
- Hergebruik `user_background_tasks` met `task_type = archive_export`.
- Artifact opslaan in private export bucket (bijv. `user-exports`) met user-scoped pad.
- Download via signed URL / artifact reference.

## Scope (wel / niet)

### Wel
- Markdown-only output.
- Structured map + bestandsnaamconventies.
- Optionele audio-export als bestanden aanwezig zijn.
- Root README + relinkbare note-hiërarchie.

### Niet (in deze ronde)
- Geen pdf/html/json/docx export.
- Geen directe vault sync of lokale Obsidian pad-koppeling.
- Geen file-manager productlaag in app.
- Geen audio-transcoding pipeline.

## Mogelijke impact
- product
- ui
- services
- supabase
- docs

## Open vragen
- Welke zip-library is het meest robuust in Supabase Edge/Deno runtime?
- Hoe lang bewaren we export artifacts in storage (retentie/cleanup)?
- Hoe tonen we warnings (bijv. ontbrekende audio bestanden) in UI en README consistent?
- Welke minimale linkset levert de beste Obsidian graph zonder overlinking?

## Volgende stap
- Als afgebakende multi-file implementatieronde plannen:
  1. task/result contract uitbreiden
  2. server-side export job bouwen
  3. structured markdown generator + zip
  4. app export-ui met mode/checkboxes + status/download

---

## Aiqs Modular Flow Control Plane

# AIQS modular flow control plane

## Status
idea

## Type
ai-aiqs

## Horizon
next

## Korte samenvatting
Breid AIQS uit van task-first admin-governance naar flow-family control plane met module-specifieke contracts, evaluatie en routing.

## Probleem
Eén uniforme AI-tasklaag dekt niet goed de verschillende domeinen (dagboek, code/projectflow, podcast/coaches).

## Waarom interessant
Hogere kwaliteitscontrole per domein en minder ruis in prompts, evaluaties en releasebesluiten.

## Relatie met huidige docs
- Bouwt voort op `docs/project/ai-quality-studio.md`.
- Sluit aan op future-state research en modular workspace idee.

## Mogelijke impact
- aiqs
- services
- supabase
- docs

## Open vragen
- Welke flow-families worden canoniek als eerste ondersteund?
- Hoe houd je shared governance zonder flow-specifieke flexibiliteit te verliezen?

## Volgende stap
Pilot op één extra flow-family naast journal-flow met aparte contracts en evaluatiecriteria.

---

## Source Aware Routing And Evaluation

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

---

## Lean Project Operating System For Repo

# Lean project operating system voor repo-uitvoering

## Status
candidate

## Type
platform-architecture

## Horizon
now

## Korte samenvatting
Structureer `docs/project/**` als lean operating system met expliciete lagen voor strategy, planning, status, productwaarheid en ideeën.

## Probleem
Strategie, planning, status en ideeën stonden verspreid, waardoor focus en traceerbaarheid onder druk staan.

## Waarom interessant
Minder context-switching, betere uitvoerdiscipline, eenvoudiger automatisering (o.a. VS Code plugin).

## Relatie met huidige docs
- Raakt `docs/project/README.md` en alle planning/ideas docs.
- Versterkt bestaande canonieke docs zonder scope-inhoud te herschrijven.

## Mogelijke impact
- docs

## Open vragen
- Welke minimale metadata-standaard is nodig voor plugin-readability?

## Volgende stap
Operating system in docs doorzetten en bundelstrategie hierop refactoren.

---

## Vscode Project Copilot Plugin

# VS Code project copilot plugin

## Status
idea

## Type
platform-architecture

## Horizon
next

## Korte samenvatting
Een repo-specifieke VS Code plugin die planning, docs, status en codecontext samenbrengt als bouwassistent.

## Probleem
Informatie over scope, status, planning en code zit nu verspreid; dat kost focus tijdens bouwen.

## Waarom interessant
Sneller van idee naar implementatie, minder context-switching, hogere consistentie met projectguardrails.

## Relatie met huidige docs
- Leunt op `docs/project/**`, `docs/dev/**` en later op nieuwe uploadbundels.

## Mogelijke impact
- docs
- tooling

## Open vragen
- Welke functies moeten lokaal-only blijven?
- Welke functies moeten via API/MCP praten met runtime-context?

## Volgende stap
Scope opdelen in MVP-plugin (read/assist) vs latere automation (write/execute).

---

## Budio Modular Intelligence Workspace

# Budio modular intelligence workspace

## Status
idea

## Type
platform-architecture

## Horizon
later

## Korte samenvatting
Budio evolueert naar een modulair intelligence workspace-model waarin elke flow een eigen oplossing heeft voor context, AI-calls en evaluatie.

## Probleem
Eén generieke AI-oplossing over alle domeinen leidt tot ruis, contractconflicten en slechte UX-fit.

## Waarom interessant
Flow-specifieke kwaliteit, betere governance en duidelijkere productpositionering per doelgroep.

## Relatie met huidige docs
- Sluit aan op research future-state docs en AIQS-governance.
- Moet buiten huidige MVP-claim blijven totdat expliciet gepland.

## Mogelijke impact
- product
- aiqs
- services
- docs

## Open vragen
- Welke flow-families krijgen als eerste prioriteit?
- Hoe scheid je shared platformlaag vs flow-specifieke laag technisch?

## Volgende stap
Flow-families definiëren met minimale contractset per module.

---

## Vscode Plugin With Budio Runtime Bridge

# VS Code plugin met Budio runtime bridge (MCP + API)

## Status
idea

## Type
platform-architecture

## Horizon
next

## Korte samenvatting
Ontwerp een bridge waarbij de VS Code plugin repo-context combineert met runtime-context uit Budio via MCP (tool/resources) en API (persistente state).

## Probleem
Losse lokale context is onvoldoende voor structurele samenwerking op ideeën, planning en flowstatus.

## Waarom interessant
Beter samenwerken tussen bouwen in code en denken/plannen in Budio-runtime zonder alles in één kanaal te duwen.

## Relatie met huidige docs
- Sluit aan op planning/ideas operating system.
- Raakt AIQS-governance en latere flow-modularisatie.

## Mogelijke impact
- tooling
- services
- aiqs
- docs

## Open vragen
- Welke data gaat via MCP resources en welke via API endpoints?
- Welke auth/safety grenzen gelden tussen lokale dev en productiecontext?

## Volgende stap
Contractmatrix opstellen: use case -> MCP tool/resource -> API route -> permissies.

---

## Security Posture And Continuous Hardening

# Security posture and continuous hardening

## Status
idea

## Type
platform-architecture

## Horizon
next

## Korte samenvatting
Budio verwerkt hoog privacy-gevoelige content (dagboek, audio, conversaties, reflecties).
Daarom moet er een expliciet, herhaalbaar security-posture-spoor komen dat technische hardening, administratieve discipline en periodieke (AI-)pentesting combineert, zonder afhankelijk te zijn van dure enterprise-tools zoals Aikido.

Doel: "Nico-proof" vertrouwen — ook de meest kritische gebruiker durft zijn gedachten aan Budio toe te vertrouwen, omdat de barrières voor misbruik realistisch en aantoonbaar hoog zijn.

## Probleem
- Dagboek + AI + cloud raakt drie angstgebieden tegelijk: data-leak, AI-training met mijn data, cloud-compromise.
- Enterprise-tools (bijv. Aikido AI-pentest per release) zijn niet passend qua budget voor MVP/solo-fase.
- Zonder expliciet vastgelegd security-posture-spoor blijven hardening-acties adhoc en niet herhaalbaar.
- Zonder expliciete trust-communicatie denken (potentiële) gebruikers dat risico onbekend of onbeheerd is, ook als techniek redelijk op orde is.

## Waarom interessant
- Vertrouwen is het *product* voor een dagboek/journal-app, niet alleen een kwaliteitseigenschap.
- Goede baseline is haalbaar met grotendeels gratis/low-cost tooling (Supabase RLS, Vercel envs, Snyk free, GitHub secret scanning, TruffleHog, OWASP Mobile Top 10).
- Sluit direct aan op de research-richting `private/regulated` als premium differentiator.
- Geeft een basis voor latere enterprise-tier met zwaardere garanties zonder alles achteraf te herbouwen.

## Scope van dit idee (3 lagen + communicatie)

### Laag 1 — Technische barrières (code/runtime)
Focus op verifieerbare, reproduceerbare maatregelen:

1. **Row Level Security (RLS) als heilige laag**
   - Policies per tabel expliciet en getest.
   - Handmatig en geautomatiseerd testplan: "probeer data van andere user op te halen met geldige sessie".
   - RLS-test opnemen in verify-scripts of als periodieke smoke-check.

2. **Server-side secrets (geen client exposure)**
   - `OPENAI_API_KEY` en vergelijkbare keys blijven strikt in edge functions.
   - Regel uit `AGENTS.md` ("geen client-side OpenAI calls met geheime sleutels") expliciet onderdeel maken van security charter.
   - Geen admin-tokens in frontend; alle admin-acties via server-checks (`ADMIN_REGEN_ALLOWLIST_USER_IDS`, etc.).

3. **Transport en sessie**
   - HTTPS-only (Vercel default).
   - Sessietoken handling server-side; refresh en revoke-gedrag documenteren.
   - MFA als opt-in feature (email/OTP of TOTP) voor hoog-risico gebruikers.

4. **Client-side end-to-end encryptie (E2EE) — toekomstig spoor**
   - Onderzoek encryptie van ruwe dagboektekst en audio vóór upload.
   - Device-bound of passphrase-derived keys (Argon2id / WebCrypto + SecureStore op native).
   - Consequenties: serverkant kan dan geen AI-normalisatie meer op ruwe tekst — vereist herontwerp van entry-normalization flow (ofwel on-device AI, ofwel expliciete "decrypt-only-for-process" modellen).
   - Expliciet als aparte research-spike plannen, niet mengen met basis-hardening.

5. **Audio en storage**
   - Private storage buckets (al aanwezig voor `entry-audio`) met strakke RLS/ACL policies.
   - Signed URLs met korte TTL (nu 15 min — bevestigd in `services/day-journals.ts`).
   - Retentie-/opslagkeuze expliciet in `user_preferences` (al aanwezig), met duidelijke UX-consequenties.

6. **Supabase hardening baseline**
   - `search_path` fixes (al gedaan) als recurring check.
   - Geen `service_role` key in frontend of mobile build.
   - Migratie-review op RLS impact verplicht bij elke schema-wijziging.

7. **Vercel hardening baseline**
   - Strikte env-variable scoping (Preview vs. Production).
   - Headers: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP (minstens report-only start).
   - Disable preview-deploy public exposure van gevoelige paden.

### Laag 2 — Administratieve beveiliging (secrets & operations)
1. **Secrets hygiëne**
   - `.env.local` + `.env.local.example` als lokale bron (al aanwezig).
   - Geen secrets in git; pre-commit check met TruffleHog of git-secrets.
   - GitHub secret scanning + push protection inschakelen.
2. **Key rotation policy**
   - Kwartaallijkse rotatie voor `OPENAI_API_KEY`, Supabase service-keys, admin tokens.
   - Rotatieprocedure vastleggen als runbook in `docs/dev/**`.
3. **Access control**
   - Allowlists via env-vars blijven canoniek (`ADMIN_REGEN_ALLOWLIST_USER_IDS`, `ADMIN_REGEN_INTERNAL_TOKEN`).
   - Minimale aantal mensen met prod-toegang; 2FA verplicht op GitHub, Supabase, Vercel, Expo, OpenAI.
4. **Backup / recovery**
   - Supabase point-in-time recovery status expliciet documenteren.
   - Handmatige restore-test minstens jaarlijks.

### Laag 3 — Periodieke (AI-)pentest / verification (betaalbaar)
Doel: zonder Aikido AI-pentest-licentie toch consistente, herhaalbare security-verificatie.

1. **Static/dep scanning (CI of lokaal)**
   - `npm audit` als minimale stap.
   - Snyk Open Source (free tier) voor dependency CVEs.
   - GitHub Dependabot actief.
2. **Secret scanning**
   - TruffleHog als pre-push of CI-check.
   - GitHub secret scanning push-protection aan.
3. **Mobile & web app review**
   - OWASP Mobile Top 10 als review-checklist per release-stap.
   - OWASP ASVS L1 als baseline voor web-auth/api.
4. **Supabase RLS test harness**
   - Scripts die als "andere user" proberen te lezen/schrijven; falen = geen regressie.
   - Onderdeel van `scripts/verify-local-*` pad of nieuw `scripts/verify-rls.sh`.
5. **Lightweight AI-pentest**
   - Handmatige LLM-prompt injection tests op AIQS-acties en edge functions die met OpenAI praten.
   - Testcases voor:
     - prompt-injection via entry-input ("ignore previous instructions" patterns)
     - data-exfiltratie via prompt-inclusief gebruikersinhoud
     - context-bleed (krijgt user A ooit user B content terug?)
   - Eerst handmatig vastleggen; pas automatiseren als er duidelijke ROI is.
6. **Bug bounty / security.txt (later)**
   - `security.txt` publiceren met contactpad.
   - Optioneel small bounty via HackerOne/Intigriti wanneer productie-gebruikersbasis groeit.

## Trust communication (expliciet)
Zie ook het productidee `40-ideas/10-product/40-trust-and-security-charter.md` voor de gebruikersgerichte uitwerking.

Kernpunten om later in web en in-app te communiceren:
- **Jouw ogen alleen**: wat is versleuteld, hoe en met welke sleutels.
- **AI zonder oordeel**: OpenAI zero-retention / no-training setting voor API gebruik expliciet maken.
- **Open kaart**: welke providers (Supabase, Vercel, OpenAI) en waarom.
- **Exit/controle**: export + delete-all blijven first-class rechten (al aanwezig in 1.2D).

## Relatie met huidige code-realiteit
- Bestaand sterk punt: admin-only afscherming via allowlist + server-side checks (`app/settings-regeneration.tsx`, functions).
- Bestaand sterk punt: `OPENAI_API_KEY` strikt server-side per `AGENTS.md`.
- Bestaand sterk punt: private `entry-audio` bucket met signed URLs.
- Gap: geen expliciete RLS-test harness, geen documented pentest-ritme, geen security charter voor gebruikers.
- Gap: geen expliciete key-rotation runbook.
- Gap: E2EE nog niet onderzocht; betekent dat Budio-operators technisch dagboek-text kunnen zien.

## Relatie met AIQS
- AIQS-promptpaden zijn admin-only; toch moet AI-pentest expliciet ook hier landen (prompt-injection via runtime invoer).
- Source-aware routing (zie `40-ideas/30-ai-and-aiqs/50-source-aware-routing-and-evaluation.md`) vergroot attack surface (conversatie-input) en vraagt vooraf expliciete guardrails.

## Mogelijke impact
- services
- supabase
- docs
- product (trust-communicatie)
- aiqs (prompt-injection hardening)
- infra / tooling (CI, scanning, secrets)

## Open vragen
- E2EE vs. server-side AI-verwerking: accepteren we dat Budio baseline níet E2EE is, mét expliciete transparantie, en maken we E2EE een later premium spoor?
- Welke minimale RLS-test harness is haalbaar in `scripts/verify-local-*` zonder runtime fragility?
- Welke pentest-cadans is realistisch (elke minor, elke major, kwartaal)?
- Wanneer introduceren we `security.txt` en responsible disclosure pad?
- Welke onderdelen landen in `docs/project/**` (canoniek) vs `docs/dev/**` (runbook/tooling)?

## Volgende stap
- Security charter opstellen als product-facing doc (via separate idea doc).
- Runbook/checklist voor hardening in `docs/dev/security-hardening.md` concipiëren (niet nu, pas na akkoord).
- Minimale RLS-smoke-check-spike inschatten (tijd/impact).
- Beslissen of E2EE een Later-spoor wordt of op Next komt als Private-tier-enabler.

---

## Budio Pro Markdown Workspace And Obsidian Export

# Budio Pro markdown workspace en Obsidian export (later)

## Status
idea

## Type
platform-architecture

## Horizon
later

## Korte samenvatting
Leg een later-spoor vast voor Budio Pro waarin developers/IT-teams ideeën en projectoutput als markdown-workspace kunnen beheren, met mogelijke export/koppeling naar Obsidian.

Belangrijk:
- dit is nu **geen** productiesync-feature
- dit is nu **geen** bron van waarheid
- dit is een later integratie-/exportspoor

## Probleem
- Developers/IT-teams willen brainstorms, beslissingen en output soms in markdown-workspaces doorontwikkelen.
- Obsidian wordt vaak gebruikt als denk-/structuurlaag voor kenniswerk.
- Zonder expliciete afbakening ontstaat verwarring tussen:
  - repo-waarheid
  - app-runtime data
  - externe workspace-notes

## Waarom interessant
- Sluit aan op Budio Pro-richting voor krachtigere output- en workflowlagen.
- Biedt potentieel sterke waarde voor technische gebruikers zonder huidige MVP te verstoren.
- Houdt huidige scope clean: eerst repo/docs zichtbaar in Obsidian als lokale workflowlaag; pas later export/integratie.

## Richting (later)
1. **Export-first**
   - Eénrichtings-export vanuit Budio Pro naar markdown-workspace.
   - Geen bidirectionele sync als start.
2. **Workspace target abstraction**
   - Obsidian als één target naast mogelijke andere markdown-workspaces.
3. **Duidelijke waarheidshiërarchie**
   - Repo/docs blijven projectwaarheid.
   - Externe workspace is werk-/consumptielaag.
4. **Admin/operator eerst**
   - Start met admin/dev use-cases, niet direct als eindgebruikersfeature.

## Relatie met huidige situatie
- Huidig Obsidian settingspad is admin-only en lokaal georiënteerd (`app/settings-obsidian.tsx`).
- Dit biedt nu nog geen productie-sync; dat is expliciet buiten scope.
- Voor huidige fase geldt: repo docs direct zichtbaar maken in Obsidian als editorlaag (lokale workflow) is voldoende.

## Mogelijke impact
- product
- services
- docs
- platform

## Open vragen
- Blijft dit export-only, of later selective import?
- Welke markdown-structuur is stabiel genoeg voor Budio-output?
- Hoe voorkomen we truth-drift tussen repo, app en workspace?
- Welke security/privacy eisen gelden bij externe workspace-targets?

## Volgende stap
- Later: conceptspec voor export-only markdown workspace in Budio Pro, met expliciete truth-boundaries en conflictbeleid.
