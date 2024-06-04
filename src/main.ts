import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

    // Serve static files from the "uploads" directory
  app.use('/uploads', express.static('uploads'));
   
  await app.listen(3000);
}
bootstrap();
