# DO NOT EDIT - GENERATED FILE

# Budio Build Truth

Build Timestamp (UTC): 2026-04-22T21:10:06.138Z
Source Commit: 1a2aa2e

Doel: primaire buildbundle met routes, componentarchitectuur, services, runtime functions en contracts.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## App Routes (kern)
- app/_layout.tsx
- app/sign-in.tsx
- app/(tabs)/index.tsx
- app/(tabs)/days.tsx
- app/(tabs)/reflections.tsx
- app/capture/index.tsx
- app/capture/record.tsx
- app/capture/type.tsx
- app/day/[date].tsx
- app/entry/[id].tsx
- app/settings.tsx
- app/settings-export.tsx
- app/settings-import.tsx
- app/settings-audio.tsx
- app/settings-regeneration.tsx
- app/settings-ai-quality-studio.tsx
- app/settings-ai-quality-studio/[taskKey].tsx

## Shared Components (kern)
- components/ui/screen-primitives.tsx
- components/ui/settings-screen-primitives.tsx
- components/ui/auth-screen-primitives.tsx
- components/ui/capture-screen-primitives.tsx
- components/ui/detail-screen-primitives.tsx
- components/ui/home-screen-primitives.tsx
- components/ui/modal-backdrop.tsx
- components/navigation/BottomTabBar.tsx
- components/navigation/fullscreen-menu-overlay.tsx
- components/feedback/background-task-notice.tsx
- components/feedback/background-task-status-card.tsx
- components/journal/archive-grouped-list.tsx

## Services (kern)
- services/auth.ts
- services/entries.ts
- services/day-journals.ts
- services/reflections.ts
- services/export.ts
- services/import/chatgpt-markdown.ts
- services/user-preferences.ts
- services/admin-regeneration.ts
- services/ai-quality-studio.ts
- services/reset.ts

## Supabase Functions (kern)
- supabase/functions/process-entry/index.ts
- supabase/functions/renormalize-entry/index.ts
- supabase/functions/regenerate-day-journal/index.ts
- supabase/functions/generate-reflection/index.ts
- supabase/functions/import-chatgpt-markdown/index.ts
- supabase/functions/admin-regeneration-job/index.ts
- supabase/functions/admin-ai-quality-studio/index.ts

## Contracts en Datagrondslag (kern)
- server-contracts/index.ts
- server-contracts/ai/index.ts
- supabase/migrations/20260416125000_user_background_tasks.sql
- supabase/migrations/20260418101500_entry_audio_storage_and_user_preferences.sql

## Gebruik
- Gebruik deze bundle voor codewijzigingsplanning, impactanalyse en repo-aligned implementatieprompts.
