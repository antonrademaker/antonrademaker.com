+++
title = 'Building this website with Hugo'
date = '2026-08-30'
draft = false
description = 'Why I chose Hugo for this site, the decisions behind its shape, and how the GitHub Actions pipeline takes it from a commit to a deployed website.'
tags = ['hugo', 'web development', 'github actions']
+++

My first post on my new blog! This website is deliberately small. It is a place for my profile, links, and eventually a collection of notes about software architecture, engineering, data, and the things I am learning along the way.

The old website(s) where in PHP and I didn't really do any maintenance in the last years. But I was still paying each year an (alarming) increasing amount of money to host the websites. So time for a change!.

I checked the old host websites for relevance today and I found that there was not much value in them anymore. So I decided to start clean. Having seen the rise of the static websites (and the low costs to host them) I decided to jump aboard the static websites movement.  

That made the first technical decision surprisingly important: I did not need a product platform or a big JavaScript application. I needed a writing tool that could turn a handful of source files into a fast, dependable website. [Hugo](https://gohugo.io/) was a good fit for that constraint.

## Why Hugo

Hugo is a static site generator. I write content in Markdown, describe the site structure with templates, and Hugo produces the HTML, CSS, feeds, sitemap, and robots file that are published to the web. There is no application server and no database involved when someone visits the site.

That model gives me a few useful properties:

- **The content is portable.** Posts are plain Markdown files in the repository. They are easy to review, edit, search, and move.
- **The runtime is boring.** A visitor receives files rather than waiting for a server-side render or an API call. There is less infrastructure to operate and less that can fail at request time.
- **The build is quick.** A local edit can become a complete site in a moment, which keeps the feedback loop pleasant.
- **The output is easy to inspect.** The thing tested in CI is the same generated output that is uploaded to GitHub Pages.
- **Hosting is cheap.** In the current setup it's free: I use GitHub Pages to host them.

I considered the usual alternatives, but the decision was less about finding the most capable framework and more about avoiding capabilities I did not need yet. This site is content-led, so a static generator keeps the architecture close to the problem.

## Decisions that shape the site

Choosing Hugo was only the beginning. A few smaller decisions make the result feel like a coherent site rather than a collection of generated pages.

### Using Gen-AI

For my coding work I often use Github Copilot and so did I when creating this new website. But for the writing I'll write as much possible, with AI validating my ideas and writing.

### Performance and accesibilty

Static websites are fast (no other components involved) and everything can be cached at multiple locations and layers (and invalidated with for example [E-Tags](https://en.wikipedia.org/wiki/HTTP_ETag)). But to really garantee the performance of the website I included [Lighthouse](https://developer.chrome.com/docs/lighthouse/) in the build pipeline. This tool can for example test how fast the website is rendered in slow environments (slow phones or slow connections). Including it let to the following decission.

### Typography and assets are local

The typefaces are stored in the repository and served locally. That voids a third-party font request, and means the privacy and availability characteristics of the page do not depend on an external font provider (bye [Google fonts](https://fonts.google.com/)).

The same principle applies to the rest of the site: the published page should contain what it needs instead of assembling itself from a collection of runtime services. So no social media buttons, no tracking (other than provided by Github Pages).

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

In the future I plan to add tools to check my old blog posts for broken links.

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
