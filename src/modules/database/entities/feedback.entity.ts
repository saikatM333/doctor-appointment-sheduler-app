import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Client } from './clients.entity';
import { Doctor } from './doctors.entity';
import { Appointment } from './appointments.entity';
import { Min, Max } from 'class-validator';
@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  feedback_id: number;

  @ManyToOne(() => Client, (client) => client.feedbacks)
  client: Client;

  @ManyToOne(() => Doctor, (doctor) => doctor.feedbacks)
  doctor: Doctor;

  

  @Column('int')
  @Min(1) // Minimum value of 1
  @Max(5)
 rating : number;
 
  @Column('text')
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
