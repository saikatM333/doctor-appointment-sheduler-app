import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './doctors.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules)
  doctor: Doctor;

  @Column({ type: 'enum', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] })
  day_of_week: string;

  @Column('time')
  start_time: string;

  @Column('time')
  end_time: string;
}
