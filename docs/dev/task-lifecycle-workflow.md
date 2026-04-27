---
title: Task lifecycle workflow
audience: agent
doc_type: workflow
source_role: operational
visual_profile: plain
upload_bundle: 80-budio-agent-workflow-and-docs-tooling.md
---

# Task lifecycle workflow (operationeel)

## Doel

Een expliciete, goedkope en herhaalbare workflow voor fase-taken, zodat open werk als concrete taakfiles kan worden gevolgd in plaats van alleen als losse gaps in `open-points.md`.

## Plaats in de hiërarchie

- Canonieke productwaarheid: `docs/project/**`
- Actieve planning: `docs/project/20-planning/**`
- Operationele taaklaag: `docs/project/25-tasks/**`
- Workflowafspraken: `docs/dev/**`

`25-tasks/**` is operationeel voor uitvoering en triage, niet de canonieke statuswaarheid.

## Statusmodel

- `backlog`
- `ready`
- `in_progress`
- `review`
- `blocked`
- `done`

## Kernregels

1. Gebruik één taakfile per concreet uitvoerbaar werkpakket.
2. Houd `title` menselijk refererbaar en `id` technisch stabiel.
3. Open taken leven in `docs/project/25-tasks/open/`.
4. Alleen taken met status `done` mogen in `docs/project/25-tasks/done/` staan.
5. `open-points.md` blijft voor gaps, risico's en onzekerheden; het taakoverzicht daarbinnen is afgeleid.
6. Idee vs taak: als flow nog niet bestaat, plugin-ondersteuning ontbreekt, of de scope nog epic-niveau is -> eerst `40-ideas/**` (epic-candidate), pas daarna taakpromotie.
7. Scope-routing is context-first: default-context is Budio app + AIQS; Jarvis/plugin alleen als intentie daar logisch op wijst.
8. Bij classificatietwijfel: hoge-impact eerst afstemmen, lage-impact als expliciete aanname vastleggen.
9. Always-on taskflow is verplicht voor alle inhoudelijke agenttaken (plan/research/bug/implementatie) binnen repo-context.
10. Uitzondering op regel 9: pure chat of simpele read-only vraag zonder uitvoertaak.
11. Elke tussentijdse update en elk eindresultaat vermeldt expliciet:
    - `Task: ...`
    - `Task file: ...`
    - `Status: ...`
12. Een inhoudelijk plan zonder taskfile is onvolledig.
13. In Plan Mode gebruik je eerst een bestaande taskfile wanneer daar een duidelijke match voor is.
14. Als er in Plan Mode geen passende bestaande taskfile is maar de nieuwe scope wel duidelijk is, maak dan automatisch een nieuwe task aan vanuit `_template.md`.
15. Vraag alleen bij echte twijfel: meerdere plausibele bestaande tasks, onduidelijke scope-routing, of onduidelijk task-vs-idea/epic.
16. Buiten Plan Mode: maak bij ontbrekende taskfile eerst de taskfile aan en ga pas daarna verder met plan/research/implementatie.
17. Elk inhoudelijk plan noemt expliciet de concrete taskfile-path.
18. Elk Plan Mode-plan bevat een korte **Taskflow summary** met:
    - welke bestaande of nieuw aangemaakte taskfile wordt gebruikt
    - welke statuswijziging verwacht wordt
    - wanneer extra werk binnen dezelfde task blijft
    - wanneer extra werk een eigen task krijgt
19. Verbeteringen uit testen van dezelfde flow blijven in dezelfde task; nieuw werk dat niet direct relevant is voor die flow krijgt een eigen task.
20. Een automatisch aangemaakte taak komt altijd bovenaan de doel-lane met `sort_order: 1`; herschrijf de overige open taakfiles in die lane doorlopend zodat de sortering opgeslagen blijft.
21. Wanneer een open taak naar `in_progress` gaat, komt die altijd bovenaan de `in_progress` lane; herschrijf `sort_order` in bron- en doellane doorlopend zodat lane-sortering leidend en persistent blijft.
22. Bij elke inhoudelijke taak kiest de agent zelf de efficiëntste uitvoerblokken/fases op basis van huidige agent/model, taaktype, risico, dirty worktree, verificatiekosten en afhankelijkheden.
23. Leg deze blokken vast in de taskfile-sectie `Uitvoerblokken / fasering` of in het eerste inhoudelijke plan/update; vraag dit alleen terug aan de gebruiker bij echte product-, planning- of architectuurtradeoffs.
24. Een goedgekeurd oorspronkelijk plan of expliciet afgestemde hoofdscope blijft tijdens uitvoering stabiel totdat de gebruiker die scope expliciet wijzigt.
25. Nieuwe feedback, regressies of verbeteringen tijdens uitvoering worden standaard vastgelegd als aanvullingen binnen dezelfde task, niet als stille vervanging van het oorspronkelijke plan.
26. Niet-triviale taken gebruiken hiervoor expliciet de secties:
    - `## Oorspronkelijk plan / afgesproken scope`
    - `## Expliciete user requirements / detailbehoud`
    - `## Status per requirement`
    - `## Toegevoegde verbeteringen tijdens uitvoering`
    - `## Reconciliation voor afronding`
27. Een taak mag niet naar `done` zolang de reconciliation niet expliciet aangeeft wat van het oorspronkelijke plan is afgerond, wat later is toegevoegd en wat nog open staat.
28. Samenvattingen vervangen nooit de detail-lijst van expliciete user-requirements als die details later nog nodig zijn voor bouwen, review of acceptatie.
29. Als een gebruiker expliciet vraagt om een bestaand uitgebreid plan, genummerde lijst of blokstructuur in de taskfile op te nemen, blijft die bronstructuur bewaard als eigen sectie en mag die niet worden teruggebracht tot alleen een afgeleide samenvatting.
30. Nieuwe of inhoudelijk geharde P1/P2 bouwtaken moeten **spec-ready** zijn voordat ze als bouwbaar gelden.
31. Spec-ready betekent minimaal: `User outcome`, `Functional slice`, `Entry / exit`, `Happy flow`, `Non-happy flows`, `UX / copy`, `Data / IO`, `Acceptance criteria` en `Verify / bewijs`.
32. Zet `spec_ready: true` alleen wanneer de taskfile zelfstandig uitvoerbaar is voor een developer of agent zonder chatcontext.
33. Nieuwe epics moeten naast doel en linked tasks ook P1/P2-scheiding, UX/copy-contract, flow-contract, dependencies en acceptatie bevatten.
34. Ideas/research/promotie-docs moeten promotiecriteria, open vragen en volgende stap bevatten; promoted/candidate ideas mogen niet als runtimewaarheid worden geschreven.

## Korte voorbeelden

- Bestaande match: een gebruiker vraagt vervolgwerk op een al open gallery-task; de agent kiest die bestaande task en plant daarbinnen verder.
- Geen match maar scope is helder: een gebruiker vraagt een nieuwe, afgebakende workflowregel; de agent maakt direct een nieuwe task aan vanuit `_template.md` en plant daarna verder.

## Standaardflow

1. **Create**
   - Maak nieuwe taken vanuit `docs/project/25-tasks/_template.md`.
   - Buiten Plan Mode geldt voor plan/research dezelfde regel: eerst taskfile, daarna inhoudelijke output.
   - In Plan Mode: gebruik een bestaande task bij duidelijke match, anders maak je direct een nieuwe task aan.
   - Vraag alleen bij echte classificatie-, lane- of scope-twijfel.
   - Zet de nieuwe taak direct bovenaan de doel-lane en sla de nieuwe lane-volgorde expliciet op via `sort_order`.
   - Vul voor nieuwe P1/P2 bouwtaken direct de spec-readiness secties in of laat `spec_ready: false` en markeer de taak nog niet als bouwbaar.
2. **Triage**
   - Kies status, prioriteit en fase.
   - Link terug naar bron in planning of `open-points.md`.
3. **Uitvoering**
   - Zet status direct op `in_progress` wanneer uitvoering start (tenzij al correct).
   - Verplaats de actieve taak direct naar de top van de `in_progress` lane en herschrijf de lane-volgorde expliciet.
   - Kies compacte uitvoerblokken en werk per blok af, in plaats van alles als één big-bang wijziging te doen.
   - Leg bij niet-triviale taken eerst het oorspronkelijke plan of de afgesproken scope expliciet vast en laat die sectie daarna stabiel.
   - Leg expliciete user-details met toekomstige uitvoer- of reviewwaarde vast onder een aparte requirement-sectie; laat ze niet verdwijnen in alleen een samenvatting.
   - Behoud een expliciet bronblok wanneer de gebruiker een bestaand uitgebreid plan of detailstructuur laat opnemen; reviewsamenvattingen komen daaronder, niet in plaats daarvan.
   - Voeg tijdens uitvoering nieuwe correcties of verbeteringen toe onder een aparte aanvullingssectie, in plaats van het oorspronkelijke plan impliciet te herschrijven.
   - Werk checklist, blockers en verify-sectie bij.
   - Leg testbevindingen en directe verbeteringen binnen dezelfde flow vast in dezelfde task.
   - Maak alleen een nieuwe task wanneer het extra werk inhoudelijk losstaat van de actieve flow.
4. **Done**
   - Zet status op `done`.
   - Verplaats het bestand naar `docs/project/25-tasks/done/`.
   - Rond pas af nadat de taskfile een expliciete reconciliation bevat tussen oorspronkelijk plan, toegevoegde verbeteringen en resterend werk.
   - Reconciliation bevat bij niet-triviale taken ook de status per expliciet requirement.
5. **Bundle / verify**
   - Draai `npm run taskflow:verify`.
   - Draai `npm run docs:bundle`.
   - Draai `npm run docs:bundle:verify`.
   - Draai `docs:bundle` en `docs:bundle:verify` altijd sequentieel, nooit parallel.

## Agentgebruik

- Lees bij niet-triviale uitvoering eerst `docs/project/open-points.md` en de relevante taskfile.
- Voor "nieuwe taak": maak eerst een taskfile aan.
- Voor verwijzingen in chat: gebruik bij voorkeur de taak `title`, fallback op `id`.

## Valkuilen

- Geen dubbele `title` of `id`.
- Geen `done`-status in `open/`.
- Geen open status in `done/`.
- Gebruik de taaklaag niet als vervanging van `current-status.md`.
- Geen afronding zonder expliciete `Task`/`Task file`/`Status` in updates en eindresultaat.
- Geen nieuwe P1/P2 bouwtask zonder happy/non-happy flows, UX/copy en acceptatiecriteria.
