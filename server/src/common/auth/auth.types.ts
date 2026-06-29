import type { UserRole } from '../../features/auth/users.schema';

// The profile claims carried by both the external IdP token and our own app
// JWT. The IdP is the source of truth for everything except `role`, which we
// derive from `groups` when issuing our token.
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

// The payload of the app JWT we sign. `sub` is the standard subject claim (the
// IdP uniqueId); the rest mirror the profile plus the derived role.
export interface AppJwtPayload extends UserClaims {
  sub: string;
  role: UserRole;
}

// What the JwtStrategy puts on `request.user` after validating the app JWT.
export type AuthenticatedUser = AppJwtPayload;
