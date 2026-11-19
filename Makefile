P13 — Zéro-day + détection (Juice Shop) — Makefile

.PHONY: help install venv test lint demo detect exploit report generate
.DEFAULT_GOAL := help

help:
	@echo "Cibles:"
	@echo "  make install   — crée le venv et installe les dépendances"
	@echo "  make test      — exécute les tests (unit + detector unit)"
	@echo "  make demo      — detect -> exploit -> report (demo complète)"
	@echo "  make detect    — python -m src.detect (détecteur, exit 2 si missing)"
	@echo "  make exploit   — python -m src.exploit (PoC traversal + évidence)"
	@echo "  make report    — python -m src.report (PDF + MD du rapport)"

V := $(shell if [ -d venv ]; then echo venv/bin/python; else echo python3; fi)

venv:
	python3 -m venv venv
	venv/bin/pip install -r requirements.txt

install: venv

test:
	$(V) -m pytest -q

# --- Supposé actif : détection / PoC / rapport (fonctions clés à démo) ---

detect:
	$(V) -m src.detect --log src/data/sample_access.log --out outputs/detect.json

exploit:
	$(V) -m src.exploit --out outputs/exploitation_evidence.json

report:
	$(V) -m src.report --scan outputs/detect.json --exploit outputs/exploitation_evidence.json --pdf outputs/rapport-p13-zeroday.pdf --md outputs/rapport-p13-zeroday.md

demo: test detect exploit report
