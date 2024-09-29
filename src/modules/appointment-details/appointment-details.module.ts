import { Module } from '@nestjs/common';
import { AppointmentDetailsController } from './appointment-details.controller';
import { AppointmentDetailsService } from './appointment-details.service';
import { DatabaseModule } from '../database/database.module';
@Module({
  imports:[DatabaseModule],
  controllers: [AppointmentDetailsController],
  providers: [AppointmentDetailsService]
})
export class AppointmentDetailsModule {}
