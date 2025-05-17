import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: { name: data.name },
    });
    if (category) {
      throw new ConflictException(`${data.name} category already exists`);
    }
    const categories = this.prisma.category.create({data});
    return categories;
  }

  findAll() {
    const categories = this.prisma.category.findMany();
    return categories;
  }

  async findOne(id: string) {
    const findategory = await this.prisma.category.findFirst({
      where: { id },
    });

    if (!findategory) throw new NotFoundException(`Category with id not found`);
    const category = this.prisma.category.findUnique({ where: { id } });
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const findategory = await this.prisma.category.findFirst({
      where: { id },
    });

    if (!findategory) throw new NotFoundException(`Category with id not found`);

    const category = this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return category;
  }

  async remove(id: string) {
    const findategory = await this.prisma.category.findFirst({
      where: { id },
    });

    if (!findategory) throw new NotFoundException(`Category with id not found`);
    await this.prisma.category.delete({ where: { id } });
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}
