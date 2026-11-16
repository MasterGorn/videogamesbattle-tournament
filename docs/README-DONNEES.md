# Catalogue des 256 jeux — instantané du 11 novembre 2026

Auteur des notes, des plateformes et des dates : **Metacritic**. Consultation le **11/11/2026**. Sélection et regroupements : règles éditoriales de Video Games Battle.

## Ce qui est livré

- `games.json` : exactement 256 jeux, une famille éditoriale par participant, seeds 1 à 256.
- `games.csv` : le même catalogue dans un format facile à relire.
- `sources.json` : liens des pages consultées et des 256 fiches retenues.
- `source-facts.json` : faits extraits sans les textes de critiques ni les descriptions éditoriales.
- `deduplication.json` : familles, versions fusionnées et exclusions motivées.
- `catalogue-metadata.json` : méthode, périmètre et limites lisibles par une machine.
- `assets.json` : provenance de chacune des 256 jaquettes locales.
- `covers/` : 256 images WebP locales, jusqu’à 480 px de large ; les proportions d’origine sont conservées.

## Collecte

Le classement [Best Games of All Time](https://www.metacritic.com/browse/game/) a été consulté sur ses dix premières pages, soit 500 titres. Les classements de **24 plateformes** ont également été parcourus, jusqu’à obtenir une dernière page dont la dernière note est inférieure à 90. Au total, **30 pages de plateformes** et **717 fiches individuelles** ont été contrôlées. Les métadonnées structurées des pages publiques ont été extraites ; les notes n’ont pas été reconstituées de mémoire.

Une fiche individuelle donne parfois une meilleure note sur une autre plateforme que la version mise en avant dans le classement global. Ainsi, Tony Hawk’s Pro Skater 2 est évalué à 98 sur PlayStation, même si le classement global met en avant sa version PC à 91. Les scores par plateforme des fiches individuelles priment sur le résumé du classement.

## Sélection des versions et des seeds

1. Regrouper portages, remasters, remakes et éditions enrichies d’un même jeu.
2. Conserver la version ayant le meilleur **Metascore presse**. La note des utilisateurs n’est pas utilisée.
3. À Metascore égal, privilégier la version qui a le plus de critiques ; puis la date de sortie la plus ancienne, le titre et la plateforme.
4. Appliquer exactement ce même ordre aux participants pour attribuer les seeds.
5. Garder les 256 premières familles après les exclusions.

Le dernier participant a **91/100**, avec **79 critiques**, selon ce départage. Ce n’est pas un tirage aléatoire parmi les jeux ayant la même note.

Aucun seuil supplémentaire de nombre de critiques n’a été ajouté : la consigne « meilleure note » est appliquée littéralement. Des versions notées à partir de quatre ou cinq critiques peuvent donc passer devant un original beaucoup plus évalué. `reviewCount` rend ce choix explicite.

## Année et plateforme

`year` et `releaseDate` sont celles de **la version effectivement retenue**. Un port iOS de 2012 peut ainsi représenter un jeu initialement sorti sur PC en 2011. Une année d’origine non vérifiée n’a pas été inventée. Les dates proviennent de Metacritic et correspondent fréquemment à la sortie nord-américaine.

## Regroupements et exclusions éditoriales

- Les vraies suites restent séparées : par exemple God of War (2005) et God of War (2018).
- Les remakes et éditions enrichies restent dans la même famille : Resident Evil 4 de 2005/2023, Persona 5/Royal, Disco Elysium/Final Cut, etc.
- **Final Fantasy VII** : application stricte de la consigne « pas de remake » ; le jeu original et le projet Remake/Rebirth forment une seule famille. Rebirth est retenu à note égale grâce à son nombre de critiques. Cette décision éditoriale est visible dans `selectionNote` et peut être modifiée avant le gel du tournoi.
- Les compilations de jeux préexistants sont exclues : The Orange Box, Portal Companion Collection, GTA Double Pack, Metroid Prime Trilogy, etc. A Link to the Past / Four Swords est également exclu car sa note évalue un ensemble de deux jeux.
- Les extensions dépendantes, les épisodes isolés et les logiciels créatifs sont exclus : Shadow of the Erdtree, Blood and Wine, Endwalker, Flipnote Studio, etc.
- Les éditions complètes jouables seules, les jeux conçus comme un ensemble original et les jeux mobiles restent admissibles.

## Limites de l’instantané

Ce catalogue représente la sélection reproductible issue des pages consultées. **Il ne constitue pas un export officiel exhaustif de toutes les versions contenues dans Metacritic.** Une plateforme notée sur très peu de critiques peut ne pas apparaître dans les classements, et les notes peuvent changer après la consultation. Les décisions de regroupement sont des règles du tournoi, pas des catégories garanties par Metacritic. Le gel du catalogue évite qu’une variation ultérieure de note ne change un tournoi en cours.

Projet indépendant, sans affiliation ni validation de Metacritic. Les jaquettes appartiennent aux éditeurs et ayants droit des jeux. `assets.json` conserve leurs URL de provenance ; leur présence dans cette archive n’accorde pas de licence sur ces visuels ou marques. Aucun texte de critique n’est reproduit.
