import { Module } from '@nestjs/common';
import { SousCategorieService } from './sousCategorie.service';
import { SousCategorieController } from './sousCategorie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SousCategorie } from 'src/enteties/sous-categorie.entity'; 
import { Categorie } from 'src/enteties/categorie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categorie,SousCategorie])],
  controllers: [SousCategorieController],
  providers: [SousCategorieService],
})
export class SousCategorieModule {}
