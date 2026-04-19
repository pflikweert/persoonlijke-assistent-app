# Open Points — Resterend Werk

## Doel
Dit document bevat alleen resterende gaps, risico’s en onzekerheden op basis van code-realiteit.

## Echt open (niet aangetroffen in code als productfeature)
1. Self-service beheer van adminrechten in product-UI ontbreekt; huidige toegang loopt via server-side allowlist env.

Toelichting:
- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.
- settings export/import/delete zijn functioneel aanwezig en voor deze scope bewezen.

## Deels open (nog niet hard afgerond)
1. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
2. 1.2E private-beta readiness met volledige runtime-doorloop van de releasechecklist in light + dark mode.
3. Commerciële brug van capture naar publiceerbare output (Pro-wedge) is strategisch uitgewerkt in research, maar nog niet als eindgebruikersflow productmatig geland.
4. Nieuwe 00/10/20/30/40/50 uploadbundels zijn nu primair ingericht, maar teamworkflow moet nog expliciet op deze primaire set standaardiseren (legacy blijft nog aanwezig).

## Onzeker
1. Expliciete aparte post-capture assistentlaag als zelfstandige feature.
2. Import-verify robuustheid door ontbrekende chatgpt-import fixture.
3. Volledige handmatige UI-smoke voor alle settings-states (hub/export/import/delete) is nog niet als apart bewijsartefact vastgelegd.
4. Repo versus productie-deploy boundary is nog niet expliciet genoeg: welke repo-artefacten (docs/workflow/Obsidian-werkbestanden) mogen versioned zijn maar horen nooit in runtime/deploypad terecht te komen.

## Afwijkingen tussen huidig MVP-plan en runtime-realiteit

### Functionaliteit-afwijkingen (al gebouwd t.o.v. oudere docs)
1. Audio-opslagvoorkeur per gebruiker is toegevoegd (aan/uit bewaren van originele opnames), inclusief storage- en metadatafundering.
2. Import/background task infrastructuur is toegevoegd met `user_background_tasks` en voortgang/notices in UI.
3. Settings IA is verbreed met aparte audio-instellingen naast export/import/delete en admin-routes.
4. Supabase hardening bevat extra security- en dataconsistentie-aanpassingen (search_path-fixes, `entries_normalized.updated_at`) die niet als afzonderlijke productcapabilities in het oudere MVP-plan stonden.

### UI/UX-afwijkingen (al zichtbaar in product)
1. Branded laag “Budio Vandaag” is doorgevoerd in auth/header/menu/splash en ligt nu nadrukkelijker op merkidentiteit dan in eerdere MVP-docs stond.
2. Shell-polish (menu/topnav/background consistency) is verder doorgevoerd dan de oorspronkelijke minimale MVP-beschrijving.
3. Capture/detail/settings UX bevat nu uitgebreidere status- en feedbackstates (background notices, selector-modals, audio playback), waardoor de runtime-ervaring rijker is dan de vroege MVP-baseline.

### Strategische afwijkingen (research vs huidige productrealiteit)
1. Research stuurt op Pro-wedge (capture -> review -> output/publicatievoorbereiding), maar die flow ontbreekt nog als concrete gebruikersfunctionaliteit.
2. Research stuurt op usage/credits/tiering en commerciële stuurinformatie; runtime bevat dit nog niet als productlaag.
3. AIQS is sterk als admin-governance, maar nog niet de volledige control plane zoals in future-state research beschreven.

## Prioriteit
1. Maak completion-criteria voor 1.2A/1.2B/1.2C/1.2E expliciet en toetsbaar.
2. Maak expliciet besluitbaar welke MVP-afwijkingen worden geformaliseerd in volgende planupdate (zonder huidige canonieke plannen nu te herschrijven).
3. Los onzekerheden op met hard bewijs; anders onzeker laten.
4. Beslis expliciet welke research-gedreven afwijkingen (Pro-wedge, flow-modulariteit, AIQS control-plane verdieping) in de volgende planronde naar `planning/next` promoveren.

## Risico’s
1. Scope-creep richting brede assistent.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.
4. Strategische drift: capture-machine blijft groeien zonder commerciële outputbrug te operationaliseren.

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
