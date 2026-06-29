import { SetMetadata } from '@nestjs/common';

// Marks a route as public so the global JwtAuthGuard (and GroupsGuard) skip it.
// Used for the sign-in endpoint, which by definition runs before the user has a
// token.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
