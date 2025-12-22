# originthinking-site — Deployment + Operations Guide

This repository is the **source of truth** for the Origin Thinking™ static website.

Cloudflare Pages pulls from this repo and deploys automatically when changes are merged into the **production branch**.

---

## Quick facts (pin these)

- **Repo:** `originthinking-site`
- **Production branch:** `main`
- **Hosting:** Cloudflare Pages (GitHub integration)
- **Production domain:** `originthinking.com` (and `www.originthinking.com`)
- **Cloudflare Pages project name:** `originthinking-site` (as shown in Cloudflare)

---

## Where files live

This is a static site. There is no build step unless you intentionally add one.

Common patterns in this repo:

- `index.html` (site homepage)
- `/assets/` (images, icons, downloadable files, fonts, etc.)
- `/<page>/index.html` (directory-style pages, if used)
- `_headers` and `_redirects` (Cloudflare Pages routing/security headers, if you use them)

If you are unsure where the site root is, check Cloudflare Pages:
**Settings → Builds & deployments → Build settings → Build output directory**
- For a simple static site it is typically `/` (repo root).

---

## Normal deploy workflow (GitHub → Cloudflare Pages)

### 1) Make changes in a branch
In GitHub, create a branch from `main`, for example:

- `fix/mobile-nav`
- `add/new-article-dec-2025`
- `seasonal/halloween-2026`

Make your edits, commit, and push.

### 2) Open a Pull Request into `main`
- PR title should describe the outcome, not the files changed.
- Include a short checklist in the PR description if helpful:
  - [ ] Site loads on desktop
  - [ ] Site loads on mobile
  - [ ] Key pages render (Home, Articles, OPS Tools, etc.)
  - [ ] No console errors on critical pages
  - [ ] New assets load (images, CSS, JS)

### 3) Merge PR into `main`
Merging into `main` is what triggers the **production deployment** in Cloudflare Pages.

### 4) Confirm Cloudflare deployed
In Cloudflare:
**Workers & Pages → (project) `originthinking-site` → Deployments**
- Find the newest deployment for `main`
- Confirm status is ✅ success
- Click **Visit** to verify

---

## Preview deploy workflow (optional)

If Cloudflare Pages previews are enabled, opening a PR will create a **Preview Deployment**.

Use Preview Deployments for:
- Risky layout changes
- Anything affecting routing or shared CSS
- New embeds (YouTube, MailerLite, BookAuthority, etc.)

If you do not use previews, you can disable them:
Cloudflare Pages → **Settings → Builds & deployments → Preview deployments**

---

## Rollback procedure (fast recovery)

If something breaks in production:

1. Cloudflare Pages → `originthinking-site` → **Deployments**
2. Find the last known good production deployment
3. Use **Rollback / Redeploy** (label varies by UI)
4. Confirm the site is restored

Then fix forward in GitHub with a proper PR.

**Do not** try to “hotfix” by randomly editing production files outside GitHub.
GitHub should remain the source of truth.

---

## Local testing (before you merge)

Because this is static HTML/CSS/JS, you can test locally with any static server.

### Option A: VS Code Live Server
- Install the “Live Server” extension
- Right-click `index.html` → “Open with Live Server”

### Option B: Python simple server
From the repo root:

```bash
python -m http.server 8000
```

Then open:
- http://localhost:8000/

### What to verify locally
- Navigation works (desktop + mobile)
- CSS loads (no 404 for `.css`)
- JS loads (no 404 for `.js`)
- Images load (no 404 for `.png/.jpg/.svg`)
- Embeds load (YouTube/MailerLite/etc.)
- Any special paths like `/lean-quest/` still work if present

---

## Common “site is broken” causes and how to spot them

### 1) Wrong paths (absolute vs relative)
Symptoms:
- CSS missing
- JS not executing
- images not loading

Check browser DevTools → Network tab:
- Look for 404s on `.css`, `.js`, or images.

Rules of thumb:
- If your site is served at the domain root, `/assets/...` works.
- If you serve a sub-app at a subpath (like `/lean-quest/`), be careful with absolute `/` paths.

### 2) Cache issues
If the site looks unchanged after a deploy:
- Cloudflare → purge cache for the affected paths (or full purge if needed)
- Hard refresh: Ctrl+F5 in browser

### 3) CSP / security headers blocking embeds
If YouTube or MailerLite embeds show blank:
- Check `_headers` Content-Security-Policy settings
- Verify allowed script/frame sources include the embed domains you use

### 4) Service Worker caching stale assets (if you use a PWA)
If you have `service-worker.js`:
- Update the cache version
- Confirm the SW is not caching old `index.html` or assets unintentionally

---

## DNS and domain notes (Cloudflare)

You are already using Cloudflare DNS. Typical setup:
- `originthinking.com` and `www` point to Cloudflare Pages
- Cloudflare manages TLS

If you change the Pages project or default Pages domain, re-check:
Cloudflare Pages → **Custom domains**

---

## Repository settings (recommended)

### Keep `main` safe
Recommended protections for `main` (if you can enforce them on your plan/repo type):
- Require PR before merge
- Block force pushes
- Optionally require at least 1 approval

If GitHub shows “not enforced for private repositories unless you upgrade,” you have choices:
- Keep repo **private** and accept limited enforcement
- Make repo **public** to enable the enforcement you need on the free plan (tradeoffs below)
- Upgrade GitHub plan

### Public vs Private: practical tradeoffs
Making this repo public means:
- Anyone can view and fork your code and **any assets stored in the repo**
- Your Cloudflare deployment still works the same
- Anything you commit (images, PDFs, templates) becomes public if it’s in this repo

**Recommendation:** Only make the repo public if you are comfortable with everything inside it being public.

If you want code public but keep downloads private, separate repos:
- `originthinking-site` (public website code)
- `originthinking-private-assets` (private, not deployed publicly)
Or keep it private and rely on Cloudflare + your own discipline.

---

## Where to put this README

Put this file at:

- **Repo root:** `originthinking-site/README.md`

That is the default location GitHub shows on the repo homepage.
No other changes needed.

---

## Recovery checklist (if something goes wrong)

1. Identify what broke (paths? CSS? JS? embeds?)
2. Roll back in Cloudflare Pages to last good deploy
3. Fix in GitHub on a branch
4. PR to `main`
5. Confirm deploy and verify on production
