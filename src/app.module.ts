import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionPlansModule } from './subscription_plans/subscription_plans.module';
import { UserSubscriptionModule } from './user_subscription/user_subscription.module';
import { CategoriesModule } from './categories/categories.module';
import { MoviesModule } from './movies/movies.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserSeederService } from './seeder/superadmin.service';
import { ProfileModule } from './profile/profile.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    SubscriptionPlansModule,
    UserSubscriptionModule,
    CategoriesModule,
    MoviesModule,
    FavoritesModule,
    ReviewsModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),
    ProfileModule,
    ScheduleModule.forRoot(),
    HttpModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserSeederService],
})
export class AppModule {}
