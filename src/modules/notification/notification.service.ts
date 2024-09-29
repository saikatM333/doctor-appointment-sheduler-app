import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { Notification } from '../database/entities/notifications.entity'; // Adjust path as necessary
import { Notification } from '../database/entities/notifications.entity';
import { Doctor } from '../database/entities/doctors.entity';
import { Client } from '../database/entities/clients.entity';
import { Appointment } from '../database/entities/appointments.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async createNotification(
    doctor_id: number | null,
    client_id: number | null,
    appointment_id: number,
    notification_type: 'created' | 'updated' | 'deleted' | 'reminder',
    message: string
  ) {
    const doctor = doctor_id ? await this.doctorRepository.findOne({ where: { doctor_id: doctor_id } }) : null;

    // Fetch the Client entity if client_id is provided
    const client = client_id ? await this.clientRepository.findOne({ where: { tenant_id: client_id } }) : null;

    // Fetch the Appointment entity using appointment_id
    
   

    // Create and save the notification
    const notification = this.notificationRepository.create({
      doctor,        // Pass the doctor entity or null
      client,        // Pass the client entity or null
      appointment_id,   // Pass the appointment entity
      notification_type,
      message,
    });
    
    await this.notificationRepository.save(notification);
  }

  async sendCreateNotification(doctor_id: number, client_id: number, appointment: any) {
    const message = `Appointment Created: ${appointment.appointment_date} at ${appointment.appointment_time}. Reason: ${appointment.reason}`;
    await this.createNotification(doctor_id, client_id, appointment.appointment_id, 'created', message);
  }

  async sendUpdateNotification(doctor_id: number, client_id: number, appointment: any) {
    const message = `Appointment Updated: ${appointment.appointment_date} at ${appointment.appointment_time}. Reason: ${appointment.reason}`;
    await this.createNotification(doctor_id, client_id, appointment.appointment_id, 'updated', message);
  }

  async sendDeleteNotification(doctor_id: number, client_id: number, appointment_id: number) {
    const message = `Appointment Deleted: ID ${appointment_id}`;
    await this.createNotification(doctor_id, client_id, appointment_id, 'deleted', message);
  }

  async getNotificationsForClient(client_id: number) {
    
    const notifications = await this.notificationRepository.find({
      where: { client: { tenant_id: client_id } }, // Assuming `client` is a relation and `id` is the field name
    });
    

    return notifications;
  }
  async sendReminderNotification(
    doctor_id: number,
    client_id: number,
    appointment_id: number
  ) {
    const appointment = await this.appointmentRepository.findOne({ where: { appointment_id } });
    const doctor = await this.doctorRepository.findOne({where :{doctor_id : doctor_id }})
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    const message = `Reminder: Your appointment with Dr. ${doctor.first_name}  ${doctor.last_name}is scheduled for ${appointment.appointment_date} at ${appointment.appointment_time}.`;
    await this.createNotification(doctor_id, client_id, appointment_id, 'reminder', message);
  }
}

