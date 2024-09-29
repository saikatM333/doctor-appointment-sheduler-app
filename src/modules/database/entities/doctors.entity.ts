// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
// import { Specialization } from './specialization.entity';

// @Entity('doctors')
// export class Doctor {
//   @PrimaryGeneratedColumn()
//   doctor_id: number;

//   @Column({ length: 50 })
//   first_name: string;

//   @Column({ length: 50 })
//   last_name: string;

//   @Column({ length: 100 })
//   email: string;

//   @Column({ length: 15 })
//   phone: string;

//   @Column({ length: 50 })
//   license_number: string;

//   @ManyToOne(() => Specialization, (specialization) => specialization.doctors)
//   specialization: Specialization;

//   @CreateDateColumn()
//   created_at: Date;
// }
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Specialization } from './specialization.entity';
import { Appointment } from './appointments.entity';
import { MedicalRecord } from './medical-records.entity';
import { Schedule } from './schedules.entity';
import { Subscription } from './subscription.entity';
import { Notification } from './notifications.entity';
import { Feedback } from './feedback.entity';
import { ChatRoom } from './chat-room.entity';
import { Message } from './message.entity';
@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  doctor_id: number;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ default: 'Active' })
  status: string;

  @Column({ length: 15 })
  phone: string;

  @Column({ length: 50 })
  license_number: string;

  @Column({default: 100})
  fees : number

  @Column()
  password : string 

  @ManyToOne(() => Specialization, (specialization) => specialization.doctors)
  specialization: Specialization;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.doctor)
  medical_records: MedicalRecord[];

  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedules: Schedule[];

  @OneToMany(() => Subscription, (subscription) => subscription.doctor)
  subscriptions: Subscription[];

  @OneToMany(() => Notification, (notification) => notification.doctor)
  notifications: Notification[];
  @OneToMany(() => Feedback, (feedback) => feedback.doctor)
feedbacks: Feedback[];

@OneToMany(() => ChatRoom, (chatRoom) => chatRoom.doctor)
chatRooms: ChatRoom[];

@OneToMany(() => Message, (message) => message.doctor)
messages: Message[];

  @CreateDateColumn()
  created_at: Date;
}
