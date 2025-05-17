import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SubscriptionPlansModule } from './subscription_plans/subscription_plans.module';
import { UserSubscriptionModule } from './user_subscription/user_subscription.module';
import { PaymentsModule } from './payments/payments.module';
import { CategoriesModule } from './categories/categories.module';
import { MoviesModule } from './movies/movies.module';
import { MovieCategoriesModule } from './movie_categories/movie_categories.module';
import { MovieFilesModule } from './movie_files/movie_files.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WatchHistoryModule } from './watch_history/watch_history.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserSeederService } from './seeder/superadmin.service';
import { ProfileModule } from './profile/profile.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    UsersModule,
    SubscriptionPlansModule,
    UserSubscriptionModule,
    PaymentsModule,
    CategoriesModule,
    MoviesModule,
    MovieCategoriesModule,
    MovieFilesModule,
    FavoritesModule,
    ReviewsModule,
    WatchHistoryModule,
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
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserSeederService],
})
export class AppModule {}
