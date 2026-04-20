# VS Code plugin met Budio runtime bridge (MCP + API)

## Status

idea

## Type

platform-architecture

## Horizon

next

## Korte samenvatting

Ontwerp een bridge waarbij de VS Code plugin repo-context combineert met runtime-context uit Budio via MCP (tool/resources) en API (persistente state).

## Probleem

Losse lokale context is onvoldoende voor structurele samenwerking op ideeën, planning en flowstatus.

## Waarom interessant

Beter samenwerken tussen bouwen in code en denken/plannen in Budio-runtime zonder alles in één kanaal te duwen.

## Relatie met huidige docs

- Sluit aan op planning/ideas operating system.
- Raakt AIQS-governance en latere flow-modularisatie.

## Mogelijke impact

- tooling
- services
- aiqs
- docs

## Open vragen

- Welke data gaat via MCP resources en welke via API endpoints?
- Welke auth/safety grenzen gelden tussen lokale dev en productiecontext?

## Volgende stap

Contractmatrix opstellen: use case -> MCP tool/resource -> API route -> permissies.
