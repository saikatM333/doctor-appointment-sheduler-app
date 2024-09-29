import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { DatabaseModule } from '../database/database.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports : [DatabaseModule],
  providers: [ ReminderService,NotificationService],
  exports : [ReminderService]
})
export class ReminderModule {}
