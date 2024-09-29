import { Injectable, UnauthorizedException ,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../database/entities/feedback.entity';
import { Client } from '../database/entities/clients.entity';
import { Doctor } from '../database/entities/doctors.entity';
import { Appointment } from '../database/entities/appointments.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private readonly  feedbackRepository: Repository<Feedback>,
        // @InjectRepository(Client)
        // private clientRepository: Repository<Client>,
        // @InjectRepository(Doctor)
        // private doctorRepository: Repository<Doctor>,
         @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,
        
      ) {}

      async createFeedback(clientId: number, doctorId: number, createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
        const appointment = await this.appointmentRepository.findOne({
            where: { tenant: { tenant_id: clientId }, doctor: { doctor_id: doctorId } },
          });
      
          if (!appointment) {
            throw new UnauthorizedException('You cannot give feedback for a doctor you have no appointments with.');
          }

        //   const currentDate = new Date();
        //   if (currentDate < appointment.appointment_date) {
        //     throw new BadRequestException('You cannot give feedback before the appointment date.');
        //   }
        
        // Create feedback
        const feedback = this.feedbackRepository.create({
          client: { tenant_id: clientId },
          doctor: { doctor_id: doctorId },
          rating : createFeedbackDto.rating,
          comment: createFeedbackDto.comment,
        });
    
        return this.feedbackRepository.save(feedback);
      }
      async getFeedbackByDoctor(doctorId: number): Promise<Feedback[]> {
        return this.feedbackRepository.find({
          where: { doctor: { doctor_id: doctorId } },
          relations: ['client'],
        });
      }
}
