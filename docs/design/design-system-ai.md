# Design System AI — NativeWind Hardening Rules (Fase 1.2)

## 1) Doel en status

- Doel: bindende implementatieregels voor UI-styling tijdens NativeWind-invoering zonder redesign.
- Status: canoniek voor AI-uitvoering binnen fase 1.2 hardening.
- Scope: RN/Expo app UI-laag, geen productverbreding.

## 2) Design authority volgorde

1. `docs/design/mvp-design-spec-1.2.1.md`
2. `design_refs/1.2.1/ethos_ivory/DESIGN.md`
3. `design_refs/1.2.1/*/code.html` en `design_refs/1.2.1/*/screen.png`
4. Bestaande projectdocs (`docs/project/*`) voor scope/faseguardrails

Bij conflict: hogere bron wint. Geen herbeslissing zonder expliciete opdracht.

## 3) Single source of truth voor tokens

- `theme/tokens.ts` is enige tokenbron voor kleur, spacing, radius, typography, motion en sizing.
- `constants/theme.ts` is afgeleide runtime mapping.
- Tailwind/NativeWind config is afgeleid en nooit leidend.

## 4) Component-first regel

- Visuele patronen leven primair in `components/ui/**` en `components/layout/**`.
- Screens gebruiken shared components en varianten; screens definiëren geen nieuwe visuele patronen.

## 5) Screen assembly-only regel

- `app/**` schermen assembleren data + volgorde + interactie.
- Screens mogen geen nieuwe style-architectuur introduceren.

## 6) Background ownership regel

- Achtergronden/surfaces worden centraal beheerd in shared layout/primitives.
- Geen nieuwe hardcoded backgrounds in screens.

## 7) Surface hierarchy regel

- Gebruik vaste hiërarchie: `background` → `surfaceLow` → `surface` → `surfaceHigh`.
- Surface-keuzes gebeuren in shared components, niet per screen ad hoc.

## 8) Typografie-regel

- Typografierollen zijn centraal (`ThemedText` + token roles).
- Geen nieuwe typografie-definities per screen, tenzij expliciet in shared variant.

## 9) Spacing-regel

- Spacing is token-first (`theme/tokens.ts`).
- Geen losse magic numbers voor structurele spacing in screens.

## 10) NativeWind-regel

- NativeWind is implementatielaag, geen redesign-tool.
- Utility-chaos in screens is verboden.
- Variants horen in shared components, niet in losse screen utility-strings.

## 11) Wanneer styling wel/niet in screens mag

Wel toegestaan in screens:

- Kleine layout-assembly aanpassingen voor volgorde/alignment binnen bestaande patronen.
- Tijdelijke feature-specifieke spacing alleen als nog geen shared variant bestaat.

Niet toegestaan in screens:

- Nieuwe kleur-, surface-, button-, typografie- of interactiepatronen.
- Nieuwe grote `StyleSheet.create` blokken voor generieke UI-patronen.
- Hardcoded visuele waarden waar tokens of shared variants bestaan.

## 12) Don’ts

- Geen redesign zonder expliciete opdracht.
- Geen nieuwe designrichting naast 1.2.1 authority.
- Geen parallel token-systeem naast `theme/tokens.ts`.
- Geen migratie-big-bang over meerdere complexe schermen tegelijk.

## 13) Verify-checklist voor UI-taken

- [ ] Is design authority 1.2.1 expliciet geraadpleegd?
- [ ] Is `theme/tokens.ts` als enige tokenbron gebruikt?
- [ ] Is styling in shared components geplaatst i.p.v. screens?
- [ ] Zijn schermen assembly-only gebleven?
- [ ] Zijn geen hardcoded backgrounds/kleuren toegevoegd in screens?
- [ ] Is er geen redesign of scopeverbreding geïntroduceerd?
