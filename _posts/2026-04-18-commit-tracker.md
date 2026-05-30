---
layout: post
title: "Building a Real-Time Commit Tracker with Webhooks"
date: 2026-04-18
excerpt: "A lightweight event-driven dashboard that tracks GitHub commits in real time using webhooks, FastAPI, and a self-hosted backend."
image: /assets/images/commit-tracker/commit-tracker.png
tags:
  - Web Development
  - FastAPI
  - GitHub
  - Real-time Systems
---

This project is a real-time commit tracking dashboard inspired by the Facepunch development feed. The goal was to build a lightweight system that shows commit activity as it happens, without relying on constant polling or heavy API usage.

You can view the live version here: [Commit Tracker Dashboard](https://brendanmayer.github.io/commit-tracker/?page=1&page_size=20).

<figure>
  <img src="/assets/images/commit-tracker/commit-tracker.png" alt="Real-time commit tracker dashboard interface">
  <figcaption>The dashboard displays recent GitHub commit activity using an event-driven backend.</figcaption>
</figure>

## Why I built this

Most tools that display GitHub activity rely on polling APIs at intervals, which is inefficient and introduces delay. I wanted to build something more reactive, where updates appear shortly after a commit is pushed.

The idea was to create a system that listens for events instead of repeatedly asking for data. That led to an event-driven architecture built around GitHub webhooks.

## How it works

The system follows a simple flow:

- A commit is pushed to a repository.
- GitHub sends a webhook event.
- The backend receives and validates the request.
- The commit is stored in a database.
- The frontend fetches and displays the updated data.

Instead of constantly querying GitHub, the backend reacts to incoming push events. This makes the system more efficient and allows near real-time updates.

## Architecture

The project is split into a simple pipeline:

```text
GitHub → Webhook → Backend (FastAPI) → SQLite → Frontend (GitHub Pages)
```

Each part is intentionally minimal, keeping the system easy to understand and deploy.

## Backend implementation

The backend is built using FastAPI and runs on a self-hosted Ubuntu server. It handles incoming webhook requests, validates them using a shared secret, and stores commit data in a SQLite database.

The webhook endpoint verifies incoming requests using HMAC signatures before processing them, ensuring that only valid GitHub events are accepted.

Once validated, each commit is parsed and inserted into the database if it has not already been recorded. The system also tracks metadata such as repository, author, branch, and timestamp.

The dependencies are intentionally lightweight:

```text
fastapi
uvicorn
python-dotenv
```

This keeps the server easy to run and maintain.

## Real-time updates

To make the dashboard feel live, I implemented a streaming endpoint using Server-Sent Events. When a new commit is received, it is broadcast to all connected clients instantly.

The frontend listens to this stream and updates the UI without needing a full refresh. This approach avoids the extra complexity of WebSockets while still providing real-time behaviour.

## Frontend

The frontend is a static site hosted on GitHub Pages. It fetches initial data from the backend and then subscribes to the live event stream.

The API base URL is configured separately, allowing the frontend to remain static while pointing to a hosted backend:

```js
window.APP_CONFIG = {
  API_BASE: "https://yourdomain.com"
};
```

This separation makes deployment simple and keeps the frontend portable.

The interface displays:

- Recent commits in a live feed.
- Basic statistics such as commits, repositories, and contributors.
- A simple commit activity chart.

The UI is intentionally minimal, focusing on readability and real-time feedback rather than heavy visual design.

## Hosting setup

One of the more practical parts of this project was deployment. Instead of using a cloud provider, I hosted the backend on my own Ubuntu server at home.

This required:

- Purchasing a domain through Namecheap.
- Pointing the domain to my home network.
- Setting up port forwarding on my router.
- Running the FastAPI server on the machine.

The backend, database, environment variables, and dependencies are all hosted on this server, while the frontend remains on GitHub Pages.

This setup gave me full control over the system and helped me understand the networking side of deployment, including routing, DNS, and exposing services securely.

## Design decisions

A few key decisions shaped how the system works:

- No historical syncing, only track commits after startup.
- No API polling, everything is event-driven.
- Keep the stack minimal and easy to run.
- Prioritise responsiveness over feature complexity.

These constraints made the system simpler and easier to reason about while still achieving the main goal of real-time visibility.

## Challenges

The main challenges were around deployment and reliability rather than code complexity. Getting webhooks, domain routing, and port forwarding working correctly required more iteration than the application logic itself.

Handling edge cases like duplicate commits, invalid payloads, and filtering out irrelevant events also required care, but those became manageable once the core pipeline was in place.

## What I learned

This project was a good introduction to event-driven systems and how they differ from traditional request-based approaches. It also reinforced how useful simple tools like webhooks can be when used correctly.

On the practical side, hosting the backend myself forced me to deal with real deployment concerns, including networking, environment configuration, and service reliability.

It also showed how far you can get with a very small stack when the system is designed around a clear flow of data.

## Future improvements

- Filtering commits by repository or author.
- Switching to WebSockets for more flexible real-time updates.
- Pagination and improved data handling for larger datasets.
- Authentication for private dashboards.

Overall, this project was a focused attempt to build a real-time system from end to end, from GitHub events all the way to a live frontend. It ended up being a useful mix of backend development, frontend work, and real-world deployment experience.


## 30/05/2026 Improvements

Since first building the commit tracker, I have continued expanding the project beyond the original real-time feed. The frontend is now open source and available on GitHub: [Github Repo](https://github.com/BrendanMayer/commit-tracker).

A major improvement was turning the dashboard into a more complete repository activity viewer rather than just a simple commit list. I added repository-aware filtering and pagination, making it easier to browse larger sets of commits across tracked projects.

The commit cards have also been improved with clearer metadata, branch styling, repository indicators, hover effects, live update animations, and automatic commit categorisation. Commits can now be tagged based on branch names and message keywords, helping distinguish features, fixes, cleanup work, merges, and hotfixes at a glance.

I also added a dedicated branches view. This fetches real branch data through the GitHub API and displays it with grouped branch types, visual badges, and a more polished graph-style layout. This makes the dashboard feel less like a flat feed and more like a small visual map of repository activity.

Another new feature is contributor drilldowns. Contributor profiles now show commit counts, repository activity, branch participation, recent commits, and commit tag distribution. This gives more context around who is contributing and where their work is happening.

One of the bigger feature additions was support for video attachments on commit cards. Admin users can upload videos by dragging and dropping them onto commits, preview them directly in the feed, and remove them when needed. This makes it possible to attach visual progress updates, demos, or bug recordings directly to the commit timeline.

I also added a releases and patch notes system. Releases can be created per repository, commits can be grouped by version, and markdown patch notes can be generated and rendered directly in the UI. This turns the tracker into a lightweight release history tool as well as a live development feed.

The admin workflow has been improved too. Instead of relying on a simple upload API key prompt, the project now uses a username and password login flow for admin actions. I also added clearer admin state indicators, a logout button, custom login modal, and toast notifications so the interface feels less like a collection of browser alerts taped together in a hurry.

There has also been a lot of UI polish since the original version. The dashboard now includes glass-style panels, animated tab transitions, ambient gradients, glow effects, improved analytics chart tooltips, better video card formatting, a sticky pagination footer, and smoother live commit pulse animations.

Finally, I added proper public-facing project documentation, including setup notes, webhook setup information, API overview documentation, screenshots, a roadmap, contribution guidelines, and an MIT licence. The backend service remains private, but the frontend and documentation are now open source so the structure and interface can be explored publicly.

These changes have made the project feel much closer to a complete development activity dashboard. What started as a small real-time commit feed has grown into a more polished tool for tracking commits, branches, contributors, releases, and visual progress updates from one place.