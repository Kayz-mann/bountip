/**
 * Minimal typed fetch client for the fakestoreapi host.
 *
 * We use `fetch` rather than axios: there is a single unauthenticated GET host
 * with no interceptors, headers or refresh logic to justify a dependency.
 *
 * Errors are normalised into a typed `ApiError` so the UI can distinguish
 * "no internet" from "server down" from "not found" and react appropriately.
 */

export type ApiErrorKind = 'network' | 'http' | 'notfound' | 'parse';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

const BASE_URL = 'https://fakestoreapi.com';

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, { signal });
  } catch (error) {
    // Preserve cancellation so react-query can handle it, otherwise treat as offline.
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new ApiError('network', 'No internet connection');
  }

  if (!response.ok) {
    throw new ApiError('http', `Server error (${response.status})`, response.status);
  }

  // fakestoreapi returns 200 with an EMPTY body for unknown ids (verified:
  // GET /products/9999 -> 200, content-length 0). Guard before parsing so we
  // surface a clean "not found" instead of a JSON parse crash.
  const text = await response.text();
  if (!text) throw new ApiError('notfound', 'Not found');

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError('parse', 'Unexpected response from server');
  }
}
