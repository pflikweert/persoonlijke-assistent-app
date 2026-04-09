# Open Points — Resterend Werk

## Doel
Dit document bevat alleen resterende gaps, risico’s en onzekerheden op basis van code-realiteit.

## Echt open (niet aangetroffen in code als productfeature)
1. Self-service beheer van adminrechten in product-UI ontbreekt; huidige toegang loopt via server-side allowlist env.

Toelichting:
- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.
- settings export/import/delete zijn functioneel aanwezig en voor deze scope bewezen.

## Deels open (nog niet hard afgerond)
1. 1.2A stabiliteit/foutafhandeling als complete afgeronde subfase.
2. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
3. 1.2C UX-polish over alle kernflows.
4. 1.2E private-beta readiness met expliciete releasechecklist.

## Onzeker
1. Volledige implementatiedekking van designrefs 1.2.1 per scherm.
2. Expliciete aparte post-capture assistentlaag als zelfstandige feature.
3. Import-verify robuustheid door ontbrekende chatgpt-import fixture.
4. Volledige handmatige UI-smoke voor alle settings-states (hub/export/import/delete) is nog niet als apart bewijsartefact vastgelegd.

## Prioriteit
1. Maak completion-criteria voor 1.2A/1.2B/1.2C/1.2E expliciet en toetsbaar.
2. Los onzekerheden op met hard bewijs; anders onzeker laten.

## Risico’s
1. Scope-creep richting brede assistent.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.

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
