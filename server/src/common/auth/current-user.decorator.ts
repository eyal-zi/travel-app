import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUser } from './auth.types';

// Pulls the authenticated user (set by JwtStrategy.validate) off the request,
// so controllers can do `@CurrentUser() user: AuthenticatedUser`.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as AuthenticatedUser;
  },
);
