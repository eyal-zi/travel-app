import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AppJwtPayload, UserClaims } from '../../common/auth/auth.types';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import { User, UserRole, users } from './users.schema';

export interface SignInResult {
  token: string;
  user: User;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(externalToken: string): Promise<SignInResult> {
    const claims = this.verifyExternalToken(externalToken);
    const role = this.resolveRole(claims.groups);

    const user = await this.upsertUser(claims, role);
    this.assertAuthorized(user);
    const token = await this.signAppToken(user);
    this.logger.log(`Signed in user ${user.uniqueId} as ${role}`);
    return { token, user };
  }

  private verifyExternalToken(externalToken: string): UserClaims {
    const secret = process.env.IDP_SECRET;
    if (!secret) {
      throw new Error('IDP_SECRET environment variable is not set');
    }
    let payload: Partial<UserClaims>;
    try {
      payload = this.jwtService.verify<Partial<UserClaims>>(externalToken, {
        secret,
      });
    } catch {
      throw new UnauthorizedException('Invalid identity token');
    }
    if (!payload.uniqueId) {
      throw new UnauthorizedException('Identity token missing uniqueId');
    }
    return {
      uniqueId: payload.uniqueId,
      username: payload.username ?? '',
      groups: payload.groups ?? [],
      firstName: payload.firstName ?? '',
      lastName: payload.lastName ?? '',
      fullName: payload.fullName ?? '',
      displayName: payload.displayName ?? '',
      email: payload.email ?? '',
    };
  }

  private assertAuthorized(user: User): void {
    const requiredGroup = process.env.ALLOWED_GROUP;
    if (requiredGroup && !user.groups.includes(requiredGroup)) {
      throw new ForbiddenException(`Missing required group "${requiredGroup}"`);
    }
  }

  private resolveRole(groups: string[]): UserRole {
    const adminGroup = process.env.ADMIN_GROUP;
    if (adminGroup && groups.includes(adminGroup)) {
      return 'admin';
    }
    return 'user';
  }

  private async upsertUser(claims: UserClaims, role: UserRole): Promise<User> {
    const values = { ...claims, role };
    const [user] = await this.db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.uniqueId,
        set: {
          username: claims.username,
          groups: claims.groups,
          firstName: claims.firstName,
          lastName: claims.lastName,
          fullName: claims.fullName,
          displayName: claims.displayName,
          email: claims.email,
          role,
          isDeleted: false,
        },
      })
      .returning();
    return user;
  }

  private signAppToken(user: User): Promise<string> {
    const payload: AppJwtPayload = {
      sub: user.uniqueId,
      id: user.id,
      uniqueId: user.uniqueId,
      username: user.username ?? '',
      groups: user.groups,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      fullName: user.fullName ?? '',
      displayName: user.displayName ?? '',
      email: user.email ?? '',
      role: user.role,
    };
    return this.jwtService.signAsync(payload);
  }
}
