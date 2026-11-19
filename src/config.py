"""Constantes du projet P13 — Zéro-day + détection (aegis-p13-zeroday-detector).

Pro, local uniquement, sans GPU/cloud — toutes les fonctions sont exécutables
facilement par le prof.
"""

DEFAULT_TARGET_URL = "http://127.0.0.1:3000"
PROJECT_ID = "P13"
PROJECT_SLUG = "zeroday-detector"

# Notations de traversal canoniques et encodées courantes
TRAVERSAL_PATTERNS = [
    r"\.\./",
    r"\.\.\\",
    r"%2e%2e%2f",
    r"%2e%2e%2F",
    r"%2e%2e/",
    r"%2e%2e\\",
    r"\.%2e/",
    r"..%2f",
    r"..%5c",
    r"%5c%5c..",
    r"%2f..%2f",
]

# Chemins système sensibles signalés à la détection
SENSITIVE_PATH_PATTERNS = [
    r"etc/passwd",
    r"etc/shadow",
    r"/etc/passwd",
    r"/etc/shadow",
    r"/etc/hosts",
    r"c:\\windows",
    r"c:/windows",
    r"/windows/system32",
    r"/var/log",
    r"bin/sh",
    r"/dev/stdin",
    r"/proc/self/environ",
]

DEFAULT_INPUT_LOG = "src/data/sample_access.log"
