import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';

import { AwardWinningProducersService } from '../award-winning-producers/award-winning-producers.service';
import { AwardWinningProducerIntervalsResponseDto } from '../award-winning-producers/dto/award-winning-producer-interval.dto';
import { HttpModule } from '../http/http.module';
import { DatabaseModule } from '../utils/database/database.module';
import { MovieEntity } from './entities/movie.entity';
import { MoviesModule } from './movies.module';

interface MovieResponse {
  id: number;
  year: number;
  title: string;
  studios: string;
  producers: string[];
  winner: boolean;
}

describe('Integração CRUD de filmes', () => {
  let app: INestApplication<App>;
  let movieRepository: Repository<MovieEntity>;
  let awardWinningProducersService: AwardWinningProducersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HttpModule, MoviesModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    movieRepository = app.get<Repository<MovieEntity>>(
      getRepositoryToken(MovieEntity),
    );
    awardWinningProducersService = app.get(AwardWinningProducersService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('cria um filme e atualiza a lista de produtores vencedores', async () => {
    await seedMovie({
      year: 1980,
      title: 'Movie A',
      studios: 'Studio A',
      producers: ['Producer A'],
      winner: true,
    });

    const response = await request(app.getHttpServer())
      .post('/movies')
      .send({
        year: 1981,
        title: 'Movie B',
        studios: 'Studio B',
        producers: ['Producer A'],
        winner: true,
      })
      .expect(201);
    const body = response.body as MovieResponse;

    expect(body).toMatchObject({
      year: 1981,
      title: 'Movie B',
      studios: 'Studio B',
      producers: ['Producer A'],
      winner: true,
    });
    expect(response.headers.location).toBe(`/movies/${body.id}`);
    await expect(movieRepository.count()).resolves.toBe(2);
    await expectAwardWinningProducers({
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1980,
          followingWin: 1981,
        },
      ],
      max: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1980,
          followingWin: 1981,
        },
      ],
    });
  });

  it('lista filmes e busca um filme por id', async () => {
    const firstMovie = await seedMovie({
      year: 1980,
      title: 'Movie A',
      studios: 'Studio A',
      producers: ['Producer A'],
      winner: true,
    });
    await seedMovie({
      year: 1981,
      title: 'Movie B',
      studios: 'Studio B',
      producers: ['Producer B'],
      winner: true,
    });

    const listResponse = await request(app.getHttpServer())
      .get('/movies')
      .expect(200);
    const listBody = listResponse.body as {
      data: MovieResponse[];
      total: number;
      page: number;
      limit: number;
      pageCount: number;
    };

    expect(listBody.data.map((movie) => movie.title)).toEqual([
      'Movie A',
      'Movie B',
    ]);
    expect(listBody).toMatchObject({
      total: 2,
      page: 1,
      limit: 20,
      pageCount: 1,
    });

    const findResponse = await request(app.getHttpServer())
      .get(`/movies/${firstMovie.id}`)
      .expect(200);
    const movie = findResponse.body as MovieResponse;

    expect(movie).toMatchObject({
      id: firstMovie.id,
      title: 'Movie A',
      producers: ['Producer A'],
    });
  });

  it('pagina a listagem de filmes', async () => {
    await seedMovie({
      year: 1980,
      title: 'Movie A',
      studios: 'Studio A',
      producers: ['Producer A'],
      winner: true,
    });
    await seedMovie({
      year: 1981,
      title: 'Movie B',
      studios: 'Studio B',
      producers: ['Producer B'],
      winner: true,
    });
    await seedMovie({
      year: 1982,
      title: 'Movie C',
      studios: 'Studio C',
      producers: ['Producer C'],
      winner: false,
    });

    const response = await request(app.getHttpServer())
      .get('/movies')
      .query({ page: 2, limit: 2 })
      .expect(200);
    const body = response.body as {
      data: MovieResponse[];
      total: number;
      page: number;
      limit: number;
      pageCount: number;
    };

    expect(body.data.map((movie) => movie.title)).toEqual(['Movie C']);
    expect(body).toMatchObject({
      total: 3,
      page: 2,
      limit: 2,
      pageCount: 2,
    });
  });

  it('atualiza um filme com put e atualiza a lista de produtores vencedores', async () => {
    await seedMovie({
      year: 1980,
      title: 'Movie A',
      studios: 'Studio A',
      producers: ['Producer A'],
      winner: true,
    });
    const movieToUpdate = await seedMovie({
      year: 1980,
      title: 'Movie C',
      studios: 'Studio C',
      producers: ['Producer C'],
      winner: false,
    });

    const response = await request(app.getHttpServer())
      .put(`/movies/${movieToUpdate.id}`)
      .send({
        year: 1981,
        title: 'Movie C Updated',
        studios: 'Studio C Updated',
        producers: ['Producer A'],
        winner: true,
      })
      .expect(200);
    const body = response.body as MovieResponse;

    expect(body).toMatchObject({
      id: movieToUpdate.id,
      year: 1981,
      title: 'Movie C Updated',
      studios: 'Studio C Updated',
      producers: ['Producer A'],
      winner: true,
    });
    await expectAwardWinningProducers({
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1980,
          followingWin: 1981,
        },
      ],
      max: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1980,
          followingWin: 1981,
        },
      ],
    });
  });

  it('faz patch em um filme e atualiza a lista de produtores vencedores', async () => {
    await seedMovie({
      year: 1980,
      title: 'Movie A',
      studios: 'Studio A',
      producers: ['Producer A'],
      winner: true,
    });
    const movieToPatch = await seedMovie({
      year: 1981,
      title: 'Movie C',
      studios: 'Studio C',
      producers: ['Producer C'],
      winner: false,
    });

    const response = await request(app.getHttpServer())
      .patch(`/movies/${movieToPatch.id}`)
      .send({
        producers: ['Producer A'],
        winner: true,
      })
      .expect(200);
    const body = response.body as MovieResponse;

    expect(body).toMatchObject({
      id: movieToPatch.id,
      year: 1981,
      title: 'Movie C',
      studios: 'Studio C',
      producers: ['Producer A'],
      winner: true,
    });
    await expectAwardWinningProducers({
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1980,
          followingWin: 1981,
        },
      ],
      max: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1980,
          followingWin: 1981,
        },
      ],
    });
  });

  it('remove um filme e atualiza a lista de produtores vencedores', async () => {
    const firstMovie = await seedMovie({
      year: 1980,
      title: 'Movie A',
      studios: 'Studio A',
      producers: ['Producer A'],
      winner: true,
    });
    const secondMovie = await seedMovie({
      year: 1981,
      title: 'Movie B',
      studios: 'Studio B',
      producers: ['Producer A'],
      winner: true,
    });
    await awardWinningProducersService.refreshWatchedList();

    await request(app.getHttpServer())
      .delete(`/movies/${secondMovie.id}`)
      .expect(204);

    await expect(
      movieRepository.findOneBy({ id: secondMovie.id }),
    ).resolves.toBeNull();
    await expect(
      movieRepository.findOneBy({ id: firstMovie.id }),
    ).resolves.toBeDefined();
    await expectAwardWinningProducers({
      min: [],
      max: [],
    });
  });

  it('retorna 404 quando o filme não existe', async () => {
    const notFound = {
      statusCode: 404,
      message: 'Movie 999 was not found.',
      error: 'Not Found',
    };

    await request(app.getHttpServer())
      .get('/movies/999')
      .expect(404)
      .expect((res) => {
        expect(res.body).toMatchObject({
          ...notFound,
          path: '/movies/999',
        });
        expect(res.body.timestamp).toEqual(expect.any(String));
      });
    await request(app.getHttpServer())
      .put('/movies/999')
      .send({
        year: 1981,
        title: 'Movie X',
        studios: 'Studio X',
        producers: ['Producer X'],
        winner: false,
      })
      .expect(404)
      .expect((res) => {
        expect(res.body).toMatchObject(notFound);
      });
    await request(app.getHttpServer())
      .patch('/movies/999')
      .send({
        winner: true,
      })
      .expect(404)
      .expect((res) => {
        expect(res.body).toMatchObject(notFound);
      });
    await request(app.getHttpServer())
      .delete('/movies/999')
      .expect(404)
      .expect((res) => {
        expect(res.body).toMatchObject(notFound);
      });
  });

  it('rejeita payload inválido na criação', async () => {
    const response = await request(app.getHttpServer())
      .post('/movies')
      .send({
        year: '1981',
        title: 'Movie B',
        studios: 'Studio B',
        producers: ['Producer B'],
        winner: true,
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: expect.arrayContaining(['year must be an integer number']),
      error: 'Bad Request',
    });
    await expect(movieRepository.count()).resolves.toBe(0);
  });

  it('rejeita campos desconhecidos na criação', async () => {
    const response = await request(app.getHttpServer())
      .post('/movies')
      .send({
        year: 1981,
        title: 'Movie B',
        studios: 'Studio B',
        producers: ['Producer B'],
        winner: true,
        extra: true,
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: expect.arrayContaining(['property extra should not exist']),
      error: 'Bad Request',
    });
  });

  it('retorna 400 quando o id do filme não é numérico', async () => {
    await request(app.getHttpServer())
      .get('/movies/abc')
      .expect(400)
      .expect((res) => {
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          path: '/movies/abc',
        });
      });
  });

  it('retorna 405 quando o método do item não é permitido', async () => {
    const movie = await seedMovie({
      year: 1980,
      title: 'Movie A',
      studios: 'Studio A',
      producers: ['Producer A'],
      winner: true,
    });

    const response = await request(app.getHttpServer())
      .post(`/movies/${movie.id}`)
      .send({
        year: 1981,
        title: 'Movie B',
        studios: 'Studio B',
        producers: ['Producer B'],
        winner: true,
      })
      .expect(405)
      .expect((res) => {
        expect(res.body).toMatchObject({
          statusCode: 405,
          message: 'Method Not Allowed',
        });
      });

    expect(response.headers.allow).toBe('GET, PUT, PATCH, DELETE');
  });

  async function seedMovie(movie: {
    year: number;
    title: string;
    studios: string;
    producers: string[];
    winner: boolean;
  }): Promise<MovieEntity> {
    return movieRepository.save(MovieEntity.create(movie));
  }

  async function expectAwardWinningProducers(
    expected: AwardWinningProducerIntervalsResponseDto,
  ): Promise<void> {
    const response = await request(app.getHttpServer())
      .get('/award-winning-producers')
      .expect(200);
    const body = response.body as AwardWinningProducerIntervalsResponseDto;

    expect(body).toEqual(expected);
  }
});
