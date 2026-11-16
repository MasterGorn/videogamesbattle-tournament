# Déployer Video Games Battle

## 1. Hébergement

Utiliser un serveur Node.js 24 avec disque persistant, ou Docker. Une simple offre d’hébergement statique n’est pas suffisante. Ne jamais placer la base dans un répertoire public. L’archive n’est pas une publication : elle doit être installée sur le domaine choisi.

## 2. Configuration

Créer `.env` à partir de `.env.example` et compléter :

```dotenv
NODE_ENV=production
PORT=3000
PUBLIC_ORIGIN=https://votre-domaine.fr
DATA_DIR=runtime-production
APP_SECRET=UN_SECRET_ALEATOIRE_LONG
ADMIN_KEY=UN_AUTRE_SECRET_ALEATOIRE_LONG
RESEND_API_KEY=VOTRE_CLE_RESEND
MAIL_FROM=Video Games Battle <vote@votre-domaine.fr>
TURNSTILE_SITE_KEY=VOTRE_CLE_PUBLIQUE
TURNSTILE_SECRET_KEY=VOTRE_CLE_SECRETE
CONTACT_EMAIL=contact@votre-domaine.fr
TRUST_PROXY=0
```

Ces valeurs sont des exemples à remplacer. Générer chaque secret séparément :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Conserver `APP_SECRET` pendant toute l’édition : il lie une adresse à son identifiant pseudonyme, y compris après une suppression/réinscription. Le changer peut créer de nouvelles identités pour des adresses déjà utilisées. Conserver les secrets dans le gestionnaire de configuration de l’hébergeur et hors du dépôt Git.

Configurer un expéditeur vérifié chez Resend et un widget Turnstile autorisé sur le domaine. Les actions du widget sont `login` et `vote`, contrôlées par le serveur. Le serveur refuse un jeton dont l’hôte ou l’action ne correspond pas.

## 3. HTTPS et proxy

Terminer TLS devant l’application avec le reverse proxy choisi. Faire suivre les requêtes vers `127.0.0.1:3000`, limiter les corps de requête et ne pas exposer le port Node directement sur Internet. `PUBLIC_ORIGIN` doit correspondre exactement au schéma et à l’hôte utilisés par les visiteurs.

`TRUST_PROXY=1` n’est approprié que derrière un proxy maîtrisé qui remplace l’en-tête `X-Forwarded-For`. Sans proxy, le laisser à 0. Ne jamais faire confiance à un en-tête fourni directement par un visiteur.

Avec Docker :

```bash
docker compose up -d --build
```

Le fichier compose publie le port seulement sur la boucle locale et persiste `/app/runtime` dans un volume nommé. Ajouter le reverse proxy HTTPS séparément. Pour l’administration CLI dans le conteneur, les variables de production sont déjà présentes :

```bash
docker compose exec vgb node scripts/admin.mjs status
docker compose exec vgb node scripts/admin.mjs start
docker compose exec vgb node scripts/admin.mjs backup
```

Sans Docker : utiliser le gestionnaire de processus du serveur pour redémarrer Node en cas de panne, et lancer `npm start` avec les variables d’environnement renseignées.

## 4. Vérifier avant ouverture

1. Les 256 titres, les regroupements éditoriaux et les règles conviennent à l’édition.
2. Les essais locaux utilisent une autre base. La nouvelle base de production ne contient aucun vote.
3. La page n’affiche plus la bande « aperçu local ».
4. Le lien e-mail arrive réellement et se connecte dans le navigateur où il a été demandé.
5. Le contrôle anti-robot fonctionne sur le domaine ; un second vote du même compte est refusé.
6. Le contact, l’identité de l’exploitant et ses mentions sont renseignés.
7. Une sauvegarde restaurable est conservée hors du serveur.

Lancer ensuite l’édition dans `/admin` ou avec `npm run tournament:start`. Tous les duels de poules s’ouvrent à cet instant. Le catalogue et les règles doivent rester figés.

## 5. Fonctionnement continu

Le processus Node doit tourner en permanence. Les dates sont enregistrées en millisecondes UTC ; les seuils reposent sur le temps écoulé, pas sur le fuseau du visiteur. Au redémarrage, la vérification automatique reprend. Ne pas accélérer les dates en production pour simuler la phase finale.

L’édition nécessite au moins 5,10 millions de bulletins. Tester l’infrastructure à la charge attendue avant de mobiliser une audience importante. Il n’y a pas de garantie de disponibilité ou de capacité chiffrée dans cette livraison.

## 6. Mettre à jour le catalogue

Le fichier `data/games.json` peut être édité **avant** une nouvelle édition. Lancer `npm run check`, documenter les modifications et employer un nouveau `DATA_DIR` pour reconstruire poules et seeds. Ne pas écraser la base d’une édition en cours. Les fiches et captures de faits de la sélection livrée se trouvent dans `data/`.
