import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Req,
  UseGuards,
  Get,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { MoviesService } from './movies.service';
import { log } from 'console';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller()
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post('/admin/movies')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.superadmin)
  @UseInterceptors(FileInterceptor('poster', { storage: memoryStorage() }))
  createMovie(
    @UploadedFile() poster: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.movieService.create(poster, body, req);
  }

  @Get('/admin/movies')
  findAll() {
    return this.movieService.findAll();
  }

  @Put('/admin/movies/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.superadmin)
  updateMovie(@Body() body: any, @Param('id') id: string) {
    return this.movieService.update(id, body);
  }

  @Delete('/admin/movies/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.superadmin)
  deleteMovie(@Param('id') id: string) {
    return this.movieService.remove(id);
  }

  @Post('/admin/movies/files/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin, Role.superadmin)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    return this.movieService.uploadfile(file, body, id);
  }

  @Get('/movies')
  getMovies(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('subscription_type') subscription_type?: string,
  ) {
    return this.movieService.getAllMovies({
      page: +page,
      limit: +limit,
      search,
      subscription_type,
    });
  }

  @Get('/movies/:slug')
  searchSlug(@Param('slug') slug: string) {
    return this.movieService.searchSlug(slug);
  }
}
