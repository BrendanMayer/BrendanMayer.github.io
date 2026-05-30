---
date: '2026-05-30'
excerpt: How I built Blogsmith, a PySide6 desktop app for writing, previewing, validating,
  and publishing Jekyll blog posts directly to my portfolio site.
image: /assets/images/blogsmith/blogsmith.png
layout: post
published: true
tags:
- Python
- PySide6
- Jekyll
- GitHub Pages
- Developer Tools
title: 'Building Blogsmith: A Desktop Writing Tool for My Portfolio'
---

Blogsmith started as a very practical problem: I wanted a better way to write and publish blog posts for my portfolio site without manually creating Markdown files, checking front matter, moving drafts, and remembering the exact folder structure every time.

My portfolio is built with Jekyll and GitHub Pages, so the publishing flow is straightforward in theory: create a Markdown file, add front matter, place it in `_posts`, commit it, and push it to GitHub. In practice, that process still creates a lot of tiny points of friction. I wanted to remove as many of those as possible and build something I would actually use.

Blogsmith is the result: a desktop blog creation tool built with Python and PySide6 that lets me create drafts, edit Markdown, preview posts live, validate content, and publish directly to my portfolio repository.

I have also included all the source code as well as some exe build releases on the github repository which is free to access here -> [Blogsmith Github Repo](https://github.com/BrendanMayer/blogsmith).

<figure>
  <img src="/assets/images/blogsmith/blogsmith.png" alt="Blogsmith desktop application showing the editor and live preview interface">
  <figcaption>Blogsmith gives me a dedicated writing and publishing workflow for my Jekyll portfolio blog.</figcaption>
</figure>

## Why I built it

Before Blogsmith, writing a post meant jumping between my editor, the file explorer, the browser, Git, and my portfolio repository. None of those steps were especially difficult, but together they made the process feel more manual than it needed to be.

I wanted a tool that could handle the repetitive parts:

- Creating a correctly named draft.
- Adding the right Jekyll front matter.
- Keeping posts and drafts organized.
- Previewing the Markdown while writing.
- Validating posts before publishing.
- Moving a draft into `_posts`.
- Committing and optionally pushing the finished post.

The main goal was not to build a large CMS. I wanted something smaller, local, and tailored to my own workflow. A focused desktop tool made more sense than a web dashboard because the app is designed to work directly with a local Git repository.

## Choosing the stack

I built Blogsmith in Python using PySide6 for the desktop interface. Python made sense because the app needed to work with files, parse Markdown/front matter, run Git commands, and stay simple enough to maintain.

PySide6 gave me a native desktop-style interface without needing to build a full web app. The GUI could stay lightweight while still supporting a real editor, dialogs, buttons, lists, and a live preview panel.

The core pieces are:

- **Python** for the application logic.
- **PySide6** for the desktop GUI.
- **python-frontmatter** for reading and writing Jekyll front matter.
- **Markdown** for rendering previews.
- **Git** for committing and pushing posts.
- **PyInstaller** for building a Windows executable.
- **GitHub Actions** for publishing the executable as a GitHub Release.

It is not a complicated stack, but that was the point. I wanted the tool to be useful, understandable, and easy to extend.

## Draft creation

The first workflow I focused on was creating new blog drafts. A good draft needs a title, tags, an excerpt, and the correct front matter. It also needs to be saved in the right folder using a clean filename.

Blogsmith handles that through a New Draft dialog. The dialog asks for the core metadata, then generates the Markdown file automatically.

<figure>
  <img src="/assets/images/blogsmith/new-draft-dialog.png" alt="Blogsmith new draft dialog with fields for title, tags, and excerpt">
  <figcaption>The draft dialog collects the metadata needed to create a valid Jekyll blog post.</figcaption>
</figure>

I added tooltips and placeholder examples to make each field clearer. One small but important example is the excerpt field. It is easy to forget what an excerpt is for when you are just trying to write, so the app explains that it is used for blog cards, previews, summaries, and metadata.

That kind of detail matters because the app is not just for generating files. It is meant to make the writing workflow feel smoother.

## Live preview

One of the biggest improvements was replacing the old separate preview window with a side-by-side live preview. Earlier versions opened a separate dialog, which worked but felt clunky. I wanted the preview to live beside the editor and update as I typed.

The v4/v5 interface uses a split layout: the Markdown editor on one side and a live rendered preview on the other. The preview updates after a short delay whenever the editor content changes.

That made the app feel much more like a real writing tool. I can now write, check formatting, confirm image placement, and review the post structure without constantly switching windows.

## Jekyll-focused publishing

Blogsmith is built around the way Jekyll handles blog posts. Drafts live in `_drafts`, published posts live in `_posts`, and each post uses YAML front matter.

A typical post created by Blogsmith looks like this:

```markdown
---
layout: post
title: "Building Blogsmith: A Desktop Writing Tool for My Portfolio"
date: 2026-05-30
excerpt: "How I built Blogsmith, a PySide6 desktop app for writing, previewing, validating, and publishing Jekyll blog posts directly to my portfolio site."
image: /assets/images/blogsmith/blogsmith.png
tags:
  - Python
  - PySide6
  - Jekyll
  - GitHub Pages
  - Developer Tools
---

Post content goes here.
```

When a draft is published, Blogsmith moves it into `_posts` using the correct Jekyll filename format:

```text
YYYY-MM-DD-post-title.md
```

That makes the post available to the portfolio site automatically after GitHub Pages rebuilds.

## Settings and reusable configuration

One important change was making the app configurable. At first, Blogsmith was mostly built around my own portfolio repository. That worked for me, but it meant nobody else could use it without editing config files or changing code.

To fix that, I added a settings window. The app now lets the user choose their local portfolio repository, drafts folder, posts folder, image assets folder, Git branch, remote name, and auto-push preference.

<figure>
  <img src="/assets/images/blogsmith/settings-dialog.png" alt="Blogsmith settings dialog for configuring the portfolio repository and publishing options">
  <figcaption>The settings dialog lets Blogsmith work with different portfolio repositories instead of being hardcoded to mine.</figcaption>
</figure>

This changed Blogsmith from a personal script with a GUI into something closer to a reusable app. It also made the Windows executable much more useful, because someone can download it, open it, point it at their own Jekyll site, and start writing.

## Validation before publishing

Another feature I wanted was basic validation. Before publishing, Blogsmith checks the post for common issues, such as missing front matter or required metadata.

This is not meant to replace a full Jekyll build, but it catches simple mistakes early. That matters because publishing broken Markdown to a portfolio site is exactly the kind of tiny mistake that somehow waits until you show someone the site.

Validation also gives the workflow a clearer structure:

1. Write the draft.
2. Preview the post.
3. Validate it.
4. Publish it.
5. Commit and optionally push it.

That sequence makes the app feel more deliberate and reduces the chance of publishing half-finished content.

## Git integration

Since the portfolio is a GitHub Pages site, Blogsmith also includes Git integration. After publishing a post locally, the app can commit the new file and push it to GitHub.

The app uses the user’s existing local Git authentication rather than handling GitHub login itself. That keeps the tool simpler and avoids storing tokens or credentials inside the app.

The publishing flow is:

```text
Draft Markdown
    ↓
Validate post
    ↓
Move to _posts
    ↓
Git add
    ↓
Git commit
    ↓
Optional Git push
```

This fits naturally with a GitHub Pages workflow because the site rebuilds after the repository is updated.

## Building the Windows executable

For distribution, I added a PyInstaller build process. The goal was to create a Windows `.exe` so Blogsmith could be used without running Python commands manually.

I also set up a GitHub Actions workflow that builds the executable whenever I push a version tag. The workflow installs the app, runs PyInstaller, creates the `.exe`, and attaches it to a GitHub Release.

That release workflow makes versioning cleaner. Instead of manually building and uploading files, I can tag a release like:

```bash
git tag v5.0.0
git push origin v5.0.0
```

Then GitHub Actions handles the rest.

## UI polish

The most recent version focused heavily on making the interface feel more professional. Earlier versions worked, but the layout was very plain. For v5, I redesigned the UI with a darker theme, cleaner spacing, better panels, and a more polished sidebar.

The goal was to make Blogsmith feel like a tool I would actually want to open when writing portfolio posts. Small interface improvements made a big difference: clearer buttons, better visual hierarchy, card-style panels, and a more readable preview area.

This was also a useful reminder that developer tools still need design. A tool can be technically useful and still feel unpleasant to use if the interface is messy.

## What I learned

This project taught me a lot about building small tools around real workflows. Blogsmith is not technically huge, but it connects several useful pieces: desktop UI, Markdown rendering, Jekyll conventions, file management, Git automation, app settings, and release builds.

The biggest lesson was that workflow tools are most useful when they remove small repeated annoyances. None of the individual steps in publishing a Jekyll blog post are difficult, but doing them manually every time adds friction. Blogsmith removes that friction and makes blogging feel more like writing and less like file management.

I also learned that making a tool reusable requires thinking beyond my own machine. Adding settings, configurable paths, branch names, remote names, and a first-run setup flow made the app much more complete.

## Future improvements

There are still several things I would like to add:

- An Insert Image button that copies images into the correct blog assets folder.
- Better image path handling for posts with multiple screenshots.
- A local Jekyll build/test button.
- Draft search and filtering.
- A more advanced Markdown toolbar.
- Optional templates for different types of posts.
- Better release notes inside the app.

The image workflow is probably the next most useful feature. Since many of my portfolio posts use screenshots, it would be helpful if Blogsmith could copy selected images into a post-specific folder and insert the correct Markdown automatically.

## Final thoughts

Blogsmith started as a small helper for my own portfolio, but it grew into a proper desktop publishing workflow. It now gives me a clean way to create, preview, validate, and publish posts without leaving the app.

More importantly, it makes me more likely to write. That is the real value of the project. A portfolio blog is only useful if I actually keep adding to it, and Blogsmith removes enough friction that writing posts feels easier to start.

It is a small tool, but it solves a real problem in my own workflow. That makes it one of the more satisfying developer tools I have built.