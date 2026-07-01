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
  // The app JWT the client should store and send on subsequent requests.
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

  // Exchange a verified external IdP token for our own app JWT, upserting the
  // user's profile along the way.
  async signIn(externalToken: string): Promise<SignInResult> {
    const claims = this.verifyExternalToken(externalToken);
    const role = this.resolveRole(claims.groups);
    // Provision/refresh the user even when unauthorized, so we keep a record of
    // the attempt, then enforce the required group before issuing a token.
    const user = await this.upsertUser(claims, role);
    this.assertAuthorized(user);
    const token = await this.signAppToken(user);
    this.logger.log(`Signed in user ${user.uniqueId} as ${role}`);
    return { token, user };
  }

  // Verify the external token against the IdP secret and pull the profile
  // claims off it. The mock IdP shares IDP_SECRET with us; swap this for real
  // IdP key verification when wiring a live provider.
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

  // Reject sign-in (403) when ALLOWED_GROUP is configured and the user isn't a
  // member, so the client lands on the Unauthorized page immediately rather
  // than after a later API call. Mirrors GroupsGuard, which protects the rest
  // of the API.
  private assertAuthorized(user: User): void {
    const requiredGroup = process.env.ALLOWED_GROUP;
    if (requiredGroup && !user.groups.includes(requiredGroup)) {
      throw new ForbiddenException(`Missing required group "${requiredGroup}"`);
    }
  }

  // A user is an admin when they belong to the configured ADMIN_GROUP,
  // otherwise a regular user.
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
