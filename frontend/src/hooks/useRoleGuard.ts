import { useAuth } from './useAuth';
import { Role } from '@/types/auth';

export function useRoleGuard(allowedRoles: Role[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
