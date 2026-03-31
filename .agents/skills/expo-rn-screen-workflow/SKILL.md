---
name: expo-rn-screen-workflow
description: Gebruik deze skill alleen voor het bouwen of aanpassen van Expo/React Native schermen, routes, layoutstructuur en rustige UI voor release 1. Niet gebruiken voor backendlogica, Supabase schema's, OpenAI orchestration of post-MVP features.
---

# Doel
Bouw of wijzig schermen op een rustige, functionele en release-1-consistente manier.

# Verwachte input
- Doelscherm(en) of route(s)
- Gewenste UI-aanpassing en primaire gebruikersactie
- Scopegrenzen (wat bewust niet aangepast moet worden)

# Wanneer deze skill gebruiken
Gebruik deze skill als de taak gaat over:
- nieuwe schermen in Expo / React Native
- routing of navigatiestructuur
- schermlayout
- componentstructuur voor UI
- eenvoudige state voor scherminteractie
- visuele vereenvoudiging van bestaande schermen

# Wanneer deze skill niet gebruiken
Gebruik deze skill niet voor:
- database schema's
- Supabase migrations
- OpenAI promptflows
- server-side orchestration
- vector search
- realtime voice
- document imports
- message help of andere post-MVP flows

# Werkwijze
1. Lees eerst de bestaande schermstructuur en route-opzet.
2. Controleer of de gevraagde wijziging binnen release 1 valt.
3. Houd schermen rustig, klein en duidelijk.
4. Gebruik bestaande design- en componentpatronen als die er al zijn.
5. Voeg alleen componenten toe die direct nodig zijn voor het scherm.
6. Vermijd design-overkill, animatieruis en generieke dashboarddrukte.
7. Zorg dat primaire actie visueel duidelijk is.
8. Houd copy eenvoudig en menselijk.

# Output
Lever:
- schermbestand(en)
- eventuele kleine ondersteunende componenten
- korte toelichting welke route/schermen zijn aangepast
- geen backend- of productscope-uitbreidingen
