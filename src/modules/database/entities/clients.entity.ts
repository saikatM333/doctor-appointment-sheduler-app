// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// @Entity('clients')
// export class Client {
//   @PrimaryGeneratedColumn()
//   tenant_id: number;

//   @Column({ length: 50 })
//   first_name: string;

//   @Column({ length: 50 })
//   last_name: string;

//   @Column({ length: 100 })
//   email: string;

//   @Column({ length: 15 })
//   phone: string;

//   @Column()
//   birthdate: Date;

//   @Column({ type: 'enum', enum: ['M', 'F', 'O'] })
//   gender: string;

//   @Column('text')
//   address: string;

//   @CreateDateColumn()
//   created_at: Date;
// }


import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Appointment } from './appointments.entity';
import { MedicalRecord } from './medical-records.entity';
import { Payment } from './payments.entity';
import { Subscription } from './subscription.entity';
import { FamilyMember } from './family-member.entity';
import { Notification } from './notifications.entity';
import { Feedback } from './feedback.entity';
import { ChatRoom } from './chat-room.entity';
import { Message } from './message.entity';
@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  tenant_id: number;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 15 })
  phone: string;

  @Column()
  birthdate: Date;

  @Column({ type: 'enum', enum: ['M', 'F', 'O'] })
  gender: string;

  @Column('text')
  address: string;

  @Column()
  password : string ;

  @OneToMany(() => Appointment, (appointment) => appointment.tenant)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.client)
  medical_records: MedicalRecord[];

  @OneToMany(() => Payment, (payment) => payment.tenant)
  payments: Payment[];

  @OneToMany(() => Subscription, (subscription) => subscription.tenant)
  subscriptions: Subscription[];

  @OneToMany(() => FamilyMember, (familyMember) => familyMember.client)
  family_members: FamilyMember[];
  
  @OneToMany(() => Notification, (notification) => notification.client)
  notifications: Notification[];

  @OneToMany(() => Feedback, (feedback) => feedback.client)
feedbacks: Feedback[];

@OneToMany(() => ChatRoom, (chatRoom) => chatRoom.doctor)
chatRooms: ChatRoom[];

@OneToMany(() => Message, (message) => message.client)
messages: Message[];
  @CreateDateColumn()
  created_at: Date;
}

