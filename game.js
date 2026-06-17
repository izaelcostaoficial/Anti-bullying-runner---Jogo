// ============================================================================
// BLOCO 3: RENDERIZAÇÃO DA LOJA (CORRIGIDA) E PLACAR DE LÍDERES
// ============================================================================

function renderShopItems() {
    const container = document.getElementById("shop-items-container");
    if (!container) return;
    container.innerHTML = "";
    
    const l = GAME_DATA.languages[playerState.lang] || GAME_DATA.languages.pt;

    // Categorias estruturadas para validação direta
    const categories = [
        { data: GAME_DATA.shop.characters, catKey: "chars", stateKey: "char" },
        { data: GAME_DATA.shop.skins, catKey: "skins", stateKey: "skin" },
        { data: GAME_DATA.shop.powerups, catKey: "powers", stateKey: null }
    ];

    categories.forEach(category => {
        category.data.forEach(item => {
            // Garante que o inventário do jogador exista antes de checar
            if (!playerState.inventory[category.catKey]) {
                playerState.inventory[category.catKey] = [item.id];
            }
            
            const isOwned = playerState.inventory[category.catKey].includes(item.id) || item.cost === 0;
            const isEquipped = category.stateKey && playerState.equipped[category.stateKey] === item.id;

            const card = document.createElement("div");
            card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;
            card.style.cssText = "background:#251a3a; border:2px solid #3a255c; border-radius:8px; padding:10px; display:flex; flex-direction:column; align-items:center; justify-content:between; min-height:130px;";
            if(isEquipped) card.style.borderColor = "#00ffcc";

            let btnText = l.buy;
            if (isOwned) btnText = isEquipped ? l.equipped : l.equip;

            card.innerHTML = `
                <div style="width:25px; height:25px; background:${item.color || '#33ffaa'}; border-radius:50%; box-shadow:0 0 8px ${item.color}"></div>
                <h4 style="color:#fff; margin:5px 0; font-size:0.9rem;">${item.name}</h4>
                <p style="color:#00ffcc; font-size:0.8rem; margin-bottom:5px;">${!isOwned ? (item.type === 'coins' ? '🪙 ' : '💎 ') + item.cost : (item.desc || '')}</p>
                <button class="shop-action-btn" style="width:100%; padding:6px; background:#00ffcc; border:none; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.8rem;">
                    ${btnText}
                </button>
            `;

            // Escuta de clique blindada contra erros de escopo
            card.querySelector(".shop-action-btn").onclick = () => {
                handleShopActionCorrected(item, category.catKey, category.stateKey, isOwned, isEquipped);
            };
            container.appendChild(card);
        });
    });
}

function handleShopActionCorrected(item, catKey, stateKey, isOwned, isEquipped) {
    if (isEquipped) return;

    if (isOwned) {
        if (stateKey) {
            playerState.equipped[stateKey] = item.id;
            saveProgress();
            renderShopItems();
        }
    } else {
        const currency = item.type; // 'coins' ou 'gems'
        if (playerState[currency] >= item.cost) {
            playerState[currency] -= item.cost;
            playerState.inventory[catKey].push(item.id);
            if (stateKey) playerState.equipped[stateKey] = item.id;
            
            saveProgress();
            renderShopItems();
            updateUIStrings();
        } else {
            alert(playerState.lang === "pt" ? "Moedas ou Gemas insuficientes!" : "Not enough coins or gems!");
        }
    }
}

function refreshLeaderboard() {
    const listContainer = document.getElementById("leaderboard-list");
    if (!listContainer) return;
    listContainer.innerHTML = "";

    let combined = globalLeaderboard.filter(entry => entry.name !== playerState.name);
    combined.push({ name: playerState.name, score: Math.floor(playerState.highScore) });
    combined.sort((a, b) => b.score - a.score);
    combined = combined.slice(0, 5);

    combined.forEach((entry, idx) => {
        const item = document.createElement("div");
        item.style.cssText = "display:flex; justify-content:space-between; width:100%; padding:12px; border-bottom:1px solid #32254f; color:#fff; font-weight:bold;";
        if(entry.name === playerState.name) item.style.color = "#00ffcc";
        item.innerHTML = `<span>#${idx + 1} ${entry.name}</span> <span>🪙 ${entry.score} pts</span>`;
        listContainer.appendChild(item);
    });
}
// ============================================================================
// BLOCO 6: CIRCUITO DE CORRIDA REALISTA, SISTEMA DE QUIZ E LOOP REAL
// ============================================================================

let animationFrameCounter = 0; // Controla o ciclo de corrida do personagem

function drawGameScene() {
    animationFrameCounter += gameState.speed * 0.15; // Ritmo baseado na velocidade

    // 1. CÉU EM DEGRADÊ REALISTA
    let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.45);
    if (playerState.theme === "dark") {
        skyGradient.addColorStop(0, "#06040a");
        skyGradient.addColorStop(1, "#150e26");
    } else {
        skyGradient.addColorStop(0, "#0b1d3a");
        skyGradient.addColorStop(1, "#2c1654");
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const horizonY = canvas.height * 0.45;
    const cx = canvas.width / 2;

    // 2. CHÃO DA FERROVIA COM GRADIENTE DE PROFUNDIDADE
    let groundGradient = ctx.createLinearGradient(0, horizonY, 0, canvas.height);
    groundGradient.addColorStop(0, "#1a1525");
    groundGradient.addColorStop(1, "#0d0a12");
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);

    // 3. DESENHO DOS TRILHOS REALISTAS COM DORMENTES DE MADEIRA EM MOVIMENTO
    const totalZ = 600;
    ctx.fillStyle = "#3e2723"; // Cor dos dormentes de madeira

    // Gera os dormentes texturizados descendo a tela com base na velocidade
    for (let z = 600; z > 0; z -= 40) {
        let currentZ = z - (animationFrameCounter * 12 % 40);
        if (currentZ <= 0) continue;

        let scale = 160 / (currentZ + 160);
        let nextScale = 160 / ((currentZ - 5) + 160);
        
        let y1 = horizonY + ((canvas.height - horizonY) * (totalZ - currentZ) / totalZ);
        let y2 = horizonY + ((canvas.height - horizonY) * (totalZ - (currentZ - 5)) / totalZ);
        
        let w1 = canvas.width * 0.95 * scale;
        let w2 = canvas.width * 0.95 * nextScale;

        // Dormentes centrais e laterais
        ctx.fillRect(cx - w1/2, y1, w1, y2 - y1);
    }

    // Linhas metálicas brilhantes dos trilhos (Três Pistas)
    ctx.strokeStyle = "#95a5a6";
    ctx.lineWidth = 4;
    for (let i = -1; i <= 1; i++) {
        let pLaneX = i * (canvas.width / 3.5);
        ctx.beginPath();
        ctx.moveTo(cx + (pLaneX * 0.05), horizonY);
        ctx.lineTo(cx + pLaneX, canvas.height);
        ctx.stroke();
    }

    // 4. RENDERIZAÇÃO DOS OBSTÁCULOS E ELEMENTOS 3D
    gameState.entities.sort((a, b) => b.z - a.z);
    gameState.entities.forEach(ent => {
        const scale = 160 / (ent.z + 160);
        const laneW = canvas.width / 3.2;
        const screenX = cx + ((ent.lane - 1) * laneW * (ent.z / 600 + 0.2));
        const screenY = horizonY + ((canvas.height - horizonY) * (totalZ - ent.z) / totalZ);
        const size = 75 * scale;

        if (ent.type === "coin") {
            // Moeda realista com relevo e brilho interno
            ctx.fillStyle = "#f1c40f";
            ctx.beginPath();
            ctx.arc(screenX, screenY - size * 0.5, size * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#f39c12";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "#fff"; // Brilho de reflexo
            ctx.fillRect(screenX - size*0.1, screenY - size*0.6, size*0.1, size*0.2);
        } else if (ent.type === "gem") {
            // Gema em formato de diamante lapidado
            ctx.fillStyle = "#00ffff";
            ctx.beginPath();
            ctx.moveTo(screenX, screenY - size * 0.8);
            ctx.lineTo(screenX + size * 0.3, screenY - size * 0.5);
            ctx.lineTo(screenX, screenY - size * 0.2);
            ctx.lineTo(screenX - size * 0.3, screenY - size * 0.5);
            ctx.closePath();
            ctx.fill();
        } else if (ent.type === "train") {
            // Trem realista com perspectiva de teto, sombras e faróis acesos
            ctx.fillStyle = "#c0392b"; // Lateral do vagão
            ctx.fillRect(screenX - size * 0.8, screenY - size * 2.5, size * 1.6, size * 2.5);
            
            ctx.fillStyle = "#962d22"; // Teto com profundidade
            ctx.fillRect(screenX - size * 0.8, screenY - size * 2.5, size * 1.6, size * 0.3);

            ctx.fillStyle = "#2c3e50"; // Janela do condutor
            ctx.fillRect(screenX - size * 0.6, screenY - size * 2.1, size * 1.2, size * 0.5);

            // Faróis acesos neons brancos de alerta
            ctx.fillStyle = "#fff";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#fff";
            ctx.beginPath();
            ctx.arc(screenX - size * 0.4, screenY - size * 0.5, size * 0.12, 0, Math.PI * 2);
            ctx.arc(screenX + size * 0.4, screenY - size * 0.5, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Desliga sombra para o resto
        } else if (ent.type === "barrier") {
            // Barreira de trânsito realista listrada
            ctx.fillStyle = "#7f8c8d"; // Postes de suporte
            ctx.fillRect(screenX - size * 0.7, screenY - size * 1.0, size * 0.15, size * 1.0);
            ctx.fillRect(screenX + size * 0.55, screenY - size * 1.0, size * 0.15, size * 1.0);
            
            ctx.fillStyle = "#f39c12"; // Corpo da placa
            ctx.fillRect(screenX - size * 0.9, screenY - size * 1.1, size * 1.8, size * 0.4);
            
            ctx.fillStyle = "#fff"; // Listras brancas de alerta
            for(let k = -0.8; k < 0.9; k += 0.4) {
                ctx.fillRect(screenX + (k * size), screenY - size * 1.1, size * 0.15, size * 0.4);
            }
        }
    });

    // 5. PERSONAGEM ANIMAÇÃO CORPORAL DE CORRIDA REALISTA
    const pScale = 160 / (100 + 160);
    const playerScreenX = cx + (gameState.playerX * pScale * 1.1);
    const playerScreenY = canvas.height - 50 - gameState.playerY;
    const charColor = GAME_DATA.shop.characters.find(c => c.id === playerState.equipped.char)?.color || "#00ffcc";

    ctx.save();
    if (gameState.invulnerable) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#00ffcc";
    }

    // Oscilação suave dos membros superiores/inferiores para simular corrida humana
    let legOffset = Math.sin(animationFrameCounter) * 12;
    let armOffset = Math.cos(animationFrameCounter) * 10;
    let headBob = Math.sin(animationFrameCounter * 2) * 2; // Balanço da cabeça

    let bodyH = gameState.isCrouching ? 20 : 50;
    
    // Pernas Animadas se movendo alternadamente
    ctx.fillStyle = "#2c3e50"; 
    ctx.fillRect(playerScreenX - 14, playerScreenY - 15, 8, 15 + (gameState.isGrounded ? legOffset : 0)); // Perna Esq
    ctx.fillRect(playerScreenX + 6, playerScreenY - 15, 8, 15 - (gameState.isGrounded ? legOffset : 0));  // Perna Dir

    // Tronco / Jaqueta do Personagem
    ctx.fillStyle = charColor;
    ctx.fillRect(playerScreenX - 16, playerScreenY - bodyH - 12, 32, bodyH);

    // Braços em Movimento Dinâmico
    ctx.fillStyle = charColor;
    ctx.fillRect(playerScreenX - 22, playerScreenY - bodyH - 10, 6, 25 + armOffset); // Braço Esq
    ctx.fillRect(playerScreenX + 16, playerScreenY - bodyH - 10, 6, 25 - armOffset); // Braço Dir

    // Cabeça com Efeito de Balanço Realista
    ctx.fillStyle = "#ffdbac";
    ctx.beginPath();
    ctx.arc(playerScreenX, playerScreenY - bodyH - 22 + headBob, 11, 0, Math.PI * 2);
    ctx.fill();

    // Boné Estiloso do Corredor (Subway Style)
    ctx.fillStyle = "#ff3366";
    ctx.fillRect(playerScreenX - 11, playerScreenY - bodyH - 33 + headBob, 22, 6); // Base do boné
    ctx.fillRect(playerScreenX, playerScreenY - bodyH - 33 + headBob, 16, 3);      // Aba para frente

    // Prancha Turbinada Ativa (Se ativo o poder da Prancha)
    if (gameState.invulnerable) {
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(playerScreenX - 24, playerScreenY, 48, 7);
        ctx.fillStyle = "#fff";
        ctx.fillRect(playerScreenX - 15, playerScreenY + 2, 30, 2); // Linha de neon centralizado
    }
    ctx.restore();

    // Sincroniza informações numéricas do HUD
    document.getElementById("hud-coins").innerText = gameState.coinsCollected;
    document.getElementById("hud-gems").innerText = gameState.gemsCollected;
    document.getElementById("hud-score").innerText = Math.floor(gameState.score);
    document.getElementById("hud-lives").innerText = gameState.lives;
}

function triggerQuizInterruption() {
    gameState.running = false;
    playAudioTone(140, 0.4);

    const quizIndex = Math.floor(Math.random() * GAME_DATA.quiz.length);
    const currentQuiz = GAME_DATA.quiz[quizIndex];

    document.getElementById("quiz-question").innerText = currentQuiz.q;
    const optionsContainer = document.getElementById("quiz-options");
    if (!optionsContainer) return;
    optionsContainer.innerHTML = "";

    currentQuiz.a.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.className = "btn-quiz-option";
        btn.style.cssText = "width:100%; padding:14px; background:#32254f; border:1px solid #553c8b; border-radius:10px; color:white; font-size:1rem; cursor:pointer; text-align:left; margin-bottom:8px;";
        btn.innerText = opt;
        
        btn.onclick = () => {
            if (index === currentQuiz.c) {
                gameState.score += 1500; // Bônus maior por acertar comportamento correto
                gameState.running = true;
                switchScreen("game");
                requestAnimationFrame(gameLoop);
            } else {
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
optionsContainer.appendChild(btn);});switchScreen("screen-quiz");}function endRunGame() {gameState.running = false;playerState.coins += gameState.coinsCollected;playerState.gems += gameState.gemsCollected;let isNewRecord = false;if (Math.floor(gameState.score) > playerState.highScore) {playerState.highScore = Math.floor(gameState.score);isNewRecord = true;}saveProgress();updateUIStrings();document.getElementById("go-score").innerText = Math.floor(gameState.score);document.getElementById("go-coins").innerText = gameState.coinsCollected;const recordBadge = document.getElementById("go-new-record");if(recordBadge) {if(isNewRecord) recordBadge.classList.remove("hidden");else recordBadge.classList.add("hidden");}switchScreen("screen-gameover");}function gameLoop() {if (!gameState.running) return;updatePhysics();drawGameScene();requestAnimationFrame(gameLoop);}window.onload = initGameSystem;
