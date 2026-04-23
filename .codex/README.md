# Repo-local Codex MCP setup

Deze repo gebruikt een lokale Codex-config in `.codex/config.toml`.

## Vaste MCP servers

- `context7`
- `playwright`
- `stitch`
- `supabase_local`
- `supabase_remote_ro`

## Veiligheidsdefaults

- Standaard is `supabase_local` actief.
- `supabase_remote_ro` staat standaard uit en gebruikt altijd `read_only=true`.
- Secrets staan niet in de repo; gebruik lokale env-vars.

## Benodigde lokale env-vars (voorbeeld)

- `STITCH_API_KEY` (voor stitch)
- `SUPABASE_PROJECT_REF` (optioneel voor remote-ro switch)

## Switchen zonder handmatig TOML-editen

Local activeren:

```bash
node scripts/codex-mcp-target.mjs local
```

Remote/prod read-only activeren:

```bash
node scripts/codex-mcp-target.mjs remote-ro --project-ref <jouw_project_ref>
```

Of via env var:

```bash
SUPABASE_PROJECT_REF=<jouw_project_ref> node scripts/codex-mcp-target.mjs remote-ro
```
