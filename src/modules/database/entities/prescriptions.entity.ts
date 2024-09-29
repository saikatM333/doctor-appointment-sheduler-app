import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Appointment } from './appointments.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  prescription_id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.prescriptions)
  appointment: Appointment;

  @Column('text')
  medication: string;

  @Column('text')
  dosage: string;

  @CreateDateColumn()
  issued_at: Date;
}
