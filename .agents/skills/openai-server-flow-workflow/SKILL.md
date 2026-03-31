---
name: openai-server-flow-workflow
description: Gebruik deze skill alleen voor server-side OpenAI flows in release 1: transcriptie, entry normalization, day composer en period reflection. Niet gebruiken voor client-side OpenAI, realtime voice, vector stores of retrieval-Q&A.
---

# Doel
Bouw simpele, server-side AI-flows voor release 1 zonder architectuur-opblaasrisico.

# Verwachte input
- Gevraagde flow (`transcriptie`, `entry normalization`, `day composer`, `weekreflectie`, `maandreflectie`)
- Gewenste input/output contractdetails of service/handlerlocatie
- Eventuele randvoorwaarden voor logging of promptversies

# Wanneer deze skill gebruiken
Gebruik deze skill als de taak gaat over:
- transcriptieflow
- entry normalization
- day composer
- weekreflectie
- maandreflectie
- input/output contracts voor AI-services
- prompt versioning
- logging van AI-flows

# Wanneer deze skill niet gebruiken
Gebruik deze skill niet voor:
- client-side OpenAI integratie
- realtime voice
- vector store setup
- retrieval-Q&A
- document analysis
- message help
- personality adaptation

# Werkwijze
1. Controleer eerst of de flow binnen release 1 valt.
2. Houd alle OpenAI-aanroepen server-side.
3. Definieer per flow duidelijke input/output types.
4. Start met minimale promptstubs; voeg pas echte productprompts toe als dat expliciet gevraagd is.
5. Laat AI structureren en samenvatten, niet psychologiseren.
6. Voeg logging en promptversievelden toe waar logisch.
7. Houd foutpaden expliciet en eenvoudig.
8. Vermijd generieke agentlagen zolang vaste services volstaan.

# Output
Lever:
- service of handler structuur
- TypeScript contracten
- minimale promptstubs of promptmodules
- korte uitleg van de flow van input naar output
- geen realtime of vector-gerelateerde uitbreiding
