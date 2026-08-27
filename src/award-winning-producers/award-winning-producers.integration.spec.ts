import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AwardWinningProducersModule } from './award-winning-producers.module';
import { MoviesModule } from '../movies/movies.module';
import { DatabaseModule } from '../utils/database/database.module';
import { createMovie, MoviePayload, MovieResponse } from '../utils/tests/movie-seeds';
import { expectIntervals } from '../utils/tests/interval';
import { HttpModule } from '../http/http.module';


describe('Suite de testes para o controller de produtores vencedores', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AwardWinningProducersModule,
        MoviesModule,
        HttpModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('deve retornar os valores máximos e mínimos dos dois filmes mockados', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });

    await expectIntervals(app, {
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

    await expectIntervals(app, {
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

  it('atualiza os valores máximos e mínimos quando um filme vencedor é adicionado', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    await createMovie(app, {
      year: 2002,
      title: 'Movie C',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });

    await expectIntervals (app, {
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

    await createMovie(app, {
      year: 2015,
      title: 'Movie D',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });

    await expectIntervals (app, {
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
          producer: 'Producer B',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    });
  });

  it('testa a adição de um filme que não alteraria o produto final', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });

    await createMovie(app, {
      year: 1992,
      title: 'Movie E',
      studios: 'Studio',
      producers: ['Producer A', 'Producer B'],
      winner: false,
    });

    await expectIntervals(app, {
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

  it('ignora filmes com apenas um prêmio', async () => {
    await createMovie(app, {
      year: 2000,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    await createMovie(app, {
      year: 2001,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    await createMovie(app, {
      year: 1990,
      title: 'Movie C',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });
    await createMovie(app, {
      year: 2003,
      title: 'Movie D',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });
    await createMovie(app, {
      year: 1980,
      title: 'Movie E',
      studios: 'Studio',
      producers: ['Producer C'],
      winner: true,
    });
    await createMovie(app, {
      year: 1985,
      title: 'Movie F',
      studios: 'Studio',
      producers: ['Producer C'],
      winner: true,
    });

    await expectIntervals(app, {
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 2000,
          followingWin: 2001,
        },
      ],
      max: [
        {
          producer: 'Producer B',
          interval: 13,
          previousWin: 1990,
          followingWin: 2003,
        },
      ],
    });
  });

  it('atualiza o intervalo quando o ano de um filme vencedor é atualizado pelo usuário', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    const laterWin = await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });

    await request(app.getHttpServer())
      .patch(`/movies/${laterWin.id}`)
      .send({
        year: 2000,
      })
      .expect(200);

    await expectIntervals(app, {
      min: [
        {
          producer: 'Producer A',
          interval: 10,
          previousWin: 1990,
          followingWin: 2000,
        },
      ],
      max: [
        {
          producer: 'Producer A',
          interval: 10,
          previousWin: 1990,
          followingWin: 2000,
        },
      ],
    });
  });

  it('atualiza corretamentes os valores quando o produtor de um filme é substituído', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    const laterWin = await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });

    await request(app.getHttpServer())
      .put(`/movies/${laterWin.id}`)
      .send({
        year: 1991,
        title: 'Movie B',
        studios: 'Studio',
        producers: ['Producer B'],
        winner: true,
      })
      .expect(200);

    await expectIntervals(app, {
      min: [],
      max: [],
    });

    await createMovie(app, {
      year: 2004,
      title: 'Movie F',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });

    await expectIntervals(app, {
      min: [
        {
          producer: 'Producer B',
          interval: 13,
          previousWin: 1991,
          followingWin: 2004,
        },
      ],
      max: [
        {
          producer: 'Producer B',
          interval: 13,
          previousWin: 1991,
          followingWin: 2004,
        },
      ],
    });
  });

  it('remove corretamente um filme quando ele é alterado para perdedor', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    const laterWin = await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });

    await request(app.getHttpServer())
      .patch(`/movies/${laterWin.id}`)
      .send({
        winner: false,
      })
      .expect(200);

    await expectIntervals(app, {
      min: [],
      max: [],
    });
  });

  it('recalcula os intervalos quando um filme vencedor é excluído', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    const longestWin = await createMovie(app, {
      year: 2002,
      title: 'Movie C',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });
    await createMovie(app, {
      year: 2015,
      title: 'Movie D',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });

    await request(app.getHttpServer())
      .delete(`/movies/${longestWin.id}`)
      .expect(204);

    await expectIntervals(app, {
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

  it('retorna os dois produtores quando há um empate', async () => {
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A', 'Producer C'],
      winner: true,
    });
    await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A', 'Producer C'],
      winner: true,
    });

    await expectIntervals(app, {
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
        {
          producer: 'Producer C',
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
        {
          producer: 'Producer C',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
    });
  });

  it('retorna todos os produtores que compartilham o menor ou o maior intervalo', async () => {
    await createMovie(app, {
      year: 1980,
      title: 'Movie G',
      studios: 'Studio',
      producers: ['Producer D'],
      winner: true,
    });
    await createMovie(app, {
      year: 1981,
      title: 'Movie H',
      studios: 'Studio',
      producers: ['Producer D'],
      winner: true,
    });
    await createMovie(app, {
      year: 1990,
      title: 'Movie A',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    await createMovie(app, {
      year: 1991,
      title: 'Movie B',
      studios: 'Studio',
      producers: ['Producer A'],
      winner: true,
    });
    await createMovie(app, {
      year: 2002,
      title: 'Movie C',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });
    await createMovie(app, {
      year: 2015,
      title: 'Movie D',
      studios: 'Studio',
      producers: ['Producer B'],
      winner: true,
    });
    await createMovie(app, {
      year: 1985,
      title: 'Movie I',
      studios: 'Studio',
      producers: ['Producer E'],
      winner: true,
    });
    await createMovie(app, {
      year: 1998,
      title: 'Movie J',
      studios: 'Studio',
      producers: ['Producer E'],
      winner: true,
    });

    await expectIntervals(app, {
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
        {
          producer: 'Producer D',
          interval: 1,
          previousWin: 1980,
          followingWin: 1981,
        },
      ],
      max: [
        {
          producer: 'Producer B',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
        {
          producer: 'Producer E',
          interval: 13,
          previousWin: 1985,
          followingWin: 1998,
        },
      ],
    });
  });
  it('retorna 405 quando o método não é permitido', async () => {
    const response = await request(app.getHttpServer())
      .post('/award-winning-producers')
      .send({})
      .expect(405)
      .expect((res) => {
        expect(res.body).toMatchObject({
          statusCode: 405,
          message: 'Method Not Allowed',
        });
      });
  });
});
