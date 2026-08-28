import { MovieEntity } from '../entities/movie.entity';

export class PaginatedMoviesDto {
  data!: MovieEntity[];
  total!: number;
  page!: number;
  limit!: number;
  pageCount!: number;
}
