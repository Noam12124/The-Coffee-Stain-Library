// src/services/api.js
// Thin fetch wrapper for the NestJS auth endpoints.
// Uses a Vite env var so the base URL is never hardcoded into the bundle.
// Set VITE_API_URL in a .env file, e.g.  VITE_API_URL=http://localhost:3000
// If you'd rather avoid CORS entirely in dev, leave VITE_API_URL empty and
// add a proxy block to vite.config.js instead (see note at bottom of file).

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TOKEN_KEY = 'library_token';
const USER_KEY = 'library_user';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no body / not JSON — leave body as null
  }

  if (!res.ok) {
    // Nest's ValidationPipe returns `message` as an array of strings;
    // other exceptions return it as a single string. Normalize both.
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return body;
}

export const authApi = {
  async signup({ name, email, password }) {
    const data = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    persistSession(data);
    return data;
  },

  async login({ email, password }) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    persistSession(data);
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};

function persistSession(data) {
  if (data?.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }
  if (data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
}

/*
  CORS note:
  Your NestJS main.ts needs `app.enableCors()` (or scoped to your Vite
  origin) for direct fetch() calls like this to work cross-port.
  Alternative: skip CORS entirely by proxying instead, in vite.config.js:

    export default defineConfig({
      server: {
        proxy: {
          '/auth': 'http://localhost:3000',
          '/books': 'http://localhost:3000',
        },
      },
    });

  If you use the proxy, set VITE_API_URL='' (empty) so requests go to
  the Vite dev server's own origin and get proxied through.
*/
