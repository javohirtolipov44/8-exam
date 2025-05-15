import { Injectable } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscription_plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription_plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionPlansService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateSubscriptionPlanDto) {
    return this.prisma.subscriptionPlan.create({
      data,
    });
  }

  async findAll() {
    const subscription = await this.prisma.subscriptionPlan.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        durationDays: true,
        features: true,
      },
    });
    return {
      success: true,
      data: subscription,
    }
  }
}
