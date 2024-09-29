import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Client } from './clients.entity';
import { Doctor } from './doctors.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  subscription_id: number;

  @ManyToOne(() => Client, (client) => client.subscriptions)
  tenant: Client;

  @ManyToOne(() => Doctor, (doctor) => doctor.subscriptions)
  doctor: Doctor;

  @Column({ type: 'enum', enum: ['Active', 'Inactive'] })
  subscription_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
