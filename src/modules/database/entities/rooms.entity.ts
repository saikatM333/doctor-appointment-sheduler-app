import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from './appointments.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column({ length: 50 })
  room_name: string;

  @Column('text')
  location: string;

  @OneToMany(() => Appointment, (appointment) => appointment.room)
  appointments: Appointment[];
}
