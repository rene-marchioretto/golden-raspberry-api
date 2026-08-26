import { Module } from '@nestjs/common';
import { DatasetBootstrapService } from './dataset-bootstrap.service';

@Module({
  providers: [DatasetBootstrapService]
})
export class DatasetBootstrapModule {}
