import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) { }

  async profile(req: Request) {
    const { user_id } = (req as any).user;
    const user = await this.prisma.user.findFirst({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User not found');
    return {
      success: true,
      data: {
        user_id: user.id,
        full_name: user.fullname,
        email: user.email,
        username: user.username,
        phone: user.phoneNumber,
        country: user.country,
        role: user.role,
        created_at: user.createdAt,
        avatar_url: user.avatarUrl,
      },
    };
  }

  async update(data: UpdateProfileDto, req: Request) {
    const { user_id } = (req as any).user;
    const user = await this.prisma.user.findFirst({
      where: { id: user_id },
    });
    if (!user) throw new NotFoundException('User not found');
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        fullname: data.fullname,
        phoneNumber: data.phoneNumber,
        country: data.country,
      },
    });
    return {
      success: true,
      message: 'Profil muvaffaqiyatli yangilandi',
      data: {
        user_id: updatedUser.id,
        full_name: updatedUser.fullname,
        phone: updatedUser.phoneNumber,
        country: updatedUser.country,
        updated_at: updatedUser.updatedAt,
      },
    };
  }
}
