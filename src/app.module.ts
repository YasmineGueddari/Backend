import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { AzureBlobService } from './Azure_Services/azure-blob.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { BiensModule } from './biens/biens.module';
import { ReservationsModule } from './reservations/reservations.module';
import { MailModule } from './mail/mail.module';
import { DepartementModule } from './departement/departement.module';
import { CategorieModule } from './categorie/categorie.module';
import { SousCategorieModule } from './sousCategorie/sousCategorie.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    userModule,BiensModule,ReservationsModule,MailModule,DepartementModule,CategorieModule,SousCategorieModule,FileModule
  ],
    
  controllers: [AppController],
  providers: [AppService ,
    
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      
    },
  
  ],
})
export class AppModule {}
