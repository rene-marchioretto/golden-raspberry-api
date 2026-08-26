import { Module } from '@nestjs/common';
import { DatabaseModule } from './utils/database/database.module';
import { DatasetBootstrapModule } from './utils/dataset-bootstrap/dataset-bootstrap.module';
import { MoviesModule } from './movies/movies.module';
import { AwardWinningProducersModule } from './award-winning-producers/award-winning-producers.module';

@Module({
  imports: [DatabaseModule, DatasetBootstrapModule, MoviesModule, AwardWinningProducersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
