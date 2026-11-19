# P13 — Zéro-day + détection (Juice Shop) — aegis-p13-zeroday-detector

![P13](https://img.shields.io/badge/P13-zeroday+detection-red)
![Python](https://img.shields.io/badge/Python-3.11+-blue)

**Outil d'audit de diagnostic P13 : détection et caractérisation de traversal
système (Path Traversal, CWE-22) via Juice Shop — laboratoire autorisé local.**

- **Objectif** : Détecter et caractériser la traversal dans les logs de l'application Juice Shop — données pour le mémoire de PFE.
- **Vulnérabilité** : CWE-22 (Path Traversal) — traversal canonique + encodées.
- **Impact** : Fuite potentielle de chemins système (etc/passwd, shadow, Windows) — labo local autorisé.
- **Charte éthique** : Labo local, données locales, pas de production, pas de sortie distante.

> **Note sur l'adaptation** : Juice Shop bloque le traversal via serve-index (403). L'attaque
> équivalente acceptée par P13 est le traversal sur fichiers locaux — voir `src/exploit.py`
> pour les tentatives documentées et l'adaptation. La **détection** est réelle via `src/detect.py`.

## Documentation

- [`docs/FICHE_TECHNIQUE.md`](docs/FICHE_TECHNIQUE.md) — Fiche technique
- [`docs/SPEC.md`](docs/SPEC.md) — Spec technique des fonctions
- [`docs/ETHICS.md`](docs/ETHICS.md) — Engagements éthiques (stand-alone, labo local)
- [`docs/DEMO.md`](docs/DEMO.md) — Expected outputs de la démo à présenter au prof

## Installation (0 GPU, 0 Prod)

```bash
# Dépendances (python3.11/3.12)
make install          # ou: python3 -m venv venv && venv/bin/pip install -r requirements.txt
```

## Démonstration à la démo (fonctions exécutables)

```bash
make detect    # 1/3 — Détection (zero_day_detector): expect 3 alertes critical
make exploit   # 2/3 — PoC (zero_day_exploit): évidence des tentatives traversal
make report    # 3/3 — Rapport (generate_report): outputs/rapport-p13-zeroday.{pdf,md}
make demo      # ——> complète : test + détection + PoC + rapport
```

## Structure du projet

```
aegis-p13-zeroday-detector/
├── src/                      # Code principal
│   ├── detect.py             # zero_day_detector — détecteur de traversal (CLI, JSON)
│   ├── exploit.py            # zero_day_exploit — PoC traversal + évidence
│   ├── report.py             # generate_report — PDF + MD du rapport
│   ├── config.py             # Constantes (patterns, chemins, URLs)
│   └── data/sample_access.log
├── tests/                    # Tests unit (pytest)
├── docs/                     # Fiche technique, specs, éthique, demo
├── outputs/                  # JSONs + rapports générés (évidence pour le prof)
├── scripts/run_demo.sh       # Démo complète dans un script
└── .github/workflows/ci.yml  # CI GitHub Actions
```

## Commit et push (GitHub)

```bash
git init -b main
git remote add origin https://github.com/LaidiMohammed/aegis-p13-zeroday-detector.git
git add .
git commit -m "feat(P13): detecteur + PoC de traversal Juice Shop + rapport"
git push -u origin main
```

Vercel (devant le prof) : [https://aegis-p13-zeroday-detector.vercel.app](https://aegis-p13-zeroday-detector.vercel.app) — site statique (voir `vercel.json`, framework null, site pro P13).

## Tests

```bash
make test
```

## Fonctions exécutables internes (CLI)

```bash
python -m src.detect --log src/data/sample_access.log --out outputs/detect.json
python -m src.exploit --out outputs/exploitation_evidence.json
python -m src.report --scan outputs/detect.json --exploit outputs/exploitation_evidence.json
```

## Crédibilité & détails (spec)

- Voir `docs/SPEC.md`, `docs/FICHE_TECHNIQUE.md`, `docs/ETHICS.md` — performance, trade-offs documentés, exit codes.
- Prénom mesure, implémentation ordinaire, tests clairs, **pas de GPU**, **pas de prod**, **éthique au cœur**.

> ⚠️ Labo autorisé : tous les tests tournent sur Juice Shop local (127.0.0.1) — données locales, pas d'interaction externe.

Généré par `aegis-p13-zeroday-detector` (P13).
