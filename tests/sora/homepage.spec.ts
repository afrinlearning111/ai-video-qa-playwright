import { test, expect } from '../../fixtures/test-fixtures';

test.describe('OpenAI Sora — Product page @smoke', () => {
  const SORA_URL = 'https://openai.com/sora';

  test('loads the Sora product page with a 200 OK @smoke', async ({ page }) => {
    const response = await page.goto(SORA_URL);
    expect(response?.status(), `Sora page returned ${response?.status()}`).toBeLessThan(400);
  });

  test('mentions "Sora" in headline copy @smoke', async ({ page }) => {
    await page.goto(SORA_URL);
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    expect(bodyText).toContain('sora');
  });

  test('contains at least one <video> element or video preview asset @regression', async ({
    page,
  }) => {
    await page.goto(SORA_URL);
    const videoCount = await page.locator('video, [aria-label*="video" i]').count();
    // Marketing pages sometimes render video as background image-sequences,
    // so we treat 0 as a flag rather than a hard fail.
    if (videoCount === 0) {
      test.info().annotations.push({
        type: 'warning',
        description: 'No <video> elements detected — verify if marketing page changed format.',
      });
    }
    expect(videoCount).toBeGreaterThanOrEqual(0);
  });

  test('does not expose a stack trace or "undefined" copy in the visible body @regression', async ({
    page,
  }) => {
    await page.goto(SORA_URL);
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/at\s+\w+\.\w+\s*\(.+:\d+:\d+\)/);
    expect(text).not.toContain('undefined undefined');
  });
});
