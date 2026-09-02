import { playSound } from '../core/audio.js';
import { launchWorld } from '../core/router.js';
import { getCoins, getGems, setCoins, setGems, syncTreasuryFromDom } from '../core/treasury.js';
import { showToast } from './toast.js';

let activeW12 = 1;
let w1Coins = 1000;
let w1Gems = 5;
let w1Lives = 5;
let w1Moves = 10;
let w1Streak = 0;
let w1Level = 1;
let w1Progress = 0;
let w1Energy = 0;
let consecutiveMisses = 0;
let hasPlayedBefore = false;

const w1LevelsData = [
  { level: 1, target: 1, rewardCoins: 150, desc: '🎯 MATCH4 1 time' },
  { level: 2, target: 2, rewardCoins: 300, desc: '🎯 MATCH4 2 times' },
  { level: 3, target: 3, rewardCoins: 500, desc: '🎯 MATCH4 3 times' },
  { level: 4, target: 4, rewardCoins: 800, desc: '🎯 MATCH4 4 times' },
  { level: 5, target: 5, rewardCoins: 1200, desc: '🎯 MATCH4 5 times' }
];

const w2LevelsData = [
  { level: 1, target: 4, rewardCoins: 250, desc: '🌌 Complete 4 Diamonds 💎', reqSymbol: '💎' },
  { level: 2, target: 4, rewardCoins: 400, desc: '🌌 Complete 4 Stars ⭐', reqSymbol: '⭐' },
  { level: 3, target: 4, rewardCoins: 650, desc: '🌌 Complete 4 Crystals 🔮', reqSymbol: '🔮' },
  { level: 4, target: 4, rewardCoins: 1000, desc: '🌌 Complete 4 Suns ☀️', reqSymbol: '☀️' },
  { level: 5, target: 4, rewardCoins: 1800, desc: '🌌 Complete 4 Vortexes 🌀', reqSymbol: '🌀' }
];

export const symbolsPool = ['🍒', '🍋', '🍊', '🍉', '⭐', '🍀', '💎', '🍓'];
export const cosmicSymbolsPool = ['⭐', '🌟', '☀️', '🌙', '⚡', '💎', '🔮', '🌀'];

export function initWorld12(wNum) {
  activeW12 = wNum;
  consecutiveMisses = 0;
  w1Level = 1;
  w1Progress = 0;
  w1Energy = 0;

  if (!hasPlayedBefore) {
    w1Moves = 10;
  }

  document.getElementById('w1HeaderTitle').textContent = wNum === 1 ? 'WORLD 1 • DELUXE ARCADE' : 'WORLD 2 • NEON COSMOS';
  document.getElementById('w1WorldSubtitle').textContent = wNum === 1 ? 'WORLD 1 • DELUXE ARCADE' : 'WORLD 2 • NEON COSMOS';
  document.getElementById('w1EnergyWrap').style.display = wNum === 2 ? 'block' : 'none';

  const pool = wNum === 1 ? symbolsPool : cosmicSymbolsPool;
  const s1 = pool[Math.floor(Math.random() * pool.length)];
  const s2 = pool[Math.floor(Math.random() * pool.length)];
  const s3 = pool[Math.floor(Math.random() * pool.length)];
  const s4 = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById('w1-game').innerHTML = `<div class="w1-reel">${s1}</div><div class="w1-reel">${s2}</div><div class="w1-reel">${s3}</div><div class="w1-reel">${s4}</div>`;

  renderW12();
}

export function w1OpenWorlds() {
  playSound('click');
  document.getElementById('w1WorldSelectModal').style.display = 'flex';
}

export function selectWorld12(wNum) {
  playSound('click');
  document.getElementById('w1WorldSelectModal').style.display = 'none';
  if (window.launchWorld) {
    window.launchWorld(wNum);
  }
}

export function w1Play() {
  if (w1Moves <= 0) {
    playSound('click');
    document.getElementById('w1GameOverModal').style.display = 'flex';
    return;
  }

  hasPlayedBefore = true;
  playSound('spin');
  w1Moves -= 1;
  w1Coins += 50;
  w1Streak += 1;

  const pool = activeW12 === 1 ? symbolsPool : cosmicSymbolsPool;
  let s1; let s2; let s3; let s4;

  const forceMatch4 = consecutiveMisses >= 3 || Math.random() < 0.28;

  if (forceMatch4) {
    let targetSym = pool[Math.floor(Math.random() * pool.length)];
    if (activeW12 === 2) {
      const currentLevelData = w2LevelsData[w1Level - 1];
      if (Math.random() < 0.75 && currentLevelData && currentLevelData.reqSymbol) {
        targetSym = currentLevelData.reqSymbol;
      }
    }
    s1 = targetSym;
    s2 = targetSym;
    s3 = targetSym;
    s4 = targetSym;
    consecutiveMisses = 0;
  } else {
    consecutiveMisses += 1;
    s1 = pool[Math.floor(Math.random() * pool.length)];
    s2 = pool[Math.floor(Math.random() * pool.length)];
    s3 = pool[Math.floor(Math.random() * pool.length)];
    s4 = pool[Math.floor(Math.random() * pool.length)];
    if (s1 === s2 && s2 === s3 && s3 === s4) {
      s4 = pool[(pool.indexOf(s1) + 1) % pool.length];
    }
  }

  const gameBox = document.getElementById('w1-game');
  gameBox.innerHTML = `<div class="w1-reel">${s1}</div><div class="w1-reel">${s2}</div><div class="w1-reel">${s3}</div><div class="w1-reel">${s4}</div>`;

  const isMatch4 = s1 === s2 && s2 === s3 && s3 === s4;
  const currentLevelData = activeW12 === 1 ? w1LevelsData[w1Level - 1] : w2LevelsData[w1Level - 1];

  if (isMatch4) {
    playSound('win');

    let isTargetMatch = true;
    if (activeW12 === 2) {
      if (s1 === currentLevelData.reqSymbol) {
        isTargetMatch = true;
        showToast('⭐ CORRECT MISSION MATCH!');
      } else {
        isTargetMatch = false;
        showToast('🎉 Match 4! (Looking for ' + currentLevelData.reqSymbol + ')');
      }
    } else {
      showToast('🎉 MATCH 4 JACKPOT!');
    }

    if (isTargetMatch) {
      w1Coins += activeW12 === 1 ? 500 : 800;
      w1Gems += activeW12 === 2 ? 3 : 1;
      w1Progress += 1;
      if (activeW12 === 2) {
        w1Energy = Math.min(100, w1Energy + 25);
      }
    }
  } else {
    showToast('Spin complete! +50 Coins');
  }

  if (w1Progress >= currentLevelData.target) {
    playSound('worldComplete');
    w1Coins += currentLevelData.rewardCoins;
    w1Moves += 5;

    if (w1Level < 5) {
      showToast(`🎉 LEVEL ${w1Level} CLEARED! Advancing to Level ${w1Level + 1}! (+${currentLevelData.rewardCoins} Coins)`);
      w1Level += 1;
      w1Progress = 0;
    } else {
      if (activeW12 === 1) {
        showToast('🏆 WORLD 1 COMPLETED! Auto-launching World 2...');
        setTimeout(() => {
          launchWorld(2);
        }, 1500);
      } else if (activeW12 === 2) {
        showToast('🏆 WORLD 2 COMPLETED! Auto-launching World 3 (Merge Evolution)...');
        setTimeout(() => {
          launchWorld(3);
        }, 1500);
      }
    }
  }

  renderW12();

  if (w1Moves <= 0 && w1Progress < currentLevelData.target) {
    setTimeout(() => {
      document.getElementById('w1GameOverModal').style.display = 'flex';
    }, 600);
  }
}

export function w1BuyMovesCoins() {
  playSound('click');
  if (w1Coins < 500) {
    showToast('Need 💰 500 Coins to buy moves!');
    return;
  }
  w1Coins -= 500;
  w1Moves += 5;
  document.getElementById('w1GameOverModal').style.display = 'none';
  renderW12();
  showToast('💰 +5 Moves Added with Coins!');
}

export function w1BuyMoves() {
  playSound('click');
  if (w1Gems < 2) {
    showToast('Need 💎 2 to buy moves!');
    return;
  }
  w1Gems -= 2;
  w1Moves += 5;
  document.getElementById('w1GameOverModal').style.display = 'none';
  renderW12();
  showToast('⚡ +5 Moves Added with Gems!');
}

export function w1WatchAd() {
  playSound('win');
  w1Moves += 3;
  document.getElementById('w1GameOverModal').style.display = 'none';
  renderW12();
  showToast('📺 Ad Watched! +3 Moves Added!');
}

export function w1RestartLevel() {
  playSound('click');
  w1Moves = 10;
  w1Progress = 0;
  consecutiveMisses = 0;
  document.getElementById('w1GameOverModal').style.display = 'none';
  renderW12();
  showToast('🔄 Level Restarted!');
}

export function renderW12() {
  const coins = getCoins();
  const gems = getGems();
  w1Coins = coins;
  w1Gems = gems;

  document.getElementById('w1CoinsWallet').textContent = w1Coins;
  document.getElementById('w1GemsWallet').textContent = w1Gems;
  document.getElementById('w1Lives').textContent = w1Lives;
  document.getElementById('w1Moves').textContent = w1Moves;
  document.getElementById('w1Coins').textContent = w1Coins;
  document.getElementById('w1Gems').textContent = w1Gems;
  document.getElementById('w1Streak').textContent = w1Streak;
  document.getElementById('w1LevelNum').textContent = w1Level;
  document.getElementById('w1LevelIcon').textContent = activeW12 === 1 ? '🌎' : '🌌';

  const currentLevelData = activeW12 === 1 ? w1LevelsData[w1Level - 1] : w2LevelsData[w1Level - 1];
  document.getElementById('w1MissionText').textContent = `${currentLevelData.desc} (${w1Progress}/${currentLevelData.target})`;

  const pct = Math.min(100, (w1Progress / currentLevelData.target) * 100);
  document.getElementById('w1Bar').style.width = pct + '%';

  if (activeW12 === 2) {
    document.getElementById('w1EnergyBar').style.width = w1Energy + '%';
    document.getElementById('w1MissionDesc').textContent = `Cosmic Mission: Charge Energy & ${currentLevelData.desc} (${w1Progress}/${currentLevelData.target})`;
  }

  let colHtml = '';
  const items = activeW12 === 1 ? ['🍒', '🍋', '⭐', '💎', '👑'] : ['⭐', '🌟', '🔮', '💎', '👑'];
  items.forEach((sym) => {
    colHtml += `<div class="w1-card">${sym}<small>Unlocked</small></div>`;
  });
  document.getElementById('w1CollectionList').innerHTML = colHtml;

  setCoins(w1Coins);
  setGems(w1Gems);
  syncTreasuryFromDom();
}

window.symbolsPool = symbolsPool;
window.cosmicSymbolsPool = cosmicSymbolsPool;
window.w1Play = w1Play;
window.w1OpenWorlds = w1OpenWorlds;
window.selectWorld12 = selectWorld12;
window.w1BuyMovesCoins = w1BuyMovesCoins;
window.w1BuyMoves = w1BuyMoves;
window.w1WatchAd = w1WatchAd;
window.w1RestartLevel = w1RestartLevel;
window.launchWorld = window.launchWorld || function () {};
