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

#### `components/feedback/confirm-dialog.tsx`
- Type: centered confirm dialog.
- Animatie: `fade`.
- Backdrop: `ModalBackdrop` (`center`).
- Gebruik:
  - `app/entry/[id].tsx`
  - `app/settings-import.tsx`
  - `app/capture/type.tsx`

### 2) Sheets

#### `components/feedback/destructive-confirm-sheet.tsx`
- Type: bottom destructive sheet.
- Animatie: `fade` + bottom layout via backdrop.
- Backdrop: `ModalBackdrop` (`bottom`).
- Gebruik:
  - `app/capture/record.tsx`
  - `app/settings-ai-quality-studio/[taskKey]/draft/[version].tsx`

#### Screen-local sheet in `app/settings.tsx`
- Type: bottom sheet variant (screen-local implementatie).
- Opmerking: overlapt functioneel met destructive sheet patroon, maar is niet volledig gedeeld via de shared component.

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

- **Korte bevestiging** → `ConfirmDialog`
- **Destructive bevestiging** → `DestructiveConfirmSheet`
- **Selectie uit lijst (dag/week/maand)** → `SelectorModalShell` + selector variant
- **Volledig schermmenu** → `FullscreenMenuOverlay`
- **Volledige editorflow** → `TextEditorModal`
- **Navigator-level modal route** → Stack `presentation: "modal"`

## Open unificatiepunten (bewust zichtbaar)

- Reflections selector (`app/(tabs)/reflections.tsx`) gebruikt een eigen slide-up patroon en is nog niet op dezelfde shared shell als `SelectorModalShell`-familie.
- `app/settings.tsx` heeft een screen-local destructive sheet-variant naast de shared destructive sheet.
- AIQS draft assist panel is screen-local en geen gedeelde modal primitive.

Deze punten zijn niet per definitie fout, maar staan hier expliciet zodat toekomstige unificatie gericht en bewust kan gebeuren.
