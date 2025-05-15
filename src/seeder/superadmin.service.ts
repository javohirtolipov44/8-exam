// src/seeder/user-seeder.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserSeederService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const existingAdmin = await this.prisma.user.findFirst({
      where: { role: Role.superadmin },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10);
      await this.prisma.user.create({
        data: {
          username: process.env.ADMIN_NAME as string,
          email: process.env.ADMIN_EMAIL as string,
          password: hashedPassword,
          role: Role.superadmin,
        },
      });
      console.log('✅ Superadmin yaratildi');
    }
  }
}