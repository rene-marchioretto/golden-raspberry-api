import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardWinningProducersModule } from '../../award-winning-producers/award-winning-producers.module';
import { MovieEntity } from '../../movies/entities/movie.entity';
import { DatasetBootstrapService } from './dataset-bootstrap.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity]),
    AwardWinningProducersModule,
  ],
  providers: [DatasetBootstrapService],
})
export class DatasetBootstrapModule {}