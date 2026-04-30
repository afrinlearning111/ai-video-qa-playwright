import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — common page actions inherited by all Page Objects.
 * Keeps test code free of duplicated boilerplate (waits, navigation, assertions).
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly url: string;

  protected constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
  }

  /** Navigate to the page's canonical URL and wait for the DOM to be ready. */
  async goto(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  /** Return the current document title. */
  async title(): Promise<string> {
    return this.page.title();
  }

  /** Assert title contains an expected substring (case-insensitive). */
  async expectTitleContains(text: string): Promise<void> {
    const title = (await this.title()).toLowerCase();
    expect(title).toContain(text.toLowerCase());
  }

  /** Assert that no console errors fired during page load. */
  async expectNoConsoleErrors(messages: string[]): Promise<void> {
    expect(messages, `Console errors detected: ${messages.join(', ')}`).toHaveLength(0);
  }

  /** Capture a full-page screenshot for debugging or bug reports. */
  async screenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }

  /** Get a locator scoped to this page. */
  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /** Helper: scroll element into view before interacting (avoids flaky clicks). */
  protected async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }
}
