const state = {
  coins: 1000,
  gems: 5,
};

export function getTreasury() {
  return { ...state };
}

export function getCoins() {
  return state.coins;
}

export function getGems() {
  return state.gems;
}

export function setCoins(value) {
  state.coins = value;
}

export function setGems(value) {
  state.gems = value;
}

export function addCoins(value) {
  state.coins += value;
}

export function addGems(value) {
  state.gems += value;
}

export function spendCoins(value) {
  if (state.coins < value) return false;
  state.coins -= value;
  return true;
}

export function spendGems(value) {
  if (state.gems < value) return false;
  state.gems -= value;
  return true;
}

export function syncTreasuryFromDom() {
  const coinsEl = document.getElementById('w1CoinsWallet');
  const gemsEl = document.getElementById('w1GemsWallet');
  if (coinsEl) coinsEl.textContent = state.coins;
  if (gemsEl) gemsEl.textContent = state.gems;
  const world3Coins = document.getElementById('coins');
  const world3Gems = document.getElementById('gems');
  if (world3Coins) world3Coins.textContent = state.coins;
  if (world3Gems) world3Gems.textContent = state.gems;
}
