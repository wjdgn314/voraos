// ============================================================
//  PAC-MAN GAME ENGINE
// ============================================================

// ---------- CONSTANTS ----------
const CELL = 20;
const COLS = 27;
const ROWS = 30;

// Cell types
const EMPTY  = 0;
const WALL   = 1;
const DOT    = 2;
const POWER  = 3;
const TUNNEL = 4;
const DOOR   = 5;

// Directions
const DIR = {
  UP:    { x:  0, y: -1 },
  DOWN:  { x:  0, y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x:  1, y:  0 },
  NONE:  { x:  0, y:  0 }
};

// Ghost states
const GHOST_STATE = { SCATTER: 'scatter', CHASE: 'chase', FRIGHTENED: 'frightened', EATEN: 'eaten', HOME: 'home', LEAVING: 'leaving' };

// ---------- MAZE LAYOUT ----------
// 0=empty, 1=wall, 2=dot, 3=power, 4=tunnel, 5=ghost door
const BASE_MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1],
  [1,3,1,0,1,2,1,0,0,0,1,2,1,1,1,2,1,0,0,0,1,2,1,0,1,3,1],
  [1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,2,1],
  [1,2,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,1,1,2,2,2,2,2,1,2,2,2,2,2,1,1,2,2,2,2,2,1],
  [1,1,1,1,1,2,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,2,1,1,1,1,1],
  [0,0,0,0,1,2,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,2,1,0,0,0,0],
  [0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0],
  [0,0,0,0,1,2,1,1,0,1,1,1,5,5,1,1,1,0,0,1,1,2,1,0,0,0,0],
  [1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,0,1,1,2,1,1,1,1,1],
  [4,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,2,0,0,0,0,4],
  [1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,0,1,1,2,1,1,1,1,1],
  [0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0],
  [0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,0,1,1,2,1,0,0,0,0],
  [0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0],
  [1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1],
  [1,3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1],
  [1,1,1,2,1,2,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,2,1,2,1,1,1],
  [1,1,1,2,1,2,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,2,1,2,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1],
  [1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// ---------- GAME STATE ----------
let canvas, ctx;
let maze, dots, powerPellets;
let pacman, ghosts;
let score, lives, level;
let gameState; // 'idle'|'playing'|'dying'|'nextlevel'|'gameover'|'win'
let highScore = 0;
let animFrame;
let frightTimer, frightenedDuration;
let ghostScore; // score multiplier for eating ghosts
let lastTime = 0;
let flashTimer = 0;
let mazeFadeAlpha = 1;
let dyingTimer = 0;
let overlayTimer = 0;
let touchStartX, touchStartY;

// Sound context (Web Audio API)
let audioCtx;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type, duration, volume = 0.15, startTime) {
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime || ac.currentTime);
    gain.gain.setValueAtTime(volume, startTime || ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, (startTime || ac.currentTime) + duration);
    osc.start(startTime || ac.currentTime);
    osc.stop((startTime || ac.currentTime) + duration);
  } catch(e) {}
}

function playDotSound() {
  try {
    const ac = getAudioCtx();
    const t = ac.currentTime;
    playTone(440, 'square', 0.05, 0.05, t);
    playTone(880, 'square', 0.05, 0.03, t + 0.05);
  } catch(e) {}
}

function playPowerSound() {
  try {
    const ac = getAudioCtx();
    const t = ac.currentTime;
    for (let i = 0; i < 6; i++) {
      playTone(200 + i * 60, 'sawtooth', 0.1, 0.2, t + i * 0.08);
    }
  } catch(e) {}
}

function playEatGhostSound() {
  try {
    const ac = getAudioCtx();
    const t = ac.currentTime;
    playTone(800, 'square', 0.1, 0.3, t);
    playTone(1200, 'square', 0.1, 0.2, t + 0.1);
    playTone(1600, 'square', 0.15, 0.3, t + 0.2);
  } catch(e) {}
}

function playDeathSound() {
  try {
    const ac = getAudioCtx();
    const t = ac.currentTime;
    for (let i = 0; i < 12; i++) {
      playTone(800 - i * 55, 'sawtooth', 0.12, 0.2, t + i * 0.08);
    }
  } catch(e) {}
}

// ---------- PARTICLES ----------
const floatingTexts = [];

function addFloatingText(x, y, text, color = '#FFD700') {
  floatingTexts.push({ x, y, text, color, alpha: 1, vy: -1.5, life: 60 });
}

// ---------- INIT PARTICLES BG ----------
function initParticles() {
  const container = document.getElementById('particles-container');
  container.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.width = (Math.random() * 3 + 1) + 'px';
    p.style.height = p.style.width;
    const colors = ['#FFD700', '#FF4444', '#44CCFF', '#FF99CC', '#FFAA44'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

// ---------- MAZE HELPERS ----------
function initMaze() {
  maze = BASE_MAZE.map(row => [...row]);
  dots = 0;
  powerPellets = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === DOT) dots++;
      if (maze[r][c] === POWER) powerPellets.push({ r, c });
    }
  }
}

function isWalkable(r, c, ghost = false) {
  if (r < 0 || r >= ROWS) return false;
  const cc = ((c % COLS) + COLS) % COLS;
  const cell = maze[r][cc];
  if (ghost && cell === DOOR) return true;
  if (cell === WALL || cell === DOOR) return false;
  return true;
}

// ---------- PAC-MAN ----------
function createPacman() {
  return {
    x: 13.5, y: 23,
    dir: DIR.NONE,
    nextDir: DIR.NONE,
    speed: 0.1,
    mouthAngle: 0,
    mouthDir: 1,
    alive: true,
    dyingAnim: 0,
    dotsSinceSound: 0,
  };
}

// ---------- GHOSTS ----------
function createGhost(name, startR, startC, color, scatterTarget) {
  return {
    name, color, scatterTarget,
    x: startC, y: startR,
    homeX: startC, homeY: startR,
    dir: DIR.UP,
    nextDir: DIR.UP,
    speed: 0.09,
    state: GHOST_STATE.HOME,
    dotCounter: 0,
    dotThreshold: name === 'blinky' ? 0 : name === 'pinky' ? 10 : name === 'inky' ? 30 : 60,
    frightenedFlash: false,
    eyeDir: DIR.LEFT,
    leaveTimer: 0,
  };
}

function createGhosts() {
  return [
    createGhost('blinky', 11, 13, '#FF4444', { r: 0, c: 25 }),
    createGhost('pinky',  14, 13, '#FF99CC', { r: 0, c: 2 }),
    createGhost('inky',   14, 11, '#44CCFF', { r: 29, c: 27 }),
    createGhost('clyde',  14, 15, '#FFAA44', { r: 29, c: 0 }),
  ];
}

// ---------- START / RESET ----------
function startGame() {
  score = 0;
  lives = 3;
  level = 1;
  highScore = parseInt(localStorage.getItem('pacman_hs') || '0');
  initMaze();
  pacman = createPacman();
  ghosts = createGhosts();
  frightTimer = 0;
  frightenedDuration = 8000;
  ghostScore = 200;
  gameState = 'ready';
  floatingTexts.length = 0;

  showScreen('game-screen');
  updateHUD();
  setupCanvas();

  document.getElementById('overlay-text').textContent = 'READY!';
  document.getElementById('overlay-message').classList.remove('hidden');

  overlayTimer = 2000;
  lastTime = performance.now();
  if (animFrame) cancelAnimationFrame(animFrame);
  animFrame = requestAnimationFrame(gameLoop);
}

function restartGame() {
  startGame();
}

function goToMenu() {
  if (animFrame) cancelAnimationFrame(animFrame);
  showScreen('start-screen');
  document.getElementById('hs-value').textContent = highScore;
}

function nextLevel() {
  level++;
  initMaze();
  pacman = createPacman();
  ghosts = createGhosts();
  frightTimer = 0;
  frightenedDuration = Math.max(3000, 8000 - (level - 1) * 500);
  ghostScore = 200;
  gameState = 'ready';
  floatingTexts.length = 0;

  showScreen('game-screen');
  updateHUD();

  document.getElementById('overlay-text').textContent = `LEVEL ${level}`;
  document.getElementById('overlay-message').classList.remove('hidden');

  overlayTimer = 2000;
  lastTime = performance.now();
  if (animFrame) cancelAnimationFrame(animFrame);
  animFrame = requestAnimationFrame(gameLoop);
}

// ---------- CANVAS SETUP ----------
function setupCanvas() {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');

  const maxW = Math.min(window.innerWidth - 32, 540);
  const maxH = window.innerHeight - 180;
  const scale = Math.min(maxW / (COLS * CELL), maxH / (ROWS * CELL));
  const w = Math.floor(COLS * CELL * scale);
  const h = Math.floor(ROWS * CELL * scale);

  canvas.width  = COLS * CELL;
  canvas.height = ROWS * CELL;
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';

  document.querySelector('.hud').style.maxWidth = w + 'px';
  document.querySelector('#canvas-wrapper').style.width = w + 'px';
}

// ---------- HUD ----------
function updateHUD() {
  document.getElementById('score-display').textContent = score;
  document.getElementById('level-display').textContent = level;
  const livesEl = document.getElementById('lives-icons');
  livesEl.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const d = document.createElement('div');
    d.className = 'life-icon';
    livesEl.appendChild(d);
  }
}

// ---------- SCREEN SWITCHER ----------
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ---------- GAME LOOP ----------
function gameLoop(ts) {
  const dt = Math.min(ts - lastTime, 50);
  lastTime = ts;

  update(dt);
  render();

  animFrame = requestAnimationFrame(gameLoop);
}

// ---------- UPDATE ----------
function update(dt) {
  if (gameState === 'ready') {
    overlayTimer -= dt;
    if (overlayTimer <= 0) {
      gameState = 'playing';
      document.getElementById('overlay-message').classList.add('hidden');
    }
    return;
  }

  if (gameState === 'dying') {
    dyingTimer -= dt;
    pacman.dyingAnim += dt * 0.003;
    if (dyingTimer <= 0) {
      lives--;
      updateHUD();
      if (lives <= 0) {
        gameOver();
      } else {
        resetPositions();
        gameState = 'ready';
        document.getElementById('overlay-text').textContent = 'READY!';
        document.getElementById('overlay-message').classList.remove('hidden');
        overlayTimer = 1500;
      }
    }
    return;
  }

  if (gameState !== 'playing') return;

  // Frightened timer
  if (frightTimer > 0) {
    frightTimer -= dt;
    const flashThreshold = 2000;
    ghosts.forEach(g => {
      if (g.state === GHOST_STATE.FRIGHTENED) {
        g.frightenedFlash = frightTimer < flashThreshold && Math.floor(frightTimer / 250) % 2 === 0;
      }
    });
    if (frightTimer <= 0) {
      frightTimer = 0;
      ghosts.forEach(g => {
        if (g.state === GHOST_STATE.FRIGHTENED) g.state = GHOST_STATE.SCATTER;
      });
    }
  }

  // Update floating texts
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy;
    ft.alpha -= 1 / ft.life;
    ft.life--;
    if (ft.life <= 0) floatingTexts.splice(i, 1);
  }

  updatePacman(dt);
  ghosts.forEach(g => updateGhost(g, dt));
  checkCollisions();
}

// ---------- PAC-MAN MOVEMENT ----------
function updatePacman(dt) {
  const steps = Math.ceil(dt / 16);
  const dts = dt / steps;

  for (let s = 0; s < steps; s++) {
    // Try next direction first
    if (pacman.nextDir !== DIR.NONE && pacman.nextDir !== pacman.dir) {
      const nx = pacman.x + pacman.nextDir.x;
      const ny = pacman.y + pacman.nextDir.y;
      if (canMoveTo(pacman.x, pacman.y, pacman.nextDir)) {
        pacman.dir = pacman.nextDir;
      }
    }

    if (pacman.dir !== DIR.NONE) {
      const speed = pacman.speed * dts;
      const nx = pacman.x + pacman.dir.x * speed;
      const ny = pacman.y + pacman.dir.y * speed;

      if (canMoveTo(pacman.x, pacman.y, pacman.dir)) {
        pacman.x = nx;
        pacman.y = ny;
      } else {
        // snap to grid
        pacman.x = Math.round(pacman.x);
        pacman.y = Math.round(pacman.y);
      }

      // Tunnel wrapping
      if (pacman.x < 0) pacman.x = COLS - 1;
      if (pacman.x >= COLS) pacman.x = 0;
    }

    // Mouth animation
    pacman.mouthAngle += 0.18 * dts;
    if (pacman.mouthAngle > 0.35) pacman.mouthDir = -1;
    if (pacman.mouthAngle < 0) { pacman.mouthAngle = 0; pacman.mouthDir = 1; }
    pacman.mouthAngle += pacman.mouthDir * 0.01;
  }

  // Eat dots
  const gc = Math.round(pacman.x);
  const gr = Math.round(pacman.y);
  if (gr >= 0 && gr < ROWS && gc >= 0 && gc < COLS) {
    const cell = maze[gr][gc];
    if (cell === DOT) {
      maze[gr][gc] = EMPTY;
      dots--;
      score += 10;
      updateHUD();
      pacman.dotsSinceSound = (pacman.dotsSinceSound + 1) % 2;
      if (pacman.dotsSinceSound === 0) playDotSound();
      if (dots <= 0) triggerWin();
    } else if (cell === POWER) {
      maze[gr][gc] = EMPTY;
      dots--;
      score += 50;
      updateHUD();
      playPowerSound();
      frightenGhosts();
      if (dots <= 0) triggerWin();
    }
  }
}

function canMoveTo(x, y, dir) {
  if (dir === DIR.NONE) return true;
  const nx = x + dir.x * pacman.speed * 16;
  const ny = y + dir.y * pacman.speed * 16;

  // Check all 4 corners at new position
  const margin = 0.4;
  const corners = [
    { r: Math.floor(ny - margin), c: Math.floor(nx - margin) },
    { r: Math.floor(ny - margin), c: Math.ceil(nx + margin) - 1 },
    { r: Math.ceil(ny + margin) - 1, c: Math.floor(nx - margin) },
    { r: Math.ceil(ny + margin) - 1, c: Math.ceil(nx + margin) - 1 },
  ];

  for (const corner of corners) {
    const cc = ((corner.c % COLS) + COLS) % COLS;
    if (corner.r < 0 || corner.r >= ROWS) continue;
    const cell = maze[corner.r][cc];
    if (cell === WALL || cell === DOOR) return false;
  }
  return true;
}

// ---------- GHOST MOVEMENT ----------
function updateGhost(g, dt) {
  const steps = Math.ceil(dt / 16);
  const dts = dt / steps;

  for (let s = 0; s < steps; s++) {
    const speed = getGhostSpeed(g) * dts;

    if (g.state === GHOST_STATE.HOME) {
      // Bob up and down in ghost house
      g.leaveTimer += dts;
      g.y += Math.sin(g.leaveTimer * 0.05) * 0.02;
      if (g.dotCounter >= g.dotThreshold) {
        g.state = GHOST_STATE.LEAVING;
      }
      continue;
    }

    if (g.state === GHOST_STATE.LEAVING) {
      // Move to exit
      const exitX = 13.5, exitY = 11;
      const dx = exitX - g.x;
      const dy = exitY - g.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.2) {
        g.x = exitX;
        g.y = exitY;
        g.state = GHOST_STATE.SCATTER;
        g.dir = DIR.LEFT;
      } else {
        g.x += (dx / dist) * speed * 1.5;
        g.y += (dy / dist) * speed * 1.5;
      }
      continue;
    }

    if (g.state === GHOST_STATE.EATEN) {
      // Return to ghost house
      const tx = 13.5, ty = 14;
      const dx = tx - g.x;
      const dy = ty - g.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.3) {
        g.x = g.homeX;
        g.y = g.homeY;
        g.state = GHOST_STATE.HOME;
        g.dotCounter = 0;
        g.leaveTimer = 0;
      } else {
        g.x += (dx / dist) * speed * 2;
        g.y += (dy / dist) * speed * 2;
      }
      continue;
    }

    // Normal movement — move to next grid cell
    const rx = g.x % 1;
    const ry = g.y % 1;
    const atCenter = (Math.abs(rx) < 0.1 || Math.abs(rx - 1) < 0.1) &&
                     (Math.abs(ry) < 0.1 || Math.abs(ry - 1) < 0.1);

    if (atCenter) {
      g.x = Math.round(g.x);
      g.y = Math.round(g.y);
      chooseGhostDir(g);
    }

    const nx = g.x + g.dir.x * speed;
    const ny = g.y + g.dir.y * speed;

    // Tunnel wrapping
    if (nx < 0) { g.x = COLS - 1; continue; }
    if (nx >= COLS) { g.x = 0; continue; }

    if (isWalkable(Math.round(ny), Math.round(nx), true)) {
      g.x = nx;
      g.y = ny;
    }
  }
}

function getGhostSpeed(g) {
  if (g.state === GHOST_STATE.FRIGHTENED) return 0.05 + level * 0.003;
  if (g.state === GHOST_STATE.EATEN) return 0.18;
  return 0.085 + level * 0.004;
}

function chooseGhostDir(g) {
  let target;

  if (g.state === GHOST_STATE.FRIGHTENED) {
    // Random
    const dirs = [DIR.UP, DIR.DOWN, DIR.LEFT, DIR.RIGHT];
    const opp = { x: -g.dir.x, y: -g.dir.y };
    const possible = dirs.filter(d => {
      if (d.x === opp.x && d.y === opp.y) return false;
      return isWalkable(Math.round(g.y + d.y), Math.round(g.x + d.x), false);
    });
    if (possible.length > 0) g.dir = possible[Math.floor(Math.random() * possible.length)];
    return;
  }

  if (g.state === GHOST_STATE.SCATTER) {
    target = g.scatterTarget;
  } else {
    // CHASE — unique targeting per ghost
    target = getChaseTarget(g);
  }

  const dirs = [DIR.UP, DIR.DOWN, DIR.LEFT, DIR.RIGHT];
  const opp = { x: -g.dir.x, y: -g.dir.y };

  let bestDir = g.dir;
  let bestDist = Infinity;

  for (const d of dirs) {
    if (d.x === opp.x && d.y === opp.y) continue;
    const nr = Math.round(g.y + d.y);
    const nc = Math.round(g.x + d.x);
    if (!isWalkable(nr, nc, g.state === GHOST_STATE.EATEN)) continue;
    const dist = (nc - target.c) ** 2 + (nr - target.r) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      bestDir = d;
    }
  }

  g.dir = bestDir;
}

function getChaseTarget(g) {
  switch (g.name) {
    case 'blinky': return { r: Math.round(pacman.y), c: Math.round(pacman.x) };
    case 'pinky': {
      const ahead = 4;
      return { r: Math.round(pacman.y + pacman.dir.y * ahead), c: Math.round(pacman.x + pacman.dir.x * ahead) };
    }
    case 'inky': {
      const blinky = ghosts.find(g2 => g2.name === 'blinky');
      const px = Math.round(pacman.x + pacman.dir.x * 2);
      const py = Math.round(pacman.y + pacman.dir.y * 2);
      const bx = Math.round(blinky.x);
      const by = Math.round(blinky.y);
      return { r: py + (py - by), c: px + (px - bx) };
    }
    case 'clyde': {
      const dist = Math.hypot(g.x - pacman.x, g.y - pacman.y);
      return dist > 8 ? { r: Math.round(pacman.y), c: Math.round(pacman.x) } : g.scatterTarget;
    }
  }
}

function frightenGhosts() {
  frightTimer = frightenedDuration;
  ghostScore = 200;
  ghosts.forEach(g => {
    if (g.state !== GHOST_STATE.EATEN && g.state !== GHOST_STATE.HOME && g.state !== GHOST_STATE.LEAVING) {
      g.state = GHOST_STATE.FRIGHTENED;
      g.frightenedFlash = false;
      // Reverse direction
      g.dir = { x: -g.dir.x, y: -g.dir.y };
    }
  });
}

// ---------- COLLISIONS ----------
function checkCollisions() {
  for (const g of ghosts) {
    const dist = Math.hypot(g.x - pacman.x, g.y - pacman.y);
    if (dist < 0.8) {
      if (g.state === GHOST_STATE.FRIGHTENED) {
        // Eat ghost
        g.state = GHOST_STATE.EATEN;
        const pts = ghostScore;
        score += pts;
        ghostScore = Math.min(ghostScore * 2, 1600);
        updateHUD();
        playEatGhostSound();
        addFloatingText(g.x * CELL, g.y * CELL, '+' + pts, '#44CCFF');
      } else if (g.state === GHOST_STATE.CHASE || g.state === GHOST_STATE.SCATTER) {
        // Pac-man dies
        pacman.alive = false;
        pacman.dyingAnim = 0;
        gameState = 'dying';
        dyingTimer = 1500;
        playDeathSound();
      }
    }
  }
}

function resetPositions() {
  pacman = createPacman();
  ghosts = createGhosts();
  frightTimer = 0;
  ghostScore = 200;
}

function gameOver() {
  gameState = 'gameover';
  const isNew = score > highScore;
  if (isNew) {
    highScore = score;
    localStorage.setItem('pacman_hs', highScore);
  }
  document.getElementById('final-score').textContent = score;
  document.getElementById('new-record').classList.toggle('hidden', !isNew);
  showScreen('gameover-screen');
}

function triggerWin() {
  gameState = 'win';
  document.getElementById('win-score').textContent = score;
  setTimeout(() => showScreen('win-screen'), 1000);
}

// ---------- RENDER ----------
function render() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMaze();
  drawDots();
  drawFloatingTexts();

  if (gameState !== 'dying') {
    drawGhosts();
  }
  drawPacman();
}

// ---- DRAW MAZE ----
function drawMaze() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = maze[r][c];
      if (cell === WALL) {
        drawWallCell(r, c);
      }
    }
  }
}

function drawWallCell(r, c) {
  const x = c * CELL;
  const y = r * CELL;
  const inset = 2;

  ctx.fillStyle = '#0a0a2a';
  ctx.fillRect(x, y, CELL, CELL);

  // Draw the wall block with gradient and glow
  const grad = ctx.createLinearGradient(x, y, x + CELL, y + CELL);
  grad.addColorStop(0, '#1a2a7a');
  grad.addColorStop(1, '#0d1a55');
  ctx.fillStyle = grad;
  ctx.fillRect(x + inset, y + inset, CELL - inset * 2, CELL - inset * 2);

  // Glow edges
  ctx.strokeStyle = '#3355cc';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#4466FF';
  ctx.shadowBlur = 6;
  ctx.strokeRect(x + inset, y + inset, CELL - inset * 2, CELL - inset * 2);
  ctx.shadowBlur = 0;
}

// ---- DRAW DOTS ----
function drawDots() {
  const time = performance.now();

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = maze[r][c];
      if (cell === DOT) {
        const x = c * CELL + CELL / 2;
        const y = r * CELL + CELL / 2;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE8C0';
        ctx.fill();
      } else if (cell === POWER) {
        const x = c * CELL + CELL / 2;
        const y = r * CELL + CELL / 2;
        const pulse = Math.sin(time * 0.004) * 2 + 5;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }
}

// ---- DRAW PAC-MAN ----
function drawPacman() {
  const px = pacman.x * CELL + CELL / 2;
  const py = pacman.y * CELL + CELL / 2;
  const radius = CELL / 2 - 1;

  if (gameState === 'dying') {
    // Dying animation: pac-man closes up
    const progress = Math.min(pacman.dyingAnim, 1);
    const startAngle = progress * Math.PI;
    const endAngle = (2 - progress) * Math.PI;

    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, radius * (1 - progress * 0.5), startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.shadowBlur = 0;
    return;
  }

  // Determine angle from direction
  let angle = 0;
  if (pacman.dir === DIR.LEFT) angle = Math.PI;
  else if (pacman.dir === DIR.UP) angle = -Math.PI / 2;
  else if (pacman.dir === DIR.DOWN) angle = Math.PI / 2;

  const mouth = pacman.mouthAngle;

  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(px, py, radius, angle + mouth, angle + Math.PI * 2 - mouth);
  ctx.closePath();
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.shadowBlur = 0;

  // Eye
  const eyeX = px + Math.cos(angle - Math.PI / 3) * radius * 0.55;
  const eyeY = py + Math.sin(angle - Math.PI / 3) * radius * 0.55;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();
}

// ---- DRAW GHOSTS ----
function drawGhosts() {
  for (const g of ghosts) {
    if (g.state === GHOST_STATE.HOME && g.name !== 'blinky') {
      // still show in ghost house
    }
    drawGhost(g);
  }
}

function drawGhost(g) {
  const gx = g.x * CELL + CELL / 2;
  const gy = g.y * CELL + CELL / 2;
  const r = CELL / 2 - 1;

  if (g.state === GHOST_STATE.EATEN) {
    drawGhostEyes(gx, gy, r, g.dir, '#FFFFFF');
    return;
  }

  let bodyColor, eyeColor;
  if (g.state === GHOST_STATE.FRIGHTENED) {
    bodyColor = g.frightenedFlash ? '#FFFFFF' : '#2233AA';
    eyeColor = g.frightenedFlash ? '#FF4444' : '#FFAAAA';
  } else {
    bodyColor = g.color;
    eyeColor = '#FFFFFF';
  }

  ctx.shadowColor = bodyColor;
  ctx.shadowBlur = 14;

  // Body (rounded top + wavy bottom)
  const time = performance.now();
  ctx.beginPath();
  ctx.arc(gx, gy - 2, r, Math.PI, 0, false);
  const baseY = gy + r - 2;
  const waveCount = 3;
  const waveW = (r * 2) / waveCount;
  for (let i = waveCount; i >= 0; i--) {
    const wx = gx + r - i * waveW;
    const waveY = baseY + (i % 2 === 0 ? -4 : 0) + Math.sin(time * 0.004 + i) * 1.5;
    if (i === waveCount) ctx.lineTo(wx, waveY);
    else ctx.quadraticCurveTo(wx + waveW / 2, baseY + 4, wx, waveY);
  }
  ctx.lineTo(gx - r, gy - 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Eyes
  drawGhostEyes(gx, gy - 2, r, g.dir, eyeColor);
}

function drawGhostEyes(gx, gy, r, dir, white) {
  const eyeOffX = r * 0.32;
  const eyeOffY = -r * 0.1;
  const eyeR = r * 0.25;
  const pupilOffX = dir.x * eyeR * 0.5;
  const pupilOffY = dir.y * eyeR * 0.5;

  for (let side of [-1, 1]) {
    const ex = gx + side * eyeOffX;
    const ey = gy + eyeOffY;
    ctx.beginPath();
    ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = white;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + pupilOffX, ey + pupilOffY, eyeR * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#2244FF';
    ctx.fill();
  }
}

// ---- FLOATING TEXTS ----
function drawFloatingTexts() {
  for (const ft of floatingTexts) {
    ctx.globalAlpha = ft.alpha;
    ctx.font = 'bold 14px "Press Start 2P", monospace';
    ctx.fillStyle = ft.color;
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.globalAlpha = 1;
  }
}

// ---------- INPUT ----------
function setupInput() {
  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':    case 'w': case 'W': pacman && (pacman.nextDir = DIR.UP);    e.preventDefault(); break;
      case 'ArrowDown':  case 's': case 'S': pacman && (pacman.nextDir = DIR.DOWN);  e.preventDefault(); break;
      case 'ArrowLeft':  case 'a': case 'A': pacman && (pacman.nextDir = DIR.LEFT);  e.preventDefault(); break;
      case 'ArrowRight': case 'd': case 'D': pacman && (pacman.nextDir = DIR.RIGHT); e.preventDefault(); break;
    }
  });

  // Touch support
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!pacman) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      pacman.nextDir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
    } else {
      pacman.nextDir = dy > 0 ? DIR.DOWN : DIR.UP;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (gameState && canvas) setupCanvas();
  });
}

// ---------- GHOST DOT COUNTERS ----------
// Increment ghost dot counters as pacman eats dots
const _origUpdatePacman = updatePacman;

// ---------- INIT ----------
function init() {
  initParticles();
  setupInput();
  highScore = parseInt(localStorage.getItem('pacman_hs') || '0');
  document.getElementById('hs-value').textContent = highScore;
  showScreen('start-screen');
}

// Increment ghost release counters on dot eat
const originalUpdatePacman = updatePacman;

// Override to increment ghost counters
(function patchGhostCounters() {
  const orig = updatePacman;
  // We patch by watching maze state changes
  // Simpler: increment in game loop
})();

// Patch: increment ghost dot counters when dots eaten
let prevDots = -1;
const _gameLoopOrig = gameLoop;

// Reset-safe dot tracking
function trackGhostCounters() {
  if (prevDots === -1) { prevDots = dots; return; }
  if (dots < prevDots) {
    const eaten = prevDots - dots;
    ghosts.forEach(g => {
      if (g.state === GHOST_STATE.HOME) g.dotCounter += eaten;
    });
  }
  prevDots = dots;
}

// Patch update to call tracker
const _updateOrig = update;
window.update = function(dt) {
  trackGhostCounters();
  _updateOrig(dt);
  prevDots = dots;
};

// ---- BOOT ----
window.addEventListener('DOMContentLoaded', init);
