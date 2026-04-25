# Local development environment

Deze gids beschrijft de minimale lokale setup voor nieuwe Budio developers.
Gebruik eerst `docs/project/README.md` voor de waarheidshiërarchie en daarna deze gids voor machine-inrichting.

## Benodigdheden

- macOS met Docker Desktop actief.
- VS Code met de `code` CLI beschikbaar in je terminal.
- Git en GitHub CLI.
- Node 24 via `fnm`.
- Toegang tot de benodigde secrets voor `.env.local`.

Installeer of activeer Node 24:

```bash
fnm install 24
fnm use 24
node --version
npm --version
```

Log in op GitHub CLI:

```bash
gh auth login
gh auth status
```

## Repo bootstrap

```bash
git clone git@github.com:pflikweert/persoonlijke-assistent-app.git
cd persoonlijke-assistent-app
npm install
npm run check:node-version
```

De Supabase CLI is repo-local gepind via `devDependencies`.
Gebruik daarom `npx supabase ...` of de npm scripts; een globale Supabase CLI is niet nodig.

Controleer de gepinde versie:

```bash
npx supabase --version
```

De verwachte versie is `2.90.0`.

## Env setup

Maak `.env.local` op basis van `.env.example`.
Commit `.env.local` nooit.

Belangrijke local-first defaults:

```bash
EXPO_PUBLIC_SUPABASE_TARGET=local
EXPO_PUBLIC_SUPABASE_LOCAL_URL=http://127.0.0.1:54321
EXPO_PUBLIC_APP_ENV=development
```

Server-only secrets zoals `OPENAI_API_KEY` en `APP_SUPABASE_SERVICE_ROLE_KEY` blijven alleen in `.env.local` en mogen nooit in clientcode of `EXPO_PUBLIC_*` variabelen terechtkomen.

Optionele machine-specifieke browserkeuze voor Expo web:

```bash
BUDIO_DEV_BROWSER="ChatGPT Atlas"
```

Als `BUDIO_DEV_BROWSER` ontbreekt, gebruikt Expo het bestaande standaardbrowsergedrag.

## Dagelijkse local dev

Start de volledige lokale ontwikkelflow:

```bash
npm run dev
```

Dit commando:

- checkt of de lokale Supabase stack draait;
- forceert local Supabase auth-env voor Expo;
- start de lokale Supabase functions runtime;
- start Expo op de standaard webtarget `http://localhost:8081`.

Stop alleen de functions runtime die door `npm run dev` is gestart:

```bash
npm run dev:stop
```

Handige lokale URLs:

- App web: `http://localhost:8081`
- Supabase Studio: `http://127.0.0.1:54323`
- Mailpit: `http://127.0.0.1:54324`
- Supabase MCP: `http://127.0.0.1:54321/mcp`

Gebruik Mailpit als lokale bron voor magic-link mails. Verwacht tijdens local development geen auth-mails in je echte inbox.

## VS Code setup

Installeer de workspace recommendations uit `.vscode/extensions.json`.
De minimale set ondersteunt Expo, ESLint, NativeWind/Tailwind, Playwright, Markdown/taskfiles, YAML en TOML.

Aanbevolen extensions:

- `expo.vscode-expo-tools`
- `dbaeumer.vscode-eslint`
- `bradlc.vscode-tailwindcss`
- `ms-playwright.playwright`
- `DavidAnson.vscode-markdownlint`
- `yzhang.markdown-all-in-one`
- `redhat.vscode-yaml`
- `tamasfe.even-better-toml`

## Budio Workspace VS Code plugin

De lokale Budio Workspace plugin ondersteunt de taskfile workflow in `docs/project/25-tasks/**`.
Pas de plugin na wijzigingen of op een nieuwe machine toe met:

```bash
cd tools/budio-workspace-vscode
npm install
npm run apply:workspace
```

Als VS Code niet automatisch ververst door macOS-permissies, voer dan in VS Code `Developer: Reload Window` uit.

## MCP en CLI keuzes

Gebruik in deze repo standaard `.codex/config.toml`.
De default Supabase MCP target is `supabase_local`.
Gebruik `supabase_remote_ro` alleen voor expliciete productiegerichte read-only diagnose.

Deze MCP servers gebruiken repo-local of `npx` tooling:

- `context7`
- `playwright`
- `stitch`
- `supabase_local`

`STITCH_API_KEY` is optioneel en alleen nodig wanneer Stitch MCP actief wordt gebruikt.
Er is een aparte task voor het activeren van die key.

Voor normale local dev zijn geen globale installs nodig van:

- `supabase`
- `vercel`
- `expo`
- `playwright`
- `markdownlint-cli2`
- `eas`

Gebruik in plaats daarvan de bestaande npm scripts of `npx`.
Vercel env pull loopt via:

```bash
npm run env:pull:vercel
```

## Verify checklist

Draai na setup minimaal:

```bash
npm run lint
npm run typecheck
npm run verify:local-auth-mail
npm run taskflow:verify
npm run docs:lint
npm run docs:bundle
npm run docs:bundle:verify
```

Een korte startflow-smoke kan met `npm run dev`.
Succes betekent dat er geen shell/parserfout verschijnt, de lokale Supabase env wordt gebruikt, de functions runtime start en Expo `http://localhost:8081` toont.

## Bekende follow-ups

- `npm install` kan bestaande auditmeldingen tonen. Die horen bij de bestaande audit-task en worden niet stilzwijgend tijdens setup opgelost.
- Expo kan compatibility warnings tonen voor enkele packages. Behandel die als aparte dependency-maintenance taak, niet als onderdeel van machine-onboarding.
