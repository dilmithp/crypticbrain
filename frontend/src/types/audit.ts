import { AuthUser } from './auth';

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  performedBy: AuthUser;
  details: string;
  timestamp: string;
}
