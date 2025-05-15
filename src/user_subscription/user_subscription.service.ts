import { Injectable } from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user_subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserSubscriptionDto, req: Request) {
    const { user_id } = (req as any).user;
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!user) throw new Error('User not found');
    const result = await this.prisma.$transaction(async (tx) => {
      const plan = await tx.subscriptionPlan.findUnique({
        where: { id: dto.planId },
      });

      const subscription = await tx.userSubscription.create({
        data: {
          userId: user.id,
          planId: dto.planId,
          endDate: new Date(
            Date.now() + plan?.durationDays! * 24 * 60 * 60 * 1000,
          ),
          autoRenew: dto.autoRenew,
        },
      });

      const payment = await tx.payment.create({
        data: {
          userSubscriptionId: subscription.id,
          amount: plan?.price!,
          paymentMethod: dto.paymentMethod,
          status: 'completed',
          paymentDetails: dto.paymentDetails,
          externalTransactionId: 'txn_' + uuidv4(),
        },
      });

      if(payment.status === 'completed') {
        await tx.userSubscription.update({
          where: { id: subscription.id },
          data: {
            status: 'active',
          },
        });
      }

      return {
        plan,
        subscription,
        payment,
      };
    });

    return {
      success: true,
      message: 'Obuna muvaffaqiyatli sotib olindi',
      data: {
        subscription: {
          id: result.subscription.id,
          plan: {
            id: result.subscription.planId,
            name: result.plan?.name,
          },
          start_date: result.subscription.startDate,
          end_date: result.subscription.endDate,
          status: result.subscription.status,
          auto_renew: true,
        },
        payment: {
          id: result.payment.id,
          amount: result.payment.amount,
          status: result.payment.status,
          external_transaction_id: result.payment.externalTransactionId,
          payment_method: result.payment.paymentMethod,
        },
      },
    };
  }
}
