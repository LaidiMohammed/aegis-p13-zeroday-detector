# FICHE TECHNIQUE — P13 (aegis-p13-zeroday-detector)

## Objectif

Détecter et caractériser la traversal système (Path Traversal) dans le contexte
de Juice Shop — données de diag techniques pour le mémoire de PFE (Master 1).

## Périmètre

- **Cible** : [Juice Shop](http://127.0.0.1:3000) local autorisé (clients et usage au quotidien d'AEGIS).
- **Scan** : traversal canonique + encodés sur `/ftp/`.
- **Charte éthique** : application locale uniquement ; pas de production ; pas de fuites distantes; données automiques.

## Architecture (ASCII)

```
┌─────────────────────────────────────────────────────┐
│                    aegis-p13-zeroday-detector        │
├─────────────────────────────────────────────────────┤
│  zero_day_exploit (PoC)      zero_day_detector       │
│  (attempt_path/run_po)       (analyze_text/log)      │
│            │                        │               │
│            ▼                        ▼               │
│       Juice Shop  ──────────►  logs (access.log)    │
└─────────────────────────────────────────────────────┘
```

## Fonctions à exécuter à la démo (ordre recommandé)

1. `make detect` — détection sur le sample (expect: 3 alertes)
2. `make exploit` — PoC traversal (URLs, codes HTTP, marqueurs, verdicts)
3. `make report` — PDF + MD du rapport (preuves, recommandations)
4. `make demo` — fin complète (tests → détection → PoC → rapport)

Commands executables directement via : `python -m src.detect`, `python -m src.exploit`, `python -m src.report`.

## Build & Deployement

- Build : `make install` (venv + pip install -r requirements.txt)
- Tests : `make test`
- Deploy : pushes → CI github → push Ok

## Efficacité technique

- Détecteur pur : stdlib + typings; 60 lignes de travail spécifique — indestructible, speed à néant.
- PDF : design épuré (reportlab), README HQ.

## Crédibilité (trade-offs documentés)

- Traversal bloqué par serve-index (403) : **adapté (voir specs, report.py)**.
- Aucune GPU, aucun côté cloud — l'ensemble est local.

---
Fiche technique du projet P13 — aegis-p13-zeroday-detector (en cours de build — Redirected accordingly)
