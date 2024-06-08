import { Module } from '@nestjs/common';
import { BiensService } from './biens.service';
import { BiensController } from './biens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bien } from 'src/enteties/bien.entity';
import { FileModule } from 'src/file/file.module';
import { Departement } from 'src/enteties/departement.entity';
import { Categorie } from 'src/enteties/categorie.entity';
import { SousCategorie } from 'src/enteties/sous-categorie.entity';


@Module({
  imports: [ 
    FileModule,
    TypeOrmModule.forFeature([Bien, Departement, Categorie , SousCategorie])],
  controllers: [BiensController],
  providers: [BiensService],
})
export class BiensModule {}
