import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserSubscriptionService } from './user_subscription.service';
import { CreateUserSubscriptionDto } from './dto/create-user_subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user_subscription.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';

@Controller()
export class UserSubscriptionController {
  constructor(private readonly userSubscriptionService: UserSubscriptionService) {}

  @UseGuards(AuthGuard)
  @Post('/subscription/purchase')
  create(@Body() dto: CreateUserSubscriptionDto,
@Req() req: Request) {
    return this.userSubscriptionService.create(dto, req);
  }

}
