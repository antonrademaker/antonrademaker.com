import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const profileLinks = [
  'https://github.com/antonrademaker',
  'https://www.linkedin.com/in/antonrademaker/',
  'https://x.com/antonrademaker',
  'https://bsky.app/profile/antonrademaker.bsky.social/',
  'https://www.instagram.com/antonrady/'
];

test.describe('homepage', () => {
  test('passes the automated accessibility audit', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test('presents the intended profile links without exposing an email address', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Anton Rademaker/);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Anton Rademaker' })).toBeVisible();
    await expect(page.locator('a[rel="noreferrer"]')).toHaveCount(profileLinks.length);

    const links = await page.locator('a[rel="noreferrer"]').evaluateAll((elements) =>
      elements.map((element) => ({
        href: element.getAttribute('href'),
        rel: element.getAttribute('rel'),
        target: element.getAttribute('target')
      }))
    );

    expect(links.map((link) => link.href)).toEqual(profileLinks);
    expect(links.every((link) => link.rel === 'noreferrer' && link.target === null)).toBe(true);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/posts/');
    await expect(page.getByRole('heading', { name: 'Rebuilding this website with Hugo' })).toBeVisible();
    await expect(page.locator('#latest-post .latest-post-excerpt > p')).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'Read the full post' })).toHaveAttribute('href', '/posts/building-this-website-with-hugo/');
    await expect(page.locator('.eyebrow-index, .section-marker span, .profile-number')).toHaveCount(0);
    await expect(page.locator('.eyebrow')).toContainText('Based in Ede / curious by nature / always tinkering');
    await expect(page.locator('.section-marker').first()).toHaveCSS('font-family', /ui-monospace/);
    await expect(page.locator('.section-marker').first()).toHaveCSS('text-transform', 'none');
  });

  test('loads typography locally with body weight and italic coverage', async ({ page }) => {
    const fontRequests: string[] = [];
    page.on('request', (request) => {
      if (/font|woff|googleapis|gstatic/i.test(request.url())) fontRequests.push(request.url());
    });

    await page.goto('/');

    const loadedFaces = await page.evaluate(async () => {
      const specs = [
        '600 1em Fraunces',
        '400 1em Newsreader',
        '700 1em Newsreader',
        'italic 400 1em Newsreader',
        'italic 700 1em Newsreader'
      ];

      return Promise.all(specs.map(async (spec) => ({ spec, count: (await document.fonts.load(spec)).length })));
    });

    expect(loadedFaces.every((face) => face.count === 1)).toBe(true);
    expect(fontRequests.every((url) => url.startsWith('http://127.0.0.1:1313/fonts/'))).toBe(true);
  });

  test('keeps keyboard focus visible and honors reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });

    if (test.info().project.name.includes('webkit')) {
      await skipLink.focus();
    } else {
      await page.keyboard.press('Tab');
    }

    await expect(skipLink).toBeFocused();
    await expect.poll(() => skipLink.evaluate((element) => getComputedStyle(element).outlineWidth)).toBe('3px');

    const animationDuration = await page.locator('.hero-copy').evaluate((element) => getComputedStyle(element).animationDuration);
    expect(animationDuration).toBe('0.001s');
  });

  test('does not overflow the viewport', async ({ page }) => {
    await page.goto('/');

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

    expect(hasHorizontalOverflow).toBe(false);
  });
});