import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Runway ML marketing/landing page.
 * Locators are intentionally resilient (role-based or text-based)
 * so the suite tolerates non-critical DOM churn.
 */
export class RunwayHomePage extends BasePage {
  readonly logo: Locator;
  readonly mainHeading: Locator;
  readonly signInLink: Locator;
  readonly tryRunwayCta: Locator;
  readonly pricingNavLink: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page, 'https://runwayml.com');
    this.logo = page.getByRole('link', { name: /runway/i }).first();
    this.mainHeading = page.locator('h1').first();
    this.signInLink = page.getByRole('link', { name: /log\s*in|sign\s*in/i }).first();
    this.tryRunwayCta = page.getByRole('link', { name: /try runway|get started|start creating/i }).first();
    this.pricingNavLink = page.getByRole('link', { name: /pricing/i }).first();
    this.footer = page.locator('footer');
  }

  async openPricing(): Promise<void> {
    await this.pricingNavLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getMainHeadingText(): Promise<string> {
    return (await this.mainHeading.textContent())?.trim() ?? '';
  }

  async isFooterVisible(): Promise<boolean> {
    return this.footer.isVisible();
  }
}
