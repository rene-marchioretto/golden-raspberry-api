import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  AwardWinningProducerIntervalsResponseDto,
  AwardWinningProducerIntervalDto,
} from './dto/award-winning-producer-interval.dto';
import {
  AwardWinningProducerIntervalEntity,
} from './entities/award-winning-producer.entity';
import { MovieEntity } from '../movies/entities/movie.entity';

@Injectable()
export class AwardWinningProducersService {
  constructor(
    @InjectRepository(AwardWinningProducerIntervalEntity)
    private readonly intervalRepository: Repository<AwardWinningProducerIntervalEntity>,
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async findIntervals(): Promise<AwardWinningProducerIntervalsResponseDto> {
    const intervals = await this.intervalRepository.find({
      order: {
        interval: 'ASC',
        producer: 'ASC',
      },
    });

    return {
      min: this.toIntervalDtos(intervals, 'min'),
      max: this.toIntervalDtos(intervals, 'max'),
    };
  }
  private toIntervalDtos(
    intervals: AwardWinningProducerIntervalEntity[],
    kind: 'min' | 'max',
  ): AwardWinningProducerIntervalDto[] {
    return intervals
      .filter((interval) => interval.kind === kind)
      .map((interval) => ({
        producer: interval.producer,
        interval: interval.interval,
        previousWin: interval.previousWin,
        followingWin: interval.followingWin,
      }));
  }
}
