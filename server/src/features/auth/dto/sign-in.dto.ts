import { IsNotEmpty, IsString } from 'class-validator';

// The external IdP token the client received via the SSO popup. We verify it,
// upsert the user, and exchange it for our own app JWT.
export class SignInDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
