// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
const MAX_XP       = 5000;
const LANES        = 3;
const SAVE_KEY     = 'abrunner_v5';
const ACCOUNTS_KEY = 'abrunner_accounts_v5';
const TOP_KEY      = 'abrunner_top_v5';
const MAX_LIVES    = 3;
const LETTERS      = ['A','B','C','D'];
const BASE_SPEED   = 0.5;
const MAX_SPEED    = 3.2;
const SPEED_RAMP   = 0.012;
const TOP_MAX      = 20;

const POWERS_DEF = [
  { id:'shield', emoji:'🛡️', cooldown:20, duration:8,  key:'SPC' },
  { id:'speed',  emoji:'⚡',  cooldown:25, duration:6,  key:'Q'   },
  { id:'magnet', emoji:'🧲',  cooldown:18, duration:7,  key:'E'   },
  { id:'slowmo', emoji:'🌀',  cooldown:30, duration:5,  key:'R'   },
];

const SHOP_ITEMS = [
  { id:'buy50coins',   icon:'🪙', cost:3,   currency:'gem',  type:'pack'   },
  { id:'buy200coins',  icon:'🪙', cost:10,  currency:'gem',  type:'pack'   },
  { id:'buy5gems',     icon:'💎', cost:100, currency:'coin', type:'pack'   },
  { id:'buy20gems',    icon:'💎', cost:350, currency:'coin', type:'pack'   },
  { id:'shieldCharge', icon:'🛡️', cost:2,   currency:'gem',  type:'charge' },
  { id:'speedCharge',  icon:'⚡',  cost:2,   currency:'gem',  type:'charge' },
  { id:'magnetCharge', icon:'🧲',  cost:2,   currency:'gem',  type:'charge' },
  { id:'slowCharge',   icon:'🌀',  cost:2,   currency:'gem',  type:'charge' },
  { id:'xpMult',       icon:'📈', cost:8,   currency:'gem',  type:'unlock' },
  { id:'coinBoost',    icon:'💰', cost:6,   currency:'gem',  type:'unlock' },
  { id:'extraLife',    icon:'❤️',  cost:5,   currency:'gem',  type:'unlock' },
  { id:'avatar1',      icon:'🦸', cost:500, currency:'coin', type:'unlock' },
  { id:'avatar2',      icon:'🧙', cost:500, currency:'coin', type:'unlock' },
];

const AVATARS_BASE = ['🧒','👦','👧','🧑'];

// ═══════════════════════════════════════════════════════════════════════════════
// UI TEXT
// ═══════════════════════════════════════════════════════════════════════════════
const UI_TEXT = {
  pt:{
    menuTitle:'Anti-Bullying Runner', playBtn:'🏃 JOGAR', shopBtn:'🛒 LOJA',
    lblName:'SEU NOME', lblXP:'XP', lblTheme:'TEMA', lblLang:'IDIOMA',
    statBestKey:'RECORDE', statCoinsKey:'MOEDAS', statGamesKey:'CORRIDAS',
    shopTitle:'🛒 Loja', shopBackLbl:'Voltar',
    goTitle:'GAME OVER', goScoreKey:'PONTOS', goDistKey:'DISTÂNCIA',
    goCoinsKey:'MOEDAS', goGemsKey:'GEMAS', goXpLabel:'XP GANHO', goQLabel:'PERGUNTAS',
    replayLbl:'Jogar Novamente', goMenuLbl:'Menu Principal',
    newRecord:'🏆 NOVO RECORDE!', maxLvl:'⭐ NÍVEL MÁXIMO!',
    splashLoading:'CARREGANDO...',
    themeD:'🌙 Escuro', themeL:'☀️ Claro', themeBW:'◑ P&B',
    powerNames:['Escudo','Velocidade','Ímã','Lentidão'],
    shopSections:['PACOTES DE MOEDAS/GEMAS','CARGAS DE PODERES','MELHORIAS PERMANENTES'],
    shopItems:{
      buy50coins:{name:'50 Moedas',desc:'Compre 50 moedas com gemas'},
      buy200coins:{name:'200 Moedas',desc:'Compre 200 moedas com gemas'},
      buy5gems:{name:'5 Gemas',desc:'Compre 5 gemas com moedas'},
      buy20gems:{name:'20 Gemas',desc:'Compre 20 gemas com moedas'},
      shieldCharge:{name:'Carga: Escudo',desc:'1 uso do poder Escudo na corrida'},
      speedCharge:{name:'Carga: Velocidade',desc:'1 uso do poder Velocidade'},
      magnetCharge:{name:'Carga: Ímã',desc:'1 uso do poder Ímã na corrida'},
      slowCharge:{name:'Carga: Lentidão',desc:'1 uso da Lentidão na corrida'},
      xpMult:{name:'Multiplicador XP',desc:'Dobra o XP por 1 corrida'},
      coinBoost:{name:'Boost de Moedas',desc:'Moedas valem 2x por 1 corrida'},
      extraLife:{name:'Vida Extra',desc:'Começa com 4 vidas por 1 corrida'},
      avatar1:{name:'Avatar Herói',desc:'Desbloqueia o avatar 🦸'},
      avatar2:{name:'Avatar Mago',desc:'Desbloqueia o avatar 🧙'},
    },
    buyBtn:'Comprar', activeBtn:'Ativo', boughtBtn:'Comprado', noCoins:'Sem moedas', noGems:'Sem gemas',
    dilemaTag:'DILEMA',
    correctMsg:'✅ Correto! +500 XP e +50 moedas',
    wrongMsg:'❌ Errado! -1 vida. Continue correndo!',
    timeoutMsg:'⏰ Tempo esgotado! -1 vida',
    perfectTitle:'PERFEITO!',
    perfectSubtitle:'Você respondeu todas as perguntas\nsem errar nenhuma! Incrível!',
    perfectContinue:'🏃 CONTINUAR CORRENDO',
    perfectMenu:'🏠 Menu Principal',
    pScoreKey:'PONTOS', pDistKey:'DISTÂNCIA', pXPKey:'XP BÔNUS', pCoinsKey:'MOEDAS BÔNUS',
    qStatsLabel:(c,w,t)=>`✅ ${c} certas  ❌ ${w} erradas  de ${t} perguntas`,
    powerActivated:(n)=>`⚡ ${n} ATIVADO!`,
    powerNoCharge:(n)=>`Sem carga de ${n}! Compre na loja.`,
    powerBarHint:'PODERES',
    topRunTitle:'Top Run', tabLocal:'📱 Local', tabGlobal:'🌍 Global', topBackLbl:'Voltar',
    loginTitle:'Conta & Nuvem', loginBtnLbl:'Conta & Nuvem',
    cloudSyncInfo:'Progresso sincronizado. Seus dados são salvos automaticamente.',
    syncNowLbl:'Sincronizar Agora', logoutLbl:'Sair da Conta', loginBackLbl:'Voltar',
    lblEmail:'EMAIL', lblPassword:'SENHA', lblRegName:'NOME NO JOGO',
    authFootnote:'Dados salvos localmente + nuvem (simulada).',
    loginLbl:'Entrar', registerLbl:'Criar Conta',
    cloudBadgeText:(n)=>`☁️ Olá, ${n}! Progresso salvo na nuvem.`,
    errInvalidEmail:'Email inválido', errShortPass:'Senha com mínimo 6 caracteres',
    errNoAccount:'Conta não encontrada', errWrongPass:'Senha incorreta',
    errEmailExists:'Email já cadastrado',
    successRegister:'Conta criada! Entrando...',
    successLogin:'Bem-vindo de volta!',
    newRecordInGame:'🏆 NOVO RECORDE!',
  },
  en:{
    menuTitle:'Anti-Bullying Runner', playBtn:'🏃 PLAY', shopBtn:'🛒 SHOP',
    lblName:'YOUR NAME', lblXP:'XP', lblTheme:'THEME', lblLang:'LANGUAGE',
    statBestKey:'HIGH SCORE', statCoinsKey:'COINS', statGamesKey:'RUNS',
    shopTitle:'🛒 Shop', shopBackLbl:'Back',
    goTitle:'GAME OVER', goScoreKey:'SCORE', goDistKey:'DISTANCE',
    goCoinsKey:'COINS', goGemsKey:'GEMS', goXpLabel:'XP EARNED', goQLabel:'QUESTIONS',
    replayLbl:'Play Again', goMenuLbl:'Main Menu',
    newRecord:'🏆 NEW RECORD!', maxLvl:'⭐ MAX LEVEL!',
    splashLoading:'LOADING...',
    themeD:'🌙 Dark', themeL:'☀️ Light', themeBW:'◑ B&W',
    powerNames:['Shield','Speed','Magnet','Slowdown'],
    shopSections:['COIN/GEM PACKS','POWER CHARGES','PERMANENT UPGRADES'],
    shopItems:{
      buy50coins:{name:'50 Coins',desc:'Buy 50 coins with gems'},
      buy200coins:{name:'200 Coins',desc:'Buy 200 coins with gems'},
      buy5gems:{name:'5 Gems',desc:'Buy 5 gems with coins'},
      buy20gems:{name:'20 Gems',desc:'Buy 20 gems with coins'},
      shieldCharge:{name:'Charge: Shield',desc:'1 use of Shield power in a run'},
      speedCharge:{name:'Charge: Speed',desc:'1 use of Speed power in a run'},
      magnetCharge:{name:'Charge: Magnet',desc:'1 use of Magnet power'},
      slowCharge:{name:'Charge: Slowdown',desc:'1 use of Slowdown in a run'},
      xpMult:{name:'XP Multiplier',desc:'Doubles XP earned for 1 run'},
      coinBoost:{name:'Coin Boost',desc:'Coins worth 2x for 1 run'},
      extraLife:{name:'Extra Life',desc:'Start with 4 lives for 1 run'},
      avatar1:{name:'Hero Avatar',desc:'Unlock 🦸 avatar'},
      avatar2:{name:'Wizard Avatar',desc:'Unlock 🧙 avatar'},
    },
    buyBtn:'Buy', activeBtn:'Active', boughtBtn:'Bought', noCoins:'No coins', noGems:'No gems',
    dilemaTag:'DILEMMA',
    correctMsg:'✅ Correct! +500 XP and +50 coins',
    wrongMsg:'❌ Wrong! -1 life. Keep running!',
    timeoutMsg:'⏰ Time up! -1 life',
    perfectTitle:'PERFECT!',
    perfectSubtitle:'You answered all questions\nwithout a mistake! Amazing!',
    perfectContinue:'🏃 KEEP RUNNING',
    perfectMenu:'🏠 Main Menu',
    pScoreKey:'SCORE', pDistKey:'DISTANCE', pXPKey:'BONUS XP', pCoinsKey:'BONUS COINS',
    qStatsLabel:(c,w,t)=>`✅ ${c} correct  ❌ ${w} wrong  of ${t}`,
    powerActivated:(n)=>`⚡ ${n} ACTIVATED!`,
    powerNoCharge:(n)=>`No ${n} charge! Buy in shop.`,
    powerBarHint:'POWERS',
    topRunTitle:'Top Run', tabLocal:'📱 Local', tabGlobal:'🌍 Global', topBackLbl:'Back',
    loginTitle:'Account & Cloud', loginBtnLbl:'Account & Cloud',
    cloudSyncInfo:'Progress synced to cloud. Data is saved automatically.',
    syncNowLbl:'Sync Now', logoutLbl:'Sign Out', loginBackLbl:'Back',
    lblEmail:'EMAIL', lblPassword:'PASSWORD', lblRegName:'GAME NAME',
    authFootnote:'Data saved locally + cloud (simulated).',
    loginLbl:'Sign In', registerLbl:'Create Account',
    cloudBadgeText:(n)=>`☁️ Hi, ${n}! Progress saved to cloud.`,
    errInvalidEmail:'Invalid email', errShortPass:'Min 6 character password',
    errNoAccount:'Account not found', errWrongPass:'Wrong password',
    errEmailExists:'Email already registered',
    successRegister:'Account created! Signing in...',
    successLogin:'Welcome back!',
    newRecordInGame:'🏆 NEW RECORD!',
  },
  es:{
    menuTitle:'Anti-Bullying Runner', playBtn:'🏃 JUGAR', shopBtn:'🛒 TIENDA',
    lblName:'TU NOMBRE', lblXP:'XP', lblTheme:'TEMA', lblLang:'IDIOMA',
    statBestKey:'RÉCORD', statCoinsKey:'MONEDAS', statGamesKey:'CARRERAS',
    shopTitle:'🛒 Tienda', shopBackLbl:'Volver',
    goTitle:'GAME OVER', goScoreKey:'PUNTOS', goDistKey:'DISTANCIA',
    goCoinsKey:'MONEDAS', goGemsKey:'GEMAS', goXpLabel:'XP GANADO', goQLabel:'PREGUNTAS',
    replayLbl:'Jugar de Nuevo', goMenuLbl:'Menú Principal',
    newRecord:'🏆 ¡NUEVO RÉCORD!', maxLvl:'⭐ ¡NIVEL MÁXIMO!',
    splashLoading:'CARGANDO...',
    themeD:'🌙 Oscuro', themeL:'☀️ Claro', themeBW:'◑ B/N',
    powerNames:['Escudo','Velocidad','Imán','Ralentizar'],
    shopSections:['PACKS MONEDAS/GEMAS','CARGAS DE PODERES','MEJORAS PERMANENTES'],
    shopItems:{
      buy50coins:{name:'50 Monedas',desc:'Compra 50 monedas con gemas'},
      buy200coins:{name:'200 Monedas',desc:'Compra 200 monedas con gemas'},
      buy5gems:{name:'5 Gemas',desc:'Compra 5 gemas con monedas'},
      buy20gems:{name:'20 Gemas',desc:'Compra 20 gemas con monedas'},
      shieldCharge:{name:'Carga: Escudo',desc:'1 uso del poder Escudo'},
      speedCharge:{name:'Carga: Velocidad',desc:'1 uso del poder Velocidad'},
      magnetCharge:{name:'Carga: Imán',desc:'1 uso del poder Imán'},
      slowCharge:{name:'Carga: Ralentizar',desc:'1 uso de Ralentizar'},
      xpMult:{name:'Multiplicador XP',desc:'Duplica XP por 1 carrera'},
      coinBoost:{name:'Boost de Monedas',desc:'Monedas 2x por 1 carrera'},
      extraLife:{name:'Vida Extra',desc:'Empieza con 4 vidas'},
      avatar1:{name:'Avatar Héroe',desc:'Desbloquea el avatar 🦸'},
      avatar2:{name:'Avatar Mago',desc:'Desbloquea el avatar 🧙'},
    },
    buyBtn:'Comprar', activeBtn:'Activo', boughtBtn:'Comprado', noCoins:'Sin monedas', noGems:'Sin gemas',
    dilemaTag:'DILEMA',
    correctMsg:'✅ ¡Correcto! +500 XP y +50 monedas',
    wrongMsg:'❌ ¡Incorrecto! -1 vida. ¡Sigue corriendo!',
    timeoutMsg:'⏰ ¡Tiempo agotado! -1 vida',
    perfectTitle:'¡PERFECTO!',
    perfectSubtitle:'¡Respondiste todas las preguntas\nsin error! ¡Increíble!',
    perfectContinue:'🏃 SEGUIR CORRIENDO',
    perfectMenu:'🏠 Menú Principal',
    pScoreKey:'PUNTOS', pDistKey:'DISTANCIA', pXPKey:'XP BONO', pCoinsKey:'MONEDAS BONO',
    qStatsLabel:(c,w,t)=>`✅ ${c} correctas  ❌ ${w} incorrectas  de ${t}`,
    powerActivated:(n)=>`⚡ ¡${n} ACTIVADO!`,
    powerNoCharge:(n)=>`¡Sin carga de ${n}! Compra en tienda.`,
    powerBarHint:'PODERES',
    topRunTitle:'Top Run', tabLocal:'📱 Local', tabGlobal:'🌍 Global', topBackLbl:'Volver',
    loginTitle:'Cuenta & Nube', loginBtnLbl:'Cuenta & Nube',
    cloudSyncInfo:'Progreso sincronizado. Los datos se guardan automáticamente.',
    syncNowLbl:'Sincronizar Ahora', logoutLbl:'Cerrar Sesión', loginBackLbl:'Volver',
    lblEmail:'EMAIL', lblPassword:'CONTRASEÑA', lblRegName:'NOMBRE EN EL JUEGO',
    authFootnote:'Datos guardados localmente + nube (simulada).',
    loginLbl:'Entrar', registerLbl:'Crear Cuenta',
    cloudBadgeText:(n)=>`☁️ ¡Hola, ${n}! Progreso en la nube.`,
    errInvalidEmail:'Email inválido', errShortPass:'Contraseña mínimo 6 caracteres',
    errNoAccount:'Cuenta no encontrada', errWrongPass:'Contraseña incorrecta',
    errEmailExists:'Email ya registrado',
    successRegister:'¡Cuenta creada! Entrando...',
    successLogin:'¡Bienvenido de vuelta!',
    newRecordInGame:'🏆 ¡NUEVO RÉCORD!',
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DILEMMAS
// ═══════════════════════════════════════════════════════════════════════════════
const DILEMMAS = {
  pt:[
    { tag:'CYBERBULLYING', icon:'💻',
      q:'Você vê um colega sendo atacado e humilhado em um grupo de mensagens da turma. O que você faz?',
      opts:[{t:'Fica em silêncio para não se envolver.',correct:false},{t:'Defende o colega, reporta as mensagens e avisa um adulto responsável.',correct:true},{t:'Encaminha as mensagens para mais pessoas sem pensar nas consequências.',correct:false},{t:'Curte as mensagens para não chamar atenção.',correct:false}]
    },
    { tag:'EXCLUSÃO SOCIAL', icon:'🤝',
      q:'Você percebe que um colega fica sozinho todos os dias no recreio e ninguém o chama para brincar. O que você faz?',
      opts:[{t:'Ignora, pois cada um tem seus próprios amigos.',correct:false},{t:'Convida o colega para se juntar ao seu grupo e apresenta-o aos amigos.',correct:true},{t:'Comenta com os amigos que ele é estranho e evita qualquer contato.',correct:false},{t:'Tira foto dele sozinho e publica nas redes sociais.',correct:false}]
    },
    { tag:'APELIDOS OFENSIVOS', icon:'😔',
      q:'Um grupo começa a chamar um aluno de apelidos maldosos sobre sua aparência. O que você faz?',
      opts:[{t:'Ri junto para não ser o próximo a ser alvo.',correct:false},{t:'Pede ao grupo para parar e depois conversa com o aluno afetado para apoiá-lo.',correct:true},{t:'Inventa novos apelidos achando que é uma brincadeira inofensiva.',correct:false},{t:'Observa a situação sem fazer nada.',correct:false}]
    },
    { tag:'FAKE NEWS', icon:'📰',
      q:'Alguém espalha um boato completamente falso sobre um colega na escola. O que você faz?',
      opts:[{t:'Repassa o boato para mais colegas sem verificar se é verdade.',correct:false},{t:'Verifica a informação, não repassa e informa que o boato é falso.',correct:true},{t:'Adiciona detalhes dramáticos ao boato para torná-lo mais interessante.',correct:false},{t:'Ignora, pois não é problema seu.',correct:false}]
    },
    { tag:'TESTEMUNHA DE AGRESSÃO', icon:'😰',
      q:'Você vê um amigo sendo ameaçado verbalmente por outro aluno no corredor. O que você faz?',
      opts:[{t:'Faz vídeo da situação para postar nas redes sociais.',correct:false},{t:'Se afasta rapidamente para não ser envolvido no problema.',correct:false},{t:'Intervém com calma, defende o amigo e busca ajuda de um professor imediatamente.',correct:true},{t:'Fica assistindo sem interferir.',correct:false}]
    },
    { tag:'EMPATIA E INCLUSÃO', icon:'🌍',
      q:'Um aluno novo chegou de outro país e está com dificuldade de se enturmar por causa do idioma. O que você faz?',
      opts:[{t:'Evita falar com ele porque a comunicação é difícil.',correct:false},{t:'Faz gestos de exclusão junto com os outros para não ser diferente.',correct:false},{t:'Se aproxima com paciência, usa gestos e ajuda o novo aluno a se sentir bem-vindo.',correct:true},{t:'Ri das tentativas do colega de se comunicar.',correct:false}]
    },
  ],
  en:[
    { tag:'CYBERBULLYING', icon:'💻',
      q:'You see a classmate being attacked and humiliated in the class messaging group. What do you do?',
      opts:[{t:'Stay silent to avoid getting involved.',correct:false},{t:'Defend the classmate, report the messages, and inform a responsible adult.',correct:true},{t:'Forward the messages to more people without thinking.',correct:false},{t:'Like the messages to not draw attention.',correct:false}]
    },
    { tag:'SOCIAL EXCLUSION', icon:'🤝',
      q:'You notice a classmate is alone every day at recess and no one invites them to play. What do you do?',
      opts:[{t:'Ignore it, since everyone has their own friends.',correct:false},{t:'Invite the classmate to join your group and introduce them to your friends.',correct:true},{t:'Tell your friends they are strange and avoid contact.',correct:false},{t:'Take a photo of them alone and post it on social media.',correct:false}]
    },
    { tag:'OFFENSIVE NICKNAMES', icon:'😔',
      q:'A group starts calling a student mean nicknames about their appearance. What do you do?',
      opts:[{t:'Laugh along so you are not the next target.',correct:false},{t:'Ask the group to stop and then talk with the affected student to support them.',correct:true},{t:'Invent new nicknames thinking it is a harmless joke.',correct:false},{t:'Watch the situation without doing anything.',correct:false}]
    },
    { tag:'FAKE NEWS', icon:'📰',
      q:'Someone spreads a completely false rumor about a classmate at school. What do you do?',
      opts:[{t:'Pass the rumor along without verifying it.',correct:false},{t:'Verify the information, do not share it, and let others know the rumor is false.',correct:true},{t:'Add dramatic details to make it more interesting.',correct:false},{t:'Ignore it, since it is not your problem.',correct:false}]
    },
    { tag:'WITNESS OF AGGRESSION', icon:'😰',
      q:'You see a friend being verbally threatened by another student in the hallway. What do you do?',
      opts:[{t:'Record a video to post on social media.',correct:false},{t:'Quickly walk away to avoid getting involved.',correct:false},{t:'Calmly intervene, defend your friend, and immediately seek help from a teacher.',correct:true},{t:'Watch without interfering.',correct:false}]
    },
    { tag:'EMPATHY AND INCLUSION', icon:'🌍',
      q:'A new student arrived from another country and is struggling to fit in because of the language barrier. What do you do?',
      opts:[{t:'Avoid talking to them because communication is difficult.',correct:false},{t:'Make exclusionary gestures along with others.',correct:false},{t:'Approach patiently, use gestures, and help the new student feel welcome.',correct:true},{t:'Laugh at their attempts to communicate.',correct:false}]
    },
  ],
  es:[
    { tag:'CIBERACOSO', icon:'💻',
      q:'Ves a un compañero siendo atacado y humillado en el grupo de mensajes de la clase. ¿Qué haces?',
      opts:[{t:'Te quedas en silencio para no involucrarte.',correct:false},{t:'Defiendes al compañero, reportas los mensajes e informas a un adulto responsable.',correct:true},{t:'Reenvías los mensajes a más personas sin pensar.',correct:false},{t:'Le das "me gusta" a los mensajes.',correct:false}]
    },
    { tag:'EXCLUSIÓN SOCIAL', icon:'🤝',
      q:'Notas que un compañero está solo todos los días en el recreo. ¿Qué haces?',
      opts:[{t:'Lo ignoras porque cada quien tiene sus propios amigos.',correct:false},{t:'Invitas al compañero a unirse a tu grupo.',correct:true},{t:'Les comentas a tus amigos que es raro.',correct:false},{t:'Le sacas una foto solo y la publicas.',correct:false}]
    },
    { tag:'APODOS OFENSIVOS', icon:'😔',
      q:'Un grupo empieza a llamar a un alumno con apodos crueles. ¿Qué haces?',
      opts:[{t:'Te ríes junto con ellos para no ser el objetivo.',correct:false},{t:'Pides al grupo que pare y hablas con el alumno afectado.',correct:true},{t:'Inventas nuevos apodos creyendo que es una broma.',correct:false},{t:'Observas sin hacer nada.',correct:false}]
    },
    { tag:'NOTICIAS FALSAS', icon:'📰',
      q:'Alguien difunde un rumor completamente falso sobre un compañero. ¿Qué haces?',
      opts:[{t:'Difundes el rumor entre más compañeros.',correct:false},{t:'Verificas la información y avisas que el rumor es falso.',correct:true},{t:'Añades detalles dramáticos al rumor.',correct:false},{t:'Lo ignoras porque no es tu problema.',correct:false}]
    },
    { tag:'TESTIGO DE AGRESIÓN', icon:'😰',
      q:'Ves a un amigo siendo amenazado verbalmente en el pasillo. ¿Qué haces?',
      opts:[{t:'Grabas un video para publicarlo en redes sociales.',correct:false},{t:'Te alejas rápidamente para no involucrarte.',correct:false},{t:'Intervienes con calma y buscas ayuda de un profesor.',correct:true},{t:'Te quedas mirando sin interferir.',correct:false}]
    },
    { tag:'EMPATÍA E INCLUSIÓN', icon:'🌍',
      q:'Un alumno nuevo llegó de otro país y tiene dificultades para integrarse. ¿Qué haces?',
      opts:[{t:'Evitas hablarle porque la comunicación es difícil.',correct:false},{t:'Haces gestos de exclusión junto con los demás.',correct:false},{t:'Te acercas con paciencia y ayudas al nuevo alumno a sentirse bienvenido.',correct:true},{t:'Te ríes de sus intentos de comunicarse.',correct:false}]
    },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// SAVE DATA
// ═══════════════════════════════════════════════════════════════════════════════
let saveData = {
  name:'', avatarIdx:0, xp:0, coins:0, gems:0, bestScore:0, totalGames:0,
  theme:'dark', lang:'pt', purchased:{}, active:{},
  powerCharges:{shield:1,speed:1,magnet:1,slowmo:1},
  loggedEmail:null
};

function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||'{}'); } catch(e){ return {}; }
}
function saveAccounts(db) {
  try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(db)); } catch(e) {}
}

function loadSave() {
  try {
    const r = localStorage.getItem(SAVE_KEY);
    if(r){ const p=JSON.parse(r); Object.assign(saveData,p); }
    if(!saveData.purchased)    saveData.purchased   ={};
    if(!saveData.active)       saveData.active      ={};
    if(!saveData.powerCharges) saveData.powerCharges={shield:1,speed:1,magnet:1,slowmo:1};
    if(!saveData.gems)         saveData.gems        =0;
    if(!saveData.bestScore)    saveData.bestScore   =0;
  } catch(e) {}
}

function writeSave() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(saveData)); } catch(e) {}
  if(saveData.loggedEmail){
    const db=getAccounts();
    if(db[saveData.loggedEmail]) db[saveData.loggedEmail].gameData=JSON.parse(JSON.stringify(saveData));
    saveAccounts(db);
  }
}

function addXP(amount) {
  if(saveData.xp>=MAX_XP) return;
  saveData.xp=Math.min(MAX_XP,saveData.xp+amount);
  if(saveData.xp>=MAX_XP) showMaxLevel();
  writeSave(); updateXPBar();
}

function addCoins(amount) {
  saveData.coins+=amount; writeSave();
  document.getElementById('statCoins').textContent=saveData.coins;
  document.getElementById('shopCoinsDisplay').textContent=saveData.coins;
}

function addGems(amount) {
  saveData.gems+=amount; writeSave();
  document.getElementById('statGems').textContent=saveData.gems;
  document.getElementById('shopGemsDisplay').textContent=saveData.gems;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOP RUN — FIX: unique ID per entry, proper deduplication, clear on wipe
// ═══════════════════════════════════════════════════════════════════════════════
function getTopRun() {
  try { return JSON.parse(localStorage.getItem(TOP_KEY)||'[]'); } catch(e){ return []; }
}
function saveTopRun(arr) {
  try { localStorage.setItem(TOP_KEY, JSON.stringify(arr)); } catch(e) {}
}

function addTopEntry(score, name, dist) {
  // FIX: Don't add zero-score entries
  if(score <= 0) return;
  const arr = getTopRun();
  arr.push({
    id: Date.now() + '_' + Math.random().toString(36).slice(2,7),
    name: (name||'Anônimo').trim() || 'Anônimo',
    score: Math.floor(score),
    dist: Math.floor(dist),
    date: new Date().toLocaleDateString(),
    email: saveData.loggedEmail || null
  });
  // FIX: sort descending by score then trim
  arr.sort((a,b) => b.score - a.score);
  saveTopRun(arr.slice(0, TOP_MAX));
}

// FIX: current tab tracked so both tabs work correctly
let _currentTopTab = 'local';

function renderTopRun(tab) {
  _currentTopTab = tab;
  const list = document.getElementById('topList');
  const entries = getTopRun();
  list.innerHTML = '';

  if(entries.length === 0){
    list.innerHTML = '<div class="top-empty">🏃 Nenhuma corrida ainda!<br>Seja o primeiro!</div>';
    return;
  }

  // FIX: "global" shows all entries; "local" shows only entries from this device/user
  const filtered = tab === 'global'
    ? entries
    : entries.filter(e => {
        if(saveData.loggedEmail && e.email === saveData.loggedEmail) return true;
        if(!e.email && e.name === (saveData.name || '').trim()) return true;
        // If no name set, show all local entries without email
        if(!saveData.name && !e.email) return true;
        return false;
      });

  // If local has nothing but global does, show a hint
  const display = (tab === 'local' && filtered.length === 0) ? entries.slice(0,10) : filtered.slice(0,10);
  const isShowingAll = (tab === 'local' && filtered.length === 0 && entries.length > 0);

  if(isShowingAll){
    const hint = document.createElement('div');
    hint.className = 'top-empty';
    hint.style.padding = '.5rem';
    hint.style.fontSize = '.8rem';
    hint.textContent = '📋 Mostrando todas as corridas';
    list.appendChild(hint);
  }

  display.forEach((e, i) => {
    const rankClass = i===0?'gold':i===1?'silver':i===2?'bronze':'other';
    const isMe = (saveData.loggedEmail && e.email === saveData.loggedEmail) ||
                 (!e.email && (saveData.name && e.name === saveData.name.trim()));
    const div = document.createElement('div');
    div.className = 'top-entry' + (isMe ? ' me' : '');
    div.innerHTML = `
      <div class="top-rank ${rankClass}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div>
      <div class="top-info">
        <div class="top-name">${e.name}${isMe ? ' (você)' : ''}</div>
        <div class="top-score">📅 ${e.date} · 📏 ${e.dist}m</div>
      </div>
      <div class="top-score-val">${e.score.toLocaleString()}</div>`;
    list.appendChild(div);
  });
}

function showTopTab(tab) {
  document.getElementById('tabLocal').classList.toggle('active', tab==='local');
  document.getElementById('tabGlobal').classList.toggle('active', tab==='global');
  renderTopRun(tab);
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH (simulated cloud)
// ═══════════════════════════════════════════════════════════════════════════════
let authTab = 'login';

function switchAuthTab(tab) {
  authTab = tab;
  const T = UI_TEXT[saveData.lang];
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabRegister').classList.toggle('active', tab==='register');
  document.getElementById('registerNameField').style.display = tab==='register' ? 'block' : 'none';
  document.getElementById('authSubmitBtn').textContent = tab==='login'? ('🔑 '+T.loginLbl) : ('✨ '+T.registerLbl);
  document.getElementById('authError').classList.remove('show');
  document.getElementById('authSuccess').classList.remove('show');
}

function handleAuth() {
  const T = UI_TEXT[saveData.lang];
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('authPassword').value;
  const errEl = document.getElementById('authError');
  const okEl  = document.getElementById('authSuccess');
  errEl.classList.remove('show'); okEl.classList.remove('show');

  if(!email.includes('@')){ errEl.textContent=T.errInvalidEmail; errEl.classList.add('show'); return; }
  if(pass.length<6){ errEl.textContent=T.errShortPass; errEl.classList.add('show'); return; }

  const db = getAccounts();

  if(authTab==='register'){
    const regName = document.getElementById('authName').value.trim()||email.split('@')[0];
    if(db[email]){ errEl.textContent=T.errEmailExists; errEl.classList.add('show'); return; }
    db[email] = { email, pass, name: regName, gameData: { ...saveData, loggedEmail:email, name:regName } };
    saveAccounts(db);
    okEl.textContent = T.successRegister; okEl.classList.add('show');
    setTimeout(()=>doLogin(email, db[email]), 1200);
  } else {
    if(!db[email]){ errEl.textContent=T.errNoAccount; errEl.classList.add('show'); return; }
    if(db[email].pass!==pass){ errEl.textContent=T.errWrongPass; errEl.classList.add('show'); return; }
    okEl.textContent = T.successLogin; okEl.classList.add('show');
    setTimeout(()=>doLogin(email, db[email]), 800);
  }
}

function doLogin(email, account) {
  if(account.gameData){
    const cd = account.gameData;
    saveData.coins      = Math.max(saveData.coins,      cd.coins||0);
    saveData.gems       = Math.max(saveData.gems,       cd.gems||0);
    saveData.xp         = Math.max(saveData.xp,         cd.xp||0);
    saveData.bestScore  = Math.max(saveData.bestScore,  cd.bestScore||0);
    saveData.totalGames = Math.max(saveData.totalGames, cd.totalGames||0);
    if(cd.purchased) Object.assign(saveData.purchased, cd.purchased);
    if(cd.powerCharges){
      for(const k in cd.powerCharges)
        saveData.powerCharges[k] = Math.max(saveData.powerCharges[k]||0, cd.powerCharges[k]||0);
    }
    if(cd.name && !saveData.name) saveData.name = cd.name;
  }
  saveData.loggedEmail = email;
  if(!saveData.name) saveData.name = account.name || email.split('@')[0];
  document.getElementById('nameInp').value = saveData.name;
  writeSave(); updateMenuStats(); updateXPBar(); updateAvatar();
  updateLoggedInUI();
  showScreen('menuScreen');
}

function doLogout() {
  saveData.loggedEmail = null;
  writeSave(); updateLoggedInUI();
  showScreen('menuScreen');
}

function updateLoggedInUI() {
  const T = UI_TEXT[saveData.lang];
  const isLogged = !!saveData.loggedEmail;
  const cloudBadge = document.getElementById('cloudBadge');
  if(isLogged){
    cloudBadge.style.display = 'flex';
    document.getElementById('cloudBadgeText').textContent = T.cloudBadgeText(saveData.name||'Jogador');
  } else {
    cloudBadge.style.display = 'none';
  }
  document.getElementById('loggedPanel').style.display = isLogged ? 'block' : 'none';
  document.getElementById('authPanel').style.display   = isLogged ? 'none'  : 'block';
  if(isLogged){
    const all = getAvatarList();
    document.getElementById('loggedAvatar').textContent = all[Math.min(saveData.avatarIdx,all.length-1)];
    document.getElementById('loggedName').textContent  = saveData.name||saveData.loggedEmail;
    document.getElementById('loggedEmail').textContent = saveData.loggedEmail;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS
// ═══════════════════════════════════════════════════════════════════════════════
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let trackGeo = {};
function computeTrackGeometry() {
  const W=canvas.width, H=canvas.height;
  trackGeo = { vanishX:W/2, vanishY:H*0.28, bottomY:H*0.92, halfBottomW:W*0.42, W, H };
}
computeTrackGeometry();

// ═══════════════════════════════════════════════════════════════════════════════
// WEB AUDIO ENGINE — FIX: stable context management, no race conditions
// ═══════════════════════════════════════════════════════════════════════════════
let audioCtx = null;
let musicOn = true;

function ensureAudio() {
  if(!audioCtx){
    try { audioCtx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){ audioCtx = null; }
  }
  if(audioCtx && audioCtx.state === 'suspended'){
    audioCtx.resume().catch(()=>{});
  }
  return !!audioCtx;
}

function playNote(freq, dur, vol=0.3, type='triangle', delay=0) {
  if(!audioCtx || !musicOn) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = type; osc.frequency.value = freq;
    const t = audioCtx.currentTime + delay;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t+0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t+dur);
    osc.start(t); osc.stop(t+dur+0.05);
  } catch(e){}
}

function playSFX(type) {
  if(!ensureAudio()) return;
  switch(type) {
    case 'coin':
      playNote(880, 0.08, 0.2, 'sine');
      playNote(1320, 0.1, 0.15, 'sine', 0.07);
      break;
    case 'gem':
      playNote(660, 0.05, 0.2, 'sine');
      playNote(880, 0.05, 0.2, 'sine', 0.05);
      playNote(1100, 0.12, 0.2, 'sine', 0.1);
      break;
    case 'jump':
      try {
        const jOsc = audioCtx.createOscillator();
        const jGain = audioCtx.createGain();
        jOsc.connect(jGain); jGain.connect(audioCtx.destination);
        jOsc.type = 'triangle';
        const jt = audioCtx.currentTime;
        jOsc.frequency.setValueAtTime(300, jt);
        jOsc.frequency.exponentialRampToValueAtTime(600, jt+0.15);
        jGain.gain.setValueAtTime(0.25, jt);
        jGain.gain.exponentialRampToValueAtTime(0.001, jt+0.25);
        jOsc.start(jt); jOsc.stop(jt+0.3);
      } catch(e){}
      break;
    case 'shield':
      [220,330,440,660].forEach((f,i) => playNote(f, 0.15, 0.18, 'sine', i*0.06));
      break;
    case 'hit':
      try {
        const hOsc = audioCtx.createOscillator();
        const hGain = audioCtx.createGain();
        hOsc.connect(hGain); hGain.connect(audioCtx.destination);
        hOsc.type = 'sawtooth';
        const ht = audioCtx.currentTime;
        hOsc.frequency.setValueAtTime(150, ht);
        hOsc.frequency.exponentialRampToValueAtTime(50, ht+0.3);
        hGain.gain.setValueAtTime(0.4, ht);
        hGain.gain.exponentialRampToValueAtTime(0.001, ht+0.35);
        hOsc.start(ht); hOsc.stop(ht+0.4);
      } catch(e){}
      break;
    case 'power':
      [440,550,660,880].forEach((f,i) => playNote(f, 0.2, 0.15, 'triangle', i*0.05));
      break;
    case 'correct':
      [523,659,784,1047].forEach((f,i) => playNote(f, 0.18, 0.2, 'sine', i*0.08));
      break;
    case 'wrong':
      playNote(220, 0.3, 0.3, 'sawtooth');
      playNote(180, 0.4, 0.25, 'sawtooth', 0.15);
      break;
    case 'levelup':
      [523,659,784,659,784,1047].forEach((f,i)=>playNote(f,0.18,0.25,'sine',i*0.12));
      break;
    case 'gameover':
      [440,330,220,165].forEach((f,i)=>playNote(f,0.35,0.3,'sawtooth',i*0.18));
      break;
    case 'click':
      playNote(880, 0.05, 0.1, 'sine');
      break;
    case 'perfect':
      [523,659,784,1047,784,1047,1319].forEach((f,i)=>playNote(f,0.2,0.2,'sine',i*0.1));
      break;
    // FIX: New victory fanfare for breaking the record
    case 'victory':
      // Triumphant ascending fanfare
      [523,659,784,523,659,784,1047,784,1047,1319].forEach((f,i)=>playNote(f,0.22,0.28,'sine',i*0.11));
      // Add a chord layer
      [392,494,587].forEach((f,i)=>playNote(f,0.8,0.12,'triangle',0.4+i*0.05));
      break;
  }
}

// ── Background Music — FIX: single instance lock, proper stop/start ──
let bgMusicTimeout = null;
let bgMusicRunning = false;  // FIX: lock to prevent multiple concurrent loops
const MUSIC_NOTES = [261, 294, 330, 349, 392, 440, 494, 523];
const MUSIC_PATTERNS = [
  [0,2,4,5,7,5,4,2],
  [0,4,7,4,0,4,7,9],
  [7,5,4,2,0,2,4,5],
  [0,2,4,7,9,7,4,2],
];
let musicPattern = 0, musicStep = 0, musicBPM = 130;

function playBGMusic() {
  // FIX: guard against multiple concurrent loops
  if(!audioCtx || !musicOn || !game.running || bgMusicRunning) return;
  bgMusicRunning = true;

  function tick() {
    // FIX: always check fresh state before scheduling next note
    if(!audioCtx || !musicOn || !game.running){
      bgMusicRunning = false;
      return;
    }
    const pattern = MUSIC_PATTERNS[musicPattern % MUSIC_PATTERNS.length];
    const noteIdx = pattern[musicStep % pattern.length];
    const freq = MUSIC_NOTES[noteIdx];
    const bpm  = Math.min(180, musicBPM + game.speedRamp * 40);

    try {
      playNote(freq/2, 0.18, 0.12, 'triangle');
      if(musicStep%2===0) playNote(freq*2, 0.12, 0.08, 'sine');
    } catch(e){}

    musicStep++;
    if(musicStep % 8 === 0) musicPattern++;

    const interval = (60/bpm)*1000;
    bgMusicTimeout = setTimeout(tick, interval);
  }
  tick();
}

function stopBGMusic() {
  if(bgMusicTimeout){ clearTimeout(bgMusicTimeout); bgMusicTimeout=null; }
  bgMusicRunning = false;  // FIX: release lock
}

function toggleMusic() {
  musicOn = !musicOn;
  document.getElementById('musicToggle').textContent = musicOn ? '🎵' : '🔇';
  if(musicOn && game.running){
    ensureAudio();
    stopBGMusic();       // FIX: ensure clean state before restarting
    playBGMusic();
  } else {
    stopBGMusic();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════════════════════
const game = {
  running:false, paused:false,
  lane:1, targetLane:1, laneTransition:1.0,
  speed:0, speedRamp:0,
  score:0, coins:0, gems:0, xpEarned:0, distance:0,
  obstacles:[], collectibles:[], particles:[],
  obstacleTimer:0, collectibleTimer:0,
  dilemmaTimer:0, dilemmaInterval:28,
  dilemmaShown:[], dilemmaQueue:[],
  playerBobT:0, bgOffset:0,
  shieldActive:false, xpMultActive:false, coinBoostActive:false,
  lives:MAX_LIVES,
  questionsAnswered:0, questionsCorrect:0, questionsWrong:0,
  perfectRun:true, allQAnswered:false,
  lastTime:0, raf:null,
  dilemaOpen:false,    // FIX: track dilema state cleanly
  powers:[
    {id:'shield', active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'speed',  active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'magnet', active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'slowmo', active:false, cdLeft:0, activeLeft:0, charges:0},
  ],
  slowmoActive:false, magnetActive:false, speedBoostActive:false,
  decorObjects:[],
  recordBeaten:false,   // FIX: track if record was beaten mid-run
};

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  computeTrackGeometry();
  if(!game.running) drawMenuBg();
}
window.addEventListener('resize', resizeCanvas);

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
function getLaneX(laneIdx, z) {
  const {vanishX,vanishY,bottomY,halfBottomW}=trackGeo;
  const yPos = vanishY+(bottomY-vanishY)*z;
  const laneW= halfBottomW*2*z;
  const step = laneW/LANES;
  return { x:(vanishX-laneW/2+step/2)+laneIdx*step, y:yPos };
}
function easeInOut(t){ return t<0.5?2*t*t:-1+(4-2*t)*t; }
function isMobile(){ return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||window.innerWidth<768; }
function roundRect(c,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  c.beginPath();
  c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();
}
function getObstacleW(z){ return trackGeo.halfBottomW*2*z/LANES*0.82; }

// ═══════════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  if(id) document.getElementById(id).classList.add('active');
}
function hideAllScreens(){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); }

function showMaxLevel() {
  const el=document.getElementById('maxLvlBadge');
  el.style.display='block'; playSFX('levelup');
  setTimeout(()=>el.style.display='none',3200);
}

function updateXPBar() {
  const pct=Math.min(100,(saveData.xp/MAX_XP)*100);
  document.getElementById('xpBarFill').style.width=pct+'%';
  document.getElementById('xpCurrent').textContent=saveData.xp;
  const T=UI_TEXT[saveData.lang];
  document.getElementById('xpLvlLabel').textContent=saveData.xp>=MAX_XP?T.maxLvl:'';
}

function updateMenuStats() {
  document.getElementById('statBest').textContent   = saveData.bestScore;
  document.getElementById('statCoins').textContent  = saveData.coins;
  document.getElementById('statGems').textContent   = saveData.gems;
  document.getElementById('statGames').textContent  = saveData.totalGames;
  const total=Object.values(saveData.powerCharges||{}).reduce((a,b)=>a+b,0);
  document.getElementById('statPowers').textContent = total;
  document.getElementById('shopCoinsDisplay').textContent = saveData.coins;
  document.getElementById('shopGemsDisplay').textContent  = saveData.gems;
}

function updateAvatar() {
  const all=getAvatarList();
  document.getElementById('avatarBtn').textContent=all[Math.min(saveData.avatarIdx,all.length-1)];
}
function getAvatarList() {
  const all=[...AVATARS_BASE];
  if(saveData.purchased&&saveData.purchased.avatar1) all.push('🦸');
  if(saveData.purchased&&saveData.purchased.avatar2) all.push('🧙');
  return all;
}

function updateLivesHUD() {
  const maxLv = (saveData.active&&saveData.active.extraLife) ? MAX_LIVES+1 : MAX_LIVES;
  const hearts = '❤️'.repeat(Math.max(0,game.lives)) + '🖤'.repeat(Math.max(0,maxLv-game.lives));
  document.getElementById('hudLives').textContent=hearts;
  document.getElementById('dilemaLivesEl').textContent=hearts;
}

function showFloatNotif(msg, cls) {
  const el=document.getElementById('floatNotif');
  el.className=cls||''; el.textContent=msg;
  el.style.display='block'; el.style.animation='none'; void el.offsetWidth;
  el.style.animation='fadeInOut 2.8s ease forwards';
  clearTimeout(el._t); el._t=setTimeout(()=>el.style.display='none',2900);
}

// FIX: in-game record badge (separate from floatNotif to avoid conflict)
function showInGameRecordBadge() {
  const el = document.getElementById('recordBadge');
  if(!el) return;
  const T = UI_TEXT[saveData.lang];
  el.textContent = T.newRecordInGame;
  el.style.display = 'block';
  el.style.animation = 'none'; void el.offsetWidth;
  el.style.animation = 'fadeInOut 3s ease forwards';
  setTimeout(() => el.style.display = 'none', 3100);
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME & LANG
// ═══════════════════════════════════════════════════════════════════════════════
function applyTheme(t) {
  document.body.className='theme-'+t; saveData.theme=t; writeSave();
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.dataset.theme===t));
  if(!game.running) drawMenuBg();
}

function applyLang(l) {
  saveData.lang=l; writeSave();
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
  const T=UI_TEXT[l];
  const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  set('menuTitle',T.menuTitle);
  set('lblName',T.lblName); set('lblXP',T.lblXP); set('lblTheme',T.lblTheme); set('lblLang',T.lblLang);
  set('statBestKey',T.statBestKey); set('statCoinsKey',T.statCoinsKey); set('statGamesKey',T.statGamesKey);
  set('shopTitle',T.shopTitle); set('shopBackLbl',T.shopBackLbl);
  set('goTitle',T.goTitle); set('goScoreKey',T.goScoreKey); set('goDistKey',T.goDistKey);
  set('goCoinsKey',T.goCoinsKey); set('goGemsKey',T.goGemsKey);
  set('goXpLabel',T.goXpLabel); set('goQLabel',T.goQLabel);
  set('replayLbl',T.replayLbl); set('goMenuLbl',T.goMenuLbl);
  set('splashLoading',T.splashLoading); set('splashTitle',T.menuTitle);
  set('themeD',T.themeD); set('themeL',T.themeL); set('themeBW',T.themeBW);
  set('maxLvlBadge',T.maxLvl);
  set('perfectTitle',T.perfectTitle);
  set('perfectContinueBtn',T.perfectContinue);
  set('perfectMenuLbl',T.perfectMenu);
  set('pScoreKey',T.pScoreKey); set('pDistKey',T.pDistKey); set('pXPKey',T.pXPKey); set('pCoinsKey',T.pCoinsKey);
  set('powerBarHint',T.powerBarHint);
  set('topRunTitle',T.topRunTitle); set('topBackLbl',T.topBackLbl);
  set('loginTitle',T.loginTitle); set('loginBtnLbl',T.loginBtnLbl);
  set('syncNowLbl',T.syncNowLbl); set('logoutLbl',T.logoutLbl); set('loginBackLbl',T.loginBackLbl);
  set('lblEmail',T.lblEmail); set('lblPassword',T.lblPassword); set('lblRegName',T.lblRegName);
  set('authFootnote',T.authFootnote);
  set('cloudSyncInfo',T.cloudSyncInfo);
  T.powerNames.forEach((name,i)=>{ const el=document.getElementById('plbl'+i); if(el) el.textContent=name; });
  document.getElementById('authSubmitBtn').textContent = authTab==='login'?('🔑 '+T.loginLbl):('✨ '+T.registerLbl);
  renderShop();
}

// ═══════════════════════════════════════════════════════════════════════════════
// POWER BAR UI
// ═══════════════════════════════════════════════════════════════════════════════
function updatePowerBar() {
  game.powers.forEach((p,i)=>{
    const iconEl=document.getElementById('picon'+i);
    const cdEl=document.getElementById('pcd'+i);
    if(!iconEl||!cdEl) return;
    iconEl.className='power-icon';
    if(p.active){ iconEl.classList.add('active-power'); cdEl.style.display='none'; }
    else if(p.cdLeft>0){ iconEl.classList.add('cooldown'); cdEl.style.display='flex'; cdEl.textContent=Math.ceil(p.cdLeft)+'s'; }
    else if(p.charges>0){ iconEl.classList.add('ready'); cdEl.style.display='none'; }
    else { cdEl.style.display='flex'; cdEl.textContent='0'; }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHOP
// ═══════════════════════════════════════════════════════════════════════════════
function renderShop() {
  const T=UI_TEXT[saveData.lang];
  const grid=document.getElementById('shopGrid');
  grid.innerHTML='';
  const sections=[
    ['buy50coins','buy200coins','buy5gems','buy20gems'],
    ['shieldCharge','speedCharge','magnetCharge','slowCharge'],
    ['xpMult','coinBoost','extraLife','avatar1','avatar2'],
  ];
  sections.forEach((ids,si)=>{
    const titleDiv=document.createElement('div');
    titleDiv.className='shop-section-title'; titleDiv.textContent=T.shopSections[si];
    grid.appendChild(titleDiv);
    ids.forEach(itemId=>{
      const item=SHOP_ITEMS.find(i=>i.id===itemId); if(!item) return;
      const info=T.shopItems[itemId];
      const bought=!!(saveData.purchased&&saveData.purchased[itemId]);
      const isActive=!!(saveData.active&&saveData.active[itemId]);
      const isCoin=item.currency==='coin';
      const currency=isCoin?saveData.coins:saveData.gems;
      const canAfford=currency>=item.cost;
      let btnHtml='';
      if(item.type==='unlock'&&bought){
        btnHtml=`<button class="btn sm outline" disabled>${(itemId==='avatar1'||itemId==='avatar2')?T.boughtBtn:(isActive?('✓ '+T.activeBtn):('✓ '+T.boughtBtn))}</button>`;
      } else if(item.type==='charge'){
        const ck=itemId.replace('Charge','');
        const charges=saveData.powerCharges[ck]||0;
        btnHtml=`<div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
          <span style="font-size:.7rem;color:var(--subtext);">x${charges}</span>
          <button class="btn sm ${canAfford?'':'danger'}" data-buy="${itemId}" ${canAfford?'':'disabled'}>
            ${canAfford?T.buyBtn:(!isCoin?T.noGems:T.noCoins)} ${isCoin?'🪙':'💎'}${item.cost}</button>
        </div>`;
      } else {
        btnHtml=`<button class="btn sm ${canAfford?'':'danger'}" data-buy="${itemId}" ${canAfford?'':'disabled'}>
          ${canAfford?T.buyBtn:(!isCoin?T.noGems:T.noCoins)} ${isCoin?'🪙':'💎'}${item.cost}</button>`;
      }
      const priceClass=isCoin?'coin-price':'gem-price';
      const priceIcon=isCoin?'🪙':'💎';
      const div=document.createElement('div');
      div.className='shop-item';
      div.innerHTML=`<div class="si-icon">${item.icon}</div>
        <div class="si-info"><div class="si-name">${info.name}</div><div class="si-desc">${info.desc}</div>
        <div class="si-price ${priceClass}">${priceIcon} ${item.cost}</div></div>
        <div class="si-action">${btnHtml}</div>`;
      grid.appendChild(div);
    });
  });
  grid.querySelectorAll('[data-buy]').forEach(btn=>btn.addEventListener('click',()=>{ playSFX('click'); buyItem(btn.dataset.buy); }));
}

function buyItem(id) {
  const item=SHOP_ITEMS.find(i=>i.id===id); if(!item) return;
  const isCoin=item.currency==='coin';
  const currency=isCoin?saveData.coins:saveData.gems;
  if(currency<item.cost) return;
  if(isCoin) saveData.coins-=item.cost; else saveData.gems-=item.cost;
  if(item.type==='pack'){
    if(id==='buy50coins')  saveData.coins+=50;
    if(id==='buy200coins') saveData.coins+=200;
    if(id==='buy5gems')    saveData.gems+=5;
    if(id==='buy20gems')   saveData.gems+=20;
  } else if(item.type==='charge'){
    const ck=id.replace('Charge','');
    saveData.powerCharges[ck]=(saveData.powerCharges[ck]||0)+1;
  } else if(item.type==='unlock'){
    saveData.purchased[id]=true;
    if(id!=='avatar1'&&id!=='avatar2') saveData.active[id]=true;
  }
  writeSave(); updateAvatar(); updateMenuStats(); renderShop();
  playSFX('coin');
}

// ═══════════════════════════════════════════════════════════════════════════════
// POWERS — FIX: sync charges back to saveData on game over
// ═══════════════════════════════════════════════════════════════════════════════
function activatePower(idx) {
  if(!game.running||game.paused) return;
  const p=game.powers[idx]; const def=POWERS_DEF[idx];
  const T=UI_TEXT[saveData.lang];
  if(p.active||p.cdLeft>0) return;
  if(p.charges<=0){ showFloatNotif(T.powerNoCharge(T.powerNames[idx]),'notif-warn'); return; }
  p.charges--; p.active=true; p.activeLeft=def.duration; p.cdLeft=0;
  showFloatNotif(T.powerActivated(T.powerNames[idx]),'notif-power');
  playSFX('power');
  if(idx===0){ game.shieldActive=true; playSFX('shield'); }
  else if(idx===1) game.speedBoostActive=true;
  else if(idx===2) game.magnetActive=true;
  else if(idx===3) game.slowmoActive=true;
  updatePowerBar();
}

function updatePowers(dt) {
  game.powers.forEach((p,idx)=>{
    if(p.cdLeft>0) p.cdLeft=Math.max(0,p.cdLeft-dt);
    if(p.active){
      p.activeLeft-=dt;
      if(p.activeLeft<=0){
        p.active=false; p.cdLeft=POWERS_DEF[idx].cooldown;
        if(idx===0) game.shieldActive=false;
        else if(idx===1) game.speedBoostActive=false;
        else if(idx===2) game.magnetActive=false;
        else if(idx===3) game.slowmoActive=false;
      }
    }
  });
  updatePowerBar();
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAME START
// ═══════════════════════════════════════════════════════════════════════════════
function startGame() {
  ensureAudio(); resizeCanvas(); computeTrackGeometry();
  const pool=DILEMMAS[saveData.lang];
  const indices=pool.map((_,i)=>i).sort(()=>Math.random()-0.5);
  const maxLives=(saveData.active&&saveData.active.extraLife) ? MAX_LIVES+1 : MAX_LIVES;
  const pCharges=[
    saveData.powerCharges.shield||0,
    saveData.powerCharges.speed||0,
    saveData.powerCharges.magnet||0,
    saveData.powerCharges.slowmo||0,
  ];
  const decors=[];
  for(let i=0;i<12;i++) decors.push({ side:i%2===0?'left':'right', z:i/12, type:Math.floor(Math.random()*4) });

  Object.assign(game,{
    running:true, paused:false,
    lane:1, targetLane:1, laneTransition:1.0,
    speed:BASE_SPEED, speedRamp:0,
    score:0, coins:0, gems:0, xpEarned:0, distance:0,
    obstacles:[], collectibles:[], particles:[],
    obstacleTimer:0, collectibleTimer:0,
    dilemmaTimer:0, dilemmaInterval:28,
    dilemmaShown:[], dilemmaQueue:[...indices],
    playerBobT:0, bgOffset:0,
    shieldActive:false,
    xpMultActive:!!(saveData.active&&saveData.active.xpMult),
    coinBoostActive:!!(saveData.active&&saveData.active.coinBoost),
    lives:maxLives,
    questionsAnswered:0, questionsCorrect:0, questionsWrong:0,
    perfectRun:true, allQAnswered:false,
    slowmoActive:false, magnetActive:false, speedBoostActive:false,
    powers:POWERS_DEF.map((def,i)=>({id:def.id,active:false,cdLeft:0,activeLeft:0,charges:pCharges[i]})),
    decorObjects:decors,
    dilemaOpen:false,
    recordBeaten:false,
  });

  // Consume single-use active items
  if(saveData.active&&saveData.active.xpMult)   { saveData.active.xpMult=false;   writeSave(); }
  if(saveData.active&&saveData.active.coinBoost) { saveData.active.coinBoost=false; writeSave(); }
  if(saveData.active&&saveData.active.extraLife) { saveData.active.extraLife=false; writeSave(); }

  saveData.totalGames++; writeSave(); updateMenuStats();
  hideAllScreens();
  document.getElementById('perfectScreen').classList.remove('active');
  document.getElementById('hud').classList.add('active');
  document.getElementById('powerBar').classList.add('active');
  document.getElementById('musicToggle').classList.add('active');
  if(isMobile()) document.getElementById('mobileHint').classList.add('visible');
  updateHUD(); updateLivesHUD(); updatePowerBar();

  // FIX: always fully stop before starting fresh
  musicStep=0; musicPattern=0; musicBPM=130;
  stopBGMusic();
  if(musicOn){ playBGMusic(); }

  game.lastTime=performance.now();
  if(game.raf) cancelAnimationFrame(game.raf);
  game.raf=requestAnimationFrame(gameLoop);
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAME LOOP
// ═══════════════════════════════════════════════════════════════════════════════
function gameLoop(ts) {
  if(!game.running) return;
  const dt=Math.min((ts-game.lastTime)/1000, 0.05);
  game.lastTime=ts;
  if(!game.paused) updateGame(dt);
  renderFrame();
  game.raf=requestAnimationFrame(gameLoop);
}

function updateGame(dt) {
  game.speedRamp = Math.min(game.speedRamp+dt*SPEED_RAMP, 1.0);
  const slowFactor = game.slowmoActive ? 0.35 : 1.0;
  game.speed    = BASE_SPEED+(MAX_SPEED-BASE_SPEED)*easeInOut(game.speedRamp);
  game.distance += game.speed*dt*4;
  game.score    += game.speed*dt*10;
  game.playerBobT += dt*3;
  game.bgOffset   += game.speed*dt*18*slowFactor;

  updatePowers(dt);

  // Lane transition
  if(game.lane!==game.targetLane){
    game.laneTransition=Math.min(1,game.laneTransition+dt*7);
    if(game.laneTransition>=1){ game.laneTransition=1; game.lane=game.targetLane; }
  }

  // FIX: check if current score beats record mid-run (only once)
  if(!game.recordBeaten && Math.floor(game.score) > saveData.bestScore && saveData.bestScore > 0){
    game.recordBeaten = true;
    showInGameRecordBadge();
    playSFX('victory');  // FIX: play victory music when record is broken
  }

  // Dilemma timer
  if(!game.allQAnswered&&game.dilemmaQueue.length>0){
    game.dilemmaTimer+=dt;
    if(game.dilemmaTimer>=game.dilemmaInterval){ game.dilemmaTimer=0; triggerDilema(); return; }
  }

  // Obstacle spawn
  game.obstacleTimer+=dt;
  const oInterval=Math.max(2.2, 5.5-game.speedRamp*3.0);
  if(game.obstacleTimer>=oInterval){ game.obstacleTimer=0; spawnObstacle(); }

  // Collectible spawn
  game.collectibleTimer+=dt;
  const cInterval=Math.max(0.7, 2.0-game.speedRamp*1.2);
  if(game.collectibleTimer>=cInterval){ game.collectibleTimer=0; spawnCollectible(); }

  const moveSpeed=game.speed*0.45*slowFactor;

  if(game.speedBoostActive){
    game.obstacles=game.obstacles.filter(o=>{
      if(o.z>0.5&&o.z<0.95){ const p=getLaneX(o.lane,o.z); spawnParticles(p.x,p.y,'#fbbf24',8); return false; }
      return true;
    });
  }

  game.decorObjects.forEach(d=>{
    d.z+=dt*moveSpeed*0.7;
    if(d.z>=1.05){ d.z=0; d.type=Math.floor(Math.random()*4); d.side=Math.random()<0.5?'left':'right'; }
  });

  game.obstacles=game.obstacles.filter(o=>{ o.z+=dt*moveSpeed; return o.z<1.08; });
  game.collectibles=game.collectibles.filter(c=>{
    c.z+=dt*moveSpeed;
    if(game.magnetActive&&!c.collected){
      const playerZ=0.87;
      if(c.z>0.4&&c.z<playerZ+0.12){
        const tLane=game.targetLane;
        if(c.lane!==tLane) c.lane=c.lane+(c.lane<tLane?0.05:-0.05);
      }
    }
    if(c.collected){ c.alpha-=dt*4; return c.alpha>0; }
    return c.z<1.08;
  });
  game.particles=game.particles.filter(p=>{
    p.x+=p.vx*dt; p.y+=p.vy*dt; p.alpha-=dt*2; p.size-=dt*8;
    return p.alpha>0&&p.size>0;
  });

  checkCollisions(); updateHUD();
}

function spawnObstacle() {
  const lane=Math.floor(Math.random()*LANES);
  const variant=Math.floor(Math.random()*3);
  game.obstacles.push({ lane, z:0.01, hit:false, variant });
}

function spawnCollectible() {
  const lane=Math.floor(Math.random()*LANES);
  const type=Math.random()<0.7?'coin':'gem';
  if(type==='coin'&&Math.random()<0.4){
    for(let i=0;i<3;i++) game.collectibles.push({lane,z:0.01+i*0.06,type:'coin',collected:false,alpha:1,bob:Math.random()*Math.PI*2});
  } else {
    game.collectibles.push({lane,z:0.01,type,collected:false,alpha:1,bob:Math.random()*Math.PI*2});
  }
}

function checkCollisions() {
  const playerZ=0.87;
  const activeLanes=new Set([game.lane,game.targetLane]);
  game.obstacles.forEach(o=>{
    if(o.hit) return;
    if(!activeLanes.has(Math.floor(o.lane))) return;
    if(Math.abs(o.z-playerZ)<0.09){
      if(game.shieldActive){
        o.hit=true;
        const shieldPower=game.powers[0];
        if(!shieldPower.active) game.shieldActive=false;
        showShieldPop(); playSFX('shield');
        const p=getLaneX(o.lane,o.z); spawnParticles(p.x,p.y,'#a855f7',14);
      } else { playSFX('hit'); endGame(); }
    }
  });
  game.collectibles.forEach(c=>{
    if(c.collected) return;
    const cLane=Math.floor(Math.round(c.lane));
    if(!activeLanes.has(cLane)) return;
    if(Math.abs(c.z-playerZ)<0.07){
      c.collected=true;
      const p=getLaneX(c.lane,c.z);
      if(c.type==='coin'){
        const v=game.coinBoostActive?2:1;
        game.coins+=v; game.score+=10*v;
        spawnParticles(p.x,p.y,'#fbbf24',6);
        playSFX('coin');
      } else {
        game.gems++;
        game.xpEarned+=game.xpMultActive?40:20;
        spawnParticles(p.x,p.y,'#60a5fa',8);
        playSFX('gem');
      }
    }
  });
}

function spawnParticles(x,y,color,count) {
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2, s=50+Math.random()*100;
    game.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,alpha:1,size:5+Math.random()*6,color});
  }
}

function showShieldPop() {
  const el=document.getElementById('shieldIndicator');
  el.style.display='block'; el.style.animation='none'; void el.offsetWidth;
  el.style.animation='shieldPop .6s cubic-bezier(0.34,1.56,0.64,1) forwards';
  setTimeout(()=>el.style.display='none',700);
}

function updateHUD() {
  document.getElementById('hudScore').textContent  = Math.floor(game.score);
  document.getElementById('hudCoins').textContent  = game.coins;
  document.getElementById('hudGems').textContent   = game.gems;
  document.getElementById('hudDistEl').textContent = Math.floor(game.distance)+'m';
  document.getElementById('hudShield').style.display = game.shieldActive ? 'flex' : 'none';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DILEMA — FIX: dilemaOpen flag, no double-close, timeout properly cleared
// ═══════════════════════════════════════════════════════════════════════════════
function triggerDilema() {
  // FIX: guard against double-open
  if(game.dilemaOpen) return;
  if(game.dilemmaQueue.length===0) return;
  game.paused=true;
  game.dilemaOpen=true;
  const lang=saveData.lang, pool=DILEMMAS[lang];
  const idx=game.dilemmaQueue.shift();
  const d=pool[idx];
  game.dilemmaShown.push(idx);
  const T=UI_TEXT[lang];
  document.getElementById('dilemaIcon').textContent=d.icon;
  document.getElementById('dilemaTag').textContent=T.dilemaTag+': '+d.tag;
  document.getElementById('dilemaQ').textContent=d.q;
  document.getElementById('dilemaResultMsg').className='dilema-result-msg';
  document.getElementById('dilemaResultMsg').textContent='';
  updateLivesHUD();
  const optsEl=document.getElementById('dilemaOpts');
  optsEl.innerHTML='';
  const shuffled=[...d.opts].sort(()=>Math.random()-0.5);
  shuffled.forEach((opt,i)=>{
    const btn=document.createElement('button');
    btn.className='dilema-opt';
    btn.innerHTML=`<span class="opt-letter">${LETTERS[i]}</span><span>${opt.t}</span>`;
    btn.addEventListener('click',()=>handleDilemaAnswer(btn,opt.correct,optsEl,shuffled));
    optsEl.appendChild(btn);
  });
  document.getElementById('dilemaTimerFill').style.width='100%';
  document.getElementById('dilemaModal').classList.add('active');

  // FIX: clear any leftover timers before setting new ones
  clearTimeout(game._dilemaAutoClose);
  clearInterval(game._dilemaTimerInterval);

  let elapsed=0; const totalMs=20000;
  game._dilemaAutoClose=setTimeout(()=>handleDilemaTimeout(optsEl,shuffled),totalMs);
  game._dilemaTimerInterval=setInterval(()=>{
    elapsed+=100;
    document.getElementById('dilemaTimerFill').style.width=Math.max(0,100-(elapsed/totalMs)*100)+'%';
  },100);
}

function handleDilemaTimeout(optsEl,shuffled) {
  // FIX: only handle if dilema is still open
  if(!game.dilemaOpen) return;
  clearInterval(game._dilemaTimerInterval);
  const btns=optsEl.querySelectorAll('.dilema-opt');
  btns.forEach((b,i)=>{
    b.disabled=true;
    b.classList.add('disabled-opt');
    if(shuffled[i].correct) b.classList.add('correct');
  });
  const T=UI_TEXT[saveData.lang];
  const msgEl=document.getElementById('dilemaResultMsg');
  msgEl.textContent=T.timeoutMsg; msgEl.className='dilema-result-msg show-wrong';
  playSFX('wrong');
  game.perfectRun=false;
  game.questionsAnswered++;
  game.questionsWrong++;
  setTimeout(()=>{ closeDilema(); loseLifeAfterDilema(); }, 1800);
}

function handleDilemaAnswer(btn,correct,optsEl,shuffled) {
  // FIX: ignore clicks if already closed
  if(!game.dilemaOpen) return;
  clearTimeout(game._dilemaAutoClose); clearInterval(game._dilemaTimerInterval);
  const allBtns=optsEl.querySelectorAll('.dilema-opt');
  allBtns.forEach(b=>{ b.disabled=true; b.classList.add('disabled-opt'); });
  btn.classList.remove('disabled-opt'); btn.classList.add(correct?'correct':'wrong');
  if(!correct) allBtns.forEach((b,i)=>{ if(shuffled[i].correct) b.classList.add('correct'); });
  game.questionsAnswered++;
  const T=UI_TEXT[saveData.lang];
  const msgEl=document.getElementById('dilemaResultMsg');
  if(correct){
    game.questionsCorrect++;
    const xpBonus=game.xpMultActive?1000:500;
    game.xpEarned+=xpBonus; game.score+=500; game.coins+=50;
    msgEl.textContent=T.correctMsg; msgEl.className='dilema-result-msg show-correct';
    playSFX('correct');
    if(game.dilemmaQueue.length===0&&game.perfectRun){
      // Perfect run — close dilema then show perfect screen
      setTimeout(()=>{ closeDilema(); showPerfectScreen(); },1800);
    } else {
      setTimeout(()=>closeDilema(),1600);
    }
  } else {
    game.questionsWrong++; game.perfectRun=false;
    msgEl.textContent=T.wrongMsg; msgEl.className='dilema-result-msg show-wrong';
    playSFX('wrong');
    setTimeout(()=>{ closeDilema(); loseLifeAfterDilema(); },1800);
  }
}

// FIX: separate loseLife from closeDilema so they don't call each other
function loseLifeAfterDilema() {
  game.lives--;
  updateLivesHUD();
  const flash=document.getElementById('lifeLostFlash');
  flash.className=''; void flash.offsetWidth; flash.className='flash';
  if(game.lives<=0){
    setTimeout(()=>endGame(),400);
  }
  // game.paused was already set to false in closeDilema()
}

function closeDilema() {
  // FIX: only close once, only if open
  if(!game.dilemaOpen) return;
  clearTimeout(game._dilemaAutoClose);
  clearInterval(game._dilemaTimerInterval);
  game._dilemaAutoClose=null;
  game._dilemaTimerInterval=null;
  document.getElementById('dilemaModal').classList.remove('active');
  game.dilemaOpen=false;
  game.paused=false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERFECT SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function showPerfectScreen() {
  game.paused=true; game.allQAnswered=true;
  const T=UI_TEXT[saveData.lang];
  const bonusXP=2000, bonusCoins=200;
  game.xpEarned+=bonusXP; game.coins+=bonusCoins; game.score+=1000;
  document.getElementById('pScore').textContent   = Math.floor(game.score);
  document.getElementById('pDist').textContent    = Math.floor(game.distance)+'m';
  document.getElementById('pXP').textContent      = '+'+bonusXP;
  document.getElementById('pCoins').textContent   = '+'+bonusCoins;
  document.getElementById('perfectSubtitle').textContent = T.perfectSubtitle;
  spawnConfetti(); playSFX('perfect');
  document.getElementById('perfectScreen').classList.add('active');
}

function spawnConfetti() {
  const c=document.getElementById('confettiContainer'); c.innerHTML='';
  const colors=['#c084fc','#22c55e','#fbbf24','#60a5fa','#f472b6','#34d399','#fb923c'];
  for(let i=0;i<80;i++){
    const piece=document.createElement('div');
    piece.className='confetti-piece';
    piece.style.left=Math.random()*100+'vw';
    piece.style.background=colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDuration=(2+Math.random()*3)+'s';
    piece.style.animationDelay=(Math.random()*2)+'s';
    const s=8+Math.random()*10;
    piece.style.width=s+'px'; piece.style.height=s+'px';
    piece.style.borderRadius=Math.random()>.5?'50%':'3px';
    c.appendChild(piece);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAME OVER — FIX: coins/gems saved before XP; power charges synced; record
//             detection done once and correctly; no double save
// ═══════════════════════════════════════════════════════════════════════════════
function endGame() {
  if(!game.running) return;  // FIX: guard against double-call
  stopBGMusic();
  game.running=false;
  if(game.raf){ cancelAnimationFrame(game.raf); game.raf=null; }

  // FIX: force-close dilema if somehow still open
  if(game.dilemaOpen) closeDilema();

  document.getElementById('hud').classList.remove('active');
  document.getElementById('powerBar').classList.remove('active');
  document.getElementById('musicToggle').classList.remove('active');
  document.getElementById('mobileHint').classList.remove('visible');
  document.getElementById('perfectScreen').classList.remove('active');
  document.getElementById('confettiContainer').innerHTML='';

  // FIX: accumulate coins/gems into saveData FIRST
  saveData.coins += game.coins;
  saveData.gems  += game.gems;

  // FIX: calculate XP correctly (multiplier applied to xpEarned only, score bonus added after)
  const scoreBonus = Math.floor(game.score / 50);
  const finalXP = (game.xpMultActive ? game.xpEarned * 2 : game.xpEarned) + scoreBonus;

  // FIX: check record ONCE here (not duplicated elsewhere)
  const isNew = Math.floor(game.score) > saveData.bestScore;
  if(isNew){
    saveData.bestScore = Math.floor(game.score);
    // FIX: play victory music only if record not already beaten mid-run
    if(!game.recordBeaten){
      playSFX('victory');
    }
  } else {
    playSFX('gameover');
  }

  // FIX: sync unused power charges back to saveData
  game.powers.forEach((p, i) => {
    const key = POWERS_DEF[i].id;
    saveData.powerCharges[key] = (saveData.powerCharges[key] || 0) + p.charges;
  });

  writeSave();
  addXP(finalXP);      // addXP calls writeSave internally
  updateMenuStats();

  // Add to leaderboard
  addTopEntry(game.score, saveData.name||'Anônimo', game.distance);

  const T=UI_TEXT[saveData.lang];
  document.getElementById('goScore').textContent  = Math.floor(game.score);
  document.getElementById('goDist').textContent   = Math.floor(game.distance)+'m';
  document.getElementById('goCoins').textContent  = game.coins;
  document.getElementById('goGems').textContent   = game.gems;
  document.getElementById('goXp').textContent     = '+'+finalXP;
  document.getElementById('goQStats').textContent = T.qStatsLabel(game.questionsCorrect,game.questionsWrong,game.questionsAnswered);

  const badge=document.getElementById('newRecordBadge');
  badge.style.display=isNew?'block':'none';
  if(isNew){ badge.textContent=T.newRecord; }

  showScreen('gameOverScreen');
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════════════════════════
function getThemeColors() {
  const t=saveData.theme;
  if(t==='light') return {skyTop:'#c4b5fd',skyBot:'#ede9fe',ground:'#a78bfa',line:'#6d28d9',neon:'#7c3aed',star:'rgba(109,40,217,',trackL:'#ddd6fe',trackD:'#c4b5fd',fog:'rgba(237,233,254,0.08)'};
  if(t==='bw')    return {skyTop:'#111',skyBot:'#222',ground:'#0a0a0a',line:'#ffffff',neon:'#ccc',star:'rgba(200,200,200,',trackL:'#444',trackD:'#111',fog:'rgba(30,30,30,0.1)'};
  return {skyTop:'#06000f',skyBot:'#12002a',ground:'#0a001e',line:'#7c3aed',neon:'#c084fc',star:'rgba(220,190,255,',trackL:'#1a0040',trackD:'#0a001e',fog:'rgba(124,58,237,0.06)'};
}

function renderFrame() {
  const W=canvas.width, H=canvas.height;
  const {vanishX,vanishY,bottomY,halfBottomW}=trackGeo;
  const C=getThemeColors();

  const sg=ctx.createLinearGradient(0,0,0,vanishY*1.1);
  sg.addColorStop(0,C.skyTop); sg.addColorStop(1,C.skyBot);
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);

  if(saveData.theme!=='light'){
    for(let i=0;i<80;i++){
      const twinkle=Math.sin(performance.now()*0.001+(i*77))*.5+.5;
      const sx=((i*1237+game.bgOffset*0.15)%W);
      const sy=((i*743)%(vanishY*0.92));
      const r=0.6+(i%3)*0.5;
      ctx.globalAlpha=0.3+twinkle*0.7;
      ctx.fillStyle=C.star+'1)';
      ctx.beginPath(); ctx.arc(sx,sy,r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
    const ng=ctx.createRadialGradient(vanishX,vanishY,0,vanishX,vanishY,H*0.35);
    ng.addColorStop(0,'rgba(124,58,237,0.12)'); ng.addColorStop(1,'transparent');
    ctx.fillStyle=ng; ctx.fillRect(0,0,W,H);
  }

  const gg=ctx.createLinearGradient(0,vanishY,0,H);
  gg.addColorStop(0, saveData.theme==='dark'?'#1a003a':(saveData.theme==='light'?'#c4b5fd':'#1a1a1a'));
  gg.addColorStop(0.15, saveData.theme==='dark'?'#0d0020':(saveData.theme==='light'?'#a78bfa':'#111'));
  gg.addColorStop(1, saveData.theme==='dark'?'#040010':(saveData.theme==='light'?'#7c3aed':'#000'));
  ctx.fillStyle=gg;
  ctx.beginPath(); ctx.moveTo(0,vanishY); ctx.lineTo(W,vanishY); ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();

  const tg=ctx.createLinearGradient(0,vanishY,0,bottomY);
  tg.addColorStop(0, saveData.theme==='dark'?'rgba(40,0,80,0.9)':(saveData.theme==='light'?'rgba(196,181,253,0.9)':'rgba(20,20,20,0.9)'));
  tg.addColorStop(0.5, saveData.theme==='dark'?'rgba(25,0,55,0.95)':(saveData.theme==='light'?'rgba(167,139,250,0.95)':'rgba(10,10,10,0.95)'));
  tg.addColorStop(1, saveData.theme==='dark'?'rgba(15,0,35,1)':(saveData.theme==='light'?'rgba(124,58,237,1)':'rgba(0,0,0,1)'));
  ctx.fillStyle=tg;
  ctx.beginPath();
  ctx.moveTo(vanishX-1, vanishY); ctx.lineTo(vanishX+1, vanishY);
  ctx.lineTo(vanishX+halfBottomW, bottomY); ctx.lineTo(vanishX-halfBottomW, bottomY);
  ctx.closePath(); ctx.fill();

  ctx.shadowColor=C.neon; ctx.shadowBlur=10;
  for(let i=0;i<=LANES;i++){
    const bx=(vanishX-halfBottomW)+(halfBottomW*2/LANES)*i;
    ctx.strokeStyle=i===0||i===LANES ? C.neon : 'rgba(168,85,247,0.6)';
    ctx.lineWidth = i===0||i===LANES ? 2.5 : 1.5;
    ctx.beginPath(); ctx.moveTo(vanishX,vanishY); ctx.lineTo(bx,bottomY); ctx.stroke();
  }
  ctx.shadowBlur=0;

  for(let seg=0;seg<16;seg++){
    const tz=((seg/16)+(game.bgOffset*0.0018))%1;
    if(tz<0.02) continue;
    const yy=vanishY+(bottomY-vanishY)*tz;
    const xl=vanishX-halfBottomW*2*tz/2;
    const xr=vanishX+halfBottomW*2*tz/2;
    const alpha=tz*0.18;
    if(seg%4===0){
      ctx.strokeStyle=`rgba(200,150,255,${alpha})`;
      ctx.lineWidth=halfBottomW*2*tz*0.08;
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(xl,yy); ctx.lineTo(xr,yy); ctx.stroke();
    } else {
      ctx.strokeStyle=`rgba(120,50,200,${alpha*0.5})`;
      ctx.lineWidth=1;
      ctx.setLineDash([8,12]);
      ctx.beginPath(); ctx.moveTo(xl,yy); ctx.lineTo(xr,yy); ctx.stroke();
    }
  }
  ctx.setLineDash([]);

  const leftEdgeX = vanishX-halfBottomW;
  const rightEdgeX= vanishX+halfBottomW;
  ctx.shadowColor=C.neon; ctx.shadowBlur=20;
  ctx.strokeStyle=C.neon+'88'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(vanishX,vanishY); ctx.lineTo(leftEdgeX,bottomY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(vanishX,vanishY); ctx.lineTo(rightEdgeX,bottomY); ctx.stroke();
  ctx.shadowBlur=0;

  drawTrackPillars(C);
  game.decorObjects.forEach(d => drawDecor(d, C));
  game.obstacles.forEach(o=>{ if(!o.hit) drawObstacle(o); });
  game.collectibles.forEach(c=>{ if(!c.collected) drawCollectible(c); else drawFadeLabel(c); });
  game.particles.forEach(p=>{
    ctx.globalAlpha=p.alpha; ctx.fillStyle=p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha=1;

  if(game.slowmoActive){ ctx.fillStyle='rgba(96,165,250,0.04)'; ctx.fillRect(0,0,W,H); }

  if(game.magnetActive){
    const pp=getLaneX(game.targetLane,0.87);
    const t=performance.now()*0.003;
    ctx.strokeStyle=`rgba(251,191,36,${0.2+Math.sin(t)*0.15})`; ctx.lineWidth=2.5;
    ctx.setLineDash([6,8]);
    ctx.beginPath(); ctx.arc(pp.x,pp.y,halfBottomW*0.75,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
  }

  drawPlayer();

  ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(0,H-5,W,5);
  const grad=ctx.createLinearGradient(0,0,W*game.speedRamp,0);
  grad.addColorStop(0,'#22c55e'); grad.addColorStop(0.5,'#fbbf24'); grad.addColorStop(1,'#ef4444');
  ctx.fillStyle=grad; ctx.fillRect(0,H-5,W*game.speedRamp,5);

  const vig=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H);
  vig.addColorStop(0,'transparent'); vig.addColorStop(1,'rgba(0,0,0,0.5)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
}

function drawTrackPillars(C) {
  const {vanishX,vanishY,bottomY,halfBottomW}=trackGeo;
  const numPillars=6;
  for(let i=0;i<numPillars;i++){
    const t=(i+0.5)/numPillars;
    const z=t;
    const yy=vanishY+(bottomY-vanishY)*z;
    const pw=halfBottomW*2*z;
    const lx=vanishX-pw/2;
    const ph=12*z, pw2=8*z;
    ctx.fillStyle=saveData.theme==='dark'?`rgba(120,60,220,${z*0.6})`:(saveData.theme==='light'?`rgba(109,40,217,${z*0.4})`:`rgba(200,200,200,${z*0.5})`);
    ctx.shadowColor=C.neon; ctx.shadowBlur=8*z;
    roundRect(ctx,lx-pw2/2,yy-ph/2,pw2,ph,2*z); ctx.fill();
    const rx=vanishX+pw/2;
    roundRect(ctx,rx-pw2/2,yy-ph/2,pw2,ph,2*z); ctx.fill();
    ctx.strokeStyle=saveData.theme==='dark'?`rgba(192,132,252,${z*0.3})`:`rgba(109,40,217,${z*0.2})`;
    ctx.lineWidth=z*1.5;
    ctx.setLineDash([4,8]);
    ctx.beginPath(); ctx.moveTo(lx,yy); ctx.lineTo(rx,yy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur=0;
  }
}

function drawDecor(d, C) {
  const {vanishX,vanishY,bottomY,halfBottomW}=trackGeo;
  if(d.z<0.05||d.z>1.0) return;
  const z=d.z;
  const yy=vanishY+(bottomY-vanishY)*z;
  const pw=halfBottomW*2*z;
  const baseX = d.side==='left' ? vanishX-pw/2-20*z : vanishX+pw/2+20*z;
  const scale=z*0.85;
  ctx.globalAlpha=Math.min(1,z*1.5);
  const th=saveData.theme;
  switch(d.type) {
    case 0:
      ctx.fillStyle=th==='dark'?'#3b1d6e':(th==='light'?'#6d28d9':'#333');
      roundRect(ctx,baseX-3*scale,yy-50*scale,6*scale,50*scale,2); ctx.fill();
      ctx.fillStyle=th==='dark'?'#5b21b6':(th==='light'?'#7c3aed':'#555');
      roundRect(ctx,baseX-12*scale,yy-52*scale,24*scale,6*scale,3); ctx.fill();
      ctx.shadowColor=th==='dark'?'#a855f7':(th==='light'?'#7c3aed':'#fff');
      ctx.shadowBlur=15*scale;
      ctx.fillStyle=th==='dark'?'rgba(168,85,247,0.6)':(th==='light'?'rgba(124,58,237,0.5)':'rgba(255,255,255,0.5)');
      ctx.beginPath(); ctx.arc(baseX,yy-49*scale,5*scale,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      break;
    case 1:
      ctx.strokeStyle=th==='dark'?'#ec4899':(th==='light'?'#be185d':'#aaa');
      ctx.lineWidth=3*scale;
      ctx.shadowColor=ctx.strokeStyle; ctx.shadowBlur=10*scale;
      roundRect(ctx,baseX-15*scale,yy-40*scale,30*scale,20*scale,4*scale); ctx.stroke(); ctx.shadowBlur=0;
      ctx.fillStyle=th==='dark'?'rgba(236,72,153,0.7)':(th==='light'?'rgba(190,24,93,0.7)':'rgba(200,200,200,0.7)');
      ctx.font=Math.max(8,14*scale)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('🛡️',baseX,yy-30*scale);
      break;
    case 2:
      ctx.fillStyle=th==='dark'?'#1a4731':(th==='light'?'#166534':'#1a1a1a');
      ctx.beginPath(); ctx.arc(baseX,yy-20*scale,18*scale,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=th==='dark'?'#166534':(th==='light'?'#15803d':'#222');
      ctx.beginPath(); ctx.arc(baseX,yy-30*scale,12*scale,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=th==='dark'?'#14532d':(th==='light'?'#14532d':'#333');
      roundRect(ctx,baseX-3*scale,yy-3*scale,6*scale,8*scale,2); ctx.fill();
      break;
    case 3:
      ctx.fillStyle=th==='dark'?'#2d1060':(th==='light'?'#5b21b6':'#222');
      roundRect(ctx,baseX-20*scale,yy-48*scale,40*scale,28*scale,3*scale); ctx.fill();
      ctx.fillStyle=th==='dark'?'rgba(192,132,252,0.3)':(th==='light'?'rgba(109,40,217,0.3)':'rgba(200,200,200,0.2)');
      roundRect(ctx,baseX-18*scale,yy-46*scale,36*scale,24*scale,2*scale); ctx.fill();
      ctx.fillStyle=th==='dark'?'rgba(200,150,255,0.8)':(th==='light'?'rgba(79,70,229,0.8)':'rgba(255,255,255,0.7)');
      ctx.font=Math.max(6,11*scale)+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('NÃO AO',baseX,yy-38*scale);
      ctx.fillText('BULLYING',baseX,yy-28*scale);
      ctx.fillStyle=th==='dark'?'#3b1d6e':(th==='light'?'#6d28d9':'#333');
      roundRect(ctx,baseX-3*scale,yy-20*scale,6*scale,24*scale,2); ctx.fill();
      break;
  }
  ctx.globalAlpha=1; ctx.textBaseline='alphabetic';
}

function drawObstacle(o) {
  const pos=getLaneX(o.lane,o.z);
  const w=getObstacleW(o.z), h=w*0.8;
  const x=pos.x-w/2, y=pos.y-h/2;
  const z=o.z, th=saveData.theme;
  const trainColors=[
    { body:'#991b1b', shine:'#dc2626', roof:'#7f1d1d', window:'rgba(251,191,36,0.85)', wheel:'#1f2937', stripe:'#fbbf24' },
    { body:'#1e3a8a', shine:'#2563eb', roof:'#1e3a8a', window:'rgba(147,197,253,0.85)', wheel:'#1f2937', stripe:'#60a5fa' },
    { body:'#4c1d95', shine:'#7c3aed', roof:'#3b0764', window:'rgba(192,132,252,0.85)', wheel:'#1f2937', stripe:'#c084fc' },
  ];
  const bw = { body:'#333', shine:'#555', roof:'#222', window:'rgba(200,200,200,0.7)', wheel:'#111', stripe:'#aaa' };
  const tc = th==='bw' ? bw : (trainColors[o.variant]||trainColors[0]);

  ctx.shadowColor=tc.shine; ctx.shadowBlur=15*z;
  const bodyGrad=ctx.createLinearGradient(x,y,x+w,y);
  bodyGrad.addColorStop(0,tc.body); bodyGrad.addColorStop(0.35,tc.shine);
  bodyGrad.addColorStop(0.7,tc.body); bodyGrad.addColorStop(1,tc.roof);
  ctx.fillStyle=bodyGrad;
  roundRect(ctx,x,y,w,h*0.78,5*z); ctx.fill();

  const roofGrad=ctx.createLinearGradient(x,y,x,y+h*0.15);
  roofGrad.addColorStop(0,tc.shine); roofGrad.addColorStop(1,tc.roof);
  ctx.fillStyle=roofGrad;
  roundRect(ctx,x+w*0.05,y-h*0.12,w*0.9,h*0.16,3*z); ctx.fill();

  ctx.fillStyle=tc.stripe; ctx.globalAlpha=0.5;
  roundRect(ctx,x,y+h*0.35,w,h*0.08,2); ctx.fill();
  ctx.globalAlpha=1;

  const numWin=Math.max(1,Math.floor(w/22));
  const winW=w*0.14, winH=h*0.22, winSpacing=w/(numWin+1);
  for(let wi=0;wi<numWin&&wi<4;wi++){
    const wx=x+winSpacing*(wi+1)-winW/2, wy=y+h*0.1;
    ctx.fillStyle=tc.roof;
    roundRect(ctx,wx-2,wy-2,winW+4,winH+4,3*z); ctx.fill();
    const winGrad=ctx.createLinearGradient(wx,wy,wx,wy+winH);
    winGrad.addColorStop(0,tc.window); winGrad.addColorStop(1,tc.body+'88');
    ctx.fillStyle=winGrad;
    roundRect(ctx,wx,wy,winW,winH,2*z); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.3)';
    roundRect(ctx,wx+2,wy+2,winW*0.35,winH*0.4,1); ctx.fill();
  }

  const faceX = pos.x-w*0.08;
  ctx.shadowColor='#fbbf24'; ctx.shadowBlur=10*z; ctx.fillStyle='#fbbf24';
  ctx.beginPath(); ctx.ellipse(faceX-w*0.18, pos.y-h*0.1, w*0.06, h*0.06, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(faceX+w*0.18, pos.y-h*0.1, w*0.06, h*0.06, 0, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;

  const wheelY=y+h*0.78, wheelR=h*0.14;
  [x+w*0.18, x+w*0.5, x+w*0.82].forEach(wx=>{
    ctx.fillStyle=tc.wheel;
    ctx.beginPath(); ctx.arc(wx,wheelY,wheelR,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(200,200,200,0.4)'; ctx.lineWidth=wheelR*0.25;
    ctx.beginPath(); ctx.arc(wx,wheelY,wheelR*0.6,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(wx,wheelY,wheelR*0.2,0,Math.PI*2); ctx.fill();
  });

  ctx.fillStyle=tc.roof;
  roundRect(ctx,x+w*0.1,y+h*0.68,w*0.8,h*0.12,2*z); ctx.fill();
  roundRect(ctx,x+w*0.12,y-h*0.28,w*0.09,h*0.18,2*z); ctx.fill();

  const st=performance.now()*0.002;
  for(let pi=0;pi<3;pi++){
    const pa=(st+pi*0.6)%1;
    ctx.globalAlpha=1-pa; ctx.fillStyle='rgba(200,200,200,0.5)';
    ctx.beginPath(); ctx.arc(x+w*0.16, y-h*(0.3+pa*0.6), w*0.06*(0.5+pa), 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;

  ctx.font=Math.max(8,w*0.28)+'px serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('🚂',pos.x,pos.y-h*0.55);
  ctx.textBaseline='alphabetic'; ctx.shadowBlur=0;
}

function drawCollectible(c) {
  const pos=getLaneX(c.lane,c.z);
  const size=Math.max(6,c.z*30);
  const bob=Math.sin(performance.now()*0.004+c.bob)*size*0.2;
  ctx.globalAlpha=c.alpha;
  ctx.shadowColor=c.type==='coin'?'#fbbf24':'#60a5fa'; ctx.shadowBlur=12;
  ctx.font=Math.max(8,size*1.15)+'px serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(c.type==='coin'?'🪙':'💎',pos.x,pos.y-size/2+bob);
  if(size>15){
    ctx.font=Math.max(6,size*0.5)+'px sans-serif';
    ctx.fillStyle=c.type==='coin'?'#fbbf24':'#60a5fa';
    ctx.fillText(c.type==='coin'?'+🪙':'+💎',pos.x,pos.y-size+bob-4);
  }
  ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.textBaseline='alphabetic';
}

function drawFadeLabel(c) {
  const pos=getLaneX(c.lane,c.z);
  ctx.globalAlpha=c.alpha*0.7;
  ctx.fillStyle=c.type==='coin'?'#fbbf24':'#60a5fa';
  ctx.font='13px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(c.type==='coin'?'+🪙':'+💎',pos.x,pos.y-22);
  ctx.globalAlpha=1; ctx.textBaseline='alphabetic';
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER CHARACTER
// ═══════════════════════════════════════════════════════════════════════════════
function drawPlayer() {
  const playerZ=0.87;
  const {halfBottomW}=trackGeo;
  const base=getLaneX(game.lane,playerZ);
  const target=getLaneX(game.targetLane,playerZ);
  const t=easeInOut(Math.min(1,game.laneTransition));
  const drawX=base.x+(target.x-base.x)*(game.lane!==game.targetLane?t:0);
  const size=halfBottomW*2*playerZ/LANES;
  const bob=Math.sin(game.playerBobT)*size*0.04;
  const lean = (game.lane!==game.targetLane) ? (game.targetLane>game.lane?0.12:-0.12) : 0;
  const cy=base.y-size*0.5+bob;

  const all=getAvatarList();
  const av=all[Math.min(saveData.avatarIdx,all.length-1)];

  const palettes={
    '🧒':{ skin:'#f5c5a0', hair:'#3d1f00', hairHL:'#7c4800', shirt:'#3b82f6', shirtL:'#60a5fa', pants:'#1e3a5f', pantsL:'#2563eb', shoe:'#1a0a00', acc:'#fbbf24' },
    '👦':{ skin:'#f0b082', hair:'#1a0d00', hairHL:'#4a2800', shirt:'#ef4444', shirtL:'#f87171', pants:'#1e293b', pantsL:'#334155', shoe:'#1a0a00', acc:'#fb923c' },
    '👧':{ skin:'#f5c5a0', hair:'#a16207', hairHL:'#ca8a04', shirt:'#ec4899', shirtL:'#f472b6', pants:'#7c3aed', pantsL:'#a855f7', shoe:'#831843', acc:'#fb7185' },
    '🧑':{ skin:'#c8834a', hair:'#1a0d00', hairHL:'#3d1f00', shirt:'#22c55e', shirtL:'#4ade80', pants:'#14532d', pantsL:'#166534', shoe:'#1a0a00', acc:'#86efac' },
    '🦸':{ skin:'#f5c5a0', hair:'#d97706', hairHL:'#fbbf24', shirt:'#dc2626', shirtL:'#ef4444', pants:'#1e3a5f', pantsL:'#1d4ed8', shoe:'#111', acc:'#fbbf24' },
    '🧙':{ skin:'#e8c49a', hair:'#6b7280', hairHL:'#9ca3af', shirt:'#7c3aed', shirtL:'#a855f7', pants:'#4c1d95', pantsL:'#6d28d9', shoe:'#1a0033', acc:'#c084fc' },
  };
  const pal=palettes[av]||palettes['🧒'];
  const S=size*0.40;

  // Shadow
  ctx.save();
  ctx.translate(drawX, base.y-S*0.05);
  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(0,0,S*0.5,S*0.1,0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(drawX, cy);
  ctx.rotate(lean);

  // Shield aura
  if(game.shieldActive){
    const shieldT=performance.now()*0.003;
    for(let si=0;si<3;si++){
      const sr=S*0.95+Math.sin(shieldT*2+si)*S*0.05;
      ctx.strokeStyle=`rgba(168,85,247,${0.5-si*0.15})`;
      ctx.lineWidth=3-si; ctx.shadowColor='#a855f7'; ctx.shadowBlur=20;
      ctx.beginPath(); ctx.arc(0,0,sr,0,Math.PI*2); ctx.stroke();
    }
    ctx.shadowBlur=0;
  }

  // Speed glow
  if(game.speedBoostActive){
    ctx.shadowColor='#fbbf24'; ctx.shadowBlur=25;
    ctx.strokeStyle='rgba(251,191,36,0.35)'; ctx.lineWidth=2;
    ctx.setLineDash([5,7]);
    ctx.beginPath(); ctx.arc(0,0,S*1.05,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([]); ctx.shadowBlur=0;
    for(let li=0;li<5;li++){
      const la=((performance.now()*0.01)+li*36)*Math.PI/180;
      ctx.strokeStyle=`rgba(251,191,36,${0.3-li*0.05})`; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(la)*S*0.8, Math.sin(la)*S*0.8);
      ctx.lineTo(Math.cos(la)*S*1.3, Math.sin(la)*S*1.3);
      ctx.stroke();
    }
  }

  const legBob=Math.sin(game.playerBobT*2)*S*0.2;
  const armBob=Math.sin(game.playerBobT*2+Math.PI)*S*0.15;

  // Legs
  ctx.strokeStyle=pal.pants; ctx.lineWidth=S*0.23; ctx.lineCap='round';
  ctx.shadowColor='rgba(0,0,0,0.3)'; ctx.shadowBlur=4;
  ctx.beginPath(); ctx.moveTo(-S*0.07, S*0.32); ctx.quadraticCurveTo(-S*0.18, S*0.55+legBob*0.5, -S*0.16, S*0.75+legBob); ctx.stroke();
  ctx.strokeStyle=pal.pantsL;
  ctx.beginPath(); ctx.moveTo(S*0.07, S*0.32); ctx.quadraticCurveTo(S*0.18, S*0.55-legBob*0.5, S*0.16, S*0.75-legBob); ctx.stroke();
  ctx.shadowBlur=0;

  // Shoes
  ctx.fillStyle=pal.shoe;
  ctx.beginPath(); ctx.ellipse(-S*0.16, S*0.8+legBob, S*0.14, S*0.07, -0.25, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.ellipse(-S*0.19, S*0.78+legBob, S*0.06, S*0.03, -0.25, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle=pal.shoe;
  ctx.beginPath(); ctx.ellipse(S*0.16, S*0.8-legBob, S*0.14, S*0.07, 0.25, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.ellipse(S*0.19, S*0.78-legBob, S*0.06, S*0.03, 0.25, 0, Math.PI*2); ctx.fill();

  // Body
  const bodyGrad=ctx.createLinearGradient(-S*0.26, -S*0.15, S*0.26, S*0.38);
  bodyGrad.addColorStop(0,pal.shirtL); bodyGrad.addColorStop(0.5,pal.shirt); bodyGrad.addColorStop(1,pal.pants);
  ctx.fillStyle=bodyGrad; ctx.shadowColor='rgba(0,0,0,0.25)'; ctx.shadowBlur=5;
  roundRect(ctx,-S*0.24,-S*0.14,S*0.48,S*0.5,S*0.1); ctx.fill(); ctx.shadowBlur=0;
  ctx.fillStyle='rgba(255,255,255,0.15)';
  roundRect(ctx,-S*0.17,-S*0.1,S*0.14,S*0.25,S*0.06); ctx.fill();
  ctx.strokeStyle=pal.acc; ctx.lineWidth=S*0.035; ctx.setLineDash([S*0.06, S*0.04]);
  ctx.beginPath(); ctx.moveTo(-S*0.24,S*0.22); ctx.lineTo(S*0.24,S*0.22); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,255,255,0.9)';
  ctx.font=Math.max(6,S*0.28)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('🛡️',0,S*0.05);

  // Arms
  ctx.strokeStyle=pal.shirtL; ctx.lineWidth=S*0.2; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-S*0.22,-S*0.06); ctx.quadraticCurveTo(-S*0.4, S*0.1+armBob, -S*0.42,S*0.25+armBob); ctx.stroke();
  ctx.strokeStyle=pal.shirt;
  ctx.beginPath(); ctx.moveTo(S*0.22,-S*0.06); ctx.quadraticCurveTo(S*0.4, S*0.1-armBob, S*0.42,S*0.25-armBob); ctx.stroke();

  // Hands
  ctx.fillStyle=pal.skin; ctx.shadowColor='rgba(0,0,0,0.2)'; ctx.shadowBlur=3;
  ctx.beginPath(); ctx.arc(-S*0.44, S*0.27+armBob, S*0.1, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( S*0.44, S*0.27-armBob, S*0.1, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.arc(-S*0.44+S*0.04, S*0.27+armBob-S*0.04, S*0.04, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( S*0.44-S*0.04, S*0.27-armBob-S*0.04, S*0.04, 0, Math.PI*2); ctx.fill();

  // Neck
  ctx.fillStyle=pal.skin;
  roundRect(ctx,-S*0.07,-S*0.18,S*0.14,S*0.1,S*0.04); ctx.fill();

  // Head
  ctx.shadowColor='rgba(0,0,0,0.3)'; ctx.shadowBlur=8;
  const headGrad=ctx.createRadialGradient(-S*0.08,-S*0.45,0,0,-S*0.38,S*0.32);
  headGrad.addColorStop(0,pal.skin+'ff'); headGrad.addColorStop(0.6,pal.skin+'ee'); headGrad.addColorStop(1,pal.hair+'55');
  ctx.fillStyle=headGrad;
  ctx.beginPath(); ctx.arc(0,-S*0.38,S*0.3,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;

  // Cheeks
  ctx.fillStyle='rgba(255,160,130,0.3)';
  ctx.beginPath(); ctx.ellipse(-S*0.14,-S*0.33,S*0.08,S*0.05,0.2,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse( S*0.14,-S*0.33,S*0.08,S*0.05,-0.2,0,Math.PI*2); ctx.fill();

  // Hair
  if(av==='🧙'){
    ctx.fillStyle=pal.shirt; ctx.shadowColor=pal.acc; ctx.shadowBlur=8;
    ctx.beginPath(); ctx.moveTo(-S*0.3,-S*0.38-S*0.2); ctx.lineTo(0,-S*0.38-S*0.85); ctx.lineTo(S*0.3,-S*0.38-S*0.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle=pal.acc; ctx.shadowBlur=0;
    ctx.beginPath(); ctx.ellipse(0,-S*0.38-S*0.2,S*0.36,S*0.1,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fbbf24'; ctx.font=Math.max(6,S*0.2)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('⭐',0,-S*0.7);
  } else if(av==='🦸'){
    ctx.fillStyle=pal.hair; ctx.shadowColor=pal.hairHL; ctx.shadowBlur=5;
    ctx.beginPath(); ctx.arc(0,-S*0.38,S*0.32,Math.PI,0); ctx.fill();
    ctx.fillStyle=pal.shirt; ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(0,-S*0.38+S*0.04,S*0.25,Math.PI*1.15,Math.PI*1.85); ctx.fill();
    ctx.fillStyle=pal.acc;
    ctx.beginPath(); ctx.arc(S*0.08,-S*0.38+S*0.01,S*0.08,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-S*0.08,-S*0.38+S*0.01,S*0.08,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=pal.shirtL+'aa';
    ctx.beginPath(); ctx.moveTo(-S*0.22,-S*0.12); ctx.quadraticCurveTo(-S*0.35,S*0.15,-S*0.28,S*0.45); ctx.quadraticCurveTo(-S*0.5,S*0.3,-S*0.32,-S*0.12); ctx.closePath(); ctx.fill();
  } else if(av==='👧'){
    ctx.fillStyle=pal.hair; ctx.shadowColor=pal.hairHL; ctx.shadowBlur=4;
    ctx.beginPath(); ctx.arc(0,-S*0.56,S*0.32,Math.PI+0.15,-0.15); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-S*0.3,-S*0.28,S*0.08,S*0.28,0.15,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*0.3,-S*0.28,S*0.08,S*0.28,-0.15,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*0.3,-S*0.1,S*0.06,S*0.22,0.4,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle=pal.hairHL+'88';
    ctx.beginPath(); ctx.ellipse(-S*0.08,-S*0.58,S*0.08,S*0.14,0.1,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=pal.acc;
    ctx.beginPath(); ctx.arc(S*0.28,-S*0.08,S*0.07,0,Math.PI*2); ctx.fill();
  } else {
    ctx.fillStyle=pal.hair; ctx.shadowColor=pal.hairHL; ctx.shadowBlur=4;
    ctx.beginPath(); ctx.arc(0,-S*0.52,S*0.3,Math.PI+0.25,-0.25); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-S*0.28,-S*0.38,S*0.07,S*0.2,0.1,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*0.28,-S*0.38,S*0.07,S*0.2,-0.1,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle=pal.hairHL+'66';
    ctx.beginPath(); ctx.arc(-S*0.06,-S*0.56,S*0.1,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=pal.hairHL+'55'; ctx.lineWidth=S*0.03; ctx.lineCap='round';
    for(let hi=0;hi<4;hi++){
      ctx.beginPath(); ctx.moveTo(-S*0.12+hi*S*0.08,-S*0.54); ctx.quadraticCurveTo(-S*0.08+hi*S*0.07,-S*0.45,(-S*0.1+hi*S*0.08)*1.2,-S*0.4); ctx.stroke();
    }
  }

  // Eyes
  ctx.fillStyle='#fff'; ctx.shadowBlur=0;
  ctx.beginPath(); ctx.ellipse(-S*0.1,-S*0.38,S*0.076,S*0.068,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse( S*0.1,-S*0.38,S*0.076,S*0.068,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=pal.acc+'cc';
  ctx.beginPath(); ctx.arc(-S*0.1,-S*0.378,S*0.05,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( S*0.1,-S*0.378,S*0.05,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#0a0010';
  ctx.beginPath(); ctx.arc(-S*0.1,-S*0.375,S*0.028,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( S*0.1,-S*0.375,S*0.028,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.arc(-S*0.095,-S*0.387,S*0.013,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( S*0.105,-S*0.387,S*0.013,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=pal.hair; ctx.lineWidth=S*0.025; ctx.lineCap='round';
  for(let ei=-1;ei<=1;ei++){
    ctx.beginPath(); ctx.moveTo(-S*0.1+ei*S*0.05,-S*0.43); ctx.lineTo(-S*0.1+ei*S*0.055,-S*0.47); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(S*0.1+ei*S*0.05,-S*0.43); ctx.lineTo(S*0.1+ei*S*0.055,-S*0.47); ctx.stroke();
  }

  // Nose
  ctx.strokeStyle=pal.skin+'88'; ctx.lineWidth=S*0.025; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-S*0.03,-S*0.34); ctx.quadraticCurveTo(-S*0.05,-S*0.31,-S*0.02,-S*0.3); ctx.stroke();

  // Mouth
  ctx.strokeStyle='#5a2e00'; ctx.lineWidth=S*0.028; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(0,-S*0.32,S*0.1,0.15,Math.PI-0.15); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.arc(0,-S*0.33,S*0.06,0.3,Math.PI-0.3); ctx.fill();

  // Ears
  ctx.fillStyle=pal.skin;
  ctx.beginPath(); ctx.ellipse(-S*0.3,-S*0.37,S*0.065,S*0.075,0.2,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse( S*0.3,-S*0.37,S*0.065,S*0.075,-0.2,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=pal.skin+'88'; ctx.lineWidth=S*0.02;
  ctx.beginPath(); ctx.arc(-S*0.3,-S*0.37,S*0.03,0,Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc( S*0.3,-S*0.37,S*0.03,0,Math.PI); ctx.stroke();

  // Eyebrows
  ctx.strokeStyle=pal.hair; ctx.lineWidth=S*0.04; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-S*0.16,-S*0.45); ctx.lineTo(-S*0.04,-S*0.44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo( S*0.16,-S*0.45); ctx.lineTo( S*0.04,-S*0.44); ctx.stroke();

  ctx.restore();
  ctx.textAlign='left'; ctx.shadowBlur=0; ctx.textBaseline='alphabetic';
}

// ═══════════════════════════════════════════════════════════════════════════════
// MENU BACKGROUND — FIX: loop stops properly when game starts
// ═══════════════════════════════════════════════════════════════════════════════
let menuBgT=0;
let menuBgRaf=null;  // FIX: track menu bg RAF handle

function drawMenuBg() {
  menuBgT+=0.005;
  const W=canvas.width, H=canvas.height;
  const {vanishX,vanishY,bottomY,halfBottomW}=trackGeo;
  const C=getThemeColors();

  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,C.skyTop); g.addColorStop(0.45,C.skyBot); g.addColorStop(1,C.ground);
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  if(saveData.theme!=='light'){
    for(let i=0;i<60;i++){
      const tw=Math.sin(menuBgT*2+i*77)*.5+.5;
      ctx.globalAlpha=0.2+tw*0.6;
      ctx.fillStyle=C.star+'1)';
      ctx.beginPath(); ctx.arc((i*1237)%W,(i*743)%(vanishY*.9),0.6+(i%3)*.5,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
  }

  const tg=ctx.createLinearGradient(0,vanishY,0,H);
  tg.addColorStop(0,C.trackL); tg.addColorStop(1,C.trackD);
  ctx.fillStyle=tg;
  ctx.beginPath(); ctx.moveTo(vanishX,vanishY); ctx.lineTo(vanishX+halfBottomW,bottomY); ctx.lineTo(vanishX-halfBottomW,bottomY); ctx.closePath(); ctx.fill();

  ctx.shadowColor=C.neon; ctx.shadowBlur=8;
  for(let i=0;i<=LANES;i++){
    const bx=(vanishX-halfBottomW)+(halfBottomW*2/LANES)*i;
    ctx.strokeStyle=C.neon; ctx.lineWidth=i===0||i===LANES?2:1.2;
    ctx.beginPath(); ctx.moveTo(vanishX,vanishY); ctx.lineTo(bx,bottomY); ctx.stroke();
  }
  ctx.shadowBlur=0;

  for(let seg=0;seg<10;seg++){
    const tz=((seg/10)+(menuBgT*0.3))%1;
    if(tz<0.02) continue;
    const yy=vanishY+(bottomY-vanishY)*tz;
    const xl=vanishX-halfBottomW*2*tz/2;
    const xr=vanishX+halfBottomW*2*tz/2;
    ctx.strokeStyle=C.neon+(Math.floor(tz*40).toString(16).padStart(2,'0'));
    ctx.lineWidth=seg%4===0?halfBottomW*2*tz*0.07:0.8;
    ctx.setLineDash(seg%4===0?[]:[6,10]);
    ctx.beginPath(); ctx.moveTo(xl,yy); ctx.lineTo(xr,yy); ctx.stroke();
  }
  ctx.setLineDash([]);

  const vig=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H);
  vig.addColorStop(0,'transparent'); vig.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
}

function startMenuBgLoop() {
  if(menuBgRaf) return;
  function loop(){
    if(game.running){ menuBgRaf=null; return; }  // FIX: stop when game starts
    drawMenuBg();
    menuBgRaf=requestAnimationFrame(loop);
  }
  menuBgRaf=requestAnimationFrame(loop);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════════════════════════════════════════
function moveLeft()  { if(game.targetLane>0)       { game.lane=game.targetLane; game.targetLane--; game.laneTransition=0; playSFX('jump'); } }
function moveRight() { if(game.targetLane<LANES-1) { game.lane=game.targetLane; game.targetLane++; game.laneTransition=0; playSFX('jump'); } }

document.addEventListener('keydown',e=>{
  if(!game.running||game.paused) return;
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')  moveLeft();
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') moveRight();
  if(e.key===' '||e.key==='Spacebar'){ e.preventDefault(); activatePower(0); }
  if(e.key==='q'||e.key==='Q') activatePower(1);
  if(e.key==='e'||e.key==='E') activatePower(2);
  if(e.key==='r'||e.key==='R') activatePower(3);
});

let _tx=0,_ty=0;
canvas.addEventListener('touchstart',e=>{ _tx=e.touches[0].clientX; _ty=e.touches[0].clientY; e.preventDefault(); },{passive:false});
canvas.addEventListener('touchend',e=>{
  if(!game.running||game.paused) return;
  const dx=e.changedTouches[0].clientX-_tx;
  const dy=e.changedTouches[0].clientY-_ty;
  if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>25){ if(dx<0) moveLeft(); else moveRight(); }
  e.preventDefault();
},{passive:false});
document.addEventListener('touchmove',e=>{ if(game.running) e.preventDefault(); },{passive:false});

// ═══════════════════════════════════════════════════════════════════════════════
// SPLASH
// ═══════════════════════════════════════════════════════════════════════════════
function runSplash() {
  const fill=document.getElementById('splashFill');
  const pct=document.getElementById('splashPct');
  const dur=3200, start=performance.now();
  function tick(now){
    const elapsed=now-start;
    const progress=Math.min(100,Math.floor((elapsed/dur)*100));
    fill.style.width=progress+'%'; pct.textContent=progress+'%';
    if(elapsed<dur){ requestAnimationFrame(tick); }
    else {
      const splash=document.getElementById('splash');
      splash.style.transition='opacity 0.6s'; splash.style.opacity='0';
      setTimeout(()=>{ splash.style.display='none'; showScreen('menuScreen'); startMenuBgLoop(); },600);
    }
  }
  requestAnimationFrame(tick);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════════════
function init() {
  loadSave();
  applyTheme(saveData.theme||'dark');
  applyLang(saveData.lang||'pt');
  document.getElementById('nameInp').value=saveData.name||'';
  updateAvatar(); updateXPBar(); updateMenuStats(); updateLoggedInUI();

  document.getElementById('nameInp').addEventListener('input',e=>{ saveData.name=e.target.value; writeSave(); });
  document.getElementById('avatarBtn').addEventListener('click',()=>{
    const all=getAvatarList();
    saveData.avatarIdx=(saveData.avatarIdx+1)%all.length;
    writeSave(); updateAvatar(); playSFX('click');
  });
  document.querySelectorAll('.theme-btn').forEach(b=>b.addEventListener('click',()=>{ applyTheme(b.dataset.theme); playSFX('click'); }));
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>{ applyLang(b.dataset.lang); playSFX('click'); }));

  document.getElementById('playBtn').addEventListener('click',()=>{
    playSFX('click');
    menuBgRaf=null;  // FIX: allow menu loop to stop cleanly
    startGame();
  });
  document.getElementById('shopBtn').addEventListener('click',()=>{
    playSFX('click'); renderShop();
    document.getElementById('shopCoinsDisplay').textContent=saveData.coins;
    document.getElementById('shopGemsDisplay').textContent=saveData.gems;
    showScreen('shopScreen');
  });
  document.getElementById('shopBackBtn').addEventListener('click',()=>{ playSFX('click'); showScreen('menuScreen'); startMenuBgLoop(); });
  document.getElementById('topRunBtn').addEventListener('click',()=>{
    playSFX('click'); renderTopRun('local'); showScreen('topRunScreen');
    document.getElementById('tabLocal').classList.add('active');
    document.getElementById('tabGlobal').classList.remove('active');
  });
  document.getElementById('topBackBtn').addEventListener('click',()=>{ playSFX('click'); showScreen('menuScreen'); startMenuBgLoop(); });
  document.getElementById('loginBtn').addEventListener('click',()=>{ playSFX('click'); updateLoggedInUI(); showScreen('loginScreen'); });
  document.getElementById('loginBackBtn').addEventListener('click',()=>{ playSFX('click'); showScreen('menuScreen'); startMenuBgLoop(); });

  document.getElementById('authSubmitBtn').addEventListener('click',()=>{ ensureAudio(); handleAuth(); });
  document.getElementById('logoutBtn').addEventListener('click',()=>{ playSFX('click'); doLogout(); });
  document.getElementById('syncNowBtn').addEventListener('click',()=>{
    playSFX('coin'); writeSave();
    showFloatNotif('☁️ Progresso sincronizado!','notif-power');
  });

  document.getElementById('replayBtn').addEventListener('click',()=>{
    playSFX('click');
    menuBgRaf=null;
    startGame();
  });
  document.getElementById('goMenuBtn').addEventListener('click',()=>{
    playSFX('click'); updateMenuStats(); updateXPBar();
    showScreen('menuScreen'); startMenuBgLoop();
  });

  document.getElementById('perfectContinueBtn').addEventListener('click',()=>{
    document.getElementById('perfectScreen').classList.remove('active');
    document.getElementById('confettiContainer').innerHTML='';
    game.paused=false;
    if(musicOn){ stopBGMusic(); playBGMusic(); }
  });

  document.getElementById('perfectMenuBtn').addEventListener('click',()=>{
    if(!game.running) return;
    stopBGMusic();
    game.running=false;
    if(game.raf){ cancelAnimationFrame(game.raf); game.raf=null; }
    document.getElementById('perfectScreen').classList.remove('active');
    document.getElementById('confettiContainer').innerHTML='';
    document.getElementById('hud').classList.remove('active');
    document.getElementById('powerBar').classList.remove('active');
    document.getElementById('musicToggle').classList.remove('active');
    document.getElementById('mobileHint').classList.remove('visible');

    // FIX: proper final accounting
    saveData.coins += game.coins;
    saveData.gems  += game.gems;
    const scoreBonus = Math.floor(game.score/50);
    const finalXP = game.xpEarned + scoreBonus;
    const isNew = Math.floor(game.score) > saveData.bestScore;
    if(isNew) saveData.bestScore = Math.floor(game.score);

    // FIX: sync unused power charges back
    game.powers.forEach((p, i) => {
      const key = POWERS_DEF[i].id;
      saveData.powerCharges[key] = (saveData.powerCharges[key] || 0) + p.charges;
    });

    addTopEntry(game.score, saveData.name||'Anônimo', game.distance);
    writeSave(); addXP(finalXP); updateMenuStats(); updateXPBar();
    playSFX('click'); showScreen('menuScreen'); startMenuBgLoop();
  });

  document.getElementById('musicToggle').addEventListener('click', toggleMusic);

  computeTrackGeometry();
  drawMenuBg();
  runSplash();
}

window.addEventListener('load', init);
