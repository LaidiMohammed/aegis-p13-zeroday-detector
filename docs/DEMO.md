# DEMO — P13 (aegis-p13-zeroday-detector)

Expected outputs of the demo (for presentation, honnête — valeurs réelles).

## Step 1: `make detect` — détection du sample_access.log

Expected output (attendu : 3 alertes, toutes critical CWE-22) :

```
[SUMMARY] total=3 critical=3 high=0 medium=0
  - [critical] L  4 /ftp/../../../../etc/passwd    # traversal détecté; chemin système sensible
  - [critical] L  6 /ftp/..%2f..%2fetc%2fshadow    # traversal détecté; chemin système sensible
  - [critical] L  8 /ftp/../../../etc/shadow       # traversal détecté; chemin système sensible
[OK] écriture : outputs/detect.json (3 alertes)
```

## Step 2: `make exploit` — PoC traversal sur Juice Shop

Expected output (réel — Juice Shop renvoie le frontend 200 pour traversal, blocage 403 pour les encodés) :

```
[SUMMARY] {'total': 5, 'http_200_frontend': 2, 'blocked_403': 2, 'executed_traversal': False}
  - 200 HTTP_200_FRONTEND (aucun marqueur système)  /ftp/legal.md
  - 200 HTTP_200_FRONTEND (aucun marqueur système)  /ftp/../../../../etc/passwd
  - 403 BLOQUEE (403, serve-index)                    /ftp/..%2f..%2f..%2f..%2fetc%2fpasswd
  - 200 HTTP_200_FRONTEND (aucun marqueur système)  /ftp/../../../etc/shadow
  - 403 BLOQUEE (403, serve-index)                    /ftp/..%2f..%2f..%2f..%2fetc%2fshadow
[NOTE] traversal bloqué (403) par Juice Shop — adaptation documentée dans exploit.py.
```

Sorties** → test (13 pass) → détection (`detect.json`) → PoC (`exploitation_evidence.json`) → rapports (`rapport-p13-zeroday.md/pdf`).

## Step 3: `make report` — sorties honnêtes

MD contient : statut (3 alertes), évidence (200 frontend + 403), détection dans logs, synthèse de vérification, recommandations, notes éthiques, fonctions à exécuter devant le prof.
PDF : même contenu en format délimité pro (reportlab).

## Validation finale

- Le PDF contient : statut, fiche technique résumée, évidence complète, synthèse honnête, recommandations, exécutions à faire devant le prof.
- Tout est commité sur GitHub → `aegis-p13-zeroday-detector`.
- Lien Vercel du projet (devant le prof) : `https://aegis-p13-zeroday-detector.vercel.app`.
