import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {ReservationsService } from './reservations.service';
import { CreateReservationDto } from 'src/common/dtos/create-reservation.dto';
import { UpdateReservationDto } from 'src/common/dtos/update-reservation.dto';
import { promises } from 'dns';
import { Reservation } from 'src/enteties/reservation.entity';


@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
