import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { DatabaseModule } from './database.module';

describe('Verifica se o banco de dados está sendo criado corretamente', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    dataSource = app.get(getDataSourceToken());
  });

  afterEach(async () => {
    await app.close();
  });

  it('conecta no sqlite in-memory', async () => {
    expect(dataSource.isInitialized).toBe(true);
    expect(dataSource.options).toMatchObject({
      type: 'sqlite',
      database: ':memory:',
    });
  });
});