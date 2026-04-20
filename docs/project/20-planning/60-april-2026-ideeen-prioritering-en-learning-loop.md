# April 2026 — Ideeënprioritering, roadmap en learning loop

> Noot (2026-04-20): deze prioritering blijft als historische onderbouwing bestaan, maar de actieve roadmap is formeel herijkt naar de gesplitste strategie (`Jarvis` internal-only + `Knowledge Hub + AIQS` publiek-relevant). Raadpleeg hiervoor primair `20-active-phase.md`, `30-now-next-later.md` en `10-roadmap-phases.md`.

## Doel

Deze notitie vertaalt de april-2026 ideeënlijst naar een uitvoerbare, scopebewuste roadmap die past binnen de huidige productkaders:

- capture-first
- dagboeklaag centraal
- evidence-first iteratie
- geen verbreding naar brede assistent/chat/agent in de huidige fase

## Besliscriteria

Per idee zijn twee scores toegekend op schaal 1-5:

- **MVP-waarde**: essentieel voor eerste lancering van Budio Vandaag?
- **Strategische fit**: draagt het direct bij aan builder-onafhankelijkheid, brongetrouwe contentcreatie en een houdbaar verdienmodel?

## Prioritering per idee

| Idee                                | MVP-waarde | Strategische fit | Categorie                           | Korte motivatie                                                           | Impact op huidige roadmap                           |
| ----------------------------------- | ---------- | ---------------- | ----------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| Momentopnames en transcriptie       | 5          | 5                | Core Roadmap (Nu)                   | Kern van de productbelofte: snel vastleggen en brongetrouw verwerken.     | Blijft P1 in 1.2B outputkwaliteit.                  |
| Multimodale bijlagen                | 2          | 4                | Future Expansion (Later)            | Waardevol voor rijkere context, maar te veel extra complexiteit voor MVP. | Pas na stabiele kernflow.                           |
| Swipe-navigatie                     | 4          | 4                | Core Roadmap (Nu)                   | Versterkt rustig teruglezen over momenten/dagen/weken/maanden.            | UX-polish binnen huidige hardening.                 |
| Walkthrough-gids                    | 3          | 3                | Future Expansion (Later)            | Nuttig voor onboarding, niet kritisch voor kernwaarde.                    | Alleen oppakken bij aantoonbare onboarding-frictie. |
| Leren van correcties (diffs)        | 4          | 5                | Core Roadmap (Nu)                   | Bouwt een kwaliteitsflywheel op basis van echte correcties.               | Nu als admin-governed learning loop via AIQS.       |
| To-do lijst integratie              | 1          | 2                | Non-Strategic                       | Trekt richting agenda/reminder-product i.p.v. dagboekmachine.             | Nu niet meenemen; scope-creep risico.               |
| Historisch geheugen (Neocortex/HTM) | 1          | 3                | Internal Learning & Experimentation | Interessant R&D-spoor, maar niet nodig voor MVP-bewijs.                   | Alleen intern experimenteren.                       |
| Themadetectie en categorisering     | 2          | 4                | Future Expansion (Later)            | Sterk voor archiefstructuur, maar geen launch-noodzaak.                   | Post-MVP verrijkingslaag.                           |
| Automatische tagging                | 2          | 4                | Future Expansion (Later)            | Verhoogt vindbaarheid en hergebruik, niet kern voor eerste release.       | Later bovenop stabiele dagboeklaag.                 |
| Relatie- en profielanalyse          | 1          | 2                | Non-Strategic                       | Stuurt richting personal CRM/life graph buiten huidige claim.             | Parkeren.                                           |
| Datumlogica verbetering             | 4          | 5                | Core Roadmap (Nu)                   | Essentieel voor brongetrouwe tijdsinterpretatie in dag- en reflectielaag. | Hoort direct in 1.2B kwaliteitsset.                 |
| Lokaal LLM (privacy)                | 2          | 3                | Internal Learning & Experimentation | Strategisch interessant, maar technisch zwaar voor huidige fase.          | Alleen intern op beperkte subtaken.                 |
| Cinematic podcast generatie         | 1          | 4                | Future Expansion (Later)            | Sterk voor later creator-spoor, maar buiten huidige MVP-kern.             | Pas na bewezen review-first outputbrug.             |
| Social Media Agent                  | 1          | 3                | Future Expansion (Later)            | Als volledige agent te breed; als draft-assist later mogelijk.            | Later, eerst review-first drafts zonder autopost.   |
| Stijl-analyse (tweede brein)        | 2          | 4                | Future Expansion (Later)            | Interessant voor authenticiteit in output, niet noodzakelijk voor launch. | Later als outputverrijking.                         |
| Fotogeneratie templates             | 1          | 3                | Future Expansion (Later)            | Zinvol na bewezen output/publicatieflow, niet eerder.                     | Lage prioriteit in huidige fase.                    |
| AI Quality Studio                   | 4          | 5                | Core Roadmap (Nu)                   | Cruciale admin-only kwaliteits- en governance-laag.                       | Verdiepen voor compare/evaluatie/traceability.      |
| Business-variant voor creatieven    | 1          | 4                | Future Expansion (Later)            | Interessante productvariant na bewezen founder- en creator-wedge.         | Later productspoor, niet nu.                        |
| Token-verdienmodel                  | 4          | 5                | Core Roadmap (Nu)                   | Financiële onafhankelijkheid vraagt directe usage- en kostenmeting.       | Nu metering, pricing/tiering pas later live.        |

## Categorie-overzicht

### Core Roadmap (Nu)

1. Momentopnames en transcriptie
2. Swipe-navigatie
3. Leren van correcties (diffs)
4. Datumlogica verbetering
5. AI Quality Studio
6. Token-verdienmodel (minimaal als interne meteringlaag)

### Internal Learning & Experimentation

1. Historisch geheugen (Neocortex/HTM)
2. Lokaal LLM (privacy)

### Future Expansion (Later)

1. Multimodale bijlagen
2. Walkthrough-gids
3. Themadetectie en categorisering
4. Automatische tagging
5. Cinematic podcast generatie
6. Social Media Agent (eerst als draft-assist)
7. Stijl-analyse
8. Fotogeneratie templates
9. Business-variant voor creatieven

### Non-Strategic

1. To-do lijst integratie
2. Relatie- en profielanalyse

## Vernieuwd roadmap-overzicht

### Fase A — Nu: consumer beta hardening + meetbare betrouwbaarheid

Doel: kernlus betrouwbaar, brongetrouw en kosteninzichtelijk maken.

- transcriptie-hardening
- datumlogica correctheid
- correctie-diff vastlegging
- swipe-navigatie polish
- AIQS compare/evaluatie voor kwaliteitsverbeteringen
- token/cost metering per AI-task

### Fase B — Next: review-first brugpilot naar output

Doel: valideren of de bestaande bronlaag bruikbare creator-output kan leveren.

- review-first content transforms vanuit entry/day
- kleine outputformats testen (post-draft/script-aanzet)
- geen scheduler/autopost/multi-channel publishing
- stijlconsistentie beperkt verkennen

### Fase C — Later: uitbreiding boven bewezen kern

- multimodale bijlagen
- tagging/themadetectie
- style layer
- social draft tooling
- business-variant voor creatieven/coaches

### Fase D — Parallel learning tracks (intern)

- lokaal LLM
- HTM/neocortex

Deze tracks leveren leerwinst, maar zijn geen releaseverplichting.

## Learning loop (bindende werkwijze)

1. **Capture**: rauwe input via audio/tekst.
2. **Process**: transcriptie, cleanup, dagboekopbouw.
3. **Review**: gebruiker/admin signaleert fouten of stijlverlies.
4. **Diff capture**: correcties als gestructureerde feedback vastleggen.
5. **AIQS compare**: kandidaatprompt/run vergelijken met runtime-baseline.
6. **Decision**: alleen uitrollen bij aantoonbare winst.
7. **Cost gate**: token- en latency-impact meewegen vóór uitrol.

## Token- en kosteneconomie (nu starten)

### Nu verplicht meten

Per AI-task (`entry_cleanup`, `day_narrative`, `reflection`, latere transforms):

- model
- input/output tokens
- geschatte kosten
- latency
- retry/rerun rate
- kwaliteitsuitkomst (bijv. correctiedruk)

Per gebruiker/segment:

- captures per dag/week/maand
- tokens per actieve gebruiker
- kosten per actieve gebruiker
- heavy-user patronen

### Fasering verdienmodel

1. **Nu**: interne metering en besluitinformatie (geen brede pricinglaunch).
2. **Next**: beperkte bundel-/top-up hypotheses valideren.
3. **Later**: expliciete tiering en pricing-activering op basis van bewijs.

## Obsidian links

- [[20-active-phase|Active phase]]
- [[30-now-next-later|Now / Next / Later]]
- [[40-deviations-and-decisions|Deviations and decisions]]
- [[50-budio-workspace-plugin-focus|Budio Workspace plugin focus]]
- [[../open-points|Open points]]
- [[../40-ideas/README|Ideas workspace]]
