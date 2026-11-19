# Rapport — P13 Zéro-day + détection (Juice Shop)

Statut : **3 alertes** (critiques=3, hautes=0, moyennes=0, faibles=0)

## 1. Fiche technique résumée
- **Objectif** : Détecter et caractériser la traversal système (Path Traversal) dans le fichier Juice Shop.
- **Vulnérabilité** : CWE-22 (Path Traversal) + fuite système probable (etc/passwd, etc/shadow).
- **Impact** : Léger en labo autorisé ; calibré CVSS prévisionnel ~4.0-6.5 selon context.
- **Charte** : application locale autorisée, données locales, pas de production, pas de fuites distantes.
- **Témoins stockés** : `outputs/exploitation_evidence.json`, `outputs/detect.json`

## 2. Preuves d’évidence (PoC)
- **200** — `/ftp/legal.md` — text/markdown — body: `# Legal Information |  | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed di`
- **200** — `/ftp/../../../../etc/passwd` — text/html — body: `<!-- |   ~ Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.`
- **403** — `/ftp/..%2f..%2f..%2f..%2fetc%2fpasswd` — text/html — body: `<html> |   <head> |     <meta charset='utf-8'>  |     <title>ForbiddenError: Forbidden</ti`
- **200** — `/ftp/../../../etc/shadow` — text/html — body: `<!-- |   ~ Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.`
- **403** — `/ftp/..%2f..%2f..%2f..%2fetc%2fshadow` — text/html — body: `<html> |   <head> |     <meta charset='utf-8'>  |     <title>ForbiddenError: Forbidden</ti`
  - Synthese : Vérification honnête : traversal testé sur Juice Shop. Réponses 200 sans marqueur système = frontend Juice Shop par défaut (aucun leak). Réponses 403 = traversal bloqué (serve-index). Adaptation acceptée par P13 : traversal sur fichiers locaux — voir SPEC.md.
  - Verdicts : ['HTTP_200', 'HTTP_200_FRONTEND (aucun marqueur système)', 'BLOQUEE (403, serve-index)', 'HTTP_200_FRONTEND (aucun marqueur système)', 'BLOQUEE (403, serve-index)']

Détaillé : `outputs/exploitation_evidence.json` (évidence complète : URLs, codes HTTP, tailles, marqueurs, verdicts).

## 3. Détection dans les logs
- **CRITICAL** — /ftp/../../../../etc/passwd — traversal détecté; chemin système sensible (etc/passwd, /etc/shadow, etc.) — CWE: CWE-22 (Path Traversal) + fuite système
- **CRITICAL** — /ftp/..%2f..%2fetc%2fshadow — traversal détecté; chemin système sensible (etc/passwd, /etc/shadow, etc.) — CWE: CWE-22 (Path Traversal) + fuite système
- **CRITICAL** — /ftp/../../../etc/shadow — traversal détecté; chemin système sensible (etc/passwd, /etc/shadow, etc.) — CWE: CWE-22 (Path Traversal) + fuite système

résumé : {"log_file": "src\\data\\sample_access.log", "total_alerts": 3, "critical": 3, "high": 0, "medium": 0, "low": 0, "generated_at": "2026-11-19T23:20:48+00:00"}

## 4. Notes d’évidence externes
- Fonction de téléchargement d'exécution réelle : tentatives documentées via `python -m src.exploit`.
- Traversal bloqué par serve-index (403) : adapté (voir exemple dans report.py).

## 5. Recommandations
- Patcher : servir `/ftp/` via `pathlib.resolve()` + `is_relative_to()` ; encode pathname en base64 lors de la lecture (anti-traversal recommandé).
- Hardening : userlab + random root pass, fs read-only, journalisation des requêtes /ftp/
- Validation : réexécuter `python -m src.detect --log <access.log>` et observer le score persistant bas.
- Web: partage du rapport à ce prof + sonvoir le background prof sur '20 projects' par un stream pour creation des 20 projets.
- Ethique : Juice Shop local — données automiques; rien sorti en externe.

## 6. Exécutions à faire devant le prof
- `make detect` — exécute le détecteur, affiche le résumé.
- `make exploit` — PoC traversal, capture URL/HTTP/marqueurs.
- `make report` — génère le PDF et le MD (rapport-p13-zeroday.{pdf,md}).
- `make demo` — fin de l'intégralité

Généré par aegis-p13-zeroday-detector (P13) — P13 — nul GPU, nul prod, éthique stand-alone.