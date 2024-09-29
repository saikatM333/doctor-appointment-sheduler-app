import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  
  @ApiProperty({
    example: 1,
    description: 'The ID of the tenant making the appointment',
  })
  tenant_id: number;

  @ApiProperty({
    example: 2,
    description: 'The ID of the doctor for the appointment',
  })
  doctor_id: number;

  @ApiProperty({
    example: '2023-09-15',
    description: 'The date of the appointment in YYYY-MM-DD format',
  })
  appointment_date: string;

  @ApiProperty({
    example: '10:00',
    description: 'The time of the appointment in HH:MM AM/PM format',
  })
  appointment_time: string;

  @ApiProperty({
    example: 'Follow-up consultation',
    description: 'The reason for the appointment',
  })
  reason: string;

  @ApiProperty({
    example: 'Scheduled',
    enum: ['Scheduled', 'Cancelled', 'Completed'],
    description: 'The status of the appointment',
  })
  status: 'Scheduled' | 'Cancelled' | 'Completed';
}
