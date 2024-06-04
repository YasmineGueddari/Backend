import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBienDto } from 'src/common/dtos/create-bien.dto';
import { UpdateBienDto } from 'src/common/dtos/update-bien.dto';
import { Bien } from 'src/enteties/bien.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BiensService {
  constructor(
    @InjectRepository(Bien)
    private readonly biensRepository:Repository<Bien> ){

  }
  async create(createBienDto: CreateBienDto) {
    // Extraire les données du DTO de création
    const { departementId, categorieId, sousCategorieId, ...bienData } = createBienDto;

    // Créer une nouvelle instance de Bien
    const bien = new Bien();
    bien.name = bienData.name;
    bien.description = bienData.description;
    bien.statut = bienData.statut;

    // Si les IDs de département et de catégorie sont fournis, les attribuer à la relation
    if (departementId) {
      bien.departement = { id: departementId } as any;
    }
    if (categorieId) {
      bien.categorie = { id: categorieId } as any;
    }
    if (sousCategorieId) {
      bien.sousCategorie = { id: sousCategorieId } as any;
    }

    // Enregistrer le bien dans la base de données
    return await this.biensRepository.save(bien);
  }


  async findAll() {
    // Utilisez la méthode find() de TypeORM avec les options de jointure pour récupérer les départements associés à chaque bien
    return await this.biensRepository.find({ relations: ['departement' ,'categorie' , 'sousCategorie' ] });
  }

  async findOne(id: number) {
    return await this.biensRepository.findOne({ where: { id } }) ;
  }


  async update(id: number, updateBienDto: UpdateBienDto) {
    // Rechercher le bien à mettre à jour
    const bien = await this.biensRepository.findOne({ where: { id } });

    if (!bien) {
      throw new NotFoundException('Bien non trouvé');
    }

    // Mettre à jour les propriétés du bien avec les données du DTO de mise à jour
    bien.name = updateBienDto.name || bien.name;
    bien.description = updateBienDto.description || bien.description;
    bien.statut = updateBienDto.statut || bien.statut;

    // Si les IDs de département ou de catégorie sont fournis, les attribuer à la relation
    if (updateBienDto.departementId) {
      bien.departement = { id: updateBienDto.departementId } as any;
    }
    if (updateBienDto.categorieId) {
      bien.categorie = { id: updateBienDto.categorieId } as any;
    }
    if (updateBienDto.sousCategorieId) {
      bien.sousCategorie = { id: updateBienDto.sousCategorieId } as any;
    }

    // Enregistrer les modifications dans la base de données
    return await this.biensRepository.save(bien);
  }


  async remove(id: number) {
    const bien = await this.findOne(id);
    if(!bien) {
      throw new NotFoundException();
    }
   
    return await this.biensRepository.remove(bien);
  }


  async getAllBiens(page: number = 1, itemsPerPage: number = 10): Promise<Bien[]> {
    const startIndex = (page - 1) * itemsPerPage;
    return await this.biensRepository.find({
      skip: startIndex,
      take: itemsPerPage,
    });
  }
  
}
