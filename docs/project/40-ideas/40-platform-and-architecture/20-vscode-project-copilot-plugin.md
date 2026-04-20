# VS Code project copilot plugin

## Status

idea

## Type

platform-architecture

## Horizon

next

## Korte samenvatting

Een repo-specifieke VS Code plugin die planning, docs, status en codecontext samenbrengt als bouwassistent.

## Probleem

Informatie over scope, status, planning en code zit nu verspreid; dat kost focus tijdens bouwen.

## Waarom interessant

Sneller van idee naar implementatie, minder context-switching, hogere consistentie met projectguardrails.

## Relatie met huidige docs

- Leunt op `docs/project/**`, `docs/dev/**` en later op nieuwe uploadbundels.

## Mogelijke impact

- docs
- tooling

## Open vragen

- Welke functies moeten lokaal-only blijven?
- Welke functies moeten via API/MCP praten met runtime-context?

## Volgende stap

Scope opdelen in MVP-plugin (read/assist) vs latere automation (write/execute).
