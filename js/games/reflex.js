class ReflexGame {
  constructor(onGameOver, onWin) {
    this.onGameOver = onGameOver;
    this.onWin = onWin;
    this.score = 0;
    this.target = null;
  }

  init(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.camera.position.set(0, 0, 7);
    this.spawnTarget();
  }

  spawnTarget() {
    if (this.target) this.scene.remove(this.target);
    
    // Create a shiny red sphere target
    const geo = new THREE.SphereGeometry(0.5, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.1, metalness: 0.6 });
    this.target = new THREE.Mesh(geo, mat);
    // Random position within view bounds
    this.target.position.set((Math.random() - 0.5) * 4.5, (Math.random() - 0.5) * 4.5, 0);
    this.scene.add(this.target);
  }

  onClick(mouse, raycaster, camera) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(this.target);

    if (intersects.length > 0) {
      this.score += 10;
      Storage.addCoins(5);
      document.getElementById('hud-score').textContent = this.score;

      if (this.score >= 100) this.onWin(this.score);
      else this.spawnTarget();
    }
  }

  update() {}
}
