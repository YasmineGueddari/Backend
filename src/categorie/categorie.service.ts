import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategorieDto } from 'src/common/dtos/create-categorie.dto';
import { UpdateCategorieDto } from 'src/common/dtos/update-categorie.dto';
import { Categorie } from 'src/enteties/categorie.entity'; // Assurez-vous que le chemin d'accès est correct
import { Repository } from 'typeorm';

@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(Categorie)
    private readonly categorieRepository: Repository<Categorie>,
  ) {}

  async create(createCategorieDto: CreateCategorieDto) {
    const categorie = this.categorieRepository.create({
      ...createCategorieDto,
      isActive: true,
    });
    return await this.categorieRepository.save(categorie);
  }

 
  async findAll() {
    return await this.categorieRepository.find();
  }

  async findOne(id: number) {
    return await this.categorieRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCategorieDto: UpdateCategorieDto) {
    const categorie = await this.findOne(id);
    if (!categorie) {
      throw new NotFoundException();
    }
    Object.assign(categorie, updateCategorieDto);
    return await this.categorieRepository.save(categorie);
  }

  async remove(id: number) {
    const categorie = await this.findOne(id);
    if (!categorie) {
      throw new NotFoundException();
    }
    return await this.categorieRepository.remove(categorie);
  }

    // Méthode pour désactiver une Categorie
    async disableCategorie(id: number): Promise<void> {
      const categorie = await this.findOne(id);
      if (!categorie) {
        throw new NotFoundException('Categorie introuvable');
      }
      categorie.isActive = false;
      await this.categorieRepository.save(categorie);
    }
  
}
