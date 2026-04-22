# Open Points — Resterend Werk

## Doel
<!-- TASK_OVERVIEW:START -->
_Open taken voor de huidige fase; de detailbeschrijving leeft in `docs/project/25-tasks/**`._

| Taak | Status | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- | --- |
| [AIQS productie live zetten voor bestaande OpenAI-calls](25-tasks/open/aiqs-productie-live-zetten-bestaande-openai-calls.md) | Backlog | p1 | transitiemaand-consumer-beta | De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls. Er worden geen nieuwe calls toegevoegd en geen n... |
| [1.2B outputkwaliteit expliciteren en afronden](25-tasks/open/1-2b-outputkwaliteit-expliciteren-en-afronden.md) | In Progress | p1 | transitiemaand-consumer-beta | Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als "voldoende goed" geldt. De ta... |
| [1.2E beta-readiness expliciteren en afronden](25-tasks/open/1-2e-beta-readiness-expliciteren-en-afronden.md) | In Progress | p1 | transitiemaand-consumer-beta | Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.... |
| [AIQS logging valideren in OpenAI dashboard en fallback-logpad](25-tasks/open/aiqs-logging-valideren-openai-dashboard-en-fallback.md) | In Progress | p1 | transitiemaand-consumer-beta | Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests... |
| [AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)](25-tasks/open/aiqs-admin-interface-thema-herontwerp-spotify-openai-stijl.md) | Backlog | p2 | transitiemaand-consumer-beta | AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.... |
| [Budio webapp compatible maken](25-tasks/open/budio-webapp-compatible-maken.md) | Backlog | p2 | transitiemaand-consumer-beta | Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een... |
| [Docs scheiden naar private repo (strategie + migratieplan)](25-tasks/open/docs-private-repo-scheiding-en-migratieplan.md) | Backlog | p2 | transitiemaand-consumer-beta | Een concreet en uitvoerbaar migratieplan voor optie 2: docs onderbrengen in een aparte private repo binnen dezelfde workspace, inclusief... |
| [niet vergeten](25-tasks/open/niet-vergeten.md) | Backlog | p2 | transitiemaand-consumer-beta | Beschrijf in 1-3 korte alinea's wat klaar moet zijn wanneer deze taak done is. |
<!-- TASK_OVERVIEW:END -->

Dit document bevat alleen resterende gaps, risico’s en onzekerheden op basis van code-realiteit.

## Obsidian links

- [[current-status]]
- [[20-planning/20-active-phase|Active phase]]
- [[20-planning/30-now-next-later|Now / Next / Later]]
- [[20-planning/40-deviations-and-decisions|Deviations and decisions]]
- [[10-strategy/30-research-map|Research map]]
- [[30-research/README|Research hub]]
- [[40-ideas/README|Ideas workspace]]

## Echt open (niet aangetroffen in code als productfeature)

1. Self-service beheer van adminrechten in product-UI ontbreekt; huidige toegang loopt via server-side allowlist env.

Toelichting:

- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.
- settings export/import/delete zijn functioneel aanwezig en voor deze scope bewezen.

## Deels open (nog niet hard afgerond)

1. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
2. 1.2E private-beta readiness met volledige runtime-doorloop van de releasechecklist in light + dark mode.
3. Internal Jarvis-baseline (founder-only) is alleen als research-lane actief (max 1 dag/week) en nog niet volledig uitgewerkt.
4. Knowledge Hub voor AIQS (PDF/audio/foto, grounding, citations) blijft hoge prioriteit, maar staat gepland voor volgend kwartaal.
5. Nieuwe 00/10/20/30/40/50 uploadbundels zijn nu primair ingericht, maar teamworkflow moet nog expliciet op deze primaire set standaardiseren (legacy blijft nog aanwezig).

## Onzeker

1. Tempo en diepte van Jarvis internal uitbreidingen voor planning/podcast/builder-workflows.
2. Import-verify robuustheid door ontbrekende chatgpt-import fixture.
3. Volledige handmatige UI-smoke voor alle settings-states (hub/export/import/delete) is nog niet als apart bewijsartefact vastgelegd.
4. Repo versus productie-deploy boundary is nog niet expliciet genoeg: welke repo-artefacten (docs/workflow/Obsidian-werkbestanden) mogen versioned zijn maar horen nooit in runtime/deploypad terecht te komen.

## Afwijkingen tussen huidig MVP-plan en runtime-realiteit

### Functionaliteit-afwijkingen (al gebouwd t.o.v. oudere docs)

1. Audio-opslagvoorkeur per gebruiker is toegevoegd (aan/uit bewaren van originele opnames), inclusief storage- en metadatafundering.
2. Import/background task infrastructuur is toegevoegd met `user_background_tasks` en voortgang/notices in UI.
3. Settings IA is verbreed met aparte audio-instellingen naast export/import/delete en admin-routes.
4. Supabase hardening bevat extra security- en dataconsistentie-aanpassingen (search_path-fixes, `entries_normalized.updated_at`) die niet als afzonderlijke productcapabilities in het oudere MVP-plan stonden.
5. Obsidian settings-route is technisch aanwezig maar standaard uitgezet achter feature flag (`enableObsidianSettings`), waardoor runtime-capability en zichtbare productscope uit elkaar lopen.

### UI/UX-afwijkingen (al zichtbaar in product)

1. Branded laag “Budio Vandaag” is doorgevoerd in auth/header/menu/splash en ligt nu nadrukkelijker op merkidentiteit dan in eerdere MVP-docs stond.
2. Shell-polish (menu/topnav/background consistency) is verder doorgevoerd dan de oorspronkelijke minimale MVP-beschrijving.
3. Capture/detail/settings UX bevat nu uitgebreidere status- en feedbackstates (background notices, selector-modals, audio playback), waardoor de runtime-ervaring rijker is dan de vroege MVP-baseline.

### Strategische afwijkingen (research vs huidige productrealiteit)

1. Research stuurt op Pro-wedge (capture -> review -> output/publicatievoorbereiding), maar die flow ontbreekt nog als concrete gebruikersfunctionaliteit.
2. Research stuurt op usage/credits/tiering en commerciële stuurinformatie; runtime bevat dit nog niet als productlaag.
3. AIQS is sterk als admin-governance, maar nog niet de volledige control plane zoals in future-state research beschreven.

## Prioriteit

1. Plan A primair afronden: AIQS-basis + 1.2B/1.2E bewijsgedreven completion.
2. Plan B beperkt uitvoeren: Jarvis internal-only researchlane binnen weekbudget.
3. Knowledge Hub inhoudelijk voorbereiden als next-quarter high-prio traject.
4. Verbind podcast/builder-wedge expliciet aan publieke roadmapkeuzes.
5. Los resterende onzekerheden op met hard bewijs; anders onzeker laten.

## Risico’s

1. Scope-creep waarbij Jarvis alsnog impliciet publieke feature wordt.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.
4. Strategische drift: te veel interne Jarvis-focus zonder publiek-relevante Knowledge Hub voortgang.

## Later project — import volledig laten doorlopen op de achtergrond

### Status

Later onderzoeken. Niet voor huidige fase.

### Waarom

Het echte importeren van entries draait server-side zodra de request loopt.
De naverwerking daarna is nu nog afhankelijk van het open importscherm of actieve app-sessie.
Daardoor is dit nog geen volledige fire-and-forget achtergrondtaak.

### Gewenste eindrichting

Import moet volledig server-side kunnen doorlopen, ook als:

- de gebruiker het scherm sluit
- de app naar de achtergrond gaat
- de verbinding kort wegvalt na het starten

### Doel

Een robuustere importflow waarbij:

- entry-import start via één gebruikersactie
- afgeleide verwerking daarna zelfstandig doorloopt
- dagboekdagen, weekreflecties en maandreflecties niet meer afhankelijk zijn van actieve client-state

### Buiten scope nu

Niet in fase 1.2.
Dit raakt architectuur, job-afhandeling en betrouwbaarheid van achtergrondverwerking.

### Waarom later waardevol

- betrouwbaardere importervaring
- minder afhankelijkheid van open scherm of actieve app
- logisch vervolg op importfeature zodra MVP/hardening stabiel is

### Open vragen voor later

- server-side jobmodel of queue
- statusopvolging voor gebruiker
- retry-gedrag bij mislukte naverwerking
- hoe en wanneer de UI importstatus terughaalt
