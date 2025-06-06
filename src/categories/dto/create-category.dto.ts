import { IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsString()
    description: string;
    
}
