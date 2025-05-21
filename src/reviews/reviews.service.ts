import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { log } from 'console';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(id: string, body: any, user_id: string) {
    const findReview = await this.prisma.review.findFirst({
      where: {
        userId: user_id,
        movieId: id,
      },
    });
    if (findReview) throw new ConflictException('Siz avval baho bergansiz');
    const review = await this.prisma.review.create({
      data: {
        ...body,
        movieId: id,
        userId: user_id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    const rating = await this.prisma.review.groupBy({
      by: ['movieId'],
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
    log(rating);
    const result = rating[rating.length - 1];

    return {
      success: true,
      message: "Sharh muvaffaqiyatli qo'shildi",
      data: {
        id: review.id,
        user: {
          id: review.user.id,
          username: review.user.username,
        },
        movie_id: review.movieId,
        rating: Number(result._avg.rating!.toFixed(1)),
        comment: review.comment,
        created_at: review.createdAt,
      },
    };
  }

  async remove(id: string, user_id: string) {
    const findReview = await this.prisma.review.findFirst({
      where: {
        userId: user_id,
        movieId: id,
      },
    });
    if (!findReview) throw new NotFoundException('Bunday sharh topilmadi');

    const review = await this.prisma.review.deleteMany({
      where: {
        userId: user_id,
        movieId: id,
      },
    });
    if (review.count === 0)
      throw new NotFoundException('Bunday sharh topilmadi');
    return {
      success: true,
      message: "Sharh muvaffaqiyatli o'chirildi",
    };
  }
}
