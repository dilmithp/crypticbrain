export type Role = 'ADMIN' | 'MANAGER' | 'RECEPTIONIST';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: Role;
  fullName: string;
}

export interface AuthUser {
  email: string;
  role: Role;
  fullName: string;
}
