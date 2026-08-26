import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardWinningProducersService } from './award-winning-producers.service';
import { AwardWinningProducersController } from './award-winning-producers.controller';
import { AwardWinningProducerIntervalEntity } from './entities/award-winning-producer.entity';
import { MovieEntity } from '../movies/entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AwardWinningProducerIntervalEntity,
      MovieEntity,
    ]),
  ],
  controllers: [AwardWinningProducersController],
  providers: [AwardWinningProducersService],
  exports: [AwardWinningProducersService],
})
export class AwardWinningProducersModule {}
