# UI modals, sheets en overlays

Doel van deze pagina: één verwijspagina voor alle huidige modal-/sheet-/overlaypatronen in de app.

Deze pagina is een **inventory + afsprakenlaag**:
- wat bestaat er nu
- welk component is leidend
- waar wordt het gebruikt
- welk gedrag/animatiepatroon hoort erbij

## Typen overlays in de app

- **Dialog (centered, fade)**: korte bevestiging of keuze met beperkte tekst.
- **Sheet (bottom)**: bevestiging/acties met nadruk (vaak destructive), van onderen ingestoken.
- **Selector modal**: kiezen uit dag/week/maand-achtige lijsten.
- **Fullscreen overlay**: volledige schermlaag voor menu of editorflow.
- **Route-level modal (Expo Stack)**: navigatiepresentatie met `presentation: "modal"`.

## Shared primitives (leidend)

### `components/ui/modal-backdrop.tsx`
- Type: shared backdrop primitive.
- Rol: scrim + outside-press gedrag voor centered en bottom overlays.
- Layoutopties:
  - `center`
  - `bottom`

### `components/feedback/selector-modal-shell.tsx`
- Type: shared selector shell.
- Rol: gedeelde shell voor selector-modals (day/week/month varianten).
- Huidig gedrag:
  - transparante `Modal`
  - `animationType="fade"`
  - centered card lay-out
  - top header met titel + kruisje

> Let op: wanneer selector UX moet matchen met de reflections slide-up selector, moet deze shell leidend daarop worden geünificeerd.

## Componentenoverzicht

### 1) Dialogs

Geen actieve centered confirm-dialogs voor bevestigingsflows.

### 2) Sheets

#### `components/feedback/destructive-confirm-sheet.tsx`
- Type: shared bottom confirm-sheet (algemeen + destructive variant).
- Animatie: `fade` + bottom layout via backdrop.
- Backdrop: `ModalBackdrop` (`bottom`).
- Gebruik:
  - `app/settings.tsx`
  - `app/settings-export.tsx`
  - `app/settings-import.tsx`
  - `app/entry/[id].tsx`
  - `app/capture/type.tsx`
  - `app/capture/record.tsx`
  - `app/settings-ai-quality-studio/[taskKey]/draft/[version].tsx`

### 3) Selector modals

#### `components/feedback/day-selector-modal.tsx`
- Type: selector modal (dag).
- Base: `SelectorModalShell`.
- Gebruik:
  - `components/feedback/date-range-selector-modal.tsx`

#### `components/feedback/period-selector-modal.tsx`
- Type: selector modal (week/maand generic).
- Base: `SelectorModalShell`.

#### `components/feedback/export-period-selector-modal.tsx`
- Type: selector modal met tabs (dag/week/maand) voor export.
- Base: `SelectorModalShell`.
- Gebruik:
  - `app/settings-export.tsx`

#### Inline selector in `app/(tabs)/reflections.tsx`
- Type: slide-up selector (week/maand) met full-screen modal-opbouw.
- Animatie: `slide`.
- Opmerking: momenteel eigen implementatie, nog niet op dezelfde shared shell als de selector-modals hierboven.

### 4) Fullscreen overlays

#### `components/navigation/fullscreen-menu-overlay.tsx`
- Type: fullscreen navigatie-overlay.
- Animatie: `fade`.
- Gebruik: brede inzet over tabs, day detail en settings/admin schermen.

#### `components/feedback/text-editor-modal.tsx`
- Type: fullscreen editor modal.
- Animatie: `slide`.
- Gebruik:
  - `app/day/[date].tsx`
  - `app/entry/[id].tsx`

#### AIQS assist panel (screen-local)
- Bestand: `app/settings-ai-quality-studio/[taskKey]/draft/[version].tsx`
- Type: screen-local modal panel.
- Animatie: `fade`.

### 5) Route-level modal

#### Expo Stack modal route
- Bestand: `app/_layout.tsx` (`presentation: "modal"`) + `app/modal.tsx`.
- Type: route-presentatie via navigator, niet via losse component-modal.

## Huidige referentie per use-case

- **Alle bevestigingen (ook niet-destructive)** → `ConfirmSheet` uit `components/feedback/destructive-confirm-sheet.tsx`
- **Destructive bevestiging** → `DestructiveConfirmSheet` of `ConfirmSheet` met destructive actie(s)
- **Selectie uit lijst (dag/week/maand)** → `SelectorModalShell` + selector variant
- **Volledig schermmenu** → `FullscreenMenuOverlay`
- **Volledige editorflow** → `TextEditorModal`
- **Navigator-level modal route** → Stack `presentation: "modal"`

## Verplichte confirmatiestandaard (hard rule)

- Gebruik voor nieuwe bevestigingsvragen **altijd** de shared bottom-sheet primitive uit `components/feedback/destructive-confirm-sheet.tsx`.
- Gebruik **geen** centered confirm-dialogs voor bevestigingsflows.
- Voeg geen screen-local confirm-sheet implementaties toe als de shared primitive het use-case kan dekken.
- Als een flow meerdere keuzes heeft (bijv. 3 acties), gebruik `ConfirmSheet` met `actions`.
- Als een flow expliciet destructive is, gebruik destructive toon/icoon via `ConfirmSheet` of `DestructiveConfirmSheet`.

## Open unificatiepunten (bewust zichtbaar)

- Reflections selector (`app/(tabs)/reflections.tsx`) gebruikt een eigen slide-up patroon en is nog niet op dezelfde shared shell als `SelectorModalShell`-familie.
- AIQS draft assist panel is screen-local en geen gedeelde modal primitive.

Deze punten zijn niet per definitie fout, maar staan hier expliciet zodat toekomstige unificatie gericht en bewust kan gebeuren.
