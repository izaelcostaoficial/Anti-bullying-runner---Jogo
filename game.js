function initGameSystem() {
    loadProgress();
    setupDOMEvents();
    renderShopItems();
    updateUIStrings();
    
    // Circuito profissional de Loading Simulado
    let progress = 0;
    const bar = document.getElementById("loading-bar-fill");
    const statusText = document.getElementById("loading-status");
    const stages = ["Carregando Cenários Realistas...", "Sincronizando Modelos Orgânicos...", "Validando Banco de Dados...", "Pronto!"];

    const interval = setInterval(() => {
        progress += 4;
        if(bar) bar.style.width = progress + "%";
        
        if(progress < 30) statusText.innerText = stages[0];
        else if(progress < 60) statusText.innerText = stages[1];
        else if(progress < 90) statusText.innerText = stages[2];
        else statusText.innerText = stages[3];

        if (progress >= 100) {
            clearInterval(interval);
            switchScreen("screen-login");
        }
    }, 80);
}
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
