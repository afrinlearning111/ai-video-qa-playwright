import { test, expect } from '@playwright/test';
import { promptCatalogue, edgeCases, injectionPrompts } from '../../utils/prompt-data';

/**
 * AI-quality heuristics — these tests do NOT hit a real generation API
 * (which requires paid credentials). Instead they verify the **client-side
 * input contract**: how the public input form would handle a battery of
 * prompts, were it wired up. The same patterns plug into a real product.
 *
 * For demonstration, we use a public mock form (httpbin) to validate the
 * round-trip integrity of the prompt payload.
 */

test.describe('AI prompt input — data-driven validation @regression', () => {
  for (const tc of promptCatalogue) {
    test(`[${tc.id}] ${tc.category}: ${tc.description}`, async ({ request }) => {
      const res = await request.post('https://httpbin.org/post', {
        data: { prompt: tc.prompt, expectation: tc.expectation },
        headers: { 'content-type': 'application/json' },
      });
      expect(res.ok()).toBe(true);

      const body = await res.json();
      // Round-trip integrity: what we sent must be what httpbin echoes back.
      // This catches encoding bugs (UTF-8 corruption, JSON-break injection, etc.)
      expect(body.json.prompt).toEqual(tc.prompt);
      expect(body.json.expectation).toEqual(tc.expectation);
    });
  }
});

test.describe('AI prompt input — injection sanitization @regression', () => {
  for (const tc of injectionPrompts()) {
    test(`[${tc.id}] injection survives JSON encoding: ${tc.description}`, async ({ request }) => {
      const res = await request.post('https://httpbin.org/post', {
        data: { prompt: tc.prompt },
        headers: { 'content-type': 'application/json' },
      });
      const body = await res.json();
      // The transport must NOT mangle the injection text.
      // Server-side sanitization is the product's job; client transport must be lossless.
      expect(body.json.prompt).toEqual(tc.prompt);
    });
  }
});

test.describe('AI prompt input — edge cases @regression', () => {
  for (const tc of edgeCases()) {
    test(`[${tc.id}] edge case: ${tc.description}`, async ({ request }) => {
      const res = await request.post('https://httpbin.org/post', {
        data: { prompt: tc.prompt },
        headers: { 'content-type': 'application/json' },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.json).toHaveProperty('prompt');
    });
  }
});
