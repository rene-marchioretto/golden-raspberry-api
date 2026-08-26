import { Module } from '@nestjs/common';
import { DatabaseModule } from './utils/database/database.module';
import { DatasetBootstrapModule } from './utils/dataset-bootstrap/dataset-bootstrap.module';

@Module({
  imports: [DatabaseModule, DatasetBootstrapModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
