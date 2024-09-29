import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Notification') // Adds "appointments" as a tag in Swagger
@ApiBearerAuth() 
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Existing routes for creating, updating, and deleting appointments

  // New route to fetch notifications for a specific client
  @Get('notifications/:client_id')
  async getClientNotifications(@Param('client_id') client_id: number) {
    return await this.notificationService.getNotificationsForClient(client_id);
  }
}
