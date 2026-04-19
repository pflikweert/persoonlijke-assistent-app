# Local Day Journal E2E

## Doel
Valideer lokaal de `process-entry` -> `day_journals` flow voor `2026-04-02`, met focus op:
- compressie-detectie + retry-flow
- bronterm-gedrag (bijv. `therapie`)
- duidelijke scheiding tussen `narrative_text` en `summary`

## Vereisten
- Lokale Supabase draait (`npx supabase start`)
- Edge functions draaien (`npx supabase functions serve`)
- App draait lokaal op `http://localhost:8081`
- `.env.local` bevat lokale Supabase/OpenAI waarden

## Vaste testinput
Gebruik een langere invoer met meerdere momenten en een neutrale bronterm:
- bron bevat expliciet `therapie`
- geen coach/meta advies
- meerdere concrete dagmomenten

## Uitvoeren
1. Maak een testuser en verkrijg access token (via Supabase Auth of bestaande testflow).
2. Stuur een `process-entry` request met:
   - `capturedAt: "2026-04-02T18:30:00.000Z"`
   - vaste `x-flow-id` (bijv. `e2e-day-2026-04-02-01`)
3. Open daarna `http://localhost:8081/day/2026-04-02`.

Voorbeeld request:
```bash
curl -sS -X POST "http://127.0.0.1:54321/functions/v1/process-entry" \
  -H "apikey: <LOCAL_PUBLISHABLE_KEY>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "x-flow-id: e2e-day-2026-04-02-01" \
  -d '{
    "capturedAt": "2026-04-02T18:30:00.000Z",
    "rawText": "..."
  }'
```

## Logs controleren
Controleer `/tmp/supabase-functions.log` op `x-flow-id`.

Verwachte eventvolgorde bij compressie:
- `compressed_detected`
- `retry_attempted`
- daarna precies één van:
  - `retry_succeeded`
  - `retry_failed` gevolgd door `day_journal_fallback_used`

## Passcriteria
- Geen `day_journal_fallback_used` alleen vanwege compressie zonder retry.
- Bij compressie is retry zichtbaar in events.
- `narrative_text` mag bronterm zoals `therapie` bevatten als die in de bron stond.
- `narrative_text` leest niet als samenvatting en blijft bronnabij.
- `summary` blijft duidelijk compacter dan `narrative_text`.

## Herhalen
1. Nieuwe `x-flow-id` gebruiken.
2. Opnieuw `process-entry` sturen met dezelfde testinput.
3. Zelfde log- en outputchecks herhalen.
