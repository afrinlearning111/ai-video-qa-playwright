import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Runway ML — Pricing page @regression', () => {
  test('navigates to the pricing route', async ({ page, runwayHome }) => {
    await runwayHome.goto();
    // The product page sometimes A/B tests link visibility; fall back to direct URL.
    if (await runwayHome.pricingNavLink.isVisible().catch(() => false)) {
      await runwayHome.openPricing();
    } else {
      await page.goto('https://runwayml.com/pricing');
    }
    await expect(page).toHaveURL(/pricing/i);
  });

  test('lists at least one plan tier with a CTA', async ({ page }) => {
    await page.goto('https://runwayml.com/pricing');
    // CTA buttons / links commonly say "Get started" / "Start" / "Subscribe" / "Choose".
    const cta = page.getByRole('link', {
      name: /get started|start|subscribe|choose|continue/i,
    });
    await expect(cta.first()).toBeVisible({ timeout: 15_000 });
    expect(await cta.count()).toBeGreaterThanOrEqual(1);
  });

  test('renders pricing copy that includes a currency symbol', async ({ page }) => {
    await page.goto('https://runwayml.com/pricing');
    const bodyText = await page.locator('body').innerText();
    // Accept $, €, £, ₹, or "USD" / "EUR" textual variants.
    const hasCurrency = /\$|€|£|₹|USD|EUR/.test(bodyText);
    expect(hasCurrency, 'Expected at least one currency indicator on /pricing').toBe(true);
  });
});
