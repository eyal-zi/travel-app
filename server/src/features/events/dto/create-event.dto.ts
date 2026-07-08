import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EVENT_STYLES, type EventStyle } from '../events.schema';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  start: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  end?: string;

  @IsBoolean()
  allDay: boolean;

  @IsOptional()
  @IsIn(EVENT_STYLES)
  style?: EventStyle;
}
