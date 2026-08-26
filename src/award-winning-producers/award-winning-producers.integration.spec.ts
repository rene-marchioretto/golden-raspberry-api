import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AwardWinningProducersModule } from './award-winning-producers.module';
import { AwardWinningProducerIntervalsResponseDto } from './dto/award-winning-producer-interval.dto';
import { MoviesModule } from '../movies/movies.module';
import { DatabaseModule } from '../utils/database/database.module';
import { createMovie } from '../utils/tests/movie-seeds';


describe('Integração do controller de produtores vencedores', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AwardWinningProducersModule,
        MoviesModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('retorna min e max vazios quando não há intervalos de produtores', async () => {
    await expectIntervals({
      min: [],
      max: [],
    });
  });

  it('adiciona uma segunda vitória consecutiva e preenche min e max', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });

    await expectIntervals({
      min: [],
      max: [],
    });

    await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });

    await expectIntervals({
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
    });
  });


  async function expectIntervals(
    expected: AwardWinningProducerIntervalsResponseDto,
  ): Promise<void> {
    const response = await request(app.getHttpServer())
      .get('/award-winning-producers')
      .expect(200);
    const body = response.body as AwardWinningProducerIntervalsResponseDto;

    expect(body).toEqual(expected);
  }
});
