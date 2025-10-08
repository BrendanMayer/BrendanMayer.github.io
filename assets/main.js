
// posts data is loaded from posts.json (generated).
async function loadRecent(count=3){
  try{
    const res = await fetch('./posts.json');
    const posts = await res.json();
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
    const res = await fetch('../posts.json');
    const posts = await res.json();
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
