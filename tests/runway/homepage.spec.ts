import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Runway ML — Home page @smoke', () => {
  test('loads with a non-empty <title> @smoke', async ({ runwayHome, logger }) => {
    await runwayHome.goto();
    const title = await runwayHome.title();
    logger.info('Page title captured', { title });
    expect(title.length).toBeGreaterThan(0);
    await runwayHome.expectTitleContains('runway');
  });

  test('renders a primary H1 heading @smoke', async ({ runwayHome }) => {
    await runwayHome.goto();
    await expect(runwayHome.mainHeading).toBeVisible();
    const text = await runwayHome.getMainHeadingText();
    expect(text.length).toBeGreaterThan(3);
  });

  test('has a sign-in surface @regression', async ({ runwayHome }) => {
    await runwayHome.goto();
    await expect(runwayHome.signInLink).toBeVisible({ timeout: 15_000 });
  });

  test('has a footer with content @regression', async ({ runwayHome }) => {
    await runwayHome.goto();
    expect(await runwayHome.isFooterVisible()).toBe(true);
  });

  test('does not log console errors during initial load @regression', async ({
    runwayHome,
    consoleErrors,
    page,
  }) => {
    await runwayHome.goto();
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    // Marketing pages often load 3rd-party analytics that error noisily.
    // We allow non-app errors and only assert there is no Runway-domain error.
    const appErrors = consoleErrors.filter((e) => /runway/i.test(e));
    expect(appErrors, `Runway-domain console errors: ${appErrors.join(' | ')}`).toHaveLength(0);
  });
});

test.describe('Runway ML — Responsive rendering @regression', () => {
  test('renders on mobile viewport without horizontal scrollbar', async ({ page, runwayHome }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await runwayHome.goto();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    // Allow 1px tolerance for rounding
    expect(scrollWidth - clientWidth).toBeLessThanOrEqual(1);
  });
});
