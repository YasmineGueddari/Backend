import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDepartementDto } from 'src/common/dtos/create-departement.dto';
import { UpdateDepartementDto } from 'src/common/dtos/update-departement.dto';
import { Departement } from 'src/enteties/departement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartementService {
  constructor(
    @InjectRepository(Departement)
    private readonly departementRepository: Repository<Departement>,
  ) {}

  async create(createDepartementDto: CreateDepartementDto) {
     // Définir explicitement la valeur de la colonne "isActive" sur false
     const departement = this.departementRepository.create({
      ...createDepartementDto,
      isActive: true,
    });
    return await this.departementRepository.save(departement);
  }

  async findAll() {
    return await this.departementRepository.find();
  }

  async findOne(id: number) {
    return await this.departementRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDepartementDto: UpdateDepartementDto) {
    const departement = await this.findOne(id);
    if (!departement) {
      throw new NotFoundException();
    }
    Object.assign(departement, updateDepartementDto);
    return await this.departementRepository.save(departement);
  }

  async remove(id: number) {
    const departement = await this.findOne(id);
    if (!departement) {
      throw new NotFoundException();
    }
    return await this.departementRepository.remove(departement);
  }

  // Méthode pour désactiver une departement
  async disableDepartment(id: number): Promise<void> {
    const departement = await this.findOne(id);
    if (!departement) {
      throw new NotFoundException('Departement introuvable');
    }
    departement.isActive = false;
    await this.departementRepository.save(departement);
  }


}
