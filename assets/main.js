async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

function sortPostsNewestFirst(posts) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getPostHref(post) {
  if (post.url) return post.url;
  return `/blog/post/?slug=${encodeURIComponent(post.slug)}`;
}

function renderPostCard(post) {
  const image = post.image || "/assets/images/profilepic.png";
  const tags = (post.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("");

  return `
    <a class="card" href="${getPostHref(post)}">
      <div class="card-thumb">
        <img src="${image}" alt="${post.title}">
      </div>
      <div class="card-body">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div class="meta-line">${formatDate(post.date)}${post.readingTime ? ` · ${post.readingTime}` : ""}</div>
        ${tags ? `<div class="card-meta">${tags}</div>` : ""}
      </div>
    </a>
  `;
}

function renderProjectCard(project) {
  const thumb = project.thumb || "/assets/images/profilepic.png";
  const stack = (project.stack || []).map(item => `<span class="tag">${item}</span>`).join("");

  return `
    <a class="card" href="${project.url || "#"}" target="_blank" rel="noreferrer">
      <div class="card-thumb">
        <img src="${thumb}" alt="${project.title}">
      </div>
      <div class="card-body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        ${stack ? `<div class="card-meta">${stack}</div>` : ""}
      </div>
    </a>
  `;
}

async function loadRecentPosts(count = 3) {
  const mount = document.querySelector("#recent-posts");
  if (!mount) return;

  try {
    const posts = sortPostsNewestFirst(await fetchJSON("/posts.json"));
    mount.innerHTML = posts.slice(0, count).map(renderPostCard).join("");
  } catch (error) {
    console.error(error);
    mount.innerHTML = `<div class="empty-state">Could not load recent posts.</div>`;
  }
}

async function loadAllPosts() {
  const mount = document.querySelector("#all-posts");
  if (!mount) return;

  try {
    const posts = sortPostsNewestFirst(await fetchJSON("/posts.json"));
    mount.innerHTML = posts.map(renderPostCard).join("");
  } catch (error) {
    console.error(error);
    mount.innerHTML = `<div class="empty-state">Could not load blog posts.</div>`;
  }
}

async function loadProjects() {
  const mount = document.querySelector("#projects");
  if (!mount) return;

  try {
    const projects = await fetchJSON("/projects.json");
    mount.innerHTML = projects.map(renderProjectCard).join("");
  } catch (error) {
    console.error(error);
    mount.innerHTML = `<div class="empty-state">Could not load projects.</div>`;
  }
}

async function loadBlogPostPage() {
  const articleMount = document.querySelector("#post-content");
  if (!articleMount) return;

  const titleMount = document.querySelector("#post-title");
  const descMount = document.querySelector("#post-description");
  const metaMount = document.querySelector("#post-meta");
  const heroImageMount = document.querySelector("#post-image");

  try {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    if (!slug) {
      articleMount.innerHTML = `<div class="empty-state">Missing blog post slug.</div>`;
      return;
    }

    const posts = await fetchJSON("/posts.json");
    const post = posts.find(item => item.slug === slug);

    if (!post) {
      articleMount.innerHTML = `<div class="empty-state">Post not found.</div>`;
      return;
    }

    document.title = `${post.title} | BRNDN.dev`;

    if (titleMount) titleMount.textContent = post.title;
    if (descMount) descMount.textContent = post.description || "";
    if (metaMount) {
      metaMount.innerHTML = `
        <span>${formatDate(post.date)}</span>
        ${post.readingTime ? `<span>· ${post.readingTime}</span>` : ""}
        ${post.tags?.length ? `<span>· ${post.tags.join(" · ")}</span>` : ""}
      `;
    }

    if (heroImageMount) {
      heroImageMount.innerHTML = post.image
        ? `<img src="${post.image}" alt="${post.title}">`
        : "";
    }

    if (!post.content) {
      articleMount.innerHTML = `<div class="empty-state">This post does not have a content file yet.</div>`;
      return;
    }

    articleMount.innerHTML = await fetchText(post.content);
  } catch (error) {
    console.error(error);
    articleMount.innerHTML = `<div class="empty-state">Could not load this post.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadRecentPosts();
  loadAllPosts();
  loadProjects();
  loadBlogPostPage();
});