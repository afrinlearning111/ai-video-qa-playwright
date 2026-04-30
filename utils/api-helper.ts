import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * Lightweight wrapper around Playwright's APIRequestContext that
 * adds latency capture, JSON-schema-style assertions, and structured logging.
 */
export interface ApiCallResult<T> {
  status: number;
  body: T;
  headers: Record<string, string>;
  latencyMs: number;
}

export class ApiHelper {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get<T>(path: string, headers: Record<string, string> = {}): Promise<ApiCallResult<T>> {
    const start = Date.now();
    const res: APIResponse = await this.request.get(path, { headers });
    return this.toResult<T>(res, start);
  }

  async post<T>(
    path: string,
    payload: unknown,
    headers: Record<string, string> = {},
  ): Promise<ApiCallResult<T>> {
    const start = Date.now();
    const res: APIResponse = await this.request.post(path, { data: payload, headers });
    return this.toResult<T>(res, start);
  }

  private async toResult<T>(res: APIResponse, start: number): Promise<ApiCallResult<T>> {
    const latencyMs = Date.now() - start;
    const status = res.status();
    const headers = res.headers();
    let body: T;
    try {
      body = (await res.json()) as T;
    } catch {
      body = (await res.text()) as unknown as T;
    }
    return { status, body, headers, latencyMs };
  }

  /** Assert that the response has the expected status AND landed within an SLO. */
  static expectFastSuccess(result: ApiCallResult<unknown>, sloMs: number = 2000): void {
    expect(result.status, `Expected 2xx, got ${result.status}`).toBeGreaterThanOrEqual(200);
    expect(result.status).toBeLessThan(300);
    expect(
      result.latencyMs,
      `Latency ${result.latencyMs}ms exceeded SLO of ${sloMs}ms`,
    ).toBeLessThan(sloMs);
  }

  /** Assert a response body has all the listed keys (shallow). */
  static expectBodyHasKeys(body: unknown, keys: string[]): void {
    expect(body).toBeTruthy();
    expect(typeof body).toBe('object');
    for (const k of keys) {
      expect(body, `Missing required key: ${k}`).toHaveProperty(k);
    }
  }
}
