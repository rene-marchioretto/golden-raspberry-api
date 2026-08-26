import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from '../../movies/entities/movie.entity';
import { DatabaseModule } from '../database/database.module';
import { DatasetBootstrapModule } from './dataset-bootstrap.module';

describe('Bootstrap do dataset', () => {
  let app: INestApplication;
  let movieRepository: Repository<MovieEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, DatasetBootstrapModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    movieRepository = app.get(getRepositoryToken(MovieEntity));

  });

  afterEach(async () => {
    await app.close();
  });

  it('Carrega o dataset de filmes e verifica se os dados foram inseridos corretamente', async () => {
    await expect(movieRepository.count()).resolves.toBe(206);

    await expect(
      movieRepository.findOneBy({ title: "Can't Stop the Music" }),
    ).resolves.toMatchObject({
      year: 1980,
      studios: 'Associated Film Distribution',
      producers: ['Allan Carr'],
      winner: true,
    });
  });
});
