import { IsInt, Min, Max, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Rating of the appointment, must be between 1 and 5',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Feedback comment for the appointment',
    example: 'The doctor was very professional and helpful.',
  })
  @IsString()
  comment: string;
}

