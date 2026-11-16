# VIDEO GAMES BATTLE

**256 légendes. Une seule couronne.**

Site complet en français : frontend responsive, API Node.js, base SQLite persistante, connexion par e-mail, poules, votes et double élimination. L’archive ne contient aucun compte, aucun secret et aucun vote prérempli.

## Lancer en local

Prérequis : **Node.js 24 LTS recommandé**, ou Node.js ≥ 22.13.0.

```bash
cd video-games-battle
npm start
```

Ouvrir **http://localhost:3000**. Aucun `npm install` et aucune compilation ne sont nécessaires : le serveur utilise uniquement les modules intégrés à Node.js. Les polices et les 256 jaquettes sont locales.

Sans `.env`, le site démarre en développement. La phase de propositions s’ouvre au démarrage. Une bande explicite distingue ces votes des votes publics. Pour tester, ouvre « Propositions », saisis une adresse au format e-mail, puis utilise le bouton de connexion locale affiché. Aucun message n’est envoyé tant que Resend n’est pas configuré.

On peut également utiliser `demarrer-windows.bat` ou `demarrer-mac.command`, après installation de Node.js.

**Ce site nécessite son serveur.** Double-cliquer sur `public/index.html` ou déposer uniquement `public/` sur un hébergement statique ne fait pas fonctionner les votes.

## Avant les poules

La sélection part des **250 premiers jeux** du catalogue. Les comptes connectés peuvent proposer un jeu absent du classement et soutenir jusqu’à six propositions. Les six premiers jeux à dépasser **2 500 votes** obtiennent une place définitive. Un soutien peut être retiré tant que le jeu ne s’est pas qualifié et que la sélection reste ouverte.

Les 854 duels entre jeux présélectionnés sont ouverts dès le lancement du site en parallèle des propositions. Chaque jeu communautaire ouvre ses sept duels automatiquement. Le sélecteur propose huit langues et mémorise le choix du navigateur. L’accueil permet de voter et donne accès aux 250 jeux. Pour afficher une annonce directe discrète sur chaque page, configure `ADS_JSON` comme dans `.env.example`. La rubrique presse affiche des liens adaptés à la langue. Pour afficher un sponsor confirmé, renseigne `SPONSORS_JSON` dans `.env`, par exemple `{"fr":[{"name":"Nom du sponsor","url":"https://example.com","logo":"/assets/media/nom-du-sponsor.png"}]}`.

## Ce qui est inclus

- 250 fiches de présélection et six fiches communautaires. Les fiches de présélection contiennent titre, plateforme, année de la version retenue, Metascore, nombre de critiques, source officielle, seed, jaquette.
- 32 poules de 8, répartition en serpentin, 896 matchs au total.
- Classement automatique, départages publiés, qualification des quatre premiers de chaque poule.
- Tableau des vainqueurs, repêchage et grande finale avec seconde finale conditionnelle.
- Un vote définitif par compte et par duel, contrôlé en base par une contrainte unique.
- Résultats d’un duel en cours cachés avant le vote, y compris dans la réponse API publique.
- File de duels privilégiant les moins votés, ordre varié à participation égale ; possibilité de passer.
- Favoris locaux, parcours personnel, badges de participation.
- Liens de duels partageables, partage natif sur appareils compatibles, copie de lien et carte supporter PNG.
- Pages de règles, méthode de sélection, confidentialité et sources.
- Administration `/admin`, export JSON des résultats et journal des clôtures.
- Export des données personnelles et suppression de l’e-mail/sessions avec maintien des votes pseudonymisés.
- Image sociale Open Graph, favicon, icône d’écran d’accueil et manifeste. Pas de cache hors ligne des votes.

## Règles implémentées

| Situation | Résultat |
| --- | --- |
| Vainqueur au-dessus de 55 % | 3 points / 0 point |
| Vainqueur au-dessus de 50 % et jusqu’à 55 % inclus | 2 points / 1 point |
| Exactement 50 / 50 en poule à la clôture | Match nul, 0 point chacun |
| Exactement 50 / 50 en phase finale | Prolongation jusqu’au vote départageant |
| 10 000 votes en poule | Cercle orange, vote encore ouvert |
| Tous les duels de poule à 10 000 voix | Clôture simultanée des 896 duels |
| En phase finale : 14 jours, 10 000 votes et une majorité | Clôture automatique |

Les points ne concernent que les poules. En phase finale, toute majorité qualifie le vainqueur une fois les deux seuils atteints. Un jeu est éliminé à sa deuxième défaite. Si le finaliste repêché remporte la grande finale, une nouvelle finale commence avec ses propres 14 jours et 10 000 votes.

La poule 01 réunit les seeds **1, 64, 65, 128, 129, 192, 193 et 256**. Chaque poule reçoit un jeu de chacune des huit tranches de 32 places du classement initial.

En fin de poule, le classement se fait aux points, puis au nombre total de voix reçues par chaque jeu sur ses sept duels. Si les deux totaux sont identiques, le meilleur rang initial l’emporte. Ce classement est provisoire tant que le dernier duel de la phase de poules n’a pas atteint le seuil. Dès que les 28 duels d’une poule atteignent le seuil, ses quatre premiers sont affichés dans le tableau provisoire.

Les matchs d’un même niveau peuvent s’ouvrir dès que leurs deux participants sont connus. La phase finale commence une fois **toutes les poules** terminées. Le serveur vérifie les clôtures toutes les 5 secondes et avant/après chaque vote ; aucun administrateur ne peut contourner les seuils dans l’interface.

### Volume et calendrier

- Poules : 896 × 10 000 = **8 960 000 votes minimum**.
- Phase finale : 254 matchs, ou 255 avec seconde finale.
- Édition entière : **11 500 000 votes minimum**, ou **11 510 000** avec seconde finale.
- Durée théorique minimale : **196 jours après les poules**, ou **210 jours** avec seconde finale, si tous les duels atteignent immédiatement le quota à l’expiration des 14 jours. Aucun délai maximal.

Le volume est celui des bulletins sur l’ensemble des matchs : une même personne peut voter sur plusieurs duels. Les compteurs ne sont jamais gonflés pour rendre le site plus actif.

## Catalogue Metacritic

Instantané documenté du **11 novembre 2026** : 717 fiches individuelles, 40 pages de classement, 2 054 versions examinées. **Ce n’est pas un export officiel exhaustif de toute la base Metacritic.** Les notes et plateformes retenues correspondent aux fiches consultées ; les regroupements sont des décisions éditoriales explicites.

Voir [`docs/README-DONNEES.md`](docs/README-DONNEES.md), `data/catalogue-metadata.json`, `data/deduplication.json` et `data/sources.json`.

- Meilleur Metascore par famille, et non note des utilisateurs.
- Ports, remasters, remakes et éditions enrichies regroupés ; vraies suites séparées.
- Compilations de rééditions et extensions dépendantes exclues.
- Mobile inclus ; pas de seuil supplémentaire de critiques. Certaines versions reposent sur 4 à 6 critiques, indiquées sur leur fiche.
- L’année correspond à la plateforme/version retenue, souvent à sa date de sortie nord-américaine sur Metacritic.
- À score égal : nombre de critiques, date de sortie de la version, titre et plateforme.
- FFVII / Remake / Rebirth sont regroupés selon une interprétation stricte de « pas de remake ». Cette décision est indiquée dans la fiche concernée et dans le journal.

Le catalogue doit être relu et les choix éditoriaux arbitrés **avant** l’ouverture de l’édition. Le serveur mémorise l’empreinte des IDs, seeds et notes ; un catalogue différent refuse de se charger dans la même base. Pour une nouvelle édition, utiliser un nouveau `DATA_DIR` en conservant la base précédente.

## Mise en ligne

Voir le guide pas à pas [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md).

Copier `.env.example` en `.env`, définir `NODE_ENV=production`, puis renseigner :

- `PUBLIC_ORIGIN` : origine HTTPS exacte du site, sans chemin ;
- `APP_SECRET` et `ADMIN_KEY` : deux secrets distincts d’au moins 32 caractères ;
- `RESEND_API_KEY`, `MAIL_FROM` : service de liens de connexion, domaine expéditeur vérifié ;
- `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` : vérification anti-robot, domaine autorisé ;
- `CONTACT_EMAIL` : contact de l’exploitant ;
- `DATA_DIR` : disque persistant dédié à la production.

Le serveur **refuse de démarrer en production** si une configuration de sécurité indispensable manque. Il n’envoie aucun e-mail marketing. Resend et Turnstile doivent être activés et testés sur le domaine de déploiement ; ils n’ont pas été exercés avec de vrais identifiants dans l’archive.

En production, la nouvelle édition est en attente. La lancer depuis `/admin` ou :

```bash
npm run tournament:start
```

Ne pas réutiliser le dossier `runtime/` des essais locaux pour la production : choisir par exemple `DATA_DIR=runtime-production`.

## Administration et sauvegardes

`/admin` utilise la clé `ADMIN_KEY` saisie dans l’interface. Elle reste en mémoire de la page, pas dans le stockage local. Elle est transmise au même serveur par l’en-tête d’autorisation. En ligne, HTTPS est obligatoire.

```bash
npm run tournament:status
npm run backup
```

La sauvegarde utilise l’API SQLite dédiée, afin d’inclure les écritures du journal WAL. Elle est enregistrée dans `DATA_DIR/backups/`. La copier hors du serveur et vérifier régulièrement sa restauration. Pour restaurer : arrêter le serveur, conserver une copie de la base actuelle, puis replacer la sauvegarde comme `tournament.sqlite`, sans ses anciens fichiers `-wal` et `-shm`.

Les opérations de lancement, de clôture et de création du tableau sont journalisées. Il n’y a volontairement pas de bouton « ajouter des votes » ou « désigner le gagnant ».

## Architecture et exploitation

- `src/tournament.mjs` : règles, poules, graphe de double élimination et transitions transactionnelles.
- `src/server.mjs` : HTTP, session, liens e-mail, protection des votes, fichiers statiques.
- `public/app.js` / `style.css` : interface sans framework, responsive.
- `data/` : catalogue et provenance, jamais exposés en tant que dossier public.
- `public/covers/` : jaquettes ; `public/assets/` : polices et identité visuelle.
- `tests/` : tests du domaine et de l’API.

Le code est autonome et sans dépendance npm. SQLite convient à une première installation sur **un serveur avec disque persistant**. Les API sont fonctionnelles, mais cette livraison ne constitue pas un test de charge à plusieurs millions de votes. Avant une campagne virale, mesurer la charge réelle, dimensionner le serveur, placer les actifs statiques derrière un cache/CDN et envisager une base partagée si plusieurs instances sont nécessaires. Ne pas lancer plusieurs conteneurs avec des bases indépendantes.

L’e-mail vérifié, Turnstile, le contrôle d’origine, les jetons à usage unique, les limites de fréquence et les contraintes en base réduisent la fraude. Ils ne garantissent pas qu’une personne ne pourra jamais utiliser plusieurs adresses. L’empreinte d’e-mail du compte est conservée après suppression pour empêcher de revoter en se réinscrivant avec la même adresse ; l’e-mail en clair et les sessions sont supprimés.

Les textes de confidentialité décrivent ce que le logiciel fait. L’exploitant doit compléter ses mentions légales, son contact, sa politique de conservation, et gérer les sauvegardes et les droits des personnes. Après l’édition et la période de conservation annoncée, il lui appartient d’agréger les bulletins et d’effacer les données devenues inutiles.

## Vérifications

```bash
npm run check
npm test
```

11 tests automatisés : seuils, bornes 55 %, égalité exacte, votes uniques, visibilité, identité, clôtures, nouvelle durée par match, graphe, tournoi complet, reset et garde de configuration production. Voir `docs/VERIFICATION.md`.

## Droits et sources techniques

Le code applicatif original est fourni pour ce projet. Les jaquettes et marques restent celles de leurs ayants droit ; leur copie ne transfère aucune licence. Leur provenance figure dans `data/assets.json`. Projet indépendant, sans affiliation à Metacritic.

Polices Inter et Barlow Condensed : licences SIL Open Font License jointes dans `docs/licenses/`. Les dessins d’interface et les icônes SVG du projet sont produits pour cette livraison.

Documentation consultée le 11/11/2026 :

- Node.js, SQLite : https://nodejs.org/api/sqlite.html
- Cloudflare, validation Turnstile côté serveur : https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Resend, envoi de lien de connexion : https://resend.com/docs/api-reference/emails/send-email
