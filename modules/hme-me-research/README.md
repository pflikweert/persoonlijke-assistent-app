---
title: HME-ME research module
audience: agent
doc_type: module-readme
source_role: operational
visual_profile: plain
upload_bundle: none
---

# HME-ME research module

Local-first tooling for a personal HME-ME medical imaging research track.
This module contains only generic scripts, docs, templates and dummy fixtures.

Real medical data, browser profiles, downloads, logs, exports and manifests
belong under:

```text
.local-data/experiments/hme-me-research/
```

That path is ignored by Git. Do not commit screenshots, DICOM files, HAR files,
cookies, tokens, auth headers, patient data or exported medical documents.

## Commands

```sh
npm run hme-me:prepare
npm run hme-me:inspect-radboud
```

## Flow

1. Run `npm run hme-me:prepare`.
2. Run `npm run hme-me:inspect-radboud`.
3. Log in to mijnRadboud manually in the opened browser.
4. Open the radiology images/viewer page manually.
5. Return to the terminal and press Enter.
6. Open one study/series manually while the script listens.
7. Inspect local output under `.local-data/**`.

## Boundaries

- No automatic DigiD, MFA or mijnRadboud login.
- No attempt to bypass portal security, session checks or access control.
- No OpenAI calls, Supabase writes or cloud upload.
- No medical interpretation or diagnosis claims.
- First prove one study/asset route, then design batch download.
