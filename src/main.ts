import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  const uploadsDir = './uploads';
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
