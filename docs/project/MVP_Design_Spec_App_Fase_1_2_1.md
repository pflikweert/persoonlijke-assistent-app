# MVP Design Spec v1.3 — Capture First

## Version
v1.3 — Based on validated Stitch design direction  
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

## 10. Implementation Order

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
