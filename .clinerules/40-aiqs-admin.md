# 40 — AIQS admin guardrails (compact)

Use when tasks touch AI Quality Studio admin flows (`app/settings-ai-quality-studio/**`, related admin services/functions/docs).

- Keep AIQS task-first and contract-first; avoid screen-first or freeform prompt sprawl.
- Keep AIQS admin-only and server-side; do not expose admin controls or model calls to end-user paths.
- Prioritize evidence-first changes (test/compare/evaluation traceability) over cosmetic admin-only polish.
- Do not broaden AIQS into a generic chat/agent feature layer.

Refs: `docs/project/ai-quality-studio.md`, `docs/project/current-status.md`, `AGENTS.md`.