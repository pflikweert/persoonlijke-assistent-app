---
title: HME-ME Research — local-first medisch beeld- en dossieronderzoek
audience: human
doc_type: research-plan
source_role: operational
visual_profile: budio-terminal
upload_bundle: none
---

# HME-ME Research — local-first medisch beeld- en dossieronderzoek

## Status

```text
╔══════════════════════════════════════════════════════════════╗
║ HME-ME RESEARCH                                             ║
╠══════════════════════════════════════════════════════════════╣
║ MODE        persoonlijk research-experiment                 ║
║ PRODUCT     niet onderdeel van Vandaag MVP                  ║
║ DATA        local-first, niet committen                     ║
║ DOEL        downloaden → structureren → tooling → analyse   ║
╚══════════════════════════════════════════════════════════════╝
```

Dit document legt het startplan vast voor een persoonlijk HME-ME research-project binnen de Budio-omgeving.

Het doel is om medische beelden, verslagen en dossierinformatie lokaal te verzamelen, logisch te structureren en later tooling te bouwen voor annotatie, vergelijking en AI-ondersteunde analyse van osteochondromen/exostosen.

Dit is **geen medische diagnose-tooling**. Het is persoonlijke research, ervaringskennis en bouwexperiment. Bevindingen moeten altijd worden gezien als voorbereiding op betere vragen, betere ordening en betere gesprekken met artsen.

---

## Waarom dit project

HME/MHE is zeldzaam. Er is weinig geld, weinig tooling en weinig praktische researchcapaciteit voor patiënten en lotgenoten.

De gebruiker heeft zelf toegang tot medische beelden en verslagen via mijnRadboud en wil als bouwer onderzoeken of lokale tooling kan helpen bij:

- alle data veilig verzamelen
- beelden en verslagen koppelen
- osteochondromen/exostosen overzichtelijk in kaart brengen
- patronen herkennen over onderzoeken heen
- vragen voor artsen beter voorbereiden
- later mogelijk herbruikbare tooling maken voor lotgenoten

---

## Scopepositie binnen Budio

Dit project gebruikt Budio als lokale bouw- en onderzoeksomgeving, maar is **niet** onderdeel van de Vandaag MVP.

Scheiding:

```text
Budio repo
  modules/hme-me-research/        ← code, scripts, docs, templates, dummy data

Budio repo - lokaal ignored
  .local-data/experiments/hme-me-research/
                                  ← echte medische data, downloads, logs, exports
```

Regels:

- de repo mag generieke tooling bevatten
- echte medische data blijft lokaal
- echte data komt nooit in Git
- geen Supabase/cloud by default
- geen OpenAI op ruwe medische data zonder aparte expliciete beslissing

---

## Eerste bronnen

### mijnRadboud beeldenpagina

Bron:

```text
mijnRadboud / MyChart / Epic
Cardiologie, Radiologie en Radiotherapie
```

Observaties:

- de beeldenpagina toont studies/onderzoeken
- een study kan meerdere series bevatten
- series kunnen 2D-röntgenbeelden of CT/MR-volume zijn
- Actions-menu in viewer bevat geen download/export, alleen sluiten
- dropdowns zoals `Default`, `Abdomen`, `Bone`, `Pelvis` lijken render/windowing presets, geen aparte data-downloads

Belangrijk gevolg:

> Beelden downloaden is waarschijnlijk geen simpele UI-download, maar een download/extractieprobleem.

---

### Documenten en downloads

Pagina:

```text
mijnRadboud → Documenten en downloads
```

Zichtbare opties:

1. `Mijn dossier bekijken of downloaden`
2. `Aangevraagde dossiers`
3. `Mijn documenten`

Relevantie:

- `Mijn dossier bekijken of downloaden` is de officiële dossierexport-route
- `Aangevraagde dossiers` bevat downloads die na aanvraag gereed zijn
- `Mijn documenten` kan losse bijlagen/brieven bevatten

---

### Gedownloade ZIP

Bestand:

```text
Gezondheidssamenvatting_26_apr_2026.zip
```

Inhoud:

```text
README - Open for Instructions.TXT
INDEX.HTM
1 van 1 - Mijn gezondheidssamenvatting.PDF
IHE_XDM/P1/METADATA.XML
IHE_XDM/P1/DOC0001.XML ... DOC0008.XML
HTML/STYLE/*
HTML/IMAGES/*
```

Interpretatie:

- Epic/Lucy health-summary export
- bevat CDA/XML medische documenten en PDF-weergave
- géén radiologiebeeld-download
- wel waardevol als dossier-/metadata-/contextlaag

Opslagvoorstel:

```text
.local-data/experiments/hme-me-research/downloads/
  2026-04-26_gezondheidssamenvatting/
    original/
      Gezondheidssamenvatting_26_apr_2026.zip
    extracted/
      README - Open for Instructions.TXT
      INDEX.HTM
      1 van 1 - Mijn gezondheidssamenvatting.PDF
      IHE_XDM/
      HTML/
    summary.md
    manifest.json
```

---

### Google Drive radiologie-/ziekenhuisverslagen

Gevonden Google Doc:

```text
Raboud ziekenhuis uitslagen 2025
```

Let op: titel bevat waarschijnlijk een typefout: `Raboud` in plaats van `Radboud`.

Bevestigde onderzoeken in dit document:

- CR KNIE BDZ — 22 okt 2025
- CR BEKKEN — 22 okt 2025
- MR MSK WHOLE BODY I.V. CONTRAST — 24 nov 2025
- CT ONDERSTE EXTREMITEITEN / CT BOVENBEEN BDZ — 26 nov 2025
- CR LUMBALE WERVELKOLOM — 26 nov 2025

Belang:

- dit document wordt de eerste centrale tekstuele verslaglaag
- later splitsen naar `study.md` per onderzoek
- bruikbaar voor metadata, locatie-index, vragenlijst en annotatiecontext
- niet gebruiken als zelfstandige diagnosebron door AI

Opslagvoorstel:

```text
.local-data/experiments/hme-me-research/downloads/
  2025-radboud-ziekenhuis-uitslagen/
    source-google-doc.url
    export.md
    export.pdf
    manifest.json
```

---

## Lokale data-root

Voorstel binnen de Budio repo:

```text
.local-data/
  README.md
  experiments/
    hme-me-research/
      README.md
      manifest.md
      manifest.json
      downloads/
      studies/
      logs/
      exports/
      analysis/
```

Regels:

- `.local-data/**` staat in `.gitignore`
- geen medische beelden, persoonsgegevens, cookies, sessietokens of exports committen
- scripts mogen wel in Git
- dummy data mag later in `modules/hme-me-research/fixtures/`

---

## Module-plek voor tooling

Voorstel voor code/tooling:

```text
modules/hme-me-research/
  README.md
  scripts/
    inspect-page.ts
    capture-network.ts
    download-study-assets.ts
    build-manifest.ts
    split-radiology-reports.ts
  docs/
    download-flow-notes.md
    metadata-model.md
  fixtures/
    example-study.manifest.json
```

Scheiding:

- `modules/hme-me-research/**` = code, docs, templates, dummy data
- `.local-data/experiments/hme-me-research/**` = echte lokale data, nooit committen

---

## Onderzoeksobjecten

### Study

Een rij/onderzoek uit mijnRadboud, bijvoorbeeld:

- datum/tijd
- titel/beschrijving
- modaliteit: CT / MR / CR / NM
- body part / regio
- laterality: BDZ / links / rechts indien afleidbaar
- bronpagina/viewer-id indien beschikbaar
- gekoppeld radiologieverslag
- gekoppelde beelden/series

### Series

Een study bevat een of meer series:

- series-nummer
- series-naam
- modality
- image-count / slice-count
- viewer-label
- thumbnail indien beschikbaar
- lokale bestandslocatie

### Image / slice

Een image is een frame/slice binnen een series:

- image index
- URL of bronrequest
- bestandstype
- lokaal pad
- downloadstatus
- eventuele conversie naar PNG/JPG
- latere annotatiegegevens

---

## Storage-structuur per study

```text
.local-data/experiments/hme-me-research/studies/
  2025-11-26_ct-bovenbeen-bdz/
    study.md
    study.json
    raw/
    series/
      01_cr-sr/
        series.md
        series.json
        images/
      02_cr-sr/
        series.md
        series.json
        images/
      03_ace-bone-volume/
        series.md
        series.json
        dicom/
        images/
    logs/
      network.har
      download-log.jsonl
    exports/
    analysis/
```

---

## study.md template

```md
# Study: <titel>

## Basis
- datum:
- tijd:
- bron: mijnRadboud
- afdeling: Cardiologie / Radiologie / Radiotherapie
- modality:
- omschrijving:
- regio/body part:
- laterality:

## Download
- status: pending | partial | complete | failed
- methode: manual | documenten-downloads | network-capture | playwright
- datum_download:
- bron_url:
- aantal_bestanden:

## Gekoppelde documenten
- radiologieverslag:
- gezondheidssamenvatting:
- andere bron:

## Series
- totaal_series:

| Nr | Naam | Modality | Images/slices | Status |
| --- | --- | --- | --- | --- |
| 01 |  |  |  |  |

## Observaties
- visuele notities:
- mogelijke exostosen:
- vragen voor arts:

## AI/Analyse
- ai_gebruikt: nee
- analyse_status: not_started
- disclaimer: research/annotatiehulp, geen diagnose
```

---

## Metadata die minimaal nodig is

### Globaal manifest

```json
{
  "project": "hme-me-research",
  "owner": "local-private",
  "source": "mijnRadboud",
  "created_at": "",
  "studies": []
}
```

### Study metadata

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

### Series metadata

```json
{
  "series_index": 1,
  "series_label": "ACE Bone 0.5 Vol",
  "modality": "CT",
  "image_count": 195,
  "local_path": "series/03_ace-bone-volume",
  "download_status": "pending"
}
```

---

## Downloadstrategie

### Fase 1 — Repo en lokale data-laag voorbereiden

Doel:

- VS Code/repo/Codex klaarzetten voor veilig lokaal researchwerk
- ignored data-root maken
- module-map voorbereiden
- documentatie en basismanifest toevoegen

Werk:

- `.gitignore` uitbreiden met `.local-data/**`
- `.local-data/README.md` lokaal maken, maar niet committen tenzij expliciet gekozen als safe placeholder
- `modules/hme-me-research/README.md` maken
- `modules/hme-me-research/docs/metadata-model.md` maken
- dummy manifest maken zonder echte data

Resultaat:

- veilige scheiding tussen code en medische data
- Codex/Cline kan scripts bouwen zonder data te committen

---

### Fase 2 — Alle beschikbare officiële downloads opslaan

Doel:

- alle beschikbare exports uit mijnRadboud lokaal opslaan
- Drive-verslagen exporteren naar lokale researchmap
- metadata vastleggen

Bronnen:

- gezondheidssamenvatting ZIP
- aangevraagde dossierdownloads
- radiologieverslagen uit Google Drive
- eventuele PDF/HTML/XML-export

Resultaat:

```text
downloads/
  2026-04-26_gezondheidssamenvatting/
  2025-radboud-ziekenhuis-uitslagen/
  2026-04-26_mijn-dossier/
  2026-04-26_al-uw-contacten/
```

---

### Fase 3 — Verslagen splitsen naar studies

Doel:

- Google Doc met radiologieverslagen splitsen naar study-mappen
- elk onderzoek krijgt een eigen `study.md`
- later beelden koppelen aan dezelfde study-slugs

Beoogde studies:

```text
2025-10-22_cr-knie-bdz
2025-10-22_cr-bekken
2025-11-24_mr-msk-whole-body-iv-contrast
2025-11-26_ct-bovenbeen-bdz
2025-11-26_cr-lumbale-wervelkolom
```

---

### Fase 4 — Beelden downloaden of extraheren

Doel:

- radiologiebeelden alsnog lokaal krijgen

Routes:

1. officiële downloadoptie vinden
2. viewer network-capture
3. Playwright/browser automation
4. handmatige export/screenshots als tijdelijke fallback

Te onderzoeken:

- DevTools Network tab
- requests met woorden zoals `image`, `dicom`, `series`, `study`, `thumbnail`, `wado`, `wadors`, `blob`, `file`
- HAR export opslaan in lokale logs

Output:

```text
.local-data/experiments/hme-me-research/logs/network-first-pass.har
.local-data/experiments/hme-me-research/logs/network-findings.md
```

---

### Fase 5 — Tooling voor research en analyse

Nog uitwerken.

Mogelijke tooling:

- lokale study browser
- report-to-study matcher
- metadata extractor
- image inventory
- annotatiebestand per beeld/serie
- exostose locatie-index
- simpele viewer met overlays
- AI-assisted beschrijving of segmentatie
- export naar artsenvragenlijst

---

## Privacy en security regels

Hard:

- geen medische data committen
- geen screenshots met persoonsgegevens committen
- geen sessiecookies/tokens opslaan in repo
- `.local-data/**` altijd ignored
- OpenAI alleen gebruiken op afgeleide/gestripte data na expliciete beslissing
- geen Supabase/cloud by default

Pragmatisch:

- lokaal mag snel en experimenteel
- eerst werkend, daarna netter
- audit trail bijhouden zodat later te reproduceren is wat gedownload is

---

## Herbruikbaarheid voor lotgenoten

Doel: de aanpak later kunnen delen zonder persoonlijke data.

Daarom:

- scripts generiek houden
- metadata-model generiek houden
- persoonlijke paden/config buiten Git houden
- documenteer stappen in gewone taal
- maak dummy manifesten
- maak later een `patient-local-data-root` config
- medische termen en classificaties scheiden van persoonlijke bevindingen

Mogelijke generieke naam later:

- `patient-research-local-data`
- `medical-imaging-local-research-kit`
- `hme-me-research-toolkit`

---

## Nu / Next / Later

### Nu

1. repo veilig voorbereiden
2. `.local-data/**` hard uitsluiten van Git
3. module-map voor HME-ME research voorbereiden
4. huidige exports lokaal ordenen
5. Drive-verslag exporteren en lokaal opslaan
6. studies aanmaken op basis van radiologieverslagen

### Next

1. script voor study manifest
2. script voor splitsen radiologieverslagen
3. script voor inventariseren downloads
4. network-capture radiologieviewer
5. testdownload van 1 study

### Later

1. batch downloader
2. lokale viewer
3. annotatie UI
4. exostose classificatie schema
5. AI-assisted detection
6. deelbare toolkit voor lotgenoten

---

## Open vragen

### Download / data

- Bevat de volledige dossierexport ook radiologieverslagen of alleen samenvatting?
- Bevat mijnRadboud ergens echte DICOM-downloads?
- Zijn beelden via network requests als losse image/slice beschikbaar?
- Kunnen studies eenduidig gematcht worden op datum/titel tussen viewer en verslag?

### Structuur / metadata

- Welke naming convention gebruiken we definitief voor study-slugs?
- Moeten CR KNIE BDZ en CR BEKKEN apart blijven, ook als verslaginhoud deels overlapt?
- Hoe leggen we links/rechts/BDZ consistent vast?
- Hoe leggen we series/image counts vast zonder beelden al te hebben?

### Tooling

- Eerst CLI scripts of meteen eenvoudige web UI?
- Eerst verslagsplitter of eerst beeld-downloader?
- Welke minimale JSON-schema’s zijn nodig?
- Hoe maken we tooling later bruikbaar voor een lotgenoot zonder Radboud-specifieke aannames?

### AI

- Welke data mag eventueel naar OpenAI?
- Moet AI alleen op verslagtekst werken, of later ook op beelden?
- Welke output is veilig: samenvatting, locatie-index, vragenlijst, annotatiehulp?
- Hoe voorkomen we diagnoseclaims?

---

## Niet nu

- geen AI-analyse bouwen
- geen viewer bouwen
- geen Supabase integratie
- geen cloud sync
- geen diagnoseclaims
- geen perfecte architectuur
- geen MVP-scopewijziging voor Vandaag

---

## Aanbevolen repo-locatie

Als projectdocument:

```text
docs/project/40-ideas/60-personal-research/hme-me-local-first-research.md
```

Als je het meer als actief persoonlijk researchspoor wilt behandelen:

```text
docs/project/30-research/80-hme-me-local-first-research.md
```

Advies: begin in `40-ideas`, omdat dit nog geen officiële Budio-productplanning is. Promoveer later naar `30-research` of een eigen `docs/personal-research/**` als dit structureel wordt.
