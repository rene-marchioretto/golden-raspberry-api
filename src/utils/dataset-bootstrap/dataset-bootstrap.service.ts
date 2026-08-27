import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { Repository } from 'typeorm';
import { MovieEntity } from '../../movies/entities/movie.entity';
import { MovieCsvRowDto } from './dto/movie-csv-row.dto';

@Injectable()
export class DatasetBootstrapService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}


  // Carrega o dataset ao inicializar a aplicação
  async onApplicationBootstrap(): Promise<void> {
    const rows = parse<Record<string, string>>(this.readCsv(), {
      columns: true,
      delimiter: ';',
      skip_empty_lines: true,
      trim: true,
    });

    const movies = rows.map((row, index) =>
      MovieEntity.create(this.toMovie(row, index + 2)),
    );

    await this.movieRepository.manager.transaction(async (manager) => {
      await manager.clear(MovieEntity);
      await manager.save(MovieEntity, movies);
    });
  }

  // Valida os dados do csv antes da inserção
  private toMovie(
    row: Record<string, string>,
    rowNumber: number,
  ): MovieCsvRowDto {
    const movie = plainToInstance(MovieCsvRowDto, row);
    const errors = validateSync(movie);

    if (errors.length > 0) {
      throw new Error(`Invalid movie data at CSV row ${rowNumber}.`);
    }

    return movie;
  }

  // Lê o arquivo csv
  private readCsv(): string {
    return readFileSync(
      process.env.MOVIE_FIXTURE_PATH ?? 'src/utils/dataset-bootstrap/fixture/Movielist.csv',
      'utf8',
    );
  }
}