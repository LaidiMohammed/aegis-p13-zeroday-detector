"""Tests du générateur de rapports — `make test` (pro : fichiers produits vérifiés)."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.report import build_markdown, build_pdf

BASE = Path(__file__).resolve().parent.parent


def test_build_markdown_sections():
    scan = {"summary": {"total_alerts": 2, "critical": 1, "high": 1, "medium": 0, "low": 0},
            "alerts": [{"risk": "critical", "path": "/ftp/../../../etc/passwd",
                        "reason": "traversal détecté", "cwe": "CWE-22..."}]}
    exploit = {"verdicts": ["BLOQUEE (403, serve-index)", "HTTP_200 (aucun marqueur système)"],
               "summary": {"total": 2}}
    md = build_markdown(scan, exploit)
    assert "Rapport — P13" in md
    assert "## 2. Preuves d’évidence" in md
    assert "BLOQUEE" in md
    assert "## 5. Recommandations" in md


def test_build_pdf_creates_file():
    out = BASE / "outputs" / "test-report.pdf"
    build_pdf("# Titre test\n## Section\n- item 1\n", out)
    assert out.exists() and out.stat().st_size > 100


def test_report_main_cli(tmp_path):
    from src.report import main
    scan = tmp_path / "detect.json"
    scan.write_text('{"summary": {"total_alerts": 0}, "alerts": []}', encoding="utf-8")
    expl = tmp_path / "exploit.json"
    expl.write_text('{"verdicts": [], "summary": {"total": 0}}', encoding="utf-8")
    pdf = tmp_path / "r.pdf"
    md = tmp_path / "r.md"
    rc = main(["--scan", str(scan), "--exploit", str(expl), "--pdf", str(pdf), "--md", str(md)])
    assert rc == 0
    assert md.exists() and pdf.exists()
