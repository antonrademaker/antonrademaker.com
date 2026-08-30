+++
title = 'Rebuilding this website with Hugo'
date = '2026-08-30'
draft = false
description = 'Why I chose Hugo for this site, the decisions behind its shape, and how the GitHub Actions pipeline takes it from a commit to a deployed website.'
tags = ['hugo', 'web development', 'GitHub Actions']
+++

Welcome to the first post on my new blog. This website is deliberately small for now. It is a place for my profile, links, and a collection of notes about software architecture, engineering, data, and the things I am learning along the way.

My old websites were built with languages and frameworks I haven't used in more than 15 years. But I was still paying an increasing amount each year to host the websites. So time for a change!

I checked the old websites for relevance today and I found that there was not much value in them anymore. So I decided to start clean. Having seen the rise of static websites (and the low cost of hosting them) I decided to give static site generation a try.

That made the first technical decision surprisingly important: I did not need a product platform or a big JavaScript application. I needed a writing tool that could turn a handful of source files into a fast, dependable website. [Hugo](https://gohugo.io/) was a good fit for that constraint.

## Why Hugo

Hugo is a static site generator. I write content in Markdown, describe the site structure with templates, and Hugo produces the HTML, CSS, feeds, sitemap, and robots file that are published to the web. There is no application server and no database involved when someone visits the site.

That model gives me a few useful properties:

- **The content is portable.** Posts are plain Markdown files in the repository. They are easy to review, edit, search, and move.
- **The runtime is boring.** A visitor receives files rather than waiting for a server-side render or an API call. There is less infrastructure to operate and less that can fail at request time.
- **The build is quick.** A local edit can become a complete site in a moment, which keeps the feedback loop pleasant.
- **The output is easy to inspect.** The thing tested in CI is the same generated output that is uploaded to GitHub Pages.
- **Hosting is cheap.** In the current setup it's free: I use GitHub Pages to host it.

I considered the usual alternatives, but the decision was less about finding the most capable framework and more about avoiding capabilities I did not need yet. This site is content-led, so a static generator keeps the architecture close to the problem.

## Decisions that shape the site

Choosing Hugo was only the beginning. A few smaller decisions make the result feel like a coherent site rather than a collection of generated pages.

### Using Gen-AI

For my coding work I often use GitHub Copilot and so did I when creating this new website. For the writing, I want the ideas and first draft to remain mine. I use AI mainly as an editor: to challenge ideas, spot gaps, and improve the final text.

### Performance and accessibility

Static websites have a good foundation for performance because there is no server-side rendering at request time and everything can be cached at multiple locations and layers. But to check the performance of the website, I included [Lighthouse](https://developer.chrome.com/docs/lighthouse/) in the build pipeline. This tool can, for example, test how fast the website is rendered in slow environments like older phones or on slow connections. Including it led me to the following decision.

### Typography and assets are local

The typefaces are stored in the repository and served locally. That avoids a third-party font request and means the privacy and availability characteristics of the page do not depend on an external font provider (bye [Google Fonts](https://fonts.google.com/)). Another advantage is that I can choose exactly which font weights are loaded for the website.

The same principle applies to the rest of the site: the published page should contain what it needs instead of assembling itself from a collection of runtime services. I don't add analytics, tracking scripts, or social-media widgets.

### Content stays in the repository

Posts live in `content/posts/` and use front matter for the title, date, description, draft status, and tags. Hugo's post archetype provides the starting shape for a new post:

```text
hugo new content/posts/my-next-post.md
```

The source remains the source of truth. Generated files in `public/` are a build result, not where I write the site.

### Templates stay intentionally small

The layout is split around a few responsibilities: a base document shell, shared header and footer partials, a homepage, a section list for posts, and a single-post layout. That is enough structure for consistent navigation and typography without hiding the page in a large theme.

The site also avoids pulling in a front-end framework. The interaction is mostly navigation and reading, so HTML and CSS are the more direct tools. Keeping the browser payload small is a useful side effect, but the bigger benefit is that the implementation remains understandable when I return to it later.

### Quality is part of the publishing path

A static site can still have broken links, invalid markup, inaccessible controls, or a layout that overflows on a phone. Those are build concerns, not just things to check by eye.

The project therefore treats the generated site as a testable artifact. The checks cover HTML validity, automated accessibility, browser behavior on Chromium, Firefox, and WebKit, responsive overflow, keyboard focus, reduced motion, and Lighthouse accessibility and SEO scores.

In the future, I plan to add automated checks for broken links in blog posts.

### Keeping dependencies current

A static site means fewer moving parts, but Hugo and other dependencies still need to be kept up to date. I chose Dependabot to keep the npm packages current. I also configured it to check the GitHub Actions used by the workflow, keeping the whole system up to date through PRs for me to approve. You can see my current [`.github/dependabot.yml`](https://github.com/antonrademaker/antonrademaker.github.io/blob/main/.github/dependabot.yml).

## How the pipeline works

The pipeline is defined in [`.github/workflows/site.yml`](https://github.com/antonrademaker/antonrademaker.github.io/blob/main/.github/workflows/site.yml) and runs for pull requests and pushes to `main`.

On every validation run, GitHub Actions:

1. Checks out the repository.
2. Sets up Node.js 24 and caches the npm dependencies.
3. Runs `npm ci` from `src/www`.
4. Installs the Chromium, Firefox, and WebKit browsers used by Playwright.
5. Runs `npm test`.

The `npm test` script first runs `hugo --minify`, which writes the production site to `public/`. It then validates the generated HTML, runs the Playwright and axe-core checks, and runs the Lighthouse gates. The tests exercise the built site rather than a separate mock of it.

If validation succeeds, the workflow uploads `src/www/public` as a GitHub Pages artifact. A push to `main` then enables the deploy job, which sends that artifact to the `github-pages` environment. Pull requests stop after validation, so they can prove that a change is publishable without deploying it.

The result is a deliberately short path:

```text
Markdown + templates + CSS
              |
              v
        Hugo production build
              |
              v
     HTML, accessibility, browser,
        and Lighthouse checks
              |
              v
       GitHub Pages artifact
              |
              v
             Deploy
```

There is no separate release package to prepare and no production server to configure. A merged change to `main` is the release, provided the same checks that protect the pull request have passed.

## What comes next

This is the foundation, not the finished website. The next parts can and will go deeper into the visual direction, the content model, and the small decisions that make a static site pleasant to maintain.

For now, Hugo gives me and the site the right kind of simplicity: content is close to the code, the generated output is easy to understand, and the pipeline has a clear answer to the question, "what exactly are we deploying?"
