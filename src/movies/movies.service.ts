import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwardWinningProducersService } from '../award-winning-producers/award-winning-producers.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PaginateMoviesDto } from './dto/paginate-movies.dto';
import { PaginatedMoviesDto } from './dto/paginated-movies.dto';
import { PatchMovieDto } from './dto/patch-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly awardWinningProducersService: AwardWinningProducersService,
  ) {}

  async findAll(query: PaginateMoviesDto): Promise<PaginatedMoviesDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await this.movieRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      throw new NotFoundException(`Movie ${id} was not found.`);
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    const movie = MovieEntity.create(createMovieDto);

    const createdMovie = await this.movieRepository.save(movie);

    await this.awardWinningProducersService.refreshWatchedList();

    return createdMovie;
  }

  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    const movie = await this.findOne(id);

    movie.update(updateMovieDto);

    const updatedMovie = await this.movieRepository.save(movie);

    await this.awardWinningProducersService.refreshWatchedList();

    return updatedMovie;
  }

  async patch(id: number, patchMovieDto: PatchMovieDto): Promise<MovieEntity> {
    const movie = await this.findOne(id);

    movie.patch(patchMovieDto);

    const patchedMovie = await this.movieRepository.save(movie);

    await this.awardWinningProducersService.refreshWatchedList();

    return patchedMovie;
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);

    await this.movieRepository.remove(movie);
    await this.awardWinningProducersService.refreshWatchedList();
  }
}
