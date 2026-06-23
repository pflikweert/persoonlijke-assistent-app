---
id: task-oude-dag-moment-toevoegen-via-bestaande-captureflow
title: Oude dag moment toevoegen via bestaande captureflow
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Vanuit een oudere dag kan de gebruiker via een rustige secundaire section-action een nieuw moment toevoegen via de bestaande captureflow, met targetDate/returnTo routing, correcte dagkoppeling bij opslag, `Later toegevoegd` timeline-labeling, een editorial momentdetail-hiërarchie, rustiger detail- en fotozones, een compatibele foto-uploadtrigger zonder deprecated ImagePicker API en een herstelde hoofdfoto-weergave op momentdetail."
tags: [capture, moments, day-detail, journal]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 49
---




## Probleem / context

De app laat nu vooral capture vanuit vandaag starten. Daardoor ontbreekt een kleine, gerichte route om achteraf nog een moment toe te voegen aan een oudere dag zonder de bestaande captureflow te verbreden of te redesignen.

De gewenste oplossing moet reading-first blijven op dagdetail, de huidige capturemodi intact laten en alleen een minimale targetDate/returnTo-koppeling toevoegen waar de bestaande dataflow dat nodig heeft.

## Gewenste uitkomst

Op een dagdetail kan de gebruiker via een secundaire actie `Moment toevoegen` een nieuw moment starten voor precies die dag. Op lege dagen verschijnt een compacte empty state met `Nog geen momenten voor deze dag.` en `Moment toevoegen aan deze dag`.

De bestaande captureflow blijft hetzelfde qua modes (`idle`, `voice`, `typing`). Alleen wanneer de capture voor een niet-vandaag datum opent, verschijnt een korte notice dat het moment aan die dag wordt toegevoegd. Na opslaan komt de gebruiker terug op die dag en wordt die dag opnieuw bijgewerkt.

## User outcome

De gebruiker kan later alsnog een relevant moment vastleggen onder de juiste eerdere dag, zonder nieuwe capturemodus, zonder datumkiezer op Today en zonder dat de huidige Today-captureflow verandert.

## Functional slice

Een kleine end-to-end slice van dagdetail -> bestaande captureflow -> entry-opslag -> dagregeneratie -> terug naar dezelfde dag, inclusief correcte timeline-labeling voor later toegevoegde momenten zonder originele tijd op die dag.

## Entry / exit

- Entry: gebruiker opent `app/day/[date].tsx` voor een oudere of lege dag en kiest `Moment toevoegen`.
- Exit: na succesvol opslaan staat het nieuwe moment op die gekozen dag en keert de gebruiker terug naar `/day/[date]`.

## Happy flow

1. Gebruiker opent een dagdetail van een oudere dag en ziet een secundaire actie `Moment toevoegen`.
2. De actie opent de bestaande captureflow met `targetDate` en `returnTo`; capture toont alleen bij een niet-vandaag dag de notice `Je voegt dit toe aan [datum].`
3. Gebruiker slaat een tekst- of spraakmoment op; de entry wordt aan `targetDate` gekoppeld, `created_at` blijft de echte opslagtijd, de gekozen dag regenereert en de app keert terug naar de gekozen dag.

## Non-happy flows

- Empty state: toon `Nog geen momenten voor deze dag.` en `Moment toevoegen aan deze dag`.
- Validation / unsupported state: ontbrekende of ongeldige `targetDate` valt veilig terug op de bestaande vandaag-flow.
- Failure / retry / cancel: bij opslaan tonen we `Opslaan mislukt. Probeer opnieuw.`; bij regeneratiefout blijft de entry bewaard en tonen we geen dataverliescopy.

## UX / copy

- Dagdetail moments/timeline-sectie krijgt een secundaire actie: `Moment toevoegen`
- Lege dag toont:
  - `Nog geen momenten voor deze dag.`
  - `Moment toevoegen aan deze dag`
- Capture-notice bij niet-vandaag:
  - `Je voegt dit toe aan [datum].`
- Foutcopy:
  - `Opslaan mislukt. Probeer opnieuw.`
- Geen extra AI-, coach-, dashboard- of systeemtaal.
- Dagdetail blijft reading-first; days overview krijgt geen rij-CTA's of redesign.

## Data / IO

- Input: bestaande capture-input plus optionele `targetDate` en `returnTo` routeparams.
- Output: nieuwe entry gekoppeld aan geselecteerde dag; succesvolle save navigeert terug naar `/day/[date]`.
- Opslag/API/service-impact: alleen minimale uitbreiding van bestaande entry/capture model en dagregeneratieflow; `created_at` blijft de echte vastlegtijd.
- Statussen: bestaande capturestaten blijven `idle`, `voice`, `typing`.

## Waarom nu

- Dit vult een concrete gebruikerskloof in de dagdetailflow zonder bredere productscope te openen.
- De slice is klein, goed af te bakenen en past binnen de huidige MVP-guardrails.

## In scope

- Secundaire toevoegactie op dagdetail en lege dag.
- Routing van dagdetail naar bestaande captureflow met `targetDate` en `returnTo`.
- Compacte capture-notice alleen voor niet-vandaag.
- Entry-opslag koppelen aan `targetDate` waar nodig.
- Terugnavigeer naar de gekozen dag na opslaan.
- Gekozen dag opnieuw bijwerken/regenereren.
- Timeline-label `Later toegevoegd` wanneer geen originele tijd op `targetDate` aanwezig is.

## Buiten scope

- Nieuwe capturemodus.
- Datumkiezer op Today.
- Plus-knoppen in dagenoverzicht.
- Verplaatsen van bestaande momenten.
- Volledige kalenderflow.
- Nieuwe AI-flowarchitectuur, dependencies of redesign.
- Wijzigingen aan settings, export/import, AIQS of week/maandreflectie-redesign.

## Oorspronkelijk plan / afgesproken scope

- Bouw een minimale oude-dag-toevoegroute vanuit `app/day/[date].tsx` naar de bestaande captureflow.
- Houd de bestaande capture states, Today-CTA en globale capture-UX intact.
- Voeg alleen de kleinste dataflow-uitbreiding toe die nodig is om een entry aan `targetDate` te koppelen en daarna de gekozen dag te regenereren.
- Toon voor later toegevoegde momenten zonder originele dagtijd geen actuele kloktijd maar `Later toegevoegd`.

## Expliciete user requirements / detailbehoud

1. Geen nieuwe capturemodus.
2. Geen datumkiezer op Today.
3. Geen plus-knop op elke rij in het dagenoverzicht.
4. Geen verplaatsen van bestaande momenten.
5. Geen volledige kalenderflow.
6. Geen nieuwe AI-flowarchitectuur.
7. Geen nieuwe dependencies.
8. Geen redesign.
9. `created_at` blijft de echte vastlegtijd.
10. `targetDate` ontbreekt of is ongeldig: val veilig terug op vandaag of veilige fout.
11. Regenerate-failure mag de opgeslagen entry niet als verloren laten voelen.
12. `Moment toevoegen` blijft zichtbare copy, maar moet als rustige klikbare section-action ogen.
13. Geen primary gold CTA, geen floating action button en geen extra bottom-nav actie.
14. Accessibility label moet datumcontext bevatten, bijvoorbeeld `Moment toevoegen aan 13 mei 2026`.
15. In de momentenlijst blijft alleen `Later toegevoegd` zichtbaar; geen tweede datumlaag zoals `Toegevoegd op 14 mei`.
16. Momentdetail-hero voor later toegevoegde momenten gebruikt dagleidende meta `WOENSDAG 13 MEI 2026 · LATER TOEGEVOEGD`.
17. Auditmetadata verhuist naar een compacte `Momentdetails`-onderzone onder `Geschreven moment`.
18. Zonder foto’s verschijnt geen lege `Foto's bij dit moment` sectie; `Foto toevoegen` blijft als rustige actie beschikbaar.
19. `ImagePicker.MediaTypeOptions` wordt vervangen door de actuele Expo ImagePicker mediaTypes-config zonder uploadflow-redesign.
20. Zodra er foto’s zijn, verhuist `Foto toevoegen` uit `Momentdetails` naar de fotosectie zodat er geen dubbele uploadactie zichtbaar is.
21. `Momentdetails` en de fotosectie moeten premium, calm en editorial voelen, zonder settings-card of te veel goudaccent.
22. Als er foto’s zijn, toont momentdetail de eerste foto weer als grote hoofdfoto boven de thumbnailstrip; reorder van de eerste positie wijzigt daarmee ook de hoofdfoto.

## Status per requirement

- [x] Dagdetail toont `Moment toevoegen` — status: gebouwd
- [x] Lege dag toont empty state met CTA — status: gebouwd
- [x] Capture opent met `targetDate` en `returnTo` — status: gebouwd
- [x] Capture-notice verschijnt alleen bij niet-vandaag — status: gebouwd
- [x] Capture states blijven `idle`, `voice`, `typing` — status: gebouwd
- [x] Opslag koppelt entry aan `targetDate` — status: gebouwd
- [x] `created_at` blijft echte vastlegtijd — status: gebouwd
- [x] Timeline toont `Later toegevoegd` zonder verkeerde huidige tijd — status: gebouwd
- [x] Succes navigeert terug naar gekozen dag — status: gebouwd
- [x] Gekozen dag regenereert/opfrist na opslaan — status: gebouwd
- [x] Foutcopy toont `Opslaan mislukt. Probeer opnieuw.` — status: gebouwd
- [x] Section-action oogt duidelijk klikbaar maar blijft secundair — status: gebouwd
- [x] Empty state gebruikt dezelfde rustige action-richting zonder primary gold styling — status: gebouwd
- [x] Accessibility label bevat datumcontext — status: gebouwd
- [x] Momentdetail-hero gebruikt dagleidende historical meta — status: gebouwd
- [x] Auditmetadata en acties zitten in compacte `Momentdetails`-onderzone — status: gebouwd
- [x] Lege foto-sectie wordt niet meer als groot blok gerenderd — status: gebouwd
- [x] Deprecated ImagePicker-mediaTypes zijn vervangen zonder uploadflowwijziging — status: gebouwd
- [x] `Foto toevoegen` verdwijnt uit `Momentdetails` zodra een fotosectie zichtbaar is — status: gebouwd
- [x] Final polish geeft detail- en fotosecties een rustigere editorial hiërarchie — status: gebouwd
- [x] De eerste foto rendert weer als grote hoofdfoto boven de thumbnails en volgt reorder van de eerste positie — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- `returnTo` wordt alleen gebruikt wanneer de meegegeven dag ook geldig is, zodat een ongeldige `targetDate` veilig terugvalt op de bestaande vandaag-flow.
- De moments-sectie gebruikt nu een compacte pill-action met plus-icoon, subtiele border/surface en datum-specifiek accessibility label, zodat `Moment toevoegen` duidelijk klikbaar is zonder het day-detail zwaarder of primair te maken.
- UX-besluit voor historische momentenlijst: toon alleen `Later toegevoegd` als zachte tijdvervanger; toon in de lijst geen added-on datum of `created_at` context.
- Mini-polish: `Later toegevoegd` is visueel verkleind en rustiger gemaakt, dichter bij tijdmetadata dan bij contenttekst.
- Mini-polish: `Moment toevoegen` is visueel verkleind tot een compactere section-action, zodat de knop minder concurreert met `Individuele momenten`.
- Mini-polish: de historische capture-contextregel op het capture startscherm centreert icoon + tekst als één rustige metadataregel.
- Mini-polish: de historische targetDate-notice op de opnamepagina centreert nu de volledige compacte pill, inclusief icoon + tekst, zodat hij consistent voelt met de rest van de historical capture-context.
- Mini-polish: momentdetail gebruikt voor later toegevoegde momenten een dagleidende subtitel met optionele auditregel, en de lege foto-sectie wordt compacter zonder grote verticale reserve.
- Momentdetail-hiërarchie is verder hersteld: hero-meta werd kort en editorial (`WOENSDAG 13 MEI · LATER TOEGEVOEGD`), auditmetadata verhuisde naar `Momentdetails`, acties zijn compact gegroepeerd en de lege fotosectie is volledig weggehaald.
- De `Momentdetails`-zone gebruikt nu een rustige warm-neutral surface met compacte action rows, terwijl de fotossectie alleen nog rendert wanneer er echt thumbnails bestaan en de Expo ImagePicker-warning is weggehaald via de actuele `mediaTypes: [\"images\"]` API.
- Final polish-pass: section headers gebruiken nu minder accentdruk, `Momentdetails` heeft een zachtere tonal group zonder harde kaartlook, metadata leest rustiger en de fotostrip gebruikt grotere thumbnails met stillere ritmiek.
- Laatste foto-polish: de eerste foto is opnieuw de grote contentlaag van de fotosectie, terwijl de strip eronder de bestaande upload-, viewer- en reorder-interactie behoudt.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste route-, UI- en dataflowwijziging uitvoeren.
- [x] Blok 3: gerichte verify, smoke-check en task/docs afronden.

## Concrete checklist

- [x] Dagdetail-entrypoint en empty state toevoegen.
- [x] Capture-routeparams uitlezen en notice tonen.
- [x] Entry-opslag en dagregeneratie koppelen aan `targetDate`.
- [x] Timeline-labeling voor later-toegevoegde momenten corrigeren.
- [x] Section-action styling polish en accessibility-context toevoegen.
- [x] Historische metadata-label zachter maken zonder tweede datumlaag toe te voegen.
- [x] `Later toegevoegd` nog kleiner/rustiger maken zonder copy- of datawijziging.
- [x] `Moment toevoegen` visueel compacter maken zonder copy- of flowwijziging.
- [x] Historische capture-contextregel centreren zonder copy- of flowwijziging.
- [x] Historische opname-notice centreren zonder wijzigingen aan opname-UI of acties.
- [x] Momentdetail-subtitel en lege foto-state voor historische momenten polijsten.
- [x] Momentdetail-hiërarchie herstellen met compacte `Momentdetails`-onderzone en conditionele fotosectie.
- [x] Foto-action state en ImagePicker-compatibiliteit polijsten zonder uploadflow-redesign.
- [x] Final polish-pass op `Momentdetails` en foto-state UX uitvoeren.
- [x] Hoofdfoto-weergave op momentdetail herstellen zonder cover-photo feature of dataflowwijziging.
- [x] Lint, typecheck, taskflow verify en gerichte smoke uitvoeren.

## Acceptance criteria

- [x] Vanuit een oudere dag kan de gebruiker via `Moment toevoegen` de bestaande captureflow openen zonder extra modus of redesign.
- [x] Een opgeslagen moment verschijnt op de gekozen dag en niet op vandaag, terwijl `created_at` de echte opslagtijd blijft.
- [x] Later toegevoegde momenten zonder originele dagtijd tonen `Later toegevoegd` in plaats van een verkeerde huidige tijd.
- [x] De gebruiker keert na opslaan terug naar de gekozen dag en Today blijft ongewijzigd in primaire CTA en captureflow.
- [x] `Moment toevoegen` voelt als rustige secundaire section-action en niet als losse tekst of primary CTA.
- [x] Historisch toegevoegd moment toont alleen `Later toegevoegd` als rustige metadata, zonder `14 mei` of added-on datum in de lijst.
- [x] `Later toegevoegd` voelt duidelijk kleiner/rustiger dan de momenttitel en meer als tijdmetadata.
- [x] `Moment toevoegen` voelt als kleine section-action en concurreert niet meer met de sectietitel.
- [x] Historische contextregel voelt als één subtiele gecentreerde hint, niet als losse icon + tekst.
- [x] Historische opname-notice voelt als één subtiele gecentreerde hint op het record-scherm, zonder layoutshift of redesign.
- [x] Momentdetail toont bij later toegevoegde momenten de gekoppelde dag leidend en houdt de lege foto-state compact.
- [x] Momentdetail voelt weer als rustige editorial reading page met compacte metadata- en actiezone.
- [x] Foto-upload gebruikt geen deprecated `ImagePicker.MediaTypeOptions` meer en de fotossectie verschijnt alleen wanneer thumbnails bestaan.
- [x] Zodra er foto’s zijn leeft `Foto toevoegen` alleen nog in de fotosectie, en `Momentdetails` voelt na de final pass minder als settings/app-card.
- [x] Als er foto’s zijn, verschijnt de eerste foto weer groot boven de strip en blijft de strip de bestaande upload/reorder/viewer-interactie dragen.

## Blockers / afhankelijkheden

- Geen externe blockers bekend; afhankelijk van bestaande capture-routing en entry-verwerkingsflow.

## Verify / bewijs

- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- Light/dark smoke op `http://localhost:8081`:
  1. Open oudere dag.
  2. Klik `Moment toevoegen`.
  3. Bevestig juiste datum-notice in capture.
  4. Sla tekstmoment op.
  5. Keer terug naar oude dag.
  6. Bevestig dat moment op oude dag staat, niet vandaag.
  7. Bevestig dat geen verkeerde huidige tijd wordt getoond.
  8. Controleer dat Today-CTA en bestaande captureflow ongewijzigd blijven.
- Runtime-bewijs 2026-05-14 op `http://localhost:8081/day/2026-05-13`:
- Runtime-bewijs 2026-05-14 op `http://localhost:8081/day/2026-05-13`:
  - `Moment toevoegen` rendert als pill-button met plus-icoon, `min-height: 44px`, subtiele border en rustige surface.
  - Klik navigeert naar `/capture?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13`.
  - Typflow opent op `/capture/type?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13` met notice `Je voegt dit toe aan 13 mei 2026.`
  - Opslaan van `UI polish smoke voor oudere dag` keert terug naar `/day/2026-05-13?processed=1&entryId=...` en toont het nieuwe moment met label `Later toegevoegd`.
  - Today-regressie op `/capture/type` zonder queryparams toont geen target-date notice en slaat `Vandaag flow smoke na section action polish` succesvol op naar `/entry/[id]?source=capture&date=2026-05-14`.
  - Dark-mode check bevestigt dezelfde compositie met rustige button-styling (`backgroundColor: rgb(43, 41, 37)`, `borderColor: rgb(79, 73, 62)`), zonder zware extra panelen.
- Aanvullende polish nog uit te voeren:
  - afgerond: `Later toegevoegd` gebruikt nu een zachtere meta-weergave (`11px`, `14px` line-height, `textTransform: none`) dan echte tijden (`12px`, `18px` line-height).
  - afgerond: de lijst toont geen added-on datum zoals `14 mei` of `Toegevoegd op 14 mei`.
- Aanvullende runtime-bewijzen 2026-05-14:
  - Light mode: `/day/2026-05-13` toont `09:58`, `21:26` en exact `Later toegevoegd`; geen `14 mei` of `Toegevoegd op 14 mei` in de moments-lijst.
  - Dark mode: `Later toegevoegd` blijft rustig (`rgb(181, 173, 155)`), zonder badge of extra surface.
  - Klik op `UI polish smoke voor oudere dag` opent bestaande momentdetailroute `/entry/[id]?source=day&date=2026-05-13`.
  - `Moment toevoegen` navigeert nog steeds naar `/capture?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13`.
  - `/capture/type` zonder queryparams toont geen historical notice.
- Mini-polish nog uit te voeren:
  - afgerond: `Later toegevoegd` gebruikt nu een subtielere caption-variant (`10px`, `12px` line-height, `0.15px` letter-spacing, 80% muted tint) dan de bestaande tijdlabels (`12px`, `18px`).
  - afgerond: geen copy-, datum- of dataflowwijziging nodig geweest.
  - uit te voeren: `Moment toevoegen` compacter maken met kleinere icon/text/padding en lagere visuele hoogte, zonder gold/CTA-uitstraling.
  - afgerond: `Moment toevoegen` gebruikt nu een compactere section-action stijl (`32px` min-height, `5px 10px` padding, `14px` icon, caption-label, geen shadow) en klikt nog steeds door naar dezelfde captureflow.
- Runtime-bewijs 2026-05-15 op `http://localhost:8081/entry/4a07efac-b5d8-46b7-9711-9c1b997523fd?source=day&date=2026-05-13`:
  - Hero toont `WOENSDAG 13 MEI 2026 · LATER TOEGEVOEGD` en geen audittekst in de hero.
  - Zonder foto’s verschijnt geen aparte `Foto's`-sectie of lege placeholder.
  - `Momentdetails` rendert als rustige warm-neutral zone met compacte rows voor `Bewerken`, `Foto toevoegen`, `Ga naar woensdag 13 mei` en een subtiele danger-row `Verwijderen`.
  - `Ga naar woensdag 13 mei` is geen centrale pill meer maar een gewone navigatierow.
- Runtime-bewijs 2026-05-15 op `http://localhost:8081/entry/363699f4-dc01-4697-9cdf-c581601d1ee9?source=capture&date=2026-05-14`:
  - Normaal moment behoudt bestaande hero-meta `DONDERDAG 14 MEI OM 14:43`.
  - `Momentdetails` blijft compact en rustig zonder historische added-later copy.
- Final polish-smoke 2026-05-15:
  - Historisch no-photo momentdetail toont geen aparte fotosectie; `Foto toevoegen` leeft alleen in `Momentdetails`.
  - `Momentdetails` gebruikt een stillere tonal surface zonder duidelijke borderkaart, met subtielere metadata en minder goudaccent.
  - Normaal momentdetail behoudt dezelfde rustigere `Momentdetails`-opbouw zonder regressie in hero-meta of actions.
- Compatibiliteitsbewijs:
  - Code gebruikt nu `mediaTypes: [\"images\"]` in plaats van `ImagePicker.MediaTypeOptions.Images`.
  - Console-smoke op beide detailroutes toonde geen `expo-image-picker` deprecation-warning; alleen een bestaande web-warning over `shadow*` style props.
- Opgeloste beperking:
  - De standaard lokale testdatabase bevatte geen `entry_photos` records, maar die onzekerheid is afgevangen via een tijdelijke lokale smoke-fixture met cleanup.
- Aanvullend with-photos bewijs 2026-05-15 via lokale fixture:
  - `node scripts/seed-local-historical-entry-photo-detail-smoke.mjs` seeded één historisch momentdetail met drie foto’s op `http://localhost:8081/entry/58161b89-bced-4f39-8b29-065504011406?source=day&date=2026-05-13`.
  - Light en dark runtime-smokes tonen weer een grote hoofdfoto direct onder `Foto's`, met daaronder de compacte strip en `Foto toevoegen` alleen in de fotosectie.
  - `npx playwright test tests/e2e/gallery-smoke.spec.mjs` slaagt op reorder van de strip; de eerste positie blijft daarmee de bron van truth voor de hoofdfoto.
  - `npx playwright test tests/e2e/gallery-full.spec.mjs --grep 'opens the viewer'` slaagt ook, dus viewer-openen en delete-cancel blijven werken na de hoofdfoto-fix.
  - `node scripts/seed-local-historical-entry-photo-detail-smoke.mjs --cleanup` heeft de tijdelijke fixture daarna weer opgeruimd.

## Reconciliation voor afronding

- Oorspronkelijk plan:
  - Oude-dag toevoegen via bestaande captureflow met rustige secundaire entrypoint en correcte dagkoppeling.
  - Historische momenten rustig labelen en terug laten keren naar de gekozen dag zonder Today-flow te wijzigen.
- Later toegevoegde verbeteringen:
  - Section-action polish, gecentreerde historical notices, subtielere `Later toegevoegd`-labeling en een rustiger momentdetail.
  - Compacte `Momentdetails`-onderzone, conditionele fotosectie en ImagePicker-compatibiliteitsfix.
- Afgerond:
  - Dagdetail-entrypoint, capture-routing, opslag, dagregeneratie, timeline-labeling en momentdetail-polish zijn gebouwd en gerichte verify is uitgevoerd.
  - Historische momentdetail-hero is weer editorial, auditmetadata staat onderaan, de lege fotozone is verdwenen en de deprecated ImagePicker API is vervangen.
- Nog open / beperkt:
  - De fotosectie-met-thumbnails kon lokaal niet runtime-bevestigd worden omdat de huidige fixture-database geen `entry_photos` bevat.
  - uit te voeren: contextregel `Je voegt dit toe aan 13 mei 2026.` op `/capture?...` centreren als één compacte icon+tekst-regel.
  - afgerond: compacte `NoticeCard` kan nu optioneel gecentreerd renderen, en `/capture?...` gebruikt die alleen voor deze historische contextregel.
  - afgerond: `/capture/record?...` gebruikt nu ook de gecentreerde compacte `NoticeCard`, zodat de targetDate-pill daar exact in het midden staat.
  - aanvullende runtime-smoke 2026-05-14 op `/capture/record?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13` met viewport `390x844`:
    - light: notice zichtbaar, `justifyContent: center`, `alignItems: center`, `gap: 8px`, `textAlign: center`, `centerOffset: 0`
    - dark: dezelfde gecentreerde layout, `centerOffset: 0`, zonder layoutshift op small screen
  - afgerond: momentdetail toont voor later toegevoegde momenten hero-meta `WOENSDAG 13 MEI · LATER TOEGEVOEGD`, terwijl `Toegevoegd donderdag 14 mei om 14:42` alleen in `Momentdetails` staat; normale momenten behouden hun bestaande datum/tijd-regel.
  - afgerond: lege foto-state toont geen zware lead/body-copy meer en geen grote vertical reserve; de foto-sectie bleef in runtime-smoke compact (`height: 30`) met alleen `Foto toevoegen`.
  - aanvullende redesign-smoke 2026-05-15 op momentdetail:
    - historisch moment `/entry/...date=2026-05-13`: hero toont `WOENSDAG 13 MEI · LATER TOEGEVOEGD`, toont niet `Moment bij woensdag 13 mei 2026`, en toont `Toegevoegd donderdag 14 mei om 14:42` alleen in `Momentdetails`
    - `Momentdetails` bevat compacte acties `Bewerken`, `Foto toevoegen`, `Ga naar woensdag 13 mei`, `Verwijderen`
    - `Ga naar woensdag 13 mei` is geen grote pill meer (`height: 18`)
    - zonder foto’s is `Foto's bij dit moment` afwezig in light en dark mode, terwijl `Foto toevoegen` beschikbaar blijft
    - normaal moment `/entry/...date=2026-05-14` behoudt de bestaande hero-meta `DONDERDAG 14 MEI OM 09:15`

## Reconciliation voor afronding

- Oorspronkelijk plan: minimale oude-dag capture toevoegen via bestaande flow, zonder redesign of extra productoppervlak.
- Toegevoegde verbeteringen: veilige fallback zodat ongeldige `targetDate` niet alsnog via `returnTo` naar een oude dag terugstuurt; plus een rustige pill-style section-action zodat `Moment toevoegen` duidelijk klikbaar blijft zonder primary styling; plus polish om `Later toegevoegd` in de lijst zachter te laten voelen zonder tweede datumlaag of added-on datum; plus gecentreerde targetDate-hints op start-, type- en opname-schermen; plus momentdetail-copy die de gekoppelde dag leidend maakt, auditmetadata bundelt in `Momentdetails` en de lege foto-state volledig weghaalt.
- Afgerond: dagdetail-CTA/empty state, capture-routecontext, save-terugroute naar dagdetail, echte capturetijd behouden, `Later toegevoegd` label, section-action polish, accessibility label en runtime-smokes voor oudere dag plus today-regressie, inclusief gecentreerde opname-notice, historical momentdetail-hiërarchie, compacte `Momentdetails`-zone en conditionele fotosectie.
- Open / blocked: geen binnen deze taak.

## Relevante links

- `docs/project/open-points.md`
- `app/day/[date].tsx`
- `app/capture/index.tsx`
- `services/entries.ts`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state