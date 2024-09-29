import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Client } from './clients.entity';
import { Doctor } from './doctors.entity';
import { Appointment } from './appointments.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @ManyToOne(() => Doctor, { nullable: true })
  doctor: Doctor;

  @ManyToOne(() => Client, { nullable: true })
  client: Client;

  // @ManyToOne(() => Appointment, { nullable: true })
  // appointment: Appointment;
  @Column({ type: 'int', nullable: true })
  appointment_id: number; // Link to the appointment if relevant

  @Column({ type: 'enum', enum: ['created', 'updated', 'deleted', 'reminder'], default: 'created' })
  notification_type: 'created' | 'updated' | 'deleted' | 'reminder';

  @Column('text')
  message: string;

  @CreateDateColumn()
  sent_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  read_status: boolean;
}
