import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { User } from 'src/enteties/user.entity';
import { Notification } from 'src/enteties/notification.entity';
import { Reservation } from 'src/enteties/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
