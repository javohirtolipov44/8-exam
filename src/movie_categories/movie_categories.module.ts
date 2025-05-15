import { Module } from '@nestjs/common';
import { MovieCategoriesService } from './movie_categories.service';
import { MovieCategoriesController } from './movie_categories.controller';

@Module({
  controllers: [MovieCategoriesController],
  providers: [MovieCategoriesService],
})
export class MovieCategoriesModule {}
