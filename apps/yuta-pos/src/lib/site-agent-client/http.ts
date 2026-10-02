import { localPosRoutes } from '@yuta/contracts/local-pos';
import { z } from 'zod';

export const posRuntimeEnvSchema = z.object({
  SITE_AGENT_URL: z.string().url().default('http://127.0.0.1:3004'),
});

const siteAgentErrorResponseSchema = z
  .object({
    error: z
      .object({
        code: z.string().min(1),
        message: z.string().min(1),
        requestId: z.string().min(1).optional(),
      })
      .strict(),
  })
  .strict();

export type FetchImplementation = typeof fetch;

export class SiteAgentClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'SiteAgentClientError';
  }
}

export type SiteAgentRequest = <T>(
  path: string,
  schema: { parse(value: unknown): T },
  init?: RequestInit,
) => Promise<T>;

export type SiteAgentTransport = {
  request: SiteAgentRequest;
  requestEventStream: (signal?: AbortSignal) => Promise<Response>;
};

export function createSiteAgentTransport(
  baseUrl: string,
  fetchImplementation: FetchImplementation,
): SiteAgentTransport {
  async function request<T>(
    path: string,
    schema: { parse(value: unknown): T },
    init?: RequestInit,
  ): Promise<T> {
    const response = await fetchImplementation(`${baseUrl}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    });
    const payload: unknown = await response.json();

    if (!response.ok) {
      const error = siteAgentErrorResponseSchema.safeParse(payload);
      if (error.success) {
        throw new SiteAgentClientError(
          response.status,
          error.data.error.code,
          error.data.error.message,
          error.data.error.requestId,
        );
      }
      throw new SiteAgentClientError(
        response.status,
        'INVALID_ERROR_RESPONSE',
        'The site agent returned an invalid error response.',
      );
    }

    return schema.parse(payload);
  }

  async function requestEventStream(signal?: AbortSignal) {
    const response = await fetchImplementation(
      `${baseUrl}${localPosRoutes.kitchenEvents}`,
      {
        cache: 'no-store',
        headers: { Accept: 'text/event-stream' },
        signal,
      },
    );
    if (response.ok) return response;

    const payload: unknown = await response.json().catch(() => null);
    const error = siteAgentErrorResponseSchema.safeParse(payload);
    if (error.success) {
      throw new SiteAgentClientError(
        response.status,
        error.data.error.code,
        error.data.error.message,
        error.data.error.requestId,
      );
    }
    throw new SiteAgentClientError(
      response.status,
      'INVALID_ERROR_RESPONSE',
      'The site agent returned an invalid error response.',
    );
  }

  return { request, requestEventStream };
}

export function managementJsonHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export function normalizeBaseUrl(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}
