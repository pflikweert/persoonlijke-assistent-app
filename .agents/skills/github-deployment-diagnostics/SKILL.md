---
name: github-deployment-diagnostics
description: Diagnoseflow voor GitHub deployment/security-meldingen met verplichte bronbevestiging via gh CLI/API vóór advies.
---

# Gebruik
Gebruik bij meldingen over GitHub deployments, Actions-checks, security warnings of add-on/integration ruis.

# Kernregel
Werk hypothese-first, maar geef nooit advies op basis van aannames alleen:
1. formuleer eerst een expliciete hypothese
2. verifieer die met primaire GitHub-bronnen (`gh` CLI/API, workflowruns, check-runs, annotations, alerts)
3. geef pas daarna diagnose + oplossingsadvies

# Standaard diagnoseflow (gh CLI)
Vervang `<owner>`, `<repo>`, `<sha>`, `<run_id>`, `<check_run_id>`.

1. **Check-runs voor commit**
```bash
gh api "repos/<owner>/<repo>/commits/<sha>/check-runs" \
  --jq '.check_runs[] | {id,name,status,conclusion,html_url,annotations:.output.annotations_count}'
```

2. **Annotations van check-run**
```bash
gh api "repos/<owner>/<repo>/check-runs/<check_run_id>/annotations"
```

3. **Workflow run details**
```bash
gh api "repos/<owner>/<repo>/actions/runs/<run_id>"
```

4. **Secret scanning alerts (open)**
```bash
gh api "repos/<owner>/<repo>/secret-scanning/alerts?state=open&per_page=100"
```

5. **Code scanning alerts (open)**
```bash
gh api "repos/<owner>/<repo>/code-scanning/alerts?state=open&per_page=100"
```

6. **Dependabot alerts (open)**
```bash
gh api "repos/<owner>/<repo>/dependabot/alerts?state=open&per_page=100"
```

# Interpretatieguardrails
- `conclusion: success` + warning-annotation = vaak geen mislukte deploy, maar platform/deprecatie-waarschuwing.
- `404 no analysis found` bij code-scanning betekent meestal: geen CodeQL/scan-analyse actief (niet per se een fout in code).
- `403 Dependabot alerts are disabled` betekent feature uitgeschakeld of onvoldoende permissies.
- Behandel token-scope/permissiefouten expliciet als diagnostische blocker, niet als productbug.

# Actiepatroon na diagnose
1. Label bevindingen als: **bevestigd**, **onbevestigd**, **blocked door permissies**.
2. Fix eerst de directe trigger (bv. workflow warning/deprecatie).
3. Geef daarna optionele hardening-stappen (bv. security-features aanzetten) apart van de directe fix.
4. Rapporteer exact welke command-output de conclusie onderbouwt.

# Post-push deployment follow-up (verplicht bij expliciet verzoek)
Gebruik na een commit/push altijd deze volgorde:

1. **Nieuwe commit SHA bepalen**
```bash
git rev-parse HEAD
```

2. **Check-runs van die commit uitlezen**
```bash
gh api "repos/<owner>/<repo>/commits/<sha>/check-runs" \
  --jq '.check_runs[] | {id,name,status,conclusion,html_url,annotations:.output.annotations_count}'
```

3. **Bij failure/warning details ophalen**
- annotations:
```bash
gh api "repos/<owner>/<repo>/check-runs/<check_run_id>/annotations"
```
- workflowrun:
```bash
gh api "repos/<owner>/<repo>/actions/runs/<run_id>"
```

4. **Uitkomstmelding**
- Als checks/deploy groen zijn: toon exact dit bericht: **"Te succesvol."**
- Als checks/deploy warnings bevatten (maar geen failure): vraag eerst expliciet:
  - **"Hey, wil je dit nu oplossen, of zal ik dit als een taak in de backlog zetten? Of als idee in de backlog?"**
- Als checks/deploy falen: geef eerst bron-gebaseerde analyse + advies, en voer niets uit zonder expliciet akkoord.

5. **Iteratieregel bij failures**
- Herhaal alleen na akkoord van gebruiker:
  - analyse → advies → (na akkoord) fix → push → follow-up checks opnieuw.
- Blijf deze lus volgen totdat de deployment/checks slagen.

# Niet doen
- Geen advies zonder gh/API-bevestiging.
- Geen platformfout claimen op basis van UI-indruk alleen.
- Geen security-paniek zonder concrete alert payload.
- Warnings niet stilzwijgend negeren of direct fixen zonder keuzevraag aan gebruiker.