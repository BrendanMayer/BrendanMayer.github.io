
// Utility: fetch JSON with better errors
async function fetchJSON(url){
  const res = await fetch(url, { cache: "no-store" });
  if(!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.json();
}

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
  }catch(e){
    console.error(e);
  }
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
  }catch(e){
    console.error(e);
  }
}

async function loadProjects(){
  try{
    const projects = await fetchJSON('/projects.json');
    const wrap = document.querySelector('#projects');
    if(!wrap) return;
    wrap.innerHTML = projects.map(p => `
      <a class="card" href="${p.url || '#'}">
        <div style="aspect-ratio:16/9;background:rgba(0,0,0,.4);border-radius:12px;border:1px solid rgba(255,255,255,.1);display:grid;place-items:center;margin-bottom:12px">
          <span style="opacity:.7">${p.thumb ? `<img src="${p.thumb}" alt="" style="max-width:100%;border-radius:12px">` : 'Preview'}</span>
        </div>
        <h3>${p.title}</h3>
        <p style="opacity:.8">${p.description}</p>
        <p style="opacity:.6;font-size:12px;margin-top:8px">${(p.stack||[]).join(' · ')}</p>
      </a>
    `).join('');
  }catch(e){
    console.error(e);
  }
}

// Auto-run on DOM ready if containers exist
document.addEventListener('DOMContentLoaded', () => {
  if(document.querySelector('#recent')) loadRecent(3);
  if(document.querySelector('#all-posts')) loadAll();
  if(document.querySelector('#projects')) loadProjects();
});
