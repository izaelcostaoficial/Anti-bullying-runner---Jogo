/* ═══════════════════════════════════════════════════════════════════════
   ANTI-BULLYING RUNNER — game.js
   Ultra Professional Edition v2.0
   All gameplay, rendering, UI logic in one file
════════════════════════════════════════════════════════════════════════ */
'use strict';

// ═══════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════
const MAX_XP        = 5000;
const LANES         = 3;
const SAVE_KEY      = 'abrunner_v6';
const ACCOUNTS_KEY  = 'abrunner_accounts_v6';
const TOP_KEY       = 'abrunner_top_v6';
const MAX_LIVES     = 3;
const LETTERS       = ['A','B','C','D'];
const BASE_SPEED    = 0.5;
const MAX_SPEED     = 4.0;
const SPEED_RAMP    = 0.014;
const TOP_MAX       = 50;

const POWERS_DEF = [
  { id:'shield', emoji:'🛡️', cooldown:20, duration:8,  key:'SPC', label:'Escudo'    },
  { id:'speed',  emoji:'⚡',  cooldown:25, duration:6,  key:'Q',   label:'Velocidade' },
  { id:'magnet', emoji:'🧲',  cooldown:18, duration:7,  key:'E',   label:'Ímã'        },
  { id:'slowmo', emoji:'🌀',  cooldown:30, duration:5,  key:'R',   label:'Lentidão'   },
  { id:'jetpak', emoji:'🚀',  cooldown:35, duration:4,  key:'F',   label:'Jetpack'    },
];

const SHOP_ITEMS = [
  // Packs
  { id:'buy50coins',   icon:'🪙', cost:3,   currency:'gem',  type:'pack',    tab:'packs'    },
  { id:'buy200coins',  icon:'🪙', cost:10,  currency:'gem',  type:'pack',    tab:'packs'    },
  { id:'buy5gems',     icon:'💎', cost:100, currency:'coin', type:'pack',    tab:'packs'    },
  { id:'buy20gems',    icon:'💎', cost:350, currency:'coin', type:'pack',    tab:'packs'    },
  // Powers
  { id:'shieldCharge', icon:'🛡️', cost:2,   currency:'gem',  type:'charge',  tab:'powers'   },
  { id:'speedCharge',  icon:'⚡',  cost:2,   currency:'gem',  type:'charge',  tab:'powers'   },
  { id:'magnetCharge', icon:'🧲',  cost:2,   currency:'gem',  type:'charge',  tab:'powers'   },
  { id:'slowCharge',   icon:'🌀',  cost:2,   currency:'gem',  type:'charge',  tab:'powers'   },
  { id:'jetpakCharge', icon:'🚀',  cost:3,   currency:'gem',  type:'charge',  tab:'powers'   },
  // Upgrades
  { id:'xpMult',       icon:'📈', cost:8,   currency:'gem',  type:'unlock',  tab:'upgrades' },
  { id:'coinBoost',    icon:'💰', cost:6,   currency:'gem',  type:'unlock',  tab:'upgrades' },
  { id:'extraLife',    icon:'❤️',  cost:5,   currency:'gem',  type:'unlock',  tab:'upgrades' },
  { id:'comboBoost',   icon:'🔥', cost:7,   currency:'gem',  type:'unlock',  tab:'upgrades' },
  { id:'startCoins',   icon:'🎁', cost:4,   currency:'gem',  type:'unlock',  tab:'upgrades' },
  // Cosmetics
  { id:'avatar1',      icon:'🦸', cost:500, currency:'coin', type:'avatar',  tab:'cosmetics' },
  { id:'avatar2',      icon:'🧙', cost:500, currency:'coin', type:'avatar',  tab:'cosmetics' },
  { id:'avatar3',      icon:'🥷', cost:800, currency:'coin', type:'avatar',  tab:'cosmetics' },
  { id:'avatar4',      icon:'👸', cost:800, currency:'coin', type:'avatar',  tab:'cosmetics' },
  { id:'trailFire',    icon:'🔥', cost:600, currency:'coin', type:'trail',   tab:'cosmetics' },
  { id:'trailStars',   icon:'⭐', cost:600, currency:'coin', type:'trail',   tab:'cosmetics' },
];

const AVATARS_BASE = ['🧒','👦','👧','🧑'];

// ═══════════════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════════════
const ACHIEVEMENTS_DEF = [
  { id:'firstRun',     icon:'🏁', name:'Primeira Corrida',       desc:'Complete sua primeira corrida',        req: s=>s.totalGames>=1,          reward:50,  rewardType:'coin' },
  { id:'runs10',       icon:'🏃', name:'Corredor Regular',        desc:'Complete 10 corridas',                 req: s=>s.totalGames>=10,         reward:100, rewardType:'coin' },
  { id:'runs50',       icon:'🏆', name:'Veterano das Pistas',     desc:'Complete 50 corridas',                 req: s=>s.totalGames>=50,         reward:5,   rewardType:'gem'  },
  { id:'score1k',      icon:'💯', name:'Mil Pontos',              desc:'Alcance 1.000 pontos em uma corrida', req: s=>s.bestScore>=1000,        reward:100, rewardType:'coin' },
  { id:'score10k',     icon:'🌟', name:'Dez Mil Pontos',          desc:'Alcance 10.000 pontos',               req: s=>s.bestScore>=10000,       reward:500, rewardType:'coin' },
  { id:'score50k',     icon:'🚀', name:'Cinquenta Mil Pontos',    desc:'Alcance 50.000 pontos',               req: s=>s.bestScore>=50000,       reward:10,  rewardType:'gem'  },
  { id:'dist500',      icon:'📏', name:'Meio Quilômetro',         desc:'Corra 500 metros em uma partida',     req: s=>s.bestDist>=500,          reward:200, rewardType:'coin' },
  { id:'dist2k',       icon:'🗺️', name:'Dois Quilômetros',        desc:'Corra 2.000 metros em uma partida',  req: s=>s.bestDist>=2000,         reward:10,  rewardType:'gem'  },
  { id:'coins500',     icon:'🪙', name:'Poupador',                desc:'Junte 500 moedas no total',           req: s=>s.coinsTotal>=500,        reward:3,   rewardType:'gem'  },
  { id:'gems20',       icon:'💎', name:'Caçador de Gemas',        desc:'Junte 20 gemas',                      req: s=>s.gemsTotal>=20,          reward:100, rewardType:'coin' },
  { id:'perfectQ',     icon:'🎯', name:'Mestre Anti-Bullying',    desc:'Acerte todas as perguntas em uma corrida', req: s=>s.perfectRuns>=1,   reward:5,   rewardType:'gem'  },
  { id:'perfect5',     icon:'🧠', name:'Especialista',            desc:'5 corridas perfeitas nas perguntas',   req: s=>s.perfectRuns>=5,         reward:15,  rewardType:'gem'  },
  { id:'combo10',      icon:'🔥', name:'Em Chamas',               desc:'Alcance combo x10',                   req: s=>s.bestCombo>=10,          reward:200, rewardType:'coin' },
  { id:'shield5',      icon:'🛡️', name:'Fortaleza',               desc:'Use o escudo 5 vezes',                req: s=>s.shieldUses>=5,          reward:3,   rewardType:'gem'  },
  { id:'allPowers',    icon:'⚡', name:'Mestre dos Poderes',      desc:'Use todos os 5 poderes',              req: s=>s.powersUsed&&Object.keys(s.powersUsed).length>=5, reward:10, rewardType:'gem' },
  { id:'lvlMax',       icon:'🌈', name:'Lendário',                desc:'Atinja o XP máximo',                  req: s=>s.xp>=MAX_XP,             reward:20,  rewardType:'gem'  },
];

// ═══════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════
const UI_TEXT = {
  pt:{
    menuTitle:'Anti-Bullying Runner', playBtn:'🏃 JOGAR', shopBtn:'🛒 LOJA',
    lblName:'SEU NOME', lblXP:'XP', lblTheme:'TEMA', lblLang:'IDIOMA',
    statBestKey:'RECORDE', statCoinsKey:'MOEDAS', statGamesKey:'CORRIDAS',
    shopTitle:'🛒 Loja', shopBackLbl:'Voltar',
    goTitle:'GAME OVER', goScoreKey:'PONTOS', goDistKey:'DISTÂNCIA',
    goCoinsKey:'MOEDAS', goGemsKey:'GEMAS', goXpLabel:'XP GANHO', goQLabel:'DESEMPENHO NAS PERGUNTAS',
    replayLbl:'Jogar Novamente', goMenuLbl:'Menu Principal',
    newRecord:'🏆 NOVO RECORDE!', maxLvl:'⭐ NÍVEL MÁXIMO!',
    splashLoading:'CARREGANDO...',
    splashTagline:'Corra pela justiça. Defenda quem precisa.',
    themeD:'🌙 Escuro', themeL:'☀️ Claro', themeBW:'◑ P&B', themeNeon:'⚡ Neon',
    powerNames:['Escudo','Velocidade','Ímã','Lentidão','Jetpack'],
    shopSections:{ packs:'PACOTES', powers:'CARGAS DE PODERES', upgrades:'MELHORIAS', cosmetics:'VISUAIS' },
    shopItems:{
      buy50coins:   {name:'50 Moedas',       desc:'Compre 50 moedas com 3 gemas'},
      buy200coins:  {name:'200 Moedas',      desc:'Pacote grande: 200 moedas'},
      buy5gems:     {name:'5 Gemas',         desc:'Compre 5 gemas com 100 moedas'},
      buy20gems:    {name:'20 Gemas',        desc:'Pacote grande: 20 gemas'},
      shieldCharge: {name:'Carga: Escudo',   desc:'1 uso extra do Escudo na próxima corrida'},
      speedCharge:  {name:'Carga: Velocidade',desc:'1 uso extra de Velocidade'},
      magnetCharge: {name:'Carga: Ímã',      desc:'1 uso extra do Ímã'},
      slowCharge:   {name:'Carga: Lentidão', desc:'1 uso extra da Lentidão'},
      jetpakCharge: {name:'Carga: Jetpack',  desc:'1 uso extra do Jetpack'},
      xpMult:       {name:'2x XP',           desc:'Dobra o XP em uma corrida'},
      coinBoost:    {name:'2x Moedas',       desc:'Moedas valem 2x em uma corrida'},
      extraLife:    {name:'Vida Extra',      desc:'Inicia a corrida com 4 vidas'},
      comboBoost:   {name:'Combo Rápido',    desc:'Combo cresce mais rápido por 1 corrida'},
      startCoins:   {name:'Início Rico',     desc:'Começa a corrida com 30 moedas extras'},
      avatar1:      {name:'Avatar Herói',    desc:'Desbloqueie o visual 🦸'},
      avatar2:      {name:'Avatar Mago',     desc:'Desbloqueie o visual 🧙'},
      avatar3:      {name:'Avatar Ninja',    desc:'Desbloqueie o visual 🥷'},
      avatar4:      {name:'Avatar Princesa', desc:'Desbloqueie o visual 👸'},
      trailFire:    {name:'Rastro de Fogo',  desc:'Deixa rastro de chamas ao correr'},
      trailStars:   {name:'Rastro de Estrelas',desc:'Deixa rastro de estrelas ao correr'},
    },
    buyBtn:'Comprar', activeBtn:'Ativo', boughtBtn:'Comprado',
    noCoins:'Sem moedas', noGems:'Sem gemas', equippedBtn:'Equipado', equipBtn:'Equipar',
    dilemaTag:'DILEMA',
    correctMsg:'✅ Correto! +500 XP e +50 moedas!',
    wrongMsg:'❌ Resposta errada. -1 vida. Continue correndo!',
    timeoutMsg:'⏰ Tempo esgotado! -1 vida.',
    perfectTitle:'PERFEITO!',
    perfectSubtitle:'Você acertou todas as perguntas sem errar nenhuma! Incrível!',
    perfectContinue:'🏃 CONTINUAR CORRENDO',
    perfectMenu:'🏠 Menu Principal',
    pScoreKey:'PONTOS', pDistKey:'DISTÂNCIA', pXPKey:'XP BÔNUS', pCoinsKey:'MOEDAS BÔNUS',
    qStatsLabel:(c,w,t)=>`✅ ${c} acertadas  ❌ ${w} erradas  de ${t} perguntas`,
    powerActivated:(n)=>`⚡ ${n} ATIVADO!`,
    powerNoCharge:(n)=>`Sem carga de ${n}! Compre na loja.`,
    powerBarHint:'PODERES',
    topRunTitle:'Top Run', tabLocal:'📱 Local', tabGlobal:'🌍 Global', tabWeekly:'📅 Semanal', topBackLbl:'Voltar',
    loginTitle:'Conta & Nuvem', loginBtnLbl:'☁️ Conta & Nuvem',
    cloudSyncInfo:'Progresso sincronizado. Seus dados são salvos automaticamente após cada corrida.',
    syncNowLbl:'Sincronizar Agora', logoutLbl:'Sair da Conta', loginBackLbl:'Voltar',
    lblEmail:'EMAIL', lblPassword:'SENHA', lblRegName:'NOME NO JOGO',
    authFootnote:'Dados salvos localmente + nuvem (simulada para privacidade).',
    loginLbl:'Entrar', registerLbl:'Criar Conta',
    cloudBadgeText:(n)=>`☁️ Olá, ${n}! Progresso salvo na nuvem.`,
    errInvalidEmail:'Email inválido. Verifique e tente novamente.',
    errShortPass:'A senha precisa ter ao menos 6 caracteres.',
    errNoAccount:'Conta não encontrada. Crie uma conta primeiro.',
    errWrongPass:'Senha incorreta. Tente novamente.',
    errEmailExists:'Este email já está cadastrado.',
    successRegister:'Conta criada com sucesso! Entrando...',
    successLogin:'Bem-vindo de volta!',
    achTitle:'Conquistas',
    newAch:'🎖️ NOVA CONQUISTA!',
    rankNames:['Iniciante','Corredor','Atleta','Campeão','Lendário'],
    comboMsg:(x)=>`🔥 COMBO x${x}!`,
    newRecordMsg:'🏆 NOVO RECORDE PESSOAL!',
    pauseTitle:'⏸️ PAUSADO',
    resumeBtn:'▶️ Continuar',
    quitBtn:'🏠 Sair do Jogo',
    qNumLabel:(n,t)=>`Pergunta ${n} de ${t}`,
    rewardHint:'✅ Acerte: +500 XP e +50 moedas',
    dilemaSubtags:{
      CYBERBULLYING:'Situação de bullying virtual',
      EXCLUSÃO:'Situação de exclusão social',
      APELIDOS:'Situação de apelidos ofensivos',
      FAKENEWS:'Situação de desinformação',
      AGRESSAO:'Situação de agressão presenciada',
      EMPATIA:'Situação de empatia e inclusão',
    },
  },
  en:{
    menuTitle:'Anti-Bullying Runner', playBtn:'🏃 PLAY', shopBtn:'🛒 SHOP',
    lblName:'YOUR NAME', lblXP:'XP', lblTheme:'THEME', lblLang:'LANGUAGE',
    statBestKey:'HIGH SCORE', statCoinsKey:'COINS', statGamesKey:'RUNS',
    shopTitle:'🛒 Shop', shopBackLbl:'Back',
    goTitle:'GAME OVER', goScoreKey:'SCORE', goDistKey:'DISTANCE',
    goCoinsKey:'COINS', goGemsKey:'GEMS', goXpLabel:'XP EARNED', goQLabel:'QUESTION PERFORMANCE',
    replayLbl:'Play Again', goMenuLbl:'Main Menu',
    newRecord:'🏆 NEW RECORD!', maxLvl:'⭐ MAX LEVEL!',
    splashLoading:'LOADING...',
    splashTagline:'Run for justice. Stand up for those in need.',
    themeD:'🌙 Dark', themeL:'☀️ Light', themeBW:'◑ B&W', themeNeon:'⚡ Neon',
    powerNames:['Shield','Speed','Magnet','Slowdown','Jetpack'],
    shopSections:{ packs:'PACKS', powers:'POWER CHARGES', upgrades:'UPGRADES', cosmetics:'COSMETICS' },
    shopItems:{
      buy50coins:   {name:'50 Coins',         desc:'Buy 50 coins with 3 gems'},
      buy200coins:  {name:'200 Coins',        desc:'Big pack: 200 coins'},
      buy5gems:     {name:'5 Gems',           desc:'Buy 5 gems with 100 coins'},
      buy20gems:    {name:'20 Gems',          desc:'Big pack: 20 gems'},
      shieldCharge: {name:'Charge: Shield',   desc:'1 extra Shield use next run'},
      speedCharge:  {name:'Charge: Speed',    desc:'1 extra Speed use'},
      magnetCharge: {name:'Charge: Magnet',   desc:'1 extra Magnet use'},
      slowCharge:   {name:'Charge: Slowdown', desc:'1 extra Slowdown use'},
      jetpakCharge: {name:'Charge: Jetpack',  desc:'1 extra Jetpack use'},
      xpMult:       {name:'2x XP',            desc:'Doubles XP for one run'},
      coinBoost:    {name:'2x Coins',         desc:'Coins worth 2x for one run'},
      extraLife:    {name:'Extra Life',       desc:'Start with 4 lives'},
      comboBoost:   {name:'Fast Combo',       desc:'Combo grows faster for 1 run'},
      startCoins:   {name:'Head Start',       desc:'Start with 30 bonus coins'},
      avatar1:      {name:'Hero Avatar',      desc:'Unlock 🦸 look'},
      avatar2:      {name:'Wizard Avatar',    desc:'Unlock 🧙 look'},
      avatar3:      {name:'Ninja Avatar',     desc:'Unlock 🥷 look'},
      avatar4:      {name:'Princess Avatar',  desc:'Unlock 👸 look'},
      trailFire:    {name:'Fire Trail',       desc:'Leave a fire trail while running'},
      trailStars:   {name:'Star Trail',       desc:'Leave a star trail while running'},
    },
    buyBtn:'Buy', activeBtn:'Active', boughtBtn:'Bought',
    noCoins:'No coins', noGems:'No gems', equippedBtn:'Equipped', equipBtn:'Equip',
    dilemaTag:'DILEMMA',
    correctMsg:'✅ Correct! +500 XP and +50 coins!',
    wrongMsg:'❌ Wrong answer. -1 life. Keep running!',
    timeoutMsg:'⏰ Time up! -1 life.',
    perfectTitle:'PERFECT!',
    perfectSubtitle:'You answered all questions without a single mistake! Amazing!',
    perfectContinue:'🏃 KEEP RUNNING',
    perfectMenu:'🏠 Main Menu',
    pScoreKey:'SCORE', pDistKey:'DISTANCE', pXPKey:'BONUS XP', pCoinsKey:'BONUS COINS',
    qStatsLabel:(c,w,t)=>`✅ ${c} correct  ❌ ${w} wrong  of ${t} questions`,
    powerActivated:(n)=>`⚡ ${n} ACTIVATED!`,
    powerNoCharge:(n)=>`No ${n} charge! Buy in shop.`,
    powerBarHint:'POWERS',
    topRunTitle:'Top Run', tabLocal:'📱 Local', tabGlobal:'🌍 Global', tabWeekly:'📅 Weekly', topBackLbl:'Back',
    loginTitle:'Account & Cloud', loginBtnLbl:'☁️ Account & Cloud',
    cloudSyncInfo:'Progress synced. Your data is saved automatically after each run.',
    syncNowLbl:'Sync Now', logoutLbl:'Sign Out', loginBackLbl:'Back',
    lblEmail:'EMAIL', lblPassword:'PASSWORD', lblRegName:'GAME NAME',
    authFootnote:'Data saved locally + cloud (simulated for privacy).',
    loginLbl:'Sign In', registerLbl:'Create Account',
    cloudBadgeText:(n)=>`☁️ Hi, ${n}! Progress saved to cloud.`,
    errInvalidEmail:'Invalid email address.',
    errShortPass:'Password must be at least 6 characters.',
    errNoAccount:'Account not found. Create one first.',
    errWrongPass:'Wrong password. Please try again.',
    errEmailExists:'Email already registered.',
    successRegister:'Account created! Signing in...',
    successLogin:'Welcome back!',
    achTitle:'Achievements',
    newAch:'🎖️ NEW ACHIEVEMENT!',
    rankNames:['Beginner','Runner','Athlete','Champion','Legendary'],
    comboMsg:(x)=>`🔥 COMBO x${x}!`,
    newRecordMsg:'🏆 NEW PERSONAL RECORD!',
    pauseTitle:'⏸️ PAUSED',
    resumeBtn:'▶️ Resume',
    quitBtn:'🏠 Quit Game',
    qNumLabel:(n,t)=>`Question ${n} of ${t}`,
    rewardHint:'✅ Correct: +500 XP & +50 coins',
    dilemaSubtags:{
      CYBERBULLYING:'Online bullying situation',
      EXCLUSÃO:'Social exclusion situation',
      APELIDOS:'Offensive nickname situation',
      FAKENEWS:'Misinformation situation',
      AGRESSAO:'Witnessed aggression situation',
      EMPATIA:'Empathy & inclusion situation',
    },
  },
  es:{
    menuTitle:'Anti-Bullying Runner', playBtn:'🏃 JUGAR', shopBtn:'🛒 TIENDA',
    lblName:'TU NOMBRE', lblXP:'XP', lblTheme:'TEMA', lblLang:'IDIOMA',
    statBestKey:'RÉCORD', statCoinsKey:'MONEDAS', statGamesKey:'CARRERAS',
    shopTitle:'🛒 Tienda', shopBackLbl:'Volver',
    goTitle:'GAME OVER', goScoreKey:'PUNTOS', goDistKey:'DISTANCIA',
    goCoinsKey:'MONEDAS', goGemsKey:'GEMAS', goXpLabel:'XP GANADO', goQLabel:'DESEMPEÑO EN PREGUNTAS',
    replayLbl:'Jugar de Nuevo', goMenuLbl:'Menú Principal',
    newRecord:'🏆 ¡NUEVO RÉCORD!', maxLvl:'⭐ ¡NIVEL MÁXIMO!',
    splashLoading:'CARGANDO...',
    splashTagline:'Corre por la justicia. Defiende a quienes lo necesitan.',
    themeD:'🌙 Oscuro', themeL:'☀️ Claro', themeBW:'◑ B/N', themeNeon:'⚡ Neón',
    powerNames:['Escudo','Velocidad','Imán','Ralentizar','Jetpack'],
    shopSections:{ packs:'PAQUETES', powers:'CARGAS DE PODERES', upgrades:'MEJORAS', cosmetics:'VISUAIS' },
    shopItems:{
      buy50coins:   {name:'50 Monedas',       desc:'Compra 50 monedas con 3 gemas'},
      buy200coins:  {name:'200 Monedas',      desc:'Paquete grande: 200 monedas'},
      buy5gems:     {name:'5 Gemas',          desc:'Compra 5 gemas con 100 monedas'},
      buy20gems:    {name:'20 Gemas',         desc:'Paquete grande: 20 gemas'},
      shieldCharge: {name:'Carga: Escudo',    desc:'1 uso extra del Escudo'},
      speedCharge:  {name:'Carga: Velocidad', desc:'1 uso extra de Velocidad'},
      magnetCharge: {name:'Carga: Imán',      desc:'1 uso extra del Imán'},
      slowCharge:   {name:'Carga: Ralentizar',desc:'1 uso extra de Ralentizar'},
      jetpakCharge: {name:'Carga: Jetpack',   desc:'1 uso extra del Jetpack'},
      xpMult:       {name:'2x XP',            desc:'Duplica el XP en una carrera'},
      coinBoost:    {name:'2x Monedas',       desc:'Monedas valen 2x'},
      extraLife:    {name:'Vida Extra',       desc:'Empieza con 4 vidas'},
      comboBoost:   {name:'Combo Rápido',     desc:'El combo crece más rápido'},
      startCoins:   {name:'Inicio Rico',      desc:'Empieza con 30 monedas extra'},
      avatar1:      {name:'Avatar Héroe',     desc:'Desbloquea el look 🦸'},
      avatar2:      {name:'Avatar Mago',      desc:'Desbloquea el look 🧙'},
      avatar3:      {name:'Avatar Ninja',     desc:'Desbloquea el look 🥷'},
      avatar4:      {name:'Avatar Princesa',  desc:'Desbloquea el look 👸'},
      trailFire:    {name:'Rastro de Fuego',  desc:'Deja rastro de llamas al correr'},
      trailStars:   {name:'Rastro de Estrellas',desc:'Deja rastro de estrellas'},
    },
    buyBtn:'Comprar', activeBtn:'Activo', boughtBtn:'Comprado',
    noCoins:'Sin monedas', noGems:'Sin gemas', equippedBtn:'Equipado', equipBtn:'Equipar',
    dilemaTag:'DILEMA',
    correctMsg:'✅ ¡Correcto! +500 XP y +50 monedas!',
    wrongMsg:'❌ Respuesta incorrecta. -1 vida. ¡Sigue corriendo!',
    timeoutMsg:'⏰ ¡Tiempo agotado! -1 vida.',
    perfectTitle:'¡PERFECTO!',
    perfectSubtitle:'¡Respondiste todas las preguntas sin un solo error! ¡Increíble!',
    perfectContinue:'🏃 SEGUIR CORRIENDO',
    perfectMenu:'🏠 Menú Principal',
    pScoreKey:'PUNTOS', pDistKey:'DISTANCIA', pXPKey:'XP BONO', pCoinsKey:'MONEDAS BONO',
    qStatsLabel:(c,w,t)=>`✅ ${c} correctas  ❌ ${w} incorrectas  de ${t} preguntas`,
    powerActivated:(n)=>`⚡ ¡${n} ACTIVADO!`,
    powerNoCharge:(n)=>`¡Sin carga de ${n}! Compra en tienda.`,
    powerBarHint:'PODERES',
    topRunTitle:'Top Run', tabLocal:'📱 Local', tabGlobal:'🌍 Global', tabWeekly:'📅 Semanal', topBackLbl:'Volver',
    loginTitle:'Cuenta & Nube', loginBtnLbl:'☁️ Cuenta & Nube',
    cloudSyncInfo:'Progreso sincronizado. Los datos se guardan automáticamente.',
    syncNowLbl:'Sincronizar Ahora', logoutLbl:'Cerrar Sesión', loginBackLbl:'Volver',
    lblEmail:'EMAIL', lblPassword:'CONTRASEÑA', lblRegName:'NOMBRE EN EL JUEGO',
    authFootnote:'Datos guardados localmente + nube (simulada para privacidad).',
    loginLbl:'Entrar', registerLbl:'Crear Cuenta',
    cloudBadgeText:(n)=>`☁️ ¡Hola, ${n}! Progreso en la nube.`,
    errInvalidEmail:'Email inválido.',
    errShortPass:'La contraseña necesita al menos 6 caracteres.',
    errNoAccount:'Cuenta no encontrada. Crea una primero.',
    errWrongPass:'Contraseña incorrecta.',
    errEmailExists:'Este email ya está registrado.',
    successRegister:'¡Cuenta creada! Entrando...',
    successLogin:'¡Bienvenido de vuelta!',
    achTitle:'Logros',
    newAch:'🎖️ ¡NUEVO LOGRO!',
    rankNames:['Principiante','Corredor','Atleta','Campeón','Legendario'],
    comboMsg:(x)=>`🔥 ¡COMBO x${x}!`,
    newRecordMsg:'🏆 ¡NUEVO RÉCORD PERSONAL!',
    pauseTitle:'⏸️ PAUSADO',
    resumeBtn:'▶️ Continuar',
    quitBtn:'🏠 Salir del Juego',
    qNumLabel:(n,t)=>`Pregunta ${n} de ${t}`,
    rewardHint:'✅ Acierta: +500 XP y +50 monedas',
    dilemaSubtags:{
      CYBERBULLYING:'Situación de acoso virtual',
      EXCLUSÃO:'Situación de exclusión social',
      APELIDOS:'Situación de apodos ofensivos',
      FAKENEWS:'Situación de desinformación',
      AGRESSAO:'Situación de agresión presenciada',
      EMPATIA:'Situación de empatía e inclusión',
    },
  }
};

// ═══════════════════════════════════════════════════
// DILEMMAS (full, 6 per language)
// ═══════════════════════════════════════════════════
const DILEMMAS = {
  pt:[
    { tag:'CYBERBULLYING', tagKey:'CYBERBULLYING', icon:'💻',
      q:'Você vê um colega sendo atacado e humilhado em um grupo de mensagens da turma. Comentários cruéis são postados sobre sua aparência. O que você faz?',
      opts:[
        {t:'Fica em silêncio para não se envolver na situação.',correct:false},
        {t:'Defende o colega publicamente, reporta as mensagens e avisa um adulto de confiança.',correct:true},
        {t:'Encaminha as mensagens para mais pessoas, pois é engraçado.',correct:false},
        {t:'Curte as mensagens para não chamar atenção sobre você mesmo.',correct:false}
      ]
    },
    { tag:'EXCLUSÃO SOCIAL', tagKey:'EXCLUSÃO', icon:'🤝',
      q:'Um colega fica sozinho todos os dias no recreio e ninguém o chama para as brincadeiras. Ele parece triste e isolado. O que você faz?',
      opts:[
        {t:'Ignora, pois cada um tem seus próprios amigos e problemas.',correct:false},
        {t:'Convida o colega para seu grupo e o apresenta aos seus amigos com entusiasmo.',correct:true},
        {t:'Comenta com os amigos que ele é estranho para justificar o isolamento.',correct:false},
        {t:'Tira foto dele sozinho e posta nas redes sociais.',correct:false}
      ]
    },
    { tag:'APELIDOS OFENSIVOS', tagKey:'APELIDOS', icon:'😔',
      q:'Um grupo começa a chamar um colega de apelidos maldosos sobre sua aparência física e seus professores fingiram não ver. O que você faz?',
      opts:[
        {t:'Ri junto para não ser o próximo alvo das zombarias.',correct:false},
        {t:'Pede ao grupo para parar firmemente e depois conversa em particular com o colega afetado.',correct:true},
        {t:'Inventa novos apelidos achando que é uma brincadeira inofensiva.',correct:false},
        {t:'Observa a situação sem fazer nada por medo de represálias.',correct:false}
      ]
    },
    { tag:'FAKE NEWS', tagKey:'FAKENEWS', icon:'📰',
      q:'Alguém espalha um boato completamente falso e humilhante sobre um colega na escola e nas redes sociais. O que você faz?',
      opts:[
        {t:'Repassa o boato para mais colegas sem verificar se é verdade.',correct:false},
        {t:'Verifica a informação, não repassa e informa ativamente que o boato é falso.',correct:true},
        {t:'Adiciona detalhes dramáticos ao boato para torná-lo mais interessante.',correct:false},
        {t:'Ignora completamente, pois não é problema seu.',correct:false}
      ]
    },
    { tag:'TESTEMUNHA', tagKey:'AGRESSAO', icon:'😰',
      q:'Você vê um amigo sendo ameaçado verbalmente e empurrado por outro aluno no corredor da escola. O que você faz?',
      opts:[
        {t:'Filma a situação para postar nas redes sociais e ganhar visualizações.',correct:false},
        {t:'Se afasta rapidamente para não ser envolvido no problema.',correct:false},
        {t:'Intervém com calma, defende o amigo e busca ajuda de um professor imediatamente.',correct:true},
        {t:'Fica assistindo sem interferir, esperando a situação se resolver.',correct:false}
      ]
    },
    { tag:'EMPATIA E INCLUSÃO', tagKey:'EMPATIA', icon:'🌍',
      q:'Um aluno novo chegou de outro país e tem dificuldade de se integrar por causa do idioma e das diferenças culturais. O que você faz?',
      opts:[
        {t:'Evita falar com ele porque a comunicação é difícil e leva tempo.',correct:false},
        {t:'Faz gestos de exclusão junto com os outros para não ser diferente.',correct:false},
        {t:'Se aproxima com paciência e criatividade, usa gestos e ajuda o novo aluno a se sentir bem-vindo.',correct:true},
        {t:'Ri das tentativas do colega de se comunicar na língua nova.',correct:false}
      ]
    },
  ],
  en:[
    { tag:'CYBERBULLYING', tagKey:'CYBERBULLYING', icon:'💻',
      q:'You see a classmate being attacked and humiliated in the class messaging group. Cruel comments are posted about their appearance. What do you do?',
      opts:[
        {t:'Stay silent to avoid getting involved in the situation.',correct:false},
        {t:'Defend the classmate publicly, report the messages, and inform a trusted adult.',correct:true},
        {t:'Forward the messages to more people because it is funny.',correct:false},
        {t:'Like the messages so attention is not drawn to you.',correct:false}
      ]
    },
    { tag:'SOCIAL EXCLUSION', tagKey:'EXCLUSÃO', icon:'🤝',
      q:'A classmate is alone every day at recess and nobody invites them to play. They look sad and isolated. What do you do?',
      opts:[
        {t:'Ignore it, since everyone has their own friends and problems.',correct:false},
        {t:'Invite the classmate to join your group and enthusiastically introduce them to your friends.',correct:true},
        {t:'Tell your friends they are weird to justify the isolation.',correct:false},
        {t:'Take a photo of them alone and post it on social media.',correct:false}
      ]
    },
    { tag:'OFFENSIVE NICKNAMES', tagKey:'APELIDOS', icon:'😔',
      q:'A group starts calling a classmate mean nicknames about their physical appearance, and the teachers pretend not to see it. What do you do?',
      opts:[
        {t:'Laugh along so you are not the next target of the mockery.',correct:false},
        {t:'Firmly ask the group to stop and then privately speak to the affected classmate.',correct:true},
        {t:'Invent new nicknames thinking it is a harmless joke.',correct:false},
        {t:'Watch the situation without doing anything out of fear of retaliation.',correct:false}
      ]
    },
    { tag:'FAKE NEWS', tagKey:'FAKENEWS', icon:'📰',
      q:'Someone spreads a completely false and humiliating rumor about a classmate at school and on social media. What do you do?',
      opts:[
        {t:'Pass the rumor along to more classmates without checking if it is true.',correct:false},
        {t:'Verify the information, do not share it, and actively inform others that the rumor is false.',correct:true},
        {t:'Add dramatic details to the rumor to make it more interesting.',correct:false},
        {t:'Completely ignore it since it is not your problem.',correct:false}
      ]
    },
    { tag:'WITNESS', tagKey:'AGRESSAO', icon:'😰',
      q:'You see a friend being verbally threatened and shoved by another student in the school hallway. What do you do?',
      opts:[
        {t:'Film the situation to post on social media for views.',correct:false},
        {t:'Quickly walk away to avoid getting involved.',correct:false},
        {t:'Calmly intervene, defend your friend, and immediately get help from a teacher.',correct:true},
        {t:'Watch without interfering, waiting for the situation to resolve itself.',correct:false}
      ]
    },
    { tag:'EMPATHY AND INCLUSION', tagKey:'EMPATIA', icon:'🌍',
      q:'A new student arrived from another country and is struggling to integrate because of the language and cultural differences. What do you do?',
      opts:[
        {t:'Avoid talking to them because communication is difficult and time-consuming.',correct:false},
        {t:'Make exclusionary gestures along with others so you do not seem different.',correct:false},
        {t:'Patiently and creatively approach them, use gestures, and help the new student feel welcome.',correct:true},
        {t:'Laugh at the classmate\'s attempts to communicate in the new language.',correct:false}
      ]
    },
  ],
  es:[
    { tag:'CIBERACOSO', tagKey:'CYBERBULLYING', icon:'💻',
      q:'Ves a un compañero siendo atacado y humillado en el grupo de mensajes de la clase. Se publican comentarios crueles sobre su apariencia. ¿Qué haces?',
      opts:[
        {t:'Te quedas en silencio para no involucrarte en la situación.',correct:false},
        {t:'Defiendes al compañero públicamente, reportas los mensajes e informas a un adulto de confianza.',correct:true},
        {t:'Reenvías los mensajes a más personas porque es gracioso.',correct:false},
        {t:'Le das "me gusta" a los mensajes para que no se fijen en ti.',correct:false}
      ]
    },
    { tag:'EXCLUSIÓN SOCIAL', tagKey:'EXCLUSÃO', icon:'🤝',
      q:'Un compañero está solo todos los días en el recreo y nadie lo invita a jugar. Parece triste y aislado. ¿Qué haces?',
      opts:[
        {t:'Lo ignoras porque cada uno tiene sus propios amigos y problemas.',correct:false},
        {t:'Invitas al compañero a tu grupo y lo presentas con entusiasmo a tus amigos.',correct:true},
        {t:'Les comentas a tus amigos que es raro para justificar el aislamiento.',correct:false},
        {t:'Le sacas una foto solo y la publicas en redes sociales.',correct:false}
      ]
    },
    { tag:'APODOS OFENSIVOS', tagKey:'APELIDOS', icon:'😔',
      q:'Un grupo empieza a llamar a un compañero con apodos crueles sobre su apariencia física, y los profesores fingen no verlo. ¿Qué haces?',
      opts:[
        {t:'Ríes junto con ellos para no ser el próximo objetivo.',correct:false},
        {t:'Pides firmemente al grupo que se detenga y luego hablas en privado con el compañero afectado.',correct:true},
        {t:'Inventas nuevos apodos creyendo que es una broma inofensiva.',correct:false},
        {t:'Observas sin hacer nada por miedo a represalias.',correct:false}
      ]
    },
    { tag:'NOTICIAS FALSAS', tagKey:'FAKENEWS', icon:'📰',
      q:'Alguien difunde un rumor completamente falso y humillante sobre un compañero en la escuela y en redes sociales. ¿Qué haces?',
      opts:[
        {t:'Difundes el rumor a más compañeros sin verificar si es verdad.',correct:false},
        {t:'Verificas la información, no la compartes e informas activamente que el rumor es falso.',correct:true},
        {t:'Añades detalles dramáticos al rumor para hacerlo más interesante.',correct:false},
        {t:'Lo ignoras completamente porque no es tu problema.',correct:false}
      ]
    },
    { tag:'TESTIGO', tagKey:'AGRESSAO', icon:'😰',
      q:'Ves a un amigo siendo amenazado verbalmente y empujado por otro estudiante en el pasillo de la escuela. ¿Qué haces?',
      opts:[
        {t:'Grabas la situación para publicarla en redes sociales.',correct:false},
        {t:'Te alejas rápidamente para no involucrarte.',correct:false},
        {t:'Intervienes con calma, defiendes a tu amigo y buscas ayuda de un profesor inmediatamente.',correct:true},
        {t:'Te quedas mirando sin interferir, esperando que la situación se resuelva.',correct:false}
      ]
    },
    { tag:'EMPATÍA E INCLUSIÓN', tagKey:'EMPATIA', icon:'🌍',
      q:'Un alumno nuevo llegó de otro país y tiene dificultades para integrarse por el idioma y las diferencias culturales. ¿Qué haces?',
      opts:[
        {t:'Evitas hablarle porque la comunicación es difícil y lleva tiempo.',correct:false},
        {t:'Haces gestos de exclusión junto con los demás para no parecer diferente.',correct:false},
        {t:'Te acercas con paciencia y creatividad, usas gestos y ayudas al nuevo alumno a sentirse bienvenido.',correct:true},
        {t:'Te ríes de los intentos del compañero de comunicarse en el nuevo idioma.',correct:false}
      ]
    },
  ]
};

// ═══════════════════════════════════════════════════
// SAVE DATA
// ═══════════════════════════════════════════════════
let saveData = {
  name:'', avatarIdx:0, xp:0, coins:0, gems:0,
  bestScore:0, totalGames:0, bestDist:0,
  coinsTotal:0, gemsTotal:0,
  theme:'dark', lang:'pt',
  purchased:{}, active:{}, equipped:{},
  powerCharges:{ shield:1, speed:1, magnet:1, slowmo:1, jetpak:1 },
  loggedEmail:null,
  achievements:{},
  perfectRuns:0, bestCombo:0, shieldUses:0, powersUsed:{},
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
    if(!saveData.purchased)    saveData.purchased   = {};
    if(!saveData.active)       saveData.active      = {};
    if(!saveData.equipped)     saveData.equipped    = {};
    if(!saveData.powerCharges) saveData.powerCharges = {shield:1,speed:1,magnet:1,slowmo:1,jetpak:1};
    if(!saveData.gems)         saveData.gems        = 0;
    if(!saveData.achievements) saveData.achievements = {};
    if(!saveData.powersUsed)   saveData.powersUsed  = {};
    if(!saveData.bestDist)     saveData.bestDist    = 0;
    if(!saveData.coinsTotal)   saveData.coinsTotal  = 0;
    if(!saveData.gemsTotal)    saveData.gemsTotal   = 0;
    // ensure jetpak charge exists
    if(saveData.powerCharges.jetpak === undefined) saveData.powerCharges.jetpak = 1;
  } catch(e) { console.warn('loadSave error:', e); }
}
function writeSave() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(saveData)); } catch(e) {}
  if(saveData.loggedEmail){
    const db = getAccounts();
    if(db[saveData.loggedEmail]) db[saveData.loggedEmail].gameData = {...saveData};
    saveAccounts(db);
  }
}
function addXP(amount) {
  if(saveData.xp >= MAX_XP) return;
  const wasMax = saveData.xp >= MAX_XP;
  saveData.xp = Math.min(MAX_XP, saveData.xp + amount);
  if(!wasMax && saveData.xp >= MAX_XP) showMaxLevel();
  writeSave(); updateXPBar();
}
function addCoins(amount) {
  saveData.coins += amount;
  saveData.coinsTotal += Math.max(0, amount);
  writeSave();
  el('statCoins').textContent = saveData.coins;
  el('shopCoinsDisplay').textContent = saveData.coins;
}
function addGems(amount) {
  saveData.gems += amount;
  saveData.gemsTotal += Math.max(0, amount);
  writeSave();
  el('statGems').textContent = saveData.gems;
  el('shopGemsDisplay').textContent = saveData.gems;
}
function el(id){ return document.getElementById(id); }

// ═══════════════════════════════════════════════════
// TOP RUN / LEADERBOARD
// ═══════════════════════════════════════════════════
function getTopRun() {
  try { return JSON.parse(localStorage.getItem(TOP_KEY)||'[]'); } catch(e){ return []; }
}
function saveTopRun(arr) {
  try { localStorage.setItem(TOP_KEY, JSON.stringify(arr)); } catch(e) {}
}
function addTopEntry(score, name, dist) {
  const arr = getTopRun();
  arr.push({
    name: name||'Anônimo', score: Math.floor(score),
    dist: Math.floor(dist), date: new Date().toLocaleDateString(),
    email: saveData.loggedEmail||null,
    week: getWeekKey()
  });
  arr.sort((a,b) => b.score - a.score);
  saveTopRun(arr.slice(0, TOP_MAX));
}
function getWeekKey() {
  const d = new Date(); const day = d.getDay();
  const diff = d.getDate() - day + (day===0?-6:1);
  return new Date(d.setDate(diff)).toLocaleDateString();
}
let currentTopTab = 'local';
let currentTopFilter = 'score';
function renderTopRun() {
  currentTopFilter = el('topFilterScore').value;
  const list = el('topList'); list.innerHTML = '';
  let entries = getTopRun();
  if(currentTopTab === 'weekly') entries = entries.filter(e => e.week === getWeekKey());
  if(currentTopFilter === 'dist') entries = [...entries].sort((a,b) => b.dist - a.dist);
  if(!entries.length){ list.innerHTML=`<div class="top-empty">🏃 Nenhuma corrida ainda!<br>Seja o primeiro!</div>`; return; }
  entries.slice(0,10).forEach((e,i) => {
    const rankClass = i===0?'gold':i===1?'silver':i===2?'bronze':'other';
    const isMe = (e.email && e.email===saveData.loggedEmail) || (!e.email && e.name===saveData.name);
    const div = document.createElement('div');
    div.className = 'top-entry'+(isMe?' me':'')+(i<3?' top3':'');
    const mainVal = currentTopFilter==='dist' ? `${e.dist}m` : e.score.toLocaleString();
    const subVal  = currentTopFilter==='dist' ? e.score.toLocaleString()+' pts' : `${e.dist}m`;
    div.innerHTML = `
      <div class="top-rank ${rankClass}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div>
      <div class="top-info">
        <div class="top-name">${e.name}${isMe?' ← você':''}</div>
        <div class="top-score-sub">📅 ${e.date} · ${subVal}</div>
      </div>
      <div class="top-score-val">${mainVal}</div>`;
    list.appendChild(div);
  });
}
function showTopTab(tab) {
  currentTopTab = tab;
  ['local','global','weekly'].forEach(t => el('tab'+t.charAt(0).toUpperCase()+t.slice(1))?.classList.toggle('active', t===tab));
  renderTopRun();
}

// ═══════════════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════════════
function checkAchievements() {
  const newlyUnlocked = [];
  ACHIEVEMENTS_DEF.forEach(ach => {
    if(!saveData.achievements[ach.id] && ach.req(saveData)) {
      saveData.achievements[ach.id] = { unlockedAt: Date.now() };
      newlyUnlocked.push(ach);
      if(ach.rewardType==='coin') addCoins(ach.reward);
      else if(ach.rewardType==='gem') addGems(ach.reward);
    }
  });
  if(newlyUnlocked.length) writeSave();
  return newlyUnlocked;
}
function renderAchievements() {
  const grid = el('achGrid'); grid.innerHTML = '';
  const done = ACHIEVEMENTS_DEF.filter(a => saveData.achievements[a.id]).length;
  el('achDone').textContent = done;
  el('achTotal').textContent = ACHIEVEMENTS_DEF.length;
  el('achProgressFill').style.width = (done/ACHIEVEMENTS_DEF.length*100)+'%';
  ACHIEVEMENTS_DEF.forEach(ach => {
    const unlocked = !!saveData.achievements[ach.id];
    const div = document.createElement('div');
    div.className = 'ach-item ' + (unlocked ? 'unlocked' : 'locked');
    const rIcon = ach.rewardType==='gem'?'💎':'🪙';
    div.innerHTML = `
      <div class="ach-icon">${ach.icon}</div>
      <div class="ach-name">${ach.name}</div>
      <div class="ach-desc">${ach.desc}</div>
      <div class="ach-reward">${unlocked?'✅ Conquistado!':rIcon+' +'+ach.reward}</div>
      <div class="ach-progress-mini"><div class="ach-progress-mini-fill" style="width:${unlocked?100:0}%"></div></div>`;
    grid.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════
let authTab = 'login';
function switchAuthTab(tab) {
  authTab = tab;
  const T = UI_TEXT[saveData.lang];
  el('tabLogin').classList.toggle('active', tab==='login');
  el('tabRegister').classList.toggle('active', tab==='register');
  el('registerNameField').style.display = tab==='register' ? 'block' : 'none';
  el('authSubmitBtn').textContent = tab==='login'?('🔑 '+T.loginLbl):('✨ '+T.registerLbl);
  el('authError').classList.remove('show');
  el('authSuccess').classList.remove('show');
}
function handleAuth() {
  const T = UI_TEXT[saveData.lang];
  const email = el('authEmail').value.trim().toLowerCase();
  const pass  = el('authPassword').value;
  const errEl = el('authError');
  const okEl  = el('authSuccess');
  errEl.classList.remove('show'); okEl.classList.remove('show');
  if(!email.includes('@')){ errEl.textContent=T.errInvalidEmail; errEl.classList.add('show'); return; }
  if(pass.length<6){ errEl.textContent=T.errShortPass; errEl.classList.add('show'); return; }
  const db = getAccounts();
  if(authTab==='register'){
    const regName = el('authName').value.trim()||email.split('@')[0];
    if(db[email]){ errEl.textContent=T.errEmailExists; errEl.classList.add('show'); return; }
    db[email] = { email, pass, name:regName, gameData:{...saveData, loggedEmail:email, name:regName} };
    saveAccounts(db);
    okEl.textContent=T.successRegister; okEl.classList.add('show');
    setTimeout(()=>doLogin(email, db[email]), 1200);
  } else {
    if(!db[email]){ errEl.textContent=T.errNoAccount; errEl.classList.add('show'); return; }
    if(db[email].pass!==pass){ errEl.textContent=T.errWrongPass; errEl.classList.add('show'); return; }
    okEl.textContent=T.successLogin; okEl.classList.add('show');
    setTimeout(()=>doLogin(email, db[email]), 800);
  }
}
function doLogin(email, account) {
  if(account.gameData){
    const cd = account.gameData;
    saveData.coins = Math.max(saveData.coins, cd.coins||0);
    saveData.gems  = Math.max(saveData.gems,  cd.gems||0);
    saveData.xp    = Math.max(saveData.xp,    cd.xp||0);
    saveData.bestScore = Math.max(saveData.bestScore, cd.bestScore||0);
    saveData.bestDist  = Math.max(saveData.bestDist,  cd.bestDist||0);
    saveData.totalGames= Math.max(saveData.totalGames, cd.totalGames||0);
    if(cd.purchased) Object.assign(saveData.purchased, cd.purchased);
    if(cd.powerCharges){ for(const k in cd.powerCharges) saveData.powerCharges[k]=Math.max(saveData.powerCharges[k]||0, cd.powerCharges[k]||0); }
    if(cd.achievements) Object.assign(saveData.achievements, cd.achievements);
    if(!saveData.name && cd.name) saveData.name = cd.name;
  }
  saveData.loggedEmail = email;
  if(!saveData.name) saveData.name = account.name || email.split('@')[0];
  el('nameInp').value = saveData.name;
  writeSave(); updateMenuStats(); updateXPBar(); updateAvatar(); updateLoggedInUI();
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
  const cloudBadge = el('cloudBadge');
  if(isLogged){
    cloudBadge.style.display='flex';
    el('cloudBadgeText').textContent = T.cloudBadgeText(saveData.name||'Jogador');
  } else { cloudBadge.style.display='none'; }
  el('loggedPanel').style.display = isLogged ? 'block' : 'none';
  el('authPanel').style.display   = isLogged ? 'none'  : 'block';
  if(isLogged){
    const all = getAvatarList();
    el('loggedAvatar').textContent = all[Math.min(saveData.avatarIdx, all.length-1)];
    el('loggedName').textContent   = saveData.name || saveData.loggedEmail;
    el('loggedEmail').textContent  = saveData.loggedEmail;
  }
}

// ═══════════════════════════════════════════════════
// RANK SYSTEM
// ═══════════════════════════════════════════════════
function getRank() {
  const T = UI_TEXT[saveData.lang];
  const xpPct = saveData.xp / MAX_XP;
  const rankIdx = xpPct>=0.9?4 : xpPct>=0.6?3 : xpPct>=0.3?2 : xpPct>=0.1?1 : 0;
  const icons = ['🥉','🥈','🥇','🏆','👑'];
  return `${icons[rankIdx]} ${T.rankNames[rankIdx]}`;
}

// ═══════════════════════════════════════════════════
// CANVAS
// ═══════════════════════════════════════════════════
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let trackGeo = {};
function computeTrackGeometry() {
  const W=canvas.width, H=canvas.height;
  trackGeo = { vanishX:W/2, vanishY:H*0.28, bottomY:H*0.93, halfBottomW:W*0.44, W, H };
}
computeTrackGeometry();

// ═══════════════════════════════════════════════════
// WEB AUDIO ENGINE
// ═══════════════════════════════════════════════════
let audioCtx = null, musicOn = true;
let bgMusicTimeout = null;
let musicStep=0, musicPattern=0, musicBPM=130;

function ensureAudio() {
  if(!audioCtx){ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }
  if(audioCtx.state==='suspended') audioCtx.resume();
}
function playNote(freq, dur, vol=0.3, type='triangle', delay=0) {
  if(!audioCtx || !musicOn) return;
  const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.type=type; osc.frequency.value=freq;
  const t=audioCtx.currentTime+delay;
  gain.gain.setValueAtTime(0,t);
  gain.gain.linearRampToValueAtTime(vol,t+0.02);
  gain.gain.exponentialRampToValueAtTime(0.001,t+dur);
  osc.start(t); osc.stop(t+dur+0.05);
}
function playSFX(type) {
  ensureAudio(); if(!audioCtx) return;
  switch(type){
    case 'coin':
      playNote(880,0.07,0.18,'sine'); playNote(1320,0.09,0.13,'sine',0.06);
      break;
    case 'gem':
      [660,880,1100,1320].forEach((f,i)=>playNote(f,0.1,0.15,'sine',i*0.05));
      break;
    case 'jump':
      const j=audioCtx.createOscillator(), jg=audioCtx.createGain();
      j.connect(jg); jg.connect(audioCtx.destination); j.type='triangle';
      j.frequency.setValueAtTime(280,audioCtx.currentTime);
      j.frequency.exponentialRampToValueAtTime(620,audioCtx.currentTime+0.18);
      jg.gain.setValueAtTime(0.22,audioCtx.currentTime);
      jg.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.28);
      j.start(); j.stop(audioCtx.currentTime+0.3); break;
    case 'shield':
      [200,310,440,660].forEach((f,i)=>playNote(f,0.18,0.16,'sine',i*0.07));
      break;
    case 'hit':
      const h=audioCtx.createOscillator(), hg=audioCtx.createGain();
      h.connect(hg); hg.connect(audioCtx.destination); h.type='sawtooth';
      h.frequency.setValueAtTime(155,audioCtx.currentTime);
      h.frequency.exponentialRampToValueAtTime(45,audioCtx.currentTime+0.38);
      hg.gain.setValueAtTime(0.42,audioCtx.currentTime);
      hg.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.42);
      h.start(); h.stop(audioCtx.currentTime+0.45); break;
    case 'power':
      [440,550,660,880,1100].forEach((f,i)=>playNote(f,0.18,0.13,'triangle',i*0.045));
      break;
    case 'correct':
      [523,659,784,1047,1319].forEach((f,i)=>playNote(f,0.16,0.18,'sine',i*0.08));
      break;
    case 'wrong':
      playNote(220,0.28,0.3,'sawtooth'); playNote(180,0.38,0.22,'sawtooth',0.16);
      break;
    case 'levelup':
      [523,659,784,659,784,1047,784,1047,1319].forEach((f,i)=>playNote(f,0.15,0.22,'sine',i*0.1));
      break;
    case 'gameover':
      [440,330,220,165,110].forEach((f,i)=>playNote(f,0.32,0.28,'sawtooth',i*0.2));
      break;
    case 'click': playNote(900,0.04,0.1,'sine'); break;
    case 'perfect':
      const pf=[523,659,784,1047,784,1047,1319,1047,1319,1568];
      pf.forEach((f,i)=>playNote(f,0.18,0.18,'sine',i*0.09));
      break;
    case 'combo':
      playNote(880,0.06,0.2,'sine'); playNote(1100,0.08,0.18,'sine',0.05);
      break;
    case 'record':
      // Fanfare for new record
      [523,523,523,784,659,523,784,1047].forEach((f,i)=>playNote(f,i===7?0.5:0.15,0.25,'sine',i*0.12));
      break;
    case 'jetpak':
      const jo=audioCtx.createOscillator(), jog=audioCtx.createGain();
      jo.connect(jog); jog.connect(audioCtx.destination); jo.type='sawtooth';
      jo.frequency.setValueAtTime(80,audioCtx.currentTime);
      jo.frequency.linearRampToValueAtTime(200,audioCtx.currentTime+0.5);
      jog.gain.setValueAtTime(0.15,audioCtx.currentTime);
      jog.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.6);
      jo.start(); jo.stop(audioCtx.currentTime+0.65); break;
  }
}

const MUSIC_NOTES = [261,294,330,349,392,440,494,523];
const MUSIC_PATTERNS = [
  [0,2,4,5,7,5,4,2],
  [0,4,7,4,0,4,7,9],
  [7,5,4,2,0,2,4,5],
  [0,2,4,7,9,7,4,2],
  [4,5,7,9,7,5,4,0],
];
function playBGMusic() {
  if(!audioCtx || !musicOn || !game.running) return;
  const pat=MUSIC_PATTERNS[musicPattern%MUSIC_PATTERNS.length];
  const ni=pat[musicStep%pat.length];
  const freq=MUSIC_NOTES[ni<MUSIC_NOTES.length?ni:0];
  const bpm=Math.min(200, musicBPM + game.speedRamp*55);
  playNote(freq/2, 0.16, 0.1, 'triangle');
  if(musicStep%2===0) playNote(freq*2, 0.1, 0.06, 'sine');
  if(musicStep%4===0) playNote(freq*1.5, 0.08, 0.05, 'sine');
  musicStep++;
  if(musicStep%8===0) musicPattern++;
  bgMusicTimeout = setTimeout(playBGMusic, (60/bpm)*1000);
}
function stopBGMusic() {
  if(bgMusicTimeout){ clearTimeout(bgMusicTimeout); bgMusicTimeout=null; }
}
function toggleMusic() {
  musicOn = !musicOn;
  el('musicToggle').textContent = musicOn ? '🎵' : '🔇';
  if(musicOn && game.running){ ensureAudio(); playBGMusic(); }
  else stopBGMusic();
}

// ═══════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════
const game = {
  running:false, paused:false,
  lane:1, targetLane:1, laneTransition:1.0,
  jumping:false, jumpT:0, jumpHeight:0,
  speed:0, speedRamp:0,
  score:0, coins:0, gems:0, xpEarned:0, distance:0,
  obstacles:[], collectibles:[], particles:[], decorObjects:[],
  obstacleTimer:0, collectibleTimer:0,
  dilemmaTimer:0, dilemmaInterval:28,
  dilemmaShown:[], dilemmaQueue:[], dilemmaCount:0,
  playerBobT:0, bgOffset:0,
  shieldActive:false, xpMultActive:false, coinBoostActive:false, comboBoostActive:false,
  lives:MAX_LIVES,
  questionsAnswered:0, questionsCorrect:0, questionsWrong:0,
  perfectRun:true, allQAnswered:false,
  lastTime:0, raf:null,
  combo:0, maxCombo:0, comboTimer:0,
  powers:[
    {id:'shield', active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'speed',  active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'magnet', active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'slowmo', active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'jetpak', active:false, cdLeft:0, activeLeft:0, charges:0},
  ],
  slowmoActive:false, magnetActive:false, speedBoostActive:false, jetpakActive:false,
  trailType: null, // 'fire','stars',null
};

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function getLaneX(laneIdx, z) {
  const {vanishX,vanishY,bottomY,halfBottomW}=trackGeo;
  const yPos = vanishY+(bottomY-vanishY)*z;
  const laneW = halfBottomW*2*z;
  const step  = laneW/LANES;
  return { x:(vanishX-laneW/2+step/2)+laneIdx*step, y:yPos };
}
function easeInOut(t){ return t<0.5?2*t*t:-1+(4-2*t)*t; }
function isMobile(){ return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||window.innerWidth<768; }
function roundRect(c,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  c.beginPath();
  c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();
}
function getObstacleW(z){ return trackGeo.halfBottomW*2*z/LANES*0.84; }
cat >> /home/claude/subway-runner/game.js << 'JSEOF'

// ═══════════════════════════════════════════════════
// TOP RUN / LEADERBOARD
// ═══════════════════════════════════════════════════
function getTopRun() {
  try { return JSON.parse(localStorage.getItem(TOP_KEY)||'[]'); } catch(e){ return []; }
}
function saveTopRun(arr) {
  try { localStorage.setItem(TOP_KEY, JSON.stringify(arr)); } catch(e) {}
}
function addTopEntry(score, name, dist) {
  const arr = getTopRun();
  arr.push({
    name: name||'Anônimo', score: Math.floor(score),
    dist: Math.floor(dist), date: new Date().toLocaleDateString(),
    email: saveData.loggedEmail||null,
    week: getWeekKey()
  });
  arr.sort((a,b) => b.score - a.score);
  saveTopRun(arr.slice(0, TOP_MAX));
}
function getWeekKey() {
  const d = new Date(); const day = d.getDay();
  const diff = d.getDate() - day + (day===0?-6:1);
  return new Date(d.setDate(diff)).toLocaleDateString();
}
let currentTopTab = 'local';
let currentTopFilter = 'score';
function renderTopRun() {
  currentTopFilter = el('topFilterScore').value;
  const list = el('topList'); list.innerHTML = '';
  let entries = getTopRun();
  if(currentTopTab === 'weekly') entries = entries.filter(e => e.week === getWeekKey());
  if(currentTopFilter === 'dist') entries = [...entries].sort((a,b) => b.dist - a.dist);
  if(!entries.length){ list.innerHTML=`<div class="top-empty">🏃 Nenhuma corrida ainda!<br>Seja o primeiro!</div>`; return; }
  entries.slice(0,10).forEach((e,i) => {
    const rankClass = i===0?'gold':i===1?'silver':i===2?'bronze':'other';
    const isMe = (e.email && e.email===saveData.loggedEmail) || (!e.email && e.name===saveData.name);
    const div = document.createElement('div');
    div.className = 'top-entry'+(isMe?' me':'')+(i<3?' top3':'');
    const mainVal = currentTopFilter==='dist' ? `${e.dist}m` : e.score.toLocaleString();
    const subVal  = currentTopFilter==='dist' ? e.score.toLocaleString()+' pts' : `${e.dist}m`;
    div.innerHTML = `
      <div class="top-rank ${rankClass}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div>
      <div class="top-info">
        <div class="top-name">${e.name}${isMe?' ← você':''}</div>
        <div class="top-score-sub">📅 ${e.date} · ${subVal}</div>
      </div>
      <div class="top-score-val">${mainVal}</div>`;
    list.appendChild(div);
  });
}
function showTopTab(tab) {
  currentTopTab = tab;
  ['local','global','weekly'].forEach(t => el('tab'+t.charAt(0).toUpperCase()+t.slice(1))?.classList.toggle('active', t===tab));
  renderTopRun();
}

// ═══════════════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════════════
function checkAchievements() {
  const newlyUnlocked = [];
  ACHIEVEMENTS_DEF.forEach(ach => {
    if(!saveData.achievements[ach.id] && ach.req(saveData)) {
      saveData.achievements[ach.id] = { unlockedAt: Date.now() };
      newlyUnlocked.push(ach);
      if(ach.rewardType==='coin') addCoins(ach.reward);
      else if(ach.rewardType==='gem') addGems(ach.reward);
    }
  });
  if(newlyUnlocked.length) writeSave();
  return newlyUnlocked;
}
function renderAchievements() {
  const grid = el('achGrid'); grid.innerHTML = '';
  const done = ACHIEVEMENTS_DEF.filter(a => saveData.achievements[a.id]).length;
  el('achDone').textContent = done;
  el('achTotal').textContent = ACHIEVEMENTS_DEF.length;
  el('achProgressFill').style.width = (done/ACHIEVEMENTS_DEF.length*100)+'%';
  ACHIEVEMENTS_DEF.forEach(ach => {
    const unlocked = !!saveData.achievements[ach.id];
    const div = document.createElement('div');
    div.className = 'ach-item ' + (unlocked ? 'unlocked' : 'locked');
    const rIcon = ach.rewardType==='gem'?'💎':'🪙';
    div.innerHTML = `
      <div class="ach-icon">${ach.icon}</div>
      <div class="ach-name">${ach.name}</div>
      <div class="ach-desc">${ach.desc}</div>
      <div class="ach-reward">${unlocked?'✅ Conquistado!':rIcon+' +'+ach.reward}</div>
      <div class="ach-progress-mini"><div class="ach-progress-mini-fill" style="width:${unlocked?100:0}%"></div></div>`;
    grid.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════
let authTab = 'login';
function switchAuthTab(tab) {
  authTab = tab;
  const T = UI_TEXT[saveData.lang];
  el('tabLogin').classList.toggle('active', tab==='login');
  el('tabRegister').classList.toggle('active', tab==='register');
  el('registerNameField').style.display = tab==='register' ? 'block' : 'none';
  el('authSubmitBtn').textContent = tab==='login'?('🔑 '+T.loginLbl):('✨ '+T.registerLbl);
  el('authError').classList.remove('show');
  el('authSuccess').classList.remove('show');
}
function handleAuth() {
  const T = UI_TEXT[saveData.lang];
  const email = el('authEmail').value.trim().toLowerCase();
  const pass  = el('authPassword').value;
  const errEl = el('authError');
  const okEl  = el('authSuccess');
  errEl.classList.remove('show'); okEl.classList.remove('show');
  if(!email.includes('@')){ errEl.textContent=T.errInvalidEmail; errEl.classList.add('show'); return; }
  if(pass.length<6){ errEl.textContent=T.errShortPass; errEl.classList.add('show'); return; }
  const db = getAccounts();
  if(authTab==='register'){
    const regName = el('authName').value.trim()||email.split('@')[0];
    if(db[email]){ errEl.textContent=T.errEmailExists; errEl.classList.add('show'); return; }
    db[email] = { email, pass, name:regName, gameData:{...saveData, loggedEmail:email, name:regName} };
    saveAccounts(db);
    okEl.textContent=T.successRegister; okEl.classList.add('show');
    setTimeout(()=>doLogin(email, db[email]), 1200);
  } else {
    if(!db[email]){ errEl.textContent=T.errNoAccount; errEl.classList.add('show'); return; }
    if(db[email].pass!==pass){ errEl.textContent=T.errWrongPass; errEl.classList.add('show'); return; }
    okEl.textContent=T.successLogin; okEl.classList.add('show');
    setTimeout(()=>doLogin(email, db[email]), 800);
  }
}
function doLogin(email, account) {
  if(account.gameData){
    const cd = account.gameData;
    saveData.coins = Math.max(saveData.coins, cd.coins||0);
    saveData.gems  = Math.max(saveData.gems,  cd.gems||0);
    saveData.xp    = Math.max(saveData.xp,    cd.xp||0);
    saveData.bestScore = Math.max(saveData.bestScore, cd.bestScore||0);
    saveData.bestDist  = Math.max(saveData.bestDist,  cd.bestDist||0);
    saveData.totalGames= Math.max(saveData.totalGames, cd.totalGames||0);
    if(cd.purchased) Object.assign(saveData.purchased, cd.purchased);
    if(cd.powerCharges){ for(const k in cd.powerCharges) saveData.powerCharges[k]=Math.max(saveData.powerCharges[k]||0, cd.powerCharges[k]||0); }
    if(cd.achievements) Object.assign(saveData.achievements, cd.achievements);
    if(!saveData.name && cd.name) saveData.name = cd.name;
  }
  saveData.loggedEmail = email;
  if(!saveData.name) saveData.name = account.name || email.split('@')[0];
  el('nameInp').value = saveData.name;
  writeSave(); updateMenuStats(); updateXPBar(); updateAvatar(); updateLoggedInUI();
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
  const cloudBadge = el('cloudBadge');
  if(isLogged){
    cloudBadge.style.display='flex';
    el('cloudBadgeText').textContent = T.cloudBadgeText(saveData.name||'Jogador');
  } else { cloudBadge.style.display='none'; }
  el('loggedPanel').style.display = isLogged ? 'block' : 'none';
  el('authPanel').style.display   = isLogged ? 'none'  : 'block';
  if(isLogged){
    const all = getAvatarList();
    el('loggedAvatar').textContent = all[Math.min(saveData.avatarIdx, all.length-1)];
    el('loggedName').textContent   = saveData.name || saveData.loggedEmail;
    el('loggedEmail').textContent  = saveData.loggedEmail;
  }
}

// ═══════════════════════════════════════════════════
// RANK SYSTEM
// ═══════════════════════════════════════════════════
function getRank() {
  const T = UI_TEXT[saveData.lang];
  const xpPct = saveData.xp / MAX_XP;
  const rankIdx = xpPct>=0.9?4 : xpPct>=0.6?3 : xpPct>=0.3?2 : xpPct>=0.1?1 : 0;
  const icons = ['🥉','🥈','🥇','🏆','👑'];
  return `${icons[rankIdx]} ${T.rankNames[rankIdx]}`;
}

// ═══════════════════════════════════════════════════
// CANVAS
// ═══════════════════════════════════════════════════
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let trackGeo = {};
function computeTrackGeometry() {
  const W=canvas.width, H=canvas.height;
  trackGeo = { vanishX:W/2, vanishY:H*0.28, bottomY:H*0.93, halfBottomW:W*0.44, W, H };
}
computeTrackGeometry();

// ═══════════════════════════════════════════════════
// WEB AUDIO ENGINE
// ═══════════════════════════════════════════════════
let audioCtx = null, musicOn = true;
let bgMusicTimeout = null;
let musicStep=0, musicPattern=0, musicBPM=130;

function ensureAudio() {
  if(!audioCtx){ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }
  if(audioCtx.state==='suspended') audioCtx.resume();
}
function playNote(freq, dur, vol=0.3, type='triangle', delay=0) {
  if(!audioCtx || !musicOn) return;
  const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.type=type; osc.frequency.value=freq;
  const t=audioCtx.currentTime+delay;
  gain.gain.setValueAtTime(0,t);
  gain.gain.linearRampToValueAtTime(vol,t+0.02);
  gain.gain.exponentialRampToValueAtTime(0.001,t+dur);
  osc.start(t); osc.stop(t+dur+0.05);
}
function playSFX(type) {
  ensureAudio(); if(!audioCtx) return;
  switch(type){
    case 'coin':
      playNote(880,0.07,0.18,'sine'); playNote(1320,0.09,0.13,'sine',0.06);
      break;
    case 'gem':
      [660,880,1100,1320].forEach((f,i)=>playNote(f,0.1,0.15,'sine',i*0.05));
      break;
    case 'jump':
      const j=audioCtx.createOscillator(), jg=audioCtx.createGain();
      j.connect(jg); jg.connect(audioCtx.destination); j.type='triangle';
      j.frequency.setValueAtTime(280,audioCtx.currentTime);
      j.frequency.exponentialRampToValueAtTime(620,audioCtx.currentTime+0.18);
      jg.gain.setValueAtTime(0.22,audioCtx.currentTime);
      jg.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.28);
      j.start(); j.stop(audioCtx.currentTime+0.3); break;
    case 'shield':
      [200,310,440,660].forEach((f,i)=>playNote(f,0.18,0.16,'sine',i*0.07));
      break;
    case 'hit':
      const h=audioCtx.createOscillator(), hg=audioCtx.createGain();
      h.connect(hg); hg.connect(audioCtx.destination); h.type='sawtooth';
      h.frequency.setValueAtTime(155,audioCtx.currentTime);
      h.frequency.exponentialRampToValueAtTime(45,audioCtx.currentTime+0.38);
      hg.gain.setValueAtTime(0.42,audioCtx.currentTime);
      hg.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.42);
      h.start(); h.stop(audioCtx.currentTime+0.45); break;
    case 'power':
      [440,550,660,880,1100].forEach((f,i)=>playNote(f,0.18,0.13,'triangle',i*0.045));
      break;
    case 'correct':
      [523,659,784,1047,1319].forEach((f,i)=>playNote(f,0.16,0.18,'sine',i*0.08));
      break;
    case 'wrong':
      playNote(220,0.28,0.3,'sawtooth'); playNote(180,0.38,0.22,'sawtooth',0.16);
      break;
    case 'levelup':
      [523,659,784,659,784,1047,784,1047,1319].forEach((f,i)=>playNote(f,0.15,0.22,'sine',i*0.1));
      break;
    case 'gameover':
      [440,330,220,165,110].forEach((f,i)=>playNote(f,0.32,0.28,'sawtooth',i*0.2));
      break;
    case 'click': playNote(900,0.04,0.1,'sine'); break;
    case 'perfect':
      const pf=[523,659,784,1047,784,1047,1319,1047,1319,1568];
      pf.forEach((f,i)=>playNote(f,0.18,0.18,'sine',i*0.09));
      break;
    case 'combo':
      playNote(880,0.06,0.2,'sine'); playNote(1100,0.08,0.18,'sine',0.05);
      break;
    case 'record':
      // Fanfare for new record
      [523,523,523,784,659,523,784,1047].forEach((f,i)=>playNote(f,i===7?0.5:0.15,0.25,'sine',i*0.12));
      break;
    case 'jetpak':
      const jo=audioCtx.createOscillator(), jog=audioCtx.createGain();
      jo.connect(jog); jog.connect(audioCtx.destination); jo.type='sawtooth';
      jo.frequency.setValueAtTime(80,audioCtx.currentTime);
      jo.frequency.linearRampToValueAtTime(200,audioCtx.currentTime+0.5);
      jog.gain.setValueAtTime(0.15,audioCtx.currentTime);
      jog.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.6);
      jo.start(); jo.stop(audioCtx.currentTime+0.65); break;
  }
}

const MUSIC_NOTES = [261,294,330,349,392,440,494,523];
const MUSIC_PATTERNS = [
  [0,2,4,5,7,5,4,2],
  [0,4,7,4,0,4,7,9],
  [7,5,4,2,0,2,4,5],
  [0,2,4,7,9,7,4,2],
  [4,5,7,9,7,5,4,0],
];
function playBGMusic() {
  if(!audioCtx || !musicOn || !game.running) return;
  const pat=MUSIC_PATTERNS[musicPattern%MUSIC_PATTERNS.length];
  const ni=pat[musicStep%pat.length];
  const freq=MUSIC_NOTES[ni<MUSIC_NOTES.length?ni:0];
  const bpm=Math.min(200, musicBPM + game.speedRamp*55);
  playNote(freq/2, 0.16, 0.1, 'triangle');
  if(musicStep%2===0) playNote(freq*2, 0.1, 0.06, 'sine');
  if(musicStep%4===0) playNote(freq*1.5, 0.08, 0.05, 'sine');
  musicStep++;
  if(musicStep%8===0) musicPattern++;
  bgMusicTimeout = setTimeout(playBGMusic, (60/bpm)*1000);
}
function stopBGMusic() {
  if(bgMusicTimeout){ clearTimeout(bgMusicTimeout); bgMusicTimeout=null; }
}
function toggleMusic() {
  musicOn = !musicOn;
  el('musicToggle').textContent = musicOn ? '🎵' : '🔇';
  if(musicOn && game.running){ ensureAudio(); playBGMusic(); }
  else stopBGMusic();
}

// ═══════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════
const game = {
  running:false, paused:false,
  lane:1, targetLane:1, laneTransition:1.0,
  jumping:false, jumpT:0, jumpHeight:0,
  speed:0, speedRamp:0,
  score:0, coins:0, gems:0, xpEarned:0, distance:0,
  obstacles:[], collectibles:[], particles:[], decorObjects:[],
  obstacleTimer:0, collectibleTimer:0,
  dilemmaTimer:0, dilemmaInterval:28,
  dilemmaShown:[], dilemmaQueue:[], dilemmaCount:0,
  playerBobT:0, bgOffset:0,
  shieldActive:false, xpMultActive:false, coinBoostActive:false, comboBoostActive:false,
  lives:MAX_LIVES,
  questionsAnswered:0, questionsCorrect:0, questionsWrong:0,
  perfectRun:true, allQAnswered:false,
  lastTime:0, raf:null,
  combo:0, maxCombo:0, comboTimer:0,
  powers:[
    {id:'shield', active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'speed',  active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'magnet', active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'slowmo', active:false, cdLeft:0, activeLeft:0, charges:0},
    {id:'jetpak', active:false, cdLeft:0, activeLeft:0, charges:0},
  ],
  slowmoActive:false, magnetActive:false, speedBoostActive:false, jetpakActive:false,
  trailType: null, // 'fire','stars',null
};

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function getLaneX(laneIdx, z) {
  const {vanishX,vanishY,bottomY,halfBottomW}=trackGeo;
  const yPos = vanishY+(bottomY-vanishY)*z;
  const laneW = halfBottomW*2*z;
  const step  = laneW/LANES;
  return { x:(vanishX-laneW/2+step/2)+laneIdx*step, y:yPos };
}
function easeInOut(t){ return t<0.5?2*t*t:-1+(4-2*t)*t; }
function isMobile(){ return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||window.innerWidth<768; }
function roundRect(c,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  c.beginPath();
  c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();
}
function getObstacleW(z){ return trackGeo.halfBottomW*2*z/LANES*0.84; }
JSEOF
echo "Part 2 appended"
