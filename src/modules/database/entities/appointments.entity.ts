import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Client } from './clients.entity';
import { Doctor } from './doctors.entity';
import { Room } from './rooms.entity';
import { Payment } from './payments.entity';
import { Prescription } from './prescriptions.entity';
import { AppointmentDetails } from './appointment-details.entity';
import { Notification } from './notifications.entity';
@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @ManyToOne(() => Client, (client) => client.appointments)
  tenant: Client;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;

  @ManyToOne(() => Room, (room) => room.appointments)
  room: Room;

  @OneToMany(() => Payment, (payment) => payment.appointment)
payments: Payment[];

@OneToMany(() => Prescription, (prescription) => prescription.appointment)
  prescriptions: Prescription[];

  @OneToMany(() => AppointmentDetails, (details) => details.appointment)
  details: AppointmentDetails[];

  // @OneToMany(() => Notification, (notification) => notification.appointment)
  // notifications: Notification[];
  @Column('date')
  appointment_date: Date;

  @Column('time')
  appointment_time: string;

  @Column({ type: 'timestamp', nullable: true })
  reminder_time: Date

  @Column({ type: 'enum', enum: ['Scheduled', 'Cancelled', 'Completed', 'rescheduled'] })
  status: string;

  @Column('text')
  reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
