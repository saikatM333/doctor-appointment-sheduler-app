import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/clients.entity';
import { Doctor } from './entities/doctors.entity';
import { Specialization } from './entities/specialization.entity';
import { Subscription } from './entities/subscription.entity';
import { Appointment } from './entities/appointments.entity';
import { Schedule } from './entities/schedules.entity';
import { Room } from './entities/rooms.entity';
import { MedicalRecord } from './entities/medical-records.entity';
import { Payment } from './entities/payments.entity';
import { Prescription } from './entities/prescriptions.entity';
import { Notification } from './entities/notifications.entity';
import { FamilyMember } from './entities/family-member.entity';
import { AppointmentDetails } from './entities/appointment-details.entity';
import { Feedback } from './entities/feedback.entity';
import { Message } from './entities/message.entity';
import { ChatRoom } from './entities/chat-room.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    Client, Doctor, Specialization, Subscription, Appointment, 
    Schedule, Room, MedicalRecord, Payment, Prescription, Notification,FamilyMember,AppointmentDetails,Feedback,Message,ChatRoom
  ])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
