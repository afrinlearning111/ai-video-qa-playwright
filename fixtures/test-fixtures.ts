import { test as base } from '@playwright/test';
import { RunwayHomePage } from '../pages/RunwayHomePage';
import { PikaHomePage } from '../pages/PikaHomePage';
import { Logger } from '../utils/logger';

/**
 * Custom Playwright fixtures.
 *
 * Each test that needs a Page Object simply destructures it,
 * e.g. `test('it works', async ({ runwayHome }) => { ... })`.
 * No manual `new RunwayHomePage(page)` clutter inside specs.
 */
type CustomFixtures = {
  runwayHome: RunwayHomePage;
  pikaHome: PikaHomePage;
  logger: Logger;
  consoleErrors: string[];
};

export const test = base.extend<CustomFixtures>({
  runwayHome: async ({ page }, use) => {
    await use(new RunwayHomePage(page));
  },
  pikaHome: async ({ page }, use) => {
    await use(new PikaHomePage(page));
  },
  logger: async ({}, use, testInfo) => {
    await use(new Logger(testInfo.title));
  },
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await use(errors);
  },
});

export { expect } from '@playwright/test';
