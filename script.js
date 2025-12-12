
// Birdle AU — frontend-only daily game
// Data is simplified for gameplay. Not a field guide.

const SIZE_ORDER = ["tiny", "small", "medium", "large", "very large"];

// A small AU-focused sample database (20 birds).
// Fields: id, name, scientific, family, size, habitat[], colors[], region[], silhouette, emoji
const BIRDS = [
  {id:1,name:"Australian Magpie",scientific:"Gymnorhina tibicen",family:"Artamidae",size:"medium",habitat:["urban","woodland","grassland"],colors:["black","white"],region:["NSW","national"],silhouette:"songbird",emoji:"🐦"},
  {id:2,name:"Laughing Kookaburra",scientific:"Dacelo novaeguineae",family:"Alcedinidae",size:"medium",habitat:["forest","woodland","urban"],colors:["brown","white","blue"],region:["NSW","east"],silhouette:"kingfisher",emoji:"🪶"},
  {id:3,name:"Rainbow Lorikeet",scientific:"Trichoglossus moluccanus",family:"Psittaculidae",size:"small",habitat:["urban","forest","coastal"],colors:["green","blue","red","yellow"],region:["NSW","east"],silhouette:"parrot",emoji:"🦜"},
  {id:4,name:"Sulphur-crested Cockatoo",scientific:"Cacatua galerita",family:"Cacatuidae",size:"large",habitat:["urban","woodland"],colors:["white","yellow"],region:["NSW","east"],silhouette:"parrot",emoji:"🦜"},
  {id:5,name:"Superb Fairywren",scientific:"Malurus cyaneus",family:"Maluridae",size:"tiny",habitat:["scrub","woodland","urban"],colors:["blue","black","brown"],region:["NSW","southeast"],silhouette:"fairywren",emoji:"🐦"},
  {id:6,name:"Galah",scientific:"Eolophus roseicapilla",family:"Cacatuidae",size:"large",habitat:["grassland","urban","woodland"],colors:["pink","grey"],region:["NSW","national"],silhouette:"parrot",emoji:"🦜"},
  {id:7,name:"Pied Currawong",scientific:"Strepera graculina",family:"Artamidae",size:"medium",habitat:["forest","urban"],colors:["black","white"],region:["NSW","east"],silhouette:"songbird",emoji:"🐦"},
  {id:8,name:"Noisy Miner",scientific:"Manorina melanocephala",family:"Meliphagidae",size:"small",habitat:["urban","woodland"],colors:["grey","yellow"],region:["NSW","east"],silhouette:"songbird",emoji:"🐦"},
  {id:9,name:"Australian Raven",scientific:"Corvus coronoides",family:"Corvidae",size:"large",habitat:["urban","woodland","grassland"],colors:["black"],region:["NSW","east"],silhouette:"corvid",emoji:"🐦"},
  {id:10,name:"Tawny Frogmouth",scientific:"Podargus strigoides",family:"Podargidae",size:"medium",habitat:["urban","woodland","forest"],colors:["grey","brown"],region:["NSW","east"],silhouette:"owl",emoji:"🦉"},
  {id:11,name:"Eastern Rosella",scientific:"Platycercus eximius",family:"Psittaculidae",size:"medium",habitat:["woodland","urban"],colors:["red","yellow","blue","green"],region:["NSW","southeast"],silhouette:"parrot",emoji:"🦜"},
  {id:12,name:"Crimson Rosella",scientific:"Platycercus elegans",family:"Psittaculidae",size:"medium",habitat:["forest","woodland"],colors:["red","blue","black"],region:["NSW","southeast"],silhouette:"parrot",emoji:"🦜"},
  {id:13,name:"Australian King-Parrot",scientific:"Alisterus scapularis",family:"Psittaculidae",size:"medium",habitat:["forest","woodland"],colors:["red","green"],region:["NSW","east"],silhouette:"parrot",emoji:"🦜"},
  {id:14,name:"Silvereye",scientific:"Zosterops lateralis",family:"Zosteropidae",size:"small",habitat:["forest","urban","scrub"],colors:["olive","grey","white"],region:["NSW","southeast"],silhouette:"songbird",emoji:"🐦"},
  {id:15,name:"Willie Wagtail",scientific:"Rhipidura leucophrys",family:"Rhipiduridae",size:"small",habitat:["urban","woodland","grassland"],colors:["black","white"],region:["NSW","national"],silhouette:"songbird",emoji:"🐦"},
  {id:16,name:"Australian White Ibis",scientific:"Threskiornis molucca",family:"Threskiornithidae",size:"large",habitat:["wetlands","urban","coastal"],colors:["white","black"],region:["NSW","east"],silhouette:"ibis",emoji:"🦢"},
  {id:17,name:"Australian Brush-turkey",scientific:"Alectura lathami",family:"Megapodiidae",size:"large",habitat:["forest","scrub","urban"],colors:["black","red","yellow"],region:["NSW","east"],silhouette:"turkey",emoji:"🦃"},
  {id:18,name:"Pacific Black Duck",scientific:"Anas superciliosa",family:"Anatidae",size:"medium",habitat:["wetlands","coastal","urban"],colors:["brown","black"],region:["NSW","east"],silhouette:"duck",emoji:"🦆"},
  {id:19,name:"Welcome Swallow",scientific:"Hirundo neoxena",family:"Hirundinidae",size:"small",habitat:["urban","coastal","open"],colors:["blue","rust","white"],region:["NSW","national"],silhouette:"swallow",emoji:"🐦"},
  {id:20,name:"Little Corella",scientific:"Cacatua sanguinea",family:"Cacatuidae",size:"large",habitat:["urban","woodland","grassland"],colors:["white"],region:["NSW","national"],silhouette:"parrot",emoji:"🦜"}
];

const SALT = "oz-birdle-v1"; // change to reshuffle future calendar
const MAX_GUESSES = 6;

function todayGMT11String() { // Eastern Australian timezone
  const utc = new Date();
  const gmt12 = new Date(now.getTime() + 12 * 60 * 60 * 1000); //ms
  return new gmt12.toISOString().slice(0,10); // YYYY-MM-DD in UTC
}

function seededIndex(dateStr) {
  // simple deterministic hash -> index
  let h = 0;
  const s = dateStr + ":" + SALT;
  for (let i=0;i<s.length;i++) {
    h = (h * 33 + s.charCodeAt(i)) >>> 0;
  }
  return h % BIRDS.length;
}

function normaliseName(s) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function getTargetBird(dateStr) {
  const idx = seededIndex(dateStr);
  return BIRDS[idx];
}

function colorOverlap(a, b) {
  const setB = new Set(b);
  return a.filter(x => setB.has(x));
}
function arrayOverlap(a, b) {
  const setB = new Set(b);
  const inter = a.filter(x => setB.has(x));
  return {count: inter.length, values: inter};
}
function sizeDistance(a, b) {
  const ai = SIZE_ORDER.indexOf(a);
  const bi = SIZE_ORDER.indexOf(b);
  if (ai<0 || bi<0) return 2; // unknown treated as far
  return Math.abs(ai-bi);
}
function sizeDirection(a, b) {
  const ai = SIZE_ORDER.indexOf(a), bi = SIZE_ORDER.indexOf(b);
  if (ai<0 || bi<0) return 0;
  return Math.sign(bi - ai); // +1 target bigger than guess => up arrow
}

function compareBirds(guess, target) {
  const family = guess.family === target.family;
  const sizeDist = sizeDistance(guess.size, target.size);
  const sizeDir = sizeDirection(guess.size, target.size);
  const colorInter = colorOverlap(guess.colors, target.colors);
  const habitatInter = arrayOverlap(guess.habitat, target.habitat);
  const regionInter = arrayOverlap(guess.region, target.region);
  const silhouette = guess.silhouette === target.silhouette;
  return { family, sizeDist, sizeDir, colorInter, habitatInter, regionInter, silhouette };
}

function scoreToSquares(score) {
  // return 6 squares: family, size, colors, habitat, region, silhouette
  const squares = [];
  squares.push(score.family ? "🟩" : "⬜");
  if (score.sizeDist === 0) squares.push("🟩");
  else if (score.sizeDist === 1) squares.push("🟨");
  else squares.push("⬜");
  squares.push(score.colorInter.length>0 ? (score.colorInter.length >= Math.min(2, BIRDS.length) ? "🟩" : "🟨") : "⬜");
  squares.push(score.habitatInter.count>0 ? (score.habitatInter.count>=2?"🟩":"🟨") : "⬜");
  squares.push(score.regionInter.count>0 ? "🟨" : "⬜");
  squares.push(score.silhouette ? "🟩" : "⬜");
  return squares.join("");
}

function renderRow(guess, score) {
  const row = document.createElement('div');
  row.className = 'row';
  const header = document.createElement('div');
  header.className = 'row-header';
  const left = document.createElement('div');
  left.innerHTML = `<span class="name">${guess.name}</span> <span class="meta">(${guess.scientific})</span>`;
  const right = document.createElement('div');
  right.textContent = scoreToSquares(score);
  header.append(left, right);

  const grid = document.createElement('div');
  grid.className = 'row-grid';

  // Family
  grid.append(card(score.family ? 'green' : 'gray', guess.family, 'Family'));
  // Size
  let sizeLabel = guess.size;
  if (score.sizeDir>0) sizeLabel += ' ⬆️';
  else if (score.sizeDir<0) sizeLabel += ' ⬇️';
  grid.append(card(score.sizeDist===0? 'green' : (score.sizeDist===1? 'yellow' : 'gray'), sizeLabel, 'Size'));
  // Colours
  const colorBadge = score.colorInter.length>0 ? (score.colorInter.length>=2? 'green' : 'yellow') : 'gray';
  grid.append(card(colorBadge, guess.colors.join(', '), 'Colours'));
  // Habitat
  const habBadge = score.habitatInter.count>0 ? (score.habitatInter.count>=2? 'green' : 'yellow') : 'gray';
  grid.append(card(habBadge, guess.habitat.join(', '), 'Habitat'));
  // Region
  const regBadge = score.regionInter.count>0 ? 'yellow' : 'gray';
  grid.append(card(regBadge, guess.region.join(', '), 'Region'));
  // Silhouette
  grid.append(card(score.silhouette ? 'green' : 'gray', guess.silhouette, 'Silhouette'));

  row.append(header, grid);
  return row;
}

function card(badge, main, label) {
  const c = document.createElement('div');
  c.className = 'card';
  const square = document.createElement('span'); square.className = `square ${badge}`;
  const big = document.createElement('div'); big.className = 'big'; big.textContent = main;
  const cap = document.createElement('p'); cap.textContent = label;
  c.append(square, big, cap);
  return c;
}

// LocalStorage helpers
function lsKey(dateStr) { return `birdle-au:${dateStr}`; }
function getState(dateStr) {
  const raw = localStorage.getItem(lsKey(dateStr));
  if (!raw) return { guesses: [], done: false, win: false };
  try { return JSON.parse(raw); } catch {
    return { guesses: [], done: false, win: false };
  }
}
function setState(dateStr, state) {
  localStorage.setItem(lsKey(dateStr), JSON.stringify(state));
}

function updateStats(win, guessesCount) {
  const raw = localStorage.getItem('birdle-au:stats');
  const s = raw ? JSON.parse(raw) : { played: 0, wins: 0, dist: {1:0,2:0,3:0,4:0,5:0,fail:0} };
  s.played += 1;
  if (win) { s.wins += 1; s.dist[String(guessesCount)] += 1; }
  else { s.dist.fail += 1; }
  localStorage.setItem('birdle-au:stats', JSON.stringify(s));
}

function formatShareText(dateStr, attempts, rows) {
  const header = `Birdle AU ${dateStr} ${attempts}/${MAX_GUESSES}`;
  const grid = rows.map(r => r.squares).join("\n");
  const url = location.href;
  return `${header}\n${grid}\n${url}`;
}

function populateDatalist() {
  const list = document.getElementById('birdList');
  BIRDS.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.name;
    list.appendChild(opt);
  });
}

function showAnswer(target) {
  const card = document.getElementById('answerCard');
  card.classList.remove('hidden');
  card.innerHTML = `
    <h3>${target.emoji} ${target.name}</h3>
    <div class="meta"><em>${target.scientific}</em> — ${target.family}</div>
    <div class="tags">
      <span class="tag">Size: ${target.size}</span>
      <span class="tag">Colours: ${target.colors.join(', ')}</span>
      <span class="tag">Habitat: ${target.habitat.join(', ')}</span>
      <span class="tag">Region: ${target.region.join(', ')}</span>
      <span class="tag">Silhouette: ${target.silhouette}</span>
    </div>
  `;
}

function main() {
  const dateStr = todayUTCString();
  const target = getTargetBird(dateStr);
  const state = getState(dateStr);

  populateDatalist();

  const board = document.getElementById('board');
  const statusRow = document.getElementById('statusRow');
  const input = document.getElementById('guessInput');
  const guessBtn = document.getElementById('guessBtn');
  const shareBtn = document.getElementById('shareBtn');

  // Restore previous guesses
  const shareRows = [];
  if (state.guesses.length > 0) {
    state.guesses.forEach(name => {
      const g = BIRDS.find(b => normaliseName(b.name) === normaliseName(name));
      if (!g) return;
      const score = compareBirds(g, target);
      board.appendChild(renderRow(g, score));
      const squares = scoreToSquares(score);
      shareRows.push({ name: g.name, squares });
    });
  }

  if (state.done) {
    statusRow.textContent = state.win ? `You already solved it in ${state.guesses.length}!` : `Puzzle over. Better luck tomorrow!`;
    shareBtn.disabled = !state.win;
    showAnswer(target);
  }

  function submitGuess() {
    if (state.done) return;
    const raw = input.value;
    const name = raw.trim();
    if (!name) { statusRow.textContent = 'Type a bird name to guess.'; return; }
    const guess = BIRDS.find(b => normaliseName(b.name) === normaliseName(name));
    if (!guess) { statusRow.textContent = 'Bird not in list. Try a different common name.'; return; }
    if (state.guesses.map(normaliseName).includes(normaliseName(guess.name))) {
      statusRow.textContent = 'You already tried that bird.'; return;
    }

    const score = compareBirds(guess, target);
    board.appendChild(renderRow(guess, score));

    state.guesses.push(guess.name);

    // Win condition
    if (normaliseName(guess.name) === normaliseName(target.name)) {
      state.done = true; state.win = true;
      statusRow.textContent = `Correct! It's ${target.name}.`;
      updateStats(true, state.guesses.length);
      showAnswer(target);
      shareBtn.disabled = false;
    } else if (state.guesses.length >= MAX_GUESSES) {
      state.done = true; state.win = false;
      statusRow.textContent = `Out of guesses. The bird was ${target.name}.`;
      updateStats(false, state.guesses.length);
      showAnswer(target);
      shareBtn.disabled = true;
    } else {
      statusRow.textContent = `${MAX_GUESSES - state.guesses.length} guesses left.`;
    }

    const squares = scoreToSquares(score);
    shareRows.push({ name: guess.name, squares });
    setState(dateStr, state);
    input.value = '';
    input.focus();
  }

  guessBtn.addEventListener('click', submitGuess);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitGuess(); });

  // Help & Stats dialogs
  const helpDialog = document.getElementById('helpDialog');
  const statsDialog = document.getElementById('statsDialog');
  document.getElementById('helpBtn').addEventListener('click', () => helpDialog.showModal());
  document.getElementById('helpClose').addEventListener('click', () => helpDialog.close());
  document.getElementById('statsBtn').addEventListener('click', () => {
    const raw = localStorage.getItem('birdle-au:stats');
    const s = raw ? JSON.parse(raw) : { played: 0, wins: 0, dist: {1:0,2:0,3:0,4:0,5:0,fail:0} };
    document.getElementById('statsContent').innerHTML = `
      <p>Played: <strong>${s.played}</strong></p>
      <p>Wins: <strong>${s.wins}</strong></p>
      <p>Guess distribution:</p>
      <ul>
        <li>1️⃣ : ${s.dist[1]}</li>
        <li>2️⃣ : ${s.dist[2]}</li>
        <li>3️⃣ : ${s.dist[3]}</li>
        <li>4️⃣ : ${s.dist[4]}</li>
        <li>5️⃣ : ${s.dist[5]}</li>
        <li>❌ Fail: ${s.dist.fail}</li>
      </ul>
    `;
    statsDialog.showModal();
  });
  document.getElementById('statsClose').addEventListener('click', () => statsDialog.close());

  // Share
  shareBtn.addEventListener('click', async () => {
    const text = formatShareText(dateStr, state.guesses.length, shareRows);
    try {
      await navigator.clipboard.writeText(text);
      statusRow.textContent = 'Copied result to clipboard!';
    } catch (e) {
      statusRow.textContent = 'Copy failed. You can select and copy manually:';
      const pre = document.createElement('pre');
      pre.textContent = text;
      document.getElementById('game').appendChild(pre);
    }
  });
}

document.addEventListener('DOMContentLoaded', main);
