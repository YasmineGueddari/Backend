import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto } from 'src/common/dtos/create-reservation.dto';
import { UpdateReservationDto } from 'src/common/dtos/update-reservation.dto';
import { ReservationStatus } from 'src/common/enum/reservation-status.enum';
import { Bien } from 'src/enteties/bien.entity';
import { Reservation } from 'src/enteties/reservation.entity';
import { User } from 'src/enteties/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(Bien)
    private bienRepository: Repository<Bien>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const { bienIds, date_debut, date_fin, statut, isActive, userId } = createReservationDto;

    // Start a transaction
    return this.reservationRepository.manager.transaction(async (transactionalEntityManager) => {
        const reservations = [];
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} does not exist.`);
        }
        for (const id of bienIds) {
            const bien = await this.bienRepository.findOneById(id);
            if (!bien) {
                throw new Error(`Bien with ID ${id} does not exist.`);
            }
            const reservation = this.reservationRepository.create({
                bien,
                user, // Link reservation to user
                date_debut,
                date_fin,
                statut,
                isActive,
            });
            reservations.push(reservation);
        }
        
        // Save all reservations using the transactional entity manager
        return await transactionalEntityManager.save(reservations);
    });
  }

  async findAll() {
    return await this.reservationRepository.find({ relations: ['bien', 'user'] });
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['bien', 'user'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }


  // async update(id: number, updateReservationDto: UpdateReservationDto) {
  //   const reservation = await this.findOne(id);
  //   if (!reservation) {
  //     throw new NotFoundException(`Reservation with ID ${id} not found`);
  //   }

  //   const { bienIds, ...updateData } = updateReservationDto;
  //   if (bienIds) {
  //     const biens = await this.bienRepository.findByIds(bienIds);
  //     reservation.biens = biens;
  //   }

  //   Object.assign(reservation, updateData);
  //   return await this.reservationRepository.save(reservation);
  // }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.findOne(id);
    Object.assign(reservation, updateReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return await this.reservationRepository.remove(reservation);
  }

  async disableReservation(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    reservation.isActive = false;
    await this.reservationRepository.save(reservation);
  }

  async reactivateReservation(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.isActive = true;
    await this.reservationRepository.save(reservation);
  }


  async ConfirmReservation(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    if (!reservation) {
        throw new NotFoundException('Reservation not found');
    }

    reservation.statut = ReservationStatus.CONFIRMED; 
    await this.reservationRepository.save(reservation);
}

  async CancelReservation(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    if (!reservation) {
        throw new NotFoundException('Reservation not found');
    }

    reservation.statut = ReservationStatus.CANCELLED; 
    await this.reservationRepository.save(reservation);
  }



  async getAvailableArticles(
    date_debut: string,
    date_fin: string,
  ): Promise<Bien[]> {
    const dateMinObj = new Date(date_debut);
    const dateMaxObj = new Date(date_fin);
  
    return await this.bienRepository
      .createQueryBuilder('bien')
      .leftJoinAndSelect('bien.reservations', 'reservation')
      .leftJoinAndSelect('bien.sousCategorie', 'sousCategorie') // Inclure la sous-catégorie
      .leftJoinAndSelect('bien.categorie', 'categorie') // Inclure la sous-catégorie
      .where(
        'reservation.id IS NULL OR (reservation.date_fin < :dateMin OR reservation.date_debut > :dateMax)',
        {
          dateMin: dateMinObj,
          dateMax: dateMaxObj,
        },
      )
      .getMany();
  }
  
}
