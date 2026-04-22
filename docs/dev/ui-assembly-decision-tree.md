# UI assembly decision tree (scaffold-first)

Doel: elke agent/Cline-run moet UI-wijzigingen eerst langs gedeelde scaffolds en primitives sturen, zodat screen-lokale hardcoding uitzonderlijk wordt.

## Beslisvolgorde (verplicht)

1. **Bestaat er al een scaffold voor dit schermtype?**

- check eerst `components/ui/screen-scaffolds.tsx`
- gebruik de juiste basis: `MainTabScaffold`, `DetailScaffold`, `SettingsScaffold`, `AdminScaffold`, `CaptureScaffold`

2. **Bestaat er al een gedeeld UI-patroon voor dit element?**

- check eerst `components/ui/**`, `components/layout/**`, `components/feedback/**`
- voorbeelden:
  - header lockup/actions: `BrandHeaderLockup`, `HeaderActionGroup`
  - settings navigatierij: `SettingsNavRow`, `SettingsSectionLabel`
  - status-sheet: `AsyncStatusSheet`
  - selectorlijst: `SelectableListModal` + `SelectorModalShell`

3. **Past het met uitbreiding van bestaand component?**

- zo ja: breid bestaand component uit met beperkte, duidelijke props
- zo nee: ga naar stap 4

4. **Nieuw shared component maken**

- alleen als hergebruik aannemelijk is op meerdere schermen
- geen screen-specifieke productlogica in shared primitive
- documenteer kort waarom bestaand component niet passend was

## Uitzonderingsbeleid

Screen-lokale UI is alleen toegestaan als:

- patroon uniek is voor exact één schermflow, en
- uitbreiding van bestaand shared component de API onnodig vervuilt, en
- uitzondering expliciet genoemd wordt in de PR/taaknotitie.

## Uitgefaseerde patronen (niet opnieuw introduceren)

- Nieuwe screen-lokale branded header lockups (`brandPrimary`/`brandSecondary` styles in screen files).
- Nieuwe screen-lokale settings navigatierijen met eigen chevron/icon layout.
- Nieuwe screen-lokale async status sheets voor loading/success/error.
- Nieuwe selector-lijst modals die los van `SelectableListModal`/`SelectorModalShell` worden gebouwd.

## Huidige bewuste uitzonderingen

- Reflections period-selector in `app/(tabs)/reflections.tsx` gebruikt nog een custom selectorflow.
- AIQS assist panel in `app/settings-ai-quality-studio/[taskKey]/draft/[version].tsx` is nog screen-local.

## Snelle index (waar eerst kijken)

1. `components/ui/screen-scaffolds.tsx`
2. `components/ui/screen-primitives.tsx`
3. `components/ui/settings-screen-primitives.tsx`
4. `components/ui/settings-nav-primitives.tsx`
5. `components/feedback/async-status-sheet.tsx`
6. `components/feedback/selectable-list-modal.tsx`
7. `components/feedback/selector-modal-shell.tsx`
8. `components/feedback/destructive-confirm-sheet.tsx`
9. `components/layout/screen-header.tsx`
10. `components/ui/header-icon-button.tsx`

## Verify bij UI-werk

- `npm run lint`
- `npm run typecheck`
- gerichte runtime-check in dark + light mode op betrokken schermen
