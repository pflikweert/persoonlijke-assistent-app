# Lokale Day Dump (Entries + Day Journal)

Doel: snel een controlebestand maken met alle losse entries van een dag plus de `day_journals` output.

## 1) Volledige dagdump (alle users)

```bash
node scripts/export-day-quality-dump.mjs --day=2026-04-02
```

Output (default):
- `docs/dev/day-2026-04-02-quality-dump.md`

## 2) Gefilterde dump voor 1 user

```bash
node scripts/export-day-quality-dump.mjs --day=2026-04-02 --user=ce4bf648-cba9-4092-a9b6-1b3c60987e8e
```

Output (default):
- `docs/dev/day-2026-04-02-quality-dump-user-ce4bf648.md`

## 3) User-id vinden van je lokale flow

Pak de laatste `process-entry` logregel met `validated`:

```bash
rg -n "process-entry\\] validated|userId|journalDate" /tmp/supabase-functions.log | tail -n 20
```

Daar zie je o.a. `userId` en `journalDate`.

## 4) Eigen outputpad kiezen (optioneel)

```bash
node scripts/export-day-quality-dump.mjs \
  --day=2026-04-02 \
  --user=ce4bf648-cba9-4092-a9b6-1b3c60987e8e \
  --out=docs/dev/custom/day-2026-04-02-user-dump.md
```

## 5) Relevante lokale URL

Voor de gevraagde testdag:
- `http://localhost:8081/day/2026-04-02`
