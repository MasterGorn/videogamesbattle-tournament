import {languages} from './media.js?v=1';
import {translations} from './translations.js?v=2';
export {languages, media, plannedStart} from './media.js?v=1';

let locale = localStorage.getItem('vgb-language');
if (!Object.hasOwn(languages, locale)) {
  locale = navigator.languages.map(value => value.split('-')[0]).find(value => Object.hasOwn(languages, value)) || 'en';
}
export const language = () => locale;
export function setLanguage(value) {
  if (!Object.hasOwn(languages, value)) return;
  locale = value;
  localStorage.setItem('vgb-language', value);
}
document.documentElement.lang = locale;

const english = new Map();
const french = new Map();
const entries = `
Début prévu|Planned start
Aperçu des 250 jeux présélectionnés|A preview of the 250 preselected games
Voir les 250 jeux présélectionnés|See all 250 preselected games
Vérifie la liste avant de proposer un jeu.|Check the list before nominating a game.
Sélection Metacritic|Metacritic selection
Tous les jeux|All games
Progression des duels de poule|Group match progress
Seuil atteint|Target reached
Quand les votes se terminent|When voting closes
Le vote dans le tableau s’ouvre après la clôture de toutes les poules.|Bracket voting opens after all groups close.
En route vers 10 000 votes|Working towards 10,000 votes
Un cercle orange indique un duel à 10 000 votes. Tu peux continuer à voter jusqu’à ce que tous les cercles soient orange.|An orange circle marks a match with 10,000 votes. You can keep voting until all circles are orange.
Tous les duels de poule ont atteint le seuil. Les résultats sont définitifs.|Every group match reached the target. The results are final.
Clôture commune à toutes les poules|All groups close together
Match nul|Draw
PROVISOIRE|PROVISIONAL
Dès que tous les duels d’une poule atteignent 10 000 votes, ses quatre premiers apparaissent ici. Les jeux et leur placement restent provisoires jusqu’à la clôture de toutes les poules. Les votes continuent entre-temps.|A group's top four appear here once all its matches reach 10,000 votes. The qualifiers and their slots can change while voting continues, until all groups close together.
Les six premiers jeux à dépasser 2 500 votes rejoignent les 250 jeux présélectionnés. Une place acquise est définitive.|The first six games to pass 2,500 votes join the 250 preselected games. A secured place is final.
places attribuées|places secured
nomination_selected|This game has already secured a place.
Publicité|Advertisement
Lancer les poules avec les 256 jeux ?|Start the groups with all 256 games?
En poule, un duel à égalité à la clôture donne zéro point aux deux jeux. En phase finale, un 50/50 prolonge le vote.|A group draw gives zero points to both games. An exact tie in the bracket keeps voting open.
En poule, chaque duel atteint son seuil à 10 000 votes. Tous restent ouverts jusqu’à ce que le dernier duel atteigne ce seuil. Les résultats sont alors figés ensemble, sans durée minimale. En phase finale, chaque duel exige toujours 14 jours, 10 000 votes et une majorité.|Every group match has a 10,000-vote target. All matches stay open until the last one reaches it, then close together without a minimum duration. Bracket matches still need 14 days, 10,000 votes and a majority.
Les quatre premiers d’une poule apparaissent dans le tableau provisoire dès que ses 28 duels ont atteint le seuil. De nouveaux votes peuvent encore changer les qualifiés et leur placement jusqu’à la clôture commune.|Each group's top four appear in the provisional bracket when all 28 matches reach the target. Further votes can change who qualifies and where they are seeded until all groups close.
Après les poules, la phase finale dure au moins 196 jours, ou 210 jours avec seconde finale, si chaque duel atteint son quota dès le quatorzième jour.|After groups, the bracket takes at least 196 days, or 210 with a reset final, if each match reaches its target by day 14.
Place communautaire|Community slot
Vote dès maintenant pour les 250 jeux présélectionnés et aide à choisir les six derniers.|Vote now for the 250 preselected games and help choose the final six.
Ce duel s’ouvrira quand le jeu communautaire aura obtenu sa place.|This match opens when the community game secures its place.
tournament_started|The tournament has already started.
L’arène|Arena
Les poules|Groups
Le tableau|Bracket
Les jeux|Games
Les 256 jeux|All 256 games
Propositions|Nominations
Moi|Profile
Langue|Language
Le concept|How it works
Mon parcours|My profile
Rejoindre le tournoi|Join the tournament
Navigation principale|Main navigation
Navigation mobile|Mobile navigation
Video Games Battle, accueil|Video Games Battle, home
Aller au contenu|Skip to content
Règles et méthode|Rules and methodology
Confidentialité|Privacy
À propos|About
À lire dans la presse jeux vidéo|Gaming press
Visuels et marques : leurs ayants droit respectifs.|Artwork and trademarks belong to their respective owners.
Le tournoi des jeux cultes|The classic games tournament
Le tournoi des|The tournament of
jeux cultes|classic games
Les 250 jeux les mieux notés sont déjà sélectionnés. À toi de choisir les six derniers.|The 250 highest-rated games are already in. You choose the final six.
De toutes les générations et de toutes les consoles, 256 jeux s’affrontent. À chaque duel, vote pour celui que tu préfères.|256 games from across generations and platforms compete. Vote for your favourite in each match.
Choisir les six jeux|Choose the final six
Lire les règles|Read the rules
Voir le duel|See the match
jeux|games
poules|groups
qualifiés|qualifiers
champion|champion
Les duels commenceront après la sélection des six jeux de la communauté.|Matches begin after the community picks its six games.
Voir les propositions|See nominations
Les poules seront formées après la sélection des six jeux de la communauté.|Groups will be drawn after the community picks its six games.
Le format du tournoi|Tournament format
Toutes les règles|Full rules
Huit jeux par poule. Chaque jeu affronte les sept autres. Les quatre premiers se qualifient.|Eight games per group. Each faces the other seven. The top four advance.
Voir les poules|See groups
La double élimination|Double elimination
Les 128 qualifiés ont droit à une seconde chance. La deuxième défaite les élimine.|The 128 qualifiers get a second chance. A second loss eliminates them.
Voir le tableau|See bracket
La grande finale|Grand final
Le vainqueur du tableau principal affronte celui du repêchage.|The upper bracket winner faces the lower bracket winner.
Mode local · Votes de test|Local mode · Test votes
LES RÉSULTATS|RESULTS
À TOI DE JOUER|VOTE NOW
LE TOURNOI|TOURNAMENT
Quel jeu préfères-tu ?|Which game do you prefer?
Résultat du duel|Match result
Tous les duels|All matches
Mes favoris|My favourites
Défier un ami|Challenge a friend
Je vote pour ce jeu|Vote for this game
Ouverture prochaine|Opening soon
Duel suivant|Next match
Passer ce duel|Skip this match
Les deux seuils sont obligatoires|Both requirements must be met
Un vote unique, enregistré pour ce duel.|Your vote has been recorded for this match.
Résultats révélés après ton vote. Choisis librement.|Results are revealed after you vote.
Victoire nette :|Clear win:
· Duel serré :|· Close match:
Deux défaites pour être éliminé. Aucun point en phase finale.|Two losses to be eliminated. The bracket uses wins only.
Duel terminé|Match complete
En attente du lancement|Waiting to start
Égalité · prolongation|Tie · voting continues
Durée minimale atteinte|Minimum duration reached
TON CHOIX|YOUR PICK
VICTOIRE|WIN
DUEL TERMINÉ|MATCH COMPLETE
Version retenue|Selected version
Tu défends|You voted for
. Tes amis aussi ?|. What about your friends?
Lancer le débat|Share the match
Ma carte supporter|My fan card
Aucun duel ouvert pour tes favoris. Suis des jeux dans le catalogue ou reviens à tous les duels.|None of your favourites have an open match. Follow more games or return to all matches.
Champion de la première édition.|Winner of the first edition.
PHASE DE POULES|GROUP STAGE
Trouver un jeu ou une poule…|Find a game or group…
Répartition des jeux|How seeding works
En cas d’égalité de points en fin de poule, le total des voix sur les sept duels départage les jeux.|When group points are tied, votes across all seven matches break the tie.
Terminée|Complete
Terminé|Complete
Jeu|Game
Duels joués|Matches played
Points|Points
Voix|Votes
Voir les résultats|See results
Aucune poule pour cette recherche.|No groups match your search.
PHASE 02 · DOUBLE ÉLIMINATION|STAGE 02 · DOUBLE ELIMINATION
Vainqueurs|Upper bracket
Repêchage|Lower bracket
Grande finale|Grand final
FINALE VAINQUEURS|UPPER BRACKET FINAL
FINALE REPÊCHAGE|LOWER BRACKET FINAL
LA GRANDE FINALE|GRAND FINAL
FINALE DÉCISIVE|RESET FINAL
Si le finaliste repêché gagne|If the lower bracket finalist wins
14 jours + 10 000 votes / duel|14 days + 10,000 votes per match
Tableau à faire défiler horizontalement|Scroll horizontally to explore the bracket
● VOTE OUVERT|● VOTING OPEN
TERMINÉ|COMPLETE
NON NÉCESSAIRE|NOT NEEDED
À VENIR|UPCOMING
Champion des vainqueurs|Upper bracket winner
Champion du repêchage|Lower bracket winner
Qualifié de poule|Group qualifier
À déterminer|To be decided
Les points 3/0 et 2/1 concernent les poules. En phase finale, toute majorité fait avancer le vainqueur. Une égalité exacte prolonge le duel.|The 3/0 and 2/1 points apply to groups. In the bracket, any majority advances. An exact tie keeps the match open.
Les participants apparaîtront après qualification.|Games will appear once they qualify.
Les 250 premiers jeux sont sélectionnés selon leur Metascore. Six places sont réservées à la communauté.|The top 250 games are selected by Metascore. Six spots go to community picks.
Un jeu, une plateforme, une année…|A game, platform or year…
Trier les jeux|Sort games
Meilleur Metascore|Highest Metascore
Plus récents|Newest first
Ordre alphabétique|Alphabetical order
La méthode de sélection|Selection methodology
Voir plus de légendes|Load more games
Aucun jeu trouvé. Essaie un autre titre.|No games found. Try another title.
Communauté|Community
Choix de la communauté|Community pick
La plateforme et l’année correspondent à la version retenue pour ce tournoi.|The platform and year refer to the version selected for this tournament.
Consulter Metacritic|Visit Metacritic
Ses duels ouverts|Open matches
Aucun duel ouvert pour le moment.|No open matches yet.
Les choix de la communauté|Community picks
Les six jeux les plus soutenus rejoindront les 250 jeux présélectionnés. En cas d’égalité, la proposition la plus ancienne passe devant.|The six games with the most votes will join the 250 preselected titles. Ties go to the earlier nomination.
Proposer un jeu|Nominate a game
Titre|Title
Plateforme|Platform
Année de sortie|Release year
Ajouter la proposition|Submit nomination
Connecte-toi pour proposer un jeu et soutenir jusqu’à six titres.|Sign in to nominate a game and vote for up to six titles.
Me connecter|Sign in
La sélection communautaire est terminée.|Community voting has ended.
Les propositions|Nominations
Aucune proposition pour le moment.|No nominations yet.
Retenu|Selected
Soutenir|Vote for this game
Retirer mon soutien|Withdraw my vote
nominations_closed|Community voting has ended.
invalid_nomination|Enter a valid game title, platform and release year.
duplicate_nomination|This game is already in the catalogue or the nominations.
nomination_missing|This nomination no longer exists.
nomination_limit|You can vote for up to six games. Withdraw a vote to pick another game.
nominations_need_six|Six games must pass 2,500 votes before the groups can start.
LES RÈGLES DU JEU|RULES
Une couronne. Des règles claires.|Tournament rules
La sélection vient des critiques. Le verdict appartient aux votants.|Critics and players select the games. Players decide the winner.
01 · Le format|01 · Format
02 · Les points|02 · Points
03 · La clôture|03 · Match closure
04 · La double élimination|04 · Double elimination
05 · La sélection|05 · Game selection
06 · L’équité|06 · Fair play
01 · LE FORMAT|01 · FORMAT
02 · LES POINTS|02 · POINTS
03 · LA CLÔTURE|03 · MATCH CLOSURE
04 · LA DOUBLE ÉLIMINATION|04 · DOUBLE ELIMINATION
05 · LA SÉLECTION|05 · GAME SELECTION
06 · L’ÉQUITÉ|06 · FAIR PLAY
256 jeux, 32 poules, 128 qualifiés|256 games, 32 groups, 128 qualifiers
Les huit jeux de chaque poule s’affrontent deux à deux, pour un total de 28 duels. Les quatre premiers rejoignent la phase finale. Les duels entre jeux présélectionnés s’ouvrent immédiatement. Chaque jeu communautaire ouvre ses sept duels dès qu’il obtient sa place.|Each game faces the other seven in its group, for 28 matches per group. The top four advance. Preselected games can be voted on immediately. Each community pick opens its seven matches as soon as it qualifies.
Le placement en serpentin répartit les têtes de série. Chaque poule reçoit un jeu de chacune des huit tranches de 32 places du classement initial.|Snake seeding gives each group one game from each of the eight bands of 32 in the initial ranking.
896 duels de poule × 10 000 votes =|896 group matches × 10,000 votes =
8 960 000 votes minimum|at least 8,960,000 votes
avant la phase finale. Un joueur peut voter sur tous les duels, une fois par duel.|before the bracket. Each player can vote once per match.
Chaque victoire compte. Sa marge aussi.|Points depend on the winning margin
Victoire nette|Clear win
Duel serré|Close match
Le vainqueur obtient strictement plus de 55 % des votes.|The winner receives more than 55% of the votes.
Le vainqueur obtient plus de 50 % et au maximum 55 %. La borne 55 % est incluse.|The winner receives more than 50% and up to 55% of the votes.
À exactement 50/50, aucun vainqueur n’est désigné : le duel reste ouvert jusqu’au vote qui départage les jeux, si les seuils de durée et de participation sont déjà atteints.|An exact 50–50 tie keeps the match open. Once both thresholds are met, the next vote breaks the tie.
Une fois les 28 duels de la poule terminés, les jeux à égalité de points sont départagés par le nombre total de voix reçues sur leurs sept duels. Si ce total est identique, le meilleur rang initial l’emporte.|Once all 28 group matches are complete, ties on points are broken by total votes across each game's seven matches. If totals also tie, the higher initial seed advances.
10 000 voix. Deux semaines. Ensemble.|10,000 votes and two weeks
Un duel ne peut se terminer qu’après|A match can only close after
14 jours complets depuis son ouverture ET au moins 10 000 votes valides|14 full days and at least 10,000 valid votes
, avec un score qui départage les jeux. Atteindre un seul seuil ne suffit jamais. Aucun plafond de durée : sans assez de votes, le duel continue.|, with one game ahead. Voting continues until both thresholds are met.
La clôture est automatique côté serveur. Le score est figé ; les points et le tableau sont mis à jour. Chaque nouveau duel de phase finale reçoit sa propre date d’ouverture et ses propres seuils.|Matches close automatically. Scores are finalised and standings update. Each new bracket match gets its own opening time and thresholds.
Tomber une fois. Revenir plus fort.|How double elimination works
Les 128 qualifiés sont classés selon leur seed initial. Le tableau des vainqueurs suit le placement standard 1 contre 128, 2 contre 127, etc., réparti pour séparer les meilleures têtes de série.|The 128 qualifiers are ordered by their original seed. The upper bracket pairs 1 against 128, 2 against 127 and so on, with the highest seeds spread across the bracket.
Une première défaite envoie dans le tableau de repêchage. Une seconde élimine le jeu. En phase finale, les points disparaissent : une majorité, même 50,01 %, suffit pour gagner une fois les deux seuils atteints.|The first loss sends a game to the lower bracket. The second eliminates it. In the bracket, any majority wins once both thresholds are met.
La grande finale oppose les gagnants des deux tableaux. Si le finaliste repêché gagne, il inflige la première défaite à l’autre finaliste :|The bracket winners meet in the grand final. If the lower bracket finalist wins, the other finalist takes its first loss and
une seconde finale décisive est alors organisée|a reset final is played
, avec à nouveau 14 jours et 10 000 votes minimum.|, with a fresh 14-day and 10,000-vote minimum.
254 duels de phase finale, ou 255 avec seconde finale. Total minimum de l’édition :|254 bracket matches, or 255 with a reset final. Minimum tournament total:
11,50 millions de votes|11.50 million votes
(11,51 millions avec seconde finale).|(11.51 million with a reset final).
La durée totale théorique minimale est de 210 jours, ou 224 jours avec seconde finale, si chaque duel réunit assez de votes dès son quatorzième jour. Elle augmente si les votes arrivent plus lentement.|The minimum duration is 210 days, or 224 with a reset final, if each match has enough votes by day 14. Voting can take longer.
Un jeu, une place.|How games are selected
Les 250 jeux présélectionnés viennent du catalogue de Metacritic. Les six autres sont choisis sur la page|The 250 preselected games come from Metacritic. The other six are chosen on the
avant le lancement du tournoi. Le Metascore est la note agrégée des critiques, pas la note des utilisateurs. Pour chaque famille de jeu, la version et la plateforme au Metascore le plus élevé sont retenues. L’année affichée correspond à cette version.|page before the tournament. The Metascore aggregates critic reviews. Each game is represented by the version and platform with the highest Metascore, and the displayed year refers to that version.
Ports, remasters, remakes et éditions enrichies sont regroupés. Les vraies suites restent distinctes. Les compilations multi-jeux et les extensions dépendantes sont exclues pour éviter de compter plusieurs fois les mêmes jeux. Les plateformes mobiles sont incluses.|Ports, remasters, remakes and expanded editions are grouped. Sequels are separate. Compilations and expansions requiring the base game are excluded. Mobile platforms are included.
Les scores identiques sont départagés par le nombre de critiques de la version, puis par la date de sortie de la version, le titre et la plateforme. Certaines versions reposent sur seulement quatre à six critiques ; ce nombre est indiqué sur leur fiche. Ces choix éditoriaux sont détaillés dans le fichier de méthode et le journal de dédoublonnage de l’archive. Chaque fiche possède un lien vers sa source Metacritic. Cet instantané documenté provient de 717 fiches individuelles et de 40 pages de classement ; il ne constitue pas un export officiel exhaustif de la base Metacritic.|Tied scores are ordered by review count, release date, title and platform. Some versions have only four to six reviews. The game page shows the count and links to Metacritic. The methodology and deduplication log document this snapshot of 717 game pages and 40 ranking pages.
Les notes sélectionnent les participants : elles n’accordent aucun point pendant le tournoi. Le vainqueur sera celui de|Review scores select games and do not earn tournament points. The winner is chosen by
cette communauté et de cette édition|this community for this edition
, sans prétendre à une mesure objective du meilleur jeu universel.|.
Une voix, un choix, par duel.|One vote per match
En ligne, l’accès au vote se fait par lien envoyé à une adresse e-mail. Un compte ne peut voter qu’une fois pour un même duel, et son vote est définitif. Les résultats d’un duel en cours sont masqués tant que tu n’as pas voté. Tu peux passer un duel si tu ne connais pas suffisamment les jeux.|Sign in with an email link. Each account has one final vote per match. Results are hidden until you vote. You can skip matches when you don't know the games well enough.
Vérification anti-robot, limitations de fréquence et contrôles serveur protègent le vote. Ils limitent les abus sans garantir qu’une personne ne puisse jamais utiliser plusieurs adresses e-mail. Aucun système ne peut l’affirmer ici.|Bot checks, rate limits and server checks reduce abuse. Someone may still use more than one email address.
Les favoris restent sur ton appareil. Les préférences de suivi n’ajoutent aucun vote. Les règles et le catalogue sont figés une fois l’édition lancée.|Favourites are saved on this device and do not count as votes. The rules and catalogue are frozen when the tournament begins.
MON PARCOURS|MY PROFILE
Chaque voix laisse une trace.|Your votes and favourites
Tes votes, tes favoris et les jeux que tu défends.|See the games you follow and the matches you voted in.
Gardien des légendes|Keeper of Legends
Voix de l’arène|Voice of the Arena
Challenger|Challenger
Nouvelle recrue|Newcomer
duels votés|matches voted in
jeux suivis|games followed
ton badge de participation|your participation badge
Se déconnecter|Sign out
Exporter mes données|Export my data
Supprimer mon compte|Delete my account
Connecte-toi pour retrouver tes votes sur tes appareils.|Sign in to see your votes on all your devices.
Mes jeux favoris|My favourite games
Le cœur sur chaque jeu te permet de le suivre.|Use the heart button to follow a game.
Découvrir les 256 jeux →|Explore the games →
Mes derniers votes|My recent votes
Ton premier choix t’attend dans l’arène.|Your first vote will appear here.
PILOTAGE DU TOURNOI|TOURNAMENT ADMIN
Les coulisses de l’arène.|Manage the tournament
Lancer l’édition, vérifier les clôtures et exporter les résultats.|Start the tournament, check match closures and export results.
Clé administrateur|Admin key
Ouvrir le pilotage|Open admin panel
Fermer|Close
BIENVENUE DANS L’ARÈNE|WELCOME
Les légendes ont besoin de ta voix.|Sign in to vote
Un lien de connexion, aucun mot de passe. Une voix par duel, sur tous tes appareils.|Sign in with an email link. You get one vote per match across all your devices.
Ton adresse e-mail|Your email address
toi@exemple.fr|you@example.com
Recevoir mon lien|Send my link
Aucun abonnement. Aucun message publicitaire.|No subscriptions or marketing emails.
Mode développement : le lien sera affiché ici, aucun e-mail ne sera envoyé sans configuration.|Local mode: the sign-in link appears here unless email sending is configured.
CONNEXION LOCALE|LOCAL SIGN-IN
Ton accès de test est prêt.|Your test sign-in is ready.
Aucun e-mail n’a été envoyé. Ce raccourci existe uniquement en développement.|No email was sent. This shortcut is available in local mode.
Entrer dans l’arène|Sign in
Regarde ta boîte mail.|Check your inbox.
Un lien t’attend. Ouvre-le dans ce navigateur sous 15 minutes. Pense à vérifier les courriers indésirables.|Open the link in this browser within 15 minutes. Check your spam folder if needed.
J’ai compris|Got it
Un dernier contrôle.|One more check
Pour que chaque duel reste équitable.|Help keep voting fair.
Confirmer mon vote|Confirm my vote
C’est enregistré. Ta voix fait partie de l’histoire.|Your vote has been recorded.
Bienvenue dans l’arène !|You are signed in.
Tu es déconnecté.|You are signed out.
Ajouté à tes favoris.|Added to your favourites.
Retiré de tes favoris.|Removed from your favourites.
Suivre ce jeu|Follow this game
Ma carte|My fan card
Voir la fiche Metacritic|See the Metacritic page
Ne plus suivre|Unfollow
Lien copié. À toi de lancer le débat !|Link copied.
Invite tes amis.|Invite your friends
Lien à partager|Share link
Copie ce lien pour partager le duel.|Copy this link to share the match.
L’arène est momentanément indisponible.|The tournament is temporarily unavailable.
Réessayer|Try again
Le serveur ne répond pas.|The server is not responding.
Une erreur est survenue. Réessaie dans quelques instants.|Something went wrong. Try again shortly.
Connecte-toi pour voter.|Sign in to vote.
Ce duel n’est pas ouvert au vote.|Voting is closed for this match.
Ton vote a déjà été enregistré pour ce duel.|You have already voted in this match.
Entre une adresse e-mail valide.|Enter a valid email address.
Un peu trop de requêtes. Réessaie dans quelques instants.|Too many requests. Try again shortly.
Lien expiré ou ouvert dans un autre navigateur. Demande un nouveau lien ici.|The link expired or was opened in another browser. Request a new link here.
La vérification anti-robot ne se charge pas. Réessaie.|The bot check failed to load. Try again.
Vérification indisponible.|Verification is unavailable.
Clore les propositions et lancer le tournoi avec les 256 jeux ?|Close nominations and start the tournament with all 256 games?
Lancer l’édition|Start the tournament
Vérifier les clôtures|Check match closures
Exporter les résultats|Export results
Derniers événements|Recent activity
Phase :|Stage:
votes ·|votes ·
matchs clôturés ·|closed matches ·
ouverts|open
LE FACE-À-FACE|MATCH
Le choix t’appartient.|Pick your favourite
Les légendes se rencontrent. À toi de les départager.|Vote for the game you prefer.
Le débat devient un tournoi.|About the tournament
Une édition, 256 jeux, une communauté. Une invitation à redécouvrir les œuvres qui ont marqué le jeu vidéo et à en discuter ensemble.|Rediscover 256 influential video games and discuss them with other players.
Projet indépendant, sans affiliation à Metacritic ni aux éditeurs. Metacritic est la source des notes de sélection. Les marques et jaquettes appartiennent à leurs ayants droit.|An independent project. Metacritic supplies the selection scores. Trademarks and covers belong to their respective owners.
Découvrir les règles|Read the rules
Ta voix. Tes données.|Privacy and your data
Ton adresse e-mail sert à te connecter et à empêcher plusieurs votes du même compte sur un duel. Elle n’est jamais affichée publiquement.|We use your email address for sign-in and to enforce one vote per account per match. Your address is never public.
Le site conserve tes votes et une session de connexion pendant 30 jours. Les adresses IP utilisées pour limiter les abus sont hachées avec un secret serveur et ne sont pas stockées en clair. Les compteurs temporaires expirent au plus tard après une heure.|The site keeps your votes and a 30-day sign-in session. IP addresses used to reduce abuse are hashed with a server secret. Temporary counters expire within an hour.
Les favoris sont enregistrés uniquement dans ton navigateur. En production, Resend traite l’envoi du lien et Cloudflare Turnstile la vérification anti-robot. Aucun outil publicitaire ou de mesure d’audience n’est installé.|Favourites are stored in your browser. In production, Resend sends sign-in links and Cloudflare Turnstile handles bot checks. The site uses no advertising or analytics tools.
Depuis « Mon parcours », tu peux exporter tes données et supprimer ton compte. L’e-mail et les sessions sont supprimés ; les votes sont conservés sous un identifiant pseudonyme dérivé de ton e-mail avec un secret serveur, afin de préserver les résultats et d’éviter un nouveau vote après réinscription. Leurs détails sont conservés pendant l’édition et 12 mois après, puis doivent être agrégés par l’exploitant.|From your profile you can export your data and delete your account. This removes your email and sessions. Votes remain under a pseudonymous identifier to preserve results and prevent repeat votes after re-registration. Vote details are kept through the edition and for 12 months afterwards, then the operator should aggregate them.
Contact :|Contact:
Avant la mise en ligne, l’exploitant doit renseigner son contact et ses mentions légales.|The operator must provide contact and legal information before launch.
Supprimer ton compte ?|Delete your account?
Ton adresse e-mail et tes sessions seront supprimées. Tes votes seront conservés sous un identifiant pseudonyme pour maintenir les résultats du tournoi.|Your email address and sessions will be removed. Votes are kept under a pseudonymous identifier to preserve tournament results.
Compte supprimé et votes pseudonymisés.|Account deleted and votes pseudonymised.
`;
for (const entry of entries.trim().split('\n')) {
  const [source, target] = entry.split('|');
  english.set(source, target);
}
for (const [code, message] of Object.entries({
  tournament_started: 'Le tournoi est déjà lancé.',
  nomination_selected: 'Ce jeu a déjà obtenu sa place.',
  nominations_closed: 'La sélection communautaire est terminée.',
  invalid_nomination: 'Renseigne un titre, une plateforme et une année valides.',
  duplicate_nomination: 'Ce jeu figure déjà dans le catalogue ou parmi les propositions.',
  nomination_missing: 'Cette proposition est introuvable.',
  nomination_limit: 'Tu peux soutenir jusqu’à six jeux. Retire un soutien pour choisir un autre titre.',
  nominations_need_six: 'Six jeux doivent dépasser 2 500 votes avant le lancement des poules.'
})) french.set(code, message);

const patterns = [
  [/^([\d /]+) poules au seuil$/, '$1 groups at target'],
  [/^([\d /]+) qualifiés provisoires$/, '$1 provisional qualifiers'],
  [/^([\d /]+) au seuil$/, '$1 at target'],
  [/^Provisoire · /, 'Provisional · '],
  [/^(\d+) jeux par poule\. Les (\d+) premiers passent en phase finale\.$/, '$1 games per group. The top $2 advance.'],
  [/^(\d+) qualifiés\. Un jeu est éliminé après sa deuxième défaite\.$/, '$1 qualifiers. A game is eliminated after its second loss.'],
  [/^([\d /]+) poules terminées$/, '$1 groups complete'],
  [/^([\d /]+) qualifiés$/, '$1 qualifiers'],
  [/^([\d /]+) duels$/, '$1 matches'],
  [/^Voir les (\d+) duels$/, 'See all $1 matches'],
  [/^(\d+) duels, (\d+) places en phase finale\.$/, '$1 matches, $2 places in the bracket.'],
  [/^([\d /]+) soutiens utilisés$/, '$1 votes used'],
  [/^Poule (\d+)$/, 'Group $1'],
  [/^POULE (\d+)$/, 'GROUP $1'],
  [/^\/ DUEL (\d+) SUR (\d+)$/, '/ MATCH $1 OF $2'],
  [/^TOUR (\d+)$/, 'ROUND $1'],
  [/^TABLEAU DES VAINQUEURS/, 'UPPER BRACKET'],
  [/^TABLEAU DE REPÊCHAGE/, 'LOWER BRACKET'],
  [/^GRANDE FINALE ·/, 'GRAND FINAL ·'],
  [/^Les? tableau se remplira automatiquement lorsque les (\d+) poules seront terminées\. Les seeds sont conservés entre les qualifiés\.$/, 'The bracket fills once all $1 groups are complete. Qualifiers keep their original seeds.'],
  [/^(\d+) j minimum restants$/, 'At least $1 days left'],
  [/^Mes favoris \((\d+)\)$/, 'My favourites ($1)'],
  [/^(\d+) jeux · Données vérifiées le 11 novembre 2026$/, '$1 games · Ratings verified 11 November 2026'],
  [/^Connecté :/, 'Signed in:'],
  [/^Jaquette de /, 'Cover of '],
  [/^Voir (?=.+)/, 'View '],
  [/^Suivre /, 'Follow '],
  [/ · POULE (\d+)$/, ' · GROUP $1'],
  [/^Qualifié · /, 'Qualified · '],
  [/^METASCORE · (\d+) CRITIQUES$/, 'METASCORE · $1 REVIEWS']
];

export function tr(text) {
  const key = text.trim();
  const value = locale === 'fr' ? french.get(key) : translations[locale]?.get(key) ?? english.get(key);
  if (value !== undefined) return text.replace(key, () => value);
  if (locale !== 'fr') {
    const count = key.match(/^([\d.,\s/]+) (votes|soutiens utilisés)$/u);
    const translatedUnit = count && translations[locale]?.get(count[2]);
    if (translatedUnit) return text.replace(key, () => count[1]+' '+translatedUnit);
    for (const [pattern, replacement] of patterns) {
      if (pattern.test(key)) return text.replace(key, () => key.replace(pattern, replacement));
    }
  }
  return text;
}

// Rendered templates keep game titles, platform names and other catalogue data intact.
export function localize(root) {
  document.documentElement.lang = locale;
  if (locale === 'fr') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement.closest('[data-untranslated], svg, code')) node.data = tr(node.data);
  }
  for (const element of root.querySelectorAll('[aria-label], [placeholder], [title], [alt]')) {
    for (const attribute of ['aria-label', 'placeholder', 'title', 'alt']) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, tr(element.getAttribute(attribute)));
    }
  }
}
