# antonrademaker.github.io

The source code for [antonrademaker.github.io](https://antonrademaker.github.io/), Anton Rademaker's personal website and blog.

The site is a static [Hugo](https://gohugo.io/) project hosted on GitHub Pages. It is deliberately small: content and templates live under `src/www`, while Node.js scripts provide local development, browser checks, HTML validation, and Lighthouse quality gates.

## Local development

Requirements:

- Node.js 22 or later
- npm

From the site directory:

```text
cd src/www
npm ci
npm run dev
```

The development server is available at `http://localhost:1313`.

Create a production build with:

```text
cd src/www
npm run build
```

The generated site is written to `src/www/public/`.

Run the complete validation suite with:

```text
cd src/www
npm test
```

This runs the Hugo build, HTML validation, Playwright checks across Chromium, Firefox, and WebKit, accessibility checks, and Lighthouse audits.

## Project layout

- `src/www/content/` contains site content and future posts.
- `src/www/layouts/` contains Hugo templates.
- `src/www/static/` contains files copied directly into the published site.
- `src/www/tests/` contains Playwright tests.
- `.github/workflows/site.yml` builds, validates, and deploys the site to GitHub Pages.

## Publishing

Changes pushed to `main` are validated and deployed by GitHub Actions. The GitHub Pages source is configured as **GitHub Actions**. The live site is [antonrademaker.github.io](https://antonrademaker.github.io/).

## Contributing

This is a personal website maintained by Anton Rademaker, so outside contributions are not generally expected. Bug reports, accessibility findings, and small improvements are welcome when they are clearly scoped. See [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

## Security

Please report suspected vulnerabilities privately rather than opening a public issue. See [SECURITY.md](SECURITY.md) for the reporting process.

## License

Original source code in this repository is available under the [MIT License](LICENSE). Website text, personal information, and original editorial content are not automatically licensed for reuse. Third-party assets remain under their respective licenses; the repository's local font license is documented in `src/www/static/fonts/OFL.txt`.
