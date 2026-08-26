import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwardWinningProducersService } from './award-winning-producers.service';
import { CreateAwardWinningProducerDto } from './dto/create-award-winning-producer.dto';
import { UpdateAwardWinningProducerDto } from './dto/update-award-winning-producer.dto';
import { AwardWinningProducerIntervalsResponseDto } from './dto/award-winning-producer-interval.dto';

@Controller('award-winning-producers')
export class AwardWinningProducersController {
  constructor(
    private readonly awardWinningProducersService: AwardWinningProducersService,
  ) {}

  @Get()
  findIntervals(): Promise<AwardWinningProducerIntervalsResponseDto> {
    return this.awardWinningProducersService.findIntervals();
  }
}
