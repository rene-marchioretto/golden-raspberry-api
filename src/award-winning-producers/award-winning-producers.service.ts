import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  AwardWinningProducerIntervalDto,
  AwardWinningProducerIntervalsResponseDto,
  ProducerWinInterval,
} from './dto/award-winning-producer-interval.dto';
import {
  AwardWinningProducerIntervalEntity,
  AwardWinningProducerIntervalProps,
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
      min: this.findInterval(intervals, 'min'),
      max: this.findInterval(intervals, 'max'),
    };
  }

  private findInterval(
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

  async refreshWatchedList(): Promise<void> {
    const winningMovies = await this.movieRepository.find({
      where: {
        winner: true,
      },
      order: {
        year: 'ASC',
      },
    });
    const watchedList = this.buildWatchedList(winningMovies);

    await this.intervalRepository.manager.transaction(async (manager) => {
      await manager.clear(AwardWinningProducerIntervalEntity);

      if (watchedList.length > 0) {
        await manager.save(
          AwardWinningProducerIntervalEntity,
          watchedList.map((interval) =>
            AwardWinningProducerIntervalEntity.create(interval),
          ),
        );
      }
    });
  }

  private buildWatchedList(
    movies: MovieEntity[],
  ): AwardWinningProducerIntervalProps[] {
    const intervals = this.calculateProducerIntervals(movies);

    if (intervals.length === 0) {
      return [];
    }

    const minInterval = Math.min(
      ...intervals.map((interval) => interval.interval),
    );
    const maxInterval = Math.max(
      ...intervals.map((interval) => interval.interval),
    );

    return [
      ...this.tiedIntervals(intervals, minInterval, 'min'),
      ...this.tiedIntervals(intervals, maxInterval, 'max'),
    ];
  }

  private tiedIntervals(
    intervals: ProducerWinInterval[],
    interval: number,
    kind: 'min' | 'max',
  ): AwardWinningProducerIntervalProps[] {
    return intervals
      .filter((item) => item.interval === interval)
      .map((item) => ({
        ...item,
        kind,
      }));
  }

  private calculateProducerIntervals(
    movies: MovieEntity[],
  ): ProducerWinInterval[] {
    const winsByProducer = new Map<string, Set<number>>();

    for (const movie of movies) {
      for (const producer of movie.producers) {
        const producerName = producer.trim();

        if (!producerName) {
          continue;
        }

        const producerWins = winsByProducer.get(producerName) ?? new Set();

        producerWins.add(movie.year);
        winsByProducer.set(producerName, producerWins);
      }
    }

    const intervals: ProducerWinInterval[] = [];

    for (const [producer, wins] of winsByProducer) {
      const years = [...wins].sort((a, b) => a - b);

      for (let i = 1; i < years.length; i++) {
        const previousWin = years[i - 1];
        const followingWin = years[i];

        intervals.push({
          producer,
          interval: followingWin - previousWin,
          previousWin,
          followingWin,
        });
      }
    }

    return intervals;
  }

}
