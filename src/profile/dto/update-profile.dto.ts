import { IsString } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    fullname: string;
    
    @IsString()
    phoneNumber: string;
    
    @IsString()
    country: string;
    
    
}
