let animationFrameCounter = 0;

function drawGameScene() {
    animationFrameCounter += gameState.speed * 0.14;

    // 1. CÉU EM DEGRADÊ
    let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.45);
    skyGradient.addColorStop(0, "#070b19");
    skyGradient.addColorStop(1, "#1b1433");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const horizonY = canvas.height * 0.45;
    const cx = canvas.width / 2;

    // 2. SOLO DA FERROVIA
    let groundGradient = ctx.createLinearGradient(0, horizonY, 0, canvas.height);
    groundGradient.addColorStop(0, "#161224");
    groundGradient.addColorStop(1, "#09060f");
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);

    // 3. TRILHOS E DORMENTES COM PERSPECTIVA REAL
    const totalZ = 600;
    ctx.fillStyle = "#3a221d";
    for (let z = 600; z > 0; z -= 35) {
        let currentZ = z - (animationFrameCounter * 12 % 35);
        if (currentZ <= 0) continue;
        let scale = 160 / (currentZ + 160);
        let y1 = horizonY + ((canvas.height - horizonY) * (totalZ - currentZ) / totalZ);
        let w1 = canvas.width * 0.95 * scale;
        ctx.fillRect(cx - w1/2, y1, w1, 4);
    }

    // Linhas de aço dos trilhos
    ctx.strokeStyle = "#7f8c8d";
    ctx.lineWidth = 4;
    for (let i = -1; i <= 1; i++) {
        let pLaneX = i * (canvas.width / 3.4);
        ctx.beginPath();
        ctx.moveTo(cx + (pLaneX * 0.05), horizonY);
        ctx.lineTo(cx + pLaneX, canvas.height);
        ctx.stroke();
    }

    // 4. OBSTÁCULOS 3D DO CENÁRIO
    gameState.entities.sort((a, b) => b.z - a.z);
    gameState.entities.forEach(ent => {
        const scale = 160 / (ent.z + 160);
        const laneW = canvas.width / 3.2;
        const screenX = cx + ((ent.lane - 1) * laneW * (ent.z / 600 + 0.2));
        const screenY = horizonY + ((canvas.height - horizonY) * (totalZ - ent.z) / totalZ);
        const size = 75 * scale;

        if (ent.type === "coin") {
            ctx.fillStyle = "#f39c12";
            ctx.beginPath();
            ctx.arc(screenX, screenY - size * 0.4, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        } else if (ent.type === "gem") {
            ctx.fillStyle = "#00ffff";
            ctx.beginPath();
            ctx.arc(screenX, screenY - size * 0.4, size * 0.25, 0, Math.PI * 2);
            ctx.fill();
        } else if (ent.type === "train") {
            // Trem Metálico Detalhado Redondo
            ctx.fillStyle = "#962d22";
            ctx.beginPath();
            ctx.roundRect(screenX - size * 0.8, screenY - size * 2.4, size * 1.6, size * 2.4, [15, 15, 0, 0]);
            ctx.fill();
            ctx.fillStyle = "#111";
            ctx.fillRect(screenX - size * 0.5, screenY - size * 2.1, size, size * 0.5);
        } else if (ent.type === "barrier") {
            ctx.fillStyle = "#d35400";
            ctx.fillRect(screenX - size * 0.8, screenY - size * 1.0, size * 1.6, size * 0.3);
            ctx.fillStyle = "#2c3e50";
            ctx.fillRect(screenX - size * 0.7, screenY - size * 0.7, size * 0.1, size * 0.7);
            ctx.fillRect(screenX + size * 0.6, screenY - size * 0.7, size * 0.1, size * 0.7);
        }
    });

    // 5. PERSONAGEM ANATOMIA HUMANA TOTALMENTE ORGÂNICA (SEM BLOCOS)
    const pScale = 160 / (100 + 160);
    const playerScreenX = cx + (gameState.playerX * pScale * 1.1);
    const playerScreenY = canvas.height - 50 - gameState.playerY;
    const charColor = GAME_DATA.shop.characters.find(c => c.id === playerState.equipped.char)?.color || "#00ffcc";

    // Cálculo das passadas humanas de corrida (ângulos naturais)
    let cycle = animationFrameCounter * 1.2;
    let leftLegAngle = Math.sin(cycle);
    let rightLegAngle = Math.cos(cycle);
    let torsoBob = Math.abs(Math.sin(cycle)) * 3;

    ctx.save();
    
    // Sombra oval realista projetada abaixo do personagem no chão
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(playerScreenX, canvas.height - 45, 20, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (gameState.invulnerable) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00ffcc";
    }

    // A. PERNAS ARREDONDADAS COM MOVIMENTO ARTICULADO ORGANICO
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1b2631"; // Cor da Calça Jeans

    // Perna Esquerda Humana (Quadril -> Joelho -> Tornozelo)
    ctx.beginPath();
    ctx.moveTo(playerScreenX - 7, playerScreenY - 30 + torsoBob);
    ctx.lineTo(playerScreenX - 12 + (leftLegAngle * 10), playerScreenY - 15);
    ctx.lineTo(playerScreenX - 10 + (leftLegAngle * 14), playerScreenY);
    ctx.stroke();

    // Perna Direita Humana
    ctx.beginPath();
    ctx.moveTo(playerScreenX + 7, playerScreenY - 30 + torsoBob);
    ctx.lineTo(playerScreenX + 12 + (rightLegAngle * 10), playerScreenY - 15);
    ctx.lineTo(playerScreenX + 10 + (rightLegAngle * 14), playerScreenY);
    ctx.stroke();

    // Tênis Esportivos Vermelhos Detalhadinhos nas pontas
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(playerScreenX - 10 + (leftLegAngle * 14), playerScreenY, 5, 0, Math.PI * 2);
    ctx.arc(playerScreenX + 10 + (rightLegAngle * 14), playerScreenY, 5, 0, Math.PI * 2);
    ctx.fill();

    // B. TRONCO / CINTURA ANATÔMICA CURVADA (Jaqueta Esportiva)
    ctx.fillStyle = charColor;
    ctx.beginPath();
    let bodyTop = playerScreenY - 65 + torsoBob;
    let bodyBottom = playerScreenY - 30 + torsoBob;
    ctx.moveTo(playerScreenX - 14, bodyTop);
    ctx.quadraticCurveTo(playerScreenX, bodyTop - 4, playerScreenX + 14, bodyTop);
    ctx.lineTo(playerScreenX + 11, bodyBottom);
    ctx.lineTo(playerScreenX - 11, bodyBottom);
    ctx.closePath();
    ctx.fill();

    // C. BRAÇOS VETORIAIS BALANÇANDO NATURALMENTE
    ctx.strokeStyle = charColor;
    ctx.lineWidth = 5;
    
    // Braço Esquerdo
    ctx.beginPath();
    ctx.moveTo(playerScreenX - 14, bodyTop + 5);
    ctx.lineTo(playerScreenX - 22 - (rightLegAngle * 5), bodyTop + 20);
    ctx.stroke();

    // Braço Direito
    ctx.beginPath();
    ctx.moveTo(playerScreenX + 14, bodyTop + 5);
    ctx.lineTo(playerScreenX + 22 + (rightLegAngle * 5), bodyTop + 20);
    ctx.stroke();

    // D. CABEÇA E CABELO REALISTA
    ctx.fillStyle = "#ffdbac"; // Pele
    ctx.beginPath();
    let headCenterY = bodyTop - 13;
    ctx.arc(playerScreenX, headCenterY, 9, 0, Math.PI * 2);
    ctx.fill();

    // Cabelo Estiloso Castanho com formato espetado orgânico
    ctx.fillStyle = "#4a2711";
    ctx.beginPath();
    ctx.arc(playerScreenX, headCenterY - 4, 9, Math.PI, 0); // Topo do Cabelo
    ctx.lineTo(playerScreenX + 11, headCenterY - 2);
    ctx.lineTo(playerScreenX - 11, headCenterY - 2);
    ctx.fill();

    // Prancha Voadora de Neon Subterrânea
    if (gameState.invulnerable) {
        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.roundRect(playerScreenX - 25, playerScreenY + 3, 50, 6, [3]);
        ctx.fill();
    }
    ctx.restore();

    // Atualiza HUD numérico
    document.getElementById("hud-coins").innerText = gameState.coinsCollected;
    document.getElementById("hud-gems").innerText = gameState.gemsCollected;
    document.getElementById("hud-score").innerText = Math.floor(gameState.score);
    document.getElementById("hud-lives").innerText = gameState.lives;
}
const item = document.createElement("div");item.style.cssText = "display:flex; justify-content:space-between; width:100%; padding:10px; border-bottom:1px solid #32254f; color:#fff;";if(entry.name === playerState.name) item.style.color = "#00ffcc";item.innerHTML = <span>#${idx + 1} ${entry.name}</span> <span>${entry.score} pts</span>;listContainer.appendChild(item);});}function setupDOMEvents() {const btnSave = document.getElementById("btn-save-name");const btnStart = document.getElementById("btn-start");const btnShop = document.getElementById("btn-shop");const btnSet = document.getElementById("btn-settings");const btnLead = document.getElementById("btn-leaderboard");const btnSb = document.getElementById("btn-shop-back");const btnStb = document.getElementById("btn-settings-back");const btnLdb = document.getElementById("btn-leaderboard-back");const btnGom = document.getElementById("btn-go-menu");const btnRtr = document.getElementById("btn-retry");const selLang = document.getElementById("select-lang");const selThm = document.getElementById("select-theme");const btnTglSnd = document.getElementById("btn-toggle-sound");if(btnSave) btnSave.onclick = () => {const nameVal = document.getElementById("player-name-input").value.trim();if(nameVal) playerState.name = nameVal;saveProgress(); updateUIStrings(); switchScreen("screen-menu");};if(btnStart) btnStart.onclick = () => startRun();if(btnShop) btnShop.onclick = () => { switchScreen("screen-shop"); renderShopItems(); };if(btnSet) btnSet.onclick = () => switchScreen("screen-settings");if(btnLead) btnLead.onclick = () => { switchScreen("screen-leaderboard"); refreshLeaderboard(); };if(btnSb) btnSb.onclick = () => switchScreen("screen-menu");if(btnStb) btnStb.onclick = () => switchScreen("screen-menu");if(btnLdb) btnLdb.onclick = () => switchScreen("screen-menu");if(btnGom) btnGom.onclick = () => switchScreen("screen-menu");if(btnRtr) btnRtr.onclick = () => startRun();if(selLang) selLang.onchange = (e) => { playerState.lang = e.target.value; saveProgress(); updateUIStrings(); };if(selThm) selThm.onchange = (e) => { playerState.theme = e.target.value; saveProgress(); };if(btnTglSnd) btnTglSnd.onclick = () => { playerState.sound = !playerState.sound; saveProgress(); updateUIStrings(); };window.addEventListener("keydown", (e) => {if (!gameState.running) return;if (e.key === "ArrowLeft" || e.key === "a") moveLane(-1);if (e.key === "ArrowRight" || e.key === "d") moveLane(1);if (e.key === "ArrowUp" || e.key === "w") triggerJump();if (e.key === "ArrowDown" || e.key === "s") triggerCrouch();if (e.key === " ") triggerSkatePower();});if (canvas) {canvas.addEventListener("touchstart", handleScreenInput, false);canvas.addEventListener("mousedown", handleScreenInput, false);}}function moveLane(dir) { gameState.currentLane = Math.max(0, Math.min(2, gameState.currentLane + dir)); }function triggerJump() { if (gameState.isGrounded) { gameState.jumpVelocity = 12; gameState.isGrounded = false; playAudioTone(300, 0.1); } }function triggerCrouch() { gameState.isCrouching = true; gameState.crouchTimer = 25; if(!gameState.isGrounded) gameState.jumpVelocity = -8; }function triggerSkatePower() { if (!gameState.invulnerable) { gameState.invulnerable = true; gameState.invulnerableTimer = 300; playAudioTone(600, 0.2); } }function handleScreenInput(e) {if (!gameState.running || !canvas) return;e.preventDefault();const rect = canvas.getBoundingClientRect();const clientX = e.touches ? e.touches[0].clientX : e.clientX;const clickX = clientX - rect.left;if (clickX < rect.width * 0.35) moveLane(-1);else if (clickX > rect.width * 0.65) moveLane(1);else { if(gameState.isGrounded) triggerJump(); else triggerCrouch(); }}function playAudioTone(freq, duration) {if (!playerState.sound) return;try {const AudioContextClass = window.AudioContext || window.webkitAudioContext;if (!AudioContextClass) return;const audioCtx = new AudioContextClass();if (audioCtx.state === 'suspended') audioCtx.resume();const osc = audioCtx.createOscillator();const gain = audioCtx.createGain();osc.connect(gain); gain.connect(audioCtx.destination);osc.frequency.value = freq; gain.gain.setValueAtTime(0.05, audioCtx.currentTime);osc.start(); osc.stop(audioCtx.currentTime + duration);} catch(e) {}}function startRun() {gameState.running = true; gameState.score = 0; gameState.coinsCollected = 0; gameState.gemsCollected = 0;gameState.speed = 6; gameState.lives = 3; gameState.entities = []; gameState.currentLane = 1;gameState.invulnerable = false; gameState.invulnerableTimer = 0;resizeCanvas(); switchScreen("game"); requestAnimationFrame(gameLoop);}function resizeCanvas() {const container = document.getElementById("game-container");if(container && canvas) { canvas.width = container.clientWidth; canvas.height = container.clientHeight; }}function updatePhysics() {if (!canvas) return;gameState.score += Math.floor(gameState.speed / 5);gameState.speed = Math.min(gameState.maxSpeed, gameState.speed + 0.002);const laneWidth = canvas.width / 3;gameState.targetX = (gameState.currentLane - 1) * laneWidth;gameState.playerX += (gameState.targetX - gameState.playerX) * 0.25;if (!gameState.isGrounded) {gameState.playerY += gameState.jumpVelocity;gameState.jumpVelocity -= 0.6;if (gameState.playerY <= 0) { gameState.playerY = 0; gameState.isGrounded = true; gameState.jumpVelocity = 0; }}if (gameState.isCrouching) { gameState.crouchTimer--; if (gameState.crouchTimer <= 0) gameState.isCrouching = false; }if (gameState.invulnerable) { gameState.invulnerableTimer--; if (gameState.invulnerableTimer <= 0) gameState.invulnerable = false; }const now = Date.now();if (now - gameState.lastSpawnTime > gameState.spawnInterval) { spawnRandomEntity(); gameState.lastSpawnTime = now; }for (let i = gameState.entities.length - 1; i >= 0; i--) {let ent = gameState.entities[i]; ent.z -= gameState.speed;if (ent.z < 120 && ent.z > 30 && ent.lane === gameState.currentLane) {if (ent.type === "coin" && gameState.playerY < 40) { gameState.coinsCollected++; playAudioTone(800, 0.05); gameState.entities.splice(i, 1); continue; }if (ent.type === "gem" && gameState.playerY < 40) { gameState.gemsCollected++; playAudioTone(950, 0.08); gameState.entities.splice(i, 1); continue; }if ((ent.type === "train" && gameState.playerY < 70) || (ent.type === "barrier" && !gameState.isCrouching && gameState.playerY < 30)) {if (gameState.invulnerable) { gameState.invulnerable = false; gameState.invulnerableTimer = 30; gameState.entities.splice(i, 1); }else { triggerQuizInterruption(); gameState.entities.splice(i, 1); }continue;}}if (ent.z < 0) gameState.entities.splice(i, 1);}}function spawnRandomEntity() {const lane = Math.floor(Math.random() * 3); const rand = Math.random();if (rand < 0.4) gameState.entities.push({ type: "coin", lane: lane, z: 600 });else if (rand < 0.65) gameState.entities.push({ type: "train", lane: lane, z: 600 });else if (rand < 0.85) gameState.entities.push({ type: "barrier", lane: lane, z: 600 });else gameState.entities.push({ type: "gem", lane: lane, z: 600 });}function drawGameScene() {if (!ctx || !canvas) return;animationFrameCounter += gameState.speed * 0.14;let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.45);skyGradient.addColorStop(0, "#070b19"); skyGradient.addColorStop(1, "#1b1433");ctx.fillStyle = skyGradient; ctx.fillRect(0, 0, canvas.width, canvas.height);const horizonY = canvas.height * 0.45; const cx = canvas.width / 2;let groundGradient = ctx.createLinearGradient(0, horizonY, 0, canvas.height);groundGradient.addColorStop(0, "#161224"); groundGradient.addColorStop(1, "#09060f");ctx.fillStyle = groundGradient; ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);const totalZ = 600; ctx.fillStyle = "#3a221d";for (let z = 600; z > 0; z -= 35) {let currentZ = z - (animationFrameCounter * 12 % 35); if (currentZ <= 0) continue;let scale = 160 / (currentZ + 160);let y1 = horizonY + ((canvas.height - horizonY) * (totalZ - currentZ) / totalZ);let w1 = canvas.width * 0.95 * scale; ctx.fillRect(cx - w1/2, y1, w1, 4);}ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 4;for (let i = -1; i <= 1; i++) {let pLaneX = i * (canvas.width / 3.4); ctx.beginPath();ctx.moveTo(cx + (pLaneX * 0.05), horizonY); ctx.lineTo(cx + pLaneX, canvas.height); ctx.stroke();}gameState.entities.sort((a, b) => b.z - a.z);gameState.entities.forEach(ent => {const scale = 160 / (ent.z + 160); const laneW = canvas.width / 3.2;const screenX = cx + ((ent.lane - 1) * laneW * (ent.z / 600 + 0.2));const screenY = horizonY + ((canvas.height - horizonY) * (totalZ - ent.z) / totalZ);const size = 75 * scale;if (ent.type === "coin") {ctx.fillStyle = "#f39c12"; ctx.beginPath(); ctx.arc(screenX, screenY - size * 0.4, size * 0.3, 0, Math.PI * 2); ctx.fill();} else if (ent.type === "gem") {ctx.fillStyle = "#00ffff"; ctx.beginPath(); ctx.arc(screenX, screenY - size * 0.4, size * 0.25, 0, Math.PI * 2); ctx.fill();} else if (ent.type === "train") {ctx.fillStyle = "#962d22"; ctx.beginPath();if (ctx.roundRect) ctx.roundRect(screenX - size * 0.8, screenY - size * 2.4, size * 1.6, size * 2.4, 6 * scale);else ctx.fillRect(screenX - size * 0.8, screenY - size * 2.4, size * 1.6, size * 2.4);ctx.fill(); ctx.fillStyle = "#111"; ctx.fillRect(screenX - size * 0.5, screenY - size * 2.1, size, size * 0.5);} else if (ent.type === "barrier") {ctx.fillStyle = "#d35400"; ctx.fillRect(screenX - size * 0.8, screenY - size * 1.0, size * 1.6, size * 0.3);ctx.fillStyle = "#2c3e50"; ctx.fillRect(screenX - size * 0.7, screenY - size * 0.7, size * 0.1, size * 0.7);ctx.fillRect(screenX + size * 0.6, screenY - size * 0.1, size * 0.7);}});const pScale = 160 / (100 + 160);const playerScreenX = cx + (gameState.playerX * pScale * 1.1);const playerScreenY = canvas.height - 50 - gameState.playerY;const charColor = GAME_DATA.shop.characters.find(c => c.id === playerState.equipped.char)?.color || "#00ffcc";let cycle = animationFrameCounter * 1.2;let leftLegAngle = Math.sin(cycle); let rightLegAngle = Math.cos(cycle); let torsoBob = Math.abs(Math.sin(cycle)) * 3;let bodyH = gameState.isCrouching ? 20 : 50;ctx.save();ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; ctx.beginPath(); ctx.ellipse(playerScreenX, canvas.height - 45, 20, 6, 0, 0, Math.PI * 2); ctx.fill();if (gameState.invulnerable) { ctx.shadowBlur = 20; ctx.shadowColor = "#00ffcc"; }ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.strokeStyle = "#1b2631";ctx.beginPath(); ctx.moveTo(playerScreenX - 7, playerScreenY - 30 + torsoBob);ctx.lineTo(playerScreenX - 12 + (leftLegAngle * 10), playerScreenY - 15);ctx.lineTo(playerScreenX - 10 + (leftLegAngle * 14), playerScreenY); ctx.stroke();ctx.beginPath(); ctx.moveTo(playerScreenX + 7, playerScreenY - 30 + torsoBob);ctx.lineTo(playerScreenX + 12 + (rightLegAngle * 10), playerScreenY - 15);ctx.lineTo(playerScreenX + 10 + (rightLegAngle * 14), playerScreenY); ctx.stroke();ctx.fillStyle = "#e74c3c"; ctx.beginPath();ctx.arc(playerScreenX - 10 + (leftLegAngle * 14), playerScreenY, 5, 0, Math.PI * 2);ctx.arc(playerScreenX + 10 + (rightLegAngle * 14), playerScreenY, 5, 0, Math.PI * 2); ctx.fill();ctx.fillStyle = charColor; ctx.beginPath(); let bodyTop = playerScreenY - 65 + torsoBob; let bodyBottom = playerScreenY - 30 + torsoBob;ctx.moveTo(playerScreenX - 14, bodyTop); ctx.quadraticCurveTo(playerScreenX, bodyTop - 4, playerScreenX + 14, bodyTop);ctx.lineTo(playerScreenX + 11, bodyBottom); ctx.lineTo(playerScreenX - 11, bodyBottom); ctx.closePath(); ctx.fill();ctx.strokeStyle = charColor; ctx.lineWidth = 5;ctx.beginPath(); ctx.moveTo(playerScreenX - 14, bodyTop + 5); ctx.lineTo(playerScreenX - 22 - (rightLegAngle * 5), bodyTop + 20); ctx.stroke();ctx.beginPath(); ctx.moveTo(playerScreenX + 14, bodyTop + 5); ctx.lineTo(playerScreenX + 22 + (rightLegAngle * 5), bodyTop + 20); ctx.stroke();ctx.fillStyle = "#ffdbac"; ctx.beginPath(); let headCenterY = bodyTop - 13; ctx.arc(playerScreenX, headCenterY, 9, 0, Math.PI * 2); ctx.fill();ctx.fillStyle = "#4a2711"; ctx.beginPath(); ctx.arc(playerScreenX, headCenterY - 4, 9, Math.PI, 0); ctx.fill();if (gameState.invulnerable) { ctx.fillStyle = "#00ffff"; ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(playerScreenX - 25, playerScreenY + 3, 50, 6, 2); else ctx.fillRect(playerScreenX - 25, playerScreenY + 3, 50, 6); ctx.fill(); }ctx.restore();const hc = document.getElementById("hud-coins");const hg = document.getElementById("hud-gems");const hs = document.getElementById("hud-score");const hl = document.getElementById("hud-lives");if(hc) hc.innerText = gameState.coinsCollected;if(hg) hg.innerText = gameState.gemsCollected;if(hs) hs.innerText = Math.floor(gameState.score);if(hl) hl.innerText = gameState.lives;}function triggerQuizInterruption() {gameState.running = false; playAudioTone(140, 0.4);const quizIndex = Math.floor(Math.random() * GAME_DATA.quiz.length);const currentQuiz = GAME_DATA.quiz[quizIndex];const qQuest = document.getElementById("quiz-question");if(qQuest) qQuest.innerText = currentQuiz.q;const optionsContainer = document.getElementById("quiz-options");if (!optionsContainer) return;optionsContainer.innerHTML = "";currentQuiz.a.forEach((opt, index) => {const btn = document.createElement("button");btn.className = "btn-quiz-option";btn.style.cssText = "width:100%; padding:14px; background:#32254f; border:1px solid #553c8b; border-radius:10px; color:white; font-size:1rem; cursor:pointer; text-align:left; margin-bottom:8px;";btn.innerText = opt;btn.onclick = () => {if (index === currentQuiz.c) {gameState.score += 1500; gameState.running = true; switchScreen("game"); requestAnimationFrame(gameLoop);} else {gameState.lives--;if (gameState.lives <= 0) { endRunGame(); }else { gameState.running = true; switchScreen("game"); requestAnimationFrame(gameLoop); }}};optionsContainer.appendChild(btn);});switchScreen("screen-quiz");}function endRunGame() {gameState.running = false; playerState.coins += gameState.coinsCollected; playerState.gems += gameState.gemsCollected;let isNewRecord = false;if (Math.floor(gameState.score) > playerState.highScore)
