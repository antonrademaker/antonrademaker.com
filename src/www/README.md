# antonrademaker.com

The static personal website of Anton Rademaker, built with Hugo and hosted on GitHub Pages. Typography is served locally from the repository under the SIL Open Font License. Fraunces covers heading weights 600-700; Newsreader covers body weights 400-700 in both normal and italic styles, including bold italic.

## Local development

Install the development dependencies and start Hugo's local server:

```text
npm install
npm run dev
```

The site is available at `http://localhost:1313`.

Create a production build with `npm run build`. The generated site is written to `public/`.

## Tests

`npm test` builds the site and runs:

- HTML validation
- axe-core accessibility checks
- Chromium, Firefox, and WebKit browser checks on desktop and mobile profiles
- Keyboard focus, reduced-motion, responsive overflow, link-attribute, and content checks
- Lighthouse CLI accessibility and SEO gates, with performance and best-practices thresholds

Playwright supports the WebKit project on Windows, Linux, and macOS. It uses Playwright's WebKit build rather than Apple's branded Safari.

The Lighthouse check uses the standalone Lighthouse CLI. It starts a temporary Hugo server, writes HTML and JSON reports to `.lighthouse/`, fails for accessibility or SEO scores below 100%, and warns for performance or best-practices scores below 90%.

## RSS feed

Blog posts publish an RSS 2.0 feed at `/posts/index.xml`, generated automatically by Hugo from the `posts` section. The feed is linked via `<link rel="alternate" type="application/rss+xml">` in the page head (`layouts/_partials/head.html`), and visible links appear on the posts list page and in the site footer. Hugo also generates taxonomy feeds (e.g. `/tags/hugo/index.xml`, `/categories/index.xml`) via the same `list.html` template; these are intentional and not disabled. Only the site-wide feed at `/index.xml` is disabled (`[outputs] home = ['HTML']` in `hugo.toml`).

## Writing posts

Future posts belong in `content/posts/`. Create one with:

```text
hugo new content/posts/my-first-post.md
```

The post archetype supplies title, date, draft status, description, and tags. The post layout and Blog navigation link are already present, so published posts are available from the site's primary navigation.

## Deployment and domains

The GitHub Actions workflow builds and tests changes on pull requests and pushes to `main`. A successful push deploys the `public/` directory to GitHub Pages.

Enable GitHub Actions as the Pages source in the repository settings. The repository must be named `antonrademaker.github.io` for the site to be served at `https://antonrademaker.github.io/`. A custom domain can be configured later by adding a `static/CNAME` file and changing `baseURL`.