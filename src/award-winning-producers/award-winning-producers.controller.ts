import { Controller, Get, Post, Body, Patch, Param, Delete, MethodNotAllowedException, All, Header } from '@nestjs/common';
import { AwardWinningProducersService } from './award-winning-producers.service';
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
  @Header('Allow', 'GET')
  @All()
  notAllowed(): never {
    throw new MethodNotAllowedException();
  }
}
