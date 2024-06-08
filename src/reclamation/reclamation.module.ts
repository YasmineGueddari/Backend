import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reclamation } from 'src/enteties/reclamation.entity';
import { ReclamationsController } from './reclamation.controller';
import { ReclamationsService } from './reclamation.service';
import { Bien } from 'src/enteties/bien.entity';
import { User } from 'src/enteties/user.entity';
import { Reservation } from 'src/enteties/reservation.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Reclamation,Bien,User,Reservation])],
  controllers: [ReclamationsController],
  providers: [ReclamationsService],
})
export class ReclamationsModule {}
