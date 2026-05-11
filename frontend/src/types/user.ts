import { Role } from './auth';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: Role;
}
