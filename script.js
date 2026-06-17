// ============================================================================
// BLOCO 1: BANCO DE DADOS, ESTADO GLOBAL E CONFIGURAÇÕES
// ============================================================================

// Banco de dados local da Loja e Idiomas
const GAME_DATA = {
    languages: {
        pt: {
            welcome: "Olá", record: "Seu Recorde", play: "JOGAR", shop: "Loja",
            settings: "Configurações", leaderboard: "Placar Geral", langLabel: "Idioma:",
            themeLabel: "Tema de Cores:", soundLabel: "Som: LIGADO", soundOff: "Som: DESLIGADO",
            back: "Voltar", enter: "Entrar no Jogo", nameLabel: "Digite seu Nome:",
            chars: "Personagens", skins: "Vestes", powers: "Poderes", buy: "Comprar",
            equip: "Equipar", equipped: "Equipado", gameOver: "Fim de Jogo!",
            score: "Pontuação", coins: "Moedas", newRecord: "🎉 NOVO RECORDE! 🎉", retry: "Jogar Novamente"
        },
        en: {
            welcome: "Hello", record: "High Score", play: "PLAY", shop: "Shop",
            settings: "Settings", leaderboard: "Leaderboard", langLabel: "Language:",
            themeLabel: "Color Theme:", soundLabel: "Sound: ON", soundOff: "Sound: OFF",
            back: "Back", enter: "Enter Game", nameLabel: "Enter your Name:",
            chars: "Characters", skins: "Outfits", powers: "Powerups", buy: "Buy",
            equip: "Equip", equipped: "Equipped", gameOver: "Game Over!",
            score: "Score", coins: "Coins", newRecord: "🎉 NEW HIGH SCORE! 🎉", retry: "Play Again"
        }
    },
    shop: {
        characters: [
            { id: "char_base", name: "Gabriel", cost: 0, type: "coins", owned: true, color: "#00ffcc" },
            { id: "char_bia", name: "Bia", cost: 500, type: "coins", owned: false, color: "#ff3399" },
            { id: "char_alex", name: "Alex", cost: 20, type: "gems", owned: false, color: "#ffcc00" }
        ],
        skins: [
            { id: "skin_normal", name: "Casual", cost: 0, type: "coins", owned: true, color: "#ffffff" },
            { id: "skin_runner", name: "Atleta", cost: 250, type: "coins", owned: false, color: "#ff3366" },
            { id: "skin_future", name: "Cyber", cost: 10, type: "gems", owned: false, color: "#00ffff" }
        ],
        powerups: [
            { id: "pow_shield", name: "Escudo Bully-Proof", cost: 150, type: "coins", owned: true, desc: "Espaço ou Clique ativa" },
            { id: "pow_magnet", name: "Ímã de Respeito", cost: 300, type: "coins", owned: false, desc: "Atrai moedas de longe" }
        ]
    },
    quiz: [
        { q: "Se você ver alguém sofrendo cyberbullying, o que deve fazer?", a: ["Ignorar", "Excluir as redes", "Printar e denunciar"], c: 2 },
        { q: "Rir de apelidos ofensivos contra um colega é considerado:", a: ["Apenas uma brincadeira", "Conivência com bullying", "Demonstração de amizade"], c: 1 },
        { q: "Qual a melhor forma de ajudar um colega isolado na escola?", a: ["Chamar para o grupo", "Deixar ele sozinho", "Contar piadas dele"], c: 0 },
        { q: "Excluir alguém de atividades físicas de propósito é bullying?", a: ["Não, é escolha livre", "Sim, é bullying social", "Apenas se houver briga"], c: 1 }
    ]
};

// Estado do Jogador Atualizado com Salvamento Fixo
let playerState = {
    name: "Jogador",
    highScore: 0,
    coins: 1000, // Saldo inicial para testes de compra
    gems: 50,
    lang: "pt",
    theme: "vibrant",
    sound: true,
    inventory: { chars: ["char_base"], skins: ["skin_normal"], powers: ["pow_shield"] },
    equipped: { char: "char_base", skin: "skin_normal" }
};

// Banco de dados simulado de outros jogadores (Placar Online local estável)
let globalLeaderboard = [
    { name: "LucasRunner", score: 15000 },
    { name: "AntiBullyHero", score: 12000 },
    { name: "CyberDefend", score: 8500 }
];

// Estado de execução da corrida atual
let gameState = {
    running: false,
    score: 0,
    coinsCollected: 0,
    gemsCollected: 0,
    speed: 6,
    maxSpeed: 15,
    distance: 0,
    currentLane: 1, // 0: Esquerda, 1: Centro, 2: Direita
    targetX: 0,     // Posição X calculada para transição suave
    playerX: 0,     // Posição X real atual
    playerY: 0,     // Para pulos e agachamentos
    jumpVelocity: 0,
    isGrounded: true,
    isCrouching: false,
    crouchTimer: 0,
    lives: 3,
    activePowerup: null,
    powerupTimer: 0,
    invulnerable: false,
    invulnerableTimer: 0,
    entities: [],
    lastSpawnTime: 0,
    spawnInterval: 1200
};
// ============================================================================
// BLOCO 2: GESTÃO DE INTERFACES, LOJA E EVENTOS DE MENUS
// ============================================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function initGameSystem() {
    loadProgress();
    setupDOMEvents();
    renderShopItems();
    updateUIStrings();
}

function saveProgress() {
    localStorage.setItem("abr_player_state", JSON.stringify(playerState));
    localStorage.setItem("abr_leaderboard", JSON.stringify(globalLeaderboard));
}

function loadProgress() {
    const savedState = localStorage.getItem("abr_player_state");
    if (savedState) playerState = JSON.parse(savedState);
    const savedLeader = localStorage.getItem("abr_leaderboard");
    if (savedLeader) globalLeaderboard = JSON.parse(savedLeader);
}

function switchScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById("hud").classList.add("hidden");
    canvas.classList.add("hidden");

    if (screenId === "game") {
        canvas.classList.remove("hidden");
        document.getElementById("hud").classList.remove("hidden");
    } else {
        document.getElementById(screenId).classList.remove("hidden");
    }
}

function updateUIStrings() {
    const l = GAME_DATA.languages[playerState.lang];
    document.getElementById("player-display-name").innerText = playerState.name;
    document.getElementById("user-high-score").innerText = playerState.highScore;
    document.getElementById("btn-start").innerText = l.play;
    document.getElementById("btn-shop").innerText = l.shop;
    document.getElementById("btn-settings").innerText = l.settings;
    document.getElementById("btn-leaderboard").innerText = l.leaderboard;
    document.getElementById("btn-save-name").innerText = l.enter;
    document.getElementById("shop-coins").innerText = playerState.coins;
    document.getElementById("shop-gems").innerText = playerState.gems;
    document.getElementById("btn-toggle-sound").innerText = playerState.sound ? l.soundLabel : l.soundOff;
}
// ============================================================================
// BLOCO 3: RENDERIZAÇÃO DA LOJA E ATUALIZAÇÃO DO PLACAR DE LÍDERES
// ============================================================================

function renderShopItems() {
    const container = document.getElementById("shop-items-container");
    container.innerHTML = "";
    const l = GAME_DATA.languages[playerState.lang];

    // Mescla todas as categorias para renderização dinâmica
    const categories = [
        { data: GAME_DATA.shop.characters, catKey: "chars", stateKey: "char" },
        { data: GAME_DATA.shop.skins, catKey: "skins", stateKey: "skin" },
        { data: GAME_DATA.shop.powerups, catKey: "powers", stateKey: null }
    ];

    categories.forEach(category => {
        category.data.forEach(item => {
            const isOwned = playerState.inventory[category.catKey]?.includes(item.id) || item.cost === 0;
            const isEquipped = category.stateKey && playerState.equipped[category.stateKey] === item.id;

            const card = document.createElement("div");
            card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;
            card.innerHTML = `
                <div style="width:30px; height:30px; background:${item.color || '#33ffaa'}; border-radius:50%"></div>
                <h4>${item.name}</h4>
                <p>${item.cost > 0 && !isOwned ? (item.type === 'coins' ? '🪙 ' : '💎 ') + item.cost : (item.desc || '')}</p>
                <button class="btn-quiz-option" style="padding:6px; font-size:0.85rem; text-align:center;">
                    ${isEquipped ? l.equipped : (isOwned ? l.equip : l.buy)}
                </button>
            `;

            card.querySelector("button").onclick = () => handleShopAction(item, category.catKey, category.stateKey, isOwned, isEquipped);
            container.appendChild(card);
        });
    });
}

function handleShopAction(item, catKey, stateKey, isOwned, isEquipped) {
    if (isEquipped) return;
    if (isOwned) {
        if (stateKey) {
            playerState.equipped[stateKey] = item.id;
            saveProgress();
            renderShopItems();
        }
    } else {
        const currency = item.type;
        if (playerState[currency] >= item.cost) {
            playerState[currency] -= item.cost;
            playerState.inventory[catKey].push(item.id);
            if (stateKey) playerState.equipped[stateKey] = item.id;
            saveProgress();
            renderShopItems();
            updateUIStrings();
        } else {
            alert("Recursos insuficientes!");
        }
    }
}

function refreshLeaderboard() {
    const listContainer = document.getElementById("leaderboard-list");
    listContainer.innerHTML = "";

    // Mescla o recorde atual do jogador removendo duplicatas de nome antigas
    let combined = globalLeaderboard.filter(entry => entry.name !== playerState.name);
    combined.push({ name: playerState.name, score: playerState.highScore });
    combined.sort((a, b) => b.score - a.score);
    combined = combined.slice(0, 5); // Exibe apenas o Top 5 exclusivo

    combined.forEach((entry, idx) => {
        const item = document.createElement("div");
        item.style.cssText = "display:flex; justify-content:space-between; width:100%; padding:10px; border-bottom:1px solid #32254f; color:#fff;";
        if(entry.name === playerState.name) item.style.color = "#00ffcc";
        item.innerHTML = `<span>#${idx + 1} ${entry.name}</span> <span>${entry.score} pts</span>`;
        listContainer.appendChild(item);
    });
}
// ============================================================================
// BLOCO 4: CAPTURA DE INPUTS SEM DELAY (TECLADO, MOUSE, TOUCH)
// ============================================================================

function setupDOMEvents() {
    // Cliques de Navegação dos Menus
    document.getElementById("btn-save-name").onclick = () => {
        const nameVal = document.getElementById("player-name-input").value.trim();
        if(nameVal) playerState.name = nameVal;
        saveProgress();
        updateUIStrings();
        switchScreen("screen-menu");
    };
    document.getElementById("btn-start").onclick = () => startRun();
    document.getElementById("btn-shop").onclick = () => { switchScreen("screen-shop"); renderShopItems(); };
    document.getElementById("btn-settings").onclick = () => switchScreen("screen-settings");
    document.getElementById("btn-leaderboard").onclick = () => { switchScreen("screen-leaderboard"); refreshLeaderboard(); };
    
    document.getElementById("btn-shop-back").onclick = () => switchScreen("screen-menu");
    document.getElementById("btn-settings-back").onclick = () => switchScreen("screen-menu");
    document.getElementById("btn-leaderboard-back").onclick = () => switchScreen("screen-menu");
    document.getElementById("btn-go-menu").onclick = () => switchScreen("screen-menu");
    document.getElementById("btn-retry").onclick = () => startRun();

    // Configurações de Opções
    document.getElementById("select-lang").onchange = (e) => { playerState.lang = e.target.value; saveProgress(); updateUIStrings(); };
    document.getElementById("select-theme").onchange = (e) => { playerState.theme = e.target.value; saveProgress(); };
    document.getElementById("btn-toggle-sound").onclick = () => { playerState.sound = !playerState.sound; saveProgress(); updateUIStrings(); };

    // Eventos de Teclado no Jogo
    window.addEventListener("keydown", (e) => {
        if (!gameState.running) return;
        if (e.key === "ArrowLeft" || e.key === "a") moveLane(-1);
        if (e.key === "ArrowRight" || e.key === "d") moveLane(1);
        if (e.key === "ArrowUp" || e.key === "w") triggerJump();
        if (e.key === "ArrowDown" || e.key === "s") triggerCrouch();
        if (e.key === " ") triggerSkatePower();
    });

    // Eventos de Controle por Clique/Toque Direto na Tela (Split lateral)
    canvas.addEventListener("touchstart", handleScreenInput, false);
    canvas.addEventListener("mousedown", handleScreenInput, false);
}

function moveLane(dir) {
    gameState.currentLane = Math.max(0, Math.min(2, gameState.currentLane + dir));
}

function triggerJump() {
    if (gameState.isGrounded) {
        gameState.jumpVelocity = 12;
        gameState.isGrounded = false;
        playAudioTone(300, 0.1);
    }
}

function triggerCrouch() {
    gameState.isCrouching = true;
    gameState.crouchTimer = 25;
    if(!gameState.isGrounded) gameState.jumpVelocity = -8; // Queda rápida mecânica
}

function triggerSkatePower() {
    if (!gameState.invulnerable) {
        gameState.invulnerable = true;
        gameState.invulnerableTimer = 300; // 5 segundos de escudo ativo
        playAudioTone(600, 0.2);
    }
}

function handleScreenInput(e) {
    if (!gameState.running) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    
    // Divide tela em três zonas de toque para movimentação imediata
    if (clickX < rect.width * 0.35) moveLane(-1);
    else if (clickX > rect.width * 0.65) moveLane(1);
    else {
        if(gameState.isGrounded) triggerJump();
        else triggerCrouch();
    }
}

// Emulador Sintetizado de Áudio sem arquivos externos
function playAudioTone(freq, duration) {
    if (!playerState.sound) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}
// ============================================================================
// BLOCO 5: MOTOR DE FÍSICA, SPAWN DE TRILHOS, OBSTÁCULOS E COLISÕES
// ============================================================================

function startRun() {
    gameState.running = true;
    gameState.score = 0;
    gameState.coinsCollected = 0;
    gameState.speed = 6;
    gameState.lives = 3;
    gameState.entities = [];
    gameState.currentLane = 1;
    gameState.invulnerable = false;
    gameState.invulnerableTimer = 0;

    resizeCanvas();
    switchScreen("game");
    
    // Inicia Loop do Jogo Limpo
    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    const container = document.getElementById("game-container");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function updatePhysics() {
    gameState.score += Math.floor(gameState.speed / 5);
    gameState.speed = Math.min(gameState.maxSpeed, gameState.speed + 0.002);

    // Movimentação Fluida entre Pistas (Interpolação de Posição)
    const laneWidth = canvas.width / 3;
    gameState.targetX = (gameState.currentLane - 1) * laneWidth;
    gameState.playerX += (gameState.targetX - gameState.playerX) * 0.25;

    // Física de Pulo Gravitacional
    if (!gameState.isGrounded) {
        gameState.playerY += gameState.jumpVelocity;
        gameState.jumpVelocity -= 0.6; // Gravidade simulada
        if (gameState.playerY <= 0) {
            gameState.playerY = 0;
            gameState.isGrounded = true;
            gameState.jumpVelocity = 0;
        }
    }

    // Temporizador de Agachamento e Escudo Ativo
    if (gameState.isCrouching) {
        gameState.crouchTimer--;
        if (gameState.crouchTimer <= 0) gameState.isCrouching = false;
    }
    if (gameState.invulnerable) {
        gameState.invulnerableTimer--;
        if (gameState.invulnerableTimer <= 0) gameState.invulnerable = false;
    }

    // Controle de Geração de Obstáculos na Pista
    const now = Date.now();
    if (now - gameState.lastSpawnTime > gameState.spawnInterval) {
        spawnRandomEntity();
        gameState.lastSpawnTime = now;
    }

    // Processamento e Movimento de Entidades
    for (let i = gameState.entities.length - 1; i >= 0; i--) {
        let ent = gameState.entities[i];
        ent.z -= gameState.speed; // Entidade move-se em direção à câmera

        // Coleta de Moedas e Itens de Poder
        if (ent.z < 120 && ent.z > 30 && ent.lane === gameState.currentLane) {
            if (ent.type === "coin" && gameState.playerY < 40) {
                gameState.coinsCollected++;
                playAudioTone(800, 0.05);
                gameState.entities.splice(i, 1);
                continue;
            }
            if (ent.type === "gem" && gameState.playerY < 40) {
                gameState.gemsCollected++;
                playAudioTone(950, 0.08);
                gameState.entities.splice(i, 1);
                continue;
            }
            
            // Colisão com Obstáculos Prejudiciais (Trens ou Barreiras de Bullying)
            if ((ent.type === "train" && gameState.playerY < 70) || (ent.type === "barrier" && !gameState.isCrouching && gameState.playerY < 30)) {
                if (gameState.invulnerable) {
                    gameState.invulnerable = false; // Quebra a prancha protetora
                    gameState.invulnerableTimer = 30; // Pequeno frame de segurança
                    gameState.entities.splice(i, 1);
                } else {
                    triggerQuizInterruption();
                    gameState.entities.splice(i, 1);
                }
                continue;
            }
        }

        // Remove entidades fora de visão traseira
        if (ent.z < 0) gameState.entities.splice(i, 1);
    }
}

function spawnRandomEntity() {
    const lane = Math.floor(Math.random() * 3);
    const rand = Math.random();
    
    if (rand < 0.4) {
        gameState.entities.push({ type: "coin", lane: lane, z: 600 });
    } else if (rand < 0.65) {
        gameState.entities.push({ type: "train", lane: lane, z: 600 });
    } else if (rand < 0.85) {
        gameState.entities.push({ type: "barrier", lane: lane, z: 600 });
    } else {
        gameState.entities.push({ type: "gem", lane: lane, z: 600 });
    }
}
// ============================================================================
// BLOCO 6: CIRCUITO DE CORRIDA EM PERSPECTIVA, SISTEMA DE QUIZ E LOOP REAL
// ============================================================================

function drawGameScene() {
    // Desenho do Céu e do Chão Limpo
    ctx.fillStyle = playerState.theme === "dark" ? "#0c0814" : "#1a0d2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Linha do Horizonte Estilizada
    const horizonY = canvas.height * 0.45;
    ctx.fillStyle = playerState.theme === "dark" ? "#18122b" : "#2f1b4d";
    ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);

    // Renderização dos 3 Trilhos com Efeito de Perspectiva Centralizada
    ctx.strokeStyle = "#5a3d8c";
    ctx.lineWidth = 3;
    const cx = canvas.width / 2;
    
    for (let i = -1.5; i <= 1.5; i += 1) {
        ctx.beginPath();
        ctx.moveTo(cx + (i * 20), horizonY);
        ctx.lineTo(cx + (i * canvas.width * 0.45), canvas.height);
        ctx.stroke();
    }

    // Renderização Tridimensional das Entidades (Trens, Moedas e Obstáculos)
    gameState.entities.sort((a, b) => b.z - a.z); // Renderiza o fundo primeiro
    gameState.entities.forEach(ent => {
        const scale = 150 / (ent.z + 150);
        const laneW = canvas.width / 3;
        const screenX = cx + ((ent.lane - 1) * laneW * scale * 0.9);
        const screenY = horizonY + ((canvas.height - horizonY) * (600 - ent.z) / 600);
        const size = 65 * scale;

        if (ent.type === "coin") {
            ctx.fillStyle = "#ffcc00";
            ctx.beginPath();
            ctx.arc(screenX, screenY - size, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        } else if (ent.type === "gem") {
            ctx.fillStyle = "#00ffff";
            ctx.beginPath();
            ctx.arc(screenX, screenY - size, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        } else if (ent.type === "train") {
            // Vagão de Trem Detalhado Vibrante
            ctx.fillStyle = "#ff3366";
            ctx.fillRect(screenX - size * 0.7, screenY - size * 2.2, size * 1.4, size * 2.2);
            ctx.fillStyle = "#111";
            ctx.fillRect(screenX - size * 0.5, screenY - size * 1.9, size, size * 0.6); // Janela frontal
        } else if (ent.type === "barrier") {
            // Placa/Barreira com mensagens
            ctx.fillStyle = "#e67e22";
            ctx.fillRect(screenX - size * 0.8, screenY - size * 0.9, size * 1.6, size * 0.2);
            ctx.fillRect(screenX - size * 0.7, screenY - size * 0.7, size * 0.15, size * 0.7);
            ctx.fillRect(screenX + size * 0.55, screenY - size * 0.7, size * 0.15, size * 0.7);
        }
    });

    // Renderização do Personagem Principal Igual ao Jogo Solicitado
    const pScale = 150 / (100 + 150);
    const playerScreenX = cx + (gameState.playerX * pScale * 0.9);
    const playerScreenY = canvas.height - 40 - gameState.playerY;
    const charColor = GAME_DATA.shop.characters.find(c => c.id === playerState.equipped.char)?.color || "#00ffcc";

    ctx.save();
    if (gameState.invulnerable) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00ffcc";
    }

    // Desenho Corpo/Cabeça Humanóide (Sem formas geométricas simples)
    ctx.fillStyle = charColor;
    let hHeight = gameState.isCrouching ? 25 : 55;
    ctx.fillRect(playerScreenX - 18, playerScreenY - hHeight, 36, hHeight); // Corpo
    ctx.fillStyle = "#ffdbac";
    ctx.beginPath();
    ctx.arc(playerScreenX, playerScreenY - hHeight - 12, 12, 0, Math.PI * 2); // Cabeça
    ctx.fill();
    
    // Prancha Voadora Ativa (Efeito Visual)
    if (gameState.invulnerable) {
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(playerScreenX - 25, playerScreenY, 50, 6);
    }
    ctx.restore();

    // Atualização dos Números Textuais da Interface (HUD)
    document.getElementById("hud-coins").innerText = gameState.coinsCollected;
    document.getElementById("hud-gems").innerText = gameState.gemsCollected;
    document.getElementById("hud-score").innerText = Math.floor(gameState.score);
    document.getElementById("hud-lives").innerText = gameState.lives;
}

function triggerQuizInterruption() {
    gameState.running = false;
    playAudioTone(150, 0.4);

    const quizIndex = Math.floor(Math.random() * GAME_DATA.quiz.length);
    const currentQuiz = GAME_DATA.quiz[quizIndex];

    document.getElementById("quiz-question").innerText = currentQuiz.q;
    const optionsContainer = document.getElementById("quiz-options");
    optionsContainer.innerHTML = "";

    currentQuiz.a.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.className = "btn-quiz-option";
        btn.innerText = opt;
        btn.onclick = () => {
            if (index === currentQuiz.c) {
                // Acertou: ganha bônus e continua a corrida de onde parou
                gameState.score += 1000;
                gameState.running = true;
                switchScreen("game");
                requestAnimationFrame(gameLoop);
            } else {
                // Errou: perde uma vida
                gameState.lives--;
                if (gameState.lives <= 0) {
                    endRunGame();
                } else {
                    gameState.running = true;
                    switchScreen("game");
                    requestAnimationFrame(gameLoop);
                }
            }
        };
        optionsContainer.appendChild(btn);
    });

    switchScreen("screen-quiz");
}

function endRunGame() {
    gameState.running = false;
    playerState.coins += gameState.coinsCollected;
    playerState.gems += gameState.gemsCollected;

    let isNewRecord = false;
    if (Math.floor(gameState.score) > playerState.highScore) {
        playerState.highScore = Math.floor(gameState.score);
        isNewRecord = true;
    }

    saveProgress();
    updateUIStrings();

    document.getElementById("go-score").innerText = Math.floor(gameState.score);
    document.getElementById("go-coins").innerText = gameState.coinsCollected;
    
    const recordBadge = document.getElementById("go-new-record");
    if(isNewRecord) recordBadge.classList.remove("hidden");
    else recordBadge.classList.add("hidden");

    switchScreen("screen-gameover");
}

function gameLoop() {
    if (!gameState.running) return;
    updatePhysics();
    drawGameScene();
    requestAnimationFrame(gameLoop);
}

// Inicializa o sistema inteiro assim que a página terminar de carregar por completo
window.onload = initGameSystem;
