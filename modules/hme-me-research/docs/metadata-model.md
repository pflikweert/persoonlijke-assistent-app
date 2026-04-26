---
title: HME-ME metadata model
audience: agent
doc_type: reference
source_role: operational
visual_profile: plain
upload_bundle: none
---

# Metadata model

This model is intentionally small for the first local-first spike. It tracks
inventory and download state without storing medical content in Git.

## Manifest

```json
{
  "project": "hme-me-research",
  "owner": "local-private",
  "source": "mijnRadboud",
  "created_at": "2026-04-26T00:00:00.000Z",
  "updated_at": "2026-04-26T00:00:00.000Z",
  "studies": []
}
```

## Study

```json
{
  "study_slug": "2025-11-26_ct-bovenbeen-bdz",
  "source_platform": "mijnRadboud",
  "source_system": "Epic/MyChart",
  "date": "2025-11-26",
  "time": "",
  "title": "CT BOVENBEEN BDZ",
  "modality": "CT",
  "body_part": "bovenbeen",
  "laterality": "BDZ",
  "download_status": "pending",
  "report_source": "",
  "series": []
}
```

## Series

```json
{
  "series_index": 1,
  "series_label": "ACE Bone 0.5 Vol",
  "modality": "CT",
  "image_count": 195,
  "local_path": "series/03_ace-bone-volume",
  "download_status": "pending",
  "assets": []
}
```

## Asset

```json
{
  "asset_id": "2025-11-26_ct-bovenbeen-bdz_series-03_image-0001",
  "asset_type": "unknown",
  "source_kind": "network",
  "sanitized_url": "https://example.invalid/path/[redacted]",
  "local_path": "",
  "download_status": "pending"
}
```

## Status values

- `pending`
- `inventoried`
- `partial`
- `downloaded`
- `failed`
- `skipped`
