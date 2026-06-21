import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, desc, eq, lt } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import { announcements, Announcement } from './announcements.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

export interface AnnouncementPage {
  items: Announcement[];
  // `createdAt` of the last item, to be passed back as the next cursor. Null when
  // there are no older announcements left.
  nextCursor: string | null;
}

const DEFAULT_LIMIT = 20;

@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  // Newest-first page. Fetches limit + 1 rows to tell whether an older page
  // exists, then trims to the requested size and exposes the cursor.
  async findPage(
    limit = DEFAULT_LIMIT,
    cursor?: string,
  ): Promise<AnnouncementPage> {
    const rows = await this.db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.isDeleted, false),
          cursor ? lt(announcements.createdAt, new Date(cursor)) : undefined,
        ),
      )
      .orderBy(desc(announcements.createdAt), desc(announcements.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore
      ? items[items.length - 1].createdAt.toISOString()
      : null;

    return { items, nextCursor };
  }

  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    const [announcement] = await this.db
      .insert(announcements)
      .values({ text: dto.text, author: 'System' })
      .returning();
    this.logger.log(`Created announcement ${announcement.id}`);
    return announcement;
  }
}
