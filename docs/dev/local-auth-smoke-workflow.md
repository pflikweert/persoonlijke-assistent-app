# Local auth smoke workflow (magic link + Mailpit)

## Doel

Een reproduceerbare lokale loginflow voor smoke tests, zonder auth-bypass in runtime.

Deze workflow is **local-only** en gebruikt:

- `EXPO_PUBLIC_SUPABASE_TARGET=local`
- lokale Supabase (`http://127.0.0.1:54321`)
- Mailpit (`http://127.0.0.1:54324`)
- lokale app-url (`http://localhost:8081`)

## Smoke user-profielen

- `default` → `smoke.default.local@example.com` (standaard)
- `clean` → `smoke.clean.local@example.com` (schone baseline)
- `aiqs` / `admin` → `smoke.aiqs.local@example.com` (dedicated admin/founder smoke-user)
- `new` → `smoke.new.<timestamp>@example.com` (verse user, alleen indien nodig)

Regel:

- gebruik standaard `default`
- gebruik `clean` voor een rustige startsituatie
- gebruik `aiqs` of `admin` voor AIQS/admin-smokes; hergebruik hiervoor niet de gallery/consumer smoke-user
- gebruik `new` alleen als je expliciet een nieuwe user/sessie wilt

## Belangrijk: geen auth-backdoor

Deze repo gebruikt **geen** login-bypass of hidden dev-auth route.

Testen gebeurt via echte magic-link auth:

1. request OTP
2. lees Mailpit message
3. haal verify link op
4. rond sessie af

## Commands

### 1) Mail bezorging checken

```bash
npm run verify:local-auth-mail
```

Optioneel profiel kiezen:

```bash
SMOKE_TEST_EMAIL_PROFILE=clean npm run verify:local-auth-mail
```

### 2) Verify link ophalen

```bash
npm run verify:local-auth-magic-link
```

JSON output bevat `verifyLink` die je in browser kunt openen.

### 3) Volledige local login-proof

```bash
npm run verify:local-auth-login
```

Deze check bevestigt dat de magic-link flow eindigt met een geldige auth user session.
Dit is **token/login-proof**, niet automatisch bewijs dat een browser-tab al echt ingelogd in de app landt.

### 3b) AIQS/admin login + baseline bootstrap

```bash
npm run verify:local-aiqs-login
```

Deze check gebruikt de dedicated admin smoke-user, zorgt voor founder + `ai_quality_studio` toegang en valideert dat AIQS runtime-baseline lokaal weer live kan worden gezet.

Als `ADMIN_AI_QUALITY_INTERNAL_TOKEN` of `ADMIN_REGEN_INTERNAL_TOKEN` lokaal leeg is, genereert deze verify tijdelijk een local-only token, herstart daarna de Supabase functions runtime met een tijdelijke env-file en meldt dat expliciet in de output.

### 3c) Volledige AIQS local browser-smoke

```bash
npm run verify:local-aiqs-smoke
```

Deze flow:

1. start lokale dev automatisch als `http://localhost:8081` nog niet draait
2. bootstrapt de dedicated AIQS/admin smoke-user
3. logt een echte browser-tab in via Mailpit magic link
4. opent `AI Quality Studio`
5. valideert de workspace-first overviewstructuur

De scriptoutput meldt:

- welk commando gebruikt is voor local dev
- welke target-URL gevalideerd is
- of het devproces door het script gestart is
- waar eventuele devlogs staan
- of de functions runtime tijdelijk herstart is met een gegenereerde AIQS internal token

### 4) Cleanup (veilig, local-only)

Dry-run (default):

```bash
npm run verify:local-auth-cleanup
```

Echt verwijderen van herkenbare smoke users:

```bash
node scripts/cleanup-local-smoke-users.mjs --force
```

Guardrails:

- script weigert buiten `target=local`
- script verwijdert alleen herkenbare smoke e-mailpatronen
- script vereist expliciete `--force` voor destructive run

## Aanbevolen smoke test-volgorde voor UI

1. `npm run verify:local-auth-login`
2. bevestig dat de lokale app-url bereikbaar is; als gevraagd runtime-bewijs anders ontbreekt mag de agent de kleinste benodigde lokale app-target zelf starten of herstarten
3. maak/bekijk entries
4. voer de specifieke feature smoke uit (bijv. entry detail galerij/audio)

Voor AIQS/admin:

1. `npm run verify:local-aiqs-smoke`
2. alleen als een aparte adminflow buiten AIQS wordt getest: hergebruik de dedicated `aiqs/admin` smoke-user of maak daar bewust een nieuw admin-profiel voor

Leg bij zo'n lokale start/restart kort vast:

- commando
- target-url
- of het process nog draait na de check

Voor `verify:local-aiqs-smoke` geldt:

- als het script zelf local dev start, stopt het dat proces na de smoke weer
- als local dev al draaide, laat het script die bestaande runtime ongemoeid
- als de lokale AIQS internal token ontbreekt, herstart het script wel kort de functions runtime met een tijdelijke env-file zodat `import_runtime_baseline` ook zonder handmatige shell-export werkt

## Galerij smoke checklist (entry detail)

- audio-opnamecomponent zichtbaar op juiste plek
- geen foto: samenvatting + onderaan foto-add sectie
- één foto: featured onder samenvatting + fullscreen vergroting
- twee+ foto’s: swipe + correcte teller/index
- fullscreen close rechtsboven overlay
- delete-actie onderin + confirm op voorgrond
- bij uploadregressies: bewijs niet alleen add/remove happy path, maar ook een relevante failure-state waarbij bestaande gallery-content zichtbaar blijft
