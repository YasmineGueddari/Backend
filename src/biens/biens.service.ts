import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBienDto } from 'src/common/dtos/create-bien.dto';
import { UpdateBienDto } from 'src/common/dtos/update-bien.dto';
import { Bien } from 'src/enteties/bien.entity';
import { Repository } from 'typeorm';
import { FileService } from 'src/file/file.service';
import { Departement } from 'src/enteties/departement.entity';
import { Categorie } from 'src/enteties/categorie.entity';
import { SousCategorie } from 'src/enteties/sous-categorie.entity';

@Injectable()
export class BiensService {
  constructor(
    @InjectRepository(Bien)
    private readonly biensRepository: Repository<Bien>,
    @InjectRepository(Departement)
    private readonly departementRepository: Repository<Departement>,
    @InjectRepository(Categorie)
    private readonly categorieRepository: Repository<Categorie>,
    @InjectRepository(SousCategorie)
    private readonly sousCategorieRepository: Repository<SousCategorie>,
    private readonly fileService: FileService
  ){

  }


  async create(createBienDto: CreateBienDto, imageFile: Express.Multer.File) {

    // Extraire les données du DTO de création
    const { departementId, categorieId, sousCategorieId, ...bienData } = createBienDto;

    // Créer une nouvelle instance de Bien
    const bien = new Bien();
    bien.name = bienData.name;
    bien.description = bienData.description;
   

    if (imageFile) {
        const imagePath = await this.fileService.saveFile(imageFile);
        bien.image = imagePath;
    }

    // Si les IDs de département et de catégorie sont fournis, les attribuer à la relation
    if (departementId) {
      const departement = await this.departementRepository.findOne({ where: { id: departementId } });
        bien.departement = departement;
    }
    if (categorieId) {
        const categorie = await this.categorieRepository.findOne({ where: { id: categorieId } });
        bien.categorie = categorie;
    }
    if (sousCategorieId) {
        const sousCategorie = await this.sousCategorieRepository.findOne({ where: { id: sousCategorieId } });
        bien.sousCategorie = sousCategorie;
    }

    // Enregistrer le bien dans la base de données
    const createdBien = await this.biensRepository.save(bien);

    // Retourner l'objet avec les relations
    return {
        ...createdBien,
        departement: bien.departement,
        categorie: bien.categorie,
        sousCategorie: bien.sousCategorie
    };
}



  async findAll() {
    // Utilisez la méthode find() de TypeORM avec les options de jointure pour récupérer les départements associés à chaque bien
    return await this.biensRepository.find({ relations: ['departement' ,'categorie' , 'sousCategorie' ] });
  }

  async findOne(id: number) {
    return await this.biensRepository.findOne({
       where: { id },
       relations: ['departement' ,'categorie' , 'sousCategorie' ],
      }) ;
  }



  async update(id: number, updateBienDto: UpdateBienDto,image: Express.Multer.File) {
    // Rechercher le bien à mettre à jour
    const bien = await this.biensRepository.findOne({ where: { id } });

    if (!bien) {
      throw new NotFoundException('Bien non trouvé');
    }

    // Mettre à jour les propriétés du bien avec les données du DTO de mise à jour
    bien.name = updateBienDto.name || bien.name;
    bien.description = updateBienDto.description || bien.description;


    // Vérifier si une nouvelle image est fournie et la mettre à jour
    if (image) {
      const imagePath = await this.fileService.saveFile(image);
      bien.image = imagePath;
    }

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


    // Méthode pour désactiver un bien
    async disableBien(id: number): Promise<void> {
      const bien = await this.findOne(id);
      if (!bien) {
        throw new NotFoundException('bien introuvable');
      }
      bien.isActive = false;
  
      await this.biensRepository.save(bien);
    }
  
  
   // Méthode pour reactivate un bien
    async reactivateBien(id: number): Promise<any> {
      const bien = await this.findOne(id);
      if (!bien) {
        throw new NotFoundException('User not found');
      }
  
      bien.isActive = true;
  
       await this.biensRepository.save(bien);
      }
      

         // Méthode pour broken un bien
    async brokenBien(id: number): Promise<void> {
      const bien = await this.findOne(id);
      if (!bien) {
        throw new NotFoundException('bien introuvable');
      }
      bien.statut = false;
  
      await this.biensRepository.save(bien);
    }

    
         // Méthode pour available un bien
         async availableBien(id: number): Promise<void> {
          const bien = await this.findOne(id);
          if (!bien) {
            throw new NotFoundException('bien introuvable');
          }
          bien.statut = true;
      
          await this.biensRepository.save(bien);
        }
    


  async getAllBiens(page: number = 1, itemsPerPage: number = 10): Promise<Bien[]> {
    const startIndex = (page - 1) * itemsPerPage;
    return await this.biensRepository.find({
      skip: startIndex,
      take: itemsPerPage,
    });
  }
  
}
