import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import type { AuthenticatedUser } from '../../common/auth/auth.types';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { Public } from '../../common/auth/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Exchange the external IdP token for our app JWT. Public: the user has no
  // app token yet when they call this.
  @Public()
  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.token);
  }

  // Returns the currently authenticated user's claims (protected by the global
  // JwtAuthGuard). Handy for the client to rehydrate auth state.
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
