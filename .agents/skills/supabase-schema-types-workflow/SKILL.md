---
name: supabase-schema-types-workflow
description: Gebruik deze skill alleen voor Supabase schemawijzigingen, migrations, types genereren en veilige afstemming tussen database en appcode. Niet gebruiken voor UI-werk of OpenAI promptlogica.
---

# Doel
Voer Supabase-wijzigingen gecontroleerd uit met schema eerst en appcode daarna.

# Verwachte input
- Expliciete schema-opdracht (nieuwe tabel/kolom/migration/policy)
- Betrokken release-1 entiteit(en)
- Verwachte impact op types en appcode

# Wanneer deze skill gebruiken
Gebruik deze skill als de taak gaat over:
- nieuwe tabellen
- kolommen aanpassen
- migrations
- RLS/policies
- database types genereren
- afstemmen van appcode op schemawijzigingen

# Wanneer deze skill niet gebruiken
Gebruik deze skill niet voor:
- schermontwerp
- route-aanpassingen
- OpenAI orchestration
- promptteksten
- client-side featurebouw zonder schema-impact

# Werkwijze
1. Controleer eerst of er expliciet om schemawijziging is gevraagd; anders geen schemawijzigingen uitvoeren.
2. Begrijp welke release-1 entiteiten betrokken zijn.
3. Maak schemawijzigingen expliciet en klein.
4. Werk via migrations, niet via verborgen aannames in frontendcode.
5. Houd release-1 schema beperkt tot wat echt nodig is.
6. Beschrijf welke types opnieuw gegenereerd moeten worden.
7. Controleer of namen logisch en toekomstvast zijn.
8. Voeg geen prematuur complexe tabellen toe voor post-MVP features.

# Output
Lever:
- migrationbestand(en)
- eventuele policy-wijzigingen
- bijgewerkte type-locatie of instructie om types opnieuw te genereren
- korte uitleg welke appcode hierdoor geraakt wordt
