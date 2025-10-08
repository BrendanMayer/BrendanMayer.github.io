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

/* ===== Retro GitHub Stats Dashboard (with Top Languages) ===== */
async function loadGitHubStats(username = "BrendanMayer") {
  const container = document.querySelector("#github-stats");
  if (!container) return;

  try {
    // get main user info
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error(`GitHub API error: ${userRes.status}`);
    const user = await userRes.json();

    // get repos for language stats
    const repoRes = await fetch(user.repos_url + "?per_page=100");
    const repos = await repoRes.json();

    // tally languages
    const langCount = {};
    for (const repo of repos) {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    }

    // sort by count
    const topLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const createdDate = new Date(user.created_at);
    const createdFormatted = createdDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short"
    });

    const langLines =
      topLangs.length > 0
        ? topLangs
            .map(([lang, count]) => {
              const bar = "█".repeat(Math.min(count, 10));
              return `<div class="line"><span>${lang}:</span><span style="color:#39ff14">${bar}</span></div>`;
            })
            .join("")
        : `<div class="line"><span>No data</span></div>`;

    container.innerHTML = `
      <div class="github-stats">
        <h3>GITHUB STATS — @${user.login}</h3>
        <div class="line"><span>Repositories:</span><span>${user.public_repos}</span></div>
        ${langLines}
        <div class="line"><span>Created:</span><span>${createdFormatted}</span></div>
        <div class="line"><span>Profile:</span><span><a href="${user.html_url}" target="_blank" style="color:#39ff14">View →</a></span></div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <div class="github-stats">
        <h3>GITHUB STATS</h3>
        <div style="opacity:.6;">Unable to load data</div>
      </div>
    `;
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

