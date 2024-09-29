import { IsString, IsDateString, IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FamilyMemberDto {
  
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the family member',
  })
  @IsInt()
  family_member_id: number;

  @ApiProperty({
    example: 'Johny',
    description: 'The first name of the family member',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the family member',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    example: 'M',
    description: 'The gender of the family member',
  })
  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  @ApiProperty({
    example: '1991-01-01',
    description: 'The birthdate of the family member in YYYY-MM-DD format',
  })
  @IsDateString()
  birthdate: string;

  @ApiProperty({
    example: 'Brother',
    description: 'The relation of the family member to the client',
  })
  @IsString()
  relation: string;
}


// export class FamilyMemberResponseDto {
//   @ApiProperty({
//     type: [FamilyMemberDto],
//     description: 'List of family members for a client',
//   })
//   familyMembers: FamilyMemberDto[];
// }
