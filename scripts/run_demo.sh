#!/usr/bin/env bash
# scripts/run_demo.sh — exécute toute la chaine à la démo : détection -> PoC -> rapport
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== [1/3] Détection (zero_day_detector) ==="
python3 -m src.detect --log src/data/sample_access.log --out outputs/detect.json

echo "=== [2/3] PoC (zero_day_exploit) ==="
python3 -m src.exploit --out outputs/exploitation_evidence.json

echo "=== [3/3] Rapport (generate_report) ==="
python3 -m src.report --scan outputs/detect.json --exploit outputs/exploitation_evidence.json \
  --pdf outputs/rapport-p13-zeroday.pdf --md outputs/rapport-p13-zeroday.md

echo "=== Résultats ==="
ls -lh outputs/
