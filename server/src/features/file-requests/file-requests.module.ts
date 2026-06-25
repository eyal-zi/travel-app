import { Module } from '@nestjs/common';
import { StorageModule } from '../../common/storage/storage.module';
import { FileRequestsController } from './file-requests.controller';
import { FileRequestsService } from './file-requests.service';

@Module({
  imports: [StorageModule],
  controllers: [FileRequestsController],
  providers: [FileRequestsService],
})
export class FileRequestsModule {}
