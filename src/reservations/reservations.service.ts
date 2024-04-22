import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto } from 'src/common/dtos/create-reservation.dto';
import { UpdateReservationDto } from 'src/common/dtos/update-reservation.dto';
import { Reservation } from 'src/enteties/reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository:Repository<Reservation> ){

  }
  async create(createReservationDto: CreateReservationDto) {
    const reservation = this.reservationsRepository.create(createReservationDto);

    return await this.reservationsRepository.save(reservation);
  }

  async findAll() {
    return await this.reservationsRepository.find();
  }

  async findOne(id: number) {
    return await this.reservationsRepository.findOne({ where: { id } }) ;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {

    const reservation = await this.findOne(id);

    if(!reservation) {
      throw new NotFoundException();
    }
    Object.assign(reservation,updateReservationDto);

    return await this.reservationsRepository.save(reservation);
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    if(!reservation) {
      throw new NotFoundException();
    }
   
    return await this.reservationsRepository.remove(reservation);
  }
}
