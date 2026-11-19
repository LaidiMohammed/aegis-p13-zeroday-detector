# SPEC P13 — Zéro-day + détection (Juice Shop)

`aegis-p13-zeroday-detector` — Spec technique pro :

- **Vulnérabilité cible** : Path Traversal (CWE-22) sur Juice Shop (`/ftp/...`)
- **Effet attendu** : traversal canonique (403 de serve-index) + traversal encodé, détection dans logs
- **Baseline start** : `http://127.0.0.1:3000`
- **Client HTTP** : requests ≥ 2.32, timeout explicite, allow_redirects=False
- **Format des données** : JSON structuré — `detect.json`, `exploitation_evidence.json`, `rapport-p13-zeroday.{pdf,md}`
- **Standards** : tests unit (`make test`), CI GitHub Actions (`ci.yml`), python 3.11/3.12, ruff-like style

## Sémantique des fonctions exécutables (çi à variance selon besoin de l'avancement)

| Fonction | Entrée | Sortie |
|---|---|---|
| `src.detect.analyze_text` | texte log | liste d'alertes (timestamp, path, risk, reason, cwe, evidence) |
| `src.detect.analyze_log` | path log | (alerts, summary) |
| `src.exploit.attempt_path` | (base_url, path) | évidence d'une tentative (URL, status, markers) |
| `src.exploit.run_po` | base_url | preuves structurées + verdicts + nota d'adaptation |
| `src.report.build_markdown` | (scan, exploit) | md du rapport |
| `src.report.build_pdf` | (md, out_path) | PDF délimité pro (reportlab) |

## Exit codes

- `detect --log <missing>` → **2** (file introuvable, pro)
- Autres erreurs → **1** + message clair
- Démo complète → **0** (si serveur up) — travaux listés ci-dessous

## Rôle du détecteur

- Détection de traversal (`./../`, encodés %2e%2e%2f, ..%2f, etc.)
- Fuite de chemin système sensible (etc/passwd, shadow, Windows, ...)
- risk : critical (traversal+système), high (traversal), medium (système)
- Sortie JSON writable pour vérifier l'impact par le prof
