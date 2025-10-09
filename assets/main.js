// ---------- helpers ----------
async function fetchJSON(url){
  const res = await fetch(url, { cache: "no-store" });
  if(!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.json();
}

// ---------- blog cards ----------
async function loadRecent(count=3){
  try{
    const posts = await fetchJSON('/posts.json');
    const recent = posts.slice(0,count);
    const wrap = document.querySelector('#recent');
    if(!wrap) return;
    wrap.innerHTML = recent.map(p => `
      <a class="card" href="${p.url}">
        <h3>${p.title}</h3>
        <p style="opacity:.8">${p.description}</p>
        <p style="opacity:.6;font-size:12px;margin-top:8px">${p.date}</p>
      </a>
    `).join('');
  }catch(e){ console.error(e); }
}

async function loadAll(){
  try{
    const posts = await fetchJSON('/posts.json');
    const wrap = document.querySelector('#all-posts');
    if(!wrap) return;
    wrap.innerHTML = posts.map(p => `
      <a class="card" href="${p.url}">
        <h3>${p.title}</h3>
        <p style="opacity:.8">${p.description}</p>
        <p style="opacity:.6;font-size:12px;margin-top:8px">${p.date}</p>
      </a>
    `).join('');
  }catch(e){ console.error(e); }
}

// ---------- projects grid ----------
async function loadProjects(){
  try{
    const projects = await fetchJSON('/projects.json');
    const wrap = document.querySelector('#projects');
    if(!wrap) return;
    wrap.innerHTML = projects.map(p => `
      <a class="card" href="${p.url || '#'}">
        <div style="aspect-ratio:16/9;background:rgba(0,0,0,.4);border-radius:12px;border:1px solid rgba(255,255,255,.1);display:grid;place-items:center;margin-bottom:12px">
          ${p.thumb ? `<img src="${p.thumb}" alt="" style="max-width:100%;border-radius:12px">` : `<span style="opacity:.7">Preview</span>`}
        </div>
        <h3>${p.title}</h3>
        <p style="opacity:.8">${p.description}</p>
        <p style="opacity:.6;font-size:12px;margin-top:8px">${(p.stack||[]).join(' · ')}</p>
      </a>
    `).join('');
  }catch(e){ console.error(e); }
}

// ---------- power-on boot overlay ----------
function bootSequence(){
  // create overlay elements dynamically so you don't need to edit HTML files
  if(document.getElementById('boot-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'boot-overlay';
  const inner = document.createElement('div');
  inner.id = 'boot-inner';
  const skip = document.createElement('div');
  skip.className = 'boot-skip';
  skip.textContent = 'Press any key to skip';
  overlay.appendChild(inner);
  overlay.appendChild(skip);
  document.body.appendChild(overlay);

  // show once per session
  if(sessionStorage.getItem('booted') === '1'){ return; }

  overlay.style.display = 'block';

  const lines = [
    "BRNDN-8086 BIOS v1.3  © 1984-2025",
    "Memory Test ..................... OK",
    "Disk 0: NEON-GRID SSD .......... OK",
    "Video: CRTmode x 90Hz .......... OK",
    "Initializing input devices ..... OK",
    "Mounting /home/brendan ......... OK",
    "Booting portfolio OS ........... READY",
    "",
    "Press any key to continue_"
  ];

  let i = 0;
  function addNext(){
    if(i >= lines.length){ done(); return; }
    const div = document.createElement('div');
    div.className = 'boot-line';
    div.textContent = lines[i++];
    inner.appendChild(div);
    requestAnimationFrame(()=> div.classList.add('show'));
    const delay = 180 + Math.random()*120;
    setTimeout(addNext, delay);
  }

  function done(){
    sessionStorage.setItem('booted', '1');
    overlay.style.opacity = '1';
    overlay.style.transition = 'opacity .35s ease';
    setTimeout(()=>{ overlay.style.opacity='0'; setTimeout(()=> overlay.style.display='none', 350); }, 400);
  }
  function skipNow(){ done(); }

  overlay.addEventListener('click', skipNow);
  document.addEventListener('keydown', ()=>{ if(overlay.style.display==='block') skipNow(); });

  addNext();
}

// ---------- init ----------
document.addEventListener('DOMContentLoaded', () => {
  // keep your normal navbar as-is
  bootSequence();

  if(document.querySelector('#recent')) loadRecent(3);
  if(document.querySelector('#all-posts')) loadAll();
  if(document.querySelector('#projects')) loadProjects();
});

/* ===== Retro GitHub Stats Dashboard (cached + errors shown) ===== */
async function loadGitHubStats(username = "BrendanMayer") {
  const mount = document.querySelector("#github-stats");
  if (!mount) return;

  function renderError(msg) {
    mount.innerHTML = `
      <div class="github-stats">
        <h3>GITHUB STATS — @${username}</h3>
        <div style="opacity:.7">${msg}</div>
      </div>`;
  }

  // simple cache
  const KEY = `gh-stats:${username}`;
  const now = Date.now();
  try {
    const cached = JSON.parse(localStorage.getItem(KEY) || "null");
    if (cached && (now - cached.time) < 60 * 60 * 1000) {
      return renderFromData(cached.data);
    }
  } catch {}

  try {
    // user info
    const userRes = await fetch(`https://api.github.com/users/${username}`, { cache: "no-store" });
    if (!userRes.ok) {
      const text = await userRes.text();
      throw new Error(`User API ${userRes.status}: ${text}`);
    }
    const user = await userRes.json();

    // repos for languages
    const repoRes = await fetch(`${user.repos_url}?per_page=100&sort=updated`, { cache: "no-store" });
    if (!repoRes.ok) {
      const text = await repoRes.text();
      throw new Error(`Repos API ${repoRes.status}: ${text}`);
    }
    const repos = await repoRes.json();

    // tally languages by repo count
    const counts = {};
    for (const r of repos) if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);

    const created = new Date(user.created_at);
    const data = { login:user.login, url:user.html_url, repos:user.public_repos, created, top };

    // cache
    try { localStorage.setItem(KEY, JSON.stringify({ time: now, data })); } catch {}

    renderFromData(data);

  } catch (err) {
    console.error("GitHub stats error:", err);
    // show human message for rate limiting
    if (String(err).includes("403")) {
      renderError("Rate limited by GitHub (unauthenticated). Try again in a minute.");
    } else {
      renderError("Unable to load data.");
    }
  }

  function renderFromData(d) {
    const createdFormatted = d.created.toLocaleDateString(undefined, { month:"short", year:"numeric" });
    const langs = d.top.length
      ? d.top.map(([lang,count]) => {
          const bar = "█".repeat(Math.min(count, 10));
          return `<div class="line"><span>${lang}:</span><span style="color:#39ff14">${bar}</span></div>`;
        }).join("")
      : `<div class="line"><span>No language data</span></div>`;

    mount.innerHTML = `
      <div class="github-stats">
        <h3>GITHUB STATS — @${d.login}</h3>
        <div class="line"><span>Repositories:</span><span>${d.repos}</span></div>
        ${langs}
        <div class="line"><span>Created:</span><span>${createdFormatted}</span></div>
        <div class="line"><span>Profile:</span><span><a href="${d.url}" target="_blank" style="color:#39ff14">View →</a></span></div>
      </div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#github-stats")) loadGitHubStats();
});

/* ===== Glowing Card Hover: cursor glow + tilt ===== */
function initGlowingCards() {
  const cards = Array.from(document.querySelectorAll('.card'));
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;

  cards.forEach((card) => {
    // Enable tilt only for non-touch + non-reduced-motion
    if (!reduceMotion && !isTouch) card.setAttribute('data-tilt', '1');

    let raf = null;

    function setFromEvent(e) {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      // cursor glow position
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);

      if (card.getAttribute('data-tilt') !== '1') return;

      // Normalize to [-0.5..0.5]
      const nx = (x / r.width) - 0.5;
      const ny = (y / r.height) - 0.5;

      // Clamp tilt angles
      const maxTilt = 6; // degrees
      const rx = (-ny * maxTilt).toFixed(2) + 'deg';
      const ry = ( nx * maxTilt).toFixed(2) + 'deg';

      // Lift a tiny bit when hovered
      const ty = '-3px';

      if (!raf) {
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--rx', rx);
          card.style.setProperty('--ry', ry);
          card.style.setProperty('--ty', ty);
          raf = null;
        });
      }
    }

    function reset() {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
      card.style.removeProperty('--ty');
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    }

    card.addEventListener('mousemove', setFromEvent);
    card.addEventListener('mouseenter', setFromEvent);
    card.addEventListener('mouseleave', reset);
    window.addEventListener('scroll', () => { if (raf) { cancelAnimationFrame(raf); raf = null; } }, { passive: true });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // keep your existing initializers
  if (document.querySelector('#recent')) loadRecent(3);
  if (document.querySelector('#all-posts')) loadAll();
  if (document.querySelector('#projects')) loadProjects();

  // new: glow/tilt cards
  initGlowingCards();
});

/* ===== Parallax CRT Scanlines + Depth Motion ===== */
function initParallaxCRT() {
  const wrapper = document.querySelector('.parallax-wrap');
  const bgLayer = document.createElement('div');
  bgLayer.className = 'parallax-layer parallax-bg';
  if (!wrapper) return;

  wrapper.prepend(bgLayer);

  let mouseX = 0, mouseY = 0;
  const strength = 15; // adjust for intensity

  function updateParallax() {
    const rx = (mouseY / window.innerHeight - 0.5) * strength;
    const ry = (mouseX / window.innerWidth - 0.5) * strength;
    bgLayer.style.transform = `rotateX(${rx}deg) rotateY(${-ry}deg)`;
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    requestAnimationFrame(updateParallax);
  });

  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const offset = scrollY * 0.05;
    bgLayer.style.transform = `translateY(${offset}px)`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParallaxCRT();
});

