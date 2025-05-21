import { Injectable, NotFoundException } from '@nestjs/common';
import { log } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, user_id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: data.movie_id,
      },
    });
    if (!movie) {
      return {
        success: false,
        message: 'Kino topilmadi',
      };
    }
    const favorite = await this.prisma.favorite.create({
      data: {
        userId: user_id,
        movieId: data.movie_id,
      },
    });

    return {
      success: true,
      message: "Kino sevimlilar ro'yxatiga qo'shildi",
      data: {
        id: favorite.id,
        movie_id: data.movie_id,
        movie_title: movie.title,
        created_at: favorite.createdAt,
      },
    };
  }

  async findAll(user_id: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId: user_id,
      },
      select: {
        id: true,
        movie: {
          select: {
            id: true,
            title: true,
            slug: true,
            posterUrl: true,
            releaseYear: true,
            rating: true,
            subscriptionType: true,
          },
        },
      },
    });

    const favoriteMovies = favorites.map((fav) => fav.movie);
    // return favorites.length

    return {
      success: true,
      data: {
        movies: favoriteMovies,
        total: favorites.length,
      },
    };
  }

  async remove(id: string, userId: string) {
    const favorite = await this.prisma.favorite.deleteMany({
      where: {
        userId,
        movieId: id,
      },
    });
    log(favorite)
    if (favorite.count === 0) throw new NotFoundException('Sevimli kino topilmadi');

    return {
      success: true,
      message: "Kino sevimlilar ro'yxatidan o'chirildi",
    };
  }
}
