import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(data: CreateAuthDto) {
    const findUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (findUser)
      throw new ConflictException('Bunday email yoki username mavjud');
    const hash = bcrypt.hashSync(data.password, 10);

    
      const userData = await this.prisma.user.create({
        data: {
          ...data,
          password: hash,
        },
      });

      

    return {
      success: true,
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
      data: {
        user_id: userData.id,
        username: userData.username,
        role: userData.role,
        created_at: userData.createdAt,
      },
    };
  }

  async login(data: LoginUserDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi!');
    }

    const isPasswordValid = bcrypt.compareSync(data.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Parol xato!');
    }
    const payload = { role: user.role, user_id: user.id };
    const token = this.jwt.sign(payload);

    res.cookie('token', token, {
      httpOnly: true,
    });
    return {
      success: true,
      message: 'Muvaffaqiyatli kirildi',
      data: {
        user_id: user.id,
        username: user.username,
        role: user.role,
        subscription: {
          plan_name: 'Free',
          expires_at: null,
        },
      },
    };
  }

  logout(res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      "success": true,
      "message": "Muvaffaqiyatli tizimdan chiqildi"
    }
  }
}
