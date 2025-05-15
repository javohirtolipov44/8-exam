import { Module } from '@nestjs/common';
import { UserSubscriptionService } from './user_subscription.service';
import { UserSubscriptionController } from './user_subscription.controller';

@Module({
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService],
})
export class UserSubscriptionModule {}
