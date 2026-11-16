import { DatabaseSync } from 'node:sqlite';
import { createHash, randomUUID } from 'node:crypto';

export const RULES = Object.freeze({ minVotes: 10000, nominationVotes: 2501, minDurationMs: 14 * 86400000, groups: 32, perGroup: 8, qualifyPerGroup: 4 });
export function awardPoints(a,b) {
  if (a === b) return [0,0];
  const close = Math.max(a,b) * 100 <= (a+b) * 55;
  return a > b ? (close ? [2,1] : [3,0]) : (close ? [1,2] : [0,3]);
}
export function canClose(m,now=Date.now(),rules=RULES) {
  return m.stage!=='pool' && m.status==='open' && now >= m.openedAt + rules.minDurationMs && m.votesA+m.votesB >= rules.minVotes && m.votesA !== m.votesB;
}
export function snakeGroups(games) {
  if(games.length!==256) throw new Error('Le catalogue doit contenir exactement 256 jeux.');
  return Array.from({length:RULES.groups},(_,i)=>
    Array.from({length:RULES.perGroup},(_,band)=>
      games[band*RULES.groups+(band%2 ? RULES.groups-1-i : i)]));
}
export function seedOrder(n) {
  let order=[1,2];
  while(order.length<n) {const sum=order.length*2+1;order=order.flatMap(x=>[x,sum-x]);}
  return order;
}
export function bracketGraph(qualified) {
  const result=[];
  const ref=(type,id)=>({type,id});
  const add=(id,stage,round,index,a,b)=>result.push({id,stage,round,index,sourceA:a,sourceB:b});
  const size=qualified.length;
  const upperRounds=Math.log2(size);
  if(size<2 || !Number.isInteger(upperRounds)) throw new Error('Le tableau exige une puissance de deux participants.');
  const lowerRounds=2*(upperRounds-1);
  const order=seedOrder(size);
  for(let r=1;r<=upperRounds;r++) for(let i=0;i<size/2**r;i++) {
    add(`W${r}-${i+1}`,'upper',r,i,r===1?ref('game',qualified[order[i*2]-1]):ref('winner',`W${r-1}-${i*2+1}`),r===1?ref('game',qualified[order[i*2+1]-1]):ref('winner',`W${r-1}-${i*2+2}`));
  }
  for(let r=1;r<=lowerRounds;r++) {
    const count=size/2**(Math.floor((r+1)/2)+1);
    for(let i=0;i<count;i++) {
      let a,b;
      if(r===1) {a=ref('loser',`W1-${i*2+1}`);b=ref('loser',`W1-${i*2+2}`);}
      else if(r%2) {a=ref('winner',`L${r-1}-${i*2+1}`);b=ref('winner',`L${r-1}-${i*2+2}`);}
      else {a=ref('winner',`L${r-1}-${i+1}`);b=ref('loser',`W${r/2+1}-${count-i}`);}
      add(`L${r}-${i+1}`,'lower',r,i,a,b);
    }
  }
  add('GF-1','final',1,0,ref('winner',`W${upperRounds}-1`),lowerRounds?ref('winner',`L${lowerRounds}-1`):ref('loser','W1-1'));
  add('GF-2','final',2,0,ref('game',null),ref('game',null));
  return result;
}
export function createTournament({path=':memory:',games,now=()=>Date.now(),rules=RULES,community=false}={}) {
  if(new Set(games.map(g=>g.id)).size!==256) throw new Error('256 identifiants uniques requis.');
  const db=new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;
  CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS matches(id TEXT PRIMARY KEY,stage TEXT NOT NULL,group_id INTEGER,round INTEGER,slot INTEGER,game_a TEXT,game_b TEXT,source_a TEXT,source_b TEXT,status TEXT NOT NULL DEFAULT 'pending',opened_at INTEGER,closed_at INTEGER,votes_a INTEGER NOT NULL DEFAULT 0,votes_b INTEGER NOT NULL DEFAULT 0,winner TEXT,loser TEXT);
  CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,created_at INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS votes(user_id TEXT NOT NULL REFERENCES users(id),match_id TEXT NOT NULL REFERENCES matches(id),game_id TEXT NOT NULL,created_at INTEGER NOT NULL,PRIMARY KEY(user_id,match_id));
  CREATE INDEX IF NOT EXISTS votes_match ON votes(match_id);
  CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires_at INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS login_tokens(token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires_at INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,action TEXT NOT NULL,detail TEXT NOT NULL,created_at INTEGER NOT NULL);`);
  const getMeta=k=>db.prepare('SELECT value FROM meta WHERE key=?').get(k)?.value;
  const setMeta=(k,v)=>db.prepare('INSERT INTO meta VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(k,String(v));
  const tx=fn=>{db.exec('BEGIN IMMEDIATE');try {const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}};
  const audit=(action,detail)=>db.prepare('INSERT INTO audit(action,detail,created_at) VALUES(?,?,?)').run(action,JSON.stringify(detail),now());
  const digest=createHash('sha256').update(JSON.stringify(games.map(g=>[g.id,g.seed,g.score]))).digest('hex');
  if(getMeta('catalogue') && getMeta('catalogue')!==digest) throw new Error('Catalogue différent de celui de cette édition. Utilisez une nouvelle base pour une nouvelle édition.');
  const wildcardCount=6;
  const rankedGames=games.slice(0,256-wildcardCount);
  const titleKey=title=>title.normalize('NFKD').toLowerCase().replace(/\s*\(\d{4}\)\s*$/u,'').replace(/[^\p{L}\p{N}]/gu,'');
  const rankedTitles=new Set(rankedGames.map(game=>titleKey(game.title)));
  db.exec(`CREATE TABLE IF NOT EXISTS nominations(id TEXT PRIMARY KEY,title_key TEXT NOT NULL UNIQUE,title TEXT NOT NULL,platform TEXT NOT NULL,year INTEGER NOT NULL,user_id TEXT NOT NULL REFERENCES users(id));
  CREATE TABLE IF NOT EXISTS nomination_votes(user_id TEXT NOT NULL REFERENCES users(id),nomination_id TEXT NOT NULL REFERENCES nominations(id),PRIMARY KEY(user_id,nomination_id));
  CREATE INDEX IF NOT EXISTS nomination_votes_candidate ON nomination_votes(nomination_id);`);
  const phase=()=>getMeta('phase');
  const wildcards=()=>JSON.parse(getMeta('wildcards')||'[]');
  const selectedGames=()=>{
    if(!getMeta('communityEdition')) return games;
    return [...rankedGames,...wildcards()];
  };
  function currentGroups() {
    const participants=selectedGames();
    while(participants.length<256)participants.push(null);
    return snakeGroups(participants);
  }
  function nominationState(userId) {
    const candidates=db.prepare(`SELECT n.id,n.title,n.platform,n.year,COUNT(v.user_id) votes,
      MAX(CASE WHEN v.user_id=? THEN 1 ELSE 0 END) supported
      FROM nominations n LEFT JOIN nomination_votes v ON v.nomination_id=n.id
      GROUP BY n.id ORDER BY votes DESC,n.rowid ASC`).all(userId??null);
    return {slots:wildcardCount,candidates,selected:wildcards().map(game=>game.id)};
  }
  const fail=(code,status=400)=>{throw Object.assign(new Error(code),{status,code});};
  function requireNominationsOpen(){if(phase()!=='community'||wildcards().length===wildcardCount)fail('nominations_closed',409);}
  function nominate(userId,{title,platform,year}) {
    return tx(()=>{
      requireNominationsOpen();
      title=typeof title==='string'?title.trim():'';
      platform=typeof platform==='string'?platform.trim():'';
      year=Number(year);
      const key=titleKey(title);
      if(!key||title.length>120||!platform||platform.length>60||!Number.isInteger(year)||year<1950||year>new Date(now()).getUTCFullYear())fail('invalid_nomination');
      if(rankedTitles.has(key)||db.prepare('SELECT 1 FROM nominations WHERE title_key=?').get(key))fail('duplicate_nomination',409);
      db.prepare('INSERT INTO nominations VALUES(?,?,?,?,?,?)').run('community-'+randomUUID(),key,title,platform,year,userId);
    });
  }
  function supportNomination(userId,id,support) {
    return tx(()=>{
      requireNominationsOpen();
      if(typeof support!=='boolean')fail('invalid_nomination');
      if(!db.prepare('SELECT 1 FROM nominations WHERE id=?').get(id))fail('nomination_missing',404);
      const selected=wildcards();
      if(selected.some(game=>game.id===id))fail('nomination_selected',409);
      if(!support) {
        db.prepare('DELETE FROM nomination_votes WHERE user_id=? AND nomination_id=?').run(userId,id);
        return;
      }
      if(db.prepare('SELECT 1 FROM nomination_votes WHERE user_id=? AND nomination_id=?').get(userId,id))return;
      if(db.prepare('SELECT COUNT(*) count FROM nomination_votes WHERE user_id=?').get(userId).count>=wildcardCount)fail('nomination_limit',409);
      db.prepare('INSERT INTO nomination_votes VALUES(?,?)').run(userId,id);
      if(lockNominees(id))openAvailablePools();

    });
  }

  function lockNominees(id=null) {
    const selected=wildcards();
    if(selected.length>=wildcardCount)return;
    const ids=new Set(selected.map(game=>game.id));
    const eligible=db.prepare(`SELECT n.id,n.title,n.platform,n.year FROM nominations n
      JOIN nomination_votes v ON v.nomination_id=n.id WHERE (? IS NULL OR n.id=?) GROUP BY n.id HAVING COUNT(*)>=? ORDER BY MAX(v.rowid)`)
      .all(id,id,rules.nominationVotes??RULES.nominationVotes).filter(game=>!ids.has(game.id));
    for(const game of eligible.slice(0,wildcardCount-selected.length)) {
      selected.push({...game,seed:rankedGames.length+selected.length+1,score:null,community:true,coverLocal:'/assets/icon.png'});
      audit('nomination-qualified',{id:game.id});
    }
    if(eligible.length)setMeta('wildcards',JSON.stringify(selected));
    return eligible.length>0;
  }
  if(!getMeta('voters'))setMeta('voters',db.prepare('SELECT COUNT(DISTINCT user_id) n FROM votes').get().n);
  const format=`${RULES.groups}x${RULES.perGroup}:${RULES.qualifyPerGroup}`;
  const hasResults=()=>db.prepare('SELECT 1 FROM votes LIMIT 1').get() ||
    db.prepare("SELECT 1 FROM matches WHERE stage!='pool' OR status='closed' OR votes_a!=0 OR votes_b!=0 LIMIT 1").get();
  function insertPoolMatches(groups,openedAt=null) {
    const upsert=db.prepare(`INSERT INTO matches(id,stage,group_id,round,slot,game_a,game_b,status,opened_at)
      VALUES(?,'pool',?,1,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
      game_a=excluded.game_a,game_b=excluded.game_b,status=excluded.status,opened_at=excluded.opened_at
      WHERE matches.status='pending'`);
    groups.forEach((group,i)=>{
      let slot=0;
      for(let a=0;a<group.length;a++) for(let b=a+1;b<group.length;b++) {
        const gameA=group[a]?.id??null;
        const gameB=group[b]?.id??null;
        const date=gameA&&gameB?openedAt:null;
        upsert.run(`P${String(i+1).padStart(2,'0')}-${++slot}`,i+1,slot,gameA,gameB,date===null?'pending':'open',date);
      }
    });
  }
  function openAvailablePools() {
    const date=now();
    insertPoolMatches(currentGroups(),date);
    if(!getMeta('startedAt'))setMeta('startedAt',date);
    if(wildcards().length===wildcardCount)setMeta('phase','pools');
  }
  if(!getMeta('communityEdition')&&community&&(!phase()||['setup','pools'].includes(phase()))) tx(()=>{
    if(getMeta('communityEdition')||!(!phase()||['setup','pools'].includes(phase()))||hasResults())return;
    db.prepare("DELETE FROM matches WHERE stage='pool'").run();
    db.prepare("DELETE FROM meta WHERE key='startedAt'").run();
    setMeta('catalogue',digest);
    setMeta('phase','community');
    setMeta('poolFormat',format);
    setMeta('communityEdition','1');
    audit('nominations-opened',{slots:wildcardCount});
  });
  if(getMeta('poolFormat')!==format) tx(()=>{
    if(getMeta('poolFormat')===format) return;
    const previousPhase=phase();
    if(previousPhase && (getMeta('poolFormat') || !['setup','pools'].includes(previousPhase) || hasResults())) {
      throw new Error('Cette édition utilise un autre format et possède des résultats. Utilisez une nouvelle base pour le nouveau format.');
    }
    const openedAt=previousPhase==='pools'?now():null;
    if(previousPhase) db.prepare("DELETE FROM matches WHERE stage='pool'").run();
    setMeta('catalogue',digest);
    setMeta('phase',previousPhase||'setup');
    setMeta('poolFormat',format);
    insertPoolMatches(currentGroups(),openedAt);
    if(openedAt!==null) setMeta('startedAt',openedAt);
    if(previousPhase) audit('pool-format-updated',{format});
  });
  if(!getMeta('collectivePoolClose'))tx(()=>{
    if(getMeta('collectivePoolClose'))return;
    if(phase()==='pools')db.prepare("UPDATE matches SET status='open',closed_at=NULL,winner=NULL,loser=NULL WHERE stage='pool' AND status='closed'").run();
    if(phase()==='community')lockNominees();
    setMeta('collectivePoolClose','1');
  });
  if(phase()==='community'&&!getMeta('parallelPools'))tx(()=>{
    if(phase()!=='community'||getMeta('parallelPools'))return;
    openAvailablePools();
    setMeta('parallelPools','1');
  });
  function normalize(m) {if(!m)return null;return {id:m.id,stage:m.stage,groupId:m.group_id,round:m.round,index:m.slot,gameA:m.game_a,gameB:m.game_b,sourceA:m.source_a?JSON.parse(m.source_a):null,sourceB:m.source_b?JSON.parse(m.source_b):null,status:m.status,openedAt:m.opened_at,closedAt:m.closed_at,votesA:m.votes_a,votesB:m.votes_b,winner:m.winner,loser:m.loser};}
  const matches=()=>db.prepare('SELECT * FROM matches ORDER BY rowid').all().map(normalize);
  const match=id=>normalize(db.prepare('SELECT * FROM matches WHERE id=?').get(id));
  const reachedQuota=m=>m.votesA+m.votesB>=rules.minVotes;
  function standings(all=matches()) {
    const byGroup=Map.groupBy(all.filter(m=>m.stage==='pool'),m=>m.groupId);
    return currentGroups().map((group,i)=>{
      const gm=byGroup.get(i+1);
      const closed=gm.filter(m=>m.status==='closed');
      const complete=closed.length===gm.length;
      const counted=gm.filter(m=>m.status==='closed'||(m.status==='open'&&reachedQuota(m)));
      const ready=counted.length===gm.length;
      const rows=group.filter(Boolean).map(g=>({gameId:g.id,seed:g.seed,points:0,played:0,wins:0,totalVotes:0}));
      const byGame=new Map(rows.map(row=>[row.gameId,row]));
      for(const m of counted) {
        const pts=awardPoints(m.votesA,m.votesB);
        [m.gameA,m.gameB].forEach((id,k)=>{
          const row=byGame.get(id);
          row.points+=pts[k];
          row.played++;
          row.wins+=pts[k]>pts[1-k]?1:0;
          row.totalVotes+=k===0?m.votesA:m.votesB;
        });
      }
      rows.sort((a,b)=>b.points-a.points||b.totalVotes-a.totalVotes||a.seed-b.seed);
      return {id:i+1,complete,ready,reached:counted.length,closed:closed.length,rows};
    });
  }
  function start() {
    return tx(()=>{
      const date=now();
      if(phase()!=='setup')fail('tournament_started',409);
      db.prepare("UPDATE matches SET status='open',opened_at=? WHERE stage='pool'").run(date);
      setMeta('phase','pools');setMeta('startedAt',date);audit('start',{date});
      return date;
    });
  }
  const qualifiers=groups=>groups.flatMap(g=>g.rows.slice(0,RULES.qualifyPerGroup)).sort((a,b)=>a.seed-b.seed).map(g=>g.gameId);
  function createBracket() {
    const qualified=qualifiers(standings());
    setMeta('qualified',JSON.stringify(qualified));setMeta('phase','bracket');
    const ins=db.prepare('INSERT INTO matches(id,stage,round,slot,source_a,source_b) VALUES(?,?,?,?,?,?)');
    for(const m of bracketGraph(qualified)) ins.run(m.id,m.stage,m.round,m.index,JSON.stringify(m.sourceA),JSON.stringify(m.sourceB));
    audit('bracket-created',{qualified});
  }
  function advance() {
    if(getMeta('phase')==='pools' && !db.prepare("SELECT 1 FROM matches WHERE stage='pool' AND status!='closed' LIMIT 1").get())createBracket();
    if(getMeta('phase')!=='bracket')return;
    let all=matches();const byId=new Map(all.map(m=>[m.id,m]));
    const resolve=s=>{if(!s)return null;if(s.type==='game')return s.id;const parent=byId.get(s.id);return parent?.status==='closed'?parent[s.type]:null;};
    for(const m of all.filter(m=>m.status==='pending'&&m.id!=='GF-2')) {
      const a=resolve(m.sourceA),b=resolve(m.sourceB);
      if(a&&b){if(a===b)throw new Error('Un jeu ne peut pas affronter lui-même.');db.prepare("UPDATE matches SET game_a=?,game_b=?,status='open',opened_at=? WHERE id=?").run(a,b,now(),m.id);}
    }
    const gf=match('GF-1'),reset=match('GF-2');
    if(gf?.status==='closed') {
      if(gf.winner===gf.gameA){setMeta('champion',gf.winner);setMeta('phase','complete');db.prepare("UPDATE matches SET status='cancelled' WHERE id='GF-2'").run();}
      else if(reset.status==='pending')db.prepare("UPDATE matches SET game_a=?,game_b=?,status='open',opened_at=? WHERE id='GF-2'").run(gf.gameA,gf.gameB,now());
      else if(reset.status==='closed'){setMeta('champion',reset.winner);setMeta('phase','complete');}
    }
  }
  function closeReady(){
    const all=matches();
    const pools=all.filter(m=>m.stage==='pool'&&m.status==='open');
    const date=now();
    const ready=phase()==='pools'&&pools.length&&pools.every(reachedQuota)
      ? pools : all.filter(m=>canClose(m,date,rules));
    const close=db.prepare("UPDATE matches SET status='closed',closed_at=?,winner=?,loser=? WHERE id=? AND status='open'");
    for(const m of ready) {
      const winner=m.votesA===m.votesB?null:m.votesA>m.votesB?m.gameA:m.gameB;
      const loser=winner===null?null:winner===m.gameA?m.gameB:m.gameA;
      close.run(date,winner,loser,m.id);
      if(m.stage!=='pool')audit('match-closed',{id:m.id,winner,votesA:m.votesA,votesB:m.votesB});
    }
    if(ready.length&&ready[0].stage==='pool')audit('pools-closed',{matches:ready.length});
    advance();
    return ready.length;
  }
  const tick=()=>tx(closeReady);
  function vote(userId,matchId,gameId) {return tx(()=>{
    closeReady();const m=match(matchId);
    if(!m || m.status!=='open')throw Object.assign(new Error('Ce duel n’est pas ouvert au vote.'),{status:409});
    if(gameId!==m.gameA&&gameId!==m.gameB)throw Object.assign(new Error('Ce jeu ne participe pas à ce duel.'),{status:400});
    if(db.prepare('SELECT 1 FROM votes WHERE user_id=? AND match_id=?').get(userId,matchId))throw Object.assign(new Error('Ton vote a déjà été enregistré pour ce duel.'),{status:409});
    const firstVote=!db.prepare('SELECT 1 FROM votes WHERE user_id=? LIMIT 1').get(userId);
    db.prepare('INSERT INTO votes VALUES(?,?,?,?)').run(userId,matchId,gameId,now());
    if(firstVote)setMeta('voters',Number(getMeta('voters')||0)+1);
    db.prepare(`UPDATE matches SET ${gameId===m.gameA?'votes_a':'votes_b'}=${gameId===m.gameA?'votes_a':'votes_b'}+1 WHERE id=?`).run(matchId);
    closeReady();return match(matchId);
  });}
  function state(userId) {
    const mine=userId?Object.fromEntries(db.prepare('SELECT match_id,game_id FROM votes WHERE user_id=?').all(userId).map(v=>[v.match_id,v.game_id])):{};
    const all=matches();
    const groups=standings(all);
    const provisional=['community','pools'].includes(phase())?qualifiers(groups.filter(group=>group.ready)):[];
    const preview=Array(RULES.groups*RULES.qualifyPerGroup).fill(null);
    provisional.forEach((id,index)=>preview[index]=id);
    const provisionalMatches=provisional.length?bracketGraph(preview).filter(m=>m.stage==='upper'&&m.round===1)
      .map(m=>({id:m.id,gameA:m.sourceA.id,gameB:m.sourceB.id})):[];
    return {phase:getMeta('phase'),provisional,provisionalMatches,startedAt:Number(getMeta('startedAt'))||null,champion:getMeta('champion')||null,rules:{...RULES,...rules},groups,qualified:JSON.parse(getMeta('qualified')||'[]'),myVotes:mine,
      stats:{votes:all.reduce((n,m)=>n+m.votesA+m.votesB,0),voters:Number(getMeta('voters')||0),closed:all.filter(m=>m.status==='closed').length,open:all.filter(m=>m.status==='open').length},
      matches:all.map(m=>{const total=m.votesA+m.votesB;return {...m,total,quotaReached:reachedQuota(m),...(!mine[m.id]&&m.status!=='closed'?{votesA:null,votesB:null}:{})};})};
  }
  return {db,get games(){return selectedGames();},get groups(){return currentGroups();},rules,matches,match,standings,state,start,tick,vote,nominationState,nominate,supportNomination,getMeta,setMeta,audit,close:()=>db.close()};
}
