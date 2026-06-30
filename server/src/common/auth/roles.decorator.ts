import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../features/auth/users.schema';

// Restricts a route to the given role(s). The global RolesGuard reads this
// metadata and rejects (403) authenticated users whose role isn't listed.
// Routes without the decorator are unaffected.
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
