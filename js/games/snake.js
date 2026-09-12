class SnakeGame {
  constructor(onGameOver, onWin) {
    this.onGameOver = onGameOver;
    this.onWin = onWin;
    this.score = 0;
    this.dir = { x: 1, z: 0 };
    this.snake = [];
    this.stepTimer = 0;
    this.apple = null;
  }

  init(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.camera.position.set(0, 12, 0);
    this.camera.lookAt(0, 0, 0);

    // Initial Snake body (3 nodes)
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color: i === 0 ? 0x34d399 : 0x059669 })
      );
      mesh.position.set(-i, 0, 0);
      this.scene.add(mesh);
      this.snake.push(mesh);
    }
    this.spawnApple();

    // Bind D-Pad buttons to game logic
    document.getElementById('btnUp').onclick = () => { if (this.dir.z === 0) this.dir = { x: 0, z: -1 }; };
    document.getElementById('btnDown').onclick = () => { if (this.dir.z === 0) this.dir = { x: 0, z: 1 }; };
    document.getElementById('btnLeft').onclick = () => { if (this.dir.x === 0) this.dir = { x: -1, z: 0 }; };
    document.getElementById('btnRight').onclick = () => { if (this.dir.x === 0) this.dir = { x: 1, z: 0 }; };
  }

  spawnApple() {
    if (this.apple) this.scene.remove(this.apple);
    this.apple = new THREE.Mesh(
      new THREE.SphereGeometry(0.4),
      new THREE.MeshStandardMaterial({ color: 0xef4444 })
    );
    // Random grid position (-3 to 3)
    this.apple.position.set(Math.floor((Math.random() - 0.5) * 7), 0, Math.floor((Math.random() - 0.5) * 7));
    this.scene.add(this.apple);
  }

  update() {
    this.stepTimer++;
    // Adjust speed based on timer (lower value = faster)
    if (this.stepTimer < 14 - level) return;
    this.stepTimer = 0;

    const head = this.snake[0];
    const newX = head.position.x + this.dir.x;
    const newZ = head.position.z + this.dir.z;

    // Boundary check
    if (Math.abs(newX) > 4 || Math.abs(newZ) > 4) {
      this.onGameOver(this.score);
      return;
    }

    // Check collision with apple (dist check on discrete grid)
    if (Math.abs(newX - this.apple.position.x) < 0.5 && Math.abs(newZ - this.apple.position.z) < 0.5) {
      this.score += 10;
      Storage.addCoins(5);
      document.getElementById('hud-score').textContent = this.score;

      // Add tail segment
      const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x059669 })
      );
      this.scene.add(tail);
      this.snake.push(tail);
      this.spawnApple();

      if (this.score >= 50) this.onWin(this.score);
    }

    // Move body (move segment i to position of i-1)
    for (let i = this.snake.length - 1; i > 0; i--) {
      this.snake[i].position.copy(this.snake[i - 1].position);
    }
    // Move head to new position
    head.position.set(newX, 0, newZ);
  }
}
