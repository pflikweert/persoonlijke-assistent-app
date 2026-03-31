# Supabase Local Folder

Deze map is gereserveerd voor lokale Supabase tooling en migraties.

- Geen productie-secrets committen.
- Voor lokaal functions draaien met `--env-file`: gebruik geen custom env namen die beginnen met `SUPABASE_`.
- Gebruik voor gedeelde projectconfig `EXPO_PUBLIC_SUPABASE_URL` en `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Voor `process-entry` audio-transcriptie: zet `OPENAI_API_KEY` en optioneel `OPENAI_TRANSCRIPTION_MODEL` in je lokale env.
