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
- `new` → `smoke.new.<timestamp>@example.com` (verse user, alleen indien nodig)

Regel:

- gebruik standaard `default`
- gebruik `clean` voor een rustige startsituatie
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
2. open app op lokale web-url
3. maak/bekijk entries
4. voer de specifieke feature smoke uit (bijv. entry detail galerij/audio)

## Galerij smoke checklist (entry detail)

- audio-opnamecomponent zichtbaar op juiste plek
- geen foto: samenvatting + onderaan foto-add sectie
- één foto: featured onder samenvatting + fullscreen vergroting
- twee+ foto’s: swipe + correcte teller/index
- fullscreen close rechtsboven overlay
- delete-actie onderin + confirm op voorgrond
