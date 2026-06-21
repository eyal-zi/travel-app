import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, events } from './events.schema';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll(): Promise<Event[]> {
    return this.db
      .select()
      .from(events)
      .where(eq(events.isDeleted, false))
      .orderBy(asc(events.start));
  }

  async findOne(id: string): Promise<Event> {
    const [event] = await this.db
      .select()
      .from(events)
      .where(and(eq(events.id, id), eq(events.isDeleted, false)));
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  async create(dto: CreateEventDto): Promise<Event> {
    const [event] = await this.db.insert(events).values(dto).returning();
    this.logger.log(`Created event ${event.id}`);
    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const [event] = await this.db
      .update(events)
      .set(dto)
      .where(and(eq(events.id, id), eq(events.isDeleted, false)))
      .returning();
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  async remove(id: string): Promise<void> {
    // Soft delete: flag the row instead of removing it so the data is retained.
    const [event] = await this.db
      .update(events)
      .set({ isDeleted: true })
      .where(and(eq(events.id, id), eq(events.isDeleted, false)))
      .returning();
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    this.logger.log(`Soft-deleted event ${id}`);
  }
}
