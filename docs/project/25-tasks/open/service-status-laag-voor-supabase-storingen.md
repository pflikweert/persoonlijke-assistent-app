---
id: task-service-status-laag-voor-supabase-storingen
title: Service-status laag voor Supabase storingen
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: Implementeer een minimale production service-status laag die Supabase status-webhooks vertaalt naar een rustige banner en tijdelijke write-lock voor relevante Budio-flows.
tags: [supabase, production, incidents, reliability, ux]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---



# Service-status laag voor Supabase storingen

## Probleem / context

Budio mist nu een minimale productielaag om gebruikers rustig af te remmen wanneer Supabase een relevante storing of maintenance meldt. Daardoor kunnen gebruikers tijdens een externe storing nog steeds nieuwe opnames starten of wijzigingen proberen op te slaan, terwijl write-flows mogelijk falen of instabiel zijn.

De gewenste oplossing is bewust smal: geen brede statuspage of incident center, maar alleen een kleine production hardening-slice die actuele Supabase status vertaalt naar rustige UI en tijdelijke write-guards.

## Gewenste uitkomst

Er staat een minimale v1 service-status laag voor productie op Vercel/Supabase. Een webhook endpoint ontvangt Supabase status-webhooks, slaat de actuele service-status op, en maakt die status leesbaar voor de app.

Wanneer de status write-blocking is, toont Budio op relevante schermen een rustige header notification onder de topnav en worden write-acties tijdelijk disabled of guarded. Leesflows blijven beschikbaar en de app blijft bruikbaar wanneer status ophalen faalt.

## User outcome

Gebruikers zien bij een relevante storing een rustige melding en worden tijdelijk beschermd tegen nieuwe opnames of mutaties die waarschijnlijk zouden falen. Ze kunnen bestaande dagen en eerder opgeslagen content wel blijven bekijken.

## Functional slice

Een minimale production hardening-slice met:

- Supabase status webhook -> eigen service-status opslag
- client-side readmodel/helper
- compacte banner op relevante write-schermen
- tijdelijke write-lock voor capture en mutatie-acties

## Entry / exit

- Entry: Supabase Status verstuurt een incident-, maintenance- of componentstatus-webhook naar een Budio endpoint.
- Exit: de app leest de actuele status, toont indien nodig de juiste banner, en blokkeert alleen write-acties die tijdelijk niet veilig zijn.

## Happy flow

1. Supabase Status verstuurt een relevante webhook naar het Budio endpoint met geldige secret/header/token.
2. Het endpoint valideert de webhook en vertaalt incident/componentinformatie naar een compact service-status readmodel.
3. De actuele service-status wordt opgeslagen of bijgewerkt.
4. Relevante app-schermen lezen de status via een kleine service/helper.
5. Bij `write_blocked: true` toont de app de storing-banner en worden nieuwe opnames en mutaties disabled of guarded.
6. Bij een resolved incident wordt `write_blocked` weer `false` en verdwijnt of versoepelt de banner op basis van de nieuwe status.

## Non-happy flows

- Webhook secret ongeldig: request wordt afgewezen en status blijft ongewijzigd.
- Status fetch faalt client-side: app blijft bruikbaar; alleen de statuslaag valt stil.
- Degraded maar niet write-blocking: banner toont alleen een rustige performance-waarschuwing, zonder write-lock.
- Incident resolved maar payload blijft degraded impliceren: write-block gaat weg, maar status kan degraded blijven als de payload dat rechtvaardigt.

## UX / copy

- Banner alleen op logische schermen met write-acties:
  - Today / startscherm
  - Capture start / voice / type
  - Entry detail waar bewerken mogelijk is
  - Day detail waar wijzigingen of regeneratie mogelijk zijn
  - Settings import/export/regeneration alleen als de actie afhankelijk is van Supabase/write-flows
- Niet tonen op puur passieve lees-schermen zonder write-acties.
- Gebruik bestaande feedback-, header- en screen-primitives.
- Geen redesign, geen panic-UI, geen brede statuspage.
- Copy bij write-blocking:
  - Titel: `Tijdelijke storing`
  - Tekst: `Nieuwe opnames en wijzigingen zijn tijdelijk gepauzeerd. Je kunt je eerdere dagen nog bekijken.`
  - Actie: geen primaire CTA
- Copy bij degraded zonder write-block:
  - Titel: `Budio werkt mogelijk trager`
  - Tekst: `Sommige acties kunnen tijdelijk langer duren.`
  - Actie: geen primaire CTA
- Disabled helper bij write-acties:
  - `Tijdelijk niet beschikbaar door een storing.`

## Data / IO

- Input:
  - Supabase Status webhooks voor `incident created`, `incident updated`, `incident resolved` en `component status changed`
  - server-side secret via `SUPABASE_STATUS_WEBHOOK_SECRET`
- Output:
  - actuele service-status voor de app
  - banner-state en write-lock gedrag op relevante schermen
- Opslag/API/service/file-impact:
  - `supabase/migrations/**` voor service-status opslag
  - `supabase/functions/**` of bestaande passende server/API route voor webhookontvangst
  - `services/**` voor readmodel/helper
  - `components/feedback/**` voor rustige header/banner
  - relevante `app/**` routes voor guards/disabled states
  - korte operations-doc in `docs/dev/**` of passende operations-doc
- Statussen:
  - `operational | degraded | partial_outage | major_outage | maintenance | unknown`
  - `write_blocked: boolean`
  - `message: nullable text`
  - `incident_id: nullable text`
  - `updated_at`
  - `resolved_at: nullable`
  - `raw_payload: jsonb` indien passend

## Waarom nu

- Dit is een kleine maar waardevolle production hardening-slice.
- Het voorkomt dat gebruikers midden in een externe storing write-flows blijven proberen.
- De scope is bewust beperkt en past als afgebakende backlog-task zonder bredere roadmapverschuiving.

## In scope

- Supabase status webhook endpoint.
- Server-side verificatie via gedeelde secret/header/token.
- Database tabel of bestaande passende opslag voor service-status.
- Kleine client-side service/helper om status te lezen.
- Rustige header/banner onder topnav op relevante schermen.
- Disable/guard voor nieuwe entries, opnames en mutaties wanneer `write_blocked` actief is.
- Korte operationele documentatie van webhook URL + secret setup.
- Eventueel een minimale eigen health check, alleen als die cheap blijft en geen scope-creep veroorzaakt.

## Buiten scope

- Brede statuspage.
- Notificatiecentrum.
- Multi-provider dashboard.
- AIQS redesign.
- Meeting Capture scope-uitbreiding buiten de minimale write-lock die deze taak direct raakt.
- Herschrijven van productvisie of roadmap buiten deze hardening-task.
- Direct editen van generated docs in `docs/upload/**` of `docs/project/generated/**`.

## Oorspronkelijk plan / afgesproken scope

Bronprompt voor toekomstige uitvoering, bewust als minimale v1:

1. Bouw alleen:
   - webhook endpoint voor Supabase status-webhooks
   - opslag van actuele service-degradation status
   - rustige header notification onder de topnav op relevante schermen
   - tijdelijk blokkeren of disablen van write-acties wanneer status dit vereist
2. Gebruik Supabase Status Webhook als primaire externe incidentbron.
3. Gebruik de eigen Supabase API/account niet als primaire incidentbron; hoogstens als minimale aanvullende health check.
4. Fail-safe:
   - als status niet geladen kan worden, blijft de app bruikbaar
   - alleen expliciete active outage of maintenance blokkeert writes

## Expliciete user requirements / detailbehoud

- Plan mode: ja bij uitvoering.
- Voor toekomstige uitvoering eerst deze contextbronnen lezen:
  - `docs/upload/chatgpt-project-context.md`
  - `docs/upload/10-budio-core-product-and-planning.md`
  - `docs/upload/30-budio-build-ai-governance-and-operations.md`
  - `docs/upload/40-budio-design-handoff-and-truth.md`
- Gebruik rustige, niet-technische Budio-copy.
- Header notification moet direct onder topnav/hero komen waar passend.
- Warm, rustig en compact; geen rode panic-UI tenzij echt critical.
- Hergebruik bestaande feedback/screen-primitives, tokens en spacing.
- Geen nieuwe dependency tenzij echt noodzakelijk.
- Capture-first hiërarchie niet verstoren.
- Waarschijnlijke raakvlakken:
  - `supabase/migrations/**`
  - `supabase/functions/**` of bestaande server/API route
  - `services/**`
  - `components/feedback/**`
  - relevante `app/**` routes
  - env-voorbeeldbestand indien aanwezig
  - passende docs in `docs/dev/**` of `docs/project/**`
- Niet raken:
  - brede productvisie
  - generated docs/upload direct
  - AIQS redesign
  - Meeting Capture scope buiten deze slice
  - nieuwe roadmapbeslissingen buiten deze hardening-task
- Alleen committen tijdens uitvoering als verify slaagt.
- Beoogde implementatie-commit voor de bouwtaak:
  - `feat: add service status banner and write lock`

## Status per requirement

- [ ] Webhook endpoint voor Supabase Status — status: niet gebouwd
- [ ] Server-side webhook-verificatie — status: niet gebouwd
- [ ] Service-status opslag/readmodel — status: niet gebouwd
- [ ] Banner op relevante schermen — status: niet gebouwd
- [ ] Write-lock voor capture en mutaties — status: niet gebouwd
- [ ] Fail-safe bij status fetch failure — status: niet gebouwd
- [ ] Korte operations-doc voor webhook URL + secret — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen. Eventuele extra health check alleen toevoegen als die klein blijft en de hoofdscope niet vervangt.

## Uitvoerblokken / fasering

- [ ] Blok 1: preflight, relevante contextdocs, huidige write-flows en passende server-entrypoint bevestigen.
- [ ] Blok 2: webhook + opslag + readmodel bouwen.
- [ ] Blok 3: banner + write-guards op relevante schermen toevoegen.
- [ ] Blok 4: docs, verify en reconciliation afronden.

## Concrete checklist

- [ ] Passende storage-vorm kiezen voor actuele service-status.
- [ ] Webhookverificatie via bestaand env-patroon toevoegen met `SUPABASE_STATUS_WEBHOOK_SECRET`.
- [ ] Supabase status-events vertalen naar compact readmodel.
- [ ] Relevante schermen koppelen aan bannerweergave.
- [ ] Capture-, entry- en day-detail writes tijdelijk blokkeren bij `write_blocked`.
- [ ] Resolved incident haalt write-block weer weg.
- [ ] Operationele setup kort documenteren.

## Acceptance criteria

- [ ] Supabase webhook kan status opslaan en updaten.
- [ ] Resolved incident haalt write-block weg.
- [ ] Banner verschijnt alleen op relevante schermen.
- [ ] Nieuwe opname-, entry- en mutatie-acties zijn disabled of guarded bij `write_blocked`.
- [ ] Bestaande leesflows blijven beschikbaar.
- [ ] App crasht niet als status ophalen faalt.
- [ ] Copy is rustig en Budio-passend.

## Blockers / afhankelijkheden

- Nog geen harde blockers.
- Afhankelijk van een passende bestaande server-entrypoint-keuze binnen repo-architectuur.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Handmatige smoke:
  - mock webhook active incident -> banner zichtbaar + write-acties disabled
  - mock webhook resolved -> banner weg + write-acties weer actief
  - status fetch failure -> app blijft bruikbaar

## Reconciliation voor afronding

- Oorspronkelijk plan: minimale v1 service-status laag op basis van Supabase Status webhook.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: volledige uitvoering staat nog in backlog.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/25-tasks/README.md`


## Commits

- 5a7e3e0 — docs: add service status backlog task

- 942af46 — docs: sync local workspace state