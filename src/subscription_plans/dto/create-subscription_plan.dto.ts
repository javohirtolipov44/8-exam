import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  durationDays: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];
}
