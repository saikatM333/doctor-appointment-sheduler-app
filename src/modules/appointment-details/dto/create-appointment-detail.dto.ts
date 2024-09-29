// src/appointment-details/dto/create-appointment-details.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDetailsDto {
  @ApiProperty({ description: 'Weight of the patient', example: 70 })
  @IsNotEmpty()
  @IsInt()
  weight: number;

  @ApiProperty({ description: 'Visit Type', enum: ['First Time', 'Report', 'Follow Up'], example: 'First Time' })
  @IsNotEmpty()
  @IsEnum(['First Time', 'Report', 'Follow Up'])
  visit_type: string;

  @ApiProperty({ description: 'Sex of the patient', enum: ['M', 'F', 'O'], example: 'M' })
  @IsNotEmpty()
  @IsEnum(['M', 'F', 'O'])
  sex: string;

  @ApiProperty({ description: 'Age of the patient', example: 25 })
  @IsNotEmpty()
  @IsInt()
  age: number;
}
