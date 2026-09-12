class CatchGame {
  constructor(onGameOver, onWin) {
    this.onGameOver = onGameOver;
    this.onWin = onWin;
    this.score = 0;
    this.items = [];
    this.spawnRate = 0.03;
  }

  init(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(0, 0, 0);

    const geo = new THREE.BoxGeometry(1.4, 0.3, 0.8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
    this.basket = new THREE.Mesh(geo, mat);
    this.basket.position.set(0, 0.2, 2);
    this.scene.add(this.basket);
  }

  onMove(xNorm) {
    if (this.basket) this.basket.position.x = THREE.MathUtils.clamp(xNorm * 3, -2, 2);
  }

  update() {
    // Spawn falling balls (Yellow coins)
    if (Math.random() < this.spawnRate + (level * 0.01)) {
      const geo = new THREE.SphereGeometry(0.3, 16, 16);
      const mat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.6 });
      const item = new THREE.Mesh(geo, mat);
      item.position.set((Math.random() - 0.5) * 4, 6, 2);
      this.scene.add(item);
      this.items.push(item);
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.position.y -= 0.08 + (level * 0.01);

      // Check collision with basket (simple AABB)
      if (item.position.y <= 0.4 && Math.abs(item.position.x - this.basket.position.x) < 0.8) {
        this.score += 5;
        Storage.addCoins(2);
        document.getElementById('hud-score').textContent = this.score;
        this.scene.remove(item);
        this.items.splice(i, 1);
      } else if (item.position.y < -1) {
        this.scene.remove(item);
        this.items.splice(i, 1);
      }
    }

    if (this.score >= 50) this.onWin(this.score);
  }
}
