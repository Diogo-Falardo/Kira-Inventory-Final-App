import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

export type Tokens = {
  access: string | null;
  refresh: string | null;
  tokenType?: string | null;
};

function createAuthStore() {
  const initial: Tokens = browser
    ? {
        access: localStorage.getItem(ACCESS),
        refresh: localStorage.getItem(REFRESH),
        tokenType: null,
      }
    : { access: null, refresh: null, tokenType: null };

  const store = writable<Tokens>(initial);

  if (browser) {
    store.subscribe((t) => {
      if (t.access) localStorage.setItem(ACCESS, t.access);
      else localStorage.removeItem(ACCESS);

      if (t.refresh) localStorage.setItem(REFRESH, t.refresh);
      else localStorage.removeItem(REFRESH);
    });
  }

  return {
    subscribe: store.subscribe,
    setTokens(access: string, refresh?: string | null, tokenType?: string | null) {
      const current = get(store);
      store.set({
        access,
        refresh: refresh ?? current.refresh,
        tokenType: tokenType ?? current.tokenType ?? 'Bearer',
      });
    },
    clear() {
      store.set({ access: null, refresh: null, tokenType: null });
    },
    get() {
      return get(store);
    },
    isAuthenticated() {
      if (!browser) return false;
      return !!localStorage.getItem('access_token');
    },
  };
}

export const auth = createAuthStore();

// jwt

export function decodeJwt(token?: string | null): any | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isExpired(token?: string | null, skewSeconds = 30): boolean {
  const p = decodeJwt(token);
  if (!p?.exp) return false; // if no exp, assume not expiring
  const now = Date.now() / 1000;
  return p.exp - skewSeconds <= now;
}
