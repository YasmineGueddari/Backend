import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { DepartementModule } from './departement/departement.module';
import { BiensModule } from './biens/biens.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CategorieModule } from './categorie/categorie.module';
import { SousCategorieModule } from './sousCategorie/sousCategorie.module';
import { FileModule } from './file/file.module';
import { SuccursaleModule } from './succursale/succursale.module';
import { ReclamationsModule } from './reclamation/reclamation.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationModule } from './notification/notification.module';


dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    userModule,
    BiensModule,
    ReservationsModule,
    DepartementModule,
    CategorieModule,
    SousCategorieModule,
    FileModule,
    SuccursaleModule,
    ReclamationsModule,
    NotificationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '2h', // 2 hours
      },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: '"No Reply" <noreply@yourdomain.com>',
        },
        template: {
          dir: join(__dirname, '..', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
