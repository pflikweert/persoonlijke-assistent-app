# AGENTS.md

## Canonieke projectbron
Gebruik projectdocs als enige bron voor scope en beslissingen:
- `docs/project/master-project.md`
- `docs/project/product-visie-mvp.md`

## Canonieke designbronnen (MVP 1.2.1)
- `docs/project/MVP_Design_Spec_App_Fase_1_2_1.md` is leidend voor MVP-designbeslissingen.
- `design_refs/1.2.1/ethos_ivory/DESIGN.md` is leidend voor foundations.
- `design_refs/1.2.1/*/code.html` en `design_refs/1.2.1/*/screen.png` zijn leidend per scherm.
- `docs/project/Persoonlijke_Assistent_App_Fase_1_3_MVP_Design_Beschrijving.md` is verouderd en niet leidend.

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
