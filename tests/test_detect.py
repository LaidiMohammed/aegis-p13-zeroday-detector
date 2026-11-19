"""Tests unitaires du détecteur — `make test`.

Pro : chiffres attendus documentés, tests isolés, pas de réseau (unit pur).
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.detect import analyze_text, extract_paths


def test_extract_paths_traversal():
    line = "GET /ftp/../../../../etc/passwd HTTP/1.1 403"
    paths = extract_paths(line)
    assert any("/etc/passwd" in p for p in paths)


def test_extract_paths_normal():
    line = "GET /api/Users HTTP/1.1 200"
    assert extract_paths(line) == ["/api/Users"]


def test_analyze_line_critical():
    alerts = analyze_text("GET /ftp/../../../../etc/passwd HTTP/1.1 403\n")
    assert len(alerts) == 1
    assert alerts[0]["risk"] == "critical"
    assert alerts[0]["cwe"].startswith("CWE-22")


def test_analyze_line_no_traversal():
    assert analyze_text("GET /ftp/legal.md HTTP/1.1 200\n") == []
    assert analyze_text("GET /rest/products/search?q=apple HTTP/1.1 200\n") == []


def test_decode_percent_encoded():
    alerts = analyze_text("GET /ftp/..%2f..%2fetc%2fshadow HTTP/1.1 403\n")
    assert len(alerts) == 1 and alerts[0]["risk"] == "critical"


def test_sample_log_expected():
    sample = Path(__file__).resolve().parent.parent / "src" / "data" / "sample_access.log"
    alerts = analyze_text(sample.read_text(encoding="utf-8"))
    risks = [a["risk"] for a in alerts]
    assert risks.count("critical") == 3
    assert all(a["cwe"].startswith("CWE-22") for a in alerts if a["risk"] == "critical")
