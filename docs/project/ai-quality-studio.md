# AI Quality Studio

## Doel

De **AI Quality Studio** is een admin-only toolinglaag om de kwaliteit van AI-output in de app te verbeteren, testen en beheren.

Deze tool ondersteunt fase **1.2B** en **1.2E** en valt expliciet binnen hardening, niet als productuitbreiding.

## Scope

### In scope

- Centrale prompt-definitie per AI-task
- Versiebeheer van prompts
- Testomgeving met echte data
- Vergelijking van output (live vs test)
- Handmatige evaluatie met review en labeling
- Controlled rollout van draft naar live
- Traceability van gegenereerde content

### Niet in scope

- Generieke AI per scherm
- End-user features
- Client-side OpenAI calls
- Auto prompt optimization
- Nieuwe productflows

## Kernconcept

Werk per **AI-task**, niet per scherm.

### Canonieke AI-tasks

#### Fase 1

1. `entry_cleanup`
2. `entry_summary`
3. `day_summary`
4. `day_narrative`

#### Fase 2

5. `week_summary`
6. `week_narrative`
7. `week_highlights`
8. `week_reflection_points`

#### Fase 3

9. `month_summary`
10. `month_narrative`
11. `month_highlights`
12. `month_reflection_points`

## Architectuur

AI Quality Studio bestaat uit 4 modules:

1. Tasks
2. Versions
3. Test Lab
4. Rollout & Regeneration

## 1. Tasks

Definitie van een AI-taak.

### Voorbeeld

```json
{
  "key": "day_narrative",
  "input_type": "day",
  "output_type": "text",
  "description": "Volledig verhalend dagverhaal"
}
```

## 2. Versions

Elke task heeft meerdere versies.

### Properties

- `version_number`
- `status`: `draft` | `testing` | `live` | `archived`
- `model`
- `prompt_template`
- `system_instructions`
- `output_schema`
- `config` (json)
- `min_items` / `max_items` (optioneel)
- `changelog`

### Regels

- Altijd immutable na live
- Nieuwe wijziging = nieuwe versie
- Slechts 1 live versie per task

## 3. Test Lab

De belangrijkste module.

### Flow

1. Selecteer task
2. Selecteer versie of maak nieuwe
3. Selecteer testcases
4. Run test
5. Bekijk resultaat
6. Vergelijk met live output
7. Label resultaat
8. Itereer

### Testcase types

- `entry`
- `day`
- `week`
- `month`

### Bronnen

- echte data uit de database
- curated testset, later

### Wat tonen per test

- input, brondata
- samengestelde input
- prompt
- model
- output test
- output live
- diff
- metadata

### Acties

- copy full test bundle
- label: `better` | `equal` | `worse` | `fail`
- reviewer notes

## 4. Rollout & Regeneration

### Rollout

- Promote draft naar live
- Auto version increment
- Archive oude versie

### Regeneration

- Filter records op oude versie
- Selecteer subset
- Re-run met nieuwe versie
- Via bestaande admin job met batch API

## Datamodel

### `ai_tasks`

| field | type |
|---|---|
| id | uuid |
| key | string |
| label | string |
| input_type | enum |
| output_type | enum |
| description | text |
| is_active | boolean |

### `ai_task_versions`

| field | type |
|---|---|
| id | uuid |
| task_id | uuid |
| version_number | int |
| status | enum |
| model | string |
| prompt_template | text |
| system_instructions | text |
| output_schema_json | json |
| config_json | json |
| min_items | int |
| max_items | int |
| created_by | uuid |
| created_at | timestamp |

### `ai_test_cases`

| field | type |
|---|---|
| id | uuid |
| task_id | uuid |
| source_type | enum |
| source_record_id | uuid |
| label | string |
| is_golden | boolean |

### `ai_test_runs`

| field | type |
|---|---|
| id | uuid |
| task_version_id | uuid |
| test_case_id | uuid |
| input_snapshot_json | json |
| prompt_snapshot | text |
| model_snapshot | string |
| output_text | text |
| output_json | json |
| reviewer_label | enum |
| reviewer_notes | text |
| created_at | timestamp |

### `ai_live_generation_log`

| field | type |
|---|---|
| id | uuid |
| task_id | uuid |
| task_version_id | uuid |
| source_type | enum |
| source_record_id | uuid |
| target_table | string |
| target_record_id | uuid |
| request_id | string |
| flow_id | string |
| model | string |
| created_at | timestamp |

## Belangrijke Regels

### 1. Snapshotting

Altijd volledige snapshot opslaan van:

- input
- prompt
- model
- output

Nooit alleen referenties.

### 2. Content contracts blijven leidend

- entry ≠ samenvatting
- narrative ≠ summary
- reflectie ≠ advies

### 3. Admin-only

- UI alleen zichtbaar voor admins
- debug info alleen zichtbaar voor admins

### 4. Server-side only

- OpenAI calls via Edge Functions
- geen client-side calls

## UI Structuur

### Desktop

- Sidebar: tasks
- Main: versions + editor
- Right panel: test results + diff

### Mobiel

- Task list naar detail
- Test results collapsible
- Geen split views

## Componenten

- TaskList
- VersionSelector
- PromptEditor
- InputViewer
- OutputViewer
- DiffViewer
- TestRunner
- VersionBadge
- CopyBundleButton
- PromoteButton

## Teststrategie

### 1. Contract checks

- lengte checks
- min/max items
- verboden taal
- structuurvalidatie

### 2. Human review

- `better` / `equal` / `worse` / `fail`
- notities verplicht bij `fail`

### 3. Later, niet MVP

- automatische evals
model graders
Implementatievolgorde
Stap 1

Datamodel + migrations

Stap 2

Task + version CRUD

Stap 3

Test runner (single test)

Stap 4

Output viewer + diff

Stap 5

Test runs opslaan + labeling

Stap 6

Promote to live

Stap 7

Live generation logging koppelen

Stap 8

Regeneration integratie

Risico’s
Scope creep naar generieke AI tooling
Geen duidelijke scheiding tasks vs schermen
Geen snapshotting → geen reproduceerbaarheid
Te vroeg automatiseren (evals/optimizer)
Succescriteria
Promptkwaliteit aantoonbaar beter
Minder regressies in output
Sneller itereren op prompts
Volledige traceability van output
Consistente naleving content contracts
Samenvatting

We bouwen geen adminpanel.

We bouwen een AI Quality Studio:

→ gericht
→ taakgedreven
→ testbaar
→ reproduceerbaar
→ veilig te deployen

Dit is de minimale, maar krachtige stap om van “prompt tweaking” naar structurele AI-kwaliteit te gaan.
```
