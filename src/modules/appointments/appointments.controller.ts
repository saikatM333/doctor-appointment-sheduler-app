// import { Controller, Get, Post, Body, Param, Patch, Delete,HttpException, HttpStatus } from '@nestjs/common';
// import { AppointmentsService } from './appointments.service';
// import { CreateAppointmentDto } from './dtos/create-appointment.dto';
// import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Appointment } from '../database/entities/appointments.entity';
// import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

// @ApiTags('appointments') // Adds "appointments" as a tag in Swagger
// @ApiBearerAuth() 

// @Controller('appointments')
// export class AppointmentsController {
//   constructor(private readonly appointmentsService: AppointmentsService ) {}

//   @Post()
//   async create(@Body() createAppointmentDto : CreateAppointmentDto) {
//     try {
//       const appointment = await this.appointmentsService.createAppointment(createAppointmentDto);
//       return {
//         statusCode: HttpStatus.CREATED,
//         message: 'Appointment created successfully',
//         data: appointment,
//       };
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
//     }
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: number) {
//     return this.appointmentsService.findOne(id);
//   }

//   @Get()
//   async findAll() {
//     return this.appointmentsService.findAll();
//   }

//   @Patch(':id')
//   async update(@Param('id') id: number, @Body() updateAppointmentDto: UpdateAppointmentDto) {
//     return this.appointmentsService.update(id, updateAppointmentDto);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: number) {
//     return this.appointmentsService.remove(id);
//   }
//   // up coming appoint ments for the uers 
//   @Get('upcoming/:tenantId')
//   async getUpcomingAppointments(@Param('tenantId') tenantId: number): Promise<Appointment[]> {
//     return this.appointmentsService.getUpcomingAppointmentsForUser(tenantId);
//   }
// }

import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { Appointment } from '../database/entities/appointments.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
//import { Roles } from '../clerk-auth/roles.decorator'; // Import the Roles decorator
 // Import the RolesGuard

@ApiTags('appointments') // Adds "appointments" as a tag in Swagger
@ApiBearerAuth() 
 // Apply the RolesGuard to the entire controller

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The appointment has been successfully created.',
    schema: {
     example : {
      "statusCode": 201,
      "message": "Appointment created successfully",
      "data": {
          "tenant": {
              "tenant_id": 1,
              "first_name": "John",
              "last_name": "Doe",
              "email": "john.doe@example.com",
              "phone": "1234567890",
              "birthdate": "1990-01-01T00:00:00.000Z",
              "gender": "M",
              "address": "123 Main St, Springfield",
              "password": "$2b$10$tG5UO3OmzXx2TT9yrzoIzupbPzUDWUIfAkoa9Iu6oVVYe4AQbwLhS",
              "created_at": "2024-09-07T04:43:21.728Z"
          },
          "doctor": {
              "doctor_id": 15,
              "first_name": "Bob",
              "last_name": "Johnson",
              "email": "bob.johnson@example.com",
              "phone": "456-789-0123",
              "license_number": "LIC67890",
              "fees": 100,
              "password": "anotherSecurePassword456",
              "created_at": "2024-09-08T11:00:00.000Z"
          },
          "room": null,
          "appointment_date": "2024-10-15T00:00:00.000Z",
          "appointment_time": "11:30",
          "reason": "General check-up",
          "status": "Scheduled",
          "appointment_id": 7,
          "created_at": "2024-09-09T04:56:13.751Z",
          "updated_at": "2024-09-09T04:56:13.751Z"
      }
  },
}
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request', schema : {
    "example" :{
    "code": 400,
    "timestamp": "2024-09-29T04:31:13.618Z",
    "message": "string"
    }
  } })
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
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      const appointment = await this.appointmentsService.createAppointment(createAppointmentDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Appointment created successfully',
        data: appointment,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('nextday')
  @ApiOperation({ summary: 'Create a new appointment for next day if not slot available or day over!' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The appointment has been successfully created.',
    schema: {
      example: {
        "statusCode": 201,
        "message": "Appointment created successfully",
        "data": {
          "tenant": {
            "tenant_id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "1234567890",
            "birthdate": "1990-01-01T00:00:00.000Z",
            "gender": "M",
            "address": "123 Main St, Springfield",
            "password": "$2b$10$tG5UO3OmzXx2TT9yrzoIzupbPzUDWUIfAkoa9Iu6oVVYe4AQbwLhS",
            "created_at": "2024-09-07T04:43:21.728Z"
          },
          "doctor": {
            "doctor_id": 15,
            "first_name": "Bob",
            "last_name": "Johnson",
            "email": "bob.johnson@example.com",
            "phone": "456-789-0123",
            "license_number": "LIC67890",
            "fees": 100,
            "password": "anotherSecurePassword456",
            "created_at": "2024-09-08T11:00:00.000Z"
          },
          "room": null,
          "appointment_date": "2024-10-15T00:00:00.000Z",
          "appointment_time": "11:30",
          "reason": "General check-up",
          "status": "Scheduled",
          "appointment_id": 7,
          "created_at": "2024-09-09T04:56:13.751Z",
          "updated_at": "2024-09-09T04:56:13.751Z"
        }
      },
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' , schema : {
    "example" :{
    "code": 400,
    "timestamp": "2024-09-29T04:31:13.618Z",
    "message": "string"
    }
  } })
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
  async createAppointmentForNextDay(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      const appointment = await this.appointmentsService.nextDayAppointmentBook(createAppointmentDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Appointment created successfully',
        data: appointment,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific appointment by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The appointment details.',
    schema: {
      example: {
        id: 1,
        tenant_id: 2,
        doctor_id: 3,
        appointment_date: '2023-09-15',
        appointment_time: '10:00 AM',
        reason: 'Follow-up consultation',
        status: 'Scheduled',
      },
    },
  })
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
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Appointment not found', schema : {
    "example" :{
    "code": 400,
    "timestamp": "2024-09-29T04:31:13.618Z",
    "message": "string"
    }
  }  })
  async findOne(@Param('id') id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all appointments.',
    schema: {
      example: [
        {
          id: 1,
          tenant_id: 2,
          doctor_id: 3,
          appointment_date: '2023-09-15',
          appointment_time: '10:00 AM',
          reason: 'Follow-up consultation',
          status: 'Scheduled',
        },
        {
          id: 2,
          tenant_id: 4,
          doctor_id: 5,
          appointment_date: '2023-09-20',
          appointment_time: '11:00 AM',
          reason: 'First consultation',
          status: 'Completed',
        },
      ],
    },
  })
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific appointment by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The appointment has been updated.',
    schema: {
      example: {
        id: 1,
        tenant_id: 2,
        doctor_id: 3,
        appointment_date: '2023-09-15',
        appointment_time: '10:00 AM',
        reason: 'Follow-up consultation',
        status: 'Cancelled',
      },
    },
  })
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
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Appointment not found', schema : {
    "example" :{
    "code": 400,
    "timestamp": "2024-09-29T04:31:13.618Z",
    "message": "string"
    }
  } })
  async update(@Param('id') id: number, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific appointment by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The appointment has been deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Appointment not found' })
  async remove(@Param('id') id: number) {
    return this.appointmentsService.remove(id);
  }
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

  @Get('upcoming/:tenantId')
  @ApiOperation({ summary: 'Get upcoming appointments for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of upcoming appointments.',
    schema: {
      example: [
        {
            "appointment_id": 3,
            "appointment_date": "2024-10-15",
            "appointment_time": "11:30:00",
            "status": "Scheduled",
            "reason": "General check-up",
            "created_at": "2024-09-07T12:13:14.936Z",
            "updated_at": "2024-09-07T12:13:14.936Z",
            "doctor": {
                "doctor_id": 15,
                "first_name": "Bob",
                "last_name": "Johnson",
                "email": "bob.johnson@example.com",
                "phone": "456-789-0123",
                "license_number": "LIC67890",
                "fees": 100,
                "password": "anotherSecurePassword456",
                "created_at": "2024-09-08T11:00:00.000Z"
            },
            "room": null
        },
      ]
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No upcoming appointments found for this tenant' })
  async getUpcomingAppointments(@Param('tenantId') tenantId: number): Promise<Appointment[]> {
    return this.appointmentsService.getUpcomingAppointmentsForUser(tenantId);
  }


}
