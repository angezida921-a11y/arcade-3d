class CarGame {
  constructor(onGameOver, onWin) {
    this.onGameOver = onGameOver;
    this.onWin = onWin;
    this.score = 0;
    this.obstacles = [];
    this.speed = 0.4;
  }

  init(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.camera.position.set(0, 3.5, 6);
    this.camera.lookAt(0, 1, -5);

    // Road (Dark blue with grid for movement effect)
    const roadGeo = new THREE.PlaneGeometry(6, 120);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    this.road = new THREE.Mesh(roadGeo, roadMat);
    this.road.rotation.x = -Math.PI / 2;
    this.road.position.z = -50;
    this.road.receiveShadow = true;
    this.scene.add(this.road);

    // Add grid lines for speed effect
    const gridHelper = new THREE.GridHelper(120, 40, 0x38bdf8, 0x1e293b);
    gridHelper.rotation.x = -Math.PI / 2;
    gridHelper.position.set(0, 0.01, -50);
    this.scene.add(gridHelper);

    // Player Car with applied skin
    this.player = this.createCar(Storage.getEquippedSkin() === 'yellow' ? 0xfacc15 : 0xef4444);
    this.player.position.set(0, 0, 1);
    this.scene.add(this.player);
  }

  createCar(colorHex) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.4, 1.6),
      new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.4, roughness: 0.1 })
    );
    body.position.y = 0.2;
    body.castShadow = true;
    group.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.3, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x020617 })
    );
    cabin.position.set(0, 0.45, -0.1);
    group.add(cabin);
    
    return group;
  }

  onMove(xNorm) {
    if (this.player) {
      this.player.position.x = THREE.MathUtils.clamp(xNorm * 3, -1.8, 1.8);
      this.player.rotation.z = -xNorm * 0.1; // Visual lean
    }
  }

  update() {
    this.score += 0.2;
    document.getElementById('hud-score').textContent = Math.floor(this.score);

    // Spawn obstacles (Orange boxes)
    if (Math.random() < 0.03 + (level * 0.005)) {
      const obsGeo = new THREE.BoxGeometry(0.9, 0.6, 0.9);
      const obsMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
      const obs = new THREE.Mesh(obsGeo, obsMat);
      const lane = (Math.floor(Math.random() * 3) - 1) * 1.8;
      obs.position.set(lane, 0.3, -40);
      obs.castShadow = true;
      this.scene.add(obs);
      this.obstacles.push(obs);
    }

    // Move & Check collisions
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.position.z += this.speed + (level * 0.02);

      // Simple AABB distance check
      const distance = this.player.position.distanceTo(obs.position);
      if (distance < 0.9) {
        this.onGameOver(Math.floor(this.score));
        return;
      }

      if (obs.position.z > 8) {
        this.scene.remove(obs);
        this.obstacles.splice(i, 1);
      }
    }

    if (this.score >= 200) {
      this.onWin(Math.floor(this.score));
    }
  }
}
