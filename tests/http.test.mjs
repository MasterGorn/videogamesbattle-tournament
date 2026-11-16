import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('API : connexion locale, nonce, vote unique, confidentialité, refus et export',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vgb-http-'));let output='';
 const child=spawn(process.execPath,['src/server.mjs'],{cwd:root,env:{...process.env,NODE_ENV:'development',HOST:'127.0.0.1',PORT:'4279',DATA_DIR:dir,RESEND_API_KEY:'',TURNSTILE_SECRET_KEY:'',TURNSTILE_SITE_KEY:'',ADMIN_KEY:'test-admin'},stdio:['ignore','pipe','pipe']});child.stdout.on('data',c=>output+=c);child.stderr.on('data',c=>output+=c);
 try{
  await new Promise((resolve,reject)=>{let n=0;const t=setInterval(()=>{if(output.includes('http://localhost:')){clearInterval(t);resolve();}else if(n++>100){clearInterval(t);reject(new Error(output));}},30);});
  const base='http://127.0.0.1:4279';let cookie='';
  const req=async(url,body,extra={})=>{const r=await fetch(base+url,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...extra},...(body===undefined?{}:{body:JSON.stringify(body)})});return {r,data:await r.json()};};
  const initial=(await req('/api/state')).data;
  assert.equal(initial.phase,'community');
  assert.equal(initial.games.length,250);
  assert.equal(initial.matches.length,896);
  assert.equal(initial.matches.filter(m=>m.status==='open').length,854);
  assert.equal(initial.matches.filter(m=>m.status==='pending').length,42);
  const firstMatch=initial.matches.find(m=>m.status==='open');
  const waitingMatch=initial.matches.find(m=>m.status==='pending');
  assert.equal((await req('/api/nominations',{title:'A game'})).r.status,401);
  const auth=await req('/api/auth/request',{email:'test-vgb@example.invalid'});assert.equal(auth.r.status,200);assert.ok(auth.data.developmentToken);
  assert.equal((await req('/api/auth/verify',{token:auth.data.developmentToken})).r.status,400);
  cookie=auth.r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
  const verified=await req('/api/auth/verify',{token:auth.data.developmentToken});assert.equal(verified.r.status,200);cookie=verified.r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
  assert.equal((await req('/api/auth/verify',{token:auth.data.developmentToken})).r.status,400);
  const earlyVote=await req('/api/vote',{matchId:firstMatch.id,gameId:firstMatch.gameA});
  assert.equal(earlyVote.r.status,200);
  assert.equal((await req('/api/vote',{matchId:waitingMatch.id,gameId:waitingMatch.gameA})).r.status,409);
  const headers={Authorization:'Bearer test-admin'};
  assert.equal((await req('/api/admin/start',{},headers)).data.code,'tournament_started');
  const entry=title=>({title,platform:'PC',year:2001});
  assert.equal((await req('/api/nominations',entry(initial.games[0].title))).data.code,'duplicate_nomination');
  for(let i=1;i<=7;i++) assert.equal((await req('/api/nominations',entry('Community fixture '+i))).r.status,200);
  assert.equal((await req('/api/nominations',entry('community fixture 1'))).data.code,'duplicate_nomination');
  const candidates=(await req('/api/state')).data.nominations.candidates;
  const support=(id,value=true)=>req('/api/nominations/support',{id,support:value});
  for(const {id} of candidates.slice(0,6)) assert.equal((await support(id)).r.status,200);
  assert.equal((await support(candidates[0].id)).r.status,200);
  assert.equal((await support(candidates[6].id)).data.code,'nomination_limit');
  assert.equal((await support(candidates[5].id,false)).r.status,200);
  assert.equal((await support(candidates[6].id)).r.status,200);
  // Seed the other voters, then cross the real production threshold through the HTTP endpoint.
  const db=new DatabaseSync(path.join(dir,'tournament.sqlite'));
  const user=db.prepare('INSERT INTO users VALUES(?,?,0)');
  const insert=db.prepare('INSERT INTO nomination_votes VALUES(?,?)');
  const winners=[...candidates.slice(0,5),candidates[6]];
  db.exec('BEGIN');
  for(let i=0;i<2500;i++){
    const id='fixture-'+i;
    user.run(id,id+'@example.invalid');
    for(const game of winners) if(i<2499||game.id===winners[0].id) insert.run(id,game.id);
  }
  db.exec('COMMIT');
  assert.deepEqual((await req('/api/state')).data.nominations.selected,[]);
  // Trigger first qualification using a previously uncounted user on the next candidate.
  const triggerUser=db.prepare('SELECT id FROM users WHERE email=?').get('test-vgb@example.invalid').id;
  db.prepare('DELETE FROM nomination_votes WHERE user_id=? AND nomination_id=?').run(triggerUser,winners[0].id);
  assert.equal((await req('/api/state')).data.nominations.candidates.find(g=>g.id===winners[0].id).votes,2500);
  assert.deepEqual((await support(winners[0].id)).data.nominations.selected,[winners[0].id]);
  assert.equal((await support(winners[0].id,false)).data.code,'nomination_selected');
  const partial=(await req('/api/state')).data;
  assert.equal(partial.phase,'community');
  assert.equal(partial.matches.filter(m=>m.status==='open').length,861);
  assert.equal(partial.matches.filter(m=>[m.gameA,m.gameB].includes(winners[0].id)&&m.status==='open').length,7);
  for(const game of winners.slice(1)){
    insert.run('fixture-2499',game.id);
    db.prepare('DELETE FROM nomination_votes WHERE user_id=? AND nomination_id=?').run(triggerUser,game.id);
    assert.equal((await support(game.id)).r.status,200);
  }
  db.close();
  const before=(await req('/api/state')).data;
  assert.equal(before.phase,'pools');
  assert.equal(before.games.length,256);
  assert.equal(before.myVotes[firstMatch.id],firstMatch.gameA);
  assert.equal(before.matches.find(m=>m.id===firstMatch.id).openedAt,firstMatch.openedAt);
  assert.equal(before.matches.length,896);
  assert.deepEqual(before.games.slice(250).map(game=>game.id),[...candidates.slice(0,5),candidates[6]].map(game=>game.id));
  assert.equal((await support(candidates[0].id,false)).data.code,'nominations_closed');
  const m=before.matches.find(m=>m.id!==firstMatch.id);
  assert.equal(m.votesA,null);
  const vote=await req('/api/vote',{matchId:m.id,gameId:m.gameA});assert.equal(vote.r.status,200);assert.equal(vote.data.myVotes[m.id],m.gameA);assert.equal(vote.data.matches.find(match=>match.id===m.id).votesA,1);assert.equal(vote.data.stats.voters,1);
  assert.equal((await req('/api/vote',{matchId:m.id,gameId:m.gameB})).r.status,409);
  assert.equal((await req('/api/vote',{matchId:before.matches[1].id,gameId:'fake'})).r.status,400);
  assert.equal((await req('/api/vote',{matchId:m.id,gameId:m.gameA},{'sec-fetch-site':'cross-site'})).r.status,403);
  assert.equal((await req('/api/account/export')).data.votes.length,2);
  const html=await fetch(base+'/duel/'+m.id);assert.ok((await html.text()).includes(before.games.find(game=>game.id===m.gameB).title));assert.equal((await fetch(base+'/.env')).status,404);assert.equal((await fetch(base+'/data/games.json')).status,404);
  await req('/api/account/delete',{});assert.equal((await req('/api/state')).data.user,null);
  const reauth=await req('/api/auth/request',{email:'test-vgb@example.invalid'});cookie=reauth.r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');const reverification=await req('/api/auth/verify',{token:reauth.data.developmentToken});cookie=reverification.r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');assert.equal((await req('/api/vote',{matchId:m.id,gameId:m.gameB})).r.status,409);
  await req('/api/auth/logout',{});assert.equal((await req('/api/state')).data.user,null);assert.equal((await req('/api/state')).data.matches[0].votesA,null);
 }finally{await new Promise(r=>{child.once('exit',r);child.kill('SIGTERM');});await rm(dir,{recursive:true,force:true});}
});
test('production : refus de démarrage sans configuration explicite',async()=>{const child=spawn(process.execPath,['src/server.mjs'],{cwd:root,env:{...process.env,NODE_ENV:'production',PUBLIC_ORIGIN:'',APP_SECRET:'',ADMIN_KEY:''},stdio:['ignore','ignore','pipe']});let error='';child.stderr.on('data',c=>error+=c);const code=await new Promise(r=>child.once('exit',r));assert.notEqual(code,0);assert.match(error,/Configuration de production manquante/);});
