"""zero_day_detector.py — Détecteur de traversal / fuite de chemin système dans les logs HTTP.

Fonctions exécutables à la démo :
    python -m src.detect --log <fichier> --out <json>
    python -m src.detect --text "<ligne log>"

Sortie JSON structurée : {"alerts": [...], "summary": {...}}
Exit code : 0 quand l'analyse a fini.

Pro : nombre de dépendances minimal (stdlib), types clairs, docstring, tests.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from src.config import DEFAULT_INPUT_LOG, SENSITIVE_PATH_PATTERNS, TRAVERSAL_PATTERNS

_LINE_RE = re.compile(r"(GET|POST|PUT|DELETE|OPTIONS|PATCH)\s+(\S+)")
_TIME_RE = re.compile(r"(\d{4}-\d{2}-\d{2}[T ][\d:]{5,})")


def _decode_path(path: str) -> str:
    """Décode doublement ou simplement les encodages courants de traversal."""
    out = path
    for _ in range(3):
        nxt = out.replace("%2e", ".").replace("%2E", ".").replace("%2f", "/").replace("%2F", "/").replace("%5c", "\\")
        if nxt == out:
            break
        out = nxt
    return out


def extract_paths(line: str) -> list[str]:
    """Extrait les chemins requests d'une ligne de log HTTP (méthode + path)."""
    paths = []
    for m in _LINE_RE.finditer(line):
        paths.append(m.group(2))
    # Sinon : tout le mot non-espace qui contient ../ ou %2e
    if not paths:
        for tok in re.findall(r"\S+", line):
            if "../" in tok or "..\\" in tok or "%2e" in tok:
                paths.append(tok)
    return paths


def classify_path(path: str) -> dict[str, Any]:
    """Classifie un chemin : traversal + chemin sensible → critique, etc."""
    decoded = _decode_path(path)
    traversal = any(re.search(p, path, re.I) or re.search(p, decoded, re.I) for p in TRAVERSAL_PATTERNS)
    sensitive = any(re.search(p, decoded, re.I) for p in SENSITIVE_PATH_PATTERNS)
    if traversal and sensitive:
        risk, cwe = "critical", "CWE-22 (Path Traversal) + fuite système"
    elif traversal:
        risk, cwe = "high", "CWE-22 (Path Traversal)"
    elif sensitive:
        risk, cwe = "medium", "CWE-200 (Information Exposure)"
    else:
        risk, cwe = "low", "-"
    reasons = []
    if traversal:
        reasons.append("traversal détecté")
    if sensitive:
        reasons.append("chemin système sensible (etc/passwd, /etc/shadow, etc.)")
    return {"path": path, "risk": risk, "reason": "; ".join(reasons) if reasons else "chemin normal", "cwe": cwe, "decoded": decoded}


def analyze_line(line: str, idx: int = 0) -> list[dict[str, Any]]:
    """Analyse une ligne de log, retourne une liste d'alertes."""
    alerts: list[dict[str, Any]] = []
    for p in extract_paths(line):
        info = classify_path(p)
        if info["risk"] in ("high", "critical"):
            ts = _TIME_RE.search(line)
            alerts.append({
                "timestamp": ts.group(1).replace(" ", "T") if ts else datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "line_no": idx,
                "path": info["path"],
                "risk": info["risk"],
                "reason": info["reason"],
                "cwe": info["cwe"],
                "evidence": line.strip()[:400],
            })
    return alerts


def analyze_text(text: str) -> list[dict[str, Any]]:
    alerts: list[dict[str, Any]] = []
    for i, line in enumerate(text.splitlines(), start=1):
        alerts.extend(analyze_line(line, i))
    return alerts


def analyze_log(path: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    alerts = analyze_text(path.read_text(encoding="utf-8", errors="replace"))
    summary = {
        "log_file": str(path),
        "total_alerts": len(alerts),
        "critical": sum(1 for a in alerts if a["risk"] == "critical"),
        "high": sum(1 for a in alerts if a["risk"] == "high"),
        "medium": sum(1 for a in alerts if a["risk"] == "medium"),
        "low": sum(1 for a in alerts if a["risk"] == "low"),
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    return alerts, summary


def build_report(alerts: list[dict[str, Any]], summary: dict[str, Any]) -> dict[str, Any]:
    return {"alerts": alerts, "summary": summary, "detector": "aegis-p13-zeroday-detector", "version": "1.0.0"}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="zero_day_detector", description="Détecte le traversal / fuite système dans les logs HTTP.")
    ap.add_argument("--log", type=Path, default=None, help="Fichier log à analyser")
    ap.add_argument("--text", type=str, default=None, help="Analyser un texte (ligne log)")
    ap.add_argument("--out", type=Path, default=None, help="Écrire le JSON d'alertes (optionnel)")
    ap.add_argument("--quiet", action="store_true", help="Ne pas afficher le résumé")
    args = ap.parse_args(argv)

    try:
        if args.log is not None:
            if not args.log.exists():
                print(f"ERREUR : log introuvable : {args.log}", file=sys.stderr)
                return 2
            alerts, summary = analyze_log(args.log)
        elif args.text is not None:
            alerts = analyze_text(args.text)
            summary = {"total_alerts": len(alerts)}
        else:
            ap.print_help()
            return 2

        report = build_report(alerts, summary)
        if args.out:
            args.out.parent.mkdir(parents=True, exist_ok=True)
            args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"[OK] écriture : {args.out} ({len(alerts)} alertes)")

        if not args.quiet:
            s = report["summary"]
            print(f"[SUMMARY] total={s['total_alerts']} critical={s['critical']} high={s['high']} medium={s['medium']}")
            for a in alerts[:20]:
                print(f"  - [{a['risk']:8s}] L{a['line_no']:>3d} {a['path'][:70]}  # {a['reason'][:50]}")
        return 0
    except Exception as exc:  # surfaces errors clearly, pro
        print(f"ERREUR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
