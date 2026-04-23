---
id: task-local-auth-smoke-hardening
title: Lokale auth smoke workflow hardenen (magic-link + Mailpit)
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "Lokale magic-link loginflow reproduceerbaar gemaakt met smoke-user profielen, verify-link extractie, login-proof script en veilige local-only cleanup voor smoke users."
tags: [auth, smoke-test, local, mailpit]
workstream: app
due_date: null
sort_order: 3
---

# Lokale auth smoke workflow hardenen (magic-link + Mailpit)

## Probleem / context

De lokale smoke test flow had wel losse auth/mail checks, maar geen complete, reproduceerbare magic-link loginflow voor UI smoke tests.

## Gewenste uitkomst

Een vaste local-only auth smoke workflow waarmee een agent of developer veilig kan inloggen en daarna end-to-end UI smoke tests kan doen (zoals entry-detail galerijchecks), zonder runtime auth-bypass.

## Waarom nu

- Recente UI smoke checks liepen vast op login/onboarding handwerk.
- Er was behoefte aan een vaste smoke-user strategie (`default`/`clean`/`new`) en lokale cleanup om testvervuiling te beperken.

## In scope

- Magic-link verify-link extractie uit Mailpit.
- Volledige local auth login-proof script.
- Smoke-user profielstrategie (default/clean/new).
- Veilige local-only cleanup voor herkenbare smoke users.
- Compacte workflowdocumentatie onder `docs/dev/`.

## Buiten scope

- Productie/staging Mailtrap automatisering.
- Runtime auth shortcuts of test-backdoors.
- Niet-auth functionele UI-redesigns.

## Concrete checklist

- [x] Shared local auth smoke utils toegevoegd (`scripts/_shared/local-auth-smoke-utils.mjs`).
- [x] Verify-link extractie script toegevoegd (`scripts/get-local-magic-link.mjs`).
- [x] Login-proof script toegevoegd (`scripts/verify-local-auth-login.mjs`).
- [x] Local-only cleanup script toegevoegd (`scripts/cleanup-local-smoke-users.mjs`).
- [x] Bestaande auth-mail verify script uitgebreid met smoke-user profielen.
- [x] npm scripts toegevoegd voor auth smoke tooling.
- [x] Workflowdocumentatie toegevoegd (`docs/dev/local-auth-smoke-workflow.md`).

## Blockers / afhankelijkheden

- Lokale Supabase stack + Mailpit moeten draaien.
- `APP_SUPABASE_SERVICE_ROLE_KEY` vereist voor cleanup script.

## Verify / bewijs

- `npm run typecheck`
- `npm run lint`
- `npm run verify:local-auth-mail`
- `npm run verify:local-auth-login`

## Relevante links

- `scripts/verify-local-auth-mail.sh`
- `scripts/get-local-magic-link.mjs`
- `scripts/verify-local-auth-login.mjs`
- `scripts/cleanup-local-smoke-users.mjs`
- `docs/dev/local-auth-smoke-workflow.md`
