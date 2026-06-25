import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EVENT_COLORS, type EventColor } from '../events.schema';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  start?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  end?: string;

  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @IsOptional()
  @IsIn(EVENT_COLORS)
  color?: EventColor;
}
