import { IsIsoDate } from '../../../common/validators/is-iso-date.validator';

// Query carrying a single calendar date ("YYYY-MM-DD"). Backs GET /closest (the
// route for this date, or the closest preceding one) and DELETE (remove the route
// for this exact date).
export class RouteDateQueryDto {
  @IsIsoDate()
  date: string;
}
