import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, lt } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import {
  tripRequests,
  TripRequest,
  type TripRequestStatus,
} from './trip-requests.schema';
import { CreateTripRequestDto } from './dto/create-trip-request.dto';

export interface TripRequestPage {
  items: TripRequest[];
  // `createdAt` of the last item, to be passed back as the next cursor. Null when
  // there are no older trip requests left.
  nextCursor: string | null;
}

const DEFAULT_LIMIT = 20;

@Injectable()
export class TripRequestsService {
  private readonly logger = new Logger(TripRequestsService.name);

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  // Newest-first page, optionally filtered by status. Fetches limit + 1 rows to
  // tell whether an older page exists, then trims to the requested size and
  // exposes the cursor.
  async findPage(
    limit = DEFAULT_LIMIT,
    cursor?: string,
    status?: TripRequestStatus,
  ): Promise<TripRequestPage> {
    const rows = await this.db
      .select()
      .from(tripRequests)
      .where(
        and(
          cursor ? lt(tripRequests.createdAt, new Date(cursor)) : undefined,
          status ? eq(tripRequests.status, status) : undefined,
        ),
      )
      .orderBy(desc(tripRequests.createdAt), desc(tripRequests.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore
      ? items[items.length - 1].createdAt.toISOString()
      : null;

    return { items, nextCursor };
  }

  async create(dto: CreateTripRequestDto): Promise<TripRequest> {
    // `status` is omitted so it falls back to the column default ("received").
    const [tripRequest] = await this.db
      .insert(tripRequests)
      .values(dto)
      .returning();
    this.logger.log(`Created trip request ${tripRequest.id}`);
    return tripRequest;
  }

  // Advances a trip request's workflow status. `updatedAt` bumps automatically
  // via the schema's $onUpdate.
  async updateStatus(
    id: string,
    status: TripRequestStatus,
  ): Promise<TripRequest> {
    const [tripRequest] = await this.db
      .update(tripRequests)
      .set({ status })
      .where(eq(tripRequests.id, id))
      .returning();
    if (!tripRequest) {
      throw new NotFoundException(`Trip request ${id} not found`);
    }
    this.logger.log(`Updated trip request ${id} status to ${status}`);
    return tripRequest;
  }
}
