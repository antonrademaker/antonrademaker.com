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
- Lighthouse accessibility and SEO assertions, with performance and best-practices thresholds

Playwright supports the WebKit project on Windows, Linux, and macOS. It uses Playwright's WebKit build rather than Apple's branded Safari.

## Writing posts

Future posts belong in `content/posts/`. Create one with:

```text
hugo new content/posts/my-first-post.md
```

The post archetype supplies title, date, draft status, description, and tags. The post layout is already present, but the homepage intentionally does not show a blog link until the first post is ready.

## Deployment and domains

The GitHub Actions workflow builds and tests changes on pull requests and pushes to `main`. A successful push deploys the `public/` directory to GitHub Pages.

The repository is configured for `www.antonrademaker.com` through `static/CNAME`. Enable GitHub Actions as the Pages source in the repository settings and point the `www` DNS record at GitHub Pages. Configure `antonrademaker.nl` as a permanent redirect to `https://www.antonrademaker.com/` through the domain registrar or DNS provider; GitHub Pages does not provide a second-domain redirect service.