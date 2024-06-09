import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, Put, Query, UseGuards } from '@nestjs/common';
import {ReservationsService } from './reservations.service';
import { CreateReservationDto } from 'src/common/dtos/create-reservation.dto';
import { UpdateReservationDto } from 'src/common/dtos/update-reservation.dto';
import { promises } from 'dns';
import { Reservation } from 'src/enteties/reservation.entity';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/common/guards/rolesGuard.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/enteties/user.entity';




@ApiTags('Backoffice reservation')
@Controller('reservations')

export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
 // @UseGuards(RolesGuard)
 // @Roles(Role.Admin)
  create(@Body() createReservationDto: CreateReservationDto ,    @GetUser() user:User,
) {
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


  @Put(':id')
  update(@Param('id') id: number, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

  @Delete(':id/disable')
  async disableReservation(@Param('id') id: number) { 
  try {
    await this.reservationsService.disableReservation(id);
    return { message: 'Reservation désactivée avec succès' };
  } catch (error) {
    console.error('Erreur lors de la désactivation de la Reservation :', error);
    throw new InternalServerErrorException('Erreur interne du serveur');
  }
}

@Put(':id/reactivate')
async reactivateReservation(@Param('id') id: number) {
  try{
  await this.reservationsService.reactivateReservation(id);
  return { message: 'Reservation  reactivate avec succès' };
} catch (error) {
  console.error('Erreur lors de la  reactivate de Reservation :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}

@Put(':id/confirm')
async ConfirmReservation(@Param('id') id: number) {
  try{
  await this.reservationsService.ConfirmReservation(id);
  return { message: 'Reservation  Confirm avec succès' };
} catch (error) {
  console.error('Erreur lors de la Confirm de Reservation :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}

@Put(':id/cancel')
async CancelReservation(@Param('id') id: number) {
  try{
  await this.reservationsService.CancelReservation(id);
  return { message: 'Reservation  Cancel avec succès' };
} catch (error) {
  console.error('Erreur lors de la Cancel de Reservation :', error);
  throw new InternalServerErrorException('Erreur interne du serveur');
}
}

@Post('available')
findAvailableEquipment(@Body('date_debut') date_debut: string, @Body('date_fin') date_fin: string) {
  return this.reservationsService.getAvailableArticles(date_debut, date_fin);
}

}
