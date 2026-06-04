# Server-side AI Layer (Legacy Stub)

Deze map bevat alleen server-side structuur en contracts voor AI orchestration.

- Geen client-side OpenAI gebruik.
- `OPENAI_API_KEY` blijft server-only.
- Promptteksten zijn stubs met versioning placeholders.
- Geen Realtime API.
- Geen vector store logica.
- Niet gebruiken als live runtimepad voor Budio AIQS-managed flows.
- Live OpenAI-runtime loopt via `supabase/functions/**` en live AIQS DB-bindings.
- Deze stubs zijn legacy/test-only totdat ze expliciet verwijderd of vervangen worden.
