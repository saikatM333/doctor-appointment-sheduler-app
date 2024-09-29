import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Appointment } from './appointments.entity';
import { Client } from './clients.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.payments)
  appointment: Appointment;

  @ManyToOne(() => Client, (client) => client.payments)
  tenant: Client;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['Cash', 'Card'] })
  payment_method: string;

  @CreateDateColumn()
  payment_date: Date;
}
