const BASE = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  async login(credentials) {
    const data = await request('POST', '/auth/login', credentials);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  async signup(info) {
    const data = await request('POST', '/auth/signup', info);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!getToken();
  },

  /**
   * Decode the JWT payload to get user info without an extra round-trip.
   * Returns null if there's no token or it's malformed.
   */
  getUser() {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.sub,
        email:  payload.email,
        role:   payload.role,
      };
    } catch {
      return null;
    }
  },
};

// ── Books ─────────────────────────────────────────────────────────────────────

export const booksApi = {
  findAll()          { return request('GET',    '/books'); },
  findAvailable()    { return request('GET',    '/books/available'); },
  findBorrowed()     { return request('GET',    '/books/borrowed'); },
  findOne(id)        { return request('GET',    `/books/${id}`); },
  create(data)       { return request('POST',   '/books', data); },
  update(id, data)   { return request('PATCH',  `/books/${id}`, data); },
  remove(id)         { return request('DELETE', `/books/${id}`); },
  borrow(id)         { return request('PATCH',  `/books/${id}/borrow`); },
  returnBook(id)     { return request('PATCH',  `/books/${id}/return`); },
};
