import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class DatasetBootstrapService {

    private readCsv(): string {
        return readFileSync(
          process.env.MOVIE_FIXTURE_PATH ??
            `src/utils/dataset-bootstrap/fixture/${process.env.MOVIE_FIXTURE_NAME ?? 'Movielist.csv'}`,
          'utf8',
        );
      }
}
