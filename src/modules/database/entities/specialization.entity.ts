
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Doctor } from './doctors.entity';

@Entity('specializations')
export class Specialization {
  @PrimaryGeneratedColumn()
  specialization_id: number;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @OneToMany(() => Doctor, (doctor) => doctor.specialization)
  doctors: Doctor[];
}
