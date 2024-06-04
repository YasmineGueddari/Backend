import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSousCategorieDto } from 'src/common/dtos/create-sous-categorie.dto';
import { UpdateSousCategorieDto } from 'src/common/dtos/update-sous-categorie.dto';
import { Categorie } from 'src/enteties/categorie.entity';
import { SousCategorie } from 'src/enteties/sous-categorie.entity'; 
import { Repository } from 'typeorm';


@Injectable()
export class SousCategorieService {
  constructor(
    @InjectRepository(SousCategorie)
    private readonly sousCategorieRepository: Repository<SousCategorie>,
    @InjectRepository(Categorie) 
    private readonly categorieRepository: Repository<Categorie>, 
  ) {}

  
  async create(createSousCategorieDto: CreateSousCategorieDto) {
    const { categorieId, ...sousCategorieData  } = createSousCategorieDto;

    // Vérifier si l'ID de la catégorie est fourni
    if (!categorieId) {
      throw new BadRequestException('L\'ID de la catégorie est requis');
    }

   // Rechercher la catégorie correspondante
   const categorie = await this.categorieRepository.findOne({ where: { id: categorieId } });

    // Vérifier si la catégorie existe
    if (!categorie) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    // Créer la sous-catégorie avec la référence à la catégorie parente
    const sousCategorie = this.sousCategorieRepository.create({
      ...sousCategorieData,
      categorie: categorie,
      isActive: true, 
    });
    
    // Enregistrer la sous-catégorie dans la base de données
    return await this.sousCategorieRepository.save(sousCategorie);
  }



  async findAll() {
    return await this.sousCategorieRepository.find({ relations: ['categorie'] });
  }

  async findOne(id: number) {
    return await this.sousCategorieRepository.findOne({ where: { id } });
  }
  

  async update(id: number, updateSousCategorieDto: UpdateSousCategorieDto) {
    const sousCategorie = await this.findOne(id);
    if (!sousCategorie) {
      throw new NotFoundException('Sous-catégorie non trouvée');
    }

    // Vérifier si l'ID de la catégorie est fourni dans le DTO de mise à jour
    const { categorieId, ...sousCategorieData } = updateSousCategorieDto;
    if (categorieId) {
        // Rechercher la catégorie correspondante
        const categorie = await this.categorieRepository.findOne({ where: { id: categorieId } });

        // Vérifier si la catégorie existe
        if (!categorie) {
            throw new NotFoundException('Catégorie non trouvée');
        }

        // Mettre à jour la référence à la catégorie parente
        sousCategorie.categorie = categorie;
    }

    // Mettre à jour les autres propriétés de la sous-catégorie
    Object.assign(sousCategorie, sousCategorieData);

    // Enregistrer les modifications dans la base de données
    return await this.sousCategorieRepository.save(sousCategorie);
}


  async remove(id: number) {
    const sousCategorie = await this.findOne(id);
    if (!sousCategorie) {
      throw new NotFoundException();
    }
    return await this.sousCategorieRepository.remove(sousCategorie);
  }

  // Méthode pour désactiver une sousCategorie
  async disableSousCategorie(id: number): Promise<void> {
    const sousCategorie = await this.findOne(id);
    if (!sousCategorie) {
      throw new NotFoundException('SousCategorie introuvable');
    }
    sousCategorie.isActive = false;
    await this.sousCategorieRepository.save(sousCategorie);
  }


}
