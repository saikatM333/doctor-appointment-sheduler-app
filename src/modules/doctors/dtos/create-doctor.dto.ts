import { Specialization } from 'src/modules/database/entities/specialization.entity';

import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'First name of the doctor',
    example: 'John',
    maxLength: 50,
  })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the doctor',
    example: 'Doe',
    maxLength: 50,
  })
  last_name: string;

  @ApiProperty({
    description: 'Email address of the doctor',
    example: 'john.doe@example.com',
    maxLength: 100,
  })
  email: string;

  @ApiProperty({
    description: 'Phone number of the doctor',
    example: '+1234567890',
    maxLength: 15,
  })
  phone: string;

  @ApiProperty({
    description: 'License number of the doctor',
    example: 'DOC123456789',
  })
  license_number: string;

  @ApiProperty({
    description: 'Consultation fees of the doctor',
    example: 100,
    required: false, // optional field
  })
  fees?: number;

  @ApiProperty({
    description: 'Password for the doctor’s account',
    example: 'securePassword123!',
  })
  password: string;

  @ApiProperty({
    description: 'Specialization of the doctor',
    example: {
      specialization_id: 2,
      name: 'Cardiology',
      description: 'Specializes in diagnosing and treating heart conditions.',
    },
  })
  specialization: Specialization;

  @ApiProperty({
    description: 'Date of doctor’s account creation',
    example: '2023-09-01T12:30:00.000Z',
    required: false, // optional field, as it can be automatically set
  })
  created_at?: Date;
}
