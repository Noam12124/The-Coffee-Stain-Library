import type { Book } from '../types/book';


export interface User {
  userId: string | number;
  email: string;
  role: string;
}

export interface JwtPayload {
  sub: string | number;
  email: string;
  role: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  access_token: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface SignupInfo {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface CreateBookDto {
  title: string;
  author: string;
  imageUrl?: string;
}

export type UpdateBookDto = Partial<CreateBookDto>;


const BASE = 'http://localhost:3000/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
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

  return data as T;
}


export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await request<AuthResponse>('POST', '/auth/login', credentials);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  async signup(info: SignupInfo): Promise<AuthResponse> {
    const data = await request<AuthResponse>('POST', '/auth/signup', info);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!getToken();
  },

  getUser(): User | null {
    const token = getToken();
    if (!token) return null;
    try {
      const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  },
};


export const booksApi = {
  findAll(): Promise<Book[]> {
    return request<Book[]>('GET', '/books');
  },
  findAvailable(): Promise<Book[]> {
    return request<Book[]>('GET', '/books/available');
  },
  findBorrowed(): Promise<Book[]> {
    return request<Book[]>('GET', '/books/borrowed');
  },
  findOne(id: string | number): Promise<Book> {
    return request<Book>('GET', `/books/${id}`);
  },
  create(data: CreateBookDto): Promise<Book> {
    return request<Book>('POST', '/books', data);
  },
  update(id: string | number, data: UpdateBookDto): Promise<Book> {
    return request<Book>('PATCH', `/books/${id}`, data);
  },
  remove(id: string | number): Promise<void> {
    return request<void>('DELETE', `/books/${id}`);
  },
  borrow(id: string | number): Promise<Book> {
    return request<Book>('PATCH', `/books/${id}/borrow`);
  },
  returnBook(id: string | number): Promise<Book> {
    return request<Book>('PATCH', `/books/${id}/return`);
  },
};