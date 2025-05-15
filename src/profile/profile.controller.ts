import { Controller, Get, Body, Req, UseGuards, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get()
  profile(@Req() req: Request) {
    return this.profileService.profile(req);
  }
  
  @UseGuards(AuthGuard)
  @Put()
  update(@Body() data: UpdateProfileDto, @Req() req: Request) {
    return this.profileService.update(data, req);
  }
}
