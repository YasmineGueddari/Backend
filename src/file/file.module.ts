import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Dossier de destination pour enregistrer les fichiers téléchargés
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Chemin vers le répertoire contenant les fichiers statiques à servir
      serveRoot: '/getimage', // URL de base pour accéder aux fichiers statiques
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService], 
})
export class FileModule {}
