import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMember } from '../database/entities/family-member.entity';
import { Client } from '../database/entities/clients.entity';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';

@Injectable()
export class FamilyMemberService {
  constructor(
    @InjectRepository(FamilyMember)
    private readonly familyMemberRepository: Repository<FamilyMember>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createFamilyMember(clientId: number, familyMemberData: CreateFamilyMemberDto) {
    const client = await this.clientRepository.findOne({ where: { tenant_id: clientId } });

    if (!client) {
      throw new Error('Client not found');
    }

    const familyMember = this.familyMemberRepository.create({
      ...familyMemberData,
      client,
    });

    return await this.familyMemberRepository.save(familyMember);
  }

  async getFamilyMembers(clientId: number) {
    return await this.familyMemberRepository.find({ where: { client: { tenant_id: clientId } } });
  }

  async getFamilyMemberDetails(clientId: number, familyMemberId: number) {
    return await this.familyMemberRepository.findOne({
      where: { client: { tenant_id: clientId }, family_member_id: familyMemberId },
    });
  }
}
