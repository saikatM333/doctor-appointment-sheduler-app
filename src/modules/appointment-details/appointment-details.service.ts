// src/appointment-details/appointment-details.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentDetails } from '../database/entities/appointment-details.entity';
import { CreateAppointmentDetailsDto } from './dto/create-appointment-detail.dto';
import { Appointment } from '../database/entities/appointments.entity';
import { FamilyMember } from '../database/entities/family-member.entity';
import { Client } from '../database/entities/clients.entity';

@Injectable()
export class AppointmentDetailsService {
  constructor(
    @InjectRepository(AppointmentDetails)
    private appointmentDetailsRepository: Repository<AppointmentDetails>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async createAppointmentDetails(
    appointment_id: number,
    client_id: number,
    family_member_id: number,
    detailsData: CreateAppointmentDetailsDto,
  ) {
    const appointment = await this.appointmentRepository.findOne({ where: { appointment_id } });
    const client = await this.clientRepository.findOne({ where: { tenant_id: client_id } });
    
    let familyMember = null;
    if (family_member_id) {
      familyMember = await this.familyMemberRepository.findOne({ where: { family_member_id } });
    }

    const details = this.appointmentDetailsRepository.create({
      appointment,
      client,
      family_member: familyMember,
      weight: detailsData.weight,
      visit_type: detailsData.visit_type,
      sex: detailsData.sex,
      age: detailsData.age,
    });

    return this.appointmentDetailsRepository.save(details);
  }
}
