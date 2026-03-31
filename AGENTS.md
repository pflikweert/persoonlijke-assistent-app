# AGENTS.md

## Projectdoel

Deze app is een persoonlijke contextmachine voor één gebruiker.
Release 1 focust op snel vastleggen, automatisch structureren en periodiek reflecteren.
De app is nadrukkelijk geen brede AI-levenscoach.

## Release 1 scope

Bouw alleen aan deze kern:

- stemnotitie vastleggen
- tekstnotitie vastleggen
- audio transcriptie
- entry normalization
- day journal opbouw per kalenderdag
- weekreflectie
- maandreflectie
- eenvoudige overzichten van dagen en reflecties

## Buiten scope voor release 1

Niet bouwen tenzij expliciet gevraagd:

- vector search
- document uploads
- message help
- contactprofielen
- vrije archief-Q&A
- realtime voice
- WhatsApp-imports
- agenda, taken, reminders
- complexe agentarchitectuur

## Technische stack

- Expo
- React Native
- TypeScript
- Supabase
- server-side OpenAI
- npm als package manager

## Werkafspraken

- Geef eerst een kort plan voordat je code wijzigt.
- Kies altijd de kleinste werkende wijziging.
- Voeg geen nieuwe dependencies of infra toe zonder duidelijke noodzaak.
- Neem geen nieuwe productbeslissingen buiten de vastgestelde MVP-scope.
- Houd architectuur simpel en uitlegbaar.
- Gebruik bestaande patronen in de repo voordat je nieuwe patronen introduceert.

## Skill-selectie

- Gebruik `expo-rn-screen-workflow` voor schermen, routes en UI-structuur.
- Gebruik `openai-server-flow-workflow` voor server-side OpenAI flows binnen release 1.
- Gebruik `supabase-schema-types-workflow` alleen bij expliciete schema/migration-opdrachten.

## Conflictregel

- Bij conflict tussen skill-instructies en projectregels geldt `AGENTS.md` als hoogste bron.

## Data- en securityregels

- OPENAI_API_KEY blijft altijd server-side.
- Commit nooit secrets, tokens of lokale env-bestanden.
- Houd ruwe brondata en AI-bewerkte output gescheiden.
- Bouw geen client-side OpenAI-aanroepen met geheime sleutels.

## Kwaliteitschecks

Voer na relevante wijzigingen uit:

- `npm run lint`
- `npm run typecheck`

Als scripts nog ontbreken, voeg ze alleen toe als onderdeel van repo hygiene.
Bij structurele wijzigingen moeten relevante docs worden bijgewerkt.

## Definition of done

Een taak is pas klaar als:

- de wijziging binnen release-1 scope valt
- de code logisch en klein gehouden is
- lint/typecheck niet verslechteren
- relevante documentatie is bijgewerkt
- geen secrets of onnodige infra zijn toegevoegd
