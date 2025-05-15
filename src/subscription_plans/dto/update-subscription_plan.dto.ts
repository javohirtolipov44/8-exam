import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionPlanDto } from './create-subscription_plan.dto';
import { IsBoolean } from 'class-validator';

export class UpdateSubscriptionPlanDto extends PartialType(CreateSubscriptionPlanDto) {
    @IsBoolean()
    isActive: boolean;
}
