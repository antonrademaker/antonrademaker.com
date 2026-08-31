# Copilot Instructions

This is a static site built with **Hugo** and hosted on GitHub Pages. All development work happens in the `src/www/` directory.

## Quick Start

```bash
cd src/www
npm ci
npm run dev
```

The site runs at `http://localhost:1313`.

## Build, Test, and Validation

### Build
```bash
cd src/www
npm run build
```
Output is written to `src/www/public/`.

### Run Tests
```bash
cd src/www
npm test
```

This runs the complete validation suite:
- Hugo production build (`hugo --minify`)
- HTML validation (html-validate)
- Accessibility checks (axe-core via Playwright)
- Browser testing (Chromium, Firefox, WebKit on desktop and mobile)
- Lighthouse CLI (accessibility 100%, SEO 100%, performance and best-practices ≥90%)

### Run Individual Tests
- **HTML validation only**: `npm run test:html`
- **Accessibility only**: `npm run test:a11y`
- **Lighthouse only**: `npm run test:lighthouse`
- **Development server**: `npm run dev` (includes `--buildDrafts` and `--disableFastRender`)
- **Production preview**: `npm run preview` (binds to 127.0.0.1)

## Project Architecture

**Content Structure:**
- `src/www/content/` - Site content and posts
- `src/www/layouts/` - Hugo templates
- `src/www/static/` - Static assets copied directly to published site
- `src/www/data/` - Data files (e.g., `socials.yaml`)
- `src/www/archetypes/` - Content templates (e.g., `posts.md`)

**Configuration:**
- `hugo.toml` - Hugo configuration (baseURL, title, locale, markup settings)
- `playwright.config.ts` - Playwright browser test config (Chrome, Firefox, WebKit, mobile profiles)
- `.htmlvalidate.json` - HTML validation rules
- `.github/workflows/site.yml` - CI/CD pipeline (build, test, deploy on push to main)

**Testing:**
- `src/www/tests/` - Playwright test suite
- `src/www/scripts/lighthouse.mjs` - Lighthouse CLI runner with quality gates

**Assets:**
- `src/www/static/fonts/` - Fraunces (600-700 weights) and Newsreader (400-700, normal and italic) under SIL Open Font License

## Key Conventions

### Hugo Configuration
- `baseURL = 'https://antonrademaker.github.io/'` — the site is deployed to a project repository (repo named `antonrademaker.github.io`)
- `unsafe = false` in markup.goldmark.renderer — HTML injection in markdown is disabled for safety
- Posts belong in `content/posts/` and use the `posts.md` archetype
- `[outputs] home = ['HTML']` disables Hugo's default site-wide RSS feed at `/index.xml`. The only feed is `/posts/index.xml` (RSS for the `posts` section), linked via `<link rel="alternate">` in `layouts/_partials/head.html` and visible links in `layouts/list.html` and `layouts/_partials/site-footer.html`

### Testing Requirements
Before pushing changes:
1. Run `npm test` in `src/www/` — all checks must pass
2. Do not commit Lighthouse reports or test artifacts (`.lighthouse/`, `test-results/`, etc.)
3. Lighthouse gates are strict: accessibility and SEO require 100%, performance and best-practices require ≥90%

### Pull Request Scope
- Keep unrelated formatting and refactoring out of the same PR
- Include content, accessibility, responsive-layout, and deployment considerations in PR description
- For visual or behavior changes, describe the affected page and reproduction steps

### Deployment
- GitHub Actions automatically validates and deploys `main` branch pushes to GitHub Pages
- The GitHub Pages source is configured as **GitHub Actions** (not a `docs/` or `gh-pages` branch)
- Generated `public/` directory is uploaded as a Pages artifact

## Common Tasks

**Create a new post:**
```bash
cd src/www
hugo new content/posts/my-post.md
```
Posts created with `hugo new` are marked as draft by default; remove `draft: true` when ready.

**Modify templates or styling:**
- Edit files in `src/www/layouts/`
- Run `npm run dev` to preview changes with live reload
- Run `npm test` before pushing to ensure accessibility and Lighthouse gates pass

**Update site metadata or social links:**
- Edit `src/www/hugo.toml` for site configuration
- Edit `src/www/data/socials.yaml` for social links
- Changes are picked up on next Hugo build

## Known Constraints

- **No custom script injection** — `markup.goldmark.renderer.unsafe = false` prevents raw HTML in markdown
- **Responsive design required** — Playwright tests desktop (Chrome, Firefox, WebKit) and mobile profiles (Pixel 5, iPhone 13)
- **Local fonts** — Typography is served from the repository; no external font CDNs
