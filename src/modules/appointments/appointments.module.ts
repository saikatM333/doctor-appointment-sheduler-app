import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from '../database/entities/appointments.entity';
import { DatabaseModule } from '../database/database.module';
import { NotificationService } from '../notification/notification.service';
@Module({
  imports: [DatabaseModule , ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, NotificationService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
