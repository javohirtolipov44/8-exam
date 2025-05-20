import { Body, ConflictException, Injectable, NotFoundException, Req, UploadedFile } from '@nestjs/common';
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
  ) { }
  async create(
    poster: Express.Multer.File,
    body: any,
    req: any,
  ) {
    const slug = slugify(body.title, { lower: true });
    const categoryIds: string[] = JSON.parse(body.categoryId);
    const url = this.config.get('HOST_URL');
    const movieExists = await this.prisma.movie.findFirst({ where: { slug } });
    if (movieExists) throw new ConflictException("Bu kino allaqachon mavjud");

    const result = await this.prisma.$transaction(async (tx) => {
      const movie = await tx.movie.create({
        data: {
          title: body.title,
          slug,
          description: body.description,
          releaseYear: +body.releaseYear,
          durationMinutes: +body.durationMinutes,
          subscriptionType: body.subscriptionType,
          createdBy: req.user.user_id,
          posterUrl: `${url}/downloads/posters/${poster.filename}`,
          rating: 0.0,
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
    const result = await this.prisma.$transaction(async (tx) => {
      const movies = await tx.movie.findMany({
        include: {
          creator: {
            select: { username: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      const total = await tx.movie.count()

      return { movies, total };
    })

    return {
      success: true,
      data: {
        movies: result.movies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          slug: movie.slug,
          release_year: movie.releaseYear,
          subscription_type: movie.subscriptionType,
          view_count: movie.viewCount,
          created_at: movie.createdAt,
          created_by: movie.creator?.username || null,
        })),
        total: result.total,
      },
    };
  }


  // findOne(id: number) {
  //   return `This action returns a #${id} movie`;
  // }

  async update(id: string, body: any) {
    const slug: string = slugify(body.title, { lower: true });
    const categoryIds: string[] = body.category_ids

    const findmovie = await this.prisma.movie.findFirst({ where: { id } });
    if (!findmovie) throw new NotFoundException("Bu kino topilmadi");
    const findSlug = await this.prisma.movie.findFirst({ where: { slug } });
    if (findSlug) throw new ConflictException("Bu title allaqachon mavjud");

    const result = await this.prisma.$transaction(async (tx) => {
      const movie = await tx.movie.update({
        where: { id },
        data: {
          title: body.title,
          slug,
          description: body.description,
          subscriptionType: body.subscription_type,
        },
      });

      const deletecategory = await tx.movieCategory.deleteMany({
        where: { movieId: id },
      });
      if (deletecategory.count === 0) throw new NotFoundException("Bu kino topilmadi");
      await tx.movieCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          movieId: id,
          categoryId,
        })),
      });

      return {
        movie,
      };
    });

    return {
      success: true,
      message: "Kino muvaffaqiyatli yangilandi",
      data: {
        id: result.movie.id,
        title: result.movie.title,
        updated_at: result.movie.createdAt,
      }
    }
  }

  async remove(id: string) {
    const findmovie = await this.prisma.movie.findFirst({ where: { id } });
    if (!findmovie) throw new NotFoundException("Bu kino topilmadi");
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.movieCategory.deleteMany({
        where: { movieId: id },
      });
      await tx.movie.delete({
        where: { id },
      });

    });

    return {
      success: true,
      message: "Kino muvaffaqiyatli o'chirildi"
    }
  }
}
