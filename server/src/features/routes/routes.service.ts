import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, lte } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../../common/database/database.constants';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route, routes } from './routes.schema';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

  findAll(): Promise<Route[]> {
    return this.db
      .select()
      .from(routes)
      .where(eq(routes.isDeleted, false))
      .orderBy(desc(routes.date));
  }

  async findOne(id: string): Promise<Route> {
    const [route] = await this.db
      .select()
      .from(routes)
      .where(and(eq(routes.id, id), eq(routes.isDeleted, false)));
    if (!route) throw new NotFoundException(`Route ${id} not found`);
    return route;
  }

  async findClosest(date: string): Promise<Route> {
    // Newest route at or before the target date wins — same date if present,
    // otherwise the closest preceding one.
    const [route] = await this.db
      .select()
      .from(routes)
      .where(and(eq(routes.isDeleted, false), lte(routes.date, date)))
      .orderBy(desc(routes.date))
      .limit(1);
    if (!route)
      throw new NotFoundException(`No route found on or before ${date}`);
    return route;
  }

  async create(dto: CreateRouteDto): Promise<Route> {
    // Upsert by date: there is exactly one route per date. Posting a date that
    // already exists overwrites that route's name/geometry (and resurrects it if
    // it had been soft-deleted) instead of inserting a duplicate.
    const [route] = await this.db
      .insert(routes)
      .values(dto)
      .onConflictDoUpdate({
        target: routes.date,
        set: {
          name: dto.name,
          data: dto.data,
          isDeleted: false,
          updatedAt: new Date(),
        },
      })
      .returning();
    this.logger.log(`Upserted route ${route.id} for ${dto.date}`);
    return route;
  }

  async update(id: string, dto: UpdateRouteDto): Promise<Route> {
    const [route] = await this.db
      .update(routes)
      .set(dto)
      .where(and(eq(routes.id, id), eq(routes.isDeleted, false)))
      .returning();
    if (!route) throw new NotFoundException(`Route ${id} not found`);
    return route;
  }

  async removeByDate(date: string): Promise<void> {
    // Soft-delete the route that belongs to this exact date. Emptying a date's
    // map removes its own route so `findClosest` falls back to the closest
    // preceding date again. If the date never had its own route (the map was
    // showing a fallback from an earlier date), this is a no-op — we must not
    // delete that earlier route, which still belongs to its own date.
    await this.db
      .update(routes)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(routes.date, date), eq(routes.isDeleted, false)));
    this.logger.log(`Soft-deleted route for ${date}`);
  }

  async remove(id: string): Promise<void> {
    // Soft delete: flag the row instead of removing it so the data is retained.
    const [route] = await this.db
      .update(routes)
      .set({ isDeleted: true })
      .where(and(eq(routes.id, id), eq(routes.isDeleted, false)))
      .returning();
    if (!route) throw new NotFoundException(`Route ${id} not found`);
    this.logger.log(`Soft-deleted route ${id}`);
  }
}
