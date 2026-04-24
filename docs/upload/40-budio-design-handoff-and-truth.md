# DO NOT EDIT - GENERATED FILE

# Budio Design Handoff and Truth

Build Timestamp (UTC): 2026-04-24T18:42:06.530Z
Source Commit: c32c098

Doel: primaire domeinbundle voor design handoff en design truth.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Domein
- Design handoff / design truth.

## UI System and Design Truth
# DO NOT EDIT - GENERATED FILE

# Budio UI System and Design Truth

Build Timestamp (UTC): 2026-04-24T18:42:06.530Z
Source Commit: c32c098

Doel: primaire UI/designbundle met designregels, tokens en implementatieguardrails.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Token Snapshot
- Light core surfaces: background #FAF9F4, surfaceLow #F4F3F0, surface #EFEEEB, surfaceLowest #FFFFFF, surfaceHigh #E9E8E5.
- Dark core surfaces: background #171714, surface #201F1C, surfaceLow #2B2925, surfaceLowest #34322D, surfaceHigh #262521.
- Primary / CTA gradient: light #F0C115 -> #E6B800; dark #F3C53A -> #D7A91B.
- Tab bar background tokens: light #FAF9F6EE; dark #171714EE.
- Destructive soft colors: light #F6E8E5 / #C62929 / #ECC1BF; dark #4B2D2B / #FFB4AB / #7E5A56.
- Key spacing: page 24, content 32, section 32, cluster 12, inline 8.
- Key type roles: screenTitle 34/40, weight 700; sectionTitle 20/26, weight 600; body 16/27, weight 400; bodySecondary 15/24, weight 400; meta 11/16, weight 600; ctaLabel 16/20, weight 700.

## MVP Design Spec (excerpt)
# MVP Design Spec v1.2.1 — Capture First

## Version

v1.2.1 — Based on validated Stitch design direction  
Status: FINAL for implementation

---

## Core Principle

This product is **capture-first**.

Not:

- a dashboard
- a coach
- a chat interface

But:

- a fast, calm, personal thinking tool

---

## 1. Today Screen

### Goal

Immediate clarity + start action

### Rules

- 1 primary CTA: “Nieuwe entry”
- CTA dominates visual hierarchy (≈70%)
- No second CTA
- No dashboard stacking

### Structure

- minimal top bar
- hero + CTA
- small status line
- short recent list
- compact reflection preview
- bottom nav

---

## 2. Capture (Core System)

### Model

Single screen, 3 states:

1. Idle
2. Voice
3. Typing

---

## 2.1 Idle

User understands immediately:

- tap mic → record
- tap screen → type

Elements:

- large mic button (primary)
- guidance: “Spreek of begin met typen”
- visible writing canvas

---

## 2.2 Voice State

Required:

- active waveform
- primary action: “Klaar / Stop”
- secondary: “Annuleer”
- clear recording feedback

Not included:

- pause
- live transcript
- editing tools

---

## 2.3 Typing State

Required:

- large text area
- keyboard visible
- primary action: “Klaar / Opslaan”
- secondary: “Annuleer”
- mic still visible (secondary)

Not allowed:

- toolbars
- formatting
- multiple actions

---

## 3. Post Entry Screen

### Goal

Completion + satisfaction

### Structure

- “Vandaag” + date
- narrative text (clean)
- small reflection
- “Bewerken” (small)
- optional delete (hidden)

### Rules

- no input field
- no edit mode by default
- subtle reveal / completion feeling

---

## 4. Days Overview

### Goal

Retention

### Structure

- list (not cards)
- grouped by month
- date + 1 line summary

### Rules

- no analytics
- no widgets
- no heavy UI

---

## 5. Reflection Screen

### Goal

Insight, not analytics

### Structure

- title + period
- short summary
- narrative reflection
- 2–3 subtle highlights

### Not allowed

- graphs
- percentages
- dashboards

### Backend TODO

Reflection generation handled outside MVP design phase.

---

## 6. Design Rules

### Primary Action

- one per screen/state

### Cards

- not default pattern

### Whitespace

- functional, not decorative

### Capture clarity

- affordances must be obvious

---

## 7. Visual System

### Colors

- warm neutral base
- gold for primary action only

### Typography

- readable
- calm
- no UI-heavy labels
- keep the existing sans base: `Inter` on web, system sans on native
- hero-first screens may use a stronger editorial display title inside that same sans family
- body/meta hierarchy should come from calmer line-height, tracking and spacing, not from extra surface mass
- do not imitate Spotify branding, licensed fonts or brand-specific type behavior

### Icons

- minimal
- mic icon large in capture

---

## 8. Motion

Allowed:

- state transitions
- subtle feedback
- completion feeling

Not allowed:

- flashy animations
- Interactieve elementen (zoals buttons en inputs) mogen nooit meebewegen met decoratieve motion

---

## 9. Scope (MVP)

### Included

- Today
- Capture (all states)
- Post-entry
- Days list
- Reflection UI shell

### Excluded

- AI chat
- analytics
- advanced editing
- multi-mode capture
- backend intelligence (beyond placeholder)

---

## 10. Implementation Guardrails

### Clean-first

- Default UI is clean-first.
- Use spacing, hierarchy, typography and tonal contrast before extra containers.
- Section labels sit on the page ba

[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]

## Ethos Foundation (excerpt)
# Budio Vandaag — Design System Handoff (MVP)

## 1. Purpose

This document is a standalone design-system handoff for Budio Vandaag.

It exists to keep Stitch output consistent without relying on hidden context.

Use this document as explicit design truth for screen generation, refinement, and brand alignment.

---

## 2. Product Position

Budio Vandaag is a capture-first journaling product.

It is:

- a fast, calm personal thinking tool

- focused on capturing today

- designed for quiet continuity and readable reflection

It is not:

- a dashboard

- a coach

- a chat interface

- an AI-branded product

- an analytics product

Core rule:

the product must help the user start quickly, not admire the interface.

---

## 3. Brand Rules

Parent brand:

- Budio

Product brand:

- Budio Vandaag

In-app shorthand:

- Vandaag

Rules:

- use **Budio Vandaag** for explicit product branding

- use **Vandaag** only as an in-app shorthand or screen context

- do not invent alternative product names

- do not introduce sub-brands

- do not use “Quiet Curator” as a visible brand or system name

- do not invent a new logo or symbol unless explicitly requested

Brand feeling:

- calm

- warm

- editorial

- premium but simple

- understated, never loud

---

## 4. Today Screen Hierarchy

Today is an entry point, not a reading-first screen and not a dashboard.

Rules:

- one dominant primary CTA per screen or state

- primary CTA gets most of the visual attention

- no competing primary action

- reflection is always secondary on Today

- recent context stays lightweight and scannable

Priority model:

1. hero + primary action

2. recent context

3. reflection preview

User feeling:

“I can start immediately.”

---

## 5. Capture Rules

Capture is a core system, not a decorative surface.

Capture must feel:

- obvious

- fast

- calm

- low-friction

### Idle state

- mic is the primary action

- typing is clearly available

- the user understands immediately what to do

### Voice state

- clear recording feedback

- primary action: stop / klaar

- secondary action: annuleer

- no pause

- no live transcript

- no editing tools

### Typing state

- large text area

- keyboard-first

- clear save or complete action

- no formatting toolbar

- no visual noise

- no multiple competing actions

---

## 6. Navigation and Shell Rules

Top navigation is navigation-only.

Rules:

- page titles do not dominate the top bar

- supporting copy belongs below the top navigation

- title and supporting copy usually live in a hero below the nav

- use two header modes:

- main screen h

[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]

## Compact Design Context
# DO NOT EDIT - GENERATED FILE

# Stitch Design Context

Build Timestamp (UTC): 2026-04-24T18:42:06.530Z
Source Commit: c32c098

Doel: compacte Stitch/implementation handoff om design drift te beperken zonder alle projectdocs te dupliceren.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Bronbestanden (vaste volgorde)
- docs/design/mvp-design-spec-1.2.1.md
- design_refs/1.2.1/ethos_ivory/DESIGN.md
- theme/tokens.ts
- AGENTS.md
- .agents/skills/ui-implementation-guardrails/SKILL.md
- .agents/skills/stitch-redesign-execution/SKILL.md
- design_refs/1.2.1/auth_branded/DESIGN.md
- design_refs/1.2.1/entry_voltooid/DESIGN.md
- design_refs/1.2.1/fullscreen_menu overlay/DESIGN.md
- design_refs/1.2.1/fullscreen_menu_branded/DESIGN.md
- design_refs/1.2.1/journal_entry_iconic_result/DESIGN2.md
- design_refs/1.2.1/README.md
- design_refs/1.2.1/today_branded_header/DESIGN.md

## Handoff Samenvatting
- Capture-first blijft leidend: de app is een snelle, rustige persoonlijke thinking tool, geen dashboard of chatinterface.
- Today is een entry point: de primaire CTA krijgt de meeste visuele aandacht; reflectie en recente context blijven secundair.
- Clean-first UI: spacing, typografie, hiërarchie en tonal contrast gaan vóór extra containers.
- Borders, fills, nested surfaces en text-wrapper fills zijn opt-in en alleen functioneel of design-ref-gedekt.
- Topnav is navigation-only; paginatitel en supporting copy staan standaard in een hero onder de nav.
- Dark en light mode delen dezelfde compositie; dark mode is niet de impliciete visuele waarheid.
- Background modes zijn mode-aware: ambient, subtle en flat worden selectief ingezet per schermtype.
- Auth sfeer komt uit page-level background + spacing; vermijd zware enclosing auth cards.
- Header, page en footer vormen per mode één coherent geheel; header/footer blijven rustiger dan de page.

## Current Token Snapshot
Afgeleid uit `theme/tokens.ts`; die file blijft de enige tokenbron.

- Light core surfaces: background #FAF9F4, surfaceLow #F4F3F0, surface #EFEEEB, surfaceLowest #FFFFFF, surfaceHigh #E9E8E5.
- Dark core surfaces: background #171714, surface #201F1C, surfaceLow #2B2925, surfaceLowest #34322D, surfaceHigh #262521.
- Primary / CTA gradient: light #F0C115 -> #E6B800; dark #F3C53A -> #D7A91B.
- Tab bar background tokens: light #FAF9F6EE; dark #171714EE.
- Destructive soft colors: light #F6E8E5 / #C62929 / #ECC1BF; dark #4B2D2B / #FFB4AB / #7E5A56.
- Key spacing: page 24, content 32, section 32, cluster 12, inline 8.
- Key type roles: screenTitle 34/40, weight 700; sectionTitle 20/26, weight 600; body 16/27, weight 400; bodySecondary 15/24, weight 400; meta 11/16, weight 600; ctaLabel 16/20, weight 700.

## Per-page Markdown Refs
Deze markdown refs onder `design_refs/1.2.1/**` zijn meegenomen als aanvullende design input wanneer aanwezig.

- design_refs/1.2.1/auth_branded/DESIGN.md
- design_refs/1.2.1/entry_voltooid/DESIGN.md
- design_refs/1.2.1/fullscreen_menu overlay/DESIGN.md
- design_refs/1.2.1/fullscreen_menu_branded/DESIGN.md
- design_refs/1.2.1/journal_entry_iconic_result/DESIGN2.md
- design_refs/1.2.1/README.md
- design_refs/1.2.1/today_branded_header/DESIGN.md

Gebruik de bronbestanden zelf voor volledige screen-specifieke details; deze generated handoff houdt alleen de verwijzingen compact bij.

## Design Guardrails
### Clean-first

- Default UI is clean-first.
- Use spacing, hierarchy, typography and tonal contrast before extra containers.
- Section labels sit on the page background unless a design ref explicitly shows a surface.
- Rows and cards stay light; avoid excessive height, padding and visual mass.
- Decorative borders, extra inner fills and nested surfaces are opt-in, not default.

### Dark Mode

- Dark mode preserves the structure and calm of the light design ref.
- Do not solve dark mode by adding extra mass, extra panels or heavier containers.
- Shift tone and contrast; keep composition lightweight.

### Background Modes

- Page atmosphere is selective, not global.
- Background modes are mode-aware; never apply a dark ambient treatment unchanged in light mode.
- Use three background modes:
  - `ambient`: auth, splash/l

[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]

## Stitch Design Context
# DO NOT EDIT - GENERATED FILE

# Stitch Design Context

Build Timestamp (UTC): 2026-04-24T18:42:06.530Z
Source Commit: c32c098

Doel: compacte Stitch/implementation handoff om design drift te beperken zonder alle projectdocs te dupliceren.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Bronbestanden (vaste volgorde)
- docs/design/mvp-design-spec-1.2.1.md
- design_refs/1.2.1/ethos_ivory/DESIGN.md
- theme/tokens.ts
- AGENTS.md
- .agents/skills/ui-implementation-guardrails/SKILL.md
- .agents/skills/stitch-redesign-execution/SKILL.md
- design_refs/1.2.1/auth_branded/DESIGN.md
- design_refs/1.2.1/entry_voltooid/DESIGN.md
- design_refs/1.2.1/fullscreen_menu overlay/DESIGN.md
- design_refs/1.2.1/fullscreen_menu_branded/DESIGN.md
- design_refs/1.2.1/journal_entry_iconic_result/DESIGN2.md
- design_refs/1.2.1/README.md
- design_refs/1.2.1/today_branded_header/DESIGN.md

## Handoff Samenvatting
- Capture-first blijft leidend: de app is een snelle, rustige persoonlijke thinking tool, geen dashboard of chatinterface.
- Today is een entry point: de primaire CTA krijgt de meeste visuele aandacht; reflectie en recente context blijven secundair.
- Clean-first UI: spacing, typografie, hiërarchie en tonal contrast gaan vóór extra containers.
- Borders, fills, nested surfaces en text-wrapper fills zijn opt-in en alleen functioneel of design-ref-gedekt.
- Topnav is navigation-only; paginatitel en supporting copy staan standaard in een hero onder de nav.
- Dark en light mode delen dezelfde compositie; dark mode is niet de impliciete visuele waarheid.
- Background modes zijn mode-aware: ambient, subtle en flat worden selectief ingezet per schermtype.
- Auth sfeer komt uit page-level background + spacing; vermijd zware enclosing auth cards.
- Header, page en footer vormen per mode één coherent geheel; header/footer blijven rustiger dan de page.

## Current Token Snapshot
Afgeleid uit `theme/tokens.ts`; die file blijft de enige tokenbron.

- Light core surfaces: background #FAF9F4, surfaceLow #F4F3F0, surface #EFEEEB, surfaceLowest #FFFFFF, surfaceHigh #E9E8E5.
- Dark core surfaces: background #171714, surface #201F1C, surfaceLow #2B2925, surfaceLowest #34322D, surfaceHigh #262521.
- Primary / CTA gradient: light #F0C115 -> #E6B800; dark #F3C53A -> #D7A91B.
- Tab bar background tokens: light #FAF9F6EE; dark #171714EE.
- Destructive soft colors: light #F6E8E5 / #C62929 / #ECC1BF; dark #4B2D2B / #FFB4AB / #7E5A56.
- Key spacing: page 24, content 32, section 32, cluster 12, inline 8.
- Key type roles: screenTitle 34/40, weight 700; sectionTitle 20/26, weight 600; body 16/27, weight 400; bodySecondary 15/24, weight 400; meta 11/16, weight 600; ctaLabel 16/20, weight 700.

## Per-page Markdown Refs
Deze markdown refs onder `design_refs/1.2.1/**` zijn meegenomen als aanvullende design input wanneer aanwezig.

- design_refs/1.2.1/auth_branded/DESIGN.md
- design_refs/1.2.1/entry_voltooid/DESIGN.md
- design_refs/1.2.1/fullscreen_menu overlay/DESIGN.md
- design_refs/1.2.1/fullscreen_menu_branded/DESIGN.md
- design_refs/1.2.1/journal_entry_iconic_result/DESIGN2.md
- design_refs/1.2.1/README.md
- design_refs/1.2.1/today_branded_header/DESIGN.md

Gebruik de bronbestanden zelf voor volledige screen-specifieke details; deze generated handoff houdt alleen de verwijzingen compact bij.

## Design Guardrails
### Clean-first

- Default UI is clean-first.
- Use spacing, hierarchy, typography and tonal contrast before extra containers.
- Section labels sit on the page background unless a design ref explicitly shows a surface.
- Rows and cards stay light; avoid excessive height, padding and visual mass.
- Decorative borders, extra inner fills and nested surfaces are opt-in, not default.

### Dark Mode

- Dark mode preserves the structure and calm of the light design ref.
- Do not solve dark mode by adding extra mass, extra panels or heavier containers.
- Shift tone and contrast; keep composition lightweight.

### Background Modes

- Page atmosphere is selective, not global.
- Background modes are mode-aware; never apply a dark ambient treatment unchanged in light mode.
- Use three background modes:
  - `ambient`: auth, splash/loaders, processing states, Today, hero-first and empty states.
  - `subtle`: supporting overlays and screens that need light warmth without visible atmosphere.
  - `flat`: capture screens and content-heavy/utility/detail screens.
- Ambient uses a warm base, a soft upper light pool and a restrained vertical veil.
- Ambient should feel calm and premium, not decorative or brand-loud.
- Today is ambient by default because it is a hero-first entry screen.
- Auth may share the same ambient recipe; utility/detail/settings-like screens stay flatter.
- `subtle` is a warm support layer, not a weaker ambient spotlight.
- `subtle` may use a restrained tonal blend and faint top warmth, but should avoid visible radial atmosphere.
- `flat` may use paper-soft tonal blending, but must still read as visually the quietest mode.
- `flat` must never feel decorative, atmospheric or visibly gradient-first.
- Capture screens (`idle`, `voice`, `typing`) prioritize clarity; avoid visible ambient gradients.
- Content-heavy screens (day detail, week/month detail, settings-like utility flows) stay flatter.
- Header and footer remain calmer than page content and never carry decorative ambient gradients.
- Header, page and footer must form one coherent theme hierarchy in both light and dark mode.
- Full-page routes should use the shared background-mode foundation consistently unless they are a special modal, overlay or shell wrapper.

### Header + Hero

- Top navigation is navigation only.
- Page titles and supporting copy belong in a hero below the topnav by default.
- Use two header modes: main-screen header and detail-screen header.
- Do not press titles next to back buttons unless a design ref explicitly shows it.

### Surfaces + Auth

- Destructive treatments may use accent, but stay calm and no heavier than needed.
- Destructieve bevestigingen gebruiken altijd dezelfde modal/sheet component
- Shared primitives must not introduce default borders, fills or heavy surfaces.
- Auth atmosphere may come from background layering and spacing.
- Avoid heavy enclosing auth cards unless a design ref explicitly requires them.
- Prefer code-based gradients over image backgrounds when they are calmer and more consistent.

### Proof-first

- A design implementation is not “done” on code shape alone.
- Verify against relevant `design_refs/1.2.1/**` plus light and dark runtime behavior before calling it finished.
- If a `design_refs/1.2.1/**` screen folder contains a `.md` note, treat it as additional screen-level design input next to `code.html` and `screen.png`.

---

## Foundation Guardrails
- Zie `design_refs/1.2.1/ethos_ivory/DESIGN.md` voor foundation guardrails.

## Agent Workflow Notes
- `AGENTS.md` blijft de always-on workflowbron voor agents.
- Gebruik `docs/project/README.md` als docs-ingang voordat je generated output leest.
- Gebruik `docs/upload/**` alleen als uploadartefact, niet als canonieke bron.
- Check stylingwerk tegen `design_refs/1.2.1/**`, inclusief `.md` notes als die aanwezig zijn.

## Skill References
- `.agents/skills/ui-implementation-guardrails/SKILL.md` voor clean-first UI polish en regressiefixes.
- `.agents/skills/stitch-redesign-execution/SKILL.md` voor scherm-redesigns op basis van Stitch refs.
