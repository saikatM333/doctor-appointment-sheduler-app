// src/dto/create-family-member.dto.ts
import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFamilyMemberDto {
  @ApiProperty({
    description: 'First name of the family member',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Last name of the family member',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Gender of the family member',
    enum: ['M', 'F', 'O'],
    example: 'M',
  })
  @IsEnum(['M', 'F', 'O'])
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: 'Birthdate of the family member in ISO 8601 format',
    example: '1990-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  birthdate: Date;

  @ApiProperty({
    description: 'Relationship to the client',
    example: 'Brother',
  })
  @IsString()
  @IsNotEmpty()
  relation: string;
}
