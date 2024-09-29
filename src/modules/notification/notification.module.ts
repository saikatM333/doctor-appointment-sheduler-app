import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { DatabaseModule } from 'src/modules/database/database.module';
import { ReminderService } from '../reminder/reminder.service';
@Module({
  imports : [DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService,ReminderService],
  exports : [NotificationService]
})
export class NotificationModule {}
