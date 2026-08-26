import { Module } from '@nestjs/common';
import { DatabaseModule } from './utils/database/database.module';
import { DatasetBootstrapModule } from './utils/dataset-bootstrap/dataset-bootstrap.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [DatabaseModule, DatasetBootstrapModule, MoviesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
