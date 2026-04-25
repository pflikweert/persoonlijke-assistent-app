# DO NOT EDIT - GENERATED FILE

# Budio Current Tasks

Build Timestamp (UTC): 2026-04-25T22:02:50.683Z
Source Commit: f044130

Doel: uploadbundle met huidige niet-done tasks uit `docs/project/25-tasks/open/**`.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Brondirectories
- docs/project/25-tasks/open/**

## Telling
- Totaal tasks opgenomen: 17

## Leesregel
- Dit is een uploadartefact en geen canonieke bron voor repo-uitvoering.
- Canonieke taskfiles blijven de bron in `docs/project/25-tasks/**`.

---

## 1.2B outputkwaliteit expliciteren en afronden

- Path: `docs/project/25-tasks/open/1-2b-outputkwaliteit-expliciteren-en-afronden.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-1-2b-outputkwaliteit
title: 1.2B outputkwaliteit expliciteren en afronden
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als voldoende goed geldt.
tags: [consumer-beta, outputkwaliteit]
workstream: app
due_date: null
sort_order: 4
---

















# 1.2B outputkwaliteit expliciteren en afronden

## Probleem / context

`current-status.md` markeert 1.2B als deels aanwezig.
De kwaliteitslaag bestaat functioneel, maar afrondcriteria en bewijsset zijn nog niet scherp genoeg vastgelegd.

## Gewenste uitkomst

Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als "voldoende goed" geldt.
De taak is klaar wanneer de criteria, verificatiestappen en bewijsregel helder genoeg zijn om 1.2B niet langer als impliciete restcategorie te laten hangen.

## Waarom nu

- Outputkwaliteit is een van de drie open gaten in de actieve transitiemaand.
- Zonder expliciete kwaliteitsset blijft releasebewijs te vaag.

## In scope

- Kwaliteitscriteria voor entry/day/reflection output aanscherpen.
- Verify- en bewijsverwachting expliciteren voor deze fase.
- Planning- en open-gap aansluiting bewaken.

## Buiten scope

- Brede Pro-outputformats of publicatiekanalen toevoegen.
- Nieuwe pricing-, usage- of control-plane laag activeren.

## Concrete checklist

- [ ] Kwaliteitscriteria voor huidige outputlaag uitschrijven.
- [ ] Verify- en bewijsverwachting per relevante flow expliciteren.
- [ ] Afrondcriterium voor 1.2B documentair vastleggen.

## Blockers / afhankelijkheden

- Afstemming met 1.2E beta-readiness zodat bewijsregels consistent blijven.

## Verify / bewijs

- Canonieke docs bijgewerkt.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/20-planning/20-active-phase.md`
```

---

## 1.2E beta-readiness expliciteren en afronden

- Path: `docs/project/25-tasks/open/1-2e-beta-readiness-expliciteren-en-afronden.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-1-2e-beta-readiness
title: 1.2E beta-readiness expliciteren en afronden
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft."
tags: [consumer-beta, beta-readiness]
workstream: app
due_date: null
sort_order: 3
---













# 1.2E beta-readiness expliciteren en afronden

## Probleem / context

`current-status.md` markeert 1.2E als deels aanwezig.
De smoke-checklist bestaat al, maar volledige runtime-doorloop en bewijsstandaard zijn nog niet als afgeronde readiness set verankerd.

## Gewenste uitkomst

Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.
De taak is klaar wanneer het team in één oogopslag ziet wat nog nodig is voor een overtuigende beta-readiness claim.

## Waarom nu

- Beta-readiness is een kernonderdeel van de nieuwe maandfocus.
- Zonder expliciete readinessset blijft de releasebeslissing diffuus.

## In scope

- Readinesschecklist structureren voor de huidige fase.
- Bewijsverwachting voor runtime- en UI-smokes expliciteren.
- Relatie met bestaande smoke-checklist aanscherpen.

## Buiten scope

- Nieuwe productsporen buiten consumer beta.
- Business/Private readiness of governanceverbreding.

## Concrete checklist

- [ ] Beta-readiness checklist structureren tot duidelijke fase-output.
- [ ] Bewijsregel per kernflow expliciteren.
- [ ] Resterende open items voor de beta-release zichtbaar maken.

## Blockers / afhankelijkheden

- Samenhang met 1.2B outputkwaliteit en de bestaande smoke-checklist.

## Verify / bewijs

- Canonieke docs bijgewerkt.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/20-planning/20-active-phase.md`
```

---

## AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)

- Path: `docs/project/25-tasks/open/aiqs-admin-interface-thema-herontwerp-spotify-openai-stijl.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-aiqs-admin-interface-thema-herontwerp
title: AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "Geef AIQS admin een helderder en strakker eigen thema, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools, met goede bruikbaarheid op telefoon en desktop."
tags: [aiqs, admin-ui, thema, design]
workstream: aiqs
due_date: null
sort_order: 6
---












# AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)

## Probleem / context

De huidige AIQS admin-interface werkt functioneel, maar voelt nog te complex en mist een heldere, strakke admin-uitstraling.
Voor dagelijkse tuning op mobiel en desktop is een duidelijker en consistenter admin-thema gewenst.

## Gewenste uitkomst

AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.
De interface ondersteunt prettig gebruik op telefoon én desktop/fullscreen, zonder de bestaande AIQS-governance of datastromen functioneel te verbreden.

## Waarom nu

- Deze stap maakt de tool sneller en prettiger inzetbaar na livegang van de huidige AIQS-variant.
- Het verlaagt frictie bij testen, beoordelen en tunen van prompts/calls.

## In scope

- Visuele/thematische herwerking van AIQS admin-gedeelte.
- Strakkere informatiehiërarchie en duidelijkere states/controls in adminschermen.
- Goede mode-aware uitwerking voor mobiel en desktop/fullscreen.
- Doorvertaling via bestaande shared UI-primitives waar passend.

## Buiten scope

- Nieuwe OpenAI-calls of uitbreiding van AIQS functionele scope.
- Nieuwe review- of evaluatieprocessen buiten bestaande flows.
- End-user themawijzigingen buiten admin-context.

## Concrete checklist

- [ ] Designrichting en referentieprincipes concretiseren voor AIQS admin.
- [ ] Belangrijkste AIQS adminschermen herstijlen met duidelijke hiërarchie.
- [ ] Mobiel + desktop/fullscreen gebruik valideren in light en dark mode.
- [ ] Regressiecheck op bestaande AIQS functionaliteit en admin-guardrails.
- [ ] Final polish + bewijs vastleggen tegen designrefs/acceptatie.

## Blockers / afhankelijkheden

- Bij voorkeur pas uitvoeren nadat loggingvalidatie + productie-livepad stabiel zijn.
- Afstemming met bestaande UI-guardrails en AIQS admin-only principes.

## Verify / bewijs

- Runtime/smoke-check AIQS admin in light en dark mode.
- Desktop/fullscreen + mobiel gebruikscheck met screenshots/bewijs.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/ethos_ivory/DESIGN.md`
```

---

## AIQS logging valideren in OpenAI dashboard en fallback-logpad

- Path: `docs/project/25-tasks/open/aiqs-logging-valideren-openai-dashboard-en-fallback.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-aiqs-logging-valideren-openai-dashboard-en-fallback
title: AIQS logging valideren in OpenAI dashboard en fallback-logpad
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Valideer dat AIQS logging voor bestaande OpenAI-calls leesbaar binnenkomt in het OpenAI API-dashboard, met werkende fallback-logging en een duidelijke 4-uurs logging-toggle in de admin UI."
tags: [aiqs, logging, openai, consumer-beta]
workstream: aiqs
due_date: null
sort_order: 7
---
















# AIQS logging valideren in OpenAI dashboard en fallback-logpad

## Probleem / context

Voor de huidige AIQS-testflow is logging al deels aanwezig, maar het is nog niet duidelijk genoeg of logging voor de bestaande OpenAI-calls daadwerkelijk zichtbaar en leesbaar is in de OpenAI dashboard-logging.
Daarnaast is onduidelijkheid in de huidige logging-UI (aan/uit-state en werking van de 4-uurs privacy-timebox) een blokkade voor betrouwbaar gebruik tijdens testen.

## Gewenste uitkomst

Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests in de praktijk traceerbaar zijn.
De fallback in eigen logging blijft aantoonbaar werken.

De logging-bediening in AIQS is helder en laagdrempelig: een duidelijke aan/uit-keuze met begrijpelijke statusweergave en expliciete 4-uurs vervaltijd, zodat direct duidelijk is of logging actief is.

## Waarom nu

- Dit is de basis om tijdens live testen gericht verbeteringen te kunnen doen.
- Zonder zichtbare logging blijft AIQS-iteratie te blind en te traag.
- Het ondersteunt de bewijs-gedreven afronding van de huidige consumer-beta fase.

## In scope

- Valideren dat bestaande AIQS-calls in OpenAI dashboard-logging terechtkomen en leesbaar zijn.
- Valideren dat fallback-logging voor dezelfde calls beschikbaar blijft.
- Logging-toggle/controls in AIQS admin vereenvoudigen en status expliciet maken.
- Expliciteren dat logging na 4 uur automatisch uitgaat (privacy-default).
- Runtime-bewijs vastleggen van logging aan/uit + zichtbaar resultaat.

## Buiten scope

- Nieuwe OpenAI-calls of uitbreiding van AI-task families.
- Uitbouw naar volledige observability-suite of nieuwe review-workflow.
- End-user loggingfeatures buiten AIQS admin.

## Concrete checklist

- [ ] Huidige loggingpaden voor AIQS-calls inventariseren (OpenAI dashboard + fallback).
- [ ] End-to-end valideren dat dashboard logging zichtbaar is bij actieve logging-toggle.
- [ ] Fallback logging valideren voor dezelfde flow en failure-/degradatiescenario.
- [ ] Logging-toggle UX versimpelen met duidelijke aan/uit-status en 4-uurs indicatie.
- [ ] Bewijs vastleggen met concrete testresultaten voor aan/uit-gedrag en zichtbaarheid.

## Blockers / afhankelijkheden

- Toegang tot productieomgeving en OpenAI API-dashboard loggingweergave.
- Afstemming met admin-only guardrails uit `docs/project/ai-quality-studio.md`.

## Verify / bewijs

- Runtime-validatie van logging aan/uit in AIQS admin.
- Aantoonbare logging in OpenAI dashboard voor bestaande calls.
- Aantoonbare fallback logging voor dezelfde testcases.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`
```

---

## AIQS productie live zetten voor bestaande OpenAI-calls

- Path: `docs/project/25-tasks/open/aiqs-productie-live-zetten-bestaande-openai-calls.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-aiqs-productie-live-zetten-bestaande-openai-calls
title: AIQS productie live zetten voor bestaande OpenAI-calls
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Zet de huidige AIQS-variant snel en gecontroleerd live in productie voor alleen de bestaande OpenAI-calls, zonder nieuwe reviewflow of extra calls toe te voegen."
tags: [aiqs, productie, openai, consumer-beta]
workstream: aiqs
due_date: null
sort_order: 3
---













# AIQS productie live zetten voor bestaande OpenAI-calls

## Probleem / context

De huidige AIQS-variant is functioneel bruikbaar, maar de productiedoelstelling is nog niet expliciet als taak verankerd: AIQS moet in productie werken voor de bestaande OpenAI-calls, zonder scope-uitbreiding.
Er is nadrukkelijk geen behoefte om nu de geplande bredere reviewflow te bouwen.

## Gewenste uitkomst

De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls.
Er worden geen nieuwe calls toegevoegd en geen nieuwe reviewproceslaag gebouwd binnen deze taak.

Deze taak is klaar wanneer de productieroute aantoonbaar werkt en de minimale operationele checks zijn vastgelegd om live testen mogelijk te maken.

## Waarom nu

- Snelle live-validatie in de eigen productieomgeving is nu belangrijker dan featureverbreding.
- Het verlaagt de feedbackloop voor AIQS-verbetering in realistische omstandigheden.
- Het houdt de fase focus op bewijs-gedreven consumer-beta afronding.

## In scope

- Productieroute voor bestaande AIQS OpenAI-calls valideren en waar nodig repareren.
- Admin-only toegang en server-side guardrails behouden in productie.
- Nodige runtime/config checks voor stabiele live-werking vastleggen.
- Bewijs leveren dat huidige AIQS-calls in productie end-to-end werken.

## Buiten scope

- Nieuw reviewproces of uitgebreide evaluatielifecycle bouwen.
- Nieuwe AI-taken, extra OpenAI-calls of control-plane verbreding.
- Niet-AIQS productverbreding buiten de huidige adminflow.

## Concrete checklist

- [ ] Productiepad van bestaande AIQS-calls checken op end-to-end werking.
- [ ] Eventuele blockers in config/guardrails oplossen zonder scope-uitbreiding.
- [ ] Bevestigen dat admin-only toegang in productie correct gehandhaafd blijft.
- [ ] Bewijs vastleggen dat de huidige calls live werken zoals verwacht.
- [ ] Korte operationele go-live notitie vastleggen voor vervolgtesten.

## Blockers / afhankelijkheden

- Productieomgeving en geldige admin-toegang.
- Bestaande server-side configuratie voor AIQS/OpenAI-callpad.

## Verify / bewijs

- Runtimebewijs van succesvolle AIQS-calls in productie.
- Bevestiging van admin-only afscherming in productie.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`
```

---

## Budio webapp compatible maken

- Path: `docs/project/25-tasks/open/budio-webapp-compatible-maken.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-budio-webapp-compatible-maken
title: Budio webapp compatible maken
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "Implementeer PWA-installatieprompt voor webgebruikers om de app als desktop-app te installeren, met modal, cookie-onthouding en instellingenoptie."
tags: [pwa, webapp, installatie, modal, cookie]
workstream: app
due_date: null
sort_order: 9
---

## Probleem / context

Gebruikers van de webversie kunnen de app momenteel niet eenvoudig installeren als Progressive Web App (PWA) op hun desktop. Dit beperkt de gebruikerservaring, vooral voor Android-gebruikers die geen native app beschikbaar hebben. Een installatieprompt zou de toegankelijkheid verbeteren en de app meer app-achtig maken.

## Gewenste uitkomst

Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een modal met de vraag om de app op de desktop te installeren. Als de gebruiker weigert, onthoud dit met een cookie zodat de prompt niet herhaald wordt. De gebruiker kan de installatieoptie altijd heractiveren via instellingen. Gebruik juiste iconen, naam en manifestinstellingen voor een professionele installatie-ervaring.

## Waarom nu

- We hebben nog geen Android en iOS apps beschikbaar, dus voor Android-gebruikers (zoals ikzelf) is dit een handige tussenoplossing.
- Verbetert de gebruikerservaring op web zonder afhankelijk te zijn van app stores.
- Voorbereiding op bredere PWA-adoptie.

## In scope

- Bijwerken of aanmaken van web app manifest (manifest.json) met juiste iconen, naam en instellingen.
- Implementeren van PWA-installatie logica in de app (detectie van 'beforeinstallprompt' event).
- Creëren van een installatiemodal component met duidelijke call-to-action.
- Toevoegen van local storage om gebruikerskeuze te onthouden (niet tonen als geweigerd), wel altijd via menu -> instellingen alsnog weer activeren.
- Integreren van een toggle in instellingen scherm om installatieprompt te heractiveren.
- Testen op verschillende browsers (Chrome, Firefox, Safari) voor compatibiliteit.

## Buiten scope

- Ontwikkeling van native Android/iOS apps.
- Uitbreiding naar andere PWA-features zoals offline caching of push notifications (tenzij direct gerelateerd aan installatie).
- Browser-specifieke aanpassingen buiten standaard PWA-ondersteuning.

## Concrete checklist

- [ ] Onderzoek huidige PWA-compatibiliteit en manifest.json controleren/bijwerken.
- [ ] Implementeer 'beforeinstallprompt' event listener in app root (\_layout.tsx).
- [ ] Creëer PwaInstallModal component met installatieknop en 'later' optie.
- [ ] Voeg cookie-logica toe voor onthouden van gebruikerskeuze (gebruik js-cookie of native cookies).
- [ ] Integreer modal in hoofdapp flow (toon alleen voor ingelogde webgebruikers).
- [ ] Voeg toggle toe in instellingen scherm voor heractiveren van prompt.
- [ ] Test installatie op desktop browsers en controleer cookie-functionaliteit.
- [ ] Update documentatie indien nodig.

## Blockers / afhankelijkheden

- Geen blockers; kan parallel lopen met andere features.
- Afhankelijk van Expo/React Native Web voor PWA-ondersteuning (al aanwezig).

## Verify / bewijs

- Runtime-test: Open app in browser, controleer of installatieprompt verschijnt voor nieuwe gebruikers.
- Installatie-test: Klik op installeren en verificeer dat app als desktop-app wordt geïnstalleerd met juiste iconen.
- Cookie-test: Weiger installatie, refresh pagina en controleer dat prompt niet meer verschijnt; activeer via instellingen en test opnieuw.
- Browser-compatibiliteit: Test op Chrome, Firefox en Safari desktop.
- Code-review: Controleer manifest.json en installatielogica in repo.

## Relevante links

- `docs/project/open-points.md`
- [PWA Install Prompt Guide](https://web.dev/customize-install/)
- [Expo PWA documentation](https://docs.expo.dev/guides/progressive-web-apps/)
```

---

## Docs folderstructuur en visual language herbeoordelen na metadatafase

- Path: `docs/project/25-tasks/open/docs-folderstructuur-en-visual-language-herbeoordeling-na-metadatafase.md`
- Bucket: open
- Status: blocked
- Priority: p3
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-docs-folderstructuur-visual-language-herbeoordeling
title: Docs folderstructuur en visual language herbeoordelen na metadatafase
status: blocked
phase: transitiemaand-consumer-beta
priority: p3
source: docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md
updated_at: 2026-04-25
summary: "Beoordeel pas na de metadata- en bundlingfase of een bredere docs-foldermigratie of verdere visual-language uitbouw echt nodig is."
tags: [docs, structure, metadata, visual-language]
workstream: idea
due_date: null
sort_order: 1
---

# Docs folderstructuur en visual language herbeoordelen na metadatafase

## Probleem / context

De docs lopen deels door elkaar voor menselijke lezers, agents/AI en gedeeld gebruik. De goedkope eerste stap is metadata + betere bundling, niet meteen een brede foldermigratie.

Deze task bewaakt bewust dat we pas na de eerste fase herbeoordelen of een grotere structuurwijziging nodig is.

## Gewenste uitkomst

Na afronding van `docs-ux-audience-taxonomie-en-uploadbundels.md` ligt er een korte, brongebaseerde beoordeling:

- Is metadata + bundling voldoende om verwarring op te lossen?
- Zijn er nog docs die echt naar een andere folder moeten?
- Werkt de Budio Terminal-stijl als smaaklaag zonder gimmick te worden?
- Moet er een vervolg komen voor templates, Obsidian graph views of docs-navigatie?

## Waarom nu

- Niet nu uitvoeren: deze task is afhankelijk van bewijs uit de metadata- en bundlingfase.
- Wel nu vastleggen: voorkomt dat foldermigratie of visual polish ongemerkt meeloopt in de huidige cheap-first taak.

## In scope

- Review van docs-routing na metadatafase.
- Beoordeling of folderstructuur nog moet wijzigen.
- Beoordeling of visual language verder moet worden gestandaardiseerd.
- Eventueel nieuw plan of idee als vervolg.

## Buiten scope

- Geen brede foldermigratie voordat de dependency klaar is.
- Geen retro-terminal als nieuw design system.
- Geen productcopy richting app-eindgebruikers.
- Geen runtime app-wijzigingen.

## Uitvoerblokken / fasering

- [ ] Blok 1: dependency-resultaat lezen.
- [ ] Blok 2: docs-routing en metadata-effect beoordelen.
- [ ] Blok 3: advies vastleggen en eventuele vervolgtaak/idee maken.

## Concrete checklist

- [ ] Dependency is afgerond en verplaatst naar `done/`.
- [ ] Beoordeling van folderstructuur is vastgelegd.
- [ ] Beoordeling van visual-language gebruik is vastgelegd.
- [ ] Eventuele vervolgactie is expliciet klein gehouden.

## Blockers / afhankelijkheden

- Geblokkeerd op: `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`

## Verify / bewijs

- `npm run taskflow:verify`
- Indien docs gewijzigd worden: `npm run docs:lint`, `npm run docs:bundle`, `npm run docs:bundle:verify`

## Relevante links

- `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`
- `docs/project/README.md`
```

---

## Docs scheiden naar private repo (strategie + migratieplan)

- Path: `docs/project/25-tasks/open/docs-private-repo-scheiding-en-migratieplan.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-21

```md
---
id: task-docs-private-repo-scheiding-migratieplan
title: Docs scheiden naar private repo (strategie + migratieplan)
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-21
summary: "Werk een besluitbaar plan uit om strategische docs naar een aparte private repo te verplaatsen (optie 2), met behoud van historie, workflow en AIQS-governance."
tags: [docs, governance, security, repo-structuur, planning]
workstream: idea
due_date: null
sort_order: 11
---




## Probleem / context

De projectdocs bevatten geen secrets, maar wel gevoelige interne strategie en governance (zoals commerciële richting, AIQS-governance, admin-gedrag, en toekomstige productsporen). Zolang docs in dezelfde repo leven als runtime-code, ontstaat risico bij eventueel publiek delen van de hoofdrepo.

## Gewenste uitkomst

Een concreet en uitvoerbaar migratieplan voor optie 2: docs onderbrengen in een aparte private repo binnen dezelfde workspace, inclusief heldere werkwijze voor sync met code, toegang, historiebehoud en updateflow.

Het resultaat van deze taak is een besluit- en uitvoeringskader; geen directe technische migratie in deze taak.

## Waarom nu

- Strategisch belangrijk voor private beta en toekomstige commerciële positionering.
- Voorkomt dat gevoelige roadmap/governance-data onbedoeld meebeweegt bij eventueel publiek delen van code.
- Houdt productwaarheid en docs-kwaliteit intact zonder drastische kennisverliesoptie.

## In scope

- Uitwerken van het doelbeeld voor een aparte private docs-repo in dezelfde workspace.
- Vergelijken van implementatievarianten (submodule vs aparte clone) op workflow-impact.
- Definiëren van migratieaanpak met behoud van historie en duidelijke eigenaarschap.
- Vastleggen van operationele aanpassingen in workflowregels (`AGENTS.md` / `docs/dev/**`) voor werken met 2 repos.
- Opstellen van risicoanalyse, rollbackstrategie en acceptatiecriteria voor go/no-go.

## Buiten scope

- Direct verplaatsen van bestaande docsbestanden.
- Aanpassen van runtime-code, API's of database.
- Open-source/public repo-strategie volledig uitvoeren binnen deze taak.

## Concrete checklist

- [ ] Inventariseer welke documenttypes gevoelig zijn en welke in hoofdrepo kunnen blijven.
- [ ] Werk variantvergelijking uit: submodule vs aparte clone (developer UX, CI, onderhoud, risico).
- [ ] Definieer aanbevolen doelarchitectuur met folderstructuur en sync-afspraken.
- [ ] Beschrijf stapsgewijze migratieflow inclusief geschiedenisbehoud en rollback.
- [ ] Definieer governance-updates voor werken met aparte docs-repo.
- [ ] Leg promotiecriteria vast voor uitvoering als vervolgtaak (ready/in_progress).

## Blockers / afhankelijkheden

- Afhankelijk van expliciet gebruikersbesluit op de aanbevolen variant.
- Afstemming nodig over toekomstige publiek/private repo-strategie.

## Verify / bewijs

- Documentair bewijs: uitgewerkt migratievoorstel met variantenanalyse en besluitadvies.
- Governancebewijs: expliciete workflowregels voor 2-repo samenwerking en wijzigingscontrole.
- Planningbewijs: traceerbare opvolging in tasklaag zonder premature uitvoering.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/README.md`
- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
```

---

## Entry photo gallery volledige end-user E2E flows

- Path: `docs/project/25-tasks/open/entry-photo-gallery-volledige-end-user-e2e-flows.md`
- Bucket: open
- Status: ready
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-entry-photo-gallery-volledige-end-user-e2e-flows
title: Entry photo gallery volledige end-user E2E flows
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Breid de nieuwe gallery-smoke basis uit naar een volledige end-user E2E-suite voor toevoegen, verwijderen, max-limiet, viewer, reorder en unhappy/error flows."
tags: [qa, tests, gallery, photos, e2e]
workstream: app
due_date: null
sort_order: 2
---

## Probleem / context

De eerste gallery QA-basis bewijst de kerninteractie voor thumbnail-reorder en legt unit/smoke-infra neer. De volledige end-user dekking voor alle gallery-flows bestaat nog niet.

Voor toekomstige gallery-wijzigingen willen we kunnen kiezen tussen:

- een snelle smoke-test die bewijst dat de belangrijkste interactie niet kapot is
- een volledige end-user test die alle vastgelegde use cases en unhappy paths doorloopt

## Gewenste uitkomst

Er is een volledige Playwright end-user suite voor entry photo gallery flows. De suite gebruikt reproduceerbare local-only seed/cleanup helpers en kan opnieuw gedraaid worden wanneer dit scherm of de gallery-services wijzigen.

## Waarom nu

- De reorder-bug liet zien dat lint/typecheck onvoldoende zijn voor complexe interactie.
- De basis-smoke is klaar; de volgende kwaliteitsstap is volledige flowdekking.
- Dit ondersteunt de 80% coverage/KPI-richting zonder legacy-code ineens repo-breed te blokkeren.

## In scope

- Local seed/cleanup uitbreiden voor add/delete/max/error scenario's.
- E2E-dekking voor:
  - foto's toevoegen
  - max 5 foto's en disabled/limietgedrag
  - viewer openen/sluiten
  - foto verwijderen en annuleren
  - thumbnail reorder links/rechts
  - persist-fout of service-error pad waar lokaal veilig te simuleren
- Heldere run-instructies in `docs/dev/qa-test-strategy.md`.

## Buiten scope

- Native iOS/Android E2E.
- Repo-brede coverage gate voor legacy code.
- Nieuwe productfunctionaliteit buiten bestaande gallery-flows.

## Concrete checklist

- [ ] Full E2E seed/cleanup fixtures ontwerpen.
- [ ] Add-flow testen.
- [ ] Delete/cancel-flow testen.
- [ ] Max-limiet testen.
- [ ] Viewer-flow testen.
- [ ] Reorder links/rechts testen.
- [ ] Minstens één unhappy/error flow testen of expliciet onderbouwen waarom lokaal niet veilig simuleerbaar.
- [ ] Docs/runbook bijwerken.
- [ ] Verify draaien.

## Blockers / afhankelijkheden

- Vereist draaiende lokale webserver, Supabase local stack en Mailpit auth-flow.

## Verify / bewijs

- ⏳ `npm run test:e2e:gallery:full`
- ⏳ `npm run lint`
- ⏳ `npm run typecheck`
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `tests/e2e/gallery-full.spec.mjs`
- `scripts/seed-local-entry-photo-gallery-smoke.mjs`
- `docs/dev/qa-test-strategy.md`
```

---

## Moment detail foto-upload productieflakiness onderzoeken

- Path: `docs/project/25-tasks/open/moment-detail-foto-upload-productieflakiness-onderzoek.md`
- Bucket: open
- Status: ready
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-moment-detail-foto-upload-productieflakiness-onderzoek
title: Moment detail foto-upload productieflakiness onderzoeken
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: split-from-task-moment-detail-foto-reorder-productiebug-herstel
updated_at: 2026-04-24
summary: "Onderzoek en herstel de resterende productieflakiness in moment detail foto-upload, met bronvaste repro, fasegerichte foutanalyse en bevestigde oorzaak in browser/Supabase-spoor."
tags: [moment-detail, photos, production, upload, diagnostics]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

De reorder-productiebug is hersteld, maar de foto-upload op moment detail is nog niet apart bronvast onderzocht. In productie werkt upload soms wel en soms niet, zonder dat de exacte faalfase al bevestigd is.

De bestaande gallery-flow heeft inmiddels fasegerichte foutclassificatie (`upload_prepare`, `upload_display`, `upload_thumb`, `upload_insert`, `upload_post_refresh`), maar de echte productieoorzaak per fase is nog onbekend.

## Gewenste uitkomst

Voor moment detail foto-upload is de productieoorzaak bevestigd en hersteld. Een upload met de vaste agent-testaccount werkt betrouwbaar in productie, en als een fout toch terugkomt is direct zichtbaar in welke fase die optreedt en welk bronspoor daarbij hoort.

## Waarom nu

- De reorder-fix is afgerond en afgesplitst naar een done-task.
- Upload blijft de laatste open gallery-regressie binnen deze flow.
- Zonder bronvaste repro blijft de oorzaak te makkelijk hangen tussen storage, DB insert, refresh en client-state.

## In scope

- Productie-repro van foto-upload met de vaste agent-testaccount.
- Browser-console en network capture tijdens upload.
- Supabase-spoor per uploadfase controleren.
- Bevestigen of de fout in prepare, storage upload, DB insert of post-refresh zit.
- De concrete uploadoorzaak oplossen en opnieuw in productie testen.

## Buiten scope

- Reorder-fix; die is afgerond in `done/moment-detail-foto-reorder-productiebug-herstel.md`.
- Nieuwe fotofeatures zoals captions of bulkbeheer.
- Brede gallery-E2E uitbreiding buiten de upload-regressie zelf.

## Concrete checklist

- [ ] Nieuwe productie upload-repro vastleggen met datum/tijd, route, account en entry-id.
- [ ] Browser-console en network capture voor uploadflow verzamelen.
- [ ] Uploadfout koppelen aan één bevestigde fase (`upload_prepare`, `upload_display`, `upload_thumb`, `upload_insert` of `upload_post_refresh`).
- [ ] Concrete fix implementeren.
- [ ] Productie opnieuw testen tot upload werkt.
- [ ] Taskfile en runbook bijwerken met bevestigde oorzaak en verify.

## Blockers / afhankelijkheden

- Vereist de bestaande productie testaccount en een bruikbare fixture-entry.
- Vereist read-only diagnose van Supabase/Vercel naast browser capture.

## Verify / bewijs

- ⏳ Productie upload-repro met browser console + network capture
- ⏳ Relevante Supabase-sporen per uploadfase
- ⏳ `npm run lint`
- ⏳ `npm run typecheck`
- ⏳ Relevante gallery smoke/testbewijzen
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
- `src/lib/entry-photo-gallery/flow.ts`
- `docs/dev/production-bug-investigation-workflow.md`
- `docs/project/25-tasks/done/moment-detail-foto-reorder-productiebug-herstel.md`
```

---

## Moments-overzicht primaire foto thumbnail en viewer

- Path: `docs/project/25-tasks/open/moments-overzicht-primaire-foto-thumbnail-en-viewer.md`
- Bucket: open
- Status: blocked
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-moments-overzicht-primaire-foto-thumbnail-en-viewer
title: Moments-overzicht primaire foto thumbnail en viewer
status: blocked
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-25
summary: "Toon in het gedeelde moments-overzicht een primaire foto-thumb op maximale breedte binnen de bestaande tijdkolom, verfijn de viewer naar een media-first lightbox en herstel werkende navigatie via web drag-swipe, pijlen en gedeelde gesture-ownership."
tags: [moments-overzicht, photos, ui, viewer]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

Het moments-overzicht toont nu alleen tijd, type-indicatie, titel en previewtekst. Als een moment foto's heeft, is er geen visuele hint of snelle route naar die foto's vanuit het overzicht zelf.

De gebruiker wil een kleine, vaste thumbnail onder de tijdindicator zonder dat de linkerkolom breder wordt. Vanuit die thumb moet een popup openen waarin alle foto's van dat moment bekeken kunnen worden.

## Gewenste uitkomst

In het gedeelde `MomentsTimelineSection` wordt bij aanwezige foto's een compacte primaire thumbnail getoond binnen de bestaande tijdkolom. Die thumb heeft een vaste maat en verandert de linkerkolombreedte niet.

Bij tikken/klikken opent een read-only fotoviewer met:

- de momenttitel bovenin naast de sluitknop
- swipe door alle foto's van dat moment
- een duidelijke visuele links/rechts indicatie wanneer swipen mogelijk is

De viewerbasis is gedeeld met de bestaande moment-detail galerij, zodat swipegedrag en presentatielogica niet uiteenlopen.

## Waarom nu

- De moments-overview mist nu een snelle route naar fotocontent.
- Er is al een bestaande fotoviewerbasis in moment detail die we nu netjes kunnen hergebruiken.
- Dit voegt zichtbare waarde toe zonder nieuwe productscope buiten de bestaande fotoflow.

## In scope

- Nieuwe task aanmaken en bovenaan `in_progress` zetten.
- Gedeelde moments-overzicht-component uitbreiden met primaire thumbnail binnen de bestaande tijdkolom.
- Batch-fotodata voor overview-preview laden zonder losse fetch per rij.
- Gedeelde read-only viewer toevoegen met titel in header en swipe-affordance.
- Bestaande moment-detail galerijviewer laten hergebruiken via dezelfde shared component.

## Buiten scope

- Foto upload, verwijderen of reorder vanuit het moments-overzicht.
- Nieuwe fotometadata zoals captions of favorieten.
- Volledige E2E-dekking voor deze flow als aparte QA-uitbouw.

## Concrete checklist

- [x] Taskfile aangemaakt en lane-sortering bijgewerkt.
- [x] Batch-photo service voor overview-preview toegevoegd.
- [x] `MomentsTimelineSection` uitgebreid met vaste primaire thumb in de tijdkolom.
- [x] Gedeelde fotoviewer toegevoegd met titelheader en swipe-affordance.
- [x] Moment detail galerij overgezet op dezelfde gedeelde viewer.
- [x] Thumbnail visueel teruggeschaald naar een lichtere timeline-hint.
- [x] Thumbnail opnieuw verbreed tot maximale breedte binnen de bestaande tijdkolom, zonder de kolom zelf te vergroten.
- [x] Viewer vereenvoudigd naar media-first presentatie met minder chrome.
- [x] Swipe-ownership hersteld tussen carousel en zoom-slide, inclusief web touch-action nuance.
- [x] Werkende vorige/volgende knopnavigatie toegevoegd in de viewer.
- [x] Web drag-swipe toegevoegd als structurele fallback naast touch paging.
- [x] Web drag-swipe verplaatst naar de gedeelde fotoslide zelf, zodat mouse-down en horizontaal slepen op de foto daadwerkelijk navigeert.
- [x] Web pinch-zoom onderdrukt nu browser/page zoom en routeert de interactie naar de foto-overlay.
- [x] Laatste timeline-item met thumb toont ook de doorlopende lijn onder het icoon.
- [x] Verify uitgevoerd en task/docs-bundles bijgewerkt.

## Blockers / afhankelijkheden

- Geen externe blockers; vereist alleen bestaande auth- en fotoservices.

## Review-notitie

- Lokale desktop-Chrome swipe met de muis in de fullscreen foto-popup werkt nog niet betrouwbaar; navigatie via de pijliconen werkt wel.
- Deze task staat daarom bewust op `blocked` voor latere productiecheck i.p.v. als opgelost/done.
- Gewenste vervolgrichting na review:
  - slimmer zoomen
  - foto kunnen slepen/pannen wanneer ingezoomd
  - inzoomen rond finger/cursor focuspunt in plaats van standaard naar het midden

## Verify / bewijs

- ✅ `npm run test:unit`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ Extra unit-tests voor viewer swipe-state en web touch-action helper
- ⚠️ Lokale mouse-swipe in desktop Chrome nog niet bevestigd als werkend; arrows werken wel
- ⚠️ Nog geen gerichte overview-smoke/spec voor deze nieuwe interactieve flow; daarom nu vastgelegd als open QA-gap i.p.v. stilzwijgend bewezen
- ✅ `npm run taskflow:verify`

## Relevante links

- `components/journal/moments-timeline-section.tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
```

---

## niet vergeten

- Path: `docs/project/25-tasks/open/niet-vergeten.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-niet-vergeten
title: niet vergeten
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "screenshots van Flow verwerken tot ideeen. todo, ideeen etc taggen in momenten tekst en bijbehorende schermen uitdenken in AIQS en Budio."
tags: []
workstream: idea
due_date: null
sort_order: 10
---



# niet vergeten

## Probleem / context

Beschrijf kort welk concreet gat, risico of uitvoeringsprobleem deze taak oplost.

## Gewenste uitkomst

Beschrijf in 1-3 korte alinea's wat klaar moet zijn wanneer deze taak done is.

## Waarom nu

- Waarom deze taak nu relevant is voor de actieve fase.

## In scope

- Concreet werk dat binnen deze taak valt.

## Buiten scope

- Werk dat bewust niet in deze taak zit.

## Concrete checklist

- [ ] Eerste concrete stap
- [ ] Tweede concrete stap

## Blockers / afhankelijkheden

- Geen of nog te bepalen.

## Verify / bewijs

- Noem hier de relevante verify-, runtime- of doc-bewijzen.

## Relevante links

- `docs/project/open-points.md`
```

---

## npm audit kwetsbaarheden beoordelen en saneren

- Path: `docs/project/25-tasks/open/npm-audit-kwetsbaarheden-beoordelen-en-saneren.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-npm-audit-kwetsbaarheden-beoordelen-en-saneren
title: npm audit kwetsbaarheden beoordelen en saneren
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Beoordeel de huidige npm audit meldingen na de testinfra-uitbreiding, bepaal welke runtime-relevant zijn, en saneer alleen de passende dependency-updates zonder onnodige brekende sprongen."
tags: [npm, audit, dependencies, security]
workstream: app
due_date: null
sort_order: 2
---

## Probleem / context

Na `npm install` onder Node 24 rapporteert npm nog steeds `14 vulnerabilities (13 moderate, 1 high)`. Deze zijn in deze ronde bewust niet inhoudelijk opgelost, omdat de actieve taak alleen GitHub Actions/Node-align en workflow-hardening betrof.

## Gewenste uitkomst

Er ligt een bron-gebaseerde beoordeling van de npm audit meldingen, inclusief onderscheid tussen:

- direct runtime-risico
- dev-only/tooling-risico
- fixes die veilig zijn
- fixes die breaking of scope-te-groot zijn

## Waarom nu

- De waarschuwing is actueel bevestigd op 2026-04-23.
- Testinfra en tooling zijn net uitgebreid.
- Dependency-onderhoud moet bewust gebeuren, niet stilzwijgend.

## In scope

- `npm audit` output analyseren.
- Impact per package/risk bepalen.
- Veilige sanering voorstellen of uitvoeren in een aparte uitvoerronde.

## Buiten scope

- Grote package-modernisering zonder expliciete keuze.
- Productcode refactors die alleen indirect uit dependency-upgrades voortkomen.

## Concrete checklist

- [ ] Audit-output vastleggen.
- [ ] Runtime vs dev-only risico scheiden.
- [ ] Veilige fixes bepalen.
- [ ] Beslissen welke fixes direct kunnen en welke een aparte grotere task vragen.

## Blockers / afhankelijkheden

- Nog te bepalen na concrete audit-output.

## Verify / bewijs

- ⏳ `npm audit`
- ⏳ relevante package verify

## Relevante links

- `package.json`
- `package-lock.json`
```

---

## Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering

- Path: `docs/project/25-tasks/open/origineel-plan-integriteit-borgen-tijdens-agent-uitvoering.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-origineel-plan-integriteit-borgen-tijdens-agent-uitvoering
title: Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: AGENTS.md
updated_at: 2026-04-25
summary: "Borg repo-breed dat een goedgekeurd oorspronkelijk plan én expliciete user-requirement-details tijdens uitvoering niet stilzwijgend vervagen of vervangen worden, en dat aanvullingen expliciet worden gelogd totdat een reconciliation is gedaan."
tags: [workflow, tasks, governance, planning, agents]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

Tijdens agent-uitvoering ontstaat soms drift tussen het oorspronkelijke goedgekeurde plan en de actuele uitvoerfocus. Zodra er tijdens bouwen correcties, regressies of polish-rondes bijkomen, verschuift de aandacht naar het laatste subprobleem. Daardoor kan een agent ten onrechte denken dat het werk "klaar" is, terwijl onderdelen uit het oorspronkelijke plan nog open staan.

De repo borgt al taskflow en status-sync, maar nog niet hard genoeg:

- de integriteit van het oorspronkelijke plan als stabiel referentiepunt gedurende de hele uitvoerfase
- de retentie van expliciete user-details en requirement-niveau beslissingen die later nog relevant zijn voor uitvoering of review

## Gewenste uitkomst

De repo-taskflow borgt voortaan expliciet dat een goedgekeurd oorspronkelijk plan of afgesproken scope tijdens uitvoering stabiel blijft, tenzij de eindgebruiker expliciet om wijziging van die hoofdscope vraagt.

Tussentijdse verbeteringen, correcties of regressiefixes worden voortaan niet gezien als vervanging van het oorspronkelijke plan, maar als aanvullingen binnen dezelfde taak of als expliciete nieuwe subscope. Expliciete user-requirements met latere uitvoer- of reviewwaarde blijven zichtbaar in de taskfile als detail-lijst en verdwijnen niet in alleen een samenvatting.

Voor afronding is een verplichte reconciliation nodig tussen: oorspronkelijk plan, expliciete user-requirements, later toegevoegde verbeteringen en nog open werk.

## Waarom nu

- Dit probleem raakt repo-breed meerdere agentflows, niet alleen pluginwerk.
- De gebruiker wil niet opnieuw hoeven bewaken dat het oorspronkelijke plan tijdens bouwen behouden blijft.
- De bestaande taskflow is al sterk; dit is een gerichte volgende stap om plan-drift structureel te voorkomen.

## In scope

- Nieuwe repo-brede guardrails voor planintegriteit én requirement-detail-retentie toevoegen in `AGENTS.md`.
- Workflowdocs uitbreiden met expliciete regels voor oorspronkelijk plan, expliciete user-requirements, aanvullingen tijdens uitvoering en reconciliation voor afronding.
- `task-status-sync-workflow` uitbreiden zodat niet alleen task-status maar ook plan-status en requirement-status gesynchroniseerd blijven.
- Task-template uitbreiden zodat niet-triviale taken ruimte hebben voor oorspronkelijke scope, expliciete user-requirements, aanvullingen tijdens uitvoering en reconciliation.

## Buiten scope

- Nieuwe productfeatures of UI-wijzigingen buiten workflow/documentatie.
- Grote redesign van de volledige tasklaag of nieuwe verify-tooling tenzij strikt nodig.
- Wijzigen van canonieke productscope of planning buiten deze workflowafspraken.

## Uitvoerblokken / fasering

- [ ] Blok 1: workflowgap bevestigen en bestaande guardrails targeten.
- [ ] Blok 2: AGENTS, workflowdocs, skill en task-template aanscherpen voor planintegriteit.
- [ ] Blok 3: verify draaien en taskflow/docs synchroon afronden.

## Concrete checklist

- [x] Nieuwe workflowtask aangemaakt en bovenaan `in_progress` geplaatst.
- [x] `AGENTS.md` uitgebreid met harde regels voor planintegriteit tijdens uitvoering.
- [x] `docs/dev/task-lifecycle-workflow.md` uitgebreid met oorspronkelijke-plan + aanvullingen + reconciliation-structuur.
- [x] `docs/dev/cline-workflow.md` uitgebreid met uitvoerregels tegen plan-drift.
- [x] `.agents/skills/task-status-sync-workflow/SKILL.md` aangescherpt met plan-sync guardrails.
- [x] `docs/project/25-tasks/_template.md` uitgebreid met planintegriteit-secties voor niet-triviale taken.
- [x] Requirement-detail-retentie expliciet toevoegen in AGENTS/docs/skill/template, zodat user-details niet verloren gaan in summaries.
- [ ] Repo-regels verder aanscherpen zodat een bestaand uitgebreid bronplan in een taskfile letterlijk of nagenoeg letterlijk behouden blijft wanneer de gebruiker om detailbehoud vraagt.
- [x] Verify uitgevoerd (`taskflow`, docs bundle, docs bundle verify).

## Blockers / afhankelijkheden

- Geen functionele blockers; wijziging is repo-brede workflowgovernance.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `AGENTS.md`
- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `docs/project/25-tasks/_template.md`
```

---

## Plan Mode task auto-create bij ontbrekende match

- Path: `docs/project/25-tasks/open/plan-mode-task-auto-create-bij-ontbrekende-match.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-plan-mode-task-auto-create-bij-ontbrekende-match
title: Plan Mode task auto-create bij ontbrekende match
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: AGENTS.md
updated_at: 2026-04-24
summary: "Draai de repo-brede Plan Mode taskflowregel om zodat agents bij een duidelijke nieuwe scope automatisch een task aanmaken, en alleen bij echte classificatie- of scope-twijfel nog vragen."
tags: [workflow, tasks, plan-mode, docs]
workstream: app
due_date: null
sort_order: 5
---

## Probleem / context

De huidige repo-regel blokkeert inhoudelijk werk in Plan Mode wanneer er geen passende bestaande taskfile is. Daardoor moet de gebruiker alsnog expliciet buiten Plan Mode een task laten aanmaken, ook als de nieuwe scope al duidelijk is.

Dat vertraagt normale agentflows en botst met de gewenste default: bij duidelijke nieuwe scope hoort Plan Mode zelf een task aan te maken en direct door te kunnen plannen.

## Gewenste uitkomst

Plan Mode werkt voortaan met een goedkope en consistente preflight:

- eerst zoeken naar een passende bestaande task
- bij duidelijke match die task gebruiken
- bij duidelijke nieuwe scope automatisch een nieuwe task aanmaken
- alleen bij echte classificatie-, lane- of scope-twijfel nog expliciet vragen

Deze regel staat daarna repo-breed gelijk in AGENTS, skills en workflowdocs, zodat alle agents dezelfde verwachting volgen.

## Waarom nu

- De huidige Plan Mode-regel blokkeerde direct een nieuwe, heldere overview-feature.
- De gebruiker wil dat task-aanmaak niet langer buiten Plan Mode vastloopt.
- Dit is een repo-brede workflowverbetering die toekomstige agentsessies direct sneller en consistenter maakt.

## In scope

- Nieuwe workflowtask aanmaken en bovenaan de `in_progress` lane zetten.
- Plan Mode-regel omzetten in `AGENTS.md`, taskflow-skill en workflowdocs.
- Beslislogica expliciet maken: bestaande match gebruiken, anders auto-create, alleen bij twijfel vragen.
- `Taskflow summary`-uitleg aanpassen zodat een automatisch aangemaakte task toegestaan is.
- Controleren dat `taskflow:verify` niet leunt op de oude blokkaderegel.

## Buiten scope

- Nieuwe productfeatures of UI-wijzigingen buiten deze workflowregel.
- Aanpassingen aan statusmodel, done-flow of docs-bundle-beleid buiten wat nodig is voor deze regel.
- Nieuwe verify-scripts tenzij bestaande verify aantoonbaar op de oude regel leunt.

## Concrete checklist

- [x] Workflowtask aangemaakt en lane-sortering bijgewerkt.
- [x] `AGENTS.md` aangepast naar Plan Mode auto-create default.
- [x] `.agents/skills/task-status-sync-workflow/SKILL.md` aangepast.
- [x] `docs/dev/task-lifecycle-workflow.md` aangepast.
- [x] `docs/dev/cline-workflow.md` aangepast.
- [x] Verify-laag gecontroleerd en geen extra codewijziging nodig bevonden.
- [x] `npm run taskflow:verify` uitgevoerd.
- [x] `npm run docs:bundle` uitgevoerd.
- [x] `npm run docs:bundle:verify` uitgevoerd.

## Blockers / afhankelijkheden

- Geen functionele blockers; wijziging zit in workflowdocs en tasklaag.

## Verify / bewijs

- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `AGENTS.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `docs/dev/task-lifecycle-workflow.md`
- `docs/dev/cline-workflow.md`
- `scripts/docs/verify-taskflow-enforcement.mjs`
```

---

## Budio Workspace activity-bar opent list view zonder workspace-menu

- Path: `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`
- Bucket: open
- Status: in_progress
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-plugin-activitybar-opent-list-view-zonder-workspace-menu
title: Budio Workspace activity-bar opent list view zonder workspace-menu
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-25
summary: "Het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in list view. Veel list/board polish uit deze sessie zit in code, maar fullscreen-detail rendering is nog niet structureel af en houdt deze task terecht op in_progress."
tags: [plugin, vscode, list-view, activity-bar]
workstream: plugin
due_date: null
sort_order: 6
---

# Budio Workspace activity-bar opent list view zonder workspace-menu

## Probleem / context

Wanneer de gebruiker op het Budio Workspace icoon in VS Code klikt, verschijnt nu eerst de oude `Workspace`-launcher/tussenlaag. Die route is verouderd en voegt geen waarde meer toe.

Daardoor voelt openen indirect en onnodig rommelig, terwijl de gewenste werkvorm juist is: direct de bestaande Budio Workspace window openen in de list view.

## Gewenste uitkomst

Klikken op het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in `list` view. De oude `Workspace`-launcher is uit de code en documentatie opgeruimd voor zover VS Code dit technisch toelaat.

Board blijft bestaan als secundaire view binnen de plugin en via het command palette, maar is niet meer de default open-route vanaf het icoon.

## Waarom nu

- Dit is een concrete UX-frictie in dagelijks gebruik van de plugin.
- De oude launcher-route zorgt voor verwarring en hoort niet meer bij de actuele pluginflow.
- Kleine plugin-polish is hier direct waardevol omdat deze extensie juist de dagelijkse uitvoeringslaag moet ondersteunen.

## In scope

- Activity-bar open-route laten landen in `list` view.
- Oude launcher/tussenlaag opruimen of minimaliseren tot alleen technisch noodzakelijke VS Code plumbing.
- Verouderde launcher-referenties uit extension-code en README verwijderen.
- Zorgen dat de webview-titel correct meebeweegt met de actieve view.

## Buiten scope

- Een volledige architectuurwissel naar een native sidebar-list in plaats van de bestaande panel/webview.
- Verwijderen van board of settings als beschikbare pluginviews.
- Nieuwe pluginfeatures buiten deze open-flow.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Activity-bar open-flow aangepast naar `list`.
- [x] Oude launcher-code en manifestverwijzingen opgeschoond.
- [x] README bijgewerkt naar het nieuwe open-gedrag.
- [x] List-view header/filters/sort/refresh UI aangescherpt (icon-only refresh, sort-select in topbar, actieve sort-header, statuschips gecentreerd, gekleurde batchchips).
- [x] List-view kolomheaders sticky gemaakt zodat ze onder de topnav zichtbaar blijven tijdens scroll.
- [x] Actieve taak-indicator visueel versterkt in board cards en list rows.
- [x] Automatische refresh/selectie-behoud aangescherpt voor repo- en agentgedreven markdownwijzigingen.
- [x] `Due` vervangen door `Last change` in de list view (datum-only, sorteert op wijzigingsdatum).
- [x] Checklist progress compacter en visueel consistenter gemaakt met gedeelde kleurbanden.
- [x] Plugin opent standaard met `Alleen open` actief.
- [x] Linker rail omgezet naar icon-first navigatie.
- [x] Detail pane uitbreidbaar gemaakt met resize handle en fullscreen toggle.
- [x] Agent activity zichtbaar gemaakt in list/board task-overzichten via gedeeld helperpatroon.
- [x] Rail refresh-knop gelijkgetrokken met de andere icon-buttons.
- [x] `Last change` compact gemaakt (`Apr 25`) zodat de datum niet over twee regels breekt.
- [x] Drag-vs-click structureel gescheiden zodat slepen niet meer meteen task detail opent.
- [ ] Detailweergave volledig stabiel maken: klein scherm fullscreen, desktop side-pane met expliciete fullscreen-optie, zonder lege rechterkolom of overlap over list/board.
- [ ] Fullscreen-renderpath structureel los trekken van de side-pane render zodat fullscreen niet meer meedraait op de oude split-layout.
- [ ] Laatste rail-sizing check bevestigen zodat refresh exact dezelfde maat houdt als de andere rail-icon buttons.
- [ ] Handmatige smoke-check in de normale VS Code workspace bevestigd.

## Status tegen uitgebreid plan uit deze sessie

## Oorspronkelijk uitgebreid plan / detailbehoud

Onderstaande planstructuur is expliciet bewaard omdat deze later nog uitvoerwaarde heeft. Deze sectie is geen samenvatting, maar de bronreferentie voor het uitgebreide plan dat tijdens deze taak is afgesproken.

### A. Status- en sorteermodel uitbreiden

1. **Nieuwe status `review` toevoegen**
   - statusvolgorde: `backlog -> ready -> in_progress -> review -> blocked -> done`
   - `review` blijft in `open/`; alleen `done` verhuist naar `done/`
   - constants, parser, writer, repository, sort-policy, config, tests, taskflow-verify en docs-statusmodel bijwerken

2. **Manual sorting regels aanscherpen**
   - nieuwe taken komen standaard **bovenaan** in manual sorting
   - zodra een taak actief in uitvoering komt, wordt die automatisch **bovenaan zijn huidige statuskolom** gezet
   - dit moet robuust zijn bij **meerdere agents tegelijk**: bestaande `sort_order` herschrijven per lane/status, zonder cross-lane chaos
   - actieve taken staan dus bovenaan binnen hun statuskolom

### B. UI/UX plugin polish

3. **Due vervangen door Last change date**
   - list-kolom `Due` wordt `Last change`
   - altijd **datum-only**, geen tijd
   - nette visuele weergave en sortering op wijzigingsdatum

4. **Checklist verbeteren op board + list**
   - checklisttekst compacter/weg waar logisch
   - gedeelde progress-chip voor board + list
   - max **5 kleurbanden** op percentage
   - visueel rustiger en sneller scanbaar

5. **Default altijd alleen open taken tonen**
   - plugin opent met `onlyOpen = true`

6. **Linker rail opnieuw bouwen**
   - flush links, geen restbalkje
   - vaste icon-buttons, zonder tekst
   - gelijke maat, subtiele actieve state
   - logisch kleuronderscheid per functie

7. **Resizable detail pane op board + list**
   - subtiele drag handle links van detailpane
   - gebruiker kan breedte live aanpassen
   - visuele indicator klein maar duidelijk

8. **Fullscreen detail toggle op board + list**
   - knop naast menu-knop
   - toggle tussen normale split en fullscreen task detail
   - samenwerken met resize-gedrag

### C. Agent-activiteit zichtbaar maken

9. **Actieve agent indicator in board, list en detail**
   - chip/badge tonen als taak op dat moment actief door een agent bewerkt wordt
   - tonen van agentnaam: bijv. `Codex`, `Cline`, `Claude`, `Chat`
   - subtiele animatie zolang actief
   - zodra klaar: geen animatie en geen actieve chip meer

10. **Agent metadata opslaan in task-md**
Ik stel voor een vaste metadata- en sectiestructuur toe te voegen, bijvoorbeeld:

- frontmatter velden voor actuele agentstatus
- sectie voor historiek / referentie, zoals:
  - `## Agent activity`
  - `## Commits`

Daarin kunnen we per nieuwe activiteit vastleggen:

- agentnaam
- model
- relevante agent-instellingen / context
- start/stop-status waar zinvol

### D. Automatische commit logging voor nieuwe commits

11. **`## Commits` voorbereiden én automatisch vullen**

- repo-managed hook/script, geen losse lokale sample-hooks
- alleen **nieuwe commits**, geen historische backfill
- nieuwe commits worden toegevoegd aan relevante taskfile(s)
- commit hash + subject loggen in `## Commits`

### E. Multi-agent robuustheid

12. **Concurrency-aanpak**

- task updates blijven file-version/checks respecteren
- agent-activiteit en sort-order updates moeten conflict-arm worden geschreven
- bij race/conflict: refresh/herhydrate pad behouden, geen stille overschrijvingen

## Verwachte implementatiestructuur uit het oorspronkelijke plan

- **helper** voor checklist-progress kleur/label
- **hook** voor detailpane resize/fullscreen state
- **task metadata uitbreiding** voor agent activity + commits
- **klein repo-script/hook** voor commit logging

## Oorspronkelijk verify-plan uit het uitgebreide plan

- `cd tools/budio-workspace-vscode && npm run typecheck`
- `cd tools/budio-workspace-vscode && npm run test`
- `cd tools/budio-workspace-vscode && npm run apply:workspace`
- `npm run taskflow:verify`
- omdat docs/statusmodel wijzigen:
  - `npm run docs:bundle`
  - `npm run docs:bundle:verify`

## Oorspronkelijke risico's uit het uitgebreide plan

- `review` + multi-agent + commit-logging samen maken dit groter dan een pure UI-polish
- actieve-agent chips vragen om een duidelijke bron van waarheid in task-md
- automatische sort-promotie bij status/activiteit moet netjes blijven werken met meerdere agents tegelijk

## Oorspronkelijke uitvoervolgorde in Act Mode

1. statusmodel + docs/taskflow (`review`)
2. sort/order regels voor nieuwe + actieve taken
3. last-change + checklist chips + open-only default
4. linker rail polish
5. resize + fullscreen detailpane
6. agent metadata + actieve chips
7. commit logging voor nieuwe commits
8. verify + plugin re-apply + taskfile bijwerken

## Expliciete user requirements / detailbehoud

- Filter `toon alleen open taken` is alleen zichtbaar in de filter van de **list-weergave** en wordt ook alleen daar toegepast; dit is niet relevant voor het board-scherm.
- Agent-activiteit moet visueel zichtbaar zijn in **board, list en task detail**, inclusief subtiele animatie zolang een taak actief door een agent wordt bewerkt.
- Bij code-review van requirementstatus geldt: als iets al in code bestaat dan moet dat als **user-review nodig** worden vastgelegd; anders blijft het **nog bouwen**.
- De uitgebreide requirements hieronder zijn expliciet relevant om later opnieuw op deze task te kunnen bouwen en mogen niet worden teruggebracht tot alleen een samenvatting.
- Punt 11 (`## Commits` automatisch vullen) en punt 12 (multi-agent concurrency) moeten als expliciete open requirements zichtbaar blijven zolang ze niet volledig zijn gebouwd; een reviewconclusie mag deze bronpunten niet vervangen.

## Status per requirement

- [x] `review` status toegevoegd — status: gebouwd.
- [~] Manual sorting regels voor actieve taken bovenaan binnen hun status — status: gedeeltelijk / niet bevestigd als generieke repo-regel.
- [x] `Due` vervangen door `Last change` — status: gebouwd.
- [x] Checklist compacter met gedeelde progress-chip / kleurbanden — status: gebouwd.
- [~] `onlyOpen` default / open taken filter — status: gedeeltelijk; technisch aanwezig maar nog niet correct als list-only requirement.
- [x] Linker rail icon-first — status: gebouwd, met nog open visuele bevestiging voor refresh-sizing.
- [x] Resizable detail pane — status: gebouwd.
- [~] Fullscreen detail toggle — status: gedeeltelijk; state/toggle aanwezig maar rendering nog niet structureel correct.
- [~] Actieve agent indicator in board/list/detail — status: gedeeltelijk; basisweergave aanwezig, animatie en consistente detail-state ontbreken nog.
- [~] Agent metadata opslaan in task-md — status: gedeeltelijk; frontmattermodel aanwezig, activity-/commit-secties ontbreken nog.
- [ ] `## Commits` automatisch vullen — status: nog niet gebouwd.
- [ ] Multi-agent concurrency-aanpak — status: nog niet afgerond / niet bewezen.

### Al gebouwd in code

- `review` status toegevoegd in plugin statusmodel (`backlog -> ready -> in_progress -> review -> blocked -> done`).
- `Due` in list view vervangen door `Last change` met sortering op wijzigingsdatum.
- Checklist-progress compacter gemaakt met gedeelde helper/presentatielaag voor board + list.
- `onlyOpen` default technisch toegevoegd (`true`), maar nog niet volgens de latere list-only wens afgebakend.
- Linker rail omgezet naar icon-first navigatie.
- Resize-handle en fullscreen toggle voor task detail toegevoegd.
- Frontmatter support toegevoegd voor agentvelden (`active_agent`, model, runtime, since, status, settings).
- Basisweergave van agentactiviteit toegevoegd in board/list en agent metadata in task detail.

### Gedeeltelijk gebouwd / nog niet af

- **Punt 5 — only open taken**
  - Staat nu als generieke filter/default in code.
  - Moet nog worden aangescherpt zodat het **alleen in list view zichtbaar én alleen daar toegepast** wordt.

- **Punt 9 — actieve agent indicator**
  - Basis chip/label bestaat in board/list.
  - Nog niet af: subtiele animatie zolang actief, en nog geen uniforme visuele active-state in board + list + detail.

- **Punt 10 — agent metadata in task-md**
  - Frontmatter velden bestaan en worden al geparsed/geschreven.
  - Nog niet af: expliciete sectiestructuur/historiek zoals `## Agent activity` en verdere activity-log per taak.

- **Punt 8 — fullscreen detail toggle**
  - Toggle/state bestaat.
  - Nog niet af: structureel stabiele fullscreen-rendering zonder overlap/lege side-pane placeholder.

### Nog niet overtuigend gebouwd / niet als klaar te claimen

- **Punt 2 — manual sorting regels voor actieve taken bovenaan binnen hun status**
  - Nieuwe taken bovenaan lijkt grotendeels aanwezig.
  - Niet bevestigd als generieke repo-regel: taken met actieve agent automatisch bovenaan binnen hun status.

- **Punt 11 — `## Commits` automatisch vullen**
  - Nog geen bewijs dat nieuwe commits automatisch naar relevante taskfiles worden gelogd.

- **Punt 12 — concurrency-aanpak voor multi-agent activity + sort order**
  - Bestaande file-version/conflictchecks helpen al deels.
  - De specifieke multi-agent uitbreiding uit het plan is nog niet als afgeronde feature zichtbaar.

## Bekende resterende punten uit deze sessie

- Fullscreen detail is nog niet volledig correct: in de huidige WIP kan de oude rechter-placeholder zichtbaar blijven terwijl detail over de list/board heen valt.
- Oorzaak lijkt structureel: de fullscreen task-detail render gebruikt nog niet overal een echt los fullscreen layoutpad en leunt deels nog op de side-pane/split-pane structuur.
- De refresh-knop in de linker rail is codematig verder gelijkgetrokken, maar moet nog visueel bevestigd worden als exact dezelfde maat als de andere rail-icon buttons.
- Drag-vs-click suppressie is in code toegevoegd, maar heeft nog runtime-bevestiging nodig voordat dit als volledig afgerond UX-gedrag geldt.
- `onlyOpen` is volgens de nieuwste productscope nog niet correct: het hoort alleen in de list-filter te bestaan en alleen daar effect te hebben, niet als board-brede filter/default.
- Actieve agent-visualisatie is nog niet volledig volgens plan: animatie en consistente visual state in board/list/detail ontbreken nog.
- Agent metadata bestaat nu vooral als frontmatter-model; de geplande activity-/commit-secties in task-md zijn nog niet uitgewerkt.
- Commit-logging en de expliciete multi-agent concurrency-uitbreiding uit het uitgebreide plan zijn nog niet afgerond.
- De taak blijft bewust `in_progress` totdat deze laatste plugin-layout regressies én de handmatige smoke-check zijn afgerond.

## Blockers / afhankelijkheden

- VS Code verwacht voor een activity-bar container nog steeds een gekoppelde view; als volledig verwijderen daarvan technisch niet haalbaar blijkt, blijft alleen de minimaal noodzakelijke bridge over zonder oude launcher-semantiek.

## Verify / bewijs

- `npm run taskflow:verify`
- In `tools/budio-workspace-vscode/`: `npm run typecheck`
- In `tools/budio-workspace-vscode/`: `npm run test`
- In `tools/budio-workspace-vscode/`: `npm run apply:workspace`
- Handmatige smoke-check in VS Code:
  - activity-bar icoon opent direct list view
  - oude `Workspace` launcher/menu verschijnt niet meer als betekenisvolle tussenlaag
  - `Budio Workspace: Open Board` werkt nog
  - `Budio Workspace: Open List View` werkt nog
  - settings blijft bereikbaar

## Relevante links

- `tools/budio-workspace-vscode/package.json`
- `tools/budio-workspace-vscode/src/extension.ts`
- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
```

---

## STITCH_API_KEY voor MCP activeren

- Path: `docs/project/25-tasks/open/stitch-api-key-voor-mcp-activeren.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: stitch-api-key-voor-mcp-activeren
title: STITCH_API_KEY voor MCP activeren
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "De lokale `.env.local` krijgt de ontbrekende `STITCH_API_KEY`, zodat de Stitch MCP-config echt bruikbaar is wanneer Stitch nodig is."
tags: [mcp, stitch, local-dev, env]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

De repo heeft al een geconfigureerde Stitch MCP-server in `.codex/config.toml`, maar `STITCH_API_KEY` ontbreekt nog lokaal in `.env.local`. Daardoor blijft Stitch beschikbaar als setup, maar niet volledig bruikbaar.

## Gewenste uitkomst

De lokale setup bevat een actieve `STITCH_API_KEY` in `.env.local`, zodat Stitch MCP later zonder extra handelingen gebruikt kan worden. De sleutel blijft buiten de repo en wordt niet in docs of output gelekt.

## Waarom nu

- Stitch is al onderdeel van de repo-local MCP-config.
- De nieuwe MacBook setup is bijna compleet; dit is één van de laatste ontbrekende local-dev variabelen.
- De key staat nog op de oude laptop en moet bewust overgezet worden.

## In scope

- `STITCH_API_KEY` veilig overnemen naar `.env.local`.
- Controleren dat de key niet in git of docs terechtkomt.
- Verifiëren dat de lokale env-parser en tooling de key zien.

## Buiten scope

- Andere MCP-servers toevoegen.
- Stitch workflow-inhoud wijzigen.
- Globale CLI-installaties.

## Concrete checklist

- [ ] `STITCH_API_KEY` veilig toevoegen aan `.env.local`.
- [ ] Bevestigen dat de key alleen lokaal aanwezig is.
- [ ] Relevante verify draaien.

## Blockers / afhankelijkheden

- De sleutel staat nog op de oude laptop en moet door de gebruiker worden overgenomen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Lokale env-check op aanwezigheid van `STITCH_API_KEY`

## Relevante links

- `.codex/config.toml`
- `docs/dev/stitch-workflow.md`
```
