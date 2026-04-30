import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/api-helper';

/**
 * REST API contract tests.
 *
 * Real AI video APIs (Runway, Pika, Sora) require paid keys, so for a
 * portfolio project we exercise the same patterns against a public,
 * stable REST surface (JSONPlaceholder). The patterns transfer directly:
 *
 *   - Status code & latency SLO checks
 *   - Schema / required-key assertions
 *   - Header inspection (content-type, cache-control, request-id)
 *   - Negative tests (404, malformed payload)
 */

const BASE = 'https://jsonplaceholder.typicode.com';

test.describe('Generation API surrogate — happy path @smoke', () => {
  test('GET /posts/1 returns expected schema and meets SLO', async ({ request }) => {
    const api = new ApiHelper(request);
    const result = await api.get<{ id: number; title: string; body: string; userId: number }>(
      `${BASE}/posts/1`,
    );

    ApiHelper.expectFastSuccess(result, 3000);
    ApiHelper.expectBodyHasKeys(result.body, ['id', 'title', 'body', 'userId']);
    expect(result.body.id).toBe(1);
    expect(result.headers['content-type']).toMatch(/application\/json/);
  });

  test('POST /posts creates a "generation job" surrogate', async ({ request }) => {
    const api = new ApiHelper(request);
    const payload = {
      title: 'cinematic mountain sunrise',
      body: 'A drone shot at golden hour, 4K',
      userId: 1,
    };
    const result = await api.post<{ id: number }>(`${BASE}/posts`, payload);

    expect(result.status).toBe(201);
    expect(result.body).toHaveProperty('id');
    expect(result.latencyMs).toBeLessThan(5000);
  });
});

test.describe('Generation API surrogate — negative cases @regression', () => {
  test('GET on a non-existent resource returns 404', async ({ request }) => {
    const api = new ApiHelper(request);
    const result = await api.get(`${BASE}/posts/999999`);
    expect(result.status).toBe(404);
  });

  test('POST with empty payload still returns a valid response shape', async ({ request }) => {
    const api = new ApiHelper(request);
    const result = await api.post<{ id: number }>(`${BASE}/posts`, {});
    expect([200, 201]).toContain(result.status);
    expect(result.body).toHaveProperty('id');
  });
});

test.describe('Generation API surrogate — header & latency assertions @regression', () => {
  test('Response includes a content-type and is sub-3s', async ({ request }) => {
    const api = new ApiHelper(request);
    const result = await api.get(`${BASE}/users/1`);
    expect(result.headers['content-type']).toBeTruthy();
    expect(result.latencyMs).toBeLessThan(3000);
  });
});
