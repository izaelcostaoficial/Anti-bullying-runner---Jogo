/* =========================
   ANTI-BULLYING RUNNER
   GAME ENGINE
========================= */

class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Física
    this.gravity = 0.6;
    this.velocity = 5;
    this.jumpForce = -12;

    // Player
    this.player = { x: 50, y: 300, vy: 0, lane: 1 };

    // Game State
    this.objects = [];
    this.coins = 0;
    this.gems = 0;
    this.xp = 0;
    this.level = 1;
    this.distance = 0;

    this.running = true;

    this.loadData();
    this.loop();
  }

  /* =========================
     LOOP 60 FPS
  ========================= */
  loop() {
    if (!this.running) return;

    this.update();
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  update() {
    this.applyPhysics();
    this.distance += this.velocity;

    if (Math.random() < 0.02) this.spawnObject();

    this.checkLevel();
  }

  /* =========================
     FÍSICA
  ========================= */
  applyPhysics() {
    this.player.vy += this.gravity;
    this.player.y += this.player.vy;

    if (this.player.y > 300) {
      this.player.y = 300;
      this.player.vy = 0;
    }
  }

  jump() {
    this.player.vy = this.jumpForce;
  }

  /* =========================
     OBJETOS
  ========================= */
  spawnObject() {
    const types = ["train", "coin", "gem"];
    const type = types[Math.floor(Math.random() * types.length)];

    this.objects.push({
      type,
      x: 800,
      y: 300
    });
  }

  updateObjects() {
    this.objects.forEach(obj => {
      obj.x -= this.velocity;

      if (this.collision(obj)) {
        if (obj.type === "train") this.gameOver();
        if (obj.type === "coin") this.addCoin();
        if (obj.type === "gem") this.addGem();
      }
    });

    this.objects = this.objects.filter(o => o.x > -50);
  }

  collision(obj) {
    return (
      obj.x < this.player.x + 30 &&
      obj.x + 30 > this.player.x &&
      obj.y === this.player.y
    );
  }

  /* =========================
     XP SYSTEM
  ========================= */

  addCoin() {
    this.coins++;
    this.xp += 10;
  }

  addGem() {
    this.gems++;
    this.xp += 50;
  }

  checkLevel() {
    const newLevel = Math.floor(this.xp / 100) + 1;
    if (newLevel !== this.level && newLevel <= 50) {
      this.level = newLevel;
    }
  }

  /* =========================
     SCENARIOS EDUCATIVOS
  ========================= */

  showScenario(type) {
    this.running = false;

    const scenarios = {
      roubo: "Alguém pegou seu material sem permissão. O que você faz?",
      fofoca: "Estão espalhando rumores sobre você.",
      exclusao: "Você foi excluído de um grupo.",
      cyberbullying: "Mensagens ofensivas aparecem online.",
      agressao: "Você presencia violência física.",
      pressao: "Te pressionam a fazer algo errado."
    };

    alert(scenarios[type] || "Situação desconhecida");

    setTimeout(() => (this.running = true), 2000);
  }

  /* =========================
     GAME OVER
  ========================= */

  gameOver() {
    this.running = false;
    alert("Game Over!");
    this.saveData();
  }

  /* =========================
     RENDER
  ========================= */

  render() {
    this.ctx.clearRect(0, 0, 800, 400);

    // Player
    this.ctx.fillStyle = "#00d9ff";
    this.ctx.fillRect(this.player.x, this.player.y, 30, 30);

    this.updateObjects();
  }

  /* =========================
     LOCAL STORAGE
  ========================= */

  saveData() {
    localStorage.setItem("abRunner", JSON.stringify({
      coins: this.coins,
      gems: this.gems,
      xp: this.xp,
      level: this.level
    }));
  }

  loadData() {
    const data = JSON.parse(localStorage.getItem("abRunner"));
    if (data) {
      this.coins = data.coins;
      this.gems = data.gems;
      this.xp = data.xp;
      this.level = data.level;
    }
  }
}

/* =========================
   INIT
========================= */

const canvas = document.getElementById("game");
const game = new GameEngine(canvas);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") game.jump();
});
