// // import { IsEmail, IsString, IsStrongPassword, Min } from "class-validator";

// // export class RegisterDto {

// //   @IsString()
// //   @Min(3)
// //   username: string;

// //   @IsEmail()
// //   email: string;

// //   @IsStrongPassword({ minLength: 8 })
// //   password: string;
// // }

// import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsDateString } from 'class-validator';

// export class RegisterDto {
//   @IsNotEmpty()
//   @IsString()
//   first_name: string;

//   @IsNotEmpty()
//   @IsString()
//   last_name: string;

//   @IsNotEmpty()
//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   @MinLength(8)
//   password: string;

//   @IsNotEmpty()
//   @IsString()
//   phone: string;

//   @IsNotEmpty()
//   @IsDateString()
//   birthdate: Date;

//   @IsNotEmpty()
//   @IsEnum(['M', 'F', 'O'])
//   gender: string;

//   @IsNotEmpty()
//   @IsString()
//   address: string;
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsDateString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user.',
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user.',
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user, with a minimum length of 8 characters.',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user.',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: '1990-05-20',
    description: 'The birthdate of the user in YYYY-MM-DD format.',
  })
  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  @ApiProperty({
    example: 'M',
    description: 'The gender of the user, either M (Male), F (Female), or O (Other).',
  })
  @IsNotEmpty()
  @IsEnum(['M', 'F', 'O'])
  gender: string;

  @ApiProperty({
    example: '123 Main Street, City, Country',
    description: 'The address of the user.',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
