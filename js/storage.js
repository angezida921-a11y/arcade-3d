const Storage = {
  getCoins: () => parseInt(localStorage.getItem('arcade_coins')) || 0,
  addCoins: (amount) => {
    const current = Storage.getCoins() + amount;
    localStorage.setItem('arcade_coins', current);
    return current;
  },
  getSkins: () => JSON.parse(localStorage.getItem('arcade_skins')) || ['red'],
  saveSkin: (skinId) => {
    const skins = Storage.getSkins();
    if (!skins.includes(skinId)) skins.push(skinId);
    localStorage.setItem('arcade_skins', JSON.stringify(skins));
  },
  getEquippedSkin: () => localStorage.getItem('arcade_equipped_skin') || 'red',
  setEquippedSkin: (skinId) => localStorage.setItem('arcade_equipped_skin', skinId),
  getLeaderboard: () => JSON.parse(localStorage.getItem('arcade_lb')) || [
    { name: "ProGamer3D", score: 250 },
    { name: "RetroWiz", score: 150 }
  ],
  addScore: (name, score) => {
    const lb = Storage.getLeaderboard();
    lb.push({ name, score });
    lb.sort((a, b) => b.score - a.score);
    localStorage.setItem('arcade_lb', JSON.stringify(lb.slice(0, 5))); // Keep top 5
  }
};
