// src/appointment-details/dto/appointment-details.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AppointmentDetailDto {
  @ApiProperty({ example: 5, description: 'ID of the appointment' })
  appointment_id: number;

  @ApiProperty({ example: '2024-10-15', description: 'Date of the appointment' })
  appointment_date: string;

  @ApiProperty({ example: '19:30:00', description: 'Time of the appointment' })
  appointment_time: string;

  @ApiProperty({ example: 'Scheduled', description: 'Status of the appointment' })
  status: string;

  @ApiProperty({ example: 'General check-up', description: 'Reason for the appointment' })
  reason: string;

  @ApiProperty({ example: '2024-09-07T12:28:34.373Z', description: 'Creation timestamp of the appointment' })
  created_at: string;

  @ApiProperty({ example: '2024-09-08T06:13:50.621Z', description: 'Last update timestamp of the appointment' })
  updated_at: string;
}

export class FamilyMemberDto {
  @ApiProperty({ example: 1, description: 'ID of the family member' })
  family_member_id: number;

  @ApiProperty({ example: 'Johny', description: 'First name of the family member' })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the family member' })
  last_name: string;

  @ApiProperty({ example: 'M', description: 'Gender of the family member' })
  gender: string;

  @ApiProperty({ example: '1991-01-01', description: 'Birthdate of the family member' })
  birthdate: string;

  @ApiProperty({ example: 'Brother', description: 'Relation of the family member to the client' })
  relation: string;
}

export class ClientDto {
  @ApiProperty({ example: 1, description: 'Tenant ID of the client' })
  tenant_id: number;

  @ApiProperty({ example: 'John', description: 'First name of the client' })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the client' })
  last_name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the client' })
  email: string;

  @ApiProperty({ example: '1234567890', description: 'Phone number of the client' })
  phone: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z', description: 'Birthdate of the client' })
  birthdate: string;

  @ApiProperty({ example: 'M', description: 'Gender of the client' })
  gender: string;

  @ApiProperty({ example: '123 Main St, Springfield', description: 'Address of the client' })
  address: string;

  @ApiProperty({ example: '$2b$10$tG5UO3OmzXx2TT9yrzoIzupbPzUDWUIfAkoa9Iu6oVVYe4AQbwLhS', description: 'Password hash of the client' })
  password: string;

  @ApiProperty({ example: '2024-09-07T04:43:21.728Z', description: 'Creation timestamp of the client record' })
  created_at: string;
}

export class CreateAppointmentDetailsResponseDto {
  @ApiProperty({ example: 70, description: 'Weight of the client' })
  weight: number;

  @ApiProperty({ example: 'First Time', description: 'Type of the visit' })
  visit_type: string;

  @ApiProperty({ example: 'M', description: 'Sex of the client' })
  sex: string;

  @ApiProperty({ example: 25, description: 'Age of the client' })
  age: number;

  @ApiProperty({ type: AppointmentDetailDto })
  appointment: AppointmentDetailDto;

  @ApiProperty({ type: FamilyMemberDto })
  family_member: FamilyMemberDto;

  @ApiProperty({ type: ClientDto })
  client: ClientDto;

  @ApiProperty({ example: 2, description: 'Details ID' })
  details_id: number;
}
