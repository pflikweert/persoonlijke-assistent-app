# 30 — Supabase Functions guardrails (compact)

Use when tasks touch `supabase/functions/**`.

- Keep secrets server-side; never move `OPENAI_API_KEY` or internal tokens to client code.
- For Deno local imports: use explicit `.ts` extensions and place `// @ts-ignore` directly above each import line.
- Keep changes scoped to the touched function and shared modules; avoid broad refactors.
- After function edits, report that `npm run supabase:functions:restart` is required locally.

Refs: `AGENTS.md`, `docs/dev/cline-workflow.md`, `supabase/README.md`.