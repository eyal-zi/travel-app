import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import {
  buildPage,
  keysetCondition,
  type Page,
} from '../../common/pagination/keyset';
import { announcements, Announcement } from './announcements.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

export type AnnouncementPage = Page<Announcement>;

const DEFAULT_LIMIT = 20;

@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

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
          keysetCondition(announcements.createdAt, announcements.id, cursor),
        ),
      )
      .orderBy(desc(announcements.createdAt), desc(announcements.id))
      .limit(limit + 1);

    return buildPage(rows, limit, (row) => ({
      createdAt: row.createdAt,
      id: row.id,
    }));
  }

  async create(
    dto: CreateAnnouncementDto,
    author: string,
  ): Promise<Announcement> {
    const [announcement] = await this.db
      .insert(announcements)
      .values({ text: dto.text, author })
      .returning();
    this.logger.log(`Created announcement ${announcement.id}`);
    return announcement;
  }
}
