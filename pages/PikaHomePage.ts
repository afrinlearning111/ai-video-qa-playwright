import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Pika Labs marketing/landing page.
 */
export class PikaHomePage extends BasePage {
  readonly logo: Locator;
  readonly mainHeading: Locator;
  readonly tryPikaCta: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page, 'https://pika.art');
    this.logo = page.getByRole('link', { name: /pika/i }).first();
    this.mainHeading = page.locator('h1').first();
    this.tryPikaCta = page.getByRole('link', { name: /try|launch|start|create/i }).first();
    this.footer = page.locator('footer');
  }

  async getMainHeadingText(): Promise<string> {
    return (await this.mainHeading.textContent())?.trim() ?? '';
  }

  async clickPrimaryCta(): Promise<void> {
    await this.tryPikaCta.click();
  }
}
