# Persoonlijke Assistent App — Productvisie Aanscherping (MVP)

## Doel
Dit document scherpt de productrichting aan zonder de oorspronkelijke scope te verbreden.

Bindend in combinatie met:
- `docs/project/master-project.md`
- `docs/project/content-processing-rules.md`

## Kernformule
De productformule voor MVP blijft:
- capture → structureren → dagboekdag → weekreflectie → maandreflectie

Aangescherpte formule:
- capture → korte terugkoppeling waar passend → opname in dagboeklaag → latere reflectie

## Harde productregel
De app is eerst een dagboekmachine, pas daarna een lichte assistentlaag.

Dat betekent:
- dagboeklaag is leidend
- assistentlaag is ondersteunend
- geen open chatproduct als default

## Twee sporen
### Spoor A — Canonieke inhoud (leidend)
- ruwe input
- genormaliseerde entry
- day journal
- weekreflectie
- maandreflectie

Eigenschap:
- duurzaam opgeslagen en terugleesbaar

### Spoor B — Tijdelijke assistentie (ondersteunend)
- korte observatie/spiegel/vraag direct rond capture
- eventueel zeer beperkte vervolginteractie

Eigenschap:
- niet leidend
- standaard niet de canonieke dagboeklaag

## Realiteitscheck t.o.v. actuele code
Status van de aangescherpte assistentlaag als aparte feature:
- **Deels aanwezig / onzeker**

Wat wel hard aantoonbaar is:
- capture-verwerking
- entry completion schermen
- afgeleide heropbouw (day journal + reflecties)

Wat niet hard als aparte laag is aangetoond:
- een duidelijk afgebakende, zelfstandige post-capture assistentmodule met eigen persistentieregels

Beslisregel:
- zolang dat bewijs ontbreekt, blijft de status “deels aanwezig / onzeker”.

## Dagboekhygiëne
Standaard niet in de canonieke dagboeklaag:
- assistentmeta-tekst
- analyse-over-analyse
- losse chatachtige interactie zonder dagboekwaarde

Wel in de canonieke dagboeklaag:
- gebruikersbron
- genormaliseerde inhoud
- dagboekdag
- week/maandreflecties

## Scopebehoud
Binnen MVP:
- capture-first flows
- betrouwbare dagboekopbouw
- rustige reflecties

Buiten MVP:
- brede coach/chatmodus
- therapeutische of diagnose-achtige assistentrollen
- open memory-agentgedrag
- verbreding naar algemene agentarchitectuur

## Fase 1.2 implicaties
- 1.2B: kwaliteit van narrative en reflecties moet brongetrouw en niet-generiek blijven.
- 1.2C: UX moet duidelijk maken wat canonieke opslag is en wat tijdelijke assistentie is.
- 1.2D: export mag niet impliciet verworden tot chatlog-export.

## Beslisregel voor vervolg
Nieuwe ideeën tellen alleen mee als ze de dagboekmachine versterken.
Als iets vooral richting brede assistent trekt, valt het buiten de huidige fase.
