# 10 — Docs guardrails (compact)

Use when tasks touch `docs/**`.

- Keep hierarchy explicit:
  - `docs/project/**` = canonical product truth
  - `docs/dev/**` = operational workflow
  - `docs/upload/**` = generated upload artifacts
- Never treat `docs/upload/**` as a canonical source.
- Prefer short references to canonical docs over copied policy blocks.
- If canonical docs change: run `npm run docs:bundle` and `npm run docs:bundle:verify`.

Refs: `docs/project/README.md`, `AGENTS.md`, `docs/dev/cline-workflow.md`.