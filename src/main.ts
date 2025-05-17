import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // <-- Tip o‘zgardi

  app.useStaticAssets(join(__dirname, '..', 'downloads'), {
    prefix: '/downloads',
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: false,
  }));
  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
