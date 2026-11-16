import {readFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {backup} from 'node:sqlite';
import {createTournament} from '../src/tournament.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dataDir=path.resolve(root,process.env.DATA_DIR||'runtime');mkdirSync(dataDir,{recursive:true});
const games=JSON.parse(readFileSync(path.join(root,'data/games.json')));
const t=createTournament({path:path.join(dataDir,'tournament.sqlite'),games,community:true});
try{switch(process.argv[2]){
  case'start':{const date=t.start();console.log('Édition lancée :',new Date(date).toISOString());break;}
  case'status':{const state=t.state();console.log(JSON.stringify({phase:state.phase,stats:state.stats,champion:state.champion},null,2));break;}
  case'backup':{const dir=path.join(dataDir,'backups');mkdirSync(dir,{recursive:true});const destination=path.join(dir,'vgb-'+new Date().toISOString().replace(/[:.]/g,'-')+'.sqlite');await backup(t.db,destination);console.log('Sauvegarde cohérente créée :',destination);break;}
  default:console.error('Usage : node scripts/admin.mjs start|status|backup');process.exitCode=1;
}}finally{t.close();}
