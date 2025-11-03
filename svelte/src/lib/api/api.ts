import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { auth, isExpired } from '$lib/auth/store';
import { get } from 'svelte/store';

const API_BASE = PUBLIC_API_BASE_URL;

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshTokens(): Promise<void> {
  const { refresh } = get(auth);
  if (!refresh) throw new Error('No refresh token');

  if (!isRefreshing) {
    isRefreshing = true;

    refreshPromise = (async () => {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refresh}`,
        },
        body: JSON.stringify({ refresh_token: refresh }),
      });

      if (!res.ok) throw new Error('Refresh failed');

      const json = await res.json();
      auth.setTokens(json.access_token, json.refresh_token ?? refresh, json.token_type ?? 'Bearer');
    })().finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  }

  await refreshPromise!;
}

// wrapper
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const doFetch = async (): Promise<Response> => {
    const { access, tokenType } = get(auth);
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
      ...(access ? { Authorization: `${tokenType ?? 'Bearer'} ${access}` } : {}),
    };
    return fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  };

  //  refresh if JWT expiring soon
  const { access } = get(auth);
  if (access && isExpired(access)) {
    try {
      await refreshTokens();
    } catch {
      auth.clear();
      throw new Error('Token expired!');
    }
  }

  let res = await doFetch();

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || `API error: ${res.status}`);
  }

  return res.json();
}

import type { ZodError } from 'zod';

/**
 * Converts a ZodError into a single readable string.
 */
export function formatZodError(error: ZodError): string {
  return error.issues.map((i) => `${i.path.join('.') || '_'}: ${i.message}`).join('; ');
}

/**
 * Converts a ZodError into a record of { field: message }.
 * Useful for showing field-level messages in forms.
 */
export function zodErrorToRecord(error: ZodError): Record<string, string> {
  const record: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!record[key]) record[key] = issue.message; // first message wins
  }
  return record;
}
