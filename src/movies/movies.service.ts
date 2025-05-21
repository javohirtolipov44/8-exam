import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { extname } from 'path';
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

  async create(poster: Express.Multer.File, body: any, req: any) {
    const slug = slugify(body.title, { lower: true });
    const categoryIds: string[] = JSON.parse(body.categoryId);
    const url = this.config.get('HOST_URL');
    const movieExists = await this.prisma.movie.findFirst({ where: { slug } });
    if (movieExists) throw new ConflictException('Bu kino allaqachon mavjud');
    const ext = extname(poster.originalname);
    const filename = uuidv4() + ext;
    const filePath = `./downloads/posters/${filename}`;

    const result = await this.prisma.$transaction(async (tx) => {
      await fs.promises.writeFile(filePath, poster.buffer);
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
      });
      const total = await tx.movie.count();

      return { movies, total };
    });

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

  async update(id: string, body: any) {
    const slug: string = slugify(body.title, { lower: true });
    const categoryIds: string[] = body.category_ids;

    const findmovie = await this.prisma.movie.findFirst({ where: { id } });
    if (!findmovie) throw new NotFoundException('Bu kino topilmadi');
    const findSlug = await this.prisma.movie.findFirst({ where: { slug } });
    if (findSlug) throw new ConflictException('Bu title allaqachon mavjud');

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
      if (deletecategory.count === 0)
        throw new NotFoundException('Bu kino topilmadi');
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
      message: 'Kino muvaffaqiyatli yangilandi',
      data: {
        id: result.movie.id,
        title: result.movie.title,
        updated_at: result.movie.createdAt,
      },
    };
  }

  async remove(id: string) {
    const findmovie = await this.prisma.movie.findFirst({ where: { id } });
    if (!findmovie) throw new NotFoundException('Bu kino topilmadi');
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
      message: "Kino muvaffaqiyatli o'chirildi",
    };
  }

  async uploadfile(file: Express.Multer.File, body: any, id: string) {
    const url = this.config.get('HOST_URL');
    const ext = extname(file.originalname);
    const filename = uuidv4() + ext;
    const filePath = `./downloads/videos/${filename}`;
    const findMovieFile = await this.prisma.movieFile.findFirst({
      where: {
        AND: [{ movieId: id }, { quality: body.quality }],
      },
    });
    if (findMovieFile) throw new ConflictException('Bu file allaqachon mavjud');
    await fs.promises.writeFile(filePath, file.buffer);
    const movieFile = await this.prisma.movieFile.create({
      data: {
        movieId: id,
        fileUrl: `${url}/downloads/videos/${file.filename}`,
        language: body.language,
        quality: body.quality,
      },
    });

    return {
      success: true,
      message: 'Kino fayli muvaffaqiyatli yuklandi',
      data: {
        id: movieFile.id,
        movie_id: movieFile.movieId,
        quality: movieFile.quality,
        language: movieFile.language,
        size_mb: Math.round(file.size / 1024 / 1024) + ' MB',
        file_url: `${url}/downloads/videos/${filename}`,
      },
    };
  }

  async getAllMovies(query: {
    page: number;
    limit: number;
    search?: string;
    subscription_type?: string;
  }) {
    const { page, limit, search, subscription_type } = query;

    const where: any = {};

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (subscription_type) {
      where.subscriptionType = subscription_type;
    }

    const [total, movies] = await this.prisma.$transaction([
      this.prisma.movie.count({ where }),
      this.prisma.movie.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const result = movies.map((movie) => ({
      ...movie,
    }));

    return {
      success: true,
      data: {
        movies: result,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async searchSlug(slug: string) {
    const movie = await this.prisma.movie.findFirst({ where: { slug } });
    if (!movie) throw new NotFoundException('Bu kino topilmadi');
    const categorys = await this.prisma.movieCategory.findMany({
      where: { movieId: movie.id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
    const categories = categorys.map((category) => category.category.name);
    const files = await this.prisma.movieFile.findMany({
      where: { movieId: movie.id },
      select: { quality: true, language: true },
    });
    const reviewStats = await this.prisma.review.aggregate({
      where: {
        movieId: movie.id,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      success: true,
      data: {
        id: movie.id,
        title: movie.title,
        slug,
        description: movie.description,
        release_year: movie.releaseYear,
        duration_minutes: movie.durationMinutes,
        poster_url: movie.posterUrl,
        rating: movie.rating,
        subscription_type: movie.subscriptionType,
        view_count: movie.viewCount,
        is_favorite: true,
        categories,
        files,
        reviews: {
          average_rating: Number((reviewStats._avg.rating || 0).toFixed(1)),
          count: reviewStats._count.rating,
        },
      },
    };
  }
}
