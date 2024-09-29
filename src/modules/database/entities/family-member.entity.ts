// src/entities/family-member.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from './clients.entity';

@Entity('family_members')
export class FamilyMember {
  @PrimaryGeneratedColumn()
  family_member_id: number;

  @ManyToOne(() => Client, (client) => client.family_members)
  client: Client;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ type: 'enum', enum: ['M', 'F', 'O'] })
  gender: string;

  @Column('date')
  birthdate: Date;

  @Column('text')
  relation: string;
}
