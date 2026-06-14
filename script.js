'use strict';
/* ═══════════════════════════════════════════════════════════
   ANTI-BULLYING RUNNER  —  game.js  (completo e corrigido)
   Correções aplicadas:
   • Top Run: IDs únicos, filtragem correta local/global
   • Recorde: detectado mid-run, música vitória tocada 1× só
   • Música BG: lock para evitar loop duplo, para ao game over
   • Dilema: flag dilemaOpen, sem fechar/abrir duplo
   • endGame: chamado 1× com guard, coins/gems salvos certos
   • Power charges: devolvidos ao saveData ao fim da corrida
   • menuBg loop: para quando jogo começa, retoma ao voltar
   • Colisão shield: corrigida para não derrubar o escudo errado
════════════════════════════════════════════════════════════ */

// ─── CONSTANTS ───────────────────────────────────────────
const MAX_XP       = 5000;
const LANES        = 3;
const SAVE_KEY     = 'abr_v6';
const ACCOUNTS_KEY = 'abr_accounts_v6';
const TOP_KEY      = 'abr_top_v6';
const MAX_LIVES    = 3;
const LETTERS      = ['A','B','C','D'];
const BASE_SPEED   = 0.5;
const MAX_SPEED    = 3.2;
const SPEED_RAMP   = 0.012;
const TOP_MAX      = 20;
const DILEMA_TIME  = 20000; // ms

const POWERS_DEF = [
  { id:'shield', emoji:'🛡️', cd:20, dur:8  },
  { id:'speed',  emoji:'⚡',  cd:25, dur:6  },
  { id:'magnet', emoji:'🧲',  cd:18, dur:7  },
  { id:'slowmo', emoji:'🌀',  cd:30, dur:5  },
];

const SHOP_ITEMS = [
  { id:'buy50coins',   icon:'🪙', cost:3,   cur:'gem',  type:'pack'   },
  { id:'buy200coins',  icon:'🪙', cost:10,  cur:'gem',  type:'pack'   },
  { id:'buy5gems',     icon:'💎', cost:100, cur:'coin', type:'pack'   },
  { id:'buy20gems',    icon:'💎', cost:350, cur:'coin', type:'pack'   },
  { id:'shieldCharge', icon:'🛡️', cost:2,   cur:'gem',  type:'charge' },
  { id:'speedCharge',  icon:'⚡',  cost:2,   cur:'gem',  type:'charge' },
  { id:'magnetCharge', icon:'🧲',  cost:2,   cur:'gem',  type:'charge' },
  { id:'slowCharge',   icon:'🌀',  cost:2,   cur:'gem',  type:'charge' },
  { id:'xpMult',       icon:'📈', cost:8,   cur:'gem',  type:'unlock' },
  { id:'coinBoost',    icon:'💰', cost:6,   cur:'gem',  type:'unlock' },
  { id:'extraLife',    icon:'❤️',  cost:5,   cur:'gem',  type:'unlock' },
  { id:'avatar1',      icon:'🦸', cost:500, cur:'coin', type:'unlock' },
  { id:'avatar2',      icon:'🧙', cost:500, cur:'coin', type:'unlock' },
];

const AVATARS_BASE = ['🧒','👦','👧','🧑'];

// ─── TRANSLATIONS ─────────────────────────────────────────
const T = {
  pt:{
    menuTitle:'Anti-Bullying Runner',
    lblName:'SEU NOME', lblXP:'XP', lblTheme:'TEMA', lblLang:'IDIOMA',
    statBestKey:'RECORDE', statCoinsKey:'MOEDAS', statGamesKey:'CORRIDAS',
    shopTitle:'🛒 Loja', shopBackLbl:'Voltar',
    goTitle:'GAME OVER', goScoreKey:'PONTOS', goDistKey:'DISTÂNCIA',
    goCoinsKey:'MOEDAS', goGemsKey:'GEMAS', goXpLabel:'XP GANHO', goQLabel:'PERGUNTAS',
    replayLbl:'Jogar Novamente', goMenuLbl:'Menu Principal',
    newRecord:'🏆 NOVO RECORDE!', maxLvl:'⭐ NÍVEL MÁXIMO!',
    splashSub:'CARREGANDO...',
    themeD:'🌙 Escuro', themeL:'☀️ Claro', themeBW:'◑ P&B',
    powerNames:['Escudo','Velocidade','Ímã','Lentidão'],
    shopSec:['MOEDAS / GEMAS','CARGAS DE PODERES','MELHORIAS'],
    shopItems:{
      buy50coins:  {name:'50 Moedas',    desc:'50 moedas por 3 💎'},
      buy200coins: {name:'200 Moedas',   desc:'200 moedas por 10 💎'},
      buy5gems:    {name:'5 Gemas',      desc:'5 💎 por 100 🪙'},
      buy20gems:   {name:'20 Gemas',     desc:'20 💎 por 350 🪙'},
      shieldCharge:{name:'Carga: Escudo',   desc:'+1 uso do Escudo'},
      speedCharge: {name:'Carga: Veloz',    desc:'+1 uso da Velocidade'},
      magnetCharge:{name:'Carga: Ímã',      desc:'+1 uso do Ímã'},
      slowCharge:  {name:'Carga: Lentidão', desc:'+1 uso da Lentidão'},
      xpMult:      {name:'2× XP',        desc:'Dobra XP por 1 corrida'},
      coinBoost:   {name:'2× Moedas',    desc:'Moedas valem 2× por 1 corrida'},
      extraLife:   {name:'Vida Extra',   desc:'Começa com 4 vidas'},
      avatar1:     {name:'Avatar Herói', desc:'Desbloqueia 🦸'},
      avatar2:     {name:'Avatar Mago',  desc:'Desbloqueia 🧙'},
    },
    buyBtn:'Comprar', boughtBtn:'Comprado', activeBtn:'Ativo',
    noCoins:'Sem 🪙', noGems:'Sem 💎',
    dilemaTag:'DILEMA',
    correctMsg:'✅ Correto! +500 XP e +50 🪙',
    wrongMsg:'❌ Errado! -1 vida',
    timeoutMsg:'⏰ Tempo esgotado! -1 vida',
    perfectTitle:'PERFEITO!',
    perfectSub:'Respondeu tudo sem errar!\nIncrível desempenho!',
    perfectContinue:'🏃 CONTINUAR CORRENDO',
    perfectMenu:'Menu Principal',
    pScoreKey:'PONTOS', pDistKey:'DISTÂNCIA', pXPKey:'XP BÔNUS', pCoinsKey:'MOEDAS BÔNUS',
    qStats:(c,w,t)=>`✅ ${c} certas  ❌ ${w} erradas  de ${t}`,
    powerOk:(n)=>`⚡ ${n} ATIVADO!`,
    powerNo:(n)=>`Sem carga: ${n}! Compre na loja.`,
    powerBarHint:'PODERES',
    topRunTitle:'Top Run', topBackLbl:'Voltar',
    localEmpty:'Nenhuma corrida local ainda.',
    globalEmpty:'Nenhuma corrida registrada.',
    loginTitle:'Conta & Nuvem', loginBtnLbl:'Conta & Nuvem',
    cloudSync:'Dados sincronizados automaticamente.',
    syncNowLbl:'Sincronizar Agora', logoutLbl:'Sair da Conta', loginBackLbl:'Voltar',
    lblEmail:'EMAIL', lblPassword:'SENHA', lblRegName:'NOME NO JOGO',
    authNote:'Dados salvos localmente + nuvem simulada.',
    loginLbl:'Entrar', registerLbl:'Criar Conta',
    cloudHello:(n)=>`☁️ Olá, ${n}! Progresso salvo.`,
    errEmail:'Email inválido', errPass:'Mínimo 6 caracteres',
    errNoAcc:'Conta não encontrada', errWrongPass:'Senha incorreta',
    errExists:'Email já cadastrado',
    okRegister:'Conta criada! Entrando...', okLogin:'Bem-vindo de volta!',
    recordBroken:'🏆 NOVO RECORDE!',
  },
  en:{
    menuTitle:'Anti-Bullying Runner',
    lblName:'YOUR NAME', lblXP:'XP', lblTheme:'THEME', lblLang:'LANGUAGE',
    statBestKey:'HIGH SCORE', statCoinsKey:'COINS', statGamesKey:'RUNS',
    shopTitle:'🛒 Shop', shopBackLbl:'Back',
    goTitle:'GAME OVER', goScoreKey:'SCORE', goDistKey:'DISTANCE',
    goCoinsKey:'COINS', goGemsKey:'GEMS', goXpLabel:'XP EARNED', goQLabel:'QUESTIONS',
    replayLbl:'Play Again', goMenuLbl:'Main Menu',
    newRecord:'🏆 NEW RECORD!', maxLvl:'⭐ MAX LEVEL!',
    splashSub:'LOADING...',
    themeD:'🌙 Dark', themeL:'☀️ Light', themeBW:'◑ B&W',
    powerNames:['Shield','Speed','Magnet','Slowdown'],
    shopSec:['COIN / GEM PACKS','POWER CHARGES','UPGRADES'],
    shopItems:{
      buy50coins:  {name:'50 Coins',    desc:'50 coins for 3 💎'},
      buy200coins: {name:'200 Coins',   desc:'200 coins for 10 💎'},
      buy5gems:    {name:'5 Gems',      desc:'5 💎 for 100 🪙'},
      buy20gems:   {name:'20 Gems',     desc:'20 💎 for 350 🪙'},
      shieldCharge:{name:'Shield Charge',   desc:'+1 Shield use'},
      speedCharge: {name:'Speed Charge',    desc:'+1 Speed use'},
      magnetCharge:{name:'Magnet Charge',   desc:'+1 Magnet use'},
      slowCharge:  {name:'Slowdown Charge', desc:'+1 Slowdown use'},
      xpMult:      {name:'2× XP',       desc:'Double XP for 1 run'},
      coinBoost:   {name:'2× Coins',    desc:'Coins worth 2× for 1 run'},
      extraLife:   {name:'Extra Life',  desc:'Start with 4 lives'},
      avatar1:     {name:'Hero Avatar', desc:'Unlock 🦸'},
      avatar2:     {name:'Wizard Avatar',desc:'Unlock 🧙'},
    },
    buyBtn:'Buy', boughtBtn:'Bought', activeBtn:'Active',
    noCoins:'No 🪙', noGems:'No 💎',
    dilemaTag:'DILEMMA',
    correctMsg:'✅ Correct! +500 XP & +50 🪙',
    wrongMsg:'❌ Wrong! -1 life',
    timeoutMsg:'⏰ Time up! -1 life',
    perfectTitle:'PERFECT!',
    perfectSub:'You answered everything right!\nAmazing performance!',
    perfectContinue:'🏃 KEEP RUNNING',
    perfectMenu:'Main Menu',
    pScoreKey:'SCORE', pDistKey:'DISTANCE', pXPKey:'BONUS XP', pCoinsKey:'BONUS COINS',
    qStats:(c,w,t)=>`✅ ${c} correct  ❌ ${w} wrong  of ${t}`,
    powerOk:(n)=>`⚡ ${n} ACTIVATED!`,
    powerNo:(n)=>`No ${n} charge! Buy in shop.`,
    powerBarHint:'POWERS',
    topRunTitle:'Top Run', topBackLbl:'Back',
    localEmpty:'No local runs yet.',
    globalEmpty:'No runs recorded yet.',
    loginTitle:'Account & Cloud', loginBtnLbl:'Account & Cloud',
    cloudSync:'Progress synced automatically.',
    syncNowLbl:'Sync Now', logoutLbl:'Sign Out', loginBackLbl:'Back',
    lblEmail:'EMAIL', lblPassword:'PASSWORD', lblRegName:'GAME NAME',
    authNote:'Data saved locally + simulated cloud.',
    loginLbl:'Sign In', registerLbl:'Create Account',
    cloudHello:(n)=>`☁️ Hi, ${n}! Progress saved.`,
    errEmail:'Invalid email', errPass:'Minimum 6 characters',
    errNoAcc:'Account not found', errWrongPass:'Wrong password',
    errExists:'Email already registered',
    okRegister:'Account created! Signing in...', okLogin:'Welcome back!',
    recordBroken:'🏆 NEW RECORD!',
  },
  es:{
    menuTitle:'Anti-Bullying Runner',
    lblName:'TU NOMBRE', lblXP:'XP', lblTheme:'TEMA', lblLang:'IDIOMA',
    statBestKey:'RÉCORD', statCoinsKey:'MONEDAS', statGamesKey:'CARRERAS',
    shopTitle:'🛒 Tienda', shopBackLbl:'Volver',
    goTitle:'GAME OVER', goScoreKey:'PUNTOS', goDistKey:'DISTANCIA',
    goCoinsKey:'MONEDAS', goGemsKey:'GEMAS', goXpLabel:'XP GANADO', goQLabel:'PREGUNTAS',
    replayLbl:'Jugar de Nuevo', goMenuLbl:'Menú Principal',
    newRecord:'🏆 ¡NUEVO RÉCORD!', maxLvl:'⭐ ¡NIVEL MÁXIMO!',
    splashSub:'CARGANDO...',
    themeD:'🌙 Oscuro', themeL:'☀️ Claro', themeBW:'◑ B/N',
    powerNames:['Escudo','Velocidad','Imán','Ralentizar'],
    shopSec:['MONEDAS / GEMAS','CARGAS DE PODERES','MEJORAS'],
    shopItems:{
      buy50coins:  {name:'50 Monedas',   desc:'50 monedas por 3 💎'},
      buy200coins: {name:'200 Monedas',  desc:'200 monedas por 10 💎'},
      buy5gems:    {name:'5 Gemas',      desc:'5 💎 por 100 🪙'},
      buy20gems:   {name:'20 Gemas',     desc:'20 💎 por 350 🪙'},
      shieldCharge:{name:'Carga: Escudo',   desc:'+1 uso del Escudo'},
      speedCharge: {name:'Carga: Velocidad',desc:'+1 uso de Velocidad'},
      magnetCharge:{name:'Carga: Imán',     desc:'+1 uso del Imán'},
      slowCharge:  {name:'Carga: Ralentizar',desc:'+1 uso de Ralentizar'},
      xpMult:      {name:'2× XP',        desc:'Doble XP por 1 carrera'},
      coinBoost:   {name:'2× Monedas',   desc:'Monedas 2× por 1 carrera'},
      extraLife:   {name:'Vida Extra',   desc:'Empieza con 4 vidas'},
      avatar1:     {name:'Avatar Héroe', desc:'Desbloquea 🦸'},
      avatar2:     {name:'Avatar Mago',  desc:'Desbloquea 🧙'},
    },
    buyBtn:'Comprar', boughtBtn:'Comprado', activeBtn:'Activo',
    noCoins:'Sin 🪙', noGems:'Sin 💎',
    dilemaTag:'DILEMA',
    correctMsg:'✅ ¡Correcto! +500 XP y +50 🪙',
    wrongMsg:'❌ ¡Incorrecto! -1 vida',
    timeoutMsg:'⏰ ¡Tiempo agotado! -1 vida',
    perfectTitle:'¡PERFECTO!',
    perfectSub:'¡Respondiste todo bien!\n¡Rendimiento increíble!',
    perfectContinue:'🏃 SEGUIR CORRIENDO',
    perfectMenu:'Menú Principal',
    pScoreKey:'PUNTOS', pDistKey:'DISTANCIA', pXPKey:'XP BONO', pCoinsKey:'MONEDAS BONO',
    qStats:(c,w,t)=>`✅ ${c} correctas  ❌ ${w} incorrectas  de ${t}`,
    powerOk:(n)=>`⚡ ¡${n} ACTIVADO!`,
    powerNo:(n)=>`¡Sin carga de ${n}! Compra en tienda.`,
    powerBarHint:'PODERES',
    topRunTitle:'Top Run', topBackLbl:'Volver',
    localEmpty:'Ninguna carrera local aún.',
    globalEmpty:'Ninguna carrera registrada.',
    loginTitle:'Cuenta & Nube', loginBtnLbl:'Cuenta & Nube',
    cloudSync:'Progreso sincronizado automáticamente.',
    syncNowLbl:'Sincronizar Ahora', logoutLbl:'Cerrar Sesión', loginBackLbl:'Volver',
    lblEmail:'EMAIL', lblPassword:'CONTRASEÑA', lblRegName:'NOMBRE EN EL JUEGO',
    authNote:'Datos guardados localmente + nube simulada.',
    loginLbl:'Entrar', registerLbl:'Crear Cuenta',
    cloudHello:(n)=>`☁️ ¡Hola, ${n}! Progreso guardado.`,
    errEmail:'Email inválido', errPass:'Mínimo 6 caracteres',
    errNoAcc:'Cuenta no encontrada', errWrongPass:'Contraseña incorrecta',
    errExists:'Email ya registrado',
    okRegister:'¡Cuenta creada! Entrando...', okLogin:'¡Bienvenido de vuelta!',
    recordBroken:'🏆 ¡NUEVO RÉCORD!',
  }
};

// ─── DILEMMAS ─────────────────────────────────────────────
const DILEMMAS = {
  pt:[
    { tag:'CYBERBULLYING', icon:'💻',
      q:'Você vê um colega sendo atacado e humilhado em um grupo de mensagens da turma. O que você faz?',
      opts:[
        {t:'Fica em silêncio para não se envolver.',ok:false},
        {t:'Defende o colega, reporta as mensagens e avisa um adulto.',ok:true},
        {t:'Encaminha as mensagens para mais pessoas.',ok:false},
        {t:'Curte as mensagens para não chamar atenção.',ok:false}
      ]},
    { tag:'EXCLUSÃO SOCIAL', icon:'🤝',
      q:'Um colega fica sozinho no recreio todos os dias. O que você faz?',
      opts:[
        {t:'Ignora, cada um tem seus amigos.',ok:false},
        {t:'Convida para se juntar ao seu grupo.',ok:true},
        {t:'Comenta que ele é estranho com os amigos.',ok:false},
        {t:'Tira foto e publica nas redes sociais.',ok:false}
      ]},
    { tag:'APELIDOS OFENSIVOS', icon:'😔',
      q:'Um grupo chama um aluno de apelidos maldosos. O que você faz?',
      opts:[
        {t:'Ri junto para não ser o próximo alvo.',ok:false},
        {t:'Pede para parar e conversa com o aluno afetado.',ok:true},
        {t:'Inventa novos apelidos achando que é brincadeira.',ok:false},
        {t:'Observa sem fazer nada.',ok:false}
      ]},
    { tag:'FAKE NEWS', icon:'📰',
      q:'Alguém espalha um boato falso sobre um colega. O que você faz?',
      opts:[
        {t:'Repassa para mais colegas.',ok:false},
        {t:'Verifica, não repassa e informa que é falso.',ok:true},
        {t:'Adiciona detalhes para tornar mais interessante.',ok:false},
        {t:'Ignora, não é problema seu.',ok:false}
      ]},
    { tag:'TESTEMUNHA', icon:'😰',
      q:'Você vê um amigo sendo ameaçado verbalmente no corredor. O que você faz?',
      opts:[
        {t:'Filma para postar nas redes.',ok:false},
        {t:'Se afasta para não se envolver.',ok:false},
        {t:'Intervém com calma e chama um professor.',ok:true},
        {t:'Fica assistindo sem interferir.',ok:false}
      ]},
    { tag:'EMPATIA', icon:'🌍',
      q:'Um aluno novo de outro país tem dificuldade com o idioma. O que você faz?',
      opts:[
        {t:'Evita falar porque é difícil.',ok:false},
        {t:'Faz gestos de exclusão junto com os outros.',ok:false},
        {t:'Se aproxima com paciência e o ajuda a se sentir bem-vindo.',ok:true},
        {t:'Ri das tentativas de comunicação.',ok:false}
      ]},
  ],
  en:[
    { tag:'CYBERBULLYING', icon:'💻',
      q:'You see a classmate being attacked in the class group chat. What do you do?',
      opts:[
        {t:'Stay silent to avoid getting involved.',ok:false},
        {t:'Defend them, report the messages, and tell an adult.',ok:true},
        {t:'Forward the messages to more people.',ok:false},
        {t:'Like the messages to blend in.',ok:false}
      ]},
    { tag:'SOCIAL EXCLUSION', icon:'🤝',
      q:'A classmate is alone every day at recess. What do you do?',
      opts:[
        {t:'Ignore it — everyone has their own friends.',ok:false},
        {t:'Invite them to join your group.',ok:true},
        {t:'Tell friends they are strange.',ok:false},
        {t:'Take a photo and post it online.',ok:false}
      ]},
    { tag:'OFFENSIVE NICKNAMES', icon:'😔',
      q:'A group is calling a student mean nicknames. What do you do?',
      opts:[
        {t:'Laugh along so you are not the next target.',ok:false},
        {t:'Ask them to stop and support the affected student.',ok:true},
        {t:'Invent new nicknames thinking it is harmless.',ok:false},
        {t:'Watch without doing anything.',ok:false}
      ]},
    { tag:'FAKE NEWS', icon:'📰',
      q:'Someone spreads a false rumor about a classmate. What do you do?',
      opts:[
        {t:'Pass it along to more classmates.',ok:false},
        {t:'Verify the facts, do not share it, and say it is false.',ok:true},
        {t:'Add dramatic details to make it juicier.',ok:false},
        {t:'Ignore it — not your problem.',ok:false}
      ]},
    { tag:'WITNESS', icon:'😰',
      q:'You see a friend being verbally threatened in the hallway. What do you do?',
      opts:[
        {t:'Record a video to post online.',ok:false},
        {t:'Walk away quickly.',ok:false},
        {t:'Calmly intervene and get a teacher.',ok:true},
        {t:'Watch without interfering.',ok:false}
      ]},
    { tag:'EMPATHY', icon:'🌍',
      q:'A new student from abroad struggles with the language. What do you do?',
      opts:[
        {t:'Avoid talking because communication is hard.',ok:false},
        {t:'Make exclusionary gestures with others.',ok:false},
        {t:'Approach patiently and help them feel welcome.',ok:true},
        {t:'Laugh at their attempts to communicate.',ok:false}
      ]},
  ],
  es:[
    { tag:'CIBERACOSO', icon:'💻',
      q:'Ves a un compañero siendo atacado en el chat del grupo. ¿Qué haces?',
      opts:[
        {t:'Te quedas en silencio.',ok:false},
        {t:'Lo defiendes, reportas y avisas a un adulto.',ok:true},
        {t:'Reenvías los mensajes.',ok:false},
        {t:'Le das me gusta para pasar desapercibido.',ok:false}
      ]},
    { tag:'EXCLUSIÓN SOCIAL', icon:'🤝',
      q:'Un compañero está solo en el recreo todos los días. ¿Qué haces?',
      opts:[
        {t:'Lo ignoras.',ok:false},
        {t:'Lo invitas a unirse a tu grupo.',ok:true},
        {t:'Les dices a tus amigos que es raro.',ok:false},
        {t:'Le sacas una foto y la publicas.',ok:false}
      ]},
    { tag:'APODOS OFENSIVOS', icon:'😔',
      q:'Un grupo pone apodos crueles a un alumno. ¿Qué haces?',
      opts:[
        {t:'Te ríes para no ser el objetivo.',ok:false},
        {t:'Pides que paren y apoyas al alumno afectado.',ok:true},
        {t:'Inventas nuevos apodos.',ok:false},
        {t:'Observas sin hacer nada.',ok:false}
      ]},
    { tag:'NOTICIAS FALSAS', icon:'📰',
      q:'Alguien difunde un rumor falso. ¿Qué haces?',
      opts:[
        {t:'Lo compartes con más compañeros.',ok:false},
        {t:'Lo verificas y avisas que es falso.',ok:true},
        {t:'Añades detalles dramáticos.',ok:false},
        {t:'Lo ignoras.',ok:false}
      ]},
    { tag:'TESTIGO', icon:'😰',
      q:'Ves a un amigo amenazado verbalmente. ¿Qué haces?',
      opts:[
        {t:'Grabas un video para las redes.',ok:false},
        {t:'Te alejas rápidamente.',ok:false},
        {t:'Intervienes y llamas a un profesor.',ok:true},
        {t:'Te quedas mirando.',ok:false}
      ]},
    { tag:'EMPATÍA', icon:'🌍',
      q:'Un alumno nuevo tiene problemas con el idioma. ¿Qué haces?',
      opts:[
        {t:'Evitas hablarle.',ok:false},
        {t:'Haces gestos de exclusión.',ok:false},
        {t:'Te acercas con paciencia y lo ayudas.',ok:true},
        {t:'Te ríes de sus intentos.',ok:false}
      ]},
  ],
};

// ─── SAVE DATA ────────────────────────────────────────────
let SD = {
  name:'', avatarIdx:0, xp:0, coins:0, gems:0,
  bestScore:0, totalGames:0, theme:'dark', lang:'pt',
  purchased:{}, active:{},
  powerCharges:{ shield:1, speed:1, magnet:1, slowmo:1 },
  loggedEmail:null,
};

function getAccounts(){ try{ return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||'{}'); }catch(e){ return {}; } }
function saveAccounts(db){ try{ localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(db)); }catch(e){} }

function loadSave(){
  try{
    const r=localStorage.getItem(SAVE_KEY);
    if(r) Object.assign(SD, JSON.parse(r));
  }catch(e){}
  SD.purchased    = SD.purchased    || {};
  SD.active       = SD.active       || {};
  SD.powerCharges = SD.powerCharges || { shield:1, speed:1, magnet:1, slowmo:1 };
  ['shield','speed','magnet','slowmo'].forEach(k=>{ if(SD.powerCharges[k]==null) SD.powerCharges[k]=1; });
  SD.gems         = SD.gems      || 0;
  SD.bestScore    = SD.bestScore || 0;
  SD.totalGames   = SD.totalGames|| 0;
}

function writeSave(){
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(SD)); }catch(e){}
  if(SD.loggedEmail){
    const db=getAccounts();
    if(db[SD.loggedEmail]) db[SD.loggedEmail].gameData = JSON.parse(JSON.stringify(SD));
    saveAccounts(db);
  }
}

function addXP(amt){
  if(SD.xp>=MAX_XP) return;
  SD.xp = Math.min(MAX_XP, SD.xp+amt);
  if(SD.xp>=MAX_XP) flashMaxLevel();
  writeSave(); refreshXPBar();
}

function tx(){ return T[SD.lang]||T.pt; }

// ─── TOP RUN ──────────────────────────────────────────────
function getTop(){ try{ return JSON.parse(localStorage.getItem(TOP_KEY)||'[]'); }catch(e){ return []; } }
function setTop(arr){ try{ localStorage.setItem(TOP_KEY,JSON.stringify(arr)); }catch(e){} }

function addTopEntry(score, dist){
  if(score<=0) return;
  const arr=getTop();
  arr.push({
    id: Date.now()+'_'+Math.random().toString(36).slice(2,7),
    name: (SD.name||'Anônimo').trim()||'Anônimo',
    score: Math.floor(score),
    dist: Math.floor(dist),
    date: new Date().toLocaleDateString(),
    email: SD.loggedEmail||null,
  });
  arr.sort((a,b)=>b.score-a.score);
  setTop(arr.slice(0,TOP_MAX));
}

let _topTab='local';
function renderTopRun(tab){
  _topTab=tab;
  document.getElementById('tabLocal').classList.toggle('active',  tab==='local');
  document.getElementById('tabGlobal').classList.toggle('active', tab==='global');
  const list=document.getElementById('topList');
  list.innerHTML='';
  const all=getTop();
  if(all.length===0){
    list.innerHTML=`<div class="top-empty">${tab==='local'?tx().localEmpty:tx().globalEmpty}</div>`;
    return;
  }
  // local = entries belonging to this player; global = all
  let display;
  if(tab==='global'){
    display=all.slice(0,10);
  } else {
    display=all.filter(e=>{
      if(SD.loggedEmail && e.email===SD.loggedEmail) return true;
      if(!e.email && (SD.name&&e.name===SD.name.trim())) return true;
      return false;
    }).slice(0,10);
    if(display.length===0){
      list.innerHTML=`<div class="top-empty">${tx().localEmpty}</div>`;
      return;
    }
  }
  display.forEach((e,i)=>{
    const rc=i===0?'rank-gold':i===1?'rank-silver':i===2?'rank-bronze':'rank-other';
    const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1;
    const isMe=(SD.loggedEmail&&e.email===SD.loggedEmail)||(!e.email&&SD.name&&e.name===SD.name.trim());
    const d=document.createElement('div');
    d.className='top-entry'+(isMe?' is-me':'');
    d.innerHTML=`
      <div class="top-rank ${rc}">${medal}</div>
      <div class="top-info">
        <div class="top-name">${e.name}${isMe?' (você)':''}</div>
        <div class="top-meta">📅 ${e.date} · 📏 ${e.dist}m</div>
      </div>
      <div class="top-score-val">${e.score.toLocaleString()}</div>`;
    list.appendChild(d);
  });
}
function showTopTab(tab){ renderTopRun(tab); }

// ─── AUTH ─────────────────────────────────────────────────
let _authTab='login';
function switchAuthTab(tab){
  _authTab=tab;
  document.getElementById('tabLogin').classList.toggle('active',    tab==='login');
  document.getElementById('tabRegister').classList.toggle('active', tab==='register');
  document.getElementById('registerNameField').style.display = tab==='register'?'block':'none';
  document.getElementById('authSubmitBtn').textContent = tab==='login'?('🔑 '+tx().loginLbl):('✨ '+tx().registerLbl);
  document.getElementById('authError').classList.remove('show');
  document.getElementById('authSuccess').classList.remove('show');
}
function handleAuth(){
  const t=tx();
  const email=document.getElementById('authEmail').value.trim().toLowerCase();
  const pass =document.getElementById('authPassword').value;
  const errEl=document.getElementById('authError');
  const okEl =document.getElementById('authSuccess');
  errEl.classList.remove('show'); okEl.classList.remove('show');
  if(!email.includes('@')||!email.includes('.')){ errEl.textContent=t.errEmail; errEl.classList.add('show'); return; }
  if(pass.length<6){ errEl.textContent=t.errPass; errEl.classList.add('show'); return; }
  const db=getAccounts();
  if(_authTab==='register'){
    const nm=document.getElementById('authName').value.trim()||email.split('@')[0];
    if(db[email]){ errEl.textContent=t.errExists; errEl.classList.add('show'); return; }
    db[email]={ email, pass, name:nm, gameData:{...SD,loggedEmail:email,name:nm} };
    saveAccounts(db);
    okEl.textContent=t.okRegister; okEl.classList.add('show');
    setTimeout(()=>doLogin(email,db[email]),1200);
  } else {
    if(!db[email]){ errEl.textContent=t.errNoAcc; errEl.classList.add('show'); return; }
    if(db[email].pass!==pass){ errEl.textContent=t.errWrongPass; errEl.classList.add('show'); return; }
    okEl.textContent=t.okLogin; okEl.classList.add('show');
    setTimeout(()=>doLogin(email,db[email]),800);
  }
}
function doLogin(email,account){
  if(account.gameData){
    const cd=account.gameData;
    SD.coins      =Math.max(SD.coins,      cd.coins||0);
    SD.gems       =Math.max(SD.gems,       cd.gems||0);
    SD.xp         =Math.max(SD.xp,         cd.xp||0);
    SD.bestScore  =Math.max(SD.bestScore,  cd.bestScore||0);
    SD.totalGames =Math.max(SD.totalGames, cd.totalGames||0);
    if(cd.purchased) Object.assign(SD.purchased, cd.purchased);
    if(cd.powerCharges){ for(const k in cd.powerCharges) SD.powerCharges[k]=Math.max(SD.powerCharges[k]||0,cd.powerCharges[k]||0); }
    if(cd.name&&!SD.name) SD.name=cd.name;
  }
  SD.loggedEmail=email;
  if(!SD.name) SD.name=account.name||email.split('@')[0];
  document.getElementById('nameInp').value=SD.name;
  writeSave(); refreshAll();
  updateLoggedUI();
  showScreen('menuScreen');
}
function doLogout(){
  SD.loggedEmail=null;
  writeSave(); updateLoggedUI();
  showScreen('menuScreen');
}
function updateLoggedUI(){
  const t=tx();
  const is=!!SD.loggedEmail;
  const cb=document.getElementById('cloudBadge');
  cb.style.display=is?'flex':'none';
  if(is) document.getElementById('cloudBadgeText').textContent=t.cloudHello(SD.name||'Jogador');
  document.getElementById('loggedPanel').style.display=is?'block':'none';
  document.getElementById('authPanel').style.display  =is?'none':'block';
  if(is){
    const all=getAvatarList();
    document.getElementById('loggedAvatar').textContent=all[Math.min(SD.avatarIdx,all.length-1)];
    document.getElementById('loggedName').textContent =SD.name||SD.loggedEmail;
    document.getElementById('loggedEmail').textContent=SD.loggedEmail;
  }
}

// ─── CANVAS ───────────────────────────────────────────────
const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
let TG={}; // track geometry

function resizeCanvas(){
  canvas.width =window.innerWidth;
  canvas.height=window.innerHeight;
  const W=canvas.width, H=canvas.height;
  TG={ vx:W/2, vy:H*0.28, by:H*0.92, hw:W*0.42, W, H };
  if(!G.running) drawMenuBg();
}
window.addEventListener('resize',resizeCanvas);

// ─── AUDIO ────────────────────────────────────────────────
let AC=null, musicOn=true, bgRunning=false, bgTimer=null;
let mStep=0, mPat=0, mBPM=130;
const M_NOTES=[261,294,330,349,392,440,494,523];
const M_PATS=[[0,2,4,5,7,5,4,2],[0,4,7,4,0,4,7,9],[7,5,4,2,0,2,4,5],[0,2,4,7,9,7,4,2]];

function ensureAudio(){
  if(!AC){ try{ AC=new(window.AudioContext||window.webkitAudioContext)(); }catch(e){ AC=null; } }
  if(AC&&AC.state==='suspended') AC.resume().catch(()=>{});
  return !!AC;
}
function note(f,d,v=0.28,t='triangle',delay=0){
  if(!AC||!musicOn) return;
  try{
    const o=AC.createOscillator(), g=AC.createGain();
    o.connect(g); g.connect(AC.destination);
    o.type=t; o.frequency.value=f;
    const s=AC.currentTime+delay;
    g.gain.setValueAtTime(0,s);
    g.gain.linearRampToValueAtTime(v,s+0.02);
    g.gain.exponentialRampToValueAtTime(0.001,s+d);
    o.start(s); o.stop(s+d+0.05);
  }catch(e){}
}
function sfx(type){
  if(!ensureAudio()) return;
  switch(type){
    case 'coin':    note(880,.08,.18,'sine'); note(1320,.1,.14,'sine',.07); break;
    case 'gem':     note(660,.05,.18,'sine'); note(880,.05,.18,'sine',.05); note(1100,.12,.18,'sine',.1); break;
    case 'jump':    try{ const o=AC.createOscillator(),g=AC.createGain(); o.connect(g); g.connect(AC.destination); o.type='triangle'; const s=AC.currentTime; o.frequency.setValueAtTime(300,s); o.frequency.exponentialRampToValueAtTime(600,s+.15); g.gain.setValueAtTime(.22,s); g.gain.exponentialRampToValueAtTime(.001,s+.25); o.start(s); o.stop(s+.3); }catch(e){} break;
    case 'shield':  [220,330,440,660].forEach((f,i)=>note(f,.15,.16,'sine',i*.06)); break;
    case 'hit':     try{ const o=AC.createOscillator(),g=AC.createGain(); o.connect(g); g.connect(AC.destination); o.type='sawtooth'; const s=AC.currentTime; o.frequency.setValueAtTime(150,s); o.frequency.exponentialRampToValueAtTime(50,s+.3); g.gain.setValueAtTime(.38,s); g.gain.exponentialRampToValueAtTime(.001,s+.35); o.start(s); o.stop(s+.4); }catch(e){} break;
    case 'power':   [440,550,660,880].forEach((f,i)=>note(f,.2,.14,'triangle',i*.05)); break;
    case 'correct': [523,659,784,1047].forEach((f,i)=>note(f,.18,.18,'sine',i*.08)); break;
    case 'wrong':   note(220,.3,.28,'sawtooth'); note(180,.4,.22,'sawtooth',.15); break;
    case 'levelup': [523,659,784,659,784,1047].forEach((f,i)=>note(f,.18,.22,'sine',i*.12)); break;
    case 'gameover':[440,330,220,165].forEach((f,i)=>note(f,.35,.28,'sawtooth',i*.18)); break;
    case 'click':   note(880,.05,.09,'sine'); break;
    case 'perfect': [523,659,784,1047,784,1047,1319].forEach((f,i)=>note(f,.2,.2,'sine',i*.1)); break;
    // Victory fanfare — played exactly once when record is beaten
    case 'victory':
      [523,659,784,523,659,784,1047,784,1047,1319,1047,1319,1568].forEach((f,i)=>note(f,.22,.26,'sine',i*.1));
      [392,494,587].forEach((f,i)=>note(f,.9,.11,'triangle',.5+i*.04));
      break;
  }
}
function startBGMusic(){
  if(bgRunning||!AC||!musicOn||!G.running) return;
  bgRunning=true;
  function tick(){
    if(!bgRunning||!AC||!musicOn||!G.running){ bgRunning=false; return; }
    const pat=M_PATS[mPat%M_PATS.length];
    const f=M_NOTES[pat[mStep%pat.length]];
    const bpm=Math.min(185,mBPM+G.speedRamp*45);
    note(f/2,.18,.11,'triangle');
    if(mStep%2===0) note(f*2,.12,.07,'sine');
    mStep++;
    if(mStep%8===0) mPat++;
    bgTimer=setTimeout(tick,(60/bpm)*1000);
  }
  tick();
}
function stopBGMusic(){ clearTimeout(bgTimer); bgTimer=null; bgRunning=false; }
function toggleMusic(){
  musicOn=!musicOn;
  document.getElementById('musicToggle').textContent=musicOn?'🎵':'🔇';
  if(musicOn&&G.running){ ensureAudio(); stopBGMusic(); startBGMusic(); }
  else stopBGMusic();
}

// ─── GAME STATE ───────────────────────────────────────────
const G={
  running:false, paused:false, gameOverCalled:false,
  lane:1, tLane:1, laneT:1,
  speed:0, speedRamp:0,
  score:0, coins:0, gems:0, xpEarned:0, dist:0,
  obstacles:[], items:[], particles:[],
  oTimer:0, cTimer:0,
  dTimer:0, dInterval:28,
  dShown:[], dQueue:[],
  bobT:0, bgOff:0,
  shieldOn:false, xpMult:false, coinBoost:false,
  lives:MAX_LIVES,
  qAnswered:0, qCorrect:0, qWrong:0,
  perfectRun:true, allQDone:false,
  lastTS:0, raf:null,
  dilemaOpen:false,
  recordBeaten:false,
  powers:[
    {active:false,cd:0,left:0,charges:0},
    {active:false,cd:0,left:0,charges:0},
    {active:false,cd:0,left:0,charges:0},
    {active:false,cd:0,left:0,charges:0},
  ],
  slowmo:false, magnet:false, speedBoost:false,
  decors:[],
};

// ─── HELPERS ──────────────────────────────────────────────
function laneX(idx,z){
  const s=(TG.hw*2*z)/LANES;
  return { x:(TG.vx-TG.hw*z+s/2)+idx*s, y:TG.vy+(TG.by-TG.vy)*z };
}
function ease(t){ return t<.5?2*t*t:-1+(4-2*t)*t; }
function isMob(){ return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||window.innerWidth<768; }
function rr(c,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  c.beginPath();
  c.moveTo(x+r,y); c.lineTo(x+w-r,y); c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r); c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h); c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r); c.quadraticCurveTo(x,y,x+r,y); c.closePath();
}
function obsW(z){ return TG.hw*2*z/LANES*.82; }

// ─── UI HELPERS ───────────────────────────────────────────
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  if(id) document.getElementById(id).classList.add('active');
}
function el(id){ return document.getElementById(id); }
function setText(id,v){ const e=el(id); if(e) e.textContent=v; }

function floatNotif(msg, cls){
  const e=el('floatNotif');
  e.className=cls||''; e.textContent=msg;
  e.style.display='block'; e.style.animation='none'; void e.offsetWidth;
  e.style.animation='fadeInOut 2.8s ease forwards';
  clearTimeout(e._t); e._t=setTimeout(()=>e.style.display='none',2900);
}

function flashRecord(){
  const e=el('recordNotif');
  e.textContent=tx().recordBroken;
  e.style.display='block'; e.style.animation='none'; void e.offsetWidth;
  e.style.animation='fadeInOut 3.5s ease forwards';
  setTimeout(()=>e.style.display='none',3600);
}

function flashMaxLevel(){
  const e=el('maxLvlBadge');
  e.textContent=tx().maxLvl;
  e.style.display='block'; e.style.animation='none'; void e.offsetWidth;
  e.style.animation='fadeInOut 3s ease forwards';
  setTimeout(()=>e.style.display='none',3100);
  sfx('levelup');
}

function flashLifeLost(){
  const e=el('lifeLostFlash');
  e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash');
  setTimeout(()=>e.classList.remove('flash'),600);
}

function shieldPop(){
  const e=el('shieldIndicator');
  e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop');
  setTimeout(()=>e.classList.remove('pop'),700);
}

function refreshXPBar(){
  const p=Math.min(100,(SD.xp/MAX_XP)*100);
  el('xpBarFill').style.width=p+'%';
  el('xpCurrent').textContent=SD.xp;
  el('xpLvlLabel').textContent=SD.xp>=MAX_XP?tx().maxLvl:'';
}

function refreshStats(){
  el('statBest').textContent  =SD.bestScore;
  el('statCoins').textContent =SD.coins;
  el('statGems').textContent  =SD.gems;
  el('statGames').textContent =SD.totalGames;
  const tot=Object.values(SD.powerCharges).reduce((a,b)=>a+b,0);
  el('statPowers').textContent=tot;
  el('shopCoins').textContent =SD.coins;
  el('shopGems').textContent  =SD.gems;
}

function refreshAll(){ refreshStats(); refreshXPBar(); updateAvatar(); updateLoggedUI(); }

function updateAvatar(){
  const all=getAvatarList();
  el('avatarBtn').textContent=all[Math.min(SD.avatarIdx,all.length-1)];
}
function getAvatarList(){
  const a=[...AVATARS_BASE];
  if(SD.purchased.avatar1) a.push('🦸');
  if(SD.purchased.avatar2) a.push('🧙');
  return a;
}

function refreshLivesHUD(){
  const maxL=(SD.active&&SD.active.extraLife)?MAX_LIVES+1:MAX_LIVES;
  const h='❤️'.repeat(Math.max(0,G.lives))+'🖤'.repeat(Math.max(0,maxL-G.lives));
  el('hudLives').textContent=h;
  el('dilemaLives').textContent=h;
}

function refreshHUD(){
  el('hudScore').textContent=Math.floor(G.score);
  el('hudCoins').textContent=G.coins;
  el('hudGems').textContent =G.gems;
  el('hudDist').textContent =Math.floor(G.dist)+'m';
  el('hudShield').style.display=G.shieldOn?'flex':'none';
}

// ─── POWER BAR ────────────────────────────────────────────
function refreshPowerBar(){
  G.powers.forEach((p,i)=>{
    const icon=el('picon'+i), cd=el('pcd'+i);
    icon.className='power-icon';
    cd.style.display='none';
    if(p.active){
      icon.classList.add('active-power');
    } else if(p.cd>0){
      icon.classList.add('on-cooldown');
      cd.style.display='flex'; cd.textContent=Math.ceil(p.cd)+'s';
    } else if(p.charges>0){
      icon.classList.add('ready');
    } else {
      icon.classList.add('no-charge');
      cd.style.display='flex'; cd.textContent='0';
    }
  });
}

// ─── THEME & LANG ─────────────────────────────────────────
function applyTheme(th){
  document.body.className='theme-'+th;
  SD.theme=th; writeSave();
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.dataset.theme===th));
  if(!G.running) drawMenuBg();
}

function applyLang(l){
  SD.lang=l; writeSave();
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
  const t=tx();
  const s=(id,v)=>setText(id,v);
  s('menuTitle',t.menuTitle);
  s('lblName',t.lblName); s('lblXP',t.lblXP); s('lblTheme',t.lblTheme); s('lblLang',t.lblLang);
  s('statBestKey',t.statBestKey); s('statCoinsKey',t.statCoinsKey); s('statGamesKey',t.statGamesKey);
  s('shopTitle',t.shopTitle); s('shopBackLbl',t.shopBackLbl);
  s('goTitle',t.goTitle); s('goScoreKey',t.goScoreKey); s('goDistKey',t.goDistKey);
  s('goCoinsKey',t.goCoinsKey); s('goGemsKey',t.goGemsKey);
  s('goXpLabel',t.goXpLabel); s('goQLabel',t.goQLabel);
  s('replayLbl',t.replayLbl); s('goMenuLbl',t.goMenuLbl);
  s('splashSub',t.splashSub);
  s('themeD',t.themeD); s('themeL',t.themeL); s('themeBW',t.themeBW);
  s('perfectTitle',t.perfectTitle);
  s('perfectContinueBtn',t.perfectContinue);
  s('perfectMenuLbl',t.perfectMenu);
  s('pScoreKey',t.pScoreKey); s('pDistKey',t.pDistKey); s('pXPKey',t.pXPKey); s('pCoinsKey',t.pCoinsKey);
  s('powerBarHint',t.powerBarHint);
  s('topRunTitle',t.topRunTitle); s('topBackLbl',t.topBackLbl);
  s('loginTitle',t.loginTitle); s('loginBtnLbl',t.loginBtnLbl);
  s('cloudSyncInfo',t.cloudSync);
  s('syncNowLbl',t.syncNowLbl); s('logoutLbl',t.logoutLbl); s('loginBackLbl',t.loginBackLbl);
  s('lblEmail',t.lblEmail); s('lblPassword',t.lblPassword); s('lblRegName',t.lblRegName);
  s('authFootnote',t.authNote);
  t.powerNames.forEach((n,i)=>setText('plbl'+i,n));
  el('authSubmitBtn').textContent=_authTab==='login'?('🔑 '+t.loginLbl):('✨ '+t.registerLbl);
  updateLoggedUI();
  renderShop();
}

// ─── SHOP ─────────────────────────────────────────────────
function renderShop(){
  const t=tx();
  const grid=el('shopGrid');
  grid.innerHTML='';
  const secs=[
    ['buy50coins','buy200coins','buy5gems','buy20gems'],
    ['shieldCharge','speedCharge','magnetCharge','slowCharge'],
    ['xpMult','coinBoost','extraLife','avatar1','avatar2'],
  ];
  secs.forEach((ids,si)=>{
    const td=document.createElement('div');
    td.className='shop-section-title'; td.textContent=t.shopSec[si];
    grid.appendChild(td);
    ids.forEach(itemId=>{
      const item=SHOP_ITEMS.find(i=>i.id===itemId); if(!item) return;
      const info=t.shopItems[itemId];
      const bought=!!(SD.purchased&&SD.purchased[itemId]);
      const isCoin=item.cur==='coin';
      const wallet=isCoin?SD.coins:SD.gems;
      const afford=wallet>=item.cost;
      let btn='';
      if(item.type==='unlock'&&bought){
        btn=`<button class="btn sm outline" disabled>✓ ${t.boughtBtn}</button>`;
      } else if(item.type==='charge'){
        const ck=itemId.replace('Charge','');
        const chg=SD.powerCharges[ck]||0;
        btn=`<div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
          <span style="font-size:.7rem;color:var(--subtext)">×${chg}</span>
          <button class="btn sm${afford?'':' danger'}" data-buy="${itemId}"${afford?'':' disabled'}>
            ${afford?t.buyBtn:(isCoin?t.noCoins:t.noGems)} ${isCoin?'🪙':'💎'}${item.cost}</button>
        </div>`;
      } else {
        btn=`<button class="btn sm${afford?'':' danger'}" data-buy="${itemId}"${afford?'':' disabled'}>
          ${afford?t.buyBtn:(isCoin?t.noCoins:t.noGems)} ${isCoin?'🪙':'💎'}${item.cost}</button>`;
      }
      const div=document.createElement('div');
      div.className='shop-item';
      div.innerHTML=`<div class="si-icon">${item.icon}</div>
        <div class="si-info">
          <div class="si-name">${info.name}</div>
          <div class="si-desc">${info.desc}</div>
          <div class="si-price ${isCoin?'coin-price':'gem-price'}">${isCoin?'🪙':'💎'} ${item.cost}</div>
        </div>
        <div class="si-action">${btn}</div>`;
      grid.appendChild(div);
    });
  });
  grid.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{ sfx('click'); buyItem(b.dataset.buy); }));
}

function buyItem(id){
  const item=SHOP_ITEMS.find(i=>i.id===id); if(!item) return;
  const isCoin=item.cur==='coin';
  if((isCoin?SD.coins:SD.gems)<item.cost) return;
  if(isCoin) SD.coins-=item.cost; else SD.gems-=item.cost;
  switch(item.type){
    case 'pack':
      if(id==='buy50coins')  SD.coins+=50;
      if(id==='buy200coins') SD.coins+=200;
      if(id==='buy5gems')    SD.gems+=5;
      if(id==='buy20gems')   SD.gems+=20;
      break;
    case 'charge':
      SD.powerCharges[id.replace('Charge','')]=(SD.powerCharges[id.replace('Charge','')]||0)+1;
      break;
    case 'unlock':
      SD.purchased[id]=true;
      if(id!=='avatar1'&&id!=='avatar2') SD.active[id]=true;
      break;
  }
  writeSave(); updateAvatar(); refreshStats(); renderShop(); sfx('coin');
}

// ─── POWERS ───────────────────────────────────────────────
function activatePower(i){
  if(!G.running||G.paused) return;
  const p=G.powers[i], def=POWERS_DEF[i], t=tx();
  if(p.active||p.cd>0) return;
  if(p.charges<=0){ floatNotif(t.powerNo(t.powerNames[i]),'notif-warn'); return; }
  p.charges--; p.active=true; p.left=def.dur; p.cd=0;
  floatNotif(t.powerOk(t.powerNames[i]),'notif-power');
  sfx('power');
  if(i===0){ G.shieldOn=true; sfx('shield'); }
  else if(i===1) G.speedBoost=true;
  else if(i===2) G.magnet=true;
  else if(i===3) G.slowmo=true;
  refreshPowerBar();
}

function tickPowers(dt){
  G.powers.forEach((p,i)=>{
    if(p.cd>0) p.cd=Math.max(0,p.cd-dt);
    if(p.active){
      p.left-=dt;
      if(p.left<=0){
        p.active=false; p.cd=POWERS_DEF[i].cd;
        if(i===0) G.shieldOn=false;
        else if(i===1) G.speedBoost=false;
        else if(i===2) G.magnet=false;
        else if(i===3) G.slowmo=false;
      }
    }
  });
  refreshPowerBar();
}

// ─── START GAME ───────────────────────────────────────────
function startGame(){
  ensureAudio(); resizeCanvas();
  menuBgStop();

  const pool=DILEMMAS[SD.lang];
  const queue=pool.map((_,i)=>i).sort(()=>Math.random()-.5);
  const maxL=(SD.active&&SD.active.extraLife)?MAX_LIVES+1:MAX_LIVES;
  const chg=[SD.powerCharges.shield||0,SD.powerCharges.speed||0,SD.powerCharges.magnet||0,SD.powerCharges.slowmo||0];
  const decors=Array.from({length:14},(_,i)=>({side:i%2?'right':'left',z:i/14,type:Math.floor(Math.random()*4)}));

  Object.assign(G,{
    running:true, paused:false, gameOverCalled:false,
    lane:1, tLane:1, laneT:1,
    speed:BASE_SPEED, speedRamp:0,
    score:0, coins:0, gems:0, xpEarned:0, dist:0,
    obstacles:[], items:[], particles:[],
    oTimer:0, cTimer:0,
    dTimer:0, dInterval:28,
    dShown:[], dQueue:[...queue],
    bobT:0, bgOff:0,
    shieldOn:false,
    xpMult:!!(SD.active&&SD.active.xpMult),
    coinBoost:!!(SD.active&&SD.active.coinBoost),
    lives:maxL,
    qAnswered:0, qCorrect:0, qWrong:0,
    perfectRun:true, allQDone:false,
    dilemaOpen:false, recordBeaten:false,
    slowmo:false, magnet:false, speedBoost:false,
    powers:POWERS_DEF.map((d,i)=>({active:false,cd:0,left:0,charges:chg[i]})),
    decors,
  });

  // Consume one-shot active items
  if(SD.active.xpMult)   { SD.active.xpMult=false;   writeSave(); }
  if(SD.active.coinBoost){ SD.active.coinBoost=false; writeSave(); }
  if(SD.active.extraLife){ SD.active.extraLife=false; writeSave(); }

  SD.totalGames++; writeSave(); refreshStats();

  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  el('perfectScreen').classList.remove('active');
  el('hud').classList.add('active');
  el('powerBar').classList.add('active');
  el('musicToggle').classList.add('active');
  if(isMob()) el('mobileHint').classList.add('visible');

  refreshHUD(); refreshLivesHUD(); refreshPowerBar();

  mStep=0; mPat=0; mBPM=130;
  stopBGMusic();
  if(musicOn){ startBGMusic(); }

  G.lastTS=performance.now();
  if(G.raf) cancelAnimationFrame(G.raf);
  G.raf=requestAnimationFrame(loop);
}

// ─── GAME LOOP ────────────────────────────────────────────
function loop(ts){
  if(!G.running) return;
  const dt=Math.min((ts-G.lastTS)/1000,.05);
  G.lastTS=ts;
  if(!G.paused) update(dt);
  render();
  G.raf=requestAnimationFrame(loop);
}

function update(dt){
  G.speedRamp=Math.min(G.speedRamp+dt*SPEED_RAMP,1);
  const slow=G.slowmo?.35:1;
  G.speed=BASE_SPEED+(MAX_SPEED-BASE_SPEED)*ease(G.speedRamp);
  G.dist+=G.speed*dt*4;
  G.score+=G.speed*dt*10;
  G.bobT+=dt*3;
  G.bgOff+=G.speed*dt*20*slow;

  tickPowers(dt);

  // Lane transition
  if(G.lane!==G.tLane){
    G.laneT=Math.min(1,G.laneT+dt*7);
    if(G.laneT>=1){ G.laneT=1; G.lane=G.tLane; }
  }

  // Record check — only once
  if(!G.recordBeaten && SD.bestScore>0 && Math.floor(G.score)>SD.bestScore){
    G.recordBeaten=true;
    flashRecord();
    sfx('victory');
  }

  // Dilema timer
  if(!G.allQDone && G.dQueue.length>0){
    G.dTimer+=dt;
    if(G.dTimer>=G.dInterval){ G.dTimer=0; openDilema(); return; }
  }

  // Spawn obstacles
  G.oTimer+=dt;
  const oi=Math.max(2.2,5.5-G.speedRamp*3);
  if(G.oTimer>=oi){ G.oTimer=0; spawnObs(); }

  // Spawn collectibles
  G.cTimer+=dt;
  const ci=Math.max(.7,2-G.speedRamp*1.2);
  if(G.cTimer>=ci){ G.cTimer=0; spawnItem(); }

  const mv=G.speed*.45*slow;

  // Speed boost clears obstacles in player's path
  if(G.speedBoost){
    G.obstacles=G.obstacles.filter(o=>{
      if(Math.abs(o.z-.87)<.15){
        const p=laneX(o.lane,o.z); burst(p.x,p.y,'#fbbf24',8); return false;
      }
      return true;
    });
  }

  // Move decors
  G.decors.forEach(d=>{
    d.z+=dt*mv*.7;
    if(d.z>=1.05){ d.z=0; d.type=Math.floor(Math.random()*4); d.side=Math.random()<.5?'left':'right'; }
  });

  G.obstacles=G.obstacles.filter(o=>{ o.z+=dt*mv; return o.z<1.08; });

  G.items=G.items.filter(c=>{
    c.z+=dt*mv;
    // Magnet pulls items toward player lane
    if(G.magnet&&!c.done){
      const pz=.87;
      if(c.z>.4&&c.z<pz+.12){
        const diff=G.tLane-c.lane;
        if(Math.abs(diff)>.05) c.lane+=diff*.05;
      }
    }
    if(c.done){ c.alpha-=dt*4; return c.alpha>0; }
    return c.z<1.08;
  });

  G.particles=G.particles.filter(p=>{
    p.x+=p.vx*dt; p.y+=p.vy*dt; p.alpha-=dt*2.2; p.sz-=dt*9;
    return p.alpha>0&&p.sz>0;
  });

  checkHits();
  refreshHUD();
}

function spawnObs(){
  G.obstacles.push({ lane:Math.floor(Math.random()*LANES), z:.01, hit:false, variant:Math.floor(Math.random()*3) });
}
function spawnItem(){
  const lane=Math.floor(Math.random()*LANES);
  const type=Math.random()<.7?'coin':'gem';
  if(type==='coin'&&Math.random()<.4){
    for(let i=0;i<3;i++) G.items.push({lane,z:.01+i*.06,type:'coin',done:false,alpha:1,bob:Math.random()*Math.PI*2});
  } else {
    G.items.push({lane,z:.01,type,done:false,alpha:1,bob:Math.random()*Math.PI*2});
  }
}

function checkHits(){
  const pz=.87;
  const active=new Set([G.lane,G.tLane]);

  G.obstacles.forEach(o=>{
    if(o.hit) return;
    if(!active.has(Math.round(o.lane))) return;
    if(Math.abs(o.z-pz)<.09){
      o.hit=true;
      if(G.shieldOn){
        // Shield absorbs ONE hit — deactivate shield power
        G.powers[0].active=false;
        G.powers[0].cd=POWERS_DEF[0].cd;
        G.shieldOn=false;
        shieldPop(); sfx('shield');
        const p=laneX(o.lane,o.z); burst(p.x,p.y,'#a855f7',14);
      } else {
        sfx('hit');
        endGame();
      }
    }
  });

  G.items.forEach(c=>{
    if(c.done) return;
    if(!active.has(Math.round(c.lane))) return;
    if(Math.abs(c.z-pz)<.07){
      c.done=true;
      const p=laneX(c.lane,c.z);
      if(c.type==='coin'){
        const v=G.coinBoost?2:1;
        G.coins+=v; G.score+=10*v;
        burst(p.x,p.y,'#fbbf24',6); sfx('coin');
      } else {
        G.gems++;
        G.xpEarned+=G.xpMult?40:20;
        burst(p.x,p.y,'#60a5fa',8); sfx('gem');
      }
    }
  });
}

function burst(x,y,col,n){
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, s=50+Math.random()*110;
    G.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-55,alpha:1,sz:5+Math.random()*6,col});
  }
}

// ─── DILEMA ───────────────────────────────────────────────
function openDilema(){
  if(G.dilemaOpen||G.dQueue.length===0) return;
  G.paused=true; G.dilemaOpen=true;

  const pool=DILEMMAS[SD.lang];
  const idx=G.dQueue.shift();
  const d=pool[idx];
  const t=tx();

  el('dilemaIcon').textContent=d.icon;
  el('dilemaTag').textContent=t.dilemaTag+': '+d.tag;
  el('dilemaQ').textContent=d.q;
  el('dilemaResult').className='dilema-result';
  el('dilemaResult').textContent='';
  refreshLivesHUD();

  const opts=el('dilemaOpts');
  opts.innerHTML='';
  const shuffled=[...d.opts].sort(()=>Math.random()-.5);
  shuffled.forEach((opt,i)=>{
    const b=document.createElement('button');
    b.className='dilema-opt';
    b.innerHTML=`<span class="opt-letter">${LETTERS[i]}</span><span>${opt.t}</span>`;
    b.addEventListener('click',()=>answerDilema(b,opt.ok,opts,shuffled));
    opts.appendChild(b);
  });

  // Timer bar
  el('dilemaTimerFill').style.transition='none';
  el('dilemaTimerFill').style.width='100%';
  void el('dilemaTimerFill').offsetWidth;
  el('dilemaTimerFill').style.transition=`width ${DILEMA_TIME}ms linear`;
  el('dilemaTimerFill').style.width='0%';

  el('dilemaModal').classList.add('active');

  clearTimeout(G._dTimeout); clearInterval(G._dInterval);
  G._dTimeout=setTimeout(()=>dilemaTimeout(opts,shuffled), DILEMA_TIME);
}

function answerDilema(btn,correct,opts,shuffled){
  if(!G.dilemaOpen) return;
  clearTimeout(G._dTimeout); clearInterval(G._dInterval);
  // Stop timer bar
  const tf=el('dilemaTimerFill');
  tf.style.transition='none';
  tf.style.width=tf.style.width; // freeze

  opts.querySelectorAll('.dilema-opt').forEach(b=>b.disabled=true);
  btn.disabled=false;
  btn.classList.add(correct?'correct':'wrong');
  if(!correct) opts.querySelectorAll('.dilema-opt').forEach((b,i)=>{ if(shuffled[i].ok) b.classList.add('correct'); });

  G.qAnswered++;
  const t=tx();
  const res=el('dilemaResult');

  if(correct){
    G.qCorrect++;
    const xpAdd=G.xpMult?1000:500;
    G.xpEarned+=xpAdd; G.score+=500; G.coins+=50;
    res.textContent=t.correctMsg; res.className='dilema-result correct-res';
    sfx('correct');
    if(G.dQueue.length===0&&G.perfectRun){
      setTimeout(()=>{ closeDilema(); showPerfect(); },1800);
    } else {
      setTimeout(()=>closeDilema(),1600);
    }
  } else {
    G.qWrong++; G.perfectRun=false;
    res.textContent=t.wrongMsg; res.className='dilema-result wrong-res';
    sfx('wrong');
    setTimeout(()=>{ closeDilema(); loseLife(); },1800);
  }
}

function dilemaTimeout(opts,shuffled){
  if(!G.dilemaOpen) return;
  clearInterval(G._dInterval);
  opts.querySelectorAll('.dilema-opt').forEach((b,i)=>{
    b.disabled=true;
    if(shuffled[i].ok) b.classList.add('correct');
  });
  G.qAnswered++; G.qWrong++; G.perfectRun=false;
  const res=el('dilemaResult');
  res.textContent=tx().timeoutMsg; res.className='dilema-result wrong-res';
  sfx('wrong');
  setTimeout(()=>{ closeDilema(); loseLife(); },1800);
}

function closeDilema(){
  if(!G.dilemaOpen) return;
  clearTimeout(G._dTimeout); clearInterval(G._dInterval);
  el('dilemaModal').classList.remove('active');
  G.dilemaOpen=false;
  G.paused=false;
}

function loseLife(){
  G.lives=Math.max(0,G.lives-1);
  refreshLivesHUD();
  flashLifeLost();
  if(G.lives<=0) setTimeout(()=>endGame(),450);
}

// ─── PERFECT ──────────────────────────────────────────────
function showPerfect(){
  G.paused=true; G.allQDone=true;
  const t=tx();
  const bXP=2000, bC=200;
  G.xpEarned+=bXP; G.coins+=bC; G.score+=1000;
  el('pScore').textContent=Math.floor(G.score);
  el('pDist').textContent=Math.floor(G.dist)+'m';
  el('pXP').textContent='+'+bXP;
  el('pCoins').textContent='+'+bC;
  el('perfectSubtitle').textContent=t.perfectSub;
  confetti(); sfx('perfect');
  el('perfectScreen').classList.add('active');
}
function confetti(){
  const c=el('confettiWrap'); c.innerHTML='';
  const cols=['#c084fc','#22c55e','#fbbf24','#60a5fa','#f472b6','#34d399','#fb923c'];
  for(let i=0;i<80;i++){
    const p=document.createElement('div'); p.className='confetti-piece';
    p.style.left=Math.random()*100+'vw';
    p.style.background=cols[Math.floor(Math.random()*cols.length)];
    p.style.animationDuration=(2+Math.random()*3)+'s';
    p.style.animationDelay=(Math.random()*2)+'s';
    const s=8+Math.random()*10; p.style.width=s+'px'; p.style.height=s+'px';
    p.style.borderRadius=Math.random()>.5?'50%':'3px';
    c.appendChild(p);
  }
}

// ─── END GAME ─────────────────────────────────────────────
function endGame(){
  if(G.gameOverCalled||!G.running) return; // Guard against double-call
  G.gameOverCalled=true;
  G.running=false;
  stopBGMusic();
  if(G.raf){ cancelAnimationFrame(G.raf); G.raf=null; }
  if(G.dilemaOpen) closeDilema();

  el('hud').classList.remove('active');
  el('powerBar').classList.remove('active');
  el('musicToggle').classList.remove('active');
  el('mobileHint').classList.remove('visible');
  el('perfectScreen').classList.remove('active');
  el('confettiWrap').innerHTML='';

  // Accumulate resources
  SD.coins+=G.coins;
  SD.gems +=G.gems;

  // Return unused power charges to saveData
  G.powers.forEach((p,i)=>{
    SD.powerCharges[POWERS_DEF[i].id]=(SD.powerCharges[POWERS_DEF[i].id]||0)+p.charges;
  });

  // XP calculation
  const scoreBonus=Math.floor(G.score/50);
  const earnedXP=(G.xpMult?G.xpEarned*2:G.xpEarned)+scoreBonus;

  // Record check
  const isNew=Math.floor(G.score)>SD.bestScore;
  if(isNew){
    SD.bestScore=Math.floor(G.score);
    if(!G.recordBeaten) sfx('victory'); // victory if not already played
    else sfx('levelup');
  } else {
    sfx('gameover');
  }

  writeSave();
  addXP(earnedXP);
  refreshAll();
  addTopEntry(G.score, G.dist);

  const t=tx();
  el('goScore').textContent=Math.floor(G.score);
  el('goDist').textContent =Math.floor(G.dist)+'m';
  el('goCoins').textContent=G.coins;
  el('goGems').textContent =G.gems;
  el('goXp').textContent   ='+'+earnedXP;
  el('goQStats').textContent=t.qStats(G.qCorrect,G.qWrong,G.qAnswered);

  const badge=el('newRecordBadge');
  badge.style.display=isNew?'block':'none';
  if(isNew) badge.textContent=t.newRecord;

  showScreen('gameOverScreen');
  menuBgStart();
}

// ─── RENDER ───────────────────────────────────────────────
function themeC(){
  const th=SD.theme;
  if(th==='light') return { skyA:'#c4b5fd',skyB:'#ede9fe',neon:'#7c3aed',star:null,trackA:'#ddd6fe',trackB:'#c4b5fd' };
  if(th==='bw')    return { skyA:'#111',skyB:'#222',neon:'#ccc',star:'rgba(200,200,200,',trackA:'#333',trackB:'#111' };
  return { skyA:'#06000f',skyB:'#120028',neon:'#c084fc',star:'rgba(220,190,255,',trackA:'#1a0040',trackB:'#080018' };
}

function render(){
  const {vx,vy,by,hw,W,H}=TG;
  const C=themeC();

  // Sky
  const sg=ctx.createLinearGradient(0,0,0,vy*1.1);
  sg.addColorStop(0,C.skyA); sg.addColorStop(1,C.skyB);
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);

  // Stars
  if(C.star){
    for(let i=0;i<80;i++){
      const tw=Math.sin(performance.now()*.001+i*77)*.5+.5;
      const sx=(i*1237+G.bgOff*.15)%W;
      const sy=(i*743)%(vy*.92);
      ctx.globalAlpha=.3+tw*.7;
      ctx.fillStyle=C.star+'1)';
      ctx.beginPath(); ctx.arc(sx,sy,.6+(i%3)*.5,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
    // Nebula
    const ng=ctx.createRadialGradient(vx,vy,0,vx,vy,H*.35);
    ng.addColorStop(0,'rgba(124,58,237,.13)'); ng.addColorStop(1,'transparent');
    ctx.fillStyle=ng; ctx.fillRect(0,0,W,H);
  }

  // Ground
  const gg=ctx.createLinearGradient(0,vy,0,H);
  const g0=SD.theme==='dark'?'#1a003a':SD.theme==='light'?'#c4b5fd':'#1a1a1a';
  const g1=SD.theme==='dark'?'#040010':SD.theme==='light'?'#7c3aed':'#000';
  gg.addColorStop(0,g0); gg.addColorStop(1,g1);
  ctx.fillStyle=gg;
  ctx.beginPath(); ctx.moveTo(0,vy); ctx.lineTo(W,vy); ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();

  // Track surface
  const tg=ctx.createLinearGradient(0,vy,0,by);
  tg.addColorStop(0,SD.theme==='dark'?'rgba(40,0,80,.9)':SD.theme==='light'?'rgba(196,181,253,.9)':'rgba(20,20,20,.9)');
  tg.addColorStop(.5,SD.theme==='dark'?'rgba(22,0,50,.95)':SD.theme==='light'?'rgba(167,139,250,.95)':'rgba(8,8,8,.95)');
  tg.addColorStop(1,SD.theme==='dark'?'rgba(12,0,28,1)':SD.theme==='light'?'rgba(124,58,237,1)':'rgba(0,0,0,1)');
  ctx.fillStyle=tg;
  ctx.beginPath(); ctx.moveTo(vx-1,vy); ctx.lineTo(vx+1,vy); ctx.lineTo(vx+hw,by); ctx.lineTo(vx-hw,by); ctx.closePath(); ctx.fill();

  // Lane lines
  ctx.shadowColor=C.neon; ctx.shadowBlur=10;
  for(let i=0;i<=LANES;i++){
    const bx=(vx-hw)+(hw*2/LANES)*i;
    ctx.strokeStyle=i===0||i===LANES?C.neon:'rgba(168,85,247,.55)';
    ctx.lineWidth=i===0||i===LANES?2.5:1.5;
    ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(bx,by); ctx.stroke();
  }
  ctx.shadowBlur=0;

  // Cross stripes (speed feel)
  for(let s=0;s<18;s++){
    const tz=((s/18)+(G.bgOff*.0017))%1;
    if(tz<.02) continue;
    const yy=vy+(by-vy)*tz;
    const xl=vx-hw*tz, xr=vx+hw*tz;
    const a=tz*.17;
    if(s%4===0){
      ctx.strokeStyle=`rgba(200,150,255,${a})`; ctx.lineWidth=hw*2*tz*.07; ctx.setLineDash([]);
    } else {
      ctx.strokeStyle=`rgba(120,50,200,${a*.5})`; ctx.lineWidth=1; ctx.setLineDash([8,12]);
    }
    ctx.beginPath(); ctx.moveTo(xl,yy); ctx.lineTo(xr,yy); ctx.stroke();
  }
  ctx.setLineDash([]);

  // Edge rails glow
  ctx.shadowColor=C.neon; ctx.shadowBlur=18;
  ctx.strokeStyle=C.neon+'99'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx-hw,by); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx+hw,by); ctx.stroke();
  ctx.shadowBlur=0;

  drawPillars(C);
  G.decors.forEach(d=>drawDecor(d,C));
  G.obstacles.forEach(o=>{ if(!o.hit) drawTrain(o); });
  G.items.forEach(c=>{ if(!c.done) drawItem(c); else drawItemFade(c); });
  G.particles.forEach(p=>{
    ctx.globalAlpha=p.alpha; ctx.fillStyle=p.col;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha=1;

  if(G.slowmo){ ctx.fillStyle='rgba(96,165,250,.04)'; ctx.fillRect(0,0,W,H); }
  if(G.magnet){
    const pp=laneX(G.tLane,.87);
    const mt=performance.now()*.003;
    ctx.strokeStyle=`rgba(251,191,36,${.18+Math.sin(mt)*.12})`; ctx.lineWidth=2.5; ctx.setLineDash([6,9]);
    ctx.beginPath(); ctx.arc(pp.x,pp.y,hw*.75,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
  }

  drawPlayer();

  // Speed ramp bar
  ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(0,H-5,W,5);
  const rg=ctx.createLinearGradient(0,0,W*G.speedRamp,0);
  rg.addColorStop(0,'#22c55e'); rg.addColorStop(.5,'#fbbf24'); rg.addColorStop(1,'#ef4444');
  ctx.fillStyle=rg; ctx.fillRect(0,H-5,W*G.speedRamp,5);

  // Vignette
  const vg=ctx.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,H);
  vg.addColorStop(0,'transparent'); vg.addColorStop(1,'rgba(0,0,0,.52)');
  ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
}

function drawPillars(C){
  const {vx,vy,by,hw}=TG;
  for(let i=0;i<6;i++){
    const z=(i+.5)/6, yy=vy+(by-vy)*z, pw=hw*2*z, ph=12*z, pw2=8*z;
    const lx=vx-pw/2, rx=vx+pw/2;
    ctx.fillStyle=SD.theme==='dark'?`rgba(110,55,210,${z*.6})`:SD.theme==='light'?`rgba(109,40,217,${z*.4})`:`rgba(200,200,200,${z*.5})`;
    ctx.shadowColor=C.neon; ctx.shadowBlur=8*z;
    rr(ctx,lx-pw2/2,yy-ph/2,pw2,ph,2*z); ctx.fill();
    rr(ctx,rx-pw2/2,yy-ph/2,pw2,ph,2*z); ctx.fill();
    ctx.strokeStyle=SD.theme==='dark'?`rgba(192,132,252,${z*.28})`:`rgba(109,40,217,${z*.18})`;
    ctx.lineWidth=z*1.4; ctx.setLineDash([4,8]);
    ctx.beginPath(); ctx.moveTo(lx,yy); ctx.lineTo(rx,yy); ctx.stroke(); ctx.setLineDash([]);
    ctx.shadowBlur=0;
  }
}

function drawDecor(d,C){
  const {vx,vy,by,hw}=TG;
  if(d.z<.05||d.z>1) return;
  const z=d.z, yy=vy+(by-vy)*z, pw=hw*2*z;
  const bx=d.side==='left'?vx-pw/2-18*z:vx+pw/2+18*z;
  const sc=z*.85;
  ctx.globalAlpha=Math.min(1,z*1.5);
  const th=SD.theme;
  switch(d.type){
    case 0: // Lamp post
      ctx.fillStyle=th==='dark'?'#3b1d6e':th==='light'?'#6d28d9':'#333';
      rr(ctx,bx-3*sc,yy-50*sc,6*sc,50*sc,2); ctx.fill();
      ctx.fillStyle=th==='dark'?'#5b21b6':th==='light'?'#7c3aed':'#555';
      rr(ctx,bx-12*sc,yy-52*sc,24*sc,6*sc,3); ctx.fill();
      ctx.shadowColor=th==='dark'?'#a855f7':'#7c3aed'; ctx.shadowBlur=14*sc;
      ctx.fillStyle=th==='dark'?'rgba(168,85,247,.6)':'rgba(124,58,237,.5)';
      ctx.beginPath(); ctx.arc(bx,yy-49*sc,5*sc,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; break;
    case 1: // Neon sign
      ctx.strokeStyle=th==='dark'?'#ec4899':th==='light'?'#be185d':'#aaa';
      ctx.lineWidth=3*sc; ctx.shadowColor=ctx.strokeStyle; ctx.shadowBlur=10*sc;
      rr(ctx,bx-15*sc,yy-40*sc,30*sc,22*sc,4*sc); ctx.stroke(); ctx.shadowBlur=0;
      ctx.font=Math.max(8,14*sc)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle=th==='dark'?'rgba(236,72,153,.8)':'rgba(190,24,93,.8)';
      ctx.fillText('🛡️',bx,yy-29*sc); break;
    case 2: // Tree
      ctx.fillStyle=th==='dark'?'#1a4731':th==='light'?'#166534':'#1a1a1a';
      ctx.beginPath(); ctx.arc(bx,yy-20*sc,17*sc,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=th==='dark'?'#14532d':th==='light'?'#15803d':'#222';
      ctx.beginPath(); ctx.arc(bx,yy-30*sc,11*sc,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=th==='dark'?'#1a4731':'#166534';
      rr(ctx,bx-3*sc,yy-4*sc,6*sc,8*sc,2); ctx.fill(); break;
    case 3: // Billboard
      ctx.fillStyle=th==='dark'?'#2d1060':th==='light'?'#5b21b6':'#222';
      rr(ctx,bx-20*sc,yy-50*sc,40*sc,30*sc,3*sc); ctx.fill();
      ctx.fillStyle=th==='dark'?'rgba(192,132,252,.25)':'rgba(109,40,217,.25)';
      rr(ctx,bx-18*sc,yy-48*sc,36*sc,26*sc,2*sc); ctx.fill();
      ctx.fillStyle=th==='dark'?'rgba(210,160,255,.9)':'rgba(79,70,229,.9)';
      ctx.font=Math.max(6,10*sc)+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('NÃO AO',bx,yy-39*sc); ctx.fillText('BULLYING',bx,yy-29*sc);
      ctx.fillStyle=th==='dark'?'#3b1d6e':'#6d28d9';
      rr(ctx,bx-3*sc,yy-20*sc,6*sc,22*sc,2); ctx.fill(); break;
  }
  ctx.globalAlpha=1; ctx.textBaseline='alphabetic';
}

function drawTrain(o){
  const pos=laneX(o.lane,o.z);
  const w=obsW(o.z), h=w*.8, x=pos.x-w/2, y=pos.y-h/2;
  const z=o.z, th=SD.theme;
  const PAL=[
    {body:'#991b1b',shine:'#dc2626',roof:'#7f1d1d',win:'rgba(251,191,36,.85)',whl:'#1f2937',stripe:'#fbbf24'},
    {body:'#1e3a8a',shine:'#2563eb',roof:'#1e3a8a',win:'rgba(147,197,253,.85)',whl:'#1f2937',stripe:'#60a5fa'},
    {body:'#4c1d95',shine:'#7c3aed',roof:'#3b0764',win:'rgba(192,132,252,.85)',whl:'#1f2937',stripe:'#c084fc'},
  ];
  const BW={body:'#333',shine:'#555',roof:'#222',win:'rgba(200,200,200,.7)',whl:'#111',stripe:'#aaa'};
  const tc=th==='bw'?BW:(PAL[o.variant]||PAL[0]);

  ctx.shadowColor=tc.shine; ctx.shadowBlur=14*z;
  const bg=ctx.createLinearGradient(x,y,x+w,y);
  bg.addColorStop(0,tc.body); bg.addColorStop(.35,tc.shine); bg.addColorStop(.7,tc.body); bg.addColorStop(1,tc.roof);
  ctx.fillStyle=bg; rr(ctx,x,y,w,h*.78,5*z); ctx.fill();

  const rg=ctx.createLinearGradient(x,y,x,y+h*.15);
  rg.addColorStop(0,tc.shine); rg.addColorStop(1,tc.roof);
  ctx.fillStyle=rg; rr(ctx,x+w*.05,y-h*.12,w*.9,h*.16,3*z); ctx.fill();

  ctx.fillStyle=tc.stripe; ctx.globalAlpha=.5;
  rr(ctx,x,y+h*.35,w,h*.08,2); ctx.fill(); ctx.globalAlpha=1;

  const nw=Math.max(1,Math.floor(w/22)), ww=w*.14, wh=h*.22, ws=w/(nw+1);
  for(let wi=0;wi<nw&&wi<4;wi++){
    const wx=x+ws*(wi+1)-ww/2, wy=y+h*.1;
    ctx.fillStyle=tc.roof; rr(ctx,wx-2,wy-2,ww+4,wh+4,3*z); ctx.fill();
    const wg=ctx.createLinearGradient(wx,wy,wx,wy+wh);
    wg.addColorStop(0,tc.win); wg.addColorStop(1,tc.body+'88');
    ctx.fillStyle=wg; rr(ctx,wx,wy,ww,wh,2*z); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.28)'; rr(ctx,wx+2,wy+2,ww*.35,wh*.4,1); ctx.fill();
  }

  ctx.shadowColor='#fbbf24'; ctx.shadowBlur=9*z; ctx.fillStyle='#fbbf24';
  ctx.beginPath(); ctx.ellipse(pos.x-w*.26,pos.y-h*.1,w*.06,h*.06,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(pos.x+w*.26,pos.y-h*.1,w*.06,h*.06,0,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;

  [x+w*.18,x+w*.5,x+w*.82].forEach(wx=>{
    const wr=h*.14;
    ctx.fillStyle=tc.whl; ctx.beginPath(); ctx.arc(wx,y+h*.78,wr,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(200,200,200,.38)'; ctx.lineWidth=wr*.25;
    ctx.beginPath(); ctx.arc(wx,y+h*.78,wr*.6,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(wx,y+h*.78,wr*.2,0,Math.PI*2); ctx.fill();
  });

  ctx.fillStyle=tc.roof;
  rr(ctx,x+w*.1,y+h*.68,w*.8,h*.12,2*z); ctx.fill();
  rr(ctx,x+w*.12,y-h*.28,w*.09,h*.18,2*z); ctx.fill();

  const st=performance.now()*.002;
  for(let pi=0;pi<3;pi++){
    const pa=(st+pi*.6)%1;
    ctx.globalAlpha=1-pa; ctx.fillStyle='rgba(200,200,200,.45)';
    ctx.beginPath(); ctx.arc(x+w*.16,y-h*(.3+pa*.6),w*.06*(1-pa*.5),0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;

  ctx.font=Math.max(8,w*.28)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('🚂',pos.x,pos.y-h*.55);
  ctx.textBaseline='alphabetic'; ctx.shadowBlur=0;
}

function drawItem(c){
  const pos=laneX(c.lane,c.z);
  const sz=Math.max(6,c.z*30);
  const bob=Math.sin(performance.now()*.004+c.bob)*sz*.2;
  ctx.globalAlpha=c.alpha;
  ctx.shadowColor=c.type==='coin'?'#fbbf24':'#60a5fa'; ctx.shadowBlur=12;
  ctx.font=Math.max(8,sz*1.15)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(c.type==='coin'?'🪙':'💎',pos.x,pos.y-sz/2+bob);
  if(sz>14){
    ctx.font=Math.max(6,sz*.45)+'px sans-serif';
    ctx.fillStyle=c.type==='coin'?'#fbbf24':'#60a5fa';
    ctx.fillText(c.type==='coin'?'+🪙':'+💎',pos.x,pos.y-sz+bob-4);
  }
  ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.textBaseline='alphabetic';
}
function drawItemFade(c){
  const pos=laneX(c.lane,c.z);
  ctx.globalAlpha=c.alpha*.65; ctx.fillStyle=c.type==='coin'?'#fbbf24':'#60a5fa';
  ctx.font='12px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(c.type==='coin'?'+🪙':'+💎',pos.x,pos.y-22);
  ctx.globalAlpha=1; ctx.textBaseline='alphabetic';
}

// ─── PLAYER DRAWING ───────────────────────────────────────
function drawPlayer(){
  const {hw}=TG;
  const pz=.87;
  const base=laneX(G.lane,pz), tgt=laneX(G.tLane,pz);
  const t=ease(Math.min(1,G.laneT));
  const dx=base.x+(tgt.x-base.x)*(G.lane!==G.tLane?t:0);
  const sz=hw*2*pz/LANES;
  const bob=Math.sin(G.bobT)*sz*.04;
  const lean=G.lane!==G.tLane?(G.tLane>G.lane?.12:-.12):0;
  const cy=base.y-sz*.5+bob;
  const S=sz*.40;

  const all=getAvatarList();
  const av=all[Math.min(SD.avatarIdx,all.length-1)];
  const PAL={
    '🧒':{skin:'#f5c5a0',hair:'#3d1f00',hl:'#7c4800',sh:'#3b82f6',sl:'#60a5fa',pt:'#1e3a5f',pl:'#2563eb',shoe:'#1a0a00',acc:'#fbbf24'},
    '👦':{skin:'#f0b082',hair:'#1a0d00',hl:'#4a2800',sh:'#ef4444',sl:'#f87171',pt:'#1e293b',pl:'#334155',shoe:'#1a0a00',acc:'#fb923c'},
    '👧':{skin:'#f5c5a0',hair:'#a16207',hl:'#ca8a04',sh:'#ec4899',sl:'#f472b6',pt:'#7c3aed',pl:'#a855f7',shoe:'#831843',acc:'#fb7185'},
    '🧑':{skin:'#c8834a',hair:'#1a0d00',hl:'#3d1f00',sh:'#22c55e',sl:'#4ade80',pt:'#14532d',pl:'#166534',shoe:'#1a0a00',acc:'#86efac'},
    '🦸':{skin:'#f5c5a0',hair:'#d97706',hl:'#fbbf24',sh:'#dc2626',sl:'#ef4444',pt:'#1e3a5f',pl:'#1d4ed8',shoe:'#111',acc:'#fbbf24'},
    '🧙':{skin:'#e8c49a',hair:'#6b7280',hl:'#9ca3af',sh:'#7c3aed',sl:'#a855f7',pt:'#4c1d95',pl:'#6d28d9',shoe:'#1a0033',acc:'#c084fc'},
  };
  const P=PAL[av]||PAL['🧒'];

  // Shadow
  ctx.save(); ctx.translate(dx,base.y-S*.05);
  ctx.fillStyle='rgba(0,0,0,.28)';
  ctx.beginPath(); ctx.ellipse(0,0,S*.5,S*.1,0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  ctx.save(); ctx.translate(dx,cy); ctx.rotate(lean);

  // Shield aura
  if(G.shieldOn){
    const st=performance.now()*.003;
    for(let i=0;i<3;i++){
      ctx.strokeStyle=`rgba(168,85,247,${.5-i*.15})`;
      ctx.lineWidth=3-i; ctx.shadowColor='#a855f7'; ctx.shadowBlur=18;
      ctx.beginPath(); ctx.arc(0,0,S*.95+Math.sin(st*2+i)*S*.05,0,Math.PI*2); ctx.stroke();
    }
    ctx.shadowBlur=0;
  }
  // Speed aura
  if(G.speedBoost){
    ctx.strokeStyle='rgba(251,191,36,.3)'; ctx.lineWidth=2; ctx.setLineDash([5,7]);
    ctx.shadowColor='#fbbf24'; ctx.shadowBlur=22;
    ctx.beginPath(); ctx.arc(0,0,S*1.06,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([]); ctx.shadowBlur=0;
  }

  const lb=Math.sin(G.bobT*2)*S*.2, ab=Math.sin(G.bobT*2+Math.PI)*S*.15;

  // Legs
  ctx.lineCap='round';
  ctx.strokeStyle=P.pt; ctx.lineWidth=S*.23; ctx.shadowColor='rgba(0,0,0,.28)'; ctx.shadowBlur=4;
  ctx.beginPath(); ctx.moveTo(-S*.07,S*.32); ctx.quadraticCurveTo(-S*.18,S*.55+lb*.5,-S*.16,S*.75+lb); ctx.stroke();
  ctx.strokeStyle=P.pl;
  ctx.beginPath(); ctx.moveTo(S*.07,S*.32); ctx.quadraticCurveTo(S*.18,S*.55-lb*.5,S*.16,S*.75-lb); ctx.stroke();
  ctx.shadowBlur=0;

  // Shoes
  ctx.fillStyle=P.shoe;
  ctx.beginPath(); ctx.ellipse(-S*.16,S*.8+lb,S*.14,S*.07,-.25,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(S*.16,S*.8-lb,S*.14,S*.07,.25,0,Math.PI*2); ctx.fill();

  // Body
  const bg=ctx.createLinearGradient(-S*.26,-S*.15,S*.26,S*.38);
  bg.addColorStop(0,P.sl); bg.addColorStop(.5,P.sh); bg.addColorStop(1,P.pt);
  ctx.fillStyle=bg; ctx.shadowColor='rgba(0,0,0,.22)'; ctx.shadowBlur=5;
  rr(ctx,-S*.24,-S*.14,S*.48,S*.5,S*.1); ctx.fill(); ctx.shadowBlur=0;
  ctx.fillStyle='rgba(255,255,255,.13)'; rr(ctx,-S*.17,-S*.1,S*.14,S*.25,S*.06); ctx.fill();
  // Belt
  ctx.strokeStyle=P.acc; ctx.lineWidth=S*.035; ctx.setLineDash([S*.06,S*.04]);
  ctx.beginPath(); ctx.moveTo(-S*.24,S*.22); ctx.lineTo(S*.24,S*.22); ctx.stroke(); ctx.setLineDash([]);
  // Shield logo
  ctx.fillStyle='rgba(255,255,255,.88)';
  ctx.font=Math.max(6,S*.28)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('🛡️',0,S*.05);

  // Arms
  ctx.strokeStyle=P.sl; ctx.lineWidth=S*.2;
  ctx.beginPath(); ctx.moveTo(-S*.22,-S*.06); ctx.quadraticCurveTo(-S*.4,S*.1+ab,-S*.42,S*.25+ab); ctx.stroke();
  ctx.strokeStyle=P.sh;
  ctx.beginPath(); ctx.moveTo(S*.22,-S*.06); ctx.quadraticCurveTo(S*.4,S*.1-ab,S*.42,S*.25-ab); ctx.stroke();

  // Hands
  ctx.fillStyle=P.skin; ctx.shadowColor='rgba(0,0,0,.18)'; ctx.shadowBlur=3;
  ctx.beginPath(); ctx.arc(-S*.44,S*.27+ab,S*.1,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(S*.44,S*.27-ab,S*.1,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;

  // Neck
  ctx.fillStyle=P.skin; rr(ctx,-S*.07,-S*.18,S*.14,S*.1,S*.04); ctx.fill();

  // Head
  ctx.shadowColor='rgba(0,0,0,.28)'; ctx.shadowBlur=8;
  const hg=ctx.createRadialGradient(-S*.08,-S*.45,0,0,-S*.38,S*.32);
  hg.addColorStop(0,P.skin); hg.addColorStop(1,P.hair+'55');
  ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(0,-S*.38,S*.3,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;

  // Cheeks
  ctx.fillStyle='rgba(255,160,130,.28)';
  ctx.beginPath(); ctx.ellipse(-S*.14,-S*.33,S*.08,S*.05,.2,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(S*.14,-S*.33,S*.08,S*.05,-.2,0,Math.PI*2); ctx.fill();

  // Hair by avatar
  ctx.fillStyle=P.hair; ctx.shadowColor=P.hl; ctx.shadowBlur=4;
  if(av==='🧙'){
    ctx.fillStyle=P.sh; ctx.shadowColor=P.acc; ctx.shadowBlur=8;
    ctx.beginPath(); ctx.moveTo(-S*.3,-S*.58); ctx.lineTo(0,-S*1.23); ctx.lineTo(S*.3,-S*.58); ctx.closePath(); ctx.fill();
    ctx.fillStyle=P.acc; ctx.shadowBlur=0;
    ctx.beginPath(); ctx.ellipse(0,-S*.58,S*.36,S*.1,0,0,Math.PI*2); ctx.fill();
  } else if(av==='🦸'){
    ctx.beginPath(); ctx.arc(0,-S*.38,S*.32,Math.PI,0); ctx.fill();
    ctx.fillStyle=P.sh; ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(0,-S*.34,S*.25,Math.PI*1.15,Math.PI*1.85); ctx.fill();
    ctx.fillStyle=P.acc;
    ctx.beginPath(); ctx.arc(-S*.09,-S*.37,S*.08,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(S*.09,-S*.37,S*.08,0,Math.PI*2); ctx.fill();
  } else if(av==='👧'){
    ctx.beginPath(); ctx.arc(0,-S*.56,S*.32,Math.PI+.15,-.15); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-S*.3,-S*.28,S*.08,S*.28,.15,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*.3,-S*.28,S*.08,S*.28,-.15,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle=P.acc; ctx.beginPath(); ctx.arc(S*.3,-S*.08,S*.07,0,Math.PI*2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(0,-S*.52,S*.3,Math.PI+.25,-.25); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-S*.28,-S*.38,S*.07,S*.2,.1,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*.28,-S*.38,S*.07,S*.2,-.1,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
  }

  // Eyes
  ctx.fillStyle='#fff'; ctx.shadowBlur=0;
  ctx.beginPath(); ctx.ellipse(-S*.1,-S*.38,S*.075,S*.067,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(S*.1,-S*.38,S*.075,S*.067,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=P.acc+'cc';
  ctx.beginPath(); ctx.arc(-S*.1,-S*.378,S*.048,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(S*.1,-S*.378,S*.048,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#09000e';
  ctx.beginPath(); ctx.arc(-S*.1,-S*.375,S*.027,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(S*.1,-S*.375,S*.027,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.9)';
  ctx.beginPath(); ctx.arc(-S*.094,-S*.387,S*.012,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(S*.106,-S*.387,S*.012,0,Math.PI*2); ctx.fill();

  // Eyebrows
  ctx.strokeStyle=P.hair; ctx.lineWidth=S*.04;
  ctx.beginPath(); ctx.moveTo(-S*.16,-S*.45); ctx.lineTo(-S*.04,-S*.44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(S*.16,-S*.45); ctx.lineTo(S*.04,-S*.44); ctx.stroke();

  // Nose
  ctx.strokeStyle=P.skin+'88'; ctx.lineWidth=S*.024;
  ctx.beginPath(); ctx.moveTo(-S*.03,-S*.34); ctx.quadraticCurveTo(-S*.05,-S*.31,-S*.02,-S*.3); ctx.stroke();

  // Mouth / smile
  ctx.strokeStyle='#5a2e00'; ctx.lineWidth=S*.028;
  ctx.beginPath(); ctx.arc(0,-S*.32,S*.1,.15,Math.PI-.15); ctx.stroke();

  // Ears
  ctx.fillStyle=P.skin;
  ctx.beginPath(); ctx.ellipse(-S*.3,-S*.37,S*.064,S*.074,.2,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(S*.3,-S*.37,S*.064,S*.074,-.2,0,Math.PI*2); ctx.fill();

  ctx.restore();
  ctx.textAlign='left'; ctx.shadowBlur=0; ctx.textBaseline='alphabetic';
}

// ─── MENU BACKGROUND ──────────────────────────────────────
let menuBgRaf=null, menuBgT=0;
function drawMenuBg(){
  menuBgT+=.005;
  const {vx,vy,by,hw,W,H}=TG;
  const C=themeC();
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,C.skyA); g.addColorStop(.45,C.skyB); g.addColorStop(1,C.trackB);
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  if(C.star){
    for(let i=0;i<60;i++){
      const tw=Math.sin(menuBgT*2+i*77)*.5+.5;
      ctx.globalAlpha=.2+tw*.6; ctx.fillStyle=C.star+'1)';
      ctx.beginPath(); ctx.arc((i*1237)%W,(i*743)%(vy*.9),.6+(i%3)*.5,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  const tg=ctx.createLinearGradient(0,vy,0,H);
  tg.addColorStop(0,C.trackA); tg.addColorStop(1,C.trackB);
  ctx.fillStyle=tg;
  ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx+hw,by); ctx.lineTo(vx-hw,by); ctx.closePath(); ctx.fill();
  ctx.shadowColor=C.neon; ctx.shadowBlur=8;
  for(let i=0;i<=LANES;i++){
    const bx=(vx-hw)+(hw*2/LANES)*i;
    ctx.strokeStyle=C.neon; ctx.lineWidth=i===0||i===LANES?2:1.2;
    ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(bx,by); ctx.stroke();
  }
  ctx.shadowBlur=0;
  for(let s=0;s<10;s++){
    const tz=((s/10)+(menuBgT*.3))%1; if(tz<.02) continue;
    const yy=vy+(by-vy)*tz, xl=vx-hw*tz, xr=vx+hw*tz;
    ctx.strokeStyle=C.neon+(Math.floor(tz*40).toString(16).padStart(2,'0'));
    ctx.lineWidth=s%4===0?hw*2*tz*.07:.8;
    ctx.setLineDash(s%4===0?[]:[6,10]);
    ctx.beginPath(); ctx.moveTo(xl,yy); ctx.lineTo(xr,yy); ctx.stroke();
  }
  ctx.setLineDash([]);
  const v=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H);
  v.addColorStop(0,'transparent'); v.addColorStop(1,'rgba(0,0,0,.55)');
  ctx.fillStyle=v; ctx.fillRect(0,0,W,H);
}
function menuBgStart(){
  if(menuBgRaf) return;
  function step(){ if(G.running){ menuBgRaf=null; return; } drawMenuBg(); menuBgRaf=requestAnimationFrame(step); }
  menuBgRaf=requestAnimationFrame(step);
}
function menuBgStop(){ if(menuBgRaf){ cancelAnimationFrame(menuBgRaf); menuBgRaf=null; } }

// ─── CONTROLS ─────────────────────────────────────────────
function moveLeft(){  if(G.tLane>0)       { G.lane=G.tLane; G.tLane--; G.laneT=0; sfx('jump'); } }
function moveRight(){ if(G.tLane<LANES-1) { G.lane=G.tLane; G.tLane++; G.laneT=0; sfx('jump'); } }

document.addEventListener('keydown',e=>{
  if(!G.running||G.paused) return;
  if(e.key==='ArrowLeft' ||e.key==='a'||e.key==='A') moveLeft();
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') moveRight();
  if(e.key===' '){ e.preventDefault(); activatePower(0); }
  if(e.key==='q'||e.key==='Q') activatePower(1);
  if(e.key==='e'||e.key==='E') activatePower(2);
  if(e.key==='r'||e.key==='R') activatePower(3);
});

let _tx=0,_ty=0;
canvas.addEventListener('touchstart',e=>{ _tx=e.touches[0].clientX; _ty=e.touches[0].clientY; e.preventDefault(); },{passive:false});
canvas.addEventListener('touchend',e=>{
  if(!G.running||G.paused) return;
  const dx=e.changedTouches[0].clientX-_tx;
  const dy=e.changedTouches[0].clientY-_ty;
  if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>22){ if(dx<0) moveLeft(); else moveRight(); }
  e.preventDefault();
},{passive:false});
document.addEventListener('touchmove',e=>{ if(G.running) e.preventDefault(); },{passive:false});

// ─── SPLASH ───────────────────────────────────────────────
function runSplash(){
  const fill=el('splashFill'), pct=el('splashPct');
  const dur=3000, t0=performance.now();
  function tick(now){
    const p=Math.min(100,Math.floor((now-t0)/dur*100));
    fill.style.width=p+'%'; pct.textContent=p+'%';
    if(p<100){ requestAnimationFrame(tick); }
    else {
      const s=el('splash');
      s.style.transition='opacity .6s'; s.style.opacity='0';
      setTimeout(()=>{ s.style.display='none'; showScreen('menuScreen'); menuBgStart(); },650);
    }
  }
  requestAnimationFrame(tick);
}

// ─── INIT ─────────────────────────────────────────────────
function init(){
  loadSave();
  applyTheme(SD.theme||'dark');
  applyLang(SD.lang||'pt');
  el('nameInp').value=SD.name||'';
  refreshAll();

  // Input listeners
  el('nameInp').addEventListener('input',e=>{ SD.name=e.target.value; writeSave(); });
  el('avatarBtn').addEventListener('click',()=>{
    const a=getAvatarList();
    SD.avatarIdx=(SD.avatarIdx+1)%a.length;
    writeSave(); updateAvatar(); sfx('click');
  });
  document.querySelectorAll('.theme-btn').forEach(b=>b.addEventListener('click',()=>{ applyTheme(b.dataset.theme); sfx('click'); }));
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>{ applyLang(b.dataset.lang); sfx('click'); }));

  // NAV
  el('playBtn').addEventListener('click',()=>{ sfx('click'); menuBgStop(); startGame(); });
  el('shopBtn').addEventListener('click',()=>{ sfx('click'); renderShop(); el('shopCoins').textContent=SD.coins; el('shopGems').textContent=SD.gems; showScreen('shopScreen'); });
  el('shopBackBtn').addEventListener('click',()=>{ sfx('click'); showScreen('menuScreen'); menuBgStart(); });
  el('topRunBtn').addEventListener('click',()=>{ sfx('click'); renderTopRun('local'); showScreen('topRunScreen'); });
  el('topBackBtn').addEventListener('click',()=>{ sfx('click'); showScreen('menuScreen'); menuBgStart(); });
  el('loginBtn').addEventListener('click',()=>{ sfx('click'); updateLoggedUI(); showScreen('loginScreen'); });
  el('loginBackBtn').addEventListener('click',()=>{ sfx('click'); showScreen('menuScreen'); menuBgStart(); });

  // Auth
  el('authSubmitBtn').addEventListener('click',()=>{ ensureAudio(); handleAuth(); });
  el('logoutBtn').addEventListener('click',()=>{ sfx('click'); doLogout(); menuBgStart(); });
  el('syncNowBtn').addEventListener('click',()=>{ sfx('coin'); writeSave(); floatNotif('☁️ Sincronizado!','notif-power'); });

  // Game over
  el('replayBtn').addEventListener('click',()=>{ sfx('click'); menuBgStop(); startGame(); });
  el('goMenuBtn').addEventListener('click',()=>{ sfx('click'); refreshAll(); showScreen('menuScreen'); menuBgStart(); });

  // Perfect screen
  el('perfectContinueBtn').addEventListener('click',()=>{
    el('perfectScreen').classList.remove('active');
    el('confettiWrap').innerHTML='';
    G.paused=false;
    if(musicOn){ stopBGMusic(); startBGMusic(); }
  });
  el('perfectMenuBtn').addEventListener('click',()=>{
    if(!G.running) return;
    G.gameOverCalled=true; G.running=false;
    stopBGMusic();
    if(G.raf){ cancelAnimationFrame(G.raf); G.raf=null; }
    el('perfectScreen').classList.remove('active');
    el('confettiWrap').innerHTML='';
    el('hud').classList.remove('active');
    el('powerBar').classList.remove('active');
    el('musicToggle').classList.remove('active');
    el('mobileHint').classList.remove('visible');
    // Finalize
    SD.coins+=G.coins; SD.gems+=G.gems;
    G.powers.forEach((p,i)=>{ SD.powerCharges[POWERS_DEF[i].id]=(SD.powerCharges[POWERS_DEF[i].id]||0)+p.charges; });
    const earnedXP=G.xpEarned+Math.floor(G.score/50);
    const isNew=Math.floor(G.score)>SD.bestScore;
    if(isNew) SD.bestScore=Math.floor(G.score);
    addTopEntry(G.score,G.dist);
    writeSave(); addXP(earnedXP); refreshAll();
    sfx('click'); showScreen('menuScreen'); menuBgStart();
  });

  el('musicToggle').addEventListener('click',toggleMusic);

  resizeCanvas();
  drawMenuBg();
  runSplash();
}

window.addEventListener('load',init);
