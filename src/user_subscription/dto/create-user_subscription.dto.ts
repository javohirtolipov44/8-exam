import { PaymentMethod } from "@prisma/client";
import { IsBoolean, isEnum, IsEnum, IsJSON, IsObject, IsString } from "class-validator";

export class CreateUserSubscriptionDto {
    @IsString()
    planId: string;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsBoolean()
    autoRenew: boolean;

    @IsObject()
    paymentDetails: {
        cardNumber: string;
        expiry: string;
        cardHolder: string;
    };
}
