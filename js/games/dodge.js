class DodgeGame {
  constructor(onGameOver, onWin) {
    this.onGameOver = onGameOver;
    this.onWin = onWin;
    this.score = 0;
    this.obstacles = [];
    this.timer = 0;
  }

  init(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.camera.position.set(0, 6, 8);
    this.camera.lookAt(0, 0, 0);

    const geo = new THREE.SphereGeometry(0.5, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    this.player = new THREE.Mesh(geo, mat);
    this.player.position.set(0, 0.5, 2);
    this.player.castShadow = true;
    this.scene.add(this.player);
  }

  onMove(xNorm) {
    if (this.player) this.player.position.x = THREE.MathUtils.clamp(xNorm * 3, -2, 2);
  }

  update() {
    this.timer += 0.016; // Approx time increment per frame
    this.score = Math.floor(this.timer);
    document.getElementById('hud-score').textContent = this.score;

    // Spawn obstacles (Orange boxes)
    if (Math.random() < 0.04 + (level * 0.005)) {
      const obsGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const obsMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const obs = new THREE.Mesh(obsGeo, obsMat);
      obs.position.set((Math.floor(Math.random() * 3) - 1) * 1.8, 0.5, -15);
      obs.castShadow = true;
      this.scene.add(obs);
      this.obstacles.push(obs);
    }

    // Move & Check collisions
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.position.z += 0.2 + (level * 0.01);

      // Distance check
      if (this.player.position.distanceTo(obs.position) < 0.8) {
        this.onGameOver(this.score);
        return;
      }

      if (obs.position.z > 5) {
        this.scene.remove(obs);
        this.obstacles.splice(i, 1);
      }
    }

    if (this.score >= 30) this.onWin(this.score);
  }
}
