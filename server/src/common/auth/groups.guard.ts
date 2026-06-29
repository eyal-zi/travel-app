import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { AuthenticatedUser } from './auth.types';
import { IS_PUBLIC_KEY } from './public.decorator';

// Global authorization guard, runs after JwtAuthGuard. If ALLOWED_GROUP is
// configured, the authenticated user must belong to it; otherwise we reject
// with 403, which the client turns into the /unauthorized page. Public routes
// are skipped.
@Injectable()
export class GroupsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredGroup = process.env.ALLOWED_GROUP;
    if (!requiredGroup) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;
    const groups = user?.groups ?? [];
    if (!groups.includes(requiredGroup)) {
      throw new ForbiddenException(
        `Missing required group "${requiredGroup}"`,
      );
    }
    return true;
  }
}
