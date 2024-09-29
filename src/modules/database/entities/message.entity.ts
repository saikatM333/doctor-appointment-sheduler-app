import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Client } from './clients.entity';
import { Doctor } from './doctors.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Client, (client) => client.messages, { nullable: true })
  client: Client;

  @ManyToOne(() => Doctor, (doctor) => doctor.messages, { nullable: true })
  doctor: Doctor;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, { onDelete: 'CASCADE' })
  chatRoom: ChatRoom;

  @CreateDateColumn()
  created_at: Date;
}
