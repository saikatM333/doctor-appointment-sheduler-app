import { Controller, Get, Post, Body, Param, Patch, Delete, SetMetadata } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { Doctor } from '../database/entities/doctors.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('doctor') // Adds "appointments" as a tag in Swagger
@ApiBearerAuth() 
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  // creating the doctor
  @SetMetadata('public', true) // Mark the route as public
  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({
    status: 201,
    description: 'The doctor has been successfully created.',
    schema: {
      example: {
        doctor_id: 15,
        first_name: 'Bob',
        last_name: 'Johnson',
        email: '',
        phone: '',
        license_number: '',
        fees: 100,
        password: '',
        created_at: '2024-09-08T11:00:00.000Z',
        specialization: {
          specialization_id: 2,
          name: 'Cardiology',
          description: 'Specializes in diagnosing and treating heart conditions.',
        },
        schedules: []
      },
    },
  })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  // getting detials 
  @Get(':id')
  @ApiOperation({ summary: 'Get doctor details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns doctor details',
    schema: {
      example: {
        doctor_id: 15,
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob.johnson@example.com',
        phone: '456-789-0123',
        license_number: 'LIC67890',
        fees: 100,
        password: 'anotherSecurePassword456',
        created_at: '2024-09-08T11:00:00.000Z',
        specialization: {
          specialization_id: 2,
          name: 'Cardiology',
          description: 'Specializes in diagnosing and treating heart conditions.',
        },
        schedules: [
          {
            schedule_id: 1,
            day_of_week: 'Monday',
            start_time: '09:00:00',
            end_time: '10:00:00',
          },
          
        ],
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.doctorsService.findOne(id);
  }
  // listing all the doctors 
  @Get()
  @ApiOperation({ summary: 'List all doctors' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all doctors',
    schema: {
      example: [
        {
          doctor_id: 13,
          first_name: 'Alice',
          last_name: 'Williams',
          email: 'alice.williams@example.com',
          phone: '321-654-9870',
          license_number: 'LIC12345',
          fees: 100,
          password: 'securePassword123',
          created_at: '2024-09-07T10:30:00.000Z',
        },
        {
          doctor_id: 15,
          first_name: 'Bob',
          last_name: 'Johnson',
          email: 'bob.johnson@example.com',
          phone: '456-789-0123',
          license_number: 'LIC67890',
          fees: 100,
          password: 'anotherSecurePassword456',
          created_at: '2024-09-08T11:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.doctorsService.findAll();
  }

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
  //   return this.doctorsService.update(id, updateDoctorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.doctorsService.remove(id);
  // }

//   @Get(':id')
//   async getDoctorDetails(@Param('id') id: number): Promise<Doctor> {
//     return await this.doctorsService.getDoctorDetails(id);
//   }

@Patch(':doctorId/inactive')
@ApiOperation({ summary: 'doctor want to change it status to inactive for the current day' })
@ApiResponse({
  status: 200,
  description: 'Marks the doctor as inactive',
  type: Doctor,
})
@ApiResponse({
  status: 404,
  description: 'Doctor not found',
})
  async getAvailableSlots(
    @Param('doctorId') doctorId: number,
    @Body('status') status: string,
  ): Promise<Doctor> {
    return this.doctorsService.markAsInactive(doctorId);
  }

@Patch(':doctorId/imergencyleave')
@ApiOperation({ summary: 'doctor wants a imergency leave due to any reason' })
@ApiResponse({
  status: 200,
  description: 'Marks the doctor as on emergency leave',
  type: Doctor,
})
@ApiResponse({
  status: 404,
  description: 'Doctor not found',
})
async imergencyleave(
@Param('doctorId') doctorId : number

):Promise<Doctor>{
  return await this.doctorsService.updateDoctorStatus(doctorId,'urgentLeave');
}
}
