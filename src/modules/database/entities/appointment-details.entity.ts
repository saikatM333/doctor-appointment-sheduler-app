// src/entities/appointment-details.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Appointment } from './appointments.entity';
import { FamilyMember } from './family-member.entity';
import { Client } from './clients.entity';

@Entity('appointment_details')
export class AppointmentDetails {
  @PrimaryGeneratedColumn()
  details_id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.details)
  appointment: Appointment;

  @ManyToOne(() => FamilyMember, { nullable: true })
  family_member: FamilyMember;

  @ManyToOne(() => Client)
  client: Client;

  @Column('int')
  weight: number;

  @Column({ type: 'enum', enum: ['First Time', 'Report', 'Follow Up'] })
  visit_type: string;

  @Column({ type: 'enum', enum: ['M', 'F', 'O'] })
  sex: string;

  @Column('int')
  age: number;
}
