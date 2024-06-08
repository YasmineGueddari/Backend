import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReclamationDto } from 'src/common/dtos/create-reclamation.dto';
import { UpdateReclamationDto } from 'src/common/dtos/update-reclamation.dto';
import { ReclamationStatus } from 'src/common/enum/reclamation-status.enum';
import { Bien } from 'src/enteties/bien.entity';
import { Reclamation } from 'src/enteties/reclamation.entity';
import { Reservation } from 'src/enteties/reservation.entity';
import { User } from 'src/enteties/user.entity';

import { Repository } from 'typeorm';

@Injectable()
export class ReclamationsService {
  constructor(
    @InjectRepository(Reclamation)
    private readonly reclamationsRepository: Repository<Reclamation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Bien)
    private readonly bienRepository: Repository<Bien>,
  ) {}

  async create(createReclamationDto: CreateReclamationDto) {
    const { userId, reservationId, bienId, ...rest } = createReclamationDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reservation = await this.reservationRepository.findOne({ where: { id: reservationId } });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const bien = await this.bienRepository.findOne({ where: { id: bienId } });
    if (!bien) {
      throw new NotFoundException('Bien not found');
    }

    const reclamation = this.reclamationsRepository.create({
      ...rest,
      user,
      reservation,
      bien,
      isActive: true,
    });

    return await this.reclamationsRepository.save(reclamation);
  }

  async findAll() {
    return await this.reclamationsRepository.find({ relations: ['bien', 'user', 'reservation'] });
  }

  async findOne(id: number) {
    return await this.reclamationsRepository.findOne({ where: { id }, relations: ['bien', 'user', 'reservation'] });
  }

  async update(id: number, updateReclamationDto: UpdateReclamationDto) {
    const reclamation = await this.findOne(id);

    if (!reclamation) {
      throw new NotFoundException();
    }

    Object.assign(reclamation, updateReclamationDto);

    return await this.reclamationsRepository.save(reclamation);
  }

  async remove(id: number) {
    const reclamation = await this.findOne(id);
    if (!reclamation) {
      throw new NotFoundException();
    }

    return await this.reclamationsRepository.remove(reclamation);
  }

  // Méthode pour désactiver une réclamation
  async disableReclamation(id: number): Promise<void> {
    const reclamation = await this.findOne(id);
    if (!reclamation) {
      throw new NotFoundException('Reclamation introuvable');
    }
    reclamation.isActive = false;
    await this.reclamationsRepository.save(reclamation);
  }
  
  // Méthode pour réactiver une réclamation
  async reactivateReclamation(id: number): Promise<any> {
    const reclamation = await this.findOne(id);
    if (!reclamation) {
      throw new NotFoundException('Reclamation not found');
    }

    reclamation.isActive = true;

    await this.reclamationsRepository.save(reclamation);
  }


  async ConfirmReclamation(id: number): Promise<void> {
    const reclamation = await this.findOne(id);
    if (!reclamation) {
        throw new NotFoundException('reclamation not found');
    }

    reclamation.statut = ReclamationStatus.RESOLVED; 
    await this.reclamationsRepository.save(reclamation);
}

  async CancelReclamation(id: number): Promise<void> {
    const reclamation = await this.findOne(id);
    if (!reclamation) {
        throw new NotFoundException('reclamation not found');
    }

    reclamation.statut = ReclamationStatus.CANCELLED; 
    await this.reclamationsRepository.save(reclamation);
  }

  async InProgressReclamation(id: number): Promise<void> {
    const reclamation = await this.findOne(id);
    if (!reclamation) {
        throw new NotFoundException('reclamation not found');
    }

    reclamation.statut = ReclamationStatus.INPROGRESS; 
    await this.reclamationsRepository.save(reclamation);
  }
}