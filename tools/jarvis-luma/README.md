# Jarvis Luma Tools

Local-only tooling for the first Budio Workspace Jarvis asset ingest flow.

These scripts are dev/build tooling. Do not import them from Expo, React Native, Supabase runtime code, or production app paths.

## Setup

Set the API key in your shell or `.env.local` before running real downloads:

```bash
export LUMA_AGENTS_API_KEY="..."
```

Supported key families:

- `luma-api-*` → Luma Agents API
- `luma-*` → Dream Machine API

Recommended local env layout:

```bash
LUMA_AGENTS_API_KEY="luma-..."
LUMA_AGENTS_API_UNI_KEY="luma-api-..."
```

`auto` mode prefers `LUMA_AGENTS_API_UNI_KEY` for documented Agents generation routes and falls back to `LUMA_AGENTS_API_KEY` for Dream Machine.

Use the raw key value only. Never commit secrets.

## Commands

Dry-run the Final Frame ingest:

```bash
node tools/jarvis-luma/download-final-frame.mjs --dry-run
```

Write local output to the default Jarvis asset root:

```bash
node tools/jarvis-luma/download-final-frame.mjs --dest assets/jarvis/final-frame
```

Refresh one logical asset:

```bash
node tools/jarvis-luma/download-final-frame.mjs --only jarvis-core --refresh
```

## Output

Default output lives in `assets/jarvis/final-frame/`:

- `jarvis-assets-manifest.json`
- `download-report.json`
- local PNG/MP4/text outputs when available

## Fallback policy

- Text docs may be seeded locally from `tools/jarvis-luma/source/*.txt`.
- Short Final Frame asset IDs are treated as seed IDs, not trusted generation UUIDs.
- If a binary asset cannot be resolved through the documented public APIs, it is marked `manual_source_required`.
- One unresolved asset does not block the rest of the sync.
