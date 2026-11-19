"""generate_report.py — Génère le rapport de diagnostic du scan P13.

Contenu du rapport : statut d'analyse, preuves d'évidence (PoC), détails de la
détection dans les logs, recommandations d'action, notations d'éthique.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from src.config import PROJECT_ID

PDF_PATH_DEFAULT = "outputs/rapport-p13-zeroday.pdf"
MD_PATH_DEFAULT = "outputs/rapport-p13-zeroday.md"


def _load_json(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"fichier introuvable : {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def build_markdown(scan: dict, exploit: dict) -> str:
    s = scan.get("summary", {})
    a = (scan.get("alerts") or [])[:10]
    att = exploit.get("attempts", [])
    lines = [
        f"# Rapport — P13 Zéro-day + détection (Juice Shop)",
        "",
        f"Statut : **{s.get('total_alerts', 0)} alertes** "
        f"(critiques={s.get('critical', 0)}, hautes={s.get('high', 0)}, moyennes={s.get('medium', 0)}, faibles={s.get('low', 0)})",
        "",
        "## 1. Fiche technique résumée",
        "- **Objectif** : Détecter et caractériser la traversal système (Path Traversal) dans le fichier Juice Shop.",
        "- **Vulnérabilité** : CWE-22 (Path Traversal) + fuite système probable (etc/passwd, etc/shadow).",
        "- **Impact** : Léger en labo autorisé ; calibré CVSS prévisionnel ~4.0-6.5 selon context.",
        "- **Charte** : application locale autorisée, données locales, pas de production, pas de fuites distantes.",
        "- **Témoins stockés** : `outputs/exploitation_evidence.json`, `outputs/detect.json`",
        "",
        "## 2. Preuves d’évidence (PoC)",
    ]
    for a_ in att[:8]:
        body = (a_.get("body_head") or "").replace("\n", " | ")[:90]
        lines.append(f"- **{a_.get('status')}** — `{a_.get('payload')}` — {a_.get('content_type', '').split(';')[0]} — body: `{body or '(vide)'}`")
    lines.append(f"  - Synthese : {exploit.get('synthesis', '')}")
    lines.append(f"  - Verdicts : {exploit.get('verdicts', [])[:6]}")
    lines += [
        "",
        "Détaillé : `outputs/exploitation_evidence.json` (évidence complète : URLs, codes HTTP, tailles, marqueurs, verdicts).",
        "",
        "## 3. Détection dans les logs",
    ]
    for a_ in a:
        lines.append(f"- **{a_['risk'].upper()}** — {a_['path']} — {a_['reason']} — CWE: {a_['cwe']}")
    lines.append("")
    lines.append("résumé : " + json.dumps(s, ensure_ascii=False))
    lines += [
        "",
        "## 4. Notes d’évidence externes",
        "- Fonction de téléchargement d'exécution réelle : tentatives documentées via `python -m src.exploit`.",
        "- Traversal bloqué par serve-index (403) : adapté (voir exemple dans report.py).",
        "",
        "## 5. Recommandations",
        "- Patcher : servir `/ftp/` via `pathlib.resolve()` + `is_relative_to()` ; encode pathname en base64 lors de la lecture (anti-traversal recommandé).",
        "- Hardening : userlab + random root pass, fs read-only, journalisation des requêtes /ftp/",
        "- Validation : réexécuter `python -m src.detect --log <access.log>` et observer le score persistant bas.",
        "- Web: partage du rapport à ce prof + sonvoir le background prof sur '20 projects' par un stream pour creation des 20 projets.",
        "- Ethique : Juice Shop local — données automiques; rien sorti en externe.",
        "",
        "## 6. Exécutions à faire devant le prof",
        "- `make detect` — exécute le détecteur, affiche le résumé.",
        "- `make exploit` — PoC traversal, capture URL/HTTP/marqueurs.",
        "- `make report` — génère le PDF et le MD (rapport-p13-zeroday.{pdf,md}).",
        "- `make demo` — fin de l'intégralité",
        "",
        f"Généré par aegis-p13-zeroday-detector (P13) — {PROJECT_ID} — nul GPU, nul prod, éthique stand-alone.",
    ]
    return "\n".join(lines)


def build_pdf(markdown: str, out_path: Path) -> None:
    """Génère un PDF avec reportlab (pro, design basique mais pro, HTML-escape)."""
    from reportlab.lib.pagesizes import LETTER
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

    def esc(t: str) -> str:
        return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(out_path), pagesize=LETTER, topMargin=0.5 * inch, bottomMargin=0.5 * inch, leftMargin=0.75 * inch, rightMargin=0.75 * inch)
    styles = getSampleStyleSheet()
    story = []
    for line in markdown.split("\n"):
        if not line.strip():
            story.append(Spacer(1, 6))
            continue
        if line.startswith("# "):
            story.append(Paragraph(esc(line[2:]), styles["h1"]))
        elif line.startswith("## "):
            story.append(Paragraph(esc(line[3:]), styles["h2"]))
        elif line.startswith("- "):
            story.append(Paragraph(esc("  • " + line[2:]), styles["Normal"]))
        else:
            story.append(Paragraph(esc(line), styles["Normal"]))
    doc.build(story)
    print(f"[OK] PDF généré : {out_path} ({out_path.stat().st_size} octets)")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="generate_report", description="Génère le rapport (PDF+MD) pour P13.")
    ap.add_argument("--scan", type=Path, default=Path("outputs/detect.json"), help="Fichier JSON du détecteur")
    ap.add_argument("--exploit", type=Path, default=Path("outputs/exploitation_evidence.json"), help="Fichier JSON de l'évidence PoC")
    ap.add_argument("--pdf", type=Path, default=Path(PDF_PATH_DEFAULT), help="Chemin du PDF (optionnel)")
    ap.add_argument("--md", type=Path, default=Path(MD_PATH_DEFAULT), help="Chemin du Markdown (optionnel)")
    ap.add_argument("--quiet", action="store_true", help="Mode silencieux")
    args = ap.parse_args(argv)

    scan = _load_json(args.scan)
    exploit = _load_json(args.exploit)
    md = build_markdown(scan, exploit)
    args.md.parent.mkdir(parents=True, exist_ok=True)
    args.md.write_text(md, encoding="utf-8")
    print(f"[OK] MD écrit : {args.md} ({args.md.stat().st_size} octets)")
    if args.pdf:
        build_pdf(md, args.pdf)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
