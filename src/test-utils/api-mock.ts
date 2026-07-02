/** Helpers for mocking the `fetch`-based API layer in tests. */

/** A minimal Response stand-in matching what `apiGet` reads (`ok`, `status`, `text`). */
export function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data),
  } as Response;
}

/** A 200 with an empty body — the fakestore "unknown id" behaviour. */
export function emptyResponse(status = 200): Response {
  return { ok: status >= 200 && status < 300, status, text: async () => '' } as Response;
}

type Handler = (url: string) => Response | Promise<Response>;

/** Installs a URL-aware fetch mock and returns the jest.fn for assertions. */
export function installFetch(handler: Handler): jest.Mock {
  const mock = jest.fn((input: RequestInfo | URL) => Promise.resolve(handler(String(input))));
  // @ts-expect-error - overriding the global for the test environment.
  global.fetch = mock;
  return mock;
}
