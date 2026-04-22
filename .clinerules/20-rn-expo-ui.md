# 20 — RN/Expo UI guardrails (compact)

Use when tasks touch `app/**`, `components/**`, `theme/**`.

- Keep screens assembly-only; prefer shared primitives before screen-local patterns.
- Use scaffold-first assembly: check `components/ui/screen-scaffolds.tsx` before custom screen structure.
- Apply reuse-first decision order: use existing -> extend existing -> create new shared component only if extension is not clean.
- Follow clean-first + mode-aware UI defaults; avoid visual mass and ad-hoc surfaces.
- Do not redesign or introduce new visual systems without explicit request.
- Keep token usage source-of-truth in `theme/tokens.ts`.

Refs: `AGENTS.md`, `docs/design/mvp-design-spec-1.2.1.md`, `design_refs/1.2.1/ethos_ivory/DESIGN.md`.
