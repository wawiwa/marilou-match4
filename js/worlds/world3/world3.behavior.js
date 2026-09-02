import { getCoins, getGems, setCoins, setGems, syncTreasuryFromDom } from '../../core/treasury.js';
import { playSound } from '../../core/audio.js';
import { showToast } from '../../ui/toast.js';
import { world3BaseLevels, world3ShopItems } from './world3.config.js';

let levelW3 = 1;
let E = world3BaseLevels[0].creatures;
let N = world3BaseLevels[0].names;
let B = [];
let score = 0;
let moves = 12;
let hist = [];
let destroy = false;
let startX = 0;
let startY = 0;
let dragging = false;
let blocked = [];
let M = [];
let vault = {0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

function emptyBoard() {
  return Array.from({ length: 4 }, () => Array(4).fill(null));
}

function setLevelW3(l) {
  levelW3 = l;
  const template = world3BaseLevels[(l - 1) % world3BaseLevels.length];
  E = template.creatures;
  N = template.names;
  moves = template.moves;

  M = template.missions.map((m) => ({ t: m.t, p: 0, target: m.target }));

  B = emptyBoard();
  blocked = [];

  if (l === 2) blocked = [2, 11];
  if (l === 3) blocked = [5, 10];

  document.getElementById('levelIcon').textContent = template.icon;
  document.getElementById('levelText').textContent = `LEVEL ${l} • ${template.name}`;
  document.getElementById('challengeText').textContent = template.challenge;

  for (let i = 0; i < 4; i++) addTile();
  renderW3();
}

function addTile() {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!B[r][c] && !blocked.includes(r * 4 + c)) empty.push([r, c]);
    }
  }
  if (empty.length) {
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    B[r][c] = { t: Math.random() < 0.2 ? 1 : 0 };
  }
}

function renderMissions() {
  let html = '';
  M.forEach((m) => {
    const isDone = m.p >= m.target;
    html += `<div class="mission ${isDone ? 'done' : ''}"><div class="mi">${E[m.t] || '🎯'}</div><b>${Math.min(m.p, m.target)}/${m.target}</b><small>${isDone ? 'DONE ✓' : 'MERGE'}</small></div>`;
  });
  document.getElementById('missions').innerHTML = html;
}

export function renderW3() {
  let h = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      const x = B[r][c];
      let cls = 'cell';
      if (blocked.includes(idx)) cls += ' blocked';
      h += `<div class="${cls}" data-r="${r}" data-c="${c}">`;
      if (blocked.includes(idx)) h += '<div class="obstacle">🌊</div>';
      if (x) h += `<div class="tile t${x.t}"><div class="char">${E[x.t]}</div><div class="label">${N[x.t]}</div></div>`;
      h += '</div>';
    }
  }
  document.getElementById('board').innerHTML = h;
  document.getElementById('score').textContent = score;
  document.getElementById('moves').textContent = moves;
  document.getElementById('levelNum').textContent = levelW3;
  document.getElementById('coins').textContent = getCoins();
  document.getElementById('gems').textContent = getGems();
  renderMissions();
}

function move(d) {
  if (moves <= 0) return showToast('OUT OF MOVES!');
  const old = JSON.stringify(B);
  const nb = emptyBoard();

  for (let n = 0; n < 4; n++) {
    const line = [];
    for (let p = 0; p < 4; p++) {
      const r = d === 'up' ? p : d === 'down' ? 3 - p : n;
      const c = d === 'left' ? p : d === 'right' ? 3 - p : n;
      if (B[r][c]) line.push(B[r][c]);
    }
    let merged = [];
    for (let i = 0; i < line.length; i++) {
      if (i + 1 < line.length && line[i].t === line[i + 1].t && line[i].t < 5) {
        const nt = line[i].t + 1;
        merged.push({ t: nt });
        score += 10 * Math.pow(2, nt);
        setCoins(getCoins() + nt);
        const missionObj = M.find((m) => m.t === line[i].t);
        if (missionObj) missionObj.p += 1;
        i++;
      } else {
        merged.push(line[i]);
      }
    }
    while (merged.length < 4) merged.push(null);
    for (let p = 0; p < 4; p++) {
      const r = d === 'up' ? p : d === 'down' ? 3 - p : n;
      const c = d === 'left' ? p : d === 'right' ? 3 - p : n;
      if (!blocked.includes(r * 4 + c)) nb[r][c] = merged[p];
    }
  }

  if (JSON.stringify(nb) === old) return;
  playSound('click');
  hist.push({ B: JSON.parse(old), M: JSON.parse(JSON.stringify(M)) });
  B = nb; moves -= 1; addTile();
  renderW3();

  const allDone = M.every((m) => m.p >= m.target);
  if (allDone) {
    playSound('worldComplete');
    const rewardBonus = levelW3 * 150;
    setCoins(getCoins() + rewardBonus);
    moves += 6;

    if (levelW3 < 3) {
      showToast(`🎉 LEVEL ${levelW3} CLEARED! +${rewardBonus} Coins! Advancing to Level ${levelW3 + 1}!`);
      setTimeout(() => {
        setLevelW3(levelW3 + 1);
      }, 1200);
    } else {
      showToast('🏆 WORLD 3 COMPLETED! All Worlds Finished!');
      setTimeout(() => {
        window.exitToMap();
      }, 1500);
    }
  }
}

function undo() {
  playSound('click');
  if (!hist.length) return showToast('Nothing to undo!');
  if (getGems() < 1) return showToast('Need 💎1');
  setGems(getGems() - 1);
  const last = hist.pop();
  B = last.B;
  M = last.M;
  renderW3();
  showToast('↩ UNDO!');
}

function shuffle() {
  playSound('click');
  if (getCoins() < 5) return showToast('Need 💰5');
  setCoins(getCoins() - 5);
  const flat = B.flat().filter(Boolean).sort(() => Math.random() - 0.5);
  B = emptyBoard();
  let k = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (k < flat.length && !blocked.includes(r * 4 + c)) B[r][c] = flat[k++];
    }
  }
  renderW3();
  showToast('⤨ SHUFFLED!');
}

function destroyMode() {
  playSound('click');
  if (getCoins() < 3) return showToast('Need 💰3');
  destroy = !destroy;
  showToast(destroy ? '💥 TAP A CREATURE' : 'CANCELLED');
}

function plusCoins() {
  playSound('click');
  if (getCoins() < 100) return showToast('Need 💰100');
  setCoins(getCoins() - 100);
  moves += 5;
  renderW3();
  showToast('💰 +5 MOVES!');
}

function plus() {
  playSound('click');
  if (getGems() < 4) return showToast('Need 💎4');
  setGems(getGems() - 4);
  moves += 5;
  renderW3();
  showToast('⚡ +5 MOVES!');
}

function showSubPage(p) {
  playSound('click');
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(p + 'Screen').classList.add('active');
  if (p === 'shop') renderShop();
  if (p === 'collection') renderVault();
}

function renderShop() {
  document.getElementById('shopList').innerHTML = world3ShopItems.map((x, i) => `
    <div class="item-card"><div class="emoji">${x[0]}</div><h3>${x[1]}</h3><button onclick="buyShop(${i}, ${x[2]})">💰 ${x[2]}</button></div>
  `).join('');
}

function buyShop(i, cost) {
  playSound('click');
  if (getCoins() < cost) return showToast('Not enough 💰');
  setCoins(getCoins() - cost);
  vault[i + 1] = (vault[i + 1] || 0) + 1;
  renderShop();
  showToast('BOUGHT!');
}

function renderVault() {
  let h = '';
  for (let i = 0; i < 6; i++) {
    h += `<div class="item-card"><div class="emoji">${E[i]}</div><h3>${N[i]}</h3><p>Owned: ${vault[i] || 0}</p></div>`;
  }
  document.getElementById('discoverList').innerHTML = h;
}

export function initWorld3() {
  setLevelW3(1);
  renderW3();
  syncTreasuryFromDom();
}

const boardEl = document.getElementById('board');
if (boardEl) {
  boardEl.onclick = (e) => {
    if (!destroy) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const r = +cell.dataset.r;
    const c = +cell.dataset.c;
    if (B[r][c]) {
      B[r][c] = null;
      setCoins(getCoins() - 3);
      destroy = false;
      renderW3();
      showToast('💥 DESTROYED!');
    }
  };

  boardEl.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    dragging = true;
  });

  boardEl.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  });
}

window.undo = undo;
window.shuffle = shuffle;
window.destroyMode = destroyMode;
window.plusCoins = plusCoins;
window.plus = plus;
window.showSubPage = showSubPage;
window.buyShop = buyShop;
window.renderW3 = renderW3;
