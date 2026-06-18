import { Global, Module } from '@nestjs/common';
import { DRIZZLE } from './database.constants';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: DRIZZLE,
      inject: [DatabaseService],
      useFactory: (databaseService: DatabaseService) => databaseService.db,
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
