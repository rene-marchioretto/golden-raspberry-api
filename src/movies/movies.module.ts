import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MovieEntity } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardWinningProducersModule } from '../award-winning-producers/award-winning-producers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity]),
    AwardWinningProducersModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}