import { Module } from '@nestjs/common';
import { AwardWinningProducersService } from './award-winning-producers.service';
import { AwardWinningProducersController } from './award-winning-producers.controller';

@Module({
  controllers: [AwardWinningProducersController],
  providers: [AwardWinningProducersService],
})
export class AwardWinningProducersModule {}
