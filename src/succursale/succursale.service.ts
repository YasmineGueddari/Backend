import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSuccursaleDto } from 'src/common/dtos/create-succursale.dto';
import { UpdateSuccursaleDto } from 'src/common/dtos/update-succursale.dto';
import { Succursale } from 'src/enteties/succursale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuccursaleService {
  constructor(
    @InjectRepository(Succursale)
    private readonly succursaleRepository:Repository<Succursale> ){

  }

  async create(createSuccursaleDto: CreateSuccursaleDto) {
    // Définir explicitement la valeur de la colonne "isActive" sur true
    const succursale = this.succursaleRepository.create({
      ...createSuccursaleDto,
      isActive: true,
    });
  
    return await this.succursaleRepository.save(succursale);
  }

  async findAll() {
    return await this.succursaleRepository.find();
  }

  async findOne(id: number) {
    return await this.succursaleRepository.findOne({ where: { id } }) ;
  }

  async update(id: number, updateSuccursaleDto: UpdateSuccursaleDto) {

    const succursale = await this.findOne(id);

    if(!succursale) {
      throw new NotFoundException();
    }
    Object.assign(succursale,updateSuccursaleDto);

    return await this.succursaleRepository.save(succursale);
  }

  async remove(id: number) {
    const succursale = await this.findOne(id);
    if(!succursale) {
      throw new NotFoundException();
    }
   
    return await this.succursaleRepository.remove(succursale);
  }

// Méthode pour désactiver une succursale
    async disableSuccursale(id: number): Promise<void> {
        const succursale = await this.findOne(id);
        if (!succursale) {
          throw new NotFoundException('Succursale introuvable');
        }
        succursale.isActive = false;
        await this.succursaleRepository.save(succursale);
      }

  
       // Méthode pour reactivate un succursale
    async reactivateSuccursale(id: number): Promise<any> {
      const succursale = await this.findOne(id);
      if (!succursale) {
        throw new NotFoundException('User not found');
      }
  
      succursale.isActive = true;
  
       await this.succursaleRepository.save(succursale);
      }
      

      

}
 

