import { Injectable } from '@angular/core';
import { Observable, of, delay, map, throwError } from 'rxjs';
import { AuthUser, AuthSession } from '../models/auth.model';

interface MockAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: '1',
    email: 'admin@betterlife.com',
    password: 'admin123',
    name: 'Carlos Pérez',
    role: 'Administrador',
  },
  {
    id: '2',
    email: 'agent@betterlife.com',
    password: 'agent123',
    name: 'Lucía Ortega',
    role: 'Agente',
  },
];

const SESSION_KEY = 'bl_backoffice_session';
const LATENCY = 600;

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  login(email: string, password: string): Observable<AuthSession> {
    const account = MOCK_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );

    if (!account) {
      return throwError(() => new Error('Credenciales inválidas')).pipe(delay(LATENCY));
    }

    const user: AuthUser = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
    };

    const session: AuthSession = {
      user,
      token: `mock-token-${account.id}-${Date.now()}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };

    this.persistSession(session);

    return of(session).pipe(delay(LATENCY));
  }

  signup(email: string, password: string): Observable<AuthSession> {
    const existing = MOCK_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return throwError(() => new Error('Ya existe una cuenta con este correo')).pipe(delay(LATENCY));
    }

    const newAccount: MockAccount = {
      id: String(MOCK_ACCOUNTS.length + 1),
      email,
      password,
      name: email.split('@')[0],
      role: 'Agente',
    };
    MOCK_ACCOUNTS.push(newAccount);

    const user: AuthUser = {
      id: newAccount.id,
      email: newAccount.email,
      name: newAccount.name,
      role: newAccount.role,
    };

    const session: AuthSession = {
      user,
      token: `mock-token-${newAccount.id}-${Date.now()}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };

    this.persistSession(session);

    return of(session).pipe(delay(LATENCY));
  }

  logout(): Observable<void> {
    localStorage.removeItem(SESSION_KEY);
    return of(void 0).pipe(delay(200));
  }

  restoreSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      const session = JSON.parse(raw) as AuthSession;
      if (session.expiresAt > Date.now()) return session;
      localStorage.removeItem(SESSION_KEY);
      return null;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  private persistSession(session: AuthSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}
