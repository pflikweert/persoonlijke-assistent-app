# Persoonlijke Assistent App — Master Project (Canoniek)

## Doel van dit document
Dit is het hoofd-document voor:
- productdefinitie
- scopegrenzen
- fasekaart
- huidige uitvoervolgorde

Dit document is leidend samen met:
- `docs/project/product-vision-mvp.md`
- `docs/project/content-processing-rules.md`

Designbeslissingen blijven leidend in:
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/**`

## Productkern
De app is een persoonlijke contextmachine:
- capture via tekst en audio
- server-side verwerking naar bruikbare entries
- opbouw van één canonieke dagboeklaag per dag
- week- en maandreflecties op basis van die dagboeklaag

Kernbelofte:
- snel vastleggen
- rustig teruglezen
- later overzicht zonder handmatig knip- en plakwerk

## Harde scopegrens (MVP)
In scope:
- auth (magic link)
- tekstcapture en audiocapture
- transcriptie voor audio
- entry normalisatie
- day journal opbouw per kalenderdag
- week- en maandreflecties
- kernschermen: Vandaag, Vastleggen, Dagen, Dagdetail, Reflecties

Buiten scope:
- brede chat/coach/agent-ervaring
- retrieval/Q&A en vector search
- document intelligence en brede uploadsuite
- taken/agenda/reminders
- realtime voice als productmodus

## Productprincipes
1. Capture-first: vastleggen moet laagdrempelig en snel zijn.
2. Dagboeklaag leidend: day journal is de canonieke productlaag.
3. Bron en AI-output gescheiden: ruwe bron blijft herleidbaar.
4. Reflectie boven pseudo-intelligentie: eerst kwaliteit en betrouwbaarheid.
5. Geen scope-creep naar brede assistent in MVP.

## Huidige code-realiteit (samengevat)
Aantoonbaar aanwezig in code:
- auth, capture (tekst/audio), processing, day journals, reflecties
- edge functions: `process-entry`, `regenerate-day-journal`, `renormalize-entry`, `generate-reflection`
- dagdetail mutaties (edit/delete) met heropbouw van afgeleide lagen

Ook aanwezig, maar niet leidend voor kernscope:
- ChatGPT markdown importpad via instellingen + edge function (`import-chatgpt-markdown`)
- dit pad is feature-flagged en moet niet gelezen worden als verbreding naar brede chatapp

Niet aangetroffen als productfeature:
- gebruikersgerichte export/backupflow
- gebruikersgerichte reset/delete-all flow

## Fasehistorie
- Fase 0: setupbasis
- Fase 1: kernlus (auth → capture → verwerking → day journal → reflectie)
- Huidige hardeningfase: Fase 1.2

## Fase 1.2 (hardening, geen featureverbreding)
Fase 1.2 is pre-release hardening van de bestaande kern, niet een nieuwe productrichting.

### Subfases met huidige status
| Subfase | Doel | Status (code) | Toelichting |
|---|---|---|---|
| 1.2A Stabiliteit/foutafhandeling | deterministische flow + tracing + verify | **Deels aanwezig** | request/flow logging en verify scripts aanwezig; afronding als geheel niet hard bewezen. |
| 1.2B Outputkwaliteit | betere narrative/reflection kwaliteit | **Deels aanwezig** | contracts, guardrails en quality-checks aanwezig; geen harde “afgerond”-markering als complete set. |
| 1.2C UX-polish | rustiger kernflows zonder feature-uitbreiding | **Deels aanwezig** | veel loading/empty/error states aanwezig; volledige uniformiteit niet hard bewezen. |
| 1.2D Vertrouwen (export/reset) | eigenaarschap via export/reset-basis | **Niet aangetroffen** | alleen dev/export tooling gevonden, geen gebruikersfeature in app-flow. |
| 1.2E Private-beta readiness | overdraagbaarheid, checks, checklist | **Deels aanwezig** | setup + verify aanwezig; complete smoke/release-checklist als afgeronde set niet hard bewezen. |

Statuslabels:
- Aanwezig = hard aantoonbaar in code
- Deels aanwezig = aantoonbare onderdelen, maar niet volledig bewezen als afgeronde subfase
- Niet aangetroffen = geen productimplementatie gevonden
- Onzeker = bewijs onvoldoende

## Juiste huidige uitvoervolgorde
1. 1.2A stabiliteit en foutafhandeling
2. 1.2B outputkwaliteit
3. 1.2C UX-polish
4. 1.2D export/reset op productniveau
5. 1.2E private-beta readiness

## Open beslisregels voor deze fase
- Geen nieuwe architectuur voor de app.
- Geen verbreding naar brede chat/coach/agent.
- Geen runtime featurewerk buiten bestaande scope.
- Twijfelgevallen blijven expliciet “onzeker” tot bewijs in code/docs.

## Bekende spanningen tussen plan en realiteit
1. Productvisie noemt een kleine directe assistentlaag na capture.
   - Status: **deels/onzeker** als aparte expliciete featurelaag.
   - Wel aanwezig: entry-completion en afgeleide verwerking.
   - Niet hard aangetroffen: zelfstandige, duidelijk afgebakende post-capture assistentmodule.

2. Export/reset stond gepland in 1.2D.
   - Status: **niet aangetroffen** als gebruikersfeature.
   - Wel aanwezig: developer dumps en verify tooling.

3. ChatGPT markdown import is gebouwd.
   - Status: **aanwezig** als feature-flagged importpad.
   - Positionering: ondersteunende ingest, geen wijziging van kernscope.

## Post-MVP / expliciet buiten huidige scope
- retrieval/Q&A over volledig archief
- vector en semantic search
- brede assistant/chatcoaching
- document intelligence als brede productlaag
- taken/agenda/reminder-suite

## Niet leidend / archive-only
- `docs/project/archive/**`
- `docs/design/archive/**`
- historische dumps in `docs/dev/archive/**`

## Samenvatting in één zin
De app blijft een capture-first dagboekmachine met day journals als hoofdwaarheid; Fase 1.2 draait om hardening van de bestaande kern, niet om verbreding naar een brede assistent.
