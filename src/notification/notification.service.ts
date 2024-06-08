import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from 'src/enteties/notification.entity';
import { CreateNotificationDao } from 'src/common/dao/create-notification.dao';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async create(createNotificationDto: CreateNotificationDao): Promise<Notification> {
    const { type, title } = createNotificationDto;

    const notification = this.notificationRepository.create({
      type,
      title,
    });

    await this.notificationRepository.save(notification);
    return notification;
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find();
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async remove(id: number): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }
}
