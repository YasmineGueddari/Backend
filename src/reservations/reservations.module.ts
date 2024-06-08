import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/enteties/reservation.entity';
import { Bien } from 'src/enteties/bien.entity';
import { User } from 'src/enteties/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Reservation,Bien,User])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
