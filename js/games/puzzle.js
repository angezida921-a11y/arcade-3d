class PuzzleGame {
  constructor(onGameOver, onWin) {
    this.onGameOver = onGameOver;
    this.onWin = onWin;
    this.score = 0;
    this.nodes = [];
  }

  init(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.camera.position.set(0, 8, 0);
    this.camera.lookAt(0, 0, 0);

    // Create a 3x3 grid of puzzle nodes
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        const geo = new THREE.BoxGeometry(1.2, 0.3, 1.2);
        const mat = new THREE.MeshStandardMaterial({ color: 0xec4899 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x * 1.5, 0, z * 1.5);
        mesh.userData = { active: false }; // Track state
        this.scene.add(mesh);
        this.nodes.push(mesh);
      }
    }
  }

  onClick(mouse, raycaster, camera) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(this.nodes);

    if (intersects.length > 0) {
      const node = intersects[0].object;
      node.userData.active = !node.userData.active;
      // Change color based on active state
      node.material.color.setHex(node.userData.active ? 0x34d399 : 0xec4899);

      // Check if all nodes are active (win condition)
      if (this.nodes.every(n => n.userData.active)) {
        this.score = 100;
        Storage.addCoins(10);
        this.onWin(this.score);
      }
    }
  }

  update() {}
}
