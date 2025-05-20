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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { MoviesService } from './movies.service';
import { log } from 'console';

@Controller('/admin/movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './downloads/posters',
        filename: (req, file, callback) => {
          const ext = extname(file.originalname);
          const filename = uuidv4() + ext;
          callback(null, filename);
        },
      }),
    }),
  )
  createMovie(
    @UploadedFile() poster: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.movieService.create(poster, body, req);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateMovie(
    @Body() body: any,
    @Param('id') id: string,
  ) {
    return this.movieService.update(id, body);
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
