import { playSound } from './audio.js';

export function launchWorld(worldNum) {
  playSound('welcome');
  document.querySelectorAll('.view-screen').forEach((screen) => screen.classList.remove('active'));
  if (worldNum === 1 || worldNum === 2) {
    document.getElementById('world12Screen').classList.add('active');
    if (window.initWorld12) {
      window.initWorld12(worldNum);
    }
  } else if (worldNum === 3) {
    document.getElementById('world3Screen').classList.add('active');
    if (window.initWorld3) {
      window.initWorld3();
    }
  }
  document.getElementById('coverWorld' + worldNum).classList.add('active');
}

export function closeCover(worldNum) {
  playSound('click');
  const cover = document.getElementById('coverWorld' + worldNum);
  if (cover) cover.classList.remove('active');

  if (worldNum === 1 || worldNum === 2) {
    const { symbolsPool, cosmicSymbolsPool } = window;
    const pool = worldNum === 1 ? (symbolsPool || ['🍒', '🍋', '🍊', '🍉', '⭐', '🍀', '💎', '🍓']) : (cosmicSymbolsPool || ['⭐', '🌟', '☀️', '🌙', '⚡', '💎', '🔮', '🌀']);
    const s1 = pool[Math.floor(Math.random() * pool.length)];
    const s2 = pool[Math.floor(Math.random() * pool.length)];
    const s3 = pool[Math.floor(Math.random() * pool.length)];
    const s4 = pool[Math.floor(Math.random() * pool.length)];
    const reel = document.getElementById('w1-game');
    if (reel) {
      reel.innerHTML = `<div class="w1-reel">${s1}</div><div class="w1-reel">${s2}</div><div class="w1-reel">${s3}</div><div class="w1-reel">${s4}</div>`;
    }
  }
}

export function exitToMap() {
  playSound('click');
  document.querySelectorAll('.view-screen').forEach((screen) => screen.classList.remove('active'));
  document.getElementById('worldSelectScreen').classList.add('active');
}

window.launchWorld = launchWorld;
window.closeCover = closeCover;
window.exitToMap = exitToMap;
