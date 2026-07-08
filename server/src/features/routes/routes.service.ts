import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, lte } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route, routes } from './routes.schema';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

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
    const set: Partial<Pick<Route, 'name' | 'data'>> = {};
    if (dto.name !== undefined) set.name = dto.name;
    if (dto.data !== undefined) set.data = dto.data;

    const [route] = await this.db
      .update(routes)
      .set(set)
      .where(and(eq(routes.id, id), eq(routes.isDeleted, false)))
      .returning();
    if (!route) throw new NotFoundException(`Route ${id} not found`);
    return route;
  }

  async removeByDate(date: string): Promise<void> {
    await this.db
      .update(routes)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(routes.date, date), eq(routes.isDeleted, false)));
    this.logger.log(`Soft-deleted route for ${date}`);
  }

  async remove(id: string): Promise<void> {
    const [route] = await this.db
      .update(routes)
      .set({ isDeleted: true })
      .where(and(eq(routes.id, id), eq(routes.isDeleted, false)))
      .returning();
    if (!route) throw new NotFoundException(`Route ${id} not found`);
    this.logger.log(`Soft-deleted route ${id}`);
  }
}
