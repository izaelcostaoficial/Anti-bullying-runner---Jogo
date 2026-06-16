
Action: file_editor create /app/standalone/game.js --file-text "/* ============================================================
   Anti-Bullying Runner — Standalone (HTML+CSS+JS)
   ============================================================ */

/* ===== Configuration ===== */
// If you have a backend (FastAPI) set this. Otherwise leave \"\" and the game uses localStorage.
const API_BASE = \"\"; // ex: \"https://yourapi.com\"  ->  reqs go to ${API_BASE}/api/...

/* ===== i18n ===== */
const I18N = {
  pt: { tagline:\"Corra. Aprenda. Defenda. Inspire.\", play:\"JOGAR\", login:\"Entrar\", register:\"Cadastrar\", logout:\"Sair\", leaderboard:\"Ranking\", settings:\"Configurações\", welcomeBack:\"Bem-vindo de volta\", email:\"Email\", password:\"Senha\", name:\"Nome\", signInGoogle:\"Entrar com Google\", or:\"ou\", haveAccount:\"Já tem conta?\", noAccount:\"Não tem conta?\", createAccount:\"Criar conta\", score:\"Pontos\", bestScore:\"Recorde\", lives:\"Vidas\", correct:\"Acertos\", pause:\"PAUSA\", resume:\"Continuar\", quit:\"Sair\", instructions:\"Setas / WASD ou Toque para mover. Desvie dos obstáculos. Responda perguntas para sobreviver.\", gameOver:\"Fim de Jogo\", youDied:\"Você foi derrotado\", newRecord:\"Novo Recorde!\", playAgain:\"Jogar Novamente\", backToMenu:\"Voltar ao Menu\", language:\"Idioma\", theme:\"Cor do Tema\", colorblind:\"Modo Daltônico\", colorblindOff:\"Desligado\", colorblindDeuteranopia:\"Deuteranopia\", colorblindProtanopia:\"Protanopia\", colorblindTritanopia:\"Tritanopia\", noScores:\"Nenhuma pontuação ainda.\", correctAnswer:\"Resposta correta!\", wrongAnswer:\"Resposta errada!\", chooseAnswer:\"Escolha a resposta correta\", loginToSave:\"Faça login para salvar sua pontuação.\" },
  en: { tagline:\"Run. Learn. Defend. Inspire.\", play:\"PLAY\", login:\"Sign in\", register:\"Sign up\", logout:\"Log out\", leaderboard:\"Leaderboard\", settings:\"Settings\", welcomeBack:\"Welcome back\", email:\"Email\", password:\"Password\", name:\"Name\", signInGoogle:\"Sign in with Google\", or:\"or\", haveAccount:\"Already have an account?\", noAccount:\"Don't have an account?\", createAccount:\"Create account\", score:\"Score\", bestScore:\"Best\", lives:\"Lives\", correct:\"Correct\", pause:\"PAUSE\", resume:\"Resume\", quit:\"Quit\", instructions:\"Arrows / WASD or Tap to move. Dodge obstacles. Answer questions to survive.\", gameOver:\"Game Over\", youDied:\"You were defeated\", newRecord:\"New Record!\", playAgain:\"Play Again\", backToMenu:\"Back to Menu\", language:\"Language\", theme:\"Theme color\", colorblind:\"Colorblind mode\", colorblindOff:\"Off\", colorblindDeuteranopia:\"Deuteranopia\", colorblindProtanopia:\"Protanopia\", colorblindTritanopia:\"Tritanopia\", noScores:\"No scores yet.\", correctAnswer:\"Correct!\", wrongAnswer:\"Wrong answer!\", chooseAnswer:\"Choose the correct answer\", loginToSave:\"Sign in to save your score.\" },
  es: { tagline:\"Corre. Aprende. Defiende. Inspira.\", play:\"JUGAR\", login:\"Entrar\", register:\"Registrarse\", logout:\"Salir\", leaderboard:\"Clasificación\", settings:\"Ajustes\", welcomeBack:\"Bienvenido de nuevo\", email:\"Correo\", password:\"Contraseña\", name:\"Nombre\", signInGoogle:\"Entrar con Google\", or:\"o\", haveAccount:\"¿Ya tienes cuenta?\", noAccount:\"¿No tienes cuenta?\", createAccount:\"Crear cuenta\", score:\"Puntos\", bestScore:\"Récord\", lives:\"Vidas\", correct:\"Aciertos\", pause:\"PAUSA\", resume:\"Continuar\", quit:\"Salir\", instructions:\"Flechas / WASD o Tocar para moverse. Esquiva los obstáculos. Responde preguntas para sobrevivir.\", gameOver:\"Fin del juego\", youDied:\"Has sido derrotado\", newRecord:\"¡Nuevo récord!\", playAgain:\"Jugar de nuevo\", backToMenu:\"Volver al menú\", language:\"Idioma\", theme:\"Color del tema\", colorblind:\"Modo daltónico\", colorblindOff:\"Apagado\", colorblindDeuteranopia:\"Deuteranopía\", colorblindProtanopia:\"Protanopía\", colorblindTritanopia:\"Tritanopía\", noScores:\"Aún no hay puntuaciones.\", correctAnswer:\"¡Correcto!\", wrongAnswer:\"¡Respuesta incorrecta!\", chooseAnswer:\"Elige la respuesta correcta\", loginToSave:\"Inicia sesión para guardar tu puntuación.\" }
};

/* ===== Anti-Bullying questions (PT/EN/ES) ===== */
const QUESTIONS = {
  pt: [
    {q:\"O que é bullying?\",options:[\"Uma brincadeira inofensiva\",\"Agressão repetida e intencional contra alguém\",\"Um esporte\",\"Um tipo de jogo online\"],answer:1},
    {q:\"Você presencia um colega sendo humilhado. Qual a melhor atitude?\",options:[\"Rir junto dos agressores\",\"Ignorar e ir embora\",\"Apoiar a vítima e avisar um adulto de confiança\",\"Filmar e postar nas redes\"],answer:2},
    {q:\"Cyberbullying acontece...\",options:[\"Apenas em jogos\",\"Em qualquer ambiente digital (redes, chats, jogos)\",\"Apenas em e-mails\",\"Não existe\"],answer:1},
    {q:\"Qual destas atitudes NÃO é bullying?\",options:[\"Apelidar para humilhar\",\"Excluir alguém de propósito\",\"Convidar um colega para um trabalho em grupo\",\"Espalhar boatos\"],answer:2},
    {q:\"Se você sofre bullying, o que deve fazer primeiro?\",options:[\"Reagir com violência\",\"Sofrer em silêncio\",\"Conversar com um adulto de confiança\",\"Mudar de escola sozinho\"],answer:2},
    {q:\"Empatia significa...\",options:[\"Sentir pena\",\"Se colocar no lugar do outro\",\"Ignorar sentimentos\",\"Concordar com tudo\"],answer:1},
    {q:\"O bullying pode causar...\",options:[\"Apenas tristeza passageira\",\"Ansiedade, depressão e baixa autoestima\",\"Melhora nas notas\",\"Mais amigos\"],answer:1},
    {q:\"Qual destas é uma forma de bullying?\",options:[\"Bullying físico\",\"Bullying verbal\",\"Bullying social (exclusão)\",\"Todas as anteriores\"],answer:3},
    {q:\"Ao ver alguém sofrendo bullying online, você deve...\",options:[\"Compartilhar o conteúdo\",\"Denunciar e dar suporte à vítima\",\"Comentar zombando\",\"Ignorar totalmente\"],answer:1},
    {q:\"Respeitar as diferenças é...\",options:[\"Sinal de fraqueza\",\"Sinal de maturidade e respeito\",\"Algo opcional\",\"Apenas para adultos\"],answer:1},
    {q:\"Uma palavra de gentileza pode...\",options:[\"Não fazer diferença\",\"Salvar o dia de alguém\",\"Causar bullying\",\"Atrapalhar\"],answer:1},
    {q:\"Bullying é crime no Brasil?\",options:[\"Não\",\"Sim, há leis específicas que protegem as vítimas\",\"Apenas se for físico\",\"Apenas para adultos\"],answer:1}
  ],
  en: [
    {q:\"What is bullying?\",options:[\"A harmless joke\",\"Repeated and intentional aggression\",\"A sport\",\"An online game\"],answer:1},
    {q:\"You witness a classmate being humiliated. What is the best attitude?\",options:[\"Laugh with the bullies\",\"Ignore and walk away\",\"Support the victim and tell a trusted adult\",\"Film and post on social media\"],answer:2},
    {q:\"Cyberbullying happens...\",options:[\"Only in games\",\"In any digital environment\",\"Only in emails\",\"It does not exist\"],answer:1},
    {q:\"Which is NOT bullying?\",options:[\"Nicknaming to humiliate\",\"Excluding someone on purpose\",\"Inviting a classmate to a group project\",\"Spreading rumors\"],answer:2},
    {q:\"If you suffer bullying, what should you do first?\",options:[\"React with violence\",\"Suffer in silence\",\"Talk to a trusted adult\",\"Change schools alone\"],answer:2},
    {q:\"Empathy means...\",options:[\"Feeling pity\",\"Putting yourself in someone else's shoes\",\"Ignoring feelings\",\"Agreeing with everything\"],answer:1},
    {q:\"Bullying can cause...\",options:[\"Only brief sadness\",\"Anxiety, depression and low self-esteem\",\"Better grades\",\"More friends\"],answer:1},
    {q:\"Which is a form of bullying?\",options:[\"Physical\",\"Verbal\",\"Social (exclusion)\",\"All of the above\"],answer:3},
    {q:\"When you see cyberbullying, you should...\",options:[\"Share the content\",\"Report and support the victim\",\"Mock the victim\",\"Completely ignore\"],answer:1},
    {q:\"Respecting differences is...\",options:[\"A sign of weakness\",\"A sign of maturity and respect\",\"Optional\",\"Only for adults\"],answer:1},
    {q:\"A kind word can...\",options:[\"Make no difference\",\"Save someone's day\",\"Cause bullying\",\"Get in the way\"],answer:1},
    {q:\"Is bullying a crime?\",options:[\"No\",\"Yes, many countries have specific laws\",\"Only if physical\",\"Only for adults\"],answer:1}
  ],
  es: [
    {q:\"¿Qué es el bullying?\",options:[\"Una broma inofensiva\",\"Agresión repetida e intencional\",\"Un deporte\",\"Un juego en línea\"],answer:1},
    {q:\"Presencias a un compañero humillado. ¿Cuál es la mejor actitud?\",options:[\"Reírte con los agresores\",\"Ignorar e irte\",\"Apoyar a la víctima y avisar a un adulto\",\"Grabar y publicar\"],answer:2},
    {q:\"El ciberacoso ocurre...\",options:[\"Solo en juegos\",\"En cualquier entorno digital\",\"Solo en correos\",\"No existe\"],answer:1},
    {q:\"¿Cuál NO es bullying?\",options:[\"Poner apodos para humillar\",\"Excluir a propósito\",\"Invitar a un compañero a un trabajo\",\"Difundir rumores\"],answer:2},
    {q:\"Si sufres bullying, ¿qué hacer primero?\",options:[\"Reaccionar con violencia\",\"Sufrir en silencio\",\"Hablar con un adulto de confianza\",\"Cambiar de escuela solo\"],answer:2},
    {q:\"La empatía significa...\",options:[\"Sentir lástima\",\"Ponerte en el lugar del otro\",\"Ignorar sentimientos\",\"Estar de acuerdo con todo\"],answer:1},
    {q:\"El bullying puede causar...\",options:[\"Solo tristeza pasajera\",\"Ansiedad, depresión y baja autoestima\",\"Mejores notas\",\"Más amigos\"],answer:1},
    {q:\"¿Cuál es una forma de bullying?\",options:[\"Físico\",\"Verbal\",\"Social (exclusión)\",\"Todas las anteriores\"],answer:3},
    {q:\"Al ver ciberacoso, debes...\",options:[\"Compartir el contenido\",\"Denunciar y apoyar a la víctima\",\"Comentar burlándote\",\"Ignorar\"],answer:1},
    {q:\"Respetar las diferencias es...\",options:[\"Señal de debilidad\",\"Señal de madurez y respeto\",\"Opcional\",\"Solo para adultos\"],answer:1},
    {q:\"Una palabra amable puede...\",options:[\"No hacer diferencia\",\"Salvar el día de alguien\",\"Causar bullying\",\"Estorbar\"],answer:1},
    {q:\"¿El bullying es un delito?\",options:[\"No\",\"Sí, muchas leyes específicas protegen a las víctimas\",\"Solo si es físico\",\"Solo para adultos\"],answer:1}
  ]
};

/* ===== Themes ===== */
const THEMES = {
  arcade: { primary:\"#ff5577\", accent:\"#ffd166\", track:\"#1a1230\", track2:\"#221842\", sky:\"#0a0420\" },
  forest: { primary:\"#3ddc84\", accent:\"#ffd166\", track:\"#0f2317\", track2:\"#15351f\", sky:\"#0a1810\" },
  ocean:  { primary:\"#5fd6ff\", accent:\"#ffe066\", track:\"#0a1d3a\", track2:\"#102a52\", sky:\"#04102a\" },
  sunset: { primary:\"#ff9966\", accent:\"#ffe066\", track:\"#2a0e2a\", track2:\"#3d1a3d\", sky:\"#15061a\" }
};
const CB_FILTERS = { off:\"none\", deuteranopia:\"url(#cb-deut)\", protanopia:\"url(#cb-prot)\", tritanopia:\"url(#cb-trit)\" };

/* ===== State ===== */
const state = {
  lang: localStorage.getItem(\"lang\") || \"pt\",
  theme: localStorage.getItem(\"theme\") || \"arcade\",
  colorblind: localStorage.getItem(\"colorblind\") || \"off\",
  user: null,
  token: localStorage.getItem(\"auth_token\") || null,
  best: 0
};

/* ===== Audio (Web Audio API) ===== */
let actx;
function aCtx(){ if(!actx){const C=window.AudioContext||window.webkitAudioContext; if(C) actx=new C();} if(actx&&actx.state===\"suspended\") actx.resume(); return actx; }
function tone(f,d=.1,t=\"square\",g=.08,w=0){
  const ctx=aCtx(); if(!ctx) return;
  const T=ctx.currentTime+w, o=ctx.createOscillator(), gn=ctx.createGain();
  o.type=t; o.frequency.setValueAtTime(f,T);
  gn.gain.setValueAtTime(0,T); gn.gain.linearRampToValueAtTime(g,T+.005);
  gn.gain.exponentialRampToValueAtTime(.0001,T+d);
  o.connect(gn).connect(ctx.destination); o.start(T); o.stop(T+d+.02);
}
const SFX = {
  click:()=>tone(520,.05,\"square\",.05),
  jump:()=>tone(660,.08,\"square\",.06),
  hit: ()=>{ tone(220,.18,\"sawtooth\",.12); tone(110,.25,\"sawtooth\",.08,.05); },
  correct: ()=>{ tone(660,.08,\"square\",.08); tone(880,.1,\"square\",.08,.08); tone(1320,.15,\"square\",.08,.16); },
  wrong: ()=>{ tone(330,.12,\"sawtooth\",.1); tone(220,.18,\"sawtooth\",.1,.1); },
  question: ()=>tone(880,.12,\"triangle\",.08)
};
function playVictory(){
  const notes=[[523.25,0,.18],[659.25,.18,.18],[783.99,.36,.18],[1046.5,.54,.28],[880,.86,.16],[1046.5,1.02,.16],[1318.5,1.18,.4],[1568,1.6,.45],[1318.5,2.05,.18],[1046.5,2.23,.18],[1318.5,2.41,.5]];
  notes.forEach(([f,w,d])=>tone(f,d,\"triangle\",.1,w));
  const bass=[[130.81,0,.5],[196,.55,.5],[261.63,1.1,.5],[196,1.65,.5],[261.63,2.2,.7]];
  bass.forEach(([f,w,d])=>tone(f,d,\"sine\",.12,w));
}

/* ===== UI helpers ===== */
function $(sel){ return document.querySelector(sel); }
function $$(sel){ return document.querySelectorAll(sel); }
function show(id){
  $$(\".screen\").forEach(s=>s.classList.remove(\"active\"));
  $(\"#\"+id).classList.add(\"active\");
}
function t(k){ return I18N[state.lang]?.[k] || I18N.en[k] || k; }
function applyI18n(){
  $$(\"[data-i18n]\").forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  document.documentElement.lang = state.lang;
}
function applyTheme(){
  const T = THEMES[state.theme] || THEMES.arcade;
  const r = document.documentElement.style;
  r.setProperty(\"--game-primary\", T.primary);
  r.setProperty(\"--game-accent\", T.accent);
  r.setProperty(\"--game-track\", T.track);
  r.setProperty(\"--game-track2\", T.track2);
  r.setProperty(\"--game-sky\", T.sky);
  r.setProperty(\"--cb-filter\", CB_FILTERS[state.colorblind]);
}
function toast(msg, type=\"success\"){
  const el = $(\"#toast\"); el.textContent = msg;
  el.className = \"toast show \" + type;
  setTimeout(()=>{ el.className = \"toast\"; }, 2200);
}

/* ===== API (optional backend) ===== */
async function api(path, opts={}){
  if(!API_BASE) throw new Error(\"no_backend\");
  const headers = {\"Content-Type\":\"application/json\", ...(opts.headers||{})};
  if(state.token) headers.Authorization = \"Bearer \" + state.token;
  const res = await fetch(API_BASE + path, { credentials:\"include\", ...opts, headers });
  if(!res.ok) throw new Error((await res.json().catch(()=>({}))).detail || \"Erro\");
  return res.json();
}

async function loadUser(){
  if(!API_BASE || !state.token){ updateAuthUI(); return; }
  try { state.user = await api(\"/api/auth/me\"); }
  catch { state.user = null; state.token = null; localStorage.removeItem(\"auth_token\"); }
  updateAuthUI();
}

function updateAuthUI(){
  if(state.user){
    $(\"#userBadge\").textContent = state.user.name;
    $(\"#userBadge\").classList.remove(\"hidden\");
    $$(\"[data-action='open-login'],[data-action='open-register']\").forEach(b=>b.classList.add(\"hidden\"));
    $(\"#logoutBtn\").classList.remove(\"hidden\");
    $(\"#loginPrompt\").classList.add(\"hidden\");
  } else {
    $(\"#userBadge\").classList.add(\"hidden\");
    $$(\"[data-action='open-login'],[data-action='open-register']\").forEach(b=>b.classList.remove(\"hidden\"));
    $(\"#logoutBtn\").classList.add(\"hidden\");
    $(\"#loginPrompt\").classList.remove(\"hidden\");
  }
}

/* ===== Best score / leaderboard ===== */
async function loadBest(){
  if(API_BASE && state.token){
    try { const r = await api(\"/api/scores/me\"); state.best = r.score || 0; }
    catch { state.best = 0; }
  } else {
    state.best = parseInt(localStorage.getItem(\"local_best\")||\"0\", 10);
  }
  $(\"#menuBest\").textContent = state.best;
  $(\"#hudBest\").textContent = state.best;
}
async function submitScore(score, correct, lives){
  const isNew = score > state.best;
  if(isNew){
    if(!API_BASE || !state.token) localStorage.setItem(\"local_best\", String(score));
    state.best = score;
  }
  if(API_BASE && state.token){
    try {
      const r = await api(\"/api/scores\", { method:\"POST\", body: JSON.stringify({ score, lives_left:lives, questions_correct:correct }) });
      if(r.new_record){ state.best = score; }
      return r.new_record || isNew;
    } catch {}
  }
  return isNew;
}
async function loadLeaderboard(){
  const list = $(\"#lbList\"); list.innerHTML = \"\";
  let rows = [];
  if(API_BASE){
    try { rows = await api(\"/api/scores/leaderboard\"); } catch {}
  }
  if(rows.length === 0){
    // Local fallback
    const local = parseInt(localStorage.getItem(\"local_best\")||\"0\",10);
    if(local>0) rows = [{name:\"Você\", score:local, user_id:\"local\"}];
  }
  if(rows.length === 0){
    $(\"#lbEmpty\").classList.remove(\"hidden\"); return;
  }
  $(\"#lbEmpty\").classList.add(\"hidden\");
  rows.forEach((r,i)=>{
    const icon = i===0?\"🏆\":i===1?\"🥈\":i===2?\"🥉\":(i+1);
    const li = document.createElement(\"li\");
    li.innerHTML = `<span><span class=\"rank\">${icon}</span><span class=\"name\">${r.name}</span></span><span class=\"score\">${r.score}</span>`;
    list.appendChild(li);
  });
}

/* ===== Game ===== */
const game = {
  canvas:null, ctx:null, raf:0,
  W:0, H:0, laneX:[0,0,0],
  hero: { lane:1, x:0, y:0, vy:0, jumping:false, frame:0, ft:0 },
  obstacles:[], spawnTimer:0,
  qSpawn:0, qIndex:0, questions:[],
  score:0, lives:3, correct:0,
  time:0, speed:5, stripe:0, shake:0,
  paused:false, ended:false, qOpen:false,
  cloud:0
};
function resetGame(){
  Object.assign(game, {
    obstacles:[], spawnTimer:0, qSpawn:0, qIndex:0,
    questions: shuffle(QUESTIONS[state.lang]||QUESTIONS.en).slice(0,6),
    score:0, lives:3, correct:0, time:0, speed:5,
    stripe:0, shake:0, paused:false, ended:false, qOpen:false, cloud:0,
    hero:{ lane:1, x:0, y:0, vy:0, jumping:false, frame:0, ft:0 }
  });
}
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function resizeCanvas(){
  const c = game.canvas; if(!c) return;
  const p = c.parentElement;
  const w = p.clientWidth, h = p.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  c.width = w * dpr; c.height = h * dpr;
  c.style.width = w+\"px\"; c.style.height = h+\"px\";
  game.ctx.setTransform(dpr,0,0,dpr,0,0);
  game.W = w; game.H = h;
  const spacing = w/5;
  game.laneX = [ w/2 - spacing, w/2, w/2 + spacing ];
  game.hero.y = h*0.78;
  game.hero.x = game.laneX[game.hero.lane];
}

function startGame(){
  show(\"game\");
  if(!game.canvas){
    game.canvas = $(\"#gameCanvas\");
    game.ctx = game.canvas.getContext(\"2d\");
    window.addEventListener(\"resize\", resizeCanvas);
  }
  resetGame();
  setTimeout(()=>{ resizeCanvas(); aCtx(); }, 50);
  $(\"#endOverlay\").classList.add(\"hidden\");
  $(\"#pauseOverlay\").classList.add(\"hidden\");
  $(\"#questionOverlay\").classList.add(\"hidden\");
  cancelAnimationFrame(game.raf);
  let last = performance.now();
  const loop = (now)=>{
    const dt = Math.min(40, now - last)/16.666; last = now;
    update(dt); draw();
    game.raf = requestAnimationFrame(loop);
  };
  game.raf = requestAnimationFrame(loop);
}

function update(dt){
  if(game.paused || game.ended || game.qOpen) return;
  const g = game;
  g.time += dt;
  g.speed = 5.2 + Math.min(8, g.time/80);
  g.stripe = (g.stripe + g.speed*3) % 80;
  g.cloud = (g.cloud + 0.3) % g.W;
  g.score += dt * 0.6;

  // hero
  const tx = g.laneX[g.hero.lane];
  g.hero.x += (tx - g.hero.x) * 0.25;
  if(g.hero.jumping){
    g.hero.vy += 0.7;
    g.hero.y += g.hero.vy;
    if(g.hero.y >= g.H*0.78){ g.hero.y = g.H*0.78; g.hero.jumping=false; g.hero.vy=0; }
  }
  g.hero.ft += dt;
  if(g.hero.ft > 4){ g.hero.frame = (g.hero.frame+1)%4; g.hero.ft = 0; }

  // spawn obstacles
  g.spawnTimer -= dt;
  if(g.spawnTimer <= 0){
    const lane = Math.floor(Math.random()*3);
    const type = Math.random()<.25 ? \"low\" : \"block\";
    g.obstacles.push({ lane, x:g.laneX[lane], y:g.H*0.35, type, depth:0, size:30 });
    g.spawnTimer = 35 + Math.random()*35;
  }
  for(const o of g.obstacles){
    o.depth += dt * (0.012 + g.speed*0.0008);
    const td = Math.min(1, o.depth);
    o.y = g.H*0.35 + (g.H*0.78 - g.H*0.35) * td;
    o.x = g.W/2 + (g.laneX[o.lane] - g.W/2) * (0.3 + 0.7*td);
    o.size = 30 + 70*td;
  }
  for(let i=g.obstacles.length-1; i>=0; i--){
    const o = g.obstacles[i];
    if(o.depth >= 1.05){ g.obstacles.splice(i,1); continue; }
    if(o.depth > 0.85 && o.lane === g.hero.lane && !g.hero.jumping){
      g.obstacles.splice(i,1);
      g.lives -= 1; g.shake = 12; SFX.hit();
      if(g.lives <= 0) endGame();
    }
  }
  // question
  g.qSpawn += dt;
  const first = 280, next = 600;
  const thr = g.qIndex === 0 ? first : next;
  if(g.qSpawn > thr && g.qIndex < g.questions.length){
    g.qSpawn = 0;
    openQuestion(g.questions[g.qIndex]);
  }
  // HUD update
  $(\"#hudScore\").textContent = Math.floor(g.score);
  $(\"#hudCorrect\").textContent = g.correct;
  $(\"#hudLives\").textContent = \"❤\".repeat(Math.max(0,g.lives)) + \"♡\".repeat(3-Math.max(0,g.lives));
}

function draw(){
  const g = game, ctx = g.ctx, T = THEMES[state.theme];
  if(!ctx) return;
  ctx.save();
  if(g.shake>0){ ctx.translate((Math.random()-.5)*g.shake, (Math.random()-.5)*g.shake); g.shake -= 0.5; }
  // sky
  const sky = ctx.createLinearGradient(0,0,0,g.H*0.6);
  sky.addColorStop(0, T.sky); sky.addColorStop(1, T.track);
  ctx.fillStyle = sky; ctx.fillRect(0,0,g.W,g.H);
  // stars
  ctx.fillStyle = \"rgba(255,255,255,.5)\";
  for(let i=0;i<30;i++){
    const sx = (i*73 + g.cloud*0.2) % g.W;
    const sy = (i*37) % (g.H*0.4);
    ctx.fillRect(sx, sy, 2, 2);
  }
  // mountains
  ctx.fillStyle = \"rgba(0,0,0,.35)\";
  ctx.beginPath(); ctx.moveTo(0, g.H*.55);
  for(let x=0; x<=g.W; x+=40){
    const y = g.H*.55 - Math.abs(Math.sin((x+g.cloud)*0.01))*60;
    ctx.lineTo(x,y);
  }
  ctx.lineTo(g.W, g.H*.6); ctx.lineTo(0, g.H*.6); ctx.closePath(); ctx.fill();
  // track
  ctx.fillStyle = T.track2;
  ctx.beginPath();
  ctx.moveTo(g.W*.35, g.H*.55); ctx.lineTo(g.W*.65, g.H*.55);
  ctx.lineTo(g.W*1.05, g.H); ctx.lineTo(g.W*-.05, g.H);
  ctx.closePath(); ctx.fill();
  // lanes
  ctx.strokeStyle = \"rgba(255,255,255,.5)\"; ctx.lineWidth = 2;
  for(let l=0;l<=3;l++){
    const top = g.W*.35 + (g.W*.30/3)*l;
    const bot = g.W*-.05 + (g.W*1.10/3)*l;
    if(l===0||l===3){
      ctx.beginPath(); ctx.moveTo(top, g.H*.55); ctx.lineTo(bot, g.H); ctx.stroke();
    } else {
      for(let k=0;k<14;k++){
        const tt = (k*80 - g.stripe)/1100;
        if(tt<0||tt>1) continue;
        const x1 = top + (bot-top)*tt, y1 = g.H*.55 + (g.H - g.H*.55)*tt;
        const tt2 = tt+0.025;
        const x2 = top + (bot-top)*tt2, y2 = g.H*.55 + (g.H - g.H*.55)*tt2;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      }
    }
  }
  // obstacles
  for(const o of g.obstacles){
    const sz = o.size;
    if(o.type === \"block\"){
      ctx.fillStyle = \"#e94560\"; ctx.fillRect(o.x-sz/2, o.y-sz, sz, sz);
      ctx.fillStyle = \"rgba(0,0,0,.3)\"; ctx.fillRect(o.x-sz/2, o.y-sz/6, sz, sz/6);
      ctx.strokeStyle = \"white\"; ctx.lineWidth = sz*.08;
      ctx.beginPath();
      ctx.moveTo(o.x-sz*.25, o.y-sz*.75); ctx.lineTo(o.x+sz*.25, o.y-sz*.25);
      ctx.moveTo(o.x+sz*.25, o.y-sz*.75); ctx.lineTo(o.x-sz*.25, o.y-sz*.25);
      ctx.stroke();
    } else {
      ctx.fillStyle = \"#7c2d92\";
      for(let i=0;i<3;i++){
        ctx.beginPath();
        ctx.moveTo(o.x-sz*.4+i*sz*.3, o.y);
        ctx.lineTo(o.x-sz*.25+i*sz*.3, o.y-sz*.4);
        ctx.lineTo(o.x-sz*.1+i*sz*.3, o.y);
        ctx.closePath(); ctx.fill();
      }
    }
  }
  drawHero(ctx, g.hero, T);
  ctx.restore();
}

function drawHero(ctx, h, T){
  const px = 6;
  const x = Math.round(h.x - 5*px);
  const y = Math.round(h.y - 12*px);
  const f = h.frame;
  const legA = (f===0||f===2)?0:1, legB = legA?0:1;
  const armA = f===1?-1:f===3?1:0;
  // cape
  ctx.fillStyle = T.primary;
  ctx.fillRect(x-px, y+2*px, 2*px, 6*px);
  ctx.fillRect(x-2*px, y+3*px, px, 4*px);
  // head
  ctx.fillStyle = \"#ffd9a0\"; ctx.fillRect(x+3*px, y, 4*px, 3*px);
  // helmet
  ctx.fillStyle = \"#cdd3dc\";
  ctx.fillRect(x+2*px, y-px, 6*px, 2*px);
  ctx.fillRect(x+3*px, y+px, 4*px, px);
  ctx.fillStyle = T.accent; ctx.fillRect(x+4*px, y-3*px, 2*px, 2*px);
  ctx.fillStyle = \"#102030\";
  ctx.fillRect(x+4*px, y+px, px, px); ctx.fillRect(x+6*px, y+px, px, px);
  // body
  ctx.fillStyle = \"#9aa5b8\"; ctx.fillRect(x+2*px, y+3*px, 6*px, 4*px);
  ctx.fillStyle = \"#5a3a1a\"; ctx.fillRect(x+2*px, y+7*px, 6*px, px);
  ctx.fillStyle = T.primary; ctx.fillRect(x+4*px, y+4*px, 2*px, 2*px);
  // arms
  ctx.fillStyle = \"#9aa5b8\";
  ctx.fillRect(x+px, y+3*px+armA*px, px, 3*px);
  ctx.fillRect(x+8*px, y+3*px-armA*px, px, 3*px);
  // sword
  ctx.fillStyle = \"#e8edf5\"; ctx.fillRect(x+9*px, y+px-armA*px, px, 5*px);
  ctx.fillStyle = T.accent; ctx.fillRect(x+8*px, y+5*px-armA*px, 2*px, px);
  // legs
  ctx.fillStyle = \"#3a4a6a\";
  ctx.fillRect(x+3*px, y+8*px, 2*px, 3*px+legA*px);
  ctx.fillRect(x+5*px, y+8*px, 2*px, 3*px+legB*px);
  ctx.fillStyle = \"#241a14\";
  ctx.fillRect(x+3*px, y+11*px+legA*px, 2*px, px);
  ctx.fillRect(x+5*px, y+11*px+legB*px, 2*px, px);
  // shadow
  ctx.fillStyle = \"rgba(0,0,0,.35)\";
  ctx.beginPath(); ctx.ellipse(h.x, h.y+4, 28, 6, 0, 0, Math.PI*2); ctx.fill();
}

/* ===== Question / End ===== */
function openQuestion(q){
  game.qOpen = true;
  SFX.question();
  $(\"#questionText\").textContent = q.q;
  const list = $(\"#answerList\"); list.innerHTML = \"\";
  q.options.forEach((opt, i)=>{
    const b = document.createElement(\"button\");
    b.className = \"answer-btn\";
    b.innerHTML = `<span class=\"letter\">${String.fromCharCode(65+i)}.</span>${opt}`;
    b.onclick = ()=> answerQuestion(i, q.answer);
    list.appendChild(b);
  });
  $(\"#questionOverlay\").classList.remove(\"hidden\");
}
function answerQuestion(idx, correctIdx){
  const ok = idx === correctIdx;
  if(ok){ game.correct++; game.score += 50; SFX.correct(); toast(t(\"correctAnswer\"), \"success\"); }
  else { game.lives--; SFX.wrong(); game.shake = 10; toast(t(\"wrongAnswer\"), \"error\"); }
  game.qIndex++;
  $(\"#questionOverlay\").classList.add(\"hidden\");
  game.qOpen = false;
  if(game.lives <= 0) endGame();
}

async function endGame(){
  game.ended = true;
  const finalScore = Math.floor(game.score);
  $(\"#endScore\").textContent = finalScore;
  $(\"#endCorrect\").textContent = game.correct;
  $(\"#endOverlay\").classList.remove(\"hidden\");
  const isNew = await submitScore(finalScore, game.correct, game.lives);
  if(isNew){
    $(\"#newRecordBadge\").classList.remove(\"hidden\");
    playVictory();
    $(\"#menuBest\").textContent = state.best;
    $(\"#hudBest\").textContent = state.best;
  } else {
    $(\"#newRecordBadge\").classList.add(\"hidden\");
  }
}

/* ===== Input ===== */
function move(dir){
  if(game.ended || game.qOpen || game.paused) return;
  if(dir === \"left\") game.hero.lane = Math.max(0, game.hero.lane-1);
  else if(dir === \"right\") game.hero.lane = Math.min(2, game.hero.lane+1);
  SFX.click();
}
function jump(){
  if(game.ended || game.qOpen || game.paused) return;
  if(!game.hero.jumping){ game.hero.jumping = true; game.hero.vy = -12; SFX.jump(); }
}
function togglePause(){
  if(game.ended || game.qOpen) return;
  game.paused = !game.paused;
  $(\"#pauseOverlay\").classList.toggle(\"hidden\", !game.paused);
}
window.addEventListener(\"keydown\", (e)=>{
  if(!$(\"#game\").classList.contains(\"active\")) return;
  if(e.key===\"ArrowLeft\"||e.key===\"a\"||e.key===\"A\") move(\"left\");
  else if(e.key===\"ArrowRight\"||e.key===\"d\"||e.key===\"D\") move(\"right\");
  else if(e.key===\"ArrowUp\"||e.key===\"w\"||e.key===\"W\"||e.key===\" \") jump();
  else if(e.key===\"Escape\"||e.key===\"p\"||e.key===\"P\") togglePause();
});
// touch swipe
let tsx=null, tsy=null;
document.addEventListener(\"touchstart\", e=>{ if(!game.canvas) return; const t=e.touches[0]; tsx=t.clientX; tsy=t.clientY; }, {passive:true});
document.addEventListener(\"touchend\", e=>{
  if(tsx==null || !$(\"#game\").classList.contains(\"active\")) return;
  const t=e.changedTouches[0], dx=t.clientX-tsx, dy=t.clientY-tsy;
  if(Math.abs(dx) > Math.abs(dy)){ if(dx<-25) move(\"left\"); else if(dx>25) move(\"right\"); }
  else { if(dy<-25) jump(); }
  tsx=null;
}, {passive:true});

/* ===== Settings UI ===== */
function buildThemeGrid(){
  const grid = $(\"#themeGrid\"); grid.innerHTML = \"\";
  Object.entries(THEMES).forEach(([k,T])=>{
    const b = document.createElement(\"button\");
    b.className = \"theme-swatch\" + (state.theme===k?\" active\":\"\");
    b.style.background = T.track;
    b.innerHTML = `<div class=\"colors\"><span style=\"background:${T.primary}\"></span><span style=\"background:${T.accent}\"></span></div><div class=\"name\">${k}</div>`;
    b.onclick = ()=>{
      state.theme = k; localStorage.setItem(\"theme\", k);
      applyTheme(); buildThemeGrid();
    };
    grid.appendChild(b);
  });
}

/* ===== Auth handlers ===== */
async function handleLogin(e){
  e.preventDefault();
  const email = $(\"#loginEmail\").value, password = $(\"#loginPassword\").value;
  if(!API_BASE){
    // local-only mode
    state.user = { name: email.split(\"@\")[0], email };
    localStorage.setItem(\"local_user\", JSON.stringify(state.user));
    updateAuthUI(); show(\"menu\"); toast(t(\"welcomeBack\"));
    return;
  }
  try {
    const r = await api(\"/api/auth/login\", { method:\"POST\", body: JSON.stringify({ email, password }) });
    state.token = r.token; state.user = r.user;
    localStorage.setItem(\"auth_token\", r.token);
    updateAuthUI(); await loadBest(); show(\"menu\"); toast(t(\"welcomeBack\"));
  } catch(err){ toast(err.message, \"error\"); }
}
async function handleRegister(e){
  e.preventDefault();
  const name = $(\"#regName\").value, email = $(\"#regEmail\").value, password = $(\"#regPassword\").value;
  if(!API_BASE){
    state.user = { name, email };
    localStorage.setItem(\"local_user\", JSON.stringify(state.user));
    updateAuthUI(); show(\"menu\"); toast(t(\"welcomeBack\"));
    return;
  }
  try {
    const r = await api(\"/api/auth/register\", { method:\"POST\", body: JSON.stringify({ name, email, password }) });
    state.token = r.token; state.user = r.user;
    localStorage.setItem(\"auth_token\", r.token);
    updateAuthUI(); await loadBest(); show(\"menu\"); toast(t(\"welcomeBack\"));
  } catch(err){ toast(err.message, \"error\"); }
}
async function handleLogout(){
  if(API_BASE && state.token){ try { await api(\"/api/auth/logout\", { method:\"POST\" }); } catch {} }
  state.user = null; state.token = null;
  localStorage.removeItem(\"auth_token\"); localStorage.removeItem(\"local_user\");
  updateAuthUI(); await loadBest();
}
function googleLogin(){
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS
  const redirect = window.location.origin + window.location.pathname;
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirect)}`;
}
async function processGoogleCallback(){
  if(!window.location.hash.includes(\"session_id=\")) return;
  const params = new URLSearchParams(window.location.hash.replace(/^#/,\"\"));
  const sid = params.get(\"session_id\");
  if(!sid) return;
  window.history.replaceState({}, \"\", window.location.pathname);
  if(!API_BASE){ toast(\"Backend não configurado\", \"error\"); return; }
  try {
    const r = await api(\"/api/auth/google/session\", { method:\"POST\", body: JSON.stringify({ session_id: sid }) });
    state.token = r.token; state.user = r.user;
    localStorage.setItem(\"auth_token\", r.token);
    updateAuthUI(); await loadBest(); toast(t(\"welcomeBack\"));
  } catch(err){ toast(err.message, \"error\"); }
}

/* ===== Wire up everything ===== */
document.addEventListener(\"click\", (e)=>{
  const t = e.target.closest(\"[data-action]\"); if(!t) return;
  const a = t.dataset.action;
  if(a===\"start-game\") startGame();
  else if(a===\"back-menu\"){ cancelAnimationFrame(game.raf); show(\"menu\"); loadBest(); }
  else if(a===\"restart\") startGame();
  else if(a===\"resume\") togglePause();
  else if(a===\"toggle-pause\") togglePause();
  else if(a===\"move-left\") move(\"left\");
  else if(a===\"move-right\") move(\"right\");
  else if(a===\"jump\") jump();
  else if(a===\"open-login\") show(\"login\");
  else if(a===\"open-register\") show(\"register\");
  else if(a===\"open-settings\") show(\"settings\");
  else if(a===\"open-leaderboard\"){ show(\"leaderboard\"); loadLeaderboard(); }
  else if(a===\"google-login\") googleLogin();
});
$(\"#logoutBtn\").addEventListener(\"click\", handleLogout);
$(\"#loginForm\").addEventListener(\"submit\", handleLogin);
$(\"#registerForm\").addEventListener(\"submit\", handleRegister);
$(\"#langSelect\").addEventListener(\"change\", (e)=>{ state.lang = e.target.value; localStorage.setItem(\"lang\", state.lang); applyI18n(); });
$(\"#cbSelect\").addEventListener(\"change\", (e)=>{ state.colorblind = e.target.value; localStorage.setItem(\"colorblind\", state.colorblind); applyTheme(); });

/* ===== Init ===== */
(async function init(){
  $(\"#langSelect\").value = state.lang;
  $(\"#cbSelect\").value = state.colorblind;
  applyTheme(); applyI18n(); buildThemeGrid();
  // restore local user if no backend
  if(!API_BASE){
    const u = localStorage.getItem(\"local_user\");
    if(u){ state.user = JSON.parse(u); }
    updateAuthUI();
  } else {
    await loadUser();
  }
  await processGoogleCallback();
  await loadBest();
})();
"
Observation: Create successful: /app/standalone/game.js
