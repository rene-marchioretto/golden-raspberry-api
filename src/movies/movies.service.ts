import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchMovieDto } from './dto/patch-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    const movie = MovieEntity.create(createMovieDto);

    const createdMovie = await this.movieRepository.save(movie);

    return createdMovie;
  }

  findAll(): Promise<MovieEntity[]> {
    return this.movieRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      throw new NotFoundException(`Movie ${id} was not found.`);
    }

    return movie;
  }

  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    const movie = await this.findOne(id);

    movie.update(updateMovieDto);

    const updatedMovie = await this.movieRepository.save(movie);

    return updatedMovie;
  }

  async patch(id: number, patchMovieDto: PatchMovieDto): Promise<MovieEntity> {
    const movie = await this.findOne(id);

    movie.patch(patchMovieDto);

    const patchedMovie = await this.movieRepository.save(movie);


    return patchedMovie;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
