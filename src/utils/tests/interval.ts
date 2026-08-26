import request from 'supertest';
import { App } from 'supertest/types';
import { AwardWinningProducerIntervalsResponseDto } from "src/award-winning-producers/dto/award-winning-producer-interval.dto";
import { INestApplication } from '@nestjs/common';

export async function expectIntervals(
    app: INestApplication<App>,
    expected: AwardWinningProducerIntervalsResponseDto,
  ): Promise<void> {
    const response = await request(app.getHttpServer())
      .get('/award-winning-producers')
      .expect(200);
    const body = response.body as AwardWinningProducerIntervalsResponseDto;

    expect(body).toEqual(expected);
  }