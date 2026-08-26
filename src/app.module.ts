import { Module } from '@nestjs/common';
import { DatabaseModule } from './utils/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
