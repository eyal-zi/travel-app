import type { UserRole } from '../../features/auth/users.schema';

export interface UserClaims {
  uniqueId: string;
  username: string;
  groups: string[];
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  email: string;
}

export interface AppJwtPayload extends UserClaims {
  sub: string;

  id: string;
  role: UserRole;
}

export type AuthenticatedUser = AppJwtPayload;
