# AGENTS.md

## Canonieke projectbron
Gebruik projectdocs als enige bron voor scope en beslissingen:
- `docs/project/master-project.md`
- `docs/project/product-visie-mvp.md`

## Werkwijze
- Herbeslis geen bestaande keuzes uit de projectdocs.
- Geen feature creep buiten de vastgelegde scope.
- Werk cheap-first: kleinste werkende wijziging eerst.
- Houd taken klein en scherp afgebakend.
- Gebruik bestaande patronen in de repo vóór nieuwe patronen.

## Codex-regels
- Gebruik minimale context per prompt.
- Herhaal geen projectcontext uit docs.
- Werk met 1 taak per prompt.
- Gebruik plan mode alleen bij bugs, multi-file wijzigingen of migraties.

## Kosten- en inputregels
- Gebruik het lichtste model dat de taak aankan.
- Herhaal geen projectcontext uit docs.
- Werk met minimale input: doel + scope + files.

## Security
- `OPENAI_API_KEY` blijft altijd server-side.
- Commit nooit secrets, tokens of lokale env-bestanden.
- Bouw geen client-side OpenAI-calls met geheime sleutels.

## Kwaliteit
Voer na relevante wijzigingen uit:
- `npm run lint`
- `npm run typecheck`
