# Vérification de la livraison

Date : 11 novembre 2026.

## Exécuté

- `npm run check` : 256 participants, 256 familles uniques, IDs et seeds uniques, années conformes aux dates, sources Metacritic, 256 jaquettes présentes.
- `npm test` : 11 tests automatisés passent.
- Contrôles de syntaxe JavaScript du serveur et du navigateur.
- Simulations de bout en bout des poules et du double tableau, avec et sans reset. Chaque éliminé cumule exactement deux défaites en phase finale.
- Scénarios 55/45, 55,01/44,99, 50/50 ; minimum de durée ET minimum de votes ; durée propre à chaque duel.
- API sur base temporaire : lien local, nonce de connexion, jeton à usage unique, vote, double vote refusé, choix invalide refusé, origine externe refusée, export et déconnexion.
- Le serveur refuse un démarrage production sans configuration.
- Navigateur : accueil, écran de duel, ouverture du dialogue de connexion, recherche « Metroid », fiche et source, ajout d’un favori, recherche dans les poules, tableaux et finale conditionnelle.
- Les erreurs de console observées venaient d’une extension du navigateur de test, pas du code du site.

## Limites du contrôle

- Le contrôle visuel dans le navigateur a été effectué sur écran de bureau. Les règles CSS mobile sont incluses, mais aucun appareil iOS/Android réel n’a été testé.
- L’envoi d’un véritable e-mail Resend et la validation Turnstile en production n’ont pas été exercés faute de configuration du domaine et d’identifiants de service.
- Aucun test de charge à grande échelle, audit de sécurité externe ou audit de conformité juridique n’a été effectué.
- L’archive ne contient pas la base de développement ni ses utilisateurs ; elle démarre sur une base vierge.
