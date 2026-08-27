import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { MovieEntity } from './entities/movie.entity';
import { MoviesModule } from './movies.module';
import { DatabaseModule } from '../utils/database/database.module';
import { seedMovie } from '../utils/tests/movie-seeds';
import { MovieResponse } from '../utils/tests/movie-seeds';

describe('Integração CRUD de filmes', () => {
    let app: INestApplication<App>;
    let movieRepository: Repository<MovieEntity>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [DatabaseModule, MoviesModule],
      }).compile();
  
      app = module.createNestApplication();
      await app.init();
  
      movieRepository = app.get<Repository<MovieEntity>>(
        getRepositoryToken(MovieEntity),
      );

    });
  
    afterEach(async () => {
      await app.close();
    });

    it('lista filmes e busca um filme por id', async () => {
        const firstMovie = await seedMovie(app, {
          year: 1980,
          title: 'Movie A',
          studios: 'Studio A',
          producers: ['Producer A'],
          winner: true,
        });
        await seedMovie(app, {
          year: 1981,
          title: 'Movie B',
          studios: 'Studio B',
          producers: ['Producer B'],
          winner: true,
        });
    
        const listResponse = await request(app.getHttpServer())
          .get('/movies')
          .expect(200);
        const movies = listResponse.body as MovieResponse[];
    
        expect(movies.map((movie) => movie.title)).toEqual(['Movie A', 'Movie B']);
    
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
      it('cria um filme', async () => {

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
      });
      it('atualiza um filme com put', async () => {
        const movieToUpdate = await seedMovie(app, {
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
        });
        it('remove um filme', async () => {
            const firstMovieToRemove = await seedMovie(app, {
              year: 1981,
              title: 'Movie B',
              studios: 'Studio B',
              producers: ['Producer A'],
              winner: true,
            });
            await request(app.getHttpServer())
      .delete(`/movies/${firstMovieToRemove.id}`)
      .expect(204);
        });
        it('retorna 405 quando o método do item não é permitido', async () => {
            const movie = await seedMovie(app, {
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
    });
