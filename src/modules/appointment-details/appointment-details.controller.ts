// src/appointment-details/appointment-details.controller.ts
import { Controller, Post, Param, Body } from '@nestjs/common';
import { AppointmentDetailsService } from './appointment-details.service';
import { CreateAppointmentDetailsDto } from './dto/create-appointment-detail.dto';
import { CreateAppointmentDetailsResponseDto } from './dto/appointment-detail-response.dto'; // Import your DTO

import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse,ApiParam } from '@nestjs/swagger';

@ApiTags('appointments-details') // Adds "appointments" as a tag in Swagger
@ApiBearerAuth() 
@Controller('appointment-details')
export class AppointmentDetailsController {
  constructor(private readonly appointmentDetailsService: AppointmentDetailsService) {}

  @Post(':appointment_id/:client_id/:family_member_id?')
  @ApiParam({ name: 'appointment_id', description: 'ID of the appointment' })
  @ApiParam({ name: 'client_id', description: 'ID of the client' })
  @ApiParam({ name: 'family_member_id', description: 'ID of the family member (optional)', required: false })
  @ApiOperation({ summary: 'Add appointment details' })
  @ApiResponse({
    status: 201,
    description: 'Appointment details created successfully',
    type: CreateAppointmentDetailsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication token is missing or invalid',
    schema: {
      example: {
        code: 401,
        timestamp: '2024-09-29T04:04:53.034Z',
        message: 'Unauthorized',
      }
    }
  })
  addAppointmentDetails(
    @Param('appointment_id') appointment_id: number,
    @Param('client_id') client_id: number,
    @Param('family_member_id') family_member_id: number,
    @Body() detailsData: CreateAppointmentDetailsDto,
  ) {
    return this.appointmentDetailsService.createAppointmentDetails(
      appointment_id,
      client_id,
      family_member_id,
      detailsData,
    );
  }
}
