import test from 'node:test';
import assert from 'node:assert/strict';
import {awardPoints,canClose,snakeGroups,bracketGraph,createTournament,RULES} from '../src/tournament.mjs';
const games=Array.from({length:256},(_,i)=>({id:`test-${i+1}`,seed:i+1,title:`Fixture ${i+1}`,score:99-Math.floor(i/30)}));
const DAY=86400000;
test('barème : bornes 45/55 incluses et majorité stricte >55 %',()=>{assert.deepEqual(awardPoints(5500,4500),[2,1]);assert.deepEqual(awardPoints(4500,5500),[1,2]);assert.deepEqual(awardPoints(5501,4499),[3,0]);assert.deepEqual(awardPoints(4999,5001),[1,2]);assert.deepEqual(awardPoints(5000,5000),[0,0]);});
test('phase finale : 10 000 votes ET 14 jours ET une majorité',()=>{const m={status:'open',openedAt:0,votesA:6000,votesB:4000};assert.equal(canClose(m,14*DAY-1),false);assert.equal(canClose(m,14*DAY),true);assert.equal(canClose({...m,votesB:3999},100*DAY),false);assert.equal(canClose({...m,votesA:5000,votesB:5000},100*DAY),false);assert.equal(canClose({...m,status:'closed'},100*DAY),false);});
test('snake : 32 poules équilibrées, 256 uniques et top 32 séparé',()=>{const groups=snakeGroups(games);assert.equal(groups.length,32);assert.equal(new Set(groups.flat().map(g=>g.id)).size,256);for(const group of groups){assert.equal(group.reduce((s,g)=>s+g.seed,0),1028);assert.equal(group.filter(g=>g.seed<=32).length,1);}assert.deepEqual(groups[0].map(g=>g.seed),[1,64,65,128,129,192,193,256]);});
test('graph : 127 upper, 126 lower, finale et reset ; chaque référence existe',()=>{const graph=bracketGraph(games.slice(0,128).map(g=>g.id));assert.equal(graph.length,255);assert.equal(graph.filter(m=>m.stage==='upper').length,127);assert.equal(graph.filter(m=>m.stage==='lower').length,126);const ids=new Set(graph.map(m=>m.id));for(const m of graph)for(const s of [m.sourceA,m.sourceB])if(s.type!=='game')assert.ok(ids.has(s.id));});
test('votes durables, uniques et secrets avant choix ; duel fermé refuse vote',()=>{let now=0;const t=createTournament({games,now:()=>now});t.start();t.db.prepare('INSERT INTO users VALUES(?,?,?)').run('u','fixture@example.invalid',now);const m=t.matches()[0];assert.equal(t.state().matches[0].votesA,null);t.vote('u',m.id,m.gameA);assert.throws(()=>t.vote('u',m.id,m.gameB),/déjà/);assert.throws(()=>t.vote('u',m.id,'not-a-game'),/participe/);assert.equal(t.state('u').matches[0].votesA,1);t.db.prepare('UPDATE matches SET votes_a=6000,votes_b=4000 WHERE id=?').run(m.id);now=14*DAY;t.tick();assert.equal(t.match(m.id).status,'open');assert.equal(t.state().matches[0].quotaReached,true);assert.deepEqual(t.standings()[0].rows.map(r=>r.points),[3,0,0,0,0,0,0,0]);t.close();});
test('le quota affiche des qualifiés révisables et le dernier vote fige les poules ensemble',()=>{
  const t=createTournament({games,now:()=>0});
  try {
    t.start();
    const [, , , fourth,fifth]=t.groups[0].map(game=>game.id);
    const matches=t.matches();
    const decisive=matches.find(m=>m.gameA===fourth&&m.gameB===fifth);
    const last=matches.at(-1);
    const draw=matches.find(m=>m.groupId===2);
    t.db.exec("UPDATE matches SET votes_a=6000,votes_b=4000; INSERT INTO users VALUES('u','fixture@example.invalid',0)");
    const score=t.db.prepare('UPDATE matches SET votes_a=?,votes_b=? WHERE id=?');
    score.run(5000,5000,decisive.id);
    score.run(5000,5000,draw.id);
    score.run(6000,3999,last.id);
    assert.equal(t.tick(),0);
    const before=t.state();
    assert.equal(before.qualified.length,0);
    assert.equal(before.provisional.length,124);
    assert.ok(before.provisional.includes(fourth));
    assert.ok(before.provisionalMatches.some(m=>[m.gameA,m.gameB].includes(fourth)));
    assert.ok(!before.provisional.includes(fifth));
    t.vote('u',decisive.id,fifth);
    assert.equal(t.match(decisive.id).status,'open');
    assert.ok(t.state().provisional.includes(fifth));
    assert.ok(!t.state().provisional.includes(fourth));
    t.vote('u',last.id,last.gameB);
    assert.equal(t.getMeta('phase'),'bracket');
    assert.equal(t.state().provisional.length,0);
    assert.ok(t.state().qualified.includes(fifth));
    assert.equal(t.match('W1-1').status,'open');
    assert.equal(t.match(draw.id).winner,null);
    assert.equal(t.matches().filter(m=>m.stage==='pool'&&m.status==='closed').length,896);
    assert.throws(()=>t.vote('u',decisive.id,fifth),/ouvert/);
  } finally {
    t.close();
  }
});
for(const reset of [false,true])test(`tournoi complet : 128 qualifiés, double élimination, reset=${reset}`,()=>{let now=0;const t=createTournament({games,now:()=>now});t.start();let cycles=0;while(t.getMeta('phase')!=='complete') {assert.ok(cycles++<25);now+=14*DAY;for(const m of t.matches().filter(m=>m.status==='open')){const bWins=m.id==='GF-1'&&reset;t.db.prepare('UPDATE matches SET votes_a=?,votes_b=? WHERE id=?').run(bWins?4000:6000,bWins?6000:4000,m.id);}t.tick();}assert.equal(t.standings().filter(g=>g.complete).length,32);assert.equal(JSON.parse(t.getMeta('qualified')).length,128);assert.equal(cycles,reset?16:15);const qualified=new Set(JSON.parse(t.getMeta('qualified')));for(const group of t.standings())assert.equal(group.rows.filter(r=>qualified.has(r.gameId)).length,4);const finals=t.matches().filter(m=>m.stage!=='pool'&&m.status==='closed');assert.equal(finals.length,reset?255:254);const losses=new Map();for(const m of finals){assert.notEqual(m.gameA,m.gameB);losses.set(m.loser,(losses.get(m.loser)||0)+1);}for(const id of JSON.parse(t.getMeta('qualified')))assert.equal(losses.get(id)||0,id===t.getMeta('champion')?(reset?1:0):2);assert.equal(t.match('GF-2').status,reset?'closed':'cancelled');t.close();});
test('la durée des matchs dépend de leur ouverture, pas du début de saison',()=>{let now=0;const t=createTournament({games,now:()=>now});t.start();t.db.prepare("UPDATE matches SET votes_a=6000,votes_b=4000 WHERE stage='pool'").run();now=30*DAY;t.tick();const m=t.match('W1-1');assert.equal(m.openedAt,now);t.db.prepare('UPDATE matches SET votes_a=6000,votes_b=4000 WHERE id=?').run(m.id);t.tick();assert.equal(t.match(m.id).status,'open');now+=14*DAY;t.tick();assert.equal(t.match(m.id).status,'closed');t.close();});

test('à égalité de points, les voix cumulées décident de la quatrième place',()=>{
  let now=0;
  const t=createTournament({games,now:()=>now});
  try {
    t.start();
    const [first,,,fourth,fifth,sixth]=t.groups[0].map(game=>game.id);
    const score=t.db.prepare('UPDATE matches SET votes_a=?,votes_b=? WHERE id=?');
    for(const m of t.matches()) {
      const closeWin=m.gameA===fourth&&[fifth,sixth].includes(m.gameB);
      const highTurnout=m.gameA===first&&m.gameB===fifth;
      const [a,b]=closeWin?[5500,4500]:highTurnout?[60000,40000]:[6000,4000];
      score.run(a,b,m.id);
    }
    now=14*DAY;
    t.tick();
    const {complete,rows}=t.standings()[0];
    assert.ok(complete);
    assert.deepEqual(rows.slice(3,5).map(r=>[r.gameId,r.points,r.totalVotes]),[
      [fifth,10,70500],
      [fourth,10,35000]
    ]);
    const qualified=t.state().qualified;
    assert.ok(qualified.includes(fifth));
    assert.ok(!qualified.includes(fourth));
  } finally {
    t.close();
  }
});
