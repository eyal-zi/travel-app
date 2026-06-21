import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAnnouncementDto {
  // The announcement body. The author is set server-side ("System"), not
  // accepted from the client.
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  text: string;
}
