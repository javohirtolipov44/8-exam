import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':id')
  @UseGuards(AuthGuard)
  create(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const {user_id} = req.user;
    return this.reviewsService.create(id, body, user_id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    const {user_id} = req.user;
    return this.reviewsService.remove(id, user_id);
  }
}
