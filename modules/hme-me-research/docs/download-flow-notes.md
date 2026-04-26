---
title: HME-ME download flow notes
audience: agent
doc_type: notes
source_role: operational
visual_profile: plain
upload_bundle: none
---

# Download flow notes

## Current target

Prove a safe local-first path after manual mijnRadboud/DigiD login:

1. The user logs in manually.
2. The user opens the radiology images page manually.
3. The script inventories visible studies/series and relevant network metadata.
4. Output is written locally under `.local-data/**`.

## Safety rules

- Store only sanitized metadata.
- Never store cookies, authorization headers, request bodies or response bodies.
- Never commit HAR files, screenshots, medical exports or browser profiles.
- Keep persistent browser profile data under `.local-data/**`.
- Do not automate DigiD, MFA, portal login or session checks.

## First spike behavior

- Default mode is inventory only.
- `--download-one` may save at most one Playwright download event into the local
  downloads folder.
- If the viewer does not expose a safe browser download event, keep the run as
  metadata-only.

## Resume model

Use append-only logs and per-object statuses:

- `download_status: pending`
- `download_status: inventoried`
- `download_status: partial`
- `download_status: downloaded`
- `download_status: failed`
- `download_status: skipped`

`download-log.jsonl` is local-only and should record attempts without secrets.

## Next step

After the first run, identify one real study where the asset route is known.
Only after that route is proven should a batchdownloader be designed for all
studies.
