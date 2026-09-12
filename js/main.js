class App {
  constructor() {
    this.engine = new Engine3D('canvas3d');
    this.bindUI();
    this.updateCoins();
    this.lastScore = 0;
  }

  updateCoins() {
    const coins = Storage.getCoins();
    document.getElementById('menu-coins').textContent = coins;
    document.getElementById('shop-coins').textContent = coins;
    document.getElementById('hud-coins').textContent = coins;
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById('canvas3d').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('dpad').style.display = 'none';
    document.getElementById('game-overlay').style.display = 'none';

    if (screenId === 'menu') {
      document.getElementById('menu').style.display = 'flex';
      this.updateCoins();
    } else if (screenId === 'shop') {
      this.renderShop();
      document.getElementById('shop-screen').style.display = 'flex';
    } else if (screenId === 'leaderboard') {
      this.renderLeaderboard();
      document.getElementById('leaderboard-screen').style.display = 'flex';
    }
  }

  launchGame(gameType) {
    this.showScreen(null);
    document.getElementById('canvas3d').style.display = 'block';
    document.getElementById('hud').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';
    document.getElementById('hud-score').textContent = '0';

    const onGameOver = (score) => this.endGame('ÉCHEC', score);
    const onWin = (score) => this.endGame('VICTOIRE !', score);

    let game;
    if (gameType === 'reflex') game = new ReflexGame(onGameOver, onWin);
    else if (gameType === 'dodge') game = new DodgeGame(onGameOver, onWin);
    else if (gameType === 'catch') game = new CatchGame(onGameOver, onWin);
    else if (gameType === 'snake') {
      document.getElementById('dpad').style.display = 'grid';
      game = new SnakeGame(onGameOver, onWin);
    }
    else if (gameType === 'car') game = new CarGame(onGameOver, onWin);
    else if (gameType === 'puzzle') game = new PuzzleGame(onGameOver, onWin);

    this.engine.loadGame(game);
  }

  endGame(title, score) {
    this.engine.stop();
    this.lastScore = score;
    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-sub').textContent = `Score final : ${score} pts`;
    document.getElementById('game-overlay').style.display = 'flex';
  }

  renderShop() {
    const list = document.getElementById('shopItems');
    list.innerHTML = '';
    const skins = [
      { id: 'red', name: 'Car: Rouge Racing', price: 0 },
      { id: 'yellow', name: 'Car: Jaune Neon', price: 100 }
    ];
    const unlocked = Storage.getSkins();
    const equipped = Storage.getEquippedSkin();

    skins.forEach(s => {
      const item = document.createElement('div');
      item.className = 'shop-item';
      const isUnlocked = unlocked.includes(s.id);
      const isEquipped = equipped === s.id;

      item.innerHTML = `
        <span>${s.name} ${s.price ? `(${s.price} 🪙)` : ''}</span>
        <button class="btn-primary" style="width:auto; padding:5px 10px; margin:0; font-size:0.75rem;">
          ${isEquipped ? 'ÉQUIPÉ' : isUnlocked ? 'ÉQUIPER' : 'ACHETER'}
        </button>
      `;

      item.querySelector('button').onclick = () => {
        if (!isUnlocked && Storage.getCoins() >= s.price) {
          Storage.addCoins(-s.price);
          Storage.saveSkin(s.id);
          Storage.setEquippedSkin(s.id);
        } else if (isUnlocked) {
          Storage.setEquippedSkin(s.id);
        }
        this.updateCoins();
        this.renderShop();
      };
      list.appendChild(item);
    });
  }

  renderLeaderboard() {
    const list = document.getElementById('lbList');
    list.innerHTML = '';
    Storage.getLeaderboard().forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'lb-item';
      li.innerHTML = `<span>#${index + 1} ${item.name}</span><strong>${item.score} pts</strong>`;
      list.appendChild(li);
    });
  }

  bindUI() {
    document.getElementById('backBtn').onclick = () => {
      this.engine.stop();
      this.showScreen('menu');
    };

    document.getElementById('overlay-btn').onclick = () => {
      const name = document.getElementById('player-name').value.trim() || 'Joueur';
      if (this.lastScore > 0) {
        Storage.addScore(name, this.lastScore);
        this.lastScore = 0; // Reset
      }
      document.getElementById('player-name').value = ''; // Clear input
      this.showScreen('menu');
    };
  }
}

const app = new App();
