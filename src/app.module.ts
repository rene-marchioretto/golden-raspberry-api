import { Module } from '@nestjs/common';
import { DatabaseModule } from './utils/database/database.module';
import { DatasetBootstrapModule } from './utils/dataset-bootstrap/dataset-bootstrap.module';
import { MoviesModule } from './movies/movies.module';
import { AwardWinningProducersModule } from './award-winning-producers/award-winning-producers.module';
import { HttpModule } from './http/http.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, DatasetBootstrapModule, MoviesModule, AwardWinningProducersModule, HttpModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
