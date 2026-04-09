# Component Mapping — Design refs ↔ Shared UI (Fase 1.2)

## 1) Doel

Concreet vastleggen hoe Stitch/design refs worden vertaald naar bestaande shared components, zodat implementatie consistent en zonder design drift gebeurt.

## 2) Mapping

| Design patroon (1.2.1)                       | Design bron                                                                    | Bestaand component                                        | Status           | Waar styling leeft                           |
| -------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- | ---------------- | -------------------------------------------- |
| Screen container + scroll canvas             | `ethos_ivory`, alle schermrefs                                                 | `components/ui/screen-primitives.tsx` → `ScreenContainer` | Bestaand         | `components/ui/**`                           |
| Top header (titel + acties)                  | `vandaag_iconic_refined`, `dagen_personal_archive`, `reflectie_weekly_insight` | `components/layout/screen-header.tsx`                     | Bestaand         | `components/layout/**`                       |
| Header icon actions (menu/back/calendar)     | meerdere refs met icon-knoppen                                                 | (nu verspreid in screens)                                 | Uitbreiden       | nieuw shared component in `components/ui/**` |
| Primary CTA button                           | today/capture refs                                                             | `PrimaryButton` in `screen-primitives`                    | Bestaand         | `components/ui/**`                           |
| Secondary button                             | capture/reflection flows                                                       | `SecondaryButton` in `screen-primitives`                  | Bestaand         | `components/ui/**`                           |
| State feedback blokken (empty/error/loading) | meerdere productflows                                                          | `StateBlock` in `screen-primitives`                       | Bestaand         | `components/ui/**`                           |
| Surface secties/cards                        | today/reflection/day patterns                                                  | `SurfaceSection` in `screen-primitives`                   | Bestaand         | `components/ui/**`                           |
| Editorial quote panel                        | today/day detail                                                               | `components/journal/day-editorial-panel.tsx`              | Bestaand         | `components/journal/**`                      |
| Reflection teaser item                       | today/reflection koppeling                                                     | `components/journal/reflection-teaser-card.tsx`           | Bestaand         | `components/journal/**`                      |
| Archive grouped list                         | days archief                                                                   | `components/journal/archive-grouped-list.tsx`             | Bestaand         | `components/journal/**`                      |
| Surface divider/section separator            | refs met subtiele scheiding                                                    | (nu deels lokaal)                                         | Nieuw toegestaan | `components/ui/**`                           |

## 3) Leidende componenten

Leidend voor UI-opbouw:

- `components/ui/screen-primitives.tsx`
- `components/layout/screen-header.tsx`
- `components/themed-text.tsx`
- `components/themed-view.tsx`
- domeinspecifiek: `components/journal/**` waar patroon al bestaat

## 4) Nieuwe componenten toegestaan in fase 2

Alleen deze toevoegingen zijn toegestaan:

- `components/ui/header-icon-button.tsx`
- `components/ui/surface-divider.tsx`

Doel: lokale duplicatie uit screens halen zonder nieuwe designrichting.

## 5) Niet opnieuw uitvinden

- Geen screen-level herbouw van header/buttons/surfaces als shared variant bestaat.
- Geen duplicatie van tokenwaarden in screens.
- Geen alternatief patroon naast bestaande shared component als uitbreiding volstaat.
