import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

 
// Servir les fichiers statiques depuis le répertoire "uploads"
  app.use('/uploads', express.static('uploads'));


   // Configurer Swagger
  const options = new DocumentBuilder()
    .setTitle('Equipement')
    .setVersion('1.0.0')
    .setDescription('API Description')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);


  await app.listen(process.env.PORT || 3000);
}

bootstrap();


