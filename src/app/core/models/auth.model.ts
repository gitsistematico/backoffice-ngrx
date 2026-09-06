export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
}
