import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './clients.entity';
import { Doctor } from './doctors.entity';
import { Message } from './message.entity';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.chatRooms)
  client: Client;

  @ManyToOne(() => Doctor, (doctor) => doctor.chatRooms)
  doctor: Doctor;
  
  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
