# Admin/founder meeting capture

## Status

promoted-to-epic

## Type

product

## Horizon

now

## Korte samenvatting

Een aparte admin/founder lane voor lange overlegopnames, buiten de bestaande dagboekcapture. De eerste versie is audio-safe: opnemen, lokaal veiligstellen, uploaden, terugvinden, afspelen en downloaden. Transcriptie, speakerlabels en inzichten volgen pas daarna.

## Probleem

Lange founder/admin gesprekken passen niet goed in de huidige dagboekflow. Ze hebben een ander gebruikspatroon: langere duur, hogere kans op browser- of netwerkonderbreking, ander privacygevoel en een archiefbehoefte die los staat van dagelijkse momenten.

Als we dit in de bestaande captureflow proppen, maken we de dagboekervaring zwaarder en vergroten we het risico dat audio-opslag, transcriptie en samenvatting elkaar blokkeren.

## Waarom interessant

- Founder/admin gesprekken zijn rijk aan besluiten, open vragen, actiepunten en productrichting.
- Audioverlies is hier duurder dan bij korte dagboekinput, dus local-first recovery is v1-waardig.
- De flow is een goede praktijktest voor de nieuwe Budio Workspace hierarchy-laag.

## Scopegrens

- Wel: admin-only web recording, lokale failsafe, private upload, overzicht, detail, playback en download.
- Wel later: upload/import van bestaand audiobestand naar hetzelfde archief.
- Niet in v1: transcript-first, live assistant, meeting bot, calendar-integratie, team sharing of publieke Pro UI.
- Niet doen: bestaande dagboekcapture functioneel aanpassen.

## Productrichting

De UI blijft sober en Budio-eigen. Hergebruik bestaande capture-, moment-, dag-, selectie-, header- en footerpatronen. Copy blijft kort:

- `Gespreksopname`
- `Start opname`
- `Audio wordt veilig opgeslagen`
- `Transcript mislukt. De audio is bewaard.`

## Privacy en consent

De flow moet expliciet tonen dat het om een gespreksopname gaat en dat de gebruiker verantwoordelijk is voor toestemming. Audio-opslag is de succesdefinitie van v1; transcriptie en inzichten zijn aanvullende verwerking en mogen audio nooit blokkeren.

## Relatie met huidige docs

- Epic: `docs/project/24-epics/admin-founder-meeting-capture.md`
- Tasklaag: `docs/project/25-tasks/open/admin-founder-meeting-capture-*.md`
- Researchbronnen: `/Users/pieterflikweert/Downloads/Meeting Capture 1.md` en `/Users/pieterflikweert/Downloads/Meeting Capture 2.md`

## Volgende stap

Maak de epic + taskbundel aan en gebruik die als eerste echte test van `Epic -> Task -> Subtask/dependency` in de Budio Workspace plugin.
