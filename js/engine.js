class Engine3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 380 / 660, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    
    this.renderer.setSize(380, 660);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.activeGame = null;
    this.animId = null;

    this.setupLighting();
    this.bindEvents();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.dirLight.position.set(5, 10, 7);
    this.dirLight.castShadow = true;
    this.scene.add(this.ambientLight, this.dirLight);
  }

  bindEvents() {
    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (this.activeGame && this.activeGame.onClick) {
        this.activeGame.onClick(this.mouse, this.raycaster, this.camera);
      }
    });

    this.renderer.domElement.addEventListener('pointermove', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      if (this.activeGame && this.activeGame.onMove) {
        this.activeGame.onMove(xNorm);
      }
    });
  }

  clearScene() {
    while(this.scene.children.length > 0) { 
      const object = this.scene.children[0];
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
        else object.material.dispose();
      }
      this.scene.remove(object); 
    }
    this.setupLighting();
  }

  loadGame(gameInstance) {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.clearScene();
    this.activeGame = gameInstance;
    this.activeGame.init(this.scene, this.camera);
    this.loop();
  }

  loop() {
    if (this.activeGame && this.activeGame.update) {
      this.activeGame.update();
    }
    this.renderer.render(this.scene, this.camera);
    this.animId = requestAnimationFrame(() => this.loop());
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.activeGame = null;
  }
}
