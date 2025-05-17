import { Body, Injectable, Req, UploadedFile } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class MoviesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  async create(
    poster: Express.Multer.File,
    body: any,
    req: any,
  ) {
    const slug = slugify(body.title, { lower: true });
    const categoryIds: string[] = JSON.parse(body.categoryId);
    const url = this.config.get('HOST_URL');

    const result = await this.prisma.$transaction(async (tx) => {
      const movie = await tx.movie.create({
        data: {
          title: body.title,
          slug,
          description: body.description,
          releaseYear: +body.releaseYear,
          durationMinutes: +body.durationMinutes,
          subscriptionType: body.subscriptionType,
          createdBy: req.user.user_id, // Agar JWT bilan foydalanuvchi aniqlangan bo‘lsa
          posterUrl: `${url}/downloads/posters/${poster.filename}`,
          rating: 0.0, // Boshlanishda 0.0
        },
      });

      const moviecategory = await tx.movieCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          movieId: movie.id,
          categoryId,
        })),
      });

      return {
        movie,
        moviecategory,
      };
    });

    return {
      success: true,
      message: "Yangi kino muvaffaqiyatli qo'shildi",
      data: {
        id: result.movie.id,
        title: result.movie.title,
        slug: result.movie.slug,
        created_at: result.movie.createdAt,
      },
    };
  }

  async findAll() {
    const movie = await this.prisma.movie.findMany();
    return movie
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} movie`;
  // }

  update(id: string, body: any, poster: Express.Multer.File) {
    return {
      id,
      body,
      poster,
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} movie`;
  // }
}
