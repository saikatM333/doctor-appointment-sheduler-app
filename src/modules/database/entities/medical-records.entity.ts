import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Client } from './clients.entity';
import { Doctor } from './doctors.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  record_id: number;

  @ManyToOne(() => Client, (client) => client.medical_records)
  client: Client;

  @ManyToOne(() => Doctor, (doctor) => doctor.medical_records)
  doctor: Doctor;

  @Column('text')
  diagnosis: string;

  @Column('text')
  treatment: string;

  @CreateDateColumn()
  recorded_at: Date;
}
