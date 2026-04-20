# Wispr Flow + NotebookLM benchmark (na AIQS-live)

## Doel

Gericht concurrentie- en inspiratieonderzoek om expliciet te beslissen wat Budio (app + AIQS) moet:

- kopieren
- aanpassen
- niet als markt/doel nemen

Deze benchmark is een researchspoor en geen actieve bouwscope.

## Timing en gate

- Startmoment: na AIQS-live.
- Harde voorwaarde: geen uitvoering in huidige `Now`-scope.
- Planningstatus: `Next` als competitor benchmark sprint.

## Bronnen (vastgelegd op 20 april 2026)

Wispr Flow:

- Content creators: [wisprflow.ai/content-creators](https://wisprflow.ai/content-creators)
- Product homepage: [wisprflow.ai](https://wisprflow.ai/)
- Features: [wisprflow.ai/features](https://wisprflow.ai/features)
- Pricing: [wisprflow.ai/pricing](https://wisprflow.ai/pricing)
- Styles setup docs: [docs.wisprflow.ai/styles](https://docs.wisprflow.ai/articles/2368263928-how-to-setup-flow-styles)
- Data controls/privacy mode: [wisprflow.ai/data-controls](https://wisprflow.ai/data-controls)

NotebookLM (officiele Google bronnen):

- Audio + YouTube source support en citations context: [blog.google/notebooklm-audio-video-sources](https://blog.google/innovation-and-ai/products/notebooklm-audio-video-sources/)
- Audio overviews (50+ talen): [blog.google/notebooklm-audio-overviews-50-languages](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-audio-overviews-50-languages/)
- Video + uitgebreide audio overviews (80 talen): [blog.google/notebook-lm-audio-video-overviews](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebook-lm-audio-video-overviews-more-languages-longer-content/)
- Upgrades/enterprise limits: [support.google.com/notebooklm/answer/16213268](https://support.google.com/notebooklm/answer/16213268)

## Decision matrix (verplicht)

| Patroon | Probleem | Gebruikerswaarde | Budio-fit | AIQS-impact | Risico's | Effort | Beslisadvies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Contextafhankelijke stijlprofielen (personal/work/email/other) | Zelfde schrijfstijl werkt niet voor vrienden, werk en klanten | Sneller bruikbare tekst, minder nabewerking | Hoog voor Budio app capture-output en latere Pro use-cases | Vereist evaluatie op toonconsistentie en context-routing | Te agressieve stijlcorrectie kan authenticiteit verlagen | Medium | aanpassen |
| Auto cleanup-levels (none/light/med/high) | Huidige cleanup voelt te zwart/wit voor verschillende voorkeuren | Gebruiker kiest controle vs polish per context | Hoog, direct op capture-ervaring | Vraagt duidelijke quality contracts per level | Onvoorspelbare output als levels niet scherp begrensd zijn | Medium | kopieren |
| Personal dictionary + snippets | Namen/jargon en herhaalzinnen kosten tijd en veroorzaken fouten | Hogere nauwkeurigheid, minder correcties, sneller versturen | Hoog, sluit aan op creator/builder workflows | AIQS kan correctie-diffs en precision-scores sturen | Privacy en databeheer rond persoonlijke termen | Medium | aanpassen |
| Cross-device sync-ervaring | Frictie als voorkeuren per device verschillen | Continuiteit tussen telefoon, desktop en workflowmomenten | Hoog, belangrijk voor daily habit | AIQS moet configversie en outputverschillen kunnen verklaren | Sync-conflicten en inconsistent gedrag per platform | Hoog | aanpassen |
| Source-grounding + citations output trust | AI-output zonder bronvertrouwen is zwak voor kenniswerk | Meer vertrouwen, betere review en minder hallucinatierisico | Zeer hoog, kern van AIQS + Knowledge Hub richting | Centrale evaluatielaag voor grounding/citation coverage | Complexiteit in source-ingest en eval-ontwerp | Hoog | kopieren |

## Wat niet onze markt is (nu)

- Full-autonomous content agents als primaire belofte.
- "Alleen dictatie" als productidentiteit zonder knowledge/governance-laag.
- Broad-market positionering "voor iedereen" i.p.v. wedge op builders/podcasters.

## Strategische uitkomstregels

1. `kopieren` of `aanpassen` promoveert niet direct naar taak.
2. Volgorde blijft: research -> idea/epic-candidate -> promotiecriteria -> task.
3. Alles blijft Budio app + AIQS-context; Jarvis alleen bij expliciet afgeleid researchspoor.
4. Onderzoek focust op productpatronen, niet op 1-op-1 UI-klonen of merkcopy.

## Volgende stap

Na AIQS-live een timeboxed benchmark sprint starten (research-only), en per patroon een promotiebesluit nemen:

- door naar idea refinement
- parkeren als later
- expliciet afwijzen als niet-onze-markt
