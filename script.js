class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Física
    this.gravity = 0.6;
    this.jumpForce = -12;

    // Player
    this.player = { x: 50, y: 300, vy: 0 };

    // Estado
    this.objects = [];
    this.coins = 0;
    this.gems = 0;
    this.xp = 0;
    this.level = 1;
    this.distance = 0;

    this.running = true;

    this.loop();
  }

  /* LOOP ESTÁVEL (SEM TRAVAR) */
  loop() {
    if (!this.running) return;

    this.update();
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  update() {
    // Física
    this.player.vy += this.gravity;
    this.player.y += this.player.vy;

    if (this.player.y > 300) {
      this.player.y = 300;
      this.player.vy = 0;
    }

    // Spawn
    if (Math.random() < 0.02) {
      this.objects.push({
        type: Math.random() < 0.5 ? "coin" : "gem",
        x: 800,
        y: 300
      });
    }

    // Move objetos
    for (let i = 0; i < this.objects.length; i++) {
      let obj = this.objects[i];
      obj.x -= 5;

      if (this.collide(obj)) {
        if (obj.type === "coin") {
          this.coins++;
          this.xp += 10;
        }

        if (obj.type === "gem") {
          this.gems++;
          this.xp += 50;
        }

        this.objects.splice(i, 1);
        i--;
      }
    }

    // Remove fora da tela
    this.objects = this.objects.filter(o => o.x > -50);

    // Level
    this.level = Math.floor(this.xp / 100) + 1;

    this.distance += 1;

    this.updateHUD();
  }

  collide(obj) {
    return (
      obj.x < this.player.x + 30 &&
      obj.x + 30 > this.player.x &&
      obj.y === this.player.y
    );
  }

  jump() {
    if (this.player.y >= 300) {
      this.player.vy = this.jumpForce;
    }
  }

  showScenario(type) {
    this.running = false;

    const msg = {
      cyberbullying: "Você recebeu mensagens ofensivas online.",
      fofoca: "Estão espalhando rumores sobre você.",
      exclusao: "Você foi excluído de um grupo."
    };

    alert(msg[type] || "Situação educativa");

    setTimeout(() => {
      this.running = true;
      this.loop();
    }, 1200);
  }

  render() {
    this.ctx.clearRect(0, 0, 800, 400);

    // Player
    this.ctx.fillStyle = "#00d9ff";
    this.ctx.fillRect(this.player.x, this.player.y, 30, 30);

    // Objects
    for (let obj of this.objects) {
      this.ctx.fillStyle = obj.type === "coin" ? "#00ff88" : "#ff006e";
      this.ctx.fillRect(obj.x, obj.y, 25, 25);
    }
  }

  updateHUD() {
    document.getElementById("coins").innerText = this.coins;
    document.getElementById("gems").innerText = this.gems;
    document.getElementById("xp").innerText = this.xp;
    document.getElementById("level").innerText = this.level;
    document.getElementById("distance").innerText = this.distance;
  }
}

/* INIT FORÇADO (SEM ERRO DE NULL) */
window.onload = () => {
  const canvas = document.getElementById("game");
  window.game = new GameEngine(canvas);
};

document.addEventListener("keydown", e => {
  if (e.code === "Space") game.jump();
});
