import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AppJwtPayload, AuthenticatedUser } from './auth.types';

// Validates our own app JWT (Bearer token) on every protected request. The
// token was signed by AuthService at sign-in; here we only verify its signature
// (handled by passport-jwt using JWT_SECRET) and surface the claims onto
// `request.user`.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: AppJwtPayload): AuthenticatedUser {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload;
  }
}
