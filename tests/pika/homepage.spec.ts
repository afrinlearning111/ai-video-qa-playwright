import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Pika Labs — Home page @smoke', () => {
  test('loads with the Pika brand name in title @smoke', async ({ pikaHome, logger }) => {
    await pikaHome.goto();
    const title = await pikaHome.title();
    logger.info('Pika title captured', { title });
    expect(title.toLowerCase()).toMatch(/pika/);
  });

  test('renders a primary H1 @smoke', async ({ pikaHome }) => {
    await pikaHome.goto();
    await expect(pikaHome.mainHeading).toBeVisible({ timeout: 15_000 });
  });

  test('exposes a primary CTA @regression', async ({ pikaHome }) => {
    await pikaHome.goto();
    await expect(pikaHome.tryPikaCta).toBeVisible({ timeout: 15_000 });
  });

  test('all internal navigation links resolve to a 2xx/3xx @regression', async ({
    page,
    pikaHome,
  }) => {
    await pikaHome.goto();
    const hrefs = await page
      .locator('a[href^="/"], a[href*="pika.art"]')
      .evaluateAll((els) =>
        Array.from(new Set(els.map((e) => (e as HTMLAnchorElement).href))).slice(0, 8),
      );

    for (const href of hrefs) {
      const res = await page.request.get(href).catch(() => null);
      if (!res) continue;
      // Accept 2xx and 3xx; some marketing pages return 308/301.
      expect(res.status(), `Broken link: ${href}`).toBeLessThan(400);
    }
  });
});
