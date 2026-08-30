# Contributing

This is a personal website maintained by Anton Rademaker. Contributions from others are not generally expected, and the maintainer may decline changes that do not fit the site's purpose or direction. Focused bug reports, accessibility findings, and small improvements are welcome.

## Before opening an issue or pull request

- Search existing issues and pull requests first.
- Keep the scope focused and explain the reason for the change.
- For visual or behavior changes, include the affected page and reproduction steps.
- Do not include private information in issues, pull requests, screenshots, or test fixtures.

## Development setup

Use Node.js 22 or later:

```text
cd src/www
npm ci
```

Start the local site with `npm run dev`. The site is available at `http://localhost:1313`.

## Validation

Run the complete check suite before submitting a pull request:

```text
cd src/www
npm test
```

This includes the production build, HTML validation, Playwright browser checks, accessibility checks, and Lighthouse audits. Please do not commit generated Lighthouse reports or other local test artifacts.

## Pull requests

Describe what changed and why. Note any content, accessibility, responsive-layout, or deployment considerations. Keep unrelated formatting and refactoring out of the same pull request.
