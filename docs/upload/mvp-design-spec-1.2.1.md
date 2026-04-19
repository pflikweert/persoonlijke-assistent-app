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

## 11. Implementation Order

1. Foundations
2. Today
3. Capture
4. Post-entry
5. Days
6. Reflection
7. Polish

---

## Final Rule

If something adds complexity without improving:
- clarity
- speed
- calm

→ it does not belong in MVP.
