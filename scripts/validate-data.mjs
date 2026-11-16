import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const games=JSON.parse(readFileSync(path.join(root,'data/games.json')));
assert.equal(games.length,256);assert.equal(new Set(games.map(g=>g.id)).size,256);assert.equal(new Set(games.map(g=>g.familyKey)).size,256);
games.forEach((g,i)=>{assert.equal(g.seed,i+1);assert.ok(g.score>=0&&g.score<=100);assert.ok(g.reviewCount>0);assert.equal(g.year,Number(g.releaseDate.slice(0,4)));assert.ok(g.platform&&g.title);assert.ok(g.sourceUrl.startsWith('https://www.metacritic.com/game/'));assert.ok(existsSync(path.join(root,'public',g.coverLocal)));if(i)assert.ok(games[i-1].score>=g.score);});
console.log('Catalogue validé : 256 jeux, familles uniques, seeds continus, sources, années et 256 jaquettes locales.');
