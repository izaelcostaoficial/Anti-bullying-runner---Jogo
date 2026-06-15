/**
 * ANTI-BULLYING RUNNER - Motor do Jogo
 * Desenvolvido por: Izael e Felipe
 */

class GameEngine {
    constructor() {
        // Inicialização de Dados (Baseado no Sistema de Salvamento)
        this.saveData = JSON.parse(localStorage.getItem('antiBullyingData')) || {
            playerName: "Jogador",
            playerAvatar: "🏃",
            level: 1,
            xp: 0,
            coins: 1000,
            gems: 50,
            totalScore: 0,
            gamesPlayed: 0,
            language: "pt",
            theme: "dark",
            audioEnabled: true
        }; [4, 5]

        // Constantes de Física (Especificações Técnicas)
        this.gravity = 0.6; 
        this.initialVelocity = 5;
        this.jumpForce = -12; [3]
        this.fps = 60; [1, 3]
        
        // Estado do Jogo
        this.isPaused = false;
        this.currentScenario = null;
        this.player = {
            y: 0,
            velocityY: 0,
            isJumping: false,
            lane: 1 // 0: Esquerda, 1: Centro, 2: Direita [6]
        };

        // Cenários de Bullying (Documentação Detalhada)
        this.scenarios = [
            {
                icon: "🎒",
                title: "Roubo de Pertences",
                description: "Alguém está tendo seus pertences roubados. O que fazer?",
                options: [
                    { text: "Avisar um professor", correct: true },
                    { text: "Tentar resolver sozinho", correct: false },
                    { text: "Deixar acontecer", correct: false }
                ]
            }, [7, 8]
            // ... Inclui os outros 5 cenários: Fofoca, Exclusão, Cyberbullying, Agressão e Pressão [8-10]
        ];

        this.init();
    }

    init() {
        // Configuração do Canvas e Contexto [2]
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loadListeners();
    }

    update() {
        if (this.isPaused) return; [2]

        // Aplicar Gravidade e Movimento (Cálculos do Sistema de Física)
        this.player.velocityY += this.gravity;
        this.player.y += this.player.velocityY; [3]

        // Colisão com o Ground
        const groundY = this.canvas.height * 0.8;
        if (this.player.y >= groundY) {
            this.player.y = groundY;
            this.player.velocityY = 0;
            this.player.isJumping = false;
        } [3]

        this.handleCollisions();
    }

    handleCollisions() {
        // Lógica de Detecção Bounding Box [7]
        // Jogador vs Obstáculo (🚂) -> Game Over [7, 11]
        // Jogador vs Moeda (🪙) -> +10 XP e +1 moeda [4, 7]
        // Jogador vs Gema (💎) -> +50 XP e +1 gema [4, 7]
    }

    showScenario() {
        this.isPaused = true; // Pausa o motor para o dilema [2]
        // Lógica para exibir o popup com animação SlideIn [12, 13]
    }

    handleAnswer(isCorrect) {
        // Processamento de Resposta e XP (Sistema de Progressão)
        if (isCorrect) {
            this.saveData.xp += 100; // +100 XP por acerto [4, 14]
            console.log("Ótima decisão! Avisar um adulto é o caminho certo."); [15]
        } else {
            this.saveData.xp -= 50; // -50 XP por erro [4, 14]
            console.log("Isso pode piorar a situação. Procure um adulto!"); [15]
        }
        
        this.updateLevel();
        this.persistData();
        this.isPaused = false;
    }

    updateLevel() {
        // Sistema de Marcos: 100 XP por nível até o 50 [14]
        this.saveData.level = Math.floor(this.saveData.xp / 100) + 1;
        if (this.saveData.level >= 50) {
            console.log("Parabéns! Você alcançou o nível máximo e o certificado."); [14]
        }
    }

    persistData() {
        // Salvamento Automático no LocalStorage [2, 4, 16]
        localStorage.setItem('antiBullyingData', JSON.stringify(this.saveData));
    }
}

// Iniciar o jogo
const game = new GameEngine();
