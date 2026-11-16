// French source | Spanish | Portuguese (Portugal) | Japanese | Simplified Chinese | German | Italian
const rows = `
L’arène|Arena|Arena|アリーナ|竞技场|Arena|Arena
Les poules|Grupos|Grupos|グループ|小组赛|Gruppen|Gironi
Le tableau|Cuadro|Quadro|トーナメント表|对阵表|Turnierbaum|Tabellone
Les jeux|Juegos|Jogos|ゲーム一覧|游戏列表|Spiele|Giochi
Propositions|Candidaturas|Propostas|推薦|提名|Vorschläge|Proposte
Moi|Perfil|Perfil|プロフィール|个人主页|Profil|Profilo
Langue|Idioma|Idioma|言語|语言|Sprache|Lingua
Le concept|Cómo funciona|Como funciona|大会について|赛事介绍|So funktioniert’s|Come funziona
Mon parcours|Mi perfil|O meu perfil|マイページ|我的主页|Mein Profil|Il mio profilo
Rejoindre le tournoi|Unirse al torneo|Participar no torneio|大会に参加|参加比赛|Mitmachen|Partecipa al torneo
Règles et méthode|Reglas y metodología|Regras e metodologia|ルールと選考方法|规则与评选方法|Regeln und Auswahl|Regole e selezione
Confidentialité|Privacidad|Privacidade|プライバシー|隐私|Datenschutz|Privacy
À propos|Acerca de|Sobre o torneio|大会概要|关于赛事|Über das Turnier|Informazioni
À lire dans la presse jeux vidéo|Prensa de videojuegos|Imprensa de videojogos|ゲームメディア|游戏媒体|Spielemedien|Stampa videoludica
Sponsors|Patrocinadores|Patrocinadores|スポンサー|赞助商|Sponsoren|Sponsor
Le tournoi des jeux cultes|El torneo de los juegos de culto|O torneio dos jogos de culto|名作ゲームトーナメント|经典游戏锦标赛|Das Turnier der Kultspiele|Il torneo dei giochi cult
Les 250 jeux les mieux notés sont déjà sélectionnés. À toi de choisir les six derniers.|Ya están seleccionados los 250 juegos mejor valorados. Elige los seis restantes.|Os 250 jogos mais bem classificados já estão escolhidos. Escolhe os seis restantes.|評価上位250作品は選出済み。残りの6作品を選ぼう。|评分最高的250款游戏已入选。由你选出最后六款。|Die 250 bestbewerteten Spiele stehen fest. Wähle die letzten sechs.|I 250 giochi con le valutazioni più alte sono già selezionati. Scegli gli ultimi sei.
De toutes les générations et de toutes les consoles, 256 jeux s’affrontent. À chaque duel, vote pour celui que tu préfères.|256 juegos de todas las generaciones y plataformas compiten. Vota por tu favorito en cada duelo.|256 jogos de várias gerações e plataformas competem. Vota no teu favorito em cada duelo.|世代や機種を超えた256作品が対戦。各対戦で好きな作品に投票しよう。|来自各个世代与平台的256款游戏同台竞技。每场选出你最喜欢的一款。|256 Spiele aller Generationen und Plattformen treten an. Stimme in jedem Duell für deinen Favoriten.|256 giochi di ogni generazione e piattaforma si sfidano. Vota il tuo preferito in ogni incontro.
Choisir les six jeux|Elegir los seis juegos|Escolher os seis jogos|残り6作品を選ぶ|选出最后六款游戏|Die letzten sechs wählen|Scegli gli ultimi sei
Lire les règles|Leer las reglas|Ler as regras|ルールを読む|阅读规则|Regeln lesen|Leggi le regole
Voir le duel|Ver el duelo|Ver o duelo|対戦を見る|查看对决|Duell ansehen|Vedi la sfida
Début prévu|Inicio previsto|Início previsto|開催予定|计划开赛|Geplanter Start|Inizio previsto
Aperçu des 250 jeux présélectionnés|Un vistazo a los 250 juegos preseleccionados|Uma amostra dos 250 jogos pré-selecionados|事前選出250作品の一部|250款预选游戏抢先看|Vorschau auf die 250 vorausgewählten Spiele|Anteprima dei 250 giochi preselezionati
Voir les 250 jeux présélectionnés|Ver los 250 juegos preseleccionados|Ver os 250 jogos pré-selecionados|事前選出250作品を見る|查看250款预选游戏|Alle 250 vorausgewählten Spiele ansehen|Vedi i 250 giochi preselezionati
Vérifie la liste avant de proposer un jeu.|Consulta la lista antes de proponer un juego.|Consulta a lista antes de propor um jogo.|推薦する前に一覧を確認しよう。|提名前请先查看列表。|Prüfe die Liste, bevor du ein Spiel vorschlägst.|Controlla l’elenco prima di proporre un gioco.
Sélection Metacritic|Selección Metacritic|Seleção Metacritic|Metacritic選出|Metacritic评选|Metacritic-Auswahl|Selezione Metacritic
Tous les jeux|Todos los juegos|Todos os jogos|すべてのゲーム|全部游戏|Alle Spiele|Tutti i giochi
jeux|juegos|jogos|作品|款游戏|Spiele|giochi
poules|grupos|grupos|グループ|个小组|Gruppen|gironi
qualifiés|clasificados|apurados|進出枠|晋级名额|Qualifizierte|qualificati
champion|campeón|campeão|優勝作品|冠军|Sieger|vincitore
Les duels commenceront après la sélection des six jeux de la communauté.|Los duelos empezarán cuando se elijan los seis juegos de la comunidad.|Os duelos começam após a escolha dos seis jogos da comunidade.|コミュニティ枠の6作品が決定した後に対戦が始まります。|社区选出六款游戏后，对决将开始。|Die Duelle beginnen, sobald die Community ihre sechs Spiele gewählt hat.|Le sfide iniziano dopo la scelta dei sei giochi della community.
Voir les propositions|Ver candidaturas|Ver propostas|推薦を見る|查看提名|Vorschläge ansehen|Vedi le proposte
Les poules seront formées après la sélection des six jeux de la communauté.|Los grupos se formarán cuando se elijan los seis juegos de la comunidad.|Os grupos são definidos após a escolha dos seis jogos da comunidade.|コミュニティ枠の6作品が決定した後にグループ分けを行います。|社区选出六款游戏后将进行分组。|Die Gruppen werden gebildet, sobald die Community ihre sechs Spiele gewählt hat.|I gironi verranno formati dopo la scelta dei sei giochi della community.
Le format du tournoi|Formato del torneo|Formato do torneio|大会形式|比赛形式|Turnierformat|Formato del torneo
Toutes les règles|Todas las reglas|Todas as regras|すべてのルール|全部规则|Alle Regeln|Tutte le regole
Huit jeux par poule. Chaque jeu affronte les sept autres. Les quatre premiers se qualifient.|Ocho juegos por grupo. Cada uno se enfrenta a los otros siete. Pasan los cuatro primeros.|Oito jogos por grupo. Cada um enfrenta os outros sete. Os quatro primeiros apuram-se.|1グループ8作品の総当たり戦。上位4作品が進出します。|每组八款游戏进行循环赛，前四名晋级。|Acht Spiele pro Gruppe, jeder gegen jeden. Die besten vier kommen weiter.|Otto giochi per girone, tutti contro tutti. Passano i primi quattro.
Voir les poules|Ver grupos|Ver grupos|グループを見る|查看分组|Gruppen ansehen|Vedi i gironi
La double élimination|Doble eliminación|Dupla eliminação|ダブルエリミネーション|双败淘汰赛|Doppel-K.-o.|Doppia eliminazione
Les 128 qualifiés ont droit à une seconde chance. La deuxième défaite les élimine.|Los 128 clasificados tienen una segunda oportunidad. Quedan eliminados tras dos derrotas.|Os 128 apurados têm uma segunda oportunidade. A segunda derrota elimina-os.|128作品が進出し、2敗で敗退となります。|128款晋级游戏有两次机会，输两场即淘汰。|Die 128 Qualifizierten scheiden erst nach der zweiten Niederlage aus.|I 128 qualificati hanno una seconda possibilità. La seconda sconfitta li elimina.
Voir le tableau|Ver el cuadro|Ver o quadro|対戦表を見る|查看对阵表|Turnierbaum ansehen|Vedi il tabellone
La grande finale|Gran final|Grande final|グランドファイナル|总决赛|Grand Final|Gran finale
Le vainqueur du tableau principal affronte celui du repêchage.|El ganador del cuadro superior se enfrenta al del cuadro inferior.|O vencedor do quadro superior enfrenta o vencedor do quadro inferior.|勝者側と敗者側の勝者が対戦します。|胜者组冠军对阵败者组冠军。|Die Sieger der oberen und unteren Runde treffen aufeinander.|Il vincitore del tabellone superiore affronta quello del tabellone inferiore.
Mode local · Votes de test|Modo local · Votos de prueba|Modo local · Votos de teste|ローカルモード・テスト投票|本地模式 · 测试投票|Lokaler Modus · Teststimmen|Modalità locale · Voti di prova
Les choix de la communauté|Elección de la comunidad|Escolhas da comunidade|コミュニティ推薦枠|社区推荐|Community-Auswahl|Scelte della community
Les six jeux les plus soutenus rejoindront les 250 jeux présélectionnés. En cas d’égalité, la proposition la plus ancienne passe devant.|Los seis juegos más votados se sumarán a los 250 preseleccionados. En caso de empate, se prioriza la propuesta más antigua.|Os seis jogos mais votados juntam-se aos 250 pré-selecionados. Em caso de empate, tem prioridade a proposta mais antiga.|得票上位6作品が事前選出の250作品に加わります。同票の場合は先に推薦された作品を優先します。|得票最多的六款游戏将加入预选的250款游戏。票数相同时，较早提交的提名优先。|Die sechs Spiele mit den meisten Stimmen ergänzen die 250 vorausgewählten Titel. Bei Gleichstand zählt der frühere Vorschlag.|I sei giochi più votati si aggiungono ai 250 preselezionati. In caso di parità ha la precedenza la proposta più vecchia.
Proposer un jeu|Proponer un juego|Propor um jogo|ゲームを推薦する|提名游戏|Spiel vorschlagen|Proponi un gioco
Titre|Título|Título|タイトル|游戏名称|Titel|Titolo
Plateforme|Plataforma|Plataforma|機種|平台|Plattform|Piattaforma
Année de sortie|Año de lanzamiento|Ano de lançamento|発売年|发行年份|Erscheinungsjahr|Anno di uscita
Ajouter la proposition|Enviar propuesta|Enviar proposta|推薦を送信|提交提名|Vorschlag einreichen|Invia la proposta
Connecte-toi pour proposer un jeu et soutenir jusqu’à six titres.|Inicia sesión para proponer un juego y votar por hasta seis títulos.|Inicia sessão para propor um jogo e votar em até seis títulos.|ログインするとゲームを推薦し、最大6作品に投票できます。|登录后即可提名游戏，并为最多六款游戏投票。|Melde dich an, um Spiele vorzuschlagen und für bis zu sechs Titel zu stimmen.|Accedi per proporre un gioco e votare fino a sei titoli.
Me connecter|Iniciar sesión|Iniciar sessão|ログイン|登录|Anmelden|Accedi
La sélection communautaire est terminée.|La votación de la comunidad ha terminado.|A votação da comunidade terminou.|コミュニティ投票は終了しました。|社区投票已结束。|Die Community-Abstimmung ist beendet.|La votazione della community è terminata.
Les propositions|Candidaturas|Propostas|推薦作品|提名列表|Vorschläge|Proposte
Aucune proposition pour le moment.|Todavía no hay propuestas.|Ainda não há propostas.|まだ推薦はありません。|暂时没有提名。|Es gibt noch keine Vorschläge.|Non ci sono ancora proposte.
Retenu|Seleccionado|Selecionado|選出済み|已入选|Ausgewählt|Selezionato
Soutenir|Votar|Votar|投票する|投票|Abstimmen|Vota
Retirer mon soutien|Retirar mi voto|Retirar o meu voto|投票を取り消す|撤回投票|Stimme zurückziehen|Ritira il voto
soutiens utilisés|votos utilizados|votos utilizados|票を使用|票已使用|Stimmen vergeben|voti usati
votes|votos|votos|票|票|Stimmen|voti
Les 250 premiers jeux sont sélectionnés selon leur Metascore. Six places sont réservées à la communauté.|Los 250 primeros juegos se eligen por su Metascore. Seis plazas se reservan a la comunidad.|Os 250 primeiros jogos são escolhidos pelo Metascore. Seis lugares são reservados à comunidade.|上位250作品はMetascoreで選出。残り6枠はコミュニティ投票で決まります。|前250款游戏按Metascore评分选出，另有六个名额由社区投票决定。|Die ersten 250 Spiele werden nach Metascore ausgewählt. Sechs Plätze sind für die Community reserviert.|I primi 250 giochi sono scelti per Metascore. Sei posti sono riservati alla community.
Un jeu, une plateforme, une année…|Un juego, una plataforma, un año…|Um jogo, uma plataforma, um ano…|ゲーム名・機種・発売年…|游戏、平台或年份…|Spiel, Plattform oder Jahr …|Un gioco, una piattaforma, un anno…
Trier les jeux|Ordenar juegos|Ordenar jogos|並べ替え|游戏排序|Spiele sortieren|Ordina i giochi
Meilleur Metascore|Mayor Metascore|Melhor Metascore|Metascore順|最高Metascore|Höchster Metascore|Metascore più alto
Plus récents|Más recientes|Mais recentes|新しい順|最新发行|Neueste zuerst|Più recenti
Ordre alphabétique|Orden alfabético|Ordem alfabética|タイトル順|按名称排序|Alphabetisch|Ordine alfabetico
Mes favoris|Mis favoritos|Os meus favoritos|お気に入り|我的收藏|Meine Favoriten|I miei preferiti
Voir plus de légendes|Ver más juegos|Ver mais jogos|さらに表示|加载更多游戏|Weitere Spiele anzeigen|Mostra altri giochi
Aucun jeu trouvé. Essaie un autre titre.|No se encontraron juegos. Prueba con otro título.|Não foram encontrados jogos. Experimenta outro título.|ゲームが見つかりません。別のタイトルで検索してください。|未找到游戏，请尝试其他名称。|Keine Spiele gefunden. Suche nach einem anderen Titel.|Nessun gioco trovato. Prova un altro titolo.
La méthode de sélection|Método de selección|Método de seleção|選考方法|评选方法|Auswahlverfahren|Metodo di selezione
Choix de la communauté|Elección de la comunidad|Escolha da comunidade|コミュニティ選出|社区推荐|Community-Auswahl|Scelta della community
Fermer|Cerrar|Fechar|閉じる|关闭|Schließen|Chiudi
Les légendes ont besoin de ta voix.|Inicia sesión para votar|Inicia sessão para votar|ログインして投票|登录后投票|Zum Abstimmen anmelden|Accedi per votare
Ton adresse e-mail|Tu correo electrónico|O teu e-mail|メールアドレス|电子邮箱|Deine E-Mail-Adresse|Il tuo indirizzo e-mail
Recevoir mon lien|Recibir mi enlace|Receber a ligação|ログインリンクを受け取る|获取登录链接|Link anfordern|Ricevi il link
Regarde ta boîte mail.|Revisa tu correo.|Consulta o teu e-mail.|メールを確認してください。|请查看邮箱。|Schau in dein Postfach.|Controlla la tua posta.
Entrer dans l’arène|Iniciar sesión|Iniciar sessão|ログイン|登录|Anmelden|Accedi
Ton accès de test est prêt.|Tu acceso de prueba está listo.|O acesso de teste está pronto.|テストログインの準備ができました。|测试登录已就绪。|Dein Testzugang ist bereit.|L’accesso di prova è pronto.
Quel jeu préfères-tu ?|¿Qué juego prefieres?|Qual é o teu jogo preferido?|どちらのゲームが好きですか？|你更喜欢哪款游戏？|Welches Spiel gefällt dir besser?|Quale gioco preferisci?
Je vote pour ce jeu|Votar por este juego|Votar neste jogo|このゲームに投票|投票给这款游戏|Für dieses Spiel stimmen|Vota questo gioco
Tous les duels|Todos los duelos|Todos os duelos|すべての対戦|全部对决|Alle Duelle|Tutte le sfide
Passer ce duel|Saltar este duelo|Saltar este duelo|この対戦をスキップ|跳过这场对决|Duell überspringen|Salta questa sfida
Duel suivant|Siguiente duelo|Próximo duelo|次の対戦|下一场对决|Nächstes Duell|Prossima sfida
Résultat du duel|Resultado del duelo|Resultado do duelo|対戦結果|对决结果|Duellergebnis|Risultato della sfida
Vainqueurs|Cuadro superior|Quadro superior|勝者側|胜者组|Gewinnerseite|Tabellone superiore
Repêchage|Cuadro inferior|Quadro inferior|敗者側|败者组|Verliererseite|Tabellone inferiore
Grande finale|Gran final|Grande final|グランドファイナル|总决赛|Grand Final|Gran finale
PHASE DE POULES|FASE DE GRUPOS|FASE DE GRUPOS|グループステージ|小组赛|GRUPPENPHASE|FASE A GIRONI
Terminé|Finalizado|Terminado|終了|已结束|Abgeschlossen|Concluso
Voir les résultats|Ver resultados|Ver resultados|結果を見る|查看结果|Ergebnisse ansehen|Vedi i risultati
Jeu|Juego|Jogo|ゲーム|游戏|Spiel|Gioco
Voix|Votos|Votos|得票|票数|Stimmen|Voti
LES RÈGLES DU JEU|REGLAS|REGRAS|ルール|比赛规则|REGELN|REGOLE
Une couronne. Des règles claires.|Reglas del torneo|Regras do torneio|大会ルール|比赛规则|Turnierregeln|Regole del torneo
La sélection vient des critiques. Le verdict appartient aux votants.|La crítica y la comunidad eligen los juegos. Los votantes deciden el ganador.|A crítica e a comunidade escolhem os jogos. Os votantes decidem o vencedor.|批評家とコミュニティが出場作品を選び、投票で優勝作品を決めます。|媒体与社区共同选出参赛游戏，玩家投票决定冠军。|Fachpresse und Community wählen die Spiele. Die Abstimmung entscheidet über den Sieg.|Critica e community scelgono i giochi. I votanti decidono il vincitore.
256 jeux, 32 poules, 128 qualifiés|256 juegos, 32 grupos, 128 clasificados|256 jogos, 32 grupos, 128 apurados|256作品、32グループ、128作品が進出|256款游戏，32个小组，128个晋级名额|256 Spiele, 32 Gruppen, 128 Qualifizierte|256 giochi, 32 gironi, 128 qualificati
Les huit jeux de chaque poule s’affrontent deux à deux, pour un total de 28 duels. Les quatre premiers rejoignent la phase finale. Tous les duels de poule s’ouvrent en même temps.|Los ocho juegos de cada grupo se enfrentan entre sí en 28 duelos. Los cuatro primeros avanzan. Todos los duelos de grupo se abren a la vez.|Os oito jogos de cada grupo enfrentam-se em 28 duelos. Os quatro primeiros avançam. Todos os duelos dos grupos abrem em simultâneo.|各グループ8作品が総当たりで28試合を行い、上位4作品が進出します。グループ戦は一斉に始まります。|每组八款游戏进行28场循环对决，前四名晋级。所有小组赛同时开放。|Acht Spiele treten in 28 Duellen gegeneinander an. Die besten vier kommen weiter. Alle Gruppenduelle beginnen gleichzeitig.|Gli otto giochi di ogni girone si affrontano in 28 sfide. I primi quattro avanzano. Tutte le sfide dei gironi si aprono insieme.
Une fois les 28 duels de la poule terminés, les jeux à égalité de points sont départagés par le nombre total de voix reçues sur leurs sept duels. Si ce total est identique, le meilleur rang initial l’emporte.|Tras los 28 duelos del grupo, los empates a puntos se resuelven por el total de votos de los siete duelos de cada juego. Si persiste el empate, prevalece la mejor posición inicial.|Após os 28 duelos do grupo, os empates em pontos resolvem-se pelo total de votos nos sete duelos de cada jogo. Se o empate persistir, prevalece a melhor posição inicial.|全28試合終了後、勝ち点が同じ場合は各作品の7試合の総得票数で順位を決めます。総得票数も同じ場合は当初のシード順が上の作品を優先します。|小组28场比赛结束后，积分相同的游戏按各自七场比赛的总得票数排名。若总票数仍相同，初始种子排名较高者优先。|Nach allen 28 Gruppenduellen entscheidet bei Punktgleichheit die Summe der Stimmen aus den sieben Duellen eines Spiels. Ist auch diese gleich, zählt die bessere Startplatzierung.|Al termine delle 28 sfide del girone, a parità di punti contano i voti totali nelle sette sfide di ciascun gioco. In caso di ulteriore parità prevale la posizione iniziale migliore.
10 000 voix. Deux semaines. Ensemble.|10 000 votos y dos semanas|10 000 votos e duas semanas|1万票と2週間|一万票与两周|10.000 Stimmen und zwei Wochen|10.000 voti e due settimane
Un duel ne peut se terminer qu’après|Un duelo solo puede cerrarse tras|Um duelo só pode terminar após|対戦の終了には、|对决结束需要满足|Ein Duell kann erst enden nach|Una sfida può concludersi solo dopo
14 jours complets depuis son ouverture ET au moins 10 000 votes valides|14 días completos y al menos 10 000 votos válidos|14 dias completos e pelo menos 10 000 votos válidos|開始から14日間の経過と1万票以上の有効票|开放满14天且至少收到一万张有效选票|14 vollen Tagen und mindestens 10.000 gültigen Stimmen|14 giorni completi e almeno 10.000 voti validi
, avec un score qui départage les jeux. Atteindre un seul seuil ne suffit jamais. Aucun plafond de durée : sans assez de votes, le duel continue.|, con un juego por delante. La votación sigue abierta hasta que se cumplan ambas condiciones.|, com um jogo em vantagem. A votação continua até se cumprirem ambas as condições.|が必要です。同票の場合や条件を満たさない場合は投票を継続します。|，同时必须有一款游戏领先。未达到条件时将继续投票。|, sofern ein Spiel vorne liegt. Bis dahin bleibt die Abstimmung offen.|, con un gioco in vantaggio. La votazione prosegue finché le condizioni sono soddisfatte.
Une voix, un choix, par duel.|Un voto por duelo|Um voto por duelo|1対戦につき1票|每场对决限投一票|Eine Stimme pro Duell|Un voto per sfida
Aller au contenu|Saltar al contenido|Saltar para o conteúdo|本文に移動|跳转至正文|Zum Inhalt springen|Vai al contenuto
Se déconnecter|Cerrar sesión|Terminar sessão|ログアウト|退出登录|Abmelden|Esci
Exporter mes données|Exportar mis datos|Exportar os meus dados|データを出力|导出我的数据|Meine Daten exportieren|Esporta i miei dati
Supprimer mon compte|Eliminar mi cuenta|Apagar a minha conta|アカウントを削除|删除账号|Mein Konto löschen|Elimina il mio account
Aucun duel ouvert pour le moment.|No hay duelos abiertos por ahora.|Ainda não há duelos abertos.|投票中の対戦はありません。|暂无开放的对决。|Zurzeit gibt es keine offenen Duelle.|Non ci sono sfide aperte.
Duel terminé|Duelo finalizado|Duelo terminado|対戦終了|对决已结束|Duell beendet|Sfida conclusa
En attente du lancement|A la espera del inicio|A aguardar o início|開始待ち|等待开始|Wartet auf den Start|In attesa dell’inizio
nominations_closed|La votación de la comunidad ha terminado.|A votação da comunidade terminou.|コミュニティ投票は終了しました。|社区投票已结束。|Die Community-Abstimmung ist beendet.|La votazione della community è terminata.
invalid_nomination|Indica un título, una plataforma y un año válidos.|Indica um título, uma plataforma e um ano válidos.|有効なタイトル、機種、発売年を入力してください。|请输入有效的游戏名称、平台和发行年份。|Gib einen gültigen Titel, eine Plattform und ein Erscheinungsjahr ein.|Inserisci un titolo, una piattaforma e un anno validi.
duplicate_nomination|Este juego ya está en el catálogo o en las propuestas.|Este jogo já está no catálogo ou nas propostas.|このゲームはすでに一覧または推薦に含まれています。|这款游戏已在目录或提名列表中。|Dieses Spiel steht bereits im Katalog oder bei den Vorschlägen.|Questo gioco è già nel catalogo o tra le proposte.
nomination_limit|Puedes votar por hasta seis juegos. Retira un voto para elegir otro título.|Podes votar em até seis jogos. Retira um voto para escolher outro título.|投票は最大6作品までです。別の作品を選ぶには投票を取り消してください。|最多可投六款游戏。请撤回一票后再选择其他游戏。|Du kannst für bis zu sechs Spiele stimmen. Ziehe eine Stimme zurück, um einen anderen Titel zu wählen.|Puoi votare fino a sei giochi. Ritira un voto per scegliere un altro titolo.
Publicité|Publicidad|Publicidade|広告|广告|Anzeige|Pubblicità
PROVISOIRE|PROVISIONAL|PROVISÓRIO|暫定|暂定|VORLÄUFIG|PROVVISORIO
Progression des duels de poule|Progreso de los duelos de grupo|Progresso dos duelos de grupo|グループ戦の進捗|小组赛进度|Fortschritt der Gruppenduelle|Avanzamento delle sfide dei gironi
Seuil atteint|Umbral alcanzado|Meta atingida|目標達成|已达门槛|Ziel erreicht|Soglia raggiunta
Un cercle orange indique un duel à 10 000 votes. Tu peux continuer à voter jusqu’à ce que tous les cercles soient orange.|Un círculo naranja marca un duelo con 10 000 votos. Puedes seguir votando hasta que todos estén en naranja.|Um círculo laranja indica um duelo com 10 000 votos. Podes continuar a votar até todos os círculos ficarem laranja.|オレンジの丸は1万票に達した対戦です。すべての丸がオレンジになるまで投票できます。|橙色圆点表示该场对决已收到一万票。在所有圆点变为橙色之前仍可投票。|Ein orangefarbener Kreis markiert ein Duell mit 10.000 Stimmen. Du kannst weiter abstimmen, bis alle Kreise orange sind.|Un cerchio arancione indica una sfida con 10.000 voti. Puoi votare finché tutti i cerchi non diventano arancioni.
Les six premiers jeux à dépasser 2 500 votes rejoignent les 250 jeux présélectionnés. Une place acquise est définitive.|Los seis primeros juegos que superen los 2 500 votos se suman a los 250 preseleccionados. La plaza es definitiva.|Os seis primeiros jogos a ultrapassar os 2 500 votos juntam-se aos 250 pré-selecionados. A vaga é definitiva.|2,500票を超えた先着6作品が事前選出の250作品に加わります。獲得した出場枠は確定です。|最先超过2500票的六款游戏将加入预选的250款游戏。获得的名额永久有效。|Die ersten sechs Spiele mit mehr als 2.500 Stimmen ergänzen die 250 vorausgewählten Spiele. Ein gesicherter Platz ist endgültig.|I primi sei giochi a superare i 2.500 voti si aggiungono ai 250 preselezionati. Il posto ottenuto è definitivo.
places attribuées|plazas asignadas|lugares atribuídos|枠が確定|个名额已确定|Plätze vergeben|posti assegnati
`;

export const translations = Object.fromEntries(
  ['es', 'pt', 'ja', 'zh', 'de', 'it'].map((locale, index) => [
    locale,
    new Map(rows.trim().split('\n').map(row => {
      const columns = row.split('|');
      return [columns[0], columns[index + 1]];
    }))
  ])
);
