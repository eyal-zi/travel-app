import { IsIn } from 'class-validator';
import {
  TRIP_REQUEST_STATUSES,
  type TripRequestStatus,
} from '../trip-requests.schema';

// Body for advancing a trip request through its workflow. `status` is the only
// field admins can change; everything else is set at intake.
export class UpdateTripRequestStatusDto {
  @IsIn(TRIP_REQUEST_STATUSES)
  status: TripRequestStatus;
}
