import { Controller, Get, Post, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDao } from 'src/common/dao/create-notification.dao';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDao) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get()
  async findAll() {
    return await this.notificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const notification = await this.notificationService.findOne(id);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.notificationService.remove(id);
  }
}
