# Content & Narrative Processing Rules (Canoniek)

## Doel
Dit document is het bindende gedragscontract voor contentverwerking in drie lagen:
1. `entries_normalized.body`
2. `day_journals.narrative_text`
3. `day_journals.summary`

Dit is de canonieke content-regeldoc voor MVP.

## Waarom dit document leidend is
Deze regels sluiten direct aan op:
- server contracts en guardrails in `process-entry`, `regenerate-day-journal`, `renormalize-entry`
- quality-verify checks in `scripts/verify-local-output-quality.sh`

## Kernregel
De engine structureert en verwoordt, maar voegt geen nieuwe betekenis toe.

## Laagcontracten
### 1) `entries_normalized.body`
Doel:
- volledige opgeschoonde entrytekst behouden

Mag:
- ruis/stotteren/kleine taalfouten opschonen
- betekenisloze dubbele herhaling reduceren

Mag niet:
- samenvatten
- merkbaar inkorten
- parafraseren naar generieke AI-tekst
- nieuwe claims toevoegen

### 2) `day_journals.narrative_text`
Doel:
- volledige verhalende dagtekst over alle betekenisvolle dagmomenten

Moet:
- brongebonden blijven
- ik-vorm volgen waar bron in ik-vorm is
- betekenisvolle momenten behouden
- rustige, natuurlijke leesbaarheid hebben

Mag niet:
- functioneren als samenvatting
- verslaggever-/derdepersoonstonen introduceren
- verzonnen brugzinnen, oorzaken of inzichten toevoegen
- therapie/diagnose/coachtaal gebruiken

### 3) `day_journals.summary`
Doel:
- korte, compacte dagsamenvatting voor snelle oriëntatie

Moet:
- duidelijk korter zijn dan narrative
- concreet en feitelijk blijven

Mag niet:
- rol van narrative overnemen
- nieuwe interpretatie of niet-brongebonden inhoud introduceren

## Scheidingsregel tussen lagen
- `entries_normalized.body` = volledige opgeschoonde bronlaag van één entry
- `day_journals.narrative_text` = volledige dagverhaallaag
- `day_journals.summary` = compacte samenvattingslaag

Als `summary` en `narrative_text` functioneel hetzelfde worden, is dat contractbreuk.

## Toonregels
Gewenst:
- rustig Nederlands
- concreet
- niet-meta
- niet-generiek AI

Ongewenst:
- psychologische duiding als feit
- therapietaal
- management-/rapporttaal
- meta-zinnen over “de notities” of aantallen als inhoudsvuller

## Acceptatiecriteria
1. Betekenisvolle broninhoud blijft behouden in `entries_normalized.body`.
2. `narrative_text` bevat alle relevante dagmomenten zonder verzinsels.
3. `summary` is korter en compacter dan `narrative_text`.
4. Geen marker-leak of fallback-tekst als inhoud in dagboek/reflectie.
5. Output blijft brongebonden en leesbaar op representatieve quality-fixtures.

## Implementatiekoppeling
Primair geraakt door:
- `supabase/functions/process-entry/index.ts`
- `supabase/functions/regenerate-day-journal/index.ts`
- `supabase/functions/renormalize-entry/index.ts`
- `supabase/functions/_shared/day-journal-contract.mjs`
- `scripts/verify-local-output-quality.sh`

## Buiten scope
- nieuwe AI-flowarchitectuur
- stijlclone-engine
- extra tabellen of migrations voor deze regels
