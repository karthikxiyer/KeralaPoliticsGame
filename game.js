/* Kerala Konishtt v2.0 — Game Engine */
const LANE_COUNT = 3, PLAYER_SIZE = 48, OBS_SIZE = 52, INIT_SPEED = 6, SPEED_INC = 0.30, SPEED_INT = 7000,
  MAX_SPEED = 48, SPAWN_INIT = 600, SPAWN_MIN = 200, SPAWN_DEC = 30, INVINC_DUR = 1500, MAX_LIVES = 3,
  STRIPE_H = 40, STRIPE_G = 30, POWERUP_CHANCE = 0.15, POWERUP_CHANCE_DEC = 0.01, POWERUP_SIZE = 40;

// Sprite image loading
const spriteImages = {};
const SPRITE_SHEETS = {
  'obs_udf': { src: 'assets/obs_udf.png', cols: 3, rows: 3, count: 5, ids: ['_sheet_mankootathil', 'punarjani', 'cm_fight', 'decade_opp', 'musical_chairs'] },
  'obs_ldf': { src: 'assets/obs_ldf.png', cols: 3, rows: 3, count: 5, ids: ['_sheet_gold_scam', '_sheet_kannur_fund', '_sheet_health_collapse', '_sheet_youth_exodus', '_sheet_no_messi'] },
  'obs_nda': { src: 'assets/obs_nda.png', cols: 3, rows: 2, count: 5, ids: ['_sheet_suresh_gopi', '_sheet_vote_bribe', '_sheet_vote_chori', 'no_funds', '_sheet_modiji'] },
  'obs_common': { src: 'assets/obs_common.png', cols: 3, rows: 3, count: 4, ids: ['_sheet_bteam', '_unused1', '_unused2', 'powerup_shield', 'powerup_extralife', 'powerup_slowmo'] },
  'chars': { src: 'assets/chars.png', cols: 2, rows: 2, count: 4, ids: ['modiji_face', 'suresh_face', 'modiji_face2', 'mankootathil_face'] },
  'symbols': { src: 'assets/symbols.png', cols: 2, rows: 1, count: 2, ids: ['no_funds_symbol', 'bteam_symbol'] },
  'ldf_messi_youth': { src: 'assets/ldf_messi_youth.png', cols: 2, rows: 1, count: 2, ids: ['messi_face', 'youth_flight'] },
  'ldf_gold_hospital': { src: 'assets/ldf_gold_hospital.png', cols: 2, rows: 1, count: 2, ids: ['gold_runner', 'hospital_collapse'] }
};
// Individual obstacle face images (pixel-art, transparent bg)
const OBS_FACE_IDS = ['modiji', 'suresh_gopi', 'mankootathil', 'punarjani', 'cm_fight',
  'decade_opp', 'musical_chairs', 'gold_scam', 'kannur_fund', 'health_collapse',
  'youth_exodus', 'no_messi', 'vote_bribe', 'vote_chori', 'no_funds', 'bteam', 'rahul_gandhi'];
let spritesLoaded = 0, spritesTotal = Object.keys(SPRITE_SHEETS).length + OBS_FACE_IDS.length;
function loadSprites() {
  // Load legacy sprite sheets (powerups still use these)
  for (const [key, sheet] of Object.entries(SPRITE_SHEETS)) {
    const img = new Image(); img.src = sheet.src;
    img.onload = () => {
      const cw = img.width / sheet.cols, ch = img.height / sheet.rows;
      for (let i = 0; i < sheet.count; i++) {
        const col = i % sheet.cols, row = Math.floor(i / sheet.cols);
        const c = document.createElement('canvas'); c.width = cw; c.height = ch;
        c.getContext('2d').drawImage(img, col * cw, row * ch, cw, ch, 0, 0, cw, ch);
        spriteImages[sheet.ids[i]] = c;
      }
      spritesLoaded++
    }; img.onerror = () => { spritesLoaded++ }
  }
  // Load individual pixel-art face images — these override any sheet sprites
  for (const id of OBS_FACE_IDS) {
    const img = new Image(); img.src = `assets/obs/${id}.png`;
    img.onload = () => { spriteImages[id] = img; spritesLoaded++ };
    img.onerror = () => { spritesLoaded++ };
  }
}
loadSprites();

const PCTL = [2, 3, 4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 33, 36, 40, 45, 50, 55, 60, 70, 80, 90, 100, 120];

let S = {
  screen: 'intro', party: null, partyData: null, lives: MAX_LIVES, score: 0, startTime: 0,
  bestTime: parseFloat(localStorage.getItem('kk_best') || '0'), speed: INIT_SPEED,
  spawnInt: SPAWN_INIT, lastSpawn: 0, lastSpeedUp: 0, currentPowerupChance: POWERUP_CHANCE, pLane: 1, tLane: 1, pX: 0, pY: 0,
  obs: [], powerups: [], inv: false, invUntil: 0, shielded: false, shieldUntil: 0,
  slowmo: false, slowUntil: 0, goType: null, anim: 0, roadOff: 0,
  disc: new Set(JSON.parse(localStorage.getItem('kk_disc') || '[]')),
  showDisc: null, discTimer: 0, muted: localStorage.getItem('kk_muted') === 'true',
  cW: 0, cH: 0, lW: 0, particles: [], shake: 0, activeObs: [], musicPlaying: false
};

const $ = id => document.getElementById(id);
const canvas = $('game-canvas'), ctx = canvas.getContext('2d');

// Audio
const AC = window.AudioContext || window.webkitAudioContext;
let actx = null, musicTimeout = null, bgMusic = null;
function ensureAudio() { if (!actx) actx = new AC() }

// Background music (Kuttanadan)
function initBackgroundMusic() {
  if (!bgMusic) {
    bgMusic = new Audio('assets/kuttanadan.m4a');
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
  }
}

function playBackgroundMusic() {
  if (S.muted) return;
  initBackgroundMusic();
  bgMusic.currentTime = 0;
  bgMusic.play().catch(err => console.log('Audio play failed:', err));
}

function stopBackgroundMusic() {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}
function tone(f, d, t = 'square', v = 0.15) {
  if (S.muted || !f) return; try {
    ensureAudio();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = t; o.frequency.value = f; g.gain.setValueAtTime(v, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + d);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + d);
  } catch (e) { }
}

function playHit() { tone(200, 0.3, 'sawtooth', 0.2); setTimeout(() => tone(150, 0.2, 'sawtooth', 0.15), 100) }
function playGO() { tone(440, 0.15); setTimeout(() => tone(370, 0.15), 150); setTimeout(() => tone(311, 0.15), 300); setTimeout(() => tone(261, 0.4), 450) }
function playMove() { tone(600, 0.05, 'sine', 0.1) }
function playStart() { tone(523, 0.1); setTimeout(() => tone(659, 0.1), 100); setTimeout(() => tone(784, 0.15), 200) }
function playPowerup() { tone(784, 0.1, 'sine', 0.2); setTimeout(() => tone(988, 0.1, 'sine', 0.2), 100); setTimeout(() => tone(1175, 0.15, 'sine', 0.2), 200) }

// ── Drum / bass helpers ───────────────────────────────────────────────────
// Boat-drum thud: very short burst of low sine + triangle noise
function drumThud(v = 0.14) {
  if (S.muted) return; try {
    ensureAudio();
    // Kick body
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(90, actx.currentTime);
    o.frequency.exponentialRampToValueAtTime(40, actx.currentTime + 0.08);
    g.gain.setValueAtTime(v, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.10);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + 0.10);
    // Click transient (snap)
    const o2 = actx.createOscillator(), g2 = actx.createGain();
    o2.type = 'triangle'; o2.frequency.value = 200;
    g2.gain.setValueAtTime(v * 0.4, actx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.025);
    o2.connect(g2); g2.connect(actx.destination); o2.start(); o2.stop(actx.currentTime + 0.03);
  } catch (e) { }
}

// Harmony 5th below melody — gives fullness to the "Thi Thi Thara" hook
function bassNote(f, d, v = 0.05) {
  if (S.muted || !f) return; try {
    ensureAudio();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'triangle'; o.frequency.value = f * 0.5;  // one octave down
    g.gain.setValueAtTime(v, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + d * 0.85);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + d * 0.85);
  } catch (e) { }
}

// ── Music loop ────────────────────────────────────────────────────────────
let drumInterval = null;
function startMusic() {
  if (S.muted || S.musicPlaying) return; S.musicPlaying = true;
  playBackgroundMusic();
}
function stopMusic() {
  S.musicPlaying = false;
  stopBackgroundMusic();
}

// Screens
function showScreen(n) {
  S.screen = n;
  ['intro', 'party', 'game', 'gameover'].forEach(s => {
    const el = $(s + '-screen'); if (el) el.classList.toggle('active', s === n || (s === 'game' && n === 'playing'));
  });
  if (n === 'playing') { $('game-screen').classList.add('active') }
}

// Resize
function resize() {
  const dpr = window.devicePixelRatio || 1;
  const r = $('game-screen').getBoundingClientRect();
  const w = Math.min(r.width, 420), h = r.height;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  S.cW = w; S.cH = h; S.lW = w / LANE_COUNT; S.pY = h - 120;
}

// Build obstacle list for selected party
function buildObstacles() {
  const p = S.partyData;
  S.activeObs = [...p.obstacles, ...COMMON_OBSTACLES];
}

// (Powerups now use generic labels — no rival-scandal references)

// Start game
function startGame() {
  S.lives = MAX_LIVES; S.score = 0; S.startTime = performance.now();
  S.speed = INIT_SPEED; S.spawnInt = SPAWN_INIT; S.lastSpawn = 0; S.lastSpeedUp = 0; S.currentPowerupChance = POWERUP_CHANCE;
  S.pLane = 1; S.tLane = 1; S.obs = []; S.powerups = []; S.inv = false; S.invUntil = 0;
  S.shielded = false; S.shieldUntil = 0; S.slowmo = false; S.slowUntil = 0;
  S.goType = null; S.anim = 0; S.roadOff = 0; S.showDisc = null; S.discTimer = 0;
  S.particles = []; S.shake = 0;
  buildObstacles(); updateHUD(); showScreen('playing'); resize();
  playStart(); startMusic();
  // Set party badge
  const pd = S.partyData;
  $('hud-party-badge').textContent = pd.symbol + ' ' + pd.name;
  $('hud-party-badge').style.color = pd.color;
  $('hud-powerup').classList.add('hidden');
}

// Input
let tsX = 0, tsY = 0;
function moveLane(d) { const n = S.tLane + d; if (n >= 0 && n < LANE_COUNT) { S.tLane = n; playMove() } }

document.addEventListener('keydown', e => {
  if (S.screen !== 'playing') return;
  if (e.key === 'ArrowLeft' || e.key === 'a') { moveLane(-1); e.preventDefault() }
  else if (e.key === 'ArrowRight' || e.key === 'd') { moveLane(1); e.preventDefault() }
});

// Touch: swipe
canvas.addEventListener('touchstart', e => {
  if (S.screen !== 'playing') return;
  tsX = e.touches[0].clientX; tsY = e.touches[0].clientY; e.preventDefault()
}, { passive: false });
canvas.addEventListener('touchend', e => {
  if (S.screen !== 'playing') return;
  const dx = e.changedTouches[0].clientX - tsX, dy = e.changedTouches[0].clientY - tsY;
  if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) moveLane(dx > 0 ? 1 : -1);
  e.preventDefault()
}, { passive: false });
canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// Tap zones
$('tap-left').addEventListener('click', () => { if (S.screen === 'playing') moveLane(-1) });
$('tap-right').addEventListener('click', () => { if (S.screen === 'playing') moveLane(1) });

// Spawn
function spawn(now) {
  if (now - S.lastSpawn < S.spawnInt) return; S.lastSpawn = now;
  const lane = Math.floor(Math.random() * LANE_COUNT);
  const tooClose = S.obs.some(o => o.lane === lane && o.y < 60) || S.powerups.some(p => p.lane === lane && p.y < 60);
  if (tooClose) return;

  // Powerup chance
  if (Math.random() < S.currentPowerupChance) {
    const fx = POWERUP_KEYS[Math.floor(Math.random() * POWERUP_KEYS.length)];
    S.powerups.push({ lane, y: -POWERUP_SIZE, effect: fx, speed: S.speed * 0.7 });
    return;
  }

  const type = S.activeObs[Math.floor(Math.random() * S.activeObs.length)];
  S.obs.push({ lane, y: -OBS_SIZE, type, speed: S.speed * (0.8 + Math.random() * 0.4) });
}

// Collision
function checkCol() {
  if (S.inv) return;
  const px = S.pX + PLAYER_SIZE / 2, py = S.pY + PLAYER_SIZE / 2, pr = PLAYER_SIZE * 0.35;
  for (let i = S.obs.length - 1; i >= 0; i--) {
    const o = S.obs[i], ox = laneX(o.lane) + (S.lW - OBS_SIZE) / 2 + OBS_SIZE / 2, oy = o.y + OBS_SIZE / 2;
    const d = Math.hypot(px - ox, py - oy);
    if (d < pr + OBS_SIZE * 0.35) {
      if (S.shielded) { S.obs.splice(i, 1); spawnParts(ox, oy, '#00ff88', 4); continue; }
      S.lives--; S.inv = true; S.invUntil = performance.now() + INVINC_DUR; S.shake = 10; playHit();
      spawnParts(ox, oy, o.type.color, 8);
      if (!S.disc.has(o.type.id)) {
        S.disc.add(o.type.id);
        localStorage.setItem('kk_disc', JSON.stringify([...S.disc]));
        S.showDisc = o.type; S.discTimer = performance.now() + 2000;
      }
      S.obs.splice(i, 1); updateHUD();
      if (S.lives <= 0) { gameOver(o.type); return; }
    }
  }
}

// Powerup collection
function checkPowerups() {
  const px = S.pX + PLAYER_SIZE / 2, py = S.pY + PLAYER_SIZE / 2, pr = PLAYER_SIZE * 0.4;
  for (let i = S.powerups.length - 1; i >= 0; i--) {
    const p = S.powerups[i], ppx = laneX(p.lane) + (S.lW - POWERUP_SIZE) / 2 + POWERUP_SIZE / 2, ppy = p.y + POWERUP_SIZE / 2;
    if (Math.hypot(px - ppx, py - ppy) < pr + POWERUP_SIZE * 0.4) {
      applyPowerup(p.effect); playPowerup();
      spawnParts(ppx, ppy, '#00ff88', 6); S.powerups.splice(i, 1);
    }
  }
}

function applyPowerup(fx) {
  const partyPowerups = PARTY_POWERUPS[S.party];
  const ef = (partyPowerups && partyPowerups[fx]) || POWERUP_EFFECTS[fx];
  const now = performance.now();
  const hud = $('hud-powerup'); hud.textContent = ef.hudText; hud.style.color = ef.hudColor;
  hud.classList.remove('hidden');
  if (fx === 'shield') { S.shielded = true; S.shieldUntil = now + ef.duration; }
  else if (fx === 'extralife') { S.lives = Math.min(S.lives + 1, MAX_LIVES + 1); updateHUD(); }
  else if (fx === 'slowmo') { S.slowmo = true; S.slowUntil = now + ef.duration; }
  if (ef.duration > 0) setTimeout(() => { hud.classList.add('hidden') }, ef.duration);
  else setTimeout(() => { hud.classList.add('hidden') }, 1500);
}

function spawnParts(x, y, c, n) {
  for (let i = 0; i < n; i++)S.particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 1, color: c
  });
}

// Game over
function gameOver(type) {
  const el = performance.now() - S.startTime; S.score = el; S.goType = type; stopMusic();
  if (el > S.bestTime) { S.bestTime = el; localStorage.setItem('kk_best', S.bestTime.toString()) }
  playGO(); setTimeout(() => showGO(el, type), 500);
}

function showGO(ms, type) {
  const s = (ms / 1000).toFixed(2), pct = getPct(ms / 1000), pd = S.partyData;
  const roleMap = { 'udf': 'Ani', 'ldf': 'Sakhavu', 'nda': 'Karyakarta' };
  $('final-time').textContent = s + 's';
  $('final-percentile').innerHTML = `Better than <span class="accent">${pct}%</span> of Kerala`;
  $('final-party').textContent = pd.symbol + ' Playing as ' + pd.name + ' ' + roleMap[S.party];
  $('final-party').style.color = pd.color;
  $('death-title').textContent = type.title;
  $('death-quote').textContent = type.quote;
  $('death-story').textContent = type.story;
  showScreen('gameover');
}

function getPct(s) { const b = PCTL.filter(t => t < s).length; return Math.min(99, Math.round(b / PCTL.length * 100)) }

// HUD
function updateHUD() {
  $('hud-hearts').textContent = '❤️'.repeat(S.lives) + '🖤'.repeat(Math.max(0, MAX_LIVES - S.lives));
  $('hud-best').textContent = 'BEST: ' + (S.bestTime / 1000).toFixed(2) + 's';
}

// Helpers
function laneX(l) { return l * S.lW }
function lerp(a, b, t) { return a + (b - a) * Math.min(t, 1) }

// ===== RENDERING =====
function drawRoad() {
  const w = S.cW, h = S.cH, pd = S.partyData;
  ctx.fillStyle = '#1a3a3d'; ctx.fillRect(0, 0, w, h);
  // Party tint
  ctx.fillStyle = pd.roadTint; ctx.fillRect(0, 0, w, h);
  // Edges
  ctx.fillStyle = '#0d2527'; ctx.fillRect(0, 0, 8, h); ctx.fillRect(w - 8, 0, 8, h);
  // Lane dividers
  ctx.strokeStyle = pd.laneDivider; ctx.lineWidth = 2;
  ctx.setLineDash([STRIPE_H, STRIPE_G]); ctx.lineDashOffset = -S.roadOff;
  for (let i = 1; i < LANE_COUNT; i++) { ctx.beginPath(); ctx.moveTo(i * S.lW, 0); ctx.lineTo(i * S.lW, h); ctx.stroke() }
  ctx.setLineDash([]);
}

function drawPlayer() {
  const tx = laneX(S.tLane) + (S.lW - PLAYER_SIZE) / 2;
  S.pX = lerp(S.pX, tx, 0.2); const x = S.pX, y = S.pY, pd = S.partyData;
  if (S.inv && Math.floor(performance.now() / 100) % 2 === 0) return;
  ctx.save(); const bob = Math.sin(S.anim * 10) * 3;
  // Shield glow
  if (S.shielded) {
    ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 15;
    ctx.strokeStyle = 'rgba(0,255,136,0.5)'; ctx.lineWidth = 2;
    ctx.strokeRect(x + 8, y + bob, PLAYER_SIZE - 16, PLAYER_SIZE); ctx.shadowBlur = 0;
  }
  // Body
  ctx.fillStyle = pd.shirtColor; ctx.fillRect(x + 14, y + 14 + bob, 20, 16);
  // Head
  ctx.fillStyle = '#D4A574'; ctx.fillRect(x + 16, y + 4 + bob, 16, 12);
  // Hair
  ctx.fillStyle = '#2C3E50'; ctx.fillRect(x + 16, y + 2 + bob, 16, 6);
  // Mundu
  ctx.fillStyle = '#ECF0F1'; ctx.fillRect(x + 14, y + 28 + bob, 20, 14);
  // Legs
  const lo = Math.sin(S.anim * 12) * 4;
  ctx.fillStyle = '#D4A574'; ctx.fillRect(x + 16, y + 40 + bob, 6, 6 + lo); ctx.fillRect(x + 26, y + 40 + bob, 6, 6 - lo);
  // Sandals
  ctx.fillStyle = '#8B4513'; ctx.fillRect(x + 15, y + 44 + bob + Math.max(0, lo), 8, 3);
  ctx.fillRect(x + 25, y + 44 + bob + Math.max(0, -lo), 8, 3);
  ctx.restore();
}

function drawObs() {
  S.obs.forEach(o => {
    const x = laneX(o.lane) + (S.lW - OBS_SIZE) / 2, y = o.y;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath();
    ctx.ellipse(x + OBS_SIZE / 2, y + OBS_SIZE + 2, OBS_SIZE * 0.35, 6, 0, 0, Math.PI * 2); ctx.fill();
    // Draw sprite: use pixel-art obs/ face images (fallback to legacy sheet sprites, then emoji)
    const spr = spriteImages[o.type.id];
    if (spr) { try { ctx.drawImage(spr, x, y, OBS_SIZE, OBS_SIZE) } catch (e) { } }
    else {
      ctx.font = OBS_SIZE * 0.65 + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(o.type.emoji, x + OBS_SIZE / 2, y + OBS_SIZE / 2)
    }
    // Label (supports multi-line via \n)
    ctx.font = 'bold 10px "JetBrains Mono",monospace'; ctx.textAlign = 'center';
    const lines = o.type.label.split('\n'), lx = x + OBS_SIZE / 2;
    const lineH = 12, totalH = lines.length * lineH;
    const ly0 = y + OBS_SIZE + 8;
    ctx.fillStyle = o.type.color;
    lines.forEach((line, i) => { ctx.fillText(line, lx, ly0 + 6 + i * lineH) });
  });
}

function drawPowerups() {
  S.powerups.forEach(p => {
    const x = laneX(p.lane) + (S.lW - POWERUP_SIZE) / 2, y = p.y;
    // Glow
    ctx.save(); ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(0,255,136,0.12)';
    ctx.beginPath(); ctx.roundRect(x - 3, y - 3, POWERUP_SIZE + 6, POWERUP_SIZE + 6, 6); ctx.fill();
    ctx.restore();
    // Draw sprite or emoji fallback
    const sprKey = 'powerup_' + p.effect, spr = spriteImages[sprKey];
    if (spr) { try { ctx.drawImage(spr, x + 2, y + 2, POWERUP_SIZE - 4, POWERUP_SIZE - 4) } catch (e) { } }
    else {
      ctx.font = POWERUP_SIZE * 0.55 + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const icon = p.effect === 'shield' ? '🛡️' : p.effect === 'extralife' ? '💚' : '⏱️';
      ctx.fillText(icon, x + POWERUP_SIZE / 2, y + POWERUP_SIZE / 2)
    }
    // Party-specific powerup label with bg
    ctx.font = 'bold 9px "JetBrains Mono",monospace'; ctx.textAlign = 'center';
    const partyPowerups = PARTY_POWERUPS[S.party];
    const powerupCfg = (partyPowerups && partyPowerups[p.effect]) || POWERUP_EFFECTS[p.effect];
    const lbl = powerupCfg.label, lw = ctx.measureText(lbl).width;
    const lx = x + POWERUP_SIZE / 2, ly = y + POWERUP_SIZE + 10;
    ctx.fillStyle = 'rgba(0,20,22,0.85)';
    ctx.beginPath(); ctx.roundRect(lx - lw / 2 - 3, ly - 6, lw + 6, 12, 3); ctx.fill();
    ctx.fillStyle = '#00ff88'; ctx.fillText(lbl, lx, ly);
  });
}

function drawParts() {
  S.particles.forEach(p => {
    ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
    const s = 4 * p.life; ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
  }); ctx.globalAlpha = 1;
}

function drawDisc() {
  const dp = $('discovery-popup');
  if (S.showDisc && performance.now() < S.discTimer) {
    dp.classList.remove('hidden');
    dp.querySelector('.discovery-text').textContent = '⚠️ NEW: ' + S.showDisc.label + ' discovered!';
  } else { dp.classList.add('hidden'); S.showDisc = null; }
}

// ===== GAME LOOP =====
let lt = 0;
function loop(ts) {
  if (S.screen !== 'playing') { requestAnimationFrame(loop); return }
  const dt = Math.min((ts - lt) / 16.67, 3); lt = ts; const now = performance.now(), el = now - S.startTime;
  $('hud-timer').textContent = (el / 1000).toFixed(2) + 's';

  // Difficulty progression (every 10 seconds)
  if (now - S.lastSpeedUp > SPEED_INT) {
    S.speed = Math.min(MAX_SPEED, S.speed + SPEED_INC);
    S.spawnInt = Math.max(SPAWN_MIN, S.spawnInt - SPAWN_DEC);
    S.currentPowerupChance = Math.max(0.01, S.currentPowerupChance - POWERUP_CHANCE_DEC);
    S.lastSpeedUp = now;
  }

  // Effective speed (slowmo)
  const eff = S.slowmo ? 0.4 : 1;
  S.roadOff += S.speed * dt * eff;
  if (S.roadOff > STRIPE_H + STRIPE_G) S.roadOff -= STRIPE_H + STRIPE_G;
  S.anim += dt * 0.05;

  // Timers
  if (S.inv && now > S.invUntil) S.inv = false;
  if (S.shielded && now > S.shieldUntil) { S.shielded = false; }
  if (S.slowmo && now > S.slowUntil) { S.slowmo = false; }

  // Spawn & move
  spawn(now);
  S.obs.forEach(o => { o.y += o.speed * dt * eff });
  S.obs = S.obs.filter(o => o.y < S.cH + 50);
  S.powerups.forEach(p => { p.y += p.speed * dt * eff });
  S.powerups = S.powerups.filter(p => p.y < S.cH + 50);
  S.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.03 });
  S.particles = S.particles.filter(p => p.life > 0);

  if (S.shake > 0) S.shake *= 0.85; if (S.shake < 0.5) S.shake = 0;

  checkCol(); checkPowerups();
  if (S.screen !== 'playing') { requestAnimationFrame(loop); return }

  // Render
  ctx.save();
  if (S.shake > 0) { ctx.translate((Math.random() - 0.5) * S.shake, (Math.random() - 0.5) * S.shake) }
  drawRoad(); drawPowerups(); drawObs(); drawPlayer(); drawParts();
  ctx.restore(); drawDisc();
  requestAnimationFrame(loop);
}

// Share
function shareScore() {
  const s = (S.score / 1000).toFixed(2), pct = getPct(S.score / 1000), pd = S.partyData;
  const roleMap = { 'udf': 'Ani', 'ldf': 'Sakhavu', 'nda': 'Karyakarta' };
  const txt = `I survived Kerala politics as a ${pd.name} ${roleMap[S.party]} for ${s}s! Better than ${pct}% of Kerala. Play Kerala Konishtt!`;
  if (navigator.share) { navigator.share({ title: 'Kerala Konishtt', text: txt }).catch(() => copyTxt(txt)) }
  else copyTxt(txt);
}
function copyTxt(t) {
  navigator.clipboard.writeText(t).then(() => {
    $('share-btn').textContent = 'COPIED!'; setTimeout(() => { $('share-btn').textContent = 'SHARE SCORE' }, 2000);
  }).catch(() => {
    const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a);
    a.select(); document.execCommand('copy'); document.body.removeChild(a);
    $('share-btn').textContent = 'COPIED!'; setTimeout(() => { $('share-btn').textContent = 'SHARE SCORE' }, 2000);
  });
}

// Event listeners
$('start-btn').addEventListener('click', () => { ensureAudio(); showScreen('party') });

document.querySelectorAll('.party-card').forEach(card => {
  card.addEventListener('click', () => {
    S.party = card.dataset.party; S.partyData = PARTIES[S.party]; startGame();
  });
});

$('again-btn').addEventListener('click', () => startGame());
$('switch-party-btn').addEventListener('click', () => { stopMusic(); showScreen('party') });
$('share-btn').addEventListener('click', shareScore);
$('mute-btn').addEventListener('click', () => {
  S.muted = !S.muted; localStorage.setItem('kk_muted', S.muted.toString());
  $('mute-btn').textContent = S.muted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
  if (S.muted) stopMusic(); else if (S.screen === 'playing') startMusic();
});

window.addEventListener('resize', () => { if (S.screen === 'playing') resize() });

// Init
updateHUD();
if (S.muted) $('mute-btn').textContent = '🔇 SOUND OFF';
requestAnimationFrame(loop);
