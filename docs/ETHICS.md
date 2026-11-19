# ETHICS — P13 (aegis-p13-zeroday-detector)

Engagements éthiques du projet — **stand-alone, sans GPU, sans prod, sans sortie distante**.

## Cadre

- Tous les tests et démonstrations sont exécutés localement : application Juice Shop locale (127.0.0.1) + logs locaux.
- Aucun point de scan effectué sur des systèmes externes (wordpress.org, ministères, etc.).
- Aucune fuite de données personnelles (PII) potentielle : pas de tests sur vivants.

## Prohibited

- Scan de ports (nmap sur l'infra réelle) — voir AEGIS-RULES.
- Tentative de traversal vers des fichiers sensibles système de l'hôte local ou distants.
- Mise en prod ou déploiement sur des serveurs d'hébergement non-authorisés.
- Modification d'user machines d'autres personnes (sauf contribution documentée si décoré en HackPack).
- Secret de toute sorte (clés, tokens).

## Charte de présentation au prof

- Montrer les fonctions executables claires : `make detect`, `make exploit`, `make report`.
- Expliquer l'adaptation de l'évidence traversal (403 serve-index) avec les verbatim (timestamp, status, body).
- Mettre en avant : un PoC exhaustif, détection réel de logs, fonction pro du rapport, contraintes éthiques.

## Timeline et contributions

- Contribution zone: AUCUN — uniquement le laboratoire local autorisé.

## Notes

Voir SPEC.md pour la sémantique des fonctions — **effets mesurés**, exit codes documentés.
