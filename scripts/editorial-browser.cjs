// Run against the preview build served on port 4321. QA dependencies are isolated in CI.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    for (const width of [1920, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:4321/dev/templates/');
      await page.getByRole('link', { name: /Superbalist/ }).click();
      await page.getByRole('heading', { level: 1, name: 'Superbalist' }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const bounds = selector => {
          const { x, width, height } = document.querySelector(selector).getBoundingClientRect();
          return [x, width, height].map(Math.round);
        };
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          columns: getComputedStyle(document.querySelector('.ed-columns')).gridTemplateColumns.split(' ').length,
          hero: bounds('.project-header'),
          triptych: bounds('.ed-media-grid .ed-media'),
          unequal: [...document.querySelectorAll('.ed-inset .ed-media')].map(el => Math.round(el.getBoundingClientRect().width)),
          scroll: getComputedStyle(document.documentElement).scrollBehavior,
        };
      });
      console.log(width, geometry);
      assert.equal(geometry.overflow, false);
      assert.equal(geometry.columns, width === 1920 ? 4 : width === 768 ? 2 : 1);
      assert.equal(geometry.scroll, 'auto');
      if (width === 1920) {
        assert.deepEqual(geometry.hero, [0, 1920, 1080]);
        assert.deepEqual(geometry.triptych, [288, 416, 412]);
        assert.deepEqual(geometry.unequal, [851, 437]);
      }
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const findings = await page.evaluate(async () => {
        const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } });
        return result.violations.map(v => [v.id, v.nodes.map(node => node.target)]);
      });
      assert.deepEqual(findings, [], 'WCAG A/AA checks');
      if (width === 390) {
        await page.reload();
        await page.keyboard.press('Tab');
        assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
        await page.keyboard.press('Enter');
        assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
        const toggle = page.getByRole('button', { name: 'Open menu' });
        await toggle.focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator(':focus').textContent(), 'Home');
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator(':focus').getAttribute('aria-label'), 'Open menu');
      }
      await page.getByRole('link', { name: 'Return to template index' }).last().click();
      await page.getByRole('heading', { name: 'Template index' }).waitFor();
    }
  } finally {
    await browser.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
