import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

export interface MovieResponse {
  id: number;
  year: number;
  title: string;
  studios: string;
  producers: string[];
  winner: boolean;
}

export interface MoviePayload {
  year: number;
  title: string;
  studios: string;
  producers: string[];
  winner: boolean;
}

export async function createMovie(
  app: INestApplication<App>,
  movie: MoviePayload,
): Promise<MovieResponse> {
  const response = await request(app.getHttpServer())
    .post('/movies')
    .send(movie)
    .expect(201);

  return response.body as MovieResponse;
}

export async function seedMovie(
  app: INestApplication<App>,
  movie: MoviePayload,
): Promise<MovieResponse> {
  return createMovie(app, movie);
}
