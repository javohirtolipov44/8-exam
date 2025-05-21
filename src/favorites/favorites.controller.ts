import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: any, @Req() req: any) {
    const user_id = req.user.user_id;
    return this.favoritesService.create(data, user_id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: any) {
    const user_id = req.user.user_id;
    return this.favoritesService.findAll(user_id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    const user_id = req.user.user_id;
    return this.favoritesService.remove(id, user_id);
  }
}
