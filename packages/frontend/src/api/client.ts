const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type ApiRequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

/** Typed fetch wrapper over the native Fetch API. Throws on non-2xx responses with the server error message. Handles 204 No Content by returning an empty object. */
export async function apiClient<T>(
  endpoint: string,
  { params, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = errorBody.message || response.statusText;

    console.error(`[API Error] ${response.status}: ${errorMessage}`);
    throw new Error(errorMessage);
  }

  return response.status === 204 ? ({} as T) : response.json();
}
