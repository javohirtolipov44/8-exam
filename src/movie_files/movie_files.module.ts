import { Module } from '@nestjs/common';
import { MovieFilesService } from './movie_files.service';
import { MovieFilesController } from './movie_files.controller';

@Module({
  controllers: [MovieFilesController],
  providers: [MovieFilesService],
})
export class MovieFilesModule {}
