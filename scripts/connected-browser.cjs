const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = 'http://127.0.0.1:4321/dev/templates/';
const widths = [1920, 1440, 1280, 1024, 768, 390, 320];

async function checkLayout(page, width) {
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(() => ({
    viewport: innerWidth, document: document.documentElement.scrollWidth,
    overflowing: [...document.querySelectorAll('main > *, header, footer')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => el.className),
  }));
  assert.equal(metrics.document, width, JSON.stringify({ url: page.url(), ...metrics }));
  const findings = await page.evaluate(async () => (await axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
  })).violations.map(v => [v.id, v.nodes.map(node => node.target)]));
  assert.deepEqual(findings, [], page.url() + ' at ' + width);
}

async function run() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.addInitScript({ path: require.resolve('axe-core/axe.min.js') });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base);
      await page.locator('main a[href$="/home/"]').click();
      await checkLayout(page, width);
      await page.locator('.hero-actions a').first().click();
      assert.equal(page.url(), base + 'work/');
      await checkLayout(page, width);
      const bagmee = page.getByRole('button', { name: 'Show BAGMEE' });
      await bagmee.click();
      assert.equal(await bagmee.getAttribute('aria-pressed'), 'true');
      await bagmee.press('ArrowLeft');
      assert.equal(await page.getByRole('button', { name: 'Show Superbalist' }).getAttribute('aria-pressed'), 'true');
      await page.getByRole('button', { name: 'List view' }).click();
      assert.equal(await page.locator('[data-work-index]').getAttribute('data-view'), 'list');
      await page.getByRole('button', { name: 'Grid view' }).click();
      await page.locator('a#project-superbalist').click();
      assert.equal(page.url(), base + 'superbalist/');
      await checkLayout(page, width);
      await page.locator('.project-back').click();
      assert.equal(page.url(), base + 'work/');
      await page.getByRole('link', { name: 'Random Order home' }).click();
      assert.equal(page.url(), base + 'home/');
      await page.locator('a#project-superbalist').click();
      assert.equal(page.url(), base + 'superbalist/');
      console.log(width + 'px passed layout, accessibility, carousel, view switch and all five journeys');
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + 'work/');
    const first = page.locator('[data-work-slide]').first();
    await page.mouse.move(1, 899);
    await page.waitForFunction(() => document.querySelector('[data-work-slide]').dataset.active === 'false', null, { timeout: 15000 });
    await page.getByRole('button', { name: 'Pause carousel' }).click();
    assert.equal(await page.getByRole('button', { name: 'Resume carousel' }).getAttribute('aria-pressed'), 'true');
    assert.equal(await first.getAttribute('aria-hidden'), 'true');
  } finally {
    await browser.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
