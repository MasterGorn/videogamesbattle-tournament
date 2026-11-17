import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, randomUUID, createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { createTournament } from './tournament.mjs';
import { languages } from '../public/media.js';
import { signInEmail } from './sign-in-email.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const production=process.env.NODE_ENV==='production';
const origin=(process.env.PUBLIC_ORIGIN||'http://localhost:3000').replace(/\/$/,'');
const secret=process.env.APP_SECRET||'local-development-only-not-for-public-use';
if(production){for(const k of ['PUBLIC_ORIGIN','APP_SECRET','ADMIN_KEY','RESEND_API_KEY','MAIL_FROM','TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY'])if(!process.env[k])throw new Error(`Configuration de production manquante : ${k}`);if(secret.length<32||process.env.ADMIN_KEY.length<32)throw new Error('Les secrets doivent contenir au moins 32 caractères.');if(!origin.startsWith('https://'))throw new Error('HTTPS est obligatoire en production.');}
// Only confirmed sponsors belong in this configuration. Press links are curated separately.
const localImage=value=>typeof value==='string'&&/^\/assets\/[\w/-]+\.(png|jpg|jpeg|webp|svg)$/.test(value);
const validPlacement=entry=>typeof entry?.name==='string'&&entry.name.trim()&&
  typeof entry.url==='string'&&URL.parse(entry.url)?.protocol==='https:'&&
  (entry.logo===undefined||localImage(entry.logo))&&
  (entry.banner===undefined||localImage(entry.banner));
function placements(key,multiple){
  const config=JSON.parse(process.env[key]||'{}');
  if(!config||typeof config!=='object'||Array.isArray(config)||
    Object.entries(config).some(([locale,entries])=>!Object.hasOwn(languages,locale)||
      (multiple?(!Array.isArray(entries)||!entries.every(validPlacement)):!validPlacement(entries)))) {
    throw new Error(`${key} doit contenir des emplacements par langue avec un nom, une URL HTTPS et des images locales facultatives.`);
  }
  return config;
}
const sponsors=placements('SPONSORS_JSON',true);
const ads=placements('ADS_JSON',false);
const dataDir=path.resolve(root,process.env.DATA_DIR||'runtime');await mkdir(dataDir,{recursive:true});
const games=JSON.parse(readFileSync(path.join(root,'data/games.json'),'utf8'));
const tournament=createTournament({path:path.join(dataDir,'tournament.sqlite'),games,community:true});
const db=tournament.db;
db.exec('CREATE TABLE IF NOT EXISTS auth_challenges(token_hash TEXT PRIMARY KEY,nonce_hash TEXT NOT NULL,email TEXT NOT NULL,expires_at INTEGER NOT NULL)');
const hash=s=>createHash('sha256').update(String(s)).digest('hex');
const hmac=s=>createHmac('sha256',secret).update(s).digest('hex');
const token=()=>randomBytes(32).toString('base64url');
const cookieValue=(req,name)=>{const item=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='));return item?item.slice(name.length+1):'';};
const cookie=(name,value,age)=>`${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${production?'; Secure':''}`;
function identity(req){const value=cookieValue(req,'vgb_session');if(!value)return null;return db.prepare('SELECT u.id,u.email FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?').get(hash(value),Date.now())||null;}
function limit(key,max,window){const now=Date.now(),row=db.prepare('SELECT * FROM limits WHERE key=?').get(key);if(!row||row.expires_at<now){db.prepare('INSERT INTO limits VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=1,expires_at=excluded.expires_at').run(key,now+window);return;}if(row.count>=max)throw Object.assign(new Error('Un peu trop de requêtes. Réessaie dans quelques instants.'),{status:429});db.prepare('UPDATE limits SET count=count+1 WHERE key=?').run(key);}
const ip=req=>process.env.TRUST_PROXY==='1'?String(req.headers['x-forwarded-for']||req.socket.remoteAddress).split(',').at(-1).trim():req.socket.remoteAddress;
function json(res,status,data,extra={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra});res.end(JSON.stringify(data));}
async function body(req){if(!(req.headers['content-type']||'').startsWith('application/json'))throw Object.assign(new Error('JSON requis.'),{status:415});let b='';for await(const chunk of req){b+=chunk;if(b.length>16384)throw Object.assign(new Error('Requête trop longue.'),{status:413});}try{return JSON.parse(b||'{}');}catch{throw Object.assign(new Error('JSON incorrect.'),{status:400});}}
function requireUser(req){const u=identity(req);if(!u)throw Object.assign(new Error('Connecte-toi pour voter.'),{status:401});return u;}
function requireAdmin(req){const expected=process.env.ADMIN_KEY;if(!expected)throw Object.assign(new Error('Configure ADMIN_KEY pour ouvrir l’administration.'),{status:503});const provided=(req.headers.authorization||'').replace(/^Bearer /,'');if(!timingSafeEqual(Buffer.from(hash(provided)),Buffer.from(hash(expected))))throw Object.assign(new Error('Clé administrateur incorrecte.'),{status:403});}
async function challenge(req,value,action){if(!production&&!process.env.TURNSTILE_SECRET_KEY)return;if(typeof value!=='string'||value.length>2048)throw Object.assign(new Error('Vérification anti-robot requise.'),{status:400});let result;try{const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:process.env.TURNSTILE_SECRET_KEY,response:value,remoteip:ip(req)}),signal:AbortSignal.timeout(10000)});result=await r.json();}catch{throw Object.assign(new Error('Vérification temporairement indisponible.'),{status:503});}if(!result.success||result.action!==action||(production&&result.hostname!==new URL(origin).hostname))throw Object.assign(new Error('La vérification a expiré. Merci de réessayer.'),{status:403});}
const htmlEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  if(production)res.setHeader('Strict-Transport-Security','max-age=31536000');
  try{
    const url=new URL(req.url,'http://localhost');
    if(req.method==='POST'){
      if(production&&req.headers.origin!==origin)throw Object.assign(new Error('Origine de la requête refusée.'),{status:403});
      if(req.headers['sec-fetch-site']==='cross-site')throw Object.assign(new Error('Requête externe refusée.'),{status:403});
    }
    if(req.method==='GET'&&url.pathname==='/api/state'){
      const user=identity(req);return json(res,200,{...tournament.state(user?.id),user:user?{email:user.email}:null,development:!production,turnstileSiteKey:process.env.TURNSTILE_SITE_KEY||null,contact:process.env.CONTACT_EMAIL||null,catalogueDate:'2026-11-11',games:tournament.games,nominations:tournament.nominationState(user?.id),sponsors,ads});
    }
    if(req.method==='POST'&&url.pathname==='/api/auth/request'){
      const b=await body(req);const email=String(b.email||'').trim().toLowerCase();if(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Object.assign(new Error('Entre une adresse e-mail valide.'),{status:400});
      limit('login-ip:'+hmac(ip(req)),10,3600000);limit('login-email:'+hmac(email),4,3600000);await challenge(req,b.challenge,'login');
      const t=token(),nonce=token();db.prepare('INSERT INTO auth_challenges VALUES(?,?,?,?)').run(hash(t),hash(nonce),email,Date.now()+900000);
      const link=origin+'/#connexion='+encodeURIComponent(t);
      if(production||process.env.RESEND_API_KEY){const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.MAIL_FROM,to:[email],...signInEmail(b.locale,htmlEscape(link))}),signal:AbortSignal.timeout(10000)});if(!r.ok){db.prepare('DELETE FROM auth_challenges WHERE token_hash=?').run(hash(t));throw Object.assign(new Error('L’envoi du lien a échoué. Réessaie plus tard.'),{status:502});}}
      return json(res,200,{ok:true,...(!production&&!process.env.RESEND_API_KEY?{developmentToken:t}:{})},{'Set-Cookie':cookie('vgb_auth',nonce,900)});
    }
    if(req.method==='POST'&&url.pathname==='/api/auth/verify'){
      const b=await body(req);limit('verify:'+hmac(ip(req)),30,3600000);
      const row=db.prepare('SELECT * FROM auth_challenges WHERE token_hash=?').get(hash(b.token||''));
      if(!row||row.expires_at<Date.now()||row.nonce_hash!==hash(cookieValue(req,'vgb_auth')))throw Object.assign(new Error('Lien expiré ou ouvert dans un autre navigateur. Demande un nouveau lien ici.'),{status:400});
      db.prepare('DELETE FROM auth_challenges WHERE token_hash=?').run(row.token_hash);
      const userId=hmac('voter:'+row.email);
      db.prepare('INSERT OR IGNORE INTO users VALUES(?,?,?)').run(userId,row.email,Date.now());
      const user=db.prepare('SELECT id FROM users WHERE id=?').get(userId);
      db.prepare('UPDATE users SET email=? WHERE id=?').run(row.email,user.id);const session=token();db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hash(session),user.id,Date.now()+30*86400000);
      return json(res,200,{ok:true},{'Set-Cookie':[cookie('vgb_session',session,30*86400),cookie('vgb_auth','',0)]});
    }
    if(req.method==='POST'&&url.pathname==='/api/auth/logout'){await body(req);db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(cookieValue(req,'vgb_session')));return json(res,200,{ok:true},{'Set-Cookie':cookie('vgb_session','',0)});}
    if(req.method==='POST'&&['/api/nominations','/api/nominations/support'].includes(url.pathname)){
      const user=requireUser(req),b=await body(req);
      limit('nominations:'+user.id,30,60000);
      if(url.pathname==='/api/nominations') tournament.nominate(user.id,b);
      else tournament.supportNomination(user.id,String(b.id||''),b.support);
      return json(res,200,{nominations:tournament.nominationState(user.id),games:tournament.games});
    }
    if(req.method==='POST'&&url.pathname==='/api/vote'){
      const user=requireUser(req),b=await body(req);limit('vote:'+user.id,60,60000);limit('vote-ip:'+hmac(ip(req)),240,60000);await challenge(req,b.challenge,'vote');
      tournament.vote(user.id,String(b.matchId||''),String(b.gameId||''));return json(res,200,{ok:true,...tournament.state(user.id),games:tournament.games,nominations:tournament.nominationState(user.id)});
    }
    if(req.method==='GET'&&url.pathname==='/api/account/export'){const user=requireUser(req);return json(res,200,{email:user.email,nominations:db.prepare('SELECT id,title,platform,year FROM nominations WHERE user_id=?').all(user.id),nominationVotes:db.prepare('SELECT nomination_id FROM nomination_votes WHERE user_id=?').all(user.id),votes:db.prepare('SELECT match_id,game_id,created_at FROM votes WHERE user_id=?').all(user.id)},{'Content-Disposition':'attachment; filename="mes-donnees-vgb.json"'});}
    if(req.method==='POST'&&url.pathname==='/api/account/delete'){const user=requireUser(req);await body(req);db.prepare('UPDATE users SET email=? WHERE id=?').run('deleted-'+randomUUID()+'@anonymous.invalid',user.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);tournament.audit('account-anonymized',{id:user.id});return json(res,200,{ok:true},{'Set-Cookie':cookie('vgb_session','',0)});}
    if(url.pathname.startsWith('/api/admin/')){
      limit('admin:'+hmac(ip(req)),30,60000);requireAdmin(req);
      if(req.method==='GET'&&url.pathname==='/api/admin/state')return json(res,200,{...tournament.state(),matches:tournament.matches(),audit:db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 30').all()});
      if(req.method==='GET'&&url.pathname==='/api/admin/results')return json(res,200,{exportedAt:new Date().toISOString(),games:tournament.games,matches:tournament.matches(),groups:tournament.standings()},{'Content-Disposition':'attachment; filename="vgb-resultats.json"'});
      if(req.method==='POST'&&url.pathname==='/api/admin/start'){await body(req);tournament.start();return json(res,200,{ok:true});}
      if(req.method==='POST'&&url.pathname==='/api/admin/tick'){await body(req);return json(res,200,{closed:tournament.tick()});}
    }
    if(req.method==='GET'&&url.pathname==='/health')return json(res,200,{ok:true});
    if(url.pathname.startsWith('/api/'))return json(res,404,{error:'Route introuvable.'});
    if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Méthode refusée.'});
    const publicDir=path.join(root,'public');let pathname=decodeURIComponent(url.pathname);
    const isPage=pathname==='/'||/^\/(duel\/[^/]+|poules|tableau|jeux|propositions|regles|profil|admin)\/?$/.test(pathname);
    const target=isPage?path.join(publicDir,'index.html'):path.resolve(publicDir,'.'+pathname);
    if(!target.startsWith(publicDir+path.sep)||!existsSync(target)||(await stat(target)).isDirectory())return json(res,404,{error:'Page introuvable.'});
    let bytes=await readFile(target);
    if(isPage){const m=pathname.startsWith('/duel/')?tournament.match(pathname.split('/')[2]):null;let title='Video Games Battle — 256 légendes. Une seule couronne.';if(m?.gameA&&m?.gameB)title=tournament.games.find(g=>g.id===m.gameA).title+' vs '+tournament.games.find(g=>g.id===m.gameB).title+' · Video Games Battle';bytes=Buffer.from(bytes.toString().replaceAll('__PAGE_TITLE__',htmlEscape(title)).replaceAll('__OG_URL__',htmlEscape(origin+pathname)).replaceAll('__OG_IMAGE__',htmlEscape(origin+'/assets/social.png')));}
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':isPage?'no-store':'public, max-age=3600'});res.end(req.method==='HEAD'?undefined:bytes);
  }catch(e){if(!res.headersSent)json(res,e.status||500,{code:e.code,error:e.status?e.message:'Une erreur est survenue. Réessaie dans quelques instants.'});if(!e.status)console.error(e.message);}
});
server.requestTimeout=15000;server.headersTimeout=16000;
const timer=setInterval(()=>{try{tournament.tick();db.prepare('DELETE FROM limits WHERE expires_at<?').run(Date.now());db.prepare('DELETE FROM sessions WHERE expires_at<?').run(Date.now());db.prepare('DELETE FROM auth_challenges WHERE expires_at<?').run(Date.now());}catch(e){console.error('Tournament:',e.message);}},5000).unref();
const option=name=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
const port=Number(option('--port')||process.env.PORT)||3000;
server.listen(port,option('--host')||process.env.HOST||'0.0.0.0',()=>console.log(`Video Games Battle · http://localhost:${port} · ${production?'production':'développement (votes locaux)'}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{clearInterval(timer);server.close(()=>{tournament.close();process.exit(0);});});
