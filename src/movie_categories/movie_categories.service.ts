import { Injectable } from '@nestjs/common';
import { CreateMovieCategoryDto } from './dto/create-movie_category.dto';
import { UpdateMovieCategoryDto } from './dto/update-movie_category.dto';

@Injectable()
export class MovieCategoriesService {
  create(createMovieCategoryDto: CreateMovieCategoryDto) {
    return 'This action adds a new movieCategory';
  }

  findAll() {
    return `This action returns all movieCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movieCategory`;
  }

  update(id: number, updateMovieCategoryDto: UpdateMovieCategoryDto) {
    return `This action updates a #${id} movieCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} movieCategory`;
  }
}
