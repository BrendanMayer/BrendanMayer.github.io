# Game Dev Portfolio (Astro + Tailwind + MDX)
A modern, game-dev-inspired portfolio with blog, recent posts, and project cards.

## Features
- 🚀 Astro for speed, MDX for writing posts
- 🎮 Neon + CRT vibes with Tailwind
- 🧩 Components: RecentPosts, BlogCard, ProjectGrid
- 🗞️ RSS feed at `/rss.xml`
- 🏷️ Tags, dates, and MDX content collections
- 🔎 SEO-friendly, sitemap-ready (enable in astro.config if you like)

## Getting Started
```bash
npm install
npm run dev
# open http://localhost:4321
```

## Writing a blog post
Add a new file to `src/content/blog/` as `.mdx`:

```md
---
title: "My Post Title"
description: "One-liner summary"
pubDate: "2025-10-01"
tags: ["unity", "shaders"]
---

Your content in MDX/Markdown here.
```

## Customize
- Edit `src/data/projects.ts`
- Update nav links in `src/components/Nav.astro`
- Swap hero text in `src/pages/index.astro`
- Change site URL in `astro.config.mjs`

## Deploy
- Static-friendly. Deploy to Netlify, Vercel, GitHub Pages.
- Build with `npm run build` then serve `/dist`.
