import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../../movies/entities/movie.entity';
import { DatasetBootstrapService } from './dataset-bootstrap.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  providers: [DatasetBootstrapService],
})
export class DatasetBootstrapModule {}