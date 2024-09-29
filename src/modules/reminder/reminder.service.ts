import { Injectable, Logger, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as cron from 'node-cron';
import { NotificationService } from '../notification/notification.service';
import { Appointment } from '../database/entities/appointments.entity';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>, // Assuming you have a repository
  ) {
    this.scheduleReminders();
  }

  private scheduleReminders() {
    cron.schedule('*/1 * * * *', async () => { // Runs every minute
        console.log('Cron job executed');
      const now = new Date();
      const appointments = await this.appointmentRepository.find({
        where: {
            reminder_time: LessThanOrEqual(now),
            status: 'Scheduled',
          },
        relations: ['doctor', 'tenant'],
      });
   console.log(appointments)
      for (const appointment of appointments) {
        try {
          await this.notificationService.sendReminderNotification(
            appointment.doctor.doctor_id,
            appointment.tenant.tenant_id,
            appointment.appointment_id
          );
          this.logger.log(`Reminder sent for appointment ID ${appointment.appointment_id}`);
          // Clear or update reminder_time if needed
          appointment.reminder_time = null; // Or update it to avoid re-sending
          await this.appointmentRepository.save(appointment);
        } catch (error) {
          this.logger.error(`Failed to send reminder for appointment ID ${appointment.appointment_id}`, error.stack);
        }
      }
    });
  }
}
